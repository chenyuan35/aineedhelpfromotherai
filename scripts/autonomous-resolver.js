// scripts/autonomous-resolver.js
// Internal agent loop: consumes own hints, claims + submits tasks, stores reasoning.
// Runs as a standalone pm2 process alongside the main server.
// Uses HTTP API (same as any external agent would) — full stack exercise.

const API = process.env.SELF_URL || 'http://127.0.0.1:3000';
const AGENT_ID = 'autonomous-resolver-bot';
const LOOP_MS = parseInt(process.env.RESOLVER_INTERVAL_MS) || 3 * 60 * 1000; // 3 min during stress test
const MAX_PER_CYCLE = parseInt(process.env.RESOLVER_MAX_PER_CYCLE) || 4; // max claims per cycle
const CLAIM_DELAY_MS = parseInt(process.env.RESOLVER_CLAIM_DELAY_MS) || 15000; // 15s between claims
const STARTUP_DELAY_MS = parseInt(process.env.RESOLVER_STARTUP_DELAY_MS) || 10000;
const REPLAY_PATH = process.env.RESOLVER_REPLAY_PATH || './data/replay-log.jsonl';
const CYCLE_START = Date.now();
let cycleNum = 0;

// Simple JSONL append for replay
const fs = require('fs');
const path = require('path');

function recordReplay(entry) {
  try {
    const dir = path.dirname(REPLAY_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(REPLAY_PATH, JSON.stringify({ ts: new Date().toISOString(), cycle: cycleNum, ...entry }) + '\n');
  } catch (e) {
    console.error('[replay] Failed to write:', e.message);
  }
}

// Wait for server to be ready
async function waitForServer(retries = 5, delayMs = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const r = await fetch(`${API}/api/health`);
      if (r.ok) return true;
    } catch {}
    console.log(`[${AGENT_ID}] Waiting for server (attempt ${i + 1}/${retries})...`);
    await new Promise(r => setTimeout(r, delayMs));
  }
  throw new Error(`Server not ready after ${retries} retries at ${API}`);
}

async function apiPost(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Agent-ID': AGENT_ID },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  try { return { status: r.status, body: JSON.parse(text) }; } catch { return { status: r.status, body: text }; }
}

async function apiGet(path) {
  const r = await fetch(`${API}${path}`, {
    headers: { 'X-Agent-ID': AGENT_ID },
  });
  const text = await r.text();
  try { return { status: r.status, body: JSON.parse(text) }; } catch { return { status: r.status, body: text }; }
}


async function resolveTask(task, hint) {
  const outcomeBase = { type: 'resolve_attempt', task_id: task.id, problem: (task.problem || '').slice(0, 100), hint_id: hint.reasoning_id, cycle: cycleNum };
  try {
    let reasoningContent = hint;
    const reasoningApi = hint.reasoning_id ? await apiGet(`/api/reasoning/${hint.reasoning_id}`) : null;
    if (reasoningApi && reasoningApi.body?.success && reasoningApi.body?.data) reasoningContent = reasoningApi.body.data;

    const claimResp = await apiPost('/api/execute?action=claim', { task_id: task.id });
    if (!claimResp.body?.success) {
      recordReplay({ ...outcomeBase, stage: 'claim', outcome: 'failed', error: (claimResp.body?.error || '').slice(0, 100) });
      return false;
    }
    const executionId = claimResp.body.execution_id;
    await new Promise(r => setTimeout(r, 2000));

    const result = [
      `Key insight: ${(hint.solution_summary || '').slice(0, 200)}`,
      '',
      `- Source: ${hint.reasoning_id || 'resolve cache'}`,
      `- Savings: ${hint.estimated_token_savings || 'unknown'} tokens`,
    ].join('\n');

    const submitResp = await apiPost('/api/execute?action=submit', { execution_id: executionId, result, model: 'resolve-cache', tokens_used: 0 });
    if (!submitResp.body?.success) {
      recordReplay({ ...outcomeBase, stage: 'submit', outcome: 'failed', error: (submitResp.body?.error || '').slice(0, 100), execution_id: executionId });
      return false;
    }

    const roId = `RO_AUTO_${Date.now().toString(36).toUpperCase()}_${task.id.slice(0, 8)}`;
    const storeResp = await apiPost('/api/reasoning', {
      id: roId, problem_id: task.id, problem_statement: task.problem || task.id,
      solution_summary: hint.solution_summary || 'Auto-resolved.',
      domain: 'autonomous', difficulty: task.difficulty || 'unknown',
      attempts: [{ agent_id: AGENT_ID, outcome: 'success', approach: 'resolve-cache-consumption', result: result.slice(0, 2000), confidence: 0.9 }],
      solution: { summary: hint.solution_summary || 'Auto-resolved.', key_insights: [hint.message || 'Resolved via cached reasoning'], consensus_score: 0.9 },
      meta: { source: 'autonomous-resolver', task_id: task.id, resolved_from: hint.reasoning_id || 'resolve-cache', estimated_token_savings: hint.estimated_token_savings, resolved_at: new Date().toISOString() },
    });

    recordReplay({ ...outcomeBase, stage: 'complete', outcome: 'success', execution_id: executionId, reasoning_id: roId,
      stored: !!storeResp.body?.success, result_length: result.length });
    return true;
  } catch (err) {
    recordReplay({ ...outcomeBase, stage: 'error', outcome: 'exception', error: err.message.slice(0, 100) });
    return false;
  }
}

