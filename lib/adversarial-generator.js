// lib/adversarial-generator.js — Automatic Adversarial Task Generation
// 6 types: hallucinated_flags, stale_docs, conflicting_memories,
//          poisoned_hints, partial_fixes, fake_answers
// Uses existing golden tasks as seed to produce adversarial variants.

const fs = require('fs');
const path = require('path');
const evalHarness = require('./eval-harness');

const GOLDEN_DIR = path.join(__dirname, '..', 'evals', 'golden');
const ADV_DIR = path.join(__dirname, '..', 'evals', 'adversarial');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

// --- Adversarial Type Templates ---

// 1. Hallucinated Flags: plausible but invalid CLI flags
function generateHallucinatedFlag(task) {
  const HALLUCINATED_FLAGS = {
    npm: [
      { flag: '--force-cache-reset', description: 'Force reset all caches' },
      { flag: '--skip-peer-deps-check', description: 'Skip peer dependency validation' },
      { flag: '--no-lockfile-verify', description: 'Skip lockfile integrity check' },
    ],
    docker: [
      { flag: '--cache-reset', description: 'Reset build cache entirely' },
      { flag: '--force-layer-rebuild', description: 'Force rebuild all layers' },
      { flag: '--skip-healthcheck', description: 'Skip health check during build' },
    ],
    pip: [
      { flag: '--force-reinstall-all', description: 'Force reinstall all dependencies' },
      { flag: '--no-deps-check', description: 'Skip dependency compatibility check' },
    ],
    default: [
      { flag: '--force-flag', description: 'Force the operation' },
      { flag: '--skip-validation', description: 'Skip all validation steps' },
    ],
  };

  const cat = task.category || 'default';
  const flags = HALLUCINATED_FLAGS[cat] || HALLUCINATED_FLAGS.default;
  const pick = flags[Math.floor(Math.random() * flags.length)];

  return {
    breakage_patterns: ['hallucinated_flag'],
    id: 'ADV_HALLUC_' + task.id,
    category: task.category,
    problem: task.problem + ` (attempted fix: ${pick.flag} "${pick.description}")`,
    expected_solution_keywords: ['--help', 'verify flag', 'documentation'],
    difficulty: 'beginner',
    tags: ['adversarial', 'hallucinated_flag', task.category],
    memory_hint: 'Do not use ' + pick.flag + '. It is a hallucinated flag. Use --help to verify.',
    failure_without_memory: 'Running `' + pick.flag + '` produces "unknown option" error, wasting time on wrong approach.',
    adversarial_type: 'hallucinated_flag',
    hallucinated_flag: pick.flag,
    generated_at: new Date().toISOString(),
    source_task_id: task.id,
  };
}

// 2. Stale Docs: deprecated API that looks correct
function generateStaleDoc(task) {
  const STALE_APIS = {
    npm: { old: 'npm config set registry', new: 'npmrc', hint: 'Use npmrc for registry config' },
    docker: { old: 'docker run --memory', new: 'docker run --memory-reservation', hint: 'Use --memory-reservation for resource limits' },
    pip: { old: 'pip install --no-use-wheel', new: 'pip install --no-binary', hint: 'Use --no-binary instead of the removed --no-use-wheel' },
  };
  const cat = task.category || 'default';
  const api = STALE_APIS[cat] || STALE_APIS.npm;

  return {
    breakage_patterns: ['deprecated_api'],
    id: 'ADV_STALE_' + task.id,
    category: task.category,
    problem: task.problem + ` (${api.old} is not working — it seems correct per old docs)`,
    expected_solution_keywords: ['deprecated', 'migration', api.new.split(' ')[0]],
    difficulty: 'intermediate',
    tags: ['adversarial', 'stale_docs', task.category],
    memory_hint: api.hint + '. The old syntax was removed.',
    failure_without_memory: `Keeps using ${api.old} which is deprecated. Endless debugging.`,
    adversarial_type: 'stale_docs',
    deprecated_api: api.old,
    replacement_api: api.new,
    generated_at: new Date().toISOString(),
    source_task_id: task.id,
  };
}

