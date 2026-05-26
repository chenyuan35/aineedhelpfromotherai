// lib/resolve-cache.js — File-based resolve hint cache with memory evolution
// v3: Multi-agent scoring + quarantine states + per-agent tracking

const fs = require('fs');
const path = require('path');

const CACHE_PATH = path.join(__dirname, '..', 'data', 'resolve-cache.json');
const MIN_SCORE = 0.3;
const DECAY_PER_DAY = 0.1;
const INITIAL_SCORE = 1.0;
const QUARANTINE_THRESHOLD = -0.5;
const BLACKLIST_THRESHOLD = -2;

const HINT_STATUS = { ACTIVE: 'active', DECAYING: 'decaying', QUARANTINED: 'quarantined', BLACKLISTED: 'blacklisted' };

function getCache() {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    }
  } catch (e) { console.error('[resolve-cache] Load error:', e.message); }
  return { hints: {}, updated_at: null, agents: {} };
}

function save(cache) {
  try {
    const dir = path.dirname(CACHE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  } catch (e) { console.error('[resolve-cache] Save error:', e.message); }
}

function getHint(taskId) {
  return getCache().hints[taskId] || null;
}

function setHint(taskId, hint) {
  const cache = getCache();
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
  save(cache);
}

function clearTask(taskId) {
  const cache = getCache();
  delete cache.hints[taskId];
  cache.updated_at = new Date().toISOString();
  save(cache);
}

function getAllHints() {
  return getCache().hints || {};
}

// --- Advanced scoring ---

/** Record an agent's use of a hint and recalculate score */
function recordOutcome(taskId, agentId, outcome) {
  const cache = getCache();
  const h = cache.hints[taskId];
  if (!h) return;

  h.updated_at = new Date().toISOString();

  // Track per-agent
  if (!h.used_by) h.used_by = [];
  if (!h.used_by.includes(agentId)) h.used_by.push(agentId);

  // Track per-agent outcomes
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

  // Recalculate score
  const total = (h.success_count ?? 0) + (h.failure_count ?? 0);
  const successRate = total > 0 ? (h.success_count ?? 0) / total : 0;
  const citationRate = total > 0 ? (h.citation_count ?? 0) / total : 0;
  const failureRate = total > 0 ? (h.failure_count ?? 0) / total : 0;

  // Agent diversity: how many distinct agents used this
  const agentCount = (h.used_by || []).length;
  const agentDiversity = Math.min(agentCount / 4, 1); // normalize to [0,1]

  // Staleness decay
  const ageDays = (Date.now() - new Date(h.updated_at || Date.now()).getTime()) / 86400000;
  const stalenessPenalty = Math.min(ageDays * DECAY_PER_DAY, 2);

  h.score = Math.max(-3, Math.min(3,
    (successRate * 0.5) +
    (citationRate * 0.2) +
    (agentDiversity * 0.2) -
    (failureRate * 0.5) -
    stalenessPenalty
  ));

  // Determine status
  if (h.score <= BLACKLIST_THRESHOLD) h.status = HINT_STATUS.BLACKLISTED;
  else if (h.score <= QUARANTINE_THRESHOLD) h.status = HINT_STATUS.QUARANTINED;
  else if (h.score < MIN_SCORE) h.status = HINT_STATUS.DECAYING;
  else h.status = HINT_STATUS.ACTIVE;

  h.calculated_at = new Date().toISOString();
  save(cache);
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

// Periodic decay + quarantine sweep
setInterval(() => {
  const cache = getCache();
  let changed = false;
  for (const h of Object.values(cache.hints || {})) {
    const ageDays = (Date.now() - new Date(h.updated_at || Date.now()).getTime()) / 86400000;
    if (ageDays > 1) {
      const penalty = Math.floor(ageDays) * DECAY_PER_DAY * 0.5;
      if (penalty > 0) {
        h.score = (h.score ?? INITIAL_SCORE) - penalty;
        if (h.score <= BLACKLIST_THRESHOLD) h.status = HINT_STATUS.BLACKLISTED;
        else if (h.score <= QUARANTINE_THRESHOLD) h.status = HINT_STATUS.QUARANTINED;
        else if (h.score < MIN_SCORE) h.status = HINT_STATUS.DECAYING;
        changed = true;
      }
    }
  }
  if (changed) { cache.updated_at = new Date().toISOString(); save(cache); }
}, 3600000).unref(); // every hour

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
  getHint, setHint, clearTask, getAllHints, getCache,
  getResolveHintsForTasks, buildResolvePrompt,
  recordOutcome, getHintStatus, getMemoryHealth, getActiveHints, getAgentMemoryLeaderboard,
  MIN_SCORE, HINT_STATUS,
};
