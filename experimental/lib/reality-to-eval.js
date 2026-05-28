// lib/reality-to-eval.js — Reality Task → Golden Task + Memory Seed Converter
// Converts harvested items into golden tasks and memory seeds.

const fs = require('fs');
const path = require('path');

const GOLDEN_DIR = path.join(__dirname, '..', 'evals', 'golden');
const MEMORY_SEED_PATH = path.join(__dirname, '..', 'data', 'memory-seeds.json');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

const CATEGORY_MAP = {
  docker: 'docker', npm: 'npm', pip: 'dependency', rust: 'rust',
  dependency: 'dependency', cli: 'cli', reliability: 'reliability',
  mcp: 'npm', cache: 'reliability', unknown: 'dependency',
};

function inferDifficulty(item) {
  if (item.difficulty === 'advanced') return 'advanced';
  if (item.difficulty === 'beginner') return 'beginner';
  const p = item.breakage_patterns || [];
  if (p.includes('version_mismatch') || p.includes('network_error') || p.includes('tls_error')) return 'advanced';
  if (p.includes('stale_cache') || p.includes('hallucinated_flag')) return 'beginner';
  if (p.includes('deprecated_api') || p.includes('lockfile_conflict')) return 'intermediate';
  return 'intermediate';
}

function generateMemoryHint(item) {
  const parts = [];
  if (item.title) parts.push(item.title);
  if (item.source === 'stackoverflow' && item.accepted_answer_body) {
    parts.push(item.accepted_answer_body.slice(0, 300));
  } else if (item.source === 'stackoverflow' && item.accepted_answer_id) {
    parts.push('StackOverflow accepted answer available at ' + item.source_url);
  }
  if (item.extract && item.extract.expected) {
    const s = item.extract.expected.replace(/^expected[:\s]*/i, '').trim().slice(0, 150);
    if (s) parts.push(s);
  }
  const HINTS = {
    stale_cache: 'Clear cache before debugging. Stale cache causes phantom errors.',
    hallucinated_flag: 'Verify flags against --help. Many flags are fake.',
    deprecated_api: 'Check latest docs. API may be removed.',
    lockfile_conflict: 'Delete lockfile + node_modules, reinstall fresh.',
    version_mismatch: 'Check peer dependency ranges.',
    missing_module: 'Install the missing package explicitly.',
    timeout: 'Increase timeout or reduce payload.',
    permission_error: 'Do not use sudo with npm.',
  };
  for (const bp of (item.breakage_patterns || [])) {
    if (HINTS[bp]) parts.push(HINTS[bp]);
  }
  return parts.length > 0 ? parts.join('. ').slice(0, 300) : '';
}

function generateFailure(item) {
  const parts = [];
  if (item.extract && item.extract.failed_attempts) parts.push(item.extract.failed_attempts.slice(0, 200));
  if (item.extract && item.extract.logs) parts.push(item.extract.logs.slice(0, 200));
  if (item.source === 'stackoverflow' && item.body) parts.push(item.body.slice(0, 300));
  return parts.length > 0 ? parts.join(' | ').slice(0, 300) : 'Unknown failure';
}

function buildKeywords(item) {
  const kw = new Set();
  const KM = {
    stale_cache: ['--no-cache', 'clean cache'], hallucinated_flag: ['--help', 'verify flags'],
    deprecated_api: ['migration guide', 'new API'], lockfile_conflict: ['rm -rf node_modules', 'clean install'],
    version_mismatch: ['update dependency', 'peer dependency'], missing_module: ['npm install', 'install missing'],
    timeout: ['increase timeout', 'retry'],
  };
  for (const bp of (item.breakage_patterns || [])) {
    if (KM[bp]) KM[bp].forEach(k => kw.add(k));
  }
  if (item.title) kw.add(item.title.split(':')[0] || item.title.split(' ').slice(0, 3).join(' '));
  return [...kw].slice(0, 5);
}

function buildTags(item) {
  const tags = new Set([...(item.tags || []).slice(0, 3), item.category || '']);
  if (item.source) tags.add('source:' + item.source);
  (item.breakage_patterns || []).slice(0, 2).forEach(p => tags.add(p));
  if (item.extract && item.extract.environment) tags.add('has:environment');
  if (item.extract && item.extract.logs) tags.add('has:logs');
  return [...tags].slice(0, 8);
}

