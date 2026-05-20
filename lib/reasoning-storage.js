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
        verifications JSONB NOT NULL DEFAULT '[]',
        cited_by JSONB NOT NULL DEFAULT '[]',
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
    // Add verifications column if it doesn't exist (migration for existing tables)
    await client.query(`
      ALTER TABLE reasoning_objects ADD COLUMN IF NOT EXISTS verifications JSONB NOT NULL DEFAULT '[]';
    `);
    // Add cited_by column if it doesn't exist (migration for existing tables)
    await client.query(`
      ALTER TABLE reasoning_objects ADD COLUMN IF NOT EXISTS cited_by JSONB NOT NULL DEFAULT '[]';
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

// Search reasoning objects by problem similarity (keyword-based + full-text)
async function searchReasoning(params) {
  await ensureTable();
  const db = getPool();
  const conditions = [];
  const values = [];
  let idx = 1;

  // Keyword search on problem_statement and solution summary
  let hasTextSearch = false;
  let searchTerms = [];
  if (params.problem_statement) {
    // Extract meaningful search terms (3+ chars)
    searchTerms = params.problem_statement
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(t => t.length > 2);

    if (searchTerms.length > 0) {
      hasTextSearch = true;
      // Build ILIKE conditions for each term
      const termConditions = searchTerms.map((term, i) => {
        const paramIdx = idx + i;
        values.push(`%${term}%`);
        return `(problem_statement ILIKE $${paramIdx} OR COALESCE(solution->>'summary', '') ILIKE $${paramIdx})`;
      }).join(' OR ');

      conditions.push(`(${termConditions})`);
      idx += searchTerms.length;
    }
  }

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
  if (params.min_consensus_score) {
    conditions.push(`(solution->>'consensus_score')::float >= $${idx++}`);
    values.push(parseFloat(params.min_consensus_score));
  }
  if (params.has_solution === true) {
    conditions.push(`solution IS NOT NULL`);
  }
  if (params.tags && Array.isArray(params.tags)) {
    for (const tag of params.tags) {
      conditions.push(`meta->>'tags' LIKE $${idx++}`);
      values.push(`%${tag}%`);
    }
  }

  const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
  const limit = Math.min(parseInt(params.limit) || 20, 100);

  // Build query with relevance ranking
  let query;
  let queryParams;

  if (hasTextSearch) {
    // Relevance ranking: problem_statement matches weighted higher than solution matches
    const problemRanks = searchTerms.map((term, i) => {
      const paramIdx = 1 + i;
      return `CASE WHEN problem_statement ILIKE $${paramIdx} THEN 3 ELSE 0 END`;
    }).join(' + ');
    
    const solutionRanks = searchTerms.map((term, i) => {
      const paramIdx = 1 + i;
      return `CASE WHEN COALESCE(solution->>'summary', '') ILIKE $${paramIdx} THEN 1 ELSE 0 END`;
    }).join(' + ');

    query = `SELECT id, problem_id, problem_statement, context, solution, meta, created_at,
        (${problemRanks} + ${solutionRanks}) as search_rank
        FROM reasoning_objects ${where}
        ORDER BY search_rank DESC,
                 (meta->>'success_rate')::float DESC NULLS LAST,
                 CASE WHEN solution IS NOT NULL THEN 0 ELSE 1 END,
                 created_at DESC
        LIMIT $${idx}`;
    queryParams = [...values, limit];
  } else {
    query = `SELECT id, problem_id, problem_statement, context, solution, meta, created_at, 0 as search_rank
       FROM reasoning_objects ${where}
       ORDER BY CASE WHEN solution IS NOT NULL THEN 0 ELSE 1 END,
                (meta->>'success_rate')::float DESC NULLS LAST,
                created_at DESC
       LIMIT $${idx}`;
    queryParams = [...values, limit];
  }

  const result = await db.query(query, queryParams);

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

// Verify a reasoning object
async function verifyReasoning(id, verification) {
  await ensureTable();
  const db = getPool();

  const current = await db.query(`SELECT verifications FROM reasoning_objects WHERE id = $1`, [id]);
  if (!current.rows[0]) return null;

  const verifications = current.rows[0].verifications || [];
  verifications.push({
    agent_id: verification.agent_id || 'anonymous',
    verdict: verification.verdict,
    confidence: verification.confidence || 0.5,
    comment: verification.comment || '',
    verified_at: new Date().toISOString()
  });

  const verificationCount = verifications.length;
  const verifiedCount = verifications.filter(v => v.verdict === 'verified').length;
  const consensusScore = verificationCount > 0 ? parseFloat((verifiedCount / verificationCount).toFixed(2)) : 0;

  await db.query(`
    UPDATE reasoning_objects
    SET verifications = $1,
        meta = jsonb_set(jsonb_set(meta, '{verification_count}', $2::jsonb), '{consensus_score}', $3::jsonb),
        updated_at = NOW()
    WHERE id = $4
  `, [
    JSON.stringify(verifications),
    JSON.stringify(verificationCount),
    JSON.stringify(consensusScore),
    id
  ]);

  return { verification_count: verificationCount, consensus_score: consensusScore };
}

// Get verifications for a reasoning object
async function getVerifications(id) {
  await ensureTable();
  const db = getPool();
  const result = await db.query(`SELECT verifications, meta FROM reasoning_objects WHERE id = $1`, [id]);
  if (!result.rows[0]) return null;
  return {
    verifications: result.rows[0].verifications || [],
    consensus_score: result.rows[0].meta?.consensus_score || 0,
    verification_count: result.rows[0].meta?.verification_count || 0
  };
}

// Add a citation to a reasoning object
async function addCitation(id, citation) {
  await ensureTable();
  const db = getPool();

  const current = await db.query(`SELECT cited_by FROM reasoning_objects WHERE id = $1`, [id]);
  if (!current.rows[0]) return null;

  const citedBy = current.rows[0].cited_by || [];
  citedBy.push({
    citing_agent: citation.citing_agent || 'anonymous',
    citing_task: citation.citing_task || '',
    cited_at: new Date().toISOString()
  });

  const citationCount = citedBy.length;

  await db.query(`
    UPDATE reasoning_objects
    SET cited_by = $1,
        meta = jsonb_set(meta, '{citation_count}', $2::jsonb),
        updated_at = NOW()
    WHERE id = $3
  `, [
    JSON.stringify(citedBy),
    JSON.stringify(citationCount),
    id
  ]);

  return { citation_count: citationCount };
}

// Get citations for a reasoning object
async function getCitations(id) {
  await ensureTable();
  const db = getPool();
  const result = await db.query(`SELECT cited_by, meta FROM reasoning_objects WHERE id = $1`, [id]);
  if (!result.rows[0]) return null;
  return {
    cited_by: result.rows[0].cited_by || [],
    citation_count: result.rows[0].meta?.citation_count || 0
  };
}

// Get recently active reasoning objects (recently verified or cited)
async function getRecentlyActive(limit = 10) {
  await ensureTable();
  const db = getPool();

  const query = `SELECT id, problem_id, problem_statement, context, solution, meta, created_at, updated_at,
        (meta->>'success_rate')::float as success_rate,
        (meta->>'citation_count')::int as citation_count,
        (meta->>'verification_count')::int as verification_count
        FROM reasoning_objects
        WHERE solution IS NOT NULL
        ORDER BY updated_at DESC
        LIMIT $1`;

  const result = await db.query(query, [limit]);

  return result.rows.map(row => ({
    id: row.id,
    problem_id: row.problem_id,
    problem_statement: row.problem_statement,
    context: row.context,
    solution_summary: row.solution?.summary || null,
    success_rate: row.meta?.success_rate || null,
    consensus_score: row.solution?.consensus_score || null,
    citation_count: row.citation_count || 0,
    verification_count: row.verification_count || 0,
    total_attempts: row.meta?.total_attempts || 0,
    updated_at: row.updated_at
  }));
}

// Get popular tags across all reasoning objects
async function getPopularTags(limit = 20) {
  await ensureTable();
  const db = getPool();

  const result = await db.query(`
    SELECT jsonb_array_elements_text(meta->'tags') as tag, COUNT(*) as count
    FROM reasoning_objects
    WHERE meta->'tags' IS NOT NULL
    GROUP BY tag
    ORDER BY count DESC
    LIMIT $1
  `, [limit]);

  return result.rows.map(row => ({ tag: row.tag, count: parseInt(row.count) }));
}

// Recommend reasoning objects for a given task
async function recommendForTask(params) {
  await ensureTable();
  const db = getPool();
  const conditions = [];
  const values = [];
  let idx = 1;

  // Must have a solution
  conditions.push(`solution IS NOT NULL`);

  // Filter by domain if provided
  if (params.domain) {
    conditions.push(`context->>'domain' = $${idx++}`);
    values.push(params.domain);
  }

  // Filter by difficulty if provided
  if (params.difficulty) {
    conditions.push(`context->>'difficulty' = $${idx++}`);
    values.push(params.difficulty);
  }

  // Prefer high success rate and consensus
  const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
  const limit = Math.min(parseInt(params.limit) || 5, 20);

  const query = `SELECT id, problem_id, problem_statement, context, solution, meta, created_at,
        (meta->>'success_rate')::float as success_rate,
        (solution->>'consensus_score')::float as consensus
        FROM reasoning_objects ${where}
        ORDER BY 
          CASE WHEN (solution->>'consensus_score')::float > 0.9 THEN 0 ELSE 1 END,
          (meta->>'success_rate')::float DESC,
          created_at DESC
        LIMIT $${idx}`;

  const result = await db.query(query, [...values, limit]);

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

module.exports = {
  ensureTable,
  saveReasoning,
  searchReasoning,
  getReasoning,
  getByProblemId,
  getFailures,
  addAttempt,
  getReasoningStats,
  verifyReasoning,
  getVerifications,
  addCitation,
  getCitations,
  recommendForTask,
  getRecentlyActive,
  getPopularTags
};
