# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-18

This file is the compact current-facts source for the project. Keep volatile execution detail in task-specific docs and PRs. If anything here conflicts with GitHub `main` plus verified production, GitHub `main` and verified production win.

## Current progress checkpoint

Read this section first in a new session. Do not rescan the whole repository, VPS fleet, deployment history, or old chats unless this checkpoint is stale, contradictory, or the current task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | `https://aineedhelpfromotherai.com/` is live. Vercel deploys the static frontend from GitHub `main`; the historical Express/PostgreSQL runtime remains only behind the allowlisted API surface required by Relay Exit Risk. | Use fresh branches/PRs; never reset or overwrite the dirty production worktree. |
| Frontend foundation | An isolated Astro 7 + Tailwind 4 foundation now exists under `frontend/astro/`: typed Tool Registry, current-site shell, reusable tool cards/search, shared design tokens, Astro `/tools/` sample, registry checks and dedicated Frontend Astro CI. It does **not** replace the current production build path. Vercel Preview still exercises the legacy static frontend, while the dedicated Astro CI validates the new sample build. | Keep production homepage/Phone/Relay shells unchanged except for bounded closure repairs backed by concrete defects. Only consider a later `/tools/` cutover after explicit preview/parity/analytics verification; migrate incrementally rather than replacing the whole site at once. |
| Product scope | Scope remains frozen to three surfaces: **Phone Radar** primary; **AI Reset Radar** and **Relay Exit Risk** secondary. | No fourth product surface, second Phone canonical, provider/country doorway pages, or broad utility expansion. |
| Homepage | Current first viewport remains `AI stopped? Start here.` / `What stopped?`; `home_job_select` is measuring behavior. | No homepage churn without evidence. |
| Phone production | **LIVE / PRIMARY.** Canonical: `https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/`. PR #115 shipped the three-family route-first dashboard; PR #118 added `phone_show_more`; PR #120 added A1 Croatia outside the default shortlist. **Q-013D4 remains implemented in PR #127 but not released:** Eval Gate passed, while Vercel Preview is blocked by provider `build-rate-limit`; production remains unchanged. A direct user review on Sep 18 identified that the current Phone page still feels visually messy, and a code/spec audit confirmed concrete shell defects rather than a need for more routes. | Do **not** add another route yet. Run the bounded Phone visual-closure repair from `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md`, then require a real desktop/mobile Preview before calling the shell closed. Keep PR #127 unmerged while this closure repair is active. |
| Phone product direction | The accepted model remains three route families — **Long-term SMS/OTP numbers**, **Data SIM/eSIM routes**, **Temporary SMS platforms** — with two layers: **visual decision dashboard first**, **full operational guide on demand**. The model is still correct; the current implementation hierarchy is not yet visually closed. | Preserve the model and repair the existing shell only; do not return to questionnaire-first UX or expand scope. |
| Phone decision-cost rule | The product must reduce user reading and decision time. Default view is a small current shortlist, not dozens of equal-weight routes and not a questionnaire. Current implementation still gives too much equal visual weight to hero/chrome/card fields and detaches the Full guide from the selected card. | Make next action obvious: compare → full guide → buy/use → setup/test → keep/recharge/recover. Reduce redundant pre-list chrome and repeated card prose. |
| Phone research method | Community/user reports, tutorials, comments, user-shared support interactions and current success/failure outcomes drive operational reality. Operator/provider pages are used by default for current price/package/promotion/stock/purchase metadata only; they are not an operational verification gate. | Research only fields that change choice/action. Keep research complexity backstage. |
| Phone global route pool | First cross-region seed spans Hong Kong, Taiwan, South Korea, Singapore, Malaysia, New Zealand, Europe, UK, US, Thailand and more. A1 Croatia is live as a `Watch` long-term route. Stellar China 100GB / 60 days is HOLD because current fulfillment does not reliably match the selected network/egress variant. **Trip.com Mainland China CMLink eSIM, product ID `71336361`, is validated and admission-ready as `Watch`**, but not live. | Pause route-depth release work until the current Phone visual-closure repair is complete. Afterwards, finish the already-open PR #127 only when Vercel Preview capacity has returned and the repaired shell is green. |
| Phone audit | **Q-014 VISUAL CLOSURE REOPENED.** The earlier closure pass verified flow/data/analytics but missed real CSS and hierarchy defects. Sep 18 audit found Phone CSS uses undefined `--border / --surface / --text` tokens against production `site.css`, global `button` `margin-top:16px` leaks into Phone controls, the hero inherits marketing-scale H1 sizing, cards expose too many equal-weight elements, and `Full guide` opens after the whole route list instead of in selected-card context. See `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md`. | Next bounded product task is shell repair + real desktop/mobile Preview verification. No new Phone route in that repair batch. |
| Search Console | GSC Wizard connected. Rechecked Sep 18: `settledThrough=2026-09-15`, still one day short of the Sep 16 Phone release. | When `settledThrough >= 2026-09-16`, execute Q-003 measurement. This measurement gate does not block repairing a concrete visual defect already reproduced in code and reported by the user. |
| Indexing | Last known tracker: 18 tracked / 9 indexed / 9 not indexed; Phone canonical remains `URL is unknown to Google` with no recorded crawl. The production page itself is crawlable/indexable and returned HTTP 200. | Let normal cadence work; no manual submission churn. Re-evaluate through GSC once settled data covers the release. |
| Cursor CTR | Cursor title/meta pilot remains measuring from a 141-impression / 0-click pre-change baseline. | Wait for roughly 300–500 additional impressions unless an obvious defect appears. |
| Distribution | Claude Reset Threads and Cursor Reset Mastodon tests are published; referral/social remains separate from organic. | Measure first; no mass cross-posting. |
| Authority | First Sep 18 outreach check found no reply or independently verified link. | Recheck original Gmail threads/public pages on Sep 20 before follow-up/batch 2. |
| Relay Exit Risk | Relay Exit Risk v2 remains live as a secondary product with a 0–100 Exit Risk Index. | Accumulate lifecycle/community evidence; preserve confidence semantics. |
| Observers | Existing observers/watchers remain bounded; disposable VPS carries no unique durable state. | No new workloads unless justified. |
| AI retrieval | Exa extraction works; semantic discovery remains weak. Tavily quota and GitHub metadata-write blockers remain. | Follow AIR docs in order; do not bypass blockers. |

