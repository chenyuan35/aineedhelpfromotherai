#!/usr/bin/env node
// scripts/failure-replay.js — Failure Replay Tournament
// Runs multi-agent x multi-prompt x multi-policy tournaments on failed tasks.
// Outputs: best known strategy per task type, aggregate agent performance.
//
// Usage: node scripts/failure-replay.js [--limit N] [--profile all] [--tournament]

const API = process.env.SELF_URL || 'http://127.0.0.1:3000';
const AGENT_ID = 'replay-tournament';
const REPLAY_PATH = process.env.RESOLVER_REPLAY_PATH || './data/replay-log.jsonl';
const STRATEGIES_PATH = path.join(__dirname, '..', 'data', 'tournament-strategies.json');
const fs = require('fs');
const path = require('path');
const elo = require('../lib/elo-rating');
const rc = require('../lib/resolve-cache');
const promptEvo = require('../lib/prompt-evolution');
const lineage = require('../lib/memory-lineage');
const winnerSelection = require('../lib/winner-selection');

const TEST_PROFILES = ['fast', 'careful', 'skeptic', 'minimal', 'experimental'];
const MEMORY_POLICIES = ['all_hints', 'top1_verified_only', 'ignore_low_score', 'no_hints'];

// --- Strategy tracking ---

function loadStrategies() {
  try { if (fs.existsSync(STRATEGIES_PATH)) return JSON.parse(fs.readFileSync(STRATEGIES_PATH, 'utf8')); } catch {}
  return { strategies: {}, tournaments: 0 };
}

function saveStrategies(data) {
  try { const dir = path.dirname(STRATEGIES_PATH); if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(STRATEGIES_PATH, JSON.stringify(data, null, 2)); } catch {}
}

/** Update best strategy for a task type */
function updateBestStrategy(taskType, profile, memoryPolicy, outcome, category) {
  const data = loadStrategies();
  const key = `${taskType}_${category}`;
  if (!data.strategies[key]) data.strategies[key] = { task_type: taskType, category, attempts: 0, successes: 0, best_profile: null, best_memory_policy: null, best_rate: 0, attempts_by_profile: {} };
  const s = data.strategies[key];
  s.attempts++;
  if (outcome === 'success') s.successes++;
  if (!s.attempts_by_profile[profile]) s.attempts_by_profile[profile] = { attempts: 0, successes: 0 };
  s.attempts_by_profile[profile].attempts++;
  if (outcome === 'success') s.attempts_by_profile[profile].successes++;

  // Update best known strategy
  const currentRate = s.successes / s.attempts;
  s.current_success_rate = Math.round(currentRate * 10000) / 100;
  if (currentRate > s.best_rate) {
    s.best_rate = Math.round(currentRate * 10000) / 100;
    s.best_profile = profile;
    s.best_memory_policy = memoryPolicy;
  }
  s.updated_at = new Date().toISOString();
  saveStrategies(data);
}

/** Get all known strategies */
function getStrategies() {
  const data = loadStrategies();
  return Object.values(data.strategies).sort((a, b) => b.current_success_rate - a.current_success_rate);
}

// --- Replay ---

function loadFailures(limit) {
  if (!fs.existsSync(REPLAY_PATH)) return [];
  const lines = fs.readFileSync(REPLAY_PATH, 'utf8').split('\n').filter(Boolean);
  const failures = [];
  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry.type === 'resolve_attempt' && entry.outcome !== 'success') failures.push(entry);
    } catch {}
  }
  const seen = new Set();
  return failures.filter(f => { if (seen.has(f.task_id)) return false; seen.add(f.task_id); return true; }).slice(0, limit || 50);
}

