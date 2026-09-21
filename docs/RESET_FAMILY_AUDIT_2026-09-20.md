# Reset Family Audit — 2026-09-20

Status: **M-02B + M-02C COMPLETE / PRODUCTION VERIFIED**

Source contract: `docs/MAINTENANCE_VISUAL_EXECUTION_AUDIT_PLAN_2026-09-19.md` M-02B.

## M-02B-1 — Claude Code Limit Reset

Production URL: `https://aineedhelpfromotherai.com/tools/claude-code-limit-reset/`
Production baseline: `c420bce560e588ea53a6619fe0e89f62a95dc668`

| Field | Result |
|---|---|
| Functional | PASS |
| Desktop light | FAIL — primary calculator/input below first viewport |
| Desktop dark | FAIL — same hierarchy defect; contrast otherwise usable |
| Mobile light | FAIL — primary calculator/input far below first viewport |
| Mobile dark | FAIL — same hierarchy defect; contrast otherwise usable |
| SEO identity | PASS — canonical remains `/tools/claude-code-limit-reset/` |
| Horizontal overflow | PASS at 1440px and 390px |
| Saved-state behavior | PASS |
| Missing/past reset state | PASS |
| Five-hour session shortcut | PASS |

### Reproduced hierarchy defect

The page renders `Hero → Quick answer → Calculator`. On production, calculator top is ~912px at 1440×900 and ~1207px at 390×844. The first session-reset input is ~1240px desktop and ~1591px mobile. The first viewport therefore explains the tool before exposing the tool.

### Functional evidence

- future session + weekly timestamps produced separate countdowns and the expected next-event summary;
- saved timestamps restored after reload;
- a past session timestamp changed to `Check Claude` and asked the user to confirm the next reset;
- a missing weekly timestamp stayed bounded as `Set a reset`;
- `My 5-hour session just reset` created an approximately five-hour countdown;
- Clear removed both inputs and local saved state.

### M-02B-1R repair closure — DONE / PRODUCTION VERIFIED

Release vehicle: PR #156. Final head `45d80b4530f8ec02efab192ba39420d5230c20b8`; squash merge `049a6349f00516b9b08ffeea6a95325e538d113c`.

- only `frontend/tools/claude-code-limit-reset/index.html` changed (`+7/-5`);
- public build passed before PR;
- Eval Gate #583 passed;
- PR-specific Vercel Preview reached Ready and passed desktop/mobile × light/dark rendered QA;
- calculator top improved to ~420px desktop / ~503px mobile;
- both reset inputs moved to ~475px desktop / ~551px mobile, with the first countdown also visible in the tested mobile viewport;
- Quick answer remains available after the tool instead of displacing it;
- save/restore, future timestamps, past/missing state, five-hour shortcut and Clear all passed on Preview and production;
- no horizontal overflow at 1440px or 390px;
- title, meta description and canonical remained unchanged;
- no provider-policy claim or new quota functionality was added;
- Vercel production deployment succeeded and apex QA repeated the same four-state and functional checks.

## M-02B-2 — GitHub Copilot AI Credits Reset

Production URL: `https://aineedhelpfromotherai.com/tools/github-copilot-credits-reset/`
Production baseline: `30b39ee73a2706e7baa5b8e700d6e23442f458e9`

| Field | Result |
|---|---|
| Known-value calculation | PASS |
| Missing / negative numeric input | PASS — values are bounded to zero/minimum and produce a non-crashing result |
| Saved-state input restore | PASS |
| Saved-state result restore | FAIL — inputs restore after reload but metrics/result remain `—` / default until Calculate is pressed again |
| Desktop light/dark | PASS — core inputs are visible at the bottom of the tested 1440×900 viewport; contrast is usable |
| Mobile light/dark | FAIL — `Credits remaining` begins at ~957px in 390×844 and ~1089px in 320×800, below the first viewport |
| SEO identity | PASS — one H1; title/meta/canonical remain correct |
| Horizontal overflow | PASS at 1440px, 390px and 320px |
| Client errors | PASS — clean run produced no page errors; earlier localStorage errors were test-injection noise and were discarded |
| Policy freshness | PASS — current GitHub Docs still state first-of-month 00:00 UTC reset, 1,500/7,000/20,000 paid-plan allowances, and $0.01 per AI Credit |

