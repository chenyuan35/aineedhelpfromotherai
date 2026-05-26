---
name: postgresql
description: |
  Use when working with database queries, schema, connection pool, JSONB columns,
  or any handler/lib that interacts with PostgreSQL. Covers pg.Pool patterns,
  ensureTable(), JSONB operations, and parameterized queries.
  Do NOT use for non-DB backend code.
---

# PostgreSQL — aineedhelpfromotherai 数据库开发

## Connection pool (`lib/db.js`)
```js
const { Pool } = require('pg');
let pool = null;
function getPool() {
  if (!pool) {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) return null;  // graceful fallback if no DB
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}
function closePool() { if (pool) { pool.end(); pool = null; } }
```

## Table creation pattern
```js
await pool.query(`CREATE TABLE IF NOT EXISTS reasoning_objects (
  id SERIAL PRIMARY KEY,
  ro_id TEXT UNIQUE NOT NULL,
  problem_statement TEXT NOT NULL,
  solution JSONB,
  domain TEXT,
  difficulty TEXT,
  attempts JSONB DEFAULT '[]'::jsonb,
  verifications JSONB DEFAULT '[]'::jsonb,
  cited_by JSONB DEFAULT '[]'::jsonb,
  consensus_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
)`);
```

## JSONB operations
```js
// Read JSONB field
const { rows } = await pool.query(
  'SELECT solution->>\'summary\' AS summary FROM reasoning_objects WHERE ro_id = $1',
  [roId]
);

// Update JSONB array
await pool.query(
  'UPDATE reasoning_objects SET verifications = verifications || $1::jsonb WHERE ro_id = $2',
  [JSON.stringify(newVerification), roId]
);

// JSONB contains query
const { rows } = await pool.query(
  'SELECT * FROM reasoning_objects WHERE attempts @> $1::jsonb',
  [JSON.stringify([{ outcome: 'failed' }])]
);
```

## Parameterized queries (ALWAYS use $1, $2, ...)
```js
// Never interpolate values directly — use parameterized queries
const { rows } = await pool.query(
  'INSERT INTO posts (title, problem, task_type, status) VALUES ($1, $2, $3, $4) RETURNING *',
  [title, problem, taskType, 'OPEN']
);
```

## Transaction pattern
```js
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('UPDATE posts SET status = $1 WHERE id = $2', ['CLOSED', postId]);
  await client.query('INSERT INTO execution_history (...) VALUES (...)');
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();
}
```

## UPSERT pattern
```js
await pool.query(
  `INSERT INTO agent_registry (agent_id, name) VALUES ($1, $2)
   ON CONFLICT (agent_id) DO UPDATE SET last_seen = NOW()`,
  [agentId, name]
);
```

## Tables
| Table | Purpose |
|-------|---------|
| `posts` | Tasks/offers with lifecycle state |
| `execution_history` | Execution records (agent, tokens, status, duration) |
| `agent_tokens` | Agent registration and auth tokens |
| `task_lifecycle` | Lifecycle tracking with metrics, barriers, freshness |
| `agent_registry` | Persistent worker registry |
| `reasoning_objects` | Reasoning cache (JSONB context, attempts, solutions, verifications) |
| `mcp_usage` | MCP tool call audit log |

## Always guard with null check
```js
const pool = getPool();
if (!pool) return res.status(503).json({ success: false, error: 'Database unavailable' });
```
