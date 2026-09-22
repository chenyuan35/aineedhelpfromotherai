# Current Execution Queue

Last updated: 2026-09-22

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` are canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: it is the atomic execution queue, not a history archive.

## Current decision

Product scope remains frozen to three surfaces:

1. **Phone Radar** — primary;
2. **AI Reset Radar** — secondary;
3. **Relay Exit Risk** — secondary.

Existing small utilities stay maintained/tested but are not a fourth product direction. No second Phone canonical, country/provider doorway pages, bulk generic tools, or broad Astro production migration.

## JUST COMPLETED — Search Console measurement-path recovery

Status: **VERIFIED / NO PRODUCTION CHANGE**.

Evidence: `docs/GSC_MEASUREMENT_2026-09-22.md`.

- GSC Wizard free/trial quota is exhausted and the project now treats it as deprecated for new measurement work.
- Windsor.ai `searchconsole` is connected to `sc-domain:aineedhelpfromotherai.com` and successfully returned official Search Console date/page/query/click/impression/CTR/position data.
- Windsor currently reports a Trial / not-paid account, so it is an access bridge, not a durable paid dependency. If it becomes unavailable, use official Google Search Console API/export rather than rotating trial accounts.
- latest finalized returned date in the verified read: 2026-09-19.
- site-wide Search exposure is now real: Sep 16–19 returned 1/81, 1/104, 2/89 and 1/71 clicks/impressions respectively.
- strongest 14-day page signal is Cursor: 479 impressions / 0 clicks / avg position ~6.98.
- Manus: 75 impressions / 1 click; Replit: 57 / 0; Bolt: 43 / 0.
- exact Phone canonical filter for Sep 16–19 returned no rows.

## JUST COMPLETED — AIR-4 authority batch 2

Status: **SENT / WAITING**.

Evidence: `docs/AUTHORITY_BATCH2_2026-09-22.md` and `docs/AUTHORITY_AND_AI_DISCOVERY.md`.

- Learn Cursor and explainx.ai were revalidated immediately before outreach.
- Gmail history checks found no prior threads on the current public contact paths.
- exactly two personalized reader-benefit resource suggestions were sent on 2026-09-22;
- no link exchange, paid placement, reciprocal condition or mass outreach was requested;
- do not add a third target to this round;
- do not follow up while the messages are fresh;
- first response/link check: **2026-09-29 or later**.

## Maintenance closure remains closed

M-06 final release / production audit remains **DONE / FINAL AUDIT PASS**. Evidence: `docs/M06_FINAL_RELEASE_AUDIT_2026-09-22.md`.

Rule: the maintenance / visual-closure sequence M-01 through M-06 is closed. Reopen only for a newly reproduced defect or an evidence-backed requirement.

## NEXT — continue evidence-gated growth measurement

The next bounded session must follow current evidence gates rather than invent another maintenance change.

Priority constraints:

- Cursor Q-002/Q-015: continue clean post-change measurement to the documented 300-impression checkpoint; do not rewrite title/meta or implement Q-015 yet. A Sep 22 fresh-data check reached 290 impressions / 0 clicks through the partial Sep 22 row (289 through completed Sep 21), still below the gate.
- Phone Q-003: keep collecting settled exposure; do not churn copy/routes from a zero-exposure sample.
- TikTok: remains external-review gated and untouched.
- Authority: batch 2 is now SENT / WAITING; no third target or follow-up before the Sep 29 response/link check.
- AIR: provider quota/auth/cache blockers remain explicit; do not bypass them.

## Measurement gates

### Cursor Q-002 / Q-015

Status: **MEASURING / GATED**.

Only clean dates from 2026-09-17 onward count for the Q-002 decision.

Verified finalized data through Sep 19:

- Sep 17: 70 impressions / 0 clicks / avg position 7.29;
- Sep 18: 42 / 0 / 7.07;
- Sep 19: 37 / 0 / 7.22;
- finalized cumulative clean total: **149 impressions / 0 clicks**.

Sep 22 `include_fresh_data=true` recheck:

- Sep 20: 39 impressions / 0 clicks / avg position 7.00;
- Sep 21: 101 / 0 / 6.22;
- Sep 22 partial: 1 / 0 / 5.00;
- fresh-data cumulative total: **290 impressions / 0 clicks**; **289 / 0** through completed Sep 21.

The documented first decision checkpoint is **>=300 clean post-change impressions**. The current zero-click pattern at useful positions is a warning signal, but the gate has not fired. Do not implement Q-015 quota/pool depth or rewrite Cursor title/meta yet. Fresh rows are non-finalized and may still change.

### Phone Q-003

Status: **KEEP / CONTINUE COLLECTING EVIDENCE**.

The Phone canonical remains indexed, but an exact Search Console filter over 2026-09-16 through 2026-09-19 returned no rows. This is insufficient exposure, not evidence for expansion or repositioning. Re-measure when impressions/clicks or meaningful interactions appear.

## Search measurement path

Current preferred path:

1. Windsor.ai Search Console connector for in-chat reads while current capacity works;
2. official Google Search Console API/export as durable fallback;
3. GSC Wizard is deprecated for new project measurement because its current free/trial quota is exhausted.

Do not create throwaway accounts to extend provider trials. Do not upgrade billing without explicit authorization.

## External waits

### TikTok App Review

Status: **SUBMITTED / WAITING FOR REVIEW**.

Do not Recall, edit submitted configuration/demo, remove the Sandbox review bridge, rotate credentials, or change URLs/products/scopes. Trigger only on `Approved` or `Rejected / Changes requested`.

### Q-005 / AIR-4 Authority

Status: **BATCH 2 SENT / WAITING**.

Round one remains closed without a resend. Batch 2 contains exactly Learn Cursor and explainx.ai, sent on 2026-09-22 after same-session revalidation and no-prior-thread checks. Do not add another target or follow up before 2026-09-29 or later. On recheck, read the original Gmail threads and independently verify public links/citations before deciding any follow-up.

### Phone observer runtime

Status: **NOT VERIFIED FROM QWEN**.

The connected qwen environment is not the systemd disposable observer host. Do not infer watcher health from it.

## Do not do next

- do not add another Phone route automatically;
- do not reopen accepted Phone/Reset/Relay/utility shells without a reproduced regression;
- do not implement Q-015 before its measurement gate;
- do not rewrite Cursor title/meta before the 300-clean-impression review;
- do not add a third authority batch-2 target or send an early follow-up;
- do not add country/provider doorway pages or bulk generic utilities;
- do not create a temporary-SMS backend/marketplace;
- do not invent OTP percentages, Phone risk scores, Relay shutdown probabilities or fake confidence values;
- do not migrate the production site to Astro as part of maintenance;
- do not rotate trial accounts to bypass plugin quotas;
- do not change DNS, AdSense, billing, paid services, or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.

## Session rule

One bounded task per session. The current maintenance sequence is closed. Authority batch 2 is now sent and waiting. The next session should continue Q-002 measurement and perform the documented CTR review only after the 300-clean-impression gate actually fires; do not reopen accepted production shells without a reproduced regression.
