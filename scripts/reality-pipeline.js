// scripts/reality-pipeline.js — CLI entry for Reality Pipeline
// Usage: node scripts/reality-pipeline.js [--harvest-only] [--convert-only] [--adversarial-only] [--eval-only] [--quiet]

const pipeline = require('../lib/reality-pipeline');
const harvester = require('../lib/reality-harvester');
const converter = require('../lib/reality-to-eval');
const adversarial = require('../lib/adversarial-generator');
const evalHarness = require('../lib/eval-harness');

const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
const harvestOnly = args.includes('--harvest-only');
const convertOnly = args.includes('--convert-only');
const advOnly = args.includes('--adversarial-only');
const evalOnly = args.includes('--eval-only');

async function main() {
  if (evalOnly) {
    const report = evalHarness.runFullSuite();
    if (quiet) { console.log(JSON.stringify(report.summary)); }
    else { console.log('Eval run complete:', report.total_tasks, 'tasks,', report.summary.memory_effectiveness + '% effectiveness'); }
    return;
  }

  if (advOnly) {
    const result = adversarial.generateFullSet();
    const ingest = adversarial.ingestIntoGoldenSet();
    console.log('Adversarial:', result.total, 'generated,', ingest.ingested, 'ingested');
    console.log('By type:', JSON.stringify(result.by_type));
    return;
  }

  if (convertOnly) {
    const latest = harvester.loadLatestHarvest();
    if (!latest) { console.log('No harvest data. Run harvest first.'); process.exit(1); }
    const result = converter.convertHarvest(latest);
    console.log('Converted:', result.golden_tasks_created, 'golden tasks,', result.memory_seeds_created, 'memory seeds');
    return;
  }

  if (harvestOnly) {
    const result = await harvester.runHarvest();
    if (quiet) { console.log(JSON.stringify({ total: result.total, by_category: result.by_category, by_breakage: result.by_breakage })); }
    else { console.log('Harvested:', result.total, 'items from', Object.keys(result.by_category).length, 'categories'); }
    return;
  }

  // Full pipeline
  const result = await pipeline.runFullPipeline();
  if (quiet) {
    console.log(JSON.stringify(result.summary));
  } else {
    console.log('=== Reality Pipeline ===');
    console.log('Duration:', (result.duration_ms / 1000).toFixed(1) + 's');
    console.log('Harvest:', result.steps.harvest?.total || 0, 'items');
    console.log('Golden tasks added:', result.steps.convert?.golden_tasks_created || 0);
    console.log('Adversarial added:', result.steps.adversarial?.ingested_into_golden || 0);
    console.log('');
    console.log('Total tasks now:', result.summary.total_tasks_now);
    console.log('Solve rate:', result.summary.solve_rate_now + '%');
    if (result.delta) {
      console.log('Solve rate delta:', (result.delta.solve_rate_change > 0 ? '+' : '') + result.delta.solve_rate_change + '%');
    }
    if (result.errors) console.log('Errors:', result.errors);
  }
}

main().catch(e => { console.error('Pipeline error:', e.message); process.exit(1); });
