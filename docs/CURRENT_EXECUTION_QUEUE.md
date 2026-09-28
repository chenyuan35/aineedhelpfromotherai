# Current Execution Queue

Last updated: 2026-09-29

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules. Historical detail belongs in PRs, Git history, task-specific docs and the Daily Project Journal.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Broad comparison coverage stays preserved.** The 135-route legacy comparison artifact remains authoritative behind the PR #263 reviewed-manifest gate.
3. **Canonical staged migration is lossless so far, not coverage-parity.** NZ/Thailand batch-D migrated Skinny, 2degrees and AIS SIM2Fly backstage as HOLD routes; canonical v1 is now 40 routes / 18 markets / 37 brands / 23 networks / 133 sources; 29 route IDs overlap the comparison set and 106 remain legacy-only.
4. **Publication remains separate.** Explicit indexability remains 3; canonical migration does not imply route/market URLs, sitemap entries or ranking claims.
5. **AI Reset Radar — FROZEN. Relay Exit Risk — data-accrual only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Compatibility audit: `docs/PHONE_CANONICAL_COMPARISON_COMPATIBILITY_AUDIT_2026-09-28.md`.

## JUST COMPLETED — NZ/Thailand batch-D current-fact reconciliation + bounded canonical migration

Result: **PASS / THREE EXACT-PARITY HOLD MIGRATIONS.**

- `skinny-prepay-12mo-2026` now uses Skinny's direct rule: add credit at least once every 12 months; current top-ups start at NZ$5, eSIM is NZ$0 and the physical Trio SIM is NZ$2. New SIMs must activate on a New Zealand network before roaming, so the route remains HOLD for typical overseas-only acquisition;
- `2degrees-prepay-2026` now uses the current NZ$10 / 365-day keep-active rule and current NZ$8 new-Prepay entry plan. Its old pre-2024 lifecycle HOLD is resolved, but reviewed provider material does not establish first activation of a brand-new line entirely from overseas, so it remains HOLD for that use case;
- `ais-sim2fly-365d-2026` now distinguishes the current 2,699 THB promotional 365-day package from the 2,799 THB terms price, removes the old passport-free claim, confirms passport-based foreign registration and China-supported first activation, and preserves the provider's right to suspend roaming after more than 60 days of continuous roaming. Minimum durable post-package number-retention economics remain unresolved, so it stays HOLD;
- all three generic canonical-adapter rows deep-equal the corrected reviewed comparison rows;
- canonical v1 is 40 routes / 18 markets / 37 brands / 23 networks / 133 sources; comparison remains 135, overlap is 29, legacy-only is 106, reviewed manifest remains intact and explicit indexability remains 3.

## NEXT SESSION — CA/FR/CH/MX/IN batch-I identity/provenance reconciliation before migration

**Session task:** work only on `ca-fr-ch-mx-in-directory-batch-i.json`: `speakout-711-365voucher-2026`, `telcel-amigo-lifecycle-2026`, `jio-prepaid-90d-trai-2026`, `orange-mobicarte-2026`, and `sunrise-prepaid-2026`. Reverify identity, current provider facts and source provenance before any canonical admission.

### Scope

1. reverify current acquisition, retention, KYC/location and overseas SMS/roaming facts for all five routes;
2. reconcile stale commercial/lifecycle claims only when current attributable evidence supports the correction;
3. preserve negative/HOLD knowledge rather than forcing admission;
4. migrate only rows that can reproduce the reviewed comparison row exactly through the existing generic adapter;
5. keep comparison at 135, reviewed manifest intact and explicit indexability at 3.

### Definition of done

- identity/provenance decisions exist for all five routes;
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