## Immediate priority

Phone Radar is in a frontend closure pass. The product model is accepted, but the current Phone shell must not be treated as visually complete merely because the route/data tests pass.

Next work round execute in this order:

1. Repair the existing Phone page only, using `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md` as the defect list.
2. Fix the concrete shell defects first: production CSS-token mismatch, inherited Phone button spacing, hero/pre-list scale, card hierarchy, and Full-guide placement.
3. Add only targeted regression checks for the repaired shell; do not add a new route or new product feature in the same repair session.
4. Require a real Vercel Preview with desktop/mobile visual verification before merge. If Vercel remains rate-limited, stop as a provider blocker rather than bypassing it.
5. Q-003 remains waiting on `settledThrough >= 2026-09-16`; when it fires, collect the measurement before another growth/route-expansion decision, but do not use the wait gate to preserve a known visual defect.
6. PR #127 stays unmerged until the Phone shell closure repair is complete and Vercel Preview capacity is available.
7. Q-005 authority recheck remains due Sep 20; no follow-up before then.
8. Cursor/homepage/distribution continue measuring; no premature churn.
9. The Astro frontend foundation remains infrastructure only; do not use this repair as permission for a broad migration or redesign.

Detailed next-session checklist and stop conditions are in `docs/CURRENT_EXECUTION_QUEUE.md`.

## Phone Radar governing rule

Use these sources in order:

1. `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md`
2. `docs/PHONE_RADAR_INTERACTION_SPEC_2026-09-18.md`
3. `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md`
4. `docs/PHONE_RADAR_PRODUCT_DEFINITION.md`
5. `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md`
6. `docs/PHONE_RADAR_GLOBAL_ROUTE_POOL_SEED_2026-09-18.md`
7. current Q-014/Q-013 state in `docs/CURRENT_EXECUTION_QUEUE.md`

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
- `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md` — current concrete Phone visual/UI defect list and repair acceptance gate.
- `docs/PHONE_RADAR_GLOBAL_ROUTE_POOL_SEED_2026-09-18.md` — global breadth seed.
- `docs/PHONE_RADAR_PRODUCT_DEFINITION.md` — durable Phone identity.
- `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` — community-first research method.
- `docs/AUTHORITY_AND_AI_DISCOVERY.md` — authority/referral ledger.
- `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md` — ordered AIR work.
- `docs/RELAY_RISK_METHODOLOGY.md` — fixed Relay methodology.

## Handoff rule

At the beginning of a new working session, read GitHub `main` in this order: `AGENTS.md` → this file's **Current progress checkpoint** → `docs/MASTER_PLAN.md` → `docs/OPERATING_WORKFLOW.md` → `docs/CURRENT_EXECUTION_QUEUE.md`, then only task-specific docs needed by the next action.

GitHub `main` plus verified live production is final truth.