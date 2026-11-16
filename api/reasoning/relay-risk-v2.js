// GET/POST /api/reasoning/relay-risk-v2 — served by a Vercel serverless function.
//
// This mirrors lib/relay-risk-v2.js's no-database path. No Postgres is
// reachable from the public edge: the Cloudflare tunnel cannot connect from
// the current host (direct egress blocked, QUIC blocked, port 7844 TLS
// handshake stalls through the egress proxy), and the 443-based tunnel
// alternatives (SSH-based localhost.run / Pinggy) are blocked the same way.
// So GET returns the codebase's own fail-closed unavailable shape and POST
// votes return the codebase's own 503 ('community vote storage
// unavailable'). Nothing is invented: with zero votes and zero measured
// signals in the local tables, this is the true current state, and the
// Relay checker page renders it as its empty state. If a hosted database
// lands (for example Neon), this function should read live data instead.
//
// Validation helpers mirror lib/relay-risk-v2.js; keep in sync.
const { checkRateLimit } = require('../../lib/rate-limit');

const METHODOLOGY_VERSION = '2026-09-14-v1';
const FORECAST_WINDOW_DAYS = 30;

function normalizeSite(raw) {
  if (typeof raw !== 'string') throw new Error('site is required');
  const value = raw.trim();
  if (!value || value.length > 255) throw new Error('invalid site');
  let url;
  try { url = new URL(value.includes('://') ? value : `https://${value}`); }
  catch { throw new Error('invalid site'); }
  const host = url.hostname.toLowerCase().replace(/^www\./, '').replace(/\.$/, '');
  const labels = host.split('.');
  if (!host || host.length > 253 || !host.includes('.') || !/^[a-z0-9.-]+$/.test(host) ||
      labels.some(label => !label || label.length > 63 || label.startsWith('-') || label.endsWith('-'))) {
    throw new Error('invalid site');
  }
  return host;
}

function validateVoterId(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{16,80}$/.test(value)) throw new Error('invalid voterId');
  return value;
}

function mapChoice(value, type) {
  const maps = {
    survival: { yes: 100, unsure: 50, no: 0 },
    trust: { trust: 100, unsure: 50, suspect: 0 },
  };
  if (value == null && type === 'trust') return null;
  if (!Object.prototype.hasOwnProperty.call(maps[type], value)) throw new Error(`invalid ${type} choice`);
  return maps[type][value];
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    return res.status(204).end();
  }
  const url = req.url || '';
  const getParam = (name) => {
    const m = url.match(new RegExp(`[?&]${name}=([^&]+)`));
    return m ? decodeURIComponent(m[1]) : null;
  };
  try {
    if (req.method === 'GET') {
      const relayKey = normalizeSite(getParam('site') || '');
      return res.status(200).json({
        relayKey,
        available: false,
        riskIndex: null,
        confidence: 'unavailable',
        methodologyVersion: METHODOLOGY_VERSION,
        community: { votes: 0, windowDays: FORECAST_WINDOW_DAYS },
      });
    }
    if (req.method === 'POST') {
      const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
      const limit = checkRateLimit('relayRiskVoteV2', clientIp, null, { maxRequests: 10, windowMs: 60000 });
      if (!limit.allowed) {
        res.setHeader('Retry-After', '60');
        return res.status(429).json({ error: 'Too many relay forecast submissions. Try again in a minute.' });
      }
      const body = req.body || {};
      normalizeSite(body.site);
      validateVoterId(body.voterId);
      mapChoice(body.survivalOutlook, 'survival');
      mapChoice(body.modelTrust, 'trust');
      return res.status(503).json({ error: 'community vote storage unavailable' });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message || 'invalid request' });
  }
};
