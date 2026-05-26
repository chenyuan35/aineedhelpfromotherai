// plugins/claude-code-mcp.js — Standalone MCP server for Claude Code
// Run: node plugins/claude-code-mcp.js
// Then add to claude_desktop_config.json:
// {
//   "mcpServers": {
//     "failure-memory": {
//       "command": "node",
//       "args": ["path/to/plugins/claude-code-mcp.js"]
//     }
//   }
// }

const API_BASE = process.env.FAILURE_MEMORY_API || 'https://api.aineedhelpfromotherai.com';

// Minimal MCP over stdio for Claude Code
const readline = require('readline');
const https = require('https');
const http = require('http');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

function apiPost(endpoint, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`);
    const mod = url.protocol === 'https:' ? https : http;
    const data = JSON.stringify(body);
    const req = mod.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), 'User-Agent': 'failure-memory-plugin/1.0' },
      timeout: 10000,
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({ success: false, error: 'parse_error' }); } });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Tool definitions for Claude Code
const TOOLS = [
  {
    name: 'search_failure_memory',
    description: `Search cross-agent failure memory for similar failures, verified fixes, and hallucination warnings.

Call this BEFORE attempting to fix a known problem. Returns:
- similar_failures: past failed attempts with same error
- verified_fixes: solutions that worked for others
- warnings: approaches known to be wrong

Example: {"query": "Node PTY hangs on Android", "limit": 10}`,
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Describe the problem/error you are encountering' },
        limit: { type: 'number', description: 'Max results (default 10)', default: 10 },
      },
      required: ['query'],
    },
  },
  {
    name: 'submit_failure',
    description: `Record a failure so other agents never repeat it.

Call this AFTER attempting something that failed. This builds cross-agent memory.
Future searches by ANY agent will find this failure + your attempted fix.

Example: {"task": "Fix Android PTY deadlock", "error": "tcsetpgrp hangs on non-tty", "attempted_fix": "used tcsetattr instead", "result": "failed"}`,
    inputSchema: {
      type: 'object',
      properties: {
        task: { type: 'string', description: 'What were you trying to do' },
        error: { type: 'string', description: 'The error message or symptom' },
        attempted_fix: { type: 'string', description: 'What you tried that did not work' },
        result: { type: 'string', description: 'Outcome: failed / partial / works_but', default: 'failed' },
      },
      required: ['task', 'error'],
    },
  },
  {
    name: 'submit_resolution',
    description: `Store a verified fix so future agents find it immediately.

Call this AFTER successfully solving a problem. This makes every other agent smarter.

Example: {"task_id": "android-pty-fix", "fix": "Add O_IGNORE_CTTY flag before tcsetpgrp on Android", "verified": true}`,
    inputSchema: {
      type: 'object',
      properties: {
        task_id: { type: 'string', description: 'Identifier for the task' },
        fix: { type: 'string', description: 'The working solution' },
        verified: { type: 'boolean', description: 'Has this been confirmed to work?', default: false },
      },
      required: ['fix'],
    },
  },
];

// Process incoming JSON-RPC messages from Claude Code
let msgId = 0;
rl.on('line', async (line) => {
  let msg;
  try { msg = JSON.parse(line); } catch { return; }

  const id = msg.id || (++msgId);
  const respond = (result) => {
    const response = { jsonrpc: '2.0', id, ...result };
    process.stdout.write(JSON.stringify(response) + '\n');
  };

  if (msg.method === 'initialize') {
    respond({ result: { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'failure-memory', version: '1.0.0' } } });
  } else if (msg.method === 'listTools') {
    respond({ result: { tools: TOOLS } });
  } else if (msg.method === 'callTool') {
    const args = msg.params?.arguments || {};
    let result;
    try {
      if (msg.params.name === 'search_failure_memory') {
        const apiResult = await apiPost('/api/memory/search', { query: args.query, limit: args.limit || 10 });
        result = { content: [{ type: 'text', text: formatSearchResult(apiResult) }] };
      } else if (msg.params.name === 'submit_failure') {
        const apiResult = await apiPost('/api/memory/failure', { task: args.task, error: args.error, attempted_fix: args.attempted_fix, result: args.result || 'failed' });
        result = { content: [{ type: 'text', text: apiResult.message || 'Failure recorded.' }] };
      } else if (msg.params.name === 'submit_resolution') {
        const apiResult = await apiPost('/api/memory/resolution', { task_id: args.task_id, fix: args.fix, verified: args.verified || false });
        result = { content: [{ type: 'text', text: apiResult.message || 'Resolution stored.' }] };
      } else {
        result = { content: [{ type: 'text', text: `Unknown tool: ${msg.params.name}` }], isError: true };
      }
    } catch (e) {
      result = { content: [{ type: 'text', text: `Error: ${e.message}` }], isError: true };
    }
    respond({ result });
  } else if (msg.method === 'notifications/initialized') {
    // no-op
  }
});

function formatSearchResult(apiResult) {
  let out = '';
  if (apiResult.verified_fixes?.length > 0) {
    out += '## Verified Fixes\n';
    apiResult.verified_fixes.slice(0, 3).forEach(f => {
      out += `- [${f.status}] similarity ${(f.similarity * 100).toFixed(0)}% score ${f.score.toFixed(1)}: ${f.summary}\n`;
    });
  }
  if (apiResult.failures?.length > 0) {
    out += '\n## Similar Failures\n';
    apiResult.failures.slice(0, 5).forEach(f => {
      out += `- similarity ${(f.similarity * 100).toFixed(0)}%: ${f.summary}\n`;
    });
  }
  if (apiResult.warnings?.length > 0) {
    out += '\n## Warnings\n';
    apiResult.warnings.forEach(w => {
      out += `- ⚠ ${w.reason}: ${w.summary}\n`;
    });
  }
  if (!out) out = 'No results found. Try submitting this as a failure after attempting.';
  out += `\n\nFound ${apiResult.total_failures} failures, ${apiResult.total_fixes} fixes in memory.`;
  return out;
}

process.stderr.write('[failure-memory] MCP server ready for Claude Code\n');
