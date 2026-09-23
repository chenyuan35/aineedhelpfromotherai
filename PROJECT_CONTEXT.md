# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-23

This file is the compact current-facts source for the project. Historical execution detail belongs in task-specific docs, PRs and the Google Docs journal. If anything here conflicts with GitHub `main` plus verified production, GitHub `main` and verified production win.

## Current progress checkpoint

Read this section first in a new session. Do not rescan the whole repository, VPS fleet, deployment history or old chats unless this checkpoint is stale, contradictory or the current task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | `https://aineedhelpfromotherai.com/` is live. Vercel deploys the static frontend from GitHub `main`; the historical Express/PostgreSQL runtime remains only behind the allowlisted API surface required by Relay Exit Risk. | Use fresh branches/PRs; never reset or overwrite the dirty production worktree. |
| Product direction | **STRATEGY RESET ACCEPTED 2026-09-23.** Search volume, rankings and technical polish no longer choose the product. Both official-source substitutability and independent-competitor substitutability are mandatory gates. Reset has also been removed from primary site/discovery surfaces. | Active growth work stays on Phone Radar. Reset direct URLs remain preserved; Relay remains data-accrual only. |
| Phone Radar | **ACTIVE PRIMARY GROWTH PRODUCT / SAME-URL CORRECTION SHIPPED 2026-09-23.** Canonical remains `/tools/phone-number-survival-guide/` with three fixed families: Long-term SMS/OTP, Data SIM/eSIM and Temporary SMS. PR #198 shipped the accepted contract correction on the existing homepage + canonical only; Eval Gate #681 passed; Vercel Preview and apex production were verified. Production now exposes current operating evidence, KYC, SMS/roaming, acquisition/current-price wording and route-specific keep rules without adding a new URL or route. | Re-measure Phone after data has time to accrue. Do not make another production change merely because the correction just shipped. |
| AI Reset Radar | **FROZEN / PRIMARY SURFACES REMOVED / DIRECT URLS PRESERVED.** Seven-page value classification remains: Cursor DOWNGRADE; Claude REPURPOSE; GitHub Copilot KEEP/DIFFERENTIATE; Manus DOWNGRADE; Replit DOWNGRADE; Bolt REPURPOSE; AI Credit Burn KEEP/DIFFERENTIATE. | No Cursor-first optimization, no Q-015, no new generic reset pages and no generic Codex reset tracker. |
| Codex opportunity | Real demand exists, but current competitors already cover generic reset/history/countdown/quota jobs. | Competitor-gap research only; future build requires a narrower non-duplicative job. |
| Relay Exit Risk | **PRESERVE / DATA-ACCRUAL EXPERIMENT.** Product and methodology remain production-verified. | Continue legitimate historical snapshots/lifecycle accumulation. No search-led feature expansion without demand/usage evidence. |
| Search Console | Search Console remains a distribution/measurement signal after value/competition gates. Phone was indexed but lacked exact-page rows in the latest accepted window. | Re-measure after the shipped Phone correction; do not let GSC choose the product and do not expect immediate post-deploy evidence. |
| Keyword research | Sep 23 evidence is sufficient for current direction; Ubersuggest hit daily quota, Ahrefs returned `Insufficient plan`, Semrush returned `no_api_units`. | Do not rotate accounts or upgrade/pay without authorization. |
| TikTok App Review | **SUBMITTED / WAITING FOR REVIEW.** | Do not Recall/edit submitted configuration, demo, credentials, URLs, products or scopes until Approved or Rejected/Changes requested. |
| Authority | **AIR-4 BATCH 2 SENT / WAITING.** Learn Cursor + explainx.ai were sent 2026-09-22. | No third target or follow-up before 2026-09-29 or later. |
| Frontend foundation | Astro 7 + Tailwind 4 exists under `frontend/astro/` but is not the production build path. | No broad migration/redesign as part of Phone work. |
| Observers | Existing observers/watchers remain bounded; disposable VPS carries no unique durable state. | Never infer watcher health from the wrong host; no production dependency on disposable observers. |
| AI retrieval | Exa extraction works; semantic discovery remains weak. Tavily quota and GitHub metadata-write blockers remain. | Follow AIR docs in order; do not bypass provider blockers. |

