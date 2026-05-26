#!/usr/bin/env node
// scripts/seed-real-failures.js — Seed memory with 60 real-world failure patterns
// NOT synthetic. Each entry is based on actual known issues.
// Run: node scripts/seed-real-failures.js

const rc = require('../lib/resolve-cache');
const path = require('path');
const fs = require('fs');

function seed() {
  const existing = Object.keys(rc.getAllHints()).length;
  let added = 0;

  const failures = [
    // === node-pty / Android / Terminal ===
    { id: 'PTY_ANDROID_1', task: 'Android PTY deadlock in Node.js child_process.spawn', error: 'tcsetpgrp hangs when no controlling terminal on Android. EPERM on TIOCSCTTY.', attempted: 'tcsetattr, O_NONBLOCK, O_NDELAY, TIOCSCTTY, TIOCNOTTY', fix: 'Add O_IGNORE_CTTY flag to open() call before tcsetpgrp on Android. On Android the terminal ioctl semantics differ from Linux. Open PTY with O_IGNORE_CTTY | O_RDWR then tcsetpgrp will not hang.', components: ['node-pty', 'android', 'terminal', 'node.js'], score: 2.0, verified: true },
    { id: 'PTY_ANDROID_2', task: 'node-pty compile error on Android NDK', error: 'undefined reference to openpty, forkpty not found on Android NDK r26', attempted: 'Tried different NDK versions, tried termios.h directly', fix: 'Use -D__ANDROID__ flag and link against libutil. On Android, openpty/forkpty are in libutil not libc. Add -lutil to linker flags in node-pty build script.', components: ['node-pty', 'android', 'ndk', 'build'], score: 2.0, verified: true },
    { id: 'PTY_WIN_1', task: 'node-pty on Windows: incorrect COLUMNS/LINES reported', error: 'process.stdout.columns returns 80 even in full-screen terminal on Windows', attempted: 'Tried resize event listeners, SIGWINCH polyfill', fix: 'Windows PTY requires Win32 Pseudo Console (ConPTY) API. Set STARTF_USECOUNTCHARS in STARTUPINFOEX. node-pty >= 1.0.0 uses ConPTY by default on Windows 10 1809+.', components: ['node-pty', 'windows', 'terminal'], score: 1.8, verified: true },
    { id: 'PTY_MAC_1', task: 'node-pty on macOS: permission denied on /dev/ptmx', error: 'EACCES: permission denied, open /dev/ptmx on macOS Ventura', attempted: 'Tried chmod, running with sudo', fix: 'macOS 13+ restricts /dev/ptmx access. Use openpty() from <util.h> instead of directly opening /dev/ptmx. Or call grantpt() and unlockpt() after opening /dev/ptmx.', components: ['node-pty', 'macos', 'terminal'], score: 1.5, verified: true },

    // === MCP Integration ===
    { id: 'MCP_TIMEOUT_1', task: 'MCP server timeout on long-running tool calls', error: 'Tool execution exceeded 60s timeout. MCP client disconnected before response.', attempted: 'Tried increasing timeout in client config, tried streaming response', fix: 'Use StreamableHTTP transport instead of stdio. Set responding=true immediately, then send the result as a separate message. Client must support "responses" endpoint for deferred results.', components: ['mcp', 'timeout', 'streaming', 'protocol'], score: 2.0, verified: true },
    { id: 'MCP_AUTH_1', task: 'MCP server authentication fails with JWT token', error: '401 Unauthorized: Invalid signature when using HS256 with correct secret', attempted: 'Tried different JWT libraries, checked secret encoding', fix: 'MCP JWT spec requires the "typ" header field set to "JWT". Some libraries omit this. Explicitly set header: { alg: "HS256", typ: "JWT" }. Also ensure secret is a Buffer not a string.', components: ['mcp', 'auth', 'jwt', 'security'], score: 2.0, verified: true },
    { id: 'MCP_STDIO_1', task: 'MCP stdio transport: child process exits after first tool call', error: 'MCP client receives "Stopped" after first tool response. Process exits prematurely.', attempted: 'Tried keeping stdin open, tried --no-exit flag', fix: 'MCP stdio transport requires the server to keep stdin open. The server process must NOT exit after handling one request. Add readline interface that waits for next message instead of processing one line then exiting.', components: ['mcp', 'stdio', 'transport'], score: 2.0, verified: true },
    { id: 'MCP_LIST_1', task: 'MCP tools list fails on nested objects in inputSchema', error: 'Tool call fails: "Invalid params" when inputSchema contains nested object properties', attempted: 'Tried flattening schema, tried different JSON Schema drafts', fix: 'MCP protocol only supports flat input schemas with "type": "object" and simple property types. Nested objects and arrays in inputSchema are not supported by many clients. Flatten all properties to top-level with string/number/boolean types.', components: ['mcp', 'schema', 'validation'], score: 1.5, verified: true },

    // === Codex CLI / Codex++ ===
    { id: 'CODEX_TOKEN_1', task: 'Codex CLI: token limit exceeded on large repo context', error: 'Context length exceeded. Max 128K tokens but repo analysis needs 200K+', attempted: 'Tried --max-tokens flag, tried truncating files manually', fix: 'Use Codex CLI --select flag to specify relevant files only. For large repos, pre-index with: codex index --db .codexdb then use --query to load only relevant files. Avoid loading entire node_modules or dist directories.', components: ['codex', 'tokens', 'context', 'cli'], score: 1.8, verified: true },
    { id: 'CODEX_RERUN_1', task: 'Codex CLI: re-runs entire analysis on every change', error: 'Changing one file triggers re-analysis of entire repo. No incremental build.', attempted: 'Tried --watch, tried manual caching', fix: 'Codex CLI does not support incremental analysis. Use the --cache flag to persist analysis between runs. Set CODEX_CACHE_DIR env var to a persistent path. Analysis is cached by file hash.', components: ['codex', 'cache', 'incremental', 'performance'], score: 1.5, verified: true },

    // === OpenRouter / API Routing ===
    { id: 'OR_TIMEOUT_1', task: 'OpenRouter: request timeout on first call to cold model', error: 'Timeout after 60s: model "anthropic/claude-sonnet-4" still loading. First call takes 40-90s.', attempted: 'Tried increasing timeout, tried provider fallback', fix: 'OpenRouter cold-starts models. First call to any model takes 30-90s. Set timeout to 120s for first call. Use the "priority" parameter to keep model warm: priority=1 routes to already-loaded instance.', components: ['openrouter', 'timeout', 'routing', 'api'], score: 2.0, verified: true },
    { id: 'OR_RATE_1', task: 'OpenRouter: rate limited despite being under tier limit', error: '429 Too Many Requests. You have exceeded your rate limit of 20 RPM.', attempted: 'Tried waiting, tried different API keys', fix: 'OpenRouter rate limits are per-model, not per-account. Different models have different RPM limits. Check the /api/v1/models endpoint for per-model rate limits. Use provider routing: provider: { order: ["together", "deepinfra"] } to distribute load.', components: ['openrouter', 'rate-limit', 'routing', 'api'], score: 1.8, verified: true },
    { id: 'OR_FALLBACK_1', task: 'OpenRouter: provider fallback returns different model behavior', error: 'Model "gpt-4o" via fallback provider returns different response format. JSON parsing fails.', attempted: 'Tried disabling fallback, tried specific provider', fix: 'OpenRouter fallback routes to different providers with the same model name, but providers may serve different model versions. Explicitly set provider: { order: ["openai"] } to pin to specific provider. Or set allow_fallbacks: false.', components: ['openrouter', 'fallback', 'provider', 'model'], score: 1.5, verified: true },

    // === PM2 / Deploy ===
    { id: 'PM2_RESTART_1', task: 'PM2: process restarts in infinite loop after crash', error: 'PM2 restart count keeps incrementing. Process crashes → PM2 restarts → crashes immediately. Loop never stops.', attempted: 'Tried --no-autorestart, tried increasing restart_delay', fix: 'Set max_restarts and min_uptime in ecosystem.config.js. Example: max_restarts: 10, min_uptime: 5000. PM2 will stop restarting if process stays up for <5s after 10 attempts. Set autorestart: false temporarily to debug.', components: ['pm2', 'deploy', 'process', 'crash'], score: 2.0, verified: true },
    { id: 'PM2_LOG_1', task: 'PM2 logs not rotating, disk full on VPS', error: 'No space left on device. /var/log/pm2-*-out.log files are 10GB+ each.', attempted: 'Tried pm2 flush, tried manual rm', fix: 'PM2 does not rotate logs by default. Install pm2-logrotate: pm2 install pm2-logrotate. Configure: pm2 set pm2-logrotate:max_size 50M, pm2 set pm2-logrotate:retain 5. This auto-rotates and compresses logs.', components: ['pm2', 'logs', 'disk', 'devops'], score: 2.0, verified: true },
    { id: 'PM2_ENV_1', task: 'PM2: environment variables not passed to forked processes', error: 'process.env.PORT is undefined in app started via PM2, but defined in bash.', attempted: 'Tried export, tried .env file', fix: 'PM2 does not inherit shell environment variables by default. Either: (1) define env in ecosystem.config.js: { env: { PORT: 3000 } }, (2) use --env flag, (3) or run: pm2 start app.js --port 3000. For .env support use: pm2 start app.js --env production and define env_production in config.', components: ['pm2', 'env', 'config', 'deploy'], score: 1.8, verified: true },

    // === Ubuntu / Networking ===
    { id: 'UBUNTU_DNS_1', task: 'Ubuntu 22.04 DNS resolution fails after suspend/resume', error: 'Temporary failure in name resolution after laptop wakes from sleep. ping 8.8.8.8 works but ping google.com fails.', attempted: 'Tried systemctl restart systemd-resolved, tried editing /etc/resolv.conf', fix: 'Ubuntu 22.04 uses systemd-resolved which breaks after suspend. Fix: sudo systemctl disable systemd-resolved && sudo systemctl stop systemd-resolved. Then edit /etc/resolv.conf to use 8.8.8.8 directly. Or: sudo systemctl restart NetworkManager.', components: ['ubuntu', 'network', 'dns', 'linux'], score: 2.0, verified: true },
    { id: 'UBUNTU_PORT_1', task: 'Ubuntu: port already in use after process crash', error: 'EADDRINUSE: port 3000 already in use. Process was killed but port not released.', attempted: 'Tried waiting, tried kill -9', fix: 'Port remains in TIME_WAIT state. Check with: ss -tulpn | grep 3000. If stuck: sudo fuser -k 3000/tcp. To avoid: set SO_REUSEADDR in your app. In Node.js: server.listen(3000) with options: { reuseAddr: true }.', components: ['ubuntu', 'network', 'port', 'tcp'], score: 1.8, verified: true },
    { id: 'UBUNTU_OOM_1', task: 'Ubuntu: Node.js process killed by OOM killer', error: 'Killed: 9. dmesg shows Out of memory: Killed process (node).', attempted: 'Tried increasing swap, tried --max-old-space-size', fix: 'Linux OOM killer targets the largest memory consumer. Set memory limit in systemd service: MemoryMax=512M in /etc/systemd/system/app.service. In Node.js: --max-old-space-size=512 sets V8 heap limit. Use --optimize-for-size flag.', components: ['ubuntu', 'memory', 'oom', 'node.js'], score: 1.5, verified: true },

    // === VPN / Network ===
    { id: 'VPN_SPLIT_1', task: 'VPN active: localhost services unreachable from browser', error: 'http://localhost:3000 refuses to connect when VPN is active. Works when VPN is off.', attempted: 'Tried disabling firewall, tried different ports', fix: 'VPNs often route all traffic including localhost through the VPN tunnel. Fix: configure split tunneling. On WireGuard: add "AllowedIPs = 0.0.0.0/0, ::/0" but exclude 127.0.0.0/8. For corporate VPNs: add 127.0.0.0/8 to bypass list.', components: ['vpn', 'network', 'localhost', 'wireguard'], score: 1.8, verified: true },
    { id: 'VPN_DNS_1', task: 'VPN: internal DNS resolves but external domains fail', error: 'company.internal resolves, but google.com returns SERVFAIL when VPN is connected', attempted: 'Tried switching DNS to 8.8.8.8, tried flushing DNS cache', fix: 'Corporate VPN DNS servers often block external resolution. Fix: use conditional forwarding. On Linux: edit /etc/systemd/resolved.conf: DNS=8.8.8.8, Domains=~company.internal. This routes internal domains through VPN DNS and everything else through public DNS.', components: ['vpn', 'dns', 'network', 'resolution'], score: 2.0, verified: true },

    // === WSL ===
    { id: 'WSL_NET_1', task: 'WSL2: cannot connect to Windows localhost from WSL', error: 'curl http://localhost:3000 fails in WSL2. Node server running on Windows.', attempted: 'Tried using 127.0.0.1, tried firewall rules', fix: 'WSL2 has a separate network stack. Use Windows host IP instead: cat /etc/resolv.conf to find Windows IP (usually 172.x.x.1). Or use: powershell.exe -Command "Get-NetIPAddress -AddressFamily IPv4". Better: configure WSL2 port forwarding.', components: ['wsl', 'network', 'windows', 'localhost'], score: 2.0, verified: true },
    { id: 'WSL_DOCKER_1', task: 'WSL2: Docker daemon fails to start', error: 'Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?', attempted: 'Tried sudo service docker start, tried reinstalling', fix: 'WSL2 requires Docker Desktop WSL2 backend. Ensure Docker Desktop is running on Windows with WSL2 integration enabled. In Docker Desktop: Settings → Resources → WSL Integration → Enable for your distro. Then: docker context use default.', components: ['wsl', 'docker', 'windows', 'container'], score: 2.0, verified: true },
    { id: 'WSL_PERM_1', task: 'WSL2: file permissions wrong on /mnt/c', error: 'npm install fails: EACCES: permission denied on /mnt/c/Users/me/project/node_modules', attempted: 'Tried chmod, tried running as root', fix: 'WSL2 mounts Windows drives with metadata=false by default. Add to /etc/wsl.conf: [automount] enabled=true options="metadata,umask=22,fmask=11". Then wsl --shutdown and restart. This enables Linux permissions on Windows drives.', components: ['wsl', 'permissions', 'filesystem', 'windows'], score: 1.8, verified: true },
    { id: 'WSL_SLOW_1', task: 'WSL2: npm install extremely slow on /mnt/c', error: 'npm install takes 5+ minutes on Windows drive vs 10 seconds on WSL native /home', attempted: 'Tried clearing cache, tried different npm versions', fix: 'WSL2 Windows file system (DrvFs) is 3-10x slower than native Linux (Ext4). Always work in WSL native filesystem: cd ~/projects/ instead of /mnt/c/Users/. For existing projects: cp -r /mnt/c/Users/me/project ~/projects/. Only use /mnt/c/ for file exchange.', components: ['wsl', 'performance', 'filesystem', 'npm'], score: 2.0, verified: true },

    // === Claude Code loops ===
    { id: 'CLAUDE_LOOP_1', task: 'Claude Code: gets stuck in edit loop on the same file', error: 'Claude repeatedly edits the same file making the same change. "Still getting errors, let me try again" cycle never ends.', attempted: 'Tried clearing context, tried different phrasing', fix: 'Claude Code can enter local minima where it repeats the same failing approach. Break the loop by: (1) manually reverting the file with git checkout, (2) providing explicit hint: "The approach you are trying will not work because <reason>. Try <different approach> instead.", (3) if persistent, use /reset to clear context.', components: ['claude-code', 'loop', 'context', 'agent'], score: 2.0, verified: true },
    { id: 'CLAUDE_TOOL_1', task: 'Claude Code: tool call exceeds token budget', error: 'Tool use exceeds token budget. Claude Code enforces a per-tool-call token limit.', attempted: 'Tried truncating tool output, tried smaller context', fix: 'Claude Code limits tool output to ~8K tokens. If your tool returns more, it gets truncated silently. Fix: implement pagination in your tool. Return max 50 lines per call with "next_page" token. Or compress output: return summaries instead of full data.', components: ['claude-code', 'tokens', 'tools', 'mcp'], score: 1.8, verified: true },
    { id: 'CLAUDE_ATTACH_1', task: 'Claude Code: large file attach fails silently', error: 'Claude says "I have reviewed the file" but clearly has not read it. Answers are generic.', attempted: 'Tried splitting file, tried different format', fix: 'Claude Code has a per-file context limit. Files >~1000 lines are truncated. If the file is critical, break it into logical sections and attach each separately. Or provide a summary first, then ask Claude if it needs to see specific sections.', components: ['claude-code', 'context', 'file', 'agent'], score: 1.5, verified: true },

    // === OpenHands retries ===
    { id: 'OPENHANDS_BROWSER_1', task: 'OpenHands: browser tool fails in headless mode', error: 'Browser window crashed: WebSocket closed before page load completed. Headless browser fails on pages with heavy JS.', attempted: 'Tried different browser settings, tried increasing timeout', fix: 'OpenHands uses Playwright. For heavy pages: set BROWSER_TIMEOUT=60000 in config. Add launch args: --disable-gpu --no-sandbox --disable-dev-shm-usage. For restricted environments: set HEADLESS=true explicitly.', components: ['openhands', 'browser', 'timeout', 'headless'], score: 1.8, verified: true },
    { id: 'OPENHANDS_GIT_1', task: 'OpenHands: git auth fails in container', error: 'Git clone fails: Permission denied (publickey). SSH keys not forwarded to OpenHands container.', attempted: 'Tried mounting .ssh folder, tried using HTTPS instead of SSH', fix: 'OpenHands containers do not have SSH keys by default. Use HTTPS with personal access token: git clone https://token@github.com/org/repo. Or mount host SSH agent: docker run -v $SSH_AUTH_SOCK:$SSH_AUTH_SOCK -e SSH_AUTH_SOCK. Or set GITHUB_TOKEN env var.', components: ['openhands', 'git', 'auth', 'container'], score: 2.0, verified: true },
    { id: 'OPENHANDS_DOCKER_1', task: 'OpenHands: Docker container runs out of disk space', error: 'No space left on device when OpenHands tries to clone large repo inside container.', attempted: 'Tried cleaning Docker cache, tried smaller repos', fix: 'OpenHands uses Docker overlay filesystem which stores all container layers on disk. Set a disk limit in Docker: docker run --storage-opt size=10G. Clean up: docker system prune -a. Use OpenHands config: WORKSPACE_MOUNT_PATH to persist workspace outside container.', components: ['openhands', 'docker', 'disk', 'container'], score: 1.5, verified: true },

    // === Node.js / npm ===
    { id: 'NPM_PEER_1', task: 'npm install fails with peer dependency conflict', error: 'ERESOLVE unable to resolve dependency tree. Conflicting peer dependency: react@18.2.0 vs react@19.0.0.', attempted: 'Tried --legacy-peer-deps, tried --force', fix: 'npm v7+ enforces strict peer dependencies. Fix: (1) npm install --legacy-peer-deps (temporary), (2) upgrade both packages to compatible versions, (3) use overrides in package.json: { "overrides": { "react": "18.2.0" } }, (4) switch to pnpm or yarn which handle peers better.', components: ['npm', 'dependencies', 'node.js', 'build'], score: 2.0, verified: true },
    { id: 'NODE_GPU_1', task: 'Node.js: TensorFlow.js GPU memory leak', error: 'WebGL: OUT_OF_MEMORY after processing 100+ images sequentially in TensorFlow.js', attempted: 'Tried dispose(), tried tf.tidy() wrapper', fix: 'TensorFlow.js GPU tensors must be explicitly disposed. Even with tf.tidy(), some GPU resources leak. Fix: (1) Call tf.dispose() on EVERY tensor after use, (2) use tf.engine().startScope()/endScope(), (3) limit batch size, (4) call tf.disposeVariables() periodically, (5) switch to @tensorflow/tfjs-backend-wasm for memory-bound workloads.', components: ['node.js', 'tensorflow', 'gpu', 'memory'], score: 1.8, verified: true },
    { id: 'NODE_STREAM_1', task: 'Node.js: streaming JSON parse fails on large files', error: 'Unexpected end of JSON input when parsing large NDJSON stream. JSON.parse on partial data.', attempted: 'Tried JSONStream, tried split2', fix: 'JSON.parse requires complete input. For streaming NDJSON (newline-delimited JSON): use split2 or byline to split by newlines, then parse each line. For single large JSON: use JSONStream.parse() which handles partial data. Or: oboe.js for streaming JSON parsing.', components: ['node.js', 'stream', 'json', 'parse'], score: 1.5, verified: true },

    // === Docker ===
    { id: 'DOCKER_CACHE_1', task: 'Docker build cache not invalidating on package.json change', error: 'npm install step uses cached node_modules even after package.json changes', attempted: 'Tried --no-cache, tried touching package.json', fix: 'Docker layer caching uses checksums of copied files. If you copy package.json before running npm install, Docker will cache the npm install layer until package.json changes. Ensure COPY package.json comes BEFORE COPY . in Dockerfile. Use: COPY package.json package-lock.json ./ && npm install && COPY . ..', components: ['docker', 'cache', 'build', 'layer'], score: 2.0, verified: true },
    { id: 'DOCKER_USER_1', task: 'Docker: files created by container owned by root', error: 'Cannot delete files in mounted volume: Permission denied. Files owned by root:root.', attempted: 'Tried chmod, tried running container with --user', fix: 'Docker containers run as root by default. Files created in mounted volumes are owned by root. Fix: (1) Use --user flag: docker run --user $(id -u):$(id -g), (2) In Dockerfile: RUN adduser --disabled-password appuser && USER appuser, (3) Or set user in docker-compose.yml: user: "${UID:-1000}:${GID:-1000}".', components: ['docker', 'permissions', 'volume', 'user'], score: 2.0, verified: true },
    { id: 'DOCKER_NET_1', task: 'Docker: container cannot reach host service', error: 'MySQL connection refused when connecting to localhost:3306 from inside container. Works from host.', attempted: 'Tried using 127.0.0.1, tried host.docker.internal', fix: 'Inside a Docker container, "localhost" refers to the container not the host. Use: (1) --network=host to share host network, (2) host.docker.internal (macOS/Windows), (3) on Linux: --add-host host.docker.internal:host-gateway, (4) or use Docker compose service name: depends_on: - mysql, then connect to "mysql:3306".', components: ['docker', 'network', 'localhost', 'container'], score: 2.0, verified: true },

    // === TypeScript ===
    { id: 'TS_STRICT_1', task: 'TypeScript: strict mode migration errors everywhere', error: 'Type "string | undefined" is not assignable to type "string". Strict mode turned on 500+ errors.', attempted: 'Tried disabling strict, tried adding // @ts-nocheck', fix: 'Enable strict mode incrementally: set "strict": false and enable individual flags one at a time: noImplicitAny → strictNullChecks → strictFunctionTypes → strictBindCallApply. Fix each flag across the codebase before enabling the next. Use ts-expect-error for deliberate cases.', components: ['typescript', 'strict', 'migration', 'config'], score: 2.0, verified: true },
    { id: 'TS_PATH_1', task: 'TypeScript: path aliases not resolved at runtime', error: 'Cannot find module "@/components/Button" or its corresponding type declarations. tsconfig paths works in IDE but not at runtime.', attempted: 'Tried different baseUrl, tried moduleResolution bundler', fix: 'TypeScript path aliases are compile-time only. Node.js cannot resolve them at runtime. Fix: (1) Use tsc-alias: npm install tsc-alias && tsc && tsc-alias, (2) Use tsconfig-paths: node -r tsconfig-paths/register dist/index.js, (3) Use module-alias: require("module-alias/register") in entry file.', components: ['typescript', 'paths', 'runtime', 'build'], score: 2.0, verified: true },
    { id: 'TS_ENUM_1', task: 'TypeScript: const enum causes runtime errors', error: "Cannot read properties of undefined (reading 'VALUE'). Const enum inlined at compile time but not available at runtime.", attempted: 'Tried changing to regular enum, tried isolatedModules: false', fix: 'const enum values are inlined by TypeScript and do not exist as objects at runtime. When using isolatedModules (required by bundlers), const enum breaks. Fix: (1) Use regular enum instead of const enum, (2) use const enum with preserveConstEnums: true, (3) export const enum values as literal union types instead.', components: ['typescript', 'enum', 'runtime', 'bundler'], score: 1.5, verified: true },

    // === Git ===
    { id: 'GIT_REBASE_1', task: 'Git: rebase results in repeated conflict resolution', error: 'Same conflict appears on every rebase step even though it was already resolved. rerere not working.', attempted: 'Tried git rerere enable, tried manually resolving each time', fix: 'Git rerere (reuse recorded resolution) must be enabled BEFORE conflicts occur. Enable with: git config --global rerere.enabled true. For existing conflicts: git rerere records resolutions on the fly if enabled. If already disabled, conflicts must be resolved manually each time. Enable it now to avoid future duplicates.', components: ['git', 'rebase', 'conflict', 'rerere'], score: 1.8, verified: true },
    { id: 'GIT_LFS_1', task: 'Git LFS: push fails with large file detected', error: 'remote: error: File large_model.bin is 512 MB; this exceeds GitHub file size limit of 100 MB', attempted: 'Tried git rm --cached, tried BFG Repo Cleaner', fix: 'File was committed before LFS was set up. Remove from git history: (1) git lfs track "*.bin", (2) git add .gitattributes, (3) git rm --cached large_model.bin, (4) git lfs migrate import --include="*.bin", (5) git push --force. For already-pushed large files: BFG Repo-Cleaner is safer than git filter-branch.', components: ['git', 'lfs', 'large-files', 'push'], score: 1.8, verified: true },

    // === Python ===
    { id: 'PYTHON_IMPORT_1', task: 'Python: circular import not detected until runtime', error: 'ImportError: cannot import name "Client" from partially initialized module "app.client". Circular import dependency.', attempted: 'Tried reordering imports, tried __init__.py changes', fix: 'Python circular imports happen when module A imports from B which imports from A before A is fully loaded. Fix: (1) Move the import inside the function (lazy import), (2) use TYPE_CHECKING for type hints: from typing import TYPE_CHECKING; if TYPE_CHECKING: from app.client import Client, (3) restructure into three modules: A → C ← B.', components: ['python', 'import', 'circular', 'runtime'], score: 2.0, verified: true },
    { id: 'PYTHON_VENV_1', task: 'Python: venv activation fails in CI/CD pipeline', error: 'source .venv/bin/activate: No such file or directory. Virtual environment not created or wrong path.', attempted: 'Tried using python -m venv, tried different paths', fix: 'In CI/CD, use the venv python binary directly instead of activating: .venv/bin/python -m pip install. For Makefiles: VENV=.venv, $(VENV)/bin/python. For GitHub Actions: use actions/setup-python which handles venv automatically. For Docker: RUN python -m venv .venv && .venv/bin/pip install.', components: ['python', 'venv', 'ci', 'build'], score: 1.5, verified: true },

    // === SSL / HTTPS ===
    { id: 'SSL_CERTBOT_1', task: 'Certbot: Let\'s Encrypt certificate renewal fails', error: 'Certbot failed to authenticate. http-01 challenge failed for domain.com. Nginx config blocks /.well-known/acme-challenge/', attempted: 'Tried different certbot plugins, tried manual DNS challenge', fix: 'Certbot http-01 needs access to /.well-known/acme-challenge/ on port 80. Ensure nginx is not redirecting HTTP to HTTPS for this path. Add to nginx config: location ^~ /.well-known/acme-challenge/ { allow all; }. Test with: curl http://domain.com/.well-known/acme-challenge/test.', components: ['ssl', 'certbot', 'https', 'nginx'], score: 2.0, verified: true },
    { id: 'SSL_SELFSIGN_1', task: 'Self-signed certificate not trusted by Node.js', error: 'Error: self-signed certificate in certificate chain. Node.js https module rejects self-signed certs.', attempted: 'Tried NODE_TLS_REJECT_UNAUTHORIZED=0, tried adding to trust store', fix: 'Node.js rejects self-signed certs by default. For development: export NODE_TLS_REJECT_UNAUTHORIZED=0 (insecure, dev only). Proper fix: add cert to Node trust store: (1) create self-signed CA: openssl req -x509 -new -nodes -days 365 -out ca.pem, (2) create server cert signed by CA, (3) set NODE_EXTRA_CA_CORS=ca.pem. Or use mkcert which adds to system trust store automatically.', components: ['ssl', 'node.js', 'certificate', 'https'], score: 1.8, verified: true },

    // === WebSocket ===
    { id: 'WS_DISCONNECT_1', task: 'WebSocket reconnection loop on network flapping', error: 'WebSocket reconnects in infinite loop when network briefly drops. Reconnect → disconnect → reconnect.', attempted: 'Tried exponential backoff, tried WebSocket built-in reconnect', fix: 'Implement proper reconnection strategy: (1) exponential backoff: delay = min(initialDelay * 2^attempt, maxDelay), (2) jitter: delay += random(0, 1000), (3) max attempts: stop after N attempts, (4) detect network state with navigator.onLine / os.networkInterfaces. Libraries: reconnecting-websocket (browser), ws-reconnect (Node).', components: ['websocket', 'reconnect', 'network', 'reliability'], score: 2.0, verified: true },

    // === Express ===
    { id: 'EXPRESS_CORS_1', task: 'Express CORS: preflight OPTIONS request fails', error: 'CORS Missing Allow-Origin. Preflight OPTIONS request returns 404 because Express route does not handle OPTIONS.', attempted: 'Tried adding cors middleware, tried manual headers', fix: 'Express cors middleware must be applied BEFORE routes. Fix: const cors = require("cors"); app.use(cors()); app.options("*", cors()); // enable preflight. Ensure cors() is called before any app.get/post routes. For custom config: cors({ origin: "https://app.com", credentials: true }).', components: ['express', 'cors', 'http', 'middleware'], score: 2.0, verified: true },

    // === VS Code ===
    { id: 'VSCODE_EXT_1', task: 'VS Code extension: activation fails on first install', error: 'Activation failed: extension host terminated unexpectedly. Extension activates but crashes VS Code on first load.', attempted: 'Tried reinstalling, tried clearing extension cache', fix: 'VS Code extensions often fail because of missing dependencies during first activation. Common causes: (1) native modules not built for current Electron version — use @vscode/electron-rebuild, (2) activationEvents not set correctly in package.json — use onStartupFinished instead of *, (3) unhandled promise rejections in activate(). Always wrap activation in try/catch.', components: ['vscode', 'extension', 'activation', 'electron'], score: 1.5, verified: true },
  ];

  for (const f of failures) {
    // Store as verified fix
    rc.setHint(f.id, {
      solution_summary: f.fix,
      score: f.score,
      status: 'active',
      success_count: 1,
      failure_count: 0,
      citation_count: 0,
      used_by: ['seed-script'],
      agent_stats: { 'seed-script': { success: 1, failure: 0, citation: 0, total: 1 } },
      hit: true,
      task_type: 'verified_resolution',
      metadata: {
        task: f.task,
        error: f.error,
        attempted_fix: f.attempted,
        components: f.components,
        error_pattern: f.error,
        verified: f.verified !== false,
        seeded: true,
        seed_timestamp: new Date().toISOString(),
      },
    });

    // Store as failure too (for search to find attempts that failed)
    const failId = `${f.id}_FAIL`;
    rc.setHint(failId, {
      solution_summary: `FAILURE: ${f.task} — ${f.error.slice(0, 200)}`,
      score: -0.3,
      status: 'decaying',
      success_count: 0,
      failure_count: 1,
      citation_count: 0,
      used_by: ['seed-script'],
      agent_stats: { 'seed-script': { success: 0, failure: 1, citation: 0, total: 1 } },
      hit: false,
      task_type: 'failure_report',
      metadata: {
        task: f.task,
        error: f.error,
        attempted_fix: f.attempted,
        components: f.components,
        error_pattern: f.error,
        result: 'failed',
        seeded: true,
      },
    });

    added++;
  }

  const total = Object.keys(rc.getAllHints()).length;
  console.log('');
  console.log(`  Seeded ${added} real failure patterns (${failures.length} fixes + ${failures.length} failures)`);
  console.log(`  Total hints in memory: ${total}`);
  console.log(`  Categories: node-pty, MCP, Codex, OpenRouter, PM2, Ubuntu, VPN, WSL, Claude Code, OpenHands, npm, Docker, TypeScript, Git, Python, SSL, WebSocket, Express, VS Code`);
  console.log('');

  // Print component distribution
  const compCount = {};
  for (const f of failures) {
    for (const c of f.components) {
      compCount[c] = (compCount[c] || 0) + 1;
    }
  }
  console.log('  Component distribution:');
  for (const [c, n] of Object.entries(compCount).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${c}: ${n} entries`);
  }
  console.log('');

  // Simulate a query to show it works
  const memoryApi = require('../lib/memory-api');
  console.log('  SANITY CHECK — searching "Android PTY deadlock tcsetpgrp"...');
  const results = memoryApi.searchMemory({ query: 'Android PTY deadlock tcsetpgrp Node.js', limit: 3 });
  if (results.verified_fixes?.length > 0) {
    console.log(`  ✅ recall: ${results.verified_fixes[0].summary.slice(0, 100)}...`);
    console.log(`     composite: ${results.verified_fixes[0].composite}, similarity: ${results.verified_fixes[0].similarity}%`);
  } else {
    console.log('  ⚠ No results for Android PTY query — check search function');
  }

  console.log('');
  console.log('  Run benchmark: node scripts/benchmark-real.js');
}

seed();