### Reproduced defects

1. **Mobile first-viewport hierarchy:** the reset countdown and plan selector are visible, but the user-specific `Credits remaining` input does not enter the tested 390×844 viewport; at 320px width it is pushed farther down. The page therefore exposes the reset fact before the primary planning input.
2. **Incomplete saved-state restore:** after saving custom allowance `1234`, remaining `321`, and daily pace `12`, reload restores all three input values but leaves Safe daily spend / Allowance used / projected metrics at `—` and restores the default result copy rather than recomputing.

### Passing evidence

- Pro+ selection updates allowance to 7,000;
- 7,000 allowance + 900 remaining + 0/day produced 87.1% used, $9.00 value and a bounded “should last” result;
- a 10,000/day burn produced the expected run-out-before-reset state;
- missing and negative values did not crash or create negative results;
- countdown resolved to the next calendar-month boundary and current GitHub policy still matches the rendered reset rule;
- desktop/mobile light/dark showed no horizontal overflow or contrast regression.

### M-02B-2R repair closure — DONE / PRODUCTION VERIFIED

Release vehicle: PR #159. Final head `27f713692f5cf2f612b47989e9c2fd00b0517502`; squash merge `2a70b7b488fba4f390a06ac82d648bdba999bfa5`.

- changed only the source generator `frontend/bin/generate-ai-reset-tools-round2.mjs` (`+3/-3`);
- generator syntax check and full public build passed locally;
- Eval Gate #591 passed and the genuine PR-specific Vercel Preview succeeded;
- Preview desktop/mobile × light/dark plus 320px narrow checks passed with no page errors or horizontal overflow;
- on mobile, `Credits remaining` moved from ~957px → ~610px at 390×844 and ~1089px → ~659px at 320×800; the daily-pace input is also inside both tested first viewports;
- desktop order remains unchanged;
- saved custom inputs now automatically recompute Safe daily spend, Allowance used, projected balance, value and result copy after reload;
- title/meta/canonical and verified GitHub policy copy remain unchanged; no new quota feature was added;
- Vercel production deployment succeeded and apex QA repeated the same 1440/390/320 layout and saved-state checks successfully.

## M-02B-3 — Manus Credits Reset

Production URL: `https://aineedhelpfromotherai.com/tools/manus-credits-reset/`
Production baseline: `1df05241707b0b66657e5ecfd0a28cf2ceb5e296`

| Field | Result |
|---|---|
| Known-value calculation | PASS — 120 left / 50 planned leaves 70 and reports 42% use |
| Missing / negative numeric input | PASS — values are bounded to zero and do not crash |
| Saved-state restore | PASS — inputs and computed result restore after reload |
| Calendar export | PASS — `manus-daily-credits-reset.ics` downloads |
| Desktop light/dark | PASS WITH HIERARCHY CAUTION — countdown and inputs are visible, but the action/result begin below the tested 1440×900 fold |
| Mobile light/dark | FAIL — planner inputs are displaced below the first viewport by the countdown plus four fixed metric cards |
| SEO identity | PASS — one H1; title/meta/canonical are correct |
| Horizontal overflow | PASS at 1440px, 390px and 320px |
| Client errors | PASS — clean functional run produced no page errors; localStorage errors from pre-navigation theme injection were discarded as test noise |
| Policy freshness | PASS — current Manus Help Center still confirms 300 daily credits, 00:00 UTC reset, no rollover, and the Free 1,500-credit monthly usage cap |
| Policy source traceability | PARTIAL — the rendered single source link supports 300/00:00 UTC/no-rollover, while the 1,500 monthly cap is supported by a separate current official Manus credit-rules article |

### Reproduced defects

1. **Mobile first-viewport hierarchy:** at 390×844, `Daily credits left` begins at ~1068px; at 320×800 it begins at ~1194px. The user sees the countdown and four fixed policy metrics before reaching the user-specific planner input.
2. **Source traceability:** the 1,500-credit Free monthly cap is current and officially supported, but the page's single linked policy article does not contain that cap. A second official Manus source should be linked rather than leaving one link to appear to support every rendered claim.

### Passing evidence

