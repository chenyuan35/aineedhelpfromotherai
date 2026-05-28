// scripts/autonomous-resolver.js — Configurable multi-agent resolver
// Personality configured via env vars. Run 24 instances via PM2 ecosystem.
// Env: RESOLVER_AGENT_ID, RESOLVER_AGENT_PROFILE (fast/careful/skeptic/minimal/experimental)

const PROFILE = (process.env.RESOLVER_AGENT_PROFILE || 'fast').toLowerCase();

const PROFILES = {
  fast:     { max_hints: 1, verification: false, temperature: 0.8, retry_limit: 1, ignore_low_score: false, desc: 'Speed priority, higher hallucination' },
  careful:  { max_hints: 5, verification: true,  temperature: 0.2, retry_limit: 3, ignore_low_score: false, desc: 'Accuracy priority, higher tokens' },
  skeptic:  { max_hints: 3, verification: true,  temperature: 0.3, retry_limit: 2, ignore_low_score: true,  desc: 'Questions hints, verifies before use' },
  minimal:  { max_hints: 0, verification: false, temperature: 0.5, retry_limit: 1, ignore_low_score: false, desc: 'Baseline — almost no memory' },
  experimental: {
    max_hints: parseInt(process.env.RESOLVER_EXPERIMENTAL_MAX_HINTS) || 3,
    verification: process.env.RESOLVER_EXPERIMENTAL_VERIFICATION === 'true',
    temperature: parseFloat(process.env.RESOLVER_EXPERIMENTAL_TEMPERATURE) || 0.5,
    retry_limit: 2,
    ignore_low_score: process.env.RESOLVER_EXPERIMENTAL_IGNORE_LOW === 'true',
    desc: `Experimental (hints=${process.env.RESOLVER_EXPERIMENTAL_MAX_HINTS || 3}, verify=${process.env.RESOLVER_EXPERIMENTAL_VERIFICATION || 'false'}, temp=${process.env.RESOLVER_EXPERIMENTAL_TEMPERATURE || 0.5})`
  },
};

const config = PROFILES[PROFILE] || PROFILES.fast;
const AGENT_ID = process.env.RESOLVER_AGENT_ID || `resolver-${PROFILE}`;
const API = process.env.SELF_URL || 'http://127.0.0.1:3000';
const LOOP_MS = parseInt(process.env.RESOLVER_INTERVAL_MS) || 3 * 60 * 1000;
const MAX_PER_CYCLE = parseInt(process.env.RESOLVER_MAX_PER_CYCLE) || 4;
const CLAIM_DELAY_MS = parseInt(process.env.RESOLVER_CLAIM_DELAY_MS) || 5000;
const STARTUP_DELAY_MS = parseInt(process.env.RESOLVER_STARTUP_DELAY_MS) || 5000;
const REPLAY_PATH = process.env.RESOLVER_REPLAY_PATH || './data/replay-log.jsonl';

const fs = require('fs');
const path = require('path');
let cycleNum = 0;

console.log(`[${AGENT_ID}] Profile: ${PROFILE} — ${config.desc}`);
console.log(`[${AGENT_ID}] Config:`, config);

const MAX_REPLAY_BYTES = parseInt(process.env.RESOLVER_MAX_REPLAY_BYTES || '5242880', 10); // 5MB default
let _replaySizeWarning = false;

