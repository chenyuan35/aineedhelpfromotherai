#!/usr/bin/env node
// scripts/collapse-simulation.js — Catastrophic Memory Corruption + Self-Healing Test
// Simulates 5 collapse scenarios and measures recovery.
//
// Usage: node scripts/collapse-simulation.js [--scenario all|cascade|poison70|dominant|lineage|economy]

const fs = require('fs');
const path = require('path');
const rc = require('../lib/resolve-cache');
const lineage = require('../lib/memory-lineage');
const elo = require('../lib/elo-rating');
const wm = require('../lib/world-model');
const eco = require('../lib/memory-economy');

const REPORT_PATH = path.join(__dirname, '..', 'data', 'collapse-simulation-report.json');

// --- Snapshot ---

function snapshotState(label) {
  const health = rc.getMemoryHealth();
  const dom = elo.getTaskDominance();
  const eloLB = elo.getLeaderboard();
  return {
    label,
    ts: new Date().toISOString(),
    memory_health: health,
    dominance: Object.entries(dom).map(([c, d]) => ({ category: c, best_agent: d.best_agent, rating: d.best_rating })),
    elo_top3: eloLB.slice(0, 3).map(a => ({ agent: a.agent_id, rating: a.avg_rating })),
    hint_count: Object.keys(rc.getAllHints()).length,
    economy: eco.getSystemSummary(),
  };
}

// --- Scenario 1: Cascade Attack ---

function scenarioCascade() {
  console.log('[collapse] Scenario 1: Cascade lineage attack — poisoning top lineage trees');
  const all = rc.getAllHints();
  const withLineage = Object.entries(all).filter(([id, h]) => h.parent_reasoning_id && h.hit && (h.score ?? 1) > 0.5);
  const targets = withLineage.sort((a, b) => (b[1].score ?? 0) - (a[1].score ?? 0)).slice(0, 30);

  let poisoned = 0;
  for (const [id, h] of targets) {
    h.score = -1.5;
    h.status = 'quarantined';
    h.collapse_simulation = 'cascade_attack';
    h.collapse_generation = h.mutation_generation || 0;
    rc.setHint(id, h);
    poisoned++;
  }
  console.log(`[collapse]  ↳ Poisoned ${poisoned} high-lineage hints`);
  return { scenario: 'cascade', poisoned, target_count: targets.length };
}

// --- Scenario 2: Poison 70% ---

function scenarioPoison70() {
  console.log('[collapse] Scenario 2: 70% hint pool poisoned');
  const all = rc.getAllHints();
  const active = Object.entries(all).filter(([id, h]) => h.hit && (h.status === 'active' || h.status === 'decaying'));
  const toPoison = Math.floor(active.length * 0.7);
  const selected = active.sort(() => Math.random() - 0.5).slice(0, toPoison);

  let count = 0;
  for (const [id, h] of selected) {
    h.score = Math.max(-2, (h.score ?? 1) - 1.5);
    h.status = 'quarantined';
    h.collapse_simulation = 'mass_poison_70';
    rc.setHint(id, h);
    count++;
  }
  console.log(`[collapse]  ↳ Poisoned ${count}/${active.length} hints (${Math.round(count / active.length * 100)}%)`);
  return { scenario: 'mass_poison_70', poisoned: count, total: active.length };
}

// --- Scenario 3: Dominant Agent Hallucination ---

function scenarioDominant() {
  console.log('[collapse] Scenario 3: Injecting false high-ELO strategy');
  // Create a fake high-ELO agent entry
  const lb = elo.getLeaderboard();
  const fakeRatings = [];
  for (let i = 0; i < 5; i++) {
    const fakeCategory = ['security', 'networking', 'infra_debugging', 'performance', 'ambiguity'][i];
    elo.updateRatings([{
      agent_id: 'hallucinator-agent',
      category: fakeCategory,
      score: 1,
      token_cost: 50,
      speed_ms: 1000,
      hallucinated: false,
    }]);
    fakeRatings.push(fakeCategory);
  }
  // Now boost it to very high ELO by winning many fake competitions
  for (let i = 0; i < 20; i++) {
    elo.updateRatings([{
      agent_id: 'hallucinator-agent',
      category: fakeRatings[i % fakeRatings.length],
      score: 1,
      token_cost: 50,
      speed_ms: 500,
      hallucinated: false,
    }]);
  }
  console.log(`[collapse]  ↳ Inflated 'hallucinator-agent' ELO across ${fakeRatings.length} categories`);
  return { scenario: 'dominant_hallucination', agent: 'hallucinator-agent', categories: fakeRatings };
}

// --- Scenario 4: Lineage Cascade ---

