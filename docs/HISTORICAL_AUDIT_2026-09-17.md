# Historical Build-to-Present Audit — 2026-09-17

Purpose: review the project from the original May AI-agent/MCP product through the current utility-site pivot and close only historical leftovers that still affect current operations, public identity, discoverability, maintenance cost, or production safety.

This audit is not permission to revive the old SaaS/MCP direction, add products, or churn production UX.

## Execution checklist

- [x] H-01 — Re-read canonical fact sources (`AGENTS.md`, `PROJECT_CONTEXT.md`, `MASTER_PLAN.md`, `OPERATING_WORKFLOW.md`, current queue).
- [x] H-02 — Retire legacy automatic schedules that no longer serve the current utility product. PR #91 disabled automatic triggers for the old Failure Memory daily refresh, hourly drift scan, and awesome-MCP submission while retaining manual dispatch.
- [x] H-03 — Sync current public repository/AI discovery text. PR #91 aligned README, `llms.txt`, `ai.txt`, and frontend copies to Reset / Access / Reliability.
- [x] H-04 — Verify live AI-discovery files rather than trusting cached search results. Direct browser verification shows production `/llms.txt` and `/ai.txt` serve the 2026-09-17 versions; stale retrieval observed elsewhere is provider/search cache lag.
- [x] H-05 — Verify old public MCP/A2A static entry points. `/.well-known/agent-card.json`, `/.well-known/agent.json`, `/openapi.json`, `/feed.xml`, and `/mcp/` are no longer live public product entry points on the main site.
- [x] H-06 — Verify old GitHub issues. Historical Issue #1 and #4 are closed `not_planned`; current open issue is #78 for Phone verification-continuity validation.
- [x] H-07 — Audit every remaining GitHub Actions workflow for obsolete triggers, unnecessary old-product writes, deployment risk, or recurring cost.
- [x] H-08 — Audit current non-archive repository files that still publicly describe the historical Failure Intelligence/MCP product; classify as harmless historical source, discoverability conflict, or maintenance risk.
- [x] H-09 — Audit build/deploy paths for stale historical product generators or artifacts that can overwrite current static utility output.
- [x] H-10 — Audit public production surface for accidental historical product endpoints/content beyond the intentionally retained Relay API dependency.
- [x] H-11 — Audit repository metadata (description/topics/homepage) against current positioning and distinguish executable fix vs connector permission blocker.
- [x] H-12 — Audit monetization/measurement basics already in place (AdSense tag/ads.txt, GA4, canonical/sitemap/robots) for historical inconsistencies only; do not optimize revenue before traffic.
- [ ] H-13 — Make the smallest safe fixes for confirmed defects using fresh branch/PR/CI/preview; do not delete historical code solely for cleanliness. **PATCHED / PENDING PR + PRODUCTION VERIFY.**
- [ ] H-14 — Record final findings, remaining blockers, and stop conditions in current fact sources so later sessions do not repeat this archaeology.

## Decision rules

A historical artifact is actionable only if it currently does at least one of the following:

1. runs automatically or writes state;
2. can deploy/publish/submit externally without a deliberate current action;
3. is exposed to users/search/AI retrieval as current product identity;
4. can overwrite or corrupt the current build/deploy output;
5. creates meaningful security, billing, uptime, or maintenance risk;
6. contradicts current canonical project facts in a place that current operators or external systems actually consume.

Old source code, archived docs, old commits, closed issues, and dormant manual-only helpers are not defects by themselves.

## Confirmed fixes

### Legacy automation

PR #91 already retired automatic schedules for the old Failure Memory daily refresh, hourly drift scan, and awesome-MCP submission.

The second pass found three more old-product automatic paths:

- `.github/workflows/auth-demo.yml` still ran the former product's Linux/Windows auth demo on selected pushes and pull requests. It is now manual-only.
- `.github/workflows/deploy.yml` still triggered a Render production deploy on backend changes even though current Vercel routing targets `api-tunnel.aineedhelpfromotherai.com`. It is now manual-only as an explicit historical fallback.
- `.github/workflows/npm-publish.yml` still published the legacy MCP/n8n/LangChain packages whenever a GitHub release was published. It is now manual-only.

Current `ci.yml` and `evals.yml` remain active because they still protect the backend, Relay and Phone release paths.

