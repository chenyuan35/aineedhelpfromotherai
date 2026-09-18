# Current Execution Queue

Last updated: 2026-09-18

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict.

## Current decision

Phone Radar v1 has shipped and Q-014 production closure is complete on the existing canonical:

`/tools/phone-number-survival-guide/`

The accepted product model remains:

- **three route families:** long-term SMS/OTP numbers, data SIM/eSIM routes, temporary SMS platforms;
- **two experience layers:** visual decision dashboard first, full operational guide on demand;
- **no questionnaire before routes;**
- **research complexity stays backstage.**

Do not restart the rejected questionnaire/research-manual direction. Do not redesign the shipped dashboard merely because more ideas exist. Use settled behavior data when available, otherwise deepen the route pool in bounded evidence-backed batches.

## Just completed

- Q-001 Phone verification-continuity validation: DONE / NARROW inside Phone only.
- Q-002 Cursor CTR pilot: SHIPPED / MEASURING.
- Q-005 first Sep 18 authority check: DONE / no response; recheck Sep 20.
- Q-009 homepage positioning: SHIPPED / MEASURING.
- Q-011 historical cleanup: DONE.
- Q-012 task-list-first + Notion journal workflow: DONE.
- Q-013 Phone research-method correction: DONE.
- Q-014A product root correction: DONE.
- Q-014B user-facing contract: DONE.
- Q-014C detail/tutorial contract: DONE.
- Q-014D frontstage outcome/decision model: DONE for v1.
- Q-014E frontstage/backstage data separation: DONE for v1.
- Q-014F visual decision model: DONE / accepted.
- Q-014G visual dashboard + full-guide implementation: DONE.
- Q-014H production closure QA: **DONE.** The only verified defect was missing Phone-specific `Show more` tracking; PR #118 added `phone_show_more`. Public Phone build audit, Eval Gate, Vercel deployment and production canonical load all passed.
- Global route-pool breadth seed: DONE.
- Frontend foundation: PR #117 MERGED. Astro 7 + Tailwind 4 Tool Registry/components/CI are now reusable infrastructure only; production frontend has not been switched.
- PR #112: CLOSED / NOT MERGED; do not revive.
- PR #114: MERGED. Locked the global Phone Radar product model.
- PR #115: MERGED. Rebuilt the production Phone experience as the three-family route-first dashboard.
- PR #118: MERGED. Closed the Q-014H show-more analytics gap without changing UI, routes, copy or canonical behavior.

## Post-release recap

### What changed

The old flow made users answer questions before seeing routes and exposed too much research/evidence prose. The shipped flow now starts with actual route choices, optional country refinement, compact family-specific metrics, and a `Full guide` action.

The page tracks the accepted user journey:

- **Long-term SMS/OTP:** compare → full guide → buy → activate → test SMS → keep alive/recover.
- **Data SIM/eSIM:** compare → full guide → buy → install → use/recharge.
- **Temporary SMS:** compare → full guide → use → discard; never presented as durable recovery.

### What is already in the v1 route pool

Long-term concrete routes currently include giffgaff, Lebara UK, Tello, Ultra PayGo, H2O PayGo, Mobal Japan Voice+Data, Sakura Japan Voice+Data and a generic mainland-China official-carrier route.

Data currently has Airalo plus Mobal Japan tourist physical data SIM, with a generic destination-local fallback kept out of the default shortlist.

Temporary SMS currently has SMSPool, 5SIM and ActivateX.

### What the release intentionally does not claim

- no fabricated OTP success percentage;
- no arbitrary Phone 0–100 risk score;
- no provider-country doorway pages;
- no temporary-SMS marketplace/backend;
- no user phone number, OTP, credential or ID-document collection;
- no claim that provider documentation proves real-world OTP/overseas behavior.

### Current gaps that are not reasons to redesign

- GSC has not yet settled through the Sep 16 Phone release; last verified `settledThrough` is Sep 15.
- GA4 event code now covers family selection, filter change, show-more, guide open and outbound click, but actual post-release event traffic is not yet a meaningful behavior sample.
- The Data family is still shallow compared with the Long-term family.
- Temporary SMS has qualitative current-state signals, not statistically valid success percentages.
- `radar-view.json` is a deliberately small frontstage decision layer; outcome/event history remains backstage and should only be promoted when it changes a choice or action.

## NEXT SESSION — exact execution order

### Q-000 — Resume from facts, not chat memory

Read in order:

1. `AGENTS.md`
2. `PROJECT_CONTEXT.md` → **Current progress checkpoint**
3. `docs/MASTER_PLAN.md`
4. `docs/OPERATING_WORKFLOW.md`
5. this queue

Then read Phone-specific docs only if the next action requires them.

### Q-003 trigger check — FIRST conditional gate

Check GSC Wizard `settledThrough` for the Phone canonical.

- If `settledThrough >= 2026-09-16`: execute Q-003 before another Phone production expansion.
- If it is still `< 2026-09-16`: do not interpret zeroes as failure; proceed to Q-013R.

Q-003 must inspect:

- indexing state;
- Phone queries/impressions/clicks/CTR/position;
- GA4 landing-page behavior when available;
- new Phone interaction events if enough data exists.

