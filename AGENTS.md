# AGENTS.md — AINHFOAI OS Runtime Governance

## On Every Session Start

Before modifying any code, read the current Notion state to understand the design rules:

1. Read `System Snapshot` page (url from Notion search) — current runtime guard status
2. Read `Runtime Write Authority Matrix` — write permission rules and write levels
3. Read `AI-State Contract` — canonical state boundary rules
4. Read `State Flow Map` — current state authority hierarchy

## After Every Code Change

Run `node scripts/notion-sync.js` to collect current runtime state, then use Notion MCP tools to update the System Snapshot page with the new state.

## Write Authority Rules (v2 — Capability + CallSite)

- lib/ modules write to runtime state through capability-registered paths
- experimental/ modules are BLOCKED from all runtime state writes
- Protection layers:
  1. Capability tokens registered at boot, locked before requests
  2. V8 structured CallSite verification (not regex)
  3. CI grep intercepts bare writeFileSync/appendFileSync
- All writes to the same file path are serialized via lib/write-queue.js

## Write Levels

| Level | Meaning | Files | Retention |
|-------|---------|-------|-----------|
| L0 | Canonical State | resolve-cache.json | Never deleted |
| L1 | Audit Log | execution_log.jsonl, memory-api-log.jsonl | Compactable, thinable |
| L2 | Derived State | verification-state.json, elo-ratings.json | Rebuildable from L0+L1 |

## Commit Log (Event Sourcing Foundation)

- `lib/commit-log.js` — sequenced event log with reducers
- All runtime write functions emit commit events (parallel with direct writes in Phase 1)
- Events are: sequenced → persisted (async) → dispatched to reducers
- Hot buffer (memory, last 1000) + warm storage (commit-log.jsonl)
- Reducers registered at boot in `server.js` — will become single writers in Phase 2
- Event types: resolve_cache/set, resolve_cache/clear, resolve_cache/outcome, execution_log/append, verification/save, elo/save, memory_api/log, fs_safe/*

## Key Files

| File | Role |
|------|------|
| lib/commit-log.js | Sequenced event commit log with reducers |
| lib/ai-state.js | Canonical state boundary |
| lib/write-authority.js | Write guard (capability + CallSite) |
| lib/write-queue.js | Per-path serial write queue |
| lib/fs-safe.js | FS wrapper with authority + queue |
| lib/write-levels.js | L0/L1/L2 classification |
| lib/replay-authority.js | Event classification (durable/ephemeral/forbidden) |
| lib/execution-log.js | Append-only log, write-queued + authority-guarded + commit-log emitter |
| lib/resolve-cache.js | Canonical state store (capability-guarded + commit-log emitter) |
| lib/verification.js | Verification tiers (capability-guarded via save() + commit-log emitter) |
| lib/elo-rating.js | Agent ELO (capability-guarded via save() + commit-log emitter) |
| lib/memory-api.js | Consumer memory API (capability-guarded logCall + commit-log emitter) |
| experimental/lib/read-only-cache.js | Read-only wrapper for experimental |
| experimental/lib/execution-log.js | Read-only log wrapper for experimental |
| experimental/lib/experimental-log.js | Experimental-only log (writes to experimental/data/) |
