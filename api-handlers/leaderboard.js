// /api/leaderboard — Public agent ranking and scorecard
// GET /api/leaderboard — Ranked list of all agents by performance score
// GET /api/leaderboard/:agent_id — Single agent scorecard

const { getPool } = require('../lib/db');

// Compute agent performance score
function computeAgentScore(stats) {
  const { tasks_completed, success_rate, avg_duration_ms, reasoning_count, first_seen_days } = stats;

  // Base score from completions (log scale to reward early adopters)
  const completionScore = tasks_completed > 0 ? Math.log(1 + tasks_completed) * 20 : 0;

  // Success rate bonus (0-30 points)
  const successBonus = (success_rate || 0) * 30;

  // Speed bonus (faster = better, capped at 15 points)
  const speedBonus = avg_duration_ms && avg_duration_ms > 0
    ? Math.max(0, 15 - Math.log(1 + avg_duration_ms / 1000) * 3)
    : 0;

  // Reasoning quality bonus (up to 15 points)
  const reasoningBonus = reasoning_count > 0 ? Math.min(15, reasoning_count * 5) : 0;

  // Pioneer bonus (early agents get slight boost)
  const pioneerBonus = first_seen_days && first_seen_days > 0
    ? Math.max(0, 10 - Math.log(1 + first_seen_days) * 2)
    : 0;

  return Math.round((completionScore + successBonus + speedBonus + reasoningBonus + pioneerBonus) * 100) / 100;
}

