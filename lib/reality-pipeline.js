// lib/reality-pipeline.js — Reality Pipeline Orchestrator
// Chains: harvest → convert → adversarial → eval → measure
// Reports: solve rate delta, new tasks per source, adversarial impact

const fs = require('fs');
const path = require('path');
const harvester = require('./reality-harvester');
const converter = require('./reality-to-eval');
const adversarial = require('./adversarial-generator');
const seedInjector = require('./memory-seed-injector');
const verifier = require('./pipeline-verifier');
const crossValidator = require('./cross-validator');
const feedback = require('./feedback-loop');
const remediation = require('./drift-remediation');
const evalHarness = require('./eval-harness');
const replayStability = require('./replay-stability');
const driftDetector = require('./drift-detector');
const baselineManager = require('./baseline-manager');

const PIPELINE_LOG = path.join(__dirname, '..', 'data', 'pipeline-log.json');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

// Run baseline eval before pipeline
function runBaselineEval() {
  try {
    const report = evalHarness.runFullSuite();
    return {
      solve_rate: report.summary.memory_effectiveness,
      total_tasks: report.total_tasks,
      helped: report.summary.memory_helped,
      rss: replayStability.computeGlobalRSS(2).global_rss,
      drift: driftDetector.getReport().total_regressions_detected,
    };
  } catch (e) {
    return { error: e.message };
  }
}

// Run after-pipeline eval
function runPostPipelineEval() {
  try {
    const report = evalHarness.runFullSuite();
    const rss = replayStability.computeGlobalRSS(2);
    return {
      solve_rate: report.summary.memory_effectiveness,
      total_tasks: report.total_tasks,
      helped: report.summary.memory_helped,
      rss: rss.global_rss,
      drift: driftDetector.getReport().total_regressions_detected,
      categories: report.categories,
    };
  } catch (e) {
    return { error: e.message };
  }
}

