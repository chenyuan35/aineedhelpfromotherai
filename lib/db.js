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

function closePool() {
  if (pool) {
    pool.end();
    pool = null;
  }
}

module.exports = { getPool, closePool };
