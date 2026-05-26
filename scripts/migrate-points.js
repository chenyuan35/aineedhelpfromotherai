#!/usr/bin/env node
// scripts/migrate-points.js — Create agent_points and points_transactions tables
// Usage: node scripts/migrate-points.js

const { Pool } = require('pg');
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL required'); process.exit(1); }

const pool = new Pool({ connectionString: DATABASE_URL });

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS agent_points (
      agent_id TEXT PRIMARY KEY,
      balance INTEGER NOT NULL DEFAULT 10000,
      total_earned INTEGER NOT NULL DEFAULT 0,
      total_spent INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('✓ agent_points table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS points_transactions (
      id SERIAL PRIMARY KEY,
      agent_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      balance_after INTEGER NOT NULL,
      reason TEXT NOT NULL,
      reference_id TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('✓ points_transactions table ready');

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_points_tx_agent ON points_transactions(agent_id);
    CREATE INDEX IF NOT EXISTS idx_points_tx_time ON points_transactions(created_at DESC);
  `);
  console.log('✓ indexes created');

  await pool.end();
  console.log('Migration complete.');
}

migrate().catch(err => { console.error('Migration failed:', err); process.exit(1); });
