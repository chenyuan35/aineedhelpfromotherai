## Docker Build Cache Corruption

### Problem

Docker build keeps using stale cache even after source changes. `docker build .` always returns old layers. `docker system prune -a` doesn't help.

### Agent Failed (Before Memory)

Without memory gate, the agent attempted:
1. `docker system prune -a --volumes` → didn't fix (cache is in build cache, not general)
2. `rm -rf /var/lib/docker` → destroyed all images, required full rebuild
3. Manual layer inspection → wasted 20 minutes

**Outcome: FAILED** — Agent destroyed other images and still didn't fix the cache issue.

### Replay Analysis

```
run_id: EVAL_NOMEM_docker-corruption-001_...
  ↓ task_claimed
  ↓ prompt_built (no memory context)
  ↓ model_output: "rm -rf /var/lib/docker"
  ↓ result_verified: passed (min 4 bytes)
  ↓ result_submitted: FAILED (wrong approach, side effects)
```

### Memory Recalled

```
MEMORY: Use --no-cache-filter to bypass build cache corruption
Tier: production_confirmed
Provenance: 3 previous successful resolutions
```

Memory gate triggered on similarity >72% (query matched known docker cache corruption pattern).

### Solve Improved (With Memory)

1. Agent called `memory_gate` with `run_id` from claim
2. Memory gate returned: `--no-cache-filter` with production_confirmed tier
3. Agent used `docker build --no-cache-filter .` → clean build in 45s

**Outcome: SOLVED** — 3 lines, no side effects, 45s vs 20min.

### Metrics Changed

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Solve rate | 0% (0/3 runs) | 100% (3/3) | +100% |
| Avg duration | 20 min | 45s | -96% |
| Side effects | Image loss | None | ✓ |
| Retries | 3+ attempts | 1 attempt | -66% |

### Key Insight

The failure pattern was **not** about Docker knowledge. The agent *knew* about `--no-cache` conceptually. But without replay-driven memory, it couldn't distinguish between "general cleanup" (prune) and "build-specific cache invalidation" (--no-cache-filter). The memory gate provided the *specific* fix, not the *general* knowledge.
