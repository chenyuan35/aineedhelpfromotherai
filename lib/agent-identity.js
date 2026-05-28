// lib/agent-identity.js — AI Identity System
// Aggregates runtime data into behavioral agent profiles.
// Lightweight, cached, fail-safe (each source can fail independently).

const CACHE_TTL_MS = 30_000;
const _cache = new Map(); // agentId → { profile, cachedAt }

function _cached(key, fn) {
  const now = Date.now();
  const hit = _cache.get(key);
  if (hit && now - hit.cachedAt < CACHE_TTL_MS) return hit.profile;
  const profile = fn();
  _cache.set(key, { profile, cachedAt: now });
  return profile;
}

async function _try(fn, fallback = null) {
  try { return await fn(); } catch { return fallback; }
}

async function computeAgentProfile(agentId) {
  const [presence, reputation, elo, signals, execStats] = await Promise.all([
    _try(() => { const ap = require('./agent-presence'); return ap.getActive().find(a => a.agent_id === agentId); }),
    _try(() => { const r = require('./reputation'); return r.getAgentReputation(agentId); }),
    _try(() => { const e = require('./elo-rating'); return e.getRating(agentId, 'general'); }),
    _try(() => { const bs = require('./behavioral-signals'); const s = bs.scanAgent(agentId, 86400000); return s || []; }),
    _try(() => { const eh = require('./execution-history'); return eh.queryExecutions({ agent_id: agentId, limit: 500 }); }),
  ]);

  const stats = reputation?.stats || execStats?.executions?.reduce((acc, ex) => {
    acc.total++;
    if (ex.status === 'completed' || ex.status === 'COMPLETED') acc.completed++;
    if (ex.status === 'failed' || ex.status === 'FAILED') acc.failed++;
    return acc;
  }, { total: 0, completed: 0, failed: 0 }) || { total: 0, completed: 0, failed: 0 };

  const totalEx = stats.total || stats.total_attempts || 0;
  const successRate = stats.success_rate ?? (totalEx > 0 ? (stats.completed || 0) / totalEx : 0);
  const failureRate = totalEx > 0 ? (stats.failed || 0) / totalEx : 0;
  const signalList = Array.isArray(signals) ? signals : [];

  // Behavioral traits derived from observable data
  const traits = [];
  const signalTypes = new Set(signalList.map(s => s.signal).filter(Boolean));

  if (successRate >= 0.85 && totalEx >= 5) traits.push('high_consensus_reliability');
  else if (successRate >= 0.6) traits.push('moderate_success_rate');

  if (failureRate > 0.2 && totalEx >= 5) traits.push('frequent_failures');

  if (elo && elo.games >= 3) {
    if (elo.rating >= 1400) traits.push('skilled_executor');
    else if (elo.rating >= 1250) traits.push('competent_executor');
  }

  if (signalTypes.has('hallucination_cascade')) traits.push('hallucination_prone');
  if (signalTypes.has('retry_explosion')) traits.push('retries_excessively');
  if (signalTypes.has('tool_drift')) traits.push('unfocused_execution');
  if (signalTypes.has('goal_drift')) traits.push('deviates_from_objective');
  if (signalTypes.has('wandering_agent')) traits.push('long_execution_paths');

  if (signalList.length === 0 && successRate >= 0.8 && totalEx >= 5) {
    traits.push('clean_behavior_record');
  }

  // Specialty detection
  const categories = elo?.per_category ? Object.entries(elo.per_category) : [];
  categories.sort((a, b) => (b[1].rating || 1200) - (a[1].rating || 1200));
  const bestCategory = categories[0];
  let specialty = 'generalist';
  if (traits.includes('high_consensus_reliability')) specialty = 'high_reliability';
  else if (traits.includes('hallucination_prone')) specialty = 'high_risk';
  else if (bestCategory && bestCategory[1].rating > 1250 && bestCategory[1].games >= 3) {
    specialty = bestCategory[0];
  }

  // Trust level
  let trustLevel = 'unknown';
  if (reputation) {
    trustLevel = reputation.tier || 'unknown';
  } else if (totalEx >= 20 && successRate >= 0.75) {
    trustLevel = 'trusted';
  } else if (totalEx >= 10) {
    trustLevel = 'reliable';
  } else if (totalEx >= 3) {
    trustLevel = 'novice';
  }

  // Memory profile
  const memoryHintsUsed = await _try(async () => {
    const rg = require('./reasoning-storage');
    const c = await rg.getCitationsByAgent(agentId);
    return Array.isArray(c) ? c.length : 0;
  }, 0);

  return {
    agent_id: agentId,
    status: presence ? 'active' : (totalEx > 0 ? 'inactive' : 'unknown'),
    first_seen: reputation?.stats?.first_seen || presence?.first_seen || null,
    last_seen: presence?.last_seen || reputation?.stats?.last_active || null,
    total_executions: totalEx,
    stats: {
      success_rate: Math.round(successRate * 10000) / 100,
      failure_rate: Math.round(failureRate * 10000) / 100,
      avg_duration_ms: reputation?.stats?.avg_duration_ms || null,
      task_types: reputation?.stats?.unique_task_types || (execStats?.executions ? new Set(execStats.executions.map(e => e.task_id).filter(Boolean)).size : 0),
      elo_rating: elo?.rating || null,
      elo_games: elo?.games || 0,
    },
    trust: {
      level: trustLevel,
      score: reputation?.score ?? null,
      tier: reputation?.tier ?? null,
    },
    behavioral_traits: traits,
    specialty: specialty,
    recent_signals: signalList.slice(0, 5).map(s => ({
      signal: s.signal,
      severity: s.severity,
      confidence: s.confidence,
      detected_at: s.detected_at,
    })),
    memory_profile: {
      hints_used: memoryHintsUsed,
      hints_contributed: await _try(async () => {
        const rs = require('./reasoning-storage');
        const items = await rs.searchReasoning({ agent_id: agentId });
        return Array.isArray(items) ? items.length : 0;
      }, 0),
    },
    capabilities: presence?.capabilities || [],
  };
}

async function getProfile(agentId) {
  if (!agentId || agentId === 'anonymous') return null;
  return _cached(`profile:${agentId}`, () => computeAgentProfile(agentId));
}

async function getAllProfiles() {
  const presence = await _try(() => require('./agent-presence').getActive(), []);
  const repBoard = await _try(() => require('./reputation').getReputationLeaderboard(100), []);

  const fromPresence = presence.map(a => a.agent_id);
  const fromRep = repBoard.map(a => a.agent_id);
  const allIds = [...new Set([...fromPresence, ...fromRep])];

  const profiles = [];
  for (const id of allIds) {
    const p = await getProfile(id);
    if (p) profiles.push(p);
  }
  profiles.sort((a, b) => (b.total_executions || 0) - (a.total_executions || 0));
  return profiles;
}

function invalidateCache(agentId) {
  if (agentId) _cache.delete(`profile:${agentId}`);
  else _cache.clear();
}

module.exports = { getProfile, getAllProfiles, invalidateCache };
