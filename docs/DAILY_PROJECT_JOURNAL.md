# Daily Project Journal

Google Docs document: `aineedhelpfromotherai — Daily Project Journal`

Document URL: https://docs.google.com/document/d/160WMF10T4yz8OoSXLjKCVar4i78gxG0tx3i1R6oCkn0/edit

Purpose: keep a human-readable chronological execution trail without creating a second source of truth.

GitHub `main` + verified production remains final truth. The journal records what was attempted and what actually happened during the day; it never chooses the roadmap or overrides canonical project state.

## Daily operating rhythm

Use one lightweight loop on every project workday.

### 1. Start / resume

- read the required GitHub startup chain;
- reconcile the current queue with verified live state;
- select one bounded session task;
- write a compact Session Card/checklist with deliverable, done condition, blockers and stop conditions.

### 2. Delegate where useful

When QwenPaw/Kimi or another approved project worker is available, delegate only work that benefits from parallel throughput, such as research discovery, source retrieval, provenance, structured field extraction, contradiction checks, dedupe, stale-fact rechecks and bounded data-batch preparation.

Record the delegation scope in the day's journal entry when it materially contributes to the work.

Delegated output is `RESEARCH CANDIDATE` by default. It does not become accepted project state merely because an agent returned it.

### 3. Execute and quality-control

- execute the selected bounded task;
- sample-audit delegated batches before broad admission;
- distinguish evidence from interpretation;
- persist accepted changes through the normal GitHub branch/PR path;
- verify tests, CI/Eval/Preview and production when applicable.

### 4. Persist project truth

Material accepted results must be written to the correct GitHub fact source in the same work round.

Examples:

- architecture/product rule → task-specific governing doc + checkpoint/plan when material;
- current task/trigger/blocker → `docs/CURRENT_EXECUTION_QUEUE.md`;
- material current-state change → `PROJECT_CONTEXT.md`;
- phase/priority/exit-gate change → `docs/MASTER_PLAN.md`;
- code/data → repository source + PR;
- outreach → `docs/AUTHORITY_AND_AI_DISCOVERY.md`;
- AI-retrieval benchmark → AIR docs.

### 5. Journal and close

Append one dated entry to the Google Doc containing what actually happened. Do not copy the entire GitHub state into the journal.

## Standard daily entry template

### YYYY-MM-DD — Workday entry

**Session task**
- one bounded task

**Checklist**
- planned action 1
- planned action 2
- planned verification

**Delegated work**
- worker/model:
- bounded assignment:
- result state: pending / rejected / candidate / accepted after review

**Completed**
- only verified completed work

**Verification**
- tests / CI / Preview / production / source checks / measurement evidence

**Failed / blocked / rolled back**
- exact issue and blocker class

**Unfinished**
- exact remaining state; do not imply completion

**Evidence state**
- latest relevant GSC/analytics date or threshold;
- current PR/CI/Preview state;
- external trigger/deadline if it controls the next action.

**Next-session task**
- exactly one first eligible task;
- trigger / definition of done / stop condition.

**Do not do**
- current actions prohibited by evidence, scope, quota, safety or architecture gates.

## End-of-day closeout rule

At the end of each project workday, the final journal entry must explicitly cover:

1. **Completed today** — only work that reached a verified stopping point, with PR/commit/issue/evidence references where available.
2. **Failed, blocked or rolled back** — exact reason and blocker class; do not blindly retry provider/quota/process failures.
3. **Current unfinished work** — open PRs/issues/tasks and their exact state.
4. **Evidence state** — latest settled GSC date, meaningful analytics thresholds, current Preview/CI state, and external deadlines controlling the next action.
5. **Tomorrow / next-session execution order** — first eligible action with trigger and stop condition.
6. **Do-not-do list** — actions that would violate current gates, waste quota, mix independent tasks, or prematurely change production.
7. **Handoff sentence** — where the project stands, what is blocked, and what unlocks the next production-affecting step.

## Rules

1. Record only work that actually happened. Do not turn speculative ideas into completed history.
2. Do not use the journal as a second roadmap, backlog, database or fact source.
3. Do not paste large raw Qwen/Kimi dumps into the journal. Record assignment, disposition and the durable GitHub destination instead.
4. Material accepted conclusions still go to GitHub in the same work round.
5. If the journal conflicts with GitHub/production, correct the journal; do not override GitHub.
6. Prefer one concise dated entry plus an end-of-day closeout over many fragmented status notes.

This replaced the writable Notion daily journal as of 2026-09-22. `docs/DAILY_NOTION_JOURNAL.md` remains historical only.


## 2026-09-29 — Workday entry

**Session task**
- Reconcile and migrate US batch-A only: Ultra Mobile PayGo, Tello PAYG credit and H2O PayGo.

**Completed**
- PR #282 passed identity/provenance reconciliation and migrated all three routes backstage.
- Confirmed `tello-us` monthly-plan and `tello-paygo-credit-2026` PAYG are distinct products.
- Corrected Tello PAYG to USD20 minimum web order / 90-day order-based expiry; corrected Ultra PayGo physical-SIM acquisition semantics; retained H2O PAYG as HOLD.
- Canonical reached 35 routes / 16 markets / 33 brands / 19 networks / 112 sources; comparison stayed 135 and explicit indexability stayed 3.

**Verification**
- `npm run phone:data:check` PASS; `npm run verify` PASS.
- CI #167 PASS; Eval Gate #900 PASS; Vercel Preview PASS.
- PR #282 squash-merged as `a72c05b58b708be8e0b22d8bbd3640c29637c1e3`; production deployment succeeded.
- Live Directory HTTP 200; Ultra/Tello/H2O standalone route URLs HTTP 404.

**Failed / blocked / rolled back**
- Root `npm test` still reflects unrelated retired live-API expectations (308/404); no unrelated repair was mixed into this Phone task.

**Unfinished**
- 111 comparison routes remain legacy-only; 161 of 233 current comparison route-source IDs remain absent from canonical sources.

**Next-session task**
- Reconcile `jp-directory-batch-b.json` identity/provenance before migration, especially Mobal/Sakura legacy IDs versus existing canonical products; keep povo HOLD unless evidence changes.

**Do not do**
- No bulk migration, publication expansion, schema redesign, or raw delegated admission.
