# Master Plan — Traffic Utility Site

Last updated: 2026-09-22

This is the project-wide progress board. `PROJECT_CONTEXT.md` answers what is true now; this file answers where the project is going and what comes next. `docs/OPERATING_WORKFLOW.md` defines execution.

## North-star goal

Build `aineedhelpfromotherai.com` into a low-cost utility site that earns small, stable AdSense revenue from organic traffic. First practical target: about RMB 100/month, then scale only what proves demand.

## Phase board

| Phase | Goal | Status | Evidence / current state | Exit gate |
|---|---|---|---|---|
| P0 Foundation | Stable static site, safe deploy flow, durable handoff | DONE | GitHub→Vercel, CI/Eval Gate, durable fact sources and safe release flow are established. | Completed |
| P1 Initial tool inventory | Useful low-cost starter portfolio | DONE | Existing tool cohort is live; Phone canonical released Sep 16. | Completed |
| P2 Discovery & indexing | Make the current cohort discoverable/indexed | IN PROGRESS | GSC connected; Phone canonical is now submitted/indexed and settled data reaches the Sep 16 release day, but exposure remains 0 impressions / 0 clicks in the current sample. | Current cohort begins receiving settled impressions and indexing continues. |
| P3 First search signals | Identify pages/queries Google is testing | WAITING ON EXPOSURE | Phone `settledThrough=2026-09-16`; release-day sample is 0 impressions / 0 clicks, so there is still no meaningful Phone demand sample. | Several current tool-page query/impression signals exist. |
| P4 Winner optimization | Improve pages already earning impressions | PILOT | Cursor is the first CTR/depth pilot. | Clear improvement or stop decision. |
| P5 Focused product depth | Build depth inside frozen product scope | **ACTIVE — M-04R DONE / M-04B AUDIT NEXT** | Phone closure/CMLink admission, the full M-02 Reset program, M-03 Relay visual closure and M-04R numerical/date repair are production-verified. M-04R PR #180 passed Eval Gate #635, genuine Preview and independent apex QA. | Audit Image Resizer/Compressor next; Q-015 quota/pool implementation remains measurement-gated. |
| P6 Distribution, authority & AI discovery | Earn relevant discovery/referral/citations | ACTIVE PILOT | Small outreach/social experiments are measuring; AIR blockers remain explicit. | At least one repeatable relevant referral/link/citation source plus measurable visibility. |
| P7 Monetization | Turn useful traffic into stable AdSense revenue | QUEUED | Monetization optimization waits for meaningful traffic. | First RMB 100/month, then optimize without harming UX. |

