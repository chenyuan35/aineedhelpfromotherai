# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-15

## Current progress checkpoint

Use this section first in a new session. Do not rescan the whole repository, VPS, deployment history, or old chat unless this checkpoint is stale, contradictory, or the current task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | Utility site is live on `https://aineedhelpfromotherai.com/`; Vercel deploys the static frontend from GitHub `main`. The legacy Express/PostgreSQL backend remains live behind `api-tunnel.aineedhelpfromotherai.com`. After PR #44, the production VPS is fast-forwarded to `2299625`; `api-server` is online and `relay-risk-scheduler` is online with the deliberate deployment restart count stable at 1 | Keep stable; verify both Vercel and the backend path when releasing backend-dependent tools. Relay-risk scheduler health requires a successful source request or legitimate 304, healthy DB state, child exit 0, and a valid next-run time |
| Relay history observer | A separate low-resource `codex` VPS now runs an independent Relay Risk history collector. It stores normalized Sinan summaries in SQLite at `/var/lib/aineedhelp-relay-observer/relay-history.sqlite3`, records source fetch success/304/error separately from relay lifecycle changes, and emits lifecycle events only for `first_observed`, `missing_from_source`, `reappeared`, `dead_marked`, and `dead_cleared`. The first real baseline on Sep 14 normalized 1,823 relays; an immediate second run returned a legitimate HTTP 304. `aineedhelp-relay-observer.timer` runs daily. The Qwen/control VPS independently backs up the SQLite database to `/var/backups/aineedhelp-relay-observer/` via PM2 process `aineedhelp-relay-observer-backup` | Let the independent history accumulate. Do not treat provider/source fetch failures as relay-risk changes, do not mirror the full third-party dataset, and do not use this history as a calibrated shutdown probability until enough resolved lifecycle data exists |
| Tool inventory | 14 live tool pages: traditional calculators/image tools; Manus, Replit, Cursor, AI burn-rate, GitHub Copilot and Bolt quota/reset tools; plus the AI Relay Exit Risk Checker community-risk pilot | Do not add a broad new batch; treat Relay Exit Risk Checker as the explicit user-directed one-off pilot and continue measuring existing pages first |
| Relay-risk pilot | Relay Exit Risk v2 is production-closed through PR #42–#44. PR #42 replaced manual risk controls with an evidence-driven 0–100 Exit Risk Index using Sinan Compute open data, stored daily snapshots and a time-bounded 90-day community survival forecast; model-trust sentiment remains separate. Production currently has 1,823 Sinan relays in the latest snapshot, 1,810 with availability, 359 with pricing profiles and 1 marked dead. `api123.top` production verification returns 53/100, Harvest Season, Medium confidence. PR #43 fixed Node binary resolution; PR #44 removes only PM2 `NODE_CHANNEL_FD` and `NODE_CHANNEL_SERIALIZATION_MODE` before launching the Node updater. The live scheduler now accepts a legitimate Sinan 304, exits the child with code 0 and schedules the next refresh. A production community smoke test verified one current same-voter row, two append-only forecast events across an update, correct aggregate change, and complete cleanup. VPS Chromium verified desktop/mobile with no horizontal overflow or page JS errors; the animation follows the computed Risk Index and no manual risk slider exists | Monitor source freshness, scheduler child exit, lifecycle snapshots and real community usage. Do not describe the index as a shutdown/fraud probability, and do not add speculative product extensions before evidence justifies them |
| Keyword discovery | VPS keyword radar is installed and running daily; first full run completed 320/320 source requests and found 1,227 candidates | Read `/var/lib/aineedhelp-radar/latest.md` when choosing topics |
| Current radar signals | Strong phrases include Cursor usage-limit reset, Codex usage-limit reset, Claude weekly/usage-limit reset, plus image compressor/resizer combinations | Keep as candidate backlog; do not publish the next broad batch until the current indexing cohort produces settled search signals |
| Search Console | GSC Wizard is connected to `sc-domain:aineedhelpfromotherai.com`. Settled performance data still predates the Sep 13 indexing push, so current utility-page impressions remain effectively zero in reporting | Wait for settled data after the new crawl/index event and compare the first indexed tool pages rather than guessing from old data |
| Utility indexing | GSC Wizard Index Tracker now contains 16 priority URLs after the Relay Exit Risk page was added on Sep 14. Current state is 8 indexed / 8 not indexed / 0 pending / 0 errors / 0 warnings. Newly indexed pages include Manus, Replit, Bolt and Age in addition to the homepage, `/tools/`, Cursor and image compressor. Relay Exit Risk was inspected once and is currently `URL is unknown to Google`; no repeated manual request-indexing churn has been started | Keep the tracker active and let the scheduled inspection history accumulate. Do not repeatedly resubmit the remaining URLs; watch for the next crawl/index wave and first settled tool-page impressions |
| Breakthrough-page pilot | Cursor reset remains the first deliberate depth/authority pilot. PR #30 enriches the existing URL with a fast answer for reset intent, current official Cursor sources, individual-vs-team behavior, the two monthly usage pools, exact reset-date instructions, additional FAQs, and a privacy-preserving copyable reset summary. The later Relay Exit Risk Checker is a distinct user-job experiment and does not replace the Cursor authority pilot | Measure Cursor impressions, queries, CTR and engagement after the Sep 13 indexing event settles; only replicate this depth pattern to other pages if it produces stronger signals |
| URL normalization | FIXED in PR #19. Vercel uses `trailingSlash: true`, matching generated canonical and sitemap URLs. Production checks show normal tool URLs resolve directly with 200. PR #40 additionally adds an explicit `/api/:path*/` external rewrite before the existing non-trailing rule because Vercel otherwise redirected API paths to a trailing slash and served the static homepage | Keep sitemap/canonical/internal links aligned. For backend-dependent features, verify both `/api/...` redirect behavior and the final JSON response through the apex domain |
| Homepage UX | PR #48 completed the homepage identity pass: the first view is now provider-first AI reset / limits / usage navigation with independent live links for Cursor, Copilot, Manus, Replit and Bolt; Codex and Claude are visibly `soon` without dead links. A lightweight transparent line-art office-boss asset is integrated as the small Relay Exit Risk entry rather than a separate video/card, Relay Risk remains the second signature section, and generic utilities stay below. Vercel/Eval Gate passed and production Chromium verified desktop/mobile without overflow | Preserve this integrated, compact hierarchy. Keep the character secondary to real tool navigation, avoid oversized marketing slogans, and do not turn upcoming providers into fake links |
| GSC sitemap state | Live `https://aineedhelpfromotherai.com/sitemap.xml` contains 20 URLs and still publishes no build-date `lastmod`. Search Console's settled sitemap-performance window still sees only the older cohort because reporting lags the Sep 13 indexing event | Treat direct URL Inspection as the current indexing truth until sitemap/search-performance reporting catches up; do not infer failure from the newly added URL having no settled data yet |
| Technical quality audit | The Sep 13 audit found no blocking defects across the then-13 tool pages and PR #37 removed volatile build-date freshness claims. Relay Exit Risk v2 preserves the no-fake-freshness rule and is now production-verified end to end: apex API JSON, evidence breakdown, community forecast, prepaid exposure, score-driven animation, desktop/mobile layout and zero page JS errors in the VPS Chromium smoke test. CrUX measurement remains unconfigured in GSC Wizard, so no field-performance verdict is inferred | Keep the observation window clean. For Relay Risk, prioritize scheduler/source reliability, evidence provenance, abuse resistance and lifecycle history over speculative scoring features |
| External discovery | PR #27 aligned the public GitHub README with the utility-site mission and direct live-tool links. The daily IndexNow workflow is verified working. Bing Webmaster API is connected. On Sep 13, the first authority outreach round sent three personalized emails to hsmart.dev, Continuum Code and Drew Bredvick; no reply/link is verified yet. AIR-4 second-batch candidates have been researched: Learn Cursor, explainx.ai, QuotaMeter and Cursor Usage Tracker. Gmail shows no prior correspondence on the public contact paths found; no new message was sent because the first round is still inside its 5–7 day response window. Detailed status lives in `docs/AUTHORITY_AND_AI_DISCOVERY.md` | Check the original three Gmail threads after 5–7 days and independently verify any claimed link/citation. The Relay Exit Risk Checker release does not change AIR-4 outreach timing or count as external authority |
| AI discovery | Public pages are crawlable. The first Exa benchmark showed direct known-URL extraction of Cursor succeeds cleanly, but semantic discovery queries do not yet return the direct utility page near the top; a GitHub result surfaced with stale legacy positioning. PR #32 shipped current utility-site `llms.txt`/`ai.txt` files and a repeatable provider benchmark. A real Tavily baseline attempt on Sep 13 was blocked before execution with HTTP 432 because the provider plan usage limit had been reached | AIR-1 remains BLOCKED on Tavily quota; do not upgrade billing without explicit approval. AIR-3 remains blocked on GitHub metadata write access. AIR-4 remains active. The Relay Exit Risk Checker release is not an AI-retrieval benchmark and does not change AIR task states |
| Analytics | GA4 property/data stream with measurement ID `G-FYKKNKRE58` is live site-wide from PR #21. GSC Wizard Analytics consent is connected, property `properties/553896884` (`aineedhelpfromotherai`) is linked to `sc-domain:aineedhelpfromotherai.com`, and a Sep 13 rollout annotation was added | Wait for the first settled GA4 sessions/page views, then use GA4 for referral/direct/engagement decisions alongside GSC |
| Ubersuggest | Autocomplete discovery works; precise keyword metrics may be unavailable/limited at times | Use when available; never block discovery or invent metrics |
| Durable workflow | `AGENTS.md`, this checkpoint, `docs/MASTER_PLAN.md`, `docs/OPERATING_WORKFLOW.md`, `docs/AUTHORITY_AND_AI_DISCOVERY.md`, `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md`, and `docs/AI_RETRIEVAL_BENCHMARK.md` are the durable handoff sources | Update checkpoint/master plan after material progress, update the authority/AI ledger after external actions/outcomes, update the AIR task list when a task status changes, and update the retrieval benchmark after provider tests |
| Last completed work | The Codex relay-history observer is now live as an independent data-collection node. Its first real Sinan baseline normalized 1,823 relays into a ~1 MB SQLite database, lifecycle transition logic was smoke-tested with synthetic test domains, the next identical source request produced a legitimate 304, and the daily systemd timer is enabled. The Qwen/control VPS has a separately verified compressed SQLite backup and a persistent PM2 backup scheduler. This does not change the current indexing/AIR priorities or the Relay Risk score semantics | Let the observation history accumulate; keep the source/provider failure channel separate from relay lifecycle evidence and preserve the existing indexing/AIR observation window |

