// lib/reputation.js — Exploratory agent reputation scoring
// Computes reputation from execution_history data only — no new barriers
// Zero-barrier: reputation is read-only, does not block any operations
//
// Scoring factors:
//   - success_rate: % of completed vs total attempts
//   - consistency: stddev of duration_ms (lower = more predictable)
//   - activity: days since first seen, recent activity
//   - diversity: number of unique task_types attempted
//   - quality: avg content_length of submissions
//
// Reputation tiers:
//   - unknown: < 3 attempts
//   - novice: 3-9 attempts, any success rate
//   - reliable: 10+ attempts, >= 50% success rate
//   - trusted: 20+ attempts, >= 75% success rate, active in last 7 days
//   - veteran: 50+ attempts, >= 90% success rate, active in last 3 days

const { getPool } = require('./db');

const REPUTATION_TIERS = Object.freeze({
  UNKNOWN: { name: 'unknown', min_attempts: 0, min_success_rate: 0, min_recent_days: null },
  NOVICE: { name: 'novice', min_attempts: 3, min_success_rate: 0, min_recent_days: null },
  RELIABLE: { name: 'reliable', min_attempts: 10, min_success_rate: 0.5, min_recent_days: null },
  TRUSTED: { name: 'trusted', min_attempts: 20, min_success_rate: 0.75, min_recent_days: 7 },
  VETERAN: { name: 'veteran', min_attempts: 50, min_success_rate: 0.9, min_recent_days: 3 },
});

function computeTier(stats) {
  const { total_attempts, success_rate, last_active } = stats;
  const sr = success_rate || 0;
  const daysSinceActive = last_active ? (Date.now() - new Date(last_active).getTime()) / 86400000 : Infinity;

  if (total_attempts >= REPUTATION_TIERS.VETERAN.min_attempts &&
      sr >= REPUTATION_TIERS.VETERAN.min_success_rate &&
      daysSinceActive <= REPUTATION_TIERS.VETERAN.min_recent_days) {
    return REPUTATION_TIERS.VETERAN.name;
  }
  if (total_attempts >= REPUTATION_TIERS.TRUSTED.min_attempts &&
      sr >= REPUTATION_TIERS.TRUSTED.min_success_rate &&
      daysSinceActive <= REPUTATION_TIERS.TRUSTED.min_recent_days) {
    return REPUTATION_TIERS.TRUSTED.name;
  }
  if (total_attempts >= REPUTATION_TIERS.RELIABLE.min_attempts &&
      sr >= REPUTATION_TIERS.RELIABLE.min_success_rate) {
    return REPUTATION_TIERS.RELIABLE.name;
  }
  if (total_attempts >= REPUTATION_TIERS.NOVICE.min_attempts) {
    return REPUTATION_TIERS.NOVICE.name;
  }
  return REPUTATION_TIERS.UNKNOWN.name;
}

function computeScore(stats) {
  // Weighted score 0-100
  const { total_attempts, success_rate, avg_duration_ms, content_length_avg, unique_task_types, days_active } = stats;

  // Success rate component (0-40 points)
  const srScore = (success_rate || 0) * 40;

  // Volume component (0-25 points) — logarithmic scaling
  const volumeScore = Math.min(Math.log10(Math.max(total_attempts, 1)) / 2, 1) * 25;

  // Consistency component (0-15 points) — based on duration variance
  const consistencyScore = avg_duration_ms ? Math.max(0, 15 - (avg_duration_ms / 10000)) : 7.5;

  // Quality component (0-10 points) — based on content length
  const qualityScore = Math.min((content_length_avg || 0) / 500, 1) * 10;

  // Diversity component (0-10 points) — based on unique task types
  const diversityScore = Math.min((unique_task_types || 0) / 5, 1) * 10;

  return Math.round(srScore + volumeScore + consistencyScore + qualityScore + diversityScore);
}

