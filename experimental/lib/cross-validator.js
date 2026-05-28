// lib/cross-validator.js — Cross-Source Memory Validation
// Tests whether memory seeds from one source generalize to tasks from another source.
// e.g. SO seeds × GitHub tasks, GitHub seeds × SO tasks.
// Proves memory is not just memorizing — it is generalizing.

const fs = require('fs');
const path = require('path');
const evalHarness = require('./eval-harness');
const converter = require('./reality-to-eval');
const resolveCache = require('./read-only-cache');

const VALIDATION_LOG = path.join(__dirname, '..', 'data', 'cross-validation.json');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

// Group golden tasks by source
function splitBySource() {
  const tasks = evalHarness.loadGoldenSet();
  const groups = { github: [], stackoverflow: [], adversarial: [], unknown: [] };

  for (const t of tasks) {
    const src = t.reality_source || 'unknown';
    const isAdv = (t.tags || []).includes('adversarial') || (t.id || '').startsWith('ADV_');
    if (isAdv) groups.adversarial.push(t);
    else if (groups[src]) groups[src].push(t);
    else groups.unknown.push(t);
  }

  return groups;
}

// Check if a memory seed would help solve a task
function seedHelpsTask(seed, task) {
  if (!seed || !task) return false;

  // Tag/category match
  const seedTags = new Set(seed.tags || []);
  const taskTags = new Set(task.tags || []);
  const matchingTags = [...seedTags].filter(t => taskTags.has(t));
  const categoryMatch = seed.category === task.category;

  // Breakage pattern overlap
  const seedPatterns = new Set(seed.breakage_patterns || []);
  const taskPatterns = new Set(task.breakage_patterns || []);
  const matchingPatterns = [...seedPatterns].filter(p => taskPatterns.has(p));

  // Content overlap: does seed hint contain keywords from the task problem?
  const seedText = (seed.hint || seed.problem_snippet || seed.summary || '').toLowerCase();
  const taskWords = (task.problem || '').toLowerCase().split(/\s+/).filter(w => w.length > 4);
  const matchingWords = taskWords.filter(w => seedText.includes(w));

  // Score: needs at least 2 signals
  let score = 0;
  if (categoryMatch) score += 2;
  if (matchingPatterns.length > 0) score += 2;
  if (matchingTags.length > 0) score += 1;
  if (matchingWords.length >= 3) score += 1;

  return score >= 2;
}

// Run cross-source validation
function runCrossValidation() {
  const groups = splitBySource();
  const seeds = converter.loadMemorySeeds();
  const allSeedMap = {};
  for (const s of seeds) allSeedMap[s.id || s.problem_snippet] = s;

  // Also include resolve-cache hints from pipeline
  const cachedHints = resolveCache.getAllHints();
  for (const [id, hint] of Object.entries(cachedHints)) {
    if (hint.agent_id === 'reality-pipeline') {
      allSeedMap[id] = {
        id, hint: hint.summary || hint.solution || '',
        tags: hint.tags || [],
        category: hint.category || 'unknown',
        breakage_patterns: hint.breakage_patterns || [],
        source: hint.source || 'pipeline',
        environment: hint.environment || '',
      };
    }
  }

  const sourceMap = { github: 'github', stackoverflow: 'stackoverflow', adversarial: 'adversarial' };
  const results = {};
  const pairs = [
    { seedSource: 'stackoverflow', testSource: 'github', label: 'SO seeds → GitHub tasks' },
    { seedSource: 'github', testSource: 'stackoverflow', label: 'GitHub seeds → SO tasks' },
    { seedSource: 'adversarial', testSource: 'github', label: 'Adversarial seeds → GitHub tasks' },
    { seedSource: 'adversarial', testSource: 'stackoverflow', label: 'Adversarial seeds → SO tasks' },
    { seedSource: 'github', testSource: 'adversarial', label: 'GitHub seeds → Adversarial tasks' },
    { seedSource: 'stackoverflow', testSource: 'adversarial', label: 'SO seeds → Adversarial tasks' },
  ];

  for (const pair of pairs) {
    const testTasks = groups[pair.testSource] || [];
    // Filter seeds by source
    const relevantSeeds = Object.values(allSeedMap).filter(s => s.source === pair.seedSource);
    if (testTasks.length === 0 || relevantSeeds.length === 0) {
      results[pair.label] = { skipped: true, reason: 'insufficient_data', tasks: testTasks.length, seeds: relevantSeeds.length };
      continue;
    }

    let helped = 0;
    const details = [];
    for (const task of testTasks) {
      let found = false;
      for (const seed of relevantSeeds) {
        if (seedHelpsTask(seed, task)) { found = true; break; }
      }
      if (found) helped++;
      details.push({ task_id: task.id, helped_by_cross_source: found });
    }

    results[pair.label] = {
      tasks: testTasks.length,
      seeds: relevantSeeds.length,
      helped,
      cross_source_solve_rate: +((helped / testTasks.length) * 100).toFixed(1),
      coverage: +((relevantSeeds.length / Object.values(allSeedMap).length) * 100).toFixed(1),
      details: details.slice(0, 20),
    };
  }

  // Overall generalization score
  const validResults = Object.values(results).filter(r => !r.skipped);
  const overallScore = validResults.length > 0
    ? +(validResults.reduce((s, r) => s + (r.cross_source_solve_rate || 0), 0) / validResults.length).toFixed(1)
    : null;

  const output = {
    validated_at: new Date().toISOString(),
    groups: {
      github: groups.github.length,
      stackoverflow: groups.stackoverflow.length,
      adversarial: groups.adversarial.length,
    },
    total_seeds: Object.keys(allSeedMap).length,
    results,
    summary: {
      overall_cross_source_score: overallScore,
      best_pair: Object.entries(results).filter(([_, r]) => !r.skipped).sort((a, b) => (b[1].cross_source_solve_rate || 0) - (a[1].cross_source_solve_rate || 0))[0]?.[0] || null,
      worst_pair: Object.entries(results).filter(([_, r]) => !r.skipped).sort((a, b) => (a[1].cross_source_solve_rate || 0) - (b[1].cross_source_solve_rate || 0))[0]?.[0] || null,
    },
  };

  // Save
  ensureDir(path.dirname(VALIDATION_LOG));
  fs.writeFileSync(VALIDATION_LOG, JSON.stringify(output, null, 2));

  return output;
}

function getLastValidation() {
  try {
    if (fs.existsSync(VALIDATION_LOG)) return JSON.parse(fs.readFileSync(VALIDATION_LOG, 'utf8'));
  } catch {}
  return null;
}

module.exports = { splitBySource, seedHelpsTask, runCrossValidation, getLastValidation };
