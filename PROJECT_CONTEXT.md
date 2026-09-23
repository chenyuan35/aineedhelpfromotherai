# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-23

This file is the compact current-facts source for the project. Historical execution detail belongs in task-specific docs, PRs and the Google Docs journal. If anything here conflicts with GitHub `main` plus verified production, GitHub `main` and verified production win.

## Current progress checkpoint

Read this section first in a new session. Do not rescan the whole repository, VPS fleet, deployment history or old chats unless this checkpoint is stale, contradictory or the current task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | `https://aineedhelpfromotherai.com/` is live. Vercel deploys the static frontend from GitHub `main`; the historical Express/PostgreSQL runtime remains only behind the allowlisted API surface required by Relay Exit Risk. | Use fresh branches/PRs; never reset or overwrite the dirty production worktree. |
| Product direction | **STRATEGY RESET ACCEPTED 2026-09-23.** Search volume, rankings and technical polish no longer choose the product. Both official-source substitutability and independent-competitor substitutability are mandatory gates. Reset has also been removed from primary site/discovery surfaces. | Active growth work stays on Phone Radar. Reset direct URLs remain preserved; Relay remains data-accrual only. |
| Phone Radar | **ACTIVE PRIMARY GROWTH PRODUCT / DIRECTORY-MATRIX CORRECTION ACCEPTED 2026-09-23.** PR #198 shipped a same-URL evidence correction, but subsequent product review established that the long-term Phone surface must become a visual carrier/number dictionary rather than a flat shortlist. The accepted contract is `docs/PHONE_RADAR_DIRECTORY_MATRIX_CONTRACT_2026-09-23.md`. | Implement the directory/matrix on the existing canonical using a small evidence-backed UK pilot first. Do not wait for GSC before correcting this known product-model defect. |
| AI Reset Radar | **FROZEN / PRIMARY SURFACES REMOVED / DIRECT URLS PRESERVED.** Seven-page value classification remains: Cursor DOWNGRADE; Claude REPURPOSE; GitHub Copilot KEEP/DIFFERENTIATE; Manus DOWNGRADE; Replit DOWNGRADE; Bolt REPURPOSE; AI Credit Burn KEEP/DIFFERENTIATE. | No Cursor-first optimization, no Q-015, no new generic reset pages and no generic Codex reset tracker. |
| Codex opportunity | Real demand exists, but current competitors already cover generic reset/history/countdown/quota jobs. | Competitor-gap research only; future build requires a narrower non-duplicative job. |
| Relay Exit Risk | **PRESERVE / DATA-ACCRUAL EXPERIMENT.** Product and methodology remain production-verified. | Continue legitimate historical snapshots/lifecycle accumulation. No search-led feature expansion without demand/usage evidence. |
| Search Console | Search Console remains a distribution/measurement signal after value/competition gates. Phone was indexed but lacked exact-page rows in the latest accepted window. | Re-measure after the carrier-directory correction is implemented and has had time to accrue evidence. GSC does not block known product correction. |
| Keyword research | Sep 23 evidence is sufficient for current direction; Ubersuggest hit daily quota, Ahrefs returned `Insufficient plan`, Semrush returned `no_api_units`. | Do not rotate accounts or upgrade/pay without authorization. |
| TikTok App Review | **SUBMITTED / WAITING FOR REVIEW.** | Do not Recall/edit submitted configuration, demo, credentials, URLs, products or scopes until Approved or Rejected/Changes requested. |
| Authority | **AIR-4 BATCH 2 SENT / WAITING.** Learn Cursor + explainx.ai were sent 2026-09-22. | No third target or follow-up before 2026-09-29 or later. |
| Frontend foundation | Astro 7 + Tailwind 4 exists under `frontend/astro/` but is not the production build path. | No broad migration/redesign as part of Phone work. |
| Observers | Existing observers/watchers remain bounded; disposable VPS carries no unique durable state. | Never infer watcher health from the wrong host; no production dependency on disposable observers. |
| AI retrieval | Exa extraction works; semantic discovery remains weak. Tavily quota and GitHub metadata-write blockers remain. | Follow AIR docs in order; do not bypass provider blockers. |

## Immediate priority

**Implement the accepted Phone carrier-directory / comparison-matrix correction on the existing canonical.**

