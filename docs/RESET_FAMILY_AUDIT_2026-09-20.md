# Reset Family Audit — 2026-09-20

Status: **IN PROGRESS — ONE PAGE AT A TIME**

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

### Next action

**M-02B-2R — Copilot bounded repair.** Fix the generator `frontend/bin/generate-ai-reset-tools-round2.mjs`, not only the generated HTML: bring the user-specific balance/pace inputs earlier on mobile and recompute restored saved state on load. Preserve title/meta/canonical and current official policy claims; add no new quota feature. Do not advance to Manus until this repair reaches its own verified stopping point.
