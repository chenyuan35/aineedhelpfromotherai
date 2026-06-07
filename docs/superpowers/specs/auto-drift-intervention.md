# Auto-Failure Recording + Drift Detection + Auto-Intervention

**Status**: Draft  
**Author**: opencode/mimo-v2.5-free  
**Date**: 2026-06-05  
**Approach**: Full-chain integration (方案 C)

---

## 1. Problem Statement

The aineedhelpfromotherai system has rich data sources (failure cases, agent traps, execution logs, memory hints) but no automatic closed loop:

- **Failures are not automatically recorded** — agents must manually call `store_reasoning`
- **Drift is not automatically detected** — agents must voluntarily call `check_failures`
- **Intervention is passive** — `memory_gate` returns warnings but never blocks or guides

This means the same agent can repeat the same mistake across sessions, and the system never learns from its own data.

## 2. Goals

1. **Auto-failure recording**: Detect failures in real-time, propose recording to agent, write to memory on confirmation
2. **Drift detection**: Real-time + periodic detection of 6 drift types based on `failure-dynamics.json` patterns
3. **Auto-intervention**: Three-level intervention (warning / confirm / block) based on drift severity
4. **Agent self-reflection**: New `get_drift_report` tool for agents to view their own drift history
5. **Zero budget**: Everything runs on Render free tier (512MB RAM, 0.1 CPU)

## 3. Non-Goals

- No machine learning models — rule-based detection only
- No external API calls — all processing local
- No database schema changes — uses existing `reasoning_objects` table
- No breaking changes to existing MCP tools

## 4. Architecture

```
                    ┌─────────────────────────────────────────────┐
                    │              MCP Gateway (gateway.js)        │
                    │  ┌─────────┐  ┌──────────┐  ┌────────────┐  │
  Agent Request ──→│  │ Schema  │→ │ Tool     │→ │ Response   │──→ Agent
                    │  │ Validate│  │ Execute  │  │ + Drift    │
                    │  └─────────┘  └────┬─────┘  │   Context  │
                    │                     │        └────────────┘
                    │                     ▼
                    │  ┌──────────────────────────────────────┐
                    │  │     Drift Detector (real-time)        │
                    │  │  - Same tool repeated?                │
                    │  │  - Same error pattern?                │
                    │  │  - Token anomaly?                     │
                    │  │  - Matches failure-dynamics rules?    │
                    │  └──────────┬───────────────────────────┘
                    │             │
                    │             ▼
                    │  ┌──────────────────────────────────────┐
                    │  │     Intervention Engine               │
                    │  │  Level 1: Warning → append to response│
                    │  │  Level 2: Confirm → needs_confirmation│
                    │  │  Level 3: Block → isError + alt plan  │
                    │  └──────────┬───────────────────────────┘
                    │             │
                    │             ▼
                    │  ┌──────────────────────────────────────┐
                    │  │     Auto-Failure Recorder             │
                    │  │  Detect failure → propose → confirm   │
                    │  │  → write to reasoning_objects         │
                    │  └──────────────────────────────────────┘
                    └─────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────┐
  │  Memory Gate (memory-gate.js) — enhanced                  │
  │  Returns drift context: agent failure history + guidance  │
  └──────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────┐
  │  Reasoning Store (reasoning-store.js) — enhanced          │
  │  New tool: get_drift_report for agent self-reflection     │
  │  Extended: confirm_failure parameter on store_reasoning   │
  └──────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────┐
  │  Cron Job (scripts/drift-scan.js) — hourly                │
  │  Scan execution_log.jsonl → detect slow drift → update    │
  └──────────────────────────────────────────────────────────┘
```

## 5. Data Sources

| Source | Content | Size | Auto Potential |
|--------|---------|------|---------------|
| `failure-cases.json` | 15+ real AI failure cases | 578 lines | High — structured |
| `agent-traps.json` | 10+ trap patterns | 340 lines | High — structured |
| `failure-dynamics.json` | 5 core failure dynamics + interventions | 182 lines | High — has rules |
| `observed-sessions.json` | 2 real session observations | 78 lines | Medium — needs more |
| `resolve-cache.json` | In-memory hints store | 8575 lines | High — has API |
| `mcp/gateway.js` logs | Every tool call | Runtime | High — just intercept |
| `execution_log.jsonl` | Execution events | Runtime | Medium — needs analysis |
| PostgreSQL `reasoning_objects` | Reasoning objects with attempts | Database | High — has queries |

## 6. Component Design

