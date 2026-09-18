# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-18

This file is the compact current-facts source for the project. Keep volatile execution detail in task-specific docs and PRs. If anything here conflicts with GitHub `main` plus verified production, GitHub `main` and verified production win.

## Current progress checkpoint

Read this section first in a new session. Do not rescan the whole repository, VPS fleet, deployment history, or old chats unless this checkpoint is stale, contradictory, or the current task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | `https://aineedhelpfromotherai.com/` is live. Vercel deploys the static frontend from GitHub `main`; the historical Express/PostgreSQL runtime remains only behind the allowlisted API surface required by Relay Exit Risk. | Use fresh branches/PRs; never reset or overwrite the dirty production worktree. |
| Frontend foundation | An isolated Astro 7 + Tailwind 4 foundation now exists under `frontend/astro/`: typed Tool Registry, current-site shell, reusable tool cards/search, shared design tokens, Astro `/tools/` sample, registry checks and dedicated Frontend Astro CI. It does **not** replace the current production build path. Vercel Preview still exercises the legacy static frontend, while the dedicated Astro CI validates the new sample build. | Keep production homepage/Phone/Relay shells unchanged. Only consider a later `/tools/` cutover after explicit preview/parity/analytics verification; migrate incrementally rather than replacing the whole site at once. |
| Product scope | Scope remains frozen to three surfaces: **Phone Radar** primary; **AI Reset Radar** and **Relay Exit Risk** secondary. | No fourth product surface, second Phone canonical, provider/country doorway pages, or broad utility expansion. |
| Homepage | Current first viewport remains `AI stopped? Start here.` / `What stopped?`; `home_job_select` is measuring behavior. | No homepage churn without evidence. |
| Phone production | **LIVE / PRIMARY / RESET SHIPPED.** Canonical: `https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/`. PR #115 replaced the old questionnaire/manual-first interaction with the three-family route-first Phone Radar dashboard. Production canonical returned HTTP 200, self-canonical/indexable metadata was verified, and public `radar-view.json` returned HTTP 200. | Finish Q-014H production closure QA, then use settled behavior and bounded route expansion rather than redesigning the shell. |
| Phone product direction | **SHIPPED.** Three route families: **Long-term SMS/OTP numbers**, **Data SIM/eSIM routes**, **Temporary SMS platforms**. Two layers: **visual decision dashboard first**, **full operational guide on demand**. | Keep the shell stable unless QA or real behavior data identifies a concrete problem. |
| Phone decision-cost rule | The product must reduce user reading and decision time. Default view is a small current shortlist, not dozens of equal-weight routes and not a questionnaire. | Keep next action obvious: compare → full guide → buy/use → setup/test → keep/recharge/recover as appropriate. |
| Phone research method | Community/user reports, tutorials, comments, user-shared support interactions and current success/failure outcomes drive operational reality. Operator/provider pages are used by default for current price/package/promotion/stock/purchase metadata only; they are not an operational verification gate. | Research only fields that change choice/action. Keep research complexity backstage. |
| Phone global route pool | First cross-region seed spans Hong Kong, Taiwan, South Korea, Singapore, Malaysia, New Zealand, Europe, UK, US, Thailand and more. Country is a filter/tag, not the research sequence. | After Q-014H closure, resume value-first global discovery in batches of 1–2 production routes. Kaktus Czech, ClubSIM Hong Kong, A1 Croatia and RedPocket are candidate leads; AIS remains HOLD. |
| Phone audit | Q-013 provider-by-provider official auditing is not the default task. Q-014 implementation shipped through PR #115; Q-014H still needs one deliberate production functional/mobile/analytics closure pass. | Close Q-014H first; then resume Q-013 as community-first route expansion rather than documentation completeness work. |
| Search Console | GSC Wizard connected. Last check returned `settledThrough=2026-09-15`, still one day short of the Sep 16 Phone release. | At the start of the next session check the trigger. When `settledThrough >= 2026-09-16`, execute Q-003 before another Phone production expansion. |
| Indexing | Last known tracker: 18 tracked / 9 indexed / 9 not indexed; Phone canonical had previously been `URL is unknown to Google`. The new production page itself is crawlable/indexable and returned HTTP 200. | Let normal cadence work; no manual submission churn. Re-evaluate through GSC once settled data covers the release. |
| Cursor CTR | Cursor title/meta pilot remains measuring from a 141-impression / 0-click pre-change baseline. | Wait for roughly 300–500 additional impressions unless an obvious defect appears. |
| Distribution | Claude Reset Threads and Cursor Reset Mastodon tests are published; referral/social remains separate from organic. | Measure first; no mass cross-posting. |
| Authority | First Sep 18 outreach check found no reply or independently verified link. | Recheck original Gmail threads/public pages on Sep 20 before follow-up/batch 2. |
| Relay Exit Risk | Relay Exit Risk v2 remains live as a secondary product with a 0–100 Exit Risk Index. | Accumulate lifecycle/community evidence; preserve confidence semantics. |
| Observers | Existing observers/watchers remain bounded; disposable VPS carries no unique durable state. | No new workloads unless justified. |
| AI retrieval | Exa extraction works; semantic discovery remains weak. Tavily quota and GitHub metadata-write blockers remain. | Follow AIR docs in order; do not bypass blockers. |

## Immediate priority

Phone Radar is now in post-release closure and measured depth-building, not another concept/reset cycle.

Next session execute in this order:

1. Check GSC Wizard `settledThrough` for the Phone canonical.
2. If `settledThrough >= 2026-09-16`, execute Q-003 first: indexing + queries/impressions/clicks/CTR/position + GA4 behavior where available.
3. Otherwise finish Q-014H production closure QA: three-family first screen, compact shortlist, country filter, one full guide per family, purchase/outbound links, mobile hierarchy/no overflow, analytics hooks, canonical/data-file health.
4. If Q-014H finds no material defect, mark Q-014 complete. If it finds a defect, fix only the defect through the normal branch/PR/CI/Preview path; do not redesign the product again.
5. Then resume Q-013 as a small value-first route expansion batch: 1–2 production routes total, chosen from fresh community evidence and the global candidate pool.
6. Q-005 authority recheck remains due Sep 20; no follow-up before then.
7. Cursor/homepage/distribution continue measuring; no premature churn.

Detailed next-session checklist and stop conditions are in `docs/CURRENT_EXECUTION_QUEUE.md`.

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
- Isolated future frontend foundation: Astro 7 + Tailwind 4 under `frontend/astro/`; not yet wired into the production build.
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
- `docs/FRONTEND_FOUNDATION_PLAN_2026-09-18.md` — Astro frontend foundation scope, boundaries and migration rules.
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