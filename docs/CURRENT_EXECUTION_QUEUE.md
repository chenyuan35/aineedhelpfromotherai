# Current Execution Queue

Last updated: 2026-09-18

This is the short atomic queue for `aineedhelpfromotherai.com`. `PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict.

## Current decision

The Phone workstream has entered a **product reset** after a user-facing review on 2026-09-18.

The existing public Phone page drifted from the intended job into a questionnaire/research-manual experience. The next Phone task is therefore **not another carrier audit and not an incremental UI patch**.

The durable reset checklist is:

- `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md`

Until that reset is accepted and implemented, route research remains an input, not the project milestone.

## Just completed

- **Q-001 Phone verification-continuity validation:** DONE via PR #81; verdict remains provisional **NARROW**, inside the existing Phone canonical only.
- **Q-002 Cursor answer-first CTR experiment:** SHIPPED / MEASURING via PR #82; pre-change Sep 13–14 baseline 141 settled impressions / 0 clicks.
- **Q-009 Homepage direct-help positioning:** SHIPPED / MEASURING via PR #84/#85/#87; `AI stopped? Start here.` + `home_job_select` live.
- **Q-011 historical cleanup:** DONE via PR #91/#93; stop broad cleanup.
- **Q-012 task-list-first + Notion journal workflow:** DONE.
- **Q-013 community-first Phone methodology reset:** DONE as a research-method correction. Current-route review covered giffgaff, Tello, Lebara UK, Sakura, Ultra PayGo and H2O PayGo; Sakura received the only immediate production correction. AIS remains HOLD.
- **Q-005 first Sep 18 authority check:** DONE / NO RESPONSE YET. Recheck Sep 20.
- **Phone UI patch PR #112:** CLOSED / NOT MERGED. Do not revive it.

## Current measurement facts

Last checked on 2026-09-18:

- GSC `settledThrough`: **2026-09-14**.
- Index tracker: **18 tracked / 9 indexed / 9 not indexed / 0 pending / 0 errors / 0 warnings**.
- Phone public release: **2026-09-16**.
- Phone canonical remained `URL is unknown to Google`; no technical indexing defect found.
- Early GA4 zeroes are not a negative verdict.
- Cursor pre-title-change baseline: **141 settled impressions / 0 clicks**.

## Trigger check before any new work

At the start of the next session, after mandatory fact-source reading:

1. If GSC `settledThrough >= 2026-09-16`, execute **Q-003** before Phone production implementation.
2. If the date is 2026-09-20 or later and Q-005 has not been rechecked, execute the second **Q-005** check before sending any follow-up or batch 2.
3. Otherwise execute **Q-014 Phone Radar product reset** below.

Do **not** automatically continue RedPocket, AIS or another carrier audit merely because the measurement triggers have not fired.

## Q-014 — Phone Radar product reset

Status: **ACTIVE — HIGHEST ELIGIBLE PHONE TASK**

Authoritative checklist:

1. `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md`
2. `docs/PHONE_RADAR_PRODUCT_DEFINITION.md`
3. `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md`

### Root correction

Phone Radar is a tool for helping a user **find, compare, open and keep a useful phone number**.

Internal research is backstage. The normal page must not require the user to understand evidence classes, source reconciliation, carrier research notes or the site's research methodology.

Community reality is the operational dataset: recent first-hand setup reports, SMS/OTP outcomes, keep-alive methods, failures, complaints, reversals, number recovery, support outcomes and current tutorials.

Public carrier pages are not a gate that validates whether a reproduced route is real. Missing public documentation must not automatically create a user-facing `unknown` state. Public price/product metadata may still be collected when useful, but it does not override real-world operating evidence.

### Q-014A — Freeze the wrong loop

- Pause provider-by-provider documentation completion as the default task.
- Pause RedPocket/AIS expansion unless it directly supports the redesigned decision surface.
- Do not incrementally patch the current questionnaire/manual UI.
- Keep one Phone canonical.

### Q-014B — Define the user-facing card contract

Before coding, define a route card around the user's actual decision:

- route/provider;
- number country/type;
- recent SMS/OTP reliability signal;
- real yearly keep-alive cost;
- setup difficulty;
- remote setup/location practicality;
- current stability/risk state;
- eSIM/physical SIM where relevant;
- freshness/status signal;
- `How to open`;
- `Get / Buy`.

No fake numeric SMS success rate. No arbitrary Phone risk score.

### Q-014C — Define the detail/tutorial contract

The detail layer should answer only what the user needs to execute the route:

1. what to buy;
2. what to prepare;
3. exact opening steps;
4. how to receive SMS/OTP;
5. how to keep the number alive;
6. main current pitfall;
7. recovery/number-continuity path;
8. purchase link;
9. useful current tutorial/video/community link when available.

Research provenance remains optional supporting detail, never the default reading path.

### Q-014D — Redesign the internal data model around outcomes

Make real-world events first-class data:

- setup success/failure;
- SMS/OTP success/failure;
- keep-alive success;
- number loss/recovery;
- refund/restoration/support resolution;
- cost observation;
- procedure/tutorial observation;
- route status over time.

This must be able to represent a route that was stable, degraded, triggered complaints, then recovered.

### Q-014E — Reclassify existing data

Separate current Phone fields into:

- user-facing decision data;
- backstage research data;
- obsolete fields created by the old documentation-first mindset.

Revisit `unknown` states that exist only because a public carrier page did not describe the behavior.

### Q-014F — Define the visual decision model before implementation

Create a product specification/wireframe for the existing Phone canonical with these constraints:

- concrete routes visible without completing a questionnaire;
- filters refine rather than gate access;
- route, SMS/OTP signal, yearly cost, setup difficulty and stability/risk dominate hierarchy;
- information density is balanced: no oversized controls and no cramped data wall;
- evidence/source detail is secondary/on-demand;
- mobile hierarchy is designed explicitly.

**Stop condition:** no production implementation until this interaction model is reviewed and accepted.

### Q-014G — Implement only after explicit authorization

When authorized, use fresh branch/worktree → tests → PR → CI/Eval/Vercel Preview → merge → production verify. Do not bulk-add providers as part of the redesign.

## Q-013 — Phone route research

Status: **HOLD AS DEFAULT NEXT ACTION**

Existing research remains useful input. It is not discarded.

- AIS Thailand: HOLD pending genuinely new evidence; do not keep polishing it.
- RedPocket US: candidate only; no automatic next-step audit while Q-014 is active.
- Other monitored candidates remain candidates, not permission to expand the catalog.

When route research resumes, organize it around user outcomes: recent setup success, SMS/OTP success/failure, current keep-alive cost, recovery/reissue, complaints, support outcomes and current tutorials.

## Q-003 — First real Phone post-release measurement

Status: **WAITING ON DATA TRIGGER — rechecked 2026-09-18**

Trigger: GSC `settledThrough >= 2026-09-16`.

When triggered:

1. inspect Phone indexing/last crawl;
2. inspect impressions/queries/clicks/CTR/average position;
3. inspect GA4 Phone landing/session and available Phone interactions;
4. use the data to inform Q-014, not to restore the old questionnaire/manual direction;
5. record the resulting product decision in GitHub.

Do not churn indexing submissions.

## Q-005 — Authority round-one follow-up

Status: **CHECKED 2026-09-18 — NO RESPONSE / NO VERIFIED LINK; RECHECK 2026-09-20**

Do not resend early or increase volume because round one is quiet.

## Q-004 — Cursor CTR readout

Status: **MEASURING**

Trigger: roughly 300–500 additional post-change impressions, unless an obvious defect appears.

## Q-010 — Distribution readout

Status: **MEASURING**

Keep social/referral separate from Google organic. Do not mass cross-post.

## Q-006 / Q-007 — Indexing + Phone watcher monitoring

Status: **EVENT-DRIVEN**

- Keep the existing index tracker cadence; no resubmission churn.
- Phone watcher/community output creates review inputs, never automatic production rewrites.
- Trial observer workload stays frozen.

## Q-008 — AI retrieval blockers

Status: **HOLD / BLOCKED**

Follow `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` in order. Do not bypass provider blockers or invent results.

## Anti-scope guard

Do **not** create:

- a fourth product surface;
- a second Phone canonical;
- provider/country/keyword doorway pages;
- a temporary-number/OTP marketplace;
- new account/email/SMS backends;
- new workloads on the resource-tight trial observer;
- paid SEO/data dependencies without approval;
- mass community posting or duplicated outreach;
- another Phone production redesign before Q-014F is accepted.

## Execution rule

Execute the highest-priority eligible action, verify it, record result/blocker/next trigger, then advance. For Phone, Q-014 product definition and interaction design now precede further implementation or provider expansion.
