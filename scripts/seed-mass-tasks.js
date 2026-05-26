// scripts/seed-mass-tasks.js — 400 pressure tasks for multi-agent competition
// Run: node scripts/seed-mass-tasks.js
// Generates tasks across: easy, medium, conflict, hallucination-trap, stale-memory-trap

const API = process.env.SELF_URL || 'http://127.0.0.1:3000';
const AGENT_ID = 'mass-seeder';
const fs = require('fs');
const path = require('path');
const rc = require('../lib/resolve-cache');

const DOMAINS = ['android', 'node', 'python', 'docker', 'kubernetes', 'linux', 'webpack', 'babel', 'typescript', 'react', 'rust', 'go', 'postgres', 'nginx', 'redis', 'aws', 'git', 'ci/cd', 'security', 'performance'];

// --- Problem templates ---

const TEMPLATES_EASY = [
  { problem: 'How to fix a missing semicolon in JavaScript?', solution: 'Add semicolon at end of statement. Use linter to auto-detect.', tags: ['javascript', 'syntax'] },
  { problem: 'Why is my CSS class not applying?', solution: 'Check specificity, typo in class name, or CSS order. Use browser inspector.', tags: ['css', 'styling'] },
  { problem: 'How to check Node.js version?', solution: 'Run `node --version` in terminal.', tags: ['node', 'cli'] },
  { problem: 'What port does PostgreSQL default to?', solution: '5432', tags: ['postgres', 'config'] },
  { problem: 'How to install a package with npm?', solution: 'Run `npm install <package-name>`', tags: ['npm', 'package-management'] },
  { problem: 'How to check if a file exists in Node?', solution: 'Use fs.existsSync() or fs.access()', tags: ['node', 'filesystem'] },
  { problem: 'How to log a variable in Python?', solution: 'Use print(variable) or logging module', tags: ['python', 'debugging'] },
  { problem: 'How to create a directory in Linux?', solution: 'Run `mkdir <dirname>`', tags: ['linux', 'cli'] },
  { problem: 'How to stop a running Docker container?', solution: 'Run `docker stop <container-id>`', tags: ['docker', 'containers'] },
  { problem: 'How to get current date in JavaScript?', solution: 'Use `new Date().toISOString()`', tags: ['javascript', 'date'] },
  { problem: 'Why does my import fail in TypeScript?', solution: 'Check tsconfig paths, module resolution, and file extension.', tags: ['typescript', 'import'] },
  { problem: 'How to push to a git branch?', solution: 'Run `git push origin <branch-name>`', tags: ['git', 'cli'] },
  { problem: 'How to view recent git commits?', solution: 'Run `git log --oneline -10`', tags: ['git', 'history'] },
  { problem: 'What does npm install --save-dev do?', solution: 'Installs package as dev dependency in package.json', tags: ['npm', 'dependencies'] },
  { problem: 'How to check used disk space on Linux?', solution: 'Run `df -h`', tags: ['linux', 'disk'] },
  { problem: 'How to create an array in Python?', solution: 'Use `my_list = []`', tags: ['python', 'basics'] },
  { problem: 'How to set environment variable in bash?', solution: 'Run `export KEY=value`', tags: ['bash', 'environment'] },
  { problem: 'How to restart nginx service?', solution: 'Run `sudo systemctl restart nginx`', tags: ['nginx', 'service'] },
  { problem: 'How to check if port is listening?', solution: 'Run `ss -tlnp` or `netstat -tlnp`', tags: ['linux', 'networking'] },
  { problem: 'How to format code in VS Code?', solution: 'Press Shift+Alt+F (Windows) or Cmd+Shift+F (Mac)', tags: ['vscode', 'formatting'] },
];

