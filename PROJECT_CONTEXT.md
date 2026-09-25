# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-26

This file is the compact current-facts source for the project. Historical execution detail belongs in task-specific docs, PRs and the Google Docs journal. If anything here conflicts with GitHub `main` plus verified production, GitHub `main` and verified production win.

## Current progress checkpoint

After reading `AGENTS.md`, read this checkpoint before any deeper project inspection. Do not rescan the whole repository, VPS fleet, deployment history or old chats unless this checkpoint is stale, contradictory or the selected task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | `https://aineedhelpfromotherai.com/` is live. Vercel deploys the static frontend from GitHub `main`; the historical Express/PostgreSQL runtime remains only behind the allowlisted API surface required by Relay Exit Risk. | Use fresh branches/PRs; never reset or overwrite the dirty production worktree. |
| Product direction | **STRATEGY RESET ACCEPTED 2026-09-23.** Search volume, rankings and technical polish no longer choose the product. Both official-source substitutability and independent-competitor substitutability are mandatory gates. Reset has been removed from primary site/discovery surfaces. | Active growth work stays on Phone Radar. Reset direct URLs remain preserved; Relay remains data-accrual only. |
| Phone Radar | **ACTIVE PRIMARY GROWTH PRODUCT / UK DIRECTORY PILOT SHIPPED + PRODUCTION VERIFIED.** The existing canonical is the visual index/comparison surface. Public expansion remains evidence-gated, while backstage evidence acquisition should run continuously. | Keep production stable while search/interaction evidence accrues; operate the Phone evidence pipeline in parallel and deepen only evidence-qualified routes. |
| Phone evidence acquisition | **WATCHER V1.1 HEALTHY / BATCH-2 FULLY DISPOSITIONED.** Globe Philippines remains HOLD; Holafly Always On is PROMOTE / backstage Data-eSIM only after PR #231 (`413e6c3`) closed the bounded review. Community-first candidate discovery continues in parallel; provider pages verify existing candidates but do not create them. | Continue high-throughput community/forum evidence acquisition backstage, keep raw delegated findings as `RESEARCH CANDIDATE`, and admit nothing public until the evidence/value gates pass. |
| AI Reset Radar | **FROZEN / PRIMARY SURFACES REMOVED / DIRECT URLS PRESERVED.** Seven-page value classification remains: Cursor DOWNGRADE; Claude REPURPOSE; GitHub Copilot KEEP/DIFFERENTIATE; Manus DOWNGRADE; Replit DOWNGRADE; Bolt REPURPOSE; AI Credit Burn KEEP/DIFFERENTIATE. | No Cursor-first optimization, no Q-015, no new generic reset pages and no generic Codex reset tracker. |
| Codex opportunity | Real demand exists, but current competitors already cover generic reset/history/countdown/quota jobs. | Competitor-gap research only; future build requires a narrower non-duplicative job. |
| Relay Exit Risk | **PRESERVE / DATA-ACCRUAL EXPERIMENT.** Product and methodology remain production-verified. | Continue legitimate historical snapshots/lifecycle accumulation. No search-led feature expansion without demand/usage evidence. |
| Search Console | **FIRST SETTLED PHONE DECISION READ COMPLETE — KEEP.** Windsor.ai finalized data for 2026-09-16..2026-09-23 shows 3 page impressions, 0 clicks, 0% CTR and weighted average page position 12.0; the only exposed query is `survival number` with 1 impression at position 22. | Keep the current UK Phone surface stable; re-read after at least 7 additional finalized days and 20 cumulative settled impressions unless a clear regression or materially different query pattern appears earlier. |
| Keyword research | Sep 23 evidence is sufficient for current direction; Ubersuggest hit daily quota, Ahrefs returned `Insufficient plan`, Semrush returned `no_api_units`. | Do not rotate accounts or upgrade/pay without authorization. |
| TikTok App Review | **SUBMITTED / WAITING FOR REVIEW.** | Do not Recall/edit submitted configuration, demo, credentials, URLs, products or scopes until Approved or Rejected/Changes requested. |
| Authority | **AIR-4 BATCH 2 SENT / WAITING.** Learn Cursor + explainx.ai were sent 2026-09-22. | No third target or follow-up before 2026-09-29 or later. |
| Frontend foundation | Astro 7 + Tailwind 4 exists under `frontend/astro/` but is not the production build path. | No broad migration/redesign as part of Phone work. |
| Observer access | `qwenpaw-sbs-prod-h2grp` / `qwen-control` is the verified control/jump path, not the Phone systemd observer host. On Sep 25, explicit key-only SSH with Qwen's existing `aineedhelp_trial_backup_ed25519` successfully authenticated to the same original Debian 13 trial observer after its ED25519 host key matched the stored Sep 15 fingerprint. The host had no OOM events in the inspected boot; all four observer timers were enabled and their latest services exited 0. `remote-desktop-commander.service` itself is not a reliable control channel: its persisted session fails with `Invalid Refresh Token: Already Used`, it had accumulated 148 restarts, and it was waiting for a new device authorization. The Phone watcher remains controllable through Qwen SSH, so no reinstall/reimage was needed. After the bounded cache cleanup and v1.1 run, root disk is 82% used; RAM had about 101 MiB available, although swap remained heavily occupied. `codex-vps` remains a separate Relay-history host and was not repurposed. | Use Qwen key-only SSH as the current observer control path. Do not repair/re-enroll RDC unless there is a concrete need, and do not repurpose `codex-vps`, `yuan` or `hermes`. Continue bounded disk/source-health monitoring and keep valuable summaries copied off the disposable observer. |
| AI retrieval | Exa extraction works; semantic discovery remains weak. Tavily quota and GitHub metadata-write blockers remain. | Follow AIR docs in order; do not bypass provider blockers. |

