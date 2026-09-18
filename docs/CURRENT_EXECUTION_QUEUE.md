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
- Q-013R first post-reset route batch: **DONE.** PR #120 added one production route only: A1 Croatia prepaid eSIM. It is `shortlist:false`, so the default five-route Long-term view did not expand. Production `radar-view.json`, `Show 4 more routes` and Croatia filter were verified live.
- Q-013G first three-family gap check: **DONE.** Long-term is now clearly deepest. Data remains shallowest, so the next depth task is Data-family validation rather than another long-term number.
- Global route-pool breadth seed: DONE.
- Frontend foundation: PR #117 MERGED. Astro 7 + Tailwind 4 Tool Registry/components/CI are now reusable infrastructure only; production frontend has not been switched.
- PR #112: CLOSED / NOT MERGED; do not revive.
- PR #114: MERGED. Locked the global Phone Radar product model.
- PR #115: MERGED. Rebuilt the production Phone experience as the three-family route-first dashboard.
- PR #118: MERGED. Closed the Q-014H show-more analytics gap without changing UI, routes, copy or canonical behavior.
- PR #120: MERGED. Added A1 Croatia prepaid eSIM as the first bounded route-depth addition.

## Post-release recap

### What changed

The old flow made users answer questions before seeing routes and exposed too much research/evidence prose. The shipped flow now starts with actual route choices, optional country refinement, compact family-specific metrics, and a `Full guide` action.

The page tracks the accepted user journey:

- **Long-term SMS/OTP:** compare → full guide → buy → activate → test SMS → keep alive/recover.
- **Data SIM/eSIM:** compare → full guide → buy → install → use/recharge.
- **Temporary SMS:** compare → full guide → use → discard; never presented as durable recovery.

### Current public route pool

Long-term concrete routes include giffgaff, Lebara UK, Tello, Ultra PayGo, H2O PayGo, **A1 Croatia prepaid eSIM**, Mobal Japan Voice+Data, Sakura Japan Voice+Data and a generic mainland-China official-carrier route.

A1 Croatia is intentionally outside the default shortlist. Current A1 online top-up minimum is `€5`; its reported 450-day initial / ~362-day later retention timing remains community-derived, not an official guarantee. Stability is `Watch` and expiry recovery remains unverified.

Data currently has Airalo plus Mobal Japan tourist physical data SIM, with a generic destination-local fallback kept out of the default shortlist.

Temporary SMS currently has SMSPool, 5SIM and ActivateX.

### Current lead disposition

- **Kaktus Czech:** HOLD. Current community path relies on support-assisted roaming activation with outcomes ranging from hours/days to months/refund; do not publish as a stable remote route yet.
- **ClubSIM Hong Kong:** HOLD. The older cheap keep-alive path changed; research the current route from scratch before admission.
- **RedPocket US:** DEPRIORITIZED for now. Another US long-term route does not solve the current breadth gap.
- **AIS support-assisted retention:** HOLD until starting state and reproducibility are clear.
- **StellarSecurity / CMLink Data:** FRESH LEADS from Sep 18 community evidence. Validate exact provider/product/current package and real operating behavior before production admission.

### What the release intentionally does not claim

- no fabricated OTP success percentage;
- no arbitrary Phone 0–100 risk score;
- no provider-country doorway pages;
- no temporary-SMS marketplace/backend;
- no user phone number, OTP, credential or ID-document collection;
- no claim that provider documentation proves real-world OTP/overseas behavior.

### Current gaps that are not reasons to redesign

- GSC Sep 18 recheck still settles only through `2026-09-15`; Sep 16 Phone release data is not settled yet.
- GA4 event code covers family selection, filter change, show-more, guide open and outbound click, but actual post-release event traffic is not yet a meaningful behavior sample.
- Data is now the clearest route-depth gap.
- Temporary SMS has qualitative current-state signals, not statistically valid success percentages.
- `radar-view.json` is deliberately small; outcome/event history remains backstage and should only be promoted when it changes a choice or action.

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
- If it is still `< 2026-09-16`: do not interpret zeroes as failure; proceed to the Data-family validation task below.

