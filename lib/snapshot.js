// lib/snapshot.js — Materialized-state snapshots from commit-log
// Snapshots store point-in-time copies of all runtime state files,
// tagged with the commit-log sequence number. Used for crash recovery:
// restore from snapshot, then replay events after that seq.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const SNAPSHOT_DIR = path.join(DATA_DIR, 'snapshots');
const SNAPSHOT_INTERVAL_EVENTS = parseInt(process.env.SNAPSHOT_INTERVAL_EVENTS || '500', 10);

// Files to include in each snapshot (L0 + L1 + L2 state, NOT commit-log)
const STATE_FILES = [
  'resolve-cache.json',
  'execution_log.jsonl',
  'memory-api-log.jsonl',
  'memory-api-log-compact.json',
  'verification-state.json',
  'elo-ratings.json',
];

// Get snapshot seq from directory name: snap-{seq}
function parseSnapDir(name) {
  const m = name.match(/^snap-(\d+)$/);
  return m ? parseInt(m[1], 10) : null;
}

// Find the latest snapshot directory seq number and path.
// Returns { seq, dir } or null if no snapshots exist.
function getLatestSnapshot() {
  if (!fs.existsSync(SNAPSHOT_DIR)) return null;
  let best = null;
  for (const entry of fs.readdirSync(SNAPSHOT_DIR)) {
    const seq = parseSnapDir(entry);
    if (seq !== null && (!best || seq > best.seq)) {
      best = { seq, dir: path.join(SNAPSHOT_DIR, entry) };
    }
  }
  return best;
}

// Take a point-in-time snapshot of all runtime state files.
// Records the current commit-log seq so we know where to replay from.
// Returns { seq, dir, files } or throws.
function takeSnapshot(commitLogSeq) {
  if (!fs.existsSync(SNAPSHOT_DIR)) fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });

  const snapDir = path.join(SNAPSHOT_DIR, 'snap-' + commitLogSeq);
  if (!fs.existsSync(snapDir)) fs.mkdirSync(snapDir, { recursive: true });

  // Write seq marker
  fs.writeFileSync(path.join(snapDir, '.seq'), String(commitLogSeq), 'utf8');

  let files = 0;
  for (const stateFile of STATE_FILES) {
    const src = path.join(DATA_DIR, stateFile);
    if (!fs.existsSync(src)) continue;
    const dst = path.join(snapDir, stateFile);
    fs.copyFileSync(src, dst);
    files++;
  }

  return { seq: commitLogSeq, dir: snapDir, files };
}

// Restore state files from a snapshot directory.
// Returns { seq, files } or throws.
function restoreSnapshot(snapDir) {
  if (!fs.existsSync(snapDir)) {
    throw Object.assign(new Error('Snapshot directory not found: ' + snapDir), { code: 'SNAPSHOT_NOT_FOUND' });
  }

  const seqPath = path.join(snapDir, '.seq');
  const seq = fs.existsSync(seqPath) ? parseInt(fs.readFileSync(seqPath, 'utf8').trim(), 10) : 0;

  let files = 0;
  for (const stateFile of STATE_FILES) {
    const src = path.join(snapDir, stateFile);
    if (!fs.existsSync(src)) continue;
    const dst = path.join(DATA_DIR, stateFile);
    if (!fs.existsSync(path.dirname(dst))) fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    files++;
  }

  return { seq, files };
}

// Rebuild state from scratch: replay all events from the commit log.
// This is used when no snapshot exists.
// Returns the number of events replayed.
function rebuildFromCommitLog(commitLog) {
  if (!fs.existsSync(commitLog.LOG_PATH)) return 0;
  // Delete existing state files so reducers start fresh
  for (const stateFile of STATE_FILES) {
    const p = path.join(DATA_DIR, stateFile);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  const result = commitLog.replay(0, { onEvent: (ev) => {} });
  return result.count;
}

// Delete old snapshots, keeping only the N most recent.
function pruneSnapshots(keep = 3) {
  if (!fs.existsSync(SNAPSHOT_DIR)) return [];
  const entries = fs.readdirSync(SNAPSHOT_DIR)
    .map(name => ({ name, seq: parseSnapDir(name) }))
    .filter(e => e.seq !== null)
    .sort((a, b) => b.seq - a.seq);

  const removed = [];
  for (let i = keep; i < entries.length; i++) {
    const p = path.join(SNAPSHOT_DIR, entries[i].name);
    fs.rmSync(p, { recursive: true, force: true });
    removed.push(p);
  }
  return removed;
}

// Automatic snapshot checker: call from a timer; takes a snapshot if
// enough events have passed since the last snapshot.
function shouldTakeSnapshot(commitLog, latestSnap) {
  const currentSeq = commitLog.getSeq();
  const lastSeq = latestSnap ? latestSnap.seq : 0;
  return (currentSeq - lastSeq) >= SNAPSHOT_INTERVAL_EVENTS;
}

module.exports = {
  takeSnapshot,
  restoreSnapshot,
  getLatestSnapshot,
  rebuildFromCommitLog,
  pruneSnapshots,
  shouldTakeSnapshot,
  SNAPSHOT_DIR,
  STATE_FILES,
};
