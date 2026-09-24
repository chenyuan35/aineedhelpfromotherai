# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-24

This file is the compact current-facts source for the project. Historical execution detail belongs in task-specific docs, PRs and the Google Docs journal. If anything here conflicts with GitHub `main` plus verified production, GitHub `main` and verified production win.

## Current progress checkpoint

Read this section first in a new session. Do not rescan the whole repository, VPS fleet, deployment history or old chats unless this checkpoint is stale, contradictory or the current task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | `https://aineedhelpfromotherai.com/` is live. Vercel deploys the static frontend from GitHub `main`; the historical Express/PostgreSQL runtime remains only behind the allowlisted API surface required by Relay Exit Risk. | Use fresh branches/PRs; never reset or overwrite the dirty production worktree. |
| Product direction | **STRATEGY RESET ACCEPTED 2026-09-23.** Search volume, rankings and technical polish no longer choose the product. Both official-source substitutability and independent-competitor substitutability are mandatory gates. Reset has been removed from primary site/discovery surfaces. | Active growth work stays on Phone Radar. Reset direct URLs remain preserved; Relay remains data-accrual only. |
| Phone Radar | **ACTIVE PRIMARY GROWTH PRODUCT / UK DIRECTORY PILOT SHIPPED + PRODUCTION VERIFIED.** The existing canonical is the visual index/comparison surface. Public expansion remains evidence-gated, while backstage evidence acquisition should run continuously. | Keep production stable while search/interaction evidence accrues; operate the Phone evidence pipeline in parallel and deepen only evidence-qualified routes. |
| Phone evidence acquisition | **WATCHER V1.1 MERGED / RUNTIME DEPLOYMENT BLOCKED BY AUTHENTICATED ACCESS TO THE VERIFIED TRIAL OBSERVER.** PR #211 upgraded community intelligence to hourly bounded collection with service tags, commerce/seller-risk signals, linked public-host candidates and regression coverage; Eval Gate #709 passed. The 128 MiB / 1 GiB trial observer itself is no longer unidentified: Qwen SSH history, the historical RDC authorization log and the still-matching SSH host key identify the same host. | Restore authorized access through the existing Qwen control/SSH path, inspect systemd/journal state before changing anything, then deploy main's v1.1 and verify a real run, source health, memory peak and next timer. |
| AI Reset Radar | **FROZEN / PRIMARY SURFACES REMOVED / DIRECT URLS PRESERVED.** Seven-page value classification remains: Cursor DOWNGRADE; Claude REPURPOSE; GitHub Copilot KEEP/DIFFERENTIATE; Manus DOWNGRADE; Replit DOWNGRADE; Bolt REPURPOSE; AI Credit Burn KEEP/DIFFERENTIATE. | No Cursor-first optimization, no Q-015, no new generic reset pages and no generic Codex reset tracker. |
| Codex opportunity | Real demand exists, but current competitors already cover generic reset/history/countdown/quota jobs. | Competitor-gap research only; future build requires a narrower non-duplicative job. |
| Relay Exit Risk | **PRESERVE / DATA-ACCRUAL EXPERIMENT.** Product and methodology remain production-verified. | Continue legitimate historical snapshots/lifecycle accumulation. No search-led feature expansion without demand/usage evidence. |
| Search Console | **Windsor.ai `searchconsole` is the active current reader; GSC Wizard is deprecated because its free/trial quota is exhausted.** The first Phone canonical row observed is `survival number`, 1 impression, 0 clicks, average position 22 on 2026-09-23. | Continue measuring through Windsor.ai while available; one impression is not a production-change signal. If Windsor fails, use official Search Console API/export rather than trial-account rotation. |
| Keyword research | Sep 23 evidence is sufficient for current direction; Ubersuggest hit daily quota, Ahrefs returned `Insufficient plan`, Semrush returned `no_api_units`. | Do not rotate accounts or upgrade/pay without authorization. |
| TikTok App Review | **SUBMITTED / WAITING FOR REVIEW.** | Do not Recall/edit submitted configuration, demo, credentials, URLs, products or scopes until Approved or Rejected/Changes requested. |
| Authority | **AIR-4 BATCH 2 SENT / WAITING.** Learn Cursor + explainx.ai were sent 2026-09-22. | No third target or follow-up before 2026-09-29 or later. |
| Frontend foundation | Astro 7 + Tailwind 4 exists under `frontend/astro/` but is not the production build path. | No broad migration/redesign as part of Phone work. |
| Observer access | `qwenpaw-sbs-prod-h2grp` / `qwen-control` is the verified control/jump path, not the Phone systemd observer host. Qwen history identifies two downstream SSH-managed machines: the one-month Debian 13 trial observer (128 MiB RAM / 1 GiB root) and `codex-vps`. For the trial observer, Sep 15 Qwen logs show password SSH administration and later RDC enrollment; on Sep 24 its original NAT SSH endpoint is still open and presents the same ED25519 host key, so the original VPS is still present rather than replaced/reinstalled. One historical offline RDC identity can therefore be mapped to this trial host. Qwen also has a dedicated trial-backup key created Sep 15, but no successful record proves that key was installed on the trial host; current non-interactive default SSH is rejected. `codex-vps` remains visible on Tailscale but requires a fresh Tailscale SSH authorization check. The trial provider/vendor is not recorded in canonical project facts and must not be guessed from IP/specs. | Treat the trial observer blocker as **authentication/control-channel recovery**, not host discovery. Use Qwen as the entry point; recover authorized access, inspect the existing RDC service and watcher journals before any restart/reinstall, and do not repurpose `codex-vps` from its existing Relay-history role without a separate review. |
| AI retrieval | Exa extraction works; semantic discovery remains weak. Tavily quota and GitHub metadata-write blockers remain. | Follow AIR docs in order; do not bypass provider blockers. |