async function loop() {
  console.log(`[${AGENT_ID}] Startup delay ${STARTUP_DELAY_MS}ms...`);
  await new Promise(r => setTimeout(r, STARTUP_DELAY_MS));
  await waitForServer();

  console.log(`[${AGENT_ID}] Loop starting (interval: ${LOOP_MS / 1000}s)`);

  while (true) {
    try {
      // 1. Fetch OPEN tasks with resolve hints
      const postsResp = await apiGet('/api/posts?status=OPEN&limit=50');
      const data = postsResp.body?.data || {};
      const posts = data.posts || [];
      const resolveHints = data.resolve_hints || {};
      const hintedTasks = posts.filter(p => resolveHints[p.id] && resolveHints[p.id].hit);

      console.log(`[${AGENT_ID}] OPEN tasks: ${posts.length}, hinted: ${hintedTasks.length}`);

      // 2. Process tasks that have hints (max MAX_PER_CYCLE to avoid rate limits)
      const toProcess = hintedTasks.slice(0, MAX_PER_CYCLE);

      console.log(`[${AGENT_ID}] OPEN tasks: ${posts.length}, hinted: ${hintedTasks.length}, processing: ${toProcess.length}`);

      cycleNum++;
      recordReplay({ type: 'cycle_start', cycle: cycleNum, hinted_count: hintedTasks.length, processing: toProcess.length });

      for (const task of toProcess) {
        const hint = resolveHints[task.id];
        console.log(`[${task.id}] Attempting: "${(task.problem || '').slice(0, 80)}..."`);
        const ok = await resolveTask(task, hint);
        if (!ok) {
          // Rate limited — wait 60s before retrying
          console.log(`[${AGENT_ID}] Hit rate limit, waiting 60s...`);
          await new Promise(r => setTimeout(r, 60000));
        }
        await new Promise(r => setTimeout(r, CLAIM_DELAY_MS));
      }

      if (toProcess.length > 0) {
        console.log(`[${AGENT_ID}] Resolved ${toProcess.length} tasks this cycle. Remaining hinted: ${hintedTasks.length - toProcess.length}`);
      }
    } catch (err) {
      console.error(`[${AGENT_ID}] Loop error:`, err.message);
    }

    console.log(`[${AGENT_ID}] Sleeping ${LOOP_MS / 1000}s...`);
    await new Promise(r => setTimeout(r, LOOP_MS));
  }
}

// Graceful shutdown
process.on('SIGINT', () => { console.log(`[${AGENT_ID}] Shutting down`); process.exit(); });
process.on('SIGTERM', () => { console.log(`[${AGENT_ID}] Shutting down`); process.exit(); });

loop().catch(err => {
  console.error(`[${AGENT_ID}] Fatal:`, err);
  process.exit(1);
});
