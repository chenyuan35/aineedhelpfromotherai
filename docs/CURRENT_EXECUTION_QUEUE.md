# Current Execution Queue

Last updated: 2026-10-03

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally a short atomic queue, not a historical log; completed detail belongs in Git history, PRs and task-specific docs.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Frontend visual baseline stays stable.** PR #342 remains the released Phone-first homepage/Phone hub identity; do not add another design layer without a reproduced defect or measured need.
3. **Backend coverage target is met.** DB-C21, DB-C22 and DB-C23 are released. Current normalized Phone state is **156 routes / 86 markets / 153 brands / 116 networks / 593 sources**.
4. **Known evidence-qualified database coverage is 98.1%.** `docs/PHONE_DATABASE_COVERAGE_AUDIT_2026-10-03.md` defines the denominator: 156 canonical routes plus three distinct unresolved atomic candidates. This is coverage of the relevant low-cost/long-term evidence-qualified Phone route universe, not 98.1% of every carrier/SIM SKU worldwide.
5. **Broad database expansion stops here.** Do not create DB-C24 from carrier directories, country completion pressure or keyword/page-count pressure. New DB batches require a genuinely distinct evidence-qualified route or a documented residual blocker to clear.
6. **Public/SEO publication remains separate.** Current public boundary is **135 comparison routes / 3 explicit indexable routes / 31 sitemap URLs**. Backend admission does not create a route page or ranking.
7. **Data-eSIM remains separate backstage data.** Current state remains **59 source-label providers / 73 evidence records / 159 versioned offers**; no automatic Phone linkage or publication.
8. AI Reset Radar stays frozen; Relay Exit Risk stays data-accrual only.

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Database coverage execution: `docs/PHONE_DATABASE_COVERAGE_EXECUTION_2026-09-29.md`.
Coverage closeout: `docs/PHONE_DATABASE_COVERAGE_AUDIT_2026-10-03.md`.
Data-eSIM backstage contract: `data/esim/README.md` + `data/esim/v1/manifest.json`.

## JUST COMPLETED — DB-C21

PR #366 squash-merged as `b5d686031b3c8808f65c705c93b8d9910416f856`.

- `fortress-hahasim-hk-2026` — **ADMIT-BACKSTAGE**.
- `csl-711-prepaid-hk-2026` — **HOLD** because the current provider page conflicts on 180-day versus promotional 365-day recharge validity.
- `tunetalk-365-my-2026` — **HOLD** because the current 365-day validity mechanism is not safely generalizable to 2026 tourist-registered users.
- Post-release state: **151 routes / 86 markets / 148 brands / 114 networks / 574 sources**.
- Public boundary unchanged.

## JUST COMPLETED — DB-C22

PR #367 merged as `a7feae58c048afc59af37a086292989cdd47e8fe`; CI #234, Eval Gate #1088 and Vercel passed.

- `cmlink-uk-keep-number-2026` — **HOLD**. GBP15/365-day keep-number product is current, but enrollment, post-expiry closure timing and mainland-China operations remain constrained.
- `dito-prepaid-ph-2026` — **HOLD**. Strong 2026 community low-cost retention signal exists, but tourist-registration/Traveler-SIM rules and the PHP5/PHP10 annual keep claim are not provider-reconciled.
- `ais-local-prepaid-th-2026` — **HOLD**. Distinct from SIM2Fly; provider validity increments and passport eSIM handling exist, but cheap durable annual mechanics and remote/China behavior remain unsettled.
- Post-release state: **154 routes / 86 markets / 151 brands / 115 networks / 587 sources**.
- Public boundary unchanged.

## JUST COMPLETED — DB-C23 and coverage threshold

PR #368 squash-merged as `2d0d727af1f18844b6c344a9402d62de5366dd61`; CI #237, Eval Gate #1092, Vercel Preview and post-merge Vercel production passed.

- `esimgg-estonia-372-2026` — **ADMIT-BACKSTAGE**. Current provider supports a prepaid +372 phone-number eSIM with calls/SMS and an annual-use keep rule; 2026 community evidence supports China-side operation while preserving prefix-dependent OTP failures.
- `hkmobi-365-hk-2026` — **ADMIT-BACKSTAGE**. Current csl HK Mobi mechanism supports HKD20/365-day renewal under the published promotion through 2026-12-31; real-name registration and post-promotion revalidation remain explicit.
- Current canonical: **156 routes / 86 markets / 153 brands / 116 networks / 593 sources**.
- Coverage audit: **156 / 159 = 98.1%** of the known evidence-qualified relevant route universe.
- Residual candidates kept out of canonical pending bounded review: LuckySIM Hong Kong, Saily U.S. phone number, China Telecom Macau / Macau blue-card route.

## NEXT — Backend ↔ frontend integration audit

The user's product requirement is that database growth should not require hand-editing the frontend. The next bounded task is therefore an architecture/product audit, not another broad database batch.

Verify all of the following against current `main` and production:

1. whether the generated frontend runtime artifacts are built directly from canonical Phone data with no manual duplicate-maintenance step;
2. whether all **156 canonical routes** are available to the user-triggered finder/search path, or whether the UI is still hard-limited to the historical **135 comparison routes**;
3. if 21 canonical routes are backstage-only, distinguish **not indexable** from **not user-queryable** — publication policy should control SEO/detail pages, not silently make useful database rows unreachable;
4. HOLD routes must never be presented as confident recommendations, but they may be queryable with explicit uncertainty/constraints if the product contract allows it;
5. preserve one canonical Phone URL, lazy/progressive loading and the existing 3-route SEO allowlist unless evidence supports changing publication;
6. prove that a future reviewed canonical route can flow into the user-queryable data layer through the build pipeline without bespoke frontend edits.

If this audit finds a real disconnect, fix only the minimum data-pipeline/UI boundary needed to connect canonical data to the existing finder. Do not redesign the site.

## PARALLEL — Evidence maintenance

Continue append-only community/provider evidence acquisition for existing Phone routes and the separate Data-eSIM layer. Re-open a DB batch only on a genuinely new distinct route or when one of the residual candidates clears its blocker.

Delegated Qwen/Kimi output remains `RESEARCH_CANDIDATE` until coordinator review. DB-C23's parallel Kimi research completed successfully and agreed with the coordinator on the two reviewed candidates, but the canonical packets intentionally kept more conservative claims where worker evidence was more aggressive.

## Measurement wait

Search Console remains the public expansion gate. The last settled Phone checkpoint remains **5 impressions / 0 clicks through 2026-09-28**, with a small non-finalized 2026-09-29..30 sample after that.

Re-read first-party Search Console data when either:

- settled Phone impressions reach **20**, or
- finalized data reaches **2026-10-05**.

This wait does not block backend↔frontend integration auditing or evidence maintenance.

## External waits

- TikTok — Direct Post Content Posting API reapplication was submitted 2026-10-02; do not resubmit unless TikTok rejects or asks for more evidence.
- Authority / AI discovery — follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; verify any claimed citation/link independently.
- AI-native retrieval — follow `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md`; do not bypass provider quota/auth blockers.

## Do not do next

- do not create DB-C24 just to increase counts;
- do not equate 98.1% with a census of all worldwide carrier products;
- do not turn backend rows into SEO pages automatically;
- do not keep useful canonical rows unreachable merely because they are not indexable — audit that boundary first;
- do not auto-rank HOLD routes;
- do not mix pure data eSIM into Phone-number canonical routes without reviewed identity linkage;
- do not redesign backend/schema or frontend merely for neatness;
- do not let delegated output bypass review/admission gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
