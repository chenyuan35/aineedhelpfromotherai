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
| P5 Focused product depth | Build depth inside frozen product scope | **ACTIVE — PHONE RADAR LIVE** | Q-014 is closed. PR #120 shipped the first bounded post-reset depth addition, A1 Croatia, without enlarging the default five-route shortlist. Q-013G now identifies Data as the shallowest family. | Phone gets settled behavior data and route breadth expands in small evidence-backed batches without scope creep. |
| P6 Distribution, authority & AI discovery | Earn relevant discovery/referral/citations | ACTIVE PILOT | Small outreach/social experiments are measuring; AIR blockers remain explicit. | At least one repeatable relevant referral/link/citation source plus measurable visibility. |
| P7 Monetization | Turn useful traffic into stable AdSense revenue | QUEUED | Monetization optimization waits for meaningful traffic. | First RMB 100/month, then optimize without harming UX. |

## Current sprint — Phone Radar measured depth

1. **DONE — Product reset root correction.** The questionnaire/research-manual direction is rejected.
2. **DONE — Product structure.** Phone Radar has three route families: Long-term SMS/OTP, Data SIM/eSIM, Temporary SMS.
3. **DONE — Experience structure.** Visual dashboard / small shortlist by default; detailed operational guide only when requested.
4. **DONE — Global research direction.** Country is a filter/tag, not a research sequence.
5. **DONE — Source-role correction.** Community/user outcomes drive operational reality. Operator/provider pages serve current price/package/promotion/stock/purchase metadata only by default.
6. **DONE — Q-014D v1 outcome/decision model.** `radar-view.json` holds the small frontstage decision layer; existing research/intelligence stays backstage.
7. **DONE — Q-014E v1 data reclassification.** Frontstage decision labels are separated from backstage research detail; the public flow no longer depends on documentation-first `unknown` gating.
8. **DONE — Q-014G implementation.** PR #115 replaced questionnaire gating with the three-family visual dashboard and full-guide interaction on the existing canonical.
9. **DONE — Q-014H production closure.** The bounded production QA verified the three-family first screen, compact shortlist, country refinement, full-guide/action model, responsive mobile rules, canonical/data health and analytics. The only verified gap was missing Phone-specific `Show more` tracking; PR #118 added `phone_show_more`, and the public release audit, Eval Gate and Vercel deployment passed.
10. **WAITING — Q-003 Phone measurement.** Trigger when GSC `settledThrough >= 2026-09-16`. Sep 18 recheck still returns `2026-09-15`.
11. **DONE — Q-013R first post-reset expansion batch.** PR #120 added one route only: A1 Croatia prepaid eSIM. It remains outside the default shortlist. Current online top-up minimum is `€5`; reported 450/362-day retention timing is explicitly community-derived and route stability is `Watch`. Kaktus is HOLD because remote activation is support-dependent; ClubSIM is HOLD because the old cheap keep-alive path changed; RedPocket is deprioritized because another US long-term route would not address the current breadth gap.
12. **DONE — Q-013G first gap check.** Long-term is now the deepest family; Data remains the shallowest with two concrete public routes plus a generic fallback. The next eligible depth batch should validate one concrete Data SIM/eSIM route, not add another long-term number merely for breadth.
13. **NEXT IF Q-003 IS STILL WAITING — Data route validation.** Fresh Sep 18 community evidence makes StellarSecurity and CMLink useful leads, but they remain leads until exact provider/product identity, current package, setup/reuse behavior and first-hand outcomes are verified. Admit at most one route in the next batch.
14. **MEASURING — Cursor/homepage/reset distribution.** No premature churn.
15. **AUTHORITY — Sep 20 recheck.** Review original Gmail threads/public links before follow-up/batch 2.
16. **AIR — blockers remain blockers.** Do not pay/bypass/invent results.
17. **Relay — monitor.** Preserve methodology and accumulate real history.
18. **FRONTEND FOUNDATION — infrastructure only.** Astro 7 + Tailwind 4 foundation and Tool Registry are in `main`, but the current production build remains unchanged. Any real cutover is a separate parity/analytics/rollback task, not a reason to redesign the current product shells.

## Phone Radar shipped contract

Canonical remains `/tools/phone-number-survival-guide/`.

### Visual dashboard

Show the three families immediately and real options without a questionnaire.

Long-term SMS/OTP: recent SMS/OTP signal, yearly keep-alive cost, setup effort, remote practicality, stability/continuity.

Data SIM/eSIM: current data price/value, allowance/validity, coverage, setup friction, reuse/recharge, whether a real number is included.

Temporary SMS: recent success signal, current price, country/service coverage, private/shared/reused state, privacy/reuse risk, availability.

Default to a small useful shortlist, not a wall of equal-weight choices.

### Full guide

On user request only: what to buy/use, current price, prerequisites, exact steps, SMS/OTP or data use, keep/recharge/renew, main pitfall, recovery/reissue, a few useful tutorial/community links, acquisition link.

### Decision-cost rule

Every visible element must help choose or act. Methodology, reconciliation notes, source classes and long evidence prose remain backstage.

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

1. check the GSC Phone `settledThrough` trigger;
2. if Sep 16+ is settled, execute Q-003 first;
3. if it is still below Sep 16, continue the already-selected Data-family depth task, validating at most one route;
4. do not add another Long-term route unless new evidence shows it solves a distinct user job better than the current pool;
5. keep Cursor/homepage/distribution measuring and perform the Sep 20 authority recheck when due;
6. do not reopen Q-014 or redesign the shipped Phone shell without a concrete new defect or settled behavior evidence.

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
- Do not redesign a shipped product shell when the next useful action is measurement or route depth.

## Source-of-truth map

| Need | Source |
|---|---|
| Current factual state | `PROJECT_CONTEXT.md` |
| Whole-project stage / priorities | `docs/MASTER_PLAN.md` |
| Atomic work queue | `docs/CURRENT_EXECUTION_QUEUE.md` |
| Frontend foundation | `docs/FRONTEND_FOUNDATION_PLAN_2026-09-18.md` |
| Phone reset | `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md` |
| Phone interaction contract | `docs/PHONE_RADAR_INTERACTION_SPEC_2026-09-18.md` |
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