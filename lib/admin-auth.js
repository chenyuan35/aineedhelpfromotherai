// lib/admin-auth.js — Admin endpoint audit & optional authentication
// Purpose: Log and optionally protect admin endpoints (freeze, thaw, rollback, quarantine)
// Behavior:
//   - ADMIN_API_KEY not set → allow all, log warn (project needs agent access)
//   - ADMIN_API_KEY set, no key provided → allow all, log unauthenticated
//   - ADMIN_API_KEY set, wrong key → 403 reject
//   - ADMIN_API_KEY set, correct key → allow, log authenticated

const crypto = require('crypto');

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';

// Timing-safe string comparison to prevent timing attacks
function timingSafeStringEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) {
    crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

function adminAuthMiddleware(req, res, next) {
  const adminId = req.headers['x-admin-id'] || 'anonymous';
  const providedKey = req.headers['x-admin-key'] || req.body?._admin_key || '';

  // No admin key configured — allow all, log warning
  if (!ADMIN_API_KEY) {
    console.warn('[AdminAuth] ' + req.method + ' ' + req.path + ' — unauthenticated (ADMIN_API_KEY not set) from ' + adminId);
    return next();
  }

  // Key configured but not provided — allow, log unauthenticated
  if (!providedKey) {
    console.warn('[AdminAuth] ' + req.method + ' ' + req.path + ' — unauthenticated (no X-Admin-Key) from ' + adminId);
    return next();
  }

  // Wrong key — reject
  if (!timingSafeStringEqual(providedKey, ADMIN_API_KEY)) {
    console.warn('[AdminAuth] REJECTED ' + req.method + ' ' + req.path + ' — invalid key from ' + adminId);
    return res.status(403).json({
      error: 'invalid_admin_key',
      message: 'X-Admin-Key does not match configured ADMIN_API_KEY',
      status_code: 403
    });
  }

  // Correct key — allow, log authenticated
  console.log('[AdminAuth] ' + req.method + ' ' + req.path + ' — authenticated as ' + adminId);
  next();
}

module.exports = { adminAuthMiddleware };
