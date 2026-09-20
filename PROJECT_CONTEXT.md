# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-20

This file is the compact current-facts source for the project. Keep volatile execution detail in task-specific docs and PRs. If anything here conflicts with GitHub `main` plus verified production, GitHub `main` and verified production win.

## Current progress checkpoint

Read this section first in a new session. Do not rescan the whole repository, VPS fleet, deployment history, or old chats unless this checkpoint is stale, contradictory, or the current task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | `https://aineedhelpfromotherai.com/` is live. Vercel deploys the static frontend from GitHub `main`; the historical Express/PostgreSQL runtime remains only behind the allowlisted API surface required by Relay Exit Risk. | Use fresh branches/PRs; never reset or overwrite the dirty production worktree. |
| TikTok App Review | **SUBMITTED / WAITING FOR REVIEW.** PR #140 (publisher, commit `587e275`) and PR #141 (temporary Sandbox review bridge, commit `e15c603`) are merged. The user uploaded the completed demo video, corrected the Production Web/Desktop URL to `https://aineedhelpfromotherai.com/`, kept the Login Kit redirect at `https://aineedhelpfromotherai.com/api/tiktok/callback/`, cleared the empty/duplicate URI validation errors, and successfully submitted the Production app for review on 2026-09-19. The Portal confirmation explicitly said the app was submitted and now shows `Recall`. | **Wait for TikTok. Do not Recall, edit the submitted Portal configuration/demo, remove the Sandbox bridge, or change credentials/URLs/products/scopes while review is pending.** Next action only on `Approved` or `Rejected / Changes requested`; see `docs/TIKTOK_PUBLISH_REVIEW_NOTES_2026-09-19.md`. |
| Frontend foundation | An isolated Astro 7 + Tailwind 4 foundation now exists under `frontend/astro/`: typed Tool Registry, current-site shell, reusable tool cards/search, shared design tokens, Astro `/tools/` sample, registry checks and dedicated Frontend Astro CI. It does **not** replace the current production build path. Vercel Preview still exercises the legacy static frontend, while the dedicated Astro CI validates the new sample build. | Keep production homepage/Phone/Relay shells unchanged except for bounded closure repairs backed by concrete defects. Only consider a later `/tools/` cutover after explicit preview/parity/analytics verification; migrate incrementally rather than replacing the whole site at once. |
| Product scope | Scope remains frozen to three surfaces: **Phone Radar** primary; **AI Reset Radar** and **Relay Exit Risk** secondary. | No fourth product surface, second Phone canonical, provider/country doorway pages, or broad utility expansion. |
| Homepage | Current first viewport remains `AI stopped? Start here.` / `What stopped?`; `home_job_select` is measuring behavior. | No homepage churn without evidence. |
| Phone production | **LIVE / VISUALLY ACCEPTED.** Q-014J shell closure remains the baseline. Q-013D4 is now also **DONE / PRODUCTION VERIFIED**: PR #127 final head `6da8bb43` passed the current Eval Gate and its own fresh Vercel Preview, then squash-merged as `ebbfe784e7c4a9adc8cd19aa5add104855150bd5`. Production Data-family QA passed desktop/mobile × light/dark, CMLink `Watch`/data-only framing, Mainland China filtering, inline Full guide, Airalo/Mobal regression checks and no page-level horizontal overflow. | Phone shell remains frozen. CMLink is live; do not reopen Phone redesign or add another route without a separate evidence-backed task. |
| Phone product direction | The accepted model remains three route families — **Long-term SMS/OTP numbers**, **Data SIM/eSIM routes**, **Temporary SMS platforms** — with two layers: **visual decision dashboard first**, **full operational guide on demand**. The Sep 19 visual-first acceptance contract is now implemented in production: task-first graphical selectors, compact hero, first route visible quickly and three primary route metrics. | Preserve this visual baseline. Future Phone work should be data freshness, reproduced defects or already-validated bounded route additions, not another shell redesign. |
| Phone decision-cost rule | Production now uses identity/status + three primary metrics + concise metadata, conditional warnings and an inline Full guide. Real Preview/production QA also proved that generated CSS and filter behavior must be tested, not inferred from source/CI. | Keep using real rendered QA for any Phone change; visible elements must reduce choice/action cost. |
| Phone research method | Community/user reports, tutorials, comments, user-shared support interactions and current success/failure outcomes drive operational reality. Operator/provider pages are used by default for current price/package/promotion/stock/purchase metadata only; they are not an operational verification gate. | Research only fields that change choice/action. Keep research complexity backstage. |
| Phone global route pool | First cross-region seed spans Hong Kong, Taiwan, South Korea, Singapore, Malaysia, New Zealand, Europe, UK, US, Thailand and more. A1 Croatia is live as `Watch`. Trip.com Mainland China CMLink eSIM, product ID `71336361`, is now live as `Watch` after Q-013D4 production admission. One NZ is a future `Watch` candidate; Haha/LuckySIM/Skinny remain HOLD; giffgaff has degrading/conflicting China evidence for later state review. | Do not add another route automatically. Future admissions require their own evidence-backed bounded task. |
| Phone audit | **Q-014J DONE / PRODUCTION VERIFIED.** The bounded repair fixed token/spacing/hero/card/guide defects; real rendered QA then found and fixed build-generated dark-button specificity and country filtering that hid non-shortlist matches. Eval Gate #567 passed on `dc8d147`; Preview succeeded; merge `5ccd50b`; production verification passed desktop/mobile × light/dark, all family states, Croatia filter, Show more, inline guide and overflow checks. | Treat Sep 19 closure as the baseline; reopen only for reproduced regressions/evidence-backed defects. |
| Search Console | **Q-003 trigger fired on Sep 19.** GSC Wizard now reports `settledThrough=2026-09-16`. The Phone canonical recorded 0 impressions / 0 clicks on Sep 16; the checked GA4 Sep 16–19 Phone page/landing-page window recorded 0 sessions / 0 active users. This is an insufficient demand sample, not evidence for expansion or repositioning. | Q-003 decision is **KEEP / continue collecting evidence**. Do not add routes/pages or churn copy because exposure is zero. Re-measure when settled Phone impressions/clicks or meaningful interactions appear. |
| Indexing | **Phone canonical is now indexed.** Sep 19 GSC indexing tracker reports `indexed`, verdict `PASS`, coverage `Submitted and indexed`, `INDEXING_ALLOWED`; last recorded crawl is 2026-09-17 22:29:28 UTC. | No manual submission churn. Continue normal cadence and measure demand after actual impressions appear. |
| Cursor / Reset | **M-02A DONE / PRODUCTION VERIFIED; M-02B is progressing one page at a time.** Claude, GitHub Copilot, Manus, Replit and Bolt audit/repair rounds are production-verified; M-02B-6 AI Credit Burn Rate Calculator read-only audit is DONE / DEFECT REPRODUCED. Functional math, invalid/missing input, saved-state recomputation, SEO identity, themes and overflow passed, but mobile action/result hierarchy failed: at 390×844 Calculate/result begin ~946/~1416px; at 320×800 ~1112/~1607px. Q-015 remains measurement-gated. | Next independent session: M-02B-6R bounded mobile action/result hierarchy repair. When GSC settles Sep 17+, collect the clean Cursor CTR sample; do not add Q-015 quota/pool functionality through visual maintenance. |
| Distribution | Claude Reset Threads and Cursor Reset Mastodon tests are published; referral/social remains separate from organic. | Measure first; no mass cross-posting. |
| Authority | First Sep 18 outreach check found no reply or independently verified link. | Recheck original Gmail threads/public pages on Sep 20 before follow-up/batch 2. |
| Relay Exit Risk | Relay Exit Risk v2 remains live as a secondary product with a 0–100 Exit Risk Index. | Accumulate lifecycle/community evidence; preserve confidence semantics. |
| Observers | Existing observers/watchers remain bounded; disposable VPS carries no unique durable state. Sep 19 attempted Phone official-source watcher verification through the connected qwen Desktop Commander environment, but that environment is not the systemd observer host, so today’s watcher runtime is **not verified** from that connection. | Do not guess which unnamed device is the observer and do not report green/failure without the actual host. Verify only when the disposable observer host is explicitly identifiable/reachable; no production dependency may rely on it. |
| AI retrieval | Exa extraction works; semantic discovery remains weak. Tavily quota and GitHub metadata-write blockers remain. | Follow AIR docs in order; do not bypass blockers. |

