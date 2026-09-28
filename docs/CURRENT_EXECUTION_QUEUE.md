# Current Execution Queue

Last updated: 2026-09-29

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules. Historical detail belongs in PRs, Git history, task-specific docs and the Daily Project Journal.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Broad comparison coverage stays preserved.** The 135-route legacy comparison artifact remains authoritative behind the PR #263 reviewed-manifest gate.
3. **Canonical staged migration is lossless so far, not coverage-parity.** After PR #282 canonical v1 has 35 routes / 16 markets / 33 brands / 19 networks / 112 sources; 24 route IDs overlap the comparison set and 111 remain legacy-only.
4. **Publication remains separate.** Explicit indexability remains 3; canonical migration does not imply route/market URLs, sitemap entries or ranking claims.
5. **AI Reset Radar — FROZEN. Relay Exit Risk — data-accrual only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Compatibility audit: `docs/PHONE_CANONICAL_COMPARISON_COMPATIBILITY_AUDIT_2026-09-28.md`.

## JUST COMPLETED — Japan batch-B identity/provenance reconciliation

Result: **IDENTITIES RECONCILED / MIGRATION NOT STARTED.**

- review: `docs/PHONE_JP_BATCH_B_IDENTITY_PROVENANCE_RECONCILIATION_2026-09-29.md`;
- `povo20-zero-base-2026` remains HOLD for the general overseas-user route: the current Voice+Data path accepts My Number Card, Japanese driver's license or residence card, so the old “Japanese documents only” shorthand was too broad, but a typical overseas-only applicant with only a foreign passport still cannot use that acquisition path;
- povo's current official retention rule is paid-topping based over the 180-day window; the legacy row must not present JPY 250 as a universal minimum keep-alive requirement, and its “overseas SMS unverified” wording is stale because current official Voice+Data roaming supports SMS after enablement;
- `mobal-japan-voice-2026` is a **genuinely distinct Voice-Only product**, not the existing canonical `mobal-japan-voice-data`. Current Mobal separates Voice-Only at JPY 1,430/month from Voice+Data starting JPY 1,650/month; do not alias/collapse them;
- `sakura-mobile-voice-2026` is the **same underlying Sakura monthly Voice+Data product** already represented by canonical `sakura-japan-voice-data`. Current 5GB billing is JPY 3,278 tax included plus JPY 5,500 activation; calls/SMS can roam abroad while data cannot. Do not create a duplicate canonical product for the legacy ID;
- current canonical comparison adapter always emits `id: route.id`; it has no comparison-only legacy-ID mapping. Therefore Sakura exact legacy-ID parity hits the documented alias/schema stop boundary;
- no route was migrated, comparison remains 135, reviewed manifest gate remains intact and explicit indexability remains 3.

## NEXT SESSION — Japan batch-B current-fact row reconciliation + Sakura legacy-ID boundary

**Session task:** work only on the same three Japan batch-B rows. Correct the legacy comparison data to the reconciled current facts without changing route count/publication, then resolve the smallest safe comparison-only handling for Sakura's same-product/different-ID case before attempting canonical migration.

### Scope

1. correct povo retention/eKYC/overseas-SMS fields to current official facts while preserving HOLD;
2. correct Mobal Voice-Only pricing/roaming/source provenance and keep it distinct from canonical Voice+Data;
3. correct Sakura tax-inclusive pricing, passport/pickup and roaming facts without creating a second canonical Sakura product;
4. determine whether a narrowly scoped comparison-only legacy-ID mapping can preserve exact parity without changing normalized product identity; if that requires broader schema/backend redesign, keep the legacy row authoritative and record the blocker instead;
5. regenerate/verify derived comparison artifacts, keeping 135 routes, the reviewed manifest and explicit indexability 3 unchanged.

### Definition of done

- the three legacy rows no longer contain the stale facts identified in the Sep 29 reconciliation;
- no duplicate Mobal or Sakura product identity is introduced;
- comparison route count remains 135 and indexability remains 3;
- any alias/mapping change, if used, is narrowly comparison-only and covered by an exact-parity regression test;
- canonical migration proceeds only for identities that can then be represented losslessly.

### Stop conditions

Stop and record the blocker if fixing Sakura requires a broad schema/backend redesign, exact comparison parity cannot be preserved, a material provider/community contradiction cannot be represented honestly, provenance is insufficient, or publication/indexability would change. Do not compensate by switching to a larger batch.

## Qwen / Kimi work lane

QwenPaw/Kimi remain high-throughput backstage research/data workers. Their outputs are `RESEARCH CANDIDATE` until independently reviewed; they do not control canonical admission, publication, roadmap or deployment.

## External waits

- **TikTok App Review — WAITING.** Do not alter submitted configuration until review outcome.
- **Authority batch 2 — WAITING.** Follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; no extra outreach merely to create activity.

## Do not do next

- do not bulk-migrate the remaining legacy-only routes;
- do not remove the PR #263 manifest gate or shrink the 135-route comparison surface;
- do not create duplicate canonical products to preserve legacy IDs;
- do not equate canonical admission with SEO/indexability;
- do not redesign schema/backend for architectural neatness;
- do not let raw delegated output bypass review/admission/publication gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
