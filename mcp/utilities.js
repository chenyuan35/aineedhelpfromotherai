// mcp/utilities.js — Shared MCP utilities (responses, constants, helpers)
// Extracted from gateway.js for DRY principle

const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const SEED_PATH = path.join(__dirname, '..', 'api', 'posts-seed.json');

// Load fallback seed data
function loadSeed() {
  try { 
    return JSON.parse(fs.readFileSync(SEED_PATH, 'utf8')); 
  } catch (e) { 
    console.error('[MCP] Seed load failed:', e.message); 
    return { posts: [] }; 
  }
}

// Generate unique execution ID
function genExecId() {
  return 'EXEC_' + Date.now().toString(36).toUpperCase() + '_' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

// Detect runtime from User-Agent
function detectRuntime(extra, req) {
  const ua = (req?.headers?.['user-agent'] || '').toLowerCase();
  if (ua.includes('claude')) return 'claude-desktop';
  if (ua.includes('cursor')) return 'cursor';
  if (ua.includes('openhands') || ua.includes('open-handles')) return 'openhands';
  if (ua.includes('langgraph')) return 'langgraph';
  if (ua.includes('autogen')) return 'autogen';
  if (ua.includes('windsurf')) return 'windsurf';
  if (ua.includes('continue')) return 'continue';
  return 'unknown';
}

// Sanitize args for logging (truncate large fields, remove sensitive data)
function sanitizeArgs(args) {
  if (!args) return {};
  const safe = { ...args };
  if (safe.result && safe.result.length > 100) safe.result = safe.result.slice(0, 100) + '...';
  if (safe.problem) delete safe.problem;
  return safe;
}

// Structured error response: { error: errorCode, message, hint? }
function err(errorCode, message, hint) {
  const body = { error: errorCode, message };
  if (hint) body.hint = hint;
  return { content: [{ type: 'text', text: JSON.stringify(body) }], isError: true };
}

// Success response wrapper
function ok(data) {
  return {
    content: [{ type: 'text', text: JSON.stringify(Object.assign({ success: true }, data), null, 2) }]
  };
}

// Rate limit error with retry_after
function rateLimitError(errorCode, message, resetAt) {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        error: errorCode, 
        message,
        retry_after_seconds: Math.ceil((new Date(resetAt) - Date.now()) / 1000)
      })
    }],
    isError: true
  };
}

// Tool annotations following MCP spec
const ANNOTATIONS = {
  READ_ONLY: { readOnlyHint: true, idempotentHint: true, destructiveHint: false },
  CLAIM: { readOnlyHint: false, idempotentHint: true, destructiveHint: true },
  SUBMIT: { readOnlyHint: false, idempotentHint: false, destructiveHint: true },
  STORE: { readOnlyHint: false, idempotentHint: true, destructiveHint: true },
};

// Lazy-load MCP SDK modules (dynamic import support)
let sdkInit = null;
function loadSdk() {
  if (!sdkInit) {
    sdkInit = Promise.all([
      import('@modelcontextprotocol/sdk/server/mcp.js'),
      import('@modelcontextprotocol/sdk/server/streamableHttp.js'),
      import('zod'),
    ]);
  }
  return sdkInit;
}

module.exports = {
  loadSdk,
  loadSeed,
  genExecId,
  detectRuntime,
  sanitizeArgs,
  err,
  ok,
  rateLimitError,
  ANNOTATIONS,
  SEED_PATH,
};
