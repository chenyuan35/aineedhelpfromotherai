# Current Execution Queue

Last updated: 2026-09-18

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict.

## Current decision

Phone Radar's accepted product model remains correct on the existing canonical:

`/tools/phone-number-survival-guide/`

The model remains:

- **three route families:** long-term SMS/OTP numbers, data SIM/eSIM routes, temporary SMS platforms;
- **two experience layers:** visual decision dashboard first, full operational guide on demand;
- **no questionnaire before routes;**
- **research complexity stays backstage.**

However, **Phone visual closure is reopened** after direct user feedback that the shipped page is still visually messy. The Sep 18 code/spec audit reproduced concrete shell defects, including undefined Phone CSS tokens, inherited global button spacing, oversized hero hierarchy, equal-weight card density and a Full guide that opens after the route list rather than in the selected route's context.

Do not interpret this as permission for another broad redesign or more routes. The next bounded Phone task is to repair the existing shell only. Route expansion, including PR #127, stays secondary until that repair is visually verified.

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
- Q-014H earlier technical closure: **SUPERSEDED AS VISUAL-CLOSURE EVIDENCE.** It verified flow/data/analytics and fixed `phone_show_more`, but did not catch the current computed-style/hierarchy defects.
- Q-014I Phone visual closure audit: **DONE / REPAIR REQUIRED.** See `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md`.
- Q-013R first post-reset route batch: **DONE.** PR #120 added one production route only: A1 Croatia prepaid eSIM. It is `shortlist:false`, so the default five-route Long-term view did not expand.
- Q-013G first three-family gap check: **DONE.** Long-term is now clearly deepest. Data remains shallowest.
- Q-013D2 Stellar China Data validation: **DONE / HOLD.** The selected network/egress route is not reproducible enough for production admission.
- Q-013D3 Trip.com CMLink Mainland China eSIM validation: **DONE / ADMISSION-READY AS `Watch`.** Exact route is Trip product ID `71336361`.
- Global route-pool breadth seed: DONE.
- Frontend foundation: PR #117 MERGED. Astro 7 + Tailwind 4 Tool Registry/components/CI are reusable infrastructure only; production frontend has not been switched.
- PR #112: CLOSED / NOT MERGED; do not revive.
- PR #114: MERGED. Locked the global Phone Radar product model.
- PR #115: MERGED. Rebuilt the production Phone experience as the three-family route-first dashboard.
- PR #118: MERGED. Added Phone-specific `phone_show_more` analytics.
- PR #120: MERGED. Added A1 Croatia prepaid eSIM as the first bounded route-depth addition.

## Post-release recap

### What changed

The old flow made users answer questions before seeing routes and exposed too much research/evidence prose. The current flow starts with actual route choices, optional country refinement, family-specific metrics, and a `Full guide` action.

The accepted user journeys remain:

- **Long-term SMS/OTP:** compare → full guide → buy → activate → test SMS → keep alive/recover.
- **Data SIM/eSIM:** compare → full guide → buy → install → use/recharge.
- **Temporary SMS:** compare → full guide → use → discard; never presented as durable recovery.

### What is now known to be wrong in the shell

The current implementation does not yet present that model cleanly enough:

- Phone-local CSS references `--border`, `--surface` and `--text`, while production `site.css` defines `--line`, `--panel` and `--ink`; multiple intended borders/background/selected-state declarations therefore do not resolve as designed.
- global `button { margin-top:16px }` leaks into Phone family tabs, card actions, guide close and `Show more` because Phone does not reset it.
- the Phone H1 inherits the generic marketing-scale `h1` clamp instead of a compact dashboard scale.
- hero + family note + country filter + route count delay the first real route more than the accepted interaction spec intended.
- five equal-weight metric cells plus two actions plus a full-width caveat make each card dense, especially on mobile.
- the shared Full guide section sits after the entire route list; opening a top card scrolls the user away from the selected route.
- current tests validate route data/copy/analytics, but do not catch those computed-style and hierarchy failures.

