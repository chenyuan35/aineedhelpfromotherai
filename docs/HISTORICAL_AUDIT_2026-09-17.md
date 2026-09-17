# Historical Build-to-Present Audit — 2026-09-17

Purpose: review the project from the original May AI-agent/MCP product through the current utility-site pivot and close only historical leftovers that still affect current operations, public identity, discoverability, maintenance cost, or production safety.

This audit is not permission to revive the old SaaS/MCP direction, add products, or churn production UX.

## Execution checklist

- [x] H-01 — Re-read canonical fact sources (`AGENTS.md`, `PROJECT_CONTEXT.md`, `MASTER_PLAN.md`, `OPERATING_WORKFLOW.md`, current queue).
- [x] H-02 — Retire legacy automatic schedules that no longer serve the current utility product. PR #91 disabled automatic triggers for the old Failure Memory daily refresh, hourly drift scan, and awesome-MCP submission while retaining manual dispatch.
- [x] H-03 — Sync current public repository/AI discovery text. PR #91 aligned README, `llms.txt`, `ai.txt`, and frontend copies to Reset / Access / Reliability.
- [x] H-04 — Verify live AI-discovery files rather than trusting cached search results. Direct browser verification shows production `/llms.txt` and `/ai.txt` serve the 2026-09-17 versions; stale retrieval observed elsewhere is provider/search cache lag.
- [x] H-05 — Verify old public MCP/A2A static entry points. `/.well-known/agent-card.json`, `/.well-known/agent.json`, `/openapi.json`, `/feed.xml`, and `/mcp/` are no longer live public product entry points (404 / blocked-and-404 behavior verified).
- [x] H-06 — Verify old GitHub issues. Historical Issue #1 and #4 are closed `not_planned`; current open issue is #78 for Phone verification-continuity validation.
- [ ] H-07 — Audit every remaining GitHub Actions workflow for obsolete triggers, unnecessary old-product writes, deployment risk, or recurring cost.
- [ ] H-08 — Audit current non-archive repository files that still publicly describe the historical Failure Intelligence/MCP product; classify as harmless historical source, discoverability conflict, or maintenance risk.
- [ ] H-09 — Audit build/deploy paths for stale historical product generators or artifacts that can overwrite current static utility output.
- [ ] H-10 — Audit public production surface for accidental historical product endpoints/content beyond the intentionally retained Relay API dependency.
- [ ] H-11 — Audit repository metadata (description/topics/homepage) against current positioning and distinguish executable fix vs connector permission blocker.
- [ ] H-12 — Audit monetization/measurement basics already in place (AdSense tag/ads.txt, GA4, canonical/sitemap/robots) for historical inconsistencies only; do not optimize revenue before traffic.
- [ ] H-13 — Make the smallest safe fixes for confirmed defects using fresh branch/PR/CI/preview; do not delete historical code solely for cleanliness.
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

## Confirmed findings so far

- GitHub repository description is still `Failure intelligence and shared debugging memory for AI coding agents`.
- Repository topics are still dominated by the old agent-memory/MCP/debugging identity (`agent-memory`, `ai-debugging`, `failure-memory`, `mcp`, `reasoning-cache`, etc.).
- The current GitHub connector exposes repository read/admin context but no repository-description/topics mutation action; treat metadata editing as a real AIR-3 blocker unless another authorized write path is discovered.
- Production `/llms.txt` and `/ai.txt` are current. Cached third-party copies must not be mistaken for origin deployment failure.
