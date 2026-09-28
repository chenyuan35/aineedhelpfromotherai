# Current Execution Queue

Last updated: 2026-09-28

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules. Historical detail belongs in PRs, Git history, task-specific docs and the Daily Project Journal.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Broad comparison coverage stays preserved.** The current 135-route legacy comparison artifact remains valid product input behind the PR #263 manifest gate.
3. **Canonical v1 is not yet feature/coverage-parity.** It has 15 routes; only four IDs overlap the 135-route comparison set.
4. **Publication remains separate.** Database migration must not imply new route/market URLs, sitemap entries or indexability.
5. **AI Reset Radar — FROZEN. Relay Exit Risk — data-accrual only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Compatibility audit: `docs/PHONE_CANONICAL_COMPARISON_COMPATIBILITY_AUDIT_2026-09-28.md`.

## JUST COMPLETED — canonical-to-comparison compatibility audit

Result: **STOP / not lossless yet.**

- canonical `data/phone/v1`: 15 routes / 7 markets / 14 brands / 2 networks / 61 sources;
- compiled canonical `phone-database.json`: the same 15 routes;
- legacy `global-directory.json`: 135 routes / 83 route markets / 134 brands / 112 networks / 219 sources;
- route-ID overlap is only 4; 131 comparison routes are not canonical;
- canonical snapshots reference only those 15 routes and only four routes have rich `current-profile` data;
- legacy comparison routes reference 213 distinct source IDs, 192 of which are absent from canonical sources;
- the comparison/deep-detail UI still consumes rich fields not normalized for the missing legacy routes.

Verification on fresh main: `phone:data` compiler check passed at 15 canonical routes; candidate-pipeline test preserved 26 admitted legacy batches / 135 comparison routes; publication-state test preserved 135 database routes / 3 explicit indexable routes. No production/publication change was made.

## NEXT SESSION — one-route canonical migration pilot

**Session task:** prove one already-admitted legacy comparison route can be moved into canonical v1 without losing identity, provenance or comparison fields.

Use `hk2-depth-batch-u.json`, which contains one route: `cmhk-mysim-hk-2026`.

### Scope

1. map the route's market / network / brand / route IDs and source IDs into canonical v1;
2. represent its rich comparison profile in the existing canonical snapshot model without inventing fields or weakening evidence;
3. add the route through a reviewed canonical migration path, keeping the legacy manifest entry in place;
4. build a small test/adapter proving canonical data can reproduce the route's current comparison fields;
5. run canonical data checks plus existing admission/publication tests;
6. do **not** switch the live 135-route comparison artifact in this pilot.

### Definition of done

- `cmhk-mysim-hk-2026` exists in canonical v1 with complete references and provenance;
- canonical-derived comparison output for that route matches the legacy route on the decision fields required by the current UI;
- current 135-route comparison coverage is unchanged;
- raw/staging delegated output still cannot bypass review;
- publication/indexability remains unchanged.

### Stop conditions

Stop and document the exact blocker if the pilot requires a schema redesign, loses source provenance, requires ambiguous route-ID remapping, changes route semantics, or affects public publication/indexability. Do not compensate by bulk-copying legacy files into canonical truth.

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
