# Current Execution Queue

Last updated: 2026-09-26

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` are canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is the short atomic execution queue.

## Execution rule

Execute all eligible work continuously. For confirmed bounded defects inside the active task, continue through diagnosis → smallest safe fix → verification → fact-source update when reversible and authorized. Stop only for an authorization boundary, irreversible/high-impact choice, contradictory facts, or a documented blocker/wait condition.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT / UK PILOT LIVE / BACKSTAGE EVIDENCE ACQUISITION ACTIVE / PUBLIC EXPANSION MEASUREMENT-GATED.**
2. **AI Reset Radar — FROZEN / PRIMARY SURFACES REMOVED / DIRECT URLS PRESERVED.**
3. **Relay Exit Risk — DATA-ACCRUAL EXPERIMENT.**

Phone public production should not churn from tiny search samples, but the Phone research/data pipeline must continue running. A measurement hold is not a research hold.

## JUST COMPLETED — Holafly Always On backstage Data eSIM review / watcher batch-2 closeout

`docs/PHONE_HOLAFLY_ALWAYS_ON_REVIEW_2026-09-26.md` classifies Holafly Always On **PROMOTE / BACKSTAGE DATA-ESIM PACKET / NO PUBLIC PRODUCTION CHANGE**. PR #231 passed Eval Gate #763 and squash-merged as `413e6c3ec919225b12472dbeaa27ac6b820e9397`.

Current first-party material supports 1 GB/month backup data, automatic 30-day refresh from installation, no roll-over, coverage including China / Hong Kong / Singapore / Taiwan / Japan / Macao, and a keep-installed/no-delete lifecycle constraint. Always On is data-only and must not be represented as a long-term SMS/OTP-number route.

Three unresolved fields remain: (1) explicit Always-On service duration ceiling, (2) explicit device-transfer policy beyond keep-installed/do-not-delete, and (3) first-party coverage metadata inconsistency (`70+` in meta description vs `150+`/enumerated destinations in page body). A separate evidence gap remains: no independent 2026 end-to-end reproduction was obtained for monthly-refresh arrival, speed/availability, or failure/refund behavior. These are re-open triggers, not blockers to the backstage classification.

Watcher batch-2 is now fully dispositioned. No public Phone route/page changed.

## NEXT SESSION — one bounded task only

**Task:** run the first settled-data Search Console decision read for the UK Phone pilot via Windsor.ai `searchconsole`, ending in one explicit **KEEP / ADJUST / NARROW** decision for the existing canonical.

**Why now:** batch-2 evidence review is complete, while public Phone production remains measurement-gated. A bounded eligibility check on 2026-09-26 used Windsor's default finalized-data mode (`include_fresh_data=false`) and returned a Phone canonical row dated 2026-09-23, which proves finalized coverage extends beyond the required `2026-09-16` gate. The full decision read has not yet been performed.

**Allowed sequence:**
1. read finalized Search Console data for `/tools/phone-number-survival-guide/` from the settled window, including date/page/query/clicks/impressions/CTR/position;
2. separate query/page evidence and avoid mixing Google organic with referral/social/direct/AI traffic;
3. compare the settled evidence against the shipped UK pilot's current job and prior baseline;
4. record exactly one decision: **KEEP**, **ADJUST**, or **NARROW**, with the evidence and threshold that supports it;
5. if the decision implies a production change, queue that change as a separate next-session task rather than modifying public Phone production in the measurement-read session.

**Done:** the queue contains one evidence-backed KEEP / ADJUST / NARROW decision for the UK pilot, with the settled date range, query/page evidence, unresolved uncertainty, and the next production or measurement trigger.

**Stop / do not substitute:** do not touch public Phone production before the measurement-gated decision is made; do not bulk-add weak global rows; do not create country/provider doorway pages; do not turn a tiny or ambiguous sample into a forced redesign; do not switch to a new route unless a fresh 2026+ independent reproduction clears the route evidence gate.

## Backstage packet set — batch-2 fully dispositioned

- **Saily Switzerland — backstage research packet / PROMOTE.** Retained as the earlier data-eSIM incident/recovery packet from the first six watcher candidates.
- **haha SIM — HOLD.** Re-open only on a fresh independent 2026+ end-to-end activation/registration outcome or a current failure/recovery reproduction showing the ICCID/registration path is predictably recoverable.
- **Globe Philippines — HOLD.** A lawful long-term class exists for qualifying non-tourist visa holders, but ordinary tourist registration remains 30-day-limited unless an approved visa extension is presented; current evidence still lacks a qualifying-foreigner end-to-end mainland-China long-term OTP reproduction.
- **Holafly Always On — PROMOTE / backstage Data eSIM only.** Re-open on a first-party explicit duration ceiling, an explicit device-transfer rule, resolution of the `70+` vs `150+` coverage inconsistency, or fresh 2026+ independent reproduction of monthly refresh / speed / failure / refund behavior.

## Watcher precision status

**CLOSED 2026-09-25.** PRs #225/#226 repaired V2EX fragment-only duplicate emission, including legacy-state migration compatibility. Final live verification produced no duplicate V2EX candidate and did not suppress the source.

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
- The 2026-09-26 eligibility check used Windsor's default finalized-data mode and returned a Phone canonical row dated 2026-09-23, so the `settledThrough ≥ 2026-09-16` gate for the first KEEP / ADJUST / NARROW read is satisfied.
- Do not infer the decision from that eligibility check alone; the next session must run the bounded settled-data read.

## Phone evidence pipeline state

Community watcher v1.1 is deployed and runtime-verified on the disposable trial observer. Qwen → key-only SSH is the current control path. The first six candidates and the 55-record second batch are fully dispositioned; durable backstage packets now include Saily Switzerland, haha SIM (HOLD), Globe Philippines (HOLD) and Holafly Always On (PROMOTE). The V2EX reply-fragment precision defect found in batch 2 is closed by PRs #225/#226 and final live verification.

`phone-source-watch` remains the separate reviewed official/commercial source-change role. Its Sep 25 Mobal pricing/ID events are reconciled; no production Mobal route fact changed. External linked domains are candidates only and must not be auto-crawled.

No second observer should be assigned merely to satisfy topology. `codex-vps` remains Relay-history and must not be repurposed without a concrete reliability/value reason. Sep 25 handoff verification confirmed both observer hosts are alive: the Phone trial host is reachable by Qwen key-only SSH with healthy latest watcher exits, and `codex-vps` is Tailscale-online with a successful same-day Relay backup. Its interactive Tailscale SSH currently asks for an additional authorization check; do not misclassify that prompt as host death or divert the next session into topology repair.

## Phone publication queue

The current public surface remains the UK index/matrix. Backstage evidence may lead to either an evidence-backed improvement on the existing index or an evidence-rich route detail page only after the route clears the publication gate in `docs/PHONE_RADAR_OPERATING_PLAN_2026-09-24.md`.

Do not create country/provider pages for coverage. A separate route page requires unambiguous route identity/acquisition, current commercial facts, meaningful independent operational evidence, substantial unique execution content, visible freshness/conflicts and both product-value gates.

A new evidence-qualified route is not an eligible next task merely because a provider exists. Re-open route admission only when a fresh 2026+ independent reproduction appears and clears the evidence gate.

## Search Console 404 notice

The 2026-09-20 Search Console validation notice still concerns intentionally removed former paths unless a currently intended URL appears among affected examples. Do not revive or redirect old `/cases/`, `/learn/`, `/stats/`, historical `.well-known` assets, old feeds/failure-index/OpenAPI assets, or `/mcp/` merely to make validation green.

## External waits

- **TikTok App Review — WAITING.** Do not Recall/edit submitted configuration, demo, credentials, URLs, products or scopes until Approved or Rejected/Changes requested.
- **AIR-4 Authority batch 2 — WAITING.** Learn Cursor + explainx.ai were sent 2026-09-22. No third target or follow-up before 2026-09-29 or later.

## Do not do next

- do not touch public Phone production until the measurement-gated KEEP / ADJUST / NARROW decision is made;
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
