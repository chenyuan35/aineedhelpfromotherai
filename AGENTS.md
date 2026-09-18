# AGENTS.md — aineedhelpfromotherai

This repository's current mission is the low-cost utility site at `aineedhelpfromotherai.com`.

Before making changes:
1. Read the **Current progress checkpoint** at the top of `PROJECT_CONTEXT.md` first.
2. Read `docs/MASTER_PLAN.md` for the whole-project phase, current sprint and next task order.
3. Read `docs/OPERATING_WORKFLOW.md` for the execution loop.
4. Read `docs/CURRENT_EXECUTION_QUEUE.md` for the current atomic done/next/trigger queue after the three canonical planning sources above.
5. Read `docs/SESSION_EXECUTION_PROTOCOL.md` and select exactly one bounded session task that can reach a useful verified stopping point inside the practical ~25-minute tool window.
6. Inspect deeper repository/VPS/deployment state only when the current task requires it or the checkpoint is stale/contradictory.

`docs/CURRENT_EXECUTION_QUEUE.md` is an execution aid, not a competing source of truth. `PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts, project phase, priorities and exit gates. If the queue is stale or conflicts with those sources or verified production, update the queue before acting.

Execution cadence: before any non-trivial work round, form a bounded Session Card and checklist under `docs/SESSION_EXECUTION_PROTOCOL.md`. One chat/session should normally carry one bounded task, not the whole project backlog. Split work before execution if it cannot reasonably reach a useful verified checkpoint inside the practical ~25-minute tool window. Then execute the eligible checklist continuously instead of waiting for item-by-item confirmation unless authorization, irreversible risk, or a documented blocker requires a stop. On each project workday, append the actual checklist/results/verification/blockers/next trigger to the Notion page `aineedhelpfromotherai — Daily Project Journal` as a human-readable diary. GitHub `main` plus verified production remains authoritative.

Automation policy: do not create ChatGPT scheduled/recurring tasks for ordinary project research, measurement, follow-up, or monitoring. Prefer the project's existing VPS observers/watchers, connected plugins, and immediate/manual checks. The user-designated phone-number research watcher is the only fixed recurring project automation; other limited ChatGPT task slots are disposable and may be replaced when needed rather than treated as permanent infrastructure. Create or repurpose another ChatGPT automation only when the user explicitly asks for one.

Core rule: optimize for organic traffic, indexing, CTR, repeat utility, page speed, and sustainable AdSense revenue. Prefer useful browser-only tools with real search demand and negligible per-user cost.

Interpretation rule: treat rough ideas, copied prompts, screenshots, competitor examples, and “for reference” material as signals to analyze, not automatic authorization to build or change production. Convert them into product judgment—problem, stage fit, alternatives, cost/maintenance/risk, and the smallest useful validation—before acting. Ask only when missing information would materially change direction, risk, cost, or an irreversible action.

Do not revive the historical AI-debugging SaaS direction unless the user explicitly changes the project goal.

Development constraints:
- GitHub `main` is code source of truth.
- Never modify/reset the dirty production worktree.
- Use a dedicated branch/fresh worktree.
- Test before merge; require preview/CI success and production verification.
- Never commit or print secrets.
- Do not alter paid services, AdSense/account settings, domain/DNS, or delete important data without explicit approval.
- Never touch the unrelated `hermes` machine for this project.
- `yuan` is the user's personal workstation, not a website/project execution host. Never run site services, monitoring, crawlers, deployments, backups, scheduled jobs, or persistent project data there. A one-off user-authorized device/login action is allowed only when unavoidable; project operation must not depend on it.
- Treat trial/ephemeral VPS hosts as disposable observer nodes unless explicitly promoted after review. Do not place production dependencies or unique durable data on them, and move any valuable summaries off-host before expiry.

Research constraints:
- Validate topics with real signals; do not invent volume/CPC/difficulty.
- Ubersuggest is preferred when available; autocomplete, public discussions, official docs, and Search Console are valid complementary evidence.
- One distinct useful page per intent; avoid scaled thin/duplicate pages.

Handoff constraint:
- Treat the checkpoint in `PROJECT_CONTEXT.md` as the resume point and `docs/MASTER_PLAN.md` as the total progress/task board, not chat memory.
- Treat `docs/CURRENT_EXECUTION_QUEUE.md` as the short atomic work queue: what just finished, what is next, what trigger/blocker controls it, and what must not be done yet.
- Treat `docs/SESSION_EXECUTION_PROTOCOL.md` as the per-chat execution contract: one bounded task, definition of done, stop conditions and next-session handoff.
- Update the queue in the same round whenever an item completes, a blocker/trigger changes, or the next eligible task changes.
- Update the checkpoint after every material release, blocker, architecture change, or strategy change.
- Update `docs/MASTER_PLAN.md` when a phase, sprint task, exit gate, or priority materially changes.
- Do not silently start a second independent task after the current session task reaches its definition of done. Close the session cleanly and move the next independent task to a new conversation.
- Do not waste a new session on a full-state rediscovery if these sources already answer the question.
