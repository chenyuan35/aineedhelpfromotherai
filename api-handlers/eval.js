// api-handlers/eval.js — Eval Scoreboard & Harness Endpoints

const evalHarness = require('../lib/eval-harness');
const replayToEval = require('../lib/replay-to-eval');
const driftDetector = require('../lib/drift-detector');

// GET /api/eval/golden — list golden tasks
async function handleListGolden(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  try {
    const tasks = evalHarness.loadGoldenSet();
    const byCategory = {};
    for (const t of tasks) {
      if (!byCategory[t.category]) byCategory[t.category] = [];
      byCategory[t.category].push({ id: t.id, difficulty: t.difficulty, tags: t.tags, problem: t.problem.slice(0, 120) });
    }
    res.json({ success: true, total: tasks.length, categories: Object.keys(byCategory), by_category: byCategory });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
}

// POST /api/eval/run — run full golden suite or single task
async function handleRunEval(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  try {
    const { task_id } = req.body || {};
    let report;
    if (task_id) {
      const result = evalHarness.evalTask(task_id);
      if (result.error) return res.status(404).json({ success: false, error: result.error });
      report = { single: true, result };
    } else {
      report = evalHarness.runFullSuite();
    }
    // Run drift check after eval
    try { driftDetector.checkDrift(); } catch {}
    res.json({ success: true, ...report });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
}

// GET /api/eval/scoreboard — eval metrics + drift summary
async function handleScoreboard(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  try {
    const latestReport = evalHarness.loadReports(1)[0];
    const drift = driftDetector.getReport();
    const patterns = require('../lib/replay-patterns').getSummary(5);

    // Historical trend (last 10 reports)
    const history = evalHarness.loadReports(10);
    const trend = history.length >= 2 ? {
      memory_effectiveness_change: history.length >= 2
        ? +(history[0].summary.memory_effectiveness - history[history.length - 1].summary.memory_effectiveness).toFixed(1)
        : 0,
      latency_change: history.length >= 2
        ? history[0].summary.avg_latency_improvement_ms - history[history.length - 1].summary.avg_latency_improvement_ms
        : 0,
    } : null;

    res.json({
      success: true,
      scoreboard: {
        // Core metrics table
        metrics: {
          solve_rate_delta: latestReport?.summary?.memory_effectiveness != null
            ? `${latestReport.summary.memory_effectiveness}%` : 'N/A',
          hallucination_reduction: patterns.total_patterns > 0
            ? patterns.neutral : 'N/A',
          retry_reduction: latestReport?.summary?.both_failed != null
            ? latestReport.summary.both_failed : 'N/A',
          replay_stability: drift.total_regressions_detected === 0 ? 'stable' :
                            drift.total_regressions_detected < 3 ? 'minor' : 'degrading',
          regression_count: drift.total_regressions_detected,
          total_eval_runs: latestReport?.total_tasks || 0,
        },
        // Per-category breakdown
        categories: latestReport?.results
          ? [...new Set(latestReport.results.map(r => r.category))].map(cat => {
              const catResults = latestReport.results.filter(r => r.category === cat);
              return {
                category: cat,
                tasks: catResults.length,
                memory_helped: catResults.filter(r => r.memory_helped).length,
                avg_latency_improvement: Math.round(catResults.reduce((s, r) => s + (r.latency_improvement_ms || 0), 0) / catResults.length),
              };
            })
          : [],
        // Drift status
        drift: {
          status: drift.active_regressions ? 'DEGRADING' : 'stable',
          last_checked: drift.last_check,
          active_regressions: drift.active_regressions,
          recent_regressions: drift.recent_regressions,
        },
        // Trend
        trend,
        // Last eval timestamp
        last_eval: latestReport?.ran_at || null,
      },
    });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
}

// POST /api/eval/replay-to-eval — convert recent failed runs to golden tasks
async function handleReplayToEval(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  try {
    const suite = replayToEval.extractRegressionSuite();
    let written = 0;
    for (const task of suite) {
      if (replayToEval.writeGoldenTask(task)) written++;
    }
    res.json({
      success: true,
      extracted: suite.length,
      written_to_golden: written,
      tasks: suite.map(t => ({ id: t.id, problem: t.problem.slice(0, 80), source: t.source_run_id })),
      message: written > 0 ? `${written} new golden tasks added from failed replays` : 'No new regression cases found',
    });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
}

// GET /api/eval/drift — detailed drift report
async function handleDriftReport(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  try {
    const report = driftDetector.getReport();
    res.json({ success: true, drift: report });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
}

// POST /api/eval/drift/check — force drift detection
async function handleCheckDrift(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  try {
    const result = driftDetector.checkDrift();
    res.json({ success: true, detection: result });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
}

module.exports = { handleListGolden, handleRunEval, handleScoreboard, handleReplayToEval, handleDriftReport, handleCheckDrift };
