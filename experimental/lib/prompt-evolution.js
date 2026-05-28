// lib/prompt-evolution.js — Prompt variant A/B testing and evolution
// Automatically tracks prompt variant performance, prunes losers, promotes winners

const fs = require('fs');
const path = require('path');

const PROMPTS_PATH = path.join(__dirname, '..', 'data', 'prompt-variants.json');

// Default prompt variants per agent profile
const DEFAULT_VARIANTS = {
  'resolver-fast': {
    v1: { instructions: 'Speed priority. Use the hint if available. Submit quickly.', temperature: 0.8, max_hints: 1, verification: false },
    v2: { instructions: 'Fast resolution. Skip verification. Direct answer preferred.', temperature: 0.9, max_hints: 1, verification: false },
    v3: { instructions: 'Minimal reasoning. Use cache hint and submit immediately.', temperature: 0.7, max_hints: 2, verification: false },
  },
  'resolver-careful': {
    v1: { instructions: 'Accuracy priority. Verify hints before use. Check reasoning provenance.', temperature: 0.2, max_hints: 5, verification: true },
    v2: { instructions: 'Thorough verification. Cross-reference multiple hints when available.', temperature: 0.1, max_hints: 4, verification: true },
    v3: { instructions: 'Deep reasoning. Trace hint lineage. Only use high-confidence hints.', temperature: 0.3, max_hints: 3, verification: true },
  },
  'resolver-skeptic': {
    v1: { instructions: 'Hints may be stale or incorrect. Verify before using. Prefer evidence from current task logs.', temperature: 0.3, max_hints: 3, verification: true, ignore_low_score: true },
    v2: { instructions: 'Assume hints are potentially wrong. Cross-check with reasoning cache. Reject low-score hints.', temperature: 0.2, max_hints: 2, verification: true, ignore_low_score: true },
    v3: { instructions: 'Critical evaluation. Score each hint. If score < 0.5, ignore. Generate own solution.', temperature: 0.4, max_hints: 4, verification: true, ignore_low_score: true },
  },
  'resolver-minimal': {
    v1: { instructions: 'No memory. Resolve from scratch. Do not consult hints.', temperature: 0.5, max_hints: 0, verification: false },
    v2: { instructions: 'Baseline only. Independent reasoning without cache.', temperature: 0.6, max_hints: 0, verification: false },
  },
};

function load() {
  try {
    if (fs.existsSync(PROMPTS_PATH)) {
      return JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));
    }
  } catch (e) { console.error('[prompt-evolution] Load error:', e.message); }
  return { variants: {}, history: [], updated_at: null };
}

function save(data) {
  try {
    const dir = path.dirname(PROMPTS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PROMPTS_PATH, JSON.stringify(data, null, 2));
  } catch (e) { console.error('[prompt-evolution] Save error:', e.message); }
}

/** Initialize defaults if not set */
function initDefaults(agentId) {
  const data = load();
  const defaults = DEFAULT_VARIANTS[agentId];
  if (!defaults) return;
  if (!data.variants[agentId]) data.variants[agentId] = {};
  for (const [name, cfg] of Object.entries(defaults)) {
    if (!data.variants[agentId][name]) {
      data.variants[agentId][name] = {
        ...cfg,
        name, wins: 0, losses: 0, uses: 0,
        hallucination_count: 0, token_total: 0, speed_total: 0,
        citation_count: 0, success_count: 0, failure_count: 0,
        created_at: new Date().toISOString(),
        last_used: null,
        active: true,
      };
    }
  }
  save(data);
}

/** Record an outcome against a prompt variant */
function recordOutcome(agentId, variantName, outcome) {
  const data = load();
  const v = data.variants[agentId]?.[variantName];
  if (!v) return;

  v.uses++;
  v.last_used = new Date().toISOString();
  if (outcome.success) { v.wins++; v.success_count++; }
  else { v.losses++; v.failure_count++; }
  if (outcome.tokens_used) v.token_total += outcome.tokens_used;
  if (outcome.duration_ms) v.speed_total += outcome.duration_ms;
  if (outcome.cited) v.citation_count++;
  if (outcome.hallucinated) v.hallucination_count++;

  // Update derived stats
  v.success_rate = v.uses > 0 ? Math.round((v.success_count / v.uses) * 10000) / 100 : 0;
  v.avg_tokens = v.uses > 0 ? Math.round(v.token_total / v.uses) : 0;
  v.avg_speed_ms = v.uses > 0 ? Math.round(v.speed_total / v.uses) : 0;
  v.citation_rate = v.uses > 0 ? Math.round((v.citation_count / v.uses) * 10000) / 100 : 0;
  v.hallucination_rate = v.uses > 0 ? Math.round((v.hallucination_count / v.uses) * 10000) / 100 : 0;

  save(data);
}

