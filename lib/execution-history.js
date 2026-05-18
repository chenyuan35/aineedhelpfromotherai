// /api/execution-history — Persistent execution records via PostgreSQL
// Stores and queries execution traces across serverless cold starts

const { getPool } = require('./db');

// Auto-create tables on first use
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

      CREATE TABLE IF NOT EXISTS agent_tokens (
        agent_id VARCHAR(128) PRIMARY KEY,
        token_hash VARCHAR(128) NOT NULL,
        agent_name VARCHAR(128),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_used_at TIMESTAMPTZ,
        request_count INTEGER DEFAULT 0
      );
    `);
 // task_lifecycle table — tracks task lifecycle, metrics, barriers over time
 await client.query(`
 CREATE TABLE IF NOT EXISTS task_lifecycle (
 task_id VARCHAR(128) PRIMARY KEY,
 status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
 lifecycle JSONB,
 metrics JSONB,
 barrier JSONB,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 );
 `);
 // agent_registry — persistent worker registry
 await client.query(`
 CREATE TABLE IF NOT EXISTS agent_registry (
 agent_id VARCHAR(128) PRIMARY KEY,
 agent_name VARCHAR(128) NOT NULL,
 provider VARCHAR(128),
 capabilities JSONB DEFAULT '[]',
 endpoint VARCHAR(256),
 docs VARCHAR(256),
 status VARCHAR(32) DEFAULT 'active',
 access VARCHAR(32) DEFAULT 'api_key',
 verified BOOLEAN DEFAULT false,
 metadata JSONB DEFAULT '{}',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 );
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

// --- Agent Token Auth ---

const crypto = require('crypto');

function hashResult(resultText) {
  return crypto.createHash('sha256').update(resultText).digest('hex');
}

// N-gram similarity for dedup (Jaccard on trigrams)
function computeSimilarity(a, b) {
  if (!a || !b) return 0;
  const ngramSize = 3;
  const ngrams = (str) => {
    const s = str.toLowerCase().replace(/\s+/g, ' ').trim();
    const grams = new Set();
    for (let i = 0; i <= s.length - ngramSize; i++) {
      grams.add(s.slice(i, i + ngramSize));
    }
    return grams;
  };
  const aGrams = ngrams(a);
  const bGrams = ngrams(b);
  if (aGrams.size === 0 || bGrams.size === 0) return 0;
  let intersection = 0;
  for (const g of aGrams) {
    if (bGrams.has(g)) intersection++;
  }
  return intersection / (aGrams.size + bGrams.size - intersection);
}

// Hash a token for storage (SHA-256)
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Register an agent with a token — returns the generated token (show once!)
async function registerAgentToken(agentId, agentName) {
  await ensureTable();
  const db = getPool();
  // Generate a random token: agent_<32hex>
  const rawToken = `agent_${crypto.randomBytes(16).toString('hex')}`;
  const tokenHash = hashToken(rawToken);

  await db.query(
    `INSERT INTO agent_tokens (agent_id, token_hash, agent_name, created_at, request_count)
     VALUES ($1, $2, $3, NOW(), 0)
     ON CONFLICT (agent_id) DO UPDATE SET token_hash = $2, agent_name = $3, created_at = NOW(), request_count = 0`,
    [agentId, tokenHash, agentName]
  );

  return { agent_id: agentId, token: rawToken, warning: 'Save this token — it cannot be retrieved later' };
}

// Verify an agent token — returns true/false
async function verifyAgentToken(agentId, rawToken) {
  await ensureTable();
  const db = getPool();
  const tokenHash = hashToken(rawToken);

  const result = await db.query(
    `SELECT agent_id FROM agent_tokens WHERE agent_id = $1 AND token_hash = $2`,
    [agentId, tokenHash]
  );

  if (result.rows.length > 0) {
    // Update last_used_at and increment request_count
    await db.query(
      `UPDATE agent_tokens SET last_used_at = NOW(), request_count = request_count + 1 WHERE agent_id = $1`,
      [agentId]
    ).catch(() => {}); // non-critical
    return true;
  }
  return false;
}

