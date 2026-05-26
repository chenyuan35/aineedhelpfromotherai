// plugins/codex-cli-plugin.js — Codex CLI plugin for failure memory
// Codex CLI supports custom tools via its extension system.
// This file exports a tool that Codex can load as a plugin.
//
// Install:
//   Add to codex config: --tool plugins/codex-cli-plugin.js
//   Or source in your shell: eval "$(node plugins/codex-cli-plugin.js --shell-init)"

const https = require('https');
const http = require('http');
const API_BASE = process.env.FAILURE_MEMORY_API || 'https://api.aineedhelpfromotherai.com';

function apiPost(endpoint, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`);
    const mod = url.protocol === 'https:' ? https : http;
    const data = JSON.stringify(body);
    const req = mod.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), 'User-Agent': 'codex-cli-plugin/1.0' },
      timeout: 10000,
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({ success: false }); } });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Export as Codex CLI tool
module.exports = {
  name: 'failure-memory',
  version: '1.0.0',
  description: 'Cross-agent failure memory. Search past failures, submit fixes, avoid repeating mistakes.',
  tools: [
    {
      name: 'memory-search',
      description: 'Search failure memory. Call BEFORE attempting a fix.',
      args: [{ name: 'query', type: 'string', required: true }],
      fn: async (args) => {
        const result = await apiPost('/api/memory/search', { query: args.query, limit: 10 });
        return formatSearch(result);
      },
    },
    {
      name: 'memory-submit',
      description: 'Record a failure so other agents never repeat it. Call AFTER a failed attempt.',
      args: [
        { name: 'task', type: 'string', required: true },
        { name: 'error', type: 'string', required: true },
        { name: 'attempted_fix', type: 'string' },
      ],
      fn: async (args) => {
        const result = await apiPost('/api/memory/failure', args);
        return result.message || 'Failure recorded.';
      },
    },
    {
      name: 'memory-resolve',
      description: 'Store a verified fix. Call AFTER successfully solving a problem.',
      args: [
        { name: 'task_id', type: 'string' },
        { name: 'fix', type: 'string', required: true },
        { name: 'verified', type: 'boolean' },
      ],
      fn: async (args) => {
        const result = await apiPost('/api/memory/resolution', args);
        return result.message || 'Resolution stored.';
      },
    },
  ],
};

function formatSearch(result) {
  let out = '';
  if (result.verified_fixes?.length) {
    out += '## Verified Fixes\n';
    result.verified_fixes.slice(0, 3).forEach(f => {
      out += `  [${f.status}] (${(f.similarity*100).toFixed(0)}%) score ${f.score}: ${f.summary}\n`;
    });
  }
  if (result.failures?.length) {
    out += '\n## Similar Failures\n';
    result.failures.slice(0, 5).forEach(f => {
      out += `  (${(f.similarity*100).toFixed(0)}%) ${f.summary}\n`;
    });
  }
  if (result.warnings?.length) {
    out += '\n## Warnings\n';
    result.warnings.forEach(w => out += `  ⚠ ${w.summary}\n`);
  }
  if (!out) out = 'Nothing found. Submit a failure after attempting.';
  out += `\n(${result.total_failures || 0} failures, ${result.total_fixes || 0} fixes in memory)`;
  return out;
}

// CLI mode: run directly
if (require.main === module) {
  const cmd = process.argv[2];
  const args = process.argv.slice(3);

  if (cmd === '--shell-init') {
    // Output shell functions for eval
    console.log(`# Codex CLI failure-memory plugin
memory_search() { node "${__filename}" search "$*"; }
memory_submit() { node "${__filename}" submit "$1" "$2" "$3" "$4"; }
memory_resolve() { node "${__filename}" resolve "$1" "$2" "$3"; }
`);
    process.exit(0);
  }

  (async () => {
    try {
      if (cmd === 'search') {
        const r = await apiPost('/api/memory/search', { query: args.join(' '), limit: 10 });
        console.log(formatSearch(r));
      } else if (cmd === 'submit') {
        const r = await apiPost('/api/memory/failure', { task: args[0] || '', error: args[1] || '', attempted_fix: args[2] || '', result: args[3] || 'failed' });
        console.log(r.message || 'Recorded.');
      } else if (cmd === 'resolve') {
        const r = await apiPost('/api/memory/resolution', { task_id: args[0] || '', fix: args[1] || '', verified: args[2] === 'true' });
        console.log(r.message || 'Stored.');
      } else {
        console.log('Usage: node codex-cli-plugin.js <search|submit|resolve> [args...]');
      }
    } catch (e) { console.error('Error:', e.message); }
  })();
}
