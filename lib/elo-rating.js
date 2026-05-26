// lib/elo-rating.js — Multi-category ELO rating system for agent competition
// Tracks per-agent, per-task-category ratings. Updates after each competition cycle.
// Ported to file-based (no DB) — works alongside resolve-cache.json

const fs = require('fs');
const path = require('path');

const RATINGS_PATH = path.join(__dirname, '..', 'data', 'elo-ratings.json');
const DEFAULT_RATING = 1200;
const K_FACTOR = 32;
const CATEGORIES = ['general', 'ambiguity', 'simple_fixes', 'infra_debugging', 'performance', 'security', 'networking', 'conflict', 'hallucination', 'stale'];

function load() {
  try {
    if (fs.existsSync(RATINGS_PATH)) {
      return JSON.parse(fs.readFileSync(RATINGS_PATH, 'utf8'));
    }
  } catch (e) { console.error('[elo] Load error:', e.message); }
  return { agents: {}, history: [], updated_at: null };
}

function save(data) {
  try {
    const dir = path.dirname(RATINGS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(RATINGS_PATH, JSON.stringify(data, null, 2));
  } catch (e) { console.error('[elo] Save error:', e.message); }
}

/** Get or create rating for an agent + category */
function getRating(agentId, category) {
  const data = load();
  if (!data.agents[agentId]) data.agents[agentId] = {};
  if (!data.agents[agentId][category]) {
    data.agents[agentId][category] = { rating: DEFAULT_RATING, games: 0, wins: 0, losses: 0, draws: 0, streak: 0, best_rating: DEFAULT_RATING };
    save(data);
  }
  return data.agents[agentId][category];
}

/** Expected score: P(agent A beats agent B) */
function expectedScore(ratingA, ratingB) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/** Update ELO after a competition. outcomes: [{ agent_id, category, score: 1|0.5|0, token_cost, speed_ms, hallucinated: bool }] */
function updateRatings(outcomes) {
  const data = load();
  const updates = [];

  // Group by category
  const byCategory = {};
  for (const o of outcomes) {
    if (!byCategory[o.category]) byCategory[o.category] = [];
    byCategory[o.category].push(o);
  }

  for (const [category, agents] of Object.entries(byCategory)) {
    // Pairwise ELO updates within each category
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const a = agents[i], b = agents[j];
        const ra = getRating(a.agent_id, category);
        const rb = getRating(b.agent_id, category);

        const expectedA = expectedScore(ra.rating, rb.rating);
        const expectedB = expectedScore(rb.rating, ra.rating);

        // Composite score: correctness *0.6 + efficiency *0.2 + speed *0.1 - hallucination_penalty *0.1
        const efficiencyBonusA = a.token_cost > 0 ? Math.min(0.5, 500 / a.token_cost) : 0;
        const efficiencyBonusB = b.token_cost > 0 ? Math.min(0.5, 500 / b.token_cost) : 0;
        const speedBonusA = a.speed_ms > 0 ? Math.min(0.3, 30000 / a.speed_ms) : 0;
        const speedBonusB = b.speed_ms > 0 ? Math.min(0.3, 30000 / b.speed_ms) : 0;
        const hallucinationPenaltyA = a.hallucinated ? 0.1 : 0;
        const hallucinationPenaltyB = b.hallucinated ? 0.1 : 0;

        const compositeA = a.score * 0.6 + efficiencyBonusA * 0.2 + speedBonusA * 0.1 - hallucinationPenaltyA;
        const compositeB = b.score * 0.6 + efficiencyBonusB * 0.2 + speedBonusB * 0.1 - hallucinationPenaltyB;

        const actualA = compositeA > compositeB ? 1 : (compositeA < compositeB ? 0 : 0.5);
        const actualB = compositeB > compositeA ? 1 : (compositeB < compositeA ? 0 : 0.5);

        // K-factor adjusts for experience: fewer games = higher volatility
        const kA = K_FACTOR / (1 + ra.games * 0.05);
        const kB = K_FACTOR / (1 + rb.games * 0.05);

        const newRatingA = ra.rating + kA * (actualA - expectedA);
        const newRatingB = rb.rating + kB * (actualB - expectedB);

        ra.rating = Math.round(newRatingA);
        rb.rating = Math.round(newRatingB);
        ra.games++;
        rb.games++;
        if (actualA === 1) { ra.wins++; rb.losses++; ra.streak = Math.max(1, ra.streak + 1); rb.streak = Math.min(-1, rb.streak - 1); }
        else if (actualA === 0) { ra.losses++; rb.wins++; ra.streak = Math.min(-1, ra.streak - 1); rb.streak = Math.max(1, rb.streak + 1); }
        else { ra.draws++; rb.draws++; }
        if (ra.rating > ra.best_rating) ra.best_rating = ra.rating;
        if (rb.rating > rb.best_rating) rb.best_rating = rb.rating;

        updates.push({
          ts: new Date().toISOString(),
          category, agents: [a.agent_id, b.agent_id],
          old_ratings: [Math.round(expectedA * 100 + ra.rating - kA * (actualA - expectedA)), Math.round(expectedB * 100 + rb.rating - kB * (actualB - expectedB))],
          new_ratings: [ra.rating, rb.rating],
          expected: [Math.round(expectedA * 100) / 100, Math.round(expectedB * 100) / 100],
          actual: [actualA, actualB],
          composite: [Math.round(compositeA * 100) / 100, Math.round(compositeB * 100) / 100],
        });
      }
    }
  }

  // Persist
  data.updated_at = new Date().toISOString();
  data.history.push(...updates);
  if (data.history.length > 10000) data.history = data.history.slice(-10000);
  save(data);
  return updates;
}

