# Current Execution Queue

Last updated: 2026-09-19

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict.

## Current decision

Phone Radar's accepted product model remains correct on the existing canonical:

`/tools/phone-number-survival-guide/`

The model remains:

- **three route families:** long-term SMS/OTP numbers, data SIM/eSIM routes, temporary SMS platforms;
- **two experience layers:** visual decision dashboard first, full operational guide on demand;
- **no questionnaire before routes;**
- **research complexity stays backstage.**

Phone visual closure remains open. The bounded repair exists in **Draft PR #130** and the first real desktop screenshot review has already caught one additional dark-mode specificity defect. That defect is fixed on the same branch and Eval Gate is green, but the fresh Vercel Preview for the fixed head is currently blocked by `build-rate-limit`.

Do not start another redesign or add routes. The next bounded Phone task is to wait for genuine Preview capacity, review the fixed head visually, fix only reproduced defects on the same branch, and keep production unchanged until the review is explicitly clean.


## User-directed one-off task — TikTok App Review closure (2026-09-19)

Status: **COMPLETE / SUBMITTED — WAITING FOR REVIEW.** The one-off execution task is closed; TikTok itself is now an external wait state and does not displace the standing Phone Radar priority.

Verified completion evidence:
- PR #140 merged as `587e2757540306de5f6bcbc1b769c1a3adc71f96`; PR #141 merged as `e15c6039e96d1a5c8e9e97a82da75b97d08a9a64`.
- Production `/tiktok-publish/` is live and PR #141 keeps `/api/tiktok/*` routed to the configured Sandbox Preview Functions for reviewer use.
- The user uploaded the final review demo video in the TikTok Developer Portal.
- Production app details were corrected before submission: Web/Desktop URL `https://aineedhelpfromotherai.com/`; Login Kit redirect `https://aineedhelpfromotherai.com/api/tiktok/callback/`; the accidental blank redirect row and duplicate-URI validation state were cleared.
- The user submitted the Production app for review. The Portal displayed: `Your app has been submitted for review. Please wait and we will get back to you soon.` and exposed a `Recall` action, confirming the review is pending.

Hold rules while review is pending:
- **Do not click `Recall`.**
- Do not edit the submitted demo video, Products, Scopes, URLs, or review fields unless TikTok explicitly requests a change.
- Do not remove PR #141's temporary Sandbox review bridge while reviewers may still need the submitted flow.
- Do not rotate/move TikTok credentials or change the test account/privacy as cleanup work.
- Do not treat waiting time as a reason to add TikTok features or expand project scope.

Next trigger:
- **Approved:** verify the approval state, then open a separate bounded production-transition task for direct Production credentials/functions and bridge retirement. Remove the bridge only through a fresh branch/PR after the direct production path is verified.
- **Rejected / Changes requested:** read the exact TikTok review feedback, make only the requested/reproduced corrections, re-record/re-upload evidence only if required, and resubmit through a separate bounded review-fix task.
- **No response yet:** no TikTok changes. Resume the standing queue with Q-014J Phone visual closure.

Detailed submission/rollback state is in `docs/TIKTOK_PUBLISH_REVIEW_NOTES_2026-09-19.md`.

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
- Q-014J Phone shell repair implementation: **IMPLEMENTED / REVIEW BLOCKED AFTER FIRST VISUAL FIX.** Draft PR #130 current head is `199bcca39a4e77d0ef72602e363de9888de2d3fb`; current diff changes exactly three files: Phone source HTML, Phone-specific dark-mode overrides in `frontend/site.css`, and the Phone contract test. Initial head `baf5f333` passed Eval Gate #510 and had a successful Vercel Preview. A real desktop dark-mode screenshot of that Preview exposed that selected/unselected family selectors were flattened by the global dark button rule. The same PR branch fixes that defect and adds regression assertions. Eval Gate #514 passes on head `199bcca`; the new Vercel attempt is blocked by provider `build-rate-limit`, so the fixed state is not visually accepted yet. Production remains unchanged.
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