The repair source is `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md`.

### Current public route pool

Long-term concrete routes include giffgaff, Lebara UK, Tello, Ultra PayGo, H2O PayGo, **A1 Croatia prepaid eSIM**, Mobal Japan Voice+Data, Sakura Japan Voice+Data and a generic mainland-China official-carrier route.

A1 Croatia is intentionally outside the default shortlist. Current A1 online top-up minimum is `€5`; its reported 450-day initial / ~362-day later retention timing remains community-derived, not an official guarantee. Stability is `Watch` and expiry recovery remains unverified.

Data currently has Airalo plus Mobal Japan tourist physical data SIM, with a generic destination-local fallback kept out of the default shortlist. Trip.com CMLink is **not live yet**; its Q-013D4 implementation is waiting in PR #127.

Temporary SMS currently has SMSPool, 5SIM and ActivateX.

### Current lead disposition

- **Kaktus Czech:** HOLD. Current community path relies on support-assisted roaming activation with outcomes ranging from hours/days to months/refund; do not publish as a stable remote route yet.
- **ClubSIM Hong Kong:** HOLD. The older cheap keep-alive path changed; research the current route from scratch before admission.
- **RedPocket US:** DEPRIORITIZED for now. Another US long-term route does not solve the current breadth gap.
- **AIS support-assisted retention:** HOLD until starting state and reproducibility are clear.
- **StellarSecurity China 100GB / 60 days:** HOLD after bounded validation. Current official pages expose two same-price €13.20 variants: `JC091` advertises China Mobile + Hong Kong egress; `PS30ZAQ7S` advertises China Unicom/Telecom + Singapore egress. A recent exact-product buyer reports receiving JC091 identifiers after ordering the nonhkip route, so do not publish a stable route until fulfillment mapping is reproduced.
- **Trip.com CMLink Mainland China eSIM (product ID `71336361`):** VALIDATED / ADMISSION-READY AS `Watch`. Current listing is live with 3–15 day package options. 2026 first-hand evidence reproduces mainland-China use, QR/eSIM setup and CMLink operation, but performance is mixed enough that public copy must not promise reliable 5G, one fixed egress, or workstation-grade speed.

### What the release intentionally does not claim

- no fabricated OTP success percentage;
- no arbitrary Phone 0–100 risk score;
- no provider-country doorway pages;
- no temporary-SMS marketplace/backend;
- no user phone number, OTP, credential or ID-document collection;
- no claim that provider documentation proves real-world OTP/overseas behavior.

### Measurement gaps that remain separate from the visual defect

- GSC Sep 18 recheck still settles only through `2026-09-15`; Sep 16 Phone release data is not settled yet.
- GA4 post-release Phone event traffic is not yet a meaningful behavior sample.
- Data remains the route-depth gap, but route expansion is paused until shell closure.
- Temporary SMS has qualitative current-state signals, not statistically valid success percentages.

These measurement gaps are not evidence that the visual defect should be ignored; the shell defect is independently justified by direct user feedback and the reproduced code/CSS mismatch.

## NEXT SESSION — exact execution order

### Q-000 — Resume from facts, not chat memory

Read in order:

1. `AGENTS.md`
2. `PROJECT_CONTEXT.md` → **Current progress checkpoint**
3. `docs/MASTER_PLAN.md`
4. `docs/OPERATING_WORKFLOW.md`
5. this queue
6. `docs/SESSION_EXECUTION_PROTOCOL.md`
7. `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md`

### Q-014J — NEXT / BOUNDED PHONE SHELL REPAIR

Status: **NEXT PRODUCT-FACING TASK**

Repair the existing Phone shell only.

Required scope:

