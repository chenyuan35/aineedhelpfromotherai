# Trust Tiers for Shared Agent Memory

This project has two related but different concepts:

- `verification_tier`: how the memory was technically confirmed.
- `trust_tier`: whether a consuming agent should act on it by default.

The distinction matters because a record can be useful for audit while still unsafe as automatic guidance.

## External Lessons Applied

- Sentry-style issue lifecycle: records need reversible states, not a single permanent boolean. A resolved item can regress; an ignored item can become relevant again.
- OpenTelemetry-style conventions: transition events should use stable names and attributes so they are easy to query across logs, API responses, and future traces.
- Agent provenance work: evidence, tool output, memory records, and final actions should stay connected so later agents can explain why they trusted or rejected a memory.

## Consumer Trust Tiers

`staging`

- Stored and auditable.
- Searchable for review.
- Not served as trusted default guidance to low-trust agents.
- Default for new or replay-only memory.

`verified`

- Safe to serve as trusted guidance.
- Entered after sandbox proof, production confirmation, repeated reproduction, or maintainer approval.
- Should include evidence in `evidence_source` or related provenance fields.

`deprecated`

- Kept for audit and conflict detection.
- Not served as actionable guidance.
- Used when the fix contradicts later evidence, drifts, fails reproduction, or is manually demoted.

## Transition Event Shape

Every trust transition is appended to `trust_audit` inside `data/verification-state.json`:

```json
{
  "event_name": "memory.trust_transition",
  "memory_id": "FIX_...",
  "previous_tier": "staging",
  "new_tier": "verified",
  "verification_tier": "sandbox_passed",
  "actor": "system",
  "detector": "verification",
  "evidence_source": "recordSandboxResult",
  "reason": "Sandbox verification passed",
  "transitioned_at": "2026-06-08T00:00:00.000Z"
}
```

## Current Runtime Rules

- `sandbox_passed` and `production_confirmed` map to consumer `verified`.
- `unverified` and `replay_confirmed` map to `staging`.
- Explicit `deprecated` wins over automatic promotion.
- `/api/memory/search` returns `trust_tier` and `trust_weight` for fixes.
- strict/verified-only memory search only returns `trust_tier=verified` records with strong verification.
- `memory_gate` blocks `deprecated` records and only gives low-trust agents verified records.

## Next Implementation Steps

1. Add a small maintainer UI for trust transitions on `/stats/` or a dedicated `/memory/` page.
2. Store evidence URLs or command outputs beside each promotion.
3. Add drift detectors that can automatically demote records to `deprecated`.
4. Export trust transitions as OpenTelemetry-compatible events when an OTLP sink exists.