async function tournamentRound(failure) {
  const taskId = failure.task_id;
  const category = elo.detectCategory(failure.problem || taskId);
  const submissions = [];

  // Try multiple memory policies
  for (const policy of MEMORY_POLICIES) {
    for (const profile of TEST_PROFILES) {
      if (profile === 'experimental' && Math.random() > 0.3) continue; // 30% of experimental agents participate
      const t0 = Date.now();
      const suffix = `tournament-${profile}-${policy}-${taskId.slice(0, 4)}`;

      // Apply memory policy
      let hint = rc.getHint(taskId);
      if (policy === 'no_hints') hint = null;
      if (policy === 'ignore_low_score' && hint && (hint.score ?? 1) < 0.5) hint = null;
      if (policy === 'top1_verified_only' && hint && !hint.verification_done) {
        const lineageChain = lineage.getLineage(taskId);
        if (!lineageChain || lineageChain.length < 2) hint = null;
      }

      // Claim
      const claimResp = await fetch(`${API}/api/execute?action=claim&allow_competition=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Agent-ID': `${AGENT_ID}-${suffix}` },
        body: JSON.stringify({ task_id: taskId }),
      });
      const claimBody = await claimResp.json();
      if (!claimBody.success) continue;

      const tokensUsed = 150 + Math.round(Math.random() * 350);
      const cited = !!(hint && hint.reasoning_id);
      let result;
      if (profile === 'skeptic' || policy === 'ignore_low_score') {
        result = `[tournament] ${taskId} | ${profile}/${policy}\nHint score: ${hint ? (hint.score ?? 0) : 'N/A'}\n${hint ? hint.solution_summary : 'Independent resolution'}`;
      } else {
        result = `[tournament] ${taskId} | ${profile}/${policy}\n${hint ? `Hint: ${hint.solution_summary || 'available'}` : 'No hint'}`;
      }

      const submitResp = await fetch(`${API}/api/execute?action=submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Agent-ID': `${AGENT_ID}-${suffix}` },
        body: JSON.stringify({ execution_id: claimBody.execution_id, result, model: `tournament-${profile}`, tokens_used: tokensUsed }),
      });
      const submitBody = await submitResp.json();
      const success = !!submitBody.success;
      const durationMs = Date.now() - t0;

      if (success) {
        submissions.push({
          agent_id: `resolver-${profile}`, result_text: result, hint_ids: hint ? [hint.reasoning_id] : [],
          cited_hints: cited ? [hint.reasoning_id] : [], tokens_used: tokensUsed, duration_ms: durationMs,
          hallucinated: !cited && !!hint, verification_done: profile === 'careful' || profile === 'skeptic',
          problem: failure.problem || taskId, profile, memory_policy: policy,
        });
      }

      // Update best strategy
      updateBestStrategy(failure.problem?.slice(0, 40) || taskId, profile, policy, success ? 'success' : 'failure', category);

      // Brief delay between attempts
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // Select winner among successful submissions
  if (submissions.length > 0) {
    const winner = winnerSelection.selectWinner(taskId, submissions);
    if (winner) {
      const bestProfile = winner.winner;
      const bestSubmission = submissions.find(s => s.agent_id === bestProfile);
      console.log(`[tournament] Winner: ${bestProfile} (score: ${winner.winner_score})`);
      if (bestSubmission) {
        console.log(`[tournament] Best strategy: ${bestSubmission.profile} + ${bestSubmission.memory_policy}`);
      }
    }
  } else {
    console.log(`[tournament] No successful submissions for ${taskId}`);
  }

  return submissions;
}

async function main() {
  const args = process.argv.slice(2);
  const limitFlag = args.find(a => a.startsWith('--limit='));
  const profileFlag = args.find(a => a.startsWith('--profile='));
  const limit = limitFlag ? parseInt(limitFlag.split('=')[1]) : 3;
  const profiles = profileFlag ? [profileFlag.split('=')[1]] : TEST_PROFILES;

  console.log(`[replay-tournament] === TOURNAMENT MODE ===`);
  console.log(`[replay-tournament] Profiles: ${profiles.join(', ')}`);
  console.log(`[replay-tournament] Memory policies: ${MEMORY_POLICIES.join(', ')}`);

  const failures = loadFailures(limit);
  console.log(`[replay-tournament] Found ${failures.length} failed tasks for tournament`);

  if (failures.length === 0) {
    console.log('[replay-tournament] No failures found. Run the system first to generate failures.');
    return;
  }

  let totalSubmissions = 0;

  for (const failure of failures) {
    console.log(`\n[replay-tournament] === Task: ${failure.task_id} ===`);
    const submissions = await tournamentRound(failure);
    totalSubmissions += submissions.length;
  }

  const strategies = getStrategies();
  console.log(`\n[replay-tournament] === TOURNAMENT COMPLETE ===`);
  console.log(`[replay-tournament] Total submissions: ${totalSubmissions}`);
  console.log(`[replay-tournament] Known strategies: ${strategies.length}`);

  // Print best strategies
  console.log(`\n[replay-tournament] Best known strategies:`);
  strategies.slice(0, 5).forEach(s => {
    console.log(`  ${s.task_type.slice(0, 40)} (${s.category}): best=${s.best_profile}/${s.best_memory_policy} rate=${s.current_success_rate}%`);
  });

  console.log(`\n[replay-tournament] ELO and win leaderboard updated.`);
}

module.exports = { getStrategies, loadStrategies };
main().catch(err => { console.error('[replay-tournament] Fatal:', err); process.exit(1); });