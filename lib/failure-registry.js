// lib/failure-registry.js — Queryable Breakage Pattern Index
// Maps breakage patterns → golden tasks → memory seeds.
// Enables "what do we know about X?" queries at runtime.

const evalHarness = require('./eval-harness');
const adapter = require('./reality-to-eval');

// Known breakage patterns with descriptions
const PATTERN_CATALOG = {
  version_mismatch: {
    label: 'Version Mismatch',
    severity: 'high',
    description: 'Incompatible dependency versions causing runtime errors',
    common_fixes: ['Update peer dependency ranges', 'Use --legacy-peer-deps', 'Pin compatible versions'],
    agents_most_affected: ['npm install', 'pip install', 'cargo build'],
  },
  stale_cache: {
    label: 'Stale Cache',
    severity: 'medium',
    description: 'Build/package cache returns outdated results',
    common_fixes: ['Clear cache', 'Use --no-cache flags', 'Delete node_modules and reinstall'],
    agents_most_affected: ['docker build', 'npm install', 'pip install'],
  },
  hallucinated_flag: {
    label: 'Hallucinated CLI Flag',
    severity: 'medium',
    description: 'AI agent invents a CLI flag that does not exist',
    common_fixes: ['Check --help output', 'Verify flag in docs', 'Do not trust AI-generated flags'],
    agents_most_affected: ['All CLI tools', 'docker', 'npm', 'git'],
  },
  deprecated_api: {
    label: 'Deprecated API',
    severity: 'high',
    description: 'Using an API that was removed in a newer version',
    common_fixes: ['Check migration guides', 'Update to new API', 'Pin to compatible version'],
    agents_most_affected: ['npm packages', 'Docker SDK', 'Python packages'],
  },
  lockfile_conflict: {
    label: 'Lockfile Conflict',
    severity: 'medium',
    description: 'Package lockfile out of sync with manifest',
    common_fixes: ['Delete lockfile', 'Clean install', 'Regenerate lockfile'],
    agents_most_affected: ['npm', 'yarn', 'pip'],
  },
  missing_module: {
    label: 'Missing Module',
    severity: 'high',
    description: 'Required module/package not found',
    common_fixes: ['Install the package', 'Check devDependencies', 'Verify import path'],
    agents_most_affected: ['Node.js', 'Python', 'Docker'],
  },
  timeout: {
    label: 'Timeout',
    severity: 'medium',
    description: 'Operation timed out due to network or resource limits',
    common_fixes: ['Increase timeout', 'Reduce payload', 'Check network connectivity'],
    agents_most_affected: ['npm install', 'docker pull', 'API calls'],
  },
  permission_error: {
    label: 'Permission Error',
    severity: 'high',
    description: 'Missing permissions for file/network access',
    common_fixes: ['Do not use sudo', 'Use --prefix', 'Check file ownership'],
    agents_most_affected: ['npm install -g', 'docker', 'file operations'],
  },
  network_error: {
    label: 'Network Error',
    severity: 'medium',
    description: 'Network connectivity failure during operation',
    common_fixes: ['Check proxy settings', 'Retry with backoff', 'Verify DNS resolution'],
    agents_most_affected: ['npm', 'pip', 'docker', 'git'],
  },
  out_of_memory: {
    label: 'Out of Memory',
    severity: 'high',
    description: 'Process exceeded available memory',
    common_fixes: ['Increase memory limit', 'Reduce parallel operations', 'Optimize memory usage'],
    agents_most_affected: ['Node.js', 'Docker build', 'Python'],
  },
};

