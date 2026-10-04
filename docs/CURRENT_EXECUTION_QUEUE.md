# Current Execution Queue

Last updated: 2026-10-04

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is the short atomic queue.

## Current decision

1. **Phone Radar remains the active primary growth product.**
2. **Backend coverage target is met:** 157 canonical routes / 86 markets / 154 brands / 116 networks / 599 sources; audited known evidence-qualified relevant-route coverage is **157/159 = 98.7%** after the bounded Saily residual admission. This is not a census of every worldwide carrier SKU.
3. **Backend ↔ frontend integration is released.** PR #370 / `46ac86e04e97f67d7a6fb3f9e1cf700fa237197a` established generated `phone-route-summaries.json` plus lazy `phone-route-data/<id>.json`; the current finder now carries all 157 canonical rows.
4. **Uncertainty remains explicit.** HOLD and needs-reconciliation rows are queryable evidence, not confident recommendations; admitted rows rank ahead of unresolved states. Known same-product legacy aliases are suppressed from duplicate market rendering.
5. **Publication remains separate:** 135 historical comparison routes / 3 explicit indexable route pages / 31 sitemap URLs. PR #370 created no new SEO URL or sitemap entry.
6. **Broad DB expansion stops.** Do not create DB-C24 from carrier directories, country-completion pressure, keyword counts or page-count pressure.
7. **Data-eSIM remains separate backstage data:** 59 source-label providers / 73 evidence records / 159 versioned offers.

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Coverage audit: `docs/PHONE_DATABASE_COVERAGE_AUDIT_2026-10-03.md`.
Saily residual review: `docs/PHONE_SAILY_US_NUMBER_REVIEW_2026-10-04.md`.
Saily release closeout: `docs/PHONE_SAILY_US_NUMBER_ADMISSION_CLOSEOUT_2026-10-04.md`.

## JUST COMPLETED — Canonical finder integration

PR #370 squash-merged as `46ac86e04e97f67d7a6fb3f9e1cf700fa237197a`.

- Final PR diff: only `frontend/tools/phone-number-lifecycle-mvp/index.html` and `scripts/test-phone-number-public-release.mjs`.
- Eval Gate #1119: **PASS**.
- Vercel Preview and post-merge production: **SUCCESS**.
- Live Phone hub: HTTP 200 and contains the canonical finder integration.
- At the PR #370 release baseline, live `phone-route-summaries.json` was HTTP 200 with **156 routes = 149 long-term / 5 temporary / 2 data**; the Saily residual admission extends the same path to 157/150/5/2 without changing SEO publication.
- Live eSIM.GG lazy detail JSON: HTTP 200.
- Local/public regression covers eSIM.GG backstage detail, CMLink HOLD warning, Mobal Data, Turkcell Temporary and Sakura same-product alias dedupe.
- Public SEO boundary remains **135 comparison / 3 indexable / 31 sitemap**.

## JUST COMPLETED — Saily residual HOLD admission

PR #379 squash-merged as `045a114acb97c11acd1f56f234056d2e9d603efe`.

- `saily-us-phone-number-2026` is normalized as `family=long-term`, `numberClass=voip-second-line`, `surfaceState=backstage-only`, `evidenceState=hold`; it is not mapped to a cellular network.
- Current economics: **US$1.99/month** number subscription/reservation; KYC required; port-in/port-out unsupported.
- Mixed reliability is preserved: provider warns some services reject VoIP OTP; current community evidence includes WhatsApp activation success, iMessage activation failure and an August 2026 phone-number/SMS operational failure report.
- Canonical is now **157 routes / 86 markets / 154 brands / 116 networks / 599 sources**; finder family totals are **150 long-term / 5 temporary / 2 data**.
- Publication stays **135 comparison / 3 indexable / 31 sitemap**; no Saily standalone route URL or publication-policy entry is created.
- Eval Gate #1138 and CI #246: **PASS**; Vercel Preview and post-merge production: **SUCCESS**.
- Live verification after merge: Phone hub HTTP 200; `phone-route-summaries.json` HTTP 200 with **157 routes** and Saily present; Saily lazy detail JSON HTTP 200 with `voip-second-line` / `backstage-only` / `hold`; standalone Saily route URL HTTP 404; sitemap HTTP 200 with **31 URLs** and no Saily entry.
- `npm run phone:data:check`, the Saily migration regression, frontend build, public-release audit and `git diff --check` pass locally.

## NEXT — Measurement + maintenance, no invented expansion

The next coordinator action is measurement or evidence maintenance, whichever trigger is actually available:

1. **Search Console gate:** 2026-10-04 Windsor.ai re-read shows settled Phone data through **2026-09-29** with **8 impressions / 0 clicks**. Fresh/non-finalized Phone data through **2026-10-03** adds **10 impressions / 0 clicks**. The publication gate is **not met**: settled Phone impressions remain below 20 and finalized data has not reached 2026-10-05. Re-read when either condition is met; do not expand publication before then.
2. **Evidence maintenance:** continue append-only community/provider evidence acquisition for existing Phone routes and separate Data-eSIM.
3. **Residual routes:** LuckySIM Hong Kong and China Telecom Macau / Macau blue-card remain outside canonical until their existing lifecycle/renewal blockers clear. Do not replace their evidence gaps with inference.
4. **Frontend:** keep PR #342 visual baseline and PR #370 finder data path stable; fix only reproduced usability defects or measured weak behavior.

Measurement note: Windsor.ai `force_refresh` was blocked by the current trial plan's hourly-refresh restriction. Standard cached Search Console reads succeeded; treat the refresh restriction as a provider-plan limitation, not a site-data conclusion. Do not upgrade/pay without authorization.

Delegated Qwen/Kimi work remains `RESEARCH_CANDIDATE` until coordinator review. The PR #370 read-only Kimi audit confirmed the then-current canonical↔135 comparison disconnect and existing lazy-detail infrastructure; it did not change canonical/publication state.

## External waits

- TikTok — Direct Post Content Posting API reapplication submitted 2026-10-02; do not resubmit unless TikTok rejects or requests evidence.
- Authority / AI discovery — follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; verify claimed citations/links independently.
- AI-native retrieval — follow `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md`; do not bypass provider quota/auth blockers.

## Do not do next

- do not create DB-C24 merely to increase counts; Saily was a one-route exception only because its documented residual classification blocker cleared;
- do not equate 98.7% with all global carrier products;
- do not automatically turn canonical rows into SEO pages;
- do not auto-rank HOLD/needs-reconciliation as recommendations;
- do not mix pure data eSIM into Phone-number canonical without reviewed identity linkage;
- do not redesign the frontend without measured/reproduced need;
- do not let delegated output bypass evidence/admission/publication gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
