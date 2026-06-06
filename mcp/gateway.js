// mcp/gateway.js — Minimal MCP Agent Gateway (Refactored: P1-A Complete)
// Exposes 14 tools over Streamable HTTP at POST/GET /mcp
// ARCHITECTURE: Tool registration delegated to specialized modules (DRY principle)
//   - task-execution.js: Tools 1-4 (list, claim, submit, scorecard)
//   - reasoning-cache.js: Tools 5-10, 13 (search, get, recommend, resolve, provenance)
//   - reasoning-store.js: Tools 11-12 (check_failures, store_reasoning)
//   - memory-gate.js: Tool 14 (memory_gate)
//   - environment-tools.js: Tools 15-16 (check_environment, get_known_failures)
// v2.0: Added tool timeout enforcement, schema validation gate
// v2.1: Added environment tools (check_environment, get_known_failures)
// Refactored from 814 lines to ~70 lines (91% reduction in gateway.js complexity)

const { getPool } = require('../lib/db');
const logger = require('../lib/logger');
const { logMcpUsage } = require('../lib/execution-history');
const { validateToolInput } = require('../lib/schema-validator');
const { TOOL_NAMES, ERROR_CODES } = require('./schema');
const { 
  loadSdk, 
  detectRuntime, 
  sanitizeArgs, 
  ok, 
  err 
} = require('./utilities');
const { registerTaskTools } = require('./task-execution');
const { registerReasoningTools } = require('./reasoning-cache');
const { registerStorageTools } = require('./reasoning-store');
const { registerMemoryGateTools } = require('./memory-gate');
const { registerEnvironmentTools } = require('./environment-tools');
const { analyze } = require('../lib/drift-detector');
const { generateIntervention } = require('../lib/intervention-engine');

const TOOL_TIMEOUT_MS = parseInt(process.env.MCP_TOOL_TIMEOUT_MS) || 30000;
const DRIFT_DETECTION_ENABLED = process.env.DRIFT_DETECTION_ENABLED !== 'false';