Use those results to improve the accepted dashboard only when the data justifies a change. Never use Q-003 to restore the old questionnaire.

### Q-014H — CLOSED

Status: **DONE 2026-09-18.**

Closure evidence:

1. production first screen exposes all three families and real routes without user input;
2. default Long-term shortlist is compact and `Show more` is secondary;
3. country is a refining filter, not a gate;
4. all three families have route-specific full-guide logic and family-appropriate metrics;
5. guide content covers acquisition/setup/use/keep-or-expiry/recovery rather than evidence walls;
6. cards/guides expose current purchase/platform actions where available;
7. responsive rules collapse desktop cards to stacked layouts and two-column mobile metrics without a known horizontal-overflow defect;
8. analytics now cover `phone_family_select`, `phone_filter_change`, `phone_show_more`, `phone_guide_open` and `phone_outbound_click`;
9. canonical/indexability/sitemap/data-file public-release tests pass.

PR #118 fixed only the verified show-more analytics defect. Do not reopen Q-014 without a new concrete defect or settled behavior evidence.

### Q-013R — NEXT PRODUCT-DEPTH TASK if Q-003 is still waiting

Use `docs/PHONE_RADAR_GLOBAL_ROUTE_POOL_SEED_2026-09-18.md` and `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md`.

Rules for the first post-reset expansion batch:

- choose **1–2 production routes total**, not a country-completion batch;
- pick by user value, recency, uniqueness and reproducibility;
- community/current-user outcomes are the operational source;
- provider pages are used by default only for current price/package/promotion/stock/purchase metadata;
- extract only the family-specific decision fields that change choice/action;
- include a useful practical guide path, not a source dump;
- stop when further research would not change the shortlist, warning or next action.

Concrete leads to consider first, without treating any as pre-approved production truth:

- **Kaktus Czech eSIM / low-cost retention route** from the user-supplied current community report — classify and check fresh independent reproduction because it is cheap and materially different from the current pool;
- **ClubSIM Hong Kong** — high-value cross-border long-term lead from the global seed;
- **A1 Croatia prepaid eSIM** — low-cost retention lead from community tutorials;
- **RedPocket US** — existing candidate; only include if current real-user acquisition/overseas behavior makes it meaningfully different from Tello/Ultra/H2O.

AIS support-assisted retention remains HOLD until the starting product/account state and reproducibility are clear enough for a user to execute safely.

### Q-013G — Gap check across the three families

Before choosing the second expansion batch, compare breadth by user job, not route count:

- Long-term is currently deepest but geographically concentrated in UK/US/Japan/China.
- Data has only two concrete routes in the public model and is the weakest family by route depth.
- Temporary SMS has three platforms but lacks enough outcome volume for a real success percentage.

Use this gap check to decide the next batch. Do not add routes just to make each country or family look equally full.

### Frontend foundation — HOLD from production cutover

The reusable Astro foundation is in `main`, but the actual production frontend remains the legacy static build. Do not migrate homepage, Phone or Relay merely because the foundation exists.

The first future production migration candidate is `/tools/`, and only after a separate bounded task verifies:

- visual/content parity or an explicitly accepted improvement;
- analytics-event mapping;
- canonical/SEO parity;
- Vercel preview path for the Astro output;
- rollback to the current checked-in static page.

## Q-003 — First real Phone post-release measurement

Status: **WAITING ON DATA**

Trigger: `settledThrough >= 2026-09-16`.

Last verified on 2026-09-18: `settledThrough=2026-09-15`.

## Q-005 — Authority

Status: **RECHECK 2026-09-20**

No resend before then. When date >= Sep 20, read the original Gmail threads plus `docs/AUTHORITY_AND_AI_DISCOVERY.md` before any follow-up.

## Q-004 / Q-010 / Q-006 / Q-007 / Q-008

- Cursor CTR: MEASURING.
- Distribution: MEASURING; keep referral/social separate from organic.
- Index/Phone observers: EVENT-DRIVEN.
- AI retrieval blockers: HOLD/BLOCKED; follow AIR docs, do not bypass.
- Relay Exit Risk: secondary product; preserve methodology and accumulate real history.

## Do not do next session

Do not:

- revive PR #112 or the questionnaire/manual UI;
- redesign Phone again before data or a concrete defect justifies it;
- start another provider-by-provider official-document audit;
- add ten countries or dozens of routes in one sweep;
- create a second Phone canonical or provider/country doorway pages;
- turn temporary SMS comparison into a marketplace/backend;
- invent OTP percentages, risk scores or fake confidence numbers;
- treat operator marketing pages as proof of real-world OTP, roaming, support recovery or long-term reliability;
- switch the whole site to Astro in one migration;
- touch DNS, AdSense, billing, paid services or critical account settings without explicit approval.

## Anti-scope guard

Scope remains three product surfaces: Phone Radar primary; AI Reset Radar and Relay Exit Risk secondary. No fourth product surface.

## Execution rule

The next session should not spend time rediscovering what happened. Check the Q-003 trigger first. If it has not fired, execute one bounded Q-013R route-depth batch. Stop only for a documented wait gate, irreversible/high-impact choice, safety issue, account/billing/DNS change, or lack of an eligible task.