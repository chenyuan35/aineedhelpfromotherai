# Session Execution Protocol — 25-minute work window

Last updated: 2026-09-29

This document governs **conversation/session-level execution** for `aineedhelpfromotherai.com`. It does not replace project planning or project facts.

Before selecting a session task, the new conversation must already have read GitHub `main` in this exact order: `AGENTS.md` → `PROJECT_CONTEXT.md` checkpoint → `docs/MASTER_PLAN.md` → `docs/OPERATING_WORKFLOW.md` → `docs/CURRENT_EXECUTION_QUEUE.md` → this file. Previous assistant summaries, chat handoffs and historical `SESSION_HANDOFF_*` files cannot override that chain.

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
- **Parallel lane** — if the current queue explicitly defines an already-authorized delegated/background lane, name the worker and bounded backstage job; otherwise state none;
- **Write target** — for any GitHub mutation, name the non-`main` branch/worktree before the first write;
- **Definition of done** — observable completion condition;
- **Stop conditions** — blocker, authorization need, provider quota, missing evidence, or task proving too large for the remaining window.

If the task cannot reasonably be completed or brought to a clean verified checkpoint in one tool window, split it **before execution begins**.

## Parallel delegated-lane guardrail

The one-session-task rule constrains the coordinating session's decision and production scope. It does **not** cancel an explicitly authorized parallel backstage lane already defined by `docs/CURRENT_EXECUTION_QUEUE.md` or the applicable operating plan.

At session start, after reading the queue, perform one explicit parallel-lane check:

1. if the queue says a delegated worker such as QwenPaw/Kimi should continue bounded backstage research, evidence acquisition, reconciliation, or another non-destructive task while the coordinator measures/waits/reviews, dispatch or verify that lane before calling the session complete;
2. if the delegated lane is already running, record its task/status and continue the coordinator's bounded main task without waiting for the worker unless its result is required for the current definition of done;
3. if the delegated lane is unavailable or blocked, record that fact explicitly instead of silently reverting to single-agent execution;
4. delegated output remains `RESEARCH CANDIDATE` by default and cannot change production, canonical admission, publication, roadmap, DNS, billing, account settings, or other protected state without normal coordinator review and release gates;
5. background delegation does not authorize a second coordinator roadmap task. The coordinating session still owns exactly one bounded decision/release task.

A session that ignores an explicitly active parallel lane without recording a blocker is incomplete even if the coordinator's narrow measurement or review step succeeded.

## GitHub write-target guardrail

Before the first repository mutation in a session, verify the target branch/worktree explicitly. Normal project changes must never use `main` as the write target.

- Create or select the dedicated branch before any `create_file`, `update_file`, `delete_file`, commit, push, or equivalent mutation.
- Treat an omitted branch/ref on a write-capable GitHub action as unsafe unless the action is provably non-mutating.
- If an accidental direct-`main` write occurs, stop normal work, revert only that accidental mutation immediately, record the incident, then resume through a fresh branch/PR.
- Emergency cleanup of the coordinator's own accidental direct-`main` mutation is the only exception; it must restore prior content and must not bundle unrelated changes.

A session cannot be marked complete if it knowingly leaves an accidental direct-`main` mutation unreconciled.

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

## Durable handoff discipline

Temporary phase-specific rules do not belong here once that phase has ended. Current priorities and blockers live in `PROJECT_CONTEXT.md`, `docs/MASTER_PLAN.md` and `docs/CURRENT_EXECUTION_QUEUE.md`.

At handoff:

- persist material facts/blocker changes to the canonical GitHub source in the same work round;
- leave exactly one recommended next-session task in the queue, with its trigger, done condition and stop conditions;
- mark waiting/blocked work explicitly so the next session does not reinterpret it as eligible;
- do not carry obsolete temporary priorities forward merely because they appeared in an older chat or handoff document;
- do not silently switch to a different roadmap task when the selected task hits a real blocker unless the current queue explicitly defines that fallback as eligible.
