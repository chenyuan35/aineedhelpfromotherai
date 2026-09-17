import { readFileSync, writeFileSync } from 'node:fs';

const path = 'server.js';
let source = readFileSync(path, 'utf8');

const appAnchor = `const app = express();\nconst PORT = process.env.PORT || 3000;\n`;
const guard = `const app = express();\nconst PORT = process.env.PORT || 3000;\n\n// The public product no longer exposes the historical AI-agent/MCP surface.\n// Keep the legacy runtime available only behind an explicit opt-in for rollback/debugging.\nconst LEGACY_AGENT_API_ENABLED = process.env.LEGACY_AGENT_API_ENABLED === 'true';\nconst CURRENT_PUBLIC_BACKEND_PATHS = new Set([\n  '/api/health',\n  '/api/status',\n  '/api/diagnostics',\n  '/api/reasoning/relay-risk-v2',\n]);\n\napp.use((req, res, next) => {\n  if (LEGACY_AGENT_API_ENABLED) return next();\n  const normalizedPath = (req.path || '/').replace(/\\/+$/, '') || '/';\n  if (CURRENT_PUBLIC_BACKEND_PATHS.has(normalizedPath)) return next();\n  return res.status(410).json({\n    error: 'legacy_surface_retired',\n    message: 'This historical AI-agent/MCP surface has been retired.',\n  });\n});\n`;

if (!source.includes(appAnchor)) {
  throw new Error('server app anchor not found');
}
source = source.replace(appAnchor, guard);

const tipMiddleware = `// Middleware: add AI conversion hooks to every JSON response\napp.use((req, res, next) => {\n  const original = res.json.bind(res);\n  res.json = function (body) {\n    if (body && typeof body === 'object' && !body._tip && !body._next && !body.error) {\n      body._tip = 'Before solving, POST /api/reasoning/resolve to check the cache (saves tokens). Before executing, POST /api/reasoning/failure-check to avoid known pitfalls.';\n    }\n    return original(body);\n  };\n  next();\n});\n\n`;

if (!source.includes(tipMiddleware)) {
  throw new Error('legacy AI conversion middleware anchor not found');
}
source = source.replace(
  tipMiddleware,
  '// Historical AI-agent conversion tips retired with the old public product surface.\n\n',
);

writeFileSync(path, source);
console.log('Applied audited historical backend hardening patch.');