- countdown resolves to the next 00:00 UTC boundary and local reset time renders correctly;
- 120 credits left / 50 planned produced `Planned use leaves 70 daily credits before reset.` and `Using 42%...`;
- saved 120/50 values restored after reload together with the same computed result;
- 100 left / 200 planned produced the bounded 100-credit over-plan warning;
- empty and negative numeric inputs produced a non-crashing zero-credit state;
- calendar export downloaded the expected `.ics` file;
- desktop/mobile light/dark and 320px checks showed no horizontal overflow;
- current official Manus documentation was rechecked on 2026-09-20 before recording policy status.

### M-02B-3R repair closure — DONE / PRODUCTION VERIFIED

Release vehicle: PR #162. Final head `29cd39fadd57a70162dd46d20745c1bdf8879332`; squash merge `4c4603251d45fd0fb2a0b1d7931b850e71638f55`.

- added `frontend/bin/enhance-manus-reset.mjs` and registered it in the normal build chain; no generated output was committed;
- local enhancer/build syntax checks, full public build and diff check passed;
- Eval Gate #597 passed and the genuine PR-specific Vercel Preview succeeded;
- Preview desktop/mobile × light/dark plus 320px narrow checks passed with no page errors or horizontal overflow;
- desktop composition remained unchanged: `Daily credits left` stayed at ~812px in the tested 1440×900 viewport;
- mobile `Daily credits left` moved from ~1068px → ~670px at 390×844 and ~1194px → ~796px at 320×800; `Planned use before reset` is also visible in the tested 390px first viewport;
- known-value 120/50 calculation, saved-state recomputation after reload, over-plan and negative-value handling all passed on Preview and production;
- the page now directly links the current official Manus credit-rules article for the Free 1,500-credit monthly cap while retaining the separate daily-refresh policy source;
- title, meta description, canonical and calculator semantics remained unchanged; no new quota feature was added;
- Vercel production deployment succeeded and independent apex QA repeated the same 1440/390/320 layout and functional checks successfully.

## M-02B-4 — Replit Usage Reset

Production URL: `https://aineedhelpfromotherai.com/tools/replit-usage-reset/`
Production baseline: `b2dd7bd709427867280bc465073549e4d888d802`

| Field | Result |
|---|---|
| Known-value calculation | PASS — ~2 hours remaining + 60% used produced 40% remaining and ~20.0 percentage points/hour |
| Missing / past reset input | PASS — missing input returns `Set a future reset time first.`; past time switches countdown to `Check Replit` and remains bounded |
| Five-hour shortcut | PASS — `My 5-hour window just reset` creates an approximately 5-hour target, resets entered usage to 0 and shows 100% remaining |
| Saved-state restore | PASS — saved reset/usage values restore after reload and the planning result recomputes automatically |
| Desktop light/dark | PASS — calculator begins at ~482px; reset/usage inputs begin at ~715/~717px in 1440×900; dark theme preserves readable action contrast |
| Mobile 390 light/dark | PASS WITH HIERARCHY CAUTION — reset input begins at ~733px and usage input at ~823px in 390×844; no page overflow |
| Narrow mobile 320 | FAIL — reset input begins at ~871px, usage input at ~961px and result at ~1298px in 320×800 |
| SEO identity | PASS — one H1; title `Replit Usage Reset Timer – Free Online Tool`; canonical remains `/tools/replit-usage-reset/` |
| Horizontal overflow | PASS at 1440px, 390px and 320px |
| Policy freshness | PASS — Replit's current official Aug 18/19, 2026 Free Mode launch post still states Core and Pro Free Mode usage limits reset every 5 hours |

### Reproduced defect

**Narrow-mobile first-viewport hierarchy:** the current calculator is already ahead of the explanatory article content, but its internal countdown/action stack is tall enough that at 320×800 both user-specific inputs start below the first viewport. The primary planning task is therefore not directly usable in the narrow-mobile first screen even though the page has no horizontal overflow.

### Passing evidence

