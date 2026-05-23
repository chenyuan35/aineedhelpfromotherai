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

// Calculate quality score for a reasoning object
function calculateQualityScore(ro) {
  let score = 0;
  const meta = ro.meta || {};
  const solution = ro.solution || {};

  // Has solution (30 points)
  if (solution.summary) score += 30;

  // High success rate (20 points)
  const successRate = parseFloat(meta.success_rate || 0);
  score += successRate * 20;

  // Consensus score (20 points)
  const consensus = parseFloat(solution.consensus_score || 0);
  score += consensus * 20;

  // Multiple attempts show thoroughness (10 points)
  const attempts = parseInt(meta.total_attempts || 0);
  score += Math.min(attempts * 3, 10);

  // Has key insights (10 points)
  if (solution.key_insights && solution.key_insights.length > 0) score += 10;

  // Has reusability info (10 points)
  if (solution.reusability) score += 10;

  return parseFloat(score.toFixed(1));
}

// Get trending reasoning objects (high quality + recent activity)
async function getTrending(limit = 10) {
  await ensureTable();
  const db = getPool();

  const query = `SELECT id, problem_id, problem_statement, context, solution, meta, created_at, updated_at,
        (meta->>'success_rate')::float as success_rate,
        (meta->>'citation_count')::int as citation_count,
        (meta->>'verification_count')::int as verification_count
        FROM reasoning_objects
        WHERE solution IS NOT NULL
        ORDER BY 
          (meta->>'citation_count')::int DESC,
          (solution->>'consensus_score')::float DESC,
          (meta->>'success_rate')::float DESC,
          updated_at DESC
        LIMIT $1`;

  const result = await db.query(query, [limit]);

  return result.rows.map(row => {
    const ro = {
      id: row.id,
      problem_id: row.problem_id,
      problem_statement: row.problem_statement,
      context: row.context,
      solution: row.solution,
      meta: row.meta
    };
    return {
      ...ro,
      solution_summary: row.solution?.summary || null,
      success_rate: row.meta?.success_rate || null,
      consensus_score: row.solution?.consensus_score || null,
      citation_count: row.citation_count || 0,
      verification_count: row.verification_count || 0,
      total_attempts: row.meta?.total_attempts || 0,
      quality_score: calculateQualityScore(ro),
      updated_at: row.updated_at
    };
  }).sort((a, b) => b.quality_score - a.quality_score);
}

// Resolve — reasoning cache layer
// Given a problem, return best matching reasoning if confidence is high enough
async function resolveReasoning(params) {
  await ensureTable();
  const db = getPool();
  const problem = (params.problem_statement || '').toLowerCase();
  if (!problem) return { hit: false, reason: 'no_problem' };

  // Search for matching reasoning objects
  const searchResults = await searchReasoning({
    problem_statement: problem,
    domain: params.domain,
    difficulty: params.difficulty,
    limit: 5
  });

  if (searchResults.length === 0) {
    return { hit: false, reason: 'no_match' };
  }

  // Get full objects for scoring
  const candidates = [];
  for (const sr of searchResults) {
    const full = await getReasoning(sr.id);
    if (full && full.solution) {
      const score = calculateQualityScore(full);
      const successRate = parseFloat(full.meta?.success_rate || 0);
      const consensus = parseFloat(full.solution?.consensus_score || 0);
      candidates.push({
        id: full.id,
        problem_statement: full.problem_statement,
        solution: full.solution,
        context: full.context,
        meta: full.meta,
        quality_score: score,
        success_rate: successRate,
        consensus_score: consensus
      });
    }
  }

  if (candidates.length === 0) {
    return { hit: false, reason: 'no_solution' };
  }

  // Sort by quality score descending
  candidates.sort((a, b) => b.quality_score - a.quality_score);
  const best = candidates[0];

  // Cache hit threshold: quality score >= 50 (out of 100) AND has solution
  const isHit = best.quality_score >= 50 && best.solution;

  if (!isHit) {
    return {
      hit: false,
      reason: 'low_confidence',
      best_match: best.id,
      quality_score: best.quality_score,
      message: 'Found a partial match but confidence is too low. Consider solving and storing the result.'
    };
  }

  // Estimate token savings
  const solutionText = JSON.stringify(best.solution);
  const estimatedTokens = Math.ceil(solutionText.length / 4);
  const reasoningOverhead = Math.ceil(estimatedTokens * 1.5);
  const failedAttemptsAvoided = parseInt(best.meta?.total_attempts || 1) - 1;
  const tokensSavedPerAvoided = 800;
  const estimatedTokenSavings = reasoningOverhead + (failedAttemptsAvoided * tokensSavedPerAvoided);

  return {
    hit: true,
    reasoning_id: best.id,
    problem_statement: best.problem_statement,
    solution_summary: best.solution.summary || '',
    key_insights: best.solution.key_insights || [],
    domain: best.context?.domain || 'unknown',
    difficulty: best.context?.difficulty || 'unknown',
    quality_score: best.quality_score,
    success_rate: best.success_rate,
    consensus_score: best.consensus_score,
    total_attempts: parseInt(best.meta?.total_attempts || 1),
    estimated_token_savings: estimatedTokenSavings,
    message: `Cache HIT. Using ${best.id} saves ~${estimatedTokenSavings} tokens vs solving from scratch.`
  };
}

