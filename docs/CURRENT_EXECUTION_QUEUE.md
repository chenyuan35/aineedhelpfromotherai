# Current Execution Queue

Last updated: 2026-09-22

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

## COMPLETED — M-02 Reset visual closure

Source: `docs/MAINTENANCE_VISUAL_EXECUTION_AUDIT_PLAN_2026-09-19.md`. Detailed family audit evidence: `docs/RESET_FAMILY_AUDIT_2026-09-20.md`.

**M-02B-1 Claude Code Limit Reset audit + repair are DONE / PRODUCTION VERIFIED.** The read-only audit reproduced the first-viewport hierarchy defect; PR #156 then changed exactly one page file, moving the existing reset inputs/tracker ahead of Quick answer and compacting the Claude-specific hero. Final head `45d80b4530f8ec02efab192ba39420d5230c20b8` passed Eval Gate #583 and genuine Vercel Preview QA; squash merge `049a6349f00516b9b08ffeea6a95325e538d113c` passed independent apex QA. Calculator top improved from ~912/~1207px to ~420/~503px desktop/mobile, and inputs to ~475/~551px. Title/meta/canonical and provider-policy semantics remained unchanged; no new quota functionality was added.

**M-02B-2 GitHub Copilot Credits Reset audit + repair are DONE / PRODUCTION VERIFIED.** The audit reproduced two defects; PR #159 then changed only `frontend/bin/generate-ai-reset-tools-round2.mjs`. Final head `27f713692f5cf2f612b47989e9c2fd00b0517502` passed Eval Gate #591 and genuine Vercel Preview QA; squash merge `2a70b7b488fba4f390a06ac82d648bdba999bfa5` passed independent apex QA. Mobile `Credits remaining` improved from ~957px → ~610px at 390×844 and ~1089px → ~659px at 320×800; saved inputs now recompute metrics/result after reload. Desktop order, title/meta/canonical and verified GitHub policy semantics remain unchanged; no new quota functionality was added.

**M-02B-3 Manus Credits Reset audit + repair are DONE / PRODUCTION VERIFIED.** The audit reproduced mobile planner displacement and a source-traceability gap for the Free 1,500-credit monthly cap. PR #162 then added a small Manus build enhancer and registered it in the normal build chain. Final head `29cd39fadd57a70162dd46d20745c1bdf8879332` passed Eval Gate #597 and genuine Vercel Preview QA; squash merge `4c4603251d45fd0fb2a0b1d7931b850e71638f55` passed independent apex QA. Mobile `Daily credits left` improved from ~1068px → ~670px at 390×844 and ~1194px → ~796px at 320×800; desktop order stayed unchanged. The 1,500-credit cap now has its direct current official Manus source. Title/meta/canonical and calculator semantics remain unchanged; no new quota functionality was added.

**M-02B-4 Replit Usage Reset audit + M-02B-4R repair are DONE / PRODUCTION VERIFIED.** The audit reproduced one narrow-mobile hierarchy defect. PR #165 added only a bounded Replit page enhancer plus its build-chain registration; final head `6b5b84de6b8e72d7328777f578b848f6bbcf15e4` passed Eval Gate #603 and genuine Vercel Preview QA, then squash-merged as `c783c86441ca819dbf5e6598492cac016d5f68bc`. At 320×800 the reset/usage inputs moved from ~871/~961px to ~647/~736px, while 390×844 and 1440×900 composition stayed unchanged. Preview and production passed light/dark, known-value planning, save/reload recomputation, missing/past reset handling, five-hour shortcut, SEO identity and no horizontal overflow. Calculator semantics and current five-hour policy wording/source were unchanged.

**M-02B-5 Bolt Tokens Reset audit + M-02B-5R repair are DONE / PRODUCTION VERIFIED.** The audit reproduced mobile first-viewport displacement and incomplete saved-state result restoration. PR #168 added only a bounded Bolt page enhancer plus its build-chain registration; final head `e2a5685355b0fe5973e9419d4d084f5038e017e4` passed Eval Gate #609 and genuine Vercel Preview QA, then squash-merged as `93f52d523d08aaf1495145f93cd501a97d11019e`. At 390×844 `Tokens remaining` moved ~916px → ~497px and result ~1642px → ~708px; at 320×800 `Tokens remaining` moved ~1093px → ~575px and result ~1819px → ~774px. Saved inputs now recompute metrics/result on reload. Desktop composition, current official Bolt policy wording/source, title/meta/canonical, calculator semantics and horizontal-overflow behavior remain unchanged.

**M-02B-6 AI Credit Burn Rate audit + M-02B-6R repair are DONE / PRODUCTION VERIFIED.** PR #171 added one page-specific build enhancer plus build registration. Final head `3a5b1eae81716694faf6cfca8303ade8f612c251` passed Eval Gate #615 and genuine Vercel Preview QA, then squash-merged as `ae4c9f83cdb5a9b67f7bd3a5ba27e77708489dee`. Desktop 1440×900 stayed unchanged; at 390×844 Calculate/result improved ~946/~1416px → ~744/~812px, and at 320×800 ~1112/~1607px → ~673/~737px. Known-value math, saved-state recomputation, title/meta/canonical, light/dark and no-overflow behavior passed on Preview and production. Detailed evidence is in `docs/AI_CREDIT_BURN_RATE_AUDIT_2026-09-20.md`.

