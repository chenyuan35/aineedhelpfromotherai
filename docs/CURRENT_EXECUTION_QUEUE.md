# Current Execution Queue

Last updated: 2026-10-06

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is the short atomic queue.

## Current decision

1. **Phone Radar remains the active primary growth product.**
2. **Backend coverage target is met:** 160 canonical routes / 87 markets / 157 brands / 117 networks / 692 sources; current known evidence-qualified relevant atomic-route coverage is **160/160** after the reviewed Red Pocket eBay product split exposed one previously conflated distinct atomic route. This is not a census of every worldwide carrier SKU.
3. **Backend ↔ frontend integration is released.** PR #370 / `46ac86e04e97f67d7a6fb3f9e1cf700fa237197a` established generated `phone-route-summaries.json` plus lazy `phone-route-data/<id>.json`; the current finder now carries all 160 canonical rows.
4. **Uncertainty remains explicit.** HOLD and needs-reconciliation rows are queryable evidence, not confident recommendations; admitted rows rank ahead of unresolved states. Known same-product legacy aliases are suppressed from duplicate market rendering.
5. **Publication remains separate:** 135 historical comparison routes / 3 explicit indexable route pages / 31 sitemap URLs. PR #370 created no new SEO URL or sitemap entry.
6. **Broad DB expansion stops.** Do not create DB-C24 from carrier directories, country-completion pressure, keyword counts or page-count pressure.
7. **Data-eSIM remains separate backstage data:** 62 source-label providers / 81 evidence records / 167 versioned offers.

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Coverage audit: `docs/PHONE_DATABASE_COVERAGE_AUDIT_2026-10-03.md`.
Saily residual review: `docs/PHONE_SAILY_US_NUMBER_REVIEW_2026-10-04.md`.
Saily release closeout: `docs/PHONE_SAILY_US_NUMBER_ADMISSION_CLOSEOUT_2026-10-04.md`.
LuckySIM residual review: `docs/PHONE_LUCKYSIM_HK_REVIEW_2026-10-04.md`.
China Telecom Macau residual review: `docs/PHONE_CT_MACAU_EASY_PASS_REVIEW_2026-10-04.md`.

## JUST COMPLETED — Canonical finder integration

PR #370 squash-merged as `46ac86e04e97f67d7a6fb3f9e1cf700fa237197a`.

- Final PR diff: only `frontend/tools/phone-number-lifecycle-mvp/index.html` and `scripts/test-phone-number-public-release.mjs`.
- Eval Gate #1119: **PASS**.
- Vercel Preview and post-merge production: **SUCCESS**.
- Live Phone hub: HTTP 200 and contains the canonical finder integration.
- At the PR #370 release baseline, live `phone-route-summaries.json` was HTTP 200 with **156 routes = 149 long-term / 5 temporary / 2 data**; the later Saily, LuckySIM and Macau residual admissions extend the same path to 159/152/5/2 without changing SEO publication.
- Live eSIM.GG lazy detail JSON: HTTP 200.
- Local/public regression covers eSIM.GG backstage detail, CMLink HOLD warning, Mobal Data, Turkcell Temporary and Sakura same-product alias dedupe.
- Public SEO boundary remains **135 comparison / 3 indexable / 31 sitemap**.

## JUST COMPLETED — Saily residual HOLD admission

PR #379 squash-merged as `045a114acb97c11acd1f56f234056d2e9d603efe`.

