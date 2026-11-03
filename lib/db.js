const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

let pool = null;
let pglite = null;

function getPool() {
  if (pool) return pool;

  // PGlite is opt-in. This explicit selector prevents an accidental switch
  // away from an existing PostgreSQL DATABASE_URL.
  const driver = String(process.env.DB_DRIVER || 'postgres').trim().toLowerCase();
  if (driver === 'pglite') {
    const configuredDataDir = String(process.env.PGLITE_DATA_DIR || '').trim();
    if (!configuredDataDir) {
      throw new Error('PGLITE_DATA_DIR is required when DB_DRIVER=pglite');
    }
    if (!path.isAbsolute(configuredDataDir)) {
      throw new Error('PGLITE_DATA_DIR must be an absolute path');
    }

    const dataDir = path.resolve(configuredDataDir);
    fs.mkdirSync(dataDir, { recursive: true, mode: 0o700 });

    const { PGlite } = require('@electric-sql/pglite');
    const { createPgConfig } = require('@electric-sql/pglite/node-postgres');
    pglite = new PGlite(dataDir);

    // PGlite is a single-connection database. Keep the existing pg.Pool
    // interface, but serialize application queries through one client.
    const config = createPgConfig(pglite);
    Object.assign(config, {
      max: 1,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000
    });
    pool = new Pool(config);
    console.info('[db] Embedded PGlite enabled at ' + dataDir);
    return pool;
  }

  if (driver !== 'postgres') {
    throw new Error('DB_DRIVER must be postgres or pglite');
  }

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
  if (!db) {
    console.warn('[db] Disabled (database backend not configured)');
    throw new Error('Set DATABASE_URL for PostgreSQL or DB_DRIVER=pglite with PGLITE_DATA_DIR');
  }
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
    throw err;
  }
}

async function closePool() {
  const activePool = pool;
  const activePGlite = pglite;
  pool = null;
  pglite = null;

  let closeError = null;
  if (activePool) {
    try {
      await activePool.end();
    } catch (err) {
      closeError = err;
    }
  }
  if (activePGlite && !activePGlite.closed) {
    try {
      await activePGlite.close();
    } catch (err) {
      if (!closeError) closeError = err;
    }
  }
  if (closeError) throw closeError;
}

module.exports = { getPool, closePool, ensureSchema };
