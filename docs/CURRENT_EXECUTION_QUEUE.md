# Current Execution Queue

Last updated: 2026-09-29

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules. Historical detail belongs in PRs, Git history, task-specific docs and the Daily Project Journal.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Broad comparison coverage stays preserved.** The 135-route legacy comparison artifact remains authoritative behind the PR #263 reviewed-manifest gate.
3. **Canonical staged migration is lossless so far, not coverage-parity.** Japan batch-B current-fact reconciliation migrated povo + Mobal Voice-Only backstage; canonical v1 is now 37 routes / 16 markets / 34 brands / 20 networks / 119 sources; 26 route IDs overlap the comparison set and 109 remain legacy-only.
4. **Publication remains separate.** Explicit indexability remains 3; canonical migration does not imply route/market URLs, sitemap entries or ranking claims.
5. **AI Reset Radar — FROZEN. Relay Exit Risk — data-accrual only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Compatibility audit: `docs/PHONE_CANONICAL_COMPARISON_COMPATIBILITY_AUDIT_2026-09-28.md`.

## JUST COMPLETED — Japan batch-B current-fact reconciliation + bounded canonical migration

Result: **PASS / TWO LOSSLESS MIGRATIONS + ONE EXPLICIT SAME-PRODUCT LEGACY-ID HOLD.**

- `povo20-zero-base-2026` legacy data now uses the current paid-topping / 180-day lifecycle, accepted Japan credential paths and documented overseas SMS support; it migrated backstage as canonical **HOLD**;
- `mobal-japan-voice-2026` now uses current Voice-Only economics (JPY 4,950 regular setup + JPY 1,430/month) and current Voice/SMS roaming evidence; it migrated backstage as a product distinct from `mobal-japan-voice-data`;
- `sakura-mobile-voice-2026` now uses JPY 3,278/month tax-included + JPY 5,500 activation, passport/pickup and overseas calls/SMS facts, but it was **not** duplicated into canonical because existing `sakura-japan-voice-data` is the same underlying product;
- current importer is add-only and the generic comparison adapter emits canonical `route.id`, so Sakura's different legacy comparison ID cannot be cut over losslessly without broader update/alias semantics. The legacy comparison row remains authoritative for that ID; no schema/backend redesign was introduced;
- Povo and Mobal canonical-adapter rows deep-equal the reviewed comparison rows; dedicated regression also asserts Sakura stays single-product canonical;
- canonical v1 is 37 routes / 16 markets / 34 brands / 20 networks / 119 sources; comparison remains 135, overlap is 26, legacy-only is 109, reviewed manifest remains intact and explicit indexability remains 3.

## NEXT SESSION — NZ/Thailand batch-D identity/provenance reconciliation before migration

**Session task:** work only on `nz-th-directory-batch-d.json`: `skinny-prepay-12mo-2026`, `2degrees-prepay-2026`, and `ais-sim2fly-365d-2026`. Reverify identity, current provider facts and source provenance before any canonical admission.

### Scope

1. reverify current acquisition, retention, KYC/location and overseas SMS/roaming facts for all three routes;
2. reconcile stale commercial/lifecycle claims only when current attributable evidence supports the correction;
3. preserve negative/HOLD knowledge rather than forcing admission;
4. migrate only rows that can reproduce the reviewed comparison row exactly through the existing generic adapter;
5. keep comparison at 135, reviewed manifest intact and explicit indexability at 3.

### Definition of done

- identity/provenance decisions exist for all three routes;
- any migrated row has exact canonical-adapter parity;
- comparison remains 135 and indexability remains 3;
- no new public Phone URL, sitemap entry or publication-state expansion occurs.

### Stop conditions

Stop and record the blocker if identity requires schema/alias redesign, current evidence is materially contradictory or insufficient, exact parity fails, or publication/indexability would change. Do not broaden into another batch.

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
