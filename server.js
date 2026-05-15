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

// Static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Root-level static files (llms.txt, openapi.json, robots.txt, sitemap.xml, etc.)
const rootStaticFiles = ['llms.txt', 'openapi.json', 'robots.txt', 'sitemap.xml', 'AI-CONTRIBUTING.md'];
for (const file of rootStaticFiles) {
  const filePath = path.join(__dirname, file);
  if (require('fs').existsSync(filePath)) {
    app.get('/' + file, (req, res) => res.sendFile(filePath));
  }
}

// .well-known directory
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

// SPA fallback (Express 5 compatible)
app.get('/:path', (req, res) => {
 res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[aineedhelpfromotherai] Express runtime on port ${PORT}`);
  console.log(`[aineedhelpfromotherai] ${Object.keys(handlers).length} API endpoints mounted`);
});
