# Phone Radar backend database coverage execution — 2026-09-29

Status: **ACTIVE BACKEND COVERAGE TRACK / NO PUBLICATION CHANGE**

Phone Radar's normalized database is an internal product knowledge base. It is intentionally broader than the public/indexable URL set. Canonical admission and SEO publication are separate gates.

## Coverage objective

Approximately **90%+ coverage of the relevant low-cost phone-route universe**, provided evidence provenance and maintenance remain tractable. This is a database objective, not a page-count objective.

## Current verified state after DB-C2

- comparison artifact: **135 routes**;
- canonical normalized database: **77 routes / 47 markets / 264 sources**;
- comparison↔canonical route-ID overlap: **66**;
- comparison routes still legacy-only: **69**;
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

DB-C3 is now active with 12 next low-cost/distinct legacy-only routes listed in `docs/CURRENT_EXECUTION_QUEUE.md`.
