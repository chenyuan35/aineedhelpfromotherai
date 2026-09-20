# AI Credit Burn Rate Calculator Audit — 2026-09-20

Status: **M-02B-6 DONE / DEFECT REPRODUCED**

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

## Next task

**M-02B-6R — bounded mobile action/result hierarchy repair.** Preserve calculator math, saved-state behavior, title/meta/canonical and desktop composition. Reduce mobile vertical distance so the Calculate action and primary result are reachable substantially sooner, without adding new quota/product functionality. Use one production-affecting PR with build/Eval Gate/real Preview and desktop/mobile × light/dark acceptance before merge.
