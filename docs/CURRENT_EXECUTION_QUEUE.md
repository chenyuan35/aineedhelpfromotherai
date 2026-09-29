# Current Execution Queue

Last updated: 2026-09-29

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Broad comparison coverage stays preserved.** The 135-route legacy comparison artifact remains authoritative behind the PR #263 reviewed-manifest gate.
3. **Named batch A–K migration is complete.** Canonical v1 remains 53 routes / 30 markets / 50 brands / 36 networks / 182 sources; 42 route IDs overlap the comparison set and 93 remain legacy-only.
4. **The only named-batch legacy ID not represented by the same canonical ID is the known Sakura same-product alias blocker.** Do not duplicate that product.
5. **Post-A–K value checkpoint selected existing-URL deepening, not batch-L.** Fresh first-party Phone data remains only 4 hub impressions / 0 clicks through 2026-09-25 after the 2026-09-29 measurement re-read; the three currently indexable route URLs have no Search Console rows in the checked window.
6. **Global Phone finder is now RELEASED.** PR #291 squash-merged as `3b0ec6e03c078bd0121b378b4d535aa2adda81ff`; main tree is `1d2dd9b668c660f91b9b287d60d435b1b5fa4200`. Production Vercel deployment succeeded. Live verification: Phone hub HTTP 200, `comparison-route-index.json` HTTP 200, admitted VOXI route HTTP 200, representative non-indexable Three IE route HTTP 404.
7. **Publication remains separate.** Comparison stays 135 and explicit route indexability stays 3; the global finder does not create new route/market SEO URLs or sitemap entries.
8. **AI Reset Radar — FROZEN. Relay Exit Risk — data-accrual only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Post-A–K checkpoint: `docs/PHONE_POST_AK_VALUE_CHECKPOINT_2026-09-29.md`.

## JUST COMPLETED — Global Phone finder progressive UI on the existing canonical hub

Result: **PASS / MERGED / PRODUCTION-VERIFIED.**

- PR #291 replaced the UK-pilot-only long-term landing experience with a global market overview plus country/carrier/route search over the admitted 135-route comparison layer;
- initial loading uses the generated compact comparison index; full `global-directory.json` loads only after a user selects a market or opens route evidence;
- existing comparison / inspect / guide behavior is reused across markets and currencies;
- no backend/API, new SEO URL, sitemap expansion or publication-policy relaxation was introduced;
- local `npm run phone:data:check`, static frontend build, public-release audit, `npm run verify`, inline-JS syntax check and `git diff --check` passed before release;
- PR Eval Gate #917 passed and Vercel Preview succeeded;
- squash merge SHA is `3b0ec6e03c078bd0121b378b4d535aa2adda81ff`; main tree matches the locally verified tree `1d2dd9b668c660f91b9b287d60d435b1b5fa4200`;
- production deployment completed successfully;
- live boundary check: hub 200, compact index 200, VOXI admitted route 200, Three IE non-indexable route 404.

## MEASUREMENT CHECK — 2026-09-29

Result: **WAIT / THRESHOLD NOT MET.**

- Windsor.ai Search Console re-read for 2026-09-16..2026-09-29 still returns only the Phone hub rows already finalized on Sep 21, Sep 23 and Sep 25: 4 impressions, 0 clicks total; no later finalized Phone row was returned;
- the decision trigger is therefore not satisfied: neither 7 additional finalized days nor 20 cumulative settled Phone impressions exists yet;
- the connected GA4 account returned no rows for the Sep 25..29 and Sep 28..29 reads, so there is not yet usable first-party finder interaction evidence from that connector; treat this as unavailable/empty measurement, not as proof of zero use;
- no regression signal was found from the Search Console read, so production remains unchanged and no migration/publication task is unlocked.

## NEXT SESSION — Measure the global finder before another migration/publication move

**Session task:** keep the released Phone surface stable and collect real search + product-interaction evidence before selecting another migration cohort or indexable route.

### Scope

1. confirm production health only if a regression signal appears; do not re-audit the release from scratch;
2. preserve comparison at 135, canonical at 53 unless a separately justified data correction lands, and explicit indexability at 3;
3. re-read first-party Search Console after at least 7 additional finalized days or 20 cumulative settled Phone impressions, unless a clear regression appears sooner;
4. inspect product events for search/filter, market-open, guide-open, compare and outbound behavior once sufficient data exists;
5. only then choose either one small evidence-backed migration cohort or one existing route/market experience to deepen;
6. require the full publication gate before any new standalone indexable URL;
7. while waiting for enough data, continue only non-destructive backstage evidence acquisition/reconciliation with Qwen/Kimi.

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
