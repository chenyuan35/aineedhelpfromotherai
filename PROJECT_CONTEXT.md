# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-23

This file is the compact current-facts source for the project. Historical execution detail belongs in task-specific docs, PRs and the Google Docs journal. If anything here conflicts with GitHub `main` plus verified production, GitHub `main` and verified production win.

## Current progress checkpoint

Read this section first in a new session. Do not rescan the whole repository, VPS fleet, deployment history or old chats unless this checkpoint is stale, contradictory or the current task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | `https://aineedhelpfromotherai.com/` is live. Vercel deploys the static frontend from GitHub `main`; the historical Express/PostgreSQL runtime remains only behind the allowlisted API surface required by Relay Exit Risk. | Use fresh branches/PRs; never reset or overwrite the dirty production worktree. |
| Product direction | **STRATEGY RESET ACCEPTED 2026-09-23.** Search volume, rankings and technical polish no longer choose the product. Both official-source substitutability and independent-competitor substitutability are mandatory gates. Evidence: `docs/PRODUCT_DIRECTION_RESET_2026-09-23.md`. | Active growth work moves to Phone Radar. Reset is frozen/value-reviewed. Relay remains data-accrual only. |
| Phone Radar | **ACTIVE PRIMARY GROWTH PRODUCT / LIVE / VISUALLY ACCEPTED.** The accepted surface remains one canonical with three route families: Long-term SMS/OTP, Data SIM/eSIM and Temporary SMS. Community/user outcomes drive operational reality; provider pages supply commercial metadata only. Current external evidence repeatedly shows unresolved demand around real mobile numbers, OTP/SMS abroad, remote activation, app-specific verification, KYC, roaming and long-term retention. | Next bounded task: audit the existing Phone canonical's title/meta/H1/first screen and route decision fields against the user job `real number + SMS/OTP abroad + retention/current outcome`. No new URL or route expansion in the audit. |
| AI Reset Radar | **FROZEN / VALUE REVIEW COMPLETE.** Seven-page classification: Cursor DOWNGRADE; Claude REPURPOSE; GitHub Copilot KEEP/DIFFERENTIATE; Manus DOWNGRADE; Replit DOWNGRADE; Bolt REPURPOSE; AI Credit Burn KEEP/DIFFERENTIATE. Cursor fresh post-change data reached 290 impressions / 0 clicks. | No Cursor-first optimization, no Q-015, no new generic reset pages. Do not build a generic Codex reset tracker; current independent competition is already mature. |
| Codex opportunity | Real demand exists, but live competitor research found multiple established products already offering public-source monitoring, reset history, probabilities/windows, banked resets, timers, `/status` parsing, burn-rate tracking, APIs/RSS and alerts. Current community pain is deeper: early-reset quota loss, banked-reset failure, client-state mismatch and unexpectedly fast burn. | Competitor-gap research only. Any future Codex build must prove a narrower job existing trackers do not already solve well. |
| Relay Exit Risk | **PRESERVE / DATA-ACCRUAL EXPERIMENT.** Product and methodology remain production-verified. Exact relay-oriented keyword probes did not demonstrate direct search demand. | Continue legitimate historical snapshots/lifecycle accumulation. No search-led feature expansion without demand/usage evidence. |
| Search Console | Windsor.ai Search Console is the current in-chat measurement path; official Google Search Console API/export is the fallback. Cursor is exposed but not clicked; Phone is indexed but lacked exact-page rows in the latest accepted window. | Use GSC after product-value/competition gates, not as the product selector. Phone's lack of exposure no longer blocks a bounded intent/positioning audit because independent community/search evidence now supports the user job. |
| Keyword research | Ubersuggest Sep 23 live reads showed real Codex reset demand and materially larger SMS-verification demand. The account then hit its daily report quota. Ahrefs returned `Insufficient plan`; Semrush returned `no_api_units`. | Do not rotate accounts or upgrade/pay without authorization. Existing collected evidence is sufficient for the current direction decision. |
| TikTok App Review | **SUBMITTED / WAITING FOR REVIEW.** Production app was submitted on 2026-09-19 and Portal shows `Recall`. | Do not Recall, edit submitted configuration/demo, remove the Sandbox bridge, rotate credentials, or change URLs/products/scopes. Trigger only on Approved or Rejected/Changes requested. |
| Authority | **AIR-4 BATCH 2 SENT / WAITING.** Learn Cursor + explainx.ai were sent 2026-09-22. | No third target or follow-up before 2026-09-29 or later. Read original Gmail threads and independently verify public links/citations before follow-up. |
| Frontend foundation | Astro 7 + Tailwind 4 foundation exists under `frontend/astro/` but does not replace the current production build path. Maintenance M-01 through M-06 is closed. | No broad migration or redesign as part of the strategy reset. |
| Observers | Existing observers/watchers remain bounded; disposable VPS carries no unique durable state. The connected qwen environment is not confirmed as the systemd observer host. | Never infer watcher health from the wrong host. No production dependency may rely on a disposable observer. |
| AI retrieval | Exa extraction works; semantic discovery remains weak. Tavily quota and GitHub metadata-write blockers remain. | Follow AIR docs in order; do not bypass provider blockers. |

