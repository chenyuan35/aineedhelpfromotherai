#!/usr/bin/env node
// seed-reasoning-objects-batch4.js — Batch 4 seed reasoning objects (16 objects)
// Covers: CI/CD, TypeScript, Docker Compose, Redis pub/sub, WebSocket, Pagination,
//         CORS, Environment Variables, Testing, Logging, Microservices, Caching,
//         API Gateway, Load Balancing, Feature Flags, Database Migration

module.exports = [
  {
    id: 'RO_CICD_PIPELINE_001',
    domain: 'devops',
    problem_statement: 'Design a CI/CD pipeline that runs tests, builds artifacts, and deploys only on main branch merges. How to handle flaky tests without blocking deployment?',
    solution: 'Use GitHub Actions with separate jobs for test/build/deploy. Deploy job requires main branch protection and all tests passing. For flaky tests: implement retry-with-backoff (max 2 retries), quarantine flaky tests in a separate job that doesn\'t block deployment, and track flaky test rate in a dashboard.',
    key_insights: [
      'Flaky tests erode trust in CI — quarantine them, don\'t ignore them',
      'Separate test and deploy jobs so deployment can\'t run without passing tests',
      'Use branch protection rules as a safety net, not just CI config'
    ],
    difficulty: 'intermediate',
    tags: ['ci-cd', 'github-actions', 'deployment', 'testing'],
    success_criteria: 'Pipeline runs on PR, deploys only on main merge, flaky tests don\'t block production',
    common_pitfalls: ['Running deploy on every PR', 'Ignoring flaky tests entirely', 'No branch protection']
  },
  {
    id: 'RO_TYPESCRIPT_NARROWING_001',
    domain: 'code',
    problem_statement: 'TypeScript: How to properly narrow union types without using `as` type assertions? When to use type guards vs discriminated unions?',
    solution: 'Use discriminated unions with a common literal property (e.g., `type: "success" | "error"`) for exhaustive type narrowing. Write custom type guard functions (`function isSuccess(x: Result): x is SuccessResult`) for complex conditions. Avoid `as` — it bypasses type safety. Use `satisfies` operator for literal type inference without widening.',
    key_insights: [
      'Discriminated unions give exhaustiveness checking in switch statements',
      'Type guards are reusable and composable',
      '`as` is a code smell — it means the type system can\'t verify your assumption'
    ],
    difficulty: 'intermediate',
    tags: ['typescript', 'type-safety', 'type-guards'],
    success_criteria: 'No `as` assertions in code, exhaustive switch coverage, type guards are reusable',
    common_pitfalls: ['Overusing `as any`', 'Not handling all union cases', 'Using `typeof` for complex narrowing']
  },
  {
    id: 'RO_DOCKER_COMPOSE_001',
    domain: 'devops',
    problem_statement: 'Docker Compose: How to set up a multi-service stack (app + DB + Redis) with proper health checks, volumes, and networking for local development?',
    solution: 'Define services with depends_on using condition: service_healthy. Add healthcheck commands for each service (e.g., `pg_isready` for Postgres, `redis-cli ping` for Redis). Use named volumes for persistent data. Create a custom network for service isolation. Use .env file for configuration. Set restart: unless-stopped for resilience.',
    key_insights: [
      'depends_on without healthcheck only waits for container start, not readiness',
      'Named volumes survive container recreation — bind mounts don\'t',
      'Custom networks provide DNS-based service discovery'
    ],
    difficulty: 'intermediate',
    tags: ['docker', 'docker-compose', 'local-dev', 'health-checks'],
    success_criteria: 'docker-compose up starts all services in correct order, data persists across restarts',
    common_pitfalls: ['Missing health checks causing race conditions', 'Using default network', 'No volume for DB data']
  },
  {
    id: 'RO_REDIS_PUBSUB_001',
    domain: 'architecture',
    problem_statement: 'Implement Redis Pub/Sub for real-time notifications. How to handle message loss, subscriber reconnection, and message ordering?',
    solution: 'Redis Pub/Sub is fire-and-forget — messages to offline subscribers are lost. For reliability, use Redis Streams with consumer groups instead. Streams provide message persistence, acknowledgment, and replay. For ordering: use a single stream per topic. For reconnection: track last processed ID and resume from there. Use XREADGROUP with BLOCK for efficient polling.',
    key_insights: [
      'Pub/Sub has no persistence — use Streams for reliable delivery',
      'Consumer groups enable parallel processing with exactly-once semantics',
      'BLOCK parameter reduces CPU usage vs busy-wait polling'
    ],
    difficulty: 'advanced',
    tags: ['redis', 'pub-sub', 'streams', 'real-time', 'message-queue'],
    success_criteria: 'No message loss on subscriber restart, messages processed in order, exactly-once delivery',
    common_pitfalls: ['Using Pub/Sub for critical messages', 'Not acknowledging messages in consumer groups', 'No reconnection logic']
  },
  {
    id: 'RO_WEBSOCKET_001',
    domain: 'code',
    problem_statement: 'Implement WebSocket connections with automatic reconnection, heartbeat/ping-pong, and graceful degradation for real-time features.',
    solution: 'Implement exponential backoff reconnection (1s, 2s, 4s, 8s, max 30s). Send ping frames every 30s, expect pong within 10s or close connection. On close, attempt reconnection with backoff. Maintain a message queue for outgoing messages during disconnection, flush on reconnect. Fall back to HTTP polling if WebSocket is blocked by firewall/proxy.',
    key_insights: [
      'Heartbeat detects dead connections that TCP doesn\'t close',
      'Message queue prevents data loss during brief disconnections',
      'Graceful degradation ensures functionality even without WebSocket'
    ],
    difficulty: 'intermediate',
    tags: ['websocket', 'real-time', 'reconnection', 'heartbeat'],
    success_criteria: 'Connection recovers from network drops, dead connections detected within 40s, fallback works',
    common_pitfalls: ['No heartbeat causing silent disconnections', 'Infinite reconnection loops', 'No fallback mechanism']
  },
  {
    id: 'RO_PAGINATION_001',
    domain: 'database',
    problem_statement: 'Design pagination for an API with 10M+ rows. Compare OFFSET/LIMIT vs cursor-based pagination. When does OFFSET become slow?',
    solution: 'OFFSET/LIMIT scans and discards OFFSET rows — O(n) complexity. At OFFSET 100,000 it becomes noticeably slow. Use cursor-based (keyset) pagination: `WHERE id > last_seen_id ORDER BY id LIMIT 20`. This uses index seek — O(1) regardless of position. Cursor pagination doesn\'t support "jump to page N" but is far superior for infinite scroll and API responses.',
    key_insights: [
      'OFFSET is O(n) — it gets slower the deeper you paginate',
      'Cursor pagination is O(1) with proper index',
      'Total count queries are expensive — avoid them for large tables'
    ],
    difficulty: 'intermediate',
    tags: ['pagination', 'performance', 'api-design', 'indexing'],
    success_criteria: 'Page 10,000 loads as fast as page 1, no full table scans for pagination',
    common_pitfalls: ['Using OFFSET for deep pagination', 'Running COUNT(*) on every request', 'No index on pagination column']
  },
  {
    id: 'RO_CORS_001',
    domain: 'security',
    problem_statement: 'Fix CORS errors in production. What is CORS really protecting against? When is `*` origin safe vs dangerous?',
    solution: 'CORS is a browser security feature, not a server security feature. It prevents malicious websites from reading responses from other origins. `Access-Control-Allow-Origin: *` is safe for public APIs with no auth cookies, but dangerous for APIs that use cookies/tokens (credentials can\'t be sent with `*`). For authenticated APIs: whitelist specific origins, use `credentials: true`, and never use `*` with credentials.',
    key_insights: [
      'CORS protects users, not servers — it\'s a browser feature',
      '`*` origin + credentials is forbidden by spec — browsers reject it',
      'CORS doesn\'t prevent direct API calls (curl, Postman) — only browser-based attacks'
    ],
    difficulty: 'beginner',
    tags: ['cors', 'security', 'browser', 'api-design'],
    success_criteria: 'Frontend can call API without CORS errors, credentials work correctly, no `*` with auth',
    common_pitfalls: ['Using `*` with credentials', 'Thinking CORS prevents all attacks', 'Overly permissive origin whitelist']
  },
  {
    id: 'RO_ENV_VARS_001',
    domain: 'devops',
    problem_statement: 'Manage environment variables across local dev, staging, and production. How to handle secrets vs config? What about .env files in Docker?',
    solution: 'Separate config (non-secret, varies by env) from secrets. Use .env files for local dev only (gitignored). Use CI/CD secrets for staging/production. In Docker: pass secrets via docker secret or orchestration platform, not .env files. Use a config validation layer at startup (e.g., Zod schema) to fail fast on missing vars. Never commit .env files. Use .env.example as template.',
    key_insights: [
      '.env files in Docker images are a security risk — anyone can extract them',
      'Fail fast on missing env vars — don\'t let the app start with undefined config',
      'Config validation at startup catches deployment errors before traffic arrives'
    ],
    difficulty: 'beginner',
    tags: ['environment-variables', 'secrets', 'docker', 'configuration'],
    success_criteria: 'No secrets in code or images, app fails fast on missing config, .env not in git',
    common_pitfalls: ['Committing .env files', 'Hardcoding defaults for secrets', 'No config validation']
  },
  {
    id: 'RO_TESTING_STRATEGY_001',
    domain: 'code',
    problem_statement: 'Design a testing strategy for a web application. What to test with unit tests vs integration tests vs E2E tests? How to avoid flaky tests?',
    solution: 'Follow the testing pyramid: 70% unit tests (fast, isolated), 20% integration tests (API + DB), 10% E2E tests (full browser). Unit tests: pure functions, utilities, business logic. Integration tests: API endpoints with test DB. E2E tests: critical user journeys only. Avoid flaky tests: use deterministic data, mock time/network, add retry for known flaky E2E tests, never sleep — wait for conditions.',
    key_insights: [
      'E2E tests are expensive — test only critical paths',
      'Flaky tests destroy trust — quarantine them immediately',
      'Integration tests catch more bugs than unit tests for the same effort'
    ],
    difficulty: 'intermediate',
    tags: ['testing', 'unit-tests', 'integration-tests', 'e2e', 'test-pyramid'],
    success_criteria: 'Test suite runs in <5 min, <1% flaky rate, critical paths covered by E2E',
    common_pitfalls: ['Too many E2E tests', 'Testing implementation details', 'Ignoring flaky tests']
  },
  {
    id: 'RO_LOGGING_001',
    domain: 'devops',
    problem_statement: 'Implement structured logging for a microservice. What to log vs not log? How to enable correlation across services?',
    solution: 'Use structured logging (JSON format) with consistent fields: timestamp, level, service, correlation_id, message, metadata. Never log secrets, PII, or request bodies. Generate a correlation_id (UUID) at request entry, pass it through all service calls via headers. Use log levels strategically: ERROR for actionable failures, WARN for degraded state, INFO for significant events, DEBUG for troubleshooting. Aggregate logs centrally (ELK, Datadog).',
    key_insights: [
      'Correlation_id is essential for tracing requests across services',
      'Structured logs are queryable — plain text logs are not',
      'Log what you need to debug, not everything — storage costs add up'
    ],
    difficulty: 'intermediate',
    tags: ['logging', 'observability', 'microservices', 'correlation-id'],
    success_criteria: 'Can trace a request across all services, no secrets in logs, logs are queryable',
    common_pitfalls: ['Logging secrets/PII', 'No correlation_id', 'Inconsistent log formats']
  },
  {
    id: 'RO_MICROSERVICES_001',
    domain: 'architecture',
    problem_statement: 'When should you split a monolith into microservices? What are the real costs vs benefits? How to decide service boundaries?',
    solution: 'Start with a modular monolith — it\'s simpler to develop, test, and deploy. Split into microservices only when: (1) teams are blocked by shared deployment, (2) services have different scaling needs, (3) different tech stacks are required. Define boundaries by business domain (DDD bounded contexts), not technical layers. Each service owns its data — no shared databases. Accept the costs: distributed tracing, network latency, eventual consistency, operational complexity.',
    key_insights: [
      'Microservices solve organizational problems, not technical ones',
      'Shared database = distributed monolith (worst of both worlds)',
      'Modular monolith is the right starting point for most projects'
    ],
    difficulty: 'advanced',
    tags: ['microservices', 'architecture', 'monolith', 'ddd', 'service-boundaries'],
    success_criteria: 'Services are independently deployable, own their data, boundaries align with business domains',
    common_pitfalls: ['Splitting too early', 'Shared database across services', 'Ignoring operational costs']
  },
  {
    id: 'RO_CACHING_STRATEGY_001',
    domain: 'architecture',
    problem_statement: 'Design a caching strategy for a read-heavy API. Cache-aside vs write-through vs write-behind? How to handle cache invalidation?',
    solution: 'Use cache-aside (lazy loading) as default: check cache first, if miss, query DB and populate cache. Set TTL based on data freshness requirements. For writes: invalidate cache entry (not update) to avoid stale data. Use cache stampede protection: only one request regenerates the cache, others wait. For hot keys: use probabilistic early expiration to avoid thundering herd. Never cache without TTL.',
    key_insights: [
      'Cache invalidation is harder than cache population — invalidate, don\'t update',
      'Cache stampede can crash your DB — use locking or probabilistic refresh',
      'Every cache entry needs a TTL — forever caching is a bug'
    ],
    difficulty: 'advanced',
    tags: ['caching', 'redis', 'performance', 'cache-invalidation'],
    success_criteria: 'Cache hit rate >80%, no stale data after writes, no cache stampede under load',
    common_pitfalls: ['No TTL on cache entries', 'Updating cache instead of invalidating', 'No stampede protection']
  },
  {
    id: 'RO_API_GATEWAY_001',
    domain: 'architecture',
    problem_statement: 'When do you need an API Gateway? What responsibilities should it have vs individual services?',
    solution: 'API Gateway is needed when you have 3+ services and need: centralized auth, rate limiting, request transformation, routing, and response aggregation. Gateway handles cross-cutting concerns: TLS termination, auth verification, rate limiting, CORS, logging. Services handle business logic. Don\'t put business logic in the gateway — it becomes a bottleneck. Use gateway patterns: BFF (Backend for Frontend), aggregator, proxy.',
    key_insights: [
      'Gateway is for cross-cutting concerns, not business logic',
      'Without a gateway, every service implements auth, rate limiting, CORS separately',
      'BFF pattern: one gateway per client type (web, mobile, API)'
    ],
    difficulty: 'advanced',
    tags: ['api-gateway', 'microservices', 'rate-limiting', 'authentication'],
    success_criteria: 'Single entry point for clients, auth/rate-limiting centralized, no business logic in gateway',
    common_pitfalls: ['Business logic in gateway', 'Gateway as single point of failure', 'No rate limiting']
  },
  {
    id: 'RO_LOAD_BALANCING_001',
    domain: 'devops',
    problem_statement: 'Configure load balancing for a web application. Round-robin vs least-connections vs IP hash? How to handle sticky sessions?',
    solution: 'Use least-connections for stateful services (long-lived connections), round-robin for stateless services. IP hash for sticky sessions when session data is in-memory (not recommended — use external session store instead). Health checks are critical: remove unhealthy instances from the pool. For HTTP: use application-level health checks (not just TCP). Configure connection draining for graceful shutdown.',
    key_insights: [
      'Sticky sessions are a workaround for in-memory state — use external session store',
      'Health checks must be application-level, not just TCP port checks',
      'Connection draining prevents dropping in-flight requests during deployments'
    ],
    difficulty: 'intermediate',
    tags: ['load-balancing', 'high-availability', 'health-checks', 'sticky-sessions'],
    success_criteria: 'Traffic distributed evenly, unhealthy instances removed, zero-downtime deployments',
    common_pitfalls: ['No health checks', 'Sticky sessions without external session store', 'No connection draining']
  },
  {
    id: 'RO_FEATURE_FLAGS_001',
    domain: 'architecture',
    problem_statement: 'Implement feature flags for gradual rollout and A/B testing. How to manage flag lifecycle? How to avoid flag debt?',
    solution: 'Use a feature flag service (LaunchDarkly, Unleash, or custom). Flags should have: name, description, targeting rules, rollout percentage, expiration date. Implement flag evaluation at application startup and cache results. For gradual rollout: start at 1%, monitor errors, increase incrementally. Flag lifecycle: create → test → rollout → retire. Set expiration dates and alert on flags older than 30 days. Never use flags for permanent configuration.',
    key_insights: [
      'Feature flags without expiration become technical debt',
      'Gradual rollout catches bugs before they affect all users',
      'Flags are for temporary control — permanent config belongs in env vars'
    ],
    difficulty: 'intermediate',
    tags: ['feature-flags', 'deployment', 'a-b-testing', 'gradual-rollout'],
    success_criteria: 'Can toggle features without deploy, gradual rollout works, no flags older than 30 days',
    common_pitfalls: ['No flag expiration', 'Using flags for permanent config', 'No monitoring during rollout']
  },
  {
    id: 'RO_DB_MIGRATION_001',
    domain: 'database',
    problem_statement: 'Design a zero-downtime database migration strategy. How to add a NOT NULL column to a table with 10M rows without locking?',
    solution: 'Use expand/contract pattern: (1) Add column as nullable, (2) Deploy code that writes to both old and new columns, (3) Backfill existing data in batches (1000 rows per transaction), (4) Add NOT NULL constraint, (5) Deploy code that reads from new column, (6) Remove old column. Never use ALTER TABLE with DEFAULT on large tables — it locks the table. Backfill in small batches to avoid long-running transactions.',
    key_insights: [
      'ALTER TABLE with DEFAULT locks the entire table — use expand/contract instead',
      'Backfill in batches to avoid long transactions and replication lag',
      'Deploy code changes before and after schema changes — never simultaneously'
    ],
    difficulty: 'advanced',
    tags: ['database', 'migration', 'zero-downtime', 'schema-change'],
    success_criteria: 'No table locks during migration, no downtime, data integrity preserved',
    common_pitfalls: ['ALTER TABLE with DEFAULT on large tables', 'No backfill script', 'Deploying code and schema simultaneously']
  }
];