// Failure check — pre-execution early warning
// Given an approach description, find similar failure patterns
async function failureCheck(params) {
  await ensureTable();
  const db = getPool();
  const approach = (params.approach_description || '').toLowerCase();
  if (!approach) return { risk_score: 0, warnings: [], message: 'No approach provided' };

  // Extract keywords from approach
  const keywords = approach
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 3);

  if (keywords.length === 0) return { risk_score: 0, warnings: [], message: 'Approach too short to analyze' };

  // Search for reasoning objects with failures matching these keywords
  const searchResults = await searchReasoning({
    problem_statement: approach,
    domain: params.domain,
    limit: 10
  });

  const warnings = [];
  let totalRisk = 0;

  for (const sr of searchResults) {
    const full = await getReasoning(sr.id);
    if (!full || !full.attempts) continue;

    // Find failed attempts
    const failedAttempts = (full.attempts || []).filter(a =>
      a.outcome === 'failure' && a.failure_type && a.failure_description
    );

    if (failedAttempts.length === 0) continue;

    // Check if any failure description keyword-matches the approach
    const matchingFailures = failedAttempts.filter(fa => {
      const desc = (fa.failure_description || '').toLowerCase();
      const approachMatch = (full.problem_statement || '').toLowerCase();
      // Count how many keywords appear in failure description or problem statement
      const matchCount = keywords.filter(k =>
        desc.includes(k) || approachMatch.includes(k)
      ).length;
      return matchCount >= Math.min(2, keywords.length);
    });

    if (matchingFailures.length === 0) continue;

    const failureTypes = [...new Set(matchingFailures.map(f => f.failure_type))];
    const riskPerObject = Math.min(matchingFailures.length / Math.max(full.attempts.length, 1), 1);
    totalRisk = Math.max(totalRisk, riskPerObject);

    warnings.push({
      reasoning_id: full.id,
      problem_statement: full.problem_statement,
      failure_count: matchingFailures.length,
      failure_types: failureTypes,
      risk_score: parseFloat(riskPerObject.toFixed(2)),
      failures: matchingFailures.map(f => ({
        failure_type: f.failure_type,
        failure_description: f.failure_description,
        approach: f.approach || '',
        agent: f.agent_id || 'unknown'
      })),
      how_to_avoid: full.solution?.key_insights || ['Review the stored solution for this problem.']
    });
  }

  const overallRisk = warnings.length > 0
    ? parseFloat(Math.min(totalRisk + warnings.length * 0.1, 1).toFixed(2))
    : 0;

  return {
    risk_score: overallRisk,
    risk_level: overallRisk < 0.3 ? 'low' : overallRisk < 0.6 ? 'medium' : 'high',
    warnings: warnings.slice(0, 5),
    total_warnings: warnings.length,
    message: overallRisk > 0.5
      ? `⚠️ High risk: ${warnings.length} similar failure pattern${warnings.length > 1 ? 's' : ''} found. Review warnings before proceeding.`
      : overallRisk > 0
        ? `Low risk: ${warnings.length} minor warning${warnings.length > 1 ? 's' : ''} found.`
        : 'No known failure patterns match this approach.'
  };
}

// Generate standardized provenance block for AI output attribution
async function getProvenance(reasoningId) {
  const ro = await getReasoning(reasoningId);
  if (!ro) return null;

  const consensusScore = ro.solution?.consensus_score || null;
  const successRate = ro.meta?.success_rate || 0;
  const verificationCount = (ro.verifications || []).length;
  const citationCount = (ro.cited_by || []).length;

  const provenance = {
    reasoning_id: ro.id,
    problem: ro.problem_statement.slice(0, 200),
    solution_summary: ro.solution?.summary || '',
    consensus_score: consensusScore,
    success_rate: successRate,
    verification_count: verificationCount,
    citation_count: citationCount,
    domain: ro.context?.domain || 'general',
    difficulty: ro.context?.difficulty || 'unknown',
    url: `https://api.aineedhelpfromotherai.com/api/reasoning/${ro.id}`,
    markdown: `> 🧠 **Reasoning Cache Attribution**  
> Based on: \`${ro.id}\`  
> Problem: ${ro.problem_statement.slice(0, 150)}  
> Solution: ${ro.solution?.summary?.slice(0, 150) || ''}  
> Consensus: ${consensusScore !== null ? (consensusScore * 100).toFixed(0) + '%' : 'N/A'}  
> Source: [RO-${ro.id}](https://api.aineedhelpfromotherai.com/api/reasoning/${ro.id})`,
    compact: `[RO:${ro.id}] "${ro.problem_statement.slice(0, 80)}" → ${ro.solution?.summary?.slice(0, 80) || ''} (consensus: ${consensusScore !== null ? (consensusScore * 100).toFixed(0) + '%' : 'N/A'})`
  };

  return provenance;
}

let resolveLog = [];
function trackResolve(hit, problemStatement) {
  resolveLog.push({
    timestamp: new Date().toISOString(),
    hit: !!hit,
    problem_statement: (problemStatement || '').slice(0, 100)
  });
  if (resolveLog.length > 1000) resolveLog = resolveLog.slice(-1000);
}

function getResolveStats() {
  const total = resolveLog.length;
  const hits = resolveLog.filter(r => r.hit).length;
  return {
    total_resolves: total,
    total_hits: hits,
    total_misses: total - hits,
    hit_rate: total > 0 ? parseFloat((hits / total).toFixed(3)) : 0,
    recent: resolveLog.slice(-20).reverse()
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
  getReasoningStats,
  verifyReasoning,
  getVerifications,
  addCitation,
  getCitations,
  recommendForTask,
  getRecentlyActive,
  getPopularTags,
  getTrending,
  calculateQualityScore,
  resolveReasoning,
  failureCheck,
  getProvenance,
  trackResolve,
  getResolveStats,
};
