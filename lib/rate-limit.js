// lib/rate-limit.js — Per-IP and per-agent rate limiting
// In-memory sliding window with LRU eviction (resets on PM2 restart — sufficient for single VPS)

const windows = new Map();
const MAX_ENTRIES = 10000;

const DEFAULT_LIMITS = {
  global: { maxRequests: 100, windowMs: 60000 },
  execute: { maxRequests: 10, windowMs: 60000 },
  register: { maxRequests: 3, windowMs: 300000 },
  mcp: { maxRequests: 60, windowMs: 60000 },
  mcpClaim: { maxRequests: 5, windowMs: 60000 },
  mcpSubmit: { maxRequests: 10, windowMs: 60000 },
  mcpStore: { maxRequests: 10, windowMs: 60000 },
  mcpSearch: { maxRequests: 60, windowMs: 60000 },
};

function getKey(prefix, ip, agentId) {
  return agentId ? `${prefix}:${ip}:${agentId}` : `${prefix}:${ip}`;
}

function cleanup() {
  const now = Date.now();
  if (windows.size > MAX_ENTRIES) {
    const entries = [...windows.entries()].sort((a, b) => a[1].start - b[1].start);
    const toDelete = entries.slice(0, entries.length - MAX_ENTRIES);
    for (const [key] of toDelete) windows.delete(key);
  }
  for (const [key, entry] of windows) {
    if (now - entry.start > entry.windowMs) {
      windows.delete(key);
    }
  }
}

let cleanupTimer = null;
function ensureCleanup() {
  if (!cleanupTimer) {
    cleanupTimer = setInterval(cleanup, 300000);
  }
}

function checkRateLimit(prefix, ip, agentId, customLimits) {
  ensureCleanup();
  const limits = customLimits || DEFAULT_LIMITS[prefix] || DEFAULT_LIMITS.global;
  const key = getKey(prefix, ip, agentId);
  const now = Date.now();

  let entry = windows.get(key);
  if (!entry || now - entry.start > limits.windowMs) {
    entry = { count: 0, start: now, windowMs: limits.windowMs };
    windows.set(key, entry);
  }

  entry.count += 1;
  const allowed = entry.count <= limits.maxRequests;

  return {
    allowed,
    remaining: Math.max(0, limits.maxRequests - entry.count),
    resetAt: new Date(entry.start + limits.windowMs).toISOString(),
    limit: limits.maxRequests,
    window: limits.windowMs
  };
}

function rateLimitMiddleware(prefix, limits) {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
               req.headers['x-real-ip'] ||
               req.socket?.remoteAddress ||
               'unknown';
    const agentId = req.headers['x-agent-id'] || null;
    const result = checkRateLimit(prefix, ip, agentId, limits);

    res.setHeader('X-RateLimit-Limit', result.limit);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', result.resetAt);

    if (!result.allowed) {
      const retryAfter = Math.ceil((result.window || 60000) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        limit: result.limit,
        remaining: result.remaining,
        reset_at: result.resetAt,
        retry_after_seconds: retryAfter
      });
    }

    next();
  };
}

// Factory: create middleware with DEFAULT_LIMITS
function createRateLimitMiddleware(prefix) {
  return rateLimitMiddleware(prefix, DEFAULT_LIMITS[prefix]);
}

// Factory: create middleware with custom limits
function createCustomRateLimitMiddleware(prefix, customLimits) {
  return rateLimitMiddleware(prefix, customLimits);
}

module.exports = { 
  checkRateLimit, 
  rateLimitMiddleware, 
  createRateLimitMiddleware,
  createCustomRateLimitMiddleware,
  DEFAULT_LIMITS 
};
