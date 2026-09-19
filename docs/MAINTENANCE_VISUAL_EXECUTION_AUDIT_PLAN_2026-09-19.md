# Maintenance + Visual Execution and Audit Plan — 2026-09-19

Status: **ACTIVE PLANNING CONTRACT / NO NEW PRODUCT DEVELOPMENT**

This plan converts the current maintenance-only direction into an ordered execution and audit checklist.

The project is no longer in “keep inventing new tools” mode. The active goal is to make the existing product set coherent, visual, functional, measurable and maintainable.

GitHub `main` + verified production remain authoritative. This document is an execution contract; it does not override `PROJECT_CONTEXT.md`, `docs/MASTER_PLAN.md`, or `docs/OPERATING_WORKFLOW.md`.

## 1. Frozen scope

Core product surfaces:

1. **Phone Radar** — primary.
2. **AI Reset Radar** — secondary, with Cursor as the current lead optimization page and the existing reset tools kept coherent.
3. **Relay Exit Risk** — secondary.

Existing utility tools remain supported and must be audited, but they are not a fourth product direction.

Current registered production tools to keep working:

- Phone Number Survival Guide / Phone Radar;
- Cursor Usage Reset Calculator;
- Claude Code Limit Reset Calculator;
- GitHub Copilot Credits Reset;
- Manus Credits Reset;
- Replit Usage Reset;
- Bolt Tokens Reset;
- AI Credit Burn Rate Calculator;
- AI Relay Exit Risk Checker;
- Percentage Calculator;
- Percentage Increase Calculator;
- Discount Calculator;
- Age Calculator;
- Date Difference Calculator;
- Image Resizer;
- Image Compressor.

### Explicit non-goals

- no fourth product surface;
- no new generic calculator batch;
- no new Phone canonical;
- no country/provider doorway pages;
- no broad Astro migration as part of visual maintenance;
- no backend expansion unless an existing function is impossible to repair without it;
- no decorative redesign that does not reduce user decision time;
- no title/meta churn merely because visual work is happening;
- no new Phone route research/admission beyond closing the already-open PR #127 carryover before maintenance work resumes.

## 2. Visual rule learned from mature products

The front end must behave like a tool/dashboard, not a marketing article.

Use these rules across the three core surfaces:

- the primary user task or real data object should dominate the first viewport;
- headings identify the page but should not overpower controls/results;
- use horizontal desktop space before adding vertical explanation;
- put task choices, filters, status, KPI values and comparison metrics ahead of prose;
- limit default visible metrics to the values that actually change a decision;
- use progressive disclosure for full instructions, methodology and edge cases;
- make selected/unselected states obvious without reading explanatory text;
- keep mobile visual and tappable rather than compressing a desktop table;
- support light/dark states as separate visual acceptance cases;
- do not call a page visually complete based on source code or CI alone.

The project may reuse patterns learned from mature/open-source dashboard systems, but it should not migrate frameworks simply to copy them.

## 3. Definition of “done” for any existing tool

A tool is not complete until all applicable layers pass:

1. **Functional** — the primary interaction produces the correct result.
2. **Visual** — the user can understand what to do and where the result is within seconds.
3. **Responsive** — desktop and mobile do not overflow or collapse into unreadable density.
4. **Theme** — light and dark preserve hierarchy, active state and contrast.
5. **Data** — current claims/values are sourced or explicitly marked uncertain where required.
6. **SEO identity** — canonical/title/schema/internal links remain correct; no accidental duplicate URL.
7. **Analytics** — existing meaningful interaction events still fire and do not collect sensitive values.
8. **Release** — tests + Eval Gate + real Vercel Preview pass for production-affecting work.
9. **Production** — apex-domain behavior is independently verified after merge/deploy.
10. **Audit evidence** — the result is recorded in GitHub facts/queue rather than existing only in chat memory.

## 4. Execution order

### Phase M-00 — Baseline and inventory

Status: **DONE FOR CURRENT ROUND / REPEAT ONLY WHEN INVENTORY CHANGES**

Checklist:

