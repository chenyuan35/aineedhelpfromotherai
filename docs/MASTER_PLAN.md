# Master Plan — Traffic Utility Site

Last updated: 2026-09-18

This is the project-wide progress board. `PROJECT_CONTEXT.md` answers what is true now; this file answers where the project is going and what comes next. `docs/OPERATING_WORKFLOW.md` defines execution.

## North-star goal

Build `aineedhelpfromotherai.com` into a low-cost utility site that earns small, stable AdSense revenue from organic traffic. First practical target: about RMB 100/month, then scale only what proves demand.

## Phase board

| Phase | Goal | Status | Evidence / current state | Exit gate |
|---|---|---|---|---|
| P0 Foundation | Stable static site, safe deploy flow, durable handoff | DONE | GitHub→Vercel, CI/Eval Gate, durable fact sources and safe release flow are established. | Completed |
| P1 Initial tool inventory | Useful low-cost starter portfolio | DONE | Existing tool cohort is live; Phone canonical released Sep 16. | Completed |
| P2 Discovery & indexing | Make the current cohort discoverable/indexed | IN PROGRESS | GSC connected; indexing still immature and Phone data has not settled through release day. | Current cohort begins receiving settled impressions and indexing continues. |
| P3 First search signals | Identify pages/queries Google is testing | WAITING ON SETTLED DATA | Phone `settledThrough` rechecked on Sep 18 and remains 2026-09-15. | Several current tool-page query/impression signals exist. |
| P4 Winner optimization | Improve pages already earning impressions | PILOT | Cursor is the first CTR/depth pilot. | Clear improvement or stop decision. |
| P5 Focused product depth | Build depth inside frozen product scope | **ACTIVE — PHONE FRONTEND REVIEW BLOCKED AFTER FIRST VISUAL FIX** | Draft PR #130 implements the bounded Phone visual-hierarchy repair. Initial head `baf5f333` passed Eval Gate #510 and received a successful Vercel Preview; a real desktop dark screenshot then exposed that the global dark button rule flattened selected/unselected family-selector states. The same PR fixes that on current head `199bcca`, adds regression assertions, and passes Eval Gate #514. A fresh Vercel Preview for the fixed head is currently blocked by provider `build-rate-limit`, so desktop/mobile visual acceptance is still open. Q-013D4 route admission remains secondary. | Existing Phone canonical reaches explicit desktop/mobile visual acceptance on the fixed head before merge; then route depth can resume in small evidence-backed batches. |
| P6 Distribution, authority & AI discovery | Earn relevant discovery/referral/citations | ACTIVE PILOT | Small outreach/social experiments are measuring; AIR blockers remain explicit. | At least one repeatable relevant referral/link/citation source plus measurable visibility. |
| P7 Monetization | Turn useful traffic into stable AdSense revenue | QUEUED | Monetization optimization waits for meaningful traffic. | First RMB 100/month, then optimize without harming UX. |

## Current sprint — Phone Radar frontend closure

