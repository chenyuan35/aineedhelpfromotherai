# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-19

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
| Phone production | **LIVE / PRIMARY; Q-014J REVIEW PENDING.** Canonical production remains unchanged at `https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/`. Draft PR #130 (`feat/q014j-phone-visual-repair-20260918`, current head `199bcca39a4e77d0ef72602e363de9888de2d3fb`) implements the bounded visual-hierarchy repair only. Its current diff is limited to the Phone source page, Phone-specific dark-mode overrides in `frontend/site.css`, and the Phone contract test. Initial head `baf5f333` passed Eval Gate #510 and had a successful Vercel Preview. Desktop dark-mode screenshot review of that Preview then caught a real defect: the global dark `button:not(.theme-toggle)` rule made all three family selectors look similarly light, so the active family was not visually distinct. The same PR branch now overrides that global rule for Phone and locks the behavior with regression assertions; Eval Gate #514 passes on head `199bcca`. The new Vercel Preview attempt for that fix is currently blocked by provider `build-rate-limit`, so the fix is **not yet visually accepted**. PR #130 remains Draft/unmerged and production has not changed. PR #127 CMLink remains unmerged and secondary. | Do not merge or release. Wait for genuine Preview capacity to return, then review a Preview built from head `199bcca` on desktop/mobile and light/dark states against `docs/PHONE_VISUAL_FIRST_ACCEPTANCE_2026-09-19.md`. Do not use the older `baf5f333` Preview as acceptance evidence for the dark-mode fix, and do not push no-op commits or bypass Vercel quota. |
| Phone product direction | The accepted model remains three route families — **Long-term SMS/OTP numbers**, **Data SIM/eSIM routes**, **Temporary SMS platforms** — with two layers: **visual decision dashboard first**, **full operational guide on demand**. A Sep 19 read-only audit of live production confirmed that the current page still reads too much like a marketing landing page: eyebrow → oversized `Find the right phone route fast.` H1 → explanatory line → text family controls. Draft PR #130 is directionally better because it introduces compact SVG job cards (`Keep a real number`, `Get mobile data`, `Receive a one-time code`), smaller hero typography and denser horizontal comparison. | Treat Sep 19 user feedback as an explicit acceptance gate: hero must be subordinate to graphical job choices and real data; use width before height on desktop; first real route must appear quickly; route cards must encode 2–3 decision metrics rather than read as prose. See `docs/PHONE_VISUAL_FIRST_ACCEPTANCE_2026-09-19.md`. |
| Phone decision-cost rule | The product must reduce user reading and decision time. Draft PR #130 replaces five equal-weight card metrics with identity/status + three primary metrics + concise metadata, hides catalog bookkeeping, and only surfaces a warning line when it changes the decision. The first real desktop screenshot confirms the first route is visible in the first viewport and the card hierarchy is substantially clearer; it also proved that visual review can catch CSS-specificity defects that CI misses. | Continue real visual QA rather than treating passing CI as proof of usability. Do not accept a “big headline + small explanatory line + text tabs” composition as visual-first merely because data cards exist below it. |
| Phone research method | Community/user reports, tutorials, comments, user-shared support interactions and current success/failure outcomes drive operational reality. Operator/provider pages are used by default for current price/package/promotion/stock/purchase metadata only; they are not an operational verification gate. | Research only fields that change choice/action. Keep research complexity backstage. |
| Phone global route pool | First cross-region seed spans Hong Kong, Taiwan, South Korea, Singapore, Malaysia, New Zealand, Europe, UK, US, Thailand and more. A1 Croatia is live as a `Watch` long-term route. Stellar China 100GB / 60 days is HOLD because current fulfillment does not reliably match the selected network/egress variant. **Trip.com Mainland China CMLink eSIM, product ID `71336361`, is validated and admission-ready as `Watch`**, but not live. Sep 19 SIM Panda research also validated One NZ as a future `Watch` candidate, while Haha/LuckySIM/Skinny remain HOLD; giffgaff has new degrading/conflicting China evidence and requires later production-state review after shell closure. | Pause route-depth release work until the current Phone visual-closure review is complete. Afterwards, finish the already-open PR #127 only through its own valid Preview/review path before considering another route admission. |
| Phone audit | **Q-014J IMPLEMENTED / REVIEW BLOCKED AFTER FIRST VISUAL DEFECT FIX.** The earlier audit found undefined Phone CSS tokens, inherited global button spacing, marketing-scale hero sizing, equal-weight card density and a detached Full guide. Draft PR #130 repairs those defects and adds targeted regression checks. A real desktop dark-mode screenshot of the first Preview then revealed a second-order specificity defect: unselected and selected family buttons were visually flattened by the global dark button rule. That defect is fixed on head `199bcca`, and Eval Gate #514 passes. A fresh Preview for the fixed head is blocked by Vercel `build-rate-limit`, and mobile/light-mode/inline-guide visual acceptance is still outstanding. Sep 19 live-production review adds V-01–V-07 acceptance criteria: demote hero, graphical job choices, compact horizontal desktop composition, visual route metrics, first useful route in first viewport, mobile visual hierarchy and real rendered light/dark acceptance. | Keep PR #130 Draft. When quota clears, review the fresh fixed Preview against `docs/PHONE_VISUAL_FIRST_ACCEPTANCE_2026-09-19.md`; if a concrete defect remains, repair it on the same branch and rerun checks. Do not call Q-014 visually complete until desktop/mobile visual acceptance is explicit. |
| Search Console | **Q-003 trigger fired on Sep 19.** GSC Wizard now reports `settledThrough=2026-09-16`. The Phone canonical recorded 0 impressions / 0 clicks on Sep 16; the checked GA4 Sep 16–19 Phone page/landing-page window recorded 0 sessions / 0 active users. This is an insufficient demand sample, not evidence for expansion or repositioning. | Q-003 decision is **KEEP / continue collecting evidence**. Do not add routes/pages or churn copy because exposure is zero. Re-measure when settled Phone impressions/clicks or meaningful interactions appear. |
| Indexing | **Phone canonical is now indexed.** Sep 19 GSC indexing tracker reports `indexed`, verdict `PASS`, coverage `Submitted and indexed`, `INDEXING_ALLOWED`; last recorded crawl is 2026-09-17 22:29:28 UTC. | No manual submission churn. Continue normal cadence and measure demand after actual impressions appear. |
| Cursor CTR | Cursor title/meta pilot remains measuring. The Sep 17 title/meta commit lands after the current GSC settled window, so there is not yet a clean post-change sample. Q-015 Usage Pool / Quota Explainer research and exact execution plan were merged in PR #146. | When GSC settles Sep 17+, collect clean post-change impressions; first decision at >=300 clean impressions, extend toward ~500 only if ambiguous. Production Q-015 implementation remains behind Phone visual closure and its own measurement gate. |
| Distribution | Claude Reset Threads and Cursor Reset Mastodon tests are published; referral/social remains separate from organic. | Measure first; no mass cross-posting. |
| Authority | First Sep 18 outreach check found no reply or independently verified link. | Recheck original Gmail threads/public pages on Sep 20 before follow-up/batch 2. |
| Relay Exit Risk | Relay Exit Risk v2 remains live as a secondary product with a 0–100 Exit Risk Index. | Accumulate lifecycle/community evidence; preserve confidence semantics. |
| Observers | Existing observers/watchers remain bounded; disposable VPS carries no unique durable state. Sep 19 attempted Phone official-source watcher verification through the connected qwen Desktop Commander environment, but that environment is not the systemd observer host, so today’s watcher runtime is **not verified** from that connection. | Do not guess which unnamed device is the observer and do not report green/failure without the actual host. Verify only when the disposable observer host is explicitly identifiable/reachable; no production dependency may rely on it. |
| AI retrieval | Exa extraction works; semantic discovery remains weak. Tavily quota and GitHub metadata-write blockers remain. | Follow AIR docs in order; do not bypass blockers. |