Immediate priority: let the Sep 13–14 Google indexing wave and PR #32 AI-discovery changes settle, keep the 16-URL tracker active, measure the Cursor breakthrough page, follow the first three outreach threads at the proper 5–7 day window, and execute the ordered AIR workstream. AIR-1 is currently blocked by Tavily quota and AIR-3 by missing metadata write access. AIR-4 remains active, with the second candidate batch researched but deliberately unsent until the first-round response window is checked. Relay Exit Risk v2 is production-closed; monitor its scheduler, source freshness, lifecycle history and organic/community usage without starting another broad tool batch.

## Mission

Turn `aineedhelpfromotherai.com` into a low-cost, high-traffic utility site that can earn small, stable Google AdSense revenue.

Primary success metrics: organic impressions, indexed pages, CTR, useful repeat visits, page speed, AI/search citations/referrals where measurable, and ad revenue. The first practical revenue target is a few hundred RMB/month; do not optimize for SaaS complexity.

## Product rules

- Prefer real search demand, moderate competition, and clear utility intent.
- Prefer pure browser-side tools with no AI calls and negligible server cost; use the existing backend only when a tool genuinely needs shared state such as community voting.
- Put the working tool above long explanations.
- One distinct user job per page; avoid thin near-duplicate doorway pages.
- Reuse engines/components across a tool family, but keep each page genuinely useful.
- Add useful explanation, examples, FAQs, internal links, canonical URLs, schema, sitemap entries, and mobile support.
- Never target competitor brand queries deceptively.
- Verify claims about changing product limits against official sources.
- For community risk/reputation tools, separate user sentiment from verified evidence and never present an anonymous vote as proof of fraud, insolvency, model substitution or other wrongdoing.
- Search data is evidence, not intuition: use Ubersuggest when available, plus autocomplete/community signals and Search Console.
- When authority is the bottleneck, prefer making one indexed page materially more useful, trustworthy and shareable before creating more URLs.
- For AI-answer visibility, prioritize crawlability, clear answer structure, primary-source evidence, freshness and unique utility; do not rely on unproven AEO/GEO tricks.
- Separate AI-search discovery from extraction: if a known URL extracts cleanly but does not rank in provider search, work on discovery, authority, freshness and semantic relevance rather than adding more parsing markup.
- AI-native retrieval optimization must be non-adversarial: integrate with legitimate provider signals and published web conventions; never use cloaking, hidden provider-specific content, fake citations, fabricated freshness, synthetic backlinks or deceptive metadata.

