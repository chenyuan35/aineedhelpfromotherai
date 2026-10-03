# Current Execution Queue

Last updated: 2026-10-03

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally a short atomic queue, not a historical log; completed detail belongs in Git history, PRs and task-specific docs.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Frontend baseline stays stable.** PR #342 remains the released Phone-first homepage/Phone hub identity; do not add another public design layer without measured behavior or a reproduced defect.
3. **Backend database coverage and public/SEO publication remain separate tracks.** Canonical/database admission never authorizes an indexable URL by itself.
4. Current released Phone state is **135 comparison routes / 145 canonical normalized routes / 134 comparison↔canonical route-ID overlaps / 1 intentional same-product alias gap / 3 indexable routes**.
5. The post-legacy coverage-gap audit is **merged to `main` via PR #358 / `ecec30762a819aea5aba311a6dfd6c6c78921b7d`**. It selected exactly three evidence-backed candidates for DB-C20: Vodafone Netherlands Prepaid, CTExcel UK and One NZ Prepay. CMLink UK and DITO Philippines are deferred behind explicit evidence/eligibility re-open conditions.
6. **Data-eSIM remains a separate normalized backstage family.** PR #328 preserves **59 source-label providers / 72 evidence records / 159 versioned offers** under `data/esim/v1`; it is not Phone canonical data, not a production frontend input, and has no public/indexable surface.
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

## NEXT — Backend database coverage DB-C20

Bounded batch:

1. `vodafone-nl-prepaid-2026`
2. `ctexcel-uk-2026`
3. `one-nz-prepay-2026`

Definition of done:

- independently reconcile current product identity, acquisition/activation, lifecycle/keep action and cost, roaming/China receive-SMS state, payment/KYC constraints, incident/recovery evidence and provenance for all three routes;
- preserve current community evidence and conflicts rather than forcing a recommendation;
- sample-audit the batch before acceptance;
- assign `ADMIT-BACKSTAGE`, `HOLD`, or `REJECT` per route;
- if accepted, normalize only through the reviewed canonical importer/data path and run the full Phone data/integrity/publication-boundary checks;
- preserve **135 comparison routes / 3 explicit indexable routes / current sitemap policy** unless an independent publication gate opens;
- use a fresh branch/PR; no direct `main` writes.

Stop conditions:

- current evidence disproves the route identity or reveals it is a duplicate/rebrand of an existing canonical route;
- a provider/account path requires payment, account-critical changes or unavailable authorization;
- a material lifecycle/acquisition contradiction cannot be represented without guessing;
- publication/indexability would be required to call the backend batch successful — it is not required and must remain separate.

## PARALLEL — Community Data-eSIM evidence intake

The reviewed snapshots remain normalized only through the explicit `data/esim/v1` manifest. Raw inbox snapshots remain immutable provenance inputs.

Continue to append price/mechanic versions without overwriting history. Preserve community/third-party/referral/promotion, IP/egress, FUP/throttle and voice/SMS/number uncertainty as evidence. Do not auto-publish, auto-rank or force pure data eSIM into Phone-number/retention canonical routes.

Delegated worker output remains `RESEARCH_CANDIDATE` until coordinator review. Worker failure never invalidates already captured evidence and never bypasses QC.

## Measurement wait

Search Console remains too small for another publication wave. Finalized data through 2026-09-28 shows **5 Phone impressions / 0 clicks**; fresh 2026-09-29..30 adds **5 non-finalized impressions / 0 clicks** and no route-detail row.

Re-read when either:

- settled Phone impressions reach **20**, or
- finalized data reaches **2026-10-05**.

This wait does **not** block DB-C20 or community evidence acquisition.

## External waits

- TikTok — base application Live; targeted Direct Post remediation and genuine `SELF_ONLY` publication proof are complete. The Content Posting API reapplication for app `7686819988157810696` was submitted on 2026-10-02 with the real 28-second demo video; do not submit again unless TikTok rejects or requests new evidence.
- Authority / AI discovery — follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; verify any claimed citation/link independently.
- AI-native retrieval — follow `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md`; do not bypass provider quota/auth blockers.

## Do not do next

- do not trigger another broad frontend redesign without measured behavior or a reproduced UX defect;
- do not treat DB-C20 selection or backend admission as authorization for SEO/indexable pages;
- do not resurrect CMLink UK or DITO Philippines into DB-C20 without satisfying their audit re-open conditions;
- do not duplicate same-product aliases;
- do not manufacture ranking/recommendation confidence from sparse evidence;
- do not auto-publish or rank Data-eSIM community evidence;
- do not redesign the backend/schema merely for neatness;
- do not let delegated output bypass review/admission gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
