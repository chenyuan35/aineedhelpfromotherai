# Phone Radar legacy price-parity audit — 2026-10-10

**Stage:** internal / NOT production-verified. Reproduce with `node scripts/audit-phone-legacy-price-parity.mjs --check` or regenerate using `--write`.

The original published `global-directory.json` and newer canonical `phone-route-summaries.json` are **parallel data streams**. Where route ID, native currency and finite yearly keep costs are comparable, they can disagree. A mismatch is a **review candidate**, not permission to overwrite every legacy field: different plan cohorts, annualized activity costs, checkout methods or source dates may explain it. Preserve source traceability and confidence. Never silently declare the smaller number universally available.

- Route rows with both comparable native annual costs: **61**
- Rows with conflicting recorded values: **15**
- Example already corrected in the US guide: Tello PAYG legacy USD80 web top-ups versus newer conditional USD40 via account-enabled SMS recharge; the guide now documents both, not a false overall winner.

| Route ID | Native currency | Legacy annual | Newer normalized annual | Canonical last verified |
| --- | --- | ---: | ---: | --- |
| `cellfie-ge-90-45d-2026` | GEL | 2 | 0.24 | 2026-09-29 |
| `claro-pre-br-90d-2026` | BRL | 60 | 140 | 2026-10-08 |
| `cosmote-frog-13mo-2026` | EUR | 60 | 13 | 2026-09-29 |
| `dialog-lk-365d-2026` | LKR | 500 | 800 | 2026-09-29 |
| `etisalat-wasel-ae-2026` | AED | 40 | 0.76 | 2026-10-07 |
| `kpn-prepaid-6mo-2026` | EUR | 0.14 | 0.3 | 2026-10-05 |
| `kyivstar-prepaid-274-91-2026` | UAH | 30 | 40 | 2026-09-29 |
| `magticom-number-maintenance-2026` | GEL | 2 | 2.03 | 2026-09-29 |
| `mobal-japan-voice-2026` | JPY | 17160 | 11880 | 2026-10-06 |
| `optus-flex-plus-au-2026` | AUD | 116 | 395 | 2026-10-12 |
| `redpocket-annual-2026` | USD | 60 | 110 | 2026-10-05 |
| `tello-paygo-credit-2026` | USD | 80 | 40 | 2026-10-05 |
| `telstra-prepaid-longexpiry-2026` | AUD | 395 | 74 | 2026-10-08 |
| `tesco-mobile-payg-uk-2026` | GBP | 0.08 | 0.2 | 2026-09-29 |
| `visible-25-2026` | USD | 300 | 275 | 2026-10-03 |

## Next price-audit gates

1. Check SKU/plan route identity before concluding that the lower cost supersedes the higher one.
2. Identify whether the number represents a minimum repeatable annual charge, purchase/credit commitment, usage spend, SMS-path-only top-up, or promotion. Do not compare unlike accounting grains.
3. Verify the author/date or primary terms and relevant identity/payment/activation requirements for the same route.
4. For public guide or directory cells that could mislead a buyer, show explicit conditional methods or uncertainty instead of one outdated headline amount.
5. Re-run regression/data/public build tests; no new SEO URLs or buy-ready claim until evidence gates clear.
