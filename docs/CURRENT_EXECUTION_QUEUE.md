# Current Execution Queue

Last updated: 2026-09-18

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict.

## Current decision

Phone Radar product direction is accepted and implementation is authorized.

The old questionnaire/research-manual model is being replaced by:

- **three route families:** long-term SMS/OTP numbers, data SIM/eSIM routes, temporary SMS platforms;
- **two experience layers:** visual decision dashboard first, full operational guide on demand;
- **one canonical URL:** `/tools/phone-number-survival-guide/`.

The product must reduce user decision time. Research complexity stays backstage.

The user has explicitly authorized continued implementation without waiting for item-by-item confirmation. Normal project safety gates remain mandatory.

## Just completed

- Q-001 Phone verification-continuity validation: DONE / NARROW inside Phone only.
- Q-002 Cursor CTR pilot: SHIPPED / MEASURING.
- Q-005 first Sep 18 authority check: DONE / no response; recheck Sep 20.
- Q-009 homepage positioning: SHIPPED / MEASURING.
- Q-011 historical cleanup: DONE.
- Q-012 task-list-first + Notion journal: DONE.
- Q-013 Phone research-method correction: DONE.
- Q-014A product root correction: DONE.
- Q-014B user-facing contract: DONE.
- Q-014C detail/tutorial contract: DONE.
- Q-014F visual decision model: DONE / accepted.
- Global route-pool breadth seed: DONE.
- PR #112: CLOSED / NOT MERGED; do not revive.

## Current measurement facts

Last checked 2026-09-18:

- GSC `settledThrough`: **2026-09-15**.
- Phone public release: **2026-09-16**.
- Q-003 therefore remains waiting for settled coverage of Sep 16+.
- Early GA4/GSC zeroes are not a product verdict.

## Q-014 — Phone Radar product reset

Status: **ACTIVE IMPLEMENTATION — HIGHEST ELIGIBLE PHONE TASK**

Authoritative docs:

1. `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md`
2. `docs/PHONE_RADAR_INTERACTION_SPEC_2026-09-18.md`
3. `docs/PHONE_RADAR_PRODUCT_DEFINITION.md`
4. `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md`
5. `docs/PHONE_RADAR_GLOBAL_ROUTE_POOL_SEED_2026-09-18.md`

### Q-014D — Outcome/event model

ACTIVE. Add only route-state/outcome fields needed to drive the new visual layer and full guide. Do not create a carrier-encyclopedia schema.

### Q-014E — Reclassify existing data

ACTIVE. Separate frontstage decision data from backstage research data and obsolete documentation-first fields.

Provider pages are used by default for current price/package/promotion/stock/purchase metadata only. Community/user evidence drives operational behavior.

### Q-014G — Implement visual dashboard + full guides

NEXT / AUTHORIZED.

Requirements:

- three top-level families: Long-term SMS/OTP · Data SIM/eSIM · Temporary SMS;
- default layer is a compact visual shortlist/dashboard;
- no questionnaire before results;
- full guide opens only when requested;
- metrics change by family;
- small shortlist first, optional filters/sort second;
- desktop/mobile both prioritize decision speed;
- one canonical; no country/provider doorway pages;
- no fake OTP percentages or arbitrary Phone risk score;
- no sensitive user data collection.

Use fresh implementation branch/worktree → local/build tests → PR → CI/Eval/Vercel Preview → merge → production verify.

### Q-014H — Close the loop

After implementation:

1. verify first screen exposes real routes immediately;
2. verify each family has appropriate metrics;
3. verify full-guide execution flow;
4. verify purchase/outbound actions;
5. verify mobile hierarchy/no overflow;
6. verify analytics events for family, route, guide and outbound action;
7. update `PROJECT_CONTEXT.md`, `MASTER_PLAN.md`, queue and Notion journal;
8. then resume route expansion from the global candidate pool.

## Q-003 — First real Phone post-release measurement

Status: **WAITING ON DATA**

Trigger: `settledThrough >= 2026-09-16`.

When triggered, inspect indexing, queries/impressions/clicks/CTR/position and GA4 behavior. Use it to improve the accepted dashboard model, not restore the old questionnaire.

## Q-013 — Route research

Status: **HOLD AS DEFAULT TASK UNTIL RESET SHIPS**

AIS/RedPocket and other candidates are inputs, not milestones. After reset ships, resume broad global route discovery by user value rather than country sequence.

## Q-005 — Authority

Status: **RECHECK 2026-09-20**

No resend before then.

## Q-004 / Q-010 / Q-006 / Q-007 / Q-008

- Cursor CTR: MEASURING.
- Distribution: MEASURING; keep referral/social separate from organic.
- Index/Phone observers: EVENT-DRIVEN.
- AI retrieval blockers: HOLD/BLOCKED; follow AIR docs, do not bypass.

## Anti-scope guard

Do not create:

- a fourth product surface;
- a second Phone canonical;
- country/provider/keyword doorway pages;
- a temporary-number marketplace/backend;
- account/email/SMS storage backends;
- new workloads on the disposable observer;
- paid dependencies without approval.

Temporary SMS platforms may be compared as external routes inside Phone Radar; the project must not become one.

## Execution rule

Continue Q-014 through implementation and verification without waiting for item-by-item confirmation. Stop only for an irreversible/high-impact choice, account/billing/DNS change, safety issue, or documented external blocker.
