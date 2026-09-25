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

## JUST COMPLETED — Mobal Japan source-change reconciliation

The two reviewed-source watcher events for Mobal were manually reconciled and recorded in `docs/PHONE_MOBAL_SOURCE_RECONCILIATION_2026-09-25.md`.

Accepted current state:

- `mobal_pricing` is classified as **reverted/page churn for the existing accepted Voice+Data route**;
- current public Mobal Voice+Data facts still support JPY 4,950 list price and JPY 1,650/month for the 1GB plan;
- the page currently shows a temporary 10% sale to JPY 4,455 and a separate Voice-Only product at JPY 1,430/month, but neither makes the existing Voice+Data route stale and neither is auto-admitted by this maintenance task;
- `mobal_id` is classified as **non-semantic with respect to accepted Phone facts**;
- current guidance still requires ID for Voice-capable products, requires delivery ID upload/address matching, allows collection by showing the passport, and exempts Data-Only products from the Voice-product ID-upload flow;
- no production Phone data or public route changed.

## NEXT SESSION — one bounded task only

**Task:** repair the confirmed V2EX reply-fragment dedupe defect in `phone-demand-watch`.

**Why now:** batch 2 confirmed 24 excess candidate emissions caused by fragment-only reply URLs for already-seen root threads. Mobal maintenance is now closed, so this is the next concrete pipeline-quality defect before deepening new Globe/Holafly packets.

**Allowed sequence:**
1. inspect the current V2EX URL normalization/dedupe path and the batch-2 examples;
2. add the smallest normalization that treats fragment-only reply URLs as the same root thread for dedupe;
3. preserve genuinely new evidence and do not broadly suppress V2EX;
4. add/update regression coverage for root-thread versus fragment-only reply URLs;
5. run applicable watcher tests/audit, then use the normal fresh branch/PR/CI path and update canonical facts after verification.

**Done:** fragment-only reply URLs no longer produce duplicate candidate emissions for an already-seen V2EX root thread, genuinely new evidence remains observable, and regression tests pass.

**Stop / do not substitute:** do not broaden this into source suppression, ranking changes, Globe/Holafly publication, production Phone UI changes, or unrelated observer topology work.

## Promoted batch-2 packets

- **Globe Philippines — backstage only.** Current tourist registration is time-limited; the unresolved question is whether a lawful non-tourist registration path makes ordinary Globe Prepaid a real long-term route for the target user.
- **Holafly Always On — backstage Data eSIM only.** Current first-party material supports 1 GB/month backup data for a bounded period on an installed eSIM, but it is data-only and not a long-term SMS/OTP-number route.

## Watcher precision backlog

Batch 2 confirmed 24 excess V2EX reply-fragment emissions. The next bounded repair should normalize fragment-only URLs for dedupe while preserving genuinely new evidence. Do not broadly suppress V2EX or other community sources.

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

Community watcher v1.1 is deployed and runtime-verified on the disposable trial observer. Qwen → key-only SSH is the current control path. The first six candidates and the 55-record second batch are fully dispositioned; durable backstage packets now include Saily Switzerland, haha SIM (HOLD), Globe Philippines and Holafly Always On. Batch 2 also confirmed the V2EX reply-fragment dedupe defect.

`phone-source-watch` remains the separate reviewed official/commercial source-change role. Its Sep 25 Mobal pricing/ID events are reconciled; no production Mobal route fact changed. External linked domains are candidates only and must not be auto-crawled.

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