## Immediate priority

**Phone Radar frontend closure is the active project task.** The one-off TikTok App Review task is **SUBMITTED / WAITING FOR REVIEW**. While TikTok review is pending, do not Recall the submission, edit the submitted Portal configuration or demo, remove the temporary Sandbox bridge, or change TikTok credentials/URLs/products/scopes. Resume TikTok work only when TikTok returns `Approved` or `Rejected / Changes requested`.

Phone Radar remains in a frontend review pass. The visual repair exists in Draft PR #130. Sep 19 live-production review confirms the current public page still overweights a marketing hero and explanatory text relative to graphical user-job choices. The shell must not be treated as finished merely because data cards exist or automated tests pass.

Next work round execute in this order:

1. Check PR #130 head and Vercel status; current reviewed code head is `199bcca39a4e77d0ef72602e363de9888de2d3fb` and its latest Vercel attempt is blocked by `build-rate-limit`.
2. Do not source-push, redeploy manually, use alternate projects/accounts or change billing to bypass the blocker. Do not use the older `baf5f333` Preview as proof that the dark-state fix works.
3. When genuine Preview capacity returns, open the fresh PR #130 Preview and execute **V-01 through V-07** from `docs/PHONE_VISUAL_FIRST_ACCEPTANCE_2026-09-19.md`: hero proportion, graphical job selector dominance, compact horizontal desktop composition, visual route metrics, first-route visibility, mobile hierarchy and rendered acceptance.
4. Inspect desktop/mobile and light/dark states, all three family selected states, country filtering, `Show more`, guide open/close, outbound links and horizontal overflow.
5. If a concrete visual defect appears, fix it on the same PR #130 branch, rerun the Phone tests/public build/Eval Gate and review the fresh Preview again. No new route or feature in this repair batch.
6. Only after the fixed Preview is visually clean may Q-014J be marked visually accepted and PR #130 considered for leaving Draft. Production stays unchanged meanwhile.
7. **Q-003 was executed Sep 19:** Phone is indexed but had 0 settled Sep 16 impressions/clicks and no checked GA4 activity. Decision is KEEP / insufficient sample; wait for actual exposure before another growth decision.
8. PR #127 stays unmerged until Phone visual closure is complete; then it still requires its own fresh valid Preview before release.
9. Q-005 authority recheck remains due Sep 20; no follow-up before then.
10. Cursor Q-015/homepage/distribution continue measuring; no premature production churn.
11. The Astro frontend foundation remains infrastructure only; do not use this repair as permission for a broad migration or redesign.

Detailed Sep 19 maintenance evidence is in `docs/DAILY_MAINTENANCE_CHECK_2026-09-19.md`; detailed visual acceptance is in `docs/PHONE_VISUAL_FIRST_ACCEPTANCE_2026-09-19.md`.

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