The previous “hold production and wait for post-deploy GSC” instruction is superseded because the user clarified a material product-model defect: Phone Radar must expose a structured visual dictionary of countries, host networks, brands/MVNOs and concrete number routes, with real landed cost, yearly keep cost, app-specific observations, continuity incidents, refund/recovery outcomes, trend, freshness, acquisition channel and a detailed guide.

Current next action:

1. use `docs/PHONE_RADAR_DIRECTORY_MATRIX_CONTRACT_2026-09-23.md` as the implementation contract;
2. keep the existing canonical `/tools/phone-number-survival-guide/`;
3. implement the long-term SMS/OTP surface as a grouped carrier/network matrix rather than a flat card shortlist;
4. use a small UK pilot first, based on current forum evidence, to validate the schema and visual interaction;
5. do not bulk-fill weak global data merely to make the directory look large;
6. after the corrected surface is shipped and verified, allow interaction/GSC evidence to accrue and then re-measure.

## Product rules

- Before build/expansion/optimization, apply `docs/PRODUCT_VALUE_GATE.md`.
- Search volume, ranking, indexing, technical quality and official-source coverage do not prove product value.
- A candidate must survive both `why not the official source?` and `why not the best existing independent competitor?`.
- Do not build clones or documentation wrappers.
- Prefer real demand, clear tool intent, repeat value, speed, low marginal cost and maintainability.
- Improve existing URLs before adding similar URLs.
- Phone Radar value comes from current forum/community information asymmetry: cheap acquisition routes, real landed cost, discounts, keep-alive methods, app compatibility, continuity incidents and operational history.
- Operator/provider pages are commercial metadata sources by default, not operational truth.
- Missing data lowers confidence; never invent certainty.
- App compatibility percentages may be shown only as observed sample rates with denominator/date when enough independent recent observations exist; otherwise show counts/qualitative state.
- Do not create an arbitrary 0–100 Phone risk score. Show concrete incidents, recoveries/refunds and qualitative trend instead.
- Separate Google organic, social/referral, AI referral and direct/repeat behavior.

## Phone Radar governing rule

Canonical remains `/tools/phone-number-survival-guide/` unless a separate evidence-backed migration task says otherwise.

The long-term SMS/OTP surface is a **carrier/number directory and visual comparison matrix** with this hierarchy:

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
- refund/recovery/reissue/port-out outcomes;
- current trend and last verified date;
- evidence count/sample size;
- detailed execution guide and acquisition link.

Ranking may be use-case-specific and transparent. Missing data must not improve rank. Observed percentages require route + service + operation-specific evidence and visible sample size/date.

Backstage keeps raw forum/community sources, reconciliation, duplicate/circular-report checks, event history and methodology.

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
- `docs/PHONE_RADAR_DIRECTORY_MATRIX_CONTRACT_2026-09-23.md` — current accepted Phone information architecture, matrix fields, evidence/ranking rules and first implementation boundary.
- `docs/PHONE_CANONICAL_CONTRACT_AUDIT_2026-09-23.md` — prior same-URL correction audit; retained as history, but the directory-matrix contract supersedes conflicting long-term UX assumptions.
- `docs/PHONE_RADAR_INTERACTION_SPEC_2026-09-18.md` — earlier interaction baseline; use only where it does not conflict with the Sep 23 directory-matrix contract.
- `docs/PHONE_RADAR_PRODUCT_DEFINITION.md` and `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` — durable Phone identity/research method; the Sep 23 directory-matrix contract governs the corrected long-term visual model where conflicts exist.
- `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md` and `docs/PHONE_VISUAL_FIRST_ACCEPTANCE_2026-09-19.md` — historical visual baseline.
- `docs/GSC_MEASUREMENT_2026-09-22.md` — latest accepted Search Console evidence before the directory correction.
- `docs/RELAY_RISK_METHODOLOGY.md` — fixed Relay methodology.
- `docs/AUTHORITY_AND_AI_DISCOVERY.md` — authority/referral ledger.
- `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md` — ordered AIR work.

## Handoff rule

At the beginning of a new working session, read GitHub `main` in this order: `AGENTS.md` → this file's **Current progress checkpoint** → `docs/MASTER_PLAN.md` → `docs/OPERATING_WORKFLOW.md` → `docs/CURRENT_EXECUTION_QUEUE.md`, then only task-specific docs needed by the next action.

GitHub `main` plus verified live production is final truth.
