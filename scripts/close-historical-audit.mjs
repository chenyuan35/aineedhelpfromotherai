import { readFileSync, writeFileSync } from 'node:fs';

function replaceOnce(source, oldText, newText, label) {
  if (!source.includes(oldText)) throw new Error(`Missing ${label} anchor`);
  return source.replace(oldText, newText);
}

{
  const path = 'docs/HISTORICAL_AUDIT_2026-09-17.md';
  let s = readFileSync(path, 'utf8');
  s = replaceOnce(s,
    '- [ ] H-13 — Make the smallest safe fixes for confirmed defects using fresh branch/PR/CI/preview; do not delete historical code solely for cleanliness. **PATCHED / PENDING PR + PRODUCTION VERIFY.**',
    '- [x] H-13 — Make the smallest safe fixes for confirmed defects using fresh branch/PR/CI/preview; do not delete historical code solely for cleanliness. PR #93 merged after CI, Eval Gate and Vercel Preview passed.',
    'H-13');
  s = replaceOnce(s,
    '- [ ] H-14 — Record final findings, remaining blockers, and stop conditions in current fact sources so later sessions do not repeat this archaeology.',
    '- [x] H-14 — Record final findings, remaining blockers, and stop conditions in current fact sources so later sessions do not repeat this archaeology.',
    'H-14');
  s = replaceOnce(s, '## Remaining external blocker\n', `## Production verification closure\n\nPR #93 merged to main as \`710ce084\`. Vercel production completed successfully. The main-site proxy no longer forwards historical \`/api/memory/*\` routes while Relay Risk still returns live data. Qwen was fast-forwarded with no overlap against its dirty runtime data; only \`api-server\` was restarted. PM2 confirmed \`api-server\`, \`reverse-proxy\` and \`relay-risk-scheduler\` online. Local and external checks confirmed health 200 without the old \`_tip\`, direct tunnel root/Memory endpoints return 410, and Relay Risk remains available.\n\n## Remaining external blocker\n`, 'remaining blocker heading');
  writeFileSync(path, s);
}

{
  const path = 'PROJECT_CONTEXT.md';
  let s = readFileSync(path, 'utf8');
  s = replaceOnce(s,
    '| Production | `https://aineedhelpfromotherai.com/` is live. Vercel deploys the static frontend from GitHub `main`; the historical Express/PostgreSQL backend remains behind the API path because Relay Exit Risk still depends on it. The current user-visible homepage positioning comes from PR #85 (`98b3573b`); PR #87 adds measurement only. | Keep production stable. Use fresh branches/PRs for changes; never reset or overwrite the dirty production worktree. |',
    '| Production | `https://aineedhelpfromotherai.com/` is live. Vercel deploys the static frontend from GitHub `main`; the historical Express/PostgreSQL runtime remains only behind an allowlisted current API surface because Relay Exit Risk still depends on it. PR #93 retired the old public AI-agent/MCP/Memory surface. The current user-visible homepage positioning comes from PR #85 (`98b3573b`); PR #87 adds measurement only. | Keep production stable. Use fresh branches/PRs for changes; never reset or overwrite the dirty production worktree. |',
    'production row');
  s = replaceOnce(s,
    '| Technical quality | Existing structural/mobile/404 audits passed. Unknown URLs return real 404/noindex pages; canonical/trailing-slash/API routing is established. No current verified technical defect justifies another broad cleanup pass. | Optimize only from a measured defect, search signal or behavior signal. Preserve page speed and browser-first execution. |',
    '| Technical quality | Structural/mobile/404 audits passed. Historical audit PRs #91 and #93 retired obsolete automatic workflows, stale current-looking docs, the catch-all public API proxy, and the direct old Failure Observatory/MCP/Memory surface. Qwen production was safely fast-forwarded with dirty runtime data preserved; health and Relay were reverified. | Stop broad historical cleanup. Optimize only from a measured defect, search signal or behavior signal. GitHub repository description/topics remain the AIR-3 metadata-write blocker. |',
    'technical quality row');
  s = replaceOnce(s,
    '- `/api/:path*` proxies to the historical Express/PostgreSQL runtime used by Relay Exit Risk.',
    '- Vercel proxies only the current allowlisted backend routes (`/api/health`, `/api/status`, `/api/diagnostics`, `/api/reasoning/relay-risk-v2`) to the historical Express/PostgreSQL runtime retained for Relay Exit Risk; old AI-agent/MCP/Memory routes return 410 by default at the direct tunnel.',
    'api architecture bullet');
  writeFileSync(path, s);
}

{
  const path = 'docs/CURRENT_EXECUTION_QUEUE.md';
  let s = readFileSync(path, 'utf8');
  const section = `### Q-011 — Historical build-to-present audit\n\nStatus: **DONE**\n\n- PR #91 retired the first set of obsolete automatic Failure Memory/MCP workflows and aligned README/AI discovery text to the current product.\n- PR #93 completed the deeper audit: remaining legacy auth/Render/npm automation is manual-only; stale root project/infrastructure docs now point to current fact sources; Vercel no longer proxies arbitrary \`/api/*\`; the direct backend defaults to health/status/diagnostics/Relay only and returns 410 for the old Failure Observatory/MCP/Memory/Agent surface.\n- CI, Eval Gate and Vercel Preview passed before merge. Production Vercel and Qwen were verified after merge; Qwen dirty runtime data was preserved and only \`api-server\` was restarted. Relay Risk remains live and the old JSON \`_tip\` is gone.\n- Three orphan test \`node server.js\` processes from old temporary audit worktrees were verified as non-production and removed, freeing about 260 MB RSS.\n- Historical \`/cases/\` residual Search Console impressions do not justify revival or redirect; keep the real 404 and let the old index decay.\n- Remaining blocker: GitHub repository description/topics still describe the old Failure Intelligence/MCP identity; current connector exposes no metadata-write action, so AIR-3 remains blocked rather than bypassed.\n\nDurable detail: \`docs/HISTORICAL_AUDIT_2026-09-17.md\`.\n\n`;
  if (!s.includes('### Q-011 — Historical build-to-present audit')) {
    s = replaceOnce(s, '## Current measurement facts\n', section + '## Current measurement facts\n', 'queue measurement heading');
  }
  writeFileSync(path, s);
}

console.log('Historical audit fact sources closed.');
