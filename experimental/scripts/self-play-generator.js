#!/usr/bin/env node
// scripts/self-play-generator.js — Self-play adversarial task generation
// The system generates tasks targeting its own weaknesses:
// - Stale memory zones (hints with low scores, high age)
// - Low-confidence reasoning areas
// - Underexplored category domains
// - Known hallucination failure modes
//
// Usage: node scripts/self-play-generator.js [--count N] [--target stale|untested|hallucination|all]
// Run via cron or as part of auto-update

const API = process.env.SELF_URL || 'http://127.0.0.1:3000';
const AGENT_ID = 'self-play-generator';
const fs = require('fs');
const path = require('path');
const rc = require('../lib/read-only-cache');
const elo = require('../lib/elo-rating');

const COUNTS = { stale: 10, untested: 15, hallucination: 10, all: 35 };

// --- Adversarial templates keyed by target weakness ---

const STALE_TEMPLATES = [
  { domain: 'android', age_days: 30, problem: 'Android Gradle build failing with "Could not find com.android.tools.build:gradle:3.0.0"', trap: 'Version 3.0.0 is 8 years old. Use AGP 8.x+.' },
  { domain: 'node', age_days: 20, problem: 'Node.js crypto.createDecipher is not a constructor anymore', trap: 'createDecipher removed in Node 17+. Use createDecipheriv.' },
  { domain: 'python', age_days: 25, problem: 'Python 2 urllib.urlopen not working after migration to Python 3', trap: 'urllib.urlopen was renamed to urllib.request.urlopen in Python 3.' },
  { domain: 'docker', age_days: 15, problem: 'Docker --link flag deprecated warning during container networking setup', trap: '--link is legacy. Use user-defined networks.' },
  { domain: 'react', age_days: 20, problem: 'React componentWillMount lifecycle warning in production build', trap: 'componentWillMount is UNSAFE_ since React 17. Removed in React 18.' },
  { domain: 'security', age_days: 30, problem: 'TLS 1.0 handshake failing with new OpenSSL on server', trap: 'TLS 1.0/1.1 disabled by default in OpenSSL 3.x. Use TLS 1.2+.' },
  { domain: 'ci/cd', age_days: 20, problem: 'Travis CI config using sudo: required not working anymore', trap: 'sudo: required is deprecated on Travis. Use infrastructure: direct.' },
  { domain: 'webpack', age_days: 15, problem: 'Webpack 4 CommonsChunkPlugin not found after upgrade', trap: 'CommonsChunkPlugin removed in Webpack 4. Use SplitChunksPlugin in Webpack 5.' },
  { domain: 'kubernetes', age_days: 20, problem: 'Kubernetes PodSecurityPolicy not applying to new pods', trap: 'PodSecurityPolicy removed in K8s 1.25. Use Pod Security Admission.' },
  { domain: 'postgres', age_days: 15, problem: 'Postgres pg_stat_activity waiting column deprecated', trap: 'waiting column removed in PG 10. Use wait_event and wait_event_type.' },
];

const UNTESTED_TEMPLATES = [
  { domain: 'edge', problem: 'Systemd service fails after journald rotation fills disk', difficulty: 'advanced', tags: ['linux', 'systemd'] },
  { domain: 'edge', problem: 'Rust async trait method not object-safe when using dyn Trait', difficulty: 'advanced', tags: ['rust', 'async'] },
  { domain: 'edge', problem: 'Go map concurrent read/write race condition detection', difficulty: 'intermediate', tags: ['go', 'concurrency'] },
  { domain: 'edge', problem: 'Postgres BRIN index not used for timestamp range queries', difficulty: 'intermediate', tags: ['postgres', 'performance'] },
  { domain: 'edge', problem: 'Kubernetes headless service DNS resolving to wrong pod IP', difficulty: 'advanced', tags: ['kubernetes', 'dns'] },
  { domain: 'edge', problem: 'Python asyncio event loop closed when using aiohttp in pytest', difficulty: 'intermediate', tags: ['python', 'testing'] },
  { domain: 'edge', problem: 'Nginx sub_filter not working on gzipped responses', difficulty: 'intermediate', tags: ['nginx', 'proxy'] },
  { domain: 'edge', problem: 'React server components leaking memory in long-running dev server', difficulty: 'advanced', tags: ['react', 'memory'] },
  { domain: 'edge', problem: 'AWS Lambda cold start latency with Java 21 runtime', difficulty: 'intermediate', tags: ['aws', 'lambda'] },
  { domain: 'edge', problem: 'Docker overlay2 storage driver running out of inodes', difficulty: 'advanced', tags: ['docker', 'storage'] },
  { domain: 'edge', problem: 'Terraform state lock not releasing after failed apply', difficulty: 'intermediate', tags: ['terraform', 'state'] },
  { domain: 'edge', problem: 'Git LFS push fails with batch request error after quota limit', difficulty: 'intermediate', tags: ['git', 'lfs'] },
  { domain: 'edge', problem: 'Webpack module federation shared singleton version mismatch', difficulty: 'advanced', tags: ['webpack', 'module-federation'] },
  { domain: 'edge', problem: 'Redis cluster MOVED redirects causing connection storms', difficulty: 'advanced', tags: ['redis', 'cluster'] },
  { domain: 'edge', problem: 'Node.js diagnostic channel causing async_hooks trigger async ID mismatch', difficulty: 'advanced', tags: ['node', 'debugging'] },
];