- `saily-us-phone-number-2026` is normalized as `family=long-term`, `numberClass=voip-second-line`, `surfaceState=backstage-only`, `evidenceState=hold`; it is not mapped to a cellular network.
- Current economics: **US$1.99/month** number subscription/reservation; KYC required; port-in/port-out unsupported.
- Mixed reliability is preserved: provider warns some services reject VoIP OTP; current community evidence includes WhatsApp activation success, iMessage activation failure and an August 2026 phone-number/SMS operational failure report.
- Canonical immediately after Saily admission was **157 routes / 86 markets / 154 brands / 116 networks / 599 sources**; finder family totals were **150 long-term / 5 temporary / 2 data**.
- Publication stays **135 comparison / 3 indexable / 31 sitemap**; no Saily standalone route URL or publication-policy entry is created.
- Eval Gate #1138 and CI #246: **PASS**; Vercel Preview and post-merge production: **SUCCESS**.
- Live verification after merge: Phone hub HTTP 200; `phone-route-summaries.json` HTTP 200 with **157 routes** and Saily present; Saily lazy detail JSON HTTP 200 with `voip-second-line` / `backstage-only` / `hold`; standalone Saily route URL HTTP 404; sitemap HTTP 200 with **31 URLs** and no Saily entry.
- `npm run phone:data:check`, the Saily migration regression, frontend build, public-release audit and `git diff --check` pass locally.

## JUST COMPLETED — Smart Prepaid roaming/SMS evidence refresh

- `smart-prepaid-ph-2026` remains `backstage-only` / `hold`; no recommendation or publication state changed.
- Four current Smart official sources now confirm roaming activation, ordinary roaming SMS send/receive capability, the PHP100 activation-balance requirement, and removal of the old PHP50 maintaining-balance requirement.
- Three 2026 independent community sources preserve mixed operational reality: one practical roaming report, one PHP99 eSIM activation success report, and one late-September multi-user eSIM activation/conversion incident.
- Service-specific OTP reliability remains **unverified**; the foreign-tourist 30-day registration cap remains the decisive HOLD blocker.
- Canonical remains **157 routes / 86 markets / 154 brands / 116 networks**; append-only source corpus becomes **606**. Public boundary remains **135 comparison / 3 indexable / 31 sitemap**.
- Regression: `npm run phone:data:check`, frontend build, `phone-radar public release audit`, and `git diff --check` pass.

## JUST COMPLETED — LuckySIM Hong Kong residual HOLD admission

- `luckysim-hk-prepaid-2026` is normalized as `family=long-term`, `numberClass=real-mobile`, `surfaceState=backstage-only`, `evidenceState=hold` on `csl-hk`.
- Current official acquisition baseline: **HK$138 / 1,095 days** with a retained Hong Kong mobile number, physical/eSIM support, voice/SMS and mandatory real-name registration.
- Current official renewal ladder: **HK$50 / 180 days**, **HK$100 / 365 days**, **HK$200 / 540 days**; the normalized ongoing keep action is HK$100/year.
- Recent independent evidence supports overseas incoming SMS and ordinary mainland-China SMS, but bank/third-party OTP reliability remains too thin for recommendation status.
- Canonical becomes **158 routes / 86 markets / 155 brands / 116 networks / 611 sources**; finder family totals become **151 long-term / 5 temporary / 2 data**.
- Publication remains **135 comparison / 3 indexable / 31 sitemap**; no LuckySIM standalone route URL or publication-policy entry is created.
- `npm run phone:data:check`, frontend production build, Phone public-release audit and `git diff --check` pass locally.

## JUST COMPLETED — China Telecom Macau Easy PASS residual HOLD admission

- `china-telecom-macau-easy-pass-2026` is normalized as `family=long-term`, `numberClass=real-mobile`, `surfaceState=backstage-only`, `evidenceState=hold` in the new Macau market.
- Current first-party lifecycle: **180 days from activation**; a recharge resets/extends validity to **180 days from the recharge date**; zero balance/expiry suspends service; **more than 90 days suspended automatically cancels the prepaid card**.
- Current provider material confirms real-name registration, ordinary incoming SMS free in Macau/mainland China/Hong Kong, current prepaid eSIM support and physical-SIM-to-eSIM conversion.
- A September 2026 independent report reproduces eSIM conversion and **MOP50 / 180-day** normal retention. MOP50 is kept as community-observed normal recharge, not misrepresented as a provider-published minimum.
- Service-specific bank/app OTP reliability remains insufficiently sampled, so the route remains HOLD.
- Canonical becomes **159 routes / 87 markets / 156 brands / 117 networks / 616 sources**; finder family totals become **152 long-term / 5 temporary / 2 data**.
- Publication remains **135 comparison / 3 indexable / 31 sitemap**; no Macau standalone route URL or publication-policy entry is created.

