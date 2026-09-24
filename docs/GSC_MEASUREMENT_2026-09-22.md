# Google Search measurement — 2026-09-22

Status: **VERIFIED / NO PRODUCTION CHANGE**

## Measurement path

The prior GSC Wizard path is no longer usable under the current free/trial quota and is treated as deprecated for this project. Do not create throwaway accounts to extend trials and do not upgrade billing without explicit authorization.

A Windsor.ai `searchconsole` connector was authorized for:

`sc-domain:aineedhelpfromotherai.com`

The connector was verified by reading official Google Search Console Search Analytics fields including date, page, query, clicks, impressions, CTR and average position.

Current Windsor account plan reported by the connector on 2026-09-22: `Trial` / not paid. Therefore Windsor is a working access path, not a production dependency or a promise of permanent free capacity. If its free/trial capacity becomes unavailable, fall back to Google's official Search Console API/export rather than rotating accounts.

## Latest returned Search Console dates

The latest finalized date returned in the verified read remained **2026-09-19**.

Daily site totals returned:

| Date | Clicks | Impressions | CTR | Avg position |
|---|---:|---:|---:|---:|
| 2026-09-16 | 1 | 81 | 1.23% | 7.68 |
| 2026-09-17 | 1 | 104 | 0.96% | 7.88 |
| 2026-09-18 | 2 | 89 | 2.25% | 7.38 |
| 2026-09-19 | 1 | 71 | 1.41% | 7.28 |

This proves the site is no longer in a site-wide zero-exposure state.

## Page signals in the returned 14-day window

| Page | Clicks | Impressions | CTR | Avg position |
|---|---:|---:|---:|---:|
| `/tools/cursor-usage-reset/` | 0 | 479 | 0% | 6.98 |
| `/tools/manus-credits-reset/` | 1 | 75 | 1.33% | 7.96 |
| `/tools/replit-usage-reset/` | 0 | 57 | 0% | 7.47 |
| `/tools/bolt-tokens-reset/` | 0 | 43 | 0% | 6.72 |
| `/tools/` | 0 | 17 | 0% | 4.18 |
| `/tools/relay-exit-risk-checker/` | 0 | 2 | 0% | 3.5 |
| homepage | 3 | 4 | 75% | 1.25 |
| `/tools/claude-code-limit-reset/` | 1 | 1 | 100% | 2.0 |

Low-volume rows must not be overinterpreted.

## Cursor Q-002 / Q-015 gate

The existing Q-015 plan requires Q-002 evaluation only on clean post-title/meta dates from **2026-09-17 onward**, with the first decision review at **>=300 clean post-change impressions**.

Verified finalized Cursor data:

| Date | Clicks | Impressions | CTR | Avg position |
|---|---:|---:|---:|---:|
| 2026-09-17 | 0 | 70 | 0% | 7.29 |
| 2026-09-18 | 0 | 42 | 0% | 7.07 |
| 2026-09-19 | 0 | 37 | 0% | 7.22 |

Finalized clean total: **149 impressions / 0 clicks**.

A same-day recheck with Search Console `include_fresh_data=true` returned additional non-finalized rows:

| Date | Clicks | Impressions | CTR | Avg position |
|---|---:|---:|---:|---:|
| 2026-09-20 | 0 | 39 | 0% | 7.00 |
| 2026-09-21 | 0 | 101 | 0% | 6.22 |
| 2026-09-22 | 0 | 1 | 0% | 5.00 |

Fresh-data cumulative total for 2026-09-17 through the partial 2026-09-22 row: **290 impressions / 0 clicks**. Through the completed 2026-09-21 date it is **289 impressions / 0 clicks**. Fresh data is official Search Console data but is explicitly non-finalized and may still change.

Decision: **KEEP MEASURING.** The fresh-data read shows the 300-impression gate is close but has still not fired. Do not rewrite Cursor title/meta and do not start Q-015 production implementation yet. Re-read the exact Cursor page after the cumulative clean count reaches at least 300, using finalized data when available and clearly labeling fresh data if it is used for an interim check.

## Phone Q-003

An exact Search Console page filter for `https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/` over 2026-09-16 through 2026-09-19 returned no rows.

Decision: **KEEP / continue collecting evidence.** Do not add Phone routes or churn positioning because current Search Console exposure remains absent in the returned period.

## 2026-09-23 Phone post-deploy baseline recheck

A fresh-data Search Console recheck was run after the UK carrier-directory pilot shipped.

Exact page filter:

`https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/`

Window checked: **2026-09-20 through 2026-09-23**, with `include_fresh_data=true`.

Result: **no rows returned for the Phone canonical**.

The same connector returned site-wide fresh-data rows for the surrounding dates, confirming the empty Phone result is not explained by a total connector outage:

| Date | Clicks | Impressions | CTR | Avg position |
|---|---:|---:|---:|---:|
| 2026-09-20 | 0 | 66 | 0% | 7.48 |
| 2026-09-21 | 0 | 142 | 0% | 6.64 |
| 2026-09-22 | 0 | 54 | 0% | 6.80 |
| 2026-09-23 | 0 | 0 | — | 0.00 |

Interpretation: **the UK pilot still has no Search Console exposure evidence in the checked window, and same-day post-deploy data is not a valid basis for another production change.** Keep the production surface unchanged.

The site build contains GA4 behavior instrumentation, but no connected analytics reader is currently available in the verified measurement path for this session. Do not infer usage from absence of GSC rows.

## 2026-09-24 Phone first-exposure recheck

The Search Console measurement path was re-verified after an attempted GSC Wizard call. The project already marks GSC Wizard deprecated because its free/trial quota is exhausted. The active read therefore used Windsor.ai `searchconsole` with `include_fresh_data=true`.

Exact page filter:

`https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/`

Window checked: **2026-09-20 through 2026-09-24**.

Returned row:

| Date | Query | Clicks | Impressions | CTR | Avg position |
|---|---|---:|---:|---:|---:|
| 2026-09-23 | `survival number` | 0 | 1 | 0% | 22.0 |

Interpretation: this is the **first observed Search Console exposure row for the Phone canonical**. It proves Google has begun surfacing the page for at least one query, but one impression is far below the evidence threshold for a product, title/meta, market-expansion or route-page decision. Continue measuring rather than reacting to this single row.

## Next trigger

1. Continue reading Phone through Windsor.ai Search Console while that connector remains available.
2. Accumulate a meaningful query/page sample before changing the Phone canonical based on GSC performance.
3. Keep Google organic separate from referral/social/direct and AI referral.
4. Do not add another Phone market/network or change the UK matrix from one impression alone unless a concrete production defect is independently verified.
5. If Windsor.ai capacity/auth fails, classify that as a provider/access blocker and use Google's official Search Console API/export rather than alternate trial accounts.
