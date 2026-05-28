// lib/goal-generator.js — Autonomous Goal Generation
// Analyzes world model state and generates self-directed optimization goals.
// Each goal has: description, priority, domain, generated_by, benchmark criteria.

const fs = require('fs');
const path = require('path');
const wm = require('./world-model');
const elo = require('./elo-rating');
const rc = require('./resolve-cache');

const GOALS_PATH = path.join(__dirname, '..', 'data', 'goals.json');
const BENCH_PATH = path.join(__dirname, '..', 'data', 'goal-benchmarks.json');

function load() {
  try { if (fs.existsSync(GOALS_PATH)) return JSON.parse(fs.readFileSync(GOALS_PATH, 'utf8')); } catch {}
  return { goals: [], completed: [], archived: [], generated_at: null };
}

function save(data) {
  try { const dir = path.dirname(GOALS_PATH); if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(GOALS_PATH, JSON.stringify(data, null, 2)); } catch {}
}

function loadBenchmarks() {
  try { if (fs.existsSync(BENCH_PATH)) return JSON.parse(fs.readFileSync(BENCH_PATH, 'utf8')); } catch {}
  return { benchmarks: [] };
}

/** Analyze world model and generate new goals */
function generateGoals(count = 5) {
  const model = wm.getWorldModel();
  const goals = load();
  const now = Date.now();

  const candidates = [];

  // 1. Memory health goals
  if (model.memory.corruption_ratio > 10) {
    candidates.push({
      goal: `Reduce memory corruption ratio from ${model.memory.corruption_ratio}% to below 10%`,
      priority: Math.min(0.9, model.memory.corruption_ratio / 100),
      domain: 'memory_health',
      metric: 'corruption_ratio',
      current: model.memory.corruption_ratio,
      target: 10,
    });
  }

  // 2. Low dominance zone goals
  if (model.dominance.zones?.length > 0) {
    for (const zone of model.dominance.zones.slice(0, 2)) {
      candidates.push({
        goal: `Improve agent ELO in ${zone.category} from ${zone.rating} to above 1200`,
        priority: Math.min(0.85, (1200 - zone.rating) / 400),
        domain: `dominance_${zone.category}`,
        metric: 'elo_rating',
        current: zone.rating,
        target: 1200,
        category: zone.category,
      });
    }
  }

  // 3. High failure rate goals
  if (model.failures.total > 20) {
    const topCat = model.failures.top_category_failures?.[0];
    if (topCat) {
      candidates.push({
        goal: `Reduce failure rate in '${topCat[0]}' category (${topCat[1]} failures)`,
        priority: Math.min(0.8, topCat[1] / 100),
        domain: `failure_${topCat[0]}`,
        metric: 'failure_count',
        current: topCat[1],
        target: 0,
        category: topCat[0],
      });
    }
  }

  // 4. Lineage cascade goals
  if (model.lineage.cascade_ratio > 5) {
    candidates.push({
      goal: `Contain lineage cascade: reduce unhealthy trees from ${model.lineage.unhealthy_trees} to 0`,
      priority: Math.min(0.85, model.lineage.cascade_ratio / 100),
      domain: 'lineage_stability',
      metric: 'unhealthy_trees',
      current: model.lineage.unhealthy_trees,
      target: 0,
    });
  }

  // 5. Extinction rate goals
  if (model.extinctions.total > 10) {
    candidates.push({
      goal: `Reduce memory extinction rate (${model.extinctions.total} total extinctions)`,
      priority: 0.6,
      domain: 'extinction_control',
      metric: 'extinction_count',
      current: model.extinctions.total,
      target: 0,
    });
  }

  // 6. Agent diversity goals
  if (model.elo_top?.length < 3) {
    candidates.push({
      goal: 'Increase agent diversity — create new hybrid profiles targeting weak zones',
      priority: 0.75,
      domain: 'agent_diversity',
      metric: 'top_agent_count',
      current: model.elo_top?.length || 0,
      target: 5,
    });
  }

  // 7. Self-play goals
  if (model.memory.low_score_hints > 50) {
    candidates.push({
      goal: `Generate adversarial tasks for ${model.memory.low_score_hints} low-score hints`,
      priority: 0.7,
      domain: 'self_play',
      metric: 'low_score_hints',
      current: model.memory.low_score_hints,
      target: 0,
    });
  }

  // Score and sort candidates
  candidates.forEach(c => {
    c.score = Math.round(c.priority * 100) / 100;
    c.generated_by = 'goal-generator';
    c.generated_at = new Date().toISOString();
    c.id = `GOAL-${now.toString(36).toUpperCase()}-${candidates.indexOf(c)}`;
    c.status = 'active';
  });
  candidates.sort((a, b) => b.score - a.score);

  // Merge new candidates into goals list (avoid duplicates by domain)
  const existingDomains = new Set(goals.goals.filter(g => g.status === 'active').map(g => g.domain));
  for (const c of candidates) {
    if (!existingDomains.has(c.domain) && goals.goals.filter(g => g.status === 'active').length < count) {
      goals.goals.push(c);
      existingDomains.add(c.domain);
    }
  }

  goals.generated_at = new Date().toISOString();
  if (goals.goals.length > 50) goals.goals = goals.goals.slice(-50);
  save(goals);
  return candidates;
}

/** Mark a goal as completed */
function completeGoal(goalId, outcome) {
  const data = load();
  const idx = data.goals.findIndex(g => g.id === goalId);
  if (idx === -1) return false;
  const goal = data.goals[idx];
  goal.status = 'completed';
  goal.completed_at = new Date().toISOString();
  goal.outcome = outcome || 'achieved';
  data.completed.push(goal);
  data.goals.splice(idx, 1);
  save(data);
  return true;
}

/** Create benchmark tasks from a goal */
function createBenchmark(goal) {
  const bench = loadBenchmarks();
  const taskId = `BENCH-${goal.domain.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const benchmark = {
    id: taskId,
    goal_id: goal.id || null,
    domain: goal.domain,
    metric: goal.metric || 'unknown',
    current: goal.current,
    target: goal.target,
    status: 'active',
    created_at: new Date().toISOString(),
    last_measured: null,
    measurements: [],
  };
  bench.benchmarks.push(benchmark);
  try { fs.writeFileSync(BENCH_PATH, JSON.stringify(bench, null, 2)); } catch {}
  return benchmark;
}

/** Get active goals */
function getActiveGoals() {
  const data = load();
  return data.goals.filter(g => g.status === 'active').sort((a, b) => b.score - a.score);
}

/** Get goal summary */
function getGoalSummary() {
  const data = load();
  return {
    active: data.goals.filter(g => g.status === 'active').length,
    completed: data.completed.length,
    total: data.goals.length + data.completed.length,
    top_goal: data.goals.filter(g => g.status === 'active').sort((a, b) => b.score - a.score)[0] || null,
    recent: data.goals.slice(-5).reverse(),
  };
}

/** Auto-generate: generate goals, create benchmarks for top 3 */
function autoCycle() {
  const newGoals = generateGoals(5);
  const data = load();
  const active = data.goals.filter(g => g.status === 'active');
  for (const g of active.slice(0, 3)) {
    createBenchmark(g);
  }
  return { generated: newGoals.length, active_goals: active.length };
}

module.exports = { generateGoals, completeGoal, createBenchmark, getActiveGoals, getGoalSummary, autoCycle };