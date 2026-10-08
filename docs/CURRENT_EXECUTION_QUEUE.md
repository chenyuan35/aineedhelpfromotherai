# Current Execution Queue

Last updated: 2026-10-08

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is the short atomic queue.

## Current decision

1. **Phone Radar remains the active primary growth product.**
2. **Backend coverage target is met:** 160 canonical routes / 87 markets / 157 brands / 117 networks / 791 sources; current known evidence-qualified relevant atomic-route coverage is **160/160** after the reviewed Red Pocket eBay product split exposed one previously conflated distinct atomic route. This is not a census of every worldwide carrier SKU.
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
- Source corpus becomes **692**; canonical/publication counts remain **160 routes / 87 markets / 157 brands / 117 networks**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## JUST COMPLETED — TIM Prepaid lifecycle / eSIM / foreign-onboarding maintenance

- Existing `tim-prepaid-12mo-2026` stays `admitted` + `backstage-only`; no public URL or service percentage is added.
- Source depth increases **2 → 6** using current TIM first-party lifecycle, recharge, SIM/eSIM, activation and roaming material.
- Lifecycle remains **12 months full service + month 13 receive-calls-and-SMS only**. After expiry, TIM currently allows free number reactivation for up to **11 months**.
- Current **Ricarica 5+ costs €5** and TIM says the last recharge resets card validity, preserving a lowest currently documented paid retention action of roughly **€5/year**. Ricarica 5+ includes €4 prepaid credit plus a temporary bundle; the record does not misstate it as €5 of ordinary credit.
- Current new-customer SIM baseline remains **€10**. Physical SIM + eSIM are supported. Online identity can use passport, but the reviewed flow also requires Italian **Codice Fiscale** and documents Italy-issued cards for online payment, so offshore/non-resident activation is not assumed.
- TIM supports taking the TIM number abroad and offers China roaming products, but exact mainland-China regular-prepaid incoming-SMS/app OTP reliability remains unverified. `guideEligible=false`; no exact app aggregate is created.
- Source corpus becomes **696**; canonical/publication counts remain **160 routes / 87 markets / 157 brands / 117 networks**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## JUST COMPLETED — Taiwan Mobile prepaid lifecycle / foreign-eligibility / China-SMS maintenance

- Existing `taiwan-mobile-prepaid-tw-2026` stays `admitted` + `backstage-only`; no public URL or service percentage is added.
- Source depth increases **1 → 6** using current Taiwan Mobile first-party tariff, recharge, eSIM, identity and prepaid-roaming material.
- Current regular-prepaid baseline is **NT$300**. Current communication-credit recharge includes **NT$100**, and each recharge restarts number validity for **six months**, giving a lowest documented retention path of about **NT$200/year**.
- Physical SIM + prepaid eSIM are supported. Foreign applicants must apply in a Taiwan Mobile myfone store with **two original identity documents**; online application is unavailable to international customers.
- Taiwan Mobile explicitly assigns foreign prepaid applicants to short-validity versus regular prepaid according to permitted-stay validity, so passport acceptance alone is not treated as long-term eligibility.
- Current prepaid roaming material explicitly permits **ordinary incoming SMS in China** while prepaid roaming voice and outgoing SMS are unavailable there; paid/premium SMS is excluded. This is not generalized into bank/app OTP reliability.
- `guideEligible=false`; no exact app/service aggregate is created.
- Source corpus becomes **701**; canonical/publication counts remain **160 routes / 87 markets / 157 brands / 117 networks**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## JUST COMPLETED — 1pMobile PAYG retention / eSIM / long-term-overseas maintenance

