# Phone Radar Product Reset — 2026-09-18

Status: **DIRECTION ACCEPTED / IMPLEMENTATION AUTHORIZED**

This document records the Phone Radar correction agreed on 2026-09-18.

## Root correction

The old Phone experience drifted from a tool into a questionnaire + research manual because backstage research fields leaked into the user interface.

The correction is structural:

> **Phone Radar helps a user quickly choose and execute a useful phone route. Research complexity stays backstage.**

The user has authorized continuous implementation of this accepted direction without waiting for item-by-item concept confirmation. Normal project safety gates still apply: fresh branch/worktree, tests, PR, CI/Eval/Vercel Preview, merge and production verification.

## Fixed product structure

Phone Radar has **three route families**:

1. **Long-term SMS / OTP numbers** — durable numbers for verification/account continuity.
2. **Data SIM / eSIM routes** — travel/long-term data connectivity, with number capability shown only when relevant.
3. **Temporary SMS platforms** — short-lived/rented SMS reception routes, clearly separated from durable numbers.

Phone Radar has **two experience layers**:

### Layer A — Visual dashboard

Default view. The user should understand the current choices in seconds without reading an article.

### Layer B — Full guide

Opened only when the user wants to act. It contains purchase/setup/use/keep-alive/recovery steps and a small number of useful current tutorials/links.

## Decision-cost rule

The product is responsible for reducing user decision work.

- Do not force a multi-step questionnaire before showing options.
- Do not show dozens of equal-weight choices by default.
- Show a small current shortlist first.
- Use metrics appropriate to the selected route family.
- Keep caveats to one line unless the user opens the full guide.
- The user may stop after the dashboard if that is enough.

## Source-role rule

### Community/user evidence

Primary source for operational reality:

- setup success/failure;
- SMS/OTP outcomes;
- real overseas/China use;
- hidden support routes;
- keep-alive methods;
- number loss/recovery;
- complaints;
- refunds/restorations;
- support outcomes;
- route degradation;
- current tutorials.

### Operator/provider pages

Use by default only for current commercial metadata:

- listed price;
- package name;
- current promotion/new offer;
- stock/availability when exposed;
- purchase/checkout link;
- advertised top-up/fee.

Provider pages are not an operational verification gate.

## Metrics

### Long-term SMS / OTP

- current SMS/OTP reliability signal;
- yearly keep-alive cost;
- setup effort;
- remote practicality;
- stability;
- continuity/recovery;
- SIM/eSIM when material.

### Data SIM / eSIM

- current package/data cost;
- allowance/validity;
- coverage;
- setup friction;
- reusable/rechargeable state;
- whether a real number is included;
- current deal when materially useful.

### Temporary SMS platforms

- recent success signal;
- current price;
- country/service coverage;
- private/shared/reused-number state;
- reuse/privacy risk;
- current availability.

No fake SMS percentages and no arbitrary 0–100 Phone risk score.

## Full-guide contract

A detail view contains only what the user needs to execute:

1. what to buy/use;
2. where to get it;
3. current price;
4. prerequisites;
5. exact setup/opening steps;
6. how to receive SMS/OTP or use data;
7. how to keep/recharge/renew it;
8. main current failure mode;
9. recovery/reissue path when relevant;
10. one or a few useful current tutorial/video/community links.

Do not turn the guide into a bibliography.

## Implementation state

### DONE

- R-001 — provider-by-provider documentation loop frozen.
- R-002 — user-facing information contract defined.
- R-003 — detail/tutorial contract defined.
- R-006 — community-first research workflow defined.
- R-007 — visual decision model defined and accepted.
- Global route-pool seed created; country is a filter/tag, not the research sequence.

### ACTIVE

- **R-004 — event/outcome data model.** Reuse current data where possible and add only what the new UI needs.
- **R-005 — reclassify existing data.** Separate frontstage decision fields from backstage research fields; remove documentation-driven `unknown` behavior.
- **R-008 — implementation.** Build the three-family visual dashboard + full-guide interaction on the existing canonical.
- **R-009 — validation.** Verify desktop/mobile hierarchy and complete user journeys.

### AFTER RESET

- R-010 — resume broad route expansion. New routes should improve choices, not satisfy country quotas.

## Implementation constraints

- Keep one canonical: `/tools/phone-number-survival-guide/`.
- Use a fresh implementation branch/worktree.
- Remove questionnaire-first gating.
- Do not create country/provider doorway pages.
- Do not bulk-add every candidate route in the same implementation PR.
- Preserve privacy: do not collect phone numbers, OTPs, credentials or identity documents.
- Track family selection, route views, full-guide opens and outbound acquisition actions.

## Acceptance gate

The reset is complete only when a first-time user can:

1. see the three route families immediately;
2. see real route options without answering questions;
3. compare the right metrics at a glance;
4. choose without reading research methodology;
5. open a full guide only when desired;
6. understand the exact next action;
7. complete the route with less time and fewer decisions than generic search results require.

See `docs/PHONE_RADAR_INTERACTION_SPEC_2026-09-18.md` for the implementation contract and `docs/PHONE_RADAR_GLOBAL_ROUTE_POOL_SEED_2026-09-18.md` for the first global breadth seed.
