// lib/baseline-manager.js — Baseline snapshots for CI gating
// Saves eval results as baselines, compares new runs against them,
// and enforces hard thresholds on solve rate / hallucination / stability.

const fs = require('fs');
const path = require('path');
const evalHarness = require('./eval-harness');

const BASELINES_DIR = path.join(__dirname, '..', 'evals', 'baselines');

// Default thresholds (configurable via env vars)
const THRESHOLDS = {
  solve_rate_max_drop: parseFloat(process.env.EVAL_THRESHOLD_SOLVE_DROP || '0.03'),
  hallucination_max_rise: parseFloat(process.env.EVAL_THRESHOLD_HALLUC_RISE || '0.05'),
  regression_max_critical: parseInt(process.env.EVAL_THRESHOLD_REGRESSION_CRITICAL || '0', 10),
  min_replay_stability: parseFloat(process.env.EVAL_THRESHOLD_STABILITY || '0.95'),
};

function ensureDir() { if (!fs.existsSync(BASELINES_DIR)) fs.mkdirSync(BASELINES_DIR, { recursive: true }); }

// Save current eval report as a named baseline
function saveBaseline(report, label) {
  ensureDir();
  const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = label ? `baseline-${label}-${dateStr}.json` : `baseline-${dateStr}.json`;
  const filePath = path.join(BASELINES_DIR, filename);
  const entry = { saved_at: new Date().toISOString(), label: label || null, report };
  fs.writeFileSync(filePath, JSON.stringify(entry, null, 2));
  return { file: filename, path: filePath };
}

// Load the latest baseline (by filename sort)
function loadLatestBaseline() {
  ensureDir();
  const files = fs.readdirSync(BASELINES_DIR)
    .filter(f => f.startsWith('baseline-') && f.endsWith('.json'))
    .sort()
    .reverse();
  if (files.length === 0) return null;
  try { return JSON.parse(fs.readFileSync(path.join(BASELINES_DIR, files[0]), 'utf8')); }
  catch { return null; }
}

// Load all baselines
function loadAllBaselines(limit = 20) {
  ensureDir();
  return fs.readdirSync(BASELINES_DIR)
    .filter(f => f.startsWith('baseline-') && f.endsWith('.json'))
    .sort().reverse().slice(0, limit)
    .map(f => {
      try { return { filename: f, ...JSON.parse(fs.readFileSync(path.join(BASELINES_DIR, f), 'utf8')) }; }
      catch { return null; }
    })
    .filter(Boolean);
}

// Compare current eval report against a baseline
// Returns { passed: bool, failures: string[], metrics: {} }
function compareAgainstBaseline(currentReport, baselineReport) {
  const failures = [];
  const metrics = {};

  const curr = currentReport.summary || {};
  const base = baselineReport?.report?.summary || baselineReport?.summary || {};

  if (!base.memory_effectiveness && !base.memory_helped) {
    return { passed: true, failures: ['No baseline data to compare against'], metrics: { note: 'first baseline' } };
  }

  // Solve rate comparison (memory_effectiveness = percentage points)
  const currEffect = curr.memory_effectiveness || 0;
  const baseEffect = base.memory_effectiveness || 0;
  const solveDrop = baseEffect - currEffect;
  metrics.solve_rate_delta = solveDrop;
  if (solveDrop > THRESHOLDS.solve_rate_max_drop * 100) {
    failures.push(`SOLVE_RATE_REGRESSION: dropped ${solveDrop.toFixed(1)}pp (threshold: ${(THRESHOLDS.solve_rate_max_drop * 100).toFixed(1)}pp)`);
  }

  // Hallucination comparison (patterns)
  const patternsBefore = baselineReport?.patterns || baselineReport?.report?.patterns || null;
  const patternsAfter = currentReport?.patterns || null;

  // Per-task comparison
  const resultsBefore = base.results || baselineReport?.report?.results || baselineReport?.results || [];
  const resultsAfter = curr.results || currentReport?.results || [];
  const taskMapBefore = {};
  for (const r of resultsBefore) taskMapBefore[r.task_id] = r;
  const taskMapAfter = {};
  for (const r of resultsAfter) taskMapAfter[r.task_id] = r;

  let hallucinationIncrease = 0;
  let hallucinationCount = 0;
  for (const [taskId, after] of Object.entries(taskMapAfter)) {
    const before = taskMapBefore[taskId];
    if (!before) continue;
    // If previously memory_helped but now doesn't → hallucination concern
    if (before.memory_helped && !after.memory_helped) {
      hallucinationIncrease++;
    }
    hallucinationCount++;
  }
  const hallucRate = hallucinationCount > 0 ? hallucinationIncrease / hallucinationCount : 0;
  metrics.hallucination_rise = hallucRate;
  if (hallucRate > THRESHOLDS.hallucination_max_rise) {
    failures.push(`HALLUCINATION_REGRESSION: rose ${(hallucRate * 100).toFixed(1)}% of tasks (threshold: ${(THRESHOLDS.hallucination_max_rise * 100).toFixed(1)}%)`);
  }

  metrics.passed = failures.length === 0;
  metrics.total_failures = failures.length;

  return { passed: failures.length === 0, failures, metrics };
}

// Run eval + compare against latest baseline. Used by CI.
function runCIGate({ label, passk } = {}) {
  const report = evalHarness.runFullSuite();
  const baseline = loadLatestBaseline();

  let comparison = null;
  if (baseline) {
    comparison = compareAgainstBaseline(report, baseline);
  } else {
    comparison = { passed: true, failures: ['No baseline — saving as new baseline'], metrics: { note: 'first_run' } };
  }

  // Save as new baseline
  const saved = saveBaseline(report, label || 'ci');

  // Check pass^k if requested
  let passkResult = null;
  if (passk && passk > 1) {
    passkResult = runPassK(passk);
    if (passkResult.stability < THRESHOLDS.min_replay_stability) {
      comparison.failures.push(`PASSK_STABILITY_FAILURE: stability ${(passkResult.stability * 100).toFixed(1)}% < threshold ${(THRESHOLDS.min_replay_stability * 100).toFixed(1)}%`);
      comparison.passed = false;
    }
  }

  return { report, comparison, baseline_saved: saved, passk: passkResult, thresholds: THRESHOLDS };
}

// Run pass^k: execute the same golden task N times and check consistency
function runPassK(k) {
  const tasks = evalHarness.loadGoldenSet();
  if (tasks.length === 0) return { stability: 1, runs: 0, note: 'no golden tasks' };

  // Run the first golden task k times and check trajectory consistency
  const task = tasks[0];
  const runs = [];
  for (let i = 0; i < k; i++) {
    const result = evalHarness.evalTask(task.id);
    runs.push(result);
  }

  // Stability = proportion of runs that produced the same outcome
  const outcomes = runs.map(r => r.memory_helped ? 'helped' : (r.memory_hurt ? 'hurt' : 'neutral'));
  const mostCommon = outcomes.sort((a, b) =>
    outcomes.filter(v => v === a).length - outcomes.filter(v => v === b).length
  ).pop();
  const consistentCount = outcomes.filter(o => o === mostCommon).length;
  const stability = k > 0 ? consistentCount / k : 1;

  return { k, runs: runs.length, stability: +stability.toFixed(4), consistent_count: consistentCount, dominant_outcome: mostCommon };
}

module.exports = { saveBaseline, loadLatestBaseline, loadAllBaselines, compareAgainstBaseline, runCIGate, runPassK, THRESHOLDS, BASELINES_DIR };
