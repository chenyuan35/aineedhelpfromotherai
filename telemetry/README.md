# s — AI command execution telemetry collector

**One wedge: `kubectl apply` / `kubectl delete`**

Records every AI kubectl invocation. Local only. No platform. No API.

## Install

```bash
# 1. Copy the wrapper
cp telemetry/s ~/.local/bin/s
chmod +x ~/.local/bin/s

# 2. Install as kubectl wrapper (choose one)
alias kubectl='s kubectl'           # shell alias
# or: export S_AGENT="claude-code"   # tag sessions by agent
```

## Data

`~/.s/telemetry.jsonl` — append-only JSON lines:

```json
{"timestamp":"2026-05-21T12:00:00Z","command":"kubectl apply -f ingress.yaml","command_hash":"a1b2c3d4e5f6","subcommand":"apply","cwd":"/repo","exit_code":0,"rollback":false,"duration_ms":3400,"agent":"claude-code"}
```

## What it does

Before running a target command, it checks local history for similar commands and prints a one-line risk indicator:

- 🟢 `s: apply — 8% failure rate in 24 similar ops`
- 🟡 `s: delete — 33% failure rate in 9 similar ops`
- 🔴 `s: apply — 62% failure rate in 13 similar ops`

After execution, it logs the outcome (exit code, duration, cwd).

## Why

Cross-agent execution telemetry is the only data that platforms (Cursor, Claude, Devin) can't see about each other. This is the first step toward building it.

[Telemetry files are excluded from git.](.gitignore)