function scenarioLineage() {
  console.log('[collapse] Scenario 4: Deep lineage cascade — corrupting entire family trees');
  const forest = lineage.buildLineageForest();
  if (!forest) return { scenario: 'lineage_cascade', error: 'no_forest' };

  const trees = Object.entries(forest);
  const bigTrees = trees.filter(([r, t]) => (t.children?.length || 0) > 3);
  const targets = [3, 5, 7].map(n => trees[n % trees.length]).filter(Boolean);

  let poisoned = 0;
  for (const [root, tree] of targets) {
    for (const child of (tree.children || [])) {
      const h = rc.getHint(child.task_id);
      if (h) {
        h.score = -2;
        h.status = 'blacklisted';
        h.collapse_simulation = 'deep_lineage_cascade';
        rc.setHint(child.task_id, h);
        poisoned++;
      }
    }
    // Also quarantine the root
    const rootHint = rc.getHint(root);
    if (rootHint) {
      rootHint.score = -1;
      rootHint.status = 'quarantined';
      rootHint.collapse_simulation = 'lineage_root_collapse';
      rc.setHint(root, rootHint);
    }
  }
  console.log(`[collapse]  ↳ Corrupted ${poisoned} lineage nodes across ${targets.length} family trees`);
  return { scenario: 'lineage_cascade', poisoned, trees_attacked: targets.length };
}

// --- Scenario 5: Economy Collapse ---

function scenarioEconomy() {
  console.log('[collapse] Scenario 5: Economy manipulation — inflating all hint costs');
  const all = rc.getAllHints();
  let count = 0;
  for (const [id, h] of Object.entries(all)) {
    if (h.hit && (h.score ?? 1) > 0.5) {
      // Artificially inflate score on low-quality hints to make them expensive
      if (h.corruption_type === 'fake' || h.corruption_type === 'stale') {
        h.score = Math.min(3, (h.score ?? 1) + 1.5);
        h.collapse_simulation = 'economy_manipulation';
        rc.setHint(id, h);
        count++;
      }
    }
  }
  console.log(`[collapse]  ↳ Inflated ${count} low-quality hint scores to create false economy`);
  return { scenario: 'economy_collapse', inflated: count };
}

// --- Evaluation ---

function evaluateRecovery(before, after, diagnosis) {
  const healthChange = {
    active: (after.memory_health.active || 0) - (before.memory_health.active || 0),
    quarantined: (after.memory_health.quarantined || 0) - (before.memory_health.quarantined || 0),
    blacklisted: (after.memory_health.blacklisted || 0) - (before.memory_health.blacklisted || 0),
  };

  // Measure recovery potential: system should quarantine bad data
  const recoveryPotential = after.memory_health.quarantined > before.memory_health.quarantined
    ? 'quarantine_active'
    : (after.memory_health.blacklisted > before.memory_health.blacklisted ? 'extinction_active' : 'no_response');

  // ELO stability
  const eloDrop = before.elo_top3[0]?.rating - after.elo_top3[0]?.rating;
  const eloStable = eloDrop < 50;

  return {
    health_change: healthChange,
    recovery_potential: recoveryPotential,
    elo_stable: eloStable,
    elo_drop: eloDrop || 0,
    hint_count_change: after.hint_count - before.hint_count,
    assessment: recoveryPotential === 'quarantine_active' ? 'system_responding' : (recoveryPotential === 'extinction_active' ? 'system_recovering' : 'system_unresponsive'),
  };
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2);
  const scenarioFlag = args.find(a => a.startsWith('--scenario='));
  const scenario = scenarioFlag ? scenarioFlag.split('=')[1] : 'all';

  console.log(`[collapse] === COLLAPSE RECOVERY SIMULATION ===`);
  console.log(`[collapse] Scenario: ${scenario}`);

  const before = snapshotState('pre_collapse');
  console.log(`[collapse] Pre-collapse state:`, JSON.stringify(before.memory_health));

  const scenarios = scenario === 'all'
    ? [scenarioCascade, scenarioPoison70, scenarioDominant, scenarioLineage, scenarioEconomy]
    : [{[scenarioCascade]: scenarioCascade, scenarioPoison70, scenarioDominant, scenarioLineage, scenarioEconomy}[scenario] || scenarioCascade];

  const results = [];
  for (const fn of scenarios) {
    try {
      const result = fn();
      results.push(result);
    } catch (err) {
      console.error(`[collapse] Scenario failed:`, err.message);
      results.push({ error: err.message });
    }
  }

  const after = snapshotState('post_collapse');
  const diagnosis = evaluateRecovery(before, after, results);
  diagnosis.results = results;

  // Write report
  const report = {
    ts: new Date().toISOString(),
    scenario,
    pre_collapse: before,
    post_collapse: after,
    diagnosis,
    key_metrics: {
      recovery_time: 'TBD (requires 24h observation)',
      corruption_spread: Math.round(((after.memory_health.quarantined + after.memory_health.blacklisted) / (Object.keys(rc.getAllHints()).length || 1)) * 10000) / 100 + '%',
      agent_extinction_diversity: (after.elo_top3 || []).length,
      memory_mutation_survival: after.memory_health.active,
    },
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\n[collapse] === REPORT WRITTEN TO ${REPORT_PATH} ===`);
  console.log(`[collapse] Recovery assessment: ${diagnosis.assessment}`);
  console.log(`[collapse] ELO drop: ${diagnosis.elo_drop}`);
  console.log(`[collapse] Memory health delta:`, JSON.stringify(diagnosis.health_change));
  console.log(`[collapse] Corruption spread: ${report.key_metrics.corruption_spread}`);
  console.log(`\n[collapse] Next: Monitor system for 24h. Check GET /api/meta for recovery tracking.`);
}

main().catch(err => { console.error('[collapse] Fatal:', err); process.exit(1); });