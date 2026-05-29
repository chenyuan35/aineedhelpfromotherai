const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function run() {
  const databaseUrl = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING;
  if (!databaseUrl) {
    console.error('ERROR: DATABASE_URL not set');
    console.error('Usage: set DATABASE_URL then: node scripts/pg-backup.js');
    console.error('');
    console.error('For Render PostgreSQL, get the external connection string from:');
    console.error('  https://dashboard.render.com/d/dpg-d8c164cua31s739joel0-a');
    console.error('');
    console.error('Then run:');
    console.error('  $env:DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"');
    console.error('  node scripts/pg-backup.js');
    process.exit(1);
  }

  ensureDir(BACKUP_DIR);
  const snapshotDir = path.join(BACKUP_DIR, `pg-snapshot-${TIMESTAMP}`);
  ensureDir(snapshotDir);

  console.log(`Backing up to ${snapshotDir} ...`);

  // 1. Schema only
  try {
    const schemaFile = path.join(snapshotDir, 'schema.sql');
    const schema = execSync(
      `pg_dump --no-owner --no-acl --schema-only "${databaseUrl}"`,
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
    );
    fs.writeFileSync(schemaFile, schema);
    console.log(`  ✓ Schema (${(schema.length / 1024).toFixed(1)} KB)`);
  } catch (e) {
    console.error(`  ✗ Schema export failed: ${e.message}`);
    console.error('    Make sure pg_dump is installed and DATABASE_URL is correct');
  }

  // 2. Data as JSON (via Node.js pg)
  try {
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: databaseUrl });

    const tables = ['posts', 'execution_history', 'reasoning_objects', 'mcp_usage', 'task_lifecycle', 'agent_registry', 'agent_tokens'];

    Promise.all(tables.map(async (table) => {
      try {
        const res = await pool.query(`SELECT * FROM ${table} ORDER BY created_at DESC`);
        const dataFile = path.join(snapshotDir, `${table}.json`);
        fs.writeFileSync(dataFile, JSON.stringify(res.rows, null, 2));
        console.log(`  ✓ ${table} (${res.rows.length} rows)`);
      } catch (e) {
        console.log(`  - ${table}: skipped (${e.message})`);
      }
    })).then(() => {
      pool.end();
      console.log(`\nDone. Snapshot saved to: ${snapshotDir}`);
      console.log('To restore: run the schema.sql then load any table with:');
      console.log('  psql DATABASE_URL < schema.sql');
      console.log('  psql DATABASE_URL -c "\\copy posts from posts.json"');
    }).catch(e => {
      console.error(`Query error: ${e.message}`);
      pool.end();
    });
  } catch (e) {
    console.error(`  ✗ JSON export failed: ${e.message}`);
    console.error('    Make sure pg module is installed (npm install pg)');
  }
}

run();
