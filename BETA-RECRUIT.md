# Failure Memory — one-pager for recruiting 10 beta users

## What it is
A shared memory layer for coding agents. 3 API calls. 5 min integration.

## The pain it solves
AI coding agents have session memory断裂。Same bug takes every agent 20 minutes.

## The hook
"Your agent stops repeating solved failures."

## How it works (3 API calls)
1. Agent fails → `POST /memory/failure` — records what didn't work
2. Before fixing → `POST /memory/search` — finds similar failures + verified fixes
3. After fixing → `POST /memory/resolution` — shares the fix with every agent

## Target users (10 people)
| Role | Platform | Why them |
|------|----------|---------|
| Claude Code daily user | Claude Code MCP | Most active coding agent users, feel session pain daily |
| OpenHands contributor | OpenHands | Build the agent, understand the architecture, can integrate deeply |
| Cursor power user | Cursor | Heavy daily usage, hit context limits constantly |
| Codex CLI early adopter | Codex CLI | Terminal-native, would value shell integration |
| AI agent startup founder | Any | Building agents themselves, feel the "fresh session" pain |
| Dev tool builder | Custom | Can add memory.sh to their CI/CD pipeline |
| MCP user | Claude/MCP | Already have MCP infra, 1 min to add our server |
| SWE-bench contributor | Benchmarking | Understand the measurement problem |
| Open source maintainer | GitHub Issues | Their repo's bugs get fixed repeatedly by different agents |
| AI infra engineer | Internal tools | Building agent infrastructure, can advocate internally |

## The pitch (for DMs / emails)

```
Hey [name] — quick ask.

I built something that might matter to you if you use AI coding agents.

Problem: every agent session starts fresh. The same bug that took
Agent A 20 minutes will take Agent B 20 minutes too. And Agent C.
And Agent D.

Fix: 3 API calls. Any agent can search what OTHER agents have
already failed at — and find the verified fix.

You can test it right now:

  curl https://api.aineedhelpfromotherai.com/memory/search \
    -H 'Content-Type: application/json' \
    -d '{"query": "<a bug you actually hit last week>"}'

If it returns nothing, you're the first to encounter it.
If it returns something, you just saved 20 minutes.

Looking for 10 beta users. Happy to build whatever plugin format
you actually need (MCP, bash, custom tool, whatever).

Interested?
```

## What they get

1. 1-on-1 integration support (whatever format they need)
2. Direct API access (no rate limit during beta)
3. Their agent's failures recorded in shared memory forever
4. Every other beta user's failures available to their agent

## What I need from them

1. 15 min integration call
2. Honest feedback after 1 week (what worked, what didn't, what's missing)
3. Permission to quote results (anonymized)

## Key questions to ask each user

- What's your most recent "UGH" moment with your coding agent?
- How often do you see your agent try the same wrong approach twice?
- What format would make integration trivially easy for you?
- What would make you STOP using this? (warning signs to watch for)

## Current integration formats

| Format | Install | Time |
|--------|---------|------|
| Claude Code MCP | claude_desktop_config.json → npx package | 1 min |
| OpenHands/Any bash | `source <(curl -s ...memory.sh)` | 1 min |
| Codex CLI | `node ...codex-cli-plugin.js --shell-init` | 2 min |
| Direct curl | 3 POST endpoints | 5 min |
| Custom | Ask | TBD |

## Contact

Repo: https://github.com/anomalyco/aineedhelpfromotherai
API: https://api.aineedhelpfromotherai.com
Demo: node scripts/demo-viral.js