## Immediate priority

**Run two tracks in parallel: keep the public Phone surface stable for measurement, and continuously acquire/normalize Phone evidence backstage.**

The public UK comparison pilot remains the current production baseline on `/tools/phone-number-survival-guide/`. Do not churn it from one Search Console impression or add weak global rows just to increase URL/page count.

At the same time, a measurement hold is not a research hold. Phone Radar only becomes defensible if the project continuously captures changing operational evidence: acquisition paths, real landed prices, discounts, app-specific success/failure, activation friction, seller/platform failures, number loss/recycling, recovery/refunds and route freshness.

Current execution sequence:

1. **DONE — repository watcher v1.1.** PR #211 merged as `3204ee0be13411c146e1031bbf13a094949f679f`; Eval Gate #709 passed, including the new watcher audit and all existing Phone build/eval checks.
2. restore authorized access from Qwen to the now-identified 128 MiB trial observer, inspect its existing RDC/watcher service state first, then deploy v1.1 and verify a real systemd run, source health, memory peak and next timer;
3. verify the intended second disposable-observer role before assigning the reviewed source-change watcher; `codex-vps` is known but already has a Relay-history role and must not be repurposed by assumption;
4. review `candidates.tsv` into durable route/source packets with provenance and deduplication;
5. keep Search Console measurement running through Windsor.ai, separating organic from referral/social/direct/AI traffic;
6. improve the existing index first when evidence warrants it;
7. publish a separate route detail URL only when the route has substantial unique execution content and passes the route-page gate in `docs/PHONE_RADAR_OPERATING_PLAN_2026-09-24.md`.

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
- `docs/PHONE_RADAR_DIRECTORY_MATRIX_CONTRACT_2026-09-23.md` — accepted Phone information architecture, matrix fields, evidence/ranking rules and implementation boundary.
- `docs/PHONE_UK_PILOT_SOURCE_PACKET_2026-09-23.md` — UK pilot source reconciliation and route evidence packet.
- `frontend/tools/phone-number-lifecycle-mvp/uk-directory-pilot.json` — normalized shipped UK pilot data used by the Phone surface.
- `docs/PHONE_DEMAND_WATCH.md` — community intelligence watcher contract/status.
- `docs/PHONE_SOURCE_WATCH.md` — reviewed official/commercial source-change watcher contract/status.
- `docs/PHONE_RADAR_PRODUCT_DEFINITION.md` and `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` — durable Phone identity/research method.
- `docs/GSC_MEASUREMENT_2026-09-22.md` — accepted Search Console measurement history; current reads use Windsor.ai.
- `docs/RELAY_RISK_METHODOLOGY.md` — fixed Relay methodology.
- `docs/AUTHORITY_AND_AI_DISCOVERY.md` — authority/referral ledger.
- `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md` — ordered AIR work.

## Handoff rule

At the beginning of a new working session, read GitHub `main` in this order: `AGENTS.md` → this file's **Current progress checkpoint** → `docs/MASTER_PLAN.md` → `docs/OPERATING_WORKFLOW.md` → `docs/CURRENT_EXECUTION_QUEUE.md`, then only task-specific docs needed by the next action.

GitHub `main` plus verified live production is final truth.