const TEMPLATES_MEDIUM = [
  { problem: 'Android PTY deadlock when using ProcessBuilder with large stdout', solution: 'Use separate threads to drain stdout/stderr before waitFor().', tags: ['android', 'java', 'process'], difficulty: 'intermediate' },
  { problem: 'Node.js heap out of memory on large CSV parse', solution: 'Use streams instead of loading entire file. Pipe through readline.', tags: ['node', 'memory', 'streams'], difficulty: 'intermediate' },
  { problem: 'Docker build fails with "no space left on device" for dev image', solution: 'Clean Docker cache: docker builder prune, remove unused images.', tags: ['docker', 'disk', 'build'], difficulty: 'intermediate' },
  { problem: 'Postgres query suddenly slow after adding index', solution: 'Check for unused/conflicting indexes. ANALYZE to update stats.', tags: ['postgres', 'performance', 'indexing'], difficulty: 'intermediate' },
  { problem: 'Webpack build extremely slow on large TypeScript monorepo', solution: 'Use swc-loader instead of ts-loader. Enable cache. Parallelize.', tags: ['webpack', 'typescript', 'build'], difficulty: 'intermediate' },
  { problem: 'Python multiprocessing deadlock on shared dict', solution: 'Use Manager.dict() or multiprocessing.Queue instead of shared state.', tags: ['python', 'concurrency', 'deadlock'], difficulty: 'intermediate' },
  { problem: 'Nginx 502 bad gateway on high traffic', solution: 'Increase worker_connections, adjust proxy buffers, check upstream limits.', tags: ['nginx', 'performance', 'proxy'], difficulty: 'intermediate' },
  { problem: 'React useEffect infinite loop when fetching data', solution: 'Fix dependency array. Use useCallback for fetch function.', tags: ['react', 'hooks', 'performance'], difficulty: 'intermediate' },
  { problem: 'Git merge conflict in lock files', solution: 'Use git merge --no-commit, then regenerate lock files.', tags: ['git', 'merge', 'conflicts'], difficulty: 'intermediate' },
  { problem: 'AWS S3 bucket suddenly returning 403', solution: 'Check IAM policy, bucket policy, block public access settings, and region endpoint.', tags: ['aws', 's3', 'permissions'], difficulty: 'intermediate' },
  { problem: 'Kubernetes pod stuck in CrashLoopBackOff', solution: 'Check logs with kubectl logs, resource limits, and liveness probe config.', tags: ['kubernetes', 'pods', 'debugging'], difficulty: 'intermediate' },
  { problem: 'Rust borrow checker issue with self-referential struct', solution: 'Use Pin, Rc<RefCell<>>, or restructure ownership.', tags: ['rust', 'borrow-checker', 'ownership'], difficulty: 'intermediate' },
  { problem: 'Go goroutine leak on long-running service', solution: 'Use context.WithCancel, ensure goroutines exit on context.Done().', tags: ['go', 'concurrency', 'goroutine'], difficulty: 'intermediate' },
  { problem: 'Redis memory usage spikes under moderate load', solution: 'Check maxmemory-policy, use eviction, optimize key sizes.', tags: ['redis', 'memory', 'performance'], difficulty: 'intermediate' },
  { problem: 'CI/CD pipeline failing on flaky integration test', solution: 'Add retry logic, isolate test data, use deterministic ordering.', tags: ['ci/cd', 'testing', 'flakiness'], difficulty: 'intermediate' },
  { problem: 'TypeScript type inference fails on complex generics', solution: 'Use explicit type annotations, reduce nesting of conditional types.', tags: ['typescript', 'generics', 'types'], difficulty: 'intermediate' },
  { problem: 'Docker compose networking: services cant resolve hostnames', solution: 'Use service name as hostname within same docker-compose network.', tags: ['docker', 'networking', 'compose'], difficulty: 'intermediate' },
  { problem: 'Node.js EventEmitter memory leak warning', solution: 'Increase default maxListeners or ensure proper cleanup with removeListener.', tags: ['node', 'events', 'memory'], difficulty: 'intermediate' },
  { problem: 'Python asyncio task not cancelling on timeout', solution: 'Use asyncio.wait_for with shield() for critical sections.', tags: ['python', 'asyncio', 'timeout'], difficulty: 'intermediate' },
  { problem: 'Android app crashing on configuration change', solution: 'Use ViewModel + SavedStateHandle for state persistence across config changes.', tags: ['android', 'lifecycle', 'crash'], difficulty: 'intermediate' },
  { problem: 'Babel transpilation produces wrong output for optional chaining', solution: 'Ensure @babel/plugin-proposal-optional-chaining is included.', tags: ['babel', 'transpilation', 'javascript'], difficulty: 'intermediate' },
  { problem: 'Nginx rate limiting not working as expected', solution: 'Use zone with limit_req_zone, check burst and nodelay parameters.', tags: ['nginx', 'rate-limit', 'security'], difficulty: 'intermediate' },
  { problem: 'CSS Grid not working in Safari', solution: 'Add -webkit- prefix or use autoprefixer in build step.', tags: ['css', 'safari', 'compatibility'], difficulty: 'intermediate' },
  { problem: 'Kubernetes Ingress not routing to service', solution: 'Check ingress annotations, service type (ClusterIP), and path patterns.', tags: ['kubernetes', 'ingress', 'routing'], difficulty: 'intermediate' },
  { problem: 'Node process.exit not exiting gracefully', solution: 'Handle SIGTERM/SIGINT, close connections in process.on handlers.', tags: ['node', 'process', 'graceful-shutdown'], difficulty: 'intermediate' },
  { problem: 'Postgres connection pool exhaustion', solution: 'Increase pool max, check for unclosed connections, use connection timeout.', tags: ['postgres', 'pool', 'connections'], difficulty: 'intermediate' },
  { problem: 'React app bundle size too large', solution: 'Use code splitting, dynamic imports, analyze bundle with webpack-bundle-analyzer.', tags: ['react', 'bundle', 'performance'], difficulty: 'intermediate' },
  { problem: 'Git submodule update fails with detached HEAD', solution: 'Use `git submodule update --init --recursive --remote`', tags: ['git', 'submodules', 'version-control'], difficulty: 'intermediate' },
  { problem: 'Docker container exits immediately after start', solution: 'Check ENTRYPOINT/CMD, ensure process runs in foreground.', tags: ['docker', 'containers', 'entrypoint'], difficulty: 'intermediate' },
  { problem: 'AWS CloudFront cache not invalidating', solution: 'Use wildcard invalidation /* or versioned URLs.', tags: ['aws', 'cloudfront', 'cache'], difficulty: 'intermediate' },
];