1. replace/alias the invalid Phone CSS tokens with the production site tokens and verify light/dark selected/action states;
2. explicitly reset Phone-local button margins/box model so global calculator-button spacing cannot leak in;
3. reduce Phone hero/pre-list vertical weight so the first real route appears quickly;
4. reorganize each card into clear identity/status + compact decision metrics + restrained actions + conditional warning instead of giving every field equal weight;
5. keep the Full guide in the selected route's context, minimally as an inline expandable panel directly after the selected card;
6. add targeted static regression checks for the token/button/card/guide contract;
7. run existing Phone tests plus applicable build checks;
8. require a real Vercel Preview and visually verify desktop + mobile before merge.

Definition of done:

- no unresolved Phone CSS custom-property mismatch;
- no inherited global button top margin in Phone controls;
- first route appears promptly after family/refinement controls;
- mobile card no longer reads as three metric rows plus repeated caveat/action clutter;
- selected-route Full guide opens contextually next to that route;
- existing family logic, canonical, analytics and route data still work;
- real Preview is green and visually verified at desktop/mobile widths.

Stop conditions:

- Vercel `build-rate-limit` or equivalent provider quota blocker;
- repair requires a broader homepage/Astro/site-wide redesign;
- a change would introduce a new route/feature rather than repair the current shell.

### Q-003 trigger check — measurement gate, not repair blocker

Q-003 status: **WAITING ON DATA**.

Latest verified Sep 18: `settledThrough=2026-09-15`.

When `settledThrough >= 2026-09-16`, inspect:

- indexing state;
- Phone queries/impressions/clicks/CTR/position;
- GA4 landing-page behavior when available;
- Phone interaction events if enough data exists.

Use that evidence for later growth/route decisions. Do not use the wait gate to postpone Q-014J because the visual defect is already concrete.

### Q-014H — SUPERSEDED AS VISUAL CLOSURE

The earlier technical closure verified:

1. production first screen exposed all three families and real routes without user input;
2. default Long-term shortlist used `Show more`;
3. country acted as a refining filter;
4. three families had family-specific full-guide logic and metrics;
5. guide content covered acquisition/setup/use/keep-or-expiry/recovery;
6. cards/guides exposed purchase/platform actions;
7. responsive breakpoints existed without a known horizontal-overflow defect;
8. analytics covered `phone_family_select`, `phone_filter_change`, `phone_show_more`, `phone_guide_open` and `phone_outbound_click`;
9. canonical/indexability/sitemap/data-file tests passed.

Those checks remain technically useful, but they are no longer sufficient to call the page visually/product-complete. Q-014J must close the newly reproduced visual defects.

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
- **Data:** only two concrete public routes (Airalo and Mobal Japan tourist physical data SIM) plus one generic fallback. This is the current production depth gap until PR #127 is actually released.
- **Temporary SMS:** three platforms; outcome volume still does not justify a numeric success rate.

Conclusion: Data remains the next route-depth family **after** visual closure, not before it.

### Q-013D2 — STELLAR CHINA DATA VALIDATION CLOSED / HOLD

Status: **DONE / HOLD 2026-09-18.**

Validated exactly one route family/product candidate: Stellar China 100GB / 60 days.

Current official state:

- both current 100GB / 60-day variants show **€13.20**;
- `JC091`: China Mobile 5G + Hong Kong egress;
- `PS30ZAQ7S` / nonhkip: China Unicom 5G + China Telecom 4G + Singapore egress;
- both are data-only, support hotspot, advertise in-validity top-up, and start validity on first network connection.

Operational evidence:

- fresh NodeSeek personal-use report says Stellar works in mainland China at speed close to the author's local SIM, appeared to use China Mobile, had Hong Kong IP with some Singapore split behavior, and did not connect to 5G in that author's use;
- a separate Sep 9 exact-product buyer reports ordering the nonhkip route but receiving `cmlink` / `JC091` identifiers and connecting to China Mobile; the provider had not resolved the route/configuration discrepancy in that report.

Decision: **do not admit this route to production yet.** Exact network/egress fulfillment is material to the Data-family choice and is not reproducible enough.

Research record: `docs/PHONE_DATA_ROUTE_VALIDATION_2026-09-18.md`.

Revisit only after a fresh independent China report confirms ordered product → delivered package → registered network → egress, or provider clarification is followed by such a confirmation.

