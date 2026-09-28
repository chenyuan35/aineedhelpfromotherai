# Current Execution Queue

Last updated: 2026-09-28

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules. Historical detail belongs in PRs, Git history, task-specific docs and the Daily Project Journal.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Broad comparison coverage stays preserved.** The current 135-route legacy comparison artifact remains valid product input behind the PR #263 manifest gate.
3. **Canonical v1 migration is now proven for one route, not yet coverage-parity.** After PR #266 it has 16 routes; five IDs overlap the 135-route comparison set.
4. **Publication remains separate.** Canonical migration does not imply new route/market URLs, sitemap entries or indexability.
5. **AI Reset Radar — FROZEN. Relay Exit Risk — data-accrual only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Compatibility audit: `docs/PHONE_CANONICAL_COMPARISON_COMPATIBILITY_AUDIT_2026-09-28.md`.

## JUST COMPLETED — one-route canonical migration pilot

Result: **PASS / pattern proven for one reviewed route; no comparison cutover.**

- PR #266 squash-merged as `0b10801a0cfac1afa75d21ad90c51383ca9e9294`; Eval Gate #865, CI #153 and Vercel Preview passed;
- `cmhk-mysim-hk-2026` now exists in canonical v1 with explicit market / network / brand references, a rich `current-profile` snapshot and traceable official + community source URLs;
- canonical `data/phone/v1` is now 16 routes / 8 markets / 15 brands / 3 networks / 63 sources;
- route-ID overlap with the 135-route comparison set increased from 4 to 5; 130 comparison routes remain legacy-only;
- legacy comparison routes still reference 213 distinct source IDs; 190 remain absent from canonical sources;
- the generic canonical comparison adapter reproduces the CMHK legacy comparison row by exact deep equality;
- legacy comparison coverage remains 135 routes, explicit indexability remains 3 routes, and the reviewed batch manifest remains authoritative;
- CMHK remains `backstage-only`; no route/market page, sitemap entry or public comparison cutover was introduced.

## NEXT SESSION — two-route canonical repeatability pilot

**Session task:** prove the migration pattern works across the smallest remaining admitted multi-route batch before any broader migration.

Use `nl-au-directory-batch-g.json`, which contains two routes: `kpn-prepaid-6mo-2026` and `telstra-prepaid-longexpiry-2026`.

### Scope

1. map both routes' market / network / brand / route identities and source provenance into canonical v1;
2. represent both rich comparison profiles through the existing canonical snapshot model;
3. reuse the generic canonical comparison adapter and prove exact comparison-field parity for both routes;
4. keep `nl-au-directory-batch-g.json` in the reviewed legacy manifest and keep the 135-route comparison artifact authoritative;
5. run canonical data checks plus existing admission/publication/release tests;
6. do **not** migrate any additional batch or change public/indexable publication in this session.

### Definition of done

- both routes exist in canonical v1 with complete references and provenance;
- canonical-derived comparison rows deep-equal their current legacy rows;
- current 135-route comparison coverage and 3-route explicit indexability are unchanged;
- raw/staging delegated output still cannot bypass review;
- no public comparison cutover or new standalone URLs occur.

### Stop conditions

Stop and document the exact blocker if the two-route pilot requires a schema redesign, loses source provenance, exposes ambiguous identity semantics, cannot reproduce either legacy row exactly, or changes publication/indexability. Do not compensate by bulk-copying the remaining legacy set.

## Qwen / Kimi work lane

QwenPaw/Kimi remain high-throughput backstage research/data workers. Their outputs are `RESEARCH CANDIDATE` until reviewed; they do not control canonical admission, publication, roadmap or deployment.

## External waits

- **TikTok App Review — WAITING.** Do not alter the submitted configuration until review outcome.
- **Authority batch 2 — WAITING.** Follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; no extra outreach merely to create activity.

## Do not do next

- do not bulk-migrate the remaining legacy batches before the one-route pilot proves the pattern;
- do not remove the PR #263 manifest gate yet;
- do not shrink the 135-route comparison surface to match the 15-route canonical set;
- do not equate canonical admission with SEO/indexability;
- do not add a backend or redesign the schema for architectural neatness;
- do not let Qwen/Kimi raw output bypass review/admission/publication gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
