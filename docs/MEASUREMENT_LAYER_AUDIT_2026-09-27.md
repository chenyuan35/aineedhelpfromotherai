# Measurement Layer Audit — 2026-09-27

## Scope

Bounded audit of the site's current measurement stack after the project-instruction cleanup. No public product/content change is authorized by this document.

## Verified production state

Production HTML at `https://aineedhelpfromotherai.com/` was fetched through the connected Vercel project and returned HTTP 200.

The live page contains Google Analytics 4 measurement ID:

- `G-FYKKNKRE58`

The production build also injects behavior instrumentation that emits these GA4 events when applicable:

- `home_job_select`
- `tool_open`
- `tool_action`

Therefore the site is **already instrumented for GA4 page/session measurement and basic behavior events**. Do not add a second analytics product merely because an in-chat reader cannot return GA4 rows.

## Current read paths

### Google Search Console

Windsor.ai has a readable Search Console connection for:

- `sc-domain:aineedhelpfromotherai.com`

This path successfully returns current Search Analytics data. Search Console remains the Google-organic measurement source for impressions, clicks, CTR, position, queries and pages.

Latest bounded check on 2026-09-27:

- settled data still runs through 2026-09-24;
- fresh 2026-09-25: 57 impressions, 1 click, 1.75% CTR, average position 8.61;
- fresh 2026-09-26: 30 impressions, 0 clicks, average position 8.10;
- Phone canonical over 2026-09-20..2026-09-26: 4 impressions, 0 clicks, average position 10.25;
- no newly expanded Phone route/market URL appeared in Search Console rows for that window.

### Google Analytics 4

Windsor.ai `googleanalytics4` authorization succeeded on 2026-09-27.

Connected property:

- property/account id: `553896884`
- name: `aineedhelpfromotherai`

However, Windsor returned **zero report rows** for all tested windows:

- `last_7dT`
- `last_30dT`
- `last_yearT`

The same reader also returned no metadata row when requesting account/measurement-stream fields.

Because the production GA4 tag is present and Search Console has recorded real Google clicks, the empty Windsor result must **not** be interpreted as zero website visitors. The current blocker is now a **GA4 property/data-stream/read-path mismatch or no-data condition**, not an OAuth authorization gap.

The GSC Wizard small-account connection still has no Google Analytics scope, so it is not a second usable GA4 read path at this checkpoint.

## Correct interpretation rule

Do not say `0 GSC clicks = 0 website visitors` and do not say `empty connector rows = 0 visitors`.

Use:

- Search Console for Google organic discovery/click performance;
- GA4 for actual sessions/users, channel mix, landing pages, engagement and events only after a reader returns verified rows;
- social/referral/AI traffic as separate channels when measurable.

## Next diagnostic

Do not re-authorize Windsor again unless its connection disappears.

The next bounded check is to verify whether GA4 property `553896884` is the property whose web stream uses measurement ID `G-FYKKNKRE58`, and whether that property itself is receiving events in GA4. Distinguish:

1. correct property + correct stream + events present -> Windsor read-path/provider problem;
2. correct property/stream but no events -> site collection/runtime problem;
3. wrong property or stream -> account/property selection problem.

Only after this is resolved should sessions/users/channel/landing-page/event reporting be used for growth decisions.

## Stop conditions

- Do not add PostHog, Mixpanel, Amplitude, Plausible or another analytics stack unless GA4 proves insufficient for a concrete requirement.
- Do not repeatedly reconnect or rotate accounts merely to chase an empty report.
- Do not change GA4 property/account settings, billing, consent configuration, or data retention without explicit authorization.
- Do not change public Phone content as part of measurement setup.
- Do not treat connector quota/auth/empty-row failures as traffic conclusions.
