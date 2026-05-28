const { Pool } = require('pg');

let pool = null;

function getPool() {
  if (pool) return pool;
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) return null;
  const sslMode = process.env.PGSSLMODE || 'require';
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: sslMode === 'disable' ? false :
         { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 8000
  });
  return pool;
}

async function ensureSchema() {
  const db = getPool();
  if (!db) return;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(128) PRIMARY KEY,
        type VARCHAR(32) NOT NULL DEFAULT 'REQUEST',
        agent_id VARCHAR(64),
        task_type VARCHAR(64),
        problem TEXT,
        status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
        tags JSONB DEFAULT '[]',
        source VARCHAR(64),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS execution_history (
        execution_id VARCHAR(128) PRIMARY KEY,
        agent_id VARCHAR(64),
        task_id VARCHAR(128),
        action VARCHAR(32),
        status VARCHAR(32),
        result JSONB,
        meta JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await db.query(`
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
        parent_run_id VARCHAR(64),
        evidence_refs JSONB DEFAULT '[]',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  } catch (err) {
    console.error('[db] Schema init error:', err.message);
  }
}

function closePool() {
  if (pool) {
    pool.end();
    pool = null;
  }
}

module.exports = { getPool, closePool, ensureSchema };