## Immediate priority

**Run two tracks in parallel: keep the public Phone surface stable for measurement, and continuously acquire/normalize Phone evidence backstage.**

The public UK comparison pilot remains the current production baseline on `/tools/phone-number-survival-guide/`. The first settled read is still only three impressions, so the current instruction is KEEP: do not churn it or add weak global rows just to increase URL/page count.

At the same time, a measurement hold is not a research hold. Phone Radar only becomes defensible if the project continuously captures changing operational evidence: acquisition paths, real landed prices, discounts, app-specific success/failure, activation friction, seller/platform failures, number loss/recycling, recovery/refunds and route freshness.

Current execution sequence:

1. **DONE — repository watcher v1.1.** PR #211 merged as `3204ee0be13411c146e1031bbf13a094949f679f`; Eval Gate #709 passed, including the new watcher audit and all existing Phone build/eval checks.
2. **DONE — trial observer access recovery + v1.1 runtime verification.** Qwen key-only SSH is restored; disk-full was bounded/fixed after off-host backup; v1.1 real-run/source-health/memory/timer checks passed;
3. **DONE — first six watcher v1.1 candidates dispositioned.** Two durable research packets were promoted (Saily Switzerland data-eSIM incident cluster; Fortress haha SIM retention-price conflict), while four records were rejected/held as false-positive, insufficient, duplicate or restricted seller evidence;
4. **DONE — Fortress haha SIM retention rule resolved.** Current Fortress product-specific material says `HKD 10+` balance top-up extends validity 365 days and directs current balance top-up to haha TRAVEL App; the generic 3HK web-recharge `HKD 100` floor is not the haha-specific keep-alive rule;
5. **DONE — haha SIM activation/real-name/onboarding review.** Official activation and registration flow is mapped, but fresh 2026 independent evidence does not yet provide a clean end-to-end new-card reproduction and current app/onboarding failure reports remain. Route stays HOLD until the explicit trigger in `docs/PHONE_HAHASIM_ACTIVATION_REVIEW_2026-09-25.md` fires;
6. **DONE — watcher batch 2 + live source-health review.** Fifty-five new candidate records / 31 root threads were dispositioned; Globe Philippines and Holafly Always On were promoted backstage, while 53 records were closed as insufficient, duplicate/restricted or false-positive. Live health verified community sources 4/4 HTTP 200 and source-watch 22 total / 16 ok-or-304 / 2 robots-skip / 4 explicit fetch blockers. The review also confirmed 24 excess V2EX reply-fragment emissions;
7. **DONE — Mobal Japan source-change reconciliation.** `mobal_pricing` was classified as reverted/page churn for the existing accepted Voice+Data route; current durable facts remain JPY 4,950 list price and JPY 1,650/month for the 1GB Voice+Data plan. `mobal_id` was non-semantic relative to accepted project facts. No production Phone data changed. See `docs/PHONE_MOBAL_SOURCE_RECONCILIATION_2026-09-25.md`;
8. **DONE — V2EX fragment-only reply dedupe repair.** PR #225 normalized V2EX fragment variants to the root thread for dedupe; PR #226 added legacy-state migration compatibility after live verification exposed a one-time old-hash edge. Eval Gates #740/#742 passed; final observer run verified no V2EX duplicate emission while preserving new non-V2EX evidence;
9. **DONE — Globe Philippines eligibility / overseas-SMS review.** `docs/PHONE_GLOBE_PHILIPPINES_ELIGIBILITY_REVIEW_2026-09-25.md` classifies the route HOLD for general Phone Radar use: long-term foreign-national registration exists only for qualifying non-tourist visa classes, while ordinary tourists remain subject to the 30-day registration limit unless an approved visa extension is presented. Globe retention and overseas incoming-SMS mechanics are viable, but a current qualifying-foreigner → mainland-China → long-term OTP reproduction is still missing;
10. **DONE — Holafly Always On packet.** PR #231 (`413e6c3`) classifies it PROMOTE / backstage Data-eSIM only; 1 GB/month backup, 30-day refresh, no rollover and keep-installed constraints are supported, while explicit duration ceiling, device-transfer policy, coverage metadata consistency and fresh 2026 independent reproduction remain re-open triggers;
11. **DONE — first settled Search Console decision read.** Finalized 2026-09-16..2026-09-23 data returned 3 page impressions / 0 clicks / weighted average position 12.0 and only one exposed query (`survival number`, 1 impression, position 22). Decision: **KEEP**; sample is too small for ADJUST/NARROW;
12. **DONE — PR #233 disposition review: REWORK / Draft.** The core date→deadline reminder job has computation/repeat-use value, but the current PR is not releasable: it mixes in an obsolete bulk global-expansion document, invents an unsourced 15% safety buffer, adds five public URLs including four template-heavy pages, assumes today's date as the user's last real action, and uses fixed recurring reminders that can drift from actual later actions. PR #233 was converted back to Draft and must not merge in current form;
13. **NEXT SESSION — first Kimi/Qwen provenance-admission batch.** Review Tello PAYG, ClubSIM, Hotlink Pantas, Globe Prepaid and povo 2.0 from actual community/forum discovery evidence and classify each ADMIT-BACKSTAGE / HOLD / DROP. Official sources may verify facts only after candidate discovery; frozen PRs #234–#241 remain unaccepted raw research;
14. keep any second-observer/source-watcher host assignment in backlog until a concrete reliability/value reason exists; `codex-vps` remains Relay-history and must not be repurposed by topology alone;
15. keep Search Console measurement running through Windsor.ai, separating organic from referral/social/direct/AI traffic;
16. improve the existing index first when evidence warrants it;
17. publish a separate route detail URL only when the route has substantial unique execution content and passes the route-page gate in `docs/PHONE_RADAR_OPERATING_PLAN_2026-09-24.md`.

