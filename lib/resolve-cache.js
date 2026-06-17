// lib/resolve-cache.js — File-based resolve hint cache with memory evolution
// v3: Multi-agent scoring + quarantine states + per-agent tracking

const fs = require('fs');
const path = require('path');
const writeAuthority = require('./write-authority');
const commitLog = require('./commit-log');

const CACHE_PATH = path.join(__dirname, '..', 'data', 'resolve-cache.json');

const WRITE_CAP = {};
const REDUCER_CAP = {};
function registerCapabilities(registerFn) {
  registerFn(WRITE_CAP);
  registerFn(REDUCER_CAP);
}
const MIN_SCORE = 0.3;
const DECAY_PER_DAY = 0.1;
const INITIAL_SCORE = 1.0;
const QUARANTINE_THRESHOLD = -0.5;
const BLACKLIST_THRESHOLD = -2;

const HINT_STATUS = { ACTIVE: 'active', DECAYING: 'decaying', QUARANTINED: 'quarantined', BLACKLISTED: 'blacklisted' };

let _cache = null;

function load() {
  if (_cache) return _cache;
  try {
    if (fs.existsSync(CACHE_PATH)) {
      _cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
      return _cache;
    }
  } catch (e) { console.error('[resolve-cache] Load error:', e.message); }
  _cache = { hints: {}, updated_at: null, agents: {} };
  return _cache;
}

