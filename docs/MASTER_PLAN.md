# Master Plan — Traffic Utility Site

Last updated: 2026-09-18

This is the project-wide progress board. `PROJECT_CONTEXT.md` answers "what is true now"; this file answers "where are we in the whole plan and what comes next"; `docs/OPERATING_WORKFLOW.md` defines how each task is executed. `docs/AUTHORITY_AND_AI_DISCOVERY.md` is the detailed ledger for outreach, external authority, AI-assistant visibility and follow-ups. `docs/AI_RETRIEVAL_BENCHMARK.md` is the repeatable test for AI-native search discovery vs known-URL extraction. `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` is the ordered, non-adversarial workstream for integrating correctly with AI-native retrieval systems. `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md` is the active Phone product-reset task list; `docs/PHONE_RADAR_PRODUCT_DEFINITION.md` and `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` define the durable route-first product and community-reality research model.

## North-star goal

Build `aineedhelpfromotherai.com` into a low-cost utility site that earns small, stable AdSense revenue from organic traffic. First practical target: about RMB 100/month, then scale only what proves demand.

## Phase board

| Phase | Goal | Status | Evidence / current state | Exit gate |
|---|---|---|---|---|
| P0 Foundation | Stable static site, safe deploy flow, durable handoff | DONE | GitHub→Vercel flow, CI/Eval Gate, `AGENTS.md`, `PROJECT_CONTEXT.md`, workflow docs. Backend-dependent release flow is production-proven through PR #44: dirty VPS runtime data was preserved, main advanced by fast-forward only, PM2 scheduler state was saved, and the real child process completed successfully | Completed |
| P1 Initial tool inventory | Publish a useful, low-cost starter portfolio | DONE | 16 live tool pages after PR #75 publicly released Phone Number Survival Guide. Legacy calculators/image tools remain live but are maintenance-only under the scope lock. | Completed |
| P2 Discovery & indexing | Make Google discover and index the current utility cohort | IN PROGRESS | GSC connected; the existing 16-URL priority tracker was 8 indexed / 8 not indexed before the Phone public release. URL normalization remains fixed; live sitemap now contains 22 URLs, including 16 tool pages and the canonical Phone Number Survival Guide. Phone indexing/performance has not yet had time to settle. | Tool cohort, including Phone Number Survival, starts receiving its own settled impressions, with indexing continuing beyond the previously indexed cohort |
| P3 First search signals | Identify which existing pages/queries Google is testing | BLOCKED BY SETTLED DATA | New utility pages are now entering the index, but Search Console performance data still predates the Sep 13 crawl/index event | At least several tool-page query/impression signals exist |
| P4 Winner optimization | Improve pages already earning impressions | PILOT STARTED EARLY | Cursor reset is being used as the first depth/authority pilot before settled impressions arrive because it is already indexed and has strong radar intent. PR #30 adds current official-source depth and shareability without creating a new URL. Data-driven winner optimization still waits for settled GSC signals. | Clear improvement or a decision to stop investing |
| P5 Focused product depth | Build depth only inside the frozen three-surface product scope | ACTIVE — PHONE PRODUCT RESET | Product scope remains locked to Phone Radar/Phone Number Lifecycle (primary), AI Reset Radar/reset tracking (secondary), and Relay Exit Risk (secondary). The Phone canonical is live, but a Sep 18 product review found the interface had drifted into questionnaire/research-manual behavior. Q-014 now resets the user contract to route-first comparison and execution. | Phone Radar exposes concrete routes immediately, lets users compare SMS/OTP reliability, yearly keep-alive cost, setup difficulty, location practicality and current stability, and provides concise opening/keep-alive actions without requiring research-method reading. |
| P6 Distribution, authority & AI discovery | Earn discovery, mentions, relevant links, referrals and AI citations outside classic Google results | ACTIVE PILOT | PR #27 aligned the public GitHub README; IndexNow works; Bing is connected. First personalized authority round sent 3 emails. PR #32 adds a provider-level retrieval benchmark after Exa showed clean direct extraction but weak semantic discovery, corrects stale `llms.txt`/`ai.txt` surfaces, and was production-verified with fresh retrieval. Tavily baseline execution remains blocked by provider plan quota (HTTP 432), not by retrieval failure. AIR-4 second-batch candidates are researched but intentionally held until the first-round 5–7 day response window is checked. The Relay Exit Risk Checker release does not change AIR status or count as authority evidence. | At least one repeatable relevant referral/link/citation source plus measurable search or AI-assistant visibility, with provider retrieval tests showing improved discoverability rather than extraction-only success |
| P7 Monetization optimization | Turn useful traffic into stable AdSense revenue | QUEUED | AdSense integration exists; approval/serving must be verified separately | First RMB 100/month, then optimize RPM without harming UX |

