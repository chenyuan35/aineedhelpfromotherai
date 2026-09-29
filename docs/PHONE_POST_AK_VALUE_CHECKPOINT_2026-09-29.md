# Phone Radar Post-A–K Value Checkpoint — 2026-09-29

Status: DECISION COMPLETE — deepen the existing Phone hub before any new migration or indexable route.

## Decision

Do **not** invent batch-L and do **not** expand the three-route indexability allowlist.

The next bounded value move is the existing canonical Phone hub: replace its UK-pilot-only long-term comparison experience with a global progressive finder backed by the already-admitted 135-route comparison layer.

## Current search evidence

First-party Search Console data was read through the connected Windsor.ai Search Console account because the primary GSC Wizard connection is currently blocked by its subscription gate. The second GSC Wizard account does not contain the domain property.

Fresh Phone hub page-level rows currently visible are:

- 2026-09-21: 1 impression, 0 clicks, position 9.0;
- 2026-09-23: 2 impressions, 0 clicks, position 13.5;
- 2026-09-25: 1 impression, 0 clicks, position 5.0.

Total: 4 impressions, 0 clicks. Query-level data exposes only `survival number` on 2026-09-23: 1 impression, position 22.

The three currently indexable route URLs (`voxi-uk-esim-payg-retention`, `lebara-uk-direct-esim-china`, `giffgaff-uk-direct-esim-payg`) return no Search Console rows for 2026-09-01..2026-09-29, even with fresh data enabled.

## Legacy-only inventory

The comparison layer still contains 93 route IDs that are not represented by the same route ID in canonical v1. This is real migration debt, but it is not automatically product or SEO debt.

A bounded ranking by current evidence, keep-cost completeness, provider-source support and route identity shows several relatively easy future migrations, including LMT Latvia, Safaricom Daima, Telia Estonia, Chunghwa Ruyi, Telekom Easy Slovakia, Beeline Kazakhstan and Magti Georgia.

Those candidates are useful for backstage coverage. They do not solve the current search/product bottleneck by themselves.

The known `sakura-mobile-voice-2026` legacy ID remains the same underlying product as canonical `sakura-japan-voice-data`; it must not be duplicated merely to improve overlap counts.

## Product mismatch found

The Phone hub already describes itself as a global route decision tool, while the long-term visual comparison path still loaded and rendered `uk-directory-pilot.json` as a UK-only experience.

That mismatch is higher leverage than migrating another small batch: users reaching the existing canonical Phone URL should be able to search the already-admitted 135-route comparison layer without forcing the full deep database into the first page load.

## Selected MVP

- generate a compact 135-route comparison index from the reviewed global comparison layer plus publication policy;
- show a global market overview and country/carrier/route search on the existing Phone hub;
- load full `global-directory.json` only after a market or route-evidence action;
- keep compare/inspect/guide progressive and reuse the current visual decision components;
- keep the current three standalone indexable route pages unchanged.

## Explicit non-goals

- no batch-L migration in this release;
- no new route, market or keep-alive SEO URL;
- no sitemap expansion from comparison rows;
- no backend/API or persistence service;
- no publication-policy weakening;
- no conversion of HOLD/unknown evidence into recommendations.

## Validation contract

Success requires all of the following:

- the lightweight comparison index remains exactly 135 admitted rows;
- first-load long-term UI no longer depends on the UK pilot deep packet;
- full global comparison data is fetched only after a user chooses a market or route evidence;
- the existing visual compare/guide workflow works with non-UK currencies and markets;
- canonical remains 53 routes / 30 markets / 50 brands / 36 networks / 182 sources;
- standalone route detail generation remains exactly three routes and market detail generation remains zero;
- explicit indexability remains three;
- existing build, Phone data, public-release, CI, Eval Gate and Preview checks remain green.

Rollback is one bounded PR revert. No data migration or external state change is required.

## Re-open triggers

Reconsider a new migration cohort or publication expansion only when current usage/search evidence shows a distinct next user job, or when a high-value route has enough independent operational evidence to pass the full publication gate. Database coverage alone is not a trigger.