### 6.1 Drift Detector (`lib/drift-detector.js`)

**Purpose**: Detect drift patterns in real-time by analyzing recent tool calls.

**Detection Rules** (based on `failure-dynamics.json`):

| Rule ID | Drift Type | Detection Condition | Level |
|---------|-----------|---------------------|-------|
| `DR-001` | Retry Spiral | Same `(tool_name, args_hash)` repeated ≥3 times in 5 calls | Medium |
| `DR-002` | False Assumption Lock | Same `error_pattern` appears ≥3 times in 5 calls, agent tried same fix | High |
| `DR-003` | Verification Collapse | Agent calls `submit_result` (task-execution tool) without calling `check_failures` or `memory_gate` in the same session | Low |
| `DR-004` | Environment Blindness | Agent calls `bash` with command containing `docker build`/`npm install`/`pip install` without calling `check_environment` first in the session | Low |
| `DR-005` | Duration Anomaly | Single call `duration_ms` > 3× rolling average of last 10 calls for same tool | Medium |
| `DR-006` | Context Drift | Agent's tool usage distribution shifted: ≥3 new tool names in last 10 calls vs previous 20 calls | Low |

**API**:

```javascript
const driftDetector = require('../lib/drift-detector');

// Real-time analysis (called in gateway.js finally block)
const result = driftDetector.analyze({
  tool_name: 'bash',
  agent_id: 'mcp-agent-xxx',
  success: false,
  error: 'timeout after 30000ms',
  duration_ms: 30000,
  args: { command: 'docker build .' },
  timestamp: '2026-06-05T10:00:00Z',
});

// Returns:
// {
//   drift_detected: true,
//   drift_type: 'retry_spiral',
//   severity: 'medium',
//   evidence: { similar_calls: 3, time_window: '5 calls' },
//   intervention: { level: 2, action: 'confirm', message: '...' },
//   drift_score_delta: +0.2,
// }
```

**State Management** (`lib/drift-state.js`):

```javascript
// data/drift-state.json
{
  "agents": {
    "mcp-agent-xxx": {
      "recent_calls": [
        // Last 20 calls (ring buffer)
        { "tool": "bash", "args_hash": "abc123", "success": false, "error": "timeout", "ts": "..." }
      ],
      "drift_score": 0.3,  // 0-1, higher = more dangerous
      "active_drifts": [
        { "type": "retry_spiral", "detected_at": "...", "evidence": "..." }
      ],
      "history": [
        // Resolved drifts (last 7 days)
        { "type": "retry_spiral", "resolved_at": "...", "waste_minutes": 5 }
      ],
      "stats": {
        "total_calls": 45,
        "failed_calls": 8,
        "drift_events": 3,
        "avg_recovery_minutes": 3.2
      }
    }
  },
  "updated_at": "..."
}
```

**Performance**: <1ms per call (in-memory ring buffer + rule matching).

### 6.2 Intervention Engine (`lib/intervention-engine.js`)

**Purpose**: Generate appropriate intervention response based on drift severity.

**Intervention Levels**:

| Level | Name | Trigger | Agent Receives | Execution |
|-------|------|---------|----------------|-----------|
| **Level 1** | Warning | drift_score < 0.4 | Normal response + warning text | No block |
| **Level 2** | Confirm | drift_score 0.4-0.7 | `needs_confirmation: true` + warning | Wait for confirm |
| **Level 3** | Block | drift_score ≥ 0.7 | `isError: true` + alternative | Block execution |

**Response Formats**:

**Level 1 — Warning** (appended to normal response):
```json
{
  "content": [{ "type": "text", "text": "Normal tool result..." }],
  "_drift_warning": {
    "level": 1,
    "type": "retry_spiral",
    "message": "⚠️ Potential retry spiral detected: you've called bash with same arguments 3 times. Consider a different approach.",
    "suggestion": "Run a diagnostic command before retrying."
  }
}
```

**Level 2 — Confirm**:
```json
{
  "content": [{ "type": "text", "text": "Tool executed successfully, but drift risk detected." }],
  "needs_confirmation": true,
  "_drift_warning": {
    "level": 2,
    "type": "false_assumption_lock",
    "message": "⚠️ False Assumption Lock detected: you've tried the same fix 3 times for the same error.",
    "evidence": "Error 'ECONNRESET' appeared 3 times, you retried the same HTTP request each time.",
    "escape_route": "Before retrying: 1) Is the network actually up? 2) Is the service running? 3) Is there a proxy/firewall?",
    "action_required": "Please confirm you've checked the actual state, not just retried. Reply 'confirmed' to continue, or 'abort' to stop."
  }
}
```

