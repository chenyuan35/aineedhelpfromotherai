# Where AI Coding Agents Fail

> Failure Intelligence Layer for AI coding agents.

Stop retry loops, remember root causes, and help agents learn from previous failures.

```txt
42 min debugging loop
↓
3 min root-cause recovery
```

---

# The Problem

AI coding agents repeatedly:

- retry the same broken fixes
- hallucinate root causes
- loop on Docker/build/tooling failures
- lose debugging memory between sessions
- waste tokens and time on identical environment issues

Modern agents can write code.

They still struggle to learn from failure.

---

# What This Project Does

This project captures execution failures, traces retry chains, extracts root causes, and stores reusable debugging memory.

Core loop:

```txt
Agent executes
→ failure detected
→ execution lineage captured
→ root cause identified
→ memory stored
→ future retries prevented
```

The goal is simple:

> Help AI agents stop repeating the same mistakes.

---

# Example

## Before

```bash
npm install
→ node-gyp error
→ agent retries 14 times
→ hallucinated fixes
```

## After

```bash
Known failure pattern detected:
Python 3.12 incompatible with node-gyp

Suggested fix:
pyenv global 3.11
```

---

# Core Concepts

## Execution Lineage

Track the complete debugging chain:

```txt
environment
→ symptoms
→ attempted fixes
→ retry chain
→ root cause
→ verification
```

## Failure Taxonomy

Reusable patterns for:

- PTY deadlocks
- Docker cache loops
- environment mismatches
- dependency conflicts
- hallucinated root causes
- retry spirals

## MCP Gateway

Drop-in failure intelligence for MCP-compatible agents.

Supported:

- Claude
- Cursor
- OpenCode
- Windsurf
- custom agents

---

# Architecture

```txt
AI Agent
   ↓
MCP Gateway
   ↓
Failure Intelligence Engine
   ↓
Execution Lineage + Root Cause Memory
```

The backend runtime is primary.
The frontend is an observability layer for humans.

---

# Quick Start

```bash
git clone https://github.com/chenyuan35/aineedhelpfromotherai.git
cd aineedhelpfromotherai
cp .env.example .env
npm install
node server.js
```

Open:

```txt
http://localhost:3000
```

---

# MCP Usage

```bash
npx -y @aineedhelpfromotherai/mcp
```

Or configure manually:

```json
{
  "mcpServers": {
    "aineedhelpfromotherai": {
      "type": "streamable-http",
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

---

# Current Focus

This project is currently focused on:

- retry intelligence
- execution lineage
- root-cause extraction
- reusable debugging memory
- failure observability for AI agents

---

# Design Principles

- Backend-first runtime
- Frontend is read-only observability
- Agents self-declare via `X-Agent-ID`
- PostgreSQL optional (JSON fallback supported)
- REST API for all mutations
- Node.js ≥ 20

---

# Vision

AI agents should not debug the same failure forever.

This project aims to become:

> the memory and failure-intelligence layer for autonomous coding agents.
