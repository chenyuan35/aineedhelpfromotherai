# Phone NZ/Thailand batch-D identity / provenance reconciliation — 2026-09-29

Status: **RECONCILIATION + BOUNDED MIGRATION COMPLETE**

Scope is limited to `frontend/tools/phone-number-lifecycle-mvp/nz-th-directory-batch-d.json`:

- `skinny-prepay-12mo-2026`
- `2degrees-prepay-2026`
- `ais-sim2fly-365d-2026`

The 135-route comparison surface remains authoritative. This work does not authorize standalone route URLs, sitemap entries, ranking claims or publication-state expansion.

## Decision summary

| Route | Current decision | Key correction | Canonical consequence |
|---|---|---|---|
| `skinny-prepay-12mo-2026` | HOLD | Direct Skinny terms replace the old Spark-proxy lifecycle claim: add credit at least once per 12 months; current top-ups start at NZ$5. New SIMs must activate on a New Zealand network before roaming. | Migrate backstage with exact adapter parity; keep non-indexable. |
| `2degrees-prepay-2026` | HOLD | Current 2degrees guidance resolves the stale lifecycle blocker: minimum NZ$10 top-up every 365 days. Current new Prepay SIM/eSIM starts with the NZ$8 Monthly Plan, but overseas-first activation is not established by reviewed official material. | Migrate backstage with exact adapter parity; keep non-indexable. |
| `ais-sim2fly-365d-2026` | HOLD | Current 1-Year Global product is 2,699 THB promotional / 2,799 THB terms price. SIM registration is required; foreigners may use passport information. First activation can occur in supported countries including China, but AIS reserves the right to suspend roaming after more than 60 days of continuous roaming. | Migrate backstage with exact adapter parity; keep non-indexable. |

## Skinny Prepay

Current first-party facts:

- Skinny's own prepaid terms require adding credit at least once every 12 months or the account can be deactivated/expired.
- Current top-up amounts start at NZ$5.
- Current eSIM price is NZ$0 and the physical Trio SIM is NZ$2.
- New SIMs must be activated on New Zealand networks before a roaming pack can be used.
- Skinny Global Roaming supports sending and receiving text messages where the overseas network supports the service.

The old NZ$10 keep-alive value and Spark-proxy provenance are therefore stale. The current direct-provider retention model is NZ$5 / 12 months, but the route remains HOLD for a typical overseas-only user because first activation requires New Zealand network presence.

Sources:

- https://www.skinny.co.nz/mobileappskinny-terms/
- https://www.skinny.co.nz/pricing/plans
- https://www.skinny.co.nz/shop/skinny-trio-sim/
- https://www.skinny.co.nz/skinny-esim/
- https://www.skinny.co.nz/pricing/overseas-roaming

## 2degrees Prepay

Current first-party facts:

- Current Prepay guidance says a minimum NZ$10 top-up is required every 365 days to keep the Prepay account active; otherwise unused balance is forfeited and the SIM expires.
- New Prepay customers can choose a physical SIM or eSIM; delivery is free and the NZ$8 Monthly Plan is currently added to the new SIM.
- Official material supports eSIM installation and Prepay roaming, but the reviewed current sources do not establish that a brand-new Prepay line can complete first activation entirely from overseas.
- Current roaming material documents text use abroad. The Daily Roaming trigger list names sending a text but does not name receiving a text as a trigger, so inbound-SMS charging and service-specific OTP success should not be overstated.

The old HOLD reason based on pre-2024 terms is closed. The route remains HOLD only for the general overseas-first acquisition use case because first activation abroad is not currently established by explicit provider evidence.

Sources:

- https://www.2degrees.nz/help/mobile-help/plans/getting-started-on-prepay
- https://www.2degrees.nz/help/account-and-billing/billing-and-payment/prepay-balance-and-payments
- https://www.2degrees.nz/mobile-plans/prepay
- https://www.2degrees.nz/help/mobile-help/getting-started/help-with-sim-cards
- https://www.2degrees.nz/help/mobile-help/roaming/roaming-and-using-your-phone-overseas

## AIS SIM2Fly 1-Year Global

Current first-party facts:

- AIS currently advertises the 1-Year Global SIM2Fly at 2,699 THB promotional price; the dedicated Global 15GB terms retain a 2,799 THB package price.
- The package provides 15GB with 365-day package validity.
- China (including Tibet) is in the supported-country list, and first activation is permitted in Thailand or a supported SIM2Fly destination.
- An activated SIM must be used in a designated country within 60 days or the roaming package can be voided.
- AIS reserves the right to suspend roaming after more than 60 days of continuous roaming.
- AIS requires SIM registration. Its current registration guidance accepts passport information for foreign nationals; the old passport-free wording is not valid.
- SIM2Fly material says calls and SMS can be received normally abroad.
- AIS says top-up can add SIM validity and On-Top packages can add validity, but the reviewed sources do not establish the cheapest durable post-package number-retention ladder. The 2,699/2,799 THB roaming package price must not be represented as a minimum annual number keep-alive cost.

This remains HOLD for long-term overseas number-retention / OTP use because continuous-roaming suspension risk and minimum post-package number-retention economics are unresolved.

Sources:

- https://www.ais.th/en/consumers/package/international/roaming/sim2fly
- https://www.ais.th/en/consumers/package/international/roaming/sim2fly/terms-and-conditions-global-15gb
- https://www.ais.th/en/consumers/help-and-support/network-technologies/update-sim-registration
- https://www.ais.th/consumers/package/international/roaming/sim2fly/esim-sim2fly

## Migration result

All three corrected comparison rows are distinct product identities and can be reproduced exactly by the existing generic canonical comparison adapter. All three were therefore admitted to canonical v1 as `backstage-only` / `hold` routes through reviewed packets.

Post-build state:

- canonical: 40 routes / 18 markets / 37 brands / 23 networks / 133 sources;
- comparison: 135 routes;
- route-ID overlap: 29;
- legacy-only comparison routes: 106;
- reviewed manifest gate: unchanged;
- explicit indexability: 3.

No standalone route URL, sitemap entry or publication-state expansion was added.

## Next bounded cohort

The next unprocessed directory cohort in the staged migration sequence is `ca-fr-ch-mx-in-directory-batch-i.json`:

- `speakout-711-365voucher-2026`
- `telcel-amigo-lifecycle-2026`
- `jio-prepaid-90d-trai-2026`
- `orange-mobicarte-2026`
- `sunrise-prepaid-2026`

Reverify identity, current provider facts and source provenance first. Migrate only exact-parity identities. Stop on unresolved provenance, schema/alias redesign, or publication/indexability change.
