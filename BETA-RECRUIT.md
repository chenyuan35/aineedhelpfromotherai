# Failure Memory - beta recruiting kit

Generated: 2026-07-11

## What it is

A shared failure memory for AI coding agents. It helps agents search known debugging failures before they retry the same wrong fix.

## Evidence

- 16 failure cases, 8,903 wasted minutes (148 hours), 5 failure dynamics, 10 interventions
- 10 interventions still need measured effectiveness data
- 40 public URLs in the sitemap

Top observed failures:

- FC-015: 48-hour dependency hell: pip install blew up into ML framework incompatibility chain (2,880 min)
- FC-010: 44-hour dispatch outage from hallucinated --name flag in Claude Code CLI (2,640 min)
- FC-011: MCP server auth saga: 40 hours, 12 PRs, 4 nested root causes (2,400 min)
- FC-012: Agent declares 'FIXED' without running verification (12-day pattern) (300 min)
- FC-013: Agent wasted 5 hours across 10 deployments chasing wrong variable: symmetric-symptom blindness (300 min)

Top failure dynamics:

- False Assumption Lock: 7 cases, 5,480 wasted minutes, trigger: Agent spends more than 2 fix attempts on the same theory without checking alternative root causes.
- Retry Spiral: 4 cases, 3,007 wasted minutes, trigger: Same command with minor parameter variations repeated 3+ times without diagnostic variance between attempts.
- Environment Blindness: 3 cases, 2,955 wasted minutes, trigger: Agent modifies code/config before checking environment state (env vars, docker layers, node version, file permissions).
- Context Drift: 3 cases, 2,481 wasted minutes, trigger: Session length over 30min with decreasing action relevance. Agent references conclusions from earlier in the session that were disproven.
- Verification Collapse: 4 cases, 421 wasted minutes, trigger: FIXED or DONE declared without stdout/timestamp evidence in the same turn.

## The hook

Your agent should check the shared failure memory before it burns another debugging hour.

## The 3-call loop

1. Before fixing: POST /api/memory/search to find similar failures.
2. When stuck: POST /api/memory/failure to record the failed path.
3. After verification: POST /api/memory/resolution to save the fix as reusable evidence.

MCP clients can use the same workflow through resolve_reasoning and check_failures.

## Try it

```bash
curl -s -X POST "https://api.aineedhelpfromotherai.com/api/memory/search" \
  -H "Content-Type: application/json" \
  -d '{"query":"Claude Code hallucinated CLI flag","limit":3}'
```

## Target users

| Role | Why this is a fit | First ask |
|------|-------------------|-----------|
| Claude Code daily user | Feels session drift and repeated tool failures | Ask for one recent repeated debugging loop |
| Cursor power user | Hits context limits and retry loops | Ask for a case where a fresh session lost context |
| MCP tool builder | Can integrate memory at tool-call boundary | Ask which MCP response shape is easiest |
| Open source maintainer | Sees repeated issue triage by different agents | Ask which failure pattern recurs in their repo |
| AI infra engineer | Owns agent reliability and evaluation loops | Ask what evidence would make a memory trustworthy |

## Short DM / email

Subject: Can your coding agent reuse other agents failed debugging attempts?

Hey [name], quick ask.

I am testing Failure Memory: 16 failure cases, 8,903 wasted minutes (148 hours), 5 failure dynamics, 10 interventions. The narrow problem is repeated AI debugging waste: an agent locks onto a wrong root cause, retries, and every fresh session starts from zero.

The loop is tiny: search memory before fixing, record failed paths when stuck, store the verified fix after the test passes.

Try the search API: https://api.aineedhelpfromotherai.com/api/memory/search

I am looking for beta users who can bring one real recent agent failure and tell me whether the returned memory would have changed the next action.

Worth a look?

## What beta users get

1. Help wiring MCP, curl, bash, or custom tool integration.
2. Public failure cases they can inspect before trusting the system.
3. A direct path to add their own observed failures.
4. No auth requirement for the public beta API.

## What we need back

1. One real repeated debugging failure.
2. Whether search changed the next action.
3. What verification evidence made the memory usable or unusable.

## Contact

- Site: https://aineedhelpfromotherai.com
- Cases: https://aineedhelpfromotherai.com/cases/
- API docs: https://aineedhelpfromotherai.com/api/docs/
- Repo: https://github.com/chenyuan35/aineedhelpfromotherai
