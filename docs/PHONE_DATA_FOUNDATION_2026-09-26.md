# Phone Radar — normalized data foundation

Date: 2026-09-26
Status: IMPLEMENTED IN BRANCH / PRODUCTION UI UNCHANGED UNTIL RELEASE

## User problem

Phone Radar cannot become a useful global decision product if each UI iteration hard-codes a handful of routes. Users need one searchable system that can answer country, network, brand, route, cost, retention, setup, service compatibility, and continuity questions without forcing them to read scattered forum threads.

## Root defect found

The historical Phone source loaded multiple independent JSON datasets plus a separate UK directory packet. Existing route identity was duplicated across generations (`giffgaff-uk` versus `giffgaff-uk-direct-esim-payg`, and `lebara-uk` versus `lebara-uk-direct-esim-china`). Search/filter logic therefore depended on front-end special cases instead of a durable data model.

## Implemented foundation

The new reviewed store under `data/phone/v1/` separates markets, networks, brands, concrete routes, sources, service observations, lifecycle events, time-versioned snapshots, legacy aliases, a service vocabulary, and regulator/provider-backed number-range records when available.

The initial migration deliberately excludes generic placeholder routes and does not upgrade old records to current evidence. Current seed after cleanup contains 7 market/meta-market records, 14 brands, 15 concrete/platform routes, 61 deduplicated sources, 8 service observations, 5 lifecycle events, and 51 typed snapshots. UK pilot route state remains explicit: admitted routes stay admitted, Vodafone stays hold, and older non-UK/public data is marked `needs-reconciliation` rather than silently revalidated.

## Browser/search architecture

The compiler produces a small route-summary dataset, a text/facet search index, and one lazy detail JSON per route. The full database bundle remains available for audit/export but is not the intended first-screen payload.

Search priority is route/brand identity → country/market/network → explicit service/operation → lower-weight evidence tokens. Numeric route metrics support cheapest keep/year, longest keep window and lowest start-cost ordering; service evidence can be ordered by an evidence grade that always retains sample size/date/confidence. The current automated checks cover brand search (`Tello`), country/family filtering (`Japan` long-term), multi-term route discovery (`Croatia esim`), service discovery (`WhatsApp` in GB), temporary-family filtering, alias de-duplication, and per-route detail bundles.

## What this changes about the UI plan

The next Phone UI must consume this normalized layer. It must not create another UK-only hard-coded array or copy the historical generic tool shell. The intended interaction is:

`search / family / country / key need → immediate route shortlist → pin/compare → lazy route detail/guide`

The first screen should use decision-critical fields only; full evidence/history is fetched when the user asks for detail.

## What is deliberately not done here

- no public ranking change;
- no new public route claim from raw Kimi/Qwen research;
- no invented country/operator coverage;
- no SQL/backend service added merely for browsing static reviewed data;
- no visual redesign bundled into the data-foundation task.

## Next ingestion step

Kimi/Qwen should continue high-throughput community-first candidate extraction into a backstage inventory. The coordinating session samples/deduplicates it, preserves canonical HOLD decisions, and imports acceptable records as `research-candidate` or current canonical states before the UI is broadened.

## Number-range source note

Ofcom currently publishes the UK `07` allocation dataset and portability-code datasets with a stated weekly update cadence. The source page was reachable during this session, but the observer received HTTP 403 when requesting the direct `S7.csv` asset. This is recorded as a source-fetch blocker, not as evidence that the data does not exist. No fabricated range records were added. Range allocation will be stored as original allocation evidence, not as proof of the subscriber's current serving carrier after number portability.
