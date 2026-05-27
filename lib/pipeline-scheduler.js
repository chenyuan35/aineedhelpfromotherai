// lib/pipeline-scheduler.js — Continuous Reality Pipeline Scheduler
// Runs the pipeline on a configurable interval.
// On each cycle: harvest → convert → adversarial → inject seeds → eval → report

const harvester = require('./reality-harvester');
const converter = require('./reality-to-eval');
const adversarial = require('./adversarial-generator');
const seedInjector = require('./memory-seed-injector');
const evalHarness = require('./eval-harness');
const path = require('path');
const logger = console;

const DEFAULT_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours
const MIN_INTERVAL_MS = 30 * 60 * 1000; // 30 min minimum

let _intervalHandle = null;
let _running = false;
let _cycleCount = 0;

async function runCycle() {
  if (_running) return { skipped: true, reason: 'already_running' };
  _running = true;
  const startTime = Date.now();
  const steps = {};
  const errors = [];

  try {
    // Step 1: Harvest
    logger.log('[pipeline] Harvesting reality data...');
    steps.harvest = await harvester.runHarvest();
    logger.log(`[pipeline] Harvested ${steps.harvest.total} items`);

    // Step 2: Convert to golden tasks
    if (steps.harvest.total > 0) {
      const latest = harvester.loadLatestHarvest();
      if (latest) {
        steps.convert = converter.convertHarvest(latest);
        logger.log(`[pipeline] Converted ${steps.convert.golden_tasks_created} golden tasks, ${steps.convert.memory_seeds_created} seeds`);

        // Step 3: Inject memory seeds
        if (steps.convert.memory_seeds_created > 0) {
          steps.inject = seedInjector.injectAllSeeds();
          logger.log(`[pipeline] Injected ${steps.inject.injected} memory seeds into resolve-cache`);
        }
      }
    }

    // Step 4: Generate adversarial variants
    steps.adversarial = adversarial.generateFullSet();
    const ingest = adversarial.ingestIntoGoldenSet();
    steps.adversarial.ingested = ingest.ingested;
    logger.log(`[pipeline] Generated ${steps.adversarial.total} adversarial variants, ingested ${ingest.ingested}`);

    // Step 5: Run eval
    try {
      steps.eval = evalHarness.runFullSuite();
      logger.log(`[pipeline] Eval: ${steps.eval.total_tasks} tasks, ${steps.eval.summary.memory_effectiveness}% effectiveness`);
    } catch (e) {
      errors.push('eval: ' + e.message);
    }

    // Step 6: Run closed issue verification
    try {
      const verifier = require('./pipeline-verifier');
      steps.verify = await verifier.runVerificationPipeline();
      if (steps.verify.verified > 0) logger.log(`[pipeline] Verified ${steps.verify.verified} closed issues as golden tasks`);
    } catch (e) {
      errors.push('verify: ' + e.message);
    }

    // Step 7: Cross-source validation
    try {
      const validator = require('./cross-validator');
      steps.validation = validator.runCrossValidation();
      if (steps.validation.summary?.overall_cross_source_score !== null) {
        logger.log(`[pipeline] Cross-source validation: ${steps.validation.summary.overall_cross_source_score}% generalization`);
      }
    } catch (e) {
      errors.push('validation: ' + e.message);
    }

    // Step 8: Run feedback loop on execution log
    try {
      const feedback = require('./feedback-loop');
      steps.feedback = feedback.runBatch();
      if (steps.feedback.updated > 0) logger.log(`[pipeline] Feedback: ${steps.feedback.updated} memory scores updated`);
    } catch (e) {
      errors.push('feedback: ' + e.message);
    }

    // Step 9: Check drift and auto-remediate
    try {
      const remediation = require('./drift-remediation');
      steps.remediation = remediation.runRemediation();
      if (steps.remediation.quarantined > 0) {
        logger.log(`[pipeline] Remediation: quarantined ${steps.remediation.quarantined} bad seeds from ${(steps.remediation.categories_affected || []).join(', ')}`);
      }
    } catch (e) {
      errors.push('remediation: ' + e.message);
    }

    // Step 10: LLM spot-check (lightweight, 2 tasks)
    try {
      const llmEval = require('./llm-eval');
      if (llmEval.isAvailable()) {
        steps.llm_spot = await llmEval.runSpotCheck(2);
        logger.log(`[pipeline] LLM spot-check: ${steps.llm_spot.memory_effectiveness}% effectiveness`);
      } else {
        steps.llm_spot = { skipped: true, reason: 'No LLM API key configured (set LLM_API_KEY or OPENAI_API_KEY)' };
      }
    } catch (e) {
      errors.push('llm_spot: ' + e.message);
    }

    // Step 11: Generate mining report
    try {
      const reportGen = require('../scripts/generate-mining-report');
      reportGen.generate();
      logger.log('[pipeline] Mining report generated');
    } catch (e) {
      // best-effort
    }
  } catch (e) {
    errors.push('cycle: ' + e.message);
  }

  _cycleCount++;
  _running = false;

  return {
    cycle: _cycleCount,
    duration_ms: Date.now() - startTime,
    steps: {
      harvested: steps.harvest?.total || 0,
      golden_created: steps.convert?.golden_tasks_created || 0,
      seeds_injected: steps.inject?.injected || 0,
      adversarial_generated: steps.adversarial?.total || 0,
      adversarial_ingested: steps.adversarial?.ingested || 0,
    },
    solve_rate: steps.eval?.summary?.memory_effectiveness ?? null,
    total_tasks: steps.eval?.total_tasks ?? null,
    errors: errors.length > 0 ? errors : undefined,
    ran_at: new Date().toISOString(),
  };
}

function start(intervalMs = DEFAULT_INTERVAL_MS) {
  if (_intervalHandle) return { status: 'already_running', interval_ms: intervalMs };
  const actual = Math.max(intervalMs, MIN_INTERVAL_MS);
  // Run first cycle immediately (non-blocking)
  runCycle().catch(e => logger.error('[pipeline] First cycle error:', e.message));
  _intervalHandle = setInterval(() => {
    runCycle().catch(e => logger.error('[pipeline] Cycle error:', e.message));
  }, actual).unref();
  logger.log(`[pipeline] Scheduler started every ${Math.round(actual / 60000)}min`);
  return { status: 'started', interval_ms: actual, first_cycle: 'immediate' };
}

function stop() {
  if (_intervalHandle) {
    clearInterval(_intervalHandle);
    _intervalHandle = null;
  }
  _running = false;
  return { status: 'stopped', cycles_completed: _cycleCount };
}

function getStatus() {
  return {
    running: _running,
    interval_active: _intervalHandle !== null,
    cycles_completed: _cycleCount,
  };
}

module.exports = { start, stop, getStatus, runCycle };