**M-02C Reset release audit is DONE / PRODUCTION VERIFIED.** Fresh current-main clone/build passed on the connected qwen host. All seven Reset pages then passed representative production function, exactly one H1/self-canonical, 1440×900 + 390×844 + 320×800 light/dark Chromium checks and no page-level horizontal overflow. The initial Claude “missing H1” automation result was disproved by GitHub source and deterministic Chromium QA. Cursor 320×800 remains a narrow-mobile caution, not a reproduced regression. Full evidence: `docs/RESET_RELEASE_AUDIT_2026-09-21.md`.

**DONE — Q-005 Authority recheck.** On Sep 21, all three original Gmail threads still contained only the Sep 13 sent message; independent public-page checks found no verified link/citation. Round one is closed without a resend. Future authority work should prefer a bounded Learn Cursor + explainx.ai batch-2 test.

**DONE — M-03 Relay Exit Risk visual closure.** The Sep 21 audit used safe `m03-audit.invalid` plus measured `daoxe.com` without submitting any community forecast and reproduced only two bounded visual defects: late mobile result placement and an overlong/repetitive empty result. PR #176 changed exactly `frontend/tools/relay-exit-risk-checker/index.html`, preserved methodology, confidence/source/forecast semantics, title/meta/canonical and API behavior, and passed Eval Gate #627 plus genuine Vercel Preview. At 390×844 the measured result card/index/heading now begin around 647/657/728px; the empty result is about 404px tall instead of ~1533px. Preview and production both passed desktop/mobile × light/dark, safe empty + measured relay loading, 8/200 → 25 days exposed, one H1/self-canonical, no horizontal overflow and no client exceptions. PR #176 squash-merged as `da005c894976b22cf4be013111b0bd1f94a20487`; Vercel production and independent apex QA passed. Full audit origin: `docs/RELAY_VISUAL_AUDIT_2026-09-21.md`.

**DONE — M-04A numerical/date utility audit.** Production Chromium tested Percentage, Percentage Increase, Discount, Age and Date Difference with real known values plus invalid/empty states, 1440×900, 390×844 and 320×800 light/dark, canonical/H1, related links and overflow. Percentage Increase and Date Difference passed. Three bounded defects were reproduced: (U-01) Percentage `X% of Y` treats blank inputs as zero and returns `0`; (U-02) Discount treats blanks as zero and accepts >100% discounts, yielding negative final prices; (U-03) Age month-end arithmetic can return negative day counts (`2000-01-31` → `2026-03-01` => `26 years, 1 months, -2 days`). Evidence: `docs/UTILITY_NUMERICAL_DATE_AUDIT_2026-09-21.md`.

**DONE — M-04R numerical/date bounded repair / PRODUCTION VERIFIED.** PR #180 changed only `frontend/bin/generate-tools.mjs`, `frontend/bin/check-utility-regressions.mjs`, and `frontend/bin/build.mjs`. U-01 now rejects blank Percentage inputs; U-02 rejects blank required Discount inputs and discounts outside 0–100% while preserving sequential `100 → 20% → 10% = 72` math; U-03 uses calendar-safe clamped year/month decomposition and fixes the reproduced month-end case to `26 years, 1 months, 1 days`. Build-time regressions passed, Eval Gate #635 passed, Vercel Preview passed 1440/390/320 light/dark functional/SEO/overflow QA, squash merge `cdc13b678bf51aae4b1ce702b7c3cba31a4587f2` deployed successfully, and independent apex QA passed 1440/390 light/dark plus all three repaired behaviors.

**DONE — M-04B Image Resizer/Compressor audit.** Production Chromium used harmless real image fixtures and verified both browser-side tools end to end. Image Resizer detected 640×360 input, preserved aspect-ratio locking, applied presets, generated a real 320×180 PNG download with sensible filename, accepted JPG/WebP inputs, and enforced the 50MP guard. Image Compressor verified the quality control, 320px max-width path, real JPG/WebP/PNG downloads with independently parsed 320×180 dimensions, accurate smaller-size reporting, and a real `52% larger` PNG case. Both pages passed HTTP 200, one H1/self-canonical, structured data, related links, 1440/390/320 light/dark, no horizontal overflow, no client exceptions and no same-origin write requests during processing. No repair is required. Evidence: `docs/UTILITY_IMAGE_AUDIT_2026-09-22.md`.

**NEXT — M-05 cross-site visual system audit.** Audit shared H1/tool hierarchy, interactive-object placement, primary-button hierarchy, shared tokens, selected states, mobile legibility/tappability, theme cycling, generated CSS/HTML overwrite risk, and related navigation across the already-closed surfaces. Do not redesign passing pages or migrate production to Astro.

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

Status: **DONE — rechecked 2026-09-21**.

All three round-one threads remain unanswered and no independently verified public link/citation was found. Do not resend the original three automatically. A future authority session may validate and test the revalidated Learn Cursor + explainx.ai batch-2 candidates.

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

Finish one bounded task to a verified stopping point. **M-02 Reset visual closure, Q-005 authority recheck, M-03 Relay visual closure and M-04 existing-utility audit are closed.** The next bounded task is **M-05 cross-site visual system audit only**. Future authority batch-2 outreach remains a separate later session.
