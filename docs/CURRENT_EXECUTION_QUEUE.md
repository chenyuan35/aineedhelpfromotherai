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

## IN PROGRESS — M-02B Reset-family consistency audit

Source: `docs/MAINTENANCE_VISUAL_EXECUTION_AUDIT_PLAN_2026-09-19.md`. Detailed family audit evidence: `docs/RESET_FAMILY_AUDIT_2026-09-20.md`.

**M-02B-1 Claude Code Limit Reset audit + repair are DONE / PRODUCTION VERIFIED.** The read-only audit reproduced the first-viewport hierarchy defect; PR #156 then changed exactly one page file, moving the existing reset inputs/tracker ahead of Quick answer and compacting the Claude-specific hero. Final head `45d80b4530f8ec02efab192ba39420d5230c20b8` passed Eval Gate #583 and genuine Vercel Preview QA; squash merge `049a6349f00516b9b08ffeea6a95325e538d113c` passed independent apex QA. Calculator top improved from ~912/~1207px to ~420/~503px desktop/mobile, and inputs to ~475/~551px. Title/meta/canonical and provider-policy semantics remained unchanged; no new quota functionality was added.

**M-02B-2 GitHub Copilot Credits Reset audit + repair are DONE / PRODUCTION VERIFIED.** The audit reproduced two defects; PR #159 then changed only `frontend/bin/generate-ai-reset-tools-round2.mjs`. Final head `27f713692f5cf2f612b47989e9c2fd00b0517502` passed Eval Gate #591 and genuine Vercel Preview QA; squash merge `2a70b7b488fba4f390a06ac82d648bdba999bfa5` passed independent apex QA. Mobile `Credits remaining` improved from ~957px → ~610px at 390×844 and ~1089px → ~659px at 320×800; saved inputs now recompute metrics/result after reload. Desktop order, title/meta/canonical and verified GitHub policy semantics remain unchanged; no new quota functionality was added.

**M-02B-3 Manus Credits Reset audit + repair are DONE / PRODUCTION VERIFIED.** The audit reproduced mobile planner displacement and a source-traceability gap for the Free 1,500-credit monthly cap. PR #162 then added a small Manus build enhancer and registered it in the normal build chain. Final head `29cd39fadd57a70162dd46d20745c1bdf8879332` passed Eval Gate #597 and genuine Vercel Preview QA; squash merge `4c4603251d45fd0fb2a0b1d7931b850e71638f55` passed independent apex QA. Mobile `Daily credits left` improved from ~1068px → ~670px at 390×844 and ~1194px → ~796px at 320×800; desktop order stayed unchanged. The 1,500-credit cap now has its direct current official Manus source. Title/meta/canonical and calculator semantics remain unchanged; no new quota functionality was added.

**M-02B-4 Replit Usage Reset audit + M-02B-4R repair are DONE / PRODUCTION VERIFIED.** The audit reproduced one narrow-mobile hierarchy defect. PR #165 added only a bounded Replit page enhancer plus its build-chain registration; final head `6b5b84de6b8e72d7328777f578b848f6bbcf15e4` passed Eval Gate #603 and genuine Vercel Preview QA, then squash-merged as `c783c86441ca819dbf5e6598492cac016d5f68bc`. At 320×800 the reset/usage inputs moved from ~871/~961px to ~647/~736px, while 390×844 and 1440×900 composition stayed unchanged. Preview and production passed light/dark, known-value planning, save/reload recomputation, missing/past reset handling, five-hour shortcut, SEO identity and no horizontal overflow. Calculator semantics and current five-hour policy wording/source were unchanged.

**M-02B-5 Bolt Tokens Reset audit + M-02B-5R repair are DONE / PRODUCTION VERIFIED.** The audit reproduced mobile first-viewport displacement and incomplete saved-state result restoration. PR #168 added only a bounded Bolt page enhancer plus its build-chain registration; final head `e2a5685355b0fe5973e9419d4d084f5038e017e4` passed Eval Gate #609 and genuine Vercel Preview QA, then squash-merged as `93f52d523d08aaf1495145f93cd501a97d11019e`. At 390×844 `Tokens remaining` moved ~916px → ~497px and result ~1642px → ~708px; at 320×800 `Tokens remaining` moved ~1093px → ~575px and result ~1819px → ~774px. Saved inputs now recompute metrics/result on reload. Desktop composition, current official Bolt policy wording/source, title/meta/canonical, calculator semantics and horizontal-overflow behavior remain unchanged.

**M-02B-6 AI Credit Burn Rate Calculator read-only audit is DONE / DEFECT REPRODUCED.** Production QA passed known-value calculation, missing/past reset handling, negative-value bounding, saved-state recomputation, SEO identity, desktop/mobile light/dark rendering, no horizontal overflow and no client errors. The reproduced defect is mobile action/result hierarchy: at 390×844 the first input is ~540px but Calculate/metrics/result begin ~946/~1010/~1416px; at 320×800 they begin ~1112/~1177/~1607px. Detailed evidence is in `docs/AI_CREDIT_BURN_RATE_AUDIT_2026-09-20.md`.

**NEXT — M-02B-6R AI Credit Burn Rate mobile hierarchy repair.** Preserve calculator math, saved-state behavior, title/meta/canonical and desktop composition. Reduce mobile vertical distance so the primary Calculate action and result are reachable substantially sooner. Use one bounded production-affecting PR with build/Eval Gate/real Preview plus desktop/mobile × light/dark acceptance before merge.

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

Finish one bounded task to a verified stopping point. **M-02B-6 AI Credit Burn Rate audit is closed with one reproduced mobile hierarchy defect.** The next bounded task is **M-02B-6R bounded mobile action/result hierarchy repair**; do not expand scope into new quota/product functionality.
