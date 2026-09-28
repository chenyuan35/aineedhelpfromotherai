# Current Execution Queue

Last updated: 2026-09-28

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules. Historical detail belongs in PRs, Git history, task-specific docs and the Daily Project Journal.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Broad comparison coverage stays preserved.** The current 135-route legacy comparison artifact remains valid product input behind the PR #263 manifest gate.
3. **Canonical v1 migration repeatability is proven, not yet coverage-parity.** After PR #268 it has 18 routes; seven IDs overlap the 135-route comparison set and 128 remain legacy-only.
4. **Publication remains separate.** Canonical migration does not imply new route/market URLs, sitemap entries or indexability.
5. **AI Reset Radar — FROZEN. Relay Exit Risk — data-accrual only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Compatibility audit: `docs/PHONE_CANONICAL_COMPARISON_COMPATIBILITY_AUDIT_2026-09-28.md`.

## JUST COMPLETED — two-route canonical repeatability pilot

Result: **PASS / repeatability proven across two additional markets; no comparison cutover.**

- PR #268 squash-merged as `c91cfc36b8a7c141ea4d1becfb5153aa7ab26da6`; Eval Gate #869, CI #155, Vercel Preview and production deployment passed;
- `kpn-prepaid-6mo-2026` and `telstra-prepaid-longexpiry-2026` now exist in canonical v1 through reviewed migration packets;
- canonical `data/phone/v1` is now 18 routes / 10 markets / 17 brands / 5 networks / 65 sources;
- route-ID overlap with the 135-route comparison set increased from 5 to 7; 128 comparison routes remain legacy-only;
- legacy comparison routes still reference 213 distinct source IDs; 188 remain absent from canonical sources;
- the generic adapter reproduces both KPN and Telstra legacy comparison rows by exact deep equality;
- legacy comparison coverage remains 135 routes, explicit indexability remains 3 routes, and the reviewed batch manifest remains authoritative;
- no new standalone URL, sitemap entry or public comparison cutover was introduced.

## NEXT SESSION — Taiwan two-route canonical migration

**Session task:** continue staged canonical coverage with exactly one already-admitted two-route batch.

Use `tw-depth-batch-w.json`: `taiwan-mobile-prepaid-tw-2026` and `fareastone-prepaid-tw-2026`.

### Scope

1. map both routes' market / network / brand / route identities and complete source provenance into canonical v1;
2. carry their comparison profiles through the existing canonical snapshot model without schema redesign;
3. reuse the generic canonical comparison adapter and prove exact comparison-field parity for both routes;
4. keep `tw-depth-batch-w.json` in the reviewed legacy manifest and keep the 135-route comparison artifact authoritative;
5. run canonical data checks plus existing admission/publication/release tests;
6. do **not** migrate another batch or change public/indexable publication in this session.

### Definition of done

- both Taiwan routes exist in canonical v1 with complete references and provenance;
- canonical-derived comparison rows deep-equal their current legacy rows;
- current 135-route comparison coverage and 3-route explicit indexability are unchanged;
- raw/staging delegated output still cannot bypass review;
- no public comparison cutover or new standalone URLs occur.

### Stop conditions

Stop and document the exact blocker if either route requires schema redesign, loses provenance, cannot preserve its candidate/observation semantics, cannot reproduce the legacy row exactly, or changes publication/indexability. Do not compensate by broadening to another batch.

## Qwen / Kimi work lane

QwenPaw/Kimi remain high-throughput backstage research/data workers. Their outputs are `RESEARCH CANDIDATE` until reviewed; they do not control canonical admission, publication, roadmap or deployment.

## External waits

- **TikTok App Review — WAITING.** Do not alter the submitted configuration until review outcome.
- **Authority batch 2 — WAITING.** Follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; no extra outreach merely to create activity.

## Do not do next

- do not bulk-migrate the remaining legacy batches; continue one reviewed batch at a time while exact parity is enforced;
- do not remove the PR #263 manifest gate yet;
- do not shrink the 135-route comparison surface to match the smaller canonical set;
- do not equate canonical admission with SEO/indexability;
- do not add a backend or redesign the schema for architectural neatness;
- do not let Qwen/Kimi raw output bypass review/admission/publication gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
