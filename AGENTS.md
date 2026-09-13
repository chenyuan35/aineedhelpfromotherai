# AGENTS.md — aineedhelpfromotherai

This repository's current mission is the low-cost utility site at `aineedhelpfromotherai.com`.

Before making changes, read:
1. `PROJECT_CONTEXT.md` — durable source of truth, architecture, priorities, safety boundaries.
2. `docs/OPERATING_WORKFLOW.md` — research → build → test → PR → deploy → measure loop.

Core rule: optimize for organic traffic, indexing, CTR, repeat utility, page speed, and sustainable AdSense revenue. Prefer useful browser-only tools with real search demand and negligible per-user cost.

Do not revive the historical AI-debugging SaaS direction unless the user explicitly changes the project goal.

Development constraints:
- GitHub `main` is code source of truth.
- Never modify/reset the dirty production worktree.
- Use a dedicated branch/fresh worktree.
- Test before merge; require preview/CI success and production verification.
- Never commit or print secrets.
- Do not alter paid services, AdSense/account settings, domain/DNS, or delete important data without explicit approval.
- Never touch the unrelated `hermes` machine for this project.

Research constraints:
- Validate topics with real signals; do not invent volume/CPC/difficulty.
- Ubersuggest is preferred when available; autocomplete, public discussions, official docs, and Search Console are valid complementary evidence.
- One distinct useful page per intent; avoid scaled thin/duplicate pages.