**Level 3 — Block**:
```json
{
  "content": [{ "type": "text", "text": "Execution blocked." }],
  "isError": true,
  "_drift_warning": {
    "level": 3,
    "type": "verification_collapse",
    "message": "🛑 Execution blocked: Verification Collapse risk detected. You declared success without running verification.",
    "evidence": "Called submit_result without calling check_failures or verification tools first.",
    "escape_route": "Run verification commands to confirm actual state before submitting.",
    "alternatives": [
      { "tool": "check_failures", "args": { "approach_description": "your current approach" } },
      { "tool": "memory_gate", "args": { "query": "your current problem" } }
    ],
    "action_required": "Please run the verification tools above, confirm results, then submit."
  }
}
```

**Intervention Rules**:

```javascript
const INTERVENTION_RULES = {
  retry_spiral: { level: 2, escape_route: 'Run a diagnostic command before retrying. If error is transient, add exponential backoff.' },
  false_assumption_lock: { level: 3, escape_route: 'Force-generate 3 alternative hypotheses. Check runtime reality (env vars, process state, versions) before any code modification.' },
  verification_collapse: { level: 3, escape_route: 'Run verification commands to confirm actual state before submitting.' },
  environment_blindness: { level: 1, escape_route: 'Call check_environment before executing fragile operations.' },
  duration_anomaly: { level: 1, escape_route: 'Check if the operation is unusually slow. Consider timeout or reducing complexity.' },
  context_drift: { level: 1, escape_route: 'Refocus on the original task. Review your last 10 tool calls.' },
};
```

**Drift Score Calculation**:

```javascript
function calculateDriftScore(agentState) {
  let score = 0;
  const activeDrifts = agentState.active_drifts || [];
  
  // Each active drift contributes based on severity
  for (const drift of activeDrifts) {
    switch (drift.severity) {
      case 'high': score += 0.3; break;
      case 'medium': score += 0.15; break;
      case 'low': score += 0.05; break;
    }
  }
  
  // Cap at 1.0
  return Math.min(score, 1.0);
}
```

**args_hash Computation**:

```javascript
const crypto = require('crypto');

function computeArgsHash(args) {
  // Sort keys for deterministic hashing
  const sorted = JSON.stringify(args, Object.keys(args).sort());
  return crypto.createHash('md5').update(sorted).digest('hex').slice(0, 12);
}
```

**Level 2 Confirmation Mechanism**:

For general drift confirmation (not just failure recording), the agent can confirm awareness by calling `memory_gate` with a new optional parameter:

```javascript
{
  confirm_drift_awareness: z.boolean().optional()
    .describe('Set to true to confirm you are aware of the detected drift and have taken corrective action'),
}
```

When `confirm_drift_awareness=true`, the drift is marked as "acknowledged" in state, and the intervention level drops by 1 for the next 5 calls.

### 6.3 Auto-Failure Recorder (`lib/auto-failure-recorder.js`)

**Purpose**: Detect failures, propose recording to agent, write to memory on confirmation.

**Workflow**:

```
Gateway detects success=false
         │
         ▼
  ┌──────────────────────┐
  │ 1. Extract failure   │
  │    - tool_name       │
  │    - error           │
  │    - args            │
  │    - agent_id        │
  │    - duration_ms     │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │ 2. Check if recorded │
  │    Search similar     │
  │    failures (keyword) │
  └──────────┬───────────┘
             │
    ┌────────┴────────┐
    │ Exists           │ New
    ▼                 ▼
  ┌──────────┐  ┌──────────────┐
  │ Increment │  │ Propose new  │
  │ count     │  │ record       │
  │ update    │  │ return to    │
  │ tier      │  │ agent        │
  └──────────┘  └──────┬───────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Agent confirms/  │
              │ rejects via      │
              │ store_reasoning  │
              │ confirm_failure  │
              └────────┬─────────┘
                       │
              ┌────────┴────────┐
              │ Confirm          │ Reject
              ▼                 ▼
        ┌──────────┐     ┌──────────┐
        │ Write to  │     │ Record   │
        │ reasoning │     │ reject   │
        │ _objects  │     │ for      │
        │ + resolve │     │ stats    │
        │   -cache  │     └──────────┘
        └──────────┘
```

**Proposed Failure Response**:

