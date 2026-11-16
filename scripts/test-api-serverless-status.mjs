// Smoke test for the serverless /api/health, /api/status and /api/diagnostics
// functions (api/*.js). Run: node scripts/test-api-serverless-status.mjs
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const health = require('../api/health.js');
const status = require('../api/status.js');
const diagnostics = require('../api/diagnostics.js');

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    ended: false,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; return this; },
    end() { this.ended = true; return this; },
  };
  return res;
}

async function call(handler, method) {
  const res = mockRes();
  await handler({ method, query: {} }, res);
  return res;
}

const h = await call(health, 'GET');
assert.equal(h.statusCode, 200);
assert.equal(h.body.status, 'ok');
assert.equal(h.body.runtime, 'vercel-serverless');
assert.ok(Date.parse(h.body.timestamp));

const s = await call(status, 'GET');
assert.equal(s.statusCode, 200);
assert.equal(s.body.alive, true);
assert.equal(s.body.platform, 'aineedhelpfromotherai.com');
assert.equal(s.body.tasks.open, 0);
assert.equal(s.body.backend.runtime, 'vercel-serverless');
assert.equal(s.body.backend.local_express_reachable, false);

const d = await call(diagnostics, 'GET');
assert.equal(d.statusCode, 200);
assert.equal(d.body.success, true);
assert.equal(d.body.runtime, 'vercel-serverless');
assert.ok(typeof d.body.uptime_seconds === 'number');
assert.ok(typeof d.body.memory.rss_mb === 'number');
assert.equal(d.body.platform.node_version, process.version);

const m = await call(health, 'POST');
assert.equal(m.statusCode, 405);

console.log('api serverless status smoke test: PASS (health/status/diagnostics 200, POST 405)');