## Current architecture

- Public site: `https://aineedhelpfromotherai.com/`
- Canonical host: apex domain. `www` permanently redirects to apex.
- Hosting: Vercel static frontend deployed from GitHub `chenyuan35/aineedhelpfromotherai`.
- Production deploys come from merges to `main`; PR branches receive Vercel previews.
- `/api/:path*` is intended to proxy through Vercel to `https://api-tunnel.aineedhelpfromotherai.com/api/:path*`; because the site keeps `trailingSlash: true`, PR #40 includes explicit trailing and non-trailing rewrite patterns.
- The API tunnel reaches the historical Express/PostgreSQL runtime. Relay Risk v2 uses `relay_risk_votes_v2` for the current per-voter forecast, `relay_risk_forecast_events` for append-only forecast history, `relay_source_daily` for normalized daily third-party snapshots, and `relay_source_meta` for source freshness/error metadata. `relay-risk-scheduler` refreshes the Sinan open-data source on the VPS.
- Cloudflare provides DNS. Do not change domain/DNS/account settings unless explicitly authorized.
- Historical backend/API/PostgreSQL services still exist; do not delete them while the Relay Exit Risk Checker depends on them.
- The separate `hermes` machine belongs to another project. Never use it for this website.

## Secret handling

Never print or commit credentials. Existing Vercel and Cloudflare credentials are stored on the authorized VPS with restrictive permissions. Documentation may mention credential file paths, never credential values.

