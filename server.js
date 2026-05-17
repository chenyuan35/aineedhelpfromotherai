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
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', runtime: 'express', timestamp: new Date().toISOString() });
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
app.all('/api/reasoning/:path', handlers.reasoning);
app.all('/api/leaderboard', handlers.leaderboard);
app.all('/api/leaderboard/:path', handlers.leaderboard);

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

// Root path — serve index.html
app.get('/', (req, res) => {
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