const TEMPLATES_CONFLICT = [
  { problem: 'Node version mismatch between dev and prod', solutionA: 'Use .nvmrc and nvm use', solutionB: 'Add engines field to package.json', tags: ['node', 'version', 'conflict'], conflict: true },
  { problem: 'Dockerfile COPY vs ADD for package files', solutionA: 'COPY is preferred — more explicit', solutionB: 'ADD auto-extracts archives', tags: ['docker', 'dockerfile', 'best-practice'], conflict: true },
  { problem: 'CSS reset: normalize.css vs reset.css', solutionA: 'normalize.css preserves useful defaults', solutionB: 'reset.css removes all defaults for consistency', tags: ['css', 'reset', 'styling'], conflict: true },
  { problem: 'Mutex vs semaphore for thread safety', solutionA: 'Mutex for exclusive access to single resource', solutionB: 'Semaphore for limited concurrent access (counting)', tags: ['concurrency', 'synchronization', 'conflict'], conflict: true },
  { problem: 'Database migration: raw SQL vs ORM', solutionA: 'Raw SQL for performance and control', solutionB: 'ORM for safety and portability', tags: ['database', 'migration', 'conflict'], conflict: true },
  { problem: 'Error handling: exceptions vs error codes', solutionA: 'Exceptions for exceptional cases', solutionB: 'Error codes for predictable failures', tags: ['error-handling', 'architecture', 'conflict'], conflict: true },
  { problem: 'Config management: env vars vs config files', solutionA: 'env vars for 12-factor app compliance', solutionB: 'config files for complex structures', tags: ['config', 'architecture', 'conflict'], conflict: true },
  { problem: 'State management: Redux vs Context API', solutionA: 'Redux for complex state with middleware', solutionB: 'Context API for simpler needs, less boilerplate', tags: ['react', 'state', 'conflict'], conflict: true },
  { problem: 'Testing: unit tests vs integration tests priority', solutionA: 'Focus on unit tests for fast feedback', solutionB: 'Focus on integration tests for real coverage', tags: ['testing', 'strategy', 'conflict'], conflict: true },
  { problem: 'Validation: client-side vs server-side', solutionA: 'Client-side for UX, but never trust alone', solutionB: 'Server-side is the only real validation', tags: ['validation', 'security', 'conflict'], conflict: true },
  { problem: 'Docker networking: bridge vs host mode', solutionA: 'Bridge for isolation and port mapping', solutionB: 'Host for performance and direct access', tags: ['docker', 'networking', 'conflict'], conflict: true },
  { problem: 'Logging: structured (JSON) vs human-readable', solutionA: 'Structured for machine parsing and log aggregation', solutionB: 'Human-readable for quick debugging', tags: ['logging', 'format', 'conflict'], conflict: true },
  { problem: 'API design: REST vs GraphQL for new service', solutionA: 'REST for simplicity and cacheability', solutionB: 'GraphQL for flexibility and reduced overfetching', tags: ['api', 'design', 'conflict'], conflict: true },
  { problem: 'CI: monorepo vs multi-repo strategy', solutionA: 'Monorepo for shared tooling and atomic changes', solutionB: 'Multi-repo for team autonomy and clear boundaries', tags: ['ci/cd', 'repository', 'conflict'], conflict: true },
  { problem: 'Process management: PM2 vs systemd for Node', solutionA: 'PM2 for developer-friendly clustering', solutionB: 'systemd for OS-level service management', tags: ['node', 'process', 'conflict'], conflict: true },
  { problem: 'Node package: CommonJS vs ES Modules', solutionA: 'CJS for compatibility with older packages', solutionB: 'ESM for future-proofing and tree-shaking', tags: ['node', 'modules', 'conflict'], conflict: true },
  { problem: 'Async: callbacks vs promises vs async/await', solutionA: 'async/await for readability and error handling', solutionB: 'Promises for composability and chaining', tags: ['async', 'javascript', 'conflict'], conflict: true },
  { problem: 'Type safety: TypeScript vs JSDoc', solutionA: 'TypeScript for full type system', solutionB: 'JSDoc for lighter setup with vanilla JS', tags: ['typescript', 'jsdoc', 'conflict'], conflict: true },
  { problem: 'Container base images: Alpine vs Debian slim', solutionA: 'Alpine for minimal size', solutionB: 'Debian slim for compatibility and libc', tags: ['docker', 'base-image', 'conflict'], conflict: true },
  { problem: 'Going left or right at a fork in the AI alignment road', solutionA: 'Alignment by corrigibility and human oversight', solutionB: 'Alignment by value learning from human behavior', tags: ['ai', 'alignment', 'conflict', 'meta'], conflict: true },
];

