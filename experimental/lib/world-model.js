// lib/world-model.js — Global system state summarizer
// Generates a structured world description every N minutes.
// Injected into meta agents so they see the full system, not just local views.

const fs = require('fs');
const path = require('path');
const rc = require('./read-only-cache');
const elo = require('./elo-rating');
const lineage = require('./memory-lineage');
const winnerSelection = require('./winner-selection');

const MODEL_PATH = path.join(__dirname, '..', 'data', 'world-model.json');
let modelCache = null;

function scanMemoryHealth() {
  const all = rc.getAllHints();
  const health = rc.getMemoryHealth();
  const lowScore = Object.entries(all).filter(([id, h]) => (h.score ?? 1) < 0.3 && h.hit).length;
  return {
    total: Object.keys(all).length,
    active: health.active || 0,
    decaying: health.decaying || 0,
    quarantined: health.quarantined || 0,
    blacklisted: health.blacklisted || 0,
    low_score_hints: lowScore,
    corruption_ratio: health.active + health.decaying > 0
      ? Math.round(((health.quarantined + health.blacklisted) / (health.active + health.decaying + health.quarantined + health.blacklisted)) * 10000) / 100
      : 0,
  };
}

function scanFailures() {
  const REPLAY_PATH = './data/replay-log.jsonl';
  const failures = { per_agent: {}, per_category: {}, total: 0 };
  if (!fs.existsSync(REPLAY_PATH)) return failures;
  const lines = fs.readFileSync(REPLAY_PATH, 'utf8').split('\n').filter(Boolean);
  for (const line of lines.slice(-500)) { // last 500 entries
    try {
      const e = JSON.parse(line);
      if (e.type === 'resolve_attempt' && e.outcome !== 'success') {
        failures.total++;
        const agent = e.agent_id || 'unknown';
        const cat = elo.detectCategory(e.problem || e.task_id || '');
        failures.per_agent[agent] = (failures.per_agent[agent] || 0) + 1;
        failures.per_category[cat] = (failures.per_category[cat] || 0) + 1;
      }
    } catch {}
  }
  failures.top_agent_failures = Object.entries(failures.per_agent).sort((a, b) => b[1] - a[1]).slice(0, 5);
  failures.top_category_failures = Object.entries(failures.per_category).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return failures;
}

function scanDominance() {
  const dominance = elo.getTaskDominance();
  const weakZones = [];
  for (const [cat, data] of Object.entries(dominance)) {
    if (data.best_rating < 1200) weakZones.push({ category: cat, rating: data.best_rating, best_agent: data.best_agent });
  }
  return { zones: weakZones, healthy: Object.keys(dominance).length - weakZones.length, total: Object.keys(dominance).length };
}

function scanLineageHealth() {
  const forest = lineage.buildLineageForest();
  if (!forest) return { cascades: 0, unhealthy_trees: 0, total_trees: 0 };
  const trees = Object.values(forest);
  const cascades = trees.filter(t => t.health?.quarantined > 0);
  return {
    total_trees: trees.length,
    unhealthy_trees: cascades.length,
    cascade_ratio: trees.length > 0 ? Math.round((cascades.length / trees.length) * 10000) / 100 : 0,
    avg_lineage_score: trees.length > 0
      ? Math.round(trees.reduce((s, t) => s + (t.health?.avg_score || 0), 0) / trees.length * 100) / 100
      : 0,
  };
}

function scanExtinctionRate() {
  const ext = lineage.getExtinctionSummary();
  return {
    total: ext.total,
    by_reason: ext.by_reason,
    avg_generation_survived: ext.avg_generation_survived,
    recent_rate: ext.total > 0 ? 'active' : 'none',
  };
}

function scanEconomy() {
  try {
    const eco = require('./memory-economy');
    return eco.getSystemSummary();
  } catch { return { status: 'not_initialized' }; }
}

/** Build the complete world model */
function buildWorldModel() {
  const model = {
    ts: new Date().toISOString(),
    cycle: (modelCache?.cycle || 0) + 1,
    memory: scanMemoryHealth(),
    failures: scanFailures(),
    dominance: scanDominance(),
    lineage: scanLineageHealth(),
    extinctions: scanExtinctionRate(),
    economy: scanEconomy(),
    elo_top: elo.getLeaderboard().slice(0, 5),
    generated_by: 'world-model',
  };

  // Add meta-level assessments
  model.assessments = {
    system_health: model.memory.corruption_ratio < 10 ? 'stable' : (model.memory.corruption_ratio < 30 ? 'degrading' : 'critical'),
    failure_trend: model.failures.total > 50 ? 'high' : (model.failures.total > 10 ? 'moderate' : 'low'),
    lineage_stability: model.lineage.cascade_ratio < 10 ? 'stable' : (model.lineage.cascade_ratio < 30 ? 'warning' : 'critical'),
    dominant_agents: model.elo_top.map(a => ({ id: a.agent_id, rating: a.avg_rating, best_category: a.best_category?.category })),
  };

  modelCache = model;
  try {
    const dir = path.dirname(MODEL_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(MODEL_PATH, JSON.stringify(model, null, 2));
  } catch {}
  return model;
}

function getWorldModel() { return modelCache || buildWorldModel(); }

// Auto-build every 5 minutes
setInterval(buildWorldModel, 5 * 60 * 1000).unref();

module.exports = { buildWorldModel, getWorldModel, scanMemoryHealth, scanFailures };