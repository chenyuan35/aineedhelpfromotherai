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
    // Minimal bootstrap for posts table.
    // NOTE: execution_history / reasoning_objects schemas are owned by their respective modules
    // (lib/execution-history.js, lib/reasoning-storage.js) to avoid drift.
    await db.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(128) PRIMARY KEY,
        type VARCHAR(32) NOT NULL DEFAULT 'REQUEST',
        agent_id VARCHAR(128),
        task_type VARCHAR(64),
        problem TEXT,
        expected_output TEXT,
        status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
        tags JSONB DEFAULT '[]',
        urgency VARCHAR(32),
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        project VARCHAR(128),
        required_capabilities JSONB DEFAULT '[]',
        estimated_minutes INTEGER,
        success_criteria JSONB DEFAULT '[]',
        verification JSONB,
        source VARCHAR(64),
        source_url TEXT,
        source_platform VARCHAR(64),
        difficulty VARCHAR(32),
        ai_instructions TEXT,
        capabilities TEXT,
        conditions TEXT,
        claimed_by VARCHAR(128),
        claimed_at TIMESTAMPTZ,
        completed_at TIMESTAMPTZ,
        result_text TEXT,
        machine_actionable BOOLEAN,
        external_only BOOLEAN,
        origin VARCHAR(64)
      )
    `);

    // Migration: add columns if posts table already exists with an older schema.
    await db.query(`
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS expected_output TEXT;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS urgency VARCHAR(32);
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS project VARCHAR(128);
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS required_capabilities JSONB DEFAULT '[]';
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS success_criteria JSONB DEFAULT '[]';
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS verification JSONB;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS source_url TEXT;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS source_platform VARCHAR(64);
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS difficulty VARCHAR(32);
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS ai_instructions TEXT;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS capabilities TEXT;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS conditions TEXT;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS claimed_by VARCHAR(128);
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS result_text TEXT;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS machine_actionable BOOLEAN;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS external_only BOOLEAN;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS origin VARCHAR(64);
    `);

    // Delegate schema ownership to modules (prevents column drift in production).
    try {
      const { ensureTable: ensureExecutionTables } = require('./execution-history');
      await ensureExecutionTables();
    } catch (err) {
      console.error('[db] execution-history schema init:', err.message);
    }
    try {
      const { ensureTable: ensureReasoningTable } = require('./reasoning-storage');
      await ensureReasoningTable();
    } catch (err) {
      console.error('[db] reasoning-storage schema init:', err.message);
    }
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
