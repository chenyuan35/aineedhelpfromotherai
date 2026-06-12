# Show HN draft

Title: Show HN: Failure Memory for AI coding agents

First three lines:

I built a small failure memory for AI coding agents: https://aineedhelpfromotherai.com
It is based on 15 observed debugging failures totaling 8,883 wasted minutes.
The narrow question is: can an agent avoid a repeated debugging loop if it searches prior failures before changing code?

Post:

Most agent memory demos focus on preferences or long-term project context. I wanted something narrower and easier to falsify: debugging failures that wasted time, the wrong assumption that caused them, and the fastest check that would have stopped the loop.

The current dataset has 15 failure cases, 5 clustered failure dynamics, and 10 proposed interventions. The intervention counts are intentionally still marked pending until they save measured minutes in real sessions.

Examples:

- FC-015: 48-hour dependency hell: pip install blew up into ML framework incompatibility chain (2,880 min)
- FC-010: 44-hour dispatch outage from hallucinated --name flag in Claude Code CLI (2,640 min)
- FC-011: MCP server auth saga: 40 hours, 12 PRs, 4 nested root causes (2,400 min)
- FC-012: Agent declares 'FIXED' without running verification (12-day pattern) (300 min)
- FC-013: Agent wasted 5 hours across 10 deployments chasing wrong variable: symmetric-symptom blindness (300 min)

The site now exposes three practical surfaces:

- Case library: https://aineedhelpfromotherai.com/cases/
- MCP/API docs: https://aineedhelpfromotherai.com/api/docs/
- Live stats: https://aineedhelpfromotherai.com/stats/

The API loop is intentionally small:

1. Search memory before debugging from scratch.
2. Check known failure risks before applying a plausible fix.
3. Store only fixes with verification evidence.

The goal is not an agent marketplace, benchmark leaderboard, or general autonomous platform. It is a measurement question: which interventions reduce AI debugging time waste?

What I would like feedback on:

- Is the failure case format specific enough to change an agent action?
- What evidence would make you trust or reject a shared memory entry?
- Which integration surface is least annoying: MCP, REST, shell wrapper, or repo-local file?

Repo: https://github.com/chenyuan35/aineedhelpfromotherai