## Immediate priority

**Phone correction is shipped. Hold production and re-measure rather than immediately changing it again.**

PR #198 (`ab0d0525`) completed the accepted Sep 23 same-URL correction. Eval Gate #681 passed, Vercel production deployed successfully, and live apex verification confirmed the corrected homepage and Phone canonical.

Current next action:

1. allow Search Console and real interaction data to accrue after the deployment;
2. then re-measure the existing Phone canonical, keeping Google organic separate from referral/social/direct traffic;
3. if impressions appear without clicks, diagnose query/SERP fit before changing product scope;
4. if clicks appear but Phone usage is weak, use interaction evidence to improve the existing canonical;
5. do not add another Phone URL/route, Reset page or speculative feature while waiting for evidence.

## Product rules

- Before build/expansion/optimization, apply `docs/PRODUCT_VALUE_GATE.md`.
- Search volume, ranking, indexing, technical quality and official-source coverage do not prove product value.
- A candidate must survive both `why not the official source?` and `why not the best existing independent competitor?`.
- Do not build clones or documentation wrappers.
- Prefer real demand, clear tool intent, repeat value, speed, low marginal cost and maintainability.
- Improve existing URLs before adding similar URLs.
- Phone Radar value comes from hidden/current real-user routes + practical execution + current outcomes, not carrier-documentation completeness.
- Missing data lowers confidence; never invent certainty.
- Separate Google organic, social/referral, AI referral and direct/repeat behavior.

## Phone Radar governing rule

Canonical remains `/tools/phone-number-survival-guide/` unless a separate evidence-backed migration task says otherwise.

Frontstage should help users choose and act quickly. Decision-critical fields include:

- real carrier number vs data-only/VoIP;
- recent SMS/OTP outcome and app/service caveats;
- remote activation practicality and activation-country constraints;
- KYC requirements;
- roaming/SMS behavior;
- keep-alive/retention cost and expiry rules;
- current price/value and purchase path;
- freshness/confidence derived from current independent outcomes.

Backstage keeps raw forum/community sources, reconciliation, duplicate/circular-report checks, confidence/freshness logic, incident history and methodology.

Provider/operator pages are used by default for price, package name, promotions, stock, purchase links and published terms. Do not use them to certify OTP reliability, overseas activation, support recovery, long-term trust or other real-world operating behavior.

Never recommend forged KYC, deceptive support stories, stolen identities, unauthorized access, security bypass or prohibited geography evasion.

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
- `docs/RESET_PRIMARY_SURFACE_REMOVAL_2026-09-23.md` — Reset primary-surface removal evidence.
- `docs/PHONE_CANONICAL_CONTRACT_AUDIT_2026-09-23.md` — accepted Phone audit and bounded implementation queue.
- `docs/PHONE_RADAR_INTERACTION_SPEC_2026-09-18.md` — accepted Phone interaction contract.
- `docs/PHONE_RADAR_PRODUCT_DEFINITION.md` and `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` — durable Phone identity/research method.
- `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md` and `docs/PHONE_VISUAL_FIRST_ACCEPTANCE_2026-09-19.md` — Phone visual baseline.
- `docs/GSC_MEASUREMENT_2026-09-22.md` — latest accepted Search Console evidence.
- `docs/RELAY_RISK_METHODOLOGY.md` — fixed Relay methodology.
- `docs/AUTHORITY_AND_AI_DISCOVERY.md` — authority/referral ledger.
- `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md` — ordered AIR work.

## Handoff rule

At the beginning of a new working session, read GitHub `main` in this order: `AGENTS.md` → this file's **Current progress checkpoint** → `docs/MASTER_PLAN.md` → `docs/OPERATING_WORKFLOW.md` → `docs/CURRENT_EXECUTION_QUEUE.md`, then only task-specific docs needed by the next action.

GitHub `main` plus verified live production is final truth.