### Current-looking stale repository documents

`PROJECT.md`, `PROGRESS.md`, `POSITIONING.md`, and `INFRASTRUCTURE.md` were still written as if the former Failure Intelligence/MCP product or June Render topology were current. They now act as historical compatibility pointers to the canonical current fact sources. The original historical text remains in Git history.

Root `package.json` description and keywords are aligned with the current utility-site mission without changing runtime dependencies or scripts.

Historical source trees, archived docs, old MCP packages and old commits remain in the repository where they are harmless. They are not deleted merely for cleanliness.

### Public production surface

The main static site correctly returns 404 for former public paths such as `/cases/`, `/learn/`, `/stats/`, old `.well-known` files, old OpenAPI/feed/failure-index assets and `/mcp/`. They are absent from the current sitemap.

Search Console still shows residual historical impressions for `/cases/`, but the visible query evidence does not show a current-product job worth preserving. Keep the real 404 and allow the historical index to decay rather than creating a misleading redirect or reviving the old product.

The direct backend tunnel was different: `api-tunnel.aineedhelpfromotherai.com` still served the full old **AI Failure Observatory** and old Memory/MCP/Agent APIs. A direct request to `/api/memory/stats` returned live historical memory state, proving the old surface was active rather than merely dormant source code.

The audit branch therefore makes two bounded changes:

1. `vercel.json` narrows the main site's catch-all `/api/*` proxy to the current public backend needs only: `/api/health`, `/api/status`, `/api/diagnostics`, and `/api/reasoning/relay-risk-v2`.
2. `server.js` defaults to the same current-surface allowlist and returns HTTP 410 for the historical UI/MCP/Memory/Agent surface. `LEGACY_AGENT_API_ENABLED=true` remains an explicit rollback/debug switch. The old JSON `_tip` advertising reasoning/memory endpoints is removed.

This keeps the Relay backend dependency while retiring the former product's anonymous public attack surface.

### Runtime cleanup

Qwen contained three orphan `node server.js` processes started from old temporary audit worktrees. They were PPID 1, not managed by PM2, and did not own production listening ports. The actual PM2 `api-server` and reverse proxy were verified first; the three orphan processes were then terminated, freeing roughly 260 MB RSS without touching the dirty production worktree.

### Measurement / discovery basics

Rechecked live production:

- `ads.txt` contains the existing AdSense publisher declaration.
- `robots.txt` allows normal public crawling while disallowing `/api/` and `/mcp`.
- the sitemap contains current utility/Reset/Relay/Phone pages and no old Failure Intelligence product paths.
- `/llms.txt` and `/ai.txt` serve the current 2026-09-17 Reset / Access / Reliability identity.

No monetization-layout optimization is justified before stable traffic.

## Verification completed before PR

The backend hardening patch was first applied in a fresh Qwen worktree and tested there before being reproduced on the GitHub audit branch.

Passed checks:

- `node -c server.js`.
- Relay score test and Relay ingestion test.
- Phone lifecycle audit: 74 checks.
- Phone retention audit: 21 checks.
- Phone supply-intelligence audit: 16 checks.
- full static frontend build and Phone public-release audit.
- local backend contract: `/api/health` remains 200 and no longer contains the legacy `_tip`; Relay Risk remains reachable; `/`, `/mcp`, `/memory/*`, `/api/memory/*`, and `/api/manifest` return 410 by default.
- `npm run eval -- --quiet` completed without reported regressions.

A one-time GitHub Actions helper was used only to reproduce the already-tested `server.js` patch on the audit branch because the Qwen host deliberately has no GitHub push credentials. That helper deleted itself and its patch script after a successful run; neither is intended to enter `main`.

## Remaining external blocker

GitHub repository metadata still exposes the historical identity:

- description: `Failure intelligence and shared debugging memory for AI coding agents`;
- topics remain dominated by agent-memory/MCP/debugging terms.

The currently connected GitHub tool exposes no repository-description/topics mutation action. This remains the existing AIR-3 metadata-write blocker, not an unattempted repository-code fix.

## Stop condition

After the PR is merged, the main site and direct tunnel are production-verified, Qwen is safely fast-forwarded without touching its dirty runtime data, and the checkpoint/queue record the result, stop this historical archaeology. Do not delete dormant historical source merely to make the repository look smaller.