## Immediate priority

**M-02B-6 AI Credit Burn Rate Calculator audit is COMPLETE / DEFECT REPRODUCED. The next independent session task is M-02B-6R bounded mobile action/result hierarchy repair.** TikTok remains **SUBMITTED / WAITING FOR REVIEW** and must not be recalled or edited while pending.

M-02A closure evidence:

1. Production baseline showed the calculator below the first viewport: top ~815px desktop / ~1126px mobile, with the reset input at ~1048px / ~1368px.
2. PR #153 changed only `frontend/bin/enhance-cursor-breakthrough.mjs`; final head `6c87923d0ab54a018563c18e8732cd154a44375e` passed Eval Gate #577 and a fresh Vercel Preview.
3. Preview and production QA passed desktop/mobile × light/dark: calculator top ~490px / ~479px, reset input ~723px / ~721px, Quick answer after the tool, no page-level horizontal overflow, and clear primary/secondary action hierarchy.
4. Empty/invalid/past timestamps, 0%/100% usage, localStorage restore, copy summary, calendar download and clear-state behavior passed with no page errors.
5. Canonical and the current Cursor title/meta CTR pilot were preserved; no Q-015 quota/pool feature was added. PR #153 squash-merged as `67052224cd1ee84d6e595d13f3ac1e8c89e18f02` and Vercel production deployment succeeded.

