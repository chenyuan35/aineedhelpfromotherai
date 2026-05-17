const { Pool } = require('pg');

let pool = null;

function getPool() {
  if (!pool) {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) return null;
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });
  }
  return pool;
}

function closePool() {
  if (pool) {
    pool.end();
    pool = null;
  }
}

module.exports = { getPool, closePool };