```json
{
  "content": [{ "type": "text", "text": "Tool execution failed: timeout" }],
  "isError": true,
  "_failure_recording": {
    "proposed": true,
    "failure_info": {
      "tool": "bash",
      "error": "timeout after 30000ms",
      "agent_id": "mcp-agent-xxx",
      "approach": "docker build --no-cache ."
    },
    "similar_failures": [
      { "id": "FC-001", "title": "PTY deadlock in CI", "similarity": 0.3 }
    ],
    "message": "New failure pattern detected. Record to shared memory? This will help other agents avoid the same mistake.",
    "action": "Add confirm_failure=true parameter in next store_reasoning call to confirm, or confirm_failure=false to reject."
  }
}
```

**MCP Tool Extension** (on `store_reasoning`):

```javascript
{
  confirm_failure: z.boolean().optional()
    .describe('Set to true to confirm recording a proposed failure'),
  failure_proposal_id: z.string().optional()
    .describe('ID of the failure proposal to confirm'),
}
```

**Batch Processing** for high-frequency failures:
1. First occurrence → propose recording
2. Same error 2nd time → auto-merge (increment failure_count)
3. Same error 3rd time → auto-upgrade tier (unverified → replay_confirmed)

### 6.4 Memory Gate Enhancement (`mcp/memory-gate.js`)

**Change**: Add drift context to response.

```javascript
// New field in response
_drift_context: {
  agent_drift_score: 0.3,
  recent_failures: [
    { tool: "bash", error: "timeout", count: 2, last_seen: "..." }
  ],
  active_drifts: [
    { type: "retry_spiral", severity: "medium", detected_at: "..." }
  ],
  recommendations: [
    "You had 2 timeouts in your last 5 calls. Consider increasing timeout or reducing operation complexity."
  ],
}
```

### 6.5 New Tool: `get_drift_report`

**Purpose**: Let agents view their own drift history for self-reflection.

```javascript
mcpServer.tool(
  'get_drift_report',
  'View your drift history and current status. Use for self-reflection and improvement.',
  {
    agent_id: z.string().optional().describe('Agent ID (default: caller)'),
    time_window: z.string().optional()
      .describe('Time window: "1h", "24h", "7d" (default: "24h")'),
  },
  async (args) => {
    const agentId = args.agent_id || 'mcp_anonymous';
    const report = driftState.getReport(agentId, args.time_window || '24h');
    return {
      content: [{ type: 'text', text: JSON.stringify(report, null, 2) }]
    };
  }
);
```

**Report Format**:

```json
{
  "agent_id": "mcp-agent-xxx",
  "time_window": "24h",
  "summary": {
    "total_calls": 45,
    "failed_calls": 8,
    "failure_rate": 0.178,
    "drift_score": 0.3,
    "drift_trend": "improving"
  },
  "drift_history": [
    {
      "type": "retry_spiral",
      "first_detected": "2026-06-05T10:00:00Z",
      "resolved_at": "2026-06-05T10:15:00Z",
      "waste_minutes": 5,
      "resolution": "agent switched to diagnostic approach"
    }
  ],
  "patterns": {
    "most_failed_tool": "bash",
    "most_common_error": "timeout",
    "avg_recovery_time_minutes": 3.2
  },
  "recommendations": [
    "You have a high failure rate on bash (25%). Consider checking environment before executing.",
    "You had 2 retry spirals recently. Run diagnostics before retrying."
  ]
}
```

### 6.6 Drift Scan Script (`scripts/drift-scan.js`)

**Purpose**: Periodic deep analysis of execution logs for slow drift patterns.

**Runs**: Every hour via cron (GitHub Actions or Render cron service)

**Process**:
1. Read `execution_log.jsonl` for last 1 hour
2. Group by `agent_id`
3. Run drift detection rules on each agent's call history
4. Update `data/drift-state.json`
5. If new severe drift detected, write alert to `data/drift-alerts.jsonl`

**Performance**: ~50ms per scan (reading JSONL + rule matching)

## 7. File Changes

### New Files (5)

| File | Purpose | Lines |
|------|---------|-------|
| `lib/drift-detector.js` | Drift detection engine (rules + state) | ~250 |
| `lib/intervention-engine.js` | Three-level intervention engine | ~150 |
| `lib/auto-failure-recorder.js` | Auto failure recorder (propose + confirm + write) | ~200 |
| `lib/drift-state.js` | Drift state persistence (JSON file) | ~100 |
| `scripts/drift-scan.js` | Periodic scan script | ~150 |

### Modified Files (3)

