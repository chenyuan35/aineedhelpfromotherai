// lib/weak-auth.js — Weak Agent Authentication (X-Agent-Signature)
// Purpose: Light-weight agent validation without full OAuth/JWT
// Mechanism: HMAC-SHA256 signature of (agent_id + timestamp + nonce)
// NOT for cryptographic security, for rate-limit evasion prevention

const crypto = require('crypto');

// Shared secret — weak auth doesn't aim for strong cryptography
// In production, could be rotated or per-agent
const SHARED_SECRET = process.env.AGENT_AUTH_SECRET || 'weakauth-default-secret-change-in-production';

// Generate a valid signature for an agent (for clients to use)
function generateSignature(agentId, timestamp = Date.now(), nonce = '') {
  if (!agentId) throw new Error('agentId required');
  
  const msg = `${agentId}:${timestamp}:${nonce}`;
  const sig = crypto.createHmac('sha256', SHARED_SECRET)
    .update(msg)
    .digest('hex');
  
  return sig;
}

// Verify a signature from a request header
function verifySignature(req) {
  const sig = req.headers['x-agent-signature'];
  const agentId = req.headers['x-agent-id'];
  const timestamp = req.headers['x-agent-timestamp'];
  const nonce = req.headers['x-agent-nonce'] || '';

  if (!sig || !agentId || !timestamp) {
    return {
      valid: false,
      reason: 'Missing signature headers (x-agent-signature, x-agent-id, x-agent-timestamp)',
      agentId: agentId || 'unknown'
    };
  }

  // Prevent replay attacks: timestamp must be within 5 minutes
  const now = Date.now();
  const age = now - parseInt(timestamp);
  const MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

  if (isNaN(age) || age < 0 || age > MAX_AGE_MS) {
    return {
      valid: false,
      reason: `Signature timestamp outside valid window (${Math.round(age / 1000)}s old, max ${MAX_AGE_MS / 1000}s)`,
      agentId
    };
  }

  // Compute expected signature
  const expected = generateSignature(agentId, timestamp, nonce);

  try {
    const sigBuf = Buffer.from(String(sig), 'hex');
    const expBuf = Buffer.from(String(expected), 'hex');
    if (sigBuf.length !== expBuf.length) {
      return { valid: false, reason: 'Signature length mismatch', agentId };
    }
    const match = crypto.timingSafeEqual(sigBuf, expBuf);
    return { valid: match, reason: match ? 'Valid signature' : 'Signature mismatch', agentId };
  } catch (e) {
    return { valid: false, reason: 'Signature verification error', agentId };
  }
}

// Middleware: verify signature or allow with warning
function weakAuthMiddleware(options = {}) {
  const { strict = false, logFunction = console.log } = options;

  return (req, res, next) => {
    const result = verifySignature(req);
    req.agentAuth = result;

    if (!result.valid) {
      if (strict) {
        return res.status(401).json({
          error: 'invalid_agent_signature',
          message: result.reason,
          hint: 'Provide valid X-Agent-Signature header. See /api/manifest for auth details.'
        });
      }

      // Non-strict: log warning but allow
      logFunction(`[WeakAuth] ${result.agentId} - Unverified: ${result.reason}`);
    } else {
      logFunction(`[WeakAuth] ${result.agentId} - Verified (signature OK)`);
    }

    next();
  };
}

module.exports = {
  generateSignature,
  verifySignature,
  weakAuthMiddleware,
  SHARED_SECRET
};