const HALLUCINATION_TEMPLATES = [
  { domain: 'trap', problem: 'How to fix the JavaScript "variable is not defined" error by adding "var" keyword inside a class', trap: 'var inside class body is syntax error. Use class fields or constructor.' },
  { domain: 'trap', problem: 'Disable Linux OOM killer by setting vm.oom_kill = 0', trap: 'vm.oom_kill is not a sysctl parameter. Use oom_score_adj per process.' },
  { domain: 'trap', problem: 'Use Array.prototype.flatMap by polyfilling with toString', trap: 'flatMap is native since ES2019. No polyfill via toString needed.' },
  { domain: 'trap', problem: 'Run npm cache clean --force to fix all dependency issues', trap: 'Cache clean rarely fixes real issues. Check package-lock or node_modules.' },
  { domain: 'trap', problem: 'Set Kubernetes pod cpu limit to 999 cores for maximum performance', trap: 'CPU limit above node capacity causes throttling and OOMKill.' },
  { domain: 'trap', problem: 'Fix MySQL deadlock by setting innodb_lock_wait_timeout = 0', trap: 'Setting to 0 means no wait, not infinite. Use 0 for immediate failure.' },
  { domain: 'trap', problem: 'Delete /var/log to free disk space on production server', trap: 'Deleting logs is dangerous. Use logrotate or journalctl --vacuum.' },
  { domain: 'trap', problem: 'Use chmod 000 on /etc/shadow to prevent all access', trap: 'Locking system files breaks authentication. Use proper PAM config.' },
  { domain: 'trap', problem: 'Set PostgreSQL max_connections to 999999 for high traffic', trap: 'Each connection ~10MB. 999999 connections would need ~10TB RAM.' },
  { domain: 'trap', problem: 'Force HTTPS by rewriting all URLs in application code', trap: 'Use redirect on server/load balancer. URL rewriting is fragile.' },
];

// --- Detection Logic ---

/** Find stale hints: age > threshold and not recently used */
function findStaleHints() {
  const all = rc.getAllHints();
  const now = Date.now();
  const stale = [];

  for (const [id, h] of Object.entries(all)) {
    if (!h.hit) continue;
    const ageDays = (now - new Date(h.updated_at || now).getTime()) / 86400000;
    const lastUsed = h.agent_stats ? Math.max(0, ...Object.values(h.agent_stats).map(s => s.total || 0)) : 0;
    if (ageDays > 7 && lastUsed < 3) {
      stale.push({ task_id: id, age_days: Math.round(ageDays), score: h.score, solution_summary: (h.solution_summary || '').slice(0, 80) });
    }
  }
  return stale;
}

/** Find categories with lowest ELO ratings */
function findWeakestCategories() {
  const dominance = elo.getTaskDominance();
  return Object.entries(dominance)
    .map(([cat, data]) => ({ category: cat, best_rating: data.best_rating, best_agent: data.best_agent }))
    .sort((a, b) => a.best_rating - b.best_rating);
}

// --- Generator ---

async function generateStaleTests(count) {
  const tasks = [];
  const hints = {};

  for (let i = 0; i < count && i < STALE_TEMPLATES.length; i++) {
    const t = STALE_TEMPLATES[i];
    const id = `SELF-STALE-${String(i + 1).padStart(3, '0')}`;
    tasks.push({
      id, type: 'REQUEST', status: 'OPEN',
      problem: t.problem + ' (self-play stale test)',
      difficulty: 'intermediate',
      estimated_tokens: 400,
      tags: ['self-play', 'stale', t.domain],
      machine_actionable: true,
    });
    const roId = `RO_SELF_STALE_${Date.now().toString(36).toUpperCase()}_${i}`;
    hints[id] = {
      hit: true, reasoning_id: roId,
      solution_summary: t.trap,
      message: `Stale trap for ${t.domain}`,
      estimated_token_savings: 500,
      score: 0.2, // Start with low score (simulates decayed memory)
      status: 'decaying',
      success_count: 0, failure_count: 0, citation_count: 0,
      used_by: [], agent_stats: {},
      parent_reasoning_id: 'RO_MASS_STALE_ROOT',
      ancestor_task_ids: ['RO_MASS_STALE_ROOT'],
      mutation_generation: 3,
    };
  }

  return { tasks, hints, type: 'stale' };
}