### Q-013D3 — CMLINK DATA VALIDATION CLOSED / ADMISSION-READY

Status: **DONE / ADMISSION-READY AS `Watch` 2026-09-18.**

Validated exactly one route: **Trip.com Mainland China CMLink eSIM, product ID `71336361`**.

Current commercial state:

- current Trip listing is live and explicitly identifies China Mobile CMLink;
- current package matrix is 3–15 days with multiple daily-data options and hotspot support;
- price is locale/package dependent, so public data must use a fresh localized current price rather than a hard-coded historical number;
- route is travel data, not a durable phone-number/SMS route.

Operational evidence:

- detailed March 2026 Trip/CMLink test reproduced order/QR installation, CMLINK activation, hotspot, 4G service, HK/SG egress behavior and severe post-quota throttling;
- independent April–June 2026 Trip/CMLink users reproduced mainland-China use in multiple cities, including successful use without a separate VPN;
- evidence is mixed rather than uniformly positive: users also report 4G-only operation, evening slowdowns and device-dependent performance;
- a Sep 2026 route-family report still found a newly purchased Trip CMLink eSIM usable on 4G but not strong enough for work-heavy use.

Decision: sufficient for a public decision card **only with `Watch` framing**. Do not promise reliable 5G, fixed egress, workstation-grade performance, rechargeability, or number/SMS/OTP capability.

Research record: `docs/PHONE_DATA_ROUTE_VALIDATION_CMLINK_2026-09-18.md`.

### Q-013D4 — IMPLEMENTED / BLOCKED / SECONDARY UNTIL VISUAL CLOSURE

Status: **IN PROGRESS / BLOCKED 2026-09-18.**

PR #127 implements exactly one route admission: **Trip.com Mainland China CMLink eSIM, product ID `71336361`**.

Implementation state:

- existing Phone shell, canonical and page structure are unchanged;
- `tutorial-insights.json` adds the exact Trip/CMLink route and its current evidence/capabilities;
- `radar-view.json` adds one Data shortlist card with dynamic-price wording, data-only semantics and `Watch` caveats;
- no second route or unrelated product change is included;
- PR diff review shows only those two Phone data files changed;
- Eval Gate run #504 completed successfully on the current PR head.

Blocker / ordering:

- Vercel Preview status is `failure` with `build-rate-limit` / deployment rate limiting;
- classify this as a **provider quota blocker**, not a code/build failure;
- production is unchanged and the CMLink route is **not live** yet;
- the frontend closure pass now adds a second ordering constraint: do not complete a new Phone route release until Q-014J visually closes the existing shell.

Required handling:

- keep PR #127 unmerged;
- do not push fake/no-op source changes, manually redeploy, use alternate accounts/projects, or change billing to bypass quota;
- finish Q-014J first;
- afterwards, when Vercel capacity has returned, revalidate the existing PR #127 release path without a fake source change;
- merge only after a fresh real Preview succeeds and production can be verified.

### Frontend foundation — HOLD from production cutover

The reusable Astro foundation is in `main`, but the actual production frontend remains the legacy static build. Do not migrate homepage, Phone or Relay merely because the foundation exists.

The first future production migration candidate is `/tools/`, and only after a separate bounded task verifies:

- visual/content parity or an explicitly accepted improvement;
- analytics-event mapping;
- canonical/SEO parity;
- Vercel preview path for the Astro output;
- rollback to the current checked-in static page.

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
- turn the bounded Q-014J repair into a broad Phone redesign;
- add Trip.com CMLink or any other new Phone route during the repair session;
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

The next session should not spend time rediscovering what happened. Execute the bounded Q-014J Phone shell repair from the visual-closure audit, with no new routes/features. A real desktop/mobile Vercel Preview is part of the definition of done. If Preview is rate-limited, record the provider blocker and stop. Q-003 remains a measurement gate for later growth decisions; PR #127 remains unmerged until both Phone visual closure and its own real Preview requirement are satisfied.