The old flow made users answer questions before seeing routes and exposed too much research/evidence prose. The current production flow starts with actual route choices, optional country refinement, family-specific metrics, and a `Full guide` action.

The accepted user journeys remain:

- **Long-term SMS/OTP:** compare → full guide → buy → activate → test SMS → keep alive/recover.
- **Data SIM/eSIM:** compare → full guide → buy → install → use/recharge.
- **Temporary SMS:** compare → full guide → use → discard; never presented as durable recovery.

### What is wrong in current production and what Draft PR #130 repairs

Current production still carries the Sep 18 visual defects until a reviewed merge happens:

- Phone-local CSS references `--border`, `--surface` and `--text`, while production `site.css` defines `--line`, `--panel` and `--ink`;
- global `button { margin-top:16px }` leaks into Phone controls;
- the Phone H1 inherits a marketing-scale clamp;
- too much pre-list chrome delays the first real route;
- five equal-weight metric cells plus actions and full caveats make cards dense;
- the shared Full guide sits after the whole route list and loses selected-route context.

Draft PR #130 repairs those exact issues without changing route data:

- uses `--line / --panel / --ink` and resets Phone-local button margins;
- compresses the hero and removes redundant visible family-note/catalog-count chrome;
- presents three visual user-job choices: `Keep a real number`, `Get mobile data`, `Receive a one-time code`;
- reorganizes each route into identity/status + compact metadata + three primary metrics + restrained actions;
- only renders a warning strip when the caveat materially changes the choice;
- renders each Full guide inline inside the selected route card;
- adds static regression checks for CSS tokens, local button spacing, compact cards, inline guide structure and source-level `phone_show_more` analytics;
- after real screenshot review exposed dark-mode selector flattening, adds Phone-specific dark overrides so unselected family buttons use the dark panel while the selected family uses the high-contrast active fill; also restores Phone primary/secondary action hierarchy against the global dark button rule.

The repair source remains `docs/PHONE_RADAR_VISUAL_CLOSURE_AUDIT_2026-09-18.md`.

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

### Q-014J — IMPLEMENTED / REVIEW BLOCKED AFTER FIRST VISUAL FIX

Status: **DRAFT PR #130 / DO NOT MERGE YET**

Implementation exists on `feat/q014j-phone-visual-repair-20260918`, current head `199bcca39a4e77d0ef72602e363de9888de2d3fb`.

Implemented scope:

1. invalid Phone CSS tokens replaced with the production site tokens;
2. Phone-local button margins/box model explicitly owned so global calculator-button spacing does not leak in;
3. hero/pre-list vertical weight reduced;
4. three visual task selectors added without adding a new product job or questionnaire;
5. each card reorganized into identity/status + compact metadata + three primary decision metrics + restrained actions + conditional warning;
6. Full guide moved into an inline expandable panel inside the selected route card;
7. source-level `phone_show_more` tracking preserved;
8. targeted static regression checks added;
9. Phone-specific dark-mode overrides added after screenshot review proved the generic dark button rule was overriding selector/action hierarchy.

Verified evidence:

- current PR #130 diff contains only `frontend/tools/phone-number-lifecycle-mvp/index.html`, `frontend/site.css`, and `scripts/test-phone-number-lifecycle-mvp.mjs`;
- initial head `baf5f333` Phone contract audit: PASS (18 checks), retention/supply audits PASS, public release audit PASS, Eval Gate #510 PASS, Vercel Preview SUCCESS;
- actual first Preview loaded and semantic inspection showed the intended task-first/card structure;
- real desktop dark screenshot showed the first route inside the first viewport and substantially clearer route-card hierarchy;
- the same screenshot also exposed a genuine dark-mode active-selector defect caused by CSS specificity, proving the prior Preview was not acceptable;
- current head `199bcca` fixes that defect and adds regression assertions;
- Eval Gate #514 PASS on head `199bcca`, including Phone MVP audit, public Phone build/release audit and regression suite;
- current Vercel status for head `199bcca`: **failure / provider `build-rate-limit`**. This is a quota blocker, not a code/build failure.