- Existing `1pmobile-uk-2026` stays `admitted` + `backstage-only`; no public URL or service percentage is added.
- Source depth increases **1 → 7** using current 1pMobile terms, PAYG sales, joining, eSIM, overseas-use and payment material.
- Durable acquisition stays **£10 initial credit with a free SIM**. The current **£5 signup** that still supplies £10 credit is recorded as a promotion, not treated as the permanent route price.
- New customers from **1 August 2026** have a **£10 spend/use commitment every 90 days**. A shortfall is deducted from credit and may trigger an automatic top-up; this is not misrepresented as a mandatory manual £10 recharge every quarter.
- Physical SIM + eSIM are supported. New-customer eSIM has no separate eSIM fee, and current help says eSIM can often be activated while already overseas, subject to local roaming-partner support.
- 1pMobile explicitly permits long-term non-EU overseas use without periodic UK return and says standard SMS, verification codes, 2FA and banking OTP messages can continue while roaming. Because this is provider evidence rather than destination/app-specific independent measurement, `guideEligible=false` and no exact service aggregate is created.
- Source corpus becomes **707**; canonical/publication counts remain **160 routes / 87 markets / 157 brands / 117 networks**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## JUST COMPLETED — Mobal Voice Lite product-successor / Japan-only maintenance

- Existing `mobal-japan-voice-2026` stays `admitted` + `backstage-only`; no public URL or service percentage is added.
- Source depth increases **2 → 7** using current Mobal Voice Lite SIM/eSIM, identity, shipping and roaming material while preserving the earlier 2026-09-29 records as history.
- Current product is **Voice Lite**, not the earlier Voice-Only profile: **¥4,950 setup + ¥990/month**, real Japanese 070/080/090 number, free incoming calls/SMS and 500MB/month limited data.
- Annual normalized service cost falls **¥17,160 → ¥11,880**. The previous ¥1,430/month Voice-Only and temporary setup-promotion profile is not carried forward as current.
- Voice Lite physical SIM + eSIM are supported, but the voice eSIM is not sent by email. Mobal ships a physical access code to an accepted-ID address or requires Japan pickup with a physical passport/order confirmation.
- Current Voice Lite SIM/eSIM FAQs say the product **only works in Japan**; current roaming help limits international roaming to latest Voice+Data 5G products. Voice Lite also lacks Wi-Fi Calling. The previous overseas-SMS/OTP continuity assumption is removed.
- `guideEligible=false`; no exact app/service aggregate is created.
- Source corpus becomes **712**; canonical/publication counts remain **160 routes / 87 markets / 157 brands / 117 networks**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## JUST COMPLETED — LABAS acquisition / lifecycle / foreign-registration / roaming-SMS maintenance

- Existing `labas-90-120d-2026` stays `admitted` + `backstage-only`; no public URL or service percentage is added.
- Source depth increases **2 → 7** using current LABAS first-party terms, packaging, registration, top-up and roaming material.
- Corrected acquisition economics: current direct eSIM entry is **from €1**; the old normalized €3 value was the qualifying retention top-up, not the minimum acquisition price.
- Lifecycle is reconfirmed: **≥€3 top-up / 90 days** for full service; after 90 days the line is receive-only for calls/SMS, and after **120 days** the number is cancelled and not restorable. Normalized keep cost remains about **€12/year**.
- LABAS says citizens of any country can use online biometric registration with accepted identity documents including passport, but current terms warn that activation in foreign countries may be restricted. Remote KYC is therefore not treated as guaranteed offshore first activation.
- Current roaming material supports ordinary send/receive SMS abroad and lists China among supported non-EU roaming destinations. No bank/app OTP percentage is created; `guideEligible=false`.
- Source corpus becomes **717**; canonical/publication counts remain **160 routes / 87 markets / 157 brands / 117 networks**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## JUST COMPLETED — Fortress haha SIM acquisition / lifecycle / KYC / Telegram maintenance

