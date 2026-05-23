const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

function ro(problem, solution, opts = {}) {
  const slug = problem.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40);
  const id = `RO_${slug.toUpperCase()}_${Date.now().toString(36).toUpperCase().slice(0, 4)}`;
  const problemId = `PROB_${uuidv4().slice(0, 8)}`;
  return {
    id: opts.id || id,
    problem_id: opts.problem_id || problemId,
    problem_statement: problem,
    context: {
      domain: opts.domain || 'general',
      difficulty: opts.difficulty || 'intermediate',
      required_capabilities: opts.capabilities || [],
      tags: opts.tags || []
    },
    solution: {
      summary: solution,
      key_insights: opts.insights || [],
      consensus_score: opts.consensus || 0.85,
      reusability: opts.reusability || 'high'
    },
    meta: {
      success_rate: opts.successRate || 0.85,
      total_attempts: opts.attempts || 3,
      total_tokens: opts.tokens || 1500,
      tags: opts.tags || []
    },
    attempts: opts.failures ? opts.failures.map(f => ({
      agent_id: 'seed-agent',
      approach: f.approach || 'initial attempt',
      outcome: 'failure',
      failure_type: f.type || 'unknown',
      failure_description: f.description || '',
      execution_cost: { tokens_used: 500 }
    })) : []
  };
}

