# Current Execution Queue

Last updated: 2026-09-29

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Broad comparison coverage stays preserved.** The 135-route legacy comparison artifact remains authoritative behind the PR #263 reviewed-manifest gate.
3. **Named batch A–K migration is complete.** Batch-K migrated four HOLD routes with exact parity; canonical v1 is now 53 routes / 30 markets / 50 brands / 36 networks / 182 sources; 42 route IDs overlap the comparison set and 93 remain legacy-only.
4. **The only named-batch legacy ID not represented by the same canonical ID is the known Sakura same-product alias blocker.** Do not duplicate that product.
5. **Publication remains separate.** Explicit indexability remains 3; canonical migration does not imply route/market URLs, sitemap entries or ranking claims.
6. **AI Reset Radar — FROZEN. Relay Exit Risk — data-accrual only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Compatibility audit: `docs/PHONE_CANONICAL_COMPARISON_COMPATIBILITY_AUDIT_2026-09-28.md`.

## JUST COMPLETED — IE/PL/PT/HR batch-K current-fact reconciliation + bounded canonical migration

Result: **PASS / FOUR EXACT-PARITY HOLD MIGRATIONS.**

- Three IE: withdraw the old 1-SMS/80-day / EUR0.30-year recommendation because current Three-controlled materials conflict on the dormancy timeline; keep HOLD until one current rule can be reconciled;
- Orange PL: current official paid validity extension is PLN39 for +365 days; the former inactivity fee remains abolished; keep HOLD because acquisition/KYC remains Poland-centered and overseas OTP evidence is still weak;
- Yorn PT: current weekly-cost tariff blocks incoming calls/SMS after seven days unpaid; keep as HOLD negative knowledge rather than inventing a cheap annual keep cost;
- A1 HR: current SIM/recharge/KYC/roaming paths are captured, including EUR5 minimum displayed voucher, but current first-party voucher-to-validity duration is still unresolved; no annual cost is invented;
- all four generic canonical-adapter rows deep-equal the corrected reviewed comparison rows;
- canonical v1 is 53 routes / 30 markets / 50 brands / 36 networks / 182 sources; comparison remains 135, overlap is 42, legacy-only is 93, reviewed manifest remains intact and explicit indexability remains 3;
- all named A–K batch files are now dispositioned: 36 unique batch route IDs, 35 same-ID canonical representations, plus the already documented Sakura same-product legacy-ID blocker.

## NEXT SESSION — Post-A–K Phone checkpoint: choose the next bounded value move

**Session task:** do not invent batch-L. Inspect the 93 remaining legacy-only routes together with current Phone search/product evidence, then select at most one small next migration cohort **or** one existing route/market experience to deepen.

### Scope

1. inventory remaining legacy-only routes by user job, evidence freshness, identity confidence and decision value;
2. distinguish migration debt from actual user-facing growth opportunity;
3. check current Search Console/product signals before proposing any new indexable URL;
4. if a next migration cohort is selected, keep it small and require current-fact reconciliation + exact adapter parity;
5. if an existing route is selected for deeper publication, require the full SEO publication gate in `docs/PHONE_RADAR_OPERATING_PLAN_2026-09-24.md` before any indexability change;
6. keep comparison at 135, reviewed manifest intact and explicit indexability at 3 until a separate publication decision passes.

### Stop conditions

Stop and record the blocker if evidence is stale/contradictory, identity needs schema/alias redesign, exact parity fails, or publication value is not clearly stronger than the provider page and existing competitors. Do not bulk-migrate merely to increase canonical coverage.

## Qwen / Kimi work lane

QwenPaw/Kimi remain high-throughput backstage research/data workers. Their outputs are `RESEARCH CANDIDATE` until independently reviewed; they do not control canonical admission, publication, roadmap or deployment.

## External waits

- **TikTok App Review — WAITING.** Do not alter submitted configuration until review outcome.
- **Authority batch 2 — WAITING.** Follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; no extra outreach merely to create activity.

## Do not do next

- do not invent batch-L or bulk-migrate the 93 legacy-only routes;
- do not remove the PR #263 manifest gate or shrink the 135-route comparison surface;
- do not duplicate Sakura or any other same underlying product merely to preserve a legacy ID;
- do not equate canonical admission with SEO/indexability;
- do not redesign schema/backend for architectural neatness;
- do not let raw delegated output bypass review/admission/publication gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