// Parse X-Agent-Token header: "agent_id:token"
function parseAgentAuth(authHeader) {
  if (!authHeader) return null;
  // Support: "Bearer agent_id:token" or "agent_id:token"
  const cleaned = authHeader.replace(/^Bearer\s+/i, '');
  const colonIdx = cleaned.indexOf(':');
  if (colonIdx < 1) return null;
  return {
    agent_id: cleaned.substring(0, colonIdx),
    token: cleaned.substring(colonIdx + 1)
  };
}

// --- Task Lifecycle PG Operations ---

// Upsert task lifecycle record (call after each execution)
async function upsertTaskLifecycle(task) {
  await ensureTable();
  const db = getPool();
  await db.query(`
    INSERT INTO task_lifecycle (task_id, status, lifecycle, metrics, barrier, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    ON CONFLICT (task_id) DO UPDATE SET
      status = EXCLUDED.status,
      lifecycle = EXCLUDED.lifecycle,
      metrics = EXCLUDED.metrics,
      barrier = EXCLUDED.barrier,
      updated_at = NOW()
  `, [
    task.id,
    task.status,
    JSON.stringify(task.lifecycle || {}),
    JSON.stringify(task.metrics || {}),
    JSON.stringify(task.barrier || {})
  ]);
}

// Query task lifecycle records
async function queryTaskLifecycle(filters = {}) {
 await ensureTable();
 const db = getPool();
  const { status, limit = 50, offset = 0 } = filters;

 let sql = 'SELECT * FROM task_lifecycle WHERE 1=1';
 const params = [];
 let idx = 1;

 if (status) {
 sql += ` AND status = $${idx++}`;
 params.push(status);
 }
 sql += ` ORDER BY updated_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
 params.push(limit, offset);

 const result = await db.query(sql, params);
 return result.rows.map(row => ({
 task_id: row.task_id,
 status: row.status,
 lifecycle: row.lifecycle,
 metrics: row.metrics,
 barrier: row.barrier,
 updated_at: row.updated_at,
 created_at: row.created_at
 }));
}

// --- Agent Registry PG Operations ---

// Register or update an agent in the registry
async function upsertAgentRegistry(agent) {
 await ensureTable();
 const db = getPool();
 await db.query(`
 INSERT INTO agent_registry (agent_id, agent_name, provider, capabilities, endpoint, docs, status, access, verified, metadata, updated_at)
 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
 ON CONFLICT (agent_id) DO UPDATE SET
 agent_name = EXCLUDED.agent_name,
 provider = EXCLUDED.provider,
 capabilities = EXCLUDED.capabilities,
 endpoint = EXCLUDED.endpoint,
 docs = EXCLUDED.docs,
 status = EXCLUDED.status,
 access = EXCLUDED.access,
 verified = EXCLUDED.verified,
 metadata = EXCLUDED.metadata,
 updated_at = NOW()
 `, [
 agent.agent_id,
 agent.agent_name,
 agent.provider || null,
 JSON.stringify(agent.capabilities || []),
 agent.endpoint || null,
 agent.docs || null,
 agent.status || 'active',
 agent.access || 'api_key',
 agent.verified || false,
 JSON.stringify(agent.metadata || {})
 ]);
}

// Query agents from registry
async function queryAgentRegistry(filters = {}) {
 await ensureTable();
 const db = getPool();
 const { capability, status, limit = 50, offset = 0 } = filters;

 let sql = 'SELECT * FROM agent_registry WHERE 1=1';
 const params = [];
 let idx = 1;

 if (status) {
 sql += ` AND status = $${idx++}`;
 params.push(status);
 }
 if (capability) {
 sql += ` AND capabilities @> $${idx++}`;
 params.push(JSON.stringify([capability]));
 }
 sql += ` ORDER BY updated_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
 params.push(limit, offset);

 const result = await db.query(sql, params);
 return result.rows.map(row => ({
 agent_id: row.agent_id,
 agent_name: row.agent_name,
 provider: row.provider,
 capabilities: row.capabilities,
 endpoint: row.endpoint,
 docs: row.docs,
 status: row.status,
 access: row.access,
 verified: row.verified,
 metadata: row.metadata,
 updated_at: row.updated_at,
 created_at: row.created_at
 }));
}

// --- MCP Usage Log ---