- Existing `fortress-hahasim-hk-2026` stays `admitted` + `backstage-only`; no public URL or service percentage is added.
- Source depth increases **2 → 6** using current Fortress product/FAQ, the linked 3HK registration flow, the retained 2026 retail/retention community report, and two exact Telegram verification reports.
- Current acquisition is **HK$50 with HK$50 stored balance**. Current lifecycle remains **365 days**, renewed by a **≥HK$10 top-up** for another 365 days. Buying a data package does **not** extend validity.
- haha SIM remains **physical-only**. Hong Kong local service requires real-name registration; applicable travel-document details are accepted, while reviewed official material does not establish a guaranteed mainland-China-first activation path.
- Roaming SMS/voice draws from stored balance. Two independent Telegram registration-verification observations normalize to **n=2 / grade C (Mixed / weak)**: one failure and one failure-then-success. The sample is below the percentage threshold, so no success rate is published or inferred.
- Current Fortress material also warns that RNR verification failures can suspend call/SMS service and recycled numbers can retain third-party platform history. `guideEligible=false`.
- Source corpus becomes **721**; canonical/publication counts remain **160 routes / 87 markets / 157 brands / 117 networks**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## JUST COMPLETED — Digi / CelcomDigi prepaid retention / foreign-registration / roaming maintenance

- Existing `digi-reload-validity-my-2026` stays `admitted` + `backstage-only`; no public URL or service percentage is added.
- Source depth increases **2 → 10** using current CelcomDigi prepaid/Kuning/activation/eSIM/roaming material, the Malaysian mandatory-registration source, and one historical independent Digi roaming-SMS report.
- The stale **RM10 starter** metric is removed. Current Kuning documentation confirms a **RM5 one-time activation charge**, but no current first-party source establishes a universal lowest complete starter cost, so acquisition remains unnormalized.
- The current general Digi reload page still documents **RM100 = 120 days** and **RM198 = 365-day validity extension**. The Kuning-specific reload FAQ does not repeat RM198/365, so that annual extension is retained as eligibility-sensitive rather than universal.
- Current Kuning lifecycle has a **60-day receive-only grace period** before termination/recycling; legacy Digi lifecycle documents differ and are not flattened into the new Kuning profile.
- From **26 August 2026**, foreign Non-MyKad prepaid customers require authorized-dealer registration, original ID and valid student-visa/work-permit information. Tourist SIMs are capped at **three months** by Malaysia's mandatory standard.
- eSIM remains supported, but fully remote new prepaid eSIM signup for foreign Non-MyKad users is not established.
- Current provider roaming material explicitly supports existing-number OTP use overseas and lists China; one historical independent Digi Prepaid report supports roaming SMS/banking-OTP continuity in Singapore. No mainland-China app/bank success rate is invented. `guideEligible=false`.
- Source corpus becomes **728**; canonical/publication counts remain **160 routes / 87 markets / 157 brands / 117 networks**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## JUST COMPLETED — homepage Phone hero proportion repair

- User screenshot exposed a desktop balance regression: five-line H1, oversized left visual weight and a vertically sunken decision panel.
- Root cause was the 1080px shell combined with a near-even two-column split, 64px gap and H1 scaling up to 5.55rem.
- Desktop hero now uses a flexible left column + fixed 480px panel, 52px gap, 720px copy ceiling and a lower H1 scale ceiling.
- Measured at an effective 1252px CSS viewport after build: H1 is **3 lines** at ~62.6px and the panel top is ~155px.
- Existing ≤980px single-column/mobile behavior is preserved.
- `scripts/test-home-hero-balance.mjs` is wired into Eval Gate so the old proportions cannot silently return.

## JUST COMPLETED — Search Console indexing hygiene repair

- Gmail reported two new 2026-10-07 Search Console issues: sitemap-discovered `404` and `Indexed, though blocked by robots.txt`.
- Production audit proves the current sitemap itself is healthy: **31/31 URLs return 200**.
- Robots/discovery mismatch found: TikTok exposed `/api/tiktok/auth` as a normal link while `/api/` blocked Google from observing its existing `X-Robots-Tag: noindex`; legacy `/api/mcp` and `/mcp` return 404 but were also hidden from crawlers.
- Repair keeps generic `/api/` blocked while allowing the specific noindex/terminal paths to be crawled; TikTok Connect becomes a click-only button rather than an API href.
- New `scripts/test-indexing-contract.mjs` is wired into Eval Gate after the production build and fails on sitemap URLs without built HTML, API/MCP sitemap leakage, robots-rule regression, or a crawlable TikTok OAuth anchor.
- No new public URL, Phone page, or sitemap entry is created; publication remains **31 sitemap URLs**.

