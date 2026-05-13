// /api/execution-history — Persistent execution records via PostgreSQL
// Stores and queries execution traces across serverless cold starts

const { Pool } = require('pg');

// Lazy-init pool (survives across warm invocations)
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

// Auto-create table on first use
let tableReady = false;
async function ensureTable() {
  if (tableReady) return;
  const client = await getPool().connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS execution_history (
        execution_id VARCHAR(64) PRIMARY KEY,
        task_id VARCHAR(128) NOT NULL,
        agent_id VARCHAR(128),
        agent_name VARCHAR(128),
        task_type VARCHAR(64),
        provider VARCHAR(32),
        model VARCHAR(128),
        status VARCHAR(32) NOT NULL DEFAULT 'pending',
        tokens_used INTEGER DEFAULT 0,
        content_length INTEGER DEFAULT 0,
        error TEXT,
        execution_log JSONB,
        result JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMPTZ,
        duration_ms INTEGER
      );
      CREATE INDEX IF NOT EXISTS idx_exec_task ON execution_history(task_id);
      CREATE INDEX IF NOT EXISTS idx_exec_agent ON execution_history(agent_id);
      CREATE INDEX IF NOT EXISTS idx_exec_status ON execution_history(status);
      CREATE INDEX IF NOT EXISTS idx_exec_created ON execution_history(created_at DESC);
    `);
    tableReady = true;
  } finally {
    client.release();
  }
}

// Save execution record
async function saveExecution(exec) {
  await ensureTable();
  const db = getPool();
  await db.query(`
    INSERT INTO execution_history (
      execution_id, task_id, agent_id, agent_name, task_type,
      provider, model, status, tokens_used, content_length, error,
      execution_log, result, created_at, completed_at, duration_ms
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    ON CONFLICT (execution_id) DO UPDATE SET
      status = EXCLUDED.status,
      tokens_used = EXCLUDED.tokens_used,
      content_length = EXCLUDED.content_length,
      error = EXCLUDED.error,
      execution_log = EXCLUDED.execution_log,
      result = EXCLUDED.result,
      completed_at = EXCLUDED.completed_at,
      duration_ms = EXCLUDED.duration_ms
  `, [
    exec.execution_id,
    exec.task_id,
    exec.agent?.id || null,
    exec.agent?.name || null,
    exec.task_canonical?.task_type || null,
    exec.execution?.llm?.provider || null,
    exec.execution?.llm?.model || null,
    exec.execution?.status || 'pending',
    exec.execution?.llm?.usage?.total_tokens || 0,
    exec.output?.content_length || 0,
    exec.execution?.error || null,
    JSON.stringify(exec.execution?.log || []),
    JSON.stringify(exec.output || {}),
    exec.execution?.claimed_at || new Date().toISOString(),
    exec.execution?.completed_at || null,
    exec.execution?.duration_ms || null
  ]);
}

// Query execution history
async function queryExecutions(params) {
  await ensureTable();
  const db = getPool();
  const conditions = [];
  const values = [];
  let idx = 1;

  if (params.task_id) {
    conditions.push(`task_id = $${idx++}`);
    values.push(params.task_id);
  }
  if (params.agent_id) {
    conditions.push(`agent_id = $${idx++}`);
    values.push(params.agent_id);
  }
  if (params.status) {
    conditions.push(`status = $${idx++}`);
    values.push(params.status);
  }
  if (params.provider) {
    conditions.push(`provider = $${idx++}`);
    values.push(params.provider);
  }

  const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
  const limit = Math.min(parseInt(params.limit) || 50, 200);
  const offset = parseInt(params.offset) || 0;

  const result = await db.query(
    `SELECT execution_id, task_id, agent_id, agent_name, task_type, provider, model,
            status, tokens_used, content_length, error, created_at, completed_at, duration_ms
     FROM execution_history ${where}
     ORDER BY created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...values, limit, offset]
  );

  const countResult = await db.query(`SELECT COUNT(*) as total FROM execution_history ${where}`, values);

  return {
    executions: result.rows,
    total: parseInt(countResult.rows[0]?.total || 0),
    limit,
    offset
  };
}

// Get single execution with full result
async function getExecution(executionId) {
  await ensureTable();
  const db = getPool();
  const result = await db.query(
    `SELECT * FROM execution_history WHERE execution_id = $1`,
    [executionId]
  );
  return result.rows[0] || null;
}

module.exports = { saveExecution, queryExecutions, getExecution, ensureTable };
