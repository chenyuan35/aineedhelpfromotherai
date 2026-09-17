# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-18

This file is the compact current-facts source for the project. Keep volatile execution detail in task-specific docs and PRs. If anything here conflicts with GitHub `main` plus verified production, GitHub `main` and verified production win.

## Current progress checkpoint

Read this section first in a new session. Do not rescan the whole repository, VPS fleet, deployment history, or old chats unless this checkpoint is stale, contradictory, or the current task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | `https://aineedhelpfromotherai.com/` is live. Vercel deploys the static frontend from GitHub `main`; the historical Express/PostgreSQL runtime remains only behind the allowlisted API surface required by Relay Exit Risk. PR #93 retired the old public AI-agent/MCP/Memory surface. | Keep production stable. Use fresh branches/PRs; never reset or overwrite the dirty production worktree. |
| Product scope | Scope remains frozen to three surfaces for one AI-power-user audience: **Phone Radar / Phone Number Lifecycle** is primary; **AI Reset Radar / reset tracking** and **Relay Exit Risk** are secondary. Legacy calculators/image tools are maintenance-only. | No fourth product surface, second Phone canonical, provider/country doorway pages, or broad utility expansion without an explicit evidence-backed strategy change. |
| Homepage | The current first viewport remains **`AI stopped? Start here.`** / **`What stopped?`**, mapping Reset · Access · Reliability. PR #87 adds `home_job_select` measurement. | Do not churn homepage copy before meaningful first-screen behavior exists unless a verified usability defect appears. |
| Phone production | **LIVE / PRIMARY.** Canonical: `https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/`. PR #75 is the public release baseline. PR #108 corrected Sakura Monthly Voice+Data overseas calls/SMS from `unknown` to supported after activation; production JSON was live-verified HTTP 200 after merge. The old internal `phone-number-lifecycle-mvp` path is a real 404. PR #112 was closed and not merged. | Keep production stable while the Phone product reset is specified. Do not incrementally patch the questionnaire/manual experience or ship the abandoned PR #112 direction. |
| Phone product identity | The product is a **Phone Radar** whose user job is to find, compare, open and keep useful phone-number routes using current real-user operational information. A 2026-09-18 review found that the live UI drifted into a questionnaire + research-manual experience because internal evidence handling leaked into the public product. | Follow `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md`. Concrete routes must be visible without completing a questionnaire. Default comparison should emphasize SMS/OTP reliability signal, yearly keep-alive cost, setup difficulty, remote practicality, stability/risk and direct opening/tutorial actions. Research methodology stays backstage. |
| Phone research method | Community/real-user reports, tutorials, comments, support interactions shared by users, and recent success/failure outcomes are the primary operational dataset. Missing public carrier documentation is not a reason to turn a reproduced route into `unknown`. Public carrier pages are not an operational verification gate; price/product metadata may be collected when useful. | Research around user outcomes: setup success/failure, SMS/OTP results, keep-alive cost, number loss/recovery, complaints, support outcomes, refunds/restoration and current tutorials. Stop when more research would not change the user's decision or action. |
| Phone audit | Q-013 route research is no longer the default next action. giffgaff, Tello, Lebara UK, Sakura, Ultra PayGo and H2O PayGo were reviewed; Sakura received the only immediate production correction. AIS remains HOLD. RedPocket remains a candidate, not an automatic next task. | Q-014 Phone Radar product reset now precedes more provider expansion. Pause AIS/RedPocket polishing unless new work directly supports the redesigned decision surface. |
| Phone verification-continuity | PR #81 remains **provisional NARROW**: verification continuity may become a compact decision layer inside the existing Phone canonical, not a new product/URL family. | Fold only genuinely useful compatibility information into the redesigned decision surface; do not create a separate product. |
| Search Console | GSC Wizard is connected. Last checked `settledThrough=2026-09-14`, so settled data still did not cover the Sep 16 Phone public release. | When `settledThrough >= 2026-09-16`, execute Q-003 immediately: indexing + queries/impressions/clicks/CTR/position + GA4 Phone behavior, then use the result to inform Q-014 rather than restoring the old questionnaire/manual direction. |
| Indexing | Last checked tracker: **18 tracked / 9 indexed / 9 not indexed / 0 pending / 0 errors / 0 warnings**. Phone canonical remained `URL is unknown to Google`; sitemap had 22 URLs and one Phone canonical. | Let normal tracker cadence work; do not churn manual submissions. |
| Cursor CTR pilot | PR #82 changed only Cursor title/meta. Pre-change Sep 13–14 baseline: 141 settled impressions / 0 clicks. | Wait for roughly 300–500 additional impressions before another title change unless an obvious defect appears. |
| Distribution | Bounded Reset distribution tests were published: Claude Reset on Threads and Cursor Reset on Mastodon. Keep social/referral separate from organic; current Reddit/Bluesky account identities are not fit for this project. | Measure first; do not mass cross-post. If mature distribution is still weak and a new test is justified, X is the next high-fit text candidate before DEV.to. |
| Authority | First outreach round was sent Sep 13 to hsmart.dev, Continuum Code and Drew Bredvick. First check on Sep 18 found no replies and no independently verified public links/citations. | Recheck the original Gmail threads and public pages on Sep 20 before deciding between exactly one tailored follow-up or a stronger batch-2 test. Do not increase volume because round one is quiet. |
| Relay Exit Risk | Relay Exit Risk v2 remains live as a secondary product with a 0–100 Exit Risk Index from public measurements + stored lifecycle history + time-bounded community forecast. It is not a shutdown/fraud/scam probability. | Accumulate evidence/history and preserve confidence semantics. |
| Observers | Codex stores independent Relay history and pushes bounded verified backup to Qwen. Hatchable provides external health observation. The one-month low-resource observer runs bounded Phone/source/demand jobs and remains disposable/resource-tight. | No new workloads; no unique durable state; use watcher output as review triggers only. |
| AI retrieval | Exa known-URL extraction works; semantic discovery remains weak. Tavily AIR-1 remains quota-blocked; AIR-3 GitHub metadata write remains blocked; AIR-4 is the active authority path. | Follow AIR docs in order; do not pay/bypass blockers or invent results. |
| Technical quality | Historical cleanup is complete enough; broad cleanup should stop. GitHub description/topics still carry old identity because current metadata-write path remains blocked. | Optimize only from measured defects, search/behavior signals or explicit strategy changes. |

## Immediate priority

Phone Radar product correction is now the active product-depth task while existing measurement gates mature.

Before any new work in a new session, check these triggers first:

1. **Q-003 Phone measurement:** if GSC `settledThrough >= 2026-09-16`, run the first real post-release Phone measurement before production implementation.
2. **Q-005 authority:** if the date is 2026-09-20 or later and the second round-one check is not recorded, review the original three outreach threads before sending anything.
3. **Q-014 Phone Radar product reset:** otherwise continue the bounded product reset in `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md`. The next work is product specification/wireframe discussion only: route-card contract + tutorial/detail contract + visual decision model.
4. **Q-013 Phone route research:** HOLD as the default next action. AIS and RedPocket remain inputs/candidates, not milestones.
5. **Q-004 Cursor / homepage / distribution:** continue measuring; no title/homepage/social churn from immature data.
6. **Relay / observers / AIR:** stay event-driven and respect existing blockers.

Full older session handoff: `docs/HANDOFF_2026-09-17_PHONE_RADAR.md`. It is subordinate to the newer reset document and this checkpoint.

## Phone Radar governing rule

For Phone product/research work, use these sources in order:

1. `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md`
2. `docs/PHONE_RADAR_PRODUCT_DEFINITION.md`
3. `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md`
4. current Q-014/Q-013 state in `docs/CURRENT_EXECUTION_QUEUE.md`

The product/research distinction is mandatory:

- **Backstage:** community discovery, cross-report reconciliation, confidence/freshness logic, incidents, raw sources, research notes.
- **Frontstage:** actual routes, SMS/OTP signal, yearly keep-alive cost, setup difficulty, location practicality, stability/risk, concise tutorial, keep-alive action and purchase/opening action.

Community and real-user operational evidence is the primary source for how a route actually behaves. Public carrier pages do not validate or invalidate a reproduced route merely because it is or is not documented there.

Never recommend forged KYC, deceptive support stories, stolen identities, unauthorized access, security bypass, or prohibited geography evasion.

## Mission

Turn `aineedhelpfromotherai.com` into a low-cost, high-traffic utility site that can earn small, stable AdSense revenue. Primary signals: organic impressions, indexed pages, CTR, useful/repeat visits, page speed, measurable search/AI referrals and eventually ad revenue. Do not optimize for SaaS complexity.

## Product rules

- Prefer real search demand, clear tool intent, repeat value, speed, low marginal cost and maintainability.
- Prefer browser-side tools; add backend/shared state only when the user job genuinely requires it.
- One clear user task per page; avoid thin/near-duplicate/keyword-variant doorway pages.
- Improve an existing URL before adding a similar one.
- Phone Radar value comes from non-obvious operational routes + real user outcomes + practical tutorials + freshness, not from restating carrier marketing pages.
- Missing data lowers confidence; never invent certainty.
- Separate Google organic, referral/social, AI referral and direct/repeat behavior.
- AI discoverability stays non-adversarial: crawlability, indexing, relevance, freshness, authority, extractability and primary evidence; no cloaking/fake citations/fake freshness/synthetic backlinks.

## Current architecture and safety

- Canonical host: `https://aineedhelpfromotherai.com/`; `www` redirects to apex.
- Static frontend: Vercel from GitHub `chenyuan35/aineedhelpfromotherai` `main`.
- Vercel proxies only allowlisted current backend routes required for health/status/diagnostics/Relay Exit Risk.
- Cloudflare provides DNS. Do not change DNS, AdSense, billing or critical account settings without explicit authorization.
- Never print or commit credentials.
- Never reset/discard/overwrite the dirty production worktree. Use fresh branch/worktree → tests → PR → CI/Eval/Vercel Preview → merge → production verification.
- Never use `hermes` for this project.
- `yuan` is the user's personal workstation, not website infrastructure.
- Trial/temporary VPS machines are disposable observers unless explicitly promoted after review; never put unique production state there.

## Durable fact sources

- `docs/MASTER_PLAN.md` — phases, sprint priorities and exit gates.
- `docs/OPERATING_WORKFLOW.md` — fixed execution workflow.
- `docs/CURRENT_EXECUTION_QUEUE.md` — atomic next actions, blockers and triggers.
- `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md` — active Phone product correction and task list.
- `docs/PHONE_RADAR_PRODUCT_DEFINITION.md` — Phone product identity and decision model; subordinate to the newer reset where they conflict.
- `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` — community-first route research method; subordinate to the newer reset where it still implies documentation-gated research.
- `docs/PHONE_HIDDEN_ROUTE_AUDIT_2026-09-17.md` — historical/current route audit input; not the active product roadmap.
- `docs/PHONE_NUMBER_LIFECYCLE_PRODUCT_PLAN.md` — lifecycle/reminder/technical scope; older evidence ordering is superseded.
- `docs/PHONE_VERIFICATION_CONTINUITY_VALIDATION.md` — verification-continuity evidence matrix.
- `docs/AUTHORITY_AND_AI_DISCOVERY.md` — outreach/referral/authority/AI-citation ledger.
- `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md` — ordered AIR work/provider tests.
- `docs/RELAY_RISK_METHODOLOGY.md` — fixed Relay methodology.
- `docs/HANDOFF_2026-09-17_PHONE_RADAR.md` — older transition note; subordinate to newer canonical facts.

## Handoff rule

At the beginning of a new working session, read GitHub `main` in this order: `AGENTS.md` → this file's **Current progress checkpoint** → `docs/MASTER_PLAN.md` → `docs/OPERATING_WORKFLOW.md` → `docs/CURRENT_EXECUTION_QUEUE.md`. Then read only the task-specific documents required by the next action.

GitHub `main` plus verified live production is the final source of truth. Do not use chat memory to override it.