const TEMPLATES_HALLUCINATION = [
  { problem: 'Windows BSOD on Node fs.readFile — how to fix?', trap: 'fs.readFile does not cause BSOD. Check hardware/driver issues.', tags: ['windows', 'trap'] },
  { problem: 'Python GIL bypass by deleting __gil__ attribute', trap: 'GIL cannot be bypassed by deleting attributes. Use multiprocessing.', tags: ['python', 'trap'] },
  { problem: 'Docker container with --cpus=999 to maximize performance', trap: 'max CPU limited by host cores. Setting > host cores is ignored.', tags: ['docker', 'trap'] },
  { problem: 'useEffect with async function by adding async keyword', trap: 'useEffect callback cannot be async directly. Create inner async function.', tags: ['react', 'trap'] },
  { problem: 'Reboot production server weekly to clear memory leak', trap: 'Rebooting masks the problem. Find and fix the actual leak.', tags: ['devops', 'trap'] },
  { problem: 'Set worker_connections to 999999 in nginx', trap: 'Limited by ulimit -n and system resources.', tags: ['nginx', 'trap'] },
  { problem: 'Delete node_modules to fix all npm issues', trap: 'Only fixes corrupted installs. Rarely the actual solution.', tags: ['npm', 'trap'] },
  { problem: 'Rewrite entire codebase in Rust for speed', trap: 'Extreme overkill. Profile first, optimize bottlenecks.', tags: ['rust', 'trap'] },
  { problem: 'Set PostgreSQL shared_buffers to 90% of RAM', trap: 'Above ~25% causes performance degradation due to OS caching conflict.', tags: ['postgres', 'trap'] },
  { problem: 'Use --force flag on every git push', trap: 'Force pushing overwrites remote history. Use with extreme caution.', tags: ['git', 'trap'] },
  { problem: 'Reinstall Ubuntu to fix npm permission error', trap: 'npm permission errors fixed with nvm or prefix config.', tags: ['ubuntu', 'trap', 'npm'] },
  { problem: 'Switch all services to IPv6 to solve latency', trap: 'IPv6 does not inherently reduce latency. Network topology matters.', tags: ['networking', 'trap'] },
  { problem: 'Use eval() to parse JSON faster than JSON.parse', trap: 'eval is dangerous and slower. Always use JSON.parse.', tags: ['javascript', 'security', 'trap'] },
  { problem: 'Set ulimit -n unlimited to fix any file descriptor issue', trap: 'unlimited not supported on most systems. Set reasonable limit.', tags: ['linux', 'trap'] },
  { problem: 'Convert all for-loops to recursion for readability', trap: 'Recursion risks stack overflow. Not inherently more readable.', tags: ['javascript', 'trap'] },
  { problem: 'Create 100 microservices for a todo app', trap: 'Massive over-engineering. Monolith first, split when needed.', tags: ['architecture', 'trap'] },
  { problem: 'Use __proto__ for prototypal inheritance in modern JS', trap: '__proto__ is deprecated. Use Object.create or class syntax.', tags: ['javascript', 'trap'] },
  { problem: 'Disable all security warnings in production', trap: 'Security warnings exist for a reason. Fix root cause.', tags: ['security', 'trap'] },
  { problem: 'Add console.log after every line for debugging', trap: 'Use debugger/breakpoints. console.log pollution is ineffective.', tags: ['debugging', 'trap'] },
  { problem: 'Set TTL to 0 for DNS to always get latest IP', trap: 'TTL=0 causes excessive DNS lookups, hurts performance.', tags: ['dns', 'trap'] },
  { problem: 'Reinstall Python to fix pip install stuck', trap: 'Check network, proxy, or use --timeout flag.', tags: ['python', 'pip', 'trap'] },
  { problem: 'Use global variables to simplify state sharing', trap: 'Global state causes tight coupling and testing difficulty.', tags: ['architecture', 'trap'] },
  { problem: 'Mount /tmp as tmpfs with size=0 to save disk', trap: 'size=0 will cause immediate ENOSPC errors.', tags: ['linux', 'trap'] },
  { problem: 'Set permissions 777 on all files for development', trap: 'Security risk. Use proper user/group permissions.', tags: ['linux', 'permissions', 'trap'] },
  { problem: 'Fix merge conflicts by deleting both conflicting branches', trap: 'Loses work. Properly resolve conflicts instead.', tags: ['git', 'trap'] },
];

