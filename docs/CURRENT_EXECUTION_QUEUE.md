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

## JUST COMPLETED — US batch-A identity/provenance reconciliation + migration

Result: **PASS / Ultra PayGo + Tello PAYG + H2O PayGo migrated backstage after current reconciliation; no publication expansion.**

- PR #282 squash-merged as `a72c05b58b708be8e0b22d8bbd3640c29637c1e3`; CI #167, Eval Gate #900, Vercel Preview and production deployment passed;
- canonical is now 35 routes / 16 markets / 33 brands / 19 networks / 112 sources; overlap is 24 and 111 comparison routes remain legacy-only;
- 233 unique source IDs are referenced by current comparison routes; 161 remain absent from canonical sources;
- `tello-us` and `tello-paygo-credit-2026` are distinct products: the former is the 30-day monthly-plan route and the latter the separate PAYG-credit route, so no alias/collapse was used;
- Tello PAYG now uses the current USD20 minimum web order and 90-day **order-based** expiry; the stale “send one SMS every ~80 days” shorthand was removed;
- Ultra PayGo remains USD3/30 days but is represented as the PayGo-specific physical-SIM route with current official eBay/select-T-Mobile-store acquisition semantics; no unsupported stable SIM-kit landed price is asserted;
- H2O PayGo remains observation/HOLD because current International Roaming eligibility excludes PAYG and PAYG-specific Wi-Fi Calling/China continuity is unverified;
- exact source metadata and reviewed independent Tello provenance are retained; all three canonical-adapter rows deep-equal their reconciled comparison rows;
- live Phone Directory returned HTTP 200; all three new standalone route URLs returned HTTP 404, confirming publication/indexability stayed unchanged.

## NEXT SESSION — Japan batch-B identity/provenance reconciliation before migration

**Session task:** work only on `jp-directory-batch-b.json`: `povo20-zero-base-2026`, `mobal-japan-voice-2026`, and `sakura-mobile-voice-2026`. Identity/provenance comes before migration.

### Scope

1. reverify current povo 2.0, Mobal Voice and Sakura Mobile Voice provider/source facts;
2. explicitly reconcile legacy `mobal-japan-voice-2026` against existing canonical `mobal-japan-voice-data`, and legacy `sakura-mobile-voice-2026` against existing canonical `sakura-japan-voice-data`; do not create duplicate canonical products merely to preserve legacy IDs and do not collapse genuinely distinct products;
3. preserve povo as HOLD unless lawful acquisition/eKYC and overseas continuity evidence materially changes;
4. migrate only identities that can be represented losslessly with exact canonical-adapter parity;
5. keep comparison at 135, manifest gate intact and explicit indexability at 3.

### Definition of done

- documented identity decisions exist for both Mobal and Sakura legacy/canonical pairs;
- current commercial/lifecycle/overseas-use facts are reconciled without invented certainty;
- any migrated row deep-equals the reviewed comparison row after canonical adaptation;
- no public URL, sitemap or indexability expansion occurs.

### Stop conditions

Stop and record the blocker if identity requires schema/alias redesign, a material provider/community contradiction cannot be represented honestly, source provenance is insufficient, exact parity fails, or publication/indexability would change. Do not compensate by switching to a larger batch.

## Qwen / Kimi work lane

QwenPaw/Kimi remain high-throughput backstage research/data workers. Their outputs are `RESEARCH CANDIDATE` until independently reviewed; they do not control canonical admission, publication, roadmap or deployment.

## External waits

- **TikTok App Review — WAITING.** Do not alter submitted configuration until review outcome.
- **Authority batch 2 — WAITING.** Follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; no extra outreach merely to create activity.

## Do not do next

- do not bulk-migrate the remaining 111 legacy-only routes;
- do not remove the PR #263 manifest gate or shrink the 135-route comparison surface;
- do not equate canonical admission with SEO/indexability;
- do not redesign schema/backend for architectural neatness;
- do not let raw delegated output bypass review/admission/publication gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
