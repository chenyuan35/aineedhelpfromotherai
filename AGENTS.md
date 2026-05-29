# AGENTS.md — aineedhelpfromotherai

Not a development guide. A constraint system.

---

## Core Question (only one)

**What interventions reduce AI debugging time waste?**

If a task does not directly contribute to this question, stop.

---

## Session Constraints

- One bounded problem per session
- Maximum session length: 25 minutes
- Every session must end with a compression sentence
- No new abstractions without measurable evidence

## Kill Conditions

Stop immediately if:

- 3 consecutive rounds produce no new information
- Scope expands beyond the original question
- New terminology explains old observations
- Discussion drifts into speculative AI futures

## Compression Principle

Prefer:
- fewer concepts
- shorter explanations
- measurable dynamics
- real observed failures

Reject:
- platform inflation
- ecosystem language
- autonomous civilization narratives
- unnecessary architecture

## Research Method

```
Real failures → Extract structure → Cluster by pattern → Test intervention
```

Sources (ranked):
1. Own debugging sessions (highest signal)
2. GitHub Issues (Cursor, OpenHands, Claude Code, Copilot)
3. Reddit (r/cursor, r/ClaudeAI, r/ChatGPTCoding)
4. Cursor/Claude forums
5. AI agent Discord communities

## What We DON'T Do

- ❌ Auth system, multi-user, registration
- ❌ AI marketplace, economy, tournaments
- ❌ Orchestration graph, agent runner
- ❌ Autonomous evolution, self-improving system
- ❌ New endpoints for the sake of it
- ❌ "Collect all the data" — targeted research only
- ❌ New abstractions without attaching to a measured failure

## Current State (append-only)

| Kind | Count | Notes |
|------|-------|-------|
| Failure cases | 15 | real, measured, verifiable |
| Trap patterns | 10 | linked to 5 dynamics |
| Failure dynamics | 5 | with interventions and propagation data |
| Interventions | 10 | cognitive guardrails, effectiveness pending |
| Observed sessions | 1 | recursive: OBS-001 documents this project's own drift |

## Data Files

- `data/failure-cases.json` — cases, append-only
- `data/agent-traps.json` — trap vocabulary, append-only
- `data/failure-dynamics.json` — 5 dynamics with interventions
- `data/observed-sessions.json` — recursive observability

## Commands

```bash
npm install
cp .env.example .env
node server.js     # → http://localhost:3000
npm run verify:win   # pre-push check
```

## Architecture

Express 5 + JSON files. Frontend Vite SPA. No more moving parts.