const TEMPLATES_STALE = [
  { problem: 'How to use React componentWillMount in 2025?', trap: 'componentWillMount is deprecated since React 17. Use constructor or useEffect.', tags: ['react', 'stale', 'deprecated'], stale: 'componentWillMount' },
  { problem: 'How to use jQuery for DOM manipulation in new app?', trap: 'Modern frameworks (React, Vue) handle DOM. jQuery unnecessary.', tags: ['jquery', 'stale'], stale: 'jquery' },
  { problem: 'How to install global npm packages without sudo?', trap: 'Use nvm to manage Node installations, avoid global packages.', tags: ['npm', 'stale'], stale: 'sudo npm' },
  { problem: 'How to use async: false in jQuery AJAX?', trap: 'jQuery AJAX with async:false is deprecated. Use async/await with fetch.', tags: ['jquery', 'ajax', 'stale'], stale: 'async false' },
  { problem: 'How to use gulp for build pipeline?', trap: 'Gulp is outdated. Use webpack, vite, or esbuild.', tags: ['build', 'stale'], stale: 'gulp' },
  { problem: 'How to configure babel with .babelrc?', trap: 'Babel 7+ uses babel.config.js. .babelrc is per-file, not recommended.', tags: ['babel', 'stale'], stale: 'babelrc' },
  { problem: 'How to create React components with createClass?', trap: 'createClass was removed in React 16. Use class or function components.', tags: ['react', 'stale'], stale: 'createClass' },
  { problem: 'How to use Grunt for task running?', trap: 'Grunt is legacy. Use npm scripts or modern task runners.', tags: ['build', 'stale'], stale: 'grunt' },
  { problem: 'How to use Bower for frontend packages?', trap: 'Bower is deprecated. Use npm or yarn with bundler.', tags: ['package-management', 'stale'], stale: 'bower' },
  { problem: 'How to configure Browserify for bundling?', trap: 'Browserify is outdated. Use webpack, rollup, or esbuild.', tags: ['bundling', 'stale'], stale: 'browserify' },
  { problem: 'How to use componentDidUpdate for side effects?', trap: 'Use useEffect hook with dependencies for function components.', tags: ['react', 'stale'], stale: 'componentDidUpdate' },
  { problem: 'How to use Yarn v1 workspaces?', trap: 'Yarn v1 is in maintenance mode. Use npm workspaces or pnpm.', tags: ['yarn', 'stale'], stale: 'yarn v1' },
  { problem: 'How to use Enzyme for React testing?', trap: 'Enzyme is unmaintained since React 18. Use React Testing Library.', tags: ['testing', 'react', 'stale'], stale: 'enzyme' },
  { problem: 'How to configure Mocha + Chai for testing?', trap: 'Mocha ecosystem is legacy. Use Vitest, Jest, or Node test runner.', tags: ['testing', 'stale'], stale: 'mocha chai' },
  { problem: 'How to use Redux connect() with mapStateToProps?', trap: 'Use React-Redux hooks (useSelector, useDispatch) instead of connect().', tags: ['redux', 'react', 'stale'], stale: 'connect HOC' },
  { problem: 'How to use XMLHttpRequest for API calls?', trap: 'Use fetch() API, which is built-in and Promise-based.', tags: ['http', 'stale'], stale: 'XHR' },
  { problem: 'How to configure webpack 4 optimization?', trap: 'Webpack 5 is current. Upgrade and use built-in optimizations.', tags: ['webpack', 'stale'], stale: 'webpack 4' },
  { problem: 'How to use PropTypes for type checking?', trap: 'TypeScript is the standard now. PropTypes only for legacy JS libs.', tags: ['react', 'types', 'stale'], stale: 'PropTypes' },
  { problem: 'How to use CORS with Express cors package?', trap: 'Use the cors middleware, not manual headers for complex needs.', tags: ['express', 'stale'], stale: 'manual cors' },
  { problem: 'How to deploy with FTP to production?', trap: 'Use CI/CD pipelines (GitHub Actions, GitLab CI) with zero-downtime deploys.', tags: ['deploy', 'stale'], stale: 'FTP deploy' },
];