Known credential paths on the VPS:
- `/root/.vercel_token`
- `/root/.cloudflare_token`
- `/root/.cloudflare_zone_id`

## Safe development workflow

Never reset or discard the dirty production worktree. Prefer a fresh branch/worktree for code changes, test locally, push, open a PR, wait for Vercel Preview and CI, merge, then verify production HTTP responses. If a backend release requires updating the production worktree, preserve runtime-modified data files, confirm upstream does not touch them, fast-forward only, syntax-check before PM2 reload, and verify both the direct tunnel and apex-domain proxy afterward.

Do not use destructive resets, delete unrelated data, modify AdSense/account configuration, or alter unrelated DNS/tunnels without explicit approval.

## Live tool families

Traditional utilities currently include percentage calculators, age/date calculators, image resizing, and image compression.

AI quota/reset family currently includes:
- Manus Credits Reset Timer
- Replit Usage Reset Timer
- Cursor Usage Reset Calculator
- AI Credit Burn Rate Calculator
- GitHub Copilot AI Credits Reset Timer
- Bolt Tokens Reset Calculator

Community-risk utility:
- AI Relay Exit Risk Checker — evidence-driven Exit Risk Index from public measurements + stored history + time-bounded community survival forecasts, with model-trust sentiment shown separately, prepaid exposure, score-driven satirical animation, source attribution and external cross-check links. The index is a 0–100 risk index, not a calibrated shutdown/fraud probability.

The AI quota family exists because reset/credit questions are time-sensitive, high-anxiety, and can create repeat visits. Do not blindly clone every provider; validate demand and official rules first. The relay-risk pilot now uses independently attributable open measurements plus our own snapshots and time-bounded community forecasts; do not turn it into a broad directory until real usage, lifecycle history and evidence quality justify expansion.

