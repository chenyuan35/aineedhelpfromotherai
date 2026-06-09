#!/usr/bin/env node
// scripts/run-lib.js — dispatch table for one-liner lib invocations
// Replaces the inline `node -e "..."` scripts that were quote-escape hell
// and shell-incompatible on Windows.
//
// Usage: node scripts/run-lib.js <command> [args...]

const commands = {
  'pipeline:cycle': async () => {
    const r = await require('../lib/pipeline-scheduler').runCycle();
    console.log(JSON.stringify(r, null, 2));
  },
  'pipeline:verify': async () => {
    const r = await require('../lib/pipeline-verifier').runVerificationPipeline();
    console.log(JSON.stringify(r, null, 2));
  },
  'pipeline:validate': () => {
    console.log(JSON.stringify(require('../lib/cross-validator').runCrossValidation(), null, 2));
  },
  'pipeline:feedback': () => {
    console.log(JSON.stringify(require('../lib/feedback-loop').runBatch(), null, 2));
  },
  'pipeline:remediate': () => {
    console.log(JSON.stringify(require('../lib/drift-remediation').runRemediation(), null, 2));
  },
  'pipeline:llm-eval': async () => {
    const r = await require('../lib/llm-eval').runFullSuite();
    console.log(JSON.stringify(r.summary, null, 2));
  },
  'patterns': () => {
    const f = require('../lib/failure-registry');
    const q = process.argv[3];
    console.log(JSON.stringify(q ? f.query(q) : f.getSummary(), null, 2));
  },
  'solve': () => {
    const e = require('../lib/environment-api');
    const problem = process.argv[3] || '';
    const environment = process.argv[4] || '';
    console.log(JSON.stringify(e.query({ problem, environment, limit: 5 }), null, 2));
  },
  'seeds:inject': () => {
    console.log(JSON.stringify(require('../lib/memory-seed-injector').injectAllSeeds(), null, 2));
  },
};

const cmd = process.argv[2];
if (!cmd || !commands[cmd]) {
  console.error('Unknown command:', cmd);
  console.error('Available:', Object.keys(commands).join(', '));
  process.exit(1);
}

Promise.resolve(commands[cmd]()).catch((err) => {
  console.error(err);
  process.exit(1);
});