- [x] freeze scope to Phone / Reset / Relay + maintenance of existing utilities;
- [x] identify the current registered production tool inventory;
- [x] perform a live interaction smoke pass over the registered tools;
- [x] use known-value inputs for calculators rather than page-load-only checks;
- [x] exercise Phone family/filter/show-more interactions;
- [x] exercise safe Relay lookup without casting a community forecast;
- [x] test image processing with a real harmless image rather than only clicking controls;
- [x] separate test-runner limitations from actual product failures before recording a defect.

Current baseline conclusion: existing registered tools have working primary functional paths in the Sep 19 smoke pass; visual/product closure is still open for the Reset and Relay core surfaces.

---

## 5. Phase M-01 — Phone Radar visual closure

Status: **DONE / PRODUCTION VERIFIED — 2026-09-19**

Release vehicle was PR #130; it is now merged and production-verified.

### M-01A — Implement the visual-first shell

Checklist:

- [x] demote the marketing hero;
- [x] use a compact desktop composition rather than “large title over small subtitle”;
- [x] make the three user jobs the primary visual selector;
- [x] make task language primary and technical route labels secondary;
- [x] use icons/shape/selected state so the three jobs are distinguishable before reading detail;
- [x] reduce each route card to 2–3 primary decision metrics plus status/metadata;
- [x] keep warnings conditional rather than showing a paragraph on every card;
- [x] keep Full guide attached to the selected route;
- [x] keep country refinement and Show more secondary to the core decision path.

### M-01B — Fix functional defects exposed by visual QA

Checklist:

- [x] prevent global dark button styles from flattening Phone selected/unselected states;
- [x] fix at the build-generator level when generated `dist` CSS can reintroduce the defect;
- [x] ensure country selection can reveal a matching non-shortlist route instead of returning an artificial zero-result state;
- [x] rerun all Phone contract/build tests on the latest PR head;
- [x] confirm the latest PR head, CI and Preview status immediately before final acceptance.

### M-01C — Local/build verification

Required evidence:

- [x] Phone contract audit passes;
- [x] full public build passes;
- [x] generated `frontend/dist/site.css` preserves Phone-specific dark-state rules after the generic theme generator;
- [x] no generated-file noise or unrelated product change is included in the final diff;
- [x] canonical and route data are unchanged unless a separately approved data correction is explicitly part of the same bounded defect.

### M-01D — Real Preview visual acceptance

Desktop target: representative width around 1366–1440px.

Mobile target: representative width around 390px, with 320–430px considered for overflow risk.

Required cases:

- [x] desktop light;
- [x] desktop dark;
- [x] mobile light;
- [x] mobile dark;
- [x] exactly one selected family state is obvious in every case;
- [x] `Keep a real number` state verified;
- [x] `Get mobile data` state verified;
- [x] `Receive a one-time code` state verified;
- [x] first real route appears promptly after compact controls;
- [x] route cards expose only the primary metrics clearly;
- [x] country filter works for shortlist and non-shortlist matches;
- [x] Show more expands correctly;
- [x] Full guide opens/closes inside the selected route context;
- [x] no page-level horizontal overflow;
- [x] primary and secondary actions remain visually distinct;
- [x] no outbound purchase/platform action is required for visual acceptance.

### M-01E — Release

Only when M-01B/C/D are green:

- [x] leave Draft / mark PR ready only after real visual acceptance;
- [x] merge through the normal GitHub path;
- [x] wait for production deployment;
- [x] verify production canonical returns 200;
- [x] repeat the core family/filter/guide smoke checks on the apex domain;
- [x] verify light/dark production output rather than assuming Preview parity;
- [x] update `PROJECT_CONTEXT.md`, queue and relevant plan status.

### M-01F — Stop / rollback rules

Stop rather than merge when:

- Preview quota/provider failure prevents rendered acceptance;
- selected state is ambiguous in either theme;
- country/filter logic hides valid matching routes;
- mobile has page-level overflow or unreadable metric density;
- repair requires a site-wide redesign or new product feature.

Rollback after release when a material production regression appears: revert the bounded visual-repair release while preserving the existing canonical/data contract.

---

## 5.5. Yesterday carryover — Q-013D4 CMLink admission

Status: **NEXT / MUST CLOSE BEFORE M-02**

Use existing PR #127 only. Do not add another route.

Checklist:

