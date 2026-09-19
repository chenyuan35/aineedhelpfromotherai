# Current Execution Queue

Last updated: 2026-09-20

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` are canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: it is the atomic execution queue, not a history archive.

## Current decision

Product scope is frozen to three surfaces:

1. **Phone Radar** — primary;
2. **AI Reset Radar** — secondary;
3. **Relay Exit Risk** — secondary.

Existing small utilities stay maintained and tested, but they are not a fourth product direction.

No new product surface, second Phone canonical, country/provider doorway pages, bulk generic tools, or broad Astro migration.

## Just completed — Q-014J Phone visual closure

Status: **DONE / PRODUCTION VERIFIED**.

Evidence:

- final PR #130 head `dc8d147bd9c28b314dfbb977c212608cc0b14da7`;
- Eval Gate #567 PASS;
- final Vercel Preview SUCCESS;
- real Preview QA passed desktop/mobile × light/dark;
- exactly one Phone family is visually selected in every tested state;
- first real route appears promptly after compact controls;
- long-term route cards use three primary metrics;
- Croatia filter reveals A1 despite `shortlist:false`;
- `Show more` expands 5 → 9 routes;
- Full guide opens/closes inside the selected route card;
- no page-level horizontal overflow at 1440px or 390px;
- PR #130 squash-merged as `5ccd50b4c293a963274622b8a14a3987cbab14d8`;
- production apex returned 200 and repeated the same core checks in desktop/mobile × light/dark.

Rule: do not reopen the Phone shell without a reproduced regression or evidence-backed defect.

## JUST COMPLETED — Q-013D4 CMLink production admission

Status: **DONE / PRODUCTION VERIFIED**.

Route: **Trip.com Mainland China CMLink eSIM, product ID `71336361`**, Data family, `Watch`, data-only.

Evidence:

- final PR #127 head `6da8bb43bf1a2a8a6ce08dd9de8274ce78ed28e0`;
- final diff remained exactly `radar-view.json` + `tutorial-insights.json`;
- Phone contract audit passed 18 checks and the public frontend build passed;
- current Eval Gate passed;
- PR #127 received its own fresh genuine Vercel Preview and rendered acceptance;
- desktop/mobile × light/dark showed CMLink as `Watch`, data-only and without durable-number/SMS/OTP claims;
- no reliable-5G, fixed-egress, workstation-grade or rechargeability promise was introduced;
- Airalo and Mobal remained present; family switching, Mainland China/Croatia filters, Show more, inline Full guide and overflow checks passed;
- PR #127 squash-merged as `ebbfe784e7c4a9adc8cd19aa5add104855150bd5`;
- production Vercel deployment completed and independent apex QA repeated the Data-family checks successfully.

Rule: do not add a second Phone route automatically and do not reopen the accepted Phone shell without a reproduced defect.

## JUST COMPLETED — M-02A Cursor lead-page visual closure

Status: **DONE / PRODUCTION VERIFIED**.

Evidence:

- PR #153 changed only `frontend/bin/enhance-cursor-breakthrough.mjs`;
- final head `6c87923d0ab54a018563c18e8732cd154a44375e` passed Eval Gate #577 and Vercel Preview;
- calculator moved from ~815px → ~490px desktop and ~1126px → ~479px mobile; reset input is now inside both tested first viewports;
- supporting Quick answer content remains present but follows the calculator;
- desktop/mobile × light/dark passed with no horizontal overflow and clear primary/secondary actions;
- empty/invalid/past time, 0%/100%, save/reload, copy, calendar and clear behavior passed;
- canonical/title/meta were preserved and Q-015 quota/pool functionality was not added;
- PR #153 squash-merged as `67052224cd1ee84d6e595d13f3ac1e8c89e18f02`; production deployment and independent apex QA passed.

## NEXT — M-02B Reset-family consistency audit

Source: `docs/MAINTENANCE_VISUAL_EXECUTION_AUDIT_PLAN_2026-09-19.md`.

Start only in the next independent session. Audit the existing Claude, Copilot, Manus, Replit, Bolt and AI Credit Burn Rate pages without forcing identical layouts or changing Cursor title/meta/Q-015 gates.

## Measurement gates

### Q-003 Phone measurement

Status: **DONE FOR CURRENT SAMPLE / KEEP**.

Latest verified on Sep 19:

- GSC `settledThrough=2026-09-16`;
- Phone Sep 16: 0 impressions / 0 clicks;
- checked GA4 Sep 16–19: 0 Phone sessions / 0 active users;
- Phone canonical indexing: `indexed`, verdict `PASS`, `Submitted and indexed`.

Decision: insufficient demand sample. Do not add pages/routes or churn positioning because exposure is zero. Re-measure when actual settled exposure/interactions appear.

### Cursor Q-002 / Q-015

Status: **MEASURING / GATED**.

- Sep 17 is the first clean post-title/meta-change GSC day;
- wait until GSC settles Sep 17+;
- first clean decision at >=300 post-change impressions; extend toward ~500 only if ambiguous;
- do not implement Q-015 quota/pool depth until its measurement and Phone-ordering gates are satisfied.

## External wait / dated tasks

### TikTok App Review

Status: **SUBMITTED / WAITING FOR REVIEW**.

Do not click `Recall`, edit the submitted demo/configuration, remove the Sandbox review bridge, rotate credentials, or change URLs/products/scopes while pending.

Trigger only on `Approved` or `Rejected / Changes requested`.

### Q-005 Authority

Status: **DUE TODAY — 2026-09-20**.

On Sep 20, first read `docs/AUTHORITY_AND_AI_DISCOVERY.md` and the original Gmail threads/public pages. Do not resend before then.

### Phone observer runtime

Status: **NOT VERIFIED FROM CURRENT CONNECTION**.

The connected qwen environment is not the systemd disposable observer host. Do not guess another machine, do not use `hermes`, and do not report watcher success/failure until the actual observer host is explicitly identifiable/reachable.

## Do not do next

- do not reopen Q-014J without a reproduced regression;
- do not add another Phone route automatically;
- do not revive PR #112/questionnaire/manual UI;
- do not push no-op commits or use alternate accounts/projects to bypass Vercel quota;
- do not add country/provider doorway pages;
- do not create a temporary-SMS backend/marketplace;
- do not invent OTP percentages, Phone risk scores, or fake confidence values;
- do not use provider marketing pages as proof of operational reliability;
- do not migrate the whole site to Astro as part of maintenance;
- do not change DNS, AdSense, billing, paid services, or critical account settings without explicit authorization;
- never use `hermes` for this project; `yuan` is not project infrastructure.

## Session rule

Finish one bounded task to a verified stopping point. **M-02A Cursor lead-page visual closure is closed.** The next independent session task is **M-02B Reset-family consistency audit**.