## JUST COMPLETED — e& UAE Wasel acquisition / lifecycle / KYC / roaming maintenance

- Existing `etisalat-wasel-ae-2026` stays `admitted` + `backstage-only`; no public URL or service percentage is added.
- Source depth increases **2 → 11** using current e& Wasel product/terms/eSIM/roaming/Visitor-Line material plus two retained historical community reports.
- Current online acquisition is **AED40 with AED40 pre-loaded credit**. It is stored as the current offer rather than a permanent historic connection-fee baseline.
- Current lifecycle is **90 days of qualifying activity**. A local SMS is currently **AED0.19**, giving a lowest controllable local keep path of about **AED0.76/year**. Rest-of-world outgoing roaming SMS is AED2. With no qualifying activity and sufficient balance, e& applies an **AED10/90-day inactivity debit**; after suspension the number is retained for **one year**.
- Regular Wasel requires a valid **Emirates ID**. Visitors use a separate Visitor Line, and current eSIM help requires **physical UAE presence** to request or activate eSIM.
- Official evidence confirms free incoming roaming SMS and prepaid recharge abroad. One 2024 exact-Wasel report records UAEPass OTP success overseas, with a 2023 Wasel discussion as historical corroboration; no mainland-China bank/app success percentage is created.
- `guideEligible=false`; service observations remain empty. Source corpus becomes **737**; canonical/publication counts remain **160 routes / 87 markets / 157 brands / 117 networks**, **135 comparison / 3 indexable / 31 sitemap URLs**.
- `npm run phone:data:check`, full frontend build, Phone public-release audit and `git diff --check` pass.

## JUST COMPLETED — CMHK 4G MySIM current maintenance

- Existing `cmhk-mysim-hk-2026` remains `admitted` + `backstage-only`; its historical comparison row remains present and no standalone route URL/indexability/sitemap entry is added.
- Current acquisition is corrected **HK$33 → HK$38** using the current 7-Eleven Hong Kong listing.
- Current MySIM terms confirm recharge-based validity extension. The standing CMHK official refill table plus exact-route independent corroboration preserve **HK$50 / 180 days (~HK$100/year)** with an explicit verify-at-refill caveat.
- **4G MySIM is eligible for physical-prepaid-to-eSIM exchange**; direct new-line eSIM purchase for this exact product remains unverified.
- From **2026-06-17**, CMHK prepaid cannot first-activate in Mainland China; OFCA RNR still applies and valid travel document/passport is supported for users without HKID.
- Overseas evidence stays bounded: one historical exact-4G Shenzhen ordinary/account-SMS success plus one adjacent MySIM-5G OTP/e-banking success report. No exact 4G bank/app success percentage is created. Current MySIM roaming data also carries a HK$15 daily-connection charge risk.
- `guideEligible=false`; source depth increases **2 → 12**; canonical becomes **160 routes / 87 markets / 157 brands / 117 networks / 747 sources**. Public boundary remains **135 comparison / 3 indexable / 31 sitemap URLs**.
- PR **#415** squash-merged as `4ab3dc5ea8100a60100ae097716b29a867b3c242`; CI **#306 PASS**, Eval Gate **#1224 PASS**, Vercel Preview PASS, production deployment `dpl_8FRi8vfn5vMUasGf1BeaFvjha8oV` **READY**.
- Production verification: CMHK lazy detail JSON HTTP 200 with 12 sources / HK$38 acquisition / HK$100 yearly keep / 180-day interval; summary JSON HTTP 200 with **160 routes**; standalone CMHK route remains HTTP 404; sitemap remains **31 URLs** and contains no CMHK route.

## JUST COMPLETED — MTN Nigeria Keep My Number maintenance