- [ ] re-read current PR #127 head/diff and CMLink validation record;
- [ ] confirm only intended CMLink Phone data changes remain;
- [ ] confirm current Eval Gate state;
- [ ] obtain PR #127's own current Vercel Preview;
- [ ] verify Data family desktop light/dark;
- [ ] verify Data family mobile light/dark;
- [ ] confirm CMLink remains `Watch` and data-only;
- [ ] confirm existing Airalo/Mobal cards and interactions are not regressed;
- [ ] merge only if rendered acceptance is clean;
- [ ] production-verify the apex after merge;
- [ ] update facts/queue before starting M-02.

---

## 6. Phase M-02 — AI Reset Radar visual closure

Status: **QUEUED AFTER Q-013D4 CARRYOVER**

No new Reset URL is created during this pass.

### M-02A — Cursor lead page

Current maintenance finding: the calculator works, but title/explanation/Quick answer content consumes too much of the first viewport before the actual reset input.

Checklist:

- [ ] preserve the existing canonical `/tools/cursor-usage-reset/`;
- [ ] preserve the current CTR title/meta pilot until clean GSC evidence says otherwise;
- [ ] move the primary interactive reset/usage object closer to the first viewport;
- [ ] demote/collapse supporting Quick answer material if needed instead of deleting useful facts;
- [ ] ensure the primary result/countdown is visually attached to the input;
- [ ] keep advanced quota/pool work measurement-gated under Q-015 rather than silently adding it during visual repair;
- [ ] verify empty/invalid/past timestamps and 0/100% edge states;
- [ ] verify save/copy/calendar/local-storage behavior if present;
- [ ] verify desktop/mobile + light/dark visually.

### M-02B — Existing Reset family consistency audit

Audit the existing pages without forcing them to become identical:

- [ ] Claude Code Limit Reset;
- [ ] GitHub Copilot Credits Reset;
- [ ] Manus Credits Reset;
- [ ] Replit Usage Reset;
- [ ] Bolt Tokens Reset;
- [ ] AI Credit Burn Rate Calculator.

For each page:

- [ ] primary input visible without unnecessary reading;
- [ ] primary result visually obvious;
- [ ] real known-value calculation/time interaction passes;
- [ ] invalid/missing input gives a useful bounded error;
- [ ] no stale duplicate canonical/link;
- [ ] dark state keeps contrast/action hierarchy;
- [ ] mobile has no horizontal overflow;
- [ ] explanation stays below or beside the tool instead of displacing it.

### M-02C — Reset release audit

- [ ] local tests/build;
- [ ] one bounded Reset visual-repair PR at a time;
- [ ] Eval Gate;
- [ ] real Vercel Preview;
- [ ] desktop/mobile light/dark acceptance;
- [ ] merge;
- [ ] apex-domain smoke test;
- [ ] GSC/GA4 measurement continues separately from visual completion.

---

## 7. Phase M-03 — Relay Exit Risk visual closure

Status: **QUEUED AFTER RESET VISUAL CLOSURE UNLESS A RELAY DEFECT BECOMES URGENT**

Current maintenance finding: primary input is discoverable and core metric cards are already more visual than Reset; the main bounded improvement is result proximity and empty-state clarity.

### M-03A — Visual maintenance

- [ ] keep the 0–100 Exit Risk Index definition unchanged;
- [ ] keep community prediction clearly separate from the total index;
- [ ] keep missing data lowering confidence rather than inventing neutral values;
- [ ] keep input/check action in the first viewport;
- [ ] move/compose primary result cards so the result appears with less unnecessary scrolling when practical;
- [ ] consolidate repetitive “no data yet” messages without hiding which evidence classes are absent;
- [ ] preserve visual separation of index, forecast and model-trust information;
- [ ] do not turn risk index into a probability claim.

### M-03B — Functional/data verification

- [ ] safe test domain produces a clear empty/low-evidence state;
- [ ] known stored relay, when available for audit, loads historical/public/community components correctly;
- [ ] no test community vote is submitted during smoke testing unless a clearly marked disposable test record is intentionally created and then removed;
- [ ] upstream/source/API failure is distinguishable from actual relay risk state;
- [ ] backend/API health remains separate from frontend visual acceptance;
- [ ] current methodology doc still matches the rendered semantics.

### M-03C — Preview and production audit

- [ ] desktop light/dark;
- [ ] mobile light/dark;
- [ ] input → result path;
- [ ] result cards do not overflow;
- [ ] empty state is concise and accurate;
- [ ] no probability/scam/shutdown wording regression;
- [ ] Eval Gate + Preview + production verification.

