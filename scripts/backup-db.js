#!/usr/bin/env node
// scripts/backup-db.js — Full database backup to JSON + SQL
// Usage: node scripts/backup-db.js [--format json|sql|both] [--output ./backups] [--compress]
// Backs up all critical tables: posts, execution_history, reasoning_objects, agents_registry

const fs = require('fs');
const path = require('path');
const { getPool } = require('../lib/db');
const zlib = require('zlib');
const { createWriteStream } = require('fs');

// Parse CLI arguments
const args = {
  format: 'both', // json, sql, both
  output: './backups',
  compress: false,
  verbose: true
};

const cliArgs = process.argv.slice(2);
cliArgs.forEach((arg, index) => {
  if (arg === '--format' && index < cliArgs.length - 1) args.format = cliArgs[index + 1];
  if (arg === '--output' && index < cliArgs.length - 1) args.output = cliArgs[index + 1];
  if (arg === '--compress') args.compress = true;
  if (arg === '--quiet') args.verbose = false;
});

const log = (msg) => { if (args.verbose) console.log(`[BACKUP] ${msg}`); };
const now = new Date();
const timestamp = now.toISOString().replace(/[:.-]/g, '');
const backupDir = path.join(process.cwd(), args.output);

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  log(`Created backup directory: ${backupDir}`);
}

// Critical tables to backup
const BACKUP_TABLES = [
  'posts',
  'execution_history',
  'reasoning_objects',
  'agents_registry',
  'mcp_usage'
];

async function backupToJson() {
  log('Starting JSON backup...');
  const db = getPool();
  if (!db) {
    console.error('[BACKUP] Database connection failed');
    process.exit(1);
  }

  const backup = {
    metadata: {
      timestamp: now.toISOString(),
      version: '1.0',
      format: 'json',
      tables: BACKUP_TABLES
    },
    data: {}
  };

  try {
    for (const table of BACKUP_TABLES) {
      try {
        const result = await db.query(`SELECT * FROM ${table}`);
        backup.data[table] = {
          count: result.rows.length,
          rows: result.rows
        };
        log(`  ✓ ${table}: ${result.rows.length} rows`);
      } catch (e) {
        log(`  ⚠ ${table}: ${e.message} (table may not exist)`);
        backup.data[table] = { count: 0, rows: [], error: e.message };
      }
    }

    const filename = `backup-${timestamp}.json`;
    const filepath = path.join(backupDir, filename);
    const content = JSON.stringify(backup, null, 2);

    if (args.compress) {
      const gzFilepath = filepath + '.gz';
      await new Promise((resolve, reject) => {
        const gzip = zlib.createGzip();
        const file = createWriteStream(gzFilepath);
        file.on('finish', resolve);
        file.on('error', reject);
        gzip.pipe(file);
        gzip.write(content);
        gzip.end();
      });
      log(`✓ JSON backup saved: ${gzFilepath} (compressed)`);
      return gzFilepath;
    } else {
      fs.writeFileSync(filepath, content, 'utf8');
      log(`✓ JSON backup saved: ${filepath}`);
      return filepath;
    }
  } catch (err) {
    console.error('[BACKUP] JSON backup failed:', err.message);
    throw err;
  }
}

async function backupToSql() {
  log('Starting SQL backup...');
  const db = getPool();
  if (!db) {
    console.error('[BACKUP] Database connection failed');
    process.exit(1);
  }

  let sqlContent = `-- Database Backup\n-- Generated: ${now.toISOString()}\n\n`;

  try {
    for (const table of BACKUP_TABLES) {
      try {
        const result = await db.query(`SELECT * FROM ${table}`);
        const rows = result.rows;

        if (rows.length === 0) {
          log(`  ✓ ${table}: 0 rows (empty table)`);
          continue;
        }

        // Get column names from first row
        const columns = Object.keys(rows[0]);
        sqlContent += `\n-- Table: ${table} (${rows.length} rows)\n`;
        sqlContent += `-- Columns: ${columns.join(', ')}\n\n`;

        // Generate INSERT statements
        for (const row of rows) {
          const values = columns.map(col => {
            const val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
            if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
            return String(val);
          });
          sqlContent += `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
        }

        log(`  ✓ ${table}: ${rows.length} rows`);
      } catch (e) {
        log(`  ⚠ ${table}: ${e.message} (table may not exist)`);
      }
    }

    const filename = `backup-${timestamp}.sql`;
    const filepath = path.join(backupDir, filename);

    if (args.compress) {
      const gzFilepath = filepath + '.gz';
      await new Promise((resolve, reject) => {
        const gzip = zlib.createGzip();
        const file = createWriteStream(gzFilepath);
        file.on('finish', resolve);
        file.on('error', reject);
        gzip.pipe(file);
        gzip.write(sqlContent);
        gzip.end();
      });
      log(`✓ SQL backup saved: ${gzFilepath} (compressed)`);
      return gzFilepath;
    } else {
      fs.writeFileSync(filepath, sqlContent, 'utf8');
      log(`✓ SQL backup saved: ${filepath}`);
      return filepath;
    }
  } catch (err) {
    console.error('[BACKUP] SQL backup failed:', err.message);
    throw err;
  }
}

async function rotateBackups() {
  // Keep only last 7 backups, delete older ones
  try {
    const files = fs.readdirSync(backupDir)
      .filter(f => f.startsWith('backup-') && (f.endsWith('.json') || f.endsWith('.sql') || f.endsWith('.gz')))
      .sort()
      .reverse();

    if (files.length > 7) {
      const toDelete = files.slice(7);
      for (const file of toDelete) {
        fs.unlinkSync(path.join(backupDir, file));
        log(`Rotated old backup: ${file}`);
      }
    }
  } catch (err) {
    log(`Warning: Backup rotation failed: ${err.message}`);
  }
}

async function main() {
  try {
    log(`Database backup started (format: ${args.format})`);
    
    const backups = [];
    if (args.format === 'json' || args.format === 'both') {
      backups.push(await backupToJson());
    }
    if (args.format === 'sql' || args.format === 'both') {
      backups.push(await backupToSql());
    }

    await rotateBackups();

    log(`\n✓ Backup complete!`);
    log(`Saved to: ${backupDir}`);
    log(`Files: ${backups.map(b => path.basename(b)).join(', ')}`);
    log(`Total size: ${backups.reduce((acc, b) => acc + fs.statSync(b).size, 0)} bytes`);
    
    process.exit(0);
  } catch (err) {
    console.error('[BACKUP] Error:', err);
    process.exit(1);
  }
}

main();