**Next independent session is exactly item 13.** Audit Kimi's first five candidate routes by provenance/admission quality; do not merge #234–#241 or reopen public Phone expansion.

## Product rules

- Before build/expansion/optimization, apply `docs/PRODUCT_VALUE_GATE.md`.
- Search volume, ranking, indexing, technical quality and official-source coverage do not prove product value.
- A candidate must survive both `why not the official source?` and `why not the best existing independent competitor?`.
- Do not build clones or documentation wrappers.
- Prefer real demand, clear tool intent, repeat value, speed, low marginal cost and maintainability.
- Improve existing URLs before adding similar URLs.
- Phone Radar value comes from current forum/community information asymmetry: cheap acquisition routes, real landed cost, discounts, keep-alive methods, app compatibility, continuity incidents, seller/platform outcomes and operational history.
- Operator/provider pages are commercial metadata sources by default, not operational truth.
- Missing data lowers confidence; never invent certainty.
- App compatibility percentages may be shown only as observed sample rates with denominator/date when enough independent recent observations exist; otherwise show counts/qualitative state.
- Do not create an arbitrary 0–100 Phone risk score. Show concrete incidents, recoveries/refunds and qualitative trend instead.
- Separate Google organic, social/referral, AI referral and direct/repeat behavior.
- Public marketplace/seller evidence may inform price, acquisition and risk, but do not bypass login/anti-bot controls or reproduce moderation-evasion code words.

