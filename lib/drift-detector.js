// lib/drift-detector.js — Memory Drift Detection
// After each intelligence pipeline, checks if solve rate ↓, hallucination ↑, latency ↑
// Flags REGRESSION DETECTED when metrics degrade.

const fs = require('fs');
const path = require('path');
const executionLog = require('./execution-log');
const replayPatterns = require('./replay-patterns');

const STATE_PATH = path.join(__dirname, '..', 'data', 'drift-state.json');

function getState() {
  try {
    if (fs.existsSync(STATE_PATH)) return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  } catch  {}
  return { last_check: null, history: [], regressions: [] };
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

// Compare current patterns against historical baseline
function checkDrift() {
  const state = getState();
  const patterns = replayPatterns.extractPatterns();
  const now = new Date().toISOString();

  // Compute current aggregate metrics
  const current = {
    checked_at: now,
    total_patterns: patterns.length,
    avg_solve_rate_with_memory: patterns.length > 0
      ? +(patterns.reduce((s, p) => s + p.with_memory.solve_rate, 0) / patterns.length).toFixed(3)
      : 0,
    avg_solve_rate_without_memory: patterns.length > 0
      ? +(patterns.reduce((s, p) => s + p.without_memory.solve_rate, 0) / patterns.length).toFixed(3)
      : 0,
    avg_hallucination_with: patterns.length > 0
      ? +(patterns.reduce((s, p) => s + p.with_memory.hallucination_rate, 0) / patterns.length).toFixed(3)
      : 0,
    avg_hallucination_without: patterns.length > 0
      ? +(patterns.reduce((s, p) => s + p.without_memory.hallucination_rate, 0) / patterns.length).toFixed(3)
      : 0,
  };

  // Detect regressions against previous check
  const regressions = [];
  if (state.last_check && state.history.length > 0) {
    const prev = state.history[state.history.length - 1];

    if (current.avg_solve_rate_with_memory < prev.avg_solve_rate_with_memory - 0.05) {
      regressions.push({
        type: 'solve_rate_decrease',
        severity: 'warning',
        metric: 'avg_solve_rate_with_memory',
        before: prev.avg_solve_rate_with_memory,
        after: current.avg_solve_rate_with_memory,
        delta: +(current.avg_solve_rate_with_memory - prev.avg_solve_rate_with_memory).toFixed(3),
      });
    }

    if (current.avg_hallucination_with > prev.avg_hallucination_with + 0.05) {
      regressions.push({
        type: 'hallucination_increase',
        severity: 'critical',
        metric: 'avg_hallucination_with',
        before: prev.avg_hallucination_with,
        after: current.avg_hallucination_with,
        delta: +(current.avg_hallucination_with - prev.avg_hallucination_with).toFixed(3),
      });
    }
  }

  // Detect per-pattern regressions
  const patternRegressions = [];
  for (const p of patterns) {
    if (p.solve_rate_delta < -0.1) {
      patternRegressions.push({
        task_id: p.task_id, problem: p.problem.slice(0, 100),
        type: 'memory_hurts_solve', severity: 'warning',
        solve_rate_delta: p.solve_rate_delta,
        total_runs: p.total_runs,
      });
    }
    if (p.hallucination_delta > 0.1) {
      patternRegressions.push({
        task_id: p.task_id, problem: p.problem.slice(0, 100),
        type: 'memory_increases_hallucination', severity: 'critical',
        hallucination_delta: p.hallucination_delta,
        total_runs: p.total_runs,
      });
    }
  }

  const detection = {
    checked_at: now,
    has_regression: regressions.length > 0 || patternRegressions.length > 0,
    global_regressions: regressions,
    pattern_regressions: patternRegressions,
    current_metrics: current,
  };

  // Update state
  state.last_check = now;
  state.history.push(current);
  if (state.history.length > 50) state.history = state.history.slice(-50);
  if (regressions.length > 0) state.regressions.push(...regressions);
  if (state.regressions.length > 100) state.regressions = state.regressions.slice(-100);
  saveState(state);

  return detection;
}

// Get drift report (state + latest check)
function getReport() {
  const state = getState();
  const latest = state.history[state.history.length - 1] || null;
  const prev = state.history.length >= 2 ? state.history[state.history.length - 2] : null;

  // Compute trends
  const trends = [];
  if (state.history.length >= 3) {
    const recent = state.history.slice(-3);
    const solveRates = recent.map(h => h.avg_solve_rate_with_memory);
    if (solveRates[2] < solveRates[0] - 0.05) {
      trends.push({ metric: 'solve_rate', direction: 'down', severity: 'declining', data_points: solveRates });
    }
    if (solveRates[2] > solveRates[0] + 0.05) {
      trends.push({ metric: 'solve_rate', direction: 'up', severity: 'improving', data_points: solveRates });
    }
  }

  return {
    last_check: state.last_check,
    total_checks: state.history.length,
    total_regressions_detected: state.regressions.length,
    active_regressions: state.regressions.filter(r => r.type === 'hallucination_increase').length > 0,
    latest_metrics: latest,
    previous_metrics: prev,
    recent_trends: trends,
    recent_regressions: state.regressions.slice(-5),
  };
}

module.exports = { checkDrift, getReport };
