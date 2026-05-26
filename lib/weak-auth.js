#!/usr/bin/env node
const crypto = require('crypto');

const SHARED_SECRET = process.env.AGENT_AUTH_SECRET || 'weakauth-default-secret-change-in-production';

function generateSignature(agentId, timestamp, nonce = '') {
  const msg = `${agentId}:${timestamp}:${nonce}`;
  return crypto.createHmac('sha256', SHARED_SECRET).update(msg).digest('hex');
}

function verifySignature(req) {
  const agentId = req.headers['x-agent-id'];
  const timestamp = req.headers['x-agent-timestamp'];
  const nonce = req.headers['x-agent-nonce'] || '';
  const provided = req.headers['x-agent-signature'];

  if (!agentId || !timestamp || !provided) {
    return { valid: false, reason: 'missing required headers' };
  }

  const now = Date.now();
  const ts = parseInt(timestamp, 10);
  if (Number.isNaN(ts) || Math.abs(now - ts) > 300000) {
    return { valid: false, reason: 'timestamp out of window' };
  }

  const expected = generateSignature(agentId, timestamp, nonce);
  try {
    const valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
    return { valid, reason: valid ? 'ok' : 'signature mismatch' };
  } catch {
    return { valid: false, reason: 'signature comparison failed' };
  }
}

module.exports = { generateSignature, verifySignature, SHARED_SECRET };