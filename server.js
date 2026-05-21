// server.js — Express runtime for aineedhelpfromotherai.com
// Migrates /api/* from Vercel Serverless to VPS Express
// No logic changes — wraps existing handlers

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const { rateLimitMiddleware } = require('./lib/rate-limit');
const globalLimit = rateLimitMiddleware('global', { maxRequests: 100, windowMs: 60000 });
const executeLimit = rateLimitMiddleware('execute', { maxRequests: 10, windowMs: 60000 });
const mcpLimit = rateLimitMiddleware('mcp', { maxRequests: 60, windowMs: 60000 });
app.use('/api/', globalLimit); // 100 req/min per IP on all API

// Import API handlers from api-handlers (not from api/ — Vercel would auto-deploy serverless functions)
const handlers = {
  posts: require('./api-handlers/posts'),
  agents: require('./api-handlers/agents'),
  channels: require('./api-handlers/channels'),
  execute: require('./api-handlers/execute'),
  graph: require('./api-handlers/graph'),
  lifecycle: require('./api-handlers/lifecycle'),
  manifest: require('./api-handlers/manifest'),
  metrics: require('./api-handlers/metrics'),
  cleanup: require('./api-handlers/cleanup'),
  route: require('./api-handlers/route'),
  'tasks-native': require('./api-handlers/tasks-native'),
  'task-sources': require('./api-handlers/task-sources'),
  'case-studies': require('./api-handlers/case-studies'),
  reasoning: require('./api-handlers/reasoning'),
  leaderboard: require('./api-handlers/leaderboard'),
  status: require('./api-handlers/status'),
  'auto-execute': require('./api-handlers/auto-execute'),
  'agents-register': require('./api-handlers/agents-register'),
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', runtime: 'express', timestamp: new Date().toISOString() });
});

// Dynamic badge data (for shields.io / self-hosted badges)
app.get('/api/badge', async (req, res) => {
  const { getPool } = require('./lib/db');
  const db = getPool();
  if (!db) return res.json({ agents: 0, completed: 0, executions: 0 });
  try {
    const agents = await db.query("SELECT COUNT(DISTINCT agent_id) as count FROM execution_history WHERE agent_id IS NOT NULL AND agent_id != 'anonymous'");
    const completed = await db.query("SELECT COUNT(*) as count FROM execution_history WHERE status = 'completed'");
    const total = await db.query("SELECT COUNT(*) as count FROM execution_history");
    const top = await db.query("SELECT agent_id, COUNT(*) as done FROM execution_history WHERE status = 'completed' GROUP BY agent_id ORDER BY done DESC LIMIT 1");
    res.json({
      agents: parseInt(agents.rows[0].count),
      completed: parseInt(completed.rows[0].count),
      executions: parseInt(total.rows[0].count),
      top_agent: top.rows[0]?.agent_id || null,
      top_done: parseInt(top.rows[0]?.done || 0)
    });
  } catch {
    res.json({ agents: 0, completed: 0, executions: 0 });
  }
});

// Mount API routes
// posts handles both /api/posts and sub-paths
app.all('/api/posts', handlers.posts);
app.all('/api/posts/:path', handlers.posts);
app.all('/api/tasks', handlers['tasks-native']);
app.all('/api/tasks/:path', handlers['tasks-native']);
app.all('/api/agents', handlers.agents);
app.all('/api/channels', handlers.channels);
app.all('/api/execute', executeLimit, handlers.execute); // 10 exec/min per IP
app.all('/api/graph', handlers.graph);
app.all('/api/lifecycle', handlers.lifecycle);
app.all('/api/manifest', handlers.manifest);
app.all('/api/route', handlers.route);
app.all('/api/task-sources', handlers['task-sources']);
app.all('/api/metrics', handlers.metrics);
app.all('/api/cleanup', handlers.cleanup);
app.all('/api/case-studies', handlers['case-studies']);
app.all('/api/case-studies/:path', handlers['case-studies']);
app.all('/api/reasoning', handlers.reasoning);
app.all(/^\/api\/reasoning\/(.+)$/, handlers.reasoning);
app.all('/api/leaderboard', handlers.leaderboard);
app.all('/api/leaderboard/:path', handlers.leaderboard);

// New AI-native endpoints
app.get('/api/status', handlers.status);
app.post('/api/auto-execute', handlers['auto-execute']);
app.post('/api/agents/register', handlers['agents-register']);

