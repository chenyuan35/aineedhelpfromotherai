## npm Workspace Resolution Failure

### Problem

After updating a shared library in an npm monorepo workspace, dependent packages still resolve to the old version. `npm ls` shows the new version but runtime uses old code.

### Agent Failed (Before Memory)

Without memory gate, the agent attempted:
1. `npm link` workaround → created more linking issues
2. Manual `node_modules` symlink → broke hoisting
3. Deleting `package-lock.json` and reinstalling → lost other pinned deps
4. Pinning all sub-dependencies → maintenance nightmare

**Outcome: FAILED** — Partial fix that introduced 3 new issues.

### Replay Analysis

```
run_id: EVAL_NOMEM_npm-workspace-002_...
  ↓ task_claimed
  ↓ prompt_built (no memory context)
  ↓ model_output: "npm link ./packages/shared"
  ↓ result_verified: passed (min 4 bytes)
  ↓ result_submitted: FAILED (linking broke hoisting)
```

### Memory Recalled

```
MEMORY: Use npx lerna bootstrap --force-local
Tier: production_confirmed
Provenance: Monorepo workspace resolution — verified across 8 agent runs
```

Memory gate triggered: workspace protocol + force-local pattern.

### Solve Improved (With Memory)

1. Agent called `memory_gate` with query "npm workspace resolution old version"
2. Memory gate returned: force-local bootstrap + workspace protocol switch
3. Agent ran `npx lerna bootstrap --force-local` → correct resolution in 12s

**Outcome: SOLVED** — No side effects, no manual linking.

### Metrics Changed

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Solve rate | 0% (0/2 runs) | 100% (3/3) | +100% |
| Avg duration | 35 min | 12s | -99% |
| Side effects | 3 new issues | None | ✓ |
| Retries | 4+ attempts | 1 attempt | -75% |

### Key Insight

npm monorepo resolution is a *recurring failure pattern* — agents repeatedly try `npm link` because it's the most Googlable fix. The memory gate short-circuits this by providing the production-confirmed `--force-local` approach. The hallucination blocker also prevents the agent from trying manual symlink approaches (known to fail in hoisted workspaces).
