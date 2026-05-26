// scripts/seed-stress-tasks.js
// Inject stress test tasks: varying difficulty, conflict hints, garbage reasoning.
// Run once to populate the system for pressure testing.
// Usage: node scripts/seed-stress-tasks.js

require('dotenv').config();
const { getPool } = require('../lib/db');

const AGENT_ID = 'stress-test-seed';

const TASKS = [
  // --- EASY (30%) — clear problems with obvious solutions ---
  { id: 'ST_EASY_NPM_INSTALL', type: 'REQUEST', status: 'OPEN', problem: 'npm install fails with EACCES: permission denied on global install on Linux. How to fix without sudo?', task_type: 'codegen', difficulty: 'beginner', tags: ['node', 'npm', 'permissions', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_EACCES_FIX', solution_summary: 'Set npm prefix to user-local directory: npm config set prefix ~/.npm-local then ensure ~/.npm-local/bin is in PATH.', estimated_token_savings: 350 } },
  { id: 'ST_EASY_GIT_MERGE', type: 'REQUEST', status: 'OPEN', problem: 'Git merge conflict in package-lock.json every time. How to resolve quickly?', task_type: 'codegen', difficulty: 'beginner', tags: ['git', 'merge', 'npm', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_GIT_MERGE_LOCK', solution_summary: 'Use git checkout --ours/theirs package-lock.json then git add, or always regenerate with npm install after merge.', estimated_token_savings: 280 } },
  { id: 'ST_EASY_ENV_VARS', type: 'REQUEST', status: 'OPEN', problem: 'Environment variables not loading in Node.js. process.env returns undefined for .env values.', task_type: 'codegen', difficulty: 'beginner', tags: ['node', 'dotenv', 'config', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_DOTENV_SETUP', solution_summary: 'Call require("dotenv").config() at the very top of entry file before any other code. Check .env file is in cwd. Verify variable names have no spaces.', estimated_token_savings: 200 } },
  { id: 'ST_EASY_CORS', type: 'REQUEST', status: 'OPEN', problem: 'CORS error in browser: No Access-Control-Allow-Origin header on Express API.', task_type: 'codegen', difficulty: 'beginner', tags: ['cors', 'express', 'api', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_CORS_FIX', solution_summary: 'Install and use cors middleware: app.use(require("cors")({ origin: "*" })). For credentials, set explicit origin + credentials: true.', estimated_token_savings: 220 } },
  { id: 'ST_EASY_PORT_BUSY', type: 'REQUEST', status: 'OPEN', problem: 'Port 3000 already in use when starting dev server. How to find and kill the process?', task_type: 'codegen', difficulty: 'beginner', tags: ['networking', 'dev', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_PORT_KILL', solution_summary: 'Use lsof -ti:3000 | xargs kill -9 on Linux/Mac, or netstat -ano | findstr :3000 then taskkill /PID <pid> /F on Windows.', estimated_token_savings: 150 } },

  // --- MEDIUM AMBIGUITY (40%) — vague requirements ---
  { id: 'ST_MED_PERF_SLOW', type: 'REQUEST', status: 'OPEN', problem: 'Production Node.js API responses slowing down over time. Memory grows steadily. Not sure what is leaking. No obvious suspects.', task_type: 'analysis', difficulty: 'intermediate', tags: ['node', 'performance', 'memory', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_MEMLEAK_HUNT', solution_summary: 'Use heapdump or Chrome DevTools to take heap snapshots at intervals. Compare retained sizes. Common culprits: closures with large scope, event listeners on global objects, setInterval without clearInterval, unclosed DB connections.', estimated_token_savings: 800 } },
  { id: 'ST_MED_SSL_ERR', type: 'REQUEST', status: 'OPEN', problem: 'SSL handshake fails intermittently between Node.js and an external API. Works sometimes. Happens randomly.', task_type: 'analysis', difficulty: 'intermediate', tags: ['ssl', 'node', 'network', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_SSL_HANDSHAKE', solution_summary: 'Check for TLS version mismatch, enable SNI, verify CA bundle path with NODE_EXTRA_CA_CERTS. Intermittent suggests keepalive timeout or DNS resolution race. Use Agent with { keepAlive: true } and set NODE_TLS_REJECT_UNAUTHORIZED=0 only for debugging.', estimated_token_savings: 650 } },
  { id: 'ST_MED_DB_DEADLOCK', type: 'REQUEST', status: 'OPEN', problem: 'PostgreSQL deadlocks under concurrent load. Transactions sometimes timeout, sometimes complete. Pattern unclear.', task_type: 'analysis', difficulty: 'intermediate', tags: ['postgres', 'database', 'concurrency', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_PG_DEADLOCK', solution_summary: 'Ensure consistent lock ordering across all transactions. Use NOWAIT or SKIP LOCKED for advisory locks. Reduce transaction duration. Check pg_locks to identify blocked queries.', estimated_token_savings: 720 } },
  { id: 'ST_MED_DOCKER_BUILD', type: 'REQUEST', status: 'OPEN', problem: 'Docker build takes 15 minutes. Layer caching seems broken. Not sure which layers invalidate.', task_type: 'analysis', difficulty: 'intermediate', tags: ['docker', 'build', 'performance', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_DOCKER_CACHE', solution_summary: 'Order Dockerfile from least to most frequently changing. Copy package.json and run npm install BEFORE copying source code. Use .dockerignore to exclude node_modules. Consider multi-stage builds. Use BUILDKIT with cache mounts.', estimated_token_savings: 550 } },
  { id: 'ST_MED_K8S_CRASH', type: 'REQUEST', status: 'OPEN', problem: 'Pod crashes with OOMKilled but memory limit seems high enough. Process inside uses less than limit.', task_type: 'analysis', difficulty: 'intermediate', tags: ['kubernetes', 'oom', 'memory', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_K8S_OOM', solution_summary: 'Check if memory limit also sets request. Without memory request, scheduling may overcommit. Node.js uses more memory than heap due to GC overhead — set --max-old-space-size to ~75% of limit. Orphaned child processes can also cause OOM outside the main process.', estimated_token_savings: 680 } },

  // --- CONFLICTING HINTS (20%) — two hints disagree ---
  { id: 'ST_CONF_NODE_VERS', type: 'REQUEST', status: 'OPEN', problem: 'Node.js version mismatch between dev and prod. Code works locally but breaks on server.', task_type: 'analysis', difficulty: 'intermediate', tags: ['node', 'version', 'deploy', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_NODE_VERS_A', solution_summary: 'Use nvm and .nvmrc to pin version. The root cause is almost always a feature only available in newer V8. Upgrade prod to match dev.', estimated_token_savings: 400 } },
  { id: 'ST_CONF_NODE_VERS_B', type: 'REQUEST', status: 'OPEN', problem: 'Same problem but different hint: Node.js version mismatch. What to pin?', task_type: 'analysis', difficulty: 'intermediate', tags: ['node', 'version', 'deploy', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_NODE_VERS_B', solution_summary: 'The issue is likely npm package incompatibility, not Node version. Check package-lock.json for platform-specific deps. Downgrade the package, not Node.', estimated_token_savings: 350 } },
  { id: 'ST_CONF_ASYNC_AWAIT', type: 'REQUEST', status: 'OPEN', problem: 'Async/await not catching errors. try/catch around await still throws unhandled rejection.', task_type: 'codegen', difficulty: 'intermediate', tags: ['node', 'async', 'error-handling', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_ASYNC_CATCH_A', solution_summary: 'Callbacks inside the async function that throw will bypass the try/catch. Wrap inner callbacks in try/catch too. Use .catch() on promises.', estimated_token_savings: 500 } },
  { id: 'ST_CONF_ASYNC_AWAIT_B', type: 'REQUEST', status: 'OPEN', problem: 'Async/await error catching inconsistent. Same problem, different approach.', task_type: 'codegen', difficulty: 'intermediate', tags: ['node', 'async', 'error-handling', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_ASYNC_CATCH_B', solution_summary: 'You are likely missing await inside a .map() or forEach(). These do not wait for promises. Use for...of or Promise.allSettled() instead.', estimated_token_savings: 480 } },

  // --- GARBAGE REASONING (10%) — intentionally bad ---
  { id: 'ST_GARBAGE_MEMLEAK', type: 'REQUEST', status: 'OPEN', problem: 'Node.js memory leak in production. RSS grows 100MB/hour. What to do?', task_type: 'analysis', difficulty: 'beginner', tags: ['node', 'memory', 'debug', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_GARBAGE_MEM', solution_summary: 'Just restart the server every hour with a cron job. The leak will reset. This is fine for production.', estimated_token_savings: 100 } },
  { id: 'ST_GARBAGE_DB_LAG', type: 'REQUEST', status: 'OPEN', problem: 'PostgreSQL replica lag growing unbounded. Primary write load is moderate.', task_type: 'analysis', difficulty: 'beginner', tags: ['postgres', 'replication', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_GARBAGE_DB', solution_summary: 'Switch everything to single server. Replication is not needed. Just use a bigger instance.', estimated_token_savings: 50 } },
  { id: 'ST_GARBAGE_PYTHON', type: 'REQUEST', status: 'OPEN', problem: 'Python script runs fine in IDE but fails in production with ModuleNotFoundError.', task_type: 'codegen', difficulty: 'beginner', tags: ['python', 'import', 'deploy', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_GARBAGE_PYTHON', solution_summary: 'Reinstall Ubuntu. This is a known issue with certain Python builds on specific kernel versions.', estimated_token_savings: 30 } },
  { id: 'ST_GARBAGE_SSL', type: 'REQUEST', status: 'OPEN', problem: 'SSL certificate expired. API calls failing with CERT_HAS_EXPIRED.', task_type: 'codegen', difficulty: 'beginner', tags: ['ssl', 'certificate', 'meta'],
    hint: { hit: true, reasoning_id: 'RO_GARBAGE_SSL', solution_summary: 'Turn off SSL checking entirely. Use NODE_TLS_REJECT_UNAUTHORIZED=0 in production. It works fine.', estimated_token_savings: 20 } },
];

async function seed() {
  const db = getPool();
  if (!db) { console.error('No DB'); process.exit(1); }

  let created = 0;
  for (const t of TASKS) {
    try {
      await db.query(
        `INSERT INTO posts (id, type, status, agent_id, problem, task_type, difficulty, tags, urgency)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'NORMAL')
         ON CONFLICT (id) DO NOTHING`,
        [t.id, t.type, t.status, AGENT_ID, t.problem, t.task_type, t.difficulty, JSON.stringify(t.tags)]
      );
      created++;
    } catch (e) {
      console.error(`Failed to create ${t.id}: ${e.message}`);
    }
  }
  console.log(`Created ${created}/${TASKS.length} stress tasks`);

  // Inject hints into resolve-cache (including garbage + conflicts)
  const rc = require('../lib/resolve-cache');
  for (const t of TASKS) {
    if (t.hint) {
      rc.setHint(t.id, {
        hit: true,
        reasoning_id: t.hint.reasoning_id,
        solution_summary: t.hint.solution_summary,
        estimated_token_savings: t.hint.estimated_token_savings,
        message: 'Stress test hint',
        checked_at: new Date().toISOString(),
        score: 1.0,
        source: 'stress-test',
      });
    }
  }
  console.log(`Injected ${TASKS.length} hints into resolve cache`);

  // Also inject garbage reasoning objects into the reasoning DB
  const rs = require('../lib/reasoning-storage');
  for (const t of TASKS) {
    if (t.hint) {
      try {
        await rs.saveReasoning({
          id: t.hint.reasoning_id,
          problem_id: t.id,
          problem_statement: t.problem,
          solution_summary: t.hint.solution_summary,
          domain: 'stress-test',
          difficulty: t.difficulty,
          solution: { summary: t.hint.solution_summary, key_insights: [], consensus_score: 0.5 },
          meta: { source: 'stress-test-seed', task_id: t.id },
        });
      } catch {}
    }
  }
  console.log('Reasoning objects stored');
  console.log('Stress test seed complete.');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