- `mtn-ng-keepmynumber-2026` remains `admitted` + `backstage-only`; its existing comparison-visible row remains and no standalone/indexable route is added.
- Current Keep My Number pricing remains **NGN3,500/1y, NGN5,000/2y, NGN7,500/3y**; the 3-year term annualizes to **NGN2,500/year**.
- NCC Quality of Service Business Rules 2026 add a separate ordinary-prepaid lifecycle: six months without RGE may trigger deactivation, another six months may lead to number loss; parked numbers count as RGE, bare recharge alone does not, and 14-day alternative-means pre-churn notice is required. MTN's current prepaid terms separately state a 365-day no-RGE rule; preserve the conflict.
- Current eSIM setup requires an MTN-store eligibility check and QR provisioning. Visitors staying under 24 months can use a valid visa plus international passport/travel document instead of NIN.
- Current roaming material supports prepaid roaming and lists China but does not establish exact incoming-SMS/bank-app OTP reliability.
- A 2026-08-31 independent Nairaland report records number reassignment despite the user's reported KMN subscription and recharge. Keep it as one continuity incident; do not manufacture a failure probability.
- Source depth increases **2 → 9**; Phone source corpus becomes **754**. Canonical remains **160 routes / 87 markets / 157 brands / 117 networks**; publication remains **135 comparison / 3 indexable / 31 sitemap URLs**.
- PR **#418** squash-merged as `1c0e44d7b90e8924306286ee58b75d8d63f77e2d`; CI **#310 PASS**, Eval Gate **#1232 PASS**, Vercel Preview PASS, and post-merge Vercel production status **success**.
- Maintenance record: `docs/PHONE_MTN_NG_MAINTENANCE_2026-10-08.md`.

## JUST COMPLETED — MTS Russia retention maintenance

- `mts-sokhranyayu-nomer-2026` remains `admitted` + `backstage-only`: 2 → 12 sources, no public page or OTP percentage. The current RUB349/6-month add-on auto-renews if funded; the ordinary no-fee RUB1.5/day/30-day inactivity clock is separate.
- Foreign KYC/Gosuslugi/biometrics, Russia-only first eSIM activation, payment limitations, conditional 24-hour SMS restrictions and adjacent independent roaming complaints are explicit. Archived one-time Номер навсегда remains unverified for current sale.
- Phone corpus: **754 → 764 sources**; **160 canonical routes / 135 comparison / 3 indexable / 31 sitemap** unchanged.
- Ledger: `docs/PHONE_MTS_RU_MAINTENANCE_2026-10-08.md`.
- Release verification: PR **#420** squash-merged as `2b798504c5e89487e98a756be8cbf48355400c51`; CI run **#37714829212 PASS**, Eval Gate **#37714829243 PASS**, Vercel Preview **PASS**, production deployment `dpl_3tyvVTauFvvpk2ebEwNfKq6Qg6km` **READY** at the merged SHA. Live MTS detail **HTTP 200 / 12 sources / RUB698 annual keep**, summaries **HTTP 200 / 160 routes**, Phone hub **HTTP 200**, and standalone MTS route **HTTP 404**. Production remained non-indexable.

## JUST COMPLETED — O2 Czech GO prepaid route maintenance

- `o2-cz-prepaid-2026`: source depth **2 → 9**, using effective 2026-10-05 official tariff, retail and recharge policies, prepaid eSIM/store replacement, roaming facts, generic regulator KYC context and an independent Prague shop report.
- Baseline **CZK99 starter + CZK100 credit**; **CZK29/day** only after outbound call/data, not passive ordinary SMS. Minimum **CZK300 top-up / 12 months** preserves number but CZK300–499 credit expires in **6 months**. This is prepaid funding, not a fixed service fee.
- Prepaid eSIM conversion needs O2 shop/ID/PUK (standard CZK99 exchange); overseas-first new eSIM remains unverified. Online top-up requires a Europe-issued internet-enabled card; store cash/card accepted. Incoming roaming SMS free but Wi-Fi Calling cannot carry SMS; no exact China bank/OTP sample.
- Route stays admitted/backstage-only; **160 canonical, 771 sources, 135 comparison, 3 indexable, 31 sitemap**. No application success percentage and no new SEO URL. Ledger: `docs/PHONE_O2_CZ_MAINTENANCE_2026-10-08.md`.
- Verified release: PR **#422** squash-merged as `0f5e4a9d4dd398772ccf11eb86d46c1909dc57ad`; CI run **#37717592877 PASS**, Eval Gate **#37717592832 PASS**, Vercel Preview **PASS**, production deployment `dpl_GEnUj4uj8uFSQmJAbpCbUkAyL4Ry` **READY** at the merged SHA. Live Phone hub **HTTP 200**, O2 lazy detail **HTTP 200 / 9 sources / CZK300 normalized yearly top-up / physical+eSIM**, route summaries **HTTP 200 / 160 routes**, live sitemap **HTTP 200 / 31 URLs and no O2 independent entry**. Standalone O2 route HTTP status was not independently measured.

