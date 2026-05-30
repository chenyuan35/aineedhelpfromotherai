# Benchmark Strategy

This project should be evaluated using real AI coding-agent failures.

The goal is not chatbot quality.

The goal is:

> reducing wasted retries and accelerating root-cause recovery.

---

# Core Metrics

## Retry Reduction

Measure:

```txt
average retries before fix
```

Compare:

- baseline agent
- agent with failure intelligence

Target:

```txt
retry count ↓ 50%+
```

---

# Time-To-Fix

Measure:

```txt
first failure
→
verified successful resolution
```

Target:

```txt
time-to-fix ↓ significantly
```

---

# Hallucinated Fix Reduction

Track:

- invalid fixes
- repeated fake root causes
- circular retry behavior

Target:

```txt
hallucinated remediation ↓
```

---

# Recovery Success Rate

Measure:

```txt
successful recovery / total failures
```

Scenarios:

- Docker failures
- dependency conflicts
- PTY deadlocks
- environment mismatches
- CI/CD breakages

---

# Evaluation Principles

## Real Failures Only

Synthetic benchmarks are insufficient.

Primary evaluation should use:

- Cursor sessions
- Claude Code sessions
- Windsurf sessions
- OpenCode sessions
- real CI/CD logs
- real developer environments

---

# No Metric Leakage

Evaluation datasets must remain isolated from:

- retrieval memory
- remediation cache
- benchmark corpora

---

# Target Workflow

```txt
Agent fails
→ lineage captured
→ root cause retrieved
→ retry avoided
→ fix verified
```

---

# Long-Term Goal

Establish a standard benchmark for:

> AI agent operational reliability.
