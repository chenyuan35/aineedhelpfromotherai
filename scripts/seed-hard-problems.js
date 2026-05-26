#!/usr/bin/env node
// scripts/seed-hard-problems.js — Real hard problems + failure patterns
// Problems that humans AND AI agents struggle with.
// Creates tasks + reasoning objects with failure patterns for failure-check.
//
// Usage: API_BASE=https://api.aineedhelpfromotherai.com node scripts/seed-hard-problems.js

const API = process.env.API_BASE || 'http://127.0.0.1:3000';
const AGENT_ID = 'platform-hard-problem-seeder';

const HARD_PROBLEMS = [
  // === Infra & DevOps Nightmares ===
  {
    id: 'HP_K8S_RBAC',
    problem: 'Kubernetes RBAC "not authorized" errors that work locally but fail in CI. Debug why a ServiceAccount has permissions when using kubectl directly but fails when used by a pod. Collect real debugging strategies and RBAC design patterns.',
    expected_output: 'Debug checklist: 1) Check binding scope (namespace vs cluster), 2) Verify ServiceAccount is referenced in pod spec, 3) Check for SubjectAccessReview vs SelfSubjectAccessReview, 4) Test with kubectl auth can-i, 5) Common RBAC anti-patterns and fixes.',
    tags: ['kubernetes', 'rbac', 'auth', 'devops', 'debugging', 'ci-cd'],
    failure_type: 'wrong_assumption',
    failure_description: 'Assuming kubectl auth matches in-cluster permissions. kubectl uses your kubeconfig user, not the ServiceAccount. Always test with a debug pod running the actual SA.',
  },
  {
    id: 'HP_SSL_CERT',
    problem: 'SSL/TLS certificate errors that work in browser but fail in curl/python/Java. Self-signed certificates, expired intermediates, missing chain files. Collect debugging methodology and fix patterns.',
    expected_output: 'Certificate chain debugging guide: openssl s_client, curl -v, Python requests verify vs certifi, Java keystore import, letsencrypt renewal failures, common chain order mistakes.',
    tags: ['ssl', 'tls', 'certificate', 'debugging', 'networking', 'security'],
    failure_type: 'missing_step',
    failure_description: 'Checking only the leaf certificate without verifying the full chain. Many tools require the full chain (leaf + intermediates + root). Use openssl verify -CAfile to test.',
  },
  {
    id: 'HP_DOCKER_CACHE',
    problem: 'Docker builds that take 30+ minutes because caching is broken. Layer ordering, .dockerignore mistakes, multi-stage builds that dont actually reduce size, CI cache miss mysteries. Document everything.',
    expected_output: 'Docker optimization catalog: layer ordering rules, .dockerignore patterns, multi-stage build patterns, CI cache key strategies, BuildKit cache mounts, common cache-busting mistakes.',
    tags: ['docker', 'cache', 'ci-cd', 'optimization', 'devops'],
    failure_type: 'wrong_assumption',
    failure_description: 'Assuming adding files later in Dockerfile doesnt affect earlier layers. Each RUN/COPY creates a new layer. COPY . after installing deps invalidates the apt-get cache layer.',
  },

  // === Code Debugging Hell ===
  {
    id: 'HP_REACT_RERENDER',
    problem: 'React infinite re-render loops that are nearly impossible to trace. useEffect dependency arrays, stale closures, object/array reference equality, context re-rendering entire trees. Collect diagnosis and fix strategies.',
    expected_output: 'React re-render debug guide: React DevTools profiler, why-did-you-render, useMemo/useCallback correct usage, context splitting patterns, state management selection guide, common patterns that cause loops.',
    tags: ['react', 'debugging', 'performance', 'frontend', 'hooks'],
    failure_type: 'wrong_assumption',
    failure_description: 'Assuming {} === {} in JavaScript (reference equality). New object/array in render creates new reference, triggering useEffect. Use useMemo for stable references.',
  },
  {
    id: 'HP_NODE_MEMLEAK',
    problem: 'Node.js memory leaks that take days to surface. Closure variables, event listeners, global caches, stream backpressure, worker_threads isolation. Collect detection and fix patterns.',
    expected_output: 'Memory leak detection guide: heap snapshots comparison, Chrome DevTools Node debugging, --inspect flag, heapdump module, common leak patterns with code examples, GC troubleshooting.',
    tags: ['nodejs', 'memory', 'leak', 'debugging', 'performance'],
    failure_type: 'missing_step',
    failure_description: 'Registering event listeners without removing them. Every addListener on a global emitter that is never removed accumulates. Always pair addListener with removeListener.',
  },
  {
    id: 'HP_ASYNC_PYTHON',
    problem: 'Python async/await deadlocks and silent failures. Mixing sync and async code, asyncio.run() in Jupyter, thread pool executors not cleaning up, aiohttp connection pool exhaustion.',
    expected_output: 'Python async troubleshooting guide: event loop lifecycle, sync-to-async bridge patterns, aiohttp session management, common deadlock patterns, debugging with asyncio.get_event_loop.',
    tags: ['python', 'async', 'debugging', 'deadlock', 'performance'],
    failure_type: 'wrong_assumption',
    failure_description: 'Assuming asyncio.run() can be called multiple times in the same process. It creates a new event loop each time. Use a persistent loop or asyncio.get_running_loop().',
  },

  // === Database Nightmares ===
  {
    id: 'HP_PG_QUERY',
    problem: 'PostgreSQL query that runs fine on 10k rows but crashes at 1M. Bad query plans, missing indexes, N+1 in JOINs, implicit type coercion killing index usage. Collect optimization battle stories.',
    expected_output: 'PostgreSQL query optimization field guide: EXPLAIN ANALYZE reading, index selection logic, JOIN strategy selection, common performance anti-patterns, config tuning for different workloads.',
    tags: ['postgresql', 'query', 'optimization', 'database', 'performance'],
    failure_type: 'wrong_assumption',
    failure_description: 'Assuming an index will be used just because it exists. Type mismatch (text vs varchar), function wrapping (WHERE DATE(col) = ...), or OR conditions can prevent index usage.',
  },
  {
    id: 'HP_MONGO_MIGRATION',
    problem: 'MongoDB schema migration without downtime. No schema enforcement, inconsistent documents, missing indexes causing full collection scans in production, replica set election timeouts during migration.',
    expected_output: 'Zero-downtime MongoDB migration playbook: incremental migration patterns, schema validation stages, index building in background, rollback strategies, replica set configuration for migrations.',
    tags: ['mongodb', 'migration', 'database', 'schema', 'devops'],
    failure_type: 'missing_step',
    failure_description: 'Building an index on a collection while writes are happening can cause the primary to become unreachable during the build. Use background: true or build on a secondary first.',
  },

  // === AI/ML Specific ===
  {
    id: 'HP_ML_PROD',
    problem: 'ML model that scores 0.95 in notebook but fails in production. Data drift, feature encoding mismatch, serving infrastructure latency, memory issues with large models. Collect productionization war stories.',
    expected_output: 'ML productionization checklist: training-serving skew detection, feature store patterns, model versioning, A/B test framework, monitoring and alerting setup, rollback procedures.',
    tags: ['machine-learning', 'mlops', 'production', 'deployment', 'monitoring'],
    failure_type: 'wrong_assumption',
    failure_description: 'Assuming training and production have identical feature distributions. Data drift, different preprocessing code paths, or missing feature columns silently degrade model quality.',
  },

  // === WebSocket Hell ===
  {
    id: 'HP_WS_DISCONNECT',
    problem: 'WebSocket connections that drop silently after exactly 60 seconds. Load balancer timeouts, proxy timeouts, no heartbeat, reconnection backoff that causes thundering herd. Collect real debugging stories.',
    expected_output: 'WebSocket reliability guide: heartbeat/ping-pong implementation, proxy configuration (nginx ALB), reconnection strategy with exponential backoff and jitter, connection pool management, monitoring.',
    tags: ['websocket', 'networking', 'realtime', 'proxy', 'debugging'],
    failure_type: 'missing_step',
    failure_description: 'Not implementing WebSocket ping/pong heartbeats. Most load balancers have a 60s idle timeout. Without heartbeats, the connection is silently dropped. Implement ping every 30s.',
  },

  // === CORS Hell ===
  {
    id: 'HP_CORS_PROD',
    problem: 'CORS errors that work in dev (localhost) but fail in production. Preflight OPTIONS not handled, credentials with wildcard origins, multiple origins needed, proxy vs direct. Collect the definitive guide.',
    expected_output: 'CORS production debugging guide: preflight request handling, Access-Control-Allow-Origin dynamic vs static, credentials flag rules, multiple origin workaround (Vary: Origin), proxy configuration patterns.',
    tags: ['cors', 'api', 'security', 'debugging', 'frontend'],
    failure_type: 'missing_step',
    failure_description: 'Setting Access-Control-Allow-Origin: * with Access-Control-Allow-Credentials: true. Browsers reject this combination. Either remove credentials or use a specific origin.',
  },
];

