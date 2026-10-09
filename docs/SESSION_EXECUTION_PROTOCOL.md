# Session Execution Protocol — continuous ~30-minute work window

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

Each chat/session selects an **ordered set of independently bounded, eligible tasks** from the project queue. Target the user's requested roughly 30-minute continuous work window when practical. Close one task with verification and immediately proceed to the next safe, genuinely valuable queued task; never stop solely to say the next task is in the queue.

The session layer answers: **which verified tasks can be completed continuously in this conversation without relaxing review and release safety.**

Do not copy the entire project backlog into one session.

## Session-start rule

Before substantial tool calls, state a compact Session Card:

- **Session work queue** — one primary task plus subsequent eligible, bounded tasks in order;
- **Why now** — which current project priority/blocker it serves;
- **Deliverable** — concrete artifact, code change, audit result, decision, or verification expected by the end of this session;
- **Steps** — normally 3–5 bounded actions;
- **Parallel lane** — if the current queue explicitly defines an already-authorized delegated/background lane, name the worker and bounded backstage job; otherwise state none;
- **Write target** — for any GitHub mutation, name the non-`main` branch/worktree before the first write;
- **Definition of done** — observable completion condition per bounded task plus final combined audit;
- **Stop conditions** — blocker, authorization need, provider quota, missing evidence, or task proving too large for the remaining window.

If the task cannot reasonably be completed or brought to a clean verified checkpoint in one tool window, split it **before execution begins**.

## Parallel delegated-lane guardrail

The ordered-session-queue rule constrains production to one separately reviewed change gate at a time. It does **not** cancel an explicitly authorized parallel backstage lane already defined by `docs/CURRENT_EXECUTION_QUEUE.md` or the applicable operating plan.

At session start, after reading the queue, perform one explicit parallel-lane check:

1. if the queue says a delegated worker such as QwenPaw/Kimi should continue bounded backstage research, evidence acquisition, reconciliation, or another non-destructive task while the coordinator measures/waits/reviews, dispatch or verify that lane before calling the session complete;
2. if the delegated lane is already running, record its task/status and continue the coordinator's bounded main task without waiting for the worker unless its result is required for the current definition of done;
3. if the delegated lane is unavailable or blocked, record that fact explicitly instead of silently reverting to single-agent execution;
4. delegated output remains `RESEARCH CANDIDATE` by default and cannot change production, canonical admission, publication, roadmap, DNS, billing, account settings, or other protected state without normal coordinator review and release gates;
5. background delegation does not authorize a second coordinator roadmap task. The coordinating session still owns each bounded decision/release task sequentially.

A session that ignores an explicitly active parallel lane without recording a blocker is incomplete even if the coordinator's narrow measurement or review step succeeded.

## GitHub write-target guardrail

Before the first repository mutation in a session, verify the target branch/worktree explicitly. Normal project changes must never use `main` as the write target.

- Create or select the dedicated branch before any `create_file`, `update_file`, `delete_file`, commit, push, or equivalent mutation.
- Treat an omitted branch/ref on a write-capable GitHub action as unsafe unless the action is provably non-mutating.
- If an accidental direct-`main` write occurs, stop normal work, revert only that accidental mutation immediately, record the incident, then resume through a fresh branch/PR.
- Emergency cleanup of the coordinator's own accidental direct-`main` mutation is the only exception; it must restore prior content and must not bundle unrelated changes.

A session cannot be marked complete if it knowingly leaves an accidental direct-`main` mutation unreconciled.

## ~30-minute continuous execution budget

Target approximately 30 minutes of continuous useful execution when the environment makes it practical, rather than arbitrarily stopping after 5–10 minutes. This is a planning target, not a guarantee of exact wall-clock duration or a reason to manufacture work.

Default allocation:

1. **Early orientation**: read required fact sources and inspect the exact target;
2. **Continuous execution**: carry out each eligible task, including bounded source verification, safe fixes and complete release gates;
3. **Per-task verification**: tests, independent live checks and necessary GitHub fact updates before advancing;
4. **Final combined audit**: consolidate results and append the real workday journal once; identify only genuine remaining holds and triggers.

Do not interrupt a release while its required verification is in progress. Once that task is verified and closed, use remaining time for another genuinely eligible queue item; do not add changes merely to keep the session running.

A task may use less than the full window; its completion is a checkpoint, not an automatic conversation stop. End early only if all meaningful eligible work is exhausted or a real limit blocks further action.

## Scope discipline inside a session

A session may explicitly proceed from one completed task to a second eligible bounded task without seeking repeated confirmation. Each independent production change retains a distinct scope, branch/PR, validation and rollback boundary.

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

When the current task is complete, do not instruct the user to start a new conversation; continue the next safe eligible item in the current requested work window. Only hand off when work capacity is exhausted or further action requires external participation/authorization.

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
- preserve the ordered remaining task queue with clear triggers, done conditions and stop conditions, distinguishing genuine holds from available follow-up work;
- mark waiting/blocked work explicitly so the next session does not reinterpret it as eligible;
- do not carry obsolete temporary priorities forward merely because they appeared in an older chat or handoff document;
- when the selected task hits a real blocker, continue a separate eligible low-risk task only if its priority is already approved by the main execution queue; otherwise record the gate and stop rather than inventing work.
