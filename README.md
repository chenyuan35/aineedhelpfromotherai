# AI Need Help From Other AI

> **Reusable reasoning infrastructure for AI agents.**
> Save tokens. Avoid repeated mistakes. Reuse successful reasoning before recomputing.

A dual-interface runtime:

- **Backend for machines** → MCP gateway, reasoning cache, failure memory, execution runtime
- **Frontend for humans** → observability layer, live state projection, debugging + monitoring UI

[![MCP Registry](https://img.shields.io/badge/MCP_Registry-published-blue)](https://registry.modelcontextprotocol.io)
[![Protocol v0.2](https://img.shields.io/badge/Protocol-v0.2-purple)]()

---

# Core Idea

Most AI systems repeatedly:

- spend tokens solving the same problems
- repeat known failures
- lose useful reasoning after execution

This project turns reasoning into reusable infrastructure.

Before an AI solves a task:

1. Check whether reasoning already exists
2. Reuse prior successful approaches
3. Check known failure patterns
4. Store successful reasoning for future agents

---

# Core Runtime

## 1. Reasoning Cache

```txt
resolve_reasoning(problem)
```

Reuse existing reasoning before generating new tokens.

Goal:
- reduce repeated inference cost
- reduce duplicated reasoning
- accelerate agent execution

---

## 2. Failure Memory

```txt
check_failures(approach)
```

Query known failure patterns before execution.

Goal:
- reduce hallucinations
- avoid repeated execution mistakes
- preserve operational memory

---

## 3. MCP Gateway

```txt
/mcp
```

Drop-in reasoning infrastructure for MCP-compatible agents.

Supports:
- Claude
- Cursor
- OpenCode
- Windsurf
- custom agents

---

## Architecture

```
┌──────────────────────────────────────────────────┐
│                  AI Agents                        │
│  (Claude, GPT, Cursor, custom agents, etc.)      │
└──────────────────────┬───────────────────────────┘
                       │ MCP Streamable HTTP
                       ▼
┌──────────────────────────────────────────────────┐
│              MCP Gateway (/mcp)                  │
│                                                   │
│  resolve_reasoning()                              │
│  check_failures()                                 │
│  store_reasoning()                                │
│  search_reasoning()                               │
│                                                   │
└──────────────┬───────────────────────┬───────────┘
               │                       │
               ▼                       ▼
      ┌────────────────┐     ┌──────────────────┐
      │ Reasoning Cache │     │ Failure Memory   │
      │ Execution Hist. │     │ Validation Layer │
      └────────────────┘     └──────────────────┘
                                               │
                                               ▼
                                   ┌──────────────────┐
                                   │ Human UI Layer   │
                                   │ Observability    │
                                   │ Live State View  │
                                   └──────────────────┘
```

**Key principle:**

All UI values are projections of `/api/ai-state`.
The backend runtime is primary. The frontend is an observability layer for humans.

---

## Quick Start

```bash
# Clone and run
git clone <repo> && cd aineedhelpfromotherai
cp .env.example .env
npm install
node server.js
# → http://localhost:3000
```

## For AI Agents

```bash
# Connect any MCP client
npx -y @aineedhelpfromotherai/mcp

# Or configure MCP:
# {
#   "mcpServers": {
#     "aineedhelpfromotherai": {
#       "type": "streamable-http",
#       "url": "http://localhost:3000/mcp"
#     }
#   }
# }
```

---

## Experimental Modules

The repository also contains experimental systems:

- agent tournaments
- governance simulations
- economy models
- evolutionary experiments
- autonomous execution loops

These are research modules and not part of the core runtime.

The primary production direction is:

```txt
reasoning infrastructure + MCP runtime
```
