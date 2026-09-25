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

## JUST COMPLETED — V2EX reply-fragment dedupe repair

The confirmed V2EX `#replyN` duplicate-emission defect is closed. PR #225 normalized V2EX links to the root thread only for the dedupe key while preserving original URLs and leaving other sources unchanged. Eval Gate #740 and Vercel passed.

Post-deploy runtime verification exposed one bounded migration edge: historical `seen.txt` hashes were based on the full fragment URL, so the first normalized run could re-emit an already-known root once. PR #226 added legacy compatibility against bounded historical `candidates.tsv`, seeds the normalized hash without re-emission, and preserves unseen V2EX roots. Eval Gate #742 and Vercel passed.

The merged watcher was redeployed to the original disposable observer. Five V2EX rows emitted during the PR #225 migration run were each verified to have an older same-root record, backed up off-host to Qwen, and removed from `candidates.tsv` and `signals.tsv`. The final 2026-09-25 14:42 UTC systemd run exited 0, kept the timer active, returned HTTP 200 for Reddit/NodeLoc/NodeSeek/V2EX, and emitted no V2EX duplicate candidate; its only new candidate was a new NodeSeek thread.

## NEXT SESSION — one bounded task only

**Task:** resolve the Globe Philippines ordinary-Prepaid long-term eligibility question and overseas SMS/OTP implications.

**Why now:** Globe was one of only two backstage promotions from watcher batch 2, and the watcher precision blocker is now closed. The current first-party tourist rule limits tourist-registered SIM validity to 30 days, so eligibility must be resolved before treating Globe as a long-term route.

**Allowed sequence:**
1. verify current Globe SIM-registration classes and the exact tourist/non-tourist validity rules from first-party sources;
2. determine whether a lawful non-tourist foreign-national registration path is actually available to the target user and what documentation/status it requires;
3. reconcile current 2026+ independent evidence on keeping ordinary Globe Prepaid active abroad and receiving SMS/OTP;
4. record a backstage PROMOTE / HOLD / REJECT decision with explicit unresolved fields and re-open trigger;
5. do not change the public Phone matrix unless a later independent publication task clears the route-page/value gates.

**Done:** the eligibility question is resolved enough to classify the route for further research, or it is explicitly held with the missing evidence and trigger documented.

**Stop / do not substitute:** do not broaden this session into Holafly, public Phone UI changes, country/provider doorway pages, seller scraping, account/login bypass, or observer-topology work.

## Promoted batch-2 packets

- **Globe Philippines — backstage only.** Current tourist registration is time-limited; the unresolved question is whether a lawful non-tourist registration path makes ordinary Globe Prepaid a real long-term route for the target user.
- **Holafly Always On — backstage Data eSIM only.** Current first-party material supports 1 GB/month backup data for a bounded period on an installed eSIM, but it is data-only and not a long-term SMS/OTP-number route.

## Watcher precision status

**CLOSED 2026-09-25.** PRs #225/#226 repaired V2EX fragment-only duplicate emission, including legacy-state migration compatibility. Final live verification produced no duplicate V2EX candidate and did not suppress the source.

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

Community watcher v1.1 is deployed and runtime-verified on the disposable trial observer. Qwen → key-only SSH is the current control path. The first six candidates and the 55-record second batch are fully dispositioned; durable backstage packets now include Saily Switzerland, haha SIM (HOLD), Globe Philippines and Holafly Always On. The V2EX reply-fragment precision defect found in batch 2 is closed by PRs #225/#226 and final live verification.

`phone-source-watch` remains the separate reviewed official/commercial source-change role. Its Sep 25 Mobal pricing/ID events are reconciled; no production Mobal route fact changed. External linked domains are candidates only and must not be auto-crawled.

No second observer should be assigned merely to satisfy topology. `codex-vps` remains Relay-history and must not be repurposed without a concrete reliability/value reason. Sep 25 handoff verification confirmed both observer hosts are alive: the Phone trial host is reachable by Qwen key-only SSH with healthy latest watcher exits, and `codex-vps` is Tailscale-online with a successful same-day Relay backup. Its interactive Tailscale SSH currently asks for an additional authorization check; do not misclassify that prompt as host death or divert the next session into topology repair.

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
