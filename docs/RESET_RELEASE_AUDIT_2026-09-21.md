# Reset Release Audit — 2026-09-21

Status: **M-02C DONE / PRODUCTION VERIFIED**

Audited production family:

- `/tools/cursor-usage-reset/`
- `/tools/claude-code-limit-reset/`
- `/tools/github-copilot-credits-reset/`
- `/tools/manus-credits-reset/`
- `/tools/replit-usage-reset/`
- `/tools/bolt-tokens-reset/`
- `/tools/ai-credit-burn-rate-calculator/`

## Build / release evidence

- fresh temporary clone on the connected `qwenpaw-sbs-prod-h2grp` host resolved current `main` at `3b41440a802c45ba37b362c34879b448ccaa2bf1`;
- `npm ci --no-audit --no-fund` succeeded;
- `npm run build` completed successfully through the full static generation/enhancer/theme/freshness/Phone build chain;
- the temporary test clone was isolated under `/tmp`; the production worktree was not touched;
- PR #172's documentation closeout head passed Eval Gate #619 before merge; the last production-affecting Reset repair, PR #171, had already passed Eval Gate #615 and genuine Vercel Preview QA before merge.

## Current production QA

A live browser pass verified representative interactions across all seven Reset pages. A second Chromium pass used real 1440×900, 390×844 and 320×800 viewports in both light and dark modes.

| Page | Representative functional result | H1 / canonical | 1440 light/dark | 390 light/dark | 320 light/dark | Horizontal overflow |
|---|---|---|---|---|---|---|
| Cursor | 50% entered usage → `50% ... remains` | PASS | PASS | PASS | PASS WITH NARROW-MOBILE CAUTION | PASS |
| Claude | future session + weekly reset → next tracked event countdown | PASS | PASS | PASS | PASS | PASS |
| GitHub Copilot | 7,000 allowance / 900 remaining / 0 daily → pace should last | PASS | PASS | PASS | PASS | PASS |
| Manus | 120 left / 50 planned → 70 credits remain | PASS | PASS | PASS | PASS | PASS |
| Replit | ~2-hour reset / 60% used → 40% remains | PASS | PASS | PASS | PASS | PASS |
| Bolt | ~4-day reset / 400K of 1M / 90K daily → pace should last | PASS | PASS | PASS | PASS | PASS |
| AI Credit Burn | 1,200 / ~8-day reset / 150 daily / 40 per task → pace should last | PASS | PASS | PASS | PASS | PASS |

### Responsive evidence

- every tested state reported `scrollWidth == viewport width`; no page-level horizontal overflow at 1440, 390 or 320;
- every page rendered exactly one H1 and its expected self-canonical in the deterministic Chromium pass;
- light/dark produced the same structural hierarchy and functional result; the separate live visual browser pass found readable actions/results in both themes;
- Bolt reproduced its accepted mobile positions: at 390×844 input/action/result ~497/~639/~708px; at 320×800 ~575/~709/~774px;
- AI Credit Burn reproduced its accepted mobile positions: at 390×844 input/action/result ~534/~744/~812px; at 320×800 ~449/~673/~737px;
- Replit 320×800 primary reset input remained ~647px, matching the repaired baseline;
- Copilot 390/320 primary `Credits remaining` remained ~610/~659px;
- Manus 390/320 primary input remained ~670/~796px;
- Claude 390/320 primary input remained ~551/~636px.

Cursor at 320×800 places the reset input at ~834px, just below the first viewport. This is a narrow-mobile caution, not a reproduced regression: 390×844 remains within the accepted first viewport (~721px), there is no overflow, and the primary control is reached with a small scroll. No new repair task is opened from this audit.

## False-positive correction

The first live automation pass incorrectly reported that the Claude page lacked an H1. This was rejected after two independent checks: GitHub `main` contains `<h1>Claude Code Limit Reset Calculator</h1>`, and fresh Chromium production QA reports exactly one H1. No Claude SEO defect exists.

## Decision

**PASS / CLOSE M-02.** The current Reset family is functionally and visually release-accepted. Do not redesign passing Reset pages or add Q-015 quota/pool functionality through maintenance.

The next maintenance phase is M-03 Relay Exit Risk visual closure. The dated Q-005 authority recheck is already due and should be the next independent session before starting another visual-maintenance round.