## Research stack

Use multiple independent signals:
1. Ubersuggest for monthly volume/CPC/SEO difficulty when quota/API permits.
2. Google/Bing autocomplete for live long-tail language and emerging product queries.
3. Official provider docs for changing quota/reset rules.
4. Reddit, Hacker News, forums, and public discussions for repeated user pain/confusion.
5. Google Search Console after pages receive impressions: prioritize actual queries where the site is already being shown.
6. Competitor/public-page analysis for successful UX patterns, never paywall/login bypassing.
7. GA4/GSC Wizard AI-assistant referrals plus Bing/Google AI visibility reports for answer-engine discovery once enough data exists.
8. `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` for the ordered AI-native retrieval workstream and `docs/AI_RETRIEVAL_BENCHMARK.md` for repeatable Exa/Tavily/agent-search tests.

A missing paid metric must not stop discovery. Mark estimates as unknown instead of inventing numbers.

## Current operating priorities

1. Get the current utility sitemap cohort discovered/indexed by Google.
2. Keep the static tool site and the small relay-risk shared-state path stable and fast.
3. Deepen the first indexed breakthrough page (`/tools/cursor-usage-reset/`) and measure whether richer intent coverage and shareability improve search signals.
4. Keep Relay Exit Risk v2 stable and accumulate real source/lifecycle/community history. Do not manufacture missing evidence, convert the index into a probability, or bulk-import allegations.
5. Run small, relevant authority/distribution rounds and track every action/outcome in `docs/AUTHORITY_AND_AI_DISCOVERY.md`.
6. Execute the ordered, non-adversarial AI retrieval integration workstream: diagnose discovery/retrieval/ranking/chunking/citation stages with repeatable provider tests, then change only the stage supported by evidence.
7. Use the connected GA4 property in GSC Wizard once settled data appears so direct/referral/engagement can complement Search Console.
8. Build only 1–2 validated tools per round instead of bulk publishing thin pages; the Sep 14 relay-risk tool was an explicit user-directed one-off release, not permission for a broad batch.
9. Use the VPS keyword radar to collect fresh autocomplete demand daily.
10. Use Search Console impressions from the new `/tools/` cohort to guide expansion once they exist.
11. Improve existing pages before making duplicate pages for near-identical intents.
12. Preserve sitemap/canonical/internal-link/API-proxy hygiene on every release.
13. Favor repeat-use utilities, especially new-product limits, resets, quotas, converters, calculators, and genuinely useful shared-state checks.
14. Maintain a small number of legitimate discovery paths in parallel with indexing: accurate public GitHub links, Bing/IndexNow, and relevant topic-specific resources/communities; never bulk-submit spam links.

## Handoff rule for future sessions

At the beginning of a new working session, read `AGENTS.md`, then the Current progress checkpoint in this file, then `docs/MASTER_PLAN.md`, then `docs/OPERATING_WORKFLOW.md`. If the active task involves outreach, authority, external distribution, referrals, AI assistants, AEO/GEO, citations or follow-ups, also read `docs/AUTHORITY_AND_AI_DISCOVERY.md` before acting. If the active task is specifically testing Exa, Tavily, ChatGPT Search, Perplexity or another AI-native search/retrieval provider, read `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` before `docs/AI_RETRIEVAL_BENCHMARK.md` and execute the next eligible AIR task. Do not perform a full repository/VPS audit merely to rediscover already-confirmed state.

When a material milestone finishes, update the checkpoint in the same PR or immediately afterward. Update `docs/MASTER_PLAN.md` whenever phase status, current sprint order, exit gates, or priorities materially change. Update `docs/AUTHORITY_AND_AI_DISCOVERY.md` immediately after every external action/outcome so the next executor never has to reconstruct outreach from chat memory. Update `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` whenever an AIR task changes state and `docs/AI_RETRIEVAL_BENCHMARK.md` after every AI-native provider test.

GitHub `main` is the source of truth for code. If chat memory conflicts with repository state or production checks, trust the repository plus verified live state.