// Phase 2 reducer persistence: write cache to disk with reducer capability.
// Called only by event reducers defined below.
function persist(cache) {
  writeAuthority.authorizeWrite(REDUCER_CAP);
  const dir = path.dirname(CACHE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

// Phase 2 event sourcing reducers — registered at module load.
// These are the ONLY writers to CACHE_PATH. Direct writes in public API
// functions have been removed (commit-only now).
// Reducers use REDUCER_CAP (separate from WRITE_CAP used by public API).
commitLog.on('resolve_cache/set', (event) => {
  const cache = load();
  const { taskId, hint } = event.payload;
  cache.hints[taskId] = {
    ...hint, score: hint.score ?? INITIAL_SCORE,
    status: hint.status || HINT_STATUS.ACTIVE,
    success_count: hint.success_count ?? 0,
    failure_count: hint.failure_count ?? 0,
    citation_count: hint.citation_count ?? 0,
    used_by: hint.used_by || [],
    updated_at: new Date().toISOString(),
  };
  cache.updated_at = new Date().toISOString();
  persist(cache);
});

commitLog.on('resolve_cache/clear', (event) => {
  const cache = load();
  delete cache.hints[event.payload.taskId];
  cache.updated_at = new Date().toISOString();
  persist(cache);
});

commitLog.on('resolve_cache/outcome', (event) => {
  const cache = load();
  const { taskId, agentId, outcome } = event.payload;
  const h = cache.hints[taskId];
  if (!h) return;

  h.updated_at = new Date().toISOString();
  if (!h.used_by) h.used_by = [];
  if (!h.used_by.includes(agentId)) h.used_by.push(agentId);
  if (!h.agent_stats) h.agent_stats = {};
  if (!h.agent_stats[agentId]) h.agent_stats[agentId] = { success: 0, failure: 0, citation: 0, total: 0 };
  h.agent_stats[agentId].total++;

  if (outcome === 'success') {
    h.success_count = (h.success_count ?? 0) + 1;
    h.agent_stats[agentId].success++;
  } else if (outcome === 'failure') {
    h.failure_count = (h.failure_count ?? 0) + 1;
    h.agent_stats[agentId].failure++;
  } else if (outcome === 'citation') {
    h.citation_count = (h.citation_count ?? 0) + 1;
    h.agent_stats[agentId].citation++;
  }

  const total = (h.success_count ?? 0) + (h.failure_count ?? 0);
  const successRate = total > 0 ? (h.success_count ?? 0) / total : 0;
  const citationRate = total > 0 ? (h.citation_count ?? 0) / total : 0;
  const failureRate = total > 0 ? (h.failure_count ?? 0) / total : 0;
  const agentCount = (h.used_by || []).length;
  const agentDiversity = Math.min(agentCount / 4, 1);
  const ageDays = (Date.now() - new Date(h.updated_at || Date.now()).getTime()) / 86400000;
  const stalenessPenalty = Math.min(ageDays * DECAY_PER_DAY, 2);

  h.score = Math.max(-3, Math.min(3,
    (successRate * 0.5) + (citationRate * 0.2) + (agentDiversity * 0.2) - (failureRate * 0.5) - stalenessPenalty
  ));

  if (h.score <= BLACKLIST_THRESHOLD) h.status = HINT_STATUS.BLACKLISTED;
  else if (h.score <= QUARANTINE_THRESHOLD) h.status = HINT_STATUS.QUARANTINED;
  else if (h.score < MIN_SCORE) h.status = HINT_STATUS.DECAYING;
  else h.status = HINT_STATUS.ACTIVE;

  h.calculated_at = new Date().toISOString();
  persist(cache);
});

function getHint(taskId) {
  return load().hints[taskId] || null;
}

function setHint(taskId, hint) {
  writeAuthority.authorizeWrite(WRITE_CAP);
  // Phase 2: commit-only (reducer persists to disk synchronously via commitLog.on)
  commitLog.commit(WRITE_CAP, { type: 'resolve_cache/set', source: 'resolve-cache', payload: { taskId, hint } }, CACHE_PATH);
  // In-memory state update for immediate consistency (reducer also updates it)
  const cache = load();
  cache.hints[taskId] = {
    ...hint, score: hint.score ?? INITIAL_SCORE,
    status: hint.status || HINT_STATUS.ACTIVE,
    success_count: hint.success_count ?? 0,
    failure_count: hint.failure_count ?? 0,
    citation_count: hint.citation_count ?? 0,
    used_by: hint.used_by || [],
    updated_at: new Date().toISOString(),
  };
  cache.updated_at = new Date().toISOString();
}

function clearTask(taskId) {
  writeAuthority.authorizeWrite(WRITE_CAP);
  commitLog.commit(WRITE_CAP, { type: 'resolve_cache/clear', source: 'resolve-cache', payload: { taskId } }, CACHE_PATH);
  const cache = load();
  delete cache.hints[taskId];
  cache.updated_at = new Date().toISOString();
}

function getAllHints() {
  return load().hints || {};
}

// --- Advanced scoring ---

function recordOutcome(taskId, agentId, outcome) {
  writeAuthority.authorizeWrite(WRITE_CAP);
  commitLog.commit(WRITE_CAP, { type: 'resolve_cache/outcome', source: 'resolve-cache', payload: { taskId, agentId, outcome } }, CACHE_PATH);
  const cache = load();
  const h = cache.hints[taskId];
  if (!h) return;

  h.updated_at = new Date().toISOString();
  if (!h.used_by) h.used_by = [];
  if (!h.used_by.includes(agentId)) h.used_by.push(agentId);
  if (!h.agent_stats) h.agent_stats = {};
  if (!h.agent_stats[agentId]) h.agent_stats[agentId] = { success: 0, failure: 0, citation: 0, total: 0 };
  h.agent_stats[agentId].total++;

  if (outcome === 'success') {
    h.success_count = (h.success_count ?? 0) + 1;
    h.agent_stats[agentId].success++;
  } else if (outcome === 'failure') {
    h.failure_count = (h.failure_count ?? 0) + 1;
    h.agent_stats[agentId].failure++;
  } else if (outcome === 'citation') {
    h.citation_count = (h.citation_count ?? 0) + 1;
    h.agent_stats[agentId].citation++;
  }

  const total = (h.success_count ?? 0) + (h.failure_count ?? 0);
  const successRate = total > 0 ? (h.success_count ?? 0) / total : 0;
  const citationRate = total > 0 ? (h.citation_count ?? 0) / total : 0;
  const failureRate = total > 0 ? (h.failure_count ?? 0) / total : 0;
  const agentCount = (h.used_by || []).length;
  const agentDiversity = Math.min(agentCount / 4, 1);
  const ageDays = (Date.now() - new Date(h.updated_at || Date.now()).getTime()) / 86400000;
  const stalenessPenalty = Math.min(ageDays * DECAY_PER_DAY, 2);

  h.score = Math.max(-3, Math.min(3,
    (successRate * 0.5) + (citationRate * 0.2) + (agentDiversity * 0.2) - (failureRate * 0.5) - stalenessPenalty
  ));

  if (h.score <= BLACKLIST_THRESHOLD) h.status = HINT_STATUS.BLACKLISTED;
  else if (h.score <= QUARANTINE_THRESHOLD) h.status = HINT_STATUS.QUARANTINED;
  else if (h.score < MIN_SCORE) h.status = HINT_STATUS.DECAYING;
  else h.status = HINT_STATUS.ACTIVE;

  h.calculated_at = new Date().toISOString();
}

function getHintStatus(taskId) {
  const h = getHint(taskId);
  if (!h) return null;
  return { status: h.status || HINT_STATUS.ACTIVE, score: h.score ?? INITIAL_SCORE };
}

/** Get hints grouped by status */
function getMemoryHealth() {
  const all = getAllHints();
  const counts = { active: 0, decaying: 0, quarantined: 0, blacklisted: 0 };
  for (const h of Object.values(all)) {
    const s = h.status || (h.score >= MIN_SCORE ? HINT_STATUS.ACTIVE : HINT_STATUS.DECAYING);
    counts[s] = (counts[s] || 0) + 1;
  }
  return counts;
}

/** Return hints visible to a given agent (respects status + optional filtering) */
function getActiveHints(agentId) {
  const all = getAllHints();
  const active = {};
  for (const [id, h] of Object.entries(all)) {
    const status = h.status || ((h.score ?? INITIAL_SCORE) >= MIN_SCORE ? HINT_STATUS.ACTIVE : HINT_STATUS.DECAYING);
    if (status === HINT_STATUS.ACTIVE || status === HINT_STATUS.DECAYING) {
      active[id] = h;
    }
  }
  return active;
}

// Periodic decay + quarantine sweep (every hour)
// Phase 2: commits a resolve_cache/decay event. Reducer handles persistence.
commitLog.on('resolve_cache/decay', (event) => {
  const cache = load();
  let changed = false;
  const nowIso = new Date().toISOString();
  for (const [id, h] of Object.entries(cache.hints || {})) {
    // 自上次真实活动 (set/outcome 会刷新 updated_at) 以来的闲置天数
    const idleDays = (Date.now() - new Date(h.updated_at || Date.now()).getTime()) / 86400000;
    if (idleDays > 1) {
      // 只按「距上次衰减的增量」扣分，而非每小时按不断增大的总龄重扣。
      // 缺此 checkpoint 时，hourly sweep 会复利跑飞 → 所有 hint 被打到 ~ -480。
      const lastDecay = h.last_decayed_at || h.updated_at || nowIso;
      const elapsedDays = (Date.now() - new Date(lastDecay).getTime()) / 86400000;
      const penalty = elapsedDays * DECAY_PER_DAY * 0.5;
      if (penalty > 0) {
        // 与 recordOutcome 一致，钳到 -3，衰减不得突破下限
        h.score = Math.max(-3, (h.score ?? INITIAL_SCORE) - penalty);
        if (h.score <= BLACKLIST_THRESHOLD) h.status = HINT_STATUS.BLACKLISTED;
        else if (h.score <= QUARANTINE_THRESHOLD) h.status = HINT_STATUS.QUARANTINED;
        else if (h.score < MIN_SCORE) h.status = HINT_STATUS.DECAYING;
        h.last_decayed_at = nowIso;
        changed = true;
      }
    }
  }
  if (changed) { cache.updated_at = nowIso; persist(cache); }
});

setInterval(() => {
  commitLog.commit(WRITE_CAP, { type: 'resolve_cache/decay', source: 'resolve-cache', payload: {} }, CACHE_PATH);
}, 3600000).unref();

function getResolveHintsForTasks(tasks, agentId) {
  const allHints = getActiveHints(agentId);
  const hints = {};
  for (const t of tasks) {
    const hint = allHints[t.id];
    if (hint && hint.hit && hint.status !== HINT_STATUS.BLACKLISTED && hint.status !== HINT_STATUS.QUARANTINED) {
      hints[t.id] = hint;
    }
  }
  return hints;
}

function buildResolvePrompt(hintsMap) {
  const ids = Object.keys(hintsMap);
  if (ids.length === 0) return '';
  if (ids.length === 1) {
    const h = hintsMap[ids[0]];
    return `Resolution hint (status: ${h.status || 'active'}, score: ${(h.score ?? INITIAL_SCORE).toFixed(1)}): "${h.solution_summary?.slice(0, 120)}"`;
  }
  let prompt = `Resolution hints for ${ids.length} tasks:\n`;
  let count = 0;
  for (const id of ids) {
    if (count++ >= 5) { prompt += `... and ${ids.length - 5} more.\n`; break; }
    const h = hintsMap[id];
    prompt += `- ${id} [${h.status || 'active'}, score:${(h.score ?? INITIAL_SCORE).toFixed(1)}]: ${(h.solution_summary || '').slice(0, 100)}\n`;
  }
  return prompt;
}

/** Leaderboard: aggregate hint performance by agent */
function getAgentMemoryLeaderboard() {
  const all = getAllHints();
  const agents = {};
  for (const h of Object.values(all)) {
    if (!h.agent_stats) continue;
    for (const [agentId, stats] of Object.entries(h.agent_stats)) {
      if (!agents[agentId]) agents[agentId] = { success: 0, failure: 0, citation: 0, total: 0, hints_used: new Set() };
      agents[agentId].success += stats.success || 0;
      agents[agentId].failure += stats.failure || 0;
      agents[agentId].citation += stats.citation || 0;
      agents[agentId].total += stats.total || 0;
      agents[agentId].hints_used.add(h.reasoning_id || 'unknown');
    }
  }
  return Object.entries(agents).map(([agentId, s]) => ({
    agent_id: agentId,
    total_attempts: s.total,
    success_rate: s.total > 0 ? Math.round((s.success / s.total) * 100) : 0,
    citation_rate: s.total > 0 ? Math.round((s.citation / s.total) * 100) : 0,
    hallucination_rate: s.total > 0 ? Math.round((s.failure / s.total) * 100) : 0,
    distinct_hints_used: s.hints_used.size,
  })).sort((a, b) => b.success_rate - a.success_rate);
}

module.exports = {
  getHint, setHint, clearTask, getAllHints, load,
  getResolveHintsForTasks, buildResolvePrompt,
  recordOutcome, getHintStatus, getMemoryHealth, getActiveHints, getAgentMemoryLeaderboard,
  registerCapabilities,
  MIN_SCORE, HINT_STATUS,
};