// 3. Conflicting Memories: two contradictory approaches
function generateConflictingMemory(task) {
  return {
    breakage_patterns: ['version_mismatch'],
    id: 'ADV_CONFLICT_' + task.id,
    category: task.category,
    problem: task.problem,
    expected_solution_keywords: ['choose correct', 'verify which', 'test both'],
    difficulty: 'advanced',
    tags: ['adversarial', 'conflicting_memories', task.category],
    memory_hint: 'Two solutions exist: (A) Delete everything and reinstall. (B) Apply targeted patch. Only one is correct. Choose carefully.',
    failure_without_memory: 'Applies both solutions, which conflict. System ends up in worse state.',
    adversarial_type: 'conflicting_memories',
    solution_a: 'Aggressive reset (' + (task.failure_without_memory || 'full cleanup') + ')',
    solution_b: 'Targeted fix (' + (task.memory_hint || 'precise patch') + ')',
    generated_at: new Date().toISOString(),
    source_task_id: task.id,
  };
}

// 4. Poisoned Hints: looks helpful but leads to wrong fix
// Uses task.memory_hint (the real fix) as "failure_without_memory" and invents a wrong fix as "memory_hint"
function generatePoisonedHint(task) {
  const realFix = task.memory_hint || task.expected_solution_keywords?.[0] || '';
  const wrongFix = 'I fixed this exact issue by ' + (
    task.failure_without_memory ? task.failure_without_memory.slice(0, 150) :
    'deleting everything and starting over. It is the only reliable approach.'
  );

  return {
    breakage_patterns: ['hallucinated_flag'],
    id: 'ADV_POISON_' + task.id,
    category: task.category,
    problem: task.problem,
    expected_solution_keywords: ['verify', 'check documentation', 'do not trust blindly'],
    difficulty: 'advanced',
    tags: ['adversarial', 'poisoned_hint', task.category, 'content_aware'],
    memory_hint: wrongFix,
    failure_without_memory: realFix || 'Correct approach',
    adversarial_type: 'poisoned_hint',
    poison: wrongFix.slice(0, 100),
    generated_at: new Date().toISOString(),
    source_task_id: task.id,
  };
}

// 5. Partial Fixes: addresses symptom not root cause
// Wraps the real fix as a "temporary" approach that masks the symptom
function generatePartialFix(task) {
  const realFix = task.memory_hint || task.expected_solution_keywords?.[0] || '';
  const partial = 'This is a known recurring issue. The temporary fix is: ' +
    (realFix.slice(0, 200) || 'restart the service') +
    '. This works for now but you will need to apply it again when the issue returns. ' +
    (task.failure_without_memory ? 'The root cause is ' + task.failure_without_memory.slice(0, 150) + '.' : '');

  return {
    breakage_patterns: ['config_error'],
    id: 'ADV_PARTIAL_' + task.id,
    category: task.category,
    problem: task.problem,
    expected_solution_keywords: ['root cause', 'fix permanently', 'not just symptom'],
    difficulty: 'intermediate',
    tags: ['adversarial', 'partial_fix', task.category, 'content_aware'],
    memory_hint: partial,
    failure_without_memory: 'Applies a workaround that works once. Error returns because root cause was not addressed: ' + (realFix.slice(0, 100) || 'unknown'),
    adversarial_type: 'partial_fix',
    partial_hint: partial.slice(0, 100),
    generated_at: new Date().toISOString(),
    source_task_id: task.id,
  };
}

