# Current Execution Queue

Last updated: 2026-09-25

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` are canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is the short atomic execution queue.

## Execution rule

Execute all eligible work continuously. For confirmed bounded defects inside the active task, continue through diagnosis → smallest safe fix → verification → fact-source update when reversible and authorized. Stop only for an authorization boundary, irreversible/high-impact choice, contradictory facts, or a documented blocker/wait condition.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT / UK PILOT LIVE / BACKSTAGE EVIDENCE ACQUISITION ACTIVE / PUBLIC EXPANSION MEASUREMENT-GATED.**
2. **AI Reset Radar — FROZEN / PRIMARY SURFACES REMOVED / DIRECT URLS PRESERVED.**
3. **Relay Exit Risk — DATA-ACCRUAL EXPERIMENT.**

Phone public production should not churn from tiny search samples, but the Phone research/data pipeline must continue running. A measurement hold is not a research hold.

## JUST COMPLETED — haha SIM activation / real-name admission review

The remaining haha SIM admission blocker was reviewed and recorded in `docs/PHONE_HAHASIM_ACTIVATION_REVIEW_2026-09-25.md`.

Accepted current state:

- current Fortress/OFCA material maps a real activation and real-name workflow: physical SIM activation, activation SMS/number assignment, ICCID-based first haha TRAVEL login, app-based account management, and supported real-name registration with HKID or a valid travel document;
- do **not** present haha SIM as a dependable no-KYC route. Current first-party material allows unregistered states but also documents regulated real-name requirements and spot-check suspension that can interrupt SMS service;
- fresh 2026 community evidence confirms continued mainland/overseas use, but no sufficiently current independent end-to-end new-card reproduction was found covering activation → app login → real-name registration → stable overseas/mainland network → SMS/OTP receipt → balance/expiry verification;
- fresh onboarding-friction evidence remains: a 2026-05 Google Play review reports repeated top-up failure and a 2026-08 review reports a brand-new SIM showing an ICCID/mobile-number mismatch;
- therefore haha SIM remains **HOLD / Watch**. Its resolved `HKD 10+` → `+365 days` retention rule remains valid research state, but the route is not admission-ready.

No public Phone page or route data changed.

## NEXT SESSION — one bounded task only

**Task:** review the next unreviewed Phone watcher candidate batch and current watcher/source health.

**Why now:** haha SIM is now explicitly evidence-blocked until a fresh end-to-end activation/registration reproduction appears. The active Phone strategy requires continuous backstage evidence acquisition rather than repeatedly researching the same blocked route.

**Allowed sequence:**
1. inspect the latest bounded watcher output and identify only candidates newer than the six already dispositioned;
2. verify watcher/source health enough to distinguish source failure from “no new candidates”;
3. disposition each genuinely new candidate as promote / hold / duplicate / insufficient / false-positive using current public evidence only;
4. persist any durable research packet and advance the queue without public production churn.

**Done:** every currently unreviewed candidate is dispositioned, or the session records that there are no new candidates plus verified watcher/source health; any promoted candidate has a precise next research question rather than an automatic publication action.

**Stop / do not substitute:** do not bulk-add routes, do not repurpose another VPS, do not bypass login/403/anti-bot controls, and do not publish a candidate merely because the watcher emitted it.

## haha SIM re-open trigger

Re-open haha SIM admission only when a fresh independent 2026+ end-to-end activation/registration outcome appears, ideally covering a new card through activation, app login, real-name registration, mainland/overseas network registration and actual SMS/OTP receipt, or when a current failure/recovery reproduction shows that the ICCID/registration failure path is predictably recoverable.

## Phone comparison UI benchmark

PR #218 established the accepted comparison-UI research baseline in `docs/PHONE_RADAR_COMPARISON_UI_BENCHMARK_2026-09-25.md`; Eval Gate #724 passed and the PR squash-merged as `3f8f3fb07531da177697a4e004bc284a7d8f3ea9`.

Future evidence-qualified Phone UI direction remains:

- default **Browse** mode: dense, immediate, filterable comparison with host-network grouping;
- optional **Compare** mode: pin 2–4 routes into a fixed side-by-side field comparison;
- **Guide** mode: concise execution text opened from the selected route;
- graphical components only when driven by real route data: landed-cost breakdown, keep-alive timeline, app-evidence chips and dated route-history timeline;
- “make the numbers complete” means make each admitted route decision-complete, not bulk-fill countries/providers with weak evidence.

This benchmark does not authorize immediate production churn.

## Active Search Console measurement path

- Use Windsor.ai `searchconsole` for current Search Console reads on `sc-domain:aineedhelpfromotherai.com`.
- Do not use GSC Wizard for new reads; its free/trial quota is exhausted and it is deprecated for the project.
- If Windsor.ai later fails, use Google's official Search Console API/export; do not rotate trial accounts or change billing without authorization.
- Latest accepted Phone signal remains `survival number` on 2026-09-23: 1 impression, 0 clicks, average position 22. One impression is not a production-change signal.

## Phone evidence pipeline state

Community watcher v1.1 is deployed and runtime-verified on the disposable trial observer. Qwen → key-only SSH is the current control path. The first six candidates were dispositioned; Saily Switzerland and haha SIM produced durable research packets. The haha retention conflict and activation/registration admission review are now both resolved to explicit research states; haha remains HOLD pending its trigger.

`phone-source-watch` remains the separate reviewed official/commercial source-change role. External linked domains are candidates only and must not be auto-crawled.

No second observer should be assigned merely to satisfy topology. `codex-vps` remains Relay-history and must not be repurposed without a concrete reliability/value reason.

## Phone publication queue

The current public surface remains the UK index/matrix. Backstage evidence may lead to either an evidence-backed improvement on the existing index or an evidence-rich route detail page only after the route clears the publication gate in `docs/PHONE_RADAR_OPERATING_PLAN_2026-09-24.md`.

Do not create country/provider pages for coverage. A separate route page requires unambiguous route identity/acquisition, current commercial facts, meaningful independent operational evidence, substantial unique execution content, visible freshness/conflicts and both product-value gates.

## Search Console 404 notice

The 2026-09-20 Search Console validation notice still concerns intentionally removed former paths unless a currently intended URL appears among affected examples. Do not revive or redirect old `/cases/`, `/learn/`, `/stats/`, historical `.well-known` assets, old feeds/failure-index/OpenAPI assets, or `/mcp/` merely to make validation green.

## External waits

- **TikTok App Review — WAITING.** Do not Recall/edit submitted configuration, demo, credentials, URLs, products or scopes until Approved or Rejected/Changes requested.
- **AIR-4 Authority batch 2 — WAITING.** Learn Cursor + explainx.ai were sent 2026-09-22. No third target or follow-up before 2026-09-29 or later.

## Do not do next

- do not stop Phone research merely because the public page is in a measurement window;
- do not immediately bulk-add another market/provider/ranking model to production;
- do not bulk-add weak global Phone rows;
- do not invent compatibility percentages or a Phone risk score;
- do not create country/provider doorway pages or a temporary-SMS backend;
- do not scrape login-gated marketplaces or teach moderation evasion;
- do not reopen Reset/Codex generic tracker work;
- do not reopen Relay methodology;
- do not migrate production to Astro as part of Phone work;
- do not rotate trial accounts or upgrade/pay to bypass tool quotas;
- do not change DNS, AdSense, billing, paid services, or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