async function createGateway(req, res, parsedBody) {
  let mcpServer = null;
  let transport = null;
  const startTime = Date.now();
  let toolName = 'unknown';
  let runtimeType = 'unknown';
  let toolSuccess = false;
  let toolError = null;
  let timedOut = false;
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || null;

  // Extract tool name from parsed JSON-RPC body for pre-validation
  if (parsedBody?.method === 'tools/call' && parsedBody?.params?.name) {
    toolName = parsedBody.params.name;
    const toolArgs = parsedBody.params.arguments || {};

    // Pre-validate input against Tool Contract before executing
    const validation = validateToolInput(toolName, toolArgs);
    if (!validation.valid) {
      const errorResponse = {
        jsonrpc: '2.0',
        id: parsedBody.id || null,
        error: {
          code: -32602,
          message: `Input validation failed for ${toolName}`,
          data: validation,
        },
      };
      try {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(errorResponse));
      } catch {}
      toolSuccess = false;
      toolError = validation.message;
      // Still log the rejected call
      const durationMs = Date.now() - startTime;
      try {
        await logMcpUsage({
          timestamp: new Date().toISOString(),
          runtime: detectRuntime(null, req),
          agent_id: toolArgs.agent_id || 'unknown',
          tool: toolName,
          success: false,
          error: toolError,
          duration_ms: durationMs,
          client_ip: clientIp,
          user_agent: req.headers['user-agent'] || null,
          args: sanitizeArgs(toolArgs),
        });
      } catch {}
      return;
    }
  }

  try {
    const [{ McpServer }, { StreamableHTTPServerTransport }, z] = await loadSdk();
    runtimeType = detectRuntime(null, req);

    mcpServer = new McpServer(
      { name: 'aineedhelpfromotherai-reasoning-commons', version: '2.1.0' },
      { capabilities: {} }
    );

    // Register all 14 tools via specialized modules (one line each = clean architecture)
    await registerTaskTools(mcpServer, z, clientIp);
    await registerReasoningTools(mcpServer, z, clientIp);
    await registerStorageTools(mcpServer, z, clientIp);
    await registerMemoryGateTools(mcpServer, z, clientIp);
    await registerEnvironmentTools(mcpServer, z);

    transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await mcpServer.connect(transport);

    const originalSend = transport.send.bind(transport);
    transport.send = async (msg) => {
      // Intercept tool result/error messages to apply drift intervention
      if (DRIFT_DETECTION_ENABLED && (msg?.result || msg?.error) && msg.id && toolName !== 'unknown') {
        const agentId = parsedBody?.params?.arguments?.agent_id || parsedBody?.params?.arguments?.agentId || 'unknown';
        const driftResult = analyze({
          tool_name: toolName,
          agent_id: agentId,
          success: toolSuccess,
          error: toolError,
          duration_ms: Date.now() - startTime,
          args: parsedBody?.params?.arguments || {},
          timestamp: new Date().toISOString(),
        });

        if (driftResult.drift_detected) {
          const intervention = generateIntervention(driftResult.drift_type, driftResult.drift_score, {
            tool: toolName,
            error: toolError,
            args: parsedBody?.params?.arguments || {},
          });

          // Apply intervention to response message
          if (intervention.level === 1) {
            // Level 1: Append warning to existing response
            if (msg.result && msg.result.content) {
              msg.result.content.push({
                type: 'text',
                text: `\n\n${intervention.content._drift_warning.message}\n${intervention.content._drift_warning.suggestion || ''}`
              });
            }
          } else if (intervention.level === 2) {
            // Level 2: Replace with confirmation request
            msg.result = {
              content: intervention.content.content,
              isError: false,
              _meta: { needs_confirmation: true, drift_warning: intervention.content._drift_warning }
            };
          } else if (intervention.level === 3) {
            // Level 3: Block with error
            msg.error = {
              code: -32000,
              message: intervention.content._drift_warning.message,
              data: {
                drift_warning: intervention.content._drift_warning,
                alternatives: intervention.content._drift_warning.alternatives,
                action_required: intervention.content._drift_warning.action_required,
              }
            };
            msg.result = undefined;
          }
        }
      }

      if (msg?.error && msg.id) {
        toolSuccess = false;
        toolError = msg.error.message || 'MCP protocol error';
      } else if (msg?.result && msg.id) {
        toolSuccess = true;
      }
      return originalSend(msg);
    };

    // Run tool with timeout enforcement
    const result = await Promise.race([
      transport.handleRequest(req, res, parsedBody),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Tool ${toolName} timed out after ${TOOL_TIMEOUT_MS}ms`)), TOOL_TIMEOUT_MS)
      ),
    ]);
    return result;
  } catch (err) {
    toolSuccess = false;
    toolError = err.message;
    const isTimeout = err.message && err.message.includes('timed out');
    if (isTimeout) {
      timedOut = true;
      logger.warn('[MCP] Tool timeout:', { tool: toolName, timeout: TOOL_TIMEOUT_MS });
    } else {
      logger.error('[MCP] Gateway error:', err);
    }

    const errorCode = isTimeout ? 'tool_timeout' : 'gateway_error';
    const statusCode = isTimeout ? 408 : 500;

    try {
      const isInitialized = !err.message?.includes('timeout') && !err.message?.includes('SDK');
      const errorPayload = {
        error: errorCode,
        message: isTimeout
          ? `Tool ${toolName} exceeded ${TOOL_TIMEOUT_MS}ms timeout. Consider retrying with fewer results.`
          : err.message,
        recoverable: isTimeout,
        suggested_action: isTimeout ? 'retry_with_backoff' : 'retry',
      };
      const body = JSON.stringify({ content: [{ type: 'text', text: JSON.stringify(errorPayload) }], isError: true }, null, 2);
      try {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(body);
      } catch {
        res.writeHead(statusCode);
        res.end(body);
      }
    } catch (e) {
      try {
        res.writeHead(500);
        res.end('Internal server error');
      } catch {}
    }
  } finally {
    const durationMs = Date.now() - startTime;
    const agentId = parsedBody?.params?.arguments?.agent_id || parsedBody?.params?.arguments?.agentId || 'unknown';
    const logEntry = {
      timestamp: new Date().toISOString(),
      runtime: runtimeType,
      agent_id: agentId,
      tool: toolName,
      success: toolSuccess,
      error: toolError || null,
      duration_ms: durationMs,
      client_ip: clientIp,
      user_agent: userAgent,
      args: sanitizeArgs(parsedBody?.params?.arguments || {}),
      timed_out: timedOut,
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
