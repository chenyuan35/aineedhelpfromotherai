// api-handlers/reality-metrics.js — Consolidated Reality Metrics Endpoint
// Returns everything: pipeline health, cross-validation, feedback stats,
// memory health, drift, eval trend, remediation history, environment coverage.

const pipeline = require('../lib/reality-pipeline');
const crossValidator = require('../lib/cross-validator');
const feedback = require('../lib/feedback-loop');
const resolveCache = require('../lib/read-only-cache');
const driftDetector = require('../lib/drift-detector');
const remediation = require('../lib/drift-remediation');
const evalHarness = require('../lib/eval-harness');
const envApi = require('../lib/environment-api');
const seedInjector = require('../lib/memory-seed-injector');
const scheduler = require('../lib/pipeline-scheduler');
const failureRegistry = require('../lib/failure-registry');

function getAllMetrics(req, res) {
  try {
    const pipelineHealth = pipeline.getPipelineHealth();
    const validation = crossValidator.getLastValidation();
    const feedbackStats = feedback.getFeedbackStats();
    const memoryHealth = resolveCache.getMemoryHealth();
    const drift = driftDetector.getReport();
    const remediationHistory = remediation.getRemediationHistory();
    const lastEval = evalHarness.loadReports(1)[0] || null;
    const environments = envApi.getEnvironmentSummary();
    const seedStats = seedInjector.getInjectorStats();
    const schedule = scheduler.getStatus();
    const patterns = failureRegistry.getSummary();

    const metrics = {
      captured_at: new Date().toISOString(),
      pipeline: {
        last_pipeline: pipelineHealth.last_pipeline ? {
          ran_at: pipelineHealth.last_pipeline.ran_at,
          solve_rate: pipelineHealth.last_pipeline.summary?.solve_rate_now,
          total_tasks: pipelineHealth.last_pipeline.summary?.total_tasks_now,
        } : null,
        schedule: schedule.interval_active ? 'active' : 'stopped',
        cycles: schedule.cycles_completed,
        harvest_categories: pipelineHealth.harvest_categories,
        breakage_patterns: pipelineHealth.breakage_patterns,
      },
      eval: {
        total_golden_tasks: lastEval?.total_tasks || 0,
        solve_rate: lastEval?.summary?.memory_effectiveness || null,
        memory_helped: lastEval?.summary?.memory_helped || 0,
        memory_hurt: lastEval?.summary?.memory_hurt || 0,
        categories: lastEval?.categories || [],
        last_ran: lastEval?.ran_at || null,
      },
      memory: {
        ...memoryHealth,
        seed_injection: seedStats,
      },
      drift: {
        total_regressions: drift.total_regressions_detected,
        per_category: drift.per_category || {},
        alerts: (drift.alerts || []).slice(-5),
      },
      remediation: {
        total_quarantined: remediationHistory.total_quarantined,
        last_action: remediationHistory.remediations[0] || null,
      },
      validation: validation ? {
        cross_source_score: validation.summary?.overall_cross_source_score,
        pairs: Object.entries(validation.results || {}).filter(([_, r]) => !r.skipped).map(([label, r]) => ({
          label, cross_source_solve_rate: r.cross_source_solve_rate,
        })),
        last_ran: validation.validated_at,
      } : null,
      feedback: {
        total_events_scanned: feedbackStats.total_events_scanned,
        last_ran: feedbackStats.last_ran,
      },
      environments: {
        total: environments.length,
        coverage: environments.filter(e => e.with_fix > 0).length,
        list: environments.slice(0, 10).map(e => e.environment),
      },
      patterns: {
        total: patterns.total_patterns,
        by_severity: patterns.by_severity,
        by_category: patterns.by_category,
      },
    };

    res.json({ success: true, metrics });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
}

module.exports = { getAllMetrics };
