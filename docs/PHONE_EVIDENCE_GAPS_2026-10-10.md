# Phone Radar: reproducible evidence gap audit

Snapshot: generated from the checked-out canonical JSON data using: node scripts/audit-phone-evidence-gaps.mjs --write. This report does **not** verify a production deployment, externally sampled coverage, or 90%/100% real user-demand coverage.

## Measured canonical gaps

| Field | Count | Notes |
| --- | ---: | --- |
| Canonical routes | 160 | Internal model, not real-world demand denominator |
| Sources | 904 | Source record count, not count of real-world buyers |
| Lifecycle/incident events | 330 | Not equivalent to app OTP outcomes |
| App-specific observations | 38 | Author-and-operation evidence, not independent original URLs |
| Routes with any app observation | 8 | Might be positive, negative or mixed |
| Routes without any app observation | 152 | App reliability unknown |
| Routes without linked community-tagged source | 83 | Only a source-label proxy; review types before claiming missing testimony |
| Acquisition price unknown in native currency | 72 | Missing numeric acquisition costs |
| Annual keep cost unknown in native currency | 66 | Missing numeric annual costs |
| Acquisition price missing comparable CNY figure | 131 | Native price may exist but vetted conversion missing |
| Annual keep price missing comparable CNY figure | 138 | Do not rank unknown CNY costs as cheap |
| KYC unknown or unclear | 34 | Unknown must not imply KYC-free |
| Admitted / HOLD / reconciliation | 61 / 89 / 10 | Admitted does not imply user recommendation |

## Firsthand-source acquisition priorities (mechanical gap queue, not demand rank)

Each row below is admitted, has at least six source records, lacks a community-tagged source record and has no app-specific observation. This is a review queue, not a claim that each record has no independent testimony; check original forum evidence before adding an outcome.

| Route | Linked sources |
| --- | ---: |
| `1pmobile-uk-2026` | 7 |
| `aldi-talk-activity-window-2026` | 7 |
| `go-payasyougo-mt-2026` | 7 |
| `kolbi-cr-2026` | 7 |
| `labas-90-120d-2026` | 7 |
| `mobal-japan-voice-2026` | 7 |
| `claro-pre-ar-2026` | 6 |
| `redpocket-annual-2026` | 6 |
| `taiwan-mobile-prepaid-tw-2026` | 6 |
| `three-uk-payg-180d-2026` | 6 |
| `tim-prepaid-12mo-2026` | 6 |

## Operational rules

1. Seek original buyer testimony (acquisition, checkout, payment, KYC, first activation, named-app OTP operation, number loss, recovery, cancellation) before official-page repetition. Original discussion URL and author are separate independence dimensions.
2. Do not infer app signup from mere SMS reception, or mainland-first activation from roaming SMS. Preserve negative and contradictory reports and unknown coordinates.
3. Use existing Phone URL and local browser search. Query matches are text/evidence discovery, not recommendations; unsupported queries fail closed. Normalize only a small number of verified route-name/country aliases.
4. Global price ranks must use comparable currency values; a raw HKD or GBP amount is not comparable numerically to a EUR price, and unconverted CNY stays unknown.
5. Maintain 160 routes, 135 comparison rows, 3 indexable route pages and 31 sitemap URLs until separate demand and release gates clear; no extra backend or per-query paid API.

