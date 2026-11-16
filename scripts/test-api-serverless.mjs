// Smoke test for the serverless /api functions (api/*.js).
// Run: node scripts/test-api-serverless.mjs
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const health = require('../api/health.js');
const status = require('../api/status.js');
const diagnostics = require('../api/diagnostics.js');
const relayRiskV2 = require('../api/reasoning/relay-risk-v2.js');

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

async function call(handler, req) {
  const res = mockRes();
  await handler(req, res);
  return res;
}

function req(method, url, extra = {}) {
  return {
    method,
    url,
    headers: {},
    body: undefined,
    socket: {},
    ...extra,
  };
}

// --- /api/health, /api/status, /api/diagnostics ---
const h = await call(health, req('GET', '/api/health'));
assert.equal(h.statusCode, 200);
assert.equal(h.body.status, 'ok');
assert.equal(h.body.runtime, 'vercel-serverless');
assert.ok(Date.parse(h.body.timestamp));

const s = await call(status, req('GET', '/api/status'));
assert.equal(s.statusCode, 200);
assert.equal(s.body.alive, true);
assert.equal(s.body.platform, 'aineedhelpfromotherai.com');
assert.equal(s.body.tasks.open, 0);
assert.equal(s.body.backend.runtime, 'vercel-serverless');
assert.equal(s.body.backend.local_express_reachable, false);

const d = await call(diagnostics, req('GET', '/api/diagnostics'));
assert.equal(d.statusCode, 200);
assert.equal(d.body.success, true);
assert.equal(d.body.runtime, 'vercel-serverless');
assert.ok(typeof d.body.uptime_seconds === 'number');
assert.ok(typeof d.body.memory.rss_mb === 'number');
assert.equal(d.body.platform.node_version, process.version);

const m = await call(health, req('POST', '/api/health'));
assert.equal(m.statusCode, 405);

// --- /api/reasoning/relay-risk-v2 ---
const noSite = await call(relayRiskV2, req('GET', '/api/reasoning/relay-risk-v2'));
assert.equal(noSite.statusCode, 400);
assert.equal(noSite.body.error, 'invalid site');

const badSite = await call(relayRiskV2, req('GET', '/api/reasoning/relay-risk-v2?site=not_a_domain'));
assert.equal(badSite.statusCode, 400);
assert.equal(badSite.body.error, 'invalid site');

const okSite = await call(relayRiskV2, req('GET', '/api/reasoning/relay-risk-v2?site=https://www.example.com/'));
assert.equal(okSite.statusCode, 200);
assert.equal(okSite.body.relayKey, 'example.com');
assert.equal(okSite.body.available, false);
assert.equal(okSite.body.riskIndex, null);
assert.equal(okSite.body.confidence, 'unavailable');
assert.equal(okSite.body.methodologyVersion, '2026-09-14-v1');
assert.equal(okSite.body.community.votes, 0);
assert.equal(okSite.body.community.windowDays, 30);

const voteBody = {
  site: 'example.com',
  voterId: 'test-voter-0123456789',
  survivalOutlook: 'yes',
  modelTrust: 'trust',
};
const vote = await call(relayRiskV2, req('POST', '/api/reasoning/relay-risk-v2', {
  headers: { 'x-forwarded-for': '10.0.0.1' },
  body: voteBody,
}));
assert.equal(vote.statusCode, 503);
assert.equal(vote.body.error, 'community vote storage unavailable');

const badVote = await call(relayRiskV2, req('POST', '/api/reasoning/relay-risk-v2', {
  headers: { 'x-forwarded-for': '10.0.0.2' },
  body: { site: 'example.com', voterId: 'short', survivalOutlook: 'yes' },
}));
assert.equal(badVote.statusCode, 400);
assert.equal(badVote.body.error, 'invalid voterId');

const badChoice = await call(relayRiskV2, req('POST', '/api/reasoning/relay-risk-v2', {
  headers: { 'x-forwarded-for': '10.0.0.3' },
  body: { ...voteBody, survivalOutlook: 'maybe' },
}));
assert.equal(badChoice.statusCode, 400);
assert.equal(badChoice.body.error, 'invalid survival choice');

// Rate limit: 10 POSTs allowed per minute per IP, 11th is 429.
let last;
for (let i = 0; i < 11; i++) {
  last = await call(relayRiskV2, req('POST', '/api/reasoning/relay-risk-v2', {
    headers: { 'x-forwarded-for': '10.0.0.9' },
    body: voteBody,
  }));
}
assert.equal(last.statusCode, 429);
assert.equal(last.headers['Retry-After'], '60');

const relay405 = await call(relayRiskV2, req('PUT', '/api/reasoning/relay-risk-v2'));
assert.equal(relay405.statusCode, 405);

console.log('api serverless smoke test: PASS (health/status/diagnostics + relay-risk-v2 GET/POST/rate-limit)');