## JUST COMPLETED — LuckySIM service-specific SMS evidence maintenance

- Two independent community sources were appended for `luckysim-hk-prepaid-2026`: one user reports receiving Hong Kong SMS for banking codes while in Australia; another reports multi-week incoming-SMS failure until support restarted the connection.
- These are mixed route-level outcomes, not a bank/app OTP guarantee. The bank in the positive report is unspecified and the negative report shows delivery can be unstable.
- Route remains `backstage-only` / `hold`; no ranking, route URL, publication-policy or sitemap state changes.
- Canonical remains **159 routes / 87 markets / 156 brands / 117 networks**; append-only source corpus becomes **618**. Public boundary remains **135 comparison / 3 indexable / 31 sitemap**.

## JUST COMPLETED — Evidence-gated Phone Top decision layer

PR #388 squash-merged as `f171726bde05245bc41c284d718ab32a64298f40`.

- Existing Phone Radar canonical now renders five derived decision shortcuts: lowest setup cost, lowest yearly keep, longest verified keep window, best app-verification evidence, and best-documented continuity.
- Top eligibility is conservative: long-term + real-mobile + admitted + user-visible. HOLD and backstage-only rows cannot win.
- Route summaries now expose source count, KYC state, keep action, roaming-SMS evidence, HOLD reason, and continuity-warning counts for transparent downstream decisions.
- Service aggregates expose success/failure/mixed counts and distinct-source counts. `successRatePct` remains `null` unless an exact route + service + operation group has at least 5 deduplicated observations from 5 distinct source records.
- No arbitrary 0–100 safety score or unsupported "least likely to be banned/recycled" probability was added; continuity is expressed through verified keep windows, warning events and evidence depth.
- Eval Gate #1156: **PASS**. Vercel Preview: **READY**. Production deployment `dpl_3HFruLPEyUj7hafRpQAAiBEQxSdL`: **READY**. Apex Phone Radar and live `phone-route-summaries.json`: HTTP 200 with the new fields.
- Counts and publication boundary at the PR #388 baseline were **159 routes / 87 markets / 156 brands / 117 networks / 618 sources**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## JUST COMPLETED — ClubSIM Telegram evidence-density maintenance

PR #390 squash-merged as `0a2c6a8e9b1529ec227b4a717d37c88cf51109fd`.

- Existing route: `clubsim-sms-pack-6hkd-2026`, one of the lowest-cost real-mobile long-term routes in canonical at normalized HK$50 entry and HK$6 / 365-day keep cost.
- Added **7 distinct dated community source records** and **7 deduplicated exact route + Telegram + registration-verification observations**.
- Generated aggregate: **2 success / 3 failure / 2 mixed / n=7 / 7 distinct sources / observed success 28.6% / grade C (Mixed / weak)**. The percentage is a bounded community-observation aggregate, not a universal carrier probability.
- ClubSIM remains `admitted` but `backstage-only`; cheap keep cost does not override weak/mixed Telegram reliability evidence. No new route URL, indexability rule or sitemap entry was created.
- Source corpus becomes **625**. Canonical remains **159 routes / 87 markets / 156 brands / 117 networks**; public boundary remains **135 comparison / 3 indexable / 31 sitemap URLs**.
- Branch regression workflow #37191691290: **PASS**. Eval Gate #1160: **PASS**. Vercel Preview: **PASS**. Production deployment `dpl_8U971UeoANGmLdu86JfNoPdmD5C4`: **READY**. Live ClubSIM detail JSON and live `phone-route-summaries.json`: **HTTP 200** with the 28.6% aggregate.

## JUST COMPLETED — Ultra Mobile PayGo Telegram canonical application

PR #394 squash-merged as `459be509372d214a8f8cb4143eafa1be49664f37`.

