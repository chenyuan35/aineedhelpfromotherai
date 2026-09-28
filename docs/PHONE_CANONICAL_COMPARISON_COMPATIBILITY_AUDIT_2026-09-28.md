# Phone canonical → comparison compatibility audit

Date: 2026-09-28
Status: **STOP — NOT LOSSLESS YET**
Verified main baseline: `d8feddc0cdbdb9fe5bd09dc216a05dc869fc284a`

## Question

Can the current 135-route visual comparison dataset be generated directly from reviewed canonical `data/phone/v1` with a small adapter, so canonical normalized data becomes the only database-admission authority?

## Result

No. The current normalized canonical dataset is materially smaller than the legacy comparison dataset, and most comparison decision fields/provenance are not represented in canonical truth yet. Replacing `global-directory.json` with the current canonical compiler would drop most comparison routes and fields.

This is a data-migration gap, not an adapter-only gap. The PR #263 manifest gate must remain in place until the missing reviewed legacy records are migrated into canonical data and parity is proven.

## Verified inventory

| Layer | Routes | Markets | Brands | Networks | Sources |
|---|---:|---:|---:|---:|---:|
| canonical `data/phone/v1` | 15 | 7 | 14 | 2 | 61 |
| compiled canonical `phone-database.json` | 15 | 7 | 14 | 2 | 61 |
| legacy `global-directory.json` | 135 | 83 route markets | 134 | 112 | 219 |

Route-ID parity:

- canonical/global overlap: **4** routes;
- canonical-only: **11** routes;
- global-only: **131** routes;
- shared IDs: `giffgaff-uk-direct-esim-payg`, `lebara-uk-direct-esim-china`, `vodafone-uk-zero-esim-2026`, `voxi-uk-esim-payg-retention`.

Canonical snapshots do not hide the missing 131 routes: 51 snapshots reference only the same 15 canonical route IDs, and only **4 routes** currently have a `current-profile` snapshot carrying the rich comparison profile.

## Provenance gap

The 135 legacy comparison routes reference 213 distinct source IDs. Only 21 of those route-source IDs are present in canonical `data/phone/v1/sources.json`; **192 route-source IDs are not canonical yet**. A bulk adapter that copied legacy route rows without migrating their source records would weaken the reviewed provenance model.

## Shape gap

Canonical route rows intentionally hold normalized identity/state fields such as `marketId`, `brandId`, `networkId`, `family`, `form`, `numberClass`, `surfaceState`, `evidenceState`, `sourceIds` and `lastVerifiedAt`.

The legacy global route profile additionally carries user-decision fields consumed by the comparison/deep-detail surfaces, including:

- `landedCost`;
- `keep` action/cost/interval;
- `acquisitionSummary`;
- `numberType` / `simType`;
- `chinaActivation`;
- `kyc`;
- `payment`;
- `wifiCalling`;
- `roamingSms`;
- `refund`;
- `trend`;
- `tariffSummary`;
- `guideSteps`;
- legacy `publishState` / `avoidRoute` state.

All 135 legacy routes currently carry `keep`, `landedCost`, `kyc`, `payment`, `refund`, `trend`, `tariffSummary` and `acquisitionSummary`; the canonical `current-profile` layer contains these rich fields for only 4/15 canonical routes.

## UI dependency

`frontend/site/src/data/phone.js` still reads `global-directory.json` as the comparison/deep-detail source. The build also derives `directory/comparison-index.json` from it. The shallow directory requires at minimum route identity, brand/market display data, state, keep cost/interval and verification date; route detail/keep-alive surfaces require additional rich fields above.

The current canonical compiler emits `phone-database.json`, `phone-search-index.json`, route summaries, route metrics, service evidence and per-route detail bundles for only the 15 canonical routes. It does not reconstruct the 135-route global profile.

## ID compatibility

There is also legacy/canonical ID drift. For example, canonical `tello-us` and legacy `tello-paygo-credit-2026` share the `tello-us` brand but are different route IDs, and the current alias table does not establish a general compatibility mapping for legacy routes. ID migration therefore needs explicit reviewed decisions rather than filename/brand heuristics.

## Decision

Do **not** retire `global-directory.json`, `batch-admission-manifest.json`, or the PR #263 fail-closed admission helper yet. Do not point the comparison UI at the 15-route canonical compiler output. Doing so would shrink the visual comparison product from 135 routes to 15 and remove decision/provenance data.

The correct convergence path is staged canonical migration, not schema redesign or a one-shot bulk copy. Existing publication/indexability policy remains independent and unchanged.

## Verification

On the fresh main clone:

- `node scripts/build-phone-database.mjs --check` → `15 routes / 7 markets / 61 sources`;
- `node scripts/test-phone-candidate-pipeline.mjs` → `26 legacy batches explicitly admitted; 135 comparison routes preserved`;
- `node scripts/test-phone-publication-state.mjs` → `135 database routes; 3 explicit indexable routes`.

No production data, public URL, sitemap or publication state was changed by this audit.

## Next bounded task

Run one **canonical migration pilot** using the smallest already-admitted compatibility batch: `hk2-depth-batch-u.json` (one route: `cmhk-mysim-hk-2026`).

The pilot must migrate that route's identity, market/brand/network references, source provenance and rich current-profile fields into canonical `data/phone/v1`, then prove a small adapter can reproduce the same comparison fields without changing the current public comparison artifact. Only after parity passes should a later session decide whether to repeat the migration pattern across the remaining admitted batches.

Stop if the one-route pilot requires schema redesign, weakens provenance, changes route semantics/IDs without explicit mapping, or affects publication/indexability.
