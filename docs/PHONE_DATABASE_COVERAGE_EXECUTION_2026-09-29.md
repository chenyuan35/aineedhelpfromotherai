# Phone Radar backend database coverage execution — 2026-09-29

Status: **ACTIVE BACKEND COVERAGE TRACK / NO PUBLICATION CHANGE**

Phone Radar's normalized database is an internal product knowledge base. It is intentionally broader than the public/indexable URL set. Canonical admission and SEO publication are separate gates.

## Coverage objective

Approximately **90%+ coverage of the relevant low-cost phone-route universe**, provided evidence provenance and maintenance remain tractable. This is a database objective, not a page-count objective.

## Current verified state after DB-C4D

- comparison artifact: **135 routes**;
- canonical normalized database: **101 routes / 57 markets / 98 brands / 77 networks / 334 sources**;
- comparison↔canonical route-ID overlap: **90**;
- comparison routes still legacy-only: **45**;
- explicit route indexability: **3**.

## Processing model

Work in reviewed database batches (`DB-C1`, `DB-C2`, ...). For every route preserve current product identity, acquisition, retention lifecycle, KYC/location/payment constraints, SIM form, sourced roaming/SMS facts, incident/recovery/recycling evidence, source URL/date/type, explicit conflicts/unknowns, and duplicate checks. Missing stays missing; isolated incidents never become product-wide rates.

## DB-C1 — COMPLETE

Research task: `task-1e549d80fe6d`; independent review overrode delegated output where fresher first-party evidence conflicted.

Final dispositions:

- HOLD: `a1-bfree-at-2026`
- HOLD: `proximus-paygo-be-2026`
- ADMIT-BACKSTAGE: `o2-cz-prepaid-2026`
- HOLD: `vodafone-tuti-hu-2026`
- HOLD: `telkomsel-simpati-365d-2026`
- HOLD: `vodacom-prepaid-83d-2026`
- HOLD: `beeline-kz-simka-v-seyfe-2026`
- ADMIT-BACKSTAGE: `magticom-number-maintenance-2026`
- HOLD: `mobitel-lk-retention-2026`
- ADMIT-BACKSTAGE: `yettel-rs-2026`
- HOLD: `cellcard-kh-2026`
- HOLD: `grameenphone-validity-pack-2026`

All 12 are normalized in the backend with provenance/conflicts; HOLD means not ready for recommendation/public treatment, not exclusion from the internal evidence database.

Important corrections made during DB-C1:

- Telkomsel legacy Rp5,000/year minimum withdrawn;
- Vodacom legacy 83-day rule replaced by current official >110-day no-use threshold, with recycle timing unresolved;
- Grameenphone stale five-year price withdrawn in favor of clean BDT300/365-day current rule plus conflict preservation;
- A1 13-month/EUR20 extension resolved from current official FAQ;
- Proximus separate 6-month no-use deactivation preserved alongside 12-month top-up validity;
- Vodafone Hungary legacy identity mapped to current One Tuti without changing the stable route ID;
- Cellcard 30-vs-180-day official expired-balance recovery conflict preserved rather than guessed away.

## DB-C2 — COMPLETE batch members

The 12 legacy-only candidates processed in DB-C2 were:

1. `tesco-mobile-payg-uk-2026`
2. `vinaphone-giu-so-vn-2026`
3. `cellfie-ge-90-45d-2026`
4. `kyivstar-prepaid-274-91-2026`
5. `dialog-lk-365d-2026`
6. `safaricom-daima-2026`
7. `truemove-validity-pack-th-2026`
8. `cht-ruyi-180d-2026`
9. `telia-ee-180d-2026`
10. `mts-sokhranyayu-nomer-2026`
11. `etisalat-wasel-ae-2026`
12. `claro-pre-br-90d-2026`

Legacy costs are discovery hints only. Reverify product existence, current price, lifecycle and constraints before admission. Dedicated retention products (for example Safaricom Daima or MTS number preservation) should be modeled as services attached to the underlying prepaid line, not invented as separate products if the canonical schema can represent that relation without duplication.

## Quality gate

- first-party current provider facts for provider-controlled claims;
- independent evidence where useful for operational conflicts;
- sample audit ≥3 candidates per batch;
- `REJECT` / `HOLD` / `ADMIT-BACKSTAGE` disposition;
- importer-based canonical write only after review;
- full Phone data/integrity/publication-boundary tests;
- public/indexability/sitemap unchanged unless a separate publication trigger opens.

## What this track does not do