- production title/canonical/H1 identity matches the registered Replit tool;
- a future reset about two hours away with `60` entered usage produced `40% of your entered window allowance remains.` and about `20.0 percentage points per hour`;
- after reload the saved `60` usage value and computed `40%` result restored automatically;
- missing and past reset timestamps produced bounded guidance instead of errors;
- the five-hour shortcut produced an approximately `04:59` countdown, set entered usage to `0`, and produced `100%` remaining;
- 1440×900 desktop shows the calculator and both inputs inside the first viewport;
- 390×844 keeps the reset input inside the first viewport and the usage input at its lower edge; 320×800 pushes both inputs below the fold;
- light/dark theme state applied correctly and tested widths had no page-level horizontal overflow;
- the official Replit source was rechecked on 2026-09-20: `https://replit.com/blog/replit-introduces-free-mode`.

### M-02B-4R repair closure — DONE / PRODUCTION VERIFIED

Release vehicle: PR #165. Final head `6b5b84de6b8e72d7328777f578b848f6bbcf15e4`; squash merge `c783c86441ca819dbf5e6598492cac016d5f68bc`.

- added `frontend/bin/enhance-replit-reset.mjs` and registered it in the normal build chain; no generated output was committed;
- full public build and diff checks passed before PR;
- Eval Gate #603 passed and the genuine PR-specific Vercel Preview succeeded;
- Preview desktop/mobile × light/dark passed at 1440×900, 390×844 and 320×800 with no horizontal overflow;
- at 320×800 the reset/usage inputs moved from ~871/~961px to ~647/~736px, both inside the tested first viewport; 390×844 and 1440×900 positions stayed unchanged;
- known-value ~2-hour/60% planning, saved-state recomputation after reload, missing/past reset handling and the five-hour shortcut passed on Preview and production;
- title, meta description, canonical, calculator semantics and current official five-hour policy wording/source remained unchanged;
- Vercel production deployment succeeded and independent apex QA repeated the same layout and functional checks.

## M-02B-5 — Bolt Tokens Reset

Production URL: `https://aineedhelpfromotherai.com/tools/bolt-tokens-reset/`
Production baseline: `2b9b8825c7bddc891fccabb0e0f95c6025dfd3b5`

| Field | Result |
|---|---|
| Known-value calculation | PASS — ~4 days remaining, 400K balance / 1M allocation / 90K per day produced ~100K/day safe pace, 60% used and ~40K projected balance |
| Run-out state | PASS — 150K/day correctly reports depletion before reset |
| Missing / past reset input | PASS — missing gives `Choose a future reset date.`; past switches countdown to `Check Bolt` and remains bounded |
| Negative numeric input | PASS — negative remaining/daily and zero allocation are bounded without negative output or client error |
| Paid-plan switch | PASS — paid selection changes the rendered daily-cap metric to `No daily cap` |
| Saved-state input restore | PASS — reset/balance/allocation/daily values restore after reload |
| Saved-state result restore | FAIL — restored inputs leave Safe daily budget / usage / projected balance at `—` and restore default result copy until Calculate is pressed again |
| Desktop light/dark | PASS WITH HIERARCHY CAUTION — planner inputs begin around 715–811px in 1440×900; primary result begins below the fold at ~1098px |
| Mobile 390 light/dark | FAIL — plan/reset begin ~737/~820px, but `Tokens remaining` begins ~916px and Calculate ~1172px in 390×844 |
| Narrow mobile 320 | FAIL — even plan/reset begin below the tested first viewport (~915/~998px); `Tokens remaining` begins ~1093px and Calculate ~1349px |
| SEO identity | PASS — one H1; title `Bolt Tokens Reset Calculator – Free Online Tool`; canonical remains `/tools/bolt-tokens-reset/` |
| Horizontal overflow | PASS at 1440px, 390px and 320px |
| Client errors | PASS — tested negative/edge run produced no page errors |
| Policy freshness | PASS — current official Bolt docs still state Free 1M/month + 300K/day, Free monthly reset on the 1st, paid reset on renewal date, no paid daily cap, and paid rollover valid for up to two months |

### Reproduced defects

1. **Mobile first-viewport hierarchy:** the countdown precedes two stacked input rows. At 390×844 the user-specific `Tokens remaining` field starts at ~916px; at 320×800 even plan/reset selection starts below the first viewport and the balance begins at ~1093px. The primary planning task therefore requires unnecessary scrolling before the user can enter the values that drive the result.
2. **Incomplete saved-state restore:** after a valid calculation, reload restores the saved plan/reset/balance/allocation/daily inputs but does not call the calculation path. Safe daily budget, usage and projected balance revert to `—`, and the default `Enter your balance and reset date.` result reappears until Calculate is pressed.

