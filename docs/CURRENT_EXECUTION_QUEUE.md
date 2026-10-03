# Current Execution Queue

Last updated: 2026-10-03

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally a short atomic queue, not a historical log; completed detail belongs in Git history, PRs and task-specific docs.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Frontend baseline stays stable.** PR #342 remains the released Phone-first homepage/Phone hub identity; do not add another public design layer without measured behavior or a reproduced defect.
3. **Backend database coverage and public/SEO publication remain separate tracks.** Canonical/database admission never authorizes an indexable URL by itself.
4. Current released Phone state is **135 comparison routes / 148 canonical normalized routes / 86 markets / 145 brands / 114 networks / 565 sources / 3 indexable routes**. DB-C20 adds three post-legacy routes outside the 135-route comparison artifact; the legacy same-ID overlap remains 134 with the intentional Sakura alias gap unchanged.
5. **DB-C20 is merged to `main` via PR #360 / `c6f5ec5e34797745b1d6738ae8936a02510601c2`.** Vodafone Netherlands Prepaid and One NZ Prepay are ADMIT-BACKSTAGE; CTExcel UK is HOLD with its retention conflicts preserved. CMLink UK and DITO Philippines remain deferred behind the gap audit's explicit evidence/eligibility re-open conditions.
6. **Data-eSIM remains a separate normalized backstage family.** PR #328 preserves **59 source-label providers / 72 evidence records / 159 versioned offers** under `data/esim/v1`; PR #362 (`86060c1d5e01f460d168005f74b6e3cd0c820478`) resolves the public Linux.do provenance of the existing Oct 1 later-delta through manifest-level `resolvedSource` metadata without mutating the raw snapshot. It is not Phone canonical data, not a production frontend input, and has no public/indexable surface.
7. AI Reset Radar stays frozen; Relay Exit Risk stays data-accrual only.

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Database coverage execution: `docs/PHONE_DATABASE_COVERAGE_EXECUTION_2026-09-29.md`.
Post-legacy gap audit: `docs/PHONE_POST_LEGACY_COVERAGE_GAP_AUDIT_2026-10-03.md`.
Data-eSIM backstage contract: `data/esim/README.md` + `data/esim/v1/manifest.json`.

## JUST COMPLETED — Post-legacy Phone coverage-gap audit

Purpose: stop extending the backend by old comparison-list migration or provider-directory enumeration and identify genuinely missing low-cost long-term routes from current community evidence.

Audit result:

- exact canonical dedupe confirmed Vodafone Germany and Skinny NZ are already covered and the Sakura same-product alias is not a missing route;
- five genuinely distinct missing candidates were bounded and sample-audited: Vodafone NL Prepaid, CTExcel UK, One NZ Prepay, CMLink UK retention and DITO Philippines prepaid/eSIM;
- **selected for DB-C20:** `vodafone-nl-prepaid-2026`, `ctexcel-uk-2026`, `one-nz-prepay-2026`;
- **deferred:** CMLink UK because current retention eligibility/post-expiry rules remain materially ambiguous; DITO Philippines because tourist registration/current traveler-SIM rules impose a 30-day/local-address/return-ticket constraint that prevents generalizing community ultra-low-cost retention claims to a durable foreign-user route;
- all five candidates were sample-audited for source quality, duplication and unsupported inference, exceeding the required sample of three;
- no canonical row, comparison row, public URL, sitemap entry, ranking or indexability changed;
- release record: PR #358 squash-merged as `ecec30762a819aea5aba311a6dfd6c6c78921b7d`; Eval Gate #1065 and Vercel status passed.

Full evidence and re-open triggers: `docs/PHONE_POST_LEGACY_COVERAGE_GAP_AUDIT_2026-10-03.md`.

## JUST COMPLETED — Backend database coverage DB-C20

Result:

- `vodafone-nl-prepaid-2026` — **ADMIT-BACKSTAGE**. Current provider lifecycle supports one paid use or top-up every six months plus a three-month recovery window; remote acquisition/payment and China-specific OTP remain evidence-scoped.
- `ctexcel-uk-2026` — **HOLD**. Current provider retention product exists, but eligibility, current price and post-expiry mechanics remain insufficiently reconciled; no universal 90-day rule or annual keep cost is asserted.
- `one-nz-prepay-2026` — **ADMIT-BACKSTAGE**. Current 360-day top-up lifecycle and NZD10 logged-in web/app minimum are established; NZ-first activation and non-guaranteed third-party OTP are preserved.
- post-release canonical: **148 routes / 86 markets / 145 brands / 114 networks / 565 sources**;
- publication boundary: **135 comparison routes / 3 explicit indexable routes / 31 sitemap URLs**; all three DB-C20 standalone route URLs return HTTP 404.
- release: PR #360 squash-merged as `c6f5ec5e34797745b1d6738ae8936a02510601c2`; CI #226 and Eval Gate #1069 passed; Vercel Preview passed; production `dpl_8dHPdkJX9RybHe9atEKd7bfNDuFT` is READY.

## JUST COMPLETED — Data-eSIM public-source provenance resolution

- PR #362 squash-merged as `86060c1d5e01f460d168005f74b6e3cd0c820478`.
- The existing immutable `community-esim-price-user-supplied-later-delta-2026-10-01.json` remains unchanged with its original unresolved raw source field.
- Reviewed manifest metadata now resolves that snapshot to Linux.do `ESIM流量漫游合集 4.0`; normalized source/evidence provenance inherits the resolved URL/title.
- Full `npm run phone:data:check` passed, Eval Gate #1073 passed, Vercel Preview passed and the post-merge Vercel deployment completed successfully.
- Data-eSIM counts remain **59 source-label providers / 72 evidence records / 159 versioned offers**; no Phone canonical row, comparison row, public URL, sitemap entry, ranking or indexability changed.
- No additional unnormalized Data-eSIM inbox snapshot was present in `main` during this session. A bounded Kimi-K3 delegated community-search task was submitted but ended `Task cancelled`; no worker result was accepted as evidence.

## NEXT — Trigger-gated Phone decision read

No DB-C21 batch is selected. Do not create one from provider-directory enumeration or from the two deferred routes without new evidence.

Next coordinator task becomes eligible when either:

- settled Phone Search Console impressions reach **20**, or finalized data reaches **2026-10-05** — then re-read first-party GSC data and make the next KEEP / ADJUST / NARROW decision for the existing Phone surface; or
- fresh independent operational evidence resolves the documented CMLink UK / DITO Philippines blocker or identifies a genuinely distinct low-cost long-term real-number route — then run a bounded reviewed candidate audit before defining any DB-C21 batch.

Until one trigger occurs, keep production stable and continue the already-authorized backstage community evidence lane.

## PARALLEL — Community Data-eSIM evidence intake

The reviewed snapshots remain normalized only through the explicit `data/esim/v1` manifest. Raw inbox snapshots remain immutable provenance inputs; reviewed source-resolution metadata may be attached at the manifest layer when a previously unknown public source is later content-matched.

Continue to append price/mechanic versions without overwriting history. Preserve community/third-party/referral/promotion, IP/egress, FUP/throttle and voice/SMS/number uncertainty as evidence. Do not auto-publish, auto-rank or force pure data eSIM into Phone-number/retention canonical routes.

Delegated worker output remains `RESEARCH_CANDIDATE` until coordinator review. Worker failure never invalidates already captured evidence and never bypasses QC.

## Measurement wait

Search Console remains too small for another publication wave. Finalized data through 2026-09-28 shows **5 Phone impressions / 0 clicks**; fresh 2026-09-29..30 adds **5 non-finalized impressions / 0 clicks** and no route-detail row.

Re-read when either:

- settled Phone impressions reach **20**, or
- finalized data reaches **2026-10-05**.

This wait does **not** block community evidence acquisition.

## External waits

- TikTok — base application Live; targeted Direct Post remediation and genuine `SELF_ONLY` publication proof are complete. The Content Posting API reapplication for app `7686819988157810696` was submitted on 2026-10-02 with the real 28-second demo video; do not submit again unless TikTok rejects or requests new evidence.
- Authority / AI discovery — follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; verify any claimed citation/link independently.
- AI-native retrieval — follow `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md`; do not bypass provider quota/auth blockers.

## Do not do next

- do not trigger another broad frontend redesign without measured behavior or a reproduced UX defect;
- do not treat DB-C20 selection or backend admission as authorization for SEO/indexable pages;
- do not resurrect CMLink UK or DITO Philippines without satisfying their audit re-open conditions;
- do not duplicate same-product aliases;
- do not manufacture ranking/recommendation confidence from sparse evidence;
- do not auto-publish or rank Data-eSIM community evidence;
- do not redesign the backend/schema merely for neatness;
- do not let delegated output bypass review/admission gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
