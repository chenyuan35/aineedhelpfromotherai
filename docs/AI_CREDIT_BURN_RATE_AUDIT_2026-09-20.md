# AI Credit Burn Rate Calculator Audit — 2026-09-20

Status: **M-02B-6 + M-02B-6R DONE / PRODUCTION VERIFIED**

Production URL: `https://aineedhelpfromotherai.com/tools/ai-credit-burn-rate-calculator/`

This was a read-only production audit under M-02B. No production code or site configuration was changed.

## Result

| Field | Result |
|---|---|
| HTTP / SEO identity | PASS — page returns 200; one H1; title, meta description and canonical are correct |
| Known-value calculation | PASS — 1,200 credits / ~8 days → 150.0 credits/day, 6.3/hour, 30.0 tasks at 40 credits/task, projected balance 0 |
| Missing / past reset | PASS — both return bounded `Choose a future reset date and time.` guidance |
| Negative numeric input | PASS — calculation clamps values to zero and does not produce negative output or a client error |
| Saved-state restore | PASS — distinctive inputs and computed metrics/result restore and recompute automatically after reload |
| Desktop light/dark | PASS WITH CAUTION — calculator begins ~455px, first input ~511px, Calculate ~740px, metrics ~805px; result begins ~948px |
| Mobile 390 light/dark | FAIL — first input is visible (~540px), but Calculate is ~946px, metrics ~1010px and result ~1416px |
| Mobile 320 light/dark | FAIL — first input is visible (~659px), but Calculate is ~1112px, metrics ~1177px and result ~1607px |
| Horizontal overflow | PASS — none at 1440×900, 390×844 or 320×800 |
| Client errors | PASS — none observed in the clean audit run |

## Reproduced defect

**Mobile action/result hierarchy is too tall.** The page correctly places the calculator before explanatory content, and the first user input enters the first viewport. However, four stacked inputs plus the expiry checkbox push the primary Calculate action and all results well below the first viewport on both tested mobile widths. At 390×844 the action/result begin around 946/1416px; at 320×800 they begin around 1112/1607px. The user can start entering data but cannot complete the primary task or see the result without substantial scrolling.

This is a bounded visual hierarchy defect, not a calculator, SEO, persistence or overflow failure.

## Functional evidence

- `1200` credits, reset ~8 days ahead, `150/day`, `40/task`, expiry enabled produced `150.0 credits/day`, `6.3 credits/hour`, `30.0` tasks, `0 credits`, and `Your current pace should last until reset.`
- empty and past reset timestamps stayed bounded with the same future-reset guidance;
- negative credits/daily/task values produced a non-crashing zero-credit state;
- saved values `1234`, `111/day`, `37/task`, future reset and expiry disabled restored after reload together with the same computed metrics/result;
- tested desktop/mobile light/dark states had no page-level horizontal overflow and no client exceptions.

## M-02B-6R repair closure — DONE / PRODUCTION VERIFIED

Release vehicle: PR #171. Final head `3a5b1eae81716694faf6cfca8303ade8f612c251`; squash merge `ae4c9f83cdb5a9b67f7bd3a5ba27e77708489dee`.

- added `frontend/bin/enhance-ai-credit-burn.mjs` and registered it in the normal build chain; no generated output was committed;
- local syntax/diff checks, full public build and real Chromium QA passed before PR;
- Eval Gate #615 passed and the genuine PR-specific Vercel Preview succeeded;
- desktop 1440×900 stayed unchanged: calculator ~455px, first input ~511px, Calculate ~740px, result ~948px;
- at 390×844 Calculate/result improved ~946/~1416px → ~744/~812px;
- at 320×800 the narrow-only hero compaction plus two-column planner moved Calculate/result ~1112/~1607px → ~673/~737px;
- light/dark passed at 1440×900, 390×844 and 320×800 with no page-level horizontal overflow;
- known-value 1,200 / ~8-day / 150/day / 40-task math and saved-state recomputation passed on Preview and production;
- title, meta description, canonical and calculator semantics remained unchanged; no Q-015 quota/pool functionality was added;
- independent apex QA repeated the same layout, functional, persistence and SEO checks with no client errors.

## Next task

**M-02C — Reset release audit.** Run the family-level production release audit across the completed Reset set. Do not redesign passing pages or add quota/pool functionality during the audit.