// --- Generator ---

function generateTasks(templates, count, type, defaultDifficulty) {
  const tasks = [];
  for (let i = 0; i < count; i++) {
    const t = templates[i % templates.length];
    const domain = DOMAINS[i % DOMAINS.length];
    const id = `MASS-${type.toUpperCase()}-${String(i + 1).padStart(3, '0')}`;
    tasks.push({
      id,
      type: 'REQUEST',
      problem: t.problem + ' (seed ' + id + ')',
      difficulty: t.difficulty || defaultDifficulty || 'beginner',
      estimated_tokens: 150 + Math.round(Math.random() * 350),
      tags: [...(t.tags || []), type, domain],
      project: 'mass-seed',
      source_url: null,
      machine_actionable: true,
      status: 'OPEN',
    });
  }
  return tasks;
}

function generateHints(templates, tasks) {
  const hints = {};
  tasks.forEach((task, i) => {
    const t = templates[i % templates.length];
    // Create slightly varying solution summaries
    const summary = t.solution || t.solutionA || t.solution || 'Resolve via standard approach.';
    const altSummary = t.solutionB || null;
    const reasoningId = `RO_MASS_${Date.now().toString(36).toUpperCase()}_${task.id.slice(0, 8)}`;
    hints[task.id] = {
      hit: true,
      reasoning_id: reasoningId,
      solution_summary: altSummary && Math.random() > 0.5 ? altSummary : summary,
      message: `Mass seed hint for ${task.id}`,
      estimated_token_savings: Math.round(200 + Math.random() * 800),
      domain: task.tags[task.tags.length - 2] || 'general',
      score: 1.0,
      status: 'active',
      success_count: 0, failure_count: 0, citation_count: 0, used_by: [],
      agent_stats: {},
      updated_at: new Date().toISOString(),
    };
  });
  return hints;
}