- Applied the five reviewed exact-route + Telegram + registration-verification sources to canonical data.
- Aggregate is **3 success / 0 failure / 2 mixed / n=5 / 5 distinct sources / observed success 60.0% / grade C (Mixed / weak)**.
- `ultra-mobile-paygo-3-2026` remains `admitted` + `backstage-only`; no route URL, indexability rule or sitemap entry was added.
- Source corpus became **630**. Canonical remained **159 routes / 87 markets / 156 brands / 117 networks**; public boundary remained **135 comparison / 3 indexable / 31 sitemap URLs**.
- Eval Gate #1168 and CI #256: **PASS**; Vercel Preview and production: **PASS**.

## JUST COMPLETED — H2O PayGo overseas-continuity evidence maintenance

- Existing route `h2o-paygo-10-90d-2026` gained three independent route-level sources and remains `hold` + `backstage-only`.
- Conflicting PayGo Wi-Fi Calling evidence is preserved as route-level uncertainty; no app success percentage was created.
- Source corpus reached **633** with public boundary unchanged.

## JUST COMPLETED — Tello PAYG current-rule + continuity maintenance

- Existing route: `tello-paygo-credit-2026`, real-mobile, `admitted` + `backstage-only`.
- Added 8 current/recent sources: 4 first-party Tello help pages plus 4 community/provider-community sources covering PAYG lifecycle, U.S.-first activation/roaming, Codex verification-SMS failure, overseas SMS interruption, account-security risk and a current China-use/retention guide.
- Corrected economics: initial/manual web PAYG purchase remains **US$20**, but Tello currently documents `ADD10PAYG` SMS top-ups with a saved card; lowest documented PAYG-only keep path is therefore **US$10 / 90 days (~US$40 / 360 days)** instead of the stale US$80/year assumption.
- Current first-party boundary: initial SIM/eSIM activation must occur physically in the U.S. on Tello towers; international roaming requires prior U.S. line use.
- Community risk is mixed and not plan-isolated enough for an exact app aggregate. Preserve zero service observations/percentages; set `guideEligible=false` while keeping the route admitted/backstage-only.
- Source corpus becomes **641**. Canonical remains **159 routes / 87 markets / 156 brands / 117 networks**; public boundary remains **135 comparison / 3 indexable / 31 sitemap URLs**.

## JUST COMPLETED — Red Pocket Essentials / eBay $30 atomic split

- Reviewed `redpocket-annual-2026` against current first-party and independent evidence and found two materially different products had been conflated.
- Existing `redpocket-annual-2026` now cleanly represents website Essentials: **US$80 first year / US$110 renewal / 3GB per month / 360-day annual term**.
- New canonical `redpocket-ebay-30-2026` represents the official eBay Starter Plan: **US$30 / 360 days / unlimited U.S. talk+text / 200MB every 30 days / GSMA-AT&T / physical SIM or eSIM / renewal-existing-SIM option**.
- Official boundaries are explicit: activation must occur in the U.S.; Wi-Fi Calling supports SMS; current RedPocket help says eBay plans do not include international roaming. Conflicting 2026 community roaming buckets are recorded as unstable/unpromised.
- No exact app/service sample meets the percentage gate, so service evidence remains unquantified. New route is `admitted` + `backstage-only`; no SEO/public route is created.
- Canonical becomes **160 routes / 87 markets / 157 brands / 117 networks / 651 sources**. Historical comparison remains **135**, explicit indexability **3**, sitemap **31**.

## JUST COMPLETED — KPN Prepaid lifecycle / activation maintenance

- Existing `kpn-prepaid-6mo-2026` stays `admitted` + `backstage-only`; no public URL or service percentage is added.
- Corrected current acquisition from stale **€15** to official **€4.99** physical SIM; KPN Prepaid does not support eSIM.
- Corrected lowest documented NL/EU keep action from stale €0.07/SMS to current Basis 2021 **€0.15/SMS**, about **€0.30/year** for two six-month keep actions. Outside-EU outgoing SMS tariffs vary.
- Lifecycle is now explicit: qualifying outbound use/top-up once every 6 months; incoming calls/SMS do not count; after 6 months inactivity a **90-day top-up rescue window** applies before number/credit loss.
- Current provider-moderated evidence confirms new prepaid activation must occur in the Netherlands on the KPN network. Official roaming/incoming-SMS support is preserved alongside a 2026 overseas no-network continuity incident.
- Source corpus becomes **658**; canonical/publication counts remain **160 routes / 87 markets / 157 brands / 117 networks**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## JUST COMPLETED — Three UK PAYG acquisition / roaming maintenance

