# Daily Project Journal

Google Docs document: `aineedhelpfromotherai — Daily Project Journal`

Document URL: https://docs.google.com/document/d/160WMF10T4yz8OoSXLjKCVar4i78gxG0tx3i1R6oCkn0/edit

Purpose: keep a human-readable chronological execution trail without creating a second source of truth.

Rules:

1. Before non-trivial project work, form a bounded task checklist.
2. Execute eligible checklist items continuously; stop only for authorization, irreversible risk, a real blocker/wait gate, or completion.
3. On each project workday, append one dated Google Docs journal entry covering the checklist, actual completed work, verification evidence, blockers/holds, and next trigger.
4. Record only work that actually happened. Do not turn speculative ideas into completed history.
5. GitHub `main` plus verified production remains final truth. If the journal conflicts with GitHub/production, correct the journal rather than treating it as authoritative.
6. Material releases, blockers, strategy/architecture changes, outreach actions and provider-test results must still be written to their canonical GitHub fact sources in the same work round.
7. Google Docs is a readable development diary and traceability aid, not the execution queue or roadmap.

## End-of-day closeout rule

At the end of each project workday, append one explicit closeout section containing:

1. **Completed today** — only work that reached a verified stopping point, with PR/commit/issue/evidence references where available.
2. **Failed, blocked or rolled back** — exact reason and blocker class; do not blindly retry provider/quota/process failures.
3. **Current unfinished work** — open PRs/issues/tasks and their exact state.
4. **Evidence state** — latest settled GSC date, meaningful analytics thresholds, current Preview/CI state, and external deadlines controlling the next action.
5. **Tomorrow / next-session execution order** — first eligible actions with trigger and stop condition.
6. **Do-not-do list** — actions that would violate current gates, waste quota, mix independent tasks, or prematurely change production.
7. **Handoff sentence** — where the project stands, what is blocked, and what unlocks the next production-affecting step.

This replaces the writable Notion daily journal as of 2026-09-22. `docs/DAILY_NOTION_JOURNAL.md` remains historical only.