Latest check on 2026-09-18 still returns `settledThrough=2026-09-15`.

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
8. analytics cover `phone_family_select`, `phone_filter_change`, `phone_show_more`, `phone_guide_open` and `phone_outbound_click`;
9. canonical/indexability/sitemap/data-file public-release tests pass.

PR #118 fixed only the verified show-more analytics defect. Do not reopen Q-014 without a new concrete defect or settled behavior evidence.

### Q-013R1 — FIRST ROUTE-DEPTH BATCH CLOSED

Status: **DONE 2026-09-18.**

PR #120 admitted exactly one route: **A1 Croatia prepaid eSIM**.

Admission facts:

- recent detailed community workflow reproduced remote eSIM purchase/activation and mainland-China roaming SMS behavior;
- current A1 pages were used only for commercial metadata and confirmed the prepaid order/top-up/roaming surfaces are live;
- current visible online top-up minimum is `€5`, so the older community `€2` figure was not published as current cost;
- 450-day initial / ~362-day later validity remains explicitly community-derived;
- stability is `Watch` and same-number recovery after expiry remains unverified;
- `shortlist:false` preserves the default five-route Long-term first view.

### Q-013G — GAP CHECK CLOSED

Status: **DONE after Q-013R1.**

Current breadth by user job:

- **Long-term:** deepest family; now spans UK, US, Croatia, Japan and mainland-China route classes. Do not keep stacking similar long-term routes by country.
- **Data:** only two concrete public routes (Airalo and Mobal Japan tourist physical data SIM) plus one generic fallback. This is the current depth gap.
- **Temporary SMS:** three platforms; outcome volume still does not justify a numeric success rate.

Conclusion: the next route-depth batch should target **Data**, not another Long-term route.

### Q-013D2 — NEXT ELIGIBLE DATA ROUTE VALIDATION if Q-003 is still waiting

Validate **at most one** concrete Data route before any production change.

Fresh Sep 18 lead set:

- **StellarSecurity** — very recent NodeSeek first-hand report says its 100GB / ~€13.4 / 60-day product performed similarly to the author's local monthly SIM. Exact provider identity, purchase URL, coverage, install flow, reuse/recharge state and current package must be verified before admission.
- **CMLink data route** — same author reports personal use with Singapore + Hong Kong IP and suggests it for light/long-duration or burst AI traffic. Separate official and third-party packages; do not publish third-party annual pricing as official commercial truth.

Rules:

- first-hand operation beats price tables;
- price-only aggregations create leads, not production routes;
- provider page supplies current price/package/coverage/purchase metadata only;
- require an exact executable product, not a vague provider family;
- capture current cost, allowance/validity, coverage, setup, reuse/recharge, number/SMS capability and meaningful real-world speed/throttling notes;
- stop after one route reaches admission quality; otherwise record HOLD and do not manufacture a release.

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
- add another long-term number merely to make geography look broader;
- create a second Phone canonical or provider/country doorway pages;
- turn temporary SMS comparison into a marketplace/backend;
- invent OTP percentages, risk scores or fake confidence numbers;
- treat operator marketing pages as proof of real-world OTP, roaming, support recovery or long-term reliability;
- publish a Data route from a price table without first-hand operational evidence;
- switch the whole site to Astro in one migration;
- touch DNS, AdSense, billing, paid services or critical account settings without explicit approval.

## Anti-scope guard

Scope remains three product surfaces: Phone Radar primary; AI Reset Radar and Relay Exit Risk secondary. No fourth product surface.

## Execution rule

The next session should not spend time rediscovering what happened. Check the Q-003 trigger first. If it has not fired, validate at most one concrete Data route. Production admission requires sufficient current operational evidence; a HOLD is a valid result.