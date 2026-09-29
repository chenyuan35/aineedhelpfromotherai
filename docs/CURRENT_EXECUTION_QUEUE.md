# Current Execution Queue

Last updated: 2026-09-29

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Broad comparison coverage stays preserved.** The 135-route legacy comparison artifact remains authoritative behind the PR #263 reviewed-manifest gate.
3. **Canonical staged migration is lossless so far, not coverage-parity.** PH/TR/AE/VN batch-J migrated four routes backstage as HOLD with exact parity; canonical v1 is now 49 routes / 27 markets / 46 brands / 32 networks / 167 sources; 38 route IDs overlap the comparison set and 97 remain legacy-only.
4. **Publication remains separate.** Explicit indexability remains 3; canonical migration does not imply route/market URLs, sitemap entries or ranking claims.
5. **AI Reset Radar — FROZEN. Relay Exit Risk — data-accrual only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Compatibility audit: `docs/PHONE_CANONICAL_COMPARISON_COMPATIBILITY_AUDIT_2026-09-28.md`.

## JUST COMPLETED — PH/TR/AE/VN batch-J current-fact reconciliation + bounded canonical migration

Result: **PASS / FOUR EXACT-PARITY HOLD MIGRATIONS.**

- Globe: foreign-tourist registration is a 30-day hard cap; the ordinary one-year load rule must not be modeled as a foreign-tourist annual keep path; free incoming roaming SMS is first-party confirmed;
- Turkcell Tourist: the old fixed 90-day passport/YKN blocker was removed by 2026 BTK rule changes; current long-term retention and overseas OTP remain unverified, so the route stays HOLD / avoid-route;
- du: current Tourist SIM is 90 days and du documents an AED5 renewal/extension action, but no indefinitely repeatable annual keep path is established;
- Viettel VTVANG: current specialist evidence reports VND50,000/12 months; first-party VTVANG product/eligibility and foreign acquisition remain unresolved, while current Viettel guidance confirms roaming is needed for OTP reception abroad;
- all four generic canonical-adapter rows deep-equal the corrected reviewed comparison rows;
- canonical v1 is 49 routes / 27 markets / 46 brands / 32 networks / 167 sources; comparison remains 135, overlap is 38, legacy-only is 97, reviewed manifest remains intact and explicit indexability remains 3.

## NEXT SESSION — IE/PL/PT/HR batch-K identity/provenance reconciliation before migration

**Session task:** work only on `ie-pl-pt-hr-directory-batch-k.json`. Reverify identity, current provider facts and source provenance before any canonical admission.

### Scope

1. reverify current acquisition, retention, KYC/location and overseas SMS/roaming facts for every route in batch-K;
2. correct stale commercial/lifecycle claims only with current attributable evidence;
3. preserve negative/HOLD knowledge rather than forcing admission;
4. migrate only rows that reproduce the reviewed comparison row exactly through the existing generic adapter;
5. keep comparison at 135, reviewed manifest intact and explicit indexability at 3.

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
