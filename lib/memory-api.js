// lib/memory-api.js — Minimal consumer-facing memory API
// 3 endpoints any agent can call in 2 minutes.
// v2: verified_only mode + retrieval quality + visual recall format

const rc = require('./resolve-cache');
const fs = require('fs');
const path = require('path');
const writeAuthority = require('./write-authority');
const commitLog = require('./commit-log');

const MEMORY_LOG = path.join(__dirname, '..', 'data', 'memory-api-log.jsonl');

const LOG_CAP = {};
const REDUCER_CAP = {};
function registerCapabilities(registerFn) {
  registerFn(LOG_CAP);
  registerFn(REDUCER_CAP);
}
const MEMORY_LOG_COMPACT = path.join(__dirname, '..', 'data', 'memory-api-log-compact.json');
const STALE_DAYS = 14;
const MIN_SIMILARITY = 0.2;
let _reducerLogCount = 0;

// Phase 2 reducer: append entry to memory-api-log.jsonl, compact every 1000 entries
commitLog.on('memory_api/log', (event) => {
  writeAuthority.authorizeWrite(REDUCER_CAP);
  try {
    const dir = path.dirname(MEMORY_LOG);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(MEMORY_LOG, JSON.stringify({
      ...event.payload,
      timestamp: new Date().toISOString()
    }) + '\n');
    _reducerLogCount++;
    if (_reducerLogCount >= 1000) {
      _reducerLogCount = 0;
      if (fs.existsSync(MEMORY_LOG)) {
        const raw = fs.readFileSync(MEMORY_LOG, 'utf8');
        const lines = raw.split('\n').filter(Boolean);
        if (lines.length > 6000) {
          const kept = lines.slice(-5000);
          fs.writeFileSync(MEMORY_LOG, kept.join('\n') + '\n');
        }
      }
    }
  } catch { /* ignore */ }
});

function logCall(endpoint, body) {
  writeAuthority.authorizeWrite(LOG_CAP);
  // Phase 2: commit-only (reducer persists to JSONL)
  commitLog.commit(LOG_CAP, { type: 'memory_api/log', source: 'memory-api', payload: { endpoint, body_snapshot: { task: body?.task?.slice(0, 80), query: body?.query?.slice(0, 80) } } }, MEMORY_LOG);
}

// Staleness check: hints older than STALE_DAYS with supporting_agents === 0 are stale
function isStale(hint) {
  const ageDays = (Date.now() - new Date(hint.updated_at || Date.now()).getTime()) / 86400000;
  if (ageDays > STALE_DAYS && hint.success_count === 0 && hint.citation_count === 0) return true;
  if (ageDays > STALE_DAYS * 2 && hint.status === rc.HINT_STATUS.DECAYING) return true;
  return false;
}