- Existing `three-uk-payg-180d-2026` stays `admitted` + `backstage-only`; no public URL or service percentage is added.
- Corrected current new-line acquisition from stale **£5** to the current direct online boundary: a PAYG voice SIM cannot be ordered free alone and must be paired with a Data Pack; the lowest currently displayed one-month pack is **£10**.
- Standard PAYG remains **35p/min, 15p/text, 10p/MB**. One qualifying chargeable activity every **180 days** is still required; Wi-Fi-only activity does not count and an inactivity-disconnected number cannot be restored.
- PAYG still supports **physical SIM + eSIM**. Before roaming, the SIM/device must connect to Three in the UK and complete any required UK Top-up/Data Pack provisioning. Incoming roaming texts are officially free; reachability itself is not treated as guaranteed.
- Source corpus becomes **661**; canonical/publication counts remain **160 routes / 87 markets / 157 brands / 117 networks**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## JUST COMPLETED — Telia Estonia Super lifecycle / activation maintenance

- Existing `telia-ee-180d-2026` stays `admitted` + `backstage-only`; no public URL or service percentage is added.
- Source depth increases **1 → 5** using current first-party Super/Telia evidence. Starter kits remain **from €1** and both physical SIM + eSIM starter kits require **Estonia activation**.
- Number validity remains one **single ≥€3 top-up every 180 days**; split smaller top-ups do not count. A **30-day rescue window** follows expiry before number/balance loss, so normalized keep cost remains roughly **€6/year**.
- Roaming must be enabled before travel; EU use follows the Estonia price list subject to fair-use rules, while non-EU prices/reachability remain destination-dependent. Current standard-rate call/SMS is **€0.05**, but ordinary usage is not documented as resetting number validity.
- Source corpus becomes **665**; canonical/publication counts remain **160 routes / 87 markets / 157 brands / 117 networks**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## JUST COMPLETED — ALDI TALK lifecycle / acquisition maintenance

- Existing `aldi-talk-activity-window-2026` stays `admitted` + `backstage-only`; no public URL or service percentage is added.
- Source depth increases **1 → 7** using current/standing first-party evidence. Regular Starter-Set economics remain **€9.99 with €10 starting credit**; the active **€2.99 promotion ends 2026-10-11** and is recorded separately rather than becoming the durable acquisition metric.
- Lifecycle remains explicit: **12-month initial window**; official top-up ladder **€5/4mo, €10/8mo, €15/12mo, €30/24mo**; then a **two-month receive-only rescue period** before deactivation. Lowest documented keep path remains about **€15/year**.
- Current official pages support physical SIM + eSIM but conflict on whether new prepaid eSIM can be ordered directly or only obtained by exchanging an activated plastic SIM; preserve the conflict instead of silently choosing one path.
- Valid-ID registration is mandatory; online Video-Ident exists, but universal foreign-passport/China-first activation is not established. Roaming is officially supported with a provider warning about country-specific technical restrictions; China incoming-SMS and app/OTP reliability remain unverified.
- Source corpus becomes **671**; canonical/publication counts remain **160 routes / 87 markets / 157 brands / 117 networks**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## JUST COMPLETED — Hotlink Pantas lifecycle / tourist / roaming maintenance

