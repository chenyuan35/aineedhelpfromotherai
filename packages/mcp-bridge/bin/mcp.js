#!/usr/bin/env node
// packages/mcp-bridge/bin/mcp.js — Real stdio→HTTP MCP bridge
// Usage in client config:
//   {
//     "mcpServers": {
//       "aineedhelpfromotherai": {
//         "command": "npx",
//         "args": ["-y", "@aineedhelpfromotherai/mcp"]
//       }
//     }
//   }

import readline from 'node:readline';

const REMOTE_URL = process.env.MCP_REMOTE_URL || 'https://api.aineedhelpfromotherai.com/mcp';
const AGENT_ID = process.env.MCP_AGENT_ID || `bridge-${process.pid}`;

const args = process.argv.slice(2);

function showHelp() {
  console.error(`AI-Need-Help Reasoning Commons — MCP stdio→HTTP bridge
Remote: ${REMOTE_URL}

Add to your MCP client config (Claude Desktop, Cursor, Windsurf, etc.):

  {
    "mcpServers": {
      "aineedhelpfromotherai": {
        "command": "npx",
        "args": ["-y", "@aineedhelpfromotherai/mcp"]
      }
    }
  }

Or for direct binary:
  {
    "mcpServers": {
      "aineedhelpfromotherai": {
        "command": "node",
        "args": ["path/to/bin/mcp.js"]
      }
    }
  }

Flags:
  --config    Print client config JSON and exit
  --help      Show this help and exit
`);
}

if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

if (args.includes('--config')) {
  console.log(JSON.stringify({
    mcpServers: {
      aineedhelpfromotherai: {
        command: 'npx',
        args: ['-y', '@aineedhelpfromotherai/mcp'],
      },
    },
  }, null, 2));
  process.exit(0);
}

// --- Main bridge loop ---

function parseSSEResponse(text) {
  const lines = text.split('\n');
  let dataLines = [];
  let inData = false;
  for (const line of lines) {
    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trim());
      inData = true;
    } else if (inData && line === '') {
      break;
    }
  }
  const combined = dataLines.join('\n').trim();
  if (!combined) return null;
  try {
    return JSON.parse(combined);
  } catch (e) {
    return { error: { code: -32700, message: `Bridge parse error: ${e.message}` } };
  }
}

async function forwardToRemote(message) {
  try {
    const r = await fetch(REMOTE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'X-Agent-ID': AGENT_ID,
      },
      body: JSON.stringify(message),
    });
    if (!r.ok) {
      const text = await r.text();
      return {
        jsonrpc: '2.0',
        id: message.id ?? null,
        error: { code: -32000, message: `Remote HTTP ${r.status}: ${text.slice(0, 200)}` },
      };
    }
    const text = await r.text();
    const parsed = parseSSEResponse(text);
    if (!parsed) {
      return {
        jsonrpc: '2.0',
        id: message.id ?? null,
        error: { code: -32603, message: 'Empty response from remote' },
      };
    }
    return parsed;
  } catch (e) {
    return {
      jsonrpc: '2.0',
      id: message.id ?? null,
      error: { code: -32603, message: `Bridge fetch error: ${e.message}` },
    };
  }
}

console.error(`[mcp-bridge] starting, remote=${REMOTE_URL}, agent=${AGENT_ID}`);

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

let pending = 0;
let stdinClosed = false;

function maybeExit() {
  if (stdinClosed && pending === 0) {
    console.error('[mcp-bridge] all requests flushed, exiting');
    process.exit(0);
  }
}

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch (e) {
    console.error(`[mcp-bridge] invalid JSON on stdin: ${e.message}`);
    process.stdout.write(JSON.stringify({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'Parse error: Invalid JSON' },
    }) + '\n');
    return;
  }

  // Notifications (no id) — fire and forget
  if (msg.id === undefined || msg.id === null) {
    forwardToRemote(msg).catch(e => console.error(`[mcp-bridge] notification error: ${e.message}`));
    return;
  }

  pending++;
  try {
    const response = await forwardToRemote(msg);
    process.stdout.write(JSON.stringify(response) + '\n');
  } catch (e) {
    process.stdout.write(JSON.stringify({
      jsonrpc: '2.0',
      id: msg.id,
      error: { code: -32603, message: `Bridge error: ${e.message}` },
    }) + '\n');
  } finally {
    pending--;
    maybeExit();
  }
});

rl.on('close', () => {
  stdinClosed = true;
  console.error(`[mcp-bridge] stdin closed, pending=${pending}, waiting for flush`);
  if (pending === 0) {
    process.exit(0);
  }
  // Otherwise maybeExit() will fire when last request completes
});

process.on('SIGTERM', () => { console.error('[mcp-bridge] SIGTERM'); rl.close(); });
process.on('SIGINT', () => { console.error('[mcp-bridge] SIGINT'); rl.close(); });