Next session: execute M-02B-6R AI Credit Burn Rate Calculator bounded mobile action/result hierarchy repair only. Q-005 authority recheck remains due Sep 20; Cursor Q-015 remains measurement-gated. No new Reset URL or quota/pool expansion through the visual-maintenance path.

Detailed Sep 19 closure evidence remains in `docs/PHONE_VISUAL_FIRST_ACCEPTANCE_2026-09-19.md`; the maintenance execution contract is `docs/MAINTENANCE_VISUAL_EXECUTION_AUDIT_PLAN_2026-09-19.md`.

## Phone Radar governing rule

Use these sources in order:

1. `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md`
2. `docs/PHONE_RADAR_INTERACTION_SPEC_2026-09-18.md`
3. `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md`
4. `docs/PHONE_VISUAL_FIRST_ACCEPTANCE_2026-09-19.md`
5. `docs/PHONE_RADAR_PRODUCT_DEFINITION.md`
6. `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md`
7. `docs/PHONE_RADAR_GLOBAL_ROUTE_POOL_SEED_2026-09-18.md`
8. current Q-014/Q-013 state in `docs/CURRENT_EXECUTION_QUEUE.md`

### Frontstage

- graphical three-job / route-family selector;
- small visual shortlist with a real route visible quickly;
- family-appropriate comparison metrics limited to the values that change the decision;
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
- `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md` — original concrete Phone visual/UI defect list and repair acceptance gate.
- `docs/PHONE_VISUAL_FIRST_ACCEPTANCE_2026-09-19.md` — current user-directed visual-first acceptance contract for Q-014J.
- `docs/DAILY_MAINTENANCE_CHECK_2026-09-19.md` — Sep 19 Q-003/indexing/maintenance evidence and carryover audit.
- `docs/PHONE_RADAR_GLOBAL_ROUTE_POOL_SEED_2026-09-18.md` — global breadth seed.
- `docs/PHONE_RADAR_PRODUCT_DEFINITION.md` — durable Phone identity.
- `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` — community-first research method.
- `docs/CURSOR_USAGE_POOL_EXECUTION_PLAN_2026-09-19.md` — Q-015 Cursor Usage Pool / Quota Explainer execution gate and implementation contract.
- `docs/AUTHORITY_AND_AI_DISCOVERY.md` — authority/referral ledger.
- `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md` — ordered AIR work.
- `docs/RELAY_RISK_METHODOLOGY.md` — fixed Relay methodology.

## Handoff rule

At the beginning of a new working session, read GitHub `main` in this order: `AGENTS.md` → this file's **Current progress checkpoint** → `docs/MASTER_PLAN.md` → `docs/OPERATING_WORKFLOW.md` → `docs/CURRENT_EXECUTION_QUEUE.md`, then only task-specific docs needed by the next action.

GitHub `main` plus verified live production is final truth.
