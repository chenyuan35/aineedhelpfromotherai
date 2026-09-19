# Current Execution Queue

Last updated: 2026-09-19

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

## NEXT — Q-013D4 CMLink production admission

Status: **NEXT ELIGIBLE UNFINISHED YESTERDAY TASK**.

Release vehicle: existing PR #127.

Route: **Trip.com Mainland China CMLink eSIM, product ID `71336361`**.

Existing validation state: **ADMISSION-READY AS `Watch`**. It is a Data route, not a durable phone-number/SMS route. Public copy must not promise reliable 5G, fixed egress, workstation-grade performance, rechargeability, or number/SMS/OTP capability.

Execute in this order:

1. read current PR #127 head/diff and `docs/PHONE_DATA_ROUTE_VALIDATION_CMLINK_2026-09-18.md`;
2. confirm only the intended CMLink Phone data changes remain;
3. confirm current Eval Gate state;
4. require PR #127's own fresh genuine Vercel Preview — do not reuse PR #130 evidence;
5. inspect Data family on desktop light/dark and mobile light/dark;
6. confirm CMLink is visibly `Watch` and data-only;
7. confirm existing Airalo/Mobal cards are unchanged and functional;
8. test family switching, country filtering, Show more if applicable, Full guide open/close, and horizontal overflow;
9. if a concrete defect exists, fix only that defect on PR #127 and repeat CI/Preview QA;
10. if clean, merge PR #127 and independently production-verify the apex;
11. add no second route in this release;
12. update `PROJECT_CONTEXT.md`, this queue, `docs/MASTER_PLAN.md`, and the maintenance plan after production verification.

Definition of done:

- PR #127 has current green CI/Eval;
- its own current Preview is rendered and accepted;
- CMLink is correct in desktop/mobile × light/dark;
- existing Data routes are not regressed;
- production deploy is verified after merge;
- fact sources record the final state.

Stop conditions:

- Vercel quota/provider failure: classify as provider blocker; do not push no-op commits or bypass it;
- current evidence no longer supports the route: return to HOLD instead of publishing;
- the change expands beyond one CMLink route: split/reject scope expansion;
- production-facing defect requires a broader Phone redesign: stop and record separately.

## AFTER Q-013D4 — M-02 AI Reset Radar visual closure

Source: `docs/MAINTENANCE_VISUAL_EXECUTION_AUDIT_PLAN_2026-09-19.md`.

Start only after Q-013D4 closes.

First target: existing canonical `/tools/cursor-usage-reset/`.

Known maintenance finding: calculator functionality works, but title/explanation/Quick answer consume too much of the first viewport before the actual input/result object.

M-02 boundaries:

- no new Reset URL;
- preserve the current Cursor title/meta CTR pilot;
- move the real input/result higher visually;
- keep Q-015 quota/pool work measurement-gated;
- then audit Claude, Copilot, Manus, Replit, Bolt and AI Credit Burn Rate for functional and visual consistency.

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

Status: **DUE 2026-09-20 — NOT DUE TODAY**.

On Sep 20, first read `docs/AUTHORITY_AND_AI_DISCOVERY.md` and the original Gmail threads/public pages. Do not resend before then.

### Phone observer runtime

Status: **NOT VERIFIED FROM CURRENT CONNECTION**.

The connected qwen environment is not the systemd disposable observer host. Do not guess another machine, do not use `hermes`, and do not report watcher success/failure until the actual observer host is explicitly identifiable/reachable.

## Do not do next

- do not reopen Q-014J without a reproduced regression;
- do not add a second Phone route while closing PR #127;
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

Finish one bounded task to a verified stopping point. The current task is **Q-013D4 / PR #127**. Once it closes, the next independent session task is **M-02 AI Reset Radar visual closure**.