## Current sprint — Phone product reset + indexing

1. DONE — Fix URL consistency: Vercel serves trailing-slash page URLs directly, matching generated canonicals and sitemap URLs. PR #19 shipped and production re-audit found no redirect/canonical issues on checked pages.
2. DONE — Add GA4 tracking: GA4 measurement ID `G-FYKKNKRE58` is injected once into every production HTML page by PR #21; production homepage and Cursor tool page were verified live.
3. DONE — Connect GA4 to GSC Wizard: Analytics consent is authorized, property `properties/553896884` (`aineedhelpfromotherai`) is linked to `sc-domain:aineedhelpfromotherai.com`, and a Sep 13 analytics rollout annotation is recorded. Current GA4 reports are still immature because settled reporting data has not arrived yet.
4. ACTIVE — Keep the GSC indexing tracker running. Last checked state is 18 tracked / 9 indexed / 9 not indexed with no pending/errors/warnings. Do not spam repeated recrawl requests.
5. MONITOR — Live sitemap contains one Phone canonical. Settled sitemap/search-performance data may lag the Sep 16 Phone release, so wait for settled data rather than treating early zeroes as a verdict.
6. WAITING FOR DATA — Once GA4/GSC produces settled Phone sessions/impressions, use them to inform the product reset; do not use immature zeroes to restore the old UI direction.
7. WAITING FOR SIGNAL — Once tool-page impressions appear, use actual query/page data to decide which existing page deserves optimization.
8. SCOPE LOCK — Do not select new broad tool families. New demand signals must either deepen Phone Radar or justify maintenance/freshness work inside Reset Radar or Relay Exit Risk.
9. ACTIVE LIGHT DISTRIBUTION — PR #27 provides an accurate public GitHub README discovery path and the existing IndexNow workflow is verified working. Avoid bulk spam submissions.
10. DONE — Bing Webmaster API access is connected in GSC Wizard. Bing recognizes the site and exposes crawl/index data.
11. DONE — The small Google request-indexing set was submitted: `/tools/`, `/tools/cursor-usage-reset/`, and `/tools/image-compressor/`.
12. DONE — Breakthrough-page pilot shipped: PR #30 deepened the already-indexed Cursor reset page while preserving the canonical URL.
13. ACTIVE — Measure Cursor query coverage, impressions, CTR and engagement after data settles. Do not title-churn before enough sample exists.
14. ACTIVE — First authority outreach round: three personalized emails were sent on Sep 13 to hsmart.dev, Continuum Code and Drew Bredvick. Sep 18 check found no reply/verified link; recheck Sep 20.
15. ACTIVE — AI discovery baseline remains measured separately from classic search. Cursor is the first citation-readiness pilot.
16. DONE — PR #32 established `docs/AI_RETRIEVAL_BENCHMARK.md`; Exa known-URL extraction works while semantic discovery remains weak.
17. DONE — Production verification for PR #32 confirmed new root `/llms.txt` and `/ai.txt`; provider cache freshness remains separate from live-origin state.
18. ACTIVE / PARTLY BLOCKED — Execute `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` strictly in order. Tavily quota and GitHub metadata-write blockers remain blockers; do not pay/bypass/invent results.
19. NEXT — On Sep 20, inspect the three original Gmail threads and independently verify any claimed link/citation before deciding on one tailored follow-up or batch 2.
20. PREPARED / HOLD — A second outreach batch is researched but stays held until the first-round follow-up decision.
21. WAITING — Re-run provider retrieval benchmarks only when the blocked providers can actually execute and enough propagation time has passed.
22. NEXT — Measure AI visibility using GA4/GSC Wizard assistant referrals plus available Bing/Google AI visibility reports when data exists.
23. MONITOR — Continue watching not-indexed tracked URLs without manual submission churn.
24. DONE — Relay Exit Risk v2 production closure is complete through PR #42–#44 and remains a secondary product.
25. MONITOR — Keep Relay Exit Risk v2 operational and accumulate real lifecycle/community history. Do not package it as a calibrated shutdown/fraud probability.
26. DONE — PR #48 repositioned the homepage around reset/access/reliability.
27. DONE / STATIC ASSET CHOSEN — PR #48 uses the final lightweight Relay illustration; do not replace it without an explicit visual task.
28. DONE — PR #63 shipped the Claude Code Limit Reset Calculator.
29. STRATEGY LOCK — Product scope remains frozen to three surfaces: Phone Radar primary, AI Reset Radar secondary, Relay Exit Risk secondary.
30. DONE / PRODUCTION RELEASE — Phone canonical is live at `/tools/phone-number-survival-guide/`; old internal canary path is not public.
31. DONE / MONITOR — Daily Phone radar watches buying, activation, SMS/OTP, eSIM/physical SIM, roaming, KYC/passport, retention/expiry and route/provider lifecycle signals. Use it for product depth, not mass pages.
32. DONE / STRATEGY — `docs/PHONE_NUMBER_LIFECYCLE_PRODUCT_PLAN.md` preserves lifecycle/reminder technical history, but Phone product/research direction now follows the newer reset/product/method docs when they conflict.
33. DONE / MONITOR — The disposable source watcher remains an observer only. Its output is a review trigger, not product authority and not an automatic rewrite source.
34. DONE / MONITOR — The four-hourly Phone Community Demand Radar consumes bounded public forum feeds. Its output is a discovery lead stream. Real-user community outcomes are the primary operational dataset only after the underlying reports are reviewed for recency, independence and concrete outcomes; the watcher itself never auto-publishes claims.
35. DONE / OPERATIONS — Sep 16 operational audit/backup hardening is complete; the resource-tight trial observer receives no new duties.
36. BACKLOG / DO NOT DISPLACE PRODUCT VALIDATION — MY-16 Qwen deployment hardening remains technical debt and is promoted only by a verified deployment/rollback blocker.
37. HOLD AS DEFAULT NEXT ACTION — Provider-by-provider Phone route expansion is paused. AIS and RedPocket remain candidates/inputs, not milestones.
38. ACTIVE / HIGHEST PHONE PRIORITY — **Q-014 Phone Radar product reset.** Follow `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md`: define the route-card contract, tutorial/detail contract, community-outcome data model and visual decision model before any production implementation. Concrete routes must be visible without completing a questionnaire. No fake SMS success percentage and no arbitrary Phone risk score.