// Run the full pipeline
async function runFullPipeline() {
  const startTime = Date.now();
  const steps = {};
  const errors = [];

  // Step 1: Harvest
  try {
    const harvestResult = await harvester.runHarvest();
    steps.harvest = {
      status: 'ok',
      total: harvestResult.total,
      ai_agent_issues: harvestResult.ai_agent_issues,
      breakage_issues: harvestResult.breakage_issues,
      stackoverflow: harvestResult.stackoverflow,
      by_category: harvestResult.by_category,
      by_breakage: harvestResult.by_breakage,
    };
  } catch (e) {
    errors.push('harvest: ' + e.message);
    steps.harvest = { status: 'error', error: e.message };
  }

  // Step 2: Convert to golden tasks
  try {
    const latest = harvester.loadLatestHarvest();
    if (latest && latest.items && latest.items.length > 0) {
      const convertResult = converter.convertHarvest(latest);
      steps.convert = convertResult;

      // Step 2b: Inject memory seeds into resolve cache
      try {
        const injectResult = seedInjector.injectAllSeeds();
        steps.inject = { injected: injectResult.injected, total: injectResult.total };
      } catch (e) {
        errors.push('seed_inject: ' + e.message);
      }
    } else {
      steps.convert = { status: 'skipped', reason: 'No harvested items available' };
    }
  } catch (e) {
    errors.push('convert: ' + e.message);
    steps.convert = { status: 'error', error: e.message };
  }

  // Step 3: Verify closed issues
  try {
    const latest = harvester.loadLatestHarvest();
    if (latest) {
      const verifyResult = await verifier.runVerificationPipeline();
      steps.verify = verifyResult;
    }
  } catch (e) {
    errors.push('verify: ' + e.message);
  }

  // Step 4: Generate adversarial variants
  try {
    const advResult = adversarial.generateFullSet();
    const ingestResult = adversarial.ingestIntoGoldenSet();
    steps.adversarial = {
      generated: advResult.total,
      by_type: advResult.by_type,
      ingested_into_golden: ingestResult.ingested,
    };
  } catch (e) {
    errors.push('adversarial: ' + e.message);
    steps.adversarial = { status: 'error', error: e.message };
  }

  // Step 5: Cross-source validation
  try {
    steps.validation = crossValidator.runCrossValidation();
  } catch (e) {
    errors.push('validation: ' + e.message);
  }

  // Step 6: Feedback loop
  try {
    steps.feedback = feedback.runBatch();
  } catch (e) {
    errors.push('feedback: ' + e.message);
  }

  // Step 7: Drift check + auto-remediation
  try {
    steps.drift_before = driftDetector.getReport().total_regressions_detected;
    steps.remediation = remediation.runRemediation();
  } catch (e) {
    errors.push('remediation: ' + e.message);
  }

  // Step 8: Run eval and measure
  const baseline = runBaselineEval();
  let postPipeline;
  try {
    postPipeline = runPostPipelineEval();
  } catch (e) {
    errors.push('eval: ' + e.message);
    postPipeline = { error: e.message };
  }
  steps.eval = { baseline, post_pipeline: postPipeline };

  // Compute delta
  const delta = {};
  if (baseline.solve_rate !== undefined && postPipeline.solve_rate !== undefined) {
    delta.solve_rate_change = +(postPipeline.solve_rate - baseline.solve_rate).toFixed(1);
    delta.task_count_change = postPipeline.total_tasks - baseline.total_tasks;
    delta.rss_change = postPipeline.rss !== undefined && baseline.rss !== undefined
      ? +(postPipeline.rss - baseline.rss).toFixed(3) : null;
    delta.drift_change = postPipeline.drift !== undefined && baseline.drift !== undefined
      ? postPipeline.drift - baseline.drift : null;
  }

  const result = {
    ran_at: new Date().toISOString(),
    duration_ms: Date.now() - startTime,
    steps,
    delta,
    errors: errors.length > 0 ? errors : undefined,
    summary: {
      total_tasks_now: postPipeline.total_tasks || baseline.total_tasks,
      solve_rate_now: postPipeline.solve_rate ?? baseline.solve_rate,
      golden_tasks_added: steps.convert?.golden_tasks_created || 0,
      adversarial_added: steps.adversarial?.ingested_into_golden || 0,
      breakage_patterns_seen: steps.harvest?.by_breakage || {},
      delta,
    },
  };

  // Save pipeline log
  ensureDir(path.dirname(PIPELINE_LOG));
  let log = [];
  try {
    if (fs.existsSync(PIPELINE_LOG)) log = JSON.parse(fs.readFileSync(PIPELINE_LOG, 'utf8'));
  } catch {}
  log.push(result);
  fs.writeFileSync(PIPELINE_LOG, JSON.stringify(log, null, 2));

  return result;
}

// Get pipeline history
function getPipelineHistory(limit = 10) {
  try {
    if (!fs.existsSync(PIPELINE_LOG)) return [];
    const log = JSON.parse(fs.readFileSync(PIPELINE_LOG, 'utf8'));
    return Array.isArray(log) ? log.slice(-limit).reverse() : [];
  } catch { return []; }
}

// Get pipeline health summary
function getPipelineHealth() {
  const history = getPipelineHistory(5);
  const trends = {
    solve_rate_trend: [],
    task_count_trend: [],
    rss_trend: [],
  };
  for (const h of history) {
    if (h.summary) {
      trends.solve_rate_trend.push(h.summary.solve_rate_now);
      trends.task_count_trend.push(h.summary.total_tasks_now);
      if (h.summary.rss) trends.rss_trend.push(h.summary.rss);
    }
    if (h.delta) {
      if (!trends.deltas) trends.deltas = [];
      trends.deltas.push(h.delta);
    }
  }
  return {
    pipeline_runs: history.length,
    last_pipeline: history[0] || null,
    trends,
    harvest_categories: history[0]?.steps?.harvest?.by_category || {},
    breakage_patterns: history[0]?.steps?.harvest?.by_breakage || {},
  };
}

module.exports = {
  runFullPipeline,
  getPipelineHistory,
  getPipelineHealth,
};
