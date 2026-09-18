# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-18

This file is the compact current-facts source for the project. Keep volatile execution detail in task-specific docs and PRs. If anything here conflicts with GitHub `main` plus verified production, GitHub `main` and verified production win.

## Current progress checkpoint

Read this section first in a new session. Do not rescan the whole repository, VPS fleet, deployment history, or old chats unless this checkpoint is stale, contradictory, or the current task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | `https://aineedhelpfromotherai.com/` is live. Vercel deploys the static frontend from GitHub `main`; the historical Express/PostgreSQL runtime remains only behind the allowlisted API surface required by Relay Exit Risk. | Use fresh branches/PRs; never reset or overwrite the dirty production worktree. |
| Product scope | Scope remains frozen to three surfaces: **Phone Radar** primary; **AI Reset Radar** and **Relay Exit Risk** secondary. | No fourth product surface, second Phone canonical, provider/country doorway pages, or broad utility expansion. |
| Homepage | Current first viewport remains `AI stopped? Start here.` / `What stopped?`; `home_job_select` is measuring behavior. | No homepage churn without evidence. |
| Phone production | **LIVE / PRIMARY.** Canonical: `https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/`. Current production still uses the old questionnaire/manual-style Phone experience. PR #112 was closed and not merged. | Replace the old interaction through Q-014 implementation; do not incrementally patch PR #112. |
| Phone product direction | **ACCEPTED / IMPLEMENTATION AUTHORIZED.** Three route families: **Long-term SMS/OTP numbers**, **Data SIM/eSIM routes**, **Temporary SMS platforms**. Two layers: **visual decision dashboard first**, **full operational guide on demand**. | Continue implementation without waiting for item-by-item concept confirmation. Normal branch/test/PR/Preview safety gates still apply. |
| Phone decision-cost rule | The product must reduce user reading and decision time. Default view is a small current shortlist, not dozens of equal-weight routes and not a questionnaire. | Make the next action obvious: compare → full guide → buy/use → setup/test → keep/recharge/recover as appropriate. |
| Phone research method | Community/user reports, tutorials, comments, user-shared support interactions and current success/failure outcomes drive operational reality. Operator/provider pages are used by default for current price/package/promotion/stock/purchase metadata only; they are not an operational verification gate. | Research only fields that change choice/action. Keep research complexity backstage. |
| Phone global route pool | First cross-region seed spans Hong Kong, Taiwan, South Korea, Singapore, Malaysia, New Zealand, Europe, UK, US, Thailand and more. Country is a filter/tag, not the research sequence. | After the reset ships, resume global discovery by route value rather than country quota. |
| Phone audit | Q-013 provider-by-provider auditing is no longer the default task. AIS remains HOLD; RedPocket remains a candidate. | Finish Q-014 before broad route expansion. |
| Search Console | GSC Wizard connected. Last check returned `settledThrough=2026-09-15`, still one day short of the Sep 16 Phone release. | When `settledThrough >= 2026-09-16`, execute Q-003 and use settled behavior to improve the accepted dashboard model. |
| Indexing | Last known tracker: 18 tracked / 9 indexed / 9 not indexed; Phone canonical had been `URL is unknown to Google`. | Let normal cadence work; no manual submission churn. |
| Cursor CTR | Cursor title/meta pilot remains measuring from a 141-impression / 0-click pre-change baseline. | Wait for roughly 300–500 additional impressions unless an obvious defect appears. |
| Distribution | Claude Reset Threads and Cursor Reset Mastodon tests are published; referral/social remains separate from organic. | Measure first; no mass cross-posting. |
| Authority | First Sep 18 outreach check found no reply or independently verified link. | Recheck original Gmail threads/public pages on Sep 20 before follow-up/batch 2. |
| Relay Exit Risk | Relay Exit Risk v2 remains live as a secondary product with a 0–100 Exit Risk Index. | Accumulate lifecycle/community evidence; preserve confidence semantics. |
| Observers | Existing observers/watchers remain bounded; disposable VPS carries no unique durable state. | No new workloads unless justified. |
| AI retrieval | Exa extraction works; semantic discovery remains weak. Tavily quota and GitHub metadata-write blockers remain. | Follow AIR docs in order; do not bypass blockers. |

## Immediate priority

Phone Radar implementation is the active product-depth task.

Before new work:

1. If GSC `settledThrough >= 2026-09-16`, execute Q-003 before merging a Phone production implementation.
2. If date >= 2026-09-20 and the authority recheck is still pending, execute Q-005 before sending any follow-up.
3. Otherwise continue Q-014 implementation continuously through PR/CI/Preview/merge/production verification.
4. Q-013 broad route research remains HOLD until the reset ships.
5. Cursor/homepage/distribution continue measuring; no premature churn.

## Phone Radar governing rule

Use these sources in order:

1. `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md`
2. `docs/PHONE_RADAR_INTERACTION_SPEC_2026-09-18.md`
3. `docs/PHONE_RADAR_PRODUCT_DEFINITION.md`
4. `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md`
5. `docs/PHONE_RADAR_GLOBAL_ROUTE_POOL_SEED_2026-09-18.md`
6. current Q-014/Q-013 state in `docs/CURRENT_EXECUTION_QUEUE.md`

### Frontstage

- three route-family selector;
- small visual shortlist;
- family-appropriate comparison metrics;
- current price/value where relevant;
- full-guide action;
- buy/open-platform action;
- concise current warning only when it changes the decision.

### Backstage

- raw forum/community sources;
- cross-report reconciliation;
- duplicate/circular-report detection;
- confidence/freshness logic;
- incident history;
- source notes;
- methodology.

### Provider/operator page role

Use by default for current commercial metadata only: price, package name, promotion/new offer, stock/availability, purchase/checkout link and advertised top-up/fee.

Do not use provider pages to certify OTP reliability, overseas activation, support recovery, long-term trust or other real-world operating behavior.

Never recommend forged KYC, deceptive support stories, stolen identities, unauthorized access, security bypass or prohibited geography evasion.

## Mission

Turn `aineedhelpfromotherai.com` into a low-cost, high-traffic utility site that can earn small, stable AdSense revenue. Optimize for organic impressions, indexed pages, CTR, useful/repeat visits, page speed, measurable referrals and eventual revenue; avoid SaaS complexity.

## Product rules

- Prefer real demand, clear tool intent, repeat value, speed, low marginal cost and maintainability.
- Prefer browser-side tools; shared state only when necessary.
- One clear user task per page; avoid thin/near-duplicate/keyword doorway pages.
- Improve existing URLs before adding similar ones.
- Phone Radar value comes from hidden real-user routes + practical execution + current outcomes, not carrier documentation completeness.
- Missing data lowers confidence; never invent certainty.
- Separate organic, social/referral, AI referral and direct/repeat behavior.

## Current architecture and safety

- Canonical host: `https://aineedhelpfromotherai.com/`; `www` redirects to apex.
- Static frontend: Vercel from GitHub `chenyuan35/aineedhelpfromotherai` `main`.
- Vercel proxies only current allowlisted backend routes.
- Do not change DNS, AdSense, billing or critical account settings without explicit authorization.
- Never print/commit credentials.
- Never reset/discard/overwrite the dirty production worktree.
- Fresh branch/worktree → tests → PR → CI/Eval/Vercel Preview → merge → production verification.
- Never use `hermes`.
- `yuan` is personal workstation, not project infrastructure.
- Trial/temporary VPS hosts are disposable observers only unless explicitly promoted.

## Durable fact sources

- `docs/MASTER_PLAN.md` — phase/sprint/exit gates.
- `docs/OPERATING_WORKFLOW.md` — fixed execution workflow.
- `docs/CURRENT_EXECUTION_QUEUE.md` — atomic next actions.
- `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md` — active Phone correction.
- `docs/PHONE_RADAR_INTERACTION_SPEC_2026-09-18.md` — accepted Phone interaction contract.
- `docs/PHONE_RADAR_GLOBAL_ROUTE_POOL_SEED_2026-09-18.md` — global breadth seed.
- `docs/PHONE_RADAR_PRODUCT_DEFINITION.md` — durable Phone identity.
- `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` — community-first research method.
- `docs/AUTHORITY_AND_AI_DISCOVERY.md` — authority/referral ledger.
- `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md` — ordered AIR work.
- `docs/RELAY_RISK_METHODOLOGY.md` — fixed Relay methodology.

## Handoff rule

At the beginning of a new working session, read GitHub `main` in this order: `AGENTS.md` → this file's **Current progress checkpoint** → `docs/MASTER_PLAN.md` → `docs/OPERATING_WORKFLOW.md` → `docs/CURRENT_EXECUTION_QUEUE.md`, then only task-specific docs needed by the next action.

GitHub `main` plus verified live production is final truth.
