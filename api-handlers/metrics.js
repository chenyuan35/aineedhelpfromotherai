// /api/metrics — Runtime statistics for AI dashboard consumption
// Queries PostgreSQL for execution stats, task lifecycle, provider breakdown

const { queryExecutions, queryTaskLifecycle } = require('../lib/execution-history');
const { getPool } = require('../lib/db');

async function getMetrics(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=60');

  try {
    const db = getPool();

    // 1. Overall execution stats
    const execStats = await db.query(`
      SELECT
        COUNT(*) as total_executions,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
        COUNT(*) FILTER (WHERE status = 'failed') as failed_count,
        ROUND(AVG(duration_ms) FILTER (WHERE duration_ms IS NOT NULL)) as avg_duration_ms,
        ROUND(AVG(tokens_used) FILTER (WHERE tokens_used > 0)) as avg_tokens,
        SUM(tokens_used) as total_tokens,
        MIN(created_at) as first_execution,
        MAX(created_at) as last_execution
      FROM execution_history
    `);

    // 2. By provider breakdown
    const providerStats = await db.query(`
      SELECT
        provider,
        COUNT(*) as count,
        COUNT(*) FILTER (WHERE status = 'completed') as success_count,
        COUNT(*) FILTER (WHERE status = 'failed') as fail_count,
        ROUND(AVG(duration_ms) FILTER (WHERE duration_ms IS NOT NULL)) as avg_duration_ms,
        ROUND(AVG(tokens_used) FILTER (WHERE tokens_used > 0)) as avg_tokens
      FROM execution_history
      GROUP BY provider
      ORDER BY count DESC
    `);

    // 3. By task type distribution
    const taskTypeStats = await db.query(`
      SELECT
        task_type,
        COUNT(*) as count,
        COUNT(*) FILTER (WHERE status = 'completed') as success_count,
        COUNT(*) FILTER (WHERE status = 'failed') as fail_count
      FROM execution_history
      GROUP BY task_type
      ORDER BY count DESC
    `);

    // 4. By agent breakdown
    const agentStats = await db.query(`
      SELECT
        agent_id,
        agent_name,
        COUNT(*) as execution_count,
        COUNT(*) FILTER (WHERE status = 'completed') as success_count,
        COUNT(*) FILTER (WHERE status = 'failed') as fail_count,
        ROUND(AVG(duration_ms) FILTER (WHERE duration_ms IS NOT NULL)) as avg_duration_ms
      FROM execution_history
      GROUP BY agent_id, agent_name
      ORDER BY execution_count DESC
    `);

    // 5. Lifecycle distribution
    const lifecycleStats = await db.query(`
      SELECT status, COUNT(*) as count
      FROM task_lifecycle
      GROUP BY status
      ORDER BY count DESC
    `);

    // 6. Recent activity (last 24h)
    const recentActivity = await db.query(`
      SELECT
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as executions_24h,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour') as executions_1h,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as executions_7d
      FROM execution_history
    `);

    // Compute derived metrics
    const stats = execStats.rows[0] || {};
    const total = parseInt(stats.total_executions) || 0;
    const completed = parseInt(stats.completed_count) || 0;
    const failed = parseInt(stats.failed_count) || 0;
    const successRate = total > 0 ? Math.round((completed / total) * 100) / 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          total_executions: total,
          completed: completed,
          failed: failed,
          success_rate: successRate,
          avg_duration_ms: parseInt(stats.avg_duration_ms) || 0,
          avg_tokens_per_execution: parseInt(stats.avg_tokens) || 0,
          total_tokens_consumed: parseInt(stats.total_tokens) || 0,
          first_execution: stats.first_execution,
          last_execution: stats.last_execution
        },
        activity: {
          executions_1h: parseInt(recentActivity.rows[0]?.executions_1h) || 0,
          executions_24h: parseInt(recentActivity.rows[0]?.executions_24h) || 0,
          executions_7d: parseInt(recentActivity.rows[0]?.executions_7d) || 0
        },
        by_provider: providerStats.rows.map(r => ({
          provider: r.provider,
          count: parseInt(r.count),
          success_count: parseInt(r.success_count),
          fail_count: parseInt(r.fail_count),
          success_rate: parseInt(r.count) > 0 ? Math.round((parseInt(r.success_count) / parseInt(r.count)) * 100) / 100 : 0,
          avg_duration_ms: parseInt(r.avg_duration_ms) || 0,
          avg_tokens: parseInt(r.avg_tokens) || 0
        })),
        by_task_type: taskTypeStats.rows.map(r => ({
          task_type: r.task_type,
          count: parseInt(r.count),
          success_count: parseInt(r.success_count),
          fail_count: parseInt(r.fail_count)
        })),
        by_agent: agentStats.rows.map(r => ({
          agent_id: r.agent_id,
          agent_name: r.agent_name,
          execution_count: parseInt(r.execution_count),
          success_count: parseInt(r.success_count),
          fail_count: parseInt(r.fail_count),
          avg_duration_ms: parseInt(r.avg_duration_ms) || 0
        })),
        lifecycle_distribution: lifecycleStats.rows.map(r => ({
          status: r.status,
          count: parseInt(r.count)
        }))
      },
      meta: {
        endpoint: '/api/metrics',
        description: 'Runtime statistics for AI dashboard and agent consumption',
        format: 'machine_readable_json'
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Metrics query failed',
      details: err.message
    });
  }
}

module.exports = (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(204).end();
  }
  return getMetrics(req, res);
};