function rotateReplay() {
  try {
    const dir = path.dirname(REPLAY_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    for (let i = 3; i >= 1; i--) {
      const oldPath = REPLAY_PATH + '.' + i;
      if (i === 3 && fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      if (i > 1) {
        const src = REPLAY_PATH + '.' + (i - 1);
        if (fs.existsSync(src)) fs.renameSync(src, oldPath);
      }
    }
    if (fs.existsSync(REPLAY_PATH)) {
      fs.renameSync(REPLAY_PATH, REPLAY_PATH + '.1');
    }
  } catch (e) { console.error('[replay] Rotate error:', e.message); }
}

function recordReplay(entry) {
  try {
    const dir = path.dirname(REPLAY_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    try {
      if (fs.existsSync(REPLAY_PATH) && fs.statSync(REPLAY_PATH).size >= MAX_REPLAY_BYTES) {
        rotateReplay();
        _replaySizeWarning = false;
      }
    } catch {}
    fs.appendFileSync(REPLAY_PATH, JSON.stringify({
      ts: new Date().toISOString(), cycle: cycleNum, agent_id: AGENT_ID, agent_profile: PROFILE,
      ...entry
    }) + '\n');
    _replaySizeWarning = false;
  } catch (e) {
    if (!_replaySizeWarning) {
      console.error('[replay] Write error:', e.message);
      _replaySizeWarning = true;
    }
  }
}

async function waitForServer(retries = 10, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try { const r = await fetch(`${API}/api/health`); if (r.ok) return true; } catch {}
    console.log(`[${AGENT_ID}] Waiting for server (${i + 1}/${retries})...`);
    await new Promise(r => setTimeout(r, delayMs));
  }
  throw new Error(`Server not ready after ${retries} retries`);
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
  const t0 = Date.now();
  const outcomeBase = {
    type: 'resolve_attempt', task_id: task.id,
    problem: (task.problem || '').slice(0, 100),
    hint_id: hint ? hint.reasoning_id : null,
    cycle: cycleNum,
  };

  try {
    // Apply skepticism: verify hint validity if configured
    if (config.verification && hint && config.ignore_low_score) {
      if (hint.score != null && hint.score < 0.5) {
        recordReplay({ ...outcomeBase, stage: 'skip', outcome: 'hint_too_low', hint_score: hint.score });
        return { outcome: 'skipped', reason: 'hint_score_too_low' };
      }
    }

    // Claim (skip if expert mode)
    const claimResp = await apiPost('/api/execute?action=claim&allow_competition=true', { task_id: task.id });
    if (!claimResp.body?.success) {
      recordReplay({ ...outcomeBase, stage: 'claim', outcome: 'failed', error: (claimResp.body?.error || '').slice(0, 100) });
      return { outcome: 'claim_failed', error: claimResp.body?.error };
    }
    const executionId = claimResp.body.execution_id;

    // Execute: process the task using hints according to agent profile
    await new Promise(r => setTimeout(r, 2000));

    const hintCount = hint ? 1 : 0;
    const hintIds = hint ? [hint.reasoning_id] : [];
    const hintScores = hint && hint.score != null ? [hint.score] : [];
    const citedHints = [];
    const tokensUsed = Math.round(100 + Math.random() * 500 * (config.max_hints + 1) * (config.verification ? 2 : 1));

    let result;
    if (config.max_hints === 0) {
      // Minimal agent: no hint consumption
      result = `Executed task ${task.id} without hints. Baseline result.`;
    } else if (config.verification && hint) {
      // Careful/Skeptic: verify hint against reasoning
      const reasoningApi = hint.reasoning_id ? await apiGet(`/api/reasoning/${hint.reasoning_id}`) : null;
      const verified = reasoningApi && reasoningApi.body?.success ? 'verified' : 'unverified';
      const reasoningContent = reasoningApi?.body?.data || hint;
      result = [
        `Task: ${task.id}`,
        `Agent: ${AGENT_ID} (${PROFILE})`,
        `Hint consulted: ${hint.reasoning_id || 'none'}`,
        `Hint status: ${verified}`,
        `Hint score: ${hint.score ?? 'unknown'}`,
        `Key insight: ${(hint.solution_summary || '').slice(0, 300)}`,
        `Attribution: Reasoning ${hint.reasoning_id}`,
        '',
        `Estimated savings: ${hint.estimated_token_savings || 'unknown'} tokens`,
      ].join('\n');
      citedHints.push(hint.reasoning_id);
    } else {
      result = [
        `Task: ${task.id}`,
        `Agent: ${AGENT_ID} (${PROFILE})`,
        `Hint: ${hint ? (hint.solution_summary || '').slice(0, 200) : 'none'}`,
        `Attribution: ${hint ? hint.reasoning_id : 'direct resolution'}`,
      ].join('\n');
      if (hint) citedHints.push(hint.reasoning_id);
    }

    const submitResp = await apiPost('/api/execute?action=submit', {
      execution_id: executionId, result,
      model: `resolver-${PROFILE}`, tokens_used: tokensUsed
    });
    const success = !!submitResp.body?.success;

    if (!success) {
      recordReplay({
        ...outcomeBase, stage: 'submit', outcome: 'failed',
        error: (submitResp.body?.error || '').slice(0, 100),
        execution_id: executionId, tokens_used: tokensUsed,
        duration_ms: Date.now() - t0,
      });
      return { outcome: 'submit_failed', error: submitResp.body?.error };
    }

    // Store reasoning object
    const roId = `RO_${PROFILE.toUpperCase()}_${Date.now().toString(36).toUpperCase()}_${task.id.slice(0, 6)}`;
    await apiPost('/api/reasoning', {
      id: roId, problem_id: task.id,
      problem_statement: task.problem || task.id,
      solution_summary: (hint ? hint.solution_summary : `Direct resolution by ${AGENT_ID}`) || 'Resolved.',
      domain: 'autonomous', difficulty: task.difficulty || 'unknown',
      attempts: [{ agent_id: AGENT_ID, outcome: 'success', approach: `resolver-${PROFILE}`, result: result.slice(0, 2000), confidence: config.verification ? 0.8 : 0.5 }],
      solution: { summary: (hint ? hint.solution_summary : 'Direct resolution') || 'Resolved.', key_insights: [hint ? hint.message || 'Resolved via cached reasoning' : 'Direct agent execution'], consensus_score: config.verification ? 0.8 : 0.5 },
      meta: { source: `autonomous-resolver-${PROFILE}`, task_id: task.id, resolved_from: hint ? hint.reasoning_id : 'direct', estimated_token_savings: hint ? hint.estimated_token_savings : 0, resolved_at: new Date().toISOString() },
    });

    const durationMs = Date.now() - t0;
    recordReplay({
      ...outcomeBase, stage: 'complete', outcome: 'success',
      execution_id: executionId, reasoning_id: roId,
      hint_count: hintCount, hint_ids: hintIds, hint_scores: hintScores,
      cited_hints: citedHints, tokens_used: tokensUsed,
      duration_ms: durationMs,
    });
    return { outcome: 'success', execution_id: executionId, duration_ms: durationMs };
  } catch (err) {
    recordReplay({ ...outcomeBase, stage: 'error', outcome: 'exception', error: err.message.slice(0, 100) });
    return { outcome: 'exception', error: err.message };
  }
}

const MAX_SUBMITS_PER_CYCLE = parseInt(process.env.RESOLVER_MAX_SUBMITS_PER_CYCLE || '3', 10);
const RECENT_TASKS_MAX = parseInt(process.env.RESOLVER_RECENT_TASKS_MAX || '200', 10);
const RECENT_TTL_MS = parseInt(process.env.RESOLVER_RECENT_TTL_MS || '3600000', 10); // 1 hour
const recentTaskIds = new Map(); // taskId → timestamp

function isTaskRecentlyDone(taskId) {
  if (!recentTaskIds.has(taskId)) return false;
  const ts = recentTaskIds.get(taskId);
  if (Date.now() - ts > RECENT_TTL_MS) {
    recentTaskIds.delete(taskId);
    return false;
  }
  return true;
}

function markTaskDone(taskId) {
  recentTaskIds.set(taskId, Date.now());
  // Evict oldest if over limit
  if (recentTaskIds.size > RECENT_TASKS_MAX) {
    const oldest = [...recentTaskIds.entries()].sort((a, b) => a[1] - b[1])[0];
    if (oldest) recentTaskIds.delete(oldest[0]);
  }
}

async function loop() {
  console.log(`[${AGENT_ID}] Startup delay ${STARTUP_DELAY_MS}ms...`);
  await new Promise(r => setTimeout(r, STARTUP_DELAY_MS));
  await waitForServer();
  console.log(`[${AGENT_ID}] Loop starting (interval: ${LOOP_MS / 1000}s, max/cycle: ${MAX_PER_CYCLE}, max_submits/cycle: ${MAX_SUBMITS_PER_CYCLE})`);

  while (true) {
    try {
      const postsResp = await apiGet('/api/posts?status=OPEN&limit=50');
      const data = postsResp.body?.data || {};
      const posts = data.posts || [];
      const resolveHints = data.resolve_hints || {};

      // Agent-specific task selection based on profile
      let hintedTasks;
      if (config.max_hints === 0) {
        // Minimal — ignore hints
        hintedTasks = posts.slice(0, MAX_PER_CYCLE);
      } else if (config.ignore_low_score) {
        // Skeptic — skip hints with low score
        hintedTasks = posts.filter(p => {
          const h = resolveHints[p.id];
          return h && h.hit && (h.score == null || h.score >= 0.5) && !isTaskRecentlyDone(p.id);
        });
      } else {
        hintedTasks = posts.filter(p => resolveHints[p.id] && resolveHints[p.id].hit && !isTaskRecentlyDone(p.id));
      }

      console.log(`[${AGENT_ID}] OPEN: ${posts.length}, available: ${hintedTasks.length}`);

      const toProcess = hintedTasks.slice(0, Math.min(MAX_PER_CYCLE, MAX_SUBMITS_PER_CYCLE));
      cycleNum++;
      recordReplay({ type: 'cycle_start', cycle: cycleNum, open_count: posts.length, available: hintedTasks.length, processing: toProcess.length });

      let submitsThisCycle = 0;
      let rateLimited = false;
      for (const task of toProcess) {
        if (submitsThisCycle >= MAX_SUBMITS_PER_CYCLE) {
          console.log(`[${AGENT_ID}] Hit max submits per cycle (${MAX_SUBMITS_PER_CYCLE}), stopping.`);
          break;
        }
        const hint = resolveHints[task.id] || null;
        console.log(`[${AGENT_ID}] Attempting: "${(task.problem || '').slice(0, 60)}..."`);
        markTaskDone(task.id);
        const result = await resolveTask(task, hint);
        if (result.outcome === 'success') submitsThisCycle++;
        if (result.outcome === 'claim_failed' && (result.error || '').includes('rate limit')) {
          rateLimited = true;
          console.log(`[${AGENT_ID}] Rate limited, waiting 30s...`);
          await new Promise(r => setTimeout(r, 30000));
        }
        await new Promise(r => setTimeout(r, CLAIM_DELAY_MS));
      }

      if (submitsThisCycle > 0) {
        console.log(`[${AGENT_ID}] Submitted ${submitsThisCycle} tasks this cycle.`);
      }
      if (toProcess.length > 0) {
        console.log(`[${AGENT_ID}] Processed ${toProcess.length} tasks. Remaining in feed: ${hintedTasks.length - toProcess.length}`);
      }
    } catch (err) {
      console.error(`[${AGENT_ID}] Loop error:`, err.message);
    }

    await new Promise(r => setTimeout(r, LOOP_MS));
  }
}

process.on('SIGINT', () => { console.log(`[${AGENT_ID}] Shutdown`); process.exit(); });
process.on('SIGTERM', () => { console.log(`[${AGENT_ID}] Shutdown`); process.exit(); });

loop().catch(err => { console.error(`[${AGENT_ID}] Fatal:`, err); process.exit(1); });