function buildIndex() {
  const goldenTasks = evalHarness.loadGoldenSet();
  const seeds = adapter.loadMemorySeeds();

  // Index: pattern → golden tasks
  const patternToTasks = {};
  const patternToSeeds = {};

  for (const task of goldenTasks) {
    const patterns = task.breakage_patterns || [];
    const cat = task.category || 'unknown';
    for (const p of patterns) {
      if (!patternToTasks[p]) patternToTasks[p] = [];
      patternToTasks[p].push({
        task_id: task.id,
        problem: (task.problem || '').slice(0, 200),
        category: task.category,
        difficulty: task.difficulty,
        has_memory: !!task.memory_hint,
      });
    }
    // Also index by category
    if (!patternToTasks['category:' + cat]) patternToTasks['category:' + cat] = [];
    patternToTasks['category:' + cat].push({
      task_id: task.id,
      problem: (task.problem || '').slice(0, 200),
      category: task.category,
      difficulty: task.difficulty,
    });
  }

  for (const seed of seeds) {
    const patterns = seed.breakage_patterns || [];
    for (const p of patterns) {
      if (!patternToSeeds[p]) patternToSeeds[p] = [];
      patternToSeeds[p].push({
        seed_id: seed.id,
        hint: (seed.hint || seed.problem_snippet || '').slice(0, 200),
        category: seed.category,
        verification_tier: seed.verification_tier,
      });
    }
  }

  return { patternToTasks, patternToSeeds };
}

// Query the registry
function query(queryStr) {
  const { patternToTasks, patternToSeeds } = buildIndex();
  const q = queryStr.toLowerCase().trim();

  // Direct pattern match
  if (patternToTasks[q]) {
    return {
      pattern: q,
      catalog_entry: PATTERN_CATALOG[q] || null,
      tasks: patternToTasks[q],
      seeds: patternToSeeds[q] || [],
      task_count: patternToTasks[q].length,
      seed_count: (patternToSeeds[q] || []).length,
    };
  }

  // Category query
  const catMatch = q.startsWith('category:');
  if (catMatch && patternToTasks[q]) {
    return {
      pattern: q,
      tasks: patternToTasks[q],
      task_count: patternToTasks[q].length,
    };
  }

  // Search across all patterns
  const results = [];
  for (const [pattern, tasks] of Object.entries(patternToTasks)) {
    if (pattern.includes(q) || q.includes(pattern)) {
      results.push({
        pattern,
        catalog_entry: PATTERN_CATALOG[pattern] || null,
        task_count: tasks.length,
        seed_count: (patternToSeeds[pattern] || []).length,
      });
    }
  }

  // Also search pattern labels
  for (const [key, entry] of Object.entries(PATTERN_CATALOG)) {
    if (entry.label.toLowerCase().includes(q) || entry.description.toLowerCase().includes(q)) {
      if (!results.find(r => r.pattern === key)) {
        results.push({
          pattern: key,
          catalog_entry: entry,
          task_count: (patternToTasks[key] || []).length,
          seed_count: (patternToSeeds[key] || []).length,
        });
      }
    }
  }

  return {
    query: q,
    results,
    total_matches: results.length,
  };
}

function getSummary() {
  const { patternToTasks, patternToSeeds } = buildIndex();
  const patterns = {};

  for (const [pattern, tasks] of Object.entries(patternToTasks)) {
    if (pattern.startsWith('category:')) continue;
    const catalog = PATTERN_CATALOG[pattern] || { label: pattern, severity: 'unknown' };
    patterns[pattern] = {
      label: catalog.label,
      severity: catalog.severity,
      task_count: tasks.length,
      seed_count: (patternToSeeds[pattern] || []).length,
      categories: [...new Set(tasks.map(t => t.category))],
      difficulties: [...new Set(tasks.map(t => t.difficulty))],
    };
  }

  const goldenTasks = evalHarness.loadGoldenSet();
  return {
    patterns,
    total_patterns: Object.keys(patterns).length,
    total_tasks: goldenTasks.length,
    by_severity: countBy(Object.values(patterns), 'severity'),
    by_category: countBy(goldenTasks, 'category'),
  };
}

function countBy(arr, key) {
  const counts = {};
  for (const item of arr) {
    const val = item[key] || 'unknown';
    counts[val] = (counts[val] || 0) + 1;
  }
  return counts;
}

module.exports = { query, getSummary, buildIndex, PATTERN_CATALOG };