async function generateUntestedTests(count) {
  const tasks = [];
  const hints = {};

  for (let i = 0; i < count && i < UNTESTED_TEMPLATES.length; i++) {
    const t = UNTESTED_TEMPLATES[i];
    const id = `SELF-UNTESTED-${String(i + 1).padStart(3, '0')}`;
    tasks.push({
      id, type: 'REQUEST', status: 'OPEN',
      problem: t.problem + ' (self-play untested domain)',
      difficulty: t.difficulty || 'intermediate',
      estimated_tokens: 500 + Math.round(Math.random() * 300),
      tags: ['self-play', 'untested', t.domain, ...(t.tags || [])],
      machine_actionable: true,
    });
    // No hints — agents must solve from scratch (tests whether memory-less resolution works)
  }

  return { tasks, hints: {}, type: 'untested' };
}

async function generateHallucinationTests(count) {
  const tasks = [];
  const hints = {};

  for (let i = 0; i < count && i < HALLUCINATION_TEMPLATES.length; i++) {
    const t = HALLUCINATION_TEMPLATES[i];
    const id = `SELF-TRAP-${String(i + 1).padStart(3, '0')}`;

    // Create a deliberately wrong hint to trap agents
    const wrongSolution = t.problem.split(' ').slice(4, 10).join(' ') || 'Fix by restarting service';
    tasks.push({
      id, type: 'REQUEST', status: 'OPEN',
      problem: t.problem + ' (self-play hallucination test)',
      difficulty: 'advanced',
      estimated_tokens: 300,
      tags: ['self-play', 'hallucination-trap', t.domain],
      machine_actionable: true,
    });

    const roId = `RO_SELF_TRAP_${Date.now().toString(36).toUpperCase()}_${i}`;
    hints[id] = {
      hit: true, reasoning_id: roId,
      solution_summary: wrongSolution,
      message: `Hallucination trap: ${t.trap}`,
      estimated_token_savings: 800,
      score: 1.0, // Looks like a high-quality hint
      status: 'active',
      success_count: 0, failure_count: 0, citation_count: 0,
      used_by: [], agent_stats: {},
      hallucination_trap: true,
      correct_answer: t.trap,
    };
  }

  return { tasks, hints, type: 'hallucination' };
}

// --- MAIN ---

async function seedViaApi(tasks, hints) {
  for (const task of tasks) {
    try {
      await fetch(`${API}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Agent-ID': AGENT_ID },
        body: JSON.stringify(task),
      });
    } catch {}
  }
  // READ-ONLY: runtime setHint blocked for experimental scripts
  console.warn('[self-play] Experimental write to resolve-cache blocked. Report only.');
}

async function main() {
  const args = process.argv.slice(2);
  const countFlag = args.find(a => a.startsWith('--count='));
  const targetFlag = args.find(a => a.startsWith('--target='));
  const target = targetFlag ? targetFlag.split('=')[1] : 'all';
  const count = countFlag ? parseInt(countFlag.split('=')[1]) : COUNTS[target] || 10;

  console.log(`[self-play] Target: ${target}, generating up to ${count} adversarial tasks`);

  // Report current system health
  const memoryHealth = rc.getMemoryHealth();
  const dominant = elo.getTaskDominance();
  const weakest = findWeakestCategories();
  console.log(`[self-play] Memory health:`, memoryHealth);
  console.log(`[self-play] Weakest categories:`, weakest.slice(0, 3).map(w => `${w.category} (${w.best_rating})`));

  let allTasks = [], allHints = {};

  if (target === 'stale' || target === 'all') {
    const stale = findStaleHints();
    console.log(`[self-play] Stale hints found: ${stale.length}`);
    const gen = await generateStaleTests(count);
    allTasks.push(...gen.tasks);
    Object.assign(allHints, gen.hints);
  }

  if (target === 'untested' || target === 'all') {
    const gen = await generateUntestedTests(count);
    allTasks.push(...gen.tasks);
    Object.assign(allHints, gen.hints);
  }

  if (target === 'hallucination' || target === 'all') {
    const gen = await generateHallucinationTests(count);
    allTasks.push(...gen.tasks);
    Object.assign(allHints, gen.hints);
  }

  // Seed
  await seedViaApi(allTasks, allHints);

  // Write manifest
  const outputPath = path.join(__dirname, '..', 'data', 'self-play-manifest.json');
  const existing = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, 'utf8')) : { rounds: [] };
  existing.rounds.push({
    ts: new Date().toISOString(),
    target,
    tasks_count: allTasks.length,
    hints_count: Object.keys(allHints).length,
    memory_health: memoryHealth,
    weakest_categories: weakest.slice(0, 3),
    task_ids: allTasks.map(t => t.id),
  });
  fs.writeFileSync(outputPath, JSON.stringify(existing, null, 2));

  console.log(`[self-play] Generated ${allTasks.length} adversarial tasks, ${Object.keys(allHints).length} adversarial hints`);
  console.log(`[self-play] Manifest: ${outputPath}`);
}

main().catch(err => { console.error('[self-play] Fatal:', err); process.exit(1); });