/** Get the best performing variant for an agent */
function getBestVariant(agentId) {
  const data = load();
  const variants = data.variants[agentId];
  if (!variants) return null;

  const active = Object.values(variants).filter(v => v.active && v.uses >= 3);
  if (active.length === 0) {
    // Not enough data — return first active variant
    const any = Object.values(variants).find(v => v.active);
    return any || null;
  }

  // Score: success_rate * 0.5 + citation_rate * 0.2 - hallucination_rate * 0.2 - avg_tokens_norm * 0.1
  const maxTokens = Math.max(...active.map(v => v.avg_tokens || 1), 1);
  active.forEach(v => {
    v.meta_score = Math.round((
      (v.success_rate || 0) * 0.5 +
      (v.citation_rate || 0) * 0.2 -
      (v.hallucination_rate || 0) * 0.2 -
      ((v.avg_tokens || 1000) / maxTokens) * 0.1
    ) * 100) / 100;
  });

  active.sort((a, b) => b.meta_score - a.meta_score);
  return active[0];
}

/** Auto-prune: deactivate variants that consistently underperform */
function autoPrune(agentId, minUses = 5) {
  const data = load();
  const variants = data.variants[agentId];
  if (!variants) return { pruned: 0 };

  const active = Object.values(variants).filter(v => v.active && v.uses >= minUses);
  if (active.length < 2) return { pruned: 0 };

  const best = getBestVariant(agentId);
  if (!best) return { pruned: 0 };

  let pruned = 0;
  for (const v of active) {
    if (v.name === best.name) continue;
    if (v.success_rate < best.success_rate * 0.5 && v.uses >= minUses) {
      v.active = false;
      v.pruned_at = new Date().toISOString();
      v.prune_reason = `success_rate ${v.success_rate}% < 50% of best (${best.success_rate}%)`;
      pruned++;
    }
  }

  if (pruned > 0) save(data);
  return { pruned, best_variant: best.name, best_score: best.meta_score };
}

/** Get full stats for all prompt variants */
function getStats(agentId) {
  const data = load();
  if (agentId) return data.variants[agentId] || null;
  return data.variants;
}

/** Generate a new variant by mutating an existing one */
function mutateVariant(agentId, baseVariantName, mutationType) {
  const data = load();
  const base = data.variants[agentId]?.[baseVariantName];
  if (!base) return null;

  const mutations = {
    'increase_temp': { ...base, temperature: Math.min(1, (base.temperature || 0.5) + 0.2), name: `${baseVariantName}-temp+` },
    'decrease_temp': { ...base, temperature: Math.max(0, (base.temperature || 0.5) - 0.2), name: `${baseVariantName}-temp-` },
    'more_hints': { ...base, max_hints: (base.max_hints || 0) + 1, name: `${baseVariantName}-hints+` },
    'less_hints': { ...base, max_hints: Math.max(0, (base.max_hints || 0) - 1), name: `${baseVariantName}-hints-` },
    'verify_on': { ...base, verification: true, name: `${baseVariantName}-verify` },
    'verify_off': { ...base, verification: false, name: `${baseVariantName}-noverify` },
  };

  const newVariant = mutations[mutationType];
  if (!newVariant) return null;

  const newName = newVariant.name;
  if (data.variants[agentId]?.[newName]) return null; // Already exists

  if (!data.variants[agentId]) data.variants[agentId] = {};
  data.variants[agentId][newName] = {
    ...newVariant,
    wins: 0, losses: 0, uses: 0,
    hallucination_count: 0, token_total: 0, speed_total: 0,
    citation_count: 0, success_count: 0, failure_count: 0,
    created_at: new Date().toISOString(),
    last_used: null,
    active: true,
    parent: baseVariantName,
    mutation_type: mutationType,
  };

  save(data);
  return newName;
}

module.exports = {
  initDefaults, recordOutcome, getBestVariant, autoPrune, getStats, mutateVariant,
  DEFAULT_VARIANTS,
};