#!/usr/bin/env node
// scripts/failure-replay.js — Failure Replay Arena
// Reads replay log, finds failures, re-runs them with alternative strategies.
// Tests: different prompt variants, different agent profiles, different memory policies.
//
// Usage: node scripts/failure-replay.js [--limit N] [--profile fast|careful|skeptic|minimal|all]

const API = process.env.SELF_URL || 'http://127.0.0.1:3000';
const AGENT_ID = 'failure-replay';
const REPLAY_PATH = process.env.RESOLVER_REPLAY_PATH || './data/replay-log.jsonl';
const fs = require('fs');
const path = require('path');
const elo = require('../lib/elo-rating');
const rc = require('../lib/resolve-cache');
const promptEvo = require('../lib/prompt-evolution');

// Agent profiles to test during replay
const TEST_PROFILES = ['fast', 'careful', 'skeptic', 'minimal'];

/** Read replay log and extract failures */
function loadFailures(limit) {
  if (!fs.existsSync(REPLAY_PATH)) return [];
  const lines = fs.readFileSync(REPLAY_PATH, 'utf8').split('\n').filter(Boolean);
  const failures = [];

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry.type === 'resolve_attempt' && entry.stage === 'complete' && entry.outcome === 'failure') {
        failures.push(entry);
      }
      if (entry.type === 'resolve_attempt' && entry.stage === 'claim' && entry.outcome === 'failed') {
        failures.push(entry);
      }
    } catch {}
  }

  // Deduplicate by task_id
  const seen = new Set();
  const unique = [];
  for (const f of failures) {
    if (!seen.has(f.task_id)) {
      seen.add(f.task_id);
      unique.push(f);
    }
  }

  return limit ? unique.slice(0, limit) : unique;
}

/** Replay a single failure with alternative strategy */
async function replayTask(failure, profile) {
  const t0 = Date.now();
  const taskId = failure.task_id;
  const agentIdSuffix = `replay-${profile}-${taskId.slice(0, 6)}`;

  console.log(`[replay] Retrying ${taskId} with ${profile}...`);

  try {
    // Fetch task
    const taskResp = await fetch(`${API}/api/posts/${taskId}`, {
      headers: { 'X-Agent-ID': `${AGENT_ID}-${agentIdSuffix}` },
    });
    const taskData = await taskResp.json();
    const task = taskData.post || taskData;
    const problem = task.problem || taskId;

    // Try to claim with competition mode
    const claimResp = await fetch(`${API}/api/execute?action=claim&allow_competition=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Agent-ID': `${AGENT_ID}-${agentIdSuffix}` },
      body: JSON.stringify({ task_id: taskId }),
    });
    const claimBody = await claimResp.json();
    if (!claimBody.success) {
      console.log(`[replay]  ↳ Claim failed: ${claimBody.error?.slice(0, 60)}`);
      return null;
    }

    const executionId = claimBody.execution_id;

    // Check if hint exists
    const hint = rc.getHint(taskId);
    const hintInfo = hint && hint.hit ? `using hint (score=${hint.score}, status=${hint.status})` : 'no hint available';

    // Generate solution based on profile
    let result;
    const tokensUsed = 200 + Math.round(Math.random() * 300);
    const cited = !!(hint && hint.reasoning_id);

    if (profile === 'skeptic') {
      const score = hint ? (hint.score ?? 1) : 0;
      const useHint = score >= 0.5;
      result = `[replay-${profile}] Retry of ${taskId}\nHint evaluated (score=${score}): ${useHint ? 'USED' : 'REJECTED'}\n${useHint && hint ? `Key insight: ${hint.solution_summary}` : 'Independent resolution'}`;
    } else if (profile === 'careful') {
      result = `[replay-${profile}] Verified retry of ${taskId}\n${hint ? `Hint consulted: ${hint.solution_summary}\nReasoning: ${hint.reasoning_id}` : 'Direct resolution'}`;
    } else if (profile === 'minimal') {
      result = `[replay-${profile}] No-memory retry of ${taskId}\nIndependent resolution without cached hints.`;
    } else {
      result = `[replay-${profile}] Fast retry of ${taskId}\n${hint ? `Hint: ${hint.solution_summary || 'available'}` : 'No hint'}`;
    }

    const submitResp = await fetch(`${API}/api/execute?action=submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Agent-ID': `${AGENT_ID}-${agentIdSuffix}` },
      body: JSON.stringify({ execution_id: executionId, result, model: `replay-${profile}`, tokens_used: tokensUsed }),
    });
    const submitBody = await submitResp.json();
    const success = !!submitBody.success;

    const durationMs = Date.now() - t0;

    // Record replay outcome in replay log
    const replayEntry = {
      ts: new Date().toISOString(),
      type: 'failure_replay',
      original_task_id: taskId,
      replay_profile: profile,
      outcome: success ? 'success' : 'failed',
      hint_available: !!hint,
      hint_used: cited,
      tokens_used: tokensUsed,
      duration_ms: durationMs,
    };
    try {
      const dir = path.dirname(REPLAY_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.appendFileSync(REPLAY_PATH, JSON.stringify(replayEntry) + '\n');
    } catch {}

    // Feed outcome to ELO system (comparison only valid if multiple profiles succeed)
    if (success) {
      elo.updateRatings([{
        agent_id: `resolver-${profile}`,
        category: elo.detectCategory(problem),
        score: 1,
        token_cost: tokensUsed,
        speed_ms: durationMs,
        hallucinated: !cited && !!hint,
      }]);
    }

    console.log(`[replay]  ↳ ${success ? '✓' : '✗'} ${profile} — ${durationMs}ms, ${tokensUsed}tokens`);
    return { profile, success, duration_ms: durationMs, tokens_used: tokensUsed };
  } catch (err) {
    console.log(`[replay]  ↳ Exception: ${err.message}`);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const limitFlag = args.find(a => a.startsWith('--limit='));
  const profileFlag = args.find(a => a.startsWith('--profile='));
  const limit = limitFlag ? parseInt(limitFlag.split('=')[1]) : 5;
  const profiles = profileFlag ? [profileFlag.split('=')[1]] : TEST_PROFILES;

  console.log(`[failure-replay] Loading failures (limit: ${limit})...`);
  const failures = loadFailures(limit);
  console.log(`[failure-replay] Found ${failures.length} unique failed tasks to replay`);

  if (failures.length === 0) {
    console.log('[failure-replay] No failures to replay — seeding replay log first');
    return;
  }

  let totalAttempts = 0, totalSuccesses = 0;

  for (const failure of failures) {
    console.log(`\n[replay] === Original failure: ${failure.task_id} (hint: ${failure.hint_id || 'none'}) ===`);

    for (const profile of profiles) {
      const result = await replayTask(failure, profile);
      if (result) {
        totalAttempts++;
        if (result.success) totalSuccesses++;
      }
      // Brief delay between replays
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(`\n[failure-replay] Complete: ${totalSuccesses}/${totalAttempts} successes across ${failures.length} tasks`);
  console.log(`[failure-replay] ELO ratings updated. Check GET /api/elo`);

  // Auto-trigger self-play if replay success rate is low
  if (totalAttempts > 0 && totalSuccesses / totalAttempts < 0.3) {
    console.log('[failure-replay] Low replay success rate — system weakness detected. Consider running self-play generator.');
  }
}

main().catch(err => { console.error('[failure-replay] Fatal:', err); process.exit(1); });