---

## 8. Phase M-04 — Existing utility regression + visual consistency audit

Status: **QUEUED AFTER THE THREE CORE SURFACES**

Goal: keep the existing small utilities trustworthy without turning them into a separate redesign program.

### Numerical/date utilities

For Percentage, Percentage Increase, Discount, Age and Date Difference:

- [ ] page returns 200;
- [ ] canonical is correct;
- [ ] known-value calculation is mathematically correct;
- [ ] invalid/empty input is handled;
- [ ] result is more visually prominent than explanation;
- [ ] mobile has no overflow;
- [ ] light/dark remain usable;
- [ ] no broken related-tool links.

### Image Resizer

- [ ] upload a real harmless JPG/PNG/WebP;
- [ ] original dimensions detected;
- [ ] aspect-ratio lock works;
- [ ] preset dimensions work;
- [ ] resize executes in browser;
- [ ] output dimensions match requested values;
- [ ] blob/download link appears;
- [ ] generated filename is sensible;
- [ ] max-output safety guard still works;
- [ ] no server upload is introduced.

### Image Compressor

- [ ] upload a real harmless image;
- [ ] original dimensions/size detected;
- [ ] quality control updates;
- [ ] max-width resizing works;
- [ ] JPG/WebP/PNG output selection works as designed;
- [ ] compression executes locally;
- [ ] blob/download link appears;
- [ ] output size and dimensions are reported accurately, including “larger” results when that actually occurs;
- [ ] no server upload is introduced.

### Utility change rule

If a utility passes the functional and visual audit, **do not redesign it merely for consistency**. Repair only concrete defects or high-friction hierarchy problems.

---

## 9. Phase M-05 — Cross-site visual system audit

Status: **QUEUED AFTER PAGE-LEVEL CLOSURE**

This is a consistency audit, not a new design-system project.

Check:

- [ ] H1 scale is proportionate to the tool surface;
- [ ] interactive object appears before long explanatory prose;
- [ ] primary button hierarchy is consistent in light/dark;
- [ ] cards/status/metrics use shared tokens rather than undefined aliases;
- [ ] selected states are visible by more than subtle text changes;
- [ ] mobile cards remain legible and tappable;
- [ ] no global CSS rule silently overrides page-specific component hierarchy;
- [ ] build generators do not regenerate stale CSS/HTML over a local repair;
- [ ] related links and navigation do not expose retired/broken URLs;
- [ ] site-wide theme cycling remains functional.

Do not migrate the production site to Astro merely to pass this audit.

---

## 10. Phase M-06 — Final release and production audit

Status: **QUEUED**

After Phone, Reset and Relay visual closure plus utility regression audit:

### Functional production audit

- [ ] all registered tool URLs return expected status;
- [ ] primary interaction on every tool works on production;
- [ ] no unexpected 404 from site-generated links;
- [ ] image upload/processing/download works in a real browser;
- [ ] no obvious client JS errors during the audit.

### Core visual production audit

For Phone / representative Reset / Relay:

- [ ] desktop light screenshot/check;
- [ ] desktop dark screenshot/check;
- [ ] mobile light screenshot/check;
- [ ] mobile dark screenshot/check;
- [ ] no horizontal overflow;
- [ ] primary input/task/result is visible promptly;
- [ ] detail prose does not dominate the first viewport.

### SEO/identity audit

- [ ] canonical URLs correct;
- [ ] sitemap contains active canonical URLs;
- [ ] no duplicate URL introduced by maintenance;
- [ ] title/meta unchanged unless a separately evidenced SEO task changed them;
- [ ] WebApplication/Breadcrumb/FAQ schema remains syntactically valid where used.

### Analytics audit

- [ ] key Phone family/filter/show-more/guide events preserved;
- [ ] Reset meaningful interaction events preserved;
- [ ] Relay check/forecast actions remain distinguishable;
- [ ] utility analytics do not capture file contents, token text, account identifiers or sensitive user input.

### Performance/accessibility audit

- [ ] keyboard can reach primary controls;
- [ ] labels/aria-live/selected states remain meaningful;
- [ ] visible focus is not removed;
- [ ] images/files remain browser-local;
- [ ] no large decorative asset is added merely for appearance;
- [ ] no obvious layout shift or blocking dependency is introduced by maintenance.