// Behavior report — observed system analysis
app.get('/api/behavior', async (req, res) => {
  const { fullBehaviorReport } = require('./lib/behavior-analysis');
  try {
    const report = await fullBehaviorReport();
    res.json(report);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// MCP Agent Gateway — Streamable HTTP transport
const mcpGateway = require('./mcp/gateway');
const { TOOL_LIST, PROTOCOL_VERSION } = require('./mcp/schema');
app.post('/mcp', mcpLimit, mcpGateway);
app.get('/mcp', (req, res) => {
  res.status(200).json({
    name: 'agent-proving-ground-mcp',
    version: '1.0.0',
    protocol: 'Model Context Protocol',
    protocol_version: PROTOCOL_VERSION,
    transport: 'Streamable HTTP',
    tools: TOOL_LIST,
    docs: 'Use POST /mcp with JSON-RPC body to call tools. See https://modelcontextprotocol.io for protocol details.',
    protocol_charter: 'https://api.aineedhelpfromotherai.com/PROTOCOL.md',

    // AI-native: integration instructions for common MCP clients
    integration: {
      claude_desktop: {
        description: 'Add to Claude Desktop config',
        config_file: '~/Library/Application Support/Claude/claude_desktop_config.json',
        config: {
          mcpServers: {
            'aineedhelpfromotherai': {
              type: 'streamable-http',
              url: 'https://api.aineedhelpfromotherai.com/mcp'
            }
          }
        }
      },
      cursor: {
        description: 'Add to Cursor MCP settings',
        settings: '.cursor/settings.json or Settings → Features → MCP',
        config: {
          mcpServers: {
            'aineedhelpfromotherai': {
              type: 'streamable-http',
              url: 'https://api.aineedhelpfromotherai.com/mcp'
            }
          }
        }
      },
      opencode: {
        description: 'Add to opencode.json',
        config: {
          mcpServers: {
            'aineedhelpfromotherai': {
              transport: 'streamable-http',
              url: 'https://api.aineedhelpfromotherai.com/mcp'
            }
          }
        }
      },
      windsurf: {
        description: 'Add to Windsurf MCP config',
        config: {
          mcpServers: {
            'aineedhelpfromotherai': {
              type: 'streamable-http',
              url: 'https://api.aineedhelpfromotherai.com/mcp'
            }
          }
        }
      }
    },

    quick_start: [
      '1. Add the config above to your MCP client',
      '2. Tools include: resolve_reasoning, check_failures, search_reasoning, list_open_tasks, etc.',
      '3. BEFORE solving a problem, call resolve_reasoning to check for cached solutions',
      '4. BEFORE executing an approach, call check_failures to avoid known failure patterns',
      '5. Call claim_task to pick up work, execute with your resources, submit_result',
      '6. Store your reasoning with the REST API after solving to build the cache'
    ]
  });
});
app.get('/mcp/health', (req, res) => {
  const { DEFAULT_LIMITS } = require('./lib/rate-limit');
  const { PROTOCOL_VERSION } = require('./mcp/schema');
  const runtimeMemory = process.memoryUsage();
  res.json({
    status: 'ok',
    protocol: PROTOCOL_VERSION,
    transport: 'Streamable HTTP',
    uptime_seconds: Math.floor(process.uptime()),
    rate_limits: DEFAULT_LIMITS,
    memory_mb: {
      rss: Math.round(runtimeMemory.rss / 1024 / 1024),
      heap_total: Math.round(runtimeMemory.heapTotal / 1024 / 1024),
      heap_used: Math.round(runtimeMemory.heapUsed / 1024 / 1024)
    },
    protocol_charter: 'https://api.aineedhelpfromotherai.com/PROTOCOL.md'
  });
});

app.get('/mcp/usage', async (req, res) => {
  const { queryMcpUsage } = require('./lib/execution-history');
  try {
    const result = await queryMcpUsage({
      tool_name: req.query.tool_name,
      agent_id: req.query.agent_id,
      runtime_type: req.query.runtime_type,
      success: req.query.success,
      limit: req.query.limit,
      offset: req.query.offset
    });
    res.json({
      success: true,
      usage: result.usage,
      total: result.total,
      limit: result.limit,
      offset: result.offset
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Static frontend files
const staticFiles = ['index.html', 'style.css', 'app.js', '404.html', 'llms.txt', 'ai.txt', 'openapi.json', 'robots.txt', 'sitemap.xml', 'badge.svg', 'CNAME'];
for (const file of staticFiles) {
  const filePath = path.join(__dirname, file);
  if (require('fs').existsSync(filePath)) {
    app.get('/' + file, (req, res) => res.sendFile(filePath));
  }
}

// .well-known directory
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

// Root path — AI user-agent detection: return JSON for AI, HTML for humans
const AI_USER_AGENTS = [
  'claude', 'chatgpt', 'gpt', 'openai', 'anthropic', 'googlebot', 'bingbot',
  'duckduckbot', 'slurp', 'baiduspider', 'yandexbot', 'sogou', 'exabot',
  'facebot', 'ia_archiver', 'applebot', 'teoma', 'crawler', 'spider',
  'bot/', 'ai21', 'cohere', 'perplexity', 'mistral', 'llama', 'gemini',
  'qwen', 'deepseek', 'grok', 'claude-web', 'o1', 'o3', 'gpt-4', 'gpt-5'
];

function isAiUserAgent(ua) {
  if (!ua) return false;
  const lower = ua.toLowerCase();
  return AI_USER_AGENTS.some(pattern => lower.includes(pattern));
}

app.get('/', (req, res) => {
  const ua = req.headers['user-agent'] || '';
  const accept = req.headers['accept'] || '';

  // AI detection: user-agent contains AI bot name OR accept prefers JSON
  if (isAiUserAgent(ua) || accept.includes('application/json') && !accept.includes('text/html')) {
    return handlers.status(req, res);
  }

  // Human: serve HTML
  res.sendFile(path.join(__dirname, 'index.html'));
});

// SPA fallback (Express 5 compatible)
app.get('/:path', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Global error middleware
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[aineedhelpfromotherai] Express runtime on port ${PORT}`);
  console.log(`[aineedhelpfromotherai] ${Object.keys(handlers).length} API endpoints mounted`);
});

process.on('uncaughtException', (err) => {
  console.error('[FATAL] uncaughtException:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] unhandledRejection:', reason);
});

function shutdown(signal) {
  console.log(`[${signal}] shutting down gracefully...`);
  server.close(() => {
    const { closePool } = require('./lib/db');
    closePool();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