## Immediate priority

**Phone Radar canonical intent/value audit.**

The project now has a clearer product hierarchy:

1. Phone Radar is the active growth surface because its value comes from fragmented real-world outcomes and current community information that provider pages cannot certify.
2. Reset pages are not allowed to consume more product/SEO work merely because they rank or have search volume.
3. Codex is not an automatic replacement for Cursor: generic Codex reset tracking is already crowded with mature independent products.
4. Relay remains a long-horizon data product until direct demand appears.

The next task is audit-only on `/tools/phone-number-survival-guide/`. Validate whether the existing canonical communicates the actual user job clearly enough: real number vs data-only/VoIP, SMS/OTP outcome, remote activation, KYC, roaming/activation location, keep-alive cost, app-specific caveats and freshness. End with one existing-URL keep/change decision and at most one bounded implementation plan. Do not add another route/page in that audit.

## Product rules

- Before build/expansion/optimization, apply `docs/PRODUCT_VALUE_GATE.md`.
- Search volume, ranking, indexing, technical quality and official-source coverage do not prove product value.
- A candidate must survive two substitution tests: `why not the official source?` and `why not the best existing independent competitor?`.
- Do not build a clone with a different domain name.
- A product must add material information advantage, uncertainty reduction, aggregation, monitoring, computation, proprietary history, decision-cost reduction or a narrower differentiated workflow.
- Prefer real demand, clear tool intent, repeat value, speed, low marginal cost and maintainability.
- Prefer browser-side tools; shared state only when necessary.
- One clear user task per page; avoid thin/near-duplicate/keyword doorway pages.
- Improve existing URLs before adding similar ones.
- Phone Radar value comes from hidden real-user routes + practical execution + current outcomes, not carrier documentation completeness.
- Missing data lowers confidence; never invent certainty.
- Separate Google organic, social/referral, AI referral and direct/repeat behavior.

## Phone Radar governing rule

Canonical remains `/tools/phone-number-survival-guide/` unless a separate evidence-backed migration task says otherwise.

Frontstage should help users choose and act quickly. For the current primary user job, decision-critical fields include:

- real carrier number vs data-only/VoIP;
- recent SMS/OTP outcome and app/service caveats;
- remote activation practicality and activation country constraints;
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
- Isolated future frontend foundation: Astro 7 + Tailwind 4 under `frontend/astro/`; not wired into the production build.
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
- `docs/PRODUCT_DIRECTION_RESET_2026-09-23.md` — Sep 23 evidence-backed product-direction correction and Reset classifications.
- `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md` — Phone correction history.
- `docs/PHONE_RADAR_INTERACTION_SPEC_2026-09-18.md` — accepted Phone interaction contract.
- `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md` and `docs/PHONE_VISUAL_FIRST_ACCEPTANCE_2026-09-19.md` — current Phone visual baseline.
- `docs/PHONE_RADAR_PRODUCT_DEFINITION.md` and `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` — durable Phone identity/research method.
- `docs/GSC_MEASUREMENT_2026-09-22.md` — latest accepted Search Console measurement evidence.
- `docs/RESET_RELEASE_AUDIT_2026-09-21.md` — Reset technical release audit only; not product-value acceptance.
- `docs/RELAY_RISK_METHODOLOGY.md` — fixed Relay methodology.
- `docs/AUTHORITY_AND_AI_DISCOVERY.md` — authority/referral ledger.
- `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md` — ordered AIR work.

## Handoff rule

At the beginning of a new working session, read GitHub `main` in this order: `AGENTS.md` → this file's **Current progress checkpoint** → `docs/MASTER_PLAN.md` → `docs/OPERATING_WORKFLOW.md` → `docs/CURRENT_EXECUTION_QUEUE.md`, then only task-specific docs needed by the next action.

GitHub `main` plus verified live production is final truth.
