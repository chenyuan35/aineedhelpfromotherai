# M-04A Numerical / Date Utility Audit — 2026-09-21

Status: **COMPLETE — AUDIT ONLY / REPAIR REQUIRED**

Scope: production audit of exactly five existing utilities:

- `/tools/percentage-calculator/`
- `/tools/percentage-increase-calculator/`
- `/tools/discount-calculator/`
- `/tools/age-calculator/`
- `/tools/date-difference-calculator/`

No production code was changed in this audit session. Image Resizer and Image Compressor are explicitly out of scope and remain M-04B.

Production baseline: GitHub `main` at `9fb84257b7c4628f3858903aa26a46b33ffbfdb3` plus independently loaded apex pages.

## Shared acceptance results

All five pages returned HTTP 200, had exactly one H1, used the expected self-canonical, and kept their current title identity. Every related-calculator link exercised by the audit returned HTTP 200.

Rendered checks passed at 1440×900, 390×844 and 320×800 in light and dark themes. No page-level horizontal overflow was reproduced at any tested width. The primary result uses 26.4px text versus 16px body text and appears before explanatory sections. Primary calculator buttons kept high foreground/background contrast in both themes.

The audit found no reason for a visual redesign. Repair scope is limited to the functional defects below.

## Functional results

| Tool | Known-value result | Empty / invalid handling | Result |
|---|---|---|---|
| Percentage | `15% of 80 = 12`; `12/80 = 15%`; reverse = `80`; `80→100 = 25%` | zero denominator is bounded; blank `X% of Y` returns `0` | **FAIL — U-01** |
| Percentage Increase | `80→100 = +25%`, difference `20`, multiplier `1.25×` | zero/blank old value returns bounded error | **PASS** |
| Discount | `100`, `20%`, extra `10%` => final `72`, saved `28`, effective `28%` | blanks return a valid-looking zero result; `150%` returns final `-50` | **FAIL — U-02** |
| Age | `2000-01-15` → `2026-09-21` => `26 years, 8 months, 6 days`; empty/reversed dates are bounded | month-end case can produce negative days | **FAIL — U-03** |
| Date Difference | Sep 1→21 = `20 days`, `14 weekdays`; inclusive = `21 days`, `15 weekdays`; reverse order also works | empty date returns `Choose both dates` | **PASS** |

## Accepted defects

### U-01 — Percentage blank input is silently treated as zero

On the first `What is X% of Y?` card, leaving both fields blank and calculating returns `0`. This is a false-valid result because an empty field is not the same user input as numeric zero.

Repair boundary: add explicit required-value validation for this calculation without changing valid percentage math or the other three cards.

### U-02 — Discount invalid inputs can create false-valid / negative prices

Leaving all fields blank returns `Final price: 0`. Entering original price `100` and discount `150%` returns `Final price: -50` and `Effective discount 150%`.

Repair boundary: distinguish blank required inputs from numeric zero and bound percentage discounts to the valid 0–100 range. Preserve the current sequential stacked-discount formula.

### U-03 — Age month-end arithmetic can return negative days

`2000-01-31` → `2026-03-01` renders `26 years, 1 months, -2 days`. A negative day component is invalid for the page's claimed years/months/days decomposition.

Repair boundary: replace the borrow logic with calendar-safe decomposition and add month-end/leap-date regression cases. Preserve total-day/week and next-birthday outputs unless a test proves they are also wrong.

## Visual / identity observations

At 390×844, the first result positions were approximately: Percentage 763px, Percentage Increase 850px, Discount 896px, Age 744px, Date Difference 854px. Results remain immediately attached to their calculator cards and precede explanatory prose; this audit does not treat the small below-fold offsets as a repair defect.

At 320×800, all five pages still had `scrollWidth == clientWidth` in both themes. No related link failure, duplicate H1, canonical mismatch, or theme-specific primary-action contrast regression was reproduced.

## Next task

**M-04R:** repair only U-01, U-02 and U-03 in the existing calculator generator, add regression checks, then require production build, genuine Vercel Preview, desktop/mobile light/dark verification, and independent apex verification before closing the numerical/date utility batch.

Do not fold Image Resizer/Compressor work, global redesign, SEO title/meta changes, or a fourth product direction into M-04R.
