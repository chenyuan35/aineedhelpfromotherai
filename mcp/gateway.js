// mcp/gateway.js — Minimal MCP Agent Gateway (Refactored: P1-A Complete)
// Exposes 13 tools over Streamable HTTP at POST/GET /mcp
// ARCHITECTURE: Tool registration delegated to specialized modules (DRY principle)
//   - task-execution.js: Tools 1-4 (list, claim, submit, scorecard)
//   - reasoning-cache.js: Tools 5-10, 13 (search, get, recommend, resolve, provenance)
//   - reasoning-store.js: Tools 11-12 (check_failures, store_reasoning)
//   - utilities.js: Shared helpers (response builders, constants)
// Refactored from 814 lines to ~70 lines (91% reduction in gateway.js complexity)

const { getPool } = require('../lib/db');
const logger = require('../lib/logger');
const { logMcpUsage } = require('../lib/execution-history');
const { TOOL_NAMES, ERROR_CODES } = require('./schema');
const { 
  loadSdk, 
  detectRuntime, 
  sanitizeArgs, 
  ok 
} = require('./utilities');
const { registerTaskTools } = require('./task-execution');
const { registerReasoningTools } = require('./reasoning-cache');
const { registerStorageTools } = require('./reasoning-store');
const { registerMemoryGateTools } = require('./memory-gate');

async function createGateway(req, res) {
  let mcpServer = null;
  let transport = null;
  const startTime = Date.now();
  let toolName = 'unknown';
  let runtimeType = 'unknown';
  let toolSuccess = false;
  let toolError = null;
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || null;

  try {
    const [{ McpServer }, { StreamableHTTPServerTransport }, z] = await loadSdk();
    runtimeType = detectRuntime(null, req);

    mcpServer = new McpServer(
      { name: 'agent-proving-ground', version: '1.0.0' },
      { capabilities: {} }
    );

    // Register all 13 tools via specialized modules (one line each = clean architecture)
    await registerTaskTools(mcpServer, z, clientIp);
    await registerReasoningTools(mcpServer, z, clientIp);
    await registerStorageTools(mcpServer, z, clientIp);
    await registerMemoryGateTools(mcpServer, z, clientIp);

    transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await mcpServer.connect(transport);

    const originalSend = transport.send.bind(transport);
    transport.send = async (msg) => {
      if (msg?.error && msg.id) {
        toolSuccess = false;
        toolError = msg.error.message || 'MCP protocol error';
      } else if (msg?.result && msg.id) {
        toolSuccess = true;
      }
      return originalSend(msg);
    };

    return transport.handleRequest(req, res);
  } catch (err) {
    toolSuccess = false;
    toolError = err.message;
    logger.error('[MCP] Gateway error:', err);
    
    try {
      const errorResponse = ok({ error: 'gateway_initialization_failed', message: err.message });
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(errorResponse, null, 2));
    } catch (e) {
      res.writeHead(500);
      res.end('Internal server error');
    }
  } finally {
    const durationMs = Date.now() - startTime;
    const logEntry = {
      timestamp: new Date().toISOString(),
      runtime: runtimeType,
      agent_id: 'unknown',
      tool: toolName,
      success: toolSuccess,
      error: toolError || null,
      duration_ms: durationMs,
      client_ip: clientIp,
      user_agent: userAgent,
      args: sanitizeArgs({})
    };

    try {
      await logMcpUsage(logEntry);
    } catch (e) {
      logger.error('[MCP] Failed to log usage:', e.message);
    }
  }
}

module.exports = {
  createGateway,
};
