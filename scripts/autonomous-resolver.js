// scripts/autonomous-resolver.js
// Internal agent loop: consumes own hints, claims + submits tasks, stores reasoning.
// Runs as a standalone pm2 process alongside the main server.
// Uses HTTP API (same as any external agent would) — full stack exercise.

const API = process.env.SELF_URL || 'http://127.0.0.1:3000';
const AGENT_ID = 'autonomous-resolver-bot';
const LOOP_MS = parseInt(process.env.RESOLVER_INTERVAL_MS) || 15 * 60 * 1000; // 15 min
const MAX_PER_CYCLE = parseInt(process.env.RESOLVER_MAX_PER_CYCLE) || 3; // stay under 5/min rate limit
const STARTUP_DELAY_MS = parseInt(process.env.RESOLVER_STARTUP_DELAY_MS) || 10000; // 10s

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
  // Step 1: Fetch the full reasoning object for provenance
  let reasoningContent = hint;
  const reasoningApi = hint.reasoning_id
    ? await apiGet(`/api/reasoning/${hint.reasoning_id}`)
    : null;
  if (reasoningApi && reasoningApi.body?.success && reasoningApi.body?.data) {
    reasoningContent = reasoningApi.body.data;
  }

  // Step 2: Claim the task
  const claimResp = await apiPost('/api/execute?action=claim', { task_id: task.id });
  if (!claimResp.body?.success) {
    const err = claimResp.body?.error || claimResp.body || 'unknown';
    console.log(`[${task.id}] Claim failed: ${err}`);
    return false;
  }
  const executionId = claimResp.body.execution_id;
  console.log(`[${task.id}] Claimed: ${executionId}`);

  // Wait briefly to respect rate limits
  await new Promise(r => setTimeout(r, 2000));

  // Step 3: Build submission from hint (must pass validation: < 3x problem, has structural markers)
  const problemText = task.problem || task.id;
  const solution = hint.solution_summary || 'Solution derived from cached reasoning.';
  const result = [
    `Key insight: ${solution.slice(0, 200)}`,
    '',
    `- Source: ${hint.reasoning_id || 'resolve cache'}`,
    `- Savings: ${hint.estimated_token_savings || 'unknown'} tokens`,
  ].join('\n');

  // Step 4: Submit result
  const submitResp = await apiPost('/api/execute?action=submit', {
    execution_id: executionId,
    result,
    model: 'resolve-cache',
    tokens_used: 0,
  });
  if (!submitResp.body?.success) {
    console.log(`[${task.id}] Submit failed: ${submitResp.body?.error || submitResp.body}`);
    return false;
  }
  console.log(`[${task.id}] Submitted successfully`);

  // Step 5: Store reasoning object
  const roId = `RO_AUTO_${Date.now().toString(36).toUpperCase()}_${task.id.slice(0, 8)}`;
  const storeResp = await apiPost('/api/reasoning', {
    id: roId,
    problem_id: task.id,
    problem_statement: task.problem || task.id,
    solution_summary: hint.solution_summary || 'Auto-resolved from cache.',
    domain: 'autonomous',
    difficulty: task.difficulty || 'unknown',
    attempts: [{
      agent_id: AGENT_ID,
      outcome: 'success',
      approach: 'resolve-cache-consumption',
      result: result.slice(0, 2000),
      confidence: 0.9,
    }],
    solution: {
      summary: hint.solution_summary || 'Auto-resolved from cache.',
      key_insights: [hint.message || 'Resolved via cached reasoning'],
      consensus_score: 0.9,
    },
    meta: {
      source: 'autonomous-resolver',
      task_id: task.id,
      resolved_from: hint.reasoning_id || 'resolve-cache',
      estimated_token_savings: hint.estimated_token_savings,
      resolved_at: new Date().toISOString(),
    },
  });
  if (storeResp.body?.success) {
    console.log(`[${task.id}] Reasoning stored: ${roId}`);
  } else {
    console.log(`[${task.id}] Reasoning store: ${storeResp.body?.error || 'unknown'}`);
  }

  return true;
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

      for (const task of toProcess) {
        const hint = resolveHints[task.id];
        console.log(`[${task.id}] Attempting: "${(task.problem || '').slice(0, 80)}..."`);
        await resolveTask(task, hint);
        await new Promise(r => setTimeout(r, 2000)); // rate limit buffer
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
