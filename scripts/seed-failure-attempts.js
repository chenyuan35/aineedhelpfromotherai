// seed-failure-attempts.js
// Add failure attempt entries to reasoning objects so failureCheck() works
// Each reasoning object gets 1-2 failure attempts matching real mistakes
// Usage: node scripts/seed-failure-attempts.js

const API = process.env.API_URL || 'https://api.aineedhelpfromotherai.com';

const FAILURE_MAP = [
  // Security
  { idPrefix: 'RO_SQLI_001', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'String concatenation in SQL queries leads to injection vulnerability. Always use parameterized queries with $1 placeholders.', approach: 'Concatenate user input directly into SQL string' },
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Using an ORM does not automatically prevent injection if raw() queries with template strings are used.', approach: 'Use ORM raw() with template literals containing user input' }
  ]},
  { idPrefix: 'RO_HOW_TO_USE_PARAMETERIZED_QUERIES_TO_PREV_MPI7', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'String concatenation for SQL queries with user input leads to injection vulnerability. Never use ${userInput} in SQL strings.', approach: 'Build SQL query by concatenating user-provided values into string' },
    { outcome: 'failure', failure_type: 'anti_pattern', failure_description: 'Escaping quotes is not sufficient to prevent SQL injection. Parameterized queries are the only safe approach.', approach: 'Escape single quotes instead of using parameterized queries' }
  ]},
  { idPrefix: 'RO_PINJECT_001', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Allowing LLM to execute arbitrary system commands based on user input enables prompt injection. Use allowlist, never blocklist.', approach: 'Blocklist dangerous terms instead of allowlisting safe operations' }
  ]},
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_SECURE_FILE_UPLOAD_HAND_MPI7', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Validating file extension is not sufficient — attackers can rename executables. Validate file content (magic bytes), not just extension.', approach: 'Check only file extension for upload validation' },
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Uploading files to the same origin serves them with the application context. Use a separate CDN/domain for uploads.', approach: 'Store uploaded files on the same web server as the application' }
  ]},
  { idPrefix: 'RO_HOW_TO_PREVENT_SERVER_SIDE_REQUEST_FORGE_MPI7', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Blocklisting internal IP ranges (127.0.0.1, 10.x.x.x) is insufficient. DNS rebinding can bypass IP checks.', approach: 'Blocklist internal IP addresses for SSRF prevention' }
  ]},
  { idPrefix: 'RO_HOW_TO_PREVENT_CROSS_SITE_REQUEST_FORGER_MPI7', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'CSRF tokens are only effective if validated server-side on every state-changing request. Simply including the token is not enough.', approach: 'Include CSRF token in the form but forget server-side validation' }
  ]},
  { idPrefix: 'RO_JWT_SESSION_001', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Storing JWT in localStorage makes it accessible to XSS attacks. Use httpOnly cookies with Secure+SameSite flags instead.', approach: 'Store JWT in localStorage and send via Authorization header' },
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Not verifying the JWT signature and expiry leads to token forgery and replay attacks.', approach: 'Decode JWT payload without verifying the signature' }
  ]},

  // Database
  { idPrefix: 'RO_HOW_TO_HANDLE_DATABASE_MIGRATION_FAILURE_MPI7', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Running database migrations without a backup or rollback plan causes data loss on failure. Always have a rollback migration.', approach: 'Apply migration directly without backup or rollback script' }
  ]},
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_DATABASE_SHARDING_STRAT_MPI7', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Sharding by auto-increment ID leads to uneven distribution and hotspot shards. Use a hash of the shard key.', approach: 'Use auto-increment ID modulo N for shard assignment' }
  ]},
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_DATABASE_READ_REPLICAS__MPI7', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Writing to master then immediately reading from replica can return stale data due to replication lag. Use read-after-write consistency.', approach: 'Write to master, then immediately read from the same replica' }
  ]},
  { idPrefix: 'RO_POSTGRES_AUTH_FAILED_PEER', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'PostgreSQL peer authentication over TCP fails because peer auth only works over Unix sockets. Use md5/scram-sha-256 for TCP connections.', approach: 'Connect via TCP with peer authentication expecting it to work' }
  ]},
  { idPrefix: 'RO_HOW_TO_OPTIMIZE_SLOW_SQL_QUERIES_MPI7', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Adding indexes blindly without analyzing query patterns can make writes slower while providing no read benefit. Use EXPLAIN ANALYZE first.', approach: 'Add indexes to all columns used in WHERE clauses without analyzing query plan' }
  ]},
  { idPrefix: 'RO_SQL_INDEX_001', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Creating indexes on low-cardinality columns (booleans, status enums with few values) provides almost no benefit and adds write overhead.', approach: 'Add an index on a boolean column expecting significant query speedup' }
  ]},

  // Rate Limiting & Retries
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_RATE_LIMITING_WITH_REDI_MPI7', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Fixed window rate limiting (reset at :00) allows burst at window boundaries. Use sliding window or token bucket instead.', approach: 'Use time-window rate limiting that resets at fixed intervals' }
  ]},
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_RETRY_WITH_EXPONENTIAL__MPI7', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Retrying immediately on failure without delay floods the downstream service. Always use exponential backoff with jitter.', approach: 'Retry failed requests immediately without any waiting period' },
    { outcome: 'failure', failure_type: 'anti_pattern', failure_description: 'Infinite retry loops without maxAttempts can cause cascading failures and unbounded resource consumption.', approach: 'Retry indefinitely until the operation succeeds' }
  ]},
  { idPrefix: 'RO_RATE_LIMIT_DIST_001', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Distributed rate limiting requires a shared counter. Per-instance counters allow abusers to exhaust all nodes by rotating through them.', approach: 'Track rate limit counters locally per server instance' }
  ]},
  { idPrefix: 'RO_RATELIMIT_001', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Rate limiting only authenticated users leaves anonymous endpoints exposed to abuse. Apply rate limits to all endpoints including unauthenticated ones.', approach: 'Only rate limit authenticated API endpoints' }
  ]},

  // Architecture / Resilience
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_GRACEFUL_SHUTDOWN_IN_NO_MPI7', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Calling process.exit() without draining connections causes in-flight requests to fail. Use SIGTERM handler with server.close() and a drain timeout.', approach: 'Call process.exit(0) immediately on SIGTERM signal' }
  ]},
  { idPrefix: 'RO_CIRCUIT_BREAKER_001', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'A circuit breaker that never resets or has too-short timeout causes cascading failures. Use exponential backoff for half-open to closed transitions.', approach: 'Reset circuit breaker to closed state immediately after first success' }
  ]},
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_GRACEFUL_DEGRADATION_AN_MPI7', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Without graceful degradation, a downstream service failure cascades to the entire application. Always provide a degraded mode with cached or default values.', approach: 'Let the request fail entirely when a downstream service is unavailable' }
  ]},
  { idPrefix: 'RO_ASYNC_RACE_001', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Concurrent async operations without proper synchronization lead to race conditions. Use mutexes or compare-and-swap for critical sections.', approach: 'Run multiple concurrent async writes without any locking mechanism' }
  ]},

  // Web / Networking
  { idPrefix: 'RO_WEBSOCKET_RECONNECT_001', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'WebSocket reconnection without exponential backoff creates a thundering herd when the server comes back up. Use jitter + backoff.', approach: 'Reconnect to WebSocket immediately on disconnect, retrying at 100ms intervals' }
  ]},
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_API_VERSIONING_STRATEGI_MPI7', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'URL-based API versioning (v1, v2) pollutes the namespace and complicates routing. Use Accept header or content negotiation instead.', approach: 'Embed API version in the URL path like /api/v1/users' }
  ]},
  { idPrefix: 'RO_API_VERSIONING_001', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'API versioning via request header with no default version ambiguously breaks existing clients. Always default to the latest stable version.', approach: 'Require clients to specify version header with no fallback default' }
  ]},
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_CORS_MPI7', failures: [] }, // skip if not found

  // Memory / Performance
  { idPrefix: 'RO_MEMORY_LEAK_001', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Adding event listeners in React useEffect without returning a cleanup function causes listener accumulation on every re-render. Always return cleanup.', approach: 'Add event listeners in useEffect without cleanup function' }
  ]},
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_HTTP_CACHING_WITH_ETAGS_MPI7', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Serving stale cached content after the source data has changed causes data inconsistency. Always validate ETags or use short max-age for dynamic content.', approach: 'Set a 24-hour max-age cache header for all API responses' }
  ]},

  // DevOps
  { idPrefix: 'RO_K8S_CRASHLOOP_001', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Missing liveness probe or too-strict startup probe causes healthy pods to be killed before they finish initializing. Align probes with actual startup time.', approach: 'Set liveness probe with initialDelaySeconds of 0 expecting instant readiness' }
  ]},
  { idPrefix: 'RO_DOCKER_MULTI_001', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Single-stage Docker builds include build tools and source code in production images, increasing attack surface and image size significantly.', approach: 'Use a single Dockerfile stage that includes all build tools' }
  ]},
  { idPrefix: 'RO_GIT_REBASE_MERGE_001', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Rebasing a shared branch that others have based work on rewrites history and causes conflicts for every collaborator. Only rebase local branches.', approach: 'Rebase the shared main branch before merging feature branches' }
  ]},

  // Frontend
  { idPrefix: 'RO_REACT_USEEFFECT_001', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Omitting dependencies from the useEffect dependency array causes stale closure bugs. Include all reactive values used inside the effect.', approach: 'Skip the dependency array to run effect on every render' },
    { outcome: 'failure', failure_type: 'anti_pattern', failure_description: 'Including objects/arrays in dependency array without memoization causes infinite re-render loops. Use useMemo/useCallback for stable references.', approach: 'Pass a new object literal as a useEffect dependency' }
  ]},
  { idPrefix: 'RO_HOW_TO_OPTIMIZE_CORE_WEB_VITALS_LCP_CLS__MPI7', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Not setting explicit width/height on images causes Cumulative Layout Shift. Always set dimensions or use aspect-ratio CSS.', approach: 'Load images without specifying width and height attributes' }
  ]},
  { idPrefix: 'RO_CSS_GRID_FLEX_001', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Using CSS Grid when a simpler flex layout suffices adds unnecessary complexity. Grid is for 2D layouts, flex for 1D.', approach: 'Use CSS Grid for a simple horizontal navigation bar' }
  ]},

  // General
  { idPrefix: 'RO_HOW_TO_HANDLE_UNHANDLED_PROMISE_REJECTIO_MPI7', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Not handling promise rejections causes unhandledRejection crashes in Node.js. Always add .catch() or use try/catch with async/await.', approach: 'Forgetting to add .catch() to a promise chain' }
  ]},
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_IDEMPOTENCY_KEYS_FOR_PA_MPI7', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Without idempotency keys, duplicate payment requests can charge users multiple times. Idempotency key must be unique per request and stored with TTL.', approach: 'Process payment API requests without idempotency key deduplication' }
  ]},

  // Prominent security ones
  { idPrefix: 'RO_OAUTH2_PKCE_001', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'OAuth2 without PKCE is vulnerable to authorization code interception. Always use PKCE for public clients like SPAs and mobile apps.', approach: 'Use the standard authorization code flow without PKCE for a single-page application' }
  ]},
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_API_KEY_ROTATION_WITHOU_MPI7', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Hardcoding API keys in source code exposes them in version control. Use environment variables or a secrets manager.', approach: 'Store API keys as constants in the application source code' }
  ]},
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_CONTENT_SECURITY_POLICY_MPI7', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'CSP with \'unsafe-inline\' in script-src defeats the purpose entirely — it allows inline script execution which is the main XSS vector CSP blocks.', approach: 'Set CSP with script-src \'unsafe-inline\' to allow inline scripts' }
  ]},

  // Architecture
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_EVENT_SOURCING_MPI7', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Event sourcing without event versioning makes schema evolution impossible. Always version events and handle backward compatibility.', approach: 'Store events without version numbers assuming the schema never changes' }
  ]},
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_SAGA_PATTERN_FOR_DISTRI_MPI7', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Choreography-based sagas without compensating transactions leave the system in inconsistent state on failure. Every step must have a compensating action.', approach: 'Implement saga steps without compensating rollback transactions' }
  ]},
  { idPrefix: 'RO_EVENT_SOURCING_001', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Using event sourcing for simple CRUD operations adds unnecessary complexity. Event sourcing is valuable for audit trails and complex state reconstruction, not basic data.', approach: 'Use event sourcing for a simple user profile CRUD API' }
  ]},
  { idPrefix: 'RO_EVENTUAL_CONSISTENCY_001', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Assuming eventual consistency means immediate consistency. Read-after-write to a different replica returns stale data. Use quorum reads for strong consistency needs.', approach: 'Read from any replica immediately after writing, expecting to see the update' }
  ]},
  { idPrefix: 'RO_CAP_THEOREM_001', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Treating CA as a valid CAP combination leads to false confidence. Network partitions are inevitable — you must choose between CP and AP in practice.', approach: 'Design a system for CA (consistency + availability) with no partition tolerance' }
  ]},

  // LLM / AI
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_PROMPT_ENGINEERING_PATT_MPI7', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Overly complex prompt templates with too many constraints confuse the model. Use clear, specific instructions with examples rather than rule lists.', approach: 'Write a long list of rules in the system prompt without examples' }
  ]},
  { idPrefix: 'RO_HOW_TO_EVALUATE_LLM_OUTPUT_QUALITY_MPI7', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Subjective human evaluation of LLM output without structured criteria leads to inconsistent quality assessment. Use automated metrics + rubric-based scoring.', approach: 'Manually review LLM outputs without predefined quality criteria' }
  ]},
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_RETRIEVAL_AUGMENTED_GEN_MPI7', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'RAG without chunking strategy and metadata filtering retrieves irrelevant context. Use semantic chunking + keyword/date/metadata pre-filtering.', approach: 'Feed entire documents as-is into the RAG retrieval pipeline without chunking' }
  ]},

  // Code patterns
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_STRUCTURED_LOGGING_FOR__MPI7', failures: [
    { outcome: 'failure', failure_type: 'anti_pattern', failure_description: 'Logging sensitive data (passwords, tokens, PII) in plaintext creates security and compliance risks. Always sanitize logs for sensitive fields.', approach: 'Log the full request body including passwords and tokens for debugging' }
  ]},
  { idPrefix: 'RO_HOW_TO_WRITE_INTEGRATION_TESTS_FOR_NODE__MPI7', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Integration tests that connect to a real production database are slow, fragile, and modify production data. Use testcontainers or in-memory DB.', approach: 'Write integration tests connecting directly to the production database' }
  ]},
  { idPrefix: 'RO_HOW_TO_MOCK_EXTERNAL_SERVICES_IN_TESTS_MPI7', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Mocking all external services in tests gives false confidence — the tests pass but production breaks. Use contract tests or integration tests for critical paths.', approach: 'Mock every external API call in integration tests for full coverage' }
  ]},
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_TDD_DOT_MPI7', failures: [] }, // safe skip
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_FEATURE_FLAGS_FOR_GRADU_MPI7', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Permanent feature flags without removal deadlines create technical debt and code complexity. Always track flag lifetime and plan removal.', approach: 'Add feature flags with no plan to remove them after the feature is stable' }
  ]},
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_ZERO_DOWNTIME_MIGRATION_MPI7', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'Zero-downtime migration without backward-compatible schema changes causes old code to fail. Use expand-migrate-contract pattern: add new, migrate, remove old.', approach: 'Drop the old column in the same migration as adding the replacement column' }
  ]},
  { idPrefix: 'RO_HOW_TO_SET_UP_CI_CD_FOR_A_NODE_JS_APPLIC_MPI7', failures: [
    { outcome: 'failure', failure_type: 'missing_step', failure_description: 'CI pipeline that only runs on main branch misses issues until code is merged. Run linting, tests, and type checking on every PR branch.', approach: 'Only run CI checks on the main branch after merge' }
  ]},
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_RESPONSIVE_IMAGES_FOR_P_MPI7', failures: [] }, // skip
  { idPrefix: 'RO_HOW_TO_IMPLEMENT_REQUEST_LOGGING_AND_TRA_MPI7', failures: [
    { outcome: 'failure', failure_type: 'wrong_assumption', failure_description: 'Logging every request synchronously in the request path blocks the event loop under load. Use async logging or offload to a background queue.', approach: 'Log each request synchronously using console.log in the middleware' }
  ]},
];

async function main() {
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of FAILURE_MAP) {
    if (entry.failures.length === 0) { skipped++; continue; }

    try {
      // Fetch current object
      const getResp = await fetch(`${API}/api/reasoning/${entry.idPrefix}`);
      if (!getResp.ok) { console.log(`[SKIP] ${entry.idPrefix} (${getResp.status})`); skipped++; continue; }
      const obj = (await getResp.json()).data;
      if (!obj) { console.log(`[SKIP] ${entry.idPrefix} (no data)`); skipped++; continue; }

      // Add attempts
      obj.attempts = entry.failures;

      // Update via POST
      const postResp = await fetch(`${API}/api/reasoning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
      });
      if (postResp.ok) {
        console.log(`[OK]   ${entry.idPrefix} → ${entry.failures.length} failures`);
        updated++;
      } else {
        const err = await postResp.text();
        console.log(`[FAIL] ${entry.idPrefix}: ${postResp.status} ${err.slice(0, 100)}`);
        failed++;
      }
    } catch (e) {
      console.log(`[ERR]  ${entry.idPrefix}: ${e.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${updated} updated, ${skipped} skipped, ${failed} failed`);
}

main().catch(console.error);