- no new SEO URL because a database row exists;
- no automatic public ranking/recommendation;
- no forced completion of unknown fields;
- no SQL/API redesign merely to call the data layer a backend;
- no mass raw import of legacy rows without evidence review.

## DB-C2 — completed 2026-09-29

DB-C2 normalized 12 more existing comparison routes through reviewed packets after two delegated research lanes plus an independent sample audit. Final DB-C2 disposition: **10 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**.

Post-DB-C2 state: **77 canonical routes / 47 markets / 264 sources / 66 comparison-overlap route IDs / 69 comparison routes still legacy-only / 3 explicit indexable routes**.

The two HOLD routes (`truemove-validity-pack-th-2026`, `claro-pre-br-90d-2026`) remain in the normalized backend with uncertainty preserved. Community or legacy mechanisms are not discarded merely because a current public provider page is inaccessible.

## DB-C3 — completed 2026-09-29

DB-C3 independently reviewed and normalized 12 additional legacy-only routes through approved backstage packets. Final disposition: **7 ADMIT-BACKSTAGE / 5 HOLD / 0 REJECT**.

Post-DB-C3 state: **89 canonical routes / 51 markets / 86 brands / 67 networks / 293 sources / 78 comparison-overlap route IDs / 57 comparison routes still legacy-only / 3 explicit indexable routes**.

The five HOLD routes are `asda-mobile-uk-2026`, `lycamobile-uk-keep-number-2026`, `lmt-karte-60-60d-2026`, `free-mobile-fr-2026`, and `good2go-payg-ca-2026`. Their current unresolved provider-text, exact-cost or eligibility constraints remain explicit rather than inferred.

Material corrections include ASDA activity-vs-credit-expiry separation; Lyca UK's current EE host network; withdrawal of LMT's unsupported EUR18/year estimate; Telekom Easy's 180-day post-top-up validity; CALENDAR's current JPY7,860 entry and JPY5,400 same-number extension; Orange Romania active/grace separation; 1pMobile's cohort-specific 2026 rules; and RedPocket's current USD110 annual renewal plus U.S.-only activation.

Release: PR #305 squash-merged as `82299c03500f029db1fb6241fbaaf4d5bcbcb3f0`; Eval Gate #949, Vercel Preview/production and live publication-boundary verification passed.

## DB-C4A — completed 2026-09-29

The first three DB-C4 candidates were independently reviewed as the required sample audit and normalized through approved backstage packets. Final DB-C4A disposition: **1 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**.

- `cosmote-frog-13mo-2026` — ADMIT-BACKSTAGE. Current provider evidence keeps the 13-month number-renewal window, while the current FROG electronic top-up minimum is EUR13; the old EUR10 estimate is withdrawn.
- `optus-flex-plus-au-2026` — HOLD. Current long-expiry prices are A$180/186 days and A$350/365 days, and Optus has a provider-announced 2026-09-30 price change; the old A$59/A$180 ladder is stale.
- `lebara-fr-2026` — HOLD. Lebara France now uses SFR. Current provider material separates 90-day recharge validity from a 90-consecutive-day no-service-use termination rule, so the legacy top-up-only retention cost is not treated as proven.

Post-DB-C4A state: **92 canonical routes / 52 markets / 89 brands / 70 networks / 305 sources / 81 comparison-overlap route IDs / 54 comparison routes still legacy-only / 3 explicit indexable routes**. Full Phone checks and the frontend build preserve **135 comparison routes / 3 route detail pages / 0 market detail pages**.

DB-C4 remains active with the remaining six candidates listed in `docs/CURRENT_EXECUTION_QUEUE.md`.

## DB-C4B — completed 2026-09-29

The next three DB-C4 candidates were independently reviewed and normalized through approved backstage packets. Final DB-C4B disposition: **1 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**.

- `smart-prepaid-ph-2026` — HOLD. Current provider material keeps ordinary loaded value valid for 365 days and gives a 180-day reload grace after balance reaches zero, but tourist-registered foreign SIMs are valid only 30 days unless an approved visa extension is supplied; other visa categories are not subject to that temporary cap.
- `mtn-ng-keepmynumber-2026` — ADMIT-BACKSTAGE. Current MTN Keep My Number prices are NGN3,500/1 year, NGN5,000/2 years and NGN7,500/3 years. Current prepaid terms also correct the old blanket NIN assumption: visitors staying under 24 months may register with a valid visa and passport/travel document instead of NIN.
- `id-mobile-uk-2026` — HOLD. Current PAYG legal terms use a four-month/120-day inactivity clock and 365-day unused-credit expiry, while current iD marketing and a provider employee community answer say 180 days; the stricter legal clock is retained operationally and the conflict stays explicit.

