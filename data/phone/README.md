# Phone Radar normalized data foundation

This directory is the canonical reviewed data layer for Phone Radar. It is not a public-page inventory and it must not be bulk-filled from operator catalog pages.

## Why this exists

The historical Phone implementation spread route facts across multiple unrelated JSON files and a separate UK pilot packet. That made duplicate IDs, stale facts, weak search, and one-off UI logic inevitable. The normalized layer separates identity from changing evidence so the site can scale beyond a four-route pilot without turning every UI change into a data rewrite.

## v1 tables

- `markets.json` — country/market identity.
- `networks.json` — host/mobile network identity when actually known.
- `brands.json` — carrier, MVNO, platform, or route brand.
- `routes.json` — concrete acquisition/use route identity and admission/surface state.
- `sources.json` — deduplicated source identity and URL.
- `observations.json` — service-specific operational observations such as ChatGPT/Telegram/WhatsApp outcomes.
- `events.json` — dated continuity, suspension, recovery, refund, or other lifecycle events.
- `snapshots.json` — time-versioned commercial, retention, capability, location, and frontstage facts.
- `aliases.json` — legacy IDs mapped to one canonical route ID.
- `services.json` — searchable application/service vocabulary and aliases (for example ChatGPT/OpenAI, Telegram, WhatsApp).
- `number-ranges.json` — reviewed E.164/prefix allocation records when a regulator/carrier source exists; empty is valid when no range has been admitted yet.

## State rules

`surfaceState` answers where a record may appear today; `evidenceState` answers how strongly the route is admitted.

- `public-pilot` / `admitted` — current reviewed public route.
- `public-hold` / `hold` — visible observation with an explicit blocker.
- `public-legacy` / `needs-reconciliation` — historical public data retained for migration, not promoted as newly verified.
- `backstage-only` / `research-candidate` or `needs-reconciliation` — research inventory only.

Missing data stays missing. A candidate route does not become public merely because it exists in this database.

## Build/runtime shape

`scripts/build-phone-database.mjs` validates referential integrity and compiles browser artifacts:

- `phone-route-summaries.json` — lightweight route summaries for first render/filtering.
- `phone-search-index.json` — normalized text/facet index for browser-side search, including numeric route metrics and service-evidence aggregates.
- `phone-route-data/<route-id>.json` — lazy-loaded full route detail/evidence bundle.
- `phone-database.json` — complete compiled bundle for audit/debug/export; not intended as the first-screen payload.
- `phone-search.mjs` — browser-side query/filter/ranking logic.

The production build runs the compiler in `--check` mode and fails if committed runtime artifacts drift from the canonical tables.

## Ingestion rule

Community/user evidence creates or strengthens route candidates. Official/provider pages may verify provider-controlled facts only after a candidate exists. Delegated Kimi/Qwen output enters as research-candidate material until reviewed. Do not merge raw bulk research directly into public route state.

## Search rule

Search gives highest weight to route/brand identity, then market/network, then explicit service/operation fields, then lower-weight evidence tokens. Filters are independent facets: family, market, evidence state, surface state, and form factor. Missing fields never increase rank.

## Scaling boundary

This is intentionally a repo-native static data store. Phone Radar does not need a production SQL/API dependency merely to browse reviewed public facts. Add shared backend persistence only when the product has a real multi-user write/state requirement that cannot be handled by the reviewed evidence pipeline.