module.exports = [
  // === API / Backend (10) ===
  ro(
    'How to implement GraphQL resolvers with DataLoader for N+1 problem',
    'Use DataLoader to batch and cache database queries per request cycle. Each resolver returns a DataLoader instance that defers loading and batches keys. On first .load(), collect all keys across the request, then execute a single batched query. Cache per request prevents duplicate loads.',
    { domain: 'code', difficulty: 'intermediate', tags: ['graphql', 'dataloader', 'n+1', 'performance', 'api'], insights: ['DataLoader batches per event-loop tick', 'Cache per request, not global', 'Works with any database driver', 'Combine with query complexity analysis for production'] }
  ),
  ro(
    'How to implement cursor-based pagination in REST APIs',
    'Use cursor-based (keyset) pagination with a sort field (created_at, id) as opaque cursor. Return next_cursor in response. Client includes cursor in next request. Never use offset pagination for large datasets — it\'s O(n) on offset. Cursor pagination is O(log n) with proper indexing.',
    { domain: 'code', difficulty: 'intermediate', tags: ['api', 'pagination', 'cursor', 'rest', 'performance', 'database'], insights: ['Cursor based on indexed column', 'Return next_cursor even if no more results (null)', 'Base64 encode cursor to hide implementation', 'Support sort=asc and sort=desc', 'Add total_count header for UX'] }
  ),
  ro(
    'How to implement idempotency keys for payment APIs',
    'Accept Idempotency-Key header on POST/PATCH. On first request, store key+request+response in DB with TTL (24h). On duplicate key, return stored response. Use unique constraint on idempotency_key + resource_type. Handle concurrent requests with optimistic locking or advisory lock.',
    { domain: 'code', difficulty: 'advanced', tags: ['api', 'idempotency', 'payments', 'reliability', 'safety'], insights: ['Use deterministic key generation client-side', 'Store full response for replay', 'TTL on stored keys (24h default)', 'Lock on key, not resource', 'Log all idempotency replays for audit'] }
  ),
  ro(
    'How to implement webhook retry with exponential backoff',
    'Store webhook deliveries in queue with retry_count. On failure, schedule retry at: 10s, 30s, 90s, 5m, 15m, 1h, 6h. After 7 failures mark as dead and alert. Use separate worker pool for retries. Include Idempotency-Key header for safe retries on receiver side.',
    { domain: 'devops', difficulty: 'intermediate', tags: ['webhook', 'retry', 'backoff', 'reliability', 'events'], insights: ['Jitter avoids thundering herd', 'Dead letter queue after max retries', 'Monitor dead letter rate for upstream health', 'Idempotency key on webhook payloads', 'Webhook secret for HMAC verification'] }
  ),
  ro(
    'How to validate API request inputs in Node.js',
    'Use a schema validation library (Zod, Joi, Yup) to define input schemas. Validate at middleware level, not in route handlers. Return structured errors: field, message, code. Strip unknown fields. Catch type coercion issues early. Sanitize strings (trim, escape). Validate file uploads separately.',
    { domain: 'code', difficulty: 'beginner', tags: ['api', 'validation', 'zod', 'middleware', 'security'], insights: ['Validate at middleware, not handler', 'Return field-level error messages', 'Strip unknown fields to avoid mass assignment', 'Use strict mode to catch all errors at once', 'Validate before authentication to avoid processing bad input'] }
  ),
  ro(
    'How to implement rate limiting for API endpoints',
    'Use sliding window log algorithm stored in Redis. Each request adds timestamp to sorted set of user key. Count requests in window (1s/1m/1h). Reject with 429 if exceeded. Return Retry-After header. Allow per-endpoint limits. Use X-Forwarded-For for IP in proxy setups.',
    { domain: 'code', difficulty: 'intermediate', tags: ['api', 'rate-limit', 'redis', 'security', 'performance'], insights: ['Sliding window more accurate than fixed window', 'Redis Sorted Set with TTL auto-cleanup', 'Rate limit by IP and by API key separately', 'Return Retry-After + X-RateLimit-* headers', 'Graceful degradation: skip rate limit on Redis failure'] }
  ),
  ro(
    'How to implement server-sent events (SSE) for real-time updates',
    'Set Content-Type: text/event-stream and Cache-Control: no-cache. Keep connection open, send "data: <json>\\n\\n" messages. Support Last-Event-ID for reconnection. Use heartbeat to detect dropped connections. For scale, use a pub/sub backend (Redis) between producers and SSE workers.',
    { domain: 'code', difficulty: 'intermediate', tags: ['sse', 'realtime', 'events', 'api', 'streaming'], insights: ['SSE is simpler than WebSocket for server-to-client only', 'Auto-reconnect built into EventSource API', 'Heartbeat every 30s to detect disconnection', 'Redis pub/sub scales across multiple workers', 'Group connections by user ID for targeted events'] }
  ),
  ro(
    'How to design a URL shortener service',
    'Base62 encode auto-increment ID or use hash of URL (MD5/CRC32). Store mapping in DB with short_code -> long_url. Handle collisions. Redirect 301 for permanent, 302 for analytics. Cache hot short codes in Redis. Implement click tracking asynchronously (queue).',
    { domain: 'code', difficulty: 'beginner', tags: ['system-design', 'url-shortener', 'api', 'database', 'cache'], insights: ['Base62 with auto-increment avoids collisions', 'Use 301 for permanent redirects, 302 for analytics', 'Cache hot URLs in Redis (LRU eviction)', 'Async click tracking via message queue', 'Add custom slug option for premium users'] }
  ),
  ro(
    'How to implement API versioning strategies',
    'Prefer URL path versioning (/v1/, /v2/) for simplicity and cacheability. Maintain backward compatibility for at least 1 version back. Use Accept-Version header for internal services. Document deprecation timeline. Run old + new concurrently during migration. Use API gateway for version routing.',
    { domain: 'code', difficulty: 'intermediate', tags: ['api', 'versioning', 'rest', 'migration', 'backward-compatibility'], insights: ['URL path versioning is clearest for clients', 'Support old version for set deprecation period', 'Document breaking changes and migration guide', 'Internal services: header-based versioning', 'API gateway can route to different backends per version'] }
  ),
  ro(
    'How to implement request logging and tracing in Express',
    'Use middleware to generate unique request ID (uuid). Log structured JSON: method, path, status, duration, request_id, user_id, ip, user_agent. Include tracing headers (x-request-id, x-trace-id) in responses. Use async hooks (AsyncLocalStorage) for context propagation. Correlation ID across microservices.',
    { domain: 'code', difficulty: 'beginner', tags: ['logging', 'tracing', 'express', 'observability', 'middleware'], insights: ['Generate request ID at ingress, propagate everywhere', 'Structured JSON logs for machine parsing', 'AsyncLocalStorage for context propagation without passing req', 'Log slow requests (>1s) as warnings', 'Include trace ID in error responses for user reporting'] }
  ),

  // === Security (6) ===
  ro(
    'How to prevent Cross-Site Request Forgery (CSRF)',
    'Use CSRF tokens: server generates token embedded in forms/headers, validates on state-changing requests. SameSite=Strict/Lax cookie attribute provides browser-level protection. Use Origin/Referer header validation as defense in depth. For SPAs, use double-submit cookie pattern.',
    { domain: 'security', difficulty: 'intermediate', tags: ['csrf', 'security', 'cookies', 'samesite', 'web'], insights: ['SameSite=Lax covers most cases', 'CSRF token for legacy compatibility', 'Origin header validation is robust defense', 'Never use GET for state-changing operations', 'Double-submit cookie works for SPAs without server state'] }
  ),
  ro(
    'How to implement Content Security Policy (CSP) headers',
    'Set Content-Security-Policy header with directives: default-src \'self\', script-src, style-src, img-src, connect-src, frame-src. Use nonce or hash for inline scripts. Start with Content-Security-Policy-Report-Only mode. Monitor reports via reporting endpoint. Avoid \'unsafe-inline\' and \'unsafe-eval\'.',
    { domain: 'security', difficulty: 'intermediate', tags: ['csp', 'security', 'headers', 'xss', 'web'], insights: ['Start with Report-Only mode to monitor', 'Use nonce for inline scripts in SSR', 'Strict CSP prevents most XSS vectors', 'Monitor CSP violation reports', 'CSP eval() blocks eval(), Function(), setTimeout(string)'] }
  ),
  ro(
    'How to implement Role-Based Access Control (RBAC)',
    'Define roles with permissions mapping. Assign roles to users. Middleware checks required permission for each route. Use boolean logic: user.roles.flatMap(r => r.permissions).includes(required). Cache role-permission mapping. Allow multiple roles per user with hierarchy.',
    { domain: 'security', difficulty: 'intermediate', tags: ['rbac', 'authorization', 'security', 'access-control', 'middleware'], insights: ['Flat permissions list for O(1) check', 'Cache role->permissions mapping', 'Deny by default, grant explicitly', 'Support role hierarchy (admin > editor > viewer)', 'Audit log all authorization failures'] }
  ),
  ro(
    'How to implement API key rotation without downtime',
    'Issue two keys per client: primary (active) and secondary (rotating). Client uses primary. When rotating, generate new key, set as secondary, announce to client. Client starts using new key. After grace period, promote secondary to primary, deactivate old primary. Store hashed keys in DB (bcrypt).',
    { domain: 'security', difficulty: 'advanced', tags: ['api-keys', 'rotation', 'security', 'authentication', 'zero-downtime'], insights: ['Dual-key approach eliminates rotation downtime', 'Hash stored keys, never store plaintext', 'Include key prefix for identifying key type', 'Grace period of 24-72h during rotation', 'Log all key usage for audit trail'] }
  ),
  ro(
    'How to prevent Server-Side Request Forgery (SSRF)',
    'Maintain allowlist of permitted outbound hosts/IPs. Never use user input to construct URLs directly. Validate and sanitize URLs against allowlist. Use separate HTTP client with restricted DNS resolution. Block metadata IPs (169.254.169.254, 100.100.100.200). Disable redirect following for internal endpoints.',
    { domain: 'security', difficulty: 'advanced', tags: ['ssrf', 'security', 'network', 'input-validation', 'cloud'], insights: ['Allowlist approach, not denylist', 'Block cloud metadata IPs at network layer', 'Use URL parser to normalize before validation', 'Disable HTTP redirects for internal requests', 'Run external fetch in isolated process/sandbox'] }
  ),
  ro(
    'How to implement secure file upload handling',
    'Validate file type by magic bytes (not extension), limit file size, scan with antivirus, store outside webroot with random filename. Serve via authenticated endpoint with Content-Disposition. Resize images server-side. Set per-directory execute=false in nginx. Never trust user-provided filenames.',
    { domain: 'security', difficulty: 'intermediate', tags: ['file-upload', 'security', 'validation', 'web'], insights: ['Check magic bytes, not extension', 'Store outside webroot', 'Random filenames prevent path traversal', 'Serve via authenticated handler, not direct URL', 'Limit file size before processing'] }
  ),

  // === DevOps / Infrastructure (8) ===
  ro(
    'How to manage Terraform state remotely with locking',
    'Use S3/GCS/Azure Storage as backend with DynamoDB/Bigtable/ CosmosDB for state locking. Configure backend block in terraform {}. Enable versioning on state bucket for rollback. Use workspaces for environments (dev/staging/prod). Never store state locally. Run terraform plan from CI with read-only lock.',
    { domain: 'devops', difficulty: 'intermediate', tags: ['terraform', 'state', 'iac', 'devops', 'cloud'], insights: ['Remote state with locking prevents corruption', 'S3 + DynamoDB is the most common combo', 'State bucket versioning for recovery', 'Terraform workspaces for environment separation', 'CI runs plan with read-only lock, apply with write lock'] }
  ),
  ro(
    'How to set up monitoring and alerting for a web application',
    'Four golden signals: latency, traffic, errors, saturation. Use Prometheus for metrics collection, Grafana for dashboards. Alert on: p99 latency > 500ms, error rate > 1%, disk > 80%, CPU > 80%. Use structured logging (JSON) with correlation IDs. Set up health check endpoints (/health, /ready).',
    { domain: 'devops', difficulty: 'beginner', tags: ['monitoring', 'prometheus', 'grafana', 'alerting', 'observability'], insights: ['Four golden signals cover most failure modes', 'Alert on symptoms (high latency), not causes (high CPU)', 'Pagertree/PagerDuty for on-call escalation', 'Dashboard for each service with SLIs/SLOs', 'Health check vs readiness probe separation'] }
  ),
  ro(
    'How to design an incident response runbook',
    'Severity levels: SEV1 (outage), SEV2 (partial), SEV3 (minor). Timeline: detect -> acknowledge (5min) -> assess -> mitigate -> resolve -> postmortem. Communication: status page, internal channel, stakeholder updates every 30min for SEV1. Postmortem within 48h: timeline, root cause, action items.',
    { domain: 'devops', difficulty: 'beginner', tags: ['incident-response', 'runbook', 'sre', 'devops', 'reliability'], insights: ['Timebox each phase to avoid prolonged incidents', 'Postmortem blameless culture', 'Action items must have owners and deadlines', 'Practice incident response with game days', 'Automate detection and escalation where possible'] }
  ),
  ro(
    'How to implement canary deployments on Kubernetes',
    'Use service mesh (Istio/Linkerd) or Kubernetes Deployment with two versions. Route 5% traffic to canary via weight-based service mesh rule. Monitor error rate, latency, and business metrics for 10min. Auto-rollback if error rate spikes >1%. Gradually increase to 25%, 50%, 100%.',
    { domain: 'devops', difficulty: 'advanced', tags: ['kubernetes', 'canary', 'deployment', 'service-mesh', 'sre'], insights: ['Start with 5% traffic to canary', 'Monitor both tech and business metrics', 'Auto-rollback on error rate increase', 'Use Flagger or Argo Rollouts for automation', 'Canary duration based on time to detect issues'] }
  ),
  ro(
    'How to implement database backup and restore strategy',
    'Full backup weekly, incremental daily, WAL archiving continuous. Retention: daily for 30 days, weekly for 12 months. Test restore in staging environment regularly. Use pg_dump/pg_restore for PostgreSQL. Store backups in separate region/cloud. Encrypt backups at rest and in transit.',
    { domain: 'devops', difficulty: 'intermediate', tags: ['backup', 'database', 'disaster-recovery', 'postgresql', 'devops'], insights: ['WAL archiving enables point-in-time recovery', 'Test restore at least monthly', 'Backups in separate region from production', 'Encrypt all backups', 'Document RTO and RPO for each data tier'] }
  ),
  ro(
    'How to implement zero-downtime migrations in PostgreSQL',
    'Use migration pattern: (1) Add new column nullable, (2) Backfill in batches with lock_timeout, (3) Add NOT NULL after verification, (4) Deploy app code using new column, (5) Drop old column in separate deploy. Use pgroll or similar for complex migrations. Never run DDL inside transaction block that mixes reads.',
    { domain: 'database', difficulty: 'advanced', tags: ['postgresql', 'migration', 'zero-downtime', 'database', 'devops'], insights: ['Add columns as nullable first, backfill later', 'Batch backfill with sleep between batches', 'Lock timeout prevents catastrophic blocking', 'Each schema change is a separate deploy', 'Use NOT VALID for large table constraint addition'] }
  ),
  ro(
    'How to set up CI/CD for a Node.js application',
    'Pipeline: lint -> test -> build -> security scan -> deploy. Run in parallel: lint and unit tests. Then integration tests. Build Docker image with multi-stage (dev deps + build + production). Push to registry. Deploy to staging, run smoke tests. Auto-deploy to production on main branch merge. Manual approval for production.',
    { domain: 'devops', difficulty: 'beginner', tags: ['ci-cd', 'nodejs', 'docker', 'github-actions', 'devops'], insights: ['Fail fast: lint and unit tests first', 'Multi-stage Docker builds reduce image size', 'Smoke tests in staging before production', 'Auto-deploy main, manual approval for prod', 'Cache node_modules across CI runs'] }
  ),
  ro(
    'How to implement health checks for microservices',
    'Separate /health (liveness: is process alive?) and /ready (readiness: can serve traffic?). Health check checks: DB connection, cache connection, disk space, memory. Readiness checks: migrations complete, warm cache, upstream services reachable. Use /startup for slow-init services (Kubernetes).',
    { domain: 'devops', difficulty: 'beginner', tags: ['health-checks', 'microservices', 'kubernetes', 'observability', 'devops'], insights: ['Three probes: startup, liveness, readiness', 'Readiness fails if upstream is down', 'Startup probe for slow-initializing services', 'Aggressive retry: 3 failures before unhealthy', 'Separate deep health check (expensive) from /health'] }
  ),

  // === Database (6) ===
  ro(
    'How to implement connection pooling for PostgreSQL',
    'Use pg-pool with max: 20-50 connections depending on CPU. Set idleTimeoutMillis: 30000 for releasing idle connections. connectionTimeoutMillis: 5000 for fail-fast. Monitor pool utilization. Size pool: connections = ((core_count * 2) + effective_spindle_count). Never create new connection per request.',
    { domain: 'database', difficulty: 'intermediate', tags: ['postgresql', 'connection-pool', 'performance', 'database', 'nodejs'], insights: ['Pool size not linear — more connections != faster', 'Monitor pool.waitingCount for contention', 'Release connections back to pool in finally block', 'Use pool.query for single queries, pool.connect for transactions', 'Set statement timeout at pool level'] }
  ),
  ro(
    'How to optimize slow SQL queries',
    'Use EXPLAIN ANALYZE to identify full table scans, nested loops, and sort operations. Add indexes on WHERE, JOIN, ORDER BY columns. Use composite indexes for multi-column filters. Avoid SELECT *, fetch only needed columns. Consider partial indexes for filtered queries. Use pg_stat_statements for production monitoring.',
    { domain: 'database', difficulty: 'intermediate', tags: ['sql', 'optimization', 'indexing', 'performance', 'database'], insights: ['EXPLAIN ANALYZE shows actual execution time', 'Composite index column order: equality first, range last', 'Partial indexes save space for filtered queries', 'pg_stat_statements identifies worst queries', 'Covering indexes (INCLUDE) avoid table access'] }
  ),
  ro(
    'How to use parameterized queries to prevent SQL injection',
    'Use prepared statements with $1, $2 placeholders. Never concatenate user input into SQL strings. ORM (Prisma/TypeORM) auto-parameterizes. For raw queries, always use parameterized API. Safe: WHERE email = $1. Dangerous: WHERE email = \'${userInput}\'. Validate ORM dynamic raw queries too.',
    { domain: 'security', difficulty: 'beginner', tags: ['sql-injection', 'database', 'security', 'parameterized-queries'], insights: ['Parameterized queries prevent ALL SQL injection', 'ORM parameterizes by default, but raw() queries need care', 'LIKE queries need sanitization of % and _', 'IN clauses work with parameterized: WHERE id = ANY($1)', 'Dynamic table names: validate against allowlist'] }
  ),
  ro(
    'How to design database indexing strategy',
    'Index WHERE, JOIN, ORDER BY, GROUP BY columns. B-tree for equality + range queries. Hash for equality only. GIN for full-text/array. Composite index for multi-column queries. Covering index (INCLUDE) for index-only scans. Monitor unused indexes with pg_stat_user_indexes. Avoid over-indexing (write overhead).',
    { domain: 'database', difficulty: 'intermediate', tags: ['indexing', 'database', 'performance', 'postgresql', 'optimization'], insights: ['One composite index beats multiple single-column indexes', 'Index selectivity: high-cardinality columns first', 'Monitor unused indexes and drop them', 'Partial index for common filtered queries', 'BRIN index for large append-only tables'] }
  ),
  ro(
    'How to implement database sharding strategy',
    'Horizontal shard by consistent hashing on shard key (user_id, tenant_id). Use application-level router to map key -> shard. Maintain shard map with versioning for rebalancing. Cross-shard queries are expensive — design schema around shard key. Fan-out queries for analytics. Two-phase commit for cross-shard transactions.',
    { domain: 'database', difficulty: 'advanced', tags: ['sharding', 'database', 'scalability', 'architecture', 'distributed-systems'], insights: ['Sharding adds complexity — only do when needed', 'Choose shard key carefully (can\'t change later)', 'Consistent hashing minimizes rebalancing', 'Cross-shard joins via fan-out', 'Consider Citus (distributed PostgreSQL) for managed sharding'] }
  ),
  ro(
    'How to handle database migration failures',
    'Always create a backup before migration. Run migrations in transaction (if DDL supports it). Use versioned migration files (timestamp prefix). Implement up/down methods for rollback. Test migration on staging first. For large tables: use batching, triggers, or pgroll. Monitor replication lag during migration.',
    { domain: 'database', difficulty: 'intermediate', tags: ['migration', 'database', 'rollback', 'devops', 'postgresql'], insights: ['Test migration on staging with production-size data', 'Write down migration even if you never use it', 'Large table migration: batch with throttling', 'Monitor replication lag during migration', 'Lock timeout prevents catastrophic blocking'] }
  ),

  // === Frontend (4) ===
  ro(
    'How to implement lazy loading and code splitting in React',
    'Use React.lazy() + Suspense for component-level splitting. Use dynamic import() for route-level splitting. Set webpack splitChunks for vendor/code splitting. Preload critical chunks with <link rel=preload>. Prefetch likely-next routes with React.lazy + IntersectionObserver.',
    { domain: 'code', difficulty: 'intermediate', tags: ['react', 'lazy-loading', 'performance', 'code-splitting', 'frontend'], insights: ['Route-level splitting is the biggest win', 'Preload critical chunks, prefetch likely ones', 'Suspense fallback for loading state', 'Vendor chunk for stable dependencies', 'Measure with Lighthouse before and after'] }
  ),
  ro(
    'How to optimize Core Web Vitals (LCP, CLS, INP)',
    'LCP: optimize largest element (hero image). Preload, use responsive images, serve next-gen formats. CLS: set explicit dimensions on images/iframes/ads. Use aspect-ratio CSS. Avoid inserting content above fold after load. INP: break long tasks, debounce handlers, use passive events, optimize paint.',
    { domain: 'code', difficulty: 'intermediate', tags: ['web-vitals', 'performance', 'lcp', 'cls', 'inp'], insights: ['LCP: preload hero image, compress, responsive sizes', 'CLS: always set width/height on images and iframes', 'INP: break tasks >50ms with yield/requestIdleCallback', 'Use PerformanceObserver to monitor real users (RUM)', 'Lighthouse lab data + RUM field data for full picture'] }
  ),
  ro(
    'How to implement state management with Zustand',
    'Create store with create() — define state + actions. Selectors for derived state (useStore selector). Avoid re-renders with shallow comparison. Middleware: persist (localStorage), devtools (Redux DevTools), immer (mutable syntax). For async: actions are async functions that set state. No providers needed.',
    { domain: 'code', difficulty: 'beginner', tags: ['zustand', 'state-management', 'react', 'frontend'], insights: ['Store outside React tree — no providers', 'Selectors prevent unnecessary re-renders', 'Immer middleware enables mutable syntax', 'Persist middleware for offline support', 'Devtools middleware for debugging'] }
  ),
  ro(
    'How to implement responsive images for performance',
    'Use srcset with Size: 480w, 768w, 1200w, 1920w. Use sizes attribute for viewport-based selection. Serve WebP/AVIF via <picture> element. Set width + height to prevent CLS. Use loading=lazy for below-fold images. Use fetchpriority=high for hero/LCP image. CDN for image transformation on the fly.',
    { domain: 'code', difficulty: 'beginner', tags: ['images', 'performance', 'responsive', 'web-vitals', 'frontend'], insights: ['srcset + sizes for resolution switching', 'WebP/AVIF saves 25-50% compared to JPEG/PNG', 'Explicit width/height prevents layout shift', 'loading=lazy for below-fold images', 'CDN with on-the-fly transformation for dynamic resizing'] }
  ),

  // === Testing (4) ===
  ro(
    'How to write end-to-end tests with Playwright',
    'Use Playwright Test Runner. Page Object Model for maintainable selectors. Use data-testid attributes (never CSS selectors). Run tests in parallel across browsers. Use fixtures for shared setup. Snapshots for visual regression. Trace viewer for debugging CI failures. Mock network for reliability.',
    { domain: 'code', difficulty: 'intermediate', tags: ['testing', 'playwright', 'e2e', 'automation', 'frontend'], insights: ['data-testid is the most reliable selector', 'Page Object Model reduces maintenance', 'Parallel execution across 3+ browsers in CI', 'Trace viewer is invaluable for debugging failures', 'Mock external APIs for deterministic tests'] }
  ),
  ro(
    'How to write integration tests for Node.js APIs',
    'Use supertest for HTTP testing. Set up test database (separate from dev/prod). Seed test data before tests. Clean up after each test. Test happy path, error cases, edge cases, and auth. Use Jest or Vitest as runner. Mock external services. CI: run integration tests before deploy.',
    { domain: 'code', difficulty: 'intermediate', tags: ['testing', 'integration', 'nodejs', 'api', 'jest'], insights: ['Separate test database prevents state pollution', 'Supertest tests HTTP layer without network', 'Clean database between test suites', 'Mock external APIs for reliability', 'Integration tests before deploy gate'] }
  ),
  ro(
    'How to mock external services in tests',
    'Use sinon or jest.mock for module-level mocking. Use nock or msw for HTTP-level mocking. Mock at boundary of your system. Verify mock interactions (called with, times). Use dependency injection for testability. Avoid mocking what you don\'t own — use contract tests instead.',
    { domain: 'code', difficulty: 'beginner', tags: ['testing', 'mocking', 'jest', 'nock', 'integration'], insights: ['Mock at system boundary, not internals', 'Verify mock interactions for confidence', 'MSW (Mock Service Worker) for HTTP mocking', 'Contract tests for external API dependencies', 'Too many mocks = brittle tests — prefer integration tests'] }
  ),
  ro(
    'How to implement Test-Driven Development (TDD) workflow',
    'Red-Green-Refactor cycle: Write failing test first (red), implement minimal code to pass (green), refactor while keeping tests green. Tests are specification. Write test for the behavior, not implementation. Start with the simplest test case. Iterate: add one behavior at a time.',
    { domain: 'code', difficulty: 'beginner', tags: ['tdd', 'testing', 'workflow', 'methodology'], insights: ['Red-Green-Refactor cycle ensures testable code', 'Tests as living specification', 'Start with simplest test case', 'Refactor step is not optional', 'TDD leads to modular, loosely-coupled design'] }
  ),

  // === AI/ML (4) ===
  ro(
    'How to implement Retrieval-Augmented Generation (RAG)',
    'Chunk documents (500-1000 tokens with overlap). Embed chunks with text-embedding-3-small or similar. Store in vector DB (pgvector, Pinecone, Weaviate). On query: embed question, similarity search top-k, construct prompt with context + question. Retrieved chunks should be relevant, not adjacent.',
    { domain: 'code', difficulty: 'advanced', tags: ['rag', 'ai', 'embeddings', 'vector-database', 'nlp'], insights: ['Chunking strategy impacts retrieval quality', 'Metadata filtering improves relevance', 'Re-rank results after vector search', 'Query rewriting improves retrieval', 'Small embedding model for retrieval, large for generation'] }
  ),
  ro(
    'How to implement prompt engineering patterns',
    'Structured prompting: role, context, task, format, constraints. Few-shot examples: 2-5 examples, representative of real cases. Chain-of-thought: step-by-step reasoning for complex tasks. Temperature: 0 for deterministic, 0.7 for creative. System prompt for behavior, user prompt for task.',
    { domain: 'code', difficulty: 'beginner', tags: ['prompt-engineering', 'ai', 'llm', 'patterns'], insights: ['Be specific about output format', 'Few-shot examples > abstract instructions', 'Chain-of-thought improves complex reasoning', 'Temperature 0 for tools/APIs, 0.7 for creative', 'System prompt sets behavior, user prompt gives task'] }
  ),
  ro(
    'How to implement vector search with pgvector',
    'Enable pgvector extension. Use 3-layer architecture: raw data -> embeddings (384/768/1536 dim) -> index. IVFFlat index for speed (lists = sqrt(rows)). HNSW index for higher accuracy. Use cosine distance for normalized embeddings. L2 for raw. Use metadata pre-filtering before vector search.',
    { domain: 'database', difficulty: 'advanced', tags: ['pgvector', 'vector-search', 'embeddings', 'postgresql', 'ai'], insights: ['HNSW > IVFFlat for accuracy, IVFFlat > HNSW for build speed', 'Use cosine distance for OpenAI embeddings', 'Metadata filtering before vector search', 'REINDEX periodically for IVFFlat', 'Dimension 768 balances speed and accuracy'] }
  ),
  ro(
    'How to evaluate LLM output quality',
    'Automated metrics: BLEU, ROUGE, METEOR for text similarity. LLM-as-judge: use strong model (GPT-4) to evaluate output on criteria: accuracy, relevance, helpfulness. Human evaluation: A/B testing, ratings. Domain-specific: correctness against ground truth. Track: hallucination rate, response time, token cost.',
    { domain: 'code', difficulty: 'intermediate', tags: ['ai', 'evaluation', 'llm', 'quality', 'testing'], insights: ['LLM-as-judge correlates well with human eval', 'Create evaluation dataset of 100+ examples', 'Track hallucination rate per domain', 'A/B test in production with user feedback', 'Automated eval in CI for regression detection'] }
  ),

  // === Architecture (4) ===
  ro(
    'How to design with CQRS pattern',
    'Separate read and write models. Commands (write) go to command handler -> event store. Queries (read) go to read model (optimized projections). Eventual consistency between read and write. Event bus for propagating changes. Use separate databases for read/write when scaling.',
    { domain: 'code', difficulty: 'advanced', tags: ['cqrs', 'architecture', 'events', 'ddd', 'scalability'], insights: ['CQRS adds complexity — use for high-read/write-skew systems', 'Read models are optimized projections', 'Eventual consistency is a design decision, not a bug', 'Event sourcing pairs naturally with CQRS', 'Separate read/write databases at scale'] }
  ),
  ro(
    'How to implement Saga pattern for distributed transactions',
    'Choreography Saga: each service publishes events that trigger next step. Orchestration Saga: central coordinator tells each service what to do. Each step has compensating action for rollback. Timeout + retry for each step. Idempotency handlers for duplicate messages. Monitoring for stuck sagas.',
    { domain: 'code', difficulty: 'advanced', tags: ['saga', 'distributed-transactions', 'microservices', 'architecture', 'reliability'], insights: ['Sagas replace distributed transactions in microservices', 'Choreography is simpler, orchestration is more manageable', 'Compensating actions must be idempotent', 'Idempotency keys prevent duplicate processing', 'Saga state persisted for recovery after crash'] }
  ),
  ro(
    'How to implement Event Sourcing',
    'Store state changes as event stream, not current state. Append-only event store. Rebuild current state by replaying events. Projections build read models from events. Snapshot every N events for performance. Events are facts — never delete or modify. Version events schema for evolution.',
    { domain: 'code', difficulty: 'advanced', tags: ['event-sourcing', 'architecture', 'events', 'cqrs', 'ddd'], insights: ['Append-only event store is the source of truth', 'Projections build read models', 'Snapshots prevent full replay', 'Events are immutable facts', 'Schema versioning for event evolution'] }
  ),
  ro(
    'How to apply Domain-Driven Design (DDD)',
    'Ubiquitous language throughout code. Bounded contexts define service boundaries. Aggregates ensure transactional consistency. Entities have identity, Value Objects don\'t. Domain events for cross-aggregate communication. Repository pattern for data access. Domain services for logic that doesn\'t fit entity/value.',
    { domain: 'code', difficulty: 'intermediate', tags: ['ddd', 'architecture', 'domain-driven-design', 'design-patterns'], insights: ['Bounded contexts = microservice boundaries', 'Aggregates are transactional consistency boundaries', 'Ubiquitous language bridges code and domain experts', 'Value Objects reduce primitive obsession', 'Domain events = business events that matter'] }
  ),

  // === Error Handling (4) ===
  ro(
    'How to implement graceful degradation and circuit breaker',
    'Use circuit breaker pattern: closed (normal) -> open (failing, fast-fail) -> half-open (test recovery). Add Hystrix/Opossum in Node.js. Fallback responses when circuit open. Degrade functionality gracefully (disable non-critical features). Cache previous successful responses for circuit-open fallback.',
    { domain: 'code', difficulty: 'intermediate', tags: ['circuit-breaker', 'resilience', 'error-handling', 'microservices', 'patterns'], insights: ['Circuit breaker prevents cascading failures', 'Fallback response is better than 500', 'Half-open state tests recovery', 'Monitor circuit state for capacity planning', 'Combine with retry + timeout for full resilience'] }
  ),
  ro(
    'How to implement structured error handling in Node.js',
    'Create custom error classes extending Error: AppError, ValidationError, AuthError, NotFoundError. Add statusCode, errorCode, details fields. Global error handling middleware catches all errors. Return structured JSON: { error: { code, message, details, request_id } }. Log errors with context. Differentiate operational vs programmer errors.',
    { domain: 'code', difficulty: 'beginner', tags: ['error-handling', 'nodejs', 'express', 'middleware', 'logging'], insights: ['Operational errors: handle gracefully', 'Programmer errors: crash and restart', 'Custom error classes with status codes', 'Global error handler catches unhandled errors', 'Include request_id in error responses'] }
  ),
  ro(
    'How to implement retry with exponential backoff in async operations',
    'Retry up to 3 times. Backoff: 100ms, 500ms, 2s. Add jitter +/- 25% to prevent thundering herd. Only retry on transient errors (timeout, 429, 503). Don\'t retry on 4xx (client error). Use async-retry or p-retry library. Cap maximum delay at 30s. Log retry attempts with attempt number.',
    { domain: 'code', difficulty: 'beginner', tags: ['retry', 'backoff', 'resilience', 'async', 'patterns'], insights: ['Jitter prevents thundering herd problem', 'Only retry transient errors', 'Cap max retry count to 3-5', 'Log retry attempts for debugging', 'Exponential backoff + jitter = standard best practice'] }
  ),
  ro(
    'How to handle unhandled promise rejections in Node.js',
    'Add process.on(\'unhandledRejection\') listener — log the error and exit gracefully. In Node.js 15+, unhandled rejection terminates process by default. Use process.on(\'uncaughtException\') for sync errors. Clean up resources before exit. PM2/Docker restart handles recovery. Avoid global handlers as catch-all.',
    { domain: 'code', difficulty: 'beginner', tags: ['nodejs', 'error-handling', 'promises', 'stability'], insights: ['Unhandled rejections = bug, not recoverable', 'Log error details before exit', 'Process manager (PM2) restarts after crash', 'Use domain/correlation ID across async boundaries', 'TypeScript strict mode catches many rejection sources'] }
  ),

  // === Performance (4) ===
  ro(
    'How to implement HTTP caching with ETags and Cache-Control',
    'Cache-Control: public, max-age=31536000 for static assets. Use ETag + conditional GET (If-None-Match -> 304) for dynamic responses. Set Vary header for content negotiation. Cache API responses in CDN. Use Cache-Control: no-cache for fresh data, must-revalidate for critical data.',
    { domain: 'code', difficulty: 'intermediate', tags: ['caching', 'http', 'etag', 'performance', 'cdn'], insights: ['Cache-Control directives control CDN and browser', 'ETag 304 responses save bandwidth for unchanged resources', 'Stale-while-revalidate for background refresh', 'Purge CDN cache on deploy', 'Separate cache strategy per content type'] }
  ),
  ro(
    'How to implement gzip/brotli compression for API responses',
    'Use brotli (br) over gzip — 20% smaller with similar speed. Accept-Encoding: br, gzip. Compression middleware (compression npm) in Express. Nginx: brotli on;. Compress text/*, application/json, application/javascript. Skip compression for already compressed formats (images, videos). Compress at proxy level, not app level.',
    { domain: 'devops', difficulty: 'beginner', tags: ['compression', 'performance', 'nginx', 'cdn', 'optimization'], insights: ['Brotli 20% smaller than gzip', 'Compress at nginx/CDN, not app level', 'Skip images/videos (already compressed)', 'Level 4-6 brotli for best speed/size trade-off', 'Cache compressed responses in CDN'] }
  ),
  ro(
    'How to implement database read replicas for query scaling',
    'Set up PostgreSQL streaming replication. Use read-only connection pool for queries. Route writes to primary, reads to replica(s). Accept replication lag (seconds). Use session stickiness for read-after-write consistency. Monitor lag with pg_stat_replication. Failover promotes replica to primary.',
    { domain: 'database', difficulty: 'advanced', tags: ['read-replicas', 'postgresql', 'scaling', 'database', 'architecture'], insights: ['Read replicas offload read queries from primary', 'Accept seconds of replication lag', 'Sticky sessions for read-after-write consistency', 'Monitor replication lag — alert if >30s', 'Application-level read/write splitting'] }
  ),
  ro(
    'How to implement Redis caching for API responses',
    'Cache-aside pattern: check cache first, miss->query DB->store in cache. Set TTL based on data freshness: 60s for dynamic, 3600s for static. Cache invalidation on write (delete cache key). Use Redis for: sessions, rate limits, hot data. Monitor cache hit rate — target >80%.',
    { domain: 'code', difficulty: 'intermediate', tags: ['redis', 'caching', 'performance', 'api', 'database'], insights: ['Cache-aside (lazy loading) is the simplest pattern', 'TTL varies by data freshness requirement', 'Cache invalidation: delete key on write', 'Monitor cache miss rate — high miss rate means bad caching', 'Use Redis for hot data, not cold data'] }
  ),

  // === Cross-cutting / Patterns (4) ===
  ro(
    'How to implement feature flags for gradual rollout',
    'Use LaunchDarkly or a simple JSON config file. Wrap features with if/else using flag check. Target by user ID, percentage, region, plan. Remove old flag code after full rollout. Split UI + API flags for independent releases. Log flag evaluations for debugging.',
    { domain: 'devops', difficulty: 'beginner', tags: ['feature-flags', 'devops', 'rollout', 'testing', 'deployment'], insights: ['Feature flags decouple deploy from release', 'Remove flags after rollout to prevent tech debt', 'Percentage rollouts for gradual exposure', 'Target by user segment for testing', 'Kill switch capability for quick rollback'] }
  ),
  ro(
    'How to implement structured logging for production',
    'Log as JSON, not plain text. Structured fields: timestamp, level, message, service, request_id, user_id, duration, error. Use pino (fastest) or winston. Log levels: error, warn, info, debug. Never log PII, secrets, tokens. Centralized logging: ELK/Loki/Grafana. Log at service boundaries in/out.',
    { domain: 'devops', difficulty: 'beginner', tags: ['logging', 'observability', 'structured-logging', 'pino', 'devops'], insights: ['JSON logs enable machine parsing and search', 'Pino is 5x faster than Winston', 'Never log secrets, passwords, or tokens', 'Log structured fields, not formatted strings', 'Centralized logging with correlation across services'] }
  ),
  ro(
    'How to implement graceful shutdown in Node.js',
    'Listen for SIGTERM/SIGINT. Stop accepting new requests. Drain existing connections with timeout (30s). Close database pool. Flush pending logs/metrics. Final log and exit(0). Use http.server.close() for connection draining. PM2 handles SIGTERM automatically. Kubernetes: preStop hook with sleep.',
    { domain: 'code', difficulty: 'intermediate', tags: ['nodejs', 'graceful-shutdown', 'kubernetes', 'reliability', 'devops'], insights: ['Graceful shutdown prevents in-flight request loss', 'Drain connections with timeout to prevent infinite hang', 'Close DB/cache connections cleanly', 'Kubernetes preStop hook + sleep for load balancer draining', 'PM2 sends SIGTERM for graceful shutdown'] }
  ),
  ro(
    'How to implement rate limiting with Redis sliding window',
    'Use Redis sorted set per user+endpoint. ZADD current timestamp, ZREMRANGEBYSCORE -inf (now - window). ZCARD for count. SETEX key TTL for auto-cleanup. Lua script for atomic operation. Handle Redis failure gracefully (skip rate limit). Return X-RateLimit-Remaining, X-RateLimit-Reset headers.',
    { domain: 'code', difficulty: 'intermediate', tags: ['rate-limit', 'redis', 'performance', 'security', 'api'], insights: ['Sorted set + Lua for atomic sliding window', 'TTL auto-cleanup prevents memory leaks', 'Graceful degradation on Redis failure', 'Rate limit by IP, API key, and endpoint combo', 'Headers inform clients of their limits'] }
  )
];
