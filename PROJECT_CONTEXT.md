# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-17

This file is the compact current-facts source for the project. Keep volatile execution detail in task-specific docs and PRs. If anything here conflicts with GitHub `main` plus verified production, GitHub `main` and verified production win.

## Current progress checkpoint

Read this section first in a new session. Do not rescan the whole repository, VPS fleet, deployment history, or old chats unless this checkpoint is stale, contradictory, or the current task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | `https://aineedhelpfromotherai.com/` is live. Vercel deploys the static frontend from GitHub `main`; the historical Express/PostgreSQL runtime remains only behind the allowlisted API surface required by Relay Exit Risk. PR #93 retired the old public AI-agent/MCP/Memory surface. | Keep production stable. Use fresh branches/PRs; never reset or overwrite the dirty production worktree. |
| Product scope | Scope remains frozen to three surfaces for one AI-power-user audience: **Phone Radar / Phone Number Lifecycle** is primary; **AI Reset Radar / reset tracking** and **Relay Exit Risk** are secondary. Legacy calculators/image tools are maintenance-only. | No fourth product surface, second Phone canonical, provider/country doorway pages, or broad utility expansion without an explicit evidence-backed strategy change. |
| Homepage | The current first viewport remains **`AI stopped? Start here.`** / **`What stopped?`**, mapping Reset · Access · Reliability. PR #87 adds `home_job_select` measurement. | Do not churn homepage copy before meaningful first-screen behavior exists unless a verified usability defect appears. |
| Phone production | **LIVE / PRIMARY.** Canonical: `https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/`. PR #75 is the public release baseline. The old internal `phone-number-lifecycle-mvp` path is a real 404. | Keep one canonical. Current production data stays stable while the Phone Radar evidence audit runs, except for the smallest correction when an existing claim is clearly misleading. |
| Phone product identity | The product is now explicitly operated as a **Phone Radar**, not an official-plan directory. PR #104 added `docs/PHONE_RADAR_PRODUCT_DEFINITION.md`: continuously discover non-obvious low-cost routes, expose real setup prerequisites/friction, overseas usability, retention cost, number continuity, freshness and failure reports, then let users quickly filter to routes that fit their constraints. | Use the fast-filter decision model: cost + required documents/KYC + geography + support/app/manual steps + eSIM/device needs + China/overseas SMS/Wi-Fi Calling + retention + replacement/recovery + recent reproduction/failure evidence. |
| Phone research method | PR #100 started the hidden-route reset; PR #102 made the community/reproduction-first method authoritative for **all** Phone route research. `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` supersedes older Phone wording that implied public carrier pages should be searched/trusted first. | Community/real-user evidence discovers routes; independent reproduction and direct carrier support/app evidence establish operational reality; public carrier/regulator material checks hard constraints/conflicts. Missing public marketing pages are not rejection criteria. |
| Phone audit | Q-013 is ACTIVE. `docs/PHONE_HIDDEN_ROUTE_AUDIT_2026-09-17.md` records current discrepancies/candidates. Confirmed issues include giffgaff long-term-overseas enforcement risk, Sakura missed overseas calls/SMS evidence, Ultra PayGo Wi-Fi Calling gap, Tello overseas activation/roaming enforcement, and mixed Lebara overseas Wi-Fi Calling/SMS reality. AIS Thailand `49B / 365 days` is a support-confirmed hidden-route candidate, not ordinary hearsay, but is not yet in the production catalog. | Complete the current-route discrepancy matrix before adding routes. Prioritize corrections to current routes first; then admit at most one or two genuinely strong hidden routes with recent reproducibility and maintainable evidence. |
| Phone verification-continuity | PR #81 remains **provisional NARROW**: verification continuity may become a compact decision layer inside the existing Phone canonical, not a new product/URL family. | Wait for real Phone post-release data before production repositioning. |
| Search Console | GSC Wizard is connected. Last checked `settledThrough=2026-09-14`, so settled data still did not cover the Sep 16 Phone public release. | When `settledThrough >= 2026-09-16`, execute Q-003 immediately: indexing + queries/impressions/clicks/CTR/position + GA4 Phone behavior, then record exactly one KEEP / ADJUST / NARROW decision before production repositioning. |
| Indexing | Last checked tracker: **18 tracked / 9 indexed / 9 not indexed / 0 pending / 0 errors / 0 warnings**. Phone canonical remained `URL is unknown to Google`; sitemap had 22 URLs and one Phone canonical. | Let normal tracker cadence work; do not churn manual submissions. |
| Cursor CTR pilot | PR #82 changed only Cursor title/meta. Pre-change Sep 13–14 baseline: 141 settled impressions / 0 clicks. | Wait for roughly 300–500 additional impressions before another title change unless an obvious defect appears. |
| Distribution | Bounded Reset distribution tests were published: Claude Reset on Threads and Cursor Reset on Mastodon. Keep social/referral separate from organic; current Reddit/Bluesky account identities are not fit for this project. | Measure first; do not mass cross-post. If mature distribution is still weak and a new test is justified, X is the next high-fit text candidate before DEV.to. |
| Authority | First outreach round was sent Sep 13 to hsmart.dev, Continuum Code and Drew Bredvick. Follow-up window: Sep 18–20. | When due, read `docs/AUTHORITY_AND_AI_DISCOVERY.md` and original Gmail threads; classify outcomes and independently verify links before deciding on batch 2. |
| Relay Exit Risk | Relay Exit Risk v2 remains live as a secondary product with a 0–100 Exit Risk Index from public measurements + stored lifecycle history + time-bounded community forecast. It is not a shutdown/fraud/scam probability. | Accumulate evidence/history and preserve confidence semantics. |
| Observers | Codex stores independent Relay history and pushes bounded verified backup to Qwen. Hatchable provides external health observation. The one-month low-resource observer runs bounded Phone/source/demand jobs and remains disposable/resource-tight. | No new workloads; no unique durable state; use watcher output as review triggers only. |
| AI retrieval | Exa known-URL extraction works; semantic discovery remains weak. Tavily AIR-1 remains quota-blocked; AIR-3 GitHub metadata write remains blocked; AIR-4 is the active authority path. | Follow AIR docs in order; do not pay/bypass blockers or invent results. |
| Technical quality | Historical cleanup is complete enough; broad cleanup should stop. GitHub description/topics still carry old identity because current metadata-write path remains blocked. | Optimize only from measured defects, search/behavior signals or explicit strategy changes. |

## Immediate priority

Phone Radar research quality is the active product-depth task while existing measurement gates mature.

Before doing more research in a new session, check these triggers first:

1. **Q-003 Phone measurement:** if GSC `settledThrough >= 2026-09-16`, run the first real post-release Phone measurement before production repositioning.
2. **Q-005 authority:** if the Sep 18–20 window is open, review the original three outreach threads from the authority ledger/Gmail and verify any claimed links.
3. **Q-013 Phone Radar audit:** continue the current-route discrepancy matrix and hidden-route research under the new community/reproduction-first method. Correct current-route inaccuracies before adding new routes.
4. **Q-004 Cursor / homepage / distribution:** continue measuring; no title/homepage/social churn from immature data.
5. **Relay / observers / AIR:** stay event-driven and respect existing blockers.

Full session handoff: `docs/HANDOFF_2026-09-17_PHONE_RADAR.md`.

## Phone Radar governing rule

For Phone route discovery/recommendation research, these sources are authoritative:

1. `docs/PHONE_RADAR_PRODUCT_DEFINITION.md`
2. `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md`
3. `docs/PHONE_HIDDEN_ROUTE_AUDIT_2026-09-17.md`
4. current Q-013 in `docs/CURRENT_EXECUTION_QUEUE.md`

Older wording in `docs/MASTER_PLAN.md`, `docs/PHONE_NUMBER_LIFECYCLE_PRODUCT_PLAN.md`, older watcher docs or PR history that says variants of `official sources first` or `community only for failure modes` is superseded for Phone route discovery/recommendation.

Public official/regulator material remains important for genuine hard legal/KYC/geography/security constraints, stable mechanics and conflict investigation. It is **not** the discovery/admission/ranking gate for low-cost or support-assisted routes.

Never recommend forged KYC, deceptive support stories, stolen identities, unauthorized access, security bypass, or prohibited geography evasion.

## Mission

Turn `aineedhelpfromotherai.com` into a low-cost, high-traffic utility site that can earn small, stable AdSense revenue. Primary signals: organic impressions, indexed pages, CTR, useful/repeat visits, page speed, measurable search/AI referrals and eventually ad revenue. Do not optimize for SaaS complexity.

## Product rules

- Prefer real search demand, clear tool intent, repeat value, speed, low marginal cost and maintainability.
- Prefer browser-side tools; add backend/shared state only when the user job genuinely requires it.
- One clear user task per page; avoid thin/near-duplicate/keyword-variant doorway pages.
- Improve an existing URL before adding a similar one.
- Phone Radar value comes from non-obvious operational routes + real prerequisites/failure modes + freshness, not from restating carrier marketing pages.
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
- `docs/PHONE_RADAR_PRODUCT_DEFINITION.md` — current Phone product identity and filter model.
- `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` — authoritative Phone route research/evidence method.
- `docs/PHONE_HIDDEN_ROUTE_AUDIT_2026-09-17.md` — active discrepancy/candidate audit.
- `docs/PHONE_NUMBER_LIFECYCLE_PRODUCT_PLAN.md` — lifecycle/reminder/technical scope; its older evidence ordering is superseded by the Phone Radar method above.
- `docs/PHONE_VERIFICATION_CONTINUITY_VALIDATION.md` — verification-continuity evidence matrix.
- `docs/AUTHORITY_AND_AI_DISCOVERY.md` — outreach/referral/authority/AI-citation ledger.
- `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md` — ordered AIR work/provider tests.
- `docs/RELAY_RISK_METHODOLOGY.md` — fixed Relay methodology.
- `docs/HANDOFF_2026-09-17_PHONE_RADAR.md` — this session's detailed transition note; subordinate to newer canonical facts.

## Handoff rule

At the beginning of a new working session, read GitHub `main` in this order: `AGENTS.md` → this file's **Current progress checkpoint** → `docs/MASTER_PLAN.md` → `docs/OPERATING_WORKFLOW.md` → `docs/CURRENT_EXECUTION_QUEUE.md`. Then read only the task-specific documents required by the next action.

GitHub `main` plus verified live production is the final source of truth. Do not use chat memory to override it.
