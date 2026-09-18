# Session Execution Protocol — 25-minute work window

Last updated: 2026-09-18

This document governs **conversation/session-level execution** for `aineedhelpfromotherai.com`. It does not replace project planning or project facts.

## Two planning layers

### Project layer

Authoritative project direction stays in GitHub:

- `PROJECT_CONTEXT.md` — current facts and live state;
- `docs/MASTER_PLAN.md` — phases, priorities, exit gates and whole-project direction;
- `docs/CURRENT_EXECUTION_QUEUE.md` — ordered project tasks;
- task-specific methodology/specification documents — durable product rules.

These answer: **what the site is trying to achieve, what is true now, and what work exists overall.**

### Session layer

Each chat/session selects **one bounded task** from the project queue that can realistically reach a useful stopping point inside one roughly 25-minute tool-use window.

The session layer answers: **what exactly will be completed in this conversation.**

Do not copy the entire project backlog into one session.

## Session-start rule

Before substantial tool calls, state a compact Session Card:

- **Session task** — one task only;
- **Why now** — which current project priority/blocker it serves;
- **Deliverable** — concrete artifact, code change, audit result, decision, or verification expected by the end of this session;
- **Steps** — normally 3–5 bounded actions;
- **Definition of done** — observable completion condition;
- **Stop conditions** — blocker, authorization need, provider quota, missing evidence, or task proving too large for the remaining window.

If the task cannot reasonably be completed or brought to a clean verified checkpoint in one tool window, split it **before execution begins**.

## 25-minute planning budget

Treat the practical tool window as approximately 25 minutes.

Default allocation:

1. **0–4 min — orient**: read only the required fact sources and inspect the exact target;
2. **4–17 min — execute**: perform the bounded research/change;
3. **17–22 min — verify**: tests, browser/live check, diff review, or source cross-check;
4. **22–25 min — persist and hand off**: update the correct fact/task source and state the next session task.

Do not start a new independent subtask once the session has entered verification/handoff.

A task may use less than the full window. Finishing early is preferred to expanding scope.

## Scope discipline inside a session

A session must not silently expand from one task into several adjacent tasks.

Examples:

- Frontend audit session: audit and create the defect queue; do not also redesign and deploy the homepage.
- Homepage repair session: repair and verify homepage only; do not also rebuild Phone and Relay.
- Relay repair session: repair one accepted Relay defect batch; do not also add new Relay features.
- Data-route research session: validate one exact route; do not also publish multiple routes.

If an adjacent issue is discovered, add it to the project/session queue and leave it for a later session unless it blocks the current task's definition of done.

## Completion labels

Every session ends with exactly one of these statuses:

- **COMPLETE** — definition of done was met and verified;
- **BLOCKED** — a real external/authorization/evidence blocker prevents completion;
- **SPLIT** — the task was larger than one window and has been decomposed into explicit next-session work;
- **FAILED** — execution did not produce the required result; record the failure reason rather than claiming completion.

Never call a task complete merely because code was written, a PR opened, or CI passed. Product-facing tasks require the user-visible acceptance criteria defined for that task.

## Handoff rule

At session end, provide:

- what changed or was learned;
- verification evidence;
- unresolved items;
- **one recommended next-session task**.

When the current session task is complete, explicitly say that the next independent task should begin in a **new conversation/session** rather than continuing to accumulate work in the current one.

## Plugin role

A task-management plugin such as TickTick may be used as a **session execution board** for the current 25-minute task and its checklist.

It is not a project fact source and must not replace GitHub.

Recommended structure in the task manager:

- project/list: `aineedhelpfromotherai — Session Work`;
- one active task per chat session;
- checklist mirrors the Session Card steps;
- title format: `S-YYYYMMDD-NN — <bounded task>`;
- completed session tasks may be archived/closed;
- long-term roadmap items stay in GitHub, not duplicated into the task manager.

## Current correction after 2026-09-18 frontend review

The previous workflow allowed too many adjacent tasks to be attempted in one conversation and treated technical completion as product completion too readily.

Until the current frontend closure pass is complete:

- do not add new product features or new Phone routes;
- do not call Phone, Reset, Relay, homepage, or Tools visually/product-complete based only on CI/PR state;
- use separate sessions for audit, homepage closure, Phone closure, Reset closure, Relay closure, Tools/navigation closure, mobile QA, and final production verification;
- each of those sessions must have its own definition of done and visible-production verification where applicable.
