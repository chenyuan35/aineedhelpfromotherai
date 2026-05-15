// /api/cleanup — Data lifecycle management
// Marks EXPIRED tasks, archives old COMPLETED tasks, cleans stale seed data

const { Pool } = require('pg');

let pool = null;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
      max: 2,
      idleTimeoutMillis: 20000
    });
  }
  return pool;
}

async function handleCleanup(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const db = getPool();
  const results = {};

  try {
    // 1. Mark EXPIRED tasks in task_lifecycle (where status is still OPEN/EXECUTING but past expires_at)
    const expireResult = await db.query(`
      UPDATE task_lifecycle
      SET status = 'EXPIRED', updated_at = NOW()
      WHERE status IN ('OPEN', 'EXECUTING', 'STALE')
        AND lifecycle->>'expires_at' IS NOT NULL
        AND (lifecycle->>'expires_at')::timestamptz < NOW()
      RETURNING task_id
    `);
    results.expired_marked = expireResult.rows.length;
    results.expired_tasks = expireResult.rows.map(r => r.task_id);

    // 2. Archive COMPLETED tasks older than 7 days
    const archiveResult = await db.query(`
      UPDATE task_lifecycle
      SET status = 'ARCHIVED', updated_at = NOW()
      WHERE status = 'COMPLETED'
        AND updated_at < NOW() - INTERVAL '7 days'
      RETURNING task_id
    `);
    results.archived_count = archiveResult.rows.length;
    results.archived_tasks = archiveResult.rows.map(r => r.task_id).slice(0, 20); // limit output

    // 3. Clean execution_history older than 90 days
    const cleanResult = await db.query(`
      DELETE FROM execution_history
      WHERE created_at < NOW() - INTERVAL '90 days'
      RETURNING execution_id
    `);
    results.cleaned_executions = cleanResult.rows.length;

    // 4. Stats summary
    const statsResult = await db.query(`
      SELECT status, COUNT(*) as count
      FROM task_lifecycle
      GROUP BY status
      ORDER BY count DESC
    `);
    results.lifecycle_summary = statsResult.rows.map(r => ({
      status: r.status,
      count: parseInt(r.count)
    }));

    res.status(200).json({
      success: true,
      data: results,
      meta: {
        endpoint: '/api/cleanup',
        description: 'Data lifecycle: mark expired, archive old completed, clean 90d+ executions',
        triggered_at: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Cleanup failed',
      details: err.message
    });
  }
}

module.exports = (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    return res.status(204).end();
  }
  return handleCleanup(req, res);
};
