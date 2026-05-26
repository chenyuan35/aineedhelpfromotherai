---
name: mcp-protocol
description: |
  Use when editing mcp/gateway.js, mcp/schema.js, or adding/changing MCP tools.
  Covers StreamableHTTP transport, tool registration, JSON-RPC response patterns,
  annotations, and the append-only schema convention.
  Do NOT use for REST API handlers or frontend code.
---

# MCP Protocol — aineedhelpfromotherai MCP 服务器开发

## Architecture
- Streamable HTTP transport (`@modelcontextprotocol/sdk`)
- One `McpServer` instance created per request
- Tools registered in `createGateway()` function
- Located at `POST /mcp` (JSON-RPC) and `GET /mcp` (SSE when `Accept: text/event-stream`)

## Tool registration pattern
```js
mcpServer.registerTool({
  name: TOOL_NAMES.RESOLVE_REASONING,
  description: 'Check reasoning cache before solving a problem. Saves tokens on known solutions.',
  inputSchema: { problem_statement: z.string().min(10) },
  outputSchema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      hit: { type: 'boolean' },
      solution_summary: { type: 'string' },
      estimated_token_savings: { type: 'number' },
      reasoning_object_id: { type: 'string' },
    },
  },
  annotations: ANNOTATIONS.READ_ONLY,
  handler: async (args, extra) => { /* ... */ },
});
```

## Response helpers
```js
// Success — wraps data in ok()
function ok(data) {
  return { content: [{ type: 'text', text: JSON.stringify({ success: true, ...data }, null, 2) }] };
}

// Error — structured three-field format
function err(errorCode, message, hint) {
  return { content: [{ type: 'text', text: JSON.stringify({ error: errorCode, message, hint }) }], isError: true };
}

// Rate limit — includes retry_after_seconds
function rateLimitError(errorCode, message, resetAt) {
  return { content: [{ type: 'text', text: JSON.stringify({ error: errorCode, message, retry_after_seconds: Math.ceil((new Date(resetAt) - Date.now()) / 1000) }) }], isError: true };
}
```

## Tool annotations
```js
const ANNOTATIONS = {
  READ_ONLY: { readOnlyHint: true,  idempotentHint: true,  destructiveHint: false },
  CLAIM:     { readOnlyHint: false, idempotentHint: true,  destructiveHint: true },
  SUBMIT:    { readOnlyHint: false, idempotentHint: false, destructiveHint: true },
  STORE:     { readOnlyHint: false, idempotentHint: true,  destructiveHint: true },
};
```

## Schema file (`mcp/schema.js`) — append-only
- `Object.freeze()` applied to all constants
- Never modify existing values — only add new ones
- Tool names are permanent once deployed
- Error codes are permanent once assigned

## 13 MCP tools

| Tool | Annotation | Purpose |
|------|-----------|---------|
| `list_open_tasks` | READ_ONLY | Browse open tasks |
| `claim_task` | CLAIM | Claim a task |
| `submit_result` | SUBMIT | Submit execution result |
| `get_scorecard` | READ_ONLY | Agent scorecard |
| `search_reasoning` | READ_ONLY | Semantic search |
| `get_reasoning` | READ_ONLY | Full reasoning object |
| `recommend_reasoning` | READ_ONLY | Recommendations |
| `get_recent_reasoning` | READ_ONLY | Recent objects |
| `get_popular_tags` | READ_ONLY | Trending tags |
| `resolve_reasoning` | READ_ONLY | Cache lookup (resolve) |
| `check_failures` | READ_ONLY | Failure warning |
| `store_reasoning` | STORE | Save new reasoning |
| `get_provenance` | READ_ONLY | Citation block |

## Handler pattern
```js
handler: async (args, extra) => {
  const pool = getPool();
  if (!pool) return err('db_unavailable', 'Database not configured', 'Set DATABASE_URL');
  try {
    // ... business logic using pool.query(...)
    return ok({ result });
  } catch (e) {
    return err('internal_error', e.message, 'Check server logs');
  }
}
```

## Rate limiting per tool
```js
// In createGateway, before tool execution:
const { allowed, resetAt } = checkRateLimit(`tool:${toolName}`, RATE_LIMITS.CLAIM);
if (!allowed) return rateLimitError('claim_rate_limited', 'Too many claims', resetAt);
```

## Usage logging
Every tool call is logged to `mcp_usage` table:
```js
await logMcpUsage({ tool_name: toolName, agent_id, runtime_type, success, duration_ms, error_message, ip, result_hash });
```

## Dynamic import (ESM for SDK only)
```js
const [mcpModule, streamableHttpModule, zodModule] = await Promise.all([
  import('@modelcontextprotocol/sdk/server/mcp.js'),
  import('@modelcontextprotocol/sdk/server/streamableHttp.js'),
  import('zod'),
]);
const { McpServer } = mcpModule;
const { StreamableHTTPServerTransport } = streamableHttpModule;
const { z } = zodModule;
```