1. **DONE — Product reset root correction.** The questionnaire/research-manual direction is rejected.
2. **DONE — Product structure.** Phone Radar has three route families: Long-term SMS/OTP, Data SIM/eSIM, Temporary SMS.
3. **DONE — Experience structure.** Visual dashboard / small shortlist by default; detailed operational guide only when requested.
4. **DONE — Global research direction.** Country is a filter/tag, not a research sequence.
5. **DONE — Source-role correction.** Community/user outcomes drive operational reality. Operator/provider pages serve current price/package/promotion/stock/purchase metadata only by default.
6. **DONE — Q-014D v1 outcome/decision model.** `radar-view.json` holds the small frontstage decision layer; existing research/intelligence stays backstage.
7. **DONE — Q-014E v1 data reclassification.** Frontstage decision labels are separated from backstage research detail; the public flow no longer depends on documentation-first `unknown` gating.
8. **DONE — Q-014G implementation.** PR #115 replaced questionnaire gating with the three-family visual dashboard and full-guide interaction on the existing canonical.
9. **SUPERSEDED — Q-014H technical closure.** The earlier pass verified the route-first flow, responsive breakpoints, analytics, canonical/data health and the `phone_show_more` event, but it did not verify the computed visual system deeply enough. It is no longer sufficient evidence of product/visual closure.
10. **DONE — Q-014I visual closure audit.** Direct user feedback that the page still feels messy was treated as a concrete defect signal. Audit found undefined Phone CSS tokens (`--border / --surface / --text` against production `--line / --panel / --ink`), inherited global `button` top margins, marketing-scale hero sizing, too much pre-list chrome/equal-weight card density, and a Full guide that opens after the route list rather than beside the selected card. See `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md`.
11. **IN REVIEW / BLOCKED AFTER FIRST VISUAL FIX — Q-014J bounded Phone shell repair.** Draft PR #130 current head `199bcca` fixes the audited shell defects without adding routes/features. It uses production CSS tokens, owns Phone button spacing, compresses the hero, presents three visual user-job selectors, reduces route cards to three primary metrics plus status/metadata, uses conditional warnings, and keeps Full guide inline with the selected route. Initial Preview review of head `baf5f333` proved the first route appears within the first desktop viewport and the card hierarchy is clearer, but also caught that all dark-mode family selectors looked similarly light because a global dark button rule overrode the active state. The same branch now adds Phone-specific dark overrides and regression assertions. Eval Gate #514 passes on current head `199bcca`. **Do not merge yet:** the fresh Vercel Preview is blocked by `build-rate-limit`, so desktop/mobile/light/dark visual acceptance of the fixed head remains outstanding.
12. **WAITING — Q-003 Phone measurement.** Trigger when GSC `settledThrough >= 2026-09-16`. Sep 18 recheck still returns `2026-09-15`. Q-003 informs later growth/route decisions but does not block reviewing/fixing a known UI defect.
13. **DONE — Q-013R first post-reset expansion batch.** PR #120 added one route only: A1 Croatia prepaid eSIM. It remains outside the default shortlist. Current online top-up minimum is `€5`; reported 450/362-day retention timing is explicitly community-derived and route stability is `Watch`.
14. **DONE — Q-013G first gap check.** Long-term is now the deepest family; Data remains the shallowest with two concrete public routes plus a generic fallback.
15. **DONE — Q-013D2 Stellar Data validation / HOLD.** Stellar China 100GB / 60 days remains HOLD because the selected network/egress variant is not reproduced consistently at fulfillment.
16. **DONE — Q-013D3 CMLink Data validation / ADMISSION-READY.** Exact route: Trip.com Mainland China CMLink eSIM, product ID `71336361`. The current 3–15 day product is live; multiple 2026 first-hand Trip/CMLink reports reproduce mainland-China use. Performance is mixed enough that the route must enter as `Watch`: do not promise reliable 5G, fixed egress, workstation-grade speed, rechargeability, or number/SMS capability.
17. **BLOCKED / SECONDARY — Q-013D4 production admission.** PR #127 implements the validated CMLink route and Eval Gate passed. Its previous Preview attempt was blocked by Vercel `build-rate-limit`; do not retrigger it merely because an older PR #130 head once obtained Preview capacity. Keep it unmerged until Q-014J visual closure is explicitly accepted, then revalidate PR #127 through its own normal Preview path.
18. **MEASURING — Cursor/homepage/reset distribution.** No premature churn.
19. **AUTHORITY — Sep 20 recheck.** Review original Gmail threads/public links before follow-up/batch 2.
20. **AIR — blockers remain blockers.** Do not pay/bypass/invent results.
21. **Relay — monitor.** Preserve methodology and accumulate real history.
22. **FRONTEND FOUNDATION — infrastructure only.** Astro 7 + Tailwind 4 foundation and Tool Registry are in `main`, but the current production build remains unchanged. Any real cutover is a separate parity/analytics/rollback task, not a reason to redesign the current product shells.

## Phone Radar product contract

Canonical remains `/tools/phone-number-survival-guide/`.

### Visual dashboard

Show the three families immediately and real options without a questionnaire.

Long-term SMS/OTP: recent SMS/OTP signal, yearly keep-alive cost, setup effort, remote practicality, stability/continuity.

Data SIM/eSIM: current data price/value, allowance/validity, coverage, setup friction, reuse/recharge, whether a real number is included.

Temporary SMS: recent success signal, current price, country/service coverage, private/shared/reused state, privacy/reuse risk, availability.

Default to a small useful shortlist, not a wall of equal-weight choices. The current visual repair may change where a required field is displayed — metric grid, identity/status chip, secondary metadata, or guide — as long as decision-critical information remains obvious and the page becomes easier to scan.

### Full guide

On user request only: what to buy/use, current price, prerequisites, exact steps, SMS/OTP or data use, keep/recharge/renew, main pitfall, recovery/reissue, a few useful tutorial/community links, acquisition link.

The guide must remain attached to the selected route context; it should not behave like a separate long article appended after the whole shortlist.

### Decision-cost rule

Every visible element must help choose or act. Methodology, reconciliation notes, source classes and long evidence prose remain backstage.

A known visual defect outranks route expansion. Passing data/CI checks is not sufficient evidence that the dashboard is visually finished.