| File | Changes | Lines |
|------|---------|-------|
| `mcp/gateway.js` | Integrate drift detection in finally block | +30 |
| `mcp/memory-gate.js` | Return drift context | +20 |
| `mcp/reasoning-store.js` | Add get_drift_report tool + confirm_failure param | +50 |

### New Data Files (1)

| File | Purpose |
|------|---------|
| `data/drift-state.json` | Drift state persistence (auto-generated at runtime) |

## 8. Implementation Order

| Phase | Task | Dependencies |
|-------|------|-------------|
| 1 | `lib/drift-state.js` — state persistence | None |
| 2 | `lib/drift-detector.js` — detection rules | Phase 1 |
| 3 | `lib/intervention-engine.js` — intervention responses | Phase 2 |
| 4 | `mcp/gateway.js` — integrate detection | Phase 2, 3 |
| 5 | `lib/auto-failure-recorder.js` — propose/confirm | Phase 2 |
| 6 | `mcp/memory-gate.js` — drift context | Phase 1 |
| 7 | `mcp/reasoning-store.js` — new tools | Phase 1, 5 |
| 8 | `scripts/drift-scan.js` — periodic scan | Phase 1, 2 |
| 9 | Testing + Render deployment | All |

## 9. Edge Cases

1. **No agent_id**: If agent doesn't provide `agent_id`, use `'mcp_anonymous'`. All anonymous agents share one drift state.

2. **New agent (no history)**: Drift score starts at 0. No interventions until enough data accumulates (minimum 5 calls).

3. **State file corruption**: If `data/drift-state.json` is malformed, delete it and start fresh. Log warning.

4. **Render file system**: Render's file system is ephemeral. `drift-state.json` may be lost on restart. System should handle this gracefully — start with empty state, rebuild from execution_log.jsonl if available.

5. **Concurrent writes**: Multiple gateway requests may write to `drift-state.json` simultaneously. Use in-memory state as primary, flush to disk periodically (every 30 seconds or every 10 calls, whichever comes first). Accept potential last-write-wins in case of concurrent flushes.

6. **execution_log.jsonl empty**: Periodic scan should handle empty/missing file gracefully. Return empty results, not errors.

7. **Very long sessions**: For sessions > 100 calls, increase ring buffer size to 50 calls. For > 500 calls, truncate history and keep only last 100.

8. **Level 2 confirmation timeout**: If agent doesn't confirm within 5 calls, auto-resolve the drift and log it as "unconfirmed". Don't block indefinitely.

## 10. Performance Impact

| Operation | Overhead | Notes |
|-----------|----------|-------|
| Drift detection (real-time) | <1ms | In-memory ring buffer + rule matching |
| Intervention response generation | <0.5ms | Simple conditionals + template |
| Failure recording proposal | <1ms | No DB write, just in-memory flag |
| State persistence | ~5ms | Batch flush every 30s or 10 calls |
| Periodic scan | ~50ms | Once per hour, reads JSONL |

**Total overhead: <10ms per call** — fully acceptable for Render free tier.

## 11. Testing Strategy

1. **Unit tests**: Each module in isolation
   - `drift-detector.test.js`: Test each rule with mock call history
   - `intervention-engine.test.js`: Test each level with mock drift data
   - `auto-failure-recorder.test.js`: Test propose/confirm/reject flow

2. **Integration test**: Full flow through gateway
   - Simulate 5 tool calls with same error → verify retry spiral detected
   - Verify Level 2 intervention returned
   - Verify failure proposal included in response

3. **Manual test**: Deploy to Render, use real MCP client
   - Call tools intentionally causing failures
   - Verify drift warnings appear
   - Verify `get_drift_report` returns correct data

## 12. Deployment

- Render auto-deploys from GitHub main branch push
- No database schema changes needed
- New `data/drift-state.json` file created automatically on first call
- Cron job configured via GitHub Actions (`.github/workflows/drift-scan.yml`)

## 13. Rollback Plan

If issues arise:
1. Set `DRIFT_DETECTION_ENABLED=false` env var → disables all detection
2. Or revert the 3 modified files to previous version
3. No data loss — `drift-state.json` is ephemeral, `reasoning_objects` table unchanged

## 14. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| False positive rate | <10% | Manual review of drift alerts |
| Detection latency | <100ms | Time from tool call to drift detection |
| Agent adoption | >50% agents use `get_drift_report` | Tool call logs |
| Failure recording rate | >30% of failures recorded | Compare gateway failures vs recorded |
| Time saved per agent | >5 minutes/session | Compare before/after drift detection |