- Existing `hotlink-pantas-365-pass-2026` stays `admitted` + `backstage-only`; no public URL or service percentage is added.
- Source depth increases **1 → 12** using current Hotlink first-party pages plus recent independent/community evidence.
- Current conservative setup path is **RM12 = RM10 Hotlink Prepaid starter baseline + RM2 Pantas plan change**. The current Pantas T&C frames the plan as a change from another prepaid plan; legacy/direct-starter FAQ wording is preserved as a first-party documentation conflict rather than silently preferred.
- Eligible non-tourist Pantas lines still have the **RM30 / 365-day Active Period pass**. RM2/RM4/RM10 365-day offers are data passes, not SIM-validity substitutes. Ordinary expiry is followed by a **30-day incoming-call/SMS-only grace period**.
- Current Pantas terms hard-limit **tourist registrations to 90 days from original activation**; plan switching, top-up and internet-pass purchases do not extend or reset that period. Passport/eSIM self-registration is supported, but the reviewed sources do not establish when a non-Malaysian is classified as tourist versus regular Pantas, so `guideEligible=false`.
- Roaming is provisioned by default, but a September 2026 Pantas report records roaming-SMS failure plus an unpublished minimum-balance claim; overseas recovery/OTP reliability remains unquantified and no exact app aggregate is created.
- Source corpus becomes **682**; canonical/publication counts remain **160 routes / 87 markets / 157 brands / 117 networks**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## JUST COMPLETED — FarEasTone prepaid lifecycle / activation / overseas-SMS maintenance

- Existing `fareastone-prepaid-tw-2026` stays `admitted` + `backstage-only`; no public URL or service percentage is added.
- Source depth increases **1 → 11** using current FarEasTone first-party product/recharge/roaming material plus one bounded 2026 foreign-user continuity report.
- Current economics remain **NT$300 starter**, **180-day number validity**, and **NT$100 minimum recharge**, for a lowest documented retention path of about **NT$200/year**.
- Current regular-prepaid application remains Taiwan in-store with **two identity documents** and customer-data registration. FarEasTone currently supports **prepaid eSIM as well as physical SIM**, but no offshore first-activation path was established.
- Tourist prepaid is a separate product family and is not used to infer the long-term 易付卡 lifecycle.
- FarEasTone broadly advertises free incoming SMS/OTP abroad through international VoLTE and maintains prepaid roaming, but reviewed material does not explicitly prove this exact regular-prepaid route's original-number SMS entitlement in mainland China. A July 2026 long-term PAYG report also records passport/ARC data mismatch causing calling suspension until records were updated. `guideEligible=false`; no app/OTP aggregate is created.
- Source corpus becomes **691**; canonical/publication counts remain **160 routes / 87 markets / 157 brands / 117 networks**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## NEXT — continue database maintenance, no invented expansion

1. **Immediate bounded route:** `tim-prepaid-12mo-2026`. It is an admitted/backstage real-mobile route with only two current canonical sources and one of the lowest normalized keep costs among the remaining evidence-thin routes. Reconcile current starter/recharge economics, 12-month lifecycle, eSIM/activation/KYC boundaries and overseas SMS/roaming continuity before any app-specific reliability claim.
2. **Search Console gate:** publication remains held until the explicit measurement gate is met; database maintenance continues independently.
3. **Database expansion:** current known evidence-qualified atomic universe is 160/160; reopen only when review exposes another genuinely distinct product/route. Do not create DB-C24 merely to raise counts.
4. **Data-eSIM:** keep append-only community intake separate from Phone-number canonical.
5. **Frontend:** no new URL or redesign from this maintenance work.

Delegated Qwen/Kimi output remains `RESEARCH_CANDIDATE` until coordinator review and cannot bypass evidence/admission/publication gates.

## External waits

- TikTok — Direct Post Content Posting API reapplication submitted 2026-10-02; do not resubmit unless TikTok rejects or requests evidence.
- Authority / AI discovery — follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; verify claimed citations/links independently.
- AI-native retrieval — follow `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md`; do not bypass provider quota/auth blockers.

## Do not do next

- do not create DB-C24 merely to increase counts; Saily, LuckySIM and Macau were bounded residual exceptions only because their documented blockers cleared;
- do not equate 160/160 current-known coverage with all global carrier products;
- do not automatically turn canonical rows into SEO pages;
- do not auto-rank HOLD/needs-reconciliation as recommendations;
- do not mix pure data eSIM into Phone-number canonical without reviewed identity linkage;
- do not redesign the frontend without measured/reproduced need;
- do not let delegated output bypass evidence/admission/publication gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