/** Get current ELO ratings for all agents, optionally filtered by category */
function getLeaderboard(category) {
  const data = load();
  const cats = category ? [category] : CATEGORIES;
  const result = [];

  for (const [agentId, catData] of Object.entries(data.agents)) {
    let total = 0, count = 0, bestCat = null;
    for (const c of cats) {
      if (catData[c]) {
        total += catData[c].rating;
        count++;
        if (!bestCat || catData[c].rating > bestCat.rating) bestCat = { category: c, ...catData[c] };
      }
    }
    if (count === 0) continue;
    result.push({
      agent_id: agentId,
      avg_rating: Math.round(total / count),
      categories: count,
      best_category: bestCat,
      per_category: {},
    });
    for (const c of cats) {
      if (catData[c]) result[result.length - 1].per_category[c] = catData[c];
    }
  }

  result.sort((a, b) => b.avg_rating - a.avg_rating);
  return result;
}

/** Per-task-type dominance analysis */
function getTaskDominance() {
  const data = load();
  const dominance = {};

  for (const [agentId, catData] of Object.entries(data.agents)) {
    for (const [category, stats] of Object.entries(catData)) {
      if (!dominance[category]) dominance[category] = [];
      dominance[category].push({ agent_id: agentId, ...stats });
    }
  }

  // For each category, find the best agent
  for (const [category, agents] of Object.entries(dominance)) {
    agents.sort((a, b) => b.rating - a.rating);
    dominance[category] = {
      best_agent: agents[0]?.agent_id || null,
      best_rating: agents[0]?.rating || DEFAULT_RATING,
      agents: agents.slice(0, 5), // top 5
    };
  }

  return dominance;
}

/** Record a competition cycle from replay entries */
function processCompetitionCycle(entries) {
  const outcomes = [];
  for (const e of entries) {
    if (e.type !== 'resolve_attempt' || e.outcome !== 'success') continue;
    const category = detectCategory(e.problem || e.task_id || '');
    outcomes.push({
      agent_id: e.agent_id,
      category,
      score: e.outcome === 'success' ? 1 : 0,
      token_cost: e.tokens_used || 1000,
      speed_ms: e.duration_ms || 60000,
      hallucinated: (e.cited_hints || []).length === 0 && (e.hint_ids || []).length > 0,
    });
  }
  if (outcomes.length >= 2) {
    updateRatings(outcomes);
    return outcomes.length;
  }
  return 0;
}

/** Simple category detection from problem text */
function detectCategory(problem) {
  const p = (problem || '').toLowerCase();
  if (p.includes('security') || p.includes('permission') || p.includes('auth')) return 'security';
  if (p.includes('network') || p.includes('dns') || p.includes('proxy') || p.includes('connection')) return 'networking';
  if (p.includes('perform') || p.includes('slow') || p.includes('memory') || p.includes('heap') || p.includes('leak')) return 'performance';
  if (p.includes('conflict') || p.includes('versus') || p.includes('vs ') || p.includes('trap')) return 'conflict';
  if (p.includes('stale') || p.includes('deprecated') || p.includes('legacy')) return 'stale';
  if (p.includes('ambigu') || p.includes('unclear') || p.includes('vague')) return 'ambiguity';
  if (p.includes('fix') || p.includes('simple') || p.includes('install') || p.includes('command')) return 'simple_fixes';
  if (p.includes('debug') || p.includes('infra') || p.includes('config') || p.includes('deploy')) return 'infra_debugging';
  if (p.includes('hallucin') || p.includes('trap') || p.includes('wrong')) return 'hallucination';
  return 'general';
}

module.exports = {
  getRating, updateRatings, getLeaderboard, getTaskDominance,
  processCompetitionCycle, detectCategory, DEFAULT_RATING,
};