function toGoldenTask(item) {
  const cat = CATEGORY_MAP[item.category] || 'dependency';
  const suffix = item.id ? item.id.split('_').pop() : Math.random().toString(36).slice(2, 8);
  const id = (cat + '-' + item.source + '-' + suffix).toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 60);
  return {
    id, source_url: item.source_url, source_harvest_id: item.id, category: cat,
    problem: ((item.title || '') + '. ' + ((item.extract && item.extract.problem) || item.raw_body || '')).slice(0, 500),
    expected_solution_keywords: buildKeywords(item),
    difficulty: inferDifficulty(item), tags: buildTags(item),
    memory_hint: generateMemoryHint(item),
    failure_without_memory: generateFailure(item),
    generated_at: new Date().toISOString(),
    reality_source: item.source, breakage_patterns: item.breakage_patterns || [],
    environment: (item.extract && item.extract.environment ? item.extract.environment.slice(0, 200) : ''),
  };
}

function existsInGolden(task) {
  if (!fs.existsSync(GOLDEN_DIR)) return false;
  const existing = fs.readdirSync(GOLDEN_DIR).filter(f => f.endsWith('.json')).map(f => {
    try { return JSON.parse(fs.readFileSync(path.join(GOLDEN_DIR, f), 'utf8')); } catch { return null; }
  }).filter(Boolean);
  return existing.some(e => e.source_url === task.source_url || (e.problem && task.problem && e.problem.slice(0, 100) === task.problem.slice(0, 100)));
}

function writeGoldenTask(task) {
  ensureDir(GOLDEN_DIR);
  const fp = path.join(GOLDEN_DIR, task.id + '.json');
  if (fs.existsSync(fp)) return false;
  fs.writeFileSync(fp, JSON.stringify(task, null, 2));
  return true;
}

function toMemorySeed(item) {
  return {
    id: 'MEM_SEED_' + item.id.split('_').pop(),
    source: item.source, source_url: item.source_url,
    problem_snippet: (item.title || (item.extract && item.extract.problem) || '').slice(0, 200),
    hint: generateMemoryHint(item),
    category: CATEGORY_MAP[item.category] || 'dependency',
    breakage_patterns: item.breakage_patterns || [],
    environment: (item.extract && item.extract.environment ? item.extract.environment.slice(0, 200) : ''),
    tags: buildTags(item),
    verification_tier: item.source === 'stackoverflow' ? 'community_sourced' : 'needs_verification',
    created_at: new Date().toISOString(),
  };
}

function convertHarvest(harvestData) {
  const items = harvestData.items || [];
  const goldenTasks = [];
  const memorySeeds = [];
  let skipped = 0;
  for (const item of items) {
    const task = toGoldenTask(item);
    if (existsInGolden(task)) { skipped++; continue; }
    if (writeGoldenTask(task)) goldenTasks.push(task);
    memorySeeds.push(toMemorySeed(item));
  }
  ensureDir(path.dirname(MEMORY_SEED_PATH));
  let existingSeeds = [];
  try {
    if (fs.existsSync(MEMORY_SEED_PATH)) existingSeeds = JSON.parse(fs.readFileSync(MEMORY_SEED_PATH, 'utf8'));
  } catch {}
  fs.writeFileSync(MEMORY_SEED_PATH, JSON.stringify([...existingSeeds, ...memorySeeds], null, 2));
  return {
    converted_at: new Date().toISOString(), total_input: items.length,
    golden_tasks_created: goldenTasks.length, memory_seeds_created: memorySeeds.length,
    skipped_duplicates: skipped, categories: [...new Set(goldenTasks.map(t => t.category))],
    golden_task_ids: goldenTasks.map(t => t.id),
  };
}

function loadMemorySeeds() {
  try { if (fs.existsSync(MEMORY_SEED_PATH)) return JSON.parse(fs.readFileSync(MEMORY_SEED_PATH, 'utf8')); } catch {}
  return [];
}

module.exports = { toGoldenTask, convertHarvest, loadMemorySeeds, writeGoldenTask, GOLDEN_DIR, MEMORY_SEED_PATH };
