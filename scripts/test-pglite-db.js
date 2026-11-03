#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const MARKER_ID = 'restart-proof';
const MARKER_PAYLOAD = { marker: 'persisted-after-process-restart' };

async function runChild(mode) {
  const { ensureSchema, getPool, closePool } = require('../lib/db');
  try {
    await ensureSchema();
    const db = getPool();

    if (mode === 'write') {
      const tables = await db.query("SELECT to_regclass('public.posts') AS posts, to_regclass('public.execution_history') AS execution_history, to_regclass('public.reasoning_objects') AS reasoning_objects, to_regclass('public.agent_tokens') AS agent_tokens, to_regclass('public.task_lifecycle') AS task_lifecycle, to_regclass('public.agent_registry') AS agent_registry");
      for (const name of ['posts', 'execution_history', 'reasoning_objects', 'agent_tokens', 'task_lifecycle', 'agent_registry']) {
        assert.ok(tables.rows[0][name], 'expected schema table ' + name);
      }
      await db.query('CREATE TABLE IF NOT EXISTS pglite_restart_probe (id TEXT PRIMARY KEY, payload JSONB NOT NULL)');
      await db.query('INSERT INTO pglite_restart_probe (id, payload) VALUES ($1, $2::jsonb)', [MARKER_ID, JSON.stringify(MARKER_PAYLOAD)]);
      return;
    }

    if (mode === 'read') {
      const result = await db.query('SELECT payload FROM pglite_restart_probe WHERE id = $1', [MARKER_ID]);
      assert.deepEqual(result.rows[0] && result.rows[0].payload, MARKER_PAYLOAD, 'database contents must survive a fresh Node process');

      const statusHandler = require('../api-handlers/status');
      const response = {
        statusCode: 200,
        headers: {},
        setHeader(name, value) { this.headers[name] = value; },
        status(code) { this.statusCode = code; return this; },
        json(body) { this.body = body; return this; }
      };
      await statusHandler({ method: 'GET' }, response);
      assert.equal(response.statusCode, 200, 'database-backed status endpoint must return HTTP 200');
      assert.equal(response.body && response.body.alive, true, 'database-backed status must report alive');
      assert.equal(response.body && response.body.tasks && response.body.tasks.open, 0, 'fresh database must not fabricate active tasks');
      return;
    }

    throw new Error('Unknown test mode: ' + mode);
  } finally {
    await closePool();
  }
}

function runChildProcess(mode, dataDir) {
  execFileSync(process.execPath, [__filename, mode], {
    stdio: 'inherit',
    env: {
      ...process.env,
      DB_DRIVER: 'pglite',
      // A deliberately unusable URL proves the explicit PGlite selector wins.
      DATABASE_URL: 'postgres://unused.invalid/ignored',
      PGLITE_DATA_DIR: dataDir
    }
  });
}

async function main() {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aineedhelp-pglite-'));
  try {
    runChildProcess('write', dataDir);
    assert.ok(fs.readdirSync(dataDir).length > 0, 'PGlite must write files to the configured data directory');
    runChildProcess('read', dataDir);
    console.log('PASS PGlite schema, pg.Pool adapter, API status, and process-restart persistence');
  } finally {
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
}

if (process.argv[2]) {
  runChild(process.argv[2]).catch((err) => {
    console.error(err && err.stack ? err.stack : err);
    process.exitCode = 1;
  });
} else {
  main().catch((err) => {
    console.error(err && err.stack ? err.stack : err);
    process.exitCode = 1;
  });
}
