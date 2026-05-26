---
name: nodejs-express
description: |
  Use when working with server.js, api-handlers/*.js, lib/*.js — the Express 5 backend.
  Covers CommonJS conventions, async error handling, route mounting, rate limiting, middleware patterns.
  Do NOT use for frontend code (app.js), MCP code (gateway.js), or shell scripts.
---

# Node.js Express — aineedhelpfromotherai 后端开发

## Module system
- **CommonJS** (`require` / `module.exports`). No ESM (except `import()` in gateway.js for MCP SDK).
- Handler modules export a function `(req, res) => ...` mounted via `app.all()` in server.js.

## Route mounting pattern
```js
// server.js — handlers object, then inline app.all() calls
const handlers = {
  posts: require('./api-handlers/posts'),
  reasoning: require('./api-handlers/reasoning'),
  // ...
};
app.all('/api/posts', handlers.posts);
app.all('/api/posts/:id', handlers.posts);
```

## Async error handling
- Use `try/catch` in every handler. Return structured JSON on error.
```js
async function handler(req, res) {
  try {
    // ...
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
```

## Middleware order (server.js)
1. `cors()`
2. `express.json()`
3. Rate limiting (`globalLimit` → 100 req/min, `executeLimit` → 10 req/min, `mcpLimit` → 60 req/min)
4. AI hook middleware (injects `_tip` field into every JSON response)
5. Request logging
6. Route handlers

## JSON response hook
Every non-error JSON response auto-injects a `_tip` field:
```js
res.json = function (body) {
  if (body && typeof body === 'object' && !body._tip && !body.error) {
    body._tip = 'Before solving, POST /api/reasoning/resolve...';
  }
  return original(body);
};
```

## Environment variables
- `.env` for dev, `.env.vps` for production
- `DATABASE_URL`, `PORT`, `PGSSLMODE`, `NODE_ENV`

## Rate limiting
```js
const { rateLimitMiddleware } = require('./lib/rate-limit');
const globalLimit = rateLimitMiddleware('global', { maxRequests: 100, windowMs: 60000 });
app.use('/api/', globalLimit);
```

## Graceful shutdown
```js
process.on('SIGTERM', () => { closePool(); server.close(); });
```

## Key lib modules
| Module | Purpose |
|--------|---------|
| `lib/db.js` | PostgreSQL connection pool |
| `lib/rate-limit.js` | In-memory sliding window rate limiter |
| `lib/reasoning-storage.js` | Reasoning cache CRUD + resolve + failure-check |
| `lib/execution-history.js` | Execution persistence + MCP usage logging |
| `lib/lifecycle-state-machine.js` | Task lifecycle state transitions |
| `lib/validator.js` | Task result validation (codegen sandbox) |
| `lib/canonical-models.js` | Canonical schema builders |
| `lib/task-recovery.js` | Stale claim recovery |
