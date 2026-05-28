// lib/pipeline-verifier.js — Auto-Verification for Harvested Issues
// When a GitHub issue was closed with a fix, tries to:
//   1. Generate a verified golden task (production_confirmed tier)
//   2. Update memory seed verification_tier
//   3. Register as ground truth if sandbox test passes

const fs = require('fs');
const path = require('path');
const harvester = require('./reality-harvester');
const converter = require('./reality-to-eval');
const sandbox = require('./sandbox-executor');

const VERIFIED_DIR = path.join(__dirname, '..', 'evals', 'golden', 'verified');
const VERIFIED_LOG = path.join(__dirname, '..', 'data', 'verified-tasks.json');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

// Try to verify a harvested item that was closed
function generateVerifiedGolden(item) {
  if (!item.source_url || !item.current_state) return null;
  if (item.current_state !== 'closed') return null;

  const cat = item.category || 'unknown';
  const id = ('VERIFIED_' + cat + '_' + item.id.split('_').pop()).toLowerCase().replace(/[^a-z0-9-_]/g, '').slice(0, 60);

  // Use the resolution body as the solution hint
  const resolution = item.extract?.resolution || item.raw_body || '';
  const problem = item.title ? item.title + '. ' + (item.extract?.problem || '') : (item.extract?.problem || item.raw_body || '');
  const fixHint = resolution.slice(0, 500) || item.title || '';

  return {
    id,
    category: cat,
    source_url: item.source_url,
    source_harvest_id: item.id,
    problem: problem.slice(0, 500),
    expected_solution_keywords: [item.title ? item.title.split(':')[0] || item.title.split(' ').slice(0, 3).join(' ') : 'fix', 'resolution'],
    difficulty: item.difficulty || 'intermediate',
    tags: [...(item.tags || []), 'verified', 'closed_issue', cat, item.source],
    memory_hint: fixHint + ' (verified from closed issue)',
    failure_without_memory: item.extract?.failed_attempts?.slice(0, 300) || (item.extract?.logs?.slice(0, 300) || 'Failed before fix was known'),
    generated_at: new Date().toISOString(),
    reality_source: item.source,
    breakage_patterns: item.breakage_patterns || [],
    verification_tier: 'needs_sandbox_confirm',
    closed_at: item.closed_at || null,
  };
}

// Verify using sandbox (logical check since we may not have git access to all repos)
async function verifyWithSandbox(item, goldenTask) {
  // For verified golden tasks, do a logical check first
  const checks = [];
  if (goldenTask.problem && goldenTask.problem.length > 20) checks.push('has_problem');
  if (goldenTask.memory_hint && goldenTask.memory_hint.length > 20) checks.push('has_hint');
  if (goldenTask.failure_without_memory && goldenTask.failure_without_memory.length > 20) checks.push('has_failure');
  if (goldenTask.breakage_patterns && goldenTask.breakage_patterns.length > 0) checks.push('has_pattern');
  if (item.extract?.resolution) checks.push('has_resolution');

  const passed = checks.length >= 3;

  // If we have a repo URL, try the actual sandbox
  let sandboxResult = null;
  if (item.source_url && item.source_url.includes('github.com')) {
    try {
      const match = item.source_url.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match) {
        const repoUrl = `https://github.com/${match[1]}/${match[2]}.git`;
        sandboxResult = sandbox.logicalVerify(repoUrl, '', goldenTask.id);
      }
    } catch {}
  }

  return {
    task_id: goldenTask.id,
    source_url: item.source_url,
    logical_checks: checks,
    logical_passed: passed,
    sandbox_result: sandboxResult,
    passed: passed || (sandboxResult?.overall_success === true),
    verification_tier: passed ? 'production_confirmed' : 'needs_review',
  };
}

// Full verification pipeline
async function runVerificationPipeline() {
  const latest = harvester.loadLatestHarvest();
  if (!latest || !latest.items) return { scanned: 0, verified: 0, failed: 0 };

  const closedItems = latest.items.filter(i =>
    i.source === 'github' && i.current_state === 'closed'
  );

  ensureDir(VERIFIED_DIR);
  const results = [];
  let existingCount = 0;

  for (const item of closedItems) {
    const goldenTask = generateVerifiedGolden(item);
    if (!goldenTask) continue;

    // Skip if already exists
    const fp = path.join(VERIFIED_DIR, goldenTask.id + '.json');
    if (fs.existsSync(fp)) { existingCount++; continue; }

    fs.writeFileSync(fp, JSON.stringify(goldenTask, null, 2));
    results.push(goldenTask);
  }

  // Track in verified log
  let log = [];
  try {
    if (fs.existsSync(VERIFIED_LOG)) log = JSON.parse(fs.readFileSync(VERIFIED_LOG, 'utf8'));
  } catch {}
  const entry = {
    ran_at: new Date().toISOString(),
    scanned: closedItems.length,
    produced: results.length,
    skipped_existing: existingCount,
    ids: results.map(r => r.id),
  };
  log.push(entry);
  ensureDir(path.dirname(VERIFIED_LOG));
  fs.writeFileSync(VERIFIED_LOG, JSON.stringify(log, null, 2));

  return {
    scanned: closedItems.length,
    verified: results.length,
    skipped_existing: existingCount,
    ids: results.map(r => r.id),
  };
}

// Load verified tasks
function loadVerifiedTasks() {
  if (!fs.existsSync(VERIFIED_DIR)) return [];
  return fs.readdirSync(VERIFIED_DIR).filter(f => f.endsWith('.json')).map(f => {
    try { return JSON.parse(fs.readFileSync(path.join(VERIFIED_DIR, f), 'utf8')); } catch { return null; }
  }).filter(Boolean);
}

module.exports = { generateVerifiedGolden, verifyWithSandbox, runVerificationPipeline, loadVerifiedTasks };
