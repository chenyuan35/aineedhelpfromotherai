---
title: "I Built a Failure Memory for AI Coding Agents"
published: false
tags: mcp, ai, debugging, opensource
description: "A small MCP and REST memory loop built from real AI debugging failures, root causes, and interventions."
---

## TL;DR

I built Failure Memory for AI coding agents: https://aineedhelpfromotherai.com

It currently tracks 21 observed debugging failures, 9,043 wasted minutes, 5 recurring failure dynamics, and 10 interventions that still need measured effectiveness data.

The idea is simple: before an agent retries a plausible fix, it should search prior failures and check whether another agent already wasted time on the same wrong assumption.

## The problem

AI coding agents often fail in recognizable ways:

- They lock onto the first plausible root cause.
- They retry the same command with tiny variations.
- They declare success without running verification.
- They debug against an imagined environment instead of the real runtime.
- They lose the original problem shape across long sessions.

These are not abstract concerns. They show up as real minutes lost.

## Current evidence

- False Assumption Lock: 7 cases, 5,480 wasted minutes, trigger: Agent spends more than 2 fix attempts on the same theory without checking alternative root causes.
- Retry Spiral: 4 cases, 3,007 wasted minutes, trigger: Same command with minor parameter variations repeated 3+ times without diagnostic variance between attempts.
- Environment Blindness: 3 cases, 2,955 wasted minutes, trigger: Agent modifies code/config before checking environment state (env vars, docker layers, node version, file permissions).
- Context Drift: 3 cases, 2,481 wasted minutes, trigger: Session length over 30min with decreasing action relevance. Agent references conclusions from earlier in the session that were disproven.
- Verification Collapse: 4 cases, 421 wasted minutes, trigger: FIXED or DONE declared without stdout/timestamp evidence in the same turn.

The case library includes failures like:

- FC-015: 48-hour dependency hell: pip install blew up into ML framework incompatibility chain (2,880 min)
- FC-010: 44-hour dispatch outage from hallucinated --name flag in Claude Code CLI (2,640 min)
- FC-011: MCP server auth saga: 40 hours, 12 PRs, 4 nested root causes (2,400 min)
- FC-012: Agent declares 'FIXED' without running verification (12-day pattern) (300 min)
- FC-013: Agent wasted 5 hours across 10 deployments chasing wrong variable: symmetric-symptom blindness (300 min)

## The product surface

Failure Memory exposes a narrow loop:

1. Search memory before debugging from scratch.
2. Check known failure risks before applying a fix.
3. Store verified fixes with evidence after the test passes.

REST example:

```bash
curl -s -X POST "https://api.aineedhelpfromotherai.com/api/memory/search" \
  -H "Content-Type: application/json" \
  -d '{"query":"npm install retry spiral ECONNRESET","limit":3}'
```

MCP clients can use the same idea through the public MCP endpoint:

```json
{
  "mcpServers": {
    "aineedhelpfromotherai": {
      "url": "https://api.aineedhelpfromotherai.com/mcp",
      "type": "streamable-http"
    }
  }
}
```

## What changed on the site

The public frontend now focuses on the actual research question instead of a broad agent platform:

- https://aineedhelpfromotherai.com/cases/ shows the case library and intervention map.
- https://aineedhelpfromotherai.com/stats/ shows live memory and activity stats.
- https://aineedhelpfromotherai.com/api/docs/ gives the integration surface.

## What I want to learn next

The open question is not whether agents should have more memory. It is which specific memory checks reduce debugging time waste.

If you use Claude Code, Cursor, Windsurf, OpenCode, Codex-style agents, or an MCP-compatible coding runtime, I am looking for beta users who can bring one real recent failure and test whether the memory changes the next action.

GitHub: https://github.com/chenyuan35/aineedhelpfromotherai
