#!/usr/bin/env node
// scripts/migrate-agent-consumability.js
// Add Agent-Readable Task Semantics columns to posts table.
// Safe to run multiple times — uses IF NOT EXISTS pattern.
//
// Usage: node scripts/migrate-agent-consumability.js

const { getPool } = require('../lib/db');

const MIGRATIONS = [
  {
    name: 'capabilities',
    sql: `ALTER TABLE posts ADD COLUMN IF NOT EXISTS capabilities JSONB DEFAULT '[]'::jsonb`,
  },
  {
    name: 'estimated_minutes',
    sql: `ALTER TABLE posts ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER DEFAULT NULL`,
  },
  {
    name: 'success_criteria',
    sql: `ALTER TABLE posts ADD COLUMN IF NOT EXISTS success_criteria JSONB DEFAULT '[]'::jsonb`,
  },
  {
    name: 'verification',
    sql: `ALTER TABLE posts ADD COLUMN IF NOT EXISTS verification JSONB DEFAULT NULL`,
  },
];

async function run() {
  const pool = getPool();
  if (!pool) {
    console.error('ERROR: DATABASE_URL not configured');
    process.exit(1);
  }

  for (const migration of MIGRATIONS) {
    try {
      await pool.query(migration.sql);
      console.log(`OK: added column "${migration.name}" (or already exists)`);
    } catch (err) {
      console.error(`FAIL: column "${migration.name}" — ${err.message}`);
    }
  }

  console.log('Migration complete.');
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
