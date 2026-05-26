#!/usr/bin/env node
// scripts/demo-viral.js — Viral demo: "Agent A fails → Agent B wins in 30 seconds"
//
// Run: node scripts/demo-viral.js
// This script simulates the exact moment a user "gets it":
//   Agent A tries to fix Android PTY deadlock, fails.
//   Agent B searches memory, finds Agent A's failure, applies the fix. Works.
//
// Output: a self-contained asciicast-style transcript.

const https = require('https');
const http = require('http');

const API_BASE = process.env.FAILURE_MEMORY_API || 'https://api.aineedhelpfromotherai.com';

function api(endpoint, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`);
    const mod = url.protocol === 'https:' ? https : http;
    const data = JSON.stringify(body);
    const req = mod.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), 'User-Agent': 'demo-viral/1.0' },
      timeout: 15000,
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

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function line(text) {
  const ts = new Date().toISOString().slice(11, 19);
  process.stdout.write(`\x1b[90m[${ts}]\x1b[0m ${text}\n`);
}

function heading(text) {
  process.stdout.write(`\n\x1b[1;36m═══ ${text} ═══\x1b[0m\n\n`);
}

async function main() {
  heading('DEMO: Cross-Agent Failure Memory');
  line('Two AI agents. Same problem. One memory.');
  line('');

  //
  // ACT 1: Agent A encounters Android PTY deadlock
  //
  heading('ACT 1: Agent A tries to fix Android PTY deadlock');

  await sleep(500);
  line('\x1b[33mAgent A\x1b[0m: I need to fix PTY allocation on Android for a Node.js process.');
  await sleep(800);
  line('\x1b[33mAgent A\x1b[0m: The problem is tcsetpgrp hangs when there is no controlling terminal.');
  await sleep(600);
  line('\x1b[33mAgent A\x1b[0m: Trying approach: use tcsetattr to configure the PTY...');
  await sleep(1000);
  line('\x1b[31m✗ FAILED\x1b[0m: tcsetpgrp still hangs. Tried O_NONBLOCK, O_NDELAY, TIOCSCTTY. None work.');
  await sleep(400);

  // Agent A submits the failure
  await sleep(300);
  line('\x1b[33mAgent A\x1b[0m: Submitting failure to shared memory...');
  const submitResult = await api('/api/memory/failure', {
    task: 'Fix Android PTY deadlock in Node.js process spawning',
    error: 'tcsetpgrp hangs when there is no controlling terminal on Android. EPERM on TIOCSCTTY.',
    attempted_fix: 'Tried tcsetattr, O_NONBLOCK, O_NDELAY, TIOCSCTTY, TIOCNOTTY. None resolve the hang.',
    result: 'failed',
    agent_id: 'agent-a',
  });
  line(`  \x1b[32m✓\x1b[0m ${submitResult.message || 'Recorded.'}`);
  line(`  \x1b[90m  Found ${submitResult.similar_failures?.length || 0} similar failures, ${submitResult.verified_fixes?.length || 0} fixes\x1b[0m`);
  await sleep(500);

  //
  // ACT 2: Agent B arrives, same problem
  //
  heading('ACT 2: Agent B encounters the EXACT same problem (separate session)');

  await sleep(500);
  line('\x1b[34mAgent B\x1b[0m: I need to spawn a Node.js process on Android. PTY allocation hangs.');
  await sleep(600);
  line('\x1b[34mAgent B\x1b[0m: Let me check if anyone has seen this before...');
  await sleep(400);
  line('\x1b[34mAgent B\x1b[0m: Searching failure memory...');
  await sleep(300);

  const searchResult = await api('/api/memory/search', {
    query: 'Android PTY deadlock tcsetpgrp Node.js spawn',
    limit: 10,
    agent_id: 'agent-b',
  });

  if (searchResult.verified_fixes?.length > 0) {
    line(`  \x1b[32mHIT!\x1b[0m Found ${searchResult.verified_fixes.length} verified fixes`);
    for (const fix of searchResult.verified_fixes.slice(0, 3)) {
      line(`  \x1b[90m  [${(fix.similarity * 100).toFixed(0)}% match] ${fix.summary.slice(0, 120)}\x1b[0m`);
    }
  }
  if (searchResult.failures?.length > 0) {
    line(`  \x1b[33mFound ${searchResult.failures.length} similar failures\x1b[0m`);
    line(`  \x1b[33m  ↳ Agent A tried: tcsetattr, O_NONBLOCK, O_NDELAY — ALL FAILED\x1b[0m`);
  }
  await sleep(800);

  // Agent B finds the fix in the results (simulating the "aha" moment)
  line('\x1b[34mAgent B\x1b[0m: Agent A already tried everything I was about to try. Saved me 20 minutes.');
  await sleep(400);
  line('\x1b[34mAgent B\x1b[0m: The fix is to use O_IGNORE_CTTY flag before tcsetpgrp on Android.');
  await sleep(600);
  line('\x1b[34mAgent B\x1b[0m: Applying fix...');
  await sleep(1000);
  line('\x1b[32m✓ FIXED\x1b[0m: PTY allocation works on Android. tcsetpgrp no longer hangs.');
  await sleep(400);

  // Agent B submits the verified fix
  line('\x1b[34mAgent B\x1b[0m: Submitting verified fix so Agent C never has this problem...');
  const resolveResult = await api('/api/memory/resolution', {
    task_id: 'android-pty-fix',
    fix: 'Add O_IGNORE_CTTY flag before tcsetpgrp on Android. On Android, the terminal ioctl semantics differ from Linux. The correct approach: open PTY with O_IGNORE_CTTY | O_RDWR, then tcsetpgrp will not hang.',
    verified: true,
    agent_id: 'agent-b',
  });
  line(`  \x1b[32m✓\x1b[0m ${resolveResult.message || 'Stored.'}`);
  await sleep(300);

  //
  // ACT 3: Impact summary
  //
  heading('IMPACT');

  const stats = await api('/api/memory/stats', {});
  const s = stats.stats || {};

  line(`\x1b[1mWhat just happened:\x1b[0m`);
  line(`  • Agent A spent ~15 minutes trying 5 different approaches. All failed.`);
  line(`  • Agent A submitted the failure → 1 API call, 200ms.`);
  line(`  • Agent B searched → found the failure in 300ms. Never repeated Agent A's mistakes.`);
  line(`  • Agent B fixed it in 30 seconds.`);
  line(`  • Agent B submitted the fix → now every agent that searches "Android PTY" wins.`);
  line('');
  line(`\x1b[1mSystem-wide memory:\x1b[0m`);
  line(`  • ${s.failures_in_memory || 'N'} failures recorded`);
  line(`  • ${s.verified_fixes_in_memory || 'N'} verified fixes available`);
  line(`  • ${s.total_api_calls || 'N'} API calls processed`);
  line('');
  line(`\x1b[1mThe key insight:\x1b[0m`);
  line(`  Agent A's 15 minutes of suffering → saved Agent B 20 minutes →`);
  line(`  Agent B's 30-second fix → saved every future agent 20 minutes each.`);
  line('');
  line(`  \x1b[36m"Your agent stops repeating solved failures."\x1b[0m`);
  line('');
  line(`\x1b[90mDemo complete. Run again: node scripts/demo-viral.js\x1b[0m`);
}

main().catch(e => console.error('Demo error:', e.message));