Post-DB-C4B state: **95 canonical routes / 53 markets / 92 brands / 72 networks / 313 sources / 84 comparison-overlap route IDs / 51 comparison routes still legacy-only / 3 explicit indexable routes**. Full Phone checks preserve **135 comparison routes / 3 explicit indexable routes**.

Release: PR #309 (`518e7ab737e4ec53a8dba2740e1e752e83adc96a`) merged after Eval Gate #957, CI #183 and Vercel Preview passed; production succeeded. Live checks confirmed the hub and existing VOXI detail at HTTP 200 and the non-indexable MTN Nigeria route at HTTP 404.

DB-C4 remains active with the remaining six candidates listed in `docs/CURRENT_EXECUTION_QUEUE.md`.

## DB-C4C — completed 2026-09-29

The next three DB-C4 candidates were independently reviewed and normalized through approved backstage packets. Final DB-C4C disposition: **1 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**.

- `us-mobile-light-2026` — HOLD. Current Light pricing remains USD10/month or USD96/year. Native roaming requires prior domestic U.S. usage, and Warp/Dark Star Wi-Fi Calling setup requires U.S. coverage; a general China-first route is not established.
- `lycamobile-us-2026` — HOLD. Current official terms retain the 60-day non-use expiry. The old USD120/year minimum is withdrawn because current long-term pricing includes USD108/12 months, while exact minimum PAYG keep-alive economics remain unresolved. Current evidence places service on AT&T and preserves 2026 migration incidents without converting them into a failure-rate claim.
- `orange-sn-sama-numero-2026` — ADMIT-BACKSTAGE. Current Sama Numéro pricing is XOF3,000/6 months, XOF5,000/12 months and XOF10,000/24 months, payable from airtime or Orange Money; validity begins at subscription. Teeru tourist SIM/eSIM also explicitly supports extension through Sama Numéro.

Post-DB-C4C state: **98 canonical routes / 54 markets / 95 brands / 74 networks / 323 sources / 87 comparison-overlap route IDs / 48 comparison routes still legacy-only / 3 explicit indexable routes**. Full Phone checks preserve **135 comparison routes / 3 explicit indexable routes**.

Release: PR #311 (`a9bcc8a4628ab77a69f956cddbebc33800bcd84c`) merged after Eval Gate #961, CI #185 and Vercel Preview passed; production succeeded. Live checks confirmed the Phone hub and existing VOXI route at HTTP 200 and the non-indexable Orange Senegal route at HTTP 404.

DB-C4D completed the remaining bounded DB-C4 candidates.

## DB-C4D — completed 2026-09-29

The final three DB-C4 legacy-only candidates were independently reviewed and normalized through approved backstage packets. Final DB-C4D disposition: **2 ADMIT-BACKSTAGE / 1 HOLD / 0 REJECT**.

- `elisa-prepaid-fi-2026` — ADMIT-BACKSTAGE. Current Elisa material resolves the validity gap: 3 months from first activation, 12 months after every recharge, then a one-month expired receive/recharge window. Balance top-ups are EUR10-100. Elisa states Prepaid cannot be registered to the subscriber name/personal identity number and must be activated in Finland before use abroad.
- `cyta-soeasy-cy-2026` — ADMIT-BACKSTAGE. Current Cyta material establishes EUR5 as the lowest listed credit top-up granting 365 days, followed by 7 days incoming-only plus 15 days before cancellation. Current prepaid terms require identification; non-EU customers may use a passport, and remote top-up is available while abroad.
- `hotmobile-il-2026` — HOLD. Current Israeli recharge retailers consistently list a HOTALK 66 ILS pay-per-use balance load valid for 180 days, but a current HOT Mobile first-party number-deactivation/recycling rule was not located. The legacy blanket no-KYC claim is withdrawn as unverified.

Post-DB-C4D state: **101 canonical routes / 57 markets / 98 brands / 77 networks / 334 sources / 90 comparison-overlap route IDs / 45 comparison routes still legacy-only / 3 explicit indexable routes**. Full Phone data checks and the frontend build preserve **135 comparison routes / 3 explicit indexable routes**.

DB-C4 is complete. Continue DB-C5 through the bounded candidates in `docs/CURRENT_EXECUTION_QUEUE.md`.