// Get reputation for a single agent
async function getAgentReputation(agentId) {
  const db = getPool();
  if (!db) return null;

  try {
    const result = await db.query(
      `SELECT
        agent_id,
        agent_name,
        COUNT(*) as total_attempts,
        COUNT(*) FILTER (WHERE status = 'completed' AND (result->'validation'->>'passed')::boolean = true) as tasks_completed,
        COUNT(*) FILTER (WHERE status = 'failed') as tasks_failed,
        COUNT(*) FILTER (WHERE status = 'claimed') as tasks_abandoned,
        COUNT(*) FILTER (WHERE status = 'completed' AND (result->'validation'->>'passed')::boolean = false) as tasks_validation_failed,
        ROUND(AVG(CASE WHEN status = 'completed' AND (result->'validation'->>'passed')::boolean = true THEN duration_ms END)) as avg_duration_ms,
        ROUND(AVG(CASE WHEN status = 'completed' AND (result->'validation'->>'passed')::boolean = true THEN (result->>'content_length')::int END)) as content_length_avg,
        COUNT(DISTINCT task_type) as unique_task_types,
        MIN(created_at) as first_seen,
        MAX(created_at) as last_active,
        COUNT(DISTINCT DATE(created_at)) as days_active
       FROM execution_history
       WHERE agent_id = $1 AND agent_id != 'anonymous'
       GROUP BY agent_id, agent_name`,
      [agentId]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    const totalAttempts = parseInt(row.total_attempts);
    const completed = parseInt(row.tasks_completed);
    const successRate = totalAttempts > 0 ? completed / totalAttempts : 0;

    const stats = {
      total_attempts: totalAttempts,
      tasks_completed: completed,
      tasks_failed: parseInt(row.tasks_failed),
      tasks_abandoned: parseInt(row.tasks_abandoned),
      tasks_validation_failed: parseInt(row.tasks_validation_failed),
      success_rate: Math.round(successRate * 100) / 100,
      avg_duration_ms: row.avg_duration_ms ? parseInt(row.avg_duration_ms) : null,
      content_length_avg: row.content_length_avg ? parseInt(row.content_length_avg) : null,
      unique_task_types: parseInt(row.unique_task_types),
      first_seen: row.first_seen,
      last_active: row.last_active,
      days_active: parseInt(row.days_active)
    };

    return {
      agent_id: row.agent_id,
      agent_name: row.agent_name || row.agent_id,
      tier: computeTier(stats),
      score: computeScore(stats),
      stats,
      computed_at: new Date().toISOString()
    };
  } catch (err) {
    console.error('[reputation] Query failed:', err.message);
    return null;
  }
}

// Get reputation leaderboard (top agents by score)
async function getReputationLeaderboard(limit = 20) {
  const db = getPool();
  if (!db) return [];

  try {
    const result = await db.query(
      `SELECT
        agent_id,
        agent_name,
        COUNT(*) as total_attempts,
        COUNT(*) FILTER (WHERE status = 'completed' AND (result->'validation'->>'passed')::boolean = true) as tasks_completed,
        ROUND(AVG(CASE WHEN status = 'completed' AND (result->'validation'->>'passed')::boolean = true THEN duration_ms END)) as avg_duration_ms,
        ROUND(AVG(CASE WHEN status = 'completed' AND (result->'validation'->>'passed')::boolean = true THEN (result->>'content_length')::int END)) as content_length_avg,
        COUNT(DISTINCT task_type) as unique_task_types,
        MIN(created_at) as first_seen,
        MAX(created_at) as last_active,
        COUNT(DISTINCT DATE(created_at)) as days_active
       FROM execution_history
       WHERE agent_id != 'anonymous' AND agent_id IS NOT NULL
       GROUP BY agent_id, agent_name
       HAVING COUNT(*) >= 3
       ORDER BY tasks_completed DESC, total_attempts DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows.map(row => {
      const totalAttempts = parseInt(row.total_attempts);
      const completed = parseInt(row.tasks_completed);
      const successRate = totalAttempts > 0 ? completed / totalAttempts : 0;

      const stats = {
        total_attempts: totalAttempts,
        tasks_completed: completed,
        success_rate: Math.round(successRate * 100) / 100,
        avg_duration_ms: row.avg_duration_ms ? parseInt(row.avg_duration_ms) : null,
        content_length_avg: row.content_length_avg ? parseInt(row.content_length_avg) : null,
        unique_task_types: parseInt(row.unique_task_types),
        first_seen: row.first_seen,
        last_active: row.last_active,
        days_active: parseInt(row.days_active)
      };

      return {
        agent_id: row.agent_id,
        agent_name: row.agent_name || row.agent_id,
        tier: computeTier(stats),
        score: computeScore(stats),
        stats
      };
    }).sort((a, b) => b.score - a.score);
  } catch (err) {
    console.error('[reputation] Leaderboard query failed:', err.message);
    return [];
  }
}

// Reputation-aware rate limit adjustment (optional, non-blocking)
// Returns a multiplier: < 1.0 means relaxed limits, > 1.0 means stricter
// Unknown/new agents get standard limits (multiplier = 1.0)
function getRateLimitMultiplier(reputationTier) {
  switch (reputationTier) {
    case 'veteran': return 0.7;   // 30% more generous
    case 'trusted': return 0.85;  // 15% more generous
    case 'reliable': return 1.0;  // standard
    case 'novice': return 1.0;    // standard
    case 'unknown': return 1.0;   // standard (zero barrier)
    default: return 1.0;
  }
}

module.exports = {
  getAgentReputation,
  getReputationLeaderboard,
  getRateLimitMultiplier,
  REPUTATION_TIERS,
  computeTier,
  computeScore
};
