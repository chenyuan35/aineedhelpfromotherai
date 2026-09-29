# Current Execution Queue

Last updated: 2026-09-29

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Broad comparison coverage stays preserved.** The 135-route legacy comparison artifact remains authoritative behind the PR #263 reviewed-manifest gate.
3. **Named batch A–K migration is complete.** Canonical v1 remains 53 routes / 30 markets / 50 brands / 36 networks / 182 sources; 42 route IDs overlap the comparison set and 93 remain legacy-only.
4. **The only named-batch legacy ID not represented by the same canonical ID is the known Sakura same-product alias blocker.** Do not duplicate that product.
5. **Post-A–K value checkpoint selected existing-URL deepening, not batch-L.** Fresh first-party Phone data remains only 4 hub impressions / 0 clicks through 2026-09-25 after the 2026-09-29 measurement re-read; the three currently indexable route URLs have no Search Console rows in the checked window.
6. **Global Phone finder is RELEASED and stays stable while data accrues.** PR #291 squash-merged as `3b0ec6e03c078bd0121b378b4d535aa2adda81ff`; production verification passed.
7. **Publication remains separate.** Comparison stays 135 and explicit route indexability stays 3; the global finder does not create new route/market SEO URLs or sitemap entries.
8. **AI Reset Radar — FROZEN. Relay Exit Risk — data-accrual only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.
Post-A–K checkpoint: `docs/PHONE_POST_AK_VALUE_CHECKPOINT_2026-09-29.md`.

## JUST COMPLETED — LMT Latvia evidence reconciliation

Result: **ADMIT-BACKSTAGE EVIDENCE UPDATE / NO PUBLICATION CHANGE.**

`docs/PHONE_LMT_LATVIA_EVIDENCE_RECONCILIATION_2026-09-29.md` corrects the existing legacy interpretation for `lmt-karte-60-60d-2026`:

- current base new number is EUR 1.50 with physical SIM + eSIM availability;
- current official wording is 60-day advance validity + 60 days for receiving calls/texts, while the same page also labels the base offer a 120-day active number;
- `Time Limit+` currently costs EUR 0.30 for +30 days to both balance-expiry and use-by dates, so the legacy ~EUR18/year top-up-only estimate is not the cheapest documented path;
- exact minimum annual keep cost remains unresolved; do not publish EUR3.60/year as guaranteed;
- ordinary LMT Karte use does not require prior customer registration; optional registration exists for extra account/recovery services;
- current LMT guidance asks users to activate in Latvia and warns foreign activation may be limited;
- sending SMS while abroad is disabled by default until LMT removes the restriction after connection identification;
- missed-expiry recovery is possible free within six months with the original PIN1, followed by refill within three days.

No canonical migration, comparison-count change, indexability change, sitemap change or public copy change is authorized by this packet.

## MEASUREMENT WAIT — trigger not met

Result of the 2026-09-29 first-party re-read: **WAIT.**

- Search Console still returns only 4 Phone hub impressions / 0 clicks through 2026-09-25;
- connected GA4 returned no usable rows for the checked dates;
- do **not** re-read merely because a new session starts;
- re-open measurement only after at least 7 additional finalized days, 20 cumulative settled Phone impressions, or a clear regression signal.

## NEXT SESSION — Backstage Phone evidence reconciliation round

**Session task:** process one small evidence batch while the public finder remains stable.

### Priority order

1. fetch and review the currently running QwenPaw/Kimi K3 Phone research task when it finishes;
2. sample-audit at most 1–3 candidate routes for source quality, duplication, stale claims, unsupported inference and conflicts;
3. if the delegated batch is still unavailable, reconcile one already-identified legacy-only candidate from the post-A–K shortlist rather than inventing a new batch; Telia Estonia is the first fallback candidate after the completed LMT Latvia review;
4. classify each reviewed candidate as `REJECT`, `HOLD` or `ADMIT-BACKSTAGE` and persist only accepted evidence through branch/PR workflow;
5. do not migrate canonical rows, add indexable URLs or alter ranking/publication state unless a separately documented trigger opens that work.

### Definition of done

- one bounded evidence batch is fully dispositioned;
- accepted facts have source URL/date/provenance and unresolved conflicts recorded;
- duplicates/stale claims are rejected or corrected;
- no public/indexability change occurs;
- Kimi/Qwen parallel lane is dispatched or its status/blocker is explicitly recorded.

### Stop conditions

Stop if evidence is insufficient to classify the selected candidate(s), if the candidate is a duplicate of the same underlying product, or if the work would require publication/schema/infrastructure changes. Do not manufacture batch-L or use database coverage as a reason to publish.

## Qwen / Kimi work lane

QwenPaw/Kimi remain high-throughput backstage research/data workers. Their outputs are `RESEARCH CANDIDATE` until independently reviewed; they do not control canonical admission, publication, roadmap or deployment.

## External waits

- **TikTok App Review — WAITING.** Do not alter submitted configuration until review outcome.
- **Authority batch 2 — WAITING.** Follow `docs/AUTHORITY_AND_AI_DISCOVERY.md`; no extra outreach merely to create activity.

## Do not do next

- do not re-run Search Console before its measurement trigger merely to create activity;
- do not invent batch-L or bulk-migrate the 93 legacy-only routes;
- do not remove the PR #263 manifest gate or shrink the 135-route comparison surface;
- do not duplicate Sakura or any other same underlying product merely to preserve a legacy ID;
- do not equate canonical admission with SEO/indexability;
- do not redesign schema/backend for architectural neatness;
- do not let raw delegated output bypass review/admission/publication gates;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
