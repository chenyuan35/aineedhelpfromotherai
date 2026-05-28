// lib/write-queue.js — Per-path serial write queue
// All writes to the same file path are serialized (executed one at a time).
// Writes to different paths can proceed concurrently.
// This prevents race conditions like append() vs compact() on the same log file.
// 
// IMPORTANT SEMANTICS:
// - Per-path granularity: each file path has its own promise chain.
//   Same-path writes are ordered. Different-path writes are concurrent.
// - No cross-file atomicity: a write to commit-log.jsonl and a write to
//   execution_log.jsonl are on different queues — they can interleave.
//   If you need ordering between two different files, use enqueue() on
//   a shared key or the commit-log's queueKey parameter (Rule A).
// - Rule A uses commit-log's queueKey=filePath to ensure the commit event
//   is flushed before the caller's write to the same file. Both run on
//   the caller's per-path queue chain, not the commit-log's queue.

const writesInFlight = {};

function enqueue(filePath, fn) {
  if (!writesInFlight[filePath]) {
    writesInFlight[filePath] = Promise.resolve();
  }
  writesInFlight[filePath] = writesInFlight[filePath].then(fn, fn);
  return writesInFlight[filePath];
}

function hasPending(filePath) {
  return !!writesInFlight[filePath];
}

module.exports = { enqueue, hasPending };
