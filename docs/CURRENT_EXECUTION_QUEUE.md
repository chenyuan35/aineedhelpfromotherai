# Current Execution Queue

Last updated: 2026-09-29

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Broad comparison coverage stays preserved.** The 135-route legacy comparison artifact remains authoritative behind the PR #263 reviewed-manifest gate.
3. **Named batch A–K migration is complete.** Batch-K migrated four HOLD routes with exact parity; canonical v1 is now 53 routes / 30 markets / 50 brands / 36 networks / 182 sources; 42 route IDs overlap the comparison set and 93 remain legacy-only.
4. **The only named-batch legacy ID not represented by the same canonical ID is the known Sakura same-product alias blocker.** Do not duplicate that product.
5. **Post-A–K value checkpoint selected existing-URL deepening, not batch-L.** Fresh first-party Phone data is only 4 hub impressions / 0 clicks through 2026-09-25, and the three currently indexable route URLs have no Search Console rows in the checked window.
6. **Publication remains separate.** Explicit indexability remains 3; canonical migration does not imply route/market URLs, sitemap entries or ranking claims.
7. **AI Reset Radar — FROZEN. Relay Exit Risk — data-accrual only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Compatibility audit: `docs/PHONE_CANONICAL_COMPARISON_COMPATIBILITY_AUDIT_2026-09-28.md`.

## CURRENT TASK — Global Phone finder progressive UI on the existing canonical hub

Result so far: **IMPLEMENTED LOCALLY / RELEASE GATE PENDING.**

- post-A–K checkpoint is documented in `docs/PHONE_POST_AK_VALUE_CHECKPOINT_2026-09-29.md`;
- the 93 legacy-only routes were triaged as migration debt versus user-facing value; no batch-L was authorized;
- Windsor.ai fresh Search Console data shows the Phone hub at 4 impressions / 0 clicks through 2026-09-25, while the three current indexable route URLs return no rows for the checked September window;
- the existing Phone hub still presented a UK-pilot-only long-term comparison despite the already-admitted 135-route global comparison layer;
- the bounded fix adds a compact 135-route comparison index, global market overview and country/carrier/route search;
- full `global-directory.json` is loaded only after a user selects a market or opens route evidence;
- no backend/API, new SEO URL, sitemap expansion or publication-policy relaxation is included;
- local Phone data checks, static build, public-release audit, standard verify and diff check pass; generated output remains 3 route detail pages / 0 market detail pages.

## NEXT SESSION — Measure the global finder before another migration/publication move

**Session task:** after the global finder release is production-verified, keep the Phone surface stable long enough to collect real search and product-interaction evidence before selecting another migration cohort or indexable route.

### Scope

1. verify the production Phone hub, compact comparison index and lazy global-directory path remain healthy;
2. preserve comparison at 135, canonical at 53 unless a separately justified data correction lands, and explicit indexability at 3;
3. re-read first-party Search Console after at least 7 additional finalized days or 20 cumulative settled Phone impressions, unless a regression appears sooner;
4. inspect product events for search/filter, market-open, guide-open, compare and outbound behavior when sufficient data exists;
5. only then choose either one small evidence-backed migration cohort or one existing route/market experience to deepen;
6. require the full publication gate before any new standalone indexable URL.

### Stop conditions

Do not manufacture a next task from low data. If search/usage samples remain too small, keep production stable and continue backstage evidence acquisition rather than adding pages or migrating rows for activity's sake.

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
