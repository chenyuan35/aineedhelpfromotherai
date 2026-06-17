// scripts/archive-auto-cases.js — one-shot migration
// Isolate synthetic FC_AUTO_* entries out of data/failure-cases.json into
// data/auto-generated-cases.json, leaving the curated real-only file behind.
// Source of these entries was disabled by commit 9c3db9d (2026-06-12); this
// only relocates the stranded back-catalogue. Data is preserved, not deleted.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const CASES_FILE = path.join(root, 'data', 'failure-cases.json');
const ARCHIVE_FILE = path.join(root, 'data', 'auto-generated-cases.json');

function isAuto(c) {
  return c?.source === 'daily-auto-generate' || String(c?.id || '').startsWith('FC_AUTO_');
}

// Dedup key: title + root_cause. FC_AUTO_MQ2J677A == FC_AUTO_MQ7W848N (npm peer dep).
function dedupKey(c) {
  return JSON.stringify([c.title || '', c.root_cause || '', c.fix || '']);
}

function main() {
  const before = JSON.parse(fs.readFileSync(CASES_FILE, 'utf8'));
  if (!Array.isArray(before)) throw new Error('failure-cases.json is not an array');

  const keep = [];
  const auto = [];
  for (const c of before) (isAuto(c) ? auto : keep).push(c);

  if (auto.length === 0) {
    console.log('[archive-auto-cases] No FC_AUTO entries found; nothing to do.');
    return;
  }

  // Dedup autos
  const seen = new Set();
  const dedupedAuto = [];
  const droppedDuplicates = [];
  for (const c of auto) {
    const key = dedupKey(c);
    if (seen.has(key)) {
      droppedDuplicates.push(c.id);
    } else {
      seen.add(key);
      dedupedAuto.push(c);
    }
  }

  // Write archive (sorted by added_at for readability)
  dedupedAuto.sort((a, b) => (a.added_at || '').localeCompare(b.added_at || ''));
  fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(dedupedAuto, null, 2) + '\n');

  // Rewrite curated file preserving original ordering of real cases
  fs.writeFileSync(CASES_FILE, JSON.stringify(keep, null, 2) + '\n');

  console.log('[archive-auto-cases] migration complete:');
  console.log('  before total:', before.length);
  console.log('  kept (real) :', keep.length, '-> failure-cases.json');
  console.log('  auto found  :', auto.length);
  console.log('  duplicates  :', droppedDuplicates.length, droppedDuplicates.join(', ') || '(none)');
  console.log('  archived    :', dedupedAuto.length, '-> auto-generated-cases.json');
}

main();