Remaining acceptance work:

1. do **not** treat the older `baf5f333` Preview as evidence for the dark-mode fix;
2. when Vercel capacity genuinely returns, visually inspect a Preview built from head `199bcca` at desktop width;
3. visually inspect at mobile width rather than inferring from CSS only;
4. verify light and dark selected/action states, especially that exactly one family selector is visually active;
5. verify first real route is visible quickly after the task selectors/refinement;
6. verify family switching, country filter and `Show more` do not create confusing layout changes;
7. open/close Full guide and confirm it visually stays attached to the selected route;
8. verify no horizontal overflow or cramped three-metric card state;
9. if any concrete visual defect appears, fix it on the same branch, rerun checks and inspect the new Preview;
10. only after a clean visual review mark Q-014J visually accepted and decide whether PR #130 is ready to leave Draft.

Definition of done:

- no unresolved Phone CSS custom-property mismatch;
- no inherited global button top margin in Phone controls;
- selected/unselected task selectors remain visually distinct in both light and dark mode;
- first route appears promptly after family/refinement controls;
- mobile card no longer reads as repeated metric/caveat/action clutter;
- selected-route Full guide opens contextually next to that route;
- existing family logic, canonical, analytics and route data still work;
- real Preview is green and visually verified at desktop/mobile widths.

Stop conditions:

- Vercel `build-rate-limit` or equivalent provider quota blocker: record it and stop rather than push/redeploy around it;
- no usable rendered visual-inspection surface is available: keep PR #130 Draft rather than infer completion from CI;
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

Use that evidence for later growth/route decisions. Do not use the wait gate to skip Q-014J visual review because the visual defect is already concrete.

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

- existing Phone shell, canonical and page structure are unchanged in that PR;
- `tutorial-insights.json` adds the exact Trip/CMLink route and its current evidence/capabilities;
- `radar-view.json` adds one Data shortlist card with dynamic-price wording, data-only semantics and `Watch` caveats;
- no second route or unrelated product change is included;
- PR diff review shows only those two Phone data files changed;
- Eval Gate run #504 completed successfully on the current PR head.

Blocker / ordering:

- PR #127's previous Vercel Preview status was `failure` with `build-rate-limit` / deployment rate limiting;
- classify that historical attempt as a **provider quota blocker**, not a code/build failure;
- production is unchanged and the CMLink route is **not live** yet;
- PR #130 previously received a successful Preview for its first head, but its current fixed head is also rate-limited; do not infer that PR #127 is reviewed or safe without its own new valid Preview;
- the frontend closure pass remains the ordering constraint: do not complete a new Phone route release until Q-014J visually closes the existing shell.

Required handling:

- keep PR #127 unmerged;
- do not push fake/no-op source changes, manually redeploy, use alternate accounts/projects, or change billing to bypass quota;
- finish Q-014J visual review first;
- afterwards, revalidate the existing PR #127 release path through its own genuine Preview;
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
- turn Q-014J visual review into another broad Phone redesign;
- create a second Q-014J implementation branch when PR #130 already exists;
- push no-op commits or manual redeploys to bypass Vercel `build-rate-limit`;
- use the older PR #130 Preview to claim the current dark-mode fix is visually verified;
- add Trip.com CMLink or any other new Phone route during the closure review;
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

The next session should not spend time rediscovering or reimplementing Q-014J. Check the existing Draft PR #130 head and Vercel status. If the fixed head `199bcca` still has `build-rate-limit`, leave it Draft and do not bypass the quota. When a genuine fresh Preview exists, perform real desktop/mobile visual QA; if a concrete defect is visible, repair it on the same branch and rerun checks. Do not merge or release until visual acceptance is explicit. Q-003 remains a measurement gate for later growth decisions; PR #127 remains unmerged until Phone visual closure is complete and its own genuine Preview requirement is satisfied.