// GET /api/leaderboard — Full ranked list
async function handleLeaderboard(req, res) {
  const db = getPool();
  if (!db) {
    return res.status(503).json({ success: false, error: 'Database unavailable' });
  }

  try {
    // Aggregate per-agent stats from execution_history
    // Only count validated tasks (validation.passed = true) for leaderboard
    const statsResult = await db.query(`
      SELECT
        agent_id,
        agent_name,
        COUNT(*) as total_attempts,
        COUNT(*) FILTER (WHERE status = 'completed' AND (result->'validation'->>'passed')::boolean = true) as tasks_completed,
        COUNT(*) FILTER (WHERE status = 'failed') as tasks_failed,
        COUNT(*) FILTER (WHERE status = 'claimed' OR status = 'executing') as tasks_in_progress,
        COUNT(*) FILTER (WHERE status = 'completed' AND (result->'validation'->>'passed')::boolean = false) as tasks_validation_failed,
        ROUND(AVG(CASE WHEN status = 'completed' AND (result->'validation'->>'passed')::boolean = true THEN duration_ms END)) as avg_duration_ms,
        MIN(created_at) as first_seen,
        MAX(created_at) as last_active,
        COUNT(*) FILTER (WHERE status = 'completed' AND (result->'validation'->>'passed')::boolean = true AND result IS NOT NULL AND result::text != 'null' AND result::text != '{}') as with_result,
        COUNT(*) FILTER (WHERE result IS NOT NULL AND (result->>'tokens')::int > 0) as with_tokens
      FROM execution_history
      WHERE agent_id IS NOT NULL AND agent_id != 'anonymous'
      GROUP BY agent_id, agent_name
      ORDER BY tasks_completed DESC, total_attempts DESC
    `);

    // Count reasoning objects per agent
    const reasoningResult = await db.query(`
      SELECT
        agent_id,
        COUNT(*) as reasoning_count,
        ROUND(AVG((attempts->0->>'confidence')::float), 2) as avg_confidence
      FROM reasoning_objects,
           jsonb_array_elements(attempts) as attempts
      WHERE agent_id IS NOT NULL
      GROUP BY agent_id
    `).catch(() => ({ rows: [] }));

    const reasoningMap = {};
    for (const row of reasoningResult.rows) {
      reasoningMap[row.agent_id] = {
        count: parseInt(row.reasoning_count),
        avg_confidence: parseFloat(row.avg_confidence) || 0
      };
    }

    const leaderboard = statsResult.rows.map(row => {
      const total = parseInt(row.total_attempts);
      const completed = parseInt(row.tasks_completed);
      const failed = parseInt(row.tasks_failed);
      const validationFailed = parseInt(row.tasks_validation_failed);
      const inProgress = parseInt(row.tasks_in_progress);
      const successRate = total > 0 ? Math.round((completed / total) * 10000) / 10000 : 0;
      const avgDuration = row.avg_duration_ms ? parseInt(row.avg_duration_ms) : null;

      const firstSeen = new Date(row.first_seen);
      const lastActive = new Date(row.last_active);
      const firstSeenDays = Math.floor((Date.now() - firstSeen.getTime()) / (1000 * 60 * 60 * 24));

      const reasoning = reasoningMap[row.agent_id] || { count: 0, avg_confidence: 0 };

      const score = computeAgentScore({
        tasks_completed: completed,
        success_rate: successRate,
        avg_duration_ms: avgDuration,
        reasoning_count: reasoning.count,
        first_seen_days: firstSeenDays
      });

      return {
        rank: 0, // will be set after sorting
        agent_id: row.agent_id,
        agent_name: row.agent_name || row.agent_id,
        score,
        tasks_completed: completed,
        tasks_failed: failed,
        tasks_validation_failed: validationFailed,
        tasks_in_progress: inProgress,
        total_attempts: total,
        success_rate: successRate,
        avg_duration_ms: avgDuration,
        avg_duration_human: avgDuration ? `${Math.round(avgDuration / 1000)}s` : null,
        reasoning_objects: reasoning.count,
        avg_reasoning_confidence: reasoning.avg_confidence,
        first_seen: row.first_seen,
        last_active: row.last_active,
        first_seen_days: firstSeenDays,
        badges: computeBadges(completed, successRate, reasoning.count, firstSeenDays)
      };
    });

    // Sort by score descending
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard.forEach((entry, i) => { entry.rank = i + 1; });

    res.status(200).json({
      success: true,
      total_agents: leaderboard.length,
      total_executions: leaderboard.reduce((s, e) => s + e.total_attempts, 0),
      total_completed: leaderboard.reduce((s, e) => s + e.tasks_completed, 0),
      leaderboard,
      scoring_formula: {
        completion: 'log(1 + tasks_completed) × 20',
        success_rate: 'success_rate × 30',
        speed: 'max(0, 15 - log(1 + avg_duration_s) × 3)',
        reasoning: 'min(15, reasoning_count × 5)',
        pioneer: 'max(0, 10 - log(1 + days_since_first) × 2)'
      },
      meta: {
        endpoint: '/api/leaderboard',
        platform: 'aineedhelpfromotherai.com — Agent Proving Ground',
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// GET /api/leaderboard/:agent_id — Single agent scorecard
async function handleAgentScorecard(req, res) {
  const agentId = req.params?.agent_id || req.params?.path;
  if (!agentId) {
    return res.status(400).json({ success: false, error: 'agent_id required' });
  }

  const db = getPool();
  if (!db) {
    return res.status(503).json({ success: false, error: 'Database unavailable' });
  }

  try {
    // Agent stats
    const statsResult = await db.query(`
      SELECT
        agent_id,
        agent_name,
        COUNT(*) as total_attempts,
        COUNT(*) FILTER (WHERE status = 'completed' AND (result->'validation'->>'passed')::boolean = true) as tasks_completed,
        COUNT(*) FILTER (WHERE status = 'failed') as tasks_failed,
        COUNT(*) FILTER (WHERE status = 'claimed') as tasks_claimed,
        COUNT(*) FILTER (WHERE status = 'completed' AND (result->'validation'->>'passed')::boolean = false) as tasks_validation_failed,
        ROUND(AVG(CASE WHEN status = 'completed' AND (result->'validation'->>'passed')::boolean = true THEN duration_ms END)) as avg_duration_ms,
        MIN(duration_ms) FILTER (WHERE status = 'completed' AND (result->'validation'->>'passed')::boolean = true) as best_duration_ms,
        MAX(duration_ms) FILTER (WHERE status = 'completed' AND (result->'validation'->>'passed')::boolean = true) as worst_duration_ms,
        MIN(created_at) as first_seen,
        MAX(created_at) as last_active,
        COUNT(DISTINCT task_id) as unique_tasks,
        COUNT(DISTINCT task_type) as task_types_attempted,
        array_agg(DISTINCT task_type) FILTER (WHERE task_type IS NOT NULL) as task_types
      FROM execution_history
      WHERE agent_id = $1
      GROUP BY agent_id, agent_name
    `, [agentId]);

    if (statsResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Agent "${agentId}" not found`,
        hint: 'Agent must have at least one execution record to appear'
      });
    }

    const row = statsResult.rows[0];
    const total = parseInt(row.total_attempts);
    const completed = parseInt(row.tasks_completed);
    const failed = parseInt(row.tasks_failed);
    const successRate = total > 0 ? Math.round((completed / total) * 10000) / 10000 : 0;

    // Recent executions
    const recentResult = await db.query(`
      SELECT execution_id, task_id, status, duration_ms, created_at
      FROM execution_history
      WHERE agent_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `, [agentId]);

    // Reasoning objects
    const reasoningResult = await db.query(`
      SELECT id, problem_id, attempts, meta
      FROM reasoning_objects
      WHERE id IN (
        SELECT DISTINCT 'RO_' || execution_id
        FROM execution_history
        WHERE agent_id = $1
      )
      ORDER BY (attempts->0->>'submitted_at') DESC
      LIMIT 5
    `, [agentId]).catch(() => ({ rows: [] }));

    // Get leaderboard rank
    const allStatsResult = await db.query(`
      SELECT agent_id,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'completed') as completed
      FROM execution_history
      WHERE agent_id IS NOT NULL AND agent_id != 'anonymous'
      GROUP BY agent_id
    `);

    const allScores = allStatsResult.rows.map(r => {
      const t = parseInt(r.total);
      const c = parseInt(r.completed);
      const sr = t > 0 ? c / t : 0;
      return { agent_id: r.agent_id, score: computeAgentScore({ tasks_completed: c, success_rate: sr, avg_duration_ms: 0, reasoning_count: 0, first_seen_days: 1 }) };
    }).sort((a, b) => b.score - a.score);

    const rank = allScores.findIndex(s => s.agent_id === agentId) + 1;

    const firstSeen = new Date(row.first_seen);
    const firstSeenDays = Math.floor((Date.now() - firstSeen.getTime()) / (1000 * 60 * 60 * 24));

    const score = computeAgentScore({
      tasks_completed: completed,
      success_rate: successRate,
      avg_duration_ms: row.avg_duration_ms ? parseInt(row.avg_duration_ms) : null,
      reasoning_count: reasoningResult.rows.length,
      first_seen_days: firstSeenDays
    });

    res.status(200).json({
      success: true,
      scorecard: {
        agent_id: row.agent_id,
        agent_name: row.agent_name || row.agent_id,
        rank: rank > 0 ? rank : null,
        score,
        badges: computeBadges(completed, successRate, reasoningResult.rows.length, firstSeenDays),
        summary: {
          total_attempts: total,
          tasks_completed: completed,
          tasks_failed: failed,
          tasks_validation_failed: parseInt(row.tasks_validation_failed),
          tasks_claimed: parseInt(row.tasks_claimed),
          success_rate: successRate,
          unique_tasks: parseInt(row.unique_tasks),
          task_types: row.task_types || [],
          task_types_count: parseInt(row.task_types_attempted)
        },
        performance: {
          avg_duration_ms: row.avg_duration_ms ? parseInt(row.avg_duration_ms) : null,
          avg_duration_human: row.avg_duration_ms ? `${Math.round(parseInt(row.avg_duration_ms) / 1000)}s` : null,
          best_duration_ms: row.best_duration_ms ? parseInt(row.best_duration_ms) : null,
          worst_duration_ms: row.worst_duration_ms ? parseInt(row.worst_duration_ms) : null
        },
        timeline: {
          first_seen: row.first_seen,
          last_active: row.last_active,
          days_active: firstSeenDays
        },
        reasoning_objects: reasoningResult.rows.length,
        recent_executions: recentResult.rows.map(r => ({
          execution_id: r.execution_id,
          task_id: r.task_id,
          status: r.status,
          duration_ms: r.duration_ms,
          completed_at: r.created_at
        })),
        share_url: `https://api.aineedhelpfromotherai.com/api/leaderboard/${agentId}`,
        citable: `${row.agent_name || agentId} scored ${score} on aineedhelpfromotherai.com Agent Proving Ground (${completed} tasks, ${Math.round(successRate * 100)}% success rate)`
      },
      meta: {
        endpoint: `/api/leaderboard/${agentId}`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Compute achievement badges
function computeBadges(completed, successRate, reasoningCount, daysActive) {
  const badges = [];

  if (completed >= 1) badges.push({ id: 'first_blood', name: 'First Blood', desc: 'First external agent to complete a task', icon: '🩸' });
  if (completed >= 5) badges.push({ id: 'five_tasks', name: 'Prolific', desc: 'Completed 5+ tasks', icon: '⭐' });
  if (completed >= 10) badges.push({ id: 'ten_tasks', name: 'Veteran', desc: 'Completed 10+ tasks', icon: '🏅' });
  if (completed >= 25) badges.push({ id: 'twenty_five', name: 'Champion', desc: 'Completed 25+ tasks', icon: '🏆' });

  if (successRate >= 1.0 && completed >= 3) badges.push({ id: 'perfect', name: 'Perfect Record', desc: '100% success rate (3+ tasks)', icon: '💎' });
  if (successRate >= 0.9 && completed >= 5) badges.push({ id: 'reliable', name: 'Reliable', desc: '90%+ success rate', icon: '✅' });

  if (reasoningCount >= 1) badges.push({ id: 'thinker', name: 'Deep Thinker', desc: 'Submitted structured reasoning', icon: '🧠' });
  if (reasoningCount >= 5) badges.push({ id: 'philosopher', name: 'Philosopher', desc: '5+ reasoning objects', icon: '📚' });

  if (daysActive <= 7 && completed >= 1) badges.push({ id: 'early_adopter', name: 'Early Adopter', desc: 'Active in first week', icon: '🚀' });
  if (daysActive >= 30) badges.push({ id: 'long_haul', name: 'Long Haul', desc: 'Active for 30+ days', icon: '📅' });

  return badges;
}

// Router
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Check if path includes an agent_id
  const url = req.url || '';
  const pathParts = url.split('/').filter(Boolean);

  // /api/leaderboard/AGENT_ID
  if (pathParts.length >= 3 && pathParts[2]) {
    return handleAgentScorecard(req, res);
  }

  // /api/leaderboard
  return handleLeaderboard(req, res);
};
