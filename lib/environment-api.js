// lib/environment-api.js — Environment-Aware Memory Query
// "For problem X with environment Y, what known fixes exist?"
// Matches by breakage pattern + environment signature.

const resolveCache = require('./resolve-cache');
const converter = require('./reality-to-eval');

// Known environment dimensions
const ENV_SIGNALS = {
  docker: { patterns: [/docker/, /compose/, /container/], tags: ['docker'] },
  npm: { patterns: [/npm/, /node/, /yarn/, /pnpm/], tags: ['npm', 'node'] },
  pip: { patterns: [/pip/, /python/, /requirements\.txt/], tags: ['pip', 'python'] },
  rust: { patterns: [/cargo/, /rustc/, /rust/], tags: ['rust', 'cargo'] },
  node_version: { patterns: [/node (20|18|16|14|22)/, /node version/], tags: ['env:node'] },
  os: { patterns: [/ubuntu/, /macos/, /windows/, /linux/, /alpine/], tags: ['env:os'] },
};

// Detect environment from text
function detectEnvironment(text) {
  const envs = [];
  const lower = (text || '').toLowerCase();
  for (const [key, sig] of Object.entries(ENV_SIGNALS)) {
    if (sig.patterns.some(p => p.test(lower))) envs.push(key);
  }
  return envs;
}

// Score memory relevance to query + environment
function scoreRelevance(hint, query, envs) {
  let score = 0;
  const qLower = query.toLowerCase();
  const hText = (hint.summary || hint.solution || '').toLowerCase();
  const hTags = hint.tags || [];
  const hPatterns = hint.breakage_patterns || [];
  const hEnv = hint.environment || '';

  // Direct keyword match (strongest signal)
  const queryWords = qLower.split(/\s+/).filter(w => w.length > 3);
  const wordMatches = queryWords.filter(w => hText.includes(w)).length;
  score += wordMatches * 3;

  // Tag overlap
  const envTags = new Set(envs.flatMap(e => ENV_SIGNALS[e]?.tags || []));
  const tagOverlap = [...hTags].filter(t => envTags.has(t)).length;
  score += tagOverlap * 2;

  // Category match
  if (hint.category && query.includes(hint.category.toLowerCase())) score += 2;

  // Breakage pattern match
  const patternMatch = hPatterns.some(p => query.includes(p.replace(/_/g, ' ')) || query.includes(p));
  if (patternMatch) score += 3;

  // Environment match
  const envLower = hEnv.toLowerCase();
  if (envs.some(e => envLower.includes(e))) score += 2;

  // Score bonus for verified hints
  if (hint.verification_tier === 'production_confirmed') score += 2;
  if (hint.verification_tier === 'sandbox_passed') score += 1;

  // Decay by status
  if (hint.status === 'quarantined') score -= 5;
  if (hint.status === 'blacklisted') score -= 10;

  return Math.max(0, score);
}

// Main query function
function query({ problem, environment, limit = 5 }) {
  const queryText = (problem || '') + ' ' + (environment || '');
  const envs = detectEnvironment(queryText);

  const allHints = resolveCache.getAllHints();
  const scored = [];

  for (const [id, hint] of Object.entries(allHints)) {
    if (hint.status === 'blacklisted') continue;
    const relevance = scoreRelevance(hint, queryText, envs);
    if (relevance > 0) {
      scored.push({
        id,
        summary: (hint.summary || hint.solution || '').slice(0, 300),
        score: relevance,
        base_score: hint.score ?? 0.9,
        verification_tier: hint.verification_tier || 'unknown',
        status: hint.status || 'active',
        category: hint.category || 'unknown',
        tags: (hint.tags || []).slice(0, 5),
        breakage_patterns: hint.breakage_patterns || [],
        environment: hint.environment || '',
        source: hint.source || 'unknown',
        source_url: hint.source_url || '',
      });
    }
  }

  // Sort by relevance score descending
  scored.sort((a, b) => b.score - a.score);

  return {
    query: problem,
    detected_environment: envs,
    total_matches: scored.length,
    results: scored.slice(0, limit),
  };
}

// Per-environment summary
function getEnvironmentSummary() {
  const allHints = resolveCache.getAllHints();
  const byEnv = {};

  for (const hint of Object.values(allHints)) {
    const env = hint.environment || hint.category || 'unknown';
    if (!byEnv[env]) byEnv[env] = { count: 0, with_fix: 0, patterns: new Set() };
    byEnv[env].count++;
    if (hint.summary || hint.solution) byEnv[env].with_fix++;
    for (const p of (hint.breakage_patterns || [])) byEnv[env].patterns.add(p);
  }

  return Object.entries(byEnv).map(([env, data]) => ({
    environment: env,
    total_seeds: data.count,
    with_fix: data.with_fix,
    breakage_patterns: [...data.patterns],
  })).sort((a, b) => b.total_seeds - a.total_seeds);
}

module.exports = { query, getEnvironmentSummary, detectEnvironment, scoreRelevance };