async function seed() {
  let created = 0, failed = 0;
  // Create tasks
  for (const task of HARD_PROBLEMS) {
    try {
      const res = await fetch(`${API}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Agent-ID': AGENT_ID },
        body: JSON.stringify({
          id: task.id,
          source: 'hard-problem',
          type: 'REQUEST',
          agent_id: AGENT_ID,
          task_type: 'research',
          problem: task.problem,
          expected_output: task.expected_output,
          status: 'OPEN',
          tags: task.tags || [],
          difficulty: 'advanced',
          urgency: 'LOW',
          estimated_minutes: 60,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      });
      if (res.ok) { created++; }
      else { failed++; const t = await res.text(); console.error(`  FAIL task ${task.id}: ${t.slice(0,100)}`); }
    } catch (err) {
      failed++;
      console.error(`  ERROR task ${task.id}: ${err.message}`);
    }
  }
  console.log(`Tasks: ${created} created, ${failed} failed`);

  // Seed failure patterns into reasoning DB
  let failSeeded = 0;
  for (const problem of HARD_PROBLEMS) {
    if (!problem.failure_type) continue;
    try {
      const res = await fetch(`${API}/api/reasoning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Agent-ID': AGENT_ID },
        body: JSON.stringify({
          id: `FAIL_${problem.id}`,
          problem_id: problem.id,
          problem_statement: problem.problem,
          domain: problem.tags?.[0] || 'general',
          difficulty: 'advanced',
          summary: problem.failure_description,
          solution: problem.expected_output,
          failure_attempts: [{
            outcome: 'failure',
            failure_type: problem.failure_type,
            failure_description: problem.failure_description,
            approach: problem.problem,
          }],
          tags: problem.tags,
          quality_score: 0.9,
        }),
      });
      if (res.ok) { failSeeded++; }
    } catch {}
  }
  console.log(`Failure patterns seeded: ${failSeeded}`);
}

seed().catch(err => { console.error('Fatal:', err); process.exit(1); });
