# AGENTS.md — aineedhelpfromotherai

This repository's current mission is the low-cost utility site at `aineedhelpfromotherai.com`.

Before making changes:
1. Read the **Current progress checkpoint** at the top of `PROJECT_CONTEXT.md` first.
2. Read `docs/MASTER_PLAN.md` for the whole-project phase, current sprint and next task order.
3. Read `docs/OPERATING_WORKFLOW.md` for the execution loop.
4. Read `docs/CURRENT_EXECUTION_QUEUE.md` for the current atomic done/next/trigger queue after the three canonical planning sources above.
5. Inspect deeper repository/VPS/deployment state only when the current task requires it or the checkpoint is stale/contradictory.

`docs/CURRENT_EXECUTION_QUEUE.md` is an execution aid, not a competing source of truth. `PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts, project phase, priorities and exit gates. If the queue is stale or conflicts with those sources or verified production, update the queue before acting.

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
- Update the queue in the same round whenever an item completes, a blocker/trigger changes, or the next eligible task changes.
- Update the checkpoint after every material release, blocker, architecture change, or strategy change.
- Update `docs/MASTER_PLAN.md` when a phase, sprint task, exit gate, or priority materially changes.
- Do not stop after reporting a result when another eligible queued action exists; advance to the next eligible item unless a documented wait/block/scope gate applies.
- Do not waste a new session on a full-state rediscovery if these sources already answer the question.