### Passing evidence

- ~4-day future reset + 400K remaining + 1M allocation + 90K/day produced ~100K/day safe pace, 60.0% used and ~40K projected balance;
- 150K/day produced the expected run-out-before-reset state;
- missing/past reset values produced bounded guidance rather than errors;
- negative numeric values were clamped and did not generate negative metrics or client exceptions;
- paid-plan selection correctly removed the rendered daily-cap claim;
- light/dark theme state applied correctly and tested widths had no page-level horizontal overflow;
- current official Bolt Help Center and pricing documentation were rechecked on 2026-09-20 before recording policy status.

### M-02B-5R repair closure — DONE / PRODUCTION VERIFIED

Release vehicle: PR #168. Final head `e2a5685355b0fe5973e9419d4d084f5038e017e4`; squash merge `93f52d523d08aaf1495145f93cd501a97d11019e`.

- added `frontend/bin/enhance-bolt-reset.mjs` and registered it in the normal build chain; no generated output was committed;
- local syntax/diff checks, full public build and rendered QA passed before PR;
- Eval Gate #609 passed and the genuine PR-specific Vercel Preview succeeded;
- Preview desktop/mobile × light/dark passed at 1440×900, 390×844 and 320×800 with no page errors or horizontal overflow;
- desktop composition stayed unchanged: balance/daily inputs remained ~811px and the existing result remained ~1098px in the tested 1440×900 viewport;
- at 390×844 `Tokens remaining` moved ~916px → ~497px, daily pace ~1091px → ~578px, Calculate ~1172px → ~639px and the primary result ~1642px → ~708px;
- at 320×800 `Tokens remaining` moved ~1093px → ~575px, daily pace ~1269px → ~653px, Calculate ~1349px → ~709px and the primary result ~1819px → ~774px;
- saved plan/reset/balance/allocation/daily values now automatically recompute Safe daily budget, usage, projected balance and result copy after reload;
- known-value planning, missing/past reset handling, negative-value bounding and paid-plan cap switching passed on Preview and production;
- title, meta description, canonical, calculator semantics and current official Bolt policy wording/source remained unchanged;
- Vercel production deployment succeeded and independent apex QA repeated the same layout, functional and saved-state checks.

## M-02B-6 — AI Credit Burn Rate Calculator

Read-only audit reproduced one bounded mobile action/result hierarchy defect; functional math, invalid/missing input, saved-state recomputation, SEO identity, themes and horizontal overflow passed. Detailed evidence is in `docs/AI_CREDIT_BURN_RATE_AUDIT_2026-09-20.md`.

### M-02B-6R repair closure — DONE / PRODUCTION VERIFIED

PR #171 final head `3a5b1eae81716694faf6cfca8303ade8f612c251` passed Eval Gate #615 and genuine Vercel Preview QA; squash merge `ae4c9f83cdb5a9b67f7bd3a5ba27e77708489dee` passed independent production QA.

- desktop composition stayed unchanged;
- 390×844 Calculate/result improved ~946/~1416px → ~744/~812px;
- 320×800 Calculate/result improved ~1112/~1607px → ~673/~737px;
- known-value math, save/reload recomputation, title/meta/canonical, light/dark, no-overflow and no-client-error checks passed on Preview and production;
- no Q-015 quota/pool functionality was added.

## M-02C — Reset family release audit

Status: **DONE / PRODUCTION VERIFIED — 2026-09-21**

Fresh current-main build plus production Chromium QA passed across Cursor, Claude, GitHub Copilot, Manus, Replit, Bolt and AI Credit Burn at desktop 1440×900 and mobile 390×844 / 320×800 in light and dark. Representative functional paths, one-H1/self-canonical identity and no-horizontal-overflow checks passed. Detailed evidence: `docs/RESET_RELEASE_AUDIT_2026-09-21.md`.

### Next action

**Q-005 — authority recheck.** The Sep 20 trigger is already due. M-03 Relay remains the next maintenance phase after that dated task.
