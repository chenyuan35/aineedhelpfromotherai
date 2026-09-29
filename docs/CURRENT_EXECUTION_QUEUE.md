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

## JUST COMPLETED — QwenPaw / Kimi K3 Phone evidence sample review

Result: **BOUNDED BACKSTAGE REVIEW COMPLETE / NO PUBLICATION CHANGE.**

`docs/PHONE_PARALLEL_RESEARCH_REVIEW_2026-09-29.md` independently reviews three high-impact candidates from the completed delegated batch:

- **ClubSIM HK — ADMIT-BACKSTAGE EVIDENCE CORRECTION.** The 365-day service-pack lifecycle remains supported, but the prior claim that the current official web surface still lists the standalone HK$6 SMS pack is stale. Do not treat HK$6/year as a currently guaranteed keep cost; exact cheapest currently purchasable Service Pack remains unresolved.
- **Optus AU — ADMIT-BACKSTAGE EVIDENCE CORRECTION.** The legacy summary `$59/186d or $180/365d` is mis-mapped/stale. Current first-party evidence shows AUD180/186d and AUD350/365d standard prices before the announced 2026-09-30 change, with AUD200/186d and AUD395/365d scheduled from that date. Reverify after the effective date before treating the new prices as current.
- **Ultra Mobile PayGo US — HOLD.** 2026 incidents support a reseller/payment-channel risk signal, not a route-wide product-instability conclusion. Keep the current official-channel acquisition guidance and do not generalize a ban probability.

The QwenPaw/Kimi K3 task completed successfully with 13 research candidates. Only the three candidates above are dispositioned by this review; the other raw findings remain `RESEARCH CANDIDATE`.

No canonical migration, comparison-count change, indexability change, sitemap change or public copy change is authorized by this review.

## MEASUREMENT WAIT — trigger not met

Result of the 2026-09-29 first-party re-read: **WAIT.**

- Search Console still returns only 4 Phone hub impressions / 0 clicks through 2026-09-25;
- connected GA4 returned no usable rows for the checked dates;
- do **not** re-read merely because a new session starts;
- re-open measurement only after at least 7 additional finalized days, 20 cumulative settled Phone impressions, or a clear regression signal.

## NEXT SESSION — Optus effective-date check or Telia Estonia fallback

**Session task:** continue one bounded Phone evidence reconciliation while the public finder remains stable.

### Priority order

1. on or after **2026-09-30**, verify the live Optus long-expiry page after the announced price change;
2. if Optus has switched, reconcile the existing `optus-flex-plus-au-2026` legacy evidence so future work cannot reuse the stale `$59/186d` / `$180/365d` mapping; keep publication/indexability unchanged unless a separate correction task explicitly authorizes public mutation;
3. if the effective-date check is premature, unavailable or still transitional, reconcile **Telia Estonia**, the already-identified legacy-only fallback candidate from the post-A–K shortlist;
4. classify the selected route as `REJECT`, `HOLD` or `ADMIT-BACKSTAGE` and persist only accepted evidence through branch/PR workflow;
5. do not migrate canonical rows, add indexable URLs or alter ranking/publication state unless a separately documented trigger opens that work.

### Definition of done

- one route is fully dispositioned;
- accepted facts have source URL/date/provenance and unresolved conflicts recorded;
- stale claims are explicitly blocked from future reuse;
- no public/indexability change occurs;
- Qwen/Kimi parallel lane status is recorded if used.

### Stop conditions

Stop if evidence is insufficient to classify the selected route, if the route is a duplicate of the same underlying product, or if the work would require publication/schema/infrastructure changes. Do not manufacture batch-L or use database coverage as a reason to publish.

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