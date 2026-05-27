#!/usr/bin/env node
// scripts/ci-eval.js — CI Eval Gate entry point
// Usage:
//   node scripts/ci-eval.js                    # run evals + compare baseline
//   node scripts/ci-eval.js --baseline         # save new baseline
//   node scripts/ci-eval.js --baseline=v2.1    # save with label
//   node scripts/ci-eval.js --passk=5          # run pass^k reliability
//   node scripts/ci-eval.js --rss              # compute replay stability score
//   node scripts/ci-eval.js --quiet            # minimal output

const baseline = require('../lib/baseline-manager');
const replayStability = require('../lib/replay-stability');
const evalHarness = require('../lib/eval-harness');
const driftDetector = require('../lib/drift-detector');

const args = process.argv.slice(2);
const isBaseline = args.some(a => a.startsWith('--baseline'));
const baselineLabel = args.find(a => a.startsWith('--baseline='))?.split('=')[1] || null;
const passkArg = args.find(a => a.startsWith('--passk='));
const passk = passkArg ? parseInt(passkArg.split('=')[1], 10) : 0;
const runRSS = args.includes('--rss');
const quiet = args.includes('--quiet');

async function main() {
  const startTime = Date.now();

  if (!quiet) {
    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log('║     AI Arena — CI Eval Gate              ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log('');
  }

  // Phase 1: Run golden eval suite
  if (!quiet) console.log('▶ Running golden eval suite...');
  const report = evalHarness.runFullSuite();
  if (!quiet) {
    console.log(`  Tasks: ${report.total_tasks}`);
    console.log(`  Memory effectiveness: ${report.summary.memory_effectiveness}%`);
    console.log(`  Helped: ${report.summary.memory_helped} | Hurt: ${report.summary.memory_hurt}`);
  }

  // Run drift detection
  const drift = driftDetector.checkDrift();

  // Phase 2: Baseline handling
  let comparison = null;
  if (isBaseline) {
    // Save as baseline and exit
    baseline.saveBaseline(report, baselineLabel || 'manual');
    if (!quiet) console.log(`\n✓ Baseline saved (${baselineLabel || 'manual'})`);
    printResults(report, null, drift, null, null, startTime, quiet);
    process.exit(0);
  } else {
    // Compare against latest baseline
    const latest = baseline.loadLatestBaseline();
    if (latest) {
      comparison = baseline.compareAgainstBaseline(report, latest);
      if (comparison.passed) {
        if (!quiet) console.log(`\n✓ No regressions against baseline`);
      } else {
        console.log(`\n✗ REGRESSIONS DETECTED:`);
        for (const f of comparison.failures) console.log(`  • ${f}`);
      }
    } else {
      if (!quiet) console.log(`\nℹ No baseline found — run with --baseline to establish one`);
      comparison = { passed: true, failures: [], metrics: { note: 'no_baseline' } };
    }
  }

  // Phase 3: pass^k reliability
  let passkResult = null;
  if (passk > 1) {
    if (!quiet) console.log(`\n▶ Running pass^${passk} reliability...`);
    passkResult = baseline.runPassK(passk);
    if (!quiet) {
      console.log(`  Stability: ${(passkResult.stability * 100).toFixed(1)}%`);
      console.log(`  Dominant outcome: ${passkResult.dominant_outcome}`);
    }
    if (passkResult.stability < baseline.THRESHOLDS.min_replay_stability) {
      console.log(`  ✗ Below threshold ${(baseline.THRESHOLDS.min_replay_stability * 100).toFixed(1)}%`);
    }
  }

  // Phase 4: RSS
  let rssResult = null;
  if (runRSS) {
    if (!quiet) console.log(`\n▶ Computing Replay Stability Score...`);
    rssResult = replayStability.computeGlobalRSS();
    if (!quiet) {
      console.log(`  Global RSS: ${rssResult.global_rss}`);
      console.log(`  Tasks below 0.95: ${rssResult.tasks_below_threshold}/${rssResult.tasks_tested}`);
    }
  }

  // Print final results
  printResults(report, comparison, drift, passkResult, rssResult, startTime, quiet);

  // Exit code
  if (comparison && !comparison.passed) process.exit(1);
  if (passkResult && passkResult.stability < baseline.THRESHOLDS.min_replay_stability) process.exit(1);
  process.exit(0);
}

function printResults(report, comparison, drift, passkResult, rssResult, startTime, quiet) {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  if (quiet) {
    const result = {
      elapsed_seconds: parseFloat(elapsed),
      total_tasks: report.total_tasks,
      memory_effectiveness: report.summary.memory_effectiveness,
      regressions: comparison ? comparison.failures : [],
      passk: passkResult ? { stability: passkResult.stability, k: passkResult.k } : null,
      rss: rssResult ? { global: rssResult.global_rss, below_threshold: rssResult.tasks_below_threshold } : null,
      drift_regressions: drift.pattern_regressions.length,
    };
    console.log(JSON.stringify(result));
    return;
  }

  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║     CI EVAL GATE RESULTS                 ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
  console.log(`  Solve Rate Delta:     ${report.summary.memory_effectiveness}%`);
  console.log(`  Hallucination Δ:      ${drift.pattern_regressions.filter(r => r.type === 'memory_increases_hallucination').length} regressions`);
  console.log(`  Replay Stability:     ${passkResult ? `${(passkResult.stability * 100).toFixed(1)}%` : 'N/A'}`);
  console.log(`  Regression Count:     ${comparison ? comparison.failures.length : 0}`);
  console.log(`  Drift Patterns:       ${drift.pattern_regressions.length} flagged`);
  console.log(`  RSS:                  ${rssResult ? rssResult.global_rss : 'N/A'}`);
  console.log(`  Gate:                 ${!comparison ? '— SKIP (no comparison)' : comparison.passed ? '✓ PASS' : '✗ BLOCK'}`);
  console.log(`  Elapsed:              ${elapsed}s`);
  console.log('');
}

main().catch(err => {
  console.error('[ci-eval] Fatal:', err.message);
  process.exit(1);
});
