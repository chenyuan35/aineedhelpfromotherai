# Current Execution Queue

Last updated: 2026-10-05

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is the short atomic queue.

## Current decision

1. **Phone Radar remains the active primary growth product.**
2. **Backend coverage target is met:** 159 canonical routes / 87 markets / 156 brands / 117 networks / 633 sources; current known evidence-qualified relevant atomic-route coverage is **159/159** after the bounded Saily, LuckySIM and China Telecom Macau residual admissions. This is not a census of every worldwide carrier SKU.
3. **Backend ↔ frontend integration is released.** PR #370 / `46ac86e04e97f67d7a6fb3f9e1cf700fa237197a` established generated `phone-route-summaries.json` plus lazy `phone-route-data/<id>.json`; the current finder now carries all 159 canonical rows.
4. **Uncertainty remains explicit.** HOLD and needs-reconciliation rows are queryable evidence, not confident recommendations; admitted rows rank ahead of unresolved states. Known same-product legacy aliases are suppressed from duplicate market rendering.
5. **Publication remains separate:** 135 historical comparison routes / 3 explicit indexable route pages / 31 sitemap URLs. PR #370 created no new SEO URL or sitemap entry.
6. **Broad DB expansion stops.** Do not create DB-C24 from carrier directories, country-completion pressure, keyword counts or page-count pressure.
7. **Data-eSIM remains separate backstage data:** 59 source-label providers / 73 evidence records / 159 versioned offers.

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

- Existing route: `h2o-paygo-10-90d-2026`, real-mobile AT&T-route PayGo at **US$10 / 90 days**, already `backstage-only` / `hold`.
- Added three independent route-level sources: current PrepaidCompare plan profile, a June 2024 community PayGo/Wi-Fi-Calling report, and a 2026 China-use guide.
- Evidence is materially conflicting: historical community evidence reports PayGo Wi-Fi Calling and activation outside the U.S.; current PrepaidCompare says Wi-Fi Calling is monthly-plan only; the 2026 China-use guide reports recurring support resets. Current H2O terms continue to frame service as personal use in the U.S. only and PayGo is not treated as an international-roaming route.
- Preserve `hold` + `backstage-only`. Do **not** create an app/service percentage: the reviewed packet contains route-level continuity evidence, not five exact app + operation observations.
- Source corpus becomes **633**. Canonical remains **159 routes / 87 markets / 156 brands / 117 networks**; public boundary remains **135 comparison / 3 indexable / 31 sitemap URLs**.

## NEXT — Measurement + one-route evidence maintenance, no invented expansion

1. **Search Console gate:** publication remains held until settled Phone impressions reach 20 or finalized data reaches 2026-10-05. Re-read when the gate is actually available; do not expand publication before then.
2. **Next database task:** review one existing low-cost/high-value route with thin service evidence. Start with `tello-paygo-credit-2026` as the next bounded candidate because it is real-mobile, admitted/backstage-only, has six current route sources but zero normalized service observations. Require exact route + app/service + operation evidence; if the evidence is only route-level, record it as route/event maintenance rather than manufacturing a service percentage.
3. **Database expansion:** no currently known evidence-qualified atomic residual remains outside canonical; reopen only for a genuinely new evidence-qualified route.
4. **Data-eSIM:** continue append-only community intake separately; do not mix pure data eSIM into Phone-number canonical without reviewed identity linkage.
5. **Frontend:** keep PR #342 visual baseline and PR #370 finder path stable; no new URL or redesign without measured/reproduced need.

Delegated Qwen/Kimi output remains `RESEARCH_CANDIDATE` until coordinator review and cannot bypass evidence/admission/publication gates.

## External waits

- TikTok — Direct Post Content Posting API reapplication submitted 2026-10-02; do not resubmit unless TikTok rejects or requests evidence.
- Authority / AI discovery — follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; verify claimed citations/links independently.
- AI-native retrieval — follow `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md`; do not bypass provider quota/auth blockers.

## Do not do next

- do not create DB-C24 merely to increase counts; Saily, LuckySIM and Macau were bounded residual exceptions only because their documented blockers cleared;
- do not equate 159/159 current-known coverage with all global carrier products;
- do not automatically turn canonical rows into SEO pages;
- do not auto-rank HOLD/needs-reconciliation as recommendations;
- do not mix pure data eSIM into Phone-number canonical without reviewed identity linkage;
- do not redesign the frontend without measured/reproduced need;
- do not let delegated output bypass evidence/admission/publication gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
