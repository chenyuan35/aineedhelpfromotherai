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
 const { status, min_freshness, limit = 50, offset = 0 } = filters;

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

module.exports = {
 saveExecution, queryExecutions, getExecution, ensureTable,
 registerAgentToken, verifyAgentToken, parseAgentAuth,
 upsertTaskLifecycle, queryTaskLifecycle,
 upsertAgentRegistry, queryAgentRegistry
};
