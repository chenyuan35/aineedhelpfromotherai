# Infrastructure Reference — Current pointer

The detailed infrastructure snapshot that used to live here was last accurate on **2026-06-10** and described Render as the active backend path. It is historical and must not be used as the current production runbook.

Current infrastructure facts are maintained in `PROJECT_CONTEXT.md` and the task-specific operations docs.

As of 2026-09-17:

- GitHub `main` is the code source of truth.
- Vercel serves the static frontend from `frontend/dist`.
- `vercel.json` proxies current `/api/*` traffic to `https://api-tunnel.aineedhelpfromotherai.com/api/*`.
- The historical Express/PostgreSQL runtime remains only because Relay Exit Risk still depends on backend state/API behavior.
- Relay lifecycle collection/history uses the documented VPS/observer workflow; temporary observer machines are disposable and must not hold unique durable state.
- The user's personal `yuan` computer is not project infrastructure.
- Do not change DNS, billing, AdSense, or critical account settings without explicit authorization.
- Never reset/discard/overwrite a dirty production worktree; use fresh branch/worktree → tests → PR → CI/preview → merge, and fast-forward backend runtime only when required.

For current operational state read:

1. `AGENTS.md`
2. `PROJECT_CONTEXT.md`
3. `docs/MASTER_PLAN.md`
4. `docs/OPERATING_WORKFLOW.md`
5. `docs/CURRENT_EXECUTION_QUEUE.md`

Historical infrastructure details remain recoverable from Git history before 2026-09-17.