let mcpUsageInitialized = false;
async function ensureMcpUsageTable() {
  if (mcpUsageInitialized) return;
  const db = getPool();
  if (!db) return;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS mcp_usage (
        id SERIAL PRIMARY KEY,
        tool_name VARCHAR(64) NOT NULL,
        runtime_type VARCHAR(64) DEFAULT 'unknown',
        agent_id VARCHAR(128),
        args_json JSONB DEFAULT '{}',
        duration_ms INTEGER,
        success BOOLEAN NOT NULL DEFAULT true,
        error_message TEXT,
        ip_address VARCHAR(64),
        user_agent TEXT,
        result_hash VARCHAR(64),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_mcp_usage_tool ON mcp_usage(tool_name);
      CREATE INDEX IF NOT EXISTS idx_mcp_usage_created ON mcp_usage(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_mcp_usage_agent ON mcp_usage(agent_id);
      CREATE INDEX IF NOT EXISTS idx_mcp_usage_success ON mcp_usage(success);
      CREATE INDEX IF NOT EXISTS idx_mcp_usage_runtime ON mcp_usage(runtime_type);
    `);
    mcpUsageInitialized = true;
  } catch (err) {
    console.error('[mcp_usage] Table init failed:', err.message);
  }
}

async function logMcpUsage({ tool_name, runtime_type, agent_id, args, duration_ms, success, error_message, ip_address, user_agent, result_hash }) {
  try {
    await ensureMcpUsageTable();
    const db = getPool();
    if (!db) return;
    await db.query(
      `INSERT INTO mcp_usage (tool_name, runtime_type, agent_id, args_json, duration_ms, success, error_message, ip_address, user_agent, result_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        tool_name || 'unknown',
        runtime_type || 'unknown',
        agent_id || null,
        JSON.stringify(args || {}),
        duration_ms || null,
        success !== false,
        error_message || null,
        ip_address || null,
        user_agent || null,
        result_hash || null
      ]
    );
  } catch (err) {
    console.error('[mcp_usage] Log failed:', err.message);
  }
}