## JUST COMPLETED — Telstra Australia Pre-Paid Casual HOLD maintenance (released)

- Existing `telstra-prepaid-longexpiry-2026` changes no canonical identity, HOLD/admission state or publication boundary.
- Corrected 12-month retention from **AUD395 data-rich Mobile plan** to the separate **AUD74/12-month Casual** option; current AUD44/6-month Casual exists, while AUD200/6-month and AUD395/12-month Mobile are more expensive data-oriented products.
- Telstra documents **six months recharge-only rescue** after a prepaid recharge expires, then service deactivation/number loss. Only incoming calls are explicit in this rescue wording; do not claim incoming rescue-period OTP.
- Prepaid physical SIM/eSIM and international-passport form option are documented. China-first activation, foreign payment and exact China bank/app incoming-SMS reliability are unproven. Independent 2026 roaming reports are mixed and a 2025 pack-purchase failure is recorded as one operational incident.
- **1 → 9 sources**, 5 new events, zero exact service observations; canonical **160 routes / 87 markets / 157 brands / 117 networks / 779 sources**. Public boundary stays **135 comparison / 3 indexable / 31 sitemap**.
- Ledger: `docs/PHONE_TELSTRA_AU_MAINTENANCE_2026-10-08.md`. PR #424 squash-merged as `45a493ef3d298d93e83c8be1b4b6645e3da83461`; CI #317 / run #37727084961 **PASS**; Eval Gate #1246 / run #37727084894 **PASS**; Vercel Preview `dpl_AnZaszg9z5XQ82tyW3H68t65jXSr` **READY**; production `dpl_28YFSRi1iy2LSmnwEQf8QzhFt5kh` **READY** at merged SHA with `aineedhelpfromotherai.com` assigned as alias. Public JSON HTTP response was not independently read, so no direct live-route/content/sitemap HTTP check is claimed.

## JUST COMPLETED — Claro Brazil Pre-Paid evidence correction (release pending)

- Existing `claro-pre-br-90d-2026` remains **HOLD/backstage-only**. Old R$15/90-day and R$60/year estimates are superseded by Claro's official **R$35/90-day** recharge and **R$140/360-day** normalized commitment; exact new-line acquisition cost is unresolved/null.
- Provider cancellation wording conflicts about whether 90 days is measured from last recharge or last recharge-credit expiry; later 180-day reassignment is separate. Do not invent a safe grace interval.
- Current Claro policy says **no international roaming on prepaid** or Controle, so do not portray overseas SMS/OTP as available merely because postpaid incoming SMS is free. Current eSIM/foreign registration requires a Brazil store for passport users; independent foreign-store refusal, Portugal eSIM first-activation failure and prepaid roaming failure reports are explicit but not universal statistics.
- **1 → 13 sources**, six new events, zero app-level observations; canonical **160 routes / 87 markets / 157 brands / 117 networks / 791 sources**, no publication expansion (**135 comparison / 3 indexable / 31 sitemap**).
- Ledger `docs/PHONE_CLARO_BR_MAINTENANCE_2026-10-08.md`; generated artifacts and regression added, pending CI/Eval/Preview/production release gates.

## NEXT — continue database maintenance, no invented expansion

1. **Immediate bounded route:** `asda-mobile-uk-2026` (Wave B HOLD), after Claro release verification: confirm exact current prepaid SKU, acquisition/retention lifecycle, KYC/eSIM, foreign payment/roaming SMS and independent number continuity.
2. **Search Console gate:** publication remains held until the explicit measurement gate is met; database maintenance continues independently.
3. **Database expansion:** current known evidence-qualified atomic universe is 160/160; reopen only when review exposes another genuinely distinct product/route. Do not create DB-C24 merely to raise counts.
4. **Data-eSIM:** keep append-only community intake separate from Phone-number canonical.
5. **Frontend:** no new URL or redesign from this maintenance work.

Delegated Qwen/Kimi output remains `RESEARCH_CANDIDATE` until coordinator review and cannot bypass evidence/admission/publication gates.


## PLANNED — Phone database evidence-hardening backlog

Work this backlog **one bounded route per session**. It is maintenance, not count expansion. Preserve HOLD/needs-reconciliation when evidence is still insufficient; no item below authorizes a public URL, ranking promotion or sitemap change.

### Wave A — admitted but thin evidence

After the immediate MTN task, deepen the remaining admitted routes with only two canonical sources:

1. `mtn-ng-keepmynumber-2026` — **DONE 2026-10-08**; 2 → 9 sources, current lifecycle/eSIM/KYC/continuity reconciled.
2. `mts-sokhranyayu-nomer-2026` — **DONE 2026-10-08**; 2 → 12 sources.
3. `o2-cz-prepaid-2026` — **DONE 2026-10-08**; 2 → 9 sources, current economy/activation/eSIM/payment/roaming boundaries reconciled.

Done condition per route: current provider-controlled economics/lifecycle/eligibility reconciled; activation/KYC/eSIM/payment/roaming-SMS boundaries explicit; independent operational evidence added when making real-world continuity/OTP claims; generated artifacts and regression checks pass.

### Wave B — HOLD routes with only 1–2 sources

First eligible: `asda-mobile-uk-2026` (one bounded route per session, after Claro PR passes production release gates).

Maintain in evidence-value order rather than country-completion order:

- `telstra-prepaid-longexpiry-2026` — **DONE / RELEASED 2026-10-08**, 1 → 9 sources, AUD74/12-month Casual path, 6-month rescue, still HOLD.
- `claro-pre-br-90d-2026` — **DONE EVIDENCE / RELEASE PENDING 2026-10-08**, 1 → 13 sources, R$35/90-day and prepaid roaming unavailable, remains HOLD.
- `asda-mobile-uk-2026`
- `free-mobile-fr-2026`
- `good2go-payg-ca-2026`
- `o2-uk-classic-payg-6mo-2026`
- `singtel-hi-prepaid-passport-30d-2026`
- `truemove-validity-pack-th-2026`
- `turkcell-tourist-90d-blocker-2026`
- `viettel-vtvang-keepnumber-2026`
- `vodafone-callya-90d-2026`

These remain HOLD unless the blocker is actually resolved. Source-count growth alone is not promotion evidence.

### Wave C — legacy needs-reconciliation cleanup

Eleven canonical legacy rows still lack normalized current-profile snapshots and must be reconciled, aliased/suppressed, reclassified or explicitly retained:

- `5sim-temp`
- `a1-croatia-prepaid-esim`
- `activatex-temp`
- `h2o-paygo-us`
- `mobal-japan-data-physical`
- `mobal-japan-voice-data`
- `sakura-japan-voice-data`
- `smspool-temp`
- `tello-us`
- `trip-cmlink-china-data`
- `ultra-paygo-us`

Do not count same-product aliases as new atomic routes. Prefer explicit alias/reconciliation cleanup over keeping duplicate legacy identities indefinitely.

### Cross-cutting field debt

Audit baseline before this queue update: 149/160 routes have current-profile snapshots; 11 do not. Among normalized profiles, unresolved states remain in roughly 18 acquisition/landed-cost records, 9 keep/retention records and 47 roaming-SMS records. These counts are maintenance indicators, not a mandate to manufacture answers. Resolve only with evidence; otherwise preserve explicit unknown/uncertain state.

Re-run the thin-route/field-debt audit after each small maintenance wave and update this queue from actual canonical data. Broad DB expansion remains closed unless genuinely new evidence-qualified atomic routes appear.

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
