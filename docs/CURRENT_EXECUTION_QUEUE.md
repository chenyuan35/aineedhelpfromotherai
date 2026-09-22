# Current Execution Queue

Last updated: 2026-09-22

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` are canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: it is the atomic execution queue, not a history archive.

## Current decision

Product scope remains frozen to three surfaces:

1. **Phone Radar** — primary;
2. **AI Reset Radar** — secondary;
3. **Relay Exit Risk** — secondary.

Existing small utilities stay maintained/tested but are not a fourth product direction. No second Phone canonical, country/provider doorway pages, bulk generic tools, or broad Astro production migration.

## JUST COMPLETED — M-06 final release / production audit

Status: **DONE / FINAL AUDIT PASS**.

Evidence: `docs/M06_FINAL_RELEASE_AUDIT_2026-09-22.md`.

Closure summary:

- fresh current-main build + utility regressions PASS;
- second full build stable with identical dist hash;
- M-05R old Reset/Relay token references remain absent;
- representative production Phone / Reset / Relay / utility interactions PASS;
- current production identity/canonical/navigation reads exposed no new regression;
- immediately preceding exact 1440×900 / 390×844 / 320×800 light/dark evidence remains applicable because no production code changed after M-05R; current M-06 theme interaction smokes also passed;
- no new generator overwrite regression, Astro production migration, feature/route/methodology/positioning change, or product-scope expansion was introduced.

Rule: the maintenance / visual-closure sequence M-01 through M-06 is closed. Reopen only for a newly reproduced defect or an evidence-backed requirement.

## NEXT — return to evidence-gated growth work

M-06 does not unlock a new production-code task by itself. The next bounded session must pick from current evidence gates rather than invent another maintenance change.

Priority constraints:

- Phone Q-003: keep collecting settled exposure; do not churn copy/routes from a zero-exposure sample.
- Cursor Q-015: remains measurement-gated.
- TikTok: remains external-review gated and untouched.
- Authority: round one stays closed; any batch-2 test is a separate bounded session with revalidated candidates.
- AIR: provider quota/auth/cache blockers remain explicit; do not bypass them.

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

One bounded task per session. **M-06 is complete and the maintenance sequence is closed.** The next session should select one evidence-gated growth/measurement task; do not reopen accepted production shells without a reproduced regression.