// Query mcp_usage log
async function queryMcpUsage(params = {}) {
  await ensureMcpUsageTable();
  const db = getPool();
  if (!db) return { usage: [], total: 0, limit: 50, offset: 0 };

  const conditions = [];
  const values = [];
  let idx = 1;

  if (params.tool_name) {
    conditions.push(`tool_name = $${idx++}`);
    values.push(params.tool_name);
  }
  if (params.agent_id) {
    conditions.push(`agent_id = $${idx++}`);
    values.push(params.agent_id);
  }
  if (params.runtime_type) {
    conditions.push(`runtime_type = $${idx++}`);
    values.push(params.runtime_type);
  }
  if (params.success !== undefined) {
    conditions.push(`success = $${idx++}`);
    values.push(params.success === 'true' || params.success === true);
  }

  const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
  const limit = Math.min(parseInt(params.limit) || 50, 200);
  const offset = parseInt(params.offset) || 0;

  const result = await db.query(
    `SELECT id, tool_name, runtime_type, agent_id, args_json, duration_ms, success, error_message, ip_address, user_agent, result_hash, created_at
     FROM mcp_usage ${where}
     ORDER BY created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...values, limit, offset]
  );

  const countResult = await db.query(`SELECT COUNT(*) as total FROM mcp_usage ${where}`, values);

  return {
    usage: result.rows,
    total: parseInt(countResult.rows[0]?.total || 0),
    limit,
    offset
  };
}

// Get mcp_usage summary metrics
async function getMcpUsageSummary(params = {}) {
  await ensureMcpUsageTable();
  const db = getPool();
  if (!db) return null;

  const conditions = [];
  const values = [];
  let idx = 1;

  if (params.tool_name) {
    conditions.push(`tool_name = $${idx++}`);
    values.push(params.tool_name);
  }
  if (params.agent_id) {
    conditions.push(`agent_id = $${idx++}`);
    values.push(params.agent_id);
  }
  if (params.runtime_type) {
    conditions.push(`runtime_type = $${idx++}`);
    values.push(params.runtime_type);
  }
  if (params.since) {
    conditions.push(`created_at >= $${idx++}`);
    values.push(params.since);
  }

  const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

  try {
    const [totalResult, successResult, durationResult, runtimeResult, toolResult, duplicateResult] = await Promise.all([
      db.query(`SELECT COUNT(*) as total FROM mcp_usage ${where}`, values),
      db.query(`SELECT COUNT(*) FILTER (WHERE success = true) as success_count, COUNT(*) FILTER (WHERE success = false) as error_count FROM mcp_usage ${where}`, values),
      db.query(`SELECT ROUND(AVG(duration_ms)) as avg_ms, MIN(duration_ms) as min_ms, MAX(duration_ms) as max_ms FROM mcp_usage ${where}`, values),
      db.query(`SELECT runtime_type, COUNT(*) as count FROM mcp_usage ${where} GROUP BY runtime_type ORDER BY count DESC`, values),
      db.query(`SELECT tool_name, COUNT(*) as count, ROUND(AVG(duration_ms)) as avg_ms FROM mcp_usage ${where} GROUP BY tool_name ORDER BY count DESC`, values),
      db.query(`SELECT COUNT(*) as total, COUNT(DISTINCT result_hash) FILTER (WHERE result_hash IS NOT NULL) as unique_hashes FROM mcp_usage ${where} AND result_hash IS NOT NULL`, values)
    ]);

    const total = parseInt(totalResult.rows[0]?.total || 0);
    const successCount = parseInt(successResult.rows[0]?.success_count || 0);
    const errorCount = parseInt(successResult.rows[0]?.error_count || 0);
    const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;

    const duplicateTotal = parseInt(duplicateResult.rows[0]?.total || 0);
    const uniqueHashes = parseInt(duplicateResult.rows[0]?.unique_hashes || 0);
    const duplicateRate = duplicateTotal > 0 ? Math.round(((duplicateTotal - uniqueHashes) / duplicateTotal) * 100) : 0;

    return {
      total_calls: total,
      success_count: successCount,
      error_count: errorCount,
      success_rate: `${successRate}%`,
      avg_duration_ms: parseInt(durationResult.rows[0]?.avg_ms) || null,
      min_duration_ms: parseInt(durationResult.rows[0]?.min_ms) || null,
      max_duration_ms: parseInt(durationResult.rows[0]?.max_ms) || null,
      duplicate_rate: `${duplicateRate}%`,
      unique_result_hashes: uniqueHashes,
      runtime_distribution: runtimeResult.rows,
      tool_distribution: toolResult.rows
    };
  } catch (err) {
    console.error('[mcp_usage] Summary query failed:', err.message);
    return null;
  }
}

// --- Submit Validation ---

function validateSubmitResult(resultText) {
  const errors = [];
  if (!resultText || resultText.length === 0) {
    errors.push('result is empty');
  } else if (resultText.length < 4) {
    errors.push('result is too short (minimum 4 bytes)');
  }
  return errors;
}

async function checkDuplicateResult(executionId, agentId, resultText) {
  const db = getPool();
  if (!db) return false;
  try {
    const existing = await db.query(
      `SELECT 1 FROM execution_history
       WHERE execution_id != $1 AND agent_id = $2 AND result->>'content' = $3
       LIMIT 1`,
      [executionId, agentId, resultText]
    );
    return existing.rows.length > 0;
  } catch {
    return false;
  }
}

// Similarity-based dedup (>90% similar = duplicate)
async function checkSimilarResult(agentId, resultText, threshold = 0.9) {
  const db = getPool();
  if (!db) return false;
  try {
    // Fetch recent completed submissions from same agent
    const existing = await db.query(
      `SELECT execution_id, result->>'content' as content
       FROM execution_history
       WHERE agent_id = $1 AND status = 'completed' AND result->>'content' IS NOT NULL
       ORDER BY created_at DESC
       LIMIT 50`,
      [agentId]
    );

    for (const row of existing.rows) {
      const similarity = computeSimilarity(resultText, row.content);
      if (similarity > threshold) {
        return { isSimilar: true, similarity: Math.round(similarity * 100), execution_id: row.execution_id };
      }
    }
    return false;
  } catch {
    return false;
  }
}

module.exports = {
  saveExecution, queryExecutions, getExecution, ensureTable,
  registerAgentToken, verifyAgentToken, parseAgentAuth,
  upsertTaskLifecycle, queryTaskLifecycle,
  upsertAgentRegistry, queryAgentRegistry,
  logMcpUsage, ensureMcpUsageTable, queryMcpUsage, getMcpUsageSummary,
  validateSubmitResult, checkDuplicateResult, checkSimilarResult, hashResult
};