## Phone Radar governing rule

Canonical remains `/tools/phone-number-survival-guide/` as the default index/comparison surface unless a separate evidence-backed migration task says otherwise.

The long-term SMS/OTP surface uses this hierarchy:

`country / market → host network / carrier group → brand / MVNO → concrete route / product / acquisition path → timestamped observations/events`

The visual layer must let the user compare at a glance:

- real landed acquisition cost and approximate CNY cost;
- current discount/coupon/acquisition channel;
- yearly keep-alive cost and exact action/interval;
- data/tariff when material;
- China/overseas activation state;
- KYC/device/payment friction;
- Wi-Fi Calling and roaming SMS behavior;
- ChatGPT/OpenAI, Telegram, WhatsApp and other service-specific observations when evidence exists;
- number recycling/suspension/closure incidents;
- seller/platform non-delivery, invalid-number, refund/replacement outcomes when evidence exists;
- refund/recovery/reissue/port-out outcomes;
- current trend and last verified date;
- evidence count/sample size;
- detailed execution guide and acquisition link.

Ranking may be use-case-specific and transparent. Missing data must not improve rank. Observed percentages require route + service + operation-specific evidence and visible sample size/date.

The first shipped pilot is UK-only and intentionally bounded. Lebara UK, Giffgaff and VOXI are actionable pilot candidates; Vodafone UK direct remains an observation/hold route unless a legitimate current long-term path is re-verified. Giffgaff continuity/closure/recovery/refund history is surfaced prominently rather than hidden behind a generic stability label.

A separate route detail page is not forbidden, but it must not be a doorway page. It must solve a distinct execution job with substantial route-specific evidence, current commercial facts, operational corroboration, visible freshness/conflicts and durable user value beyond the comparison row. The publication gate is defined in `docs/PHONE_RADAR_OPERATING_PLAN_2026-09-24.md`.

Backstage keeps bounded source/candidate metadata, reconciliation, duplicate/circular-report checks, event history and methodology. Valuable normalized findings must move off disposable hosts before expiry.

Never recommend forged KYC, fake identities, deceptive support stories, unauthorized access, security bypass or prohibited geography evasion.

## Current architecture and safety