## Measurement cadence

- Daily: VPS Phone radar runs automatically; no manual full scan required. Use new community route/outcome signals to identify decision gaps, not to create keyword-variant pages.
- Every 4 hours: the disposable Phone Community Demand Radar reads a small set of public forum feeds and writes bounded summaries; use repeated first-hand questions/outcomes as leads for review, not automatic facts.
- Twice weekly while indexing is immature: inspect GSC indexing tracker, sitemap state, new `/tools/` impressions and AI-assistant referral baseline when settled data exists.
- For Phone Radar: prioritize recent setup success/failure, SMS/OTP outcomes, keep-alive cost, number loss/recovery, complaints, refunds/restorations, support outcomes and current tutorials. Stop when more research would not change the user's decision or action.
- For Relay Exit Risk: verify scheduler/source freshness and child exit health alongside real vote volume, abuse/spam behavior and referral/search demand before adding more reputation features.
- Every outreach/distribution action: immediately update `docs/AUTHORITY_AND_AI_DISCOVERY.md`; before any follow-up, read the original Gmail thread plus the ledger.
- After each AI-native provider benchmark: update `docs/AI_RETRIEVAL_BENCHMARK.md` and separate discovery from extraction/cache freshness.
- For AI retrieval integration: advance only the next eligible AIR task; blocked means blocked.
- Weekly: update this phase board/current sprint only if status or priority changed.
- After every production release: update `PROJECT_CONTEXT.md` checkpoint and this file if a phase/task materially moved.
- Monthly after meaningful traffic: review clicks, impressions, indexed URLs, top pages/queries, referral traffic, AI-assistant referrals/citations, repeat usage where measurable, and AdSense revenue/RPM.

## Decision rules

- The three-product scope is fixed: Phone Radar primary, AI Reset Radar/reset tracking secondary, Relay Exit Risk secondary. Do not create a fourth product surface without an explicit future strategy change.
- Existing generic calculators/image utilities are maintenance-only. Phone work follows `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md` first, then `docs/PHONE_RADAR_PRODUCT_DEFINITION.md` and `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md`.
- Phone route research is organized around real-user outcomes and user decisions, not provider-documentation completeness.
- Operator-published pages are not an operational verification gate for Phone routes. Missing public documentation does not automatically turn a reproduced route into `unknown`.
- Do not publish many pages just because autocomplete returns many variants.
- Improve an existing page when multiple query variants describe the same user job.
- Create a new page only when the user job and tool logic are genuinely distinct.
- Prefer tools that work in-browser, need no account, answer the intent immediately, and have near-zero marginal cost; shared-state tools are acceptable when the shared data is itself the utility.
- When authority is weak, prefer one materially stronger, more trustworthy and more shareable indexed page over many additional average pages.
- For community risk/reputation features, label anonymous votes as sentiment/forecasts, show sample size/confidence, keep satire visibly separate from factual evidence, and never convert crowd opinion into an unsupported allegation.
- AI-answer visibility is not a separate magic algorithm: use crawlability, indexing, clear structure, primary-source evidence, freshness, external corroboration and unique utility, then measure actual citations/referrals.
- AI-native retrieval optimization must remain non-adversarial: never use cloaking, hidden provider-specific text, fake citations, fabricated freshness, synthetic backlinks or deceptive metadata.
- For Exa/Tavily/agent-search tests, do not confuse known-URL extraction success with search discoverability.
- Provider quota/auth/tool failures are not retrieval failures. Record them as blockers.
- `llms.txt` and `ai.txt` are supplemental discovery hints, not substitutes for indexing, ranking or real mentions.
- Treat provider cache/index freshness as a separate state from the live origin.
- Search Console evidence outranks speculative keyword ideas once the site has enough impressions.
- For Google indexing, APIs and changing AI-product limits, relevant provider documentation may remain the primary technical source; this rule does **not** govern Phone route operational evidence.
- Missing paid keyword metrics means "unknown", never a fabricated estimate.
- While indexing is immature, use a few legitimate discovery links in parallel; do not confuse sent outreach with real authority.

## Source-of-truth map

| Need | Source |
|---|---|
| Current factual state | `PROJECT_CONTEXT.md` checkpoint |
| Whole-project stage / task priority | `docs/MASTER_PLAN.md` |
| Current Phone product-reset tasks | `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md` |
| Phone product/user-facing contract | `docs/PHONE_RADAR_PRODUCT_DEFINITION.md` |
| Phone route research method | `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` |
| Phone lifecycle/reminder technical history | `docs/PHONE_NUMBER_LIFECYCLE_PRODUCT_PLAN.md` |
| Execution procedure | `docs/OPERATING_WORKFLOW.md` |
| Outreach / authority / AI-discovery actions and follow-ups | `docs/AUTHORITY_AND_AI_DISCOVERY.md` + original Gmail threads |
| Ordered AI-native retrieval integration tasks | `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` |
| AI-native provider search/extraction benchmark | `docs/AI_RETRIEVAL_BENCHMARK.md` |
| Code/deployment truth | GitHub `main` + verified production |
| New keyword candidates | VPS `/var/lib/aineedhelp-radar/latest.md` |
| Google indexing/search performance | GSC Wizard / Google Search Console |
| Site traffic/engagement | GA4 via GSC Wizard |
| AI-assistant referral traffic | GSC Wizard / GA4 |
| Bing indexing/AI citation state | Bing Webmaster Tools via GSC Wizard where exposed |
| Google generative-AI visibility | Google Search Console reports when available |
| Keyword metrics when available | Ubersuggest |
| Phone operational reality | Current independent community/user reports, tutorials, support interactions shared by users, success/failure incidents and route history |
| Public Phone price/product metadata | Operator/public purchase pages when useful for a concrete cost/purchase field |
| User pain / repeat questions | Public discussions such as Reddit/HN/forums |

Historical AI-agent/MCP strategy documents are not current planning authority. Preserve them only as history; they must not override the current durable sources above.
