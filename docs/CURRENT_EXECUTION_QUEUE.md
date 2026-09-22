# Current Execution Queue

Last updated: 2026-09-22

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` are canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: it is the atomic execution queue, not a history archive.

## Current decision

Product scope remains frozen to three surfaces:

1. **Phone Radar** — primary;
2. **AI Reset Radar** — secondary;
3. **Relay Exit Risk** — secondary.

Existing small utilities stay maintained/tested but are not a fourth product direction. No second Phone canonical, country/provider doorway pages, bulk generic tools, or broad Astro production migration.

## JUST COMPLETED — M-05R bounded cross-site token repair

Status: **DONE / PRODUCTION VERIFIED**.

Evidence:

- source audit: `docs/CROSS_SITE_VISUAL_SYSTEM_AUDIT_2026-09-22.md`;
- repair evidence: `docs/CROSS_SITE_VISUAL_SYSTEM_REPAIR_2026-09-22.md`;
- PR #185 final head `53d6223e862e1f6aa7ef1365ee5fde9695340fa6`;
- changed production files only: `frontend/bin/build.mjs` + `frontend/bin/fix-cross-site-visual-tokens.mjs`;
- Reset generated `var(--border,#d9d9df)` aliases repaired to shared `--line` through the authoritative build chain;
- Relay forecast choice-button undefined `--text` repaired to `--ink`, with Relay-scoped dark selected-state protection;
- normal build + utility regressions PASS;
- second full build stable;
- built old Reset border references = 0;
- built old Relay choice-button `--text` references = 0;
- local and genuine Vercel Preview QA passed 1440×900, 390×844 and 320×800 light/dark;
- no horizontal overflow, one H1 and canonical identity preserved;
- Eval Gate #647 PASS;
- Vercel Preview Ready / success;
- PR #185 squash-merged as `066ef4442ffe9259b72acca18bf9490c8a9d1c4c`;
- Vercel production deployment SUCCESS;
- independent apex QA passed Relay + Cursor Reset HTTP 200, repaired token output, light/dark selected-state/border behavior, no overflow and one H1.

Rule: M-05 and M-05R are closed. Do not reopen Phone/Reset/Relay/utility visual repairs without a reproduced regression.

## NEXT — M-06 final release / production audit

Session scope: **audit only**.

Required checks:

- fresh current-main build and applicable regressions;
- confirm production matches the closed maintenance state;
- representative Phone / Reset / Relay / utility critical flows;
- exactly one H1 and correct self-canonical / SEO identity;
- 1440×900, 390×844 and 320×800 in light/dark;
- site-wide theme cycling;
- no page-level horizontal overflow;
- representative internal/related navigation and no newly exposed 4xx/5xx links;
- no generator overwrite regression from M-01 through M-05R;
- no production migration to Astro;
- no feature, route, methodology, copy-positioning or product-scope expansion.

If M-06 reproduces a concrete regression, record it and stop for a later bounded repair session. Do not silently repair a new independent defect inside the audit session.

## Measurement gates

### Phone Q-003

Status: **DONE FOR CURRENT SAMPLE / KEEP**.

Latest canonical sample remains Phone release-day Sep 16 at 0 impressions / 0 clicks with the canonical indexed. This is insufficient exposure, not evidence for expansion or repositioning. Re-measure when settled exposure or meaningful interactions appear.

### Cursor Q-002 / Q-015

Status: **MEASURING / GATED**.

Do not implement Q-015 quota/pool depth until its documented measurement gates are satisfied.

## External waits

### TikTok App Review

Status: **SUBMITTED / WAITING FOR REVIEW**.

Do not Recall, edit submitted configuration/demo, remove the Sandbox review bridge, rotate credentials, or change URLs/products/scopes. Trigger only on `Approved` or `Rejected / Changes requested`.

### Q-005 Authority

Status: **ROUND ONE CLOSED**.

No automatic resend to the original three contacts. Future authority work is a separate bounded batch-2 session using revalidated candidates.

### Phone observer runtime

Status: **NOT VERIFIED FROM QWEN**.

The connected qwen environment is not the systemd disposable observer host. Do not infer watcher health from it.

## Do not do next

- do not add another Phone route automatically;
- do not reopen accepted Phone/Reset/Relay/utility shells without a reproduced regression;
- do not implement Q-015 while measurement-gated;
- do not add country/provider doorway pages or bulk generic utilities;
- do not create a temporary-SMS backend/marketplace;
- do not invent OTP percentages, Phone risk scores, Relay shutdown probabilities or fake confidence values;
- do not migrate the production site to Astro as part of maintenance;
- do not change DNS, AdSense, billing, paid services, or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.

## Session rule

One bounded task per session. **M-05R is complete.** The next independent task is **M-06 final release / production audit only**, and it should start in a new conversation/session.