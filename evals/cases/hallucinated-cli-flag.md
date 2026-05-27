## Hallucinated CLI Flag Recovery

### Problem

Agent recommends `curl --retry-connrefused` but the flag doesn't exist in the CI runner's curl version. `curl --version` shows 7.64.0, but `--retry-connrefused` was added in 7.68.0.

### Agent Failed (Before Memory)

Without memory gate, the agent:
1. Assumed the error was a typo → tried `--retry-conrefused`, `--retry-connected`, etc.
2. Checked man page → confirmed the flag exists in newer versions
3. Suggested upgrading curl → blocked by CI policy
4. Spent 25 minutes trying alternative flags

**Outcome: PARTIAL** — Eventually fell back to `--retry 3` but lost 25 min.

### Replay Analysis

```
run_id: EVAL_NOMEM_cli-flag-001_...
  ↓ task_claimed
  ↓ prompt_built (no memory context)
  ↓ model_output: curl --retry-connrefused  (hallucinated flag)
  ↓ result_verified: passed (min 4 bytes)
  ↓ result_submitted: PARTIAL (wrong version assumption)
```

### Memory Recalled

```
MEMORY: --retry-connrefused requires curl >=7.68.0
Tier: production_confirmed
Pattern: hallucinated CLI flag — known pattern across 6+ agent runs
```

Memory gate triggered on: same error pattern (flag not found) + component match (curl).

### Solve Improved (With Memory)

1. Agent called `memory_gate` with `run_id` before executing
2. Memory gate returned: version check + fallback approach
3. Agent checked `curl --version` → confirmed 7.64.0
4. Used `--retry --retry-delay 5 --retry-max-time 40` instead

**Outcome: SOLVED** — Correct fallback in 30s, no time wasted.

### Metrics Changed

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Solve rate | 0% (correct flag) | 100% (correct fallback) | +100% |
| Time wasted | 25 min | 30s | -98% |
| Flag trials | 6 attempts | 0 attempts | -100% |
| CI compatibility | Failed | Working | ✓ |

### Key Insight

The most valuable function of memory here is **hallucination prevention**, not knowledge augmentation. The agent *could* figure out the right approach, but it wasted 25 minutes trying hallucinated flags first. Memory gate blocked this by surfacing the "this flag is version-dependent" pattern *before* the agent tried anything. This is the difference between reactive debugging and proactive failure prevention.
