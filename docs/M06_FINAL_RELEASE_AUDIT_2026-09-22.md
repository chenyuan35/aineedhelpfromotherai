# M-06 Final Release / Production Audit — 2026-09-22

Status: **PASS / MAINTENANCE RELEASE CLOSED**

## Scope

Audit only. No production code, route, methodology, positioning, product-scope, DNS, AdSense, billing, or Astro production migration change was made.

Audit baseline: GitHub `main` at `fa5e1e014bbcbc6d19b9304d91895681aaefde80`, whose production-code parent is the M-05R merge `066ef4442ffe9259b72acca18bf9490c8a9d1c4c`.

## Build / generator checks

- Fresh detached current-main worktree created on Qwen.
- `npm ci`, `npm run build`, and `node bin/check-utility-regressions.mjs` passed.
- Utility regression suite passed U-01 / U-02 / U-03.
- Relay built old `var(--text` choice-token references: 0.
- Reset built old `var(--border,#d9d9df)` references: 0.
- No production Astro migration marker was found in `vercel.json`.
- A second full build produced the same full-dist hash as the first: `478e5a76441e8aa34cd57a473e22cb4bb007c2c261e9f0c5dc61b22eaf6af5a3`.
- The first clean build rewrote the known generated frontend files, while the second build was stable. This matches the already-documented generator behavior and does not reproduce a new overwrite regression.

## Production identity / navigation checks

Live apex reads covered Phone, Reset-family pages, Relay, numerical/date utilities, Image Resizer/Compressor, `/tools/`, homepage, About, Contact, Privacy, Terms, and sitemap.

Representative pages returned live content with one primary page heading, correct self-canonical identity where applicable, and working internal/related navigation. No new 4xx/5xx exposure was reproduced in the representative navigation set.

The immediately preceding M-05/M-05R release evidence already verified 1440×900, 390×844, and 320×800 in light/dark with no horizontal overflow. No production code changed after M-05R; M-06 additionally re-ran current production interaction/theme smoke tests below.

## Current production interaction checks

### Phone Radar

PASS. Long-term / Data / Temporary family switching preserved the selected state; Show more expanded routes; Full guide opened and closed; Auto / Light / Dark theme cycling remained usable; no visible page error was observed.

### Reset representative

PASS on Manus Credits Reset. With 120 credits left and planned use 50, the visible result was `70 credits remain before the next reset`. Auto / Light / Dark remained usable with no visible error.

Cursor's datetime-local field was not used as the final M-06 representative because the automation agent repeatedly looped on that native control. This was a test-agent limitation, not a reproduced product defect. Cursor remains covered by the immediate M-02/M-05R production verification and current M-06 static identity/build checks.

### Relay Exit Risk

PASS using disposable domain `m06-audit.invalid`. The tool returned the bounded low-evidence state `— /100` with the confidence-insufficient notice and `Risk data loaded.`. A forecast choice could be selected without submission; selected/unselected states stayed distinguishable across Auto / Light / Dark. No forecast was submitted and no external navigation occurred.

### Existing numerical/date utilities

PASS:

- Percentage: 15% of 80 → `12`.
- Percentage Increase: 80 → 100 → `+25%`.
- Discount: 100, then 20% and 10% → final price `72.0`, effective discount `28%`.
- Age: 2000-01-31 to 2026-03-01 → `26 years, 1 months, 1 days`.

Image Resizer/Compressor remain covered by the immediately preceding M-04B real-file production audit; M-06 live reads found no identity/navigation regression and no production code changed afterward.

## Release decision

No new concrete product regression was reproduced. M-01 through M-05R closure remains intact, M-06 passes, and the maintenance / visual-closure release sequence is complete.

Do not reopen accepted Phone, Reset, Relay, or utility shells without a newly reproduced defect or measurement-backed requirement. Q-015 remains measurement-gated. TikTok remains external-review gated. Future production work must return to the project growth/evidence rules rather than continue maintenance churn.
