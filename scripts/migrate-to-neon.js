#!/usr/bin/env node
// scripts/migrate-to-neon.js
// One-time, idempotent migration: copy all data from a source PostgreSQL
// (Render free tier) into a target PostgreSQL (Neon, which keeps automatic
// backups and does not expire). Pure Node + pg — no pg_dump/pg_restore needed,
// so it does not require PostgreSQL client tools on this machine.
//
// Usage (PowerShell):
//   $env:SOURCE_DATABASE_URL="postgresql://...render...:5432/db?sslmode=require"
//   $env:TARGET_DATABASE_URL="postgresql://...neon.tech/db?sslmode=require"
//   node scripts/migrate-to-neon.js            # copy data (idempotent)
//   node scripts/migrate-to-neon.js --dry-run  # only report source row counts
//   node scripts/migrate-to-neon.js --truncate # wipe target tables first
//
// Safety:
//   - Never paste real connection strings into tracked files. Use env vars only.
//   - Re-runnable: rows use INSERT ... ON CONFLICT DO NOTHING.

require('dotenv').config({ quiet: true });
const { Pool } = require('pg');

const SOURCE = process.env.SOURCE_DATABASE_URL;
const TARGET = process.env.TARGET_DATABASE_URL;

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const TRUNCATE = args.includes('--truncate');
const BATCH = 100;

function fail(msg) {
  console.error(`[migrate] ${msg}`);
  process.exit(1);
}

function makePool(url, label) {
  if (!url) fail(`Set ${label} before running. Do not put the real URL in tracked files.`);
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    fail(`${label} is not a valid PostgreSQL URL.`);
  }
  if (parsed.protocol !== 'postgres:' && parsed.protocol !== 'postgresql:') {
    fail(`${label} must start with postgres:// or postgresql://`);
  }
  return new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    max: 5,
    connectionTimeoutMillis: 15000,
  });
}

function quoteIdent(id) {
  return `"${String(id).replace(/"/g, '""')}"`;
}

async function listPublicTables(pool) {
  const { rows } = await pool.query(`
    SELECT tablename
    FROM pg_catalog.pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `);
  return rows.map((r) => r.tablename);
}

async function getColumns(pool, table) {
  const { rows } = await pool.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1
     ORDER BY ordinal_position`,
    [table]
  );
  return rows.map((r) => r.column_name);
}

async function ensureTargetSchema() {
  // The app owns its schema. Point DATABASE_URL at the target and let it build tables.
  const prev = process.env.DATABASE_URL;
  const prevSsl = process.env.PGSSLMODE;
  process.env.DATABASE_URL = TARGET;
  process.env.PGSSLMODE = 'require';
  // Fresh require so lib/db picks up the target URL.
  delete require.cache[require.resolve('../lib/db')];
  const db = require('../lib/db');
  await db.ensureSchema();
  db.closePool();
  process.env.DATABASE_URL = prev;
  process.env.PGSSLMODE = prevSsl;
  // Drop cached module so later code can't reuse the target pool by accident.
  delete require.cache[require.resolve('../lib/db')];
}

async function copyTable(src, dst, table) {
  const srcCols = await getColumns(src, table);
  const dstCols = await getColumns(dst, table);
  if (dstCols.length === 0) {
    console.log(`[migrate]   skip ${table}: not present in target schema`);
    return { table, copied: 0, skipped: true };
  }
  const cols = srcCols.filter((c) => dstCols.includes(c));
  if (cols.length === 0) {
    console.log(`[migrate]   skip ${table}: no shared columns`);
    return { table, copied: 0, skipped: true };
  }

  const { rows } = await src.query(`SELECT ${cols.map(quoteIdent).join(', ')} FROM ${quoteIdent(table)}`);
  if (rows.length === 0) {
    console.log(`[migrate]   ${table}: 0 rows`);
    return { table, copied: 0, skipped: false };
  }

  const colList = cols.map(quoteIdent).join(', ');
  let copied = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const values = [];
    const placeholders = chunk.map((row, r) => {
      const ph = cols.map((c, ci) => {
        const idx = r * cols.length + ci + 1;
        let v = row[c];
        if (v !== null && typeof v === 'object') v = JSON.stringify(v);
        values.push(v);
        return `$${idx}`;
      });
      return `(${ph.join(', ')})`;
    });
    const sql =
      `INSERT INTO ${quoteIdent(table)} (${colList}) ` +
      `VALUES ${placeholders.join(', ')} ON CONFLICT DO NOTHING`;
    const res = await dst.query(sql, values);
    copied += res.rowCount || 0;
  }
  console.log(`[migrate]   ${table}: ${rows.length} read, ${copied} inserted (existing skipped)`);
  return { table, copied, skipped: false };
}

async function main() {
  const src = makePool(SOURCE, 'SOURCE_DATABASE_URL');
  const dst = makePool(TARGET, 'TARGET_DATABASE_URL');

  try {
    const tables = await listPublicTables(src);
    console.log(`[migrate] source tables: ${tables.join(', ') || '(none)'}`);

    if (DRY_RUN) {
      for (const t of tables) {
        const { rows } = await src.query(`SELECT COUNT(*)::int AS n FROM ${quoteIdent(t)}`);
        console.log(`[migrate]   ${t}: ${rows[0].n} rows`);
      }
      console.log('[migrate] dry-run complete. No data written.');
      return;
    }

    console.log('[migrate] building target schema...');
    await ensureTargetSchema();

    if (TRUNCATE) {
      for (const t of tables) {
        const dstCols = await getColumns(dst, t);
        if (dstCols.length) {
          await dst.query(`TRUNCATE ${quoteIdent(t)} CASCADE`);
          console.log(`[migrate]   truncated ${t}`);
        }
      }
    }

    const results = [];
    for (const t of tables) {
      results.push(await copyTable(src, dst, t));
    }

    const total = results.reduce((a, r) => a + r.copied, 0);
    console.log(`[migrate] done. ${total} rows inserted across ${results.length} tables.`);
    console.log('[migrate] next: point Render/Vercel DATABASE_URL at the Neon URL and redeploy.');
  } finally {
    await src.end();
    await dst.end();
  }
}

main().catch((err) => {
  console.error('[migrate] error:', err.message);
  process.exit(1);
});