- Canonical host: `https://aineedhelpfromotherai.com/`; `www` redirects to apex.
- Static frontend: Vercel from GitHub `chenyuan35/aineedhelpfromotherai` `main`.
- Isolated future frontend foundation: Astro 7 + Tailwind 4 under `frontend/astro/`; not wired into production build.
- Vercel proxies only current allowlisted backend routes.
- GitHub `main` is code truth.
- Never reset/discard/overwrite the dirty production worktree.
- Fresh branch/worktree → tests → PR → CI/Eval/Vercel Preview → merge → production verification.
- Do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization.
- Never print/commit credentials.
- Never use `hermes`.
- `yuan` is personal workstation, not project infrastructure.
- Trial/temporary VPS hosts are disposable observers unless explicitly promoted.

## Durable fact sources

- `docs/MASTER_PLAN.md` — phase/sprint/exit gates.
- `docs/OPERATING_WORKFLOW.md` — fixed execution workflow.
- `docs/CURRENT_EXECUTION_QUEUE.md` — atomic next actions.
- `docs/PRODUCT_VALUE_GATE.md` — official-source + independent-competitor substitution gates.
- `docs/PRODUCT_DIRECTION_RESET_2026-09-23.md` — Sep 23 direction correction.
- `docs/PHONE_RADAR_OPERATING_PLAN_2026-09-24.md` — active growth/evidence-acquisition architecture, route-detail publication gate and observer operating model.
- `docs/PHONE_RADAR_DIRECTORY_MATRIX_CONTRACT_2026-09-23.md` — accepted Phone information architecture, matrix fields, ranking/evidence rules and implementation boundary.
- `docs/PHONE_UK_PILOT_SOURCE_PACKET_2026-09-23.md` — UK pilot source reconciliation and route evidence packet.
- `frontend/tools/phone-number-lifecycle-mvp/uk-directory-pilot.json` — normalized shipped UK pilot data used by the Phone surface.
- `docs/PHONE_DEMAND_WATCH.md` — community intelligence watcher contract/status.
- `docs/PHONE_WATCHER_CANDIDATE_REVIEW_2026-09-25.md` — first v1.1 six-candidate disposition ledger and promoted Saily/haha SIM research packets.
- `docs/PHONE_WATCHER_CANDIDATE_REVIEW_BATCH2_2026-09-25.md` — second watcher review: 55 new records, Globe/Holafly research packets, source-health checkpoint and V2EX fragment-duplicate finding.
- `docs/PHONE_GLOBE_PHILIPPINES_ELIGIBILITY_REVIEW_2026-09-25.md` — Globe foreign-national eligibility, retention, roaming/SMS evidence, HOLD decision and re-open trigger.
- `docs/PHONE_HAHASIM_RETENTION_RESOLUTION_2026-09-25.md` — resolved haha SIM keep-alive rule.
- `docs/PHONE_HAHASIM_ACTIVATION_REVIEW_2026-09-25.md` — haha SIM activation/registration evidence review, HOLD decision and re-open trigger.
- `docs/PHONE_MOBAL_SOURCE_RECONCILIATION_2026-09-25.md` — Mobal pricing/ID watcher event reconciliation and no-change decision.
- `docs/PHONE_SOURCE_WATCH.md` — reviewed official/commercial source-change watcher contract/status.
- `docs/PHONE_RADAR_PRODUCT_DEFINITION.md` and `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` — durable Phone identity/research method.
- `docs/GSC_MEASUREMENT_2026-09-22.md` — accepted Search Console measurement history; current reads use Windsor.ai.
- `docs/RELAY_RISK_METHODOLOGY.md` — fixed Relay methodology.
- `docs/AUTHORITY_AND_AI_DISCOVERY.md` — authority/referral ledger.
- `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md` — ordered AIR work.

## Handoff rule

At the beginning of a new working session, read GitHub `main` in this exact order: `AGENTS.md` → this file's **Current progress checkpoint** → `docs/MASTER_PLAN.md` → `docs/OPERATING_WORKFLOW.md` → `docs/CURRENT_EXECUTION_QUEUE.md` → `docs/SESSION_EXECUTION_PROTOCOL.md`, then only task-specific docs needed by the selected next action.

GitHub `main` plus verified live production is final truth.
