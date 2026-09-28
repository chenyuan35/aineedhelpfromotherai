# Current Execution Queue

Last updated: 2026-09-29

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules. Historical detail belongs in PRs, Git history, task-specific docs and the Daily Project Journal.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Broad comparison coverage stays preserved.** The 135-route legacy comparison artifact remains authoritative behind the PR #263 reviewed-manifest gate.
3. **Canonical staged migration is lossless so far, not coverage-parity.** CA/FR/CH/MX/IN batch-I migrated five routes backstage as HOLD with exact parity; canonical v1 is now 45 routes / 23 markets / 42 brands / 28 networks / 156 sources; 34 route IDs overlap the comparison set and 101 remain legacy-only.
4. **Publication remains separate.** Explicit indexability remains 3; canonical migration does not imply route/market URLs, sitemap entries or ranking claims.
5. **AI Reset Radar — FROZEN. Relay Exit Risk — data-accrual only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Compatibility audit: `docs/PHONE_CANONICAL_COMPARISON_COMPATIBILITY_AUDIT_2026-09-28.md`.

## JUST COMPLETED — CA/FR/CH/MX/IN batch-I current-fact reconciliation + bounded canonical migration

Result: **PASS / FIVE EXACT-PARITY HOLD MIGRATIONS.**

- SpeakOut: legacy CA$25/365-day voucher model is stale; current service requires a rate plan, plans start CA$19/30d, account cancels after 90 days with no active plan, and current service does not roam outside Canada;
- Telcel Amigo: current Aug-2026 contract uses a 365-day no-activity lifecycle reset by Saldo recharge; current recharge range starts MXN$10. eSIM is available online, but ordinary foreign-user registration remains ambiguous and the separate Tourist eSIM was not conflated with this route;
- Jio Prepaid: official retention is 90 days non-use followed by Rs.20 Automatic Number Retention deductions per 30-day extension while balance is sufficient; incoming IR SMS is free, but India-centric acquisition/IR setup keeps the route HOLD;
- Orange Mobicarte: current EUR2.99 entry and EUR10/6-month line-validity path are now verified, but France residence/stable-link eligibility and non-Europe OTP evidence keep it HOLD / avoid-route;
- Sunrise Prepaid: current inactivity limit is 17 months, CHF10 top-up is qualifying active use and can be done abroad, and foreign-address eSIM registration exists; independent China-first/long-term OTP evidence remains insufficient;
- all five generic canonical-adapter rows deep-equal the corrected reviewed comparison rows;
- canonical v1 is 45 routes / 23 markets / 42 brands / 28 networks / 156 sources; comparison remains 135, overlap is 34, legacy-only is 101, reviewed manifest remains intact and explicit indexability remains 3.

## NEXT SESSION — PH/TR/AE/VN batch-J identity/provenance reconciliation before migration

**Session task:** work only on `ph-tr-ae-vn-directory-batch-j.json`. Reverify identity, current provider facts and source provenance before any canonical admission.

### Scope

1. reverify current acquisition, retention, KYC/location and overseas SMS/roaming facts for every route in batch-J;
2. reconcile stale commercial/lifecycle claims only when current attributable evidence supports the correction;
3. preserve negative/HOLD knowledge rather than forcing admission;
4. migrate only rows that can reproduce the reviewed comparison row exactly through the existing generic adapter;
5. keep comparison at 135, reviewed manifest intact and explicit indexability at 3.

### Definition of done

- identity/provenance decisions exist for every batch-J route;
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