---

## 11. Measurement audit after visual closure

Visual completion and growth success are separate decisions.

### Phone

- continue collecting GSC/GA4 evidence after the visually accepted release;
- do not interpret zero impressions as a reason to add more routes/pages;
- if impressions appear without clicks, evaluate query/SERP match separately from UI;
- if clicks appear but interaction is weak, return to the visual/decision path before expanding inventory.

### Cursor / Reset

- evaluate the current Cursor CTR pilot only on clean post-change GSC dates;
- first decision at the documented clean-impression threshold;
- do not change title/meta just because the visual layout changes;
- use interaction analytics to determine whether users actually use the reset/planning controls.

### Relay

- measure real checks, repeat use, stored-history coverage and community prediction participation separately;
- do not claim calibration or shutdown probability without the required historical outcome data.

---

## 12. Daily maintenance checklist after closure

This is maintenance, not a feature backlog.

### Every project workday

- [ ] check production/core PR health before changing anything;
- [ ] inspect any new provider/build/API blocker and classify it correctly;
- [ ] run a quick production smoke on the three core surfaces if they changed or a user report indicates a problem;
- [ ] record meaningful completed work/blockers/triggers in the Daily Project Journal;
- [ ] write material accepted facts back to GitHub.

### Data/search cadence

- use GSC on the existing twice-weekly/trigger-based cadence while indexing is immature;
- do not churn pages between settled-data checkpoints;
- keep referral/social/AI/organic traffic interpretation separate.

### Phone source maintenance

- use existing bounded watcher/research flow;
- do not report watcher success/failure without the actual observer host evidence;
- route-data changes require current evidence and should wait behind unresolved frontend closure defects.

---

## 13. Audit record format

Every page-level audit should end with a compact record:

| Field | Required value |
|---|---|
| Surface | exact page/tool |
| Production URL | exact canonical |
| Version | PR/head or production commit |
| Functional | PASS / PARTIAL / FAIL |
| Desktop light | PASS / FAIL / NOT APPLICABLE |
| Desktop dark | PASS / FAIL / NOT APPLICABLE |
| Mobile light | PASS / FAIL / NOT APPLICABLE |
| Mobile dark | PASS / FAIL / NOT APPLICABLE |
| Data accuracy | PASS / HOLD / NOT APPLICABLE |
| Analytics | PASS / HOLD / NOT APPLICABLE |
| SEO identity | PASS / HOLD |
| Defects | concrete reproduced defects only |
| Release state | Draft / Preview / merged / production verified |
| Evidence | test, screenshot/browser observation, CI run, GSC/API source as applicable |
| Next action | one bounded next action or NONE |

A page with a FAIL must not be described as complete.

## 14. Global stop rules

Stop and record the blocker when:

- Vercel/provider quota prevents a required Preview;
- a change needs paid-service/billing/account-setting modification;
- the repair starts turning into a new product or backend system;
- the only justification is aesthetic preference without a user-task or reproduced hierarchy defect;
- a data claim cannot be supported without guessing;
- the task would require bypassing provider/platform limitations;
- the current bounded session cannot reach a useful verified checkpoint.

## 15. Overall execution sequence

The maintenance program runs in this order unless a production-critical defect overrides it:

1. **Phone Radar** — DONE: PR #130 visual + functional closure, release and production audit completed Sep 19.
2. **Yesterday carryover / CMLink PR #127** — close the already-validated single Data route through its own Preview and production verification.
3. **Cursor / AI Reset** — bounded visual closure of the lead page, then family consistency audit.
4. **Relay Exit Risk** — result-proximity/empty-state visual maintenance plus methodology/data audit.
5. **Existing utilities** — full real-input regression + visual consistency audit; repair only concrete defects.
6. **Cross-site visual audit** — shared hierarchy/theme/build-generator regression checks.
7. **Final production audit** — all registered tools, core visual states, SEO identity, analytics, accessibility.
8. **Measurement period** — GSC/GA4/user behavior decides future maintenance; do not reopen feature expansion automatically.

The desired end state is not “more features.” It is: **the current site works, looks intentional, communicates visually, survives production builds, and has auditable evidence that each existing tool actually works.**
