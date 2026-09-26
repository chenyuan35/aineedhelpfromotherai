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

## JUST COMPLETED — first settled Search Console decision read — KEEP

**Decision: KEEP** the existing UK Phone pilot unchanged. This is a measurement-hold decision, not proof that the current surface has won.

Windsor.ai `searchconsole` was read in finalized mode (`include_fresh_data=false`) for `2026-09-16` through `2026-09-23` on `https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/`:

- page-level settled data: `2026-09-21` = 1 impression / 0 clicks / position 9; `2026-09-23` = 2 impressions / 0 clicks / average position 13.5;
- cumulative page-level sample = **3 impressions / 0 clicks / 0% CTR / weighted average position 12.0**;
- query-level visible data contains only `survival number` = 1 impression / 0 clicks / position 22 on `2026-09-23`; the other two page impressions are not exposed at query granularity in this low-volume sample.

The sample is too small to support **ADJUST** or **NARROW**. Zero clicks across three impressions is not a reliable CTR signal, while one settled impression already occurred at page-level position 9. Therefore public Phone production stays stable and backstage evidence acquisition continues.

**Next measurement trigger:** repeat the settled decision read after at least 7 additional finalized days **and** at least 20 cumulative settled impressions on the canonical, unless a clear indexing regression or materially different query pattern appears earlier. If the date gate arrives but the impression threshold does not, continue KEEP rather than forcing a redesign from noise.

## JUST COMPLETED — PR #233 disposition — REWORK / Draft

PR #233 (`Keep-Alive Assistant`) is **REWORK**, not merge-ready. It was converted back to Draft after reviewing the actual four-file diff against the current KEEP decision and Phone value/publication gates.

The underlying user job remains valid: a user-entered real keep-alive action date can be transformed into a next-deadline reminder, which has computation and repeat-use value beyond a static carrier rule. The current implementation is not acceptable for release because it: (1) mixes in `docs/PHONE_DATABASE_EXPANSION.md`, an obsolete bulk global-coverage/Tier-2 placeholder strategy; (2) invents a default 15% "safe" buffer where route evidence does not provide one; (3) adds five public URLs, including four template-heavy brand pages that do not independently clear the publication gate; (4) prefills the last-action date with today and immediately computes from that unverified assumption; and (5) uses a fixed recurring calendar RRULE that can drift from the user's real later action dates.

Re-open only after the branch is rebased on current `main`, the obsolete database-expansion file is removed, the interaction is narrowed to evidence-derived or explicitly user-configured logic, user dates require explicit input, calendar semantics follow real actions, and a later eligible production task authorizes a public change.

## JUST COMPLETED — first Kimi/Qwen five-route provenance/admission batch

`docs/PHONE_FIVE_ROUTE_PROVENANCE_ADMISSION_REVIEW_2026-09-26.md` reviewed actual independent discovery/operational evidence plus current first-party verification for Tello PAYG, ClubSIM, Hotlink Pantas, Globe Prepaid and povo 2.0.

- **Tello — ADMIT-BACKSTAGE.** Multiple independent community sources support the route and its overseas-number use case. The frozen `$0.06/year` value is rejected; current PAYG starts at USD 20 / 90 days, and risk-control/account-closure evidence must remain visible.
- **ClubSIM — ADMIT-BACKSTAGE.** Current first-party terms preserve the 365-day service-pack lifecycle and the current web surface still lists the HKD 6 SMS pack. July 2026 users reported the HKD 6 option missing in-app, so availability remains a live conflict rather than a guaranteed annual-price claim. The NodeSeek/NodeLoc same-author cross-post counts once.
- **Hotlink Pantas — ADMIT-BACKSTAGE.** Current Hotlink FAQ directly confirms RM30 for the 365-day Active Period Pass. The old RM2/year claim is rejected: RM2 is a 1GB/365-day internet pass and does not keep an inactive SIM active.
- **Globe Prepaid — HOLD.** Existing lawful-eligibility gate remains unresolved; raw Kimi `PROMOTE` does not supersede canonical evidence.
- **povo 2.0 — HOLD.** The 180-day topping lifecycle is current, but the SMS-capable voice+data route remains gated by Japanese identity/residency documents; data-only is a separate non-SMS product.

No public Phone route/page changed, and frozen PRs #234–#241 remain unaccepted raw research.

## BLOCKED — PR #253 normalized Phone data foundation release

PR #253 has been rebased onto current `main` (`b10bd33f9f169a356ff9b5c108372fceb07b2816`) without overwriting the parallel TikTok OAuth handoff change. Current PR head is `5e8d0387a6b93c6da7bea69c84514d8a9b9aa335`; the PR is mergeable, `git diff --check` passes, Eval Gate #801 passes, and CI #150 passes.

The release gate is blocked only on Vercel Preview. The fresh deployment `dpl_6jPnLTVtJS21UGLN3ptFDYeMKA6X` failed. GitHub points it to Vercel scope `chenyuan-s-projects`; the connected Vercel app returns HTTP 403 for that scope, and the authenticated Vercel CLI available on the approved Qwen control host can access only `chenyuan19920509-5309s-projects`, not `chenyuan-s-projects`. Therefore the failing deployment logs cannot currently be inspected through an authorized correct-scope session. This is an access/provider blocker, not evidence of a Phone code defect.

**Re-open trigger:** obtain authorized access to Vercel scope `chenyuan-s-projects`, inspect the existing PR #253 deployment failure, apply a bounded code/config fix only if the logs identify one, and require a fresh real Preview success before merge. Do not create fake/no-op commits merely to retrigger Vercel.

**After merge only:** queue importer-based canonical ingestion of Tello / ClubSIM / Hotlink Pantas, preserving the audited correction/conflict fields.

**Stop / do not substitute:** do not merge PR #253 while Vercel is red; do not hand-edit public Phone cards; do not bulk-merge #234–#241; do not start route ingestion as a substitute for the blocked release.

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
- The first full settled decision read is complete: 2026-09-16..2026-09-23 yielded 3 page impressions, 0 clicks and weighted average page position 12.0; the only exposed query was `survival number` with 1 impression at position 22.
- Current decision is **KEEP** because the sample is too small to justify public churn. Re-read after at least 7 additional finalized days and 20 cumulative settled impressions, unless a clear regression or materially different query pattern appears earlier.

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

- current public Phone instruction is **KEEP**; do not add or churn public Phone URLs until a later evidence-backed decision changes that instruction;
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
