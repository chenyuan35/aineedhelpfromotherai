# Cross-site Visual System Repair — 2026-09-22

Status: **COMPLETE / PRODUCTION VERIFIED**

Scope: bounded M-05R repair for the two defects reproduced in `docs/CROSS_SITE_VISUAL_SYSTEM_AUDIT_2026-09-22.md`. No redesign, product expansion, Relay methodology change, Reset semantic change, or Astro migration was permitted.

## Repairs

1. Reset-family shared border token
   - Added a bounded build enhancer that replaces generated `var(--border,#d9d9df)` aliases with the defined shared `var(--line)` token across the seven accepted Reset pages.
   - The enhancer runs inside the authoritative `frontend/bin/build.mjs` chain and fails if the expected generated patterns are not repaired.

2. Relay forecast selected state
   - The same enhancer replaces the undefined `.choice-button` `--text` references with the defined `--ink` token.
   - It also adds a Relay-scoped dark-theme selected-state rule so the generic dark-button rule cannot erase the selected/unselected visual distinction.

Changed production files in PR #185:

- `frontend/bin/build.mjs`
- `frontend/bin/fix-cross-site-visual-tokens.mjs`

## Local acceptance

Fresh current-main build passed, including utility regression checks. A second full build produced the same relevant output hashes.

Built-output checks:

- old Reset `var(--border,#d9d9df)` references: 0;
- old Relay forecast `var(--text)` choice-button references: 0.

Rendered Chromium checks at 1440×900, 390×844 and 320×800 in both light and dark themes verified:

- Relay selected/unselected forecast states visibly invert in both themes;
- Reset representative borders match `--line` in both themes;
- no page-level horizontal overflow;
- one H1 and canonical identity preserved.

## Preview / CI

PR #185 final head: `53d6223e862e1f6aa7ef1365ee5fde9695340fa6`.

- Eval Gate #647: PASS.
- Vercel Preview: Ready / success.
- Preview rendered QA repeated Relay and Reset behavior at 1440/390/320 in light/dark.

PR #185 squash-merged as `066ef4442ffe9259b72acca18bf9490c8a9d1c4c`.

## Production verification

Vercel production deployment for merge `066ef4442ffe9259b72acca18bf9490c8a9d1c4c` reached success.

Independent apex verification at `https://aineedhelpfromotherai.com/` confirmed:

- Relay route HTTP 200;
- Cursor Reset route HTTP 200;
- production Relay HTML old `--text` choice reference count: 0;
- production Cursor Reset HTML old `--border` alias count: 0;
- 390×844 light: Relay selected state dark background / white text, Reset borders match light `--line`;
- 390×844 dark: Relay selected state light background / dark text, Reset borders match dark `--line`;
- no horizontal overflow and one H1 on the checked production pages.

## Decision

M-05R is **COMPLETE / PRODUCTION VERIFIED**. The two defects opened by M-05 are closed.

Next independent task: **M-06 final release / production audit** in a new session. Do not reopen passing Phone, Reset, Relay, or utility surfaces without a reproduced regression, and do not migrate production to Astro as part of M-06.