// 6. Fake Answers: high-vote-but-wrong style
// Crafts a convincing-but-wrong answer using task content
function generateFakeAnswer(task) {
  const problem = task.problem || '';
  const realFix = task.memory_hint || task.expected_solution_keywords?.[0] || '';
  const fake = 'I hit this exact issue with ' +
    (problem.split('.').slice(0, 2).join('.') || task.category) +
    '. After extensive debugging, I found that the solution is NOT ' +
    (realFix.slice(0, 100) || 'what others suggest') +
    '. The real fix is to ' +
    (task.failure_without_memory ? task.failure_without_memory.slice(0, 150) : 'use a completely different approach that nobody has documented') +
    '. I verified this in production. Trust me on this.';

  return {
    breakage_patterns: ['hallucinated_flag'],
    id: 'ADV_FAKE_' + task.id,
    category: task.category,
    problem: task.problem,
    expected_solution_keywords: ['verify claim', 'cross-reference', 'do not trust single source'],
    difficulty: 'advanced',
    tags: ['adversarial', 'fake_answer', task.category, 'content_aware'],
    memory_hint: fake,
    failure_without_memory: 'Follows the fake advice and ends up needing to revert everything. Wastes hours. Correct approach was: ' + (realFix.slice(0, 100) || 'unknown'),
    adversarial_type: 'fake_answer',
    fake_advice: fake.slice(0, 100),
    generated_at: new Date().toISOString(),
    source_task_id: task.id,
  };
}

// --- Generator Registry ---
const GENERATORS = {
  hallucinated_flag: generateHallucinatedFlag,
  stale_docs: generateStaleDoc,
  conflicting_memories: generateConflictingMemory,
  poisoned_hint: generatePoisonedHint,
  partial_fix: generatePartialFix,
  fake_answer: generateFakeAnswer,
};

// Generate adversarial variants for a single golden task
function generateForTask(task, types = Object.keys(GENERATORS)) {
  return types.map(t => {
    try {
      const gen = GENERATORS[t];
      if (!gen) return null;
      const adv = gen(task);
      // Check if adversarial gold task already exists
      const fp = path.join(ADV_DIR, adv.id + '.json');
      if (fs.existsSync(fp)) return null;
      return adv;
    } catch { return null; }
  }).filter(Boolean);
}

// Generate adversarial variants for all golden tasks
function generateFullSet() {
  ensureDir(ADV_DIR);
  const tasks = evalHarness.loadGoldenSet();
  const allVariants = [];
  const byType = {};

  for (const task of tasks) {
    const variants = generateForTask(task);
    for (const v of variants) {
      const fp = path.join(ADV_DIR, v.id + '.json');
      fs.writeFileSync(fp, JSON.stringify(v, null, 2));
      allVariants.push(v);
      byType[v.adversarial_type] = (byType[v.adversarial_type] || 0) + 1;
    }
  }

  return {
    generated_at: new Date().toISOString(),
    total: allVariants.length,
    by_type: byType,
    variant_ids: allVariants.map(v => v.id),
  };
}

// Ingest adversarial golden tasks into the eval golden directory
function ingestIntoGoldenSet() {
  ensureDir(GOLDEN_DIR);
  if (!fs.existsSync(ADV_DIR)) return { ingested: 0 };
  let ingested = 0;
  const files = fs.readdirSync(ADV_DIR).filter(f => f.endsWith('.json'));
  for (const f of files) {
    try {
      const task = JSON.parse(fs.readFileSync(path.join(ADV_DIR, f), 'utf8'));
      const fp = path.join(GOLDEN_DIR, f);
      if (!fs.existsSync(fp)) {
        fs.writeFileSync(fp, JSON.stringify(task, null, 2));
        ingested++;
      }
    } catch {}
  }
  return { ingested, total_available: files.length };
}

function loadGeneratedAdversarial() {
  if (!fs.existsSync(ADV_DIR)) return [];
  return fs.readdirSync(ADV_DIR).filter(f => f.endsWith('.json')).map(f => {
    try { return JSON.parse(fs.readFileSync(path.join(ADV_DIR, f), 'utf8')); } catch { return null; }
  }).filter(Boolean);
}

module.exports = {
  generateHallucinatedFlag,
  generateStaleDoc,
  generateConflictingMemory,
  generatePoisonedHint,
  generatePartialFix,
  generateFakeAnswer,
  generateForTask,
  generateFullSet,
  ingestIntoGoldenSet,
  loadGeneratedAdversarial,
  GENERATORS,
  ADV_DIR,
};
