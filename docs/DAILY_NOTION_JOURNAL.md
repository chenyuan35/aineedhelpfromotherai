# Daily Notion Journal

Notion page: `aineedhelpfromotherai — Daily Project Journal`

Page URL: https://app.notion.com/p/3ded3b5659b08191b90df67a6548cca4?pvs=204

Purpose: keep a human-readable chronological execution trail without creating a second source of truth.

Rules:

1. Before non-trivial project work, form a bounded task checklist.
2. Execute eligible checklist items continuously; do not stop after each item for narration or confirmation unless authorization/risk materially requires it.
3. On each project workday, append one dated Notion journal entry covering the checklist, actual completed work, verification evidence, blockers/holds, and next trigger.
4. Record only work that actually happened. Do not turn speculative ideas into completed history.
5. GitHub `main` plus verified production remains final truth. If Notion conflicts with GitHub/production, fix the Notion journal rather than treating it as authoritative.
6. Material releases, blockers, strategy/architecture changes, outreach actions and provider-test results must still be written to their canonical GitHub fact sources in the same work round.
7. Notion is a readable development diary and traceability aid, not the execution queue or roadmap.

## End-of-day closeout rule

At the end of each project workday, append one explicit closeout section to the Notion journal. The closeout must be usable by a new executor without relying on chat history and should contain:

1. **Completed today** — only work that actually reached a verified stopping point, with PR/commit/issue/evidence references where available.
2. **Failed, blocked or rolled back** — what did not complete, the exact reason, whether it is a code defect, provider/quota blocker, data wait gate or process mistake, and what must not be retried blindly.
3. **Current unfinished work** — open PRs/issues/tasks and their exact state, especially whether they are Draft, unmerged, unreleased or awaiting visual/data verification.
4. **Evidence state** — latest settled GSC date, meaningful analytics/sample thresholds, current Preview/CI status, and any external deadline that controls the next action.
5. **Tomorrow / next-session execution order** — the first eligible actions in priority order, each with its trigger and stop condition. Do not write a generic backlog; write what the next executor should actually check first.
6. **Do-not-do list** — actions that would violate the current gate, waste quota, mix independent tasks, or prematurely change production.
7. **Handoff sentence** — a one-paragraph summary of where the project stands, what is blocked, and what event unlocks the next production-affecting step.

The daily closeout does not replace `PROJECT_CONTEXT.md`, `docs/MASTER_PLAN.md`, or `docs/CURRENT_EXECUTION_QUEUE.md`. If the closeout reveals a material current-state change, blocker, priority change or release result, update the relevant canonical GitHub fact source in the same work round before considering the day closed.