## Current sprint — Maintenance / visual closure

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
11. **DONE — Q-014J bounded Phone shell repair.** Final head `dc8d147` passed Eval Gate #567 and real Vercel Preview QA. Desktop/mobile × light/dark verified one selected family, first-route visibility, three-metric cards, Croatia non-shortlist filtering, Show more, inline Full guide and no horizontal overflow. PR #130 squash-merged as `5ccd50b4c293a963274622b8a14a3987cbab14d8`; apex production verification repeated the core checks successfully.
12. **DONE FOR CURRENT SAMPLE / KEEP — Q-003 Phone measurement.** Sep 19 GSC reached `settledThrough=2026-09-16`; Phone Sep 16 recorded 0 impressions / 0 clicks and indexing is `Submitted and indexed / PASS`. This remains an insufficient demand sample, so do not expand routes/pages or churn positioning from zero exposure.
13. **DONE — Q-013R first post-reset expansion batch.** PR #120 added one route only: A1 Croatia prepaid eSIM. It remains outside the default shortlist. Current online top-up minimum is `€5`; reported 450/362-day retention timing is explicitly community-derived and route stability is `Watch`.
14. **DONE — Q-013G first three-family gap check.** Long-term is now the deepest family; Data remains the shallowest with two concrete public routes plus a generic fallback.
15. **DONE — Q-013D2 Stellar Data validation / HOLD.** Stellar China 100GB / 60 days remains HOLD because the selected network/egress variant is not reproduced consistently at fulfillment.
16. **DONE — Q-013D3 CMLink Data validation / ADMISSION-READY.** Exact route: Trip.com Mainland China CMLink eSIM, product ID `71336361`. The current 3–15 day product is live; multiple 2026 first-hand Trip/CMLink reports reproduce mainland-China use. Performance is mixed enough that the route must enter as `Watch`: do not promise reliable 5G, fixed egress, workstation-grade speed, rechargeability, or number/SMS capability.
17. **DONE — Q-013D4 production admission.** PR #127 final head `6da8bb43` passed the current Eval Gate and its own fresh Vercel Preview. Desktop/mobile × light/dark Data-family QA passed with CMLink as `Watch`/data-only, Airalo/Mobal intact, filters/guide/overflow clean; squash merge `ebbfe784e7c4a9adc8cd19aa5add104855150bd5` was independently production-verified.
18. **DONE — M-02A Cursor lead-page visual closure.** PR #153 moved the existing tracker/input into the first viewport, demoted Quick answer below the tool, preserved canonical/title/meta, passed desktop/mobile × light/dark + interaction QA, and merged as `67052224cd1ee84d6e595d13f3ac1e8c89e18f02`. Q-015 remains measurement-gated.
19. **DONE — Q-005 authority recheck.** Sep 21 second check found zero replies and zero verified public links/citations across all three round-one contacts. Round one is closed without a resend; a future authority round should prefer a bounded Learn Cursor + explainx.ai batch-2 test.
20. **AIR — blockers remain blockers.** Do not pay/bypass/invent results.
21. **DONE — M-03 Relay visual closure.** Read-only audit reproduced only mobile result displacement and repetitive empty-state density. PR #176 repaired those two defects without changing methodology/API/SEO identity, passed Eval Gate #627 plus genuine Preview desktop/mobile × light/dark QA, squash-merged as `da005c894976b22cf4be013111b0bd1f94a20487`, and passed independent apex QA.
22. **FRONTEND FOUNDATION — infrastructure only.** Astro 7 + Tailwind 4 foundation and Tool Registry are in `main`, but the current production build remains unchanged. Any real cutover is a separate parity/analytics/rollback task, not a reason to redesign the current product shells.
23. **DONE — M-02C Reset release audit.** Fresh current-main build passed; all seven Reset pages passed representative function, H1/canonical, 1440/390/320 light/dark and no-horizontal-overflow checks. See `docs/RESET_RELEASE_AUDIT_2026-09-21.md`.
24. **IN PROGRESS — M-04 Existing utility regression + visual consistency audit.** M-04A numerical/date audit is closed and M-04R is **DONE / PRODUCTION VERIFIED**. PR #180 repaired only Percentage blank handling, Discount blank/>100% bounds, and Age month-end decomposition; added build-time regression checks; passed Eval Gate #635 + genuine Preview; squash-merged as `cdc13b678bf51aae4b1ce702b7c3cba31a4587f2`; and passed independent apex QA. Next: M-04B audit Image Resizer/Compressor only. Evidence: `docs/UTILITY_NUMERICAL_DATE_AUDIT_2026-09-21.md`.

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

The exact atomic checklist is in `docs/CURRENT_EXECUTION_QUEUE.md`. Current order is:

1. execute M-04B Image Resizer/Compressor audit as the next bounded maintenance session;
2. keep Q-005 round one closed; when authority work resumes, use a separate bounded batch-2 session rather than following up the original three contacts automatically;
3. preserve the production-verified Reset layouts unless a reproduced regression appears;
4. keep Cursor title/meta and Q-015 quota work measurement-gated;
5. keep TikTok untouched while external review is pending;
6. keep AIR provider blockers explicit; no paid/bypass workarounds.

## Measurement cadence

- Daily: existing Phone watchers continue as lead/event collectors; no automatic product rewrites.
- Every 4 hours: community-demand observer remains bounded; use output as leads only.
- Twice weekly while indexing is immature: GSC indexing/performance review.
- After every Phone release: verify canonical, build, mobile hierarchy, analytics and production behavior.
- Sep 21: authority round-one recheck completed; no replies or verified links/citations.
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
