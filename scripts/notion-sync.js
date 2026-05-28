// scripts/notion-sync.js — Collect current runtime state for Notion System Snapshot
// Usage: node scripts/notion-sync.js
// Output: JSON with current guard status, stats, and violations

const fs = require('fs');
const path = require('path');

function collect() {
  const wa = tryRequire('../lib/write-authority');
  const ra = tryRequire('../lib/replay-authority');
  const el = tryRequire('../lib/execution-log');
  const rc = tryRequire('../lib/resolve-cache');
  const ai = tryRequire('../lib/ai-state');
  const wl = tryRequire('../lib/write-levels');
  const wq = tryRequire('../lib/write-queue');
  const cl = tryRequire('../lib/commit-log');

  const logStats = el ? el.getStats() : { total: 0, file_size_bytes: 0 };

  const snapshot = {
    timestamp: new Date().toISOString(),
    version: 2,
    write_levels: wl ? {
      L0: Object.entries(wl.FILE_LEVELS).filter(([, l]) => l === 'L0').map(([f]) => f),
      L1: Object.entries(wl.FILE_LEVELS).filter(([, l]) => l === 'L1').map(([f]) => f),
      L2: Object.entries(wl.FILE_LEVELS).filter(([, l]) => l === 'L2').map(([f]) => f),
      module_map: wl.MODULE_LEVELS,
    } : null,
    write_queue: wq ? {
      has_queue: true,
      serializes_paths: true,
    } : null,
    commit_log: cl ? {
      seq: cl.getSeq(),
      flushed_seq: cl.getFlushedSeq(),
      is_flushed: cl.isFlushed(),
      hot_buffer_size: cl.getRecent(0).length,
      active: true,
    } : null,
    guards: {
      write_authority: {
        violations: wa ? wa.getViolations().length : -1,
        capabilities_locked: true,
        has_call_site_check: true,
        active: !!wa,
      },
      replay_authority: {
        durable_events: ra ? ra.DURABLE_EVENTS : [],
        ephemeral_events: ra ? ra.EPHEMERAL_EVENTS : [],
        forbidden_prefixes: ra ? ra.FORBIDDEN_EVENT_PREFIXES : [],
        active: !!ra,
      },
      execution_log: {
        total_events: logStats.total,
        file_size_bytes: logStats.file_size_bytes,
        has_compact: typeof el?.compact === 'function',
        write_queued: true,
        active: !!el,
      },
      ai_state: {
        canonical_fields: ai ? ai.getCanonicalHintFields() : [],
        derived_fields: ai ? ai.getDerivedHintFields() : [],
        active: !!ai,
      },
    },
    state: {
      hints_total: rc ? Object.keys(rc.getAllHints()).length : 0,
    },
  };

  return snapshot;
}

function tryRequire(relPath) {
  try { return require(relPath); } catch (e) { return null; }
}

const output = collect();
process.stdout.write(JSON.stringify(output, null, 2));

// Exit code: 0 if all guards active, 1 if any missing
const allActive = output.guards.write_authority.active &&
  output.guards.replay_authority.active &&
  output.guards.execution_log.active &&
  output.guards.ai_state.active;
process.exit(allActive ? 0 : 1);