// --- SEED ---

async function seedViaApi(tasks, hints) {
  // 1. Store tasks via API
  for (const task of tasks) {
    try {
      await fetch(`${API}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Agent-ID': AGENT_ID },
        body: JSON.stringify(task),
      });
    } catch (e) {
      // fallback: store directly
    }
  }

  // 2. Inject hints into resolve cache
  for (const [taskId, hint] of Object.entries(hints)) {
    rc.setHint(taskId, hint);
  }

  // 3. Optionally store reasoning objects
  for (const task of tasks) {
    const hint = hints[task.id];
    if (!hint) continue;
    try {
      await fetch(`${API}/api/reasoning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Agent-ID': AGENT_ID },
        body: JSON.stringify({
          id: hint.reasoning_id,
          problem_id: task.id,
          problem_statement: task.problem,
          solution_summary: hint.solution_summary,
          domain: hint.domain,
          difficulty: task.difficulty,
          attempts: [{ agent_id: 'mass-seeder', outcome: 'success', approach: 'preseeded', result: hint.solution_summary, confidence: 0.7 }],
          solution: { summary: hint.solution_summary, key_insights: [hint.message], consensus_score: 0.7 },
          meta: { source: 'mass-seeder', task_id: task.id, mass_seed: true, generated_at: new Date().toISOString() },
        }),
      });
    } catch {}
  }
}

// --- MAIN ---

async function main() {
  console.log('Generating 400 mass seed tasks...');

  const tasks = [
    ...generateTasks(TEMPLATES_EASY, 80, 'easy', 'beginner'),
    ...generateTasks(TEMPLATES_MEDIUM, 120, 'medium', 'intermediate'),
    ...generateTasks(TEMPLATES_CONFLICT, 100, 'conflict', 'advanced'),
    ...generateTasks(TEMPLATES_HALLUCINATION, 50, 'hallucination', 'beginner'),
    ...generateTasks(TEMPLATES_STALE, 50, 'stale', 'beginner'),
  ];

  console.log(`Generated ${tasks.length} tasks`);

  const hints = {
    ...generateHints(TEMPLATES_EASY, tasks.slice(0, 80)),
    ...generateHints(TEMPLATES_MEDIUM, tasks.slice(80, 200)),
    ...generateHints(TEMPLATES_CONFLICT, tasks.slice(200, 300)),
    ...generateHints(TEMPLATES_HALLUCINATION, tasks.slice(300, 350)),
    ...generateHints(TEMPLATES_STALE, tasks.slice(350, 400)),
  };

  console.log(`Generated ${Object.keys(hints).length} hints`);

  // Write to JSON as backup
  const outputPath = path.join(__dirname, '..', 'data', 'mass-seed.json');
  fs.writeFileSync(outputPath, JSON.stringify({ tasks, hints, generated_at: new Date().toISOString() }, null, 2));
  console.log(`Backup written to ${outputPath}`);

  // Seed via API + resolve cache
  await seedViaApi(tasks, hints);
  console.log('Seeding complete.');
  console.log(`Tasks seeded: ${tasks.length}`);
  console.log(`Categories: easy=80, medium=120, conflict=100, hallucination=50, stale=50`);
}

main().catch(console.error);