### Release boundaries

The current v1 deliberately does not provide:

- fabricated OTP success percentages;
- a Phone 0–100 risk score;
- country/provider doorway pages;
- a temporary-SMS marketplace/backend;
- phone/OTP/credential/identity-document collection.

These are not backlog omissions to fill automatically. Any future change requires evidence that it improves the user job without violating the product rules.

## Next-session execution order

The exact atomic checklist is in `docs/CURRENT_EXECUTION_QUEUE.md`. Project-level order is:

1. check Draft PR #130 current head and Vercel state; current code head is `199bcca` and its latest Preview attempt is blocked by `build-rate-limit`;
2. do not push no-op commits, manually redeploy, use alternate accounts/projects or change billing to bypass the provider blocker;
3. when genuine Preview capacity returns, visually inspect the fresh fixed Preview on desktop and mobile, including selected/unselected family contrast, first-route visibility, card hierarchy, conditional warnings and selected-route inline Full guide;
4. verify both light/dark states, family switching, country filter, `Show more`, guide open/close, outbound actions and horizontal overflow;
5. if a concrete defect appears, fix it on PR #130's existing branch and rerun Phone tests/public build/Eval Gate before another visual review;
6. only after a clean real visual review of the fixed head may Q-014J be marked visually accepted and PR #130 considered for merge; production remains unchanged until then;
7. recheck Q-003 when Search Console settles through Sep 16; use it for measurement/growth decisions, not as a reason to skip known UI QA;
8. after Phone visual closure is restored, PR #127 may resume only through its own fresh valid Preview path and no newer evidence invalidates it;
9. keep Cursor/homepage/distribution measuring and perform the Sep 20 authority recheck when due;
10. do not reopen provider research, add another Long-term route, or migrate Phone to Astro during this closure pass.

## Measurement cadence

- Daily: existing Phone watchers continue as lead/event collectors; no automatic product rewrites.
- Every 4 hours: community-demand observer remains bounded; use output as leads only.
- Twice weekly while indexing is immature: GSC indexing/performance review.
- After every Phone release: verify canonical, build, mobile hierarchy, analytics and production behavior.
- Sep 20: authority round-one recheck.
- Monthly after meaningful traffic: clicks, impressions, pages/queries, referrals, repeat behavior and AdSense revenue/RPM.

## Decision rules

- Scope remains three products: Phone Radar primary, Reset Radar secondary, Relay Exit Risk secondary.
- No fourth product surface, second Phone canonical or country/provider/keyword doorway pages.
- Temporary SMS platforms may be compared as external routes; the project does not become a temporary-SMS marketplace/backend.
- Phone operational reality comes from current user/community outcomes.
- Operator/provider pages serve current commercial metadata by default, not operational certification.
- No fake OTP percentage or arbitrary Phone 0–100 risk score.
- Missing data lowers confidence; do not fabricate certainty.
- Search Console evidence outranks speculative keyword ideas after impressions exist.
- Keep social/referral separate from Google organic.
- AI discovery remains non-adversarial; provider quota/auth/cache failures remain provider blockers.
- Do not start route expansion while a concrete Phone shell defect or unresolved visual-review gate remains open.

## Source-of-truth map

| Need | Source |
|---|---|
| Current factual state | `PROJECT_CONTEXT.md` |
| Whole-project stage / priorities | `docs/MASTER_PLAN.md` |
| Atomic work queue | `docs/CURRENT_EXECUTION_QUEUE.md` |
| Frontend foundation | `docs/FRONTEND_FOUNDATION_PLAN_2026-09-18.md` |
| Phone reset | `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md` |
| Phone interaction contract | `docs/PHONE_RADAR_INTERACTION_SPEC_2026-09-18.md` |
| Phone visual closure defects | `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md` |
| Global route-pool seed | `docs/PHONE_RADAR_GLOBAL_ROUTE_POOL_SEED_2026-09-18.md` |
| Phone durable definition | `docs/PHONE_RADAR_PRODUCT_DEFINITION.md` |
| Phone research method | `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` |
| Execution procedure | `docs/OPERATING_WORKFLOW.md` |
| Authority/referral | `docs/AUTHORITY_AND_AI_DISCOVERY.md` + original Gmail threads |
| AI retrieval | `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md` |
| Relay methodology | `docs/RELAY_RISK_METHODOLOGY.md` |
| Code/deployment truth | GitHub `main` + verified production |
| Google performance | GSC Wizard |
| Phone operational reality | current independent community/user outcomes and route history |
| Phone current price/promotions | provider/operator purchase surfaces when useful |

Historical AI-agent/MCP strategy documents are not current planning authority.