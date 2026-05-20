// /api/reasoning — Reasoning Object storage and search
// Layer 3: AI Reasoning Internet — captures how problems were solved, not just what was done

const { getPool } = require('./db');

let tableReady = false;
async function ensureTable() {
  if (tableReady) return;
  const pool = getPool();
  if (!pool) return;
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS reasoning_objects (
        id VARCHAR(64) PRIMARY KEY,
        problem_id VARCHAR(128) NOT NULL,
        problem_statement TEXT NOT NULL,
        context JSONB NOT NULL DEFAULT '{}',
        attempts JSONB NOT NULL DEFAULT '[]',
        solution JSONB,
        meta JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_reasoning_problem ON reasoning_objects(problem_id);
      CREATE INDEX IF NOT EXISTS idx_reasoning_domain ON reasoning_objects((context->>'domain'));
      CREATE INDEX IF NOT EXISTS idx_reasoning_difficulty ON reasoning_objects((context->>'difficulty'));
      CREATE INDEX IF NOT EXISTS idx_reasoning_success ON reasoning_objects((meta->>'success_rate'));
      CREATE INDEX IF NOT EXISTS idx_reasoning_created ON reasoning_objects(created_at DESC);
    `);
    tableReady = true;
  } finally {
    client.release();
  }
}

// Save or update a reasoning object
async function saveReasoning(ro) {
  await ensureTable();
  const db = getPool();
  await db.query(`
    INSERT INTO reasoning_objects (id, problem_id, problem_statement, context, attempts, solution, meta, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    ON CONFLICT (id) DO UPDATE SET
      problem_statement = EXCLUDED.problem_statement,
      context = EXCLUDED.context,
      attempts = EXCLUDED.attempts,
      solution = EXCLUDED.solution,
      meta = EXCLUDED.meta,
      updated_at = NOW()
  `, [
    ro.id,
    ro.problem_id,
    ro.problem_statement,
    JSON.stringify(ro.context || {}),
    JSON.stringify(ro.attempts || []),
    ro.solution ? JSON.stringify(ro.solution) : null,
    JSON.stringify(ro.meta || {})
  ]);
}

// Search reasoning objects by problem similarity (keyword-based)
async function searchReasoning(params) {
  await ensureTable();
  const db = getPool();
  const conditions = [];
  const values = [];
  let idx = 1;

  if (params.problem_id) {
    conditions.push(`problem_id = $${idx++}`);
    values.push(params.problem_id);
  }
  if (params.domain) {
    conditions.push(`context->>'domain' = $${idx++}`);
    values.push(params.domain);
  }
  if (params.difficulty) {
    conditions.push(`context->>'difficulty' = $${idx++}`);
    values.push(params.difficulty);
  }
  if (params.capability) {
    conditions.push(`context->>'required_capabilities' LIKE $${idx++}`);
    values.push(`%${params.capability}%`);
  }
  if (params.min_success_rate) {
    conditions.push(`(meta->>'success_rate')::float >= $${idx++}`);
    values.push(parseFloat(params.min_success_rate));
  }

  const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
  const limit = Math.min(parseInt(params.limit) || 20, 100);

  const result = await db.query(
    `SELECT id, problem_id, problem_statement, context, solution, meta, created_at
     FROM reasoning_objects ${where}
     ORDER BY CASE WHEN solution IS NOT NULL THEN 0 ELSE 1 END,
              (meta->>'success_rate')::float DESC NULLS LAST,
              created_at DESC
     LIMIT $${idx++}`,
    [...values, limit]
  );

  return result.rows.map(row => ({
    id: row.id,
    problem_id: row.problem_id,
    problem_statement: row.problem_statement,
    context: row.context,
    solution_summary: row.solution?.summary || null,
    success_rate: row.meta?.success_rate || null,
    consensus_score: row.solution?.consensus_score || null,
    total_attempts: row.meta?.total_attempts || 0,
    created_at: row.created_at
  }));
}

// Get full reasoning object by ID
async function getReasoning(id) {
  await ensureTable();
  const db = getPool();
  const result = await db.query(`SELECT * FROM reasoning_objects WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

// Get reasoning objects by problem_id
async function getByProblemId(problemId) {
  await ensureTable();
  const db = getPool();
  const result = await db.query(
    `SELECT * FROM reasoning_objects WHERE problem_id = $1 ORDER BY created_at DESC`,
    [problemId]
  );
  return result.rows;
}

// Browse failures by type
async function getFailures(failureType, limit = 50) {
  await ensureTable();
  const db = getPool();
  const result = await db.query(`
    SELECT id, problem_id, problem_statement, context, attempts, meta, created_at
    FROM reasoning_objects
    WHERE attempts @> $1
    ORDER BY created_at DESC
    LIMIT $2
  `, [JSON.stringify([{ failure_type: failureType }]), limit]);

  return result.rows.map(row => ({
    id: row.id,
    problem_id: row.problem_id,
    problem_statement: row.problem_statement,
    context: row.context,
    failed_attempts: (row.attempts || []).filter(a => a.failure_type === failureType),
    meta: row.meta,
    created_at: row.created_at
  }));
}

// Add an attempt to an existing reasoning object
async function addAttempt(reasoningId, attempt) {
  await ensureTable();
  const db = getPool();

  // Get current attempts
  const current = await db.query(`SELECT attempts FROM reasoning_objects WHERE id = $1`, [reasoningId]);
  if (!current.rows[0]) return null;

  const attempts = current.rows[0].attempts || [];
  attempts.push(attempt);

  // Update meta
  const totalAttempts = attempts.length;
  const successCount = attempts.filter(a => a.outcome === 'success').length;
  const successRate = totalAttempts > 0 ? parseFloat((successCount / totalAttempts).toFixed(2)) : 0;
  const totalTokens = attempts.reduce((sum, a) => sum + (a.execution_cost?.tokens_used || 0), 0);

  await db.query(`
    UPDATE reasoning_objects
    SET attempts = $1,
        meta = jsonb_set(meta, '{total_attempts}', $2::jsonb),
        meta = jsonb_set(meta, '{success_rate}', $3::jsonb),
        meta = jsonb_set(meta, '{total_tokens}', $4::jsonb),
        updated_at = NOW()
    WHERE id = $5
  `, [
    JSON.stringify(attempts),
    JSON.stringify(totalAttempts),
    JSON.stringify(successRate),
    JSON.stringify(totalTokens),
    reasoningId
  ]);

  return { total_attempts: totalAttempts, success_rate: successRate };
}

// Stats
async function getReasoningStats() {
  await ensureTable();
  const db = getPool();

  const [total, byDomain, byDifficulty, avgSuccessRate] = await Promise.all([
    db.query(`SELECT COUNT(*) FROM reasoning_objects`),
    db.query(`SELECT context->>'domain' as domain, COUNT(*) FROM reasoning_objects GROUP BY context->>'domain' ORDER BY COUNT(*) DESC`),
    db.query(`SELECT context->>'difficulty' as difficulty, COUNT(*) FROM reasoning_objects GROUP BY context->>'difficulty' ORDER BY COUNT(*) DESC`),
    db.query(`SELECT AVG((meta->>'success_rate')::float) as avg_rate FROM reasoning_objects WHERE meta->>'success_rate' IS NOT NULL`)
  ]);

  return {
    total: parseInt(total.rows[0]?.count || 0),
    by_domain: byDomain.rows,
    by_difficulty: byDifficulty.rows,
    avg_success_rate: parseFloat(avgSuccessRate.rows[0]?.avg_rate || 0).toFixed(2)
  };
}

module.exports = {
  ensureTable,
  saveReasoning,
  searchReasoning,
  getReasoning,
  getByProblemId,
  getFailures,
  addAttempt,
  getReasoningStats
};