// 1. POST /memory/failure — Submit a failure experience
function submitFailure(body) {
  const task = body?.task || '';
  const error = body?.error || '';
  const attemptedFix = body?.attempted_fix || '';
  const result = body?.result || 'failed';
  const agentId = body?.agent_id || 'anonymous';

  const query = `${task} ${error}`.trim();
  const similar = searchLocal(query, 5, { verified_only: false });

  if (task && error) {
    const hintId = `FAIL_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    rc.setHint(hintId, {
      solution_summary: `FAILURE: ${task} — ${error.slice(0, 200)}`,
      score: -0.3,
      status: rc.HINT_STATUS.DECAYING,
      success_count: 0,
      failure_count: 1,
      citation_count: 0,
      used_by: [agentId],
      agent_stats: { [agentId]: { success: 0, failure: 1, citation: 0, total: 1 } },
      hit: false,
      task_type: 'failure_report',
      metadata: { attempted_fix: attemptedFix.slice(0, 500), result, task: task.slice(0, 300), error: error.slice(0, 300) },
    });
  }

  logCall('submit_failure', { task, error, result });

  return {
    status: 'recorded',
    message: 'Failure recorded. Run search_memory before retrying.',
    similar_failures: similar.failures,
    verified_fixes: similar.verified_fixes,
    warning_count: similar.warnings.length,
  };
}

// 2. POST /memory/search — Search with quality filters + verified_only mode
function searchMemory(body) {
  const query = body?.query || body?.task || '';
  const topK = Math.min(body?.limit || 10, 50);
  const verifiedOnly = body?.verified_only === true || body?.strict === true;
  const results = searchLocal(query, topK, { verified_only: verifiedOnly });
  logCall('search_memory', { query, verified_only: verifiedOnly });
  return results;
}

// 3. POST /memory/resolution — Submit a verified resolution
function submitResolution(body) {
  const taskId = body?.task_id || '';
  const fix = body?.fix || '';
  const verified = body?.verified === true;
  const agentId = body?.agent_id || 'anonymous';

  if (!fix && !taskId) {
    return { status: 'error', message: 'Provide fix or task_id' };
  }

  const hintId = taskId || `FIX_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  rc.setHint(hintId, {
    solution_summary: fix.slice(0, 500),
    score: verified ? 2.0 : 1.0,
    status: rc.HINT_STATUS.ACTIVE,
    success_count: verified ? 1 : 0,
    failure_count: 0,
    citation_count: 0,
    used_by: [agentId],
    agent_stats: { [agentId]: { success: verified ? 1 : 0, failure: 0, citation: 0, total: 1 } },
    hit: true,
    task_type: 'verified_resolution',
    metadata: { verified, original_task_id: taskId || undefined, fix: fix.slice(0, 1000) },
  });

  logCall('submit_resolution', { task_id: taskId, verified });

  // Record verification state
  try {
    const v = require('./verification');
    if (verified) {
      v.recordSandboxResult(hintId, true);
    }
    // Check for replay confirmation: if this resolution matches an existing failure
    const similar = searchLocal(taskId || fix, 5, { verified_only: false });
    if (similar.total_failures > 0) {
      v.recordReplayConfirm(hintId);
    }
  } catch {}

  const similar = searchLocal(taskId || fix, 5, { verified_only: false });
  return {
    status: 'stored',
    message: verified ? 'Verified fix stored. Future agents will find this.' : 'Resolution stored. Mark as verified=true when confirmed.',
    similar_failures: similar.failures,
    verified_fixes: similar.verified_fixes,
  };
}

// --- Multi-layer retrieval ranking with verification tiers ---
function computeScore(id, hint, queryTerms, queryLower) {
  const ageDays = (Date.now() - new Date(hint.updated_at || Date.now()).getTime()) / 86400000;
  const meta = hint.metadata || {};
  const text = ((hint.solution_summary || '') + ' ' + JSON.stringify(meta)).toLowerCase();

  // Layer 1: Semantic similarity
  const matchCount = queryTerms.filter(t => text.includes(t)).length;
  const semanticScore = matchCount / Math.max(queryTerms.length, 1);

  // Layer 2: Component overlap
  const components = meta.components || [];
  const compMatch = components.filter(c => queryLower.includes(c.toLowerCase())).length;
  const compScore = components.length > 0 ? compMatch / components.length : 0;

  // Layer 3: Stack trace match
  const errorPattern = meta.error_pattern || '';
  const traceMatch = errorPattern ? queryTerms.filter(t => errorPattern.toLowerCase().includes(t)).length / Math.max(queryTerms.length, 1) : 0;

  // Layer 4: Verification tier weight (from verification module)
  let verificationWeight = 0;
  let verificationTier = 'unverified';
  let trustTier = 'staging';
  let trustWeight = 0.35;
  let decayLabel = 'fresh';
  let decayMultiplier = 1.0;
  try {
    const v = require('./verification');
    const info = v.getVerificationInfo(id);
    verificationWeight = info.effective_weight;
    verificationTier = info.tier;
    trustTier = info.trust_tier || trustTier;
    trustWeight = info.trust_weight ?? trustWeight;
    decayLabel = info.decay_label;
    decayMultiplier = info.decay_multiplier;
  } catch {}

  // Layer 5: Freshness decay
  const freshnessWeight = Math.max(0, 1 - ageDays / 90);

  // Layer 6: Hallucination penalty
  const isBlacklisted = hint.status === rc.HINT_STATUS.BLACKLISTED;
  const isQuarantined = hint.status === rc.HINT_STATUS.QUARANTINED;
  const hallPenalty = trustTier === 'deprecated' ? 1.0 : isBlacklisted ? 0.5 : isQuarantined ? 0.3 : (hint.status === rc.HINT_STATUS.DECAYING && (hint.score || 0) < 0) ? 0.1 : 0;

  const composite = (
    semanticScore * 0.30 +
    compScore * 0.15 +
    traceMatch * 0.10 +
    verificationWeight * 0.25 +
    freshnessWeight * 0.15 -
    hallPenalty * 0.05
  );

  return { composite, semanticScore, compScore, traceMatch, verificationWeight, verificationTier, trustTier, trustWeight, decayLabel, decayMultiplier, freshnessWeight, hallPenalty, ageDays, isVerified: verificationTier !== 'unverified' && trustTier !== 'deprecated', isBlacklisted, isQuarantined };
}

function searchLocal(query, topK = 10, opts = {}) {
  const allHints = rc.getAllHints();
  const failures = [];
  const verifiedFixes = [];
  const warnings = [];
  const seenSummaries = new Map(); // summaryKey → { id, tier }
  const verifiedOnly = opts?.verified_only === true;

  const queryLower = query.toLowerCase();
  const terms = queryLower.split(/\s+/).filter(t => t.length > 2);

  const candidateHints = []; // collect all candidates first, then dedup by keeping highest tier

  for (const [id, hint] of Object.entries(allHints)) {
    const text = ((hint.solution_summary || '') + ' ' + JSON.stringify(hint.metadata || {})).toLowerCase();
    const matchCount = terms.filter(t => text.includes(t)).length;
    if (matchCount === 0) continue;

    const relevance = matchCount / terms.length;
    if (relevance < MIN_SIMILARITY) continue;

    if (isStale(hint)) continue;

    const ranking = computeScore(id, hint, terms, queryLower);
    if (ranking.composite < 0.1) continue;

    candidateHints.push({ id, hint, relevance, ranking });
  }

  // Dedup: keep highest verification tier for each summary
  const deduped = [];
  const summaryMap = new Map();
  for (const c of candidateHints) {
    const key = (c.hint.solution_summary || '').slice(0, 80).toLowerCase();
    const tierOrder = { production_confirmed: 4, sandbox_passed: 3, replay_confirmed: 2, unverified: 1 };
    const existing = summaryMap.get(key);
    const currentTier = tierOrder[c.ranking.verificationTier] || 0;
    const existingTier = existing ? (tierOrder[existing.ranking.verificationTier] || 0) : 0;
    if (!existing || currentTier > existingTier) {
      summaryMap.set(key, c);
    }
  }
  for (const c of summaryMap.values()) deduped.push(c);

  for (const { id, hint, relevance, ranking } of deduped) {
    const isFix = hint.hit === true || hint.task_type === 'verified_resolution';
    const isFailure = hint.task_type === 'failure_report' || hint.metadata?.result === 'failed';
    const isHarmful = hint.status === rc.HINT_STATUS.QUARANTINED || hint.status === rc.HINT_STATUS.BLACKLISTED;
    const isDecaying = hint.status === rc.HINT_STATUS.DECAYING;

    if (verifiedOnly) {
      const allowedTiers = ['sandbox_passed', 'production_confirmed'];
      if (ranking.trustTier === 'verified' && allowedTiers.includes(ranking.verificationTier)) {
        verifiedFixes.push(scoreFix(id, hint, relevance, ranking));
      }
      continue;
    }

    if (isFix && hint.score > 0 && !isHarmful && ranking.trustTier !== 'deprecated') {
      verifiedFixes.push(scoreFix(id, hint, relevance, ranking));
    }
    if (isFailure && !isHarmful) {
      failures.push(scoreFailure(id, hint, relevance, ranking));
    }
    if (isHarmful || (isDecaying && hint.score < 0)) {
      warnings.push(scoreWarning(id, hint, relevance, ranking));
    }
  }

  // Sort by composite score
  verifiedFixes.sort((a, b) => b.composite - a.composite);
  failures.sort((a, b) => b.composite - a.composite);

  return {
    query,
    verified_fixes: verifiedFixes.slice(0, topK),
    failures: failures.slice(0, topK),
    warnings: warnings.slice(0, 5),
    total_fixes: verifiedFixes.length,
    total_failures: failures.length,
    mode: verifiedOnly ? 'verified_only' : 'standard',
  };
}

function scoreFix(id, hint, relevance, rank) {
  const totalAttempts = (hint.success_count || 0) + (hint.failure_count || 0);
  const confidence = totalAttempts > 0 ? Math.round((hint.success_count || 0) / totalAttempts * 100) : hint.score > 1 && rank.isVerified ? 70 : 0;
  const agentCount = (hint.used_by || []).length;
  return {
    id, summary: hint.solution_summary?.slice(0, 200),
    similarity: Math.round(relevance * 100),
    score: hint.score, confidence, status: hint.status,
    supporting_agents: agentCount,
    freshness: rank.ageDays, age_days: Math.round(rank.ageDays * 10) / 10,
    composite: Math.round(rank.composite * 100),
    verification_tier: rank.verificationTier,
    trust_tier: rank.trustTier,
    trust_weight: rank.trustWeight,
    decay_label: rank.decayLabel,
    decay_multiplier: Math.round(rank.decayMultiplier * 100) / 100,
    rank_breakdown: { semantic: Math.round(rank.semanticScore * 100), component: Math.round(rank.compScore * 100), trace: Math.round(rank.traceMatch * 100), verification_weight: Math.round(rank.verificationWeight * 100), trust_weight: Math.round(rank.trustWeight * 100), freshness_weight: Math.round(rank.freshnessWeight * 100) },
    metadata: hint.metadata ? { attempted_fix: hint.metadata.attempted_fix?.slice(0, 200), task: hint.metadata.task?.slice(0, 100), components: hint.metadata.components } : undefined,
  };
}

function scoreFailure(id, hint, relevance, rank) {
  return {
    id, summary: hint.solution_summary?.slice(0, 200),
    similarity: Math.round(relevance * 100),
    score: hint.score, status: hint.status,
    attempted_fix: hint.metadata?.attempted_fix?.slice(0, 200),
    freshness: rank.ageDays, age_days: Math.round(rank.ageDays * 10) / 10,
    composite: Math.round(rank.composite * 100),
    components: hint.metadata?.components,
    metadata: hint.metadata ? { attempted_fix: hint.metadata.attempted_fix?.slice(0, 200), task: hint.metadata.task?.slice(0, 100), components: hint.metadata.components } : undefined,
  };
}

function scoreWarning(id, hint, relevance, rank) {
  return {
    id, summary: hint.solution_summary?.slice(0, 150),
    reason: hint.status === rc.HINT_STATUS.BLACKLISTED ? 'Blacklisted (known hallucination)' : 'Quarantined (unreliable)',
    score: hint.score, similarity: Math.round(relevance * 100),
    composite: Math.round(rank.composite * 100),
  };
}

function normalizeScore(s) { return Math.max(0, Math.min(1, (s + 3) / 6)); }
function freshness(ageDays, now) { return Math.max(0, 1 - ageDays / 60); }

// --- Visual "Memory Recall" format ---
// This is the social-media-shareable format.
// Outputs a markdown block that makes the "agent got smarter" moment visible.
function formatRecall(results, opts = {}) {
  let out = '';
  const style = opts?.style || 'markdown';

  // Header
  out += style === 'markdown' ? '📦 **Memory Recall**\n' : '[Memory Recall]\n';

  if (results.verified_fixes?.length > 0) {
    const fix = results.verified_fixes[0];
    const ago = fix.age_days < 1 ? 'today' : fix.age_days < 7 ? `${Math.round(fix.age_days)}d ago` : `${Math.round(fix.age_days / 7)}w ago`;
    const tierLabel = fix.verification_tier === 'production_confirmed' ? '✅ production-confirmed' : fix.verification_tier === 'sandbox_passed' ? '🔬 sandbox-verified' : fix.verification_tier === 'replay_confirmed' ? '👥 replay-confirmed' : 'unverified';
    const decayNote = fix.decay_label === 'stale' ? ' ⚠️ stale' : fix.decay_label === 'heavy_decay' ? ' ⚠️ heavily decayed' : fix.decay_label === 'quarantine_candidate' ? ' ⛔ quarantine candidate' : '';
    out += `Found fix from ${ago} (${tierLabel}${decayNote}):\n`;
    out += `\`\`\`\n${fix.summary}\n\`\`\`\n`;
    if (fix.confidence > 0) out += `(confidence: ${fix.confidence}% · ${fix.supporting_agents} agent(s) · weight: ${fix.decay_multiplier})\n`;
    if (fix.metadata?.attempted_fix) out += `\nAttempted approaches that failed:\n${fix.metadata.attempted_fix}\n`;
  }

  if (results.failures?.length > 0 && results.verified_fixes?.length === 0) {
    out += `\nFound ${results.total_failures} similar failures, no verified fix yet.\n`;
    out += `First to fix it? Submit with: POST /memory/resolution\n`;
  }

  if (results.warnings?.length > 0) {
    out += `\n⚠️ ${results.warnings.length} approach(es) known to fail — avoid these.\n`;
  }

  if (results.verified_fixes?.length === 0 && results.failures?.length === 0) {
    out += 'No matches in shared memory. You\'re the first. Submit what you find.\n';
  }

  out += `\n(memory search: "${results.query}" · ${results.mode || 'standard'} mode)\n`;
  return out;
}

function getStats() {
  let totalCalls = 0;
  try {
    if (fs.existsSync(MEMORY_LOG)) {
      const raw = fs.readFileSync(MEMORY_LOG, 'utf8');
      totalCalls = raw.split('\n').filter(Boolean).length;
    }
  } catch {}
  const allHints = rc.getAllHints();
  const failures = Object.values(allHints).filter(h => h.task_type === 'failure_report' || h.metadata?.result === 'failed').length;
  const fixes = Object.values(allHints).filter(h => h.task_type === 'verified_resolution' || (h.hit === true && h.score > 0)).length;
  const total = Object.keys(allHints).length;
  const stale = Object.values(allHints).filter(h => isStale(h)).length;
  return {
    total_api_calls: totalCalls,
    failures_in_memory: failures,
    verified_fixes_in_memory: fixes,
    total_hints: total,
    stale_hints: stale,
    healthy_hints: total - stale,
  };
}

module.exports = { submitFailure, searchMemory, submitResolution, formatRecall, getStats, registerCapabilities };
