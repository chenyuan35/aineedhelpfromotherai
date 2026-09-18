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
| P3 First search signals | Identify pages/queries Google is testing | WAITING ON SETTLED DATA | Phone `settledThrough` last checked at 2026-09-15. | Several current tool-page query/impression signals exist. |
| P4 Winner optimization | Improve pages already earning impressions | PILOT | Cursor is the first CTR/depth pilot. | Clear improvement or stop decision. |
| P5 Focused product depth | Build depth inside frozen product scope | **ACTIVE — PHONE IMPLEMENTATION** | Phone Radar direction reset is accepted: three route families + visual dashboard + full guide. | Production Phone page exposes real choices immediately, minimizes user decision time, and closes the compare→guide→action loop. |
| P6 Distribution, authority & AI discovery | Earn relevant discovery/referral/citations | ACTIVE PILOT | Small outreach/social experiments are measuring; AIR blockers remain explicit. | At least one repeatable relevant referral/link/citation source plus measurable visibility. |
| P7 Monetization | Turn useful traffic into stable AdSense revenue | QUEUED | Monetization optimization waits for meaningful traffic. | First RMB 100/month, then optimize without harming UX. |

## Current sprint — Phone Radar implementation + indexing

1. **DONE — Product reset root correction.** The questionnaire/research-manual direction is rejected.
2. **DONE — Product structure.** Phone Radar has three route families:
   - Long-term SMS / OTP numbers;
   - Data SIM / eSIM;
   - Temporary SMS platforms.
3. **DONE — Experience structure.** Two layers:
   - visual dashboard / small shortlist by default;
   - detailed operational guide only when the user asks for it.
4. **DONE — Global research direction.** Country is a filter/tag, not a research sequence. First global breadth seed spans East Asia, Southeast Asia, Europe, Oceania and North America.
5. **DONE — Source-role correction.** Community/user outcomes drive operational reality. Operator/provider pages are used by default for current price, package, promotion, stock and purchase metadata only.
6. **ACTIVE — Q-014D outcome/event data model.** Reuse current data and add only fields needed to drive dashboard/guide decisions. Avoid carrier-encyclopedia schema growth.
7. **ACTIVE — Q-014E data reclassification.** Separate frontstage decision fields from backstage research fields and retire documentation-first `unknown` logic.
8. **NEXT / AUTHORIZED — Q-014G implementation.** Replace questionnaire gating with the three-family visual dashboard and full-guide interaction on the existing canonical. Continue without item-by-item confirmation.
9. **NEXT — Q-014H validation/closure.** Desktop/mobile hierarchy, full-guide flow, outbound actions, analytics events, build/route checks, Preview/CI, merge and production verification.
10. **WAITING — Q-003 Phone measurement.** Trigger when GSC `settledThrough >= 2026-09-16`; use settled behavior to improve the accepted design, never to restore the old questionnaire.
11. **HOLD — Q-013 broad route expansion.** Resume after reset ships. New routes are selected by user value, not country quotas.
12. **MEASURING — Cursor/homepage/reset distribution.** No premature copy/title/social churn.
13. **AUTHORITY — Sep 20 recheck.** Review original Gmail threads/public links before any follow-up or batch 2.
14. **AIR — blockers remain blockers.** Do not pay/bypass/invent results.
15. **Relay — monitor.** Preserve methodology and accumulate real history.

## Phone Radar implementation contract

Canonical remains:

`/tools/phone-number-survival-guide/`

### First layer: visual dashboard

The user must immediately see the three route families and real route options. No mandatory questionnaire.

Long-term SMS/OTP comparison emphasizes:

- recent SMS/OTP signal;
- yearly keep-alive cost;
- setup effort;
- remote practicality;
- stability/continuity.

Data SIM/eSIM comparison emphasizes:

- current data price/value;
- allowance/validity;
- coverage;
- setup friction;
- reuse/recharge;
- whether a real number is included.

Temporary SMS comparison emphasizes:

- recent success signal;
- current price;
- country/service coverage;
- private/shared/reused state;
- privacy/reuse risk;
- availability.

Default should show a small shortlist, not a wall of equal-weight choices.

### Second layer: full guide

Only after user opens a route:

- what to buy/use;
- current price;
- prerequisites;
- exact setup/opening steps;
- SMS/OTP or data usage steps;
- keep/recharge/renew path;
- main current pitfall;
- recovery/reissue when relevant;
- a small number of useful tutorial/video/community links;
- acquisition/platform link.

### Decision-cost rule

Every visible element must help the user choose or act. Research methodology, reconciliation notes, source classes and long evidence prose remain backstage.

## Measurement cadence

- Daily: existing Phone watchers continue as lead/event collectors; no automatic product rewrites.
- Every 4 hours: community-demand observer remains bounded; use output as leads only.
- Twice weekly while indexing is immature: GSC indexing/performance review.
- After every Phone release: verify canonical, build, mobile hierarchy, analytics and production behavior.
- Sep 20: authority round-one recheck.
- Monthly after meaningful traffic: clicks, impressions, pages/queries, referrals, repeat behavior and AdSense revenue/RPM.

## Decision rules

- Scope remains three products: Phone Radar primary, Reset Radar secondary, Relay Exit Risk secondary.
- No fourth product surface without explicit strategy change.
- No country/provider/keyword doorway pages.
- No second Phone canonical.
- Temporary SMS platforms may be compared as external routes; the project does not become a temporary-SMS marketplace or backend.
- Phone operational reality comes from current user/community outcomes.
- Operator/provider pages serve current commercial metadata by default, not operational certification.
- No fake OTP success percentage.
- No arbitrary Phone 0–100 risk score.
- Missing data lowers confidence; do not fabricate certainty.
- Search Console evidence outranks speculative keyword ideas after impressions exist.
- Keep social/referral separate from Google organic.
- AI discovery remains non-adversarial; provider quota/auth/cache failures remain provider blockers.

## Source-of-truth map

| Need | Source |
|---|---|
| Current factual state | `PROJECT_CONTEXT.md` |
| Whole-project stage / priorities | `docs/MASTER_PLAN.md` |
| Atomic work queue | `docs/CURRENT_EXECUTION_QUEUE.md` |
| Phone reset | `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md` |
| Phone interaction contract | `docs/PHONE_RADAR_INTERACTION_SPEC_2026-09-18.md` |
| Global route-pool seed | `docs/PHONE_RADAR_GLOBAL_ROUTE_POOL_SEED_2026-09-18.md` |
| Phone durable product definition | `docs/PHONE_RADAR_PRODUCT_DEFINITION.md` |
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
