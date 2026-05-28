// lib/winner-selection.js — Multi-submission winner determination
// Evaluates all submissions for the same task and picks the best.
// Factors: correctness, verification quality, replay stability, hallucination avoidance

const fs = require('fs');
const path = require('path');
const elo = require('./elo-rating');

const WINS_PATH = path.join(__dirname, '..', 'data', 'competition-wins.json');

function load() {
  try { if (fs.existsSync(WINS_PATH)) return JSON.parse(fs.readFileSync(WINS_PATH, 'utf8')); } catch {}
  return { competitions: [], wins: {}, updated_at: null };
}

function save(data) {
  try { const dir = path.dirname(WINS_PATH); if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(WINS_PATH, JSON.stringify(data, null, 2)); } catch {}
}

/** Score a submission across multiple dimensions */
function scoreSubmission(submission) {
  // submission: { agent_id, result_text, hint_ids, cited_hints, tokens_used, duration_ms, hallucinated, verification_done }
  let score = 0;

  // Correctness (0-50 points): base for having a valid submission
  score += 40;

  // Verification bonus (0-10)
  if (submission.verification_done) score += 10;

  // Citation quality (0-10): citing hints shows reasoning grounding
  if (submission.cited_hints && submission.cited_hints.length > 0) score += Math.min(10, submission.cited_hints.length * 5);

  // Token efficiency (0-10): fewer tokens = better
  if (submission.tokens_used) {
    const eff = Math.max(0, 1 - (submission.tokens_used / 5000));
    score += eff * 10;
  }

  // Speed bonus (0-10)
  if (submission.duration_ms) {
    const speed = Math.max(0, 1 - (submission.duration_ms / 120000));
    score += speed * 10;
  }

  // Hallucination penalty (-30)
  if (submission.hallucinated) score -= 30;

  // Result quality: longer results tend to have more substance (0-10)
  if (submission.result_text) {
    const lenScore = Math.min(10, submission.result_text.length / 100);
    score += lenScore;
  }

  return Math.max(0, Math.round(score * 100) / 100);
}

/** Determine winner among multiple submissions for the same task */
function selectWinner(taskId, submissions) {
  if (!submissions || submissions.length === 0) return null;
  if (submissions.length === 1) return { winner: submissions[0].agent_id, score: scoreSubmission(submissions[0]), runner_up: null };

  const scored = submissions.map(s => ({ ...s, composite_score: scoreSubmission(s) }));
  scored.sort((a, b) => b.composite_score - a.composite_score);
  const winner = scored[0];
  const runnerUp = scored[1];

  // Record the competition
  const data = load();
  data.competitions.push({
    ts: new Date().toISOString(),
    task_id: taskId,
    category: elo.detectCategory(submissions[0].problem || taskId),
    entries: scored.map(s => ({ agent_id: s.agent_id, score: s.composite_score, tokens: s.tokens_used, duration_ms: s.duration_ms, hallucinated: s.hallucinated })),
    winner: winner.agent_id,
    winner_score: winner.composite_score,
    runner_up: runnerUp ? runnerUp.agent_id : null,
    margin: runnerUp ? Math.round((winner.composite_score - runnerUp.composite_score) * 100) / 100 : null,
  });

  // Track win counts
  if (!data.wins[winner.agent_id]) data.wins[winner.agent_id] = { wins: 0, podiums: 0, total_score: 0 };
  data.wins[winner.agent_id].wins++;
  data.wins[winner.agent_id].total_score += winner.composite_score;
  if (runnerUp) {
    if (!data.wins[runnerUp.agent_id]) data.wins[runnerUp.agent_id] = { wins: 0, podiums: 0, total_score: 0 };
    data.wins[runnerUp.agent_id].podiums++;
  }

  data.updated_at = new Date().toISOString();
  if (data.competitions.length > 10000) data.competitions = data.competitions.slice(-10000);
  save(data);

  return { winner: winner.agent_id, winner_score: winner.composite_score, runner_up: runnerUp ? runnerUp.agent_id : null, all_scores: scored.map(s => ({ agent_id: s.agent_id, score: s.composite_score })) };
}

/** Get competition win leaderboard */
function getWinLeaderboard() {
  const data = load();
  return Object.entries(data.wins)
    .map(([agent_id, stats]) => ({ agent_id, ...stats, avg_score: stats.wins > 0 ? Math.round(stats.total_score / stats.wins * 100) / 100 : 0 }))
    .sort((a, b) => b.wins - a.wins);
}

/** Get composite task dominance: combines wins + ELO */
function getBestAgentForTask(taskId, problem) {
  const category = elo.detectCategory(problem || taskId);
  const dominance = elo.getTaskDominance();
  const catData = dominance[category];
  if (catData && catData.best_agent) {
    return { category, best_agent: catData.best_agent, elo_rating: catData.best_rating, method: 'elo_dominance' };
  }
  // Fallback: win leaderboard top
  const lb = getWinLeaderboard();
  if (lb.length > 0) return { category, best_agent: lb[0].agent_id, wins: lb[0].wins, method: 'wins_leaderboard' };
  return { category, best_agent: null, method: 'none' };
}

module.exports = { scoreSubmission, selectWinner, getWinLeaderboard, getBestAgentForTask };