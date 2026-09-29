# Current Execution Queue

Last updated: 2026-09-29

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Backend database coverage and public/SEO publication are separate tracks.** A large normalized backend database is expected; database admission does not authorize an indexable URL.
3. Current inventory: **135 comparison routes / 53 canonical normalized routes / 3 indexable routes**. Of the comparison set, 42 route IDs overlap canonical and **93 remain legacy-only**.
4. The backend database is therefore **not complete**. Continue reviewed canonical coverage expansion toward roughly **90%+ of the relevant low-cost route universe**, per the active architecture contract.
5. **Public surface stays stable.** Do not turn backend coverage work into route-page, sitemap or indexability expansion without a separate publication decision.
6. AI Reset Radar stays frozen; Relay Exit Risk stays data-accrual only.

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Database coverage execution: `docs/PHONE_DATABASE_COVERAGE_EXECUTION_2026-09-29.md`.

## ACTIVE — Backend Phone database coverage DB-C1

**Session task:** expand the normalized backend database without changing frontend publication.

QwenPaw/Kimi K3 task `task-1e549d80fe6d` is researching these 12 existing legacy comparison routes as `RESEARCH CANDIDATE` material:

- `a1-bfree-at-2026`
- `proximus-paygo-be-2026`
- `o2-cz-prepaid-2026`
- `vodafone-tuti-hu-2026`
- `telkomsel-simpati-365d-2026`
- `vodacom-prepaid-83d-2026`
- `beeline-kz-simka-v-seyfe-2026`
- `magticom-number-maintenance-2026`
- `mobitel-lk-retention-2026`
- `yettel-rs-2026`
- `cellcard-kh-2026`
- `grameenphone-validity-pack-2026`

### Acceptance flow

1. require source URL/date/type, current acquisition + retention facts, constraints, conflicts and unknowns;
2. sample-audit at least 3 routes independently for stale claims, unsupported inference, duplicates and circular evidence;
3. classify every route `REJECT`, `HOLD` or `ADMIT-BACKSTAGE`;
4. create reviewed packets only for accepted routes and apply through the canonical importer;
5. run canonical DB/integrity/publication-boundary tests;
6. merge only after Eval Gate + Preview pass;
7. repeat with the next backend coverage batch until the coverage target or a real maintenance/evidence stop condition is reached.

### Definition of done for DB-C1

- all 12 candidates dispositioned;
- accepted routes are normalized in `data/phone/v1` with provenance and unresolved conflicts preserved;
- canonical/comparison overlap counts are updated;
- no indexable URL, sitemap, public ranking or publication state is added by this batch.

### Stop conditions

- evidence is too weak to identify the current product/retention rule;
- candidate is a duplicate/same underlying product (use alias/REJECT rather than duplicate row);
- delegated batch shows systematic stale/unsupported data beyond the sample tolerance;
- work would require frontend publication, schema redesign or infrastructure change.

## Measurement wait

Search Console remains too small for publication expansion. Do not block backend database coverage on this wait, and do not use backend coverage as a reason to publish more URLs.

## Qwen / Kimi work lane

QwenPaw/Kimi are high-throughput backstage research/data workers. They may aggressively expand evidence/database coverage, but all raw output remains `RESEARCH CANDIDATE` until reviewed. They do not control publication, roadmap, merge or deployment.

## External waits

- TikTok App Review — waiting; do not alter submitted configuration.
- Authority batch 2 — waiting; follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`.

## Do not do next

- do not stop backend database expansion merely because public SEO measurement is waiting;
- do not bulk-admit the 93 legacy-only routes without provenance + sample QC;
- do not duplicate Sakura or any same-product alias;
- do not equate canonical/database admission with SEO/indexability;
- do not redesign backend/schema just for neatness;
- do not let delegated output bypass review/admission gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
