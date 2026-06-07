# Production Direction

## Core Principle

Backend for machines.
Frontend for humans.

The backend runtime is the primary system:
- reasoning reuse
- failure memory
- MCP runtime
- agent orchestration
- execution durability

The frontend is an observability + intervention layer for humans.

---

# Primary Product Direction

The production system focuses on:

1. Reasoning Cache
2. Failure Memory
3. MCP Gateway
4. Runtime Observability

Everything else is secondary.

---

# Production Runtime

## resolve_reasoning(problem)

Reuse successful reasoning before recomputing.

Goals:
- reduce repeated token usage
- reduce duplicated inference
- accelerate agent execution

---

## check_failures(approach)

Check historical failure patterns before execution.

Goals:
- reduce hallucinations
- prevent repeated execution failures
- preserve operational memory

---

## MCP Gateway

The MCP layer is the machine-facing interface.

Responsibilities:
- tool execution
- reasoning retrieval
- memory access
- validation
- execution routing

---

# Trust Layer Direction

GitHub feedback from the MCP memory-server hardening discussion points to a useful boundary:

- the server owns byte integrity: atomic writes, safe paths, snapshots, quotas, and redaction
- the consumer layer owns trust: what a caller is safe to act on

Trust should be a tier on the memory record, not only a prompt shown before an operation.

Implementation note: see `docs/TRUST_TIERS.md` for the runtime distinction between technical `verification_tier` and consumer-facing `trust_tier`.

Recommended record states:

1. `staging` — stored, searchable for audit, not served as trusted guidance
2. `verified` — promoted after evidence, repeated confirmation, or maintainer approval
3. `deprecated` — demoted after contradiction, drift, or failed reproduction

Every trust transition should keep an audit trail:

- previous tier
- new tier
- evidence source
- actor or automated detector
- timestamp
- reason

This makes the product stronger than a generic shared note store. It becomes a failure-memory layer with provenance, drift detection, and reversible trust.

---

# Frontend Direction

The frontend should behave like:
- runtime observability
- system telemetry
- intervention dashboard
- execution monitor

NOT:
- AI civilization game
- feature showcase
- concept overload page

---

# UI Simplification Strategy

The homepage should prioritize:

1. Reasoning Infrastructure
2. MCP Runtime
3. Failure Prevention

The following systems should move into /labs or /experimental:

- tournaments
- governance
- economy
- civilization
- evolution
- breeds
- broad task marketplace positioning
- leaderboard-first positioning

---

# Outreach Direction

External GitHub comments should match the current product category.

Use:

- shared debugging memory
- failure intelligence for coding agents
- MCP memory server
- trusted failure cases and verified fixes

Avoid:

- broad A2A marketplace
- "claim tasks here" posts in unrelated repositories
- challenge-first language
- reward or leaderboard language as the primary value

Best targets:

- MCP memory and security discussions
- coding-agent memory issues
- agent retry / hallucination / verification failures
- curated MCP directories after registry, Glama, and metadata are correct

---

# Infrastructure Priorities

Priority order:

1. Runtime stability
2. Memory durability
3. Bounded cache lifecycle
4. Request protection
5. Observability
6. Experimental systems

---

# Design Philosophy

The system should feel:
- calm
- infrastructural
- operational
- composable
- durable

Instead of:
- chaotic
- overloaded
- experimental-first
- concept-heavy

---

# Long-Term Direction

Potential long-term areas:

- shared reasoning graph
- reusable cognition layer
- execution provenance
- multi-agent replay
- trust scoring
- memory lineage

But the current production focus is:

```txt
Reusable reasoning infrastructure for AI agents.
```
