import fs from 'node:fs';
import os from 'node:os';
import assert from 'node:assert/strict';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const staging = path.join(repo, 'data/phone/staging/global-inventory-2026-09-26.jsonl');
const rows = fs.readFileSync(staging, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
assert.equal(rows.length, 59);
assert.ok(!rows.some(x => ['DROP','EVIDENCE_SCAN'].includes(x.inventoryStatus)));
assert.equal(rows.find(x => x.recordId === 'tello-paygo-credit-2026')?.validationState, 'blocked');
assert.equal(rows.find(x => x.recordId === 'hotlink-pantas-365-pass-2026')?.validationState, 'blocked');
assert.equal(rows.find(x => x.recordId === 'telstra-prepaid-longexpiry-2026')?.researchPriority, 'P4-high-cost-reference');
assert.equal(rows.find(x => x.recordId === 'clubsim-sms-pack-6hkd-2026')?.researchPriority, 'P1-low-cost-retention');
const build = fs.readFileSync(path.join(repo, 'scripts/build-phone-database.mjs'), 'utf8');
assert.ok(build.includes("path.join(repo, 'data/phone/v1')"));
assert.ok(!build.includes('data/phone/staging'));
assert.ok(!build.includes('data/phone/inbox'));
const canonical = JSON.parse(fs.readFileSync(path.join(repo, 'data/phone/v1/routes.json'), 'utf8'));
const reviewedOverlap = JSON.parse(fs.readFileSync(path.join(repo, 'data/phone/review-packets/clubsim-sms-pack-6hkd-2026.json'), 'utf8'));
assert.ok(canonical.some(x => x.id === 'clubsim-sms-pack-6hkd-2026'), 'reviewed ClubSIM migration must reach canonical routes');
assert.equal(reviewedOverlap.reviewState, 'approved-backstage', 'staging overlap may reach canonical only through reviewed admission');
assert.equal(reviewedOverlap.route.id, 'clubsim-sms-pack-6hkd-2026');

const legacyDir = path.join(repo, 'frontend/tools/phone-number-lifecycle-mvp');
const manifest = JSON.parse(fs.readFileSync(path.join(legacyDir, 'batch-admission-manifest.json'), 'utf8'));
assert.equal(manifest.schemaVersion, 1);
assert.equal(manifest.state, 'reviewed-legacy-admission');
assert.ok(Array.isArray(manifest.admittedBatches) && manifest.admittedBatches.length > 0);
assert.deepEqual(manifest.admittedBatches, [...manifest.admittedBatches].sort(), 'admitted legacy batches must be review-stable and sorted');
assert.equal(new Set(manifest.admittedBatches).size, manifest.admittedBatches.length, 'admitted legacy batches must be unique');
for (const name of manifest.admittedBatches) assert.ok(fs.existsSync(path.join(legacyDir, name)), `admitted legacy batch missing: ${name}`);
for (const name of ['merge-global-directory.py', 'merge-batches-into-catalog.py']) {
  const source = fs.readFileSync(path.join(legacyDir, name), 'utf8');
  assert.match(source, /from batch_admission import admitted_batch_paths/, `${name} must use the explicit admission helper`);
  assert.doesNotMatch(source, /glob\.(?:glob|iglob)/, `${name} must not discover batch files by wildcard`);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'phone-batch-admission-'));
try {
  fs.writeFileSync(path.join(tmp, 'batch-admission-manifest.json'), JSON.stringify({
    schemaVersion: 1,
    state: 'reviewed-legacy-admission',
    admittedBatches: ['reviewed-batch.json']
  }));
  fs.writeFileSync(path.join(tmp, 'reviewed-batch.json'), '{}');
  fs.writeFileSync(path.join(tmp, 'qwen-raw-batch.json'), '{}');
  const python = process.platform === 'win32' ? 'python' : 'python3';
  const probe = spawnSync(python, ['-c',
    'import json, os, sys; sys.path.insert(0, sys.argv[1]); from batch_admission import admitted_batch_paths; print(json.dumps([os.path.basename(x) for x in admitted_batch_paths(sys.argv[2])]))',
    legacyDir, tmp
  ], { encoding: 'utf8' });
  assert.equal(probe.status, 0, probe.stderr || 'batch admission helper probe failed');
  assert.deepEqual(JSON.parse(probe.stdout.trim()), ['reviewed-batch.json'], 'unlisted/raw batch must stay outside the admitted comparison inputs');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

const globalDirectory = JSON.parse(fs.readFileSync(path.join(legacyDir, 'global-directory.json'), 'utf8'));
assert.ok(globalDirectory.routes.length >= 135, `current broad comparison coverage shrank: ${globalDirectory.routes.length}`);
console.log(`Phone candidate pipeline tests passed: ${rows.length} staged routes cannot feed the canonical builder directly; reviewed overlaps require explicit packets; ${manifest.admittedBatches.length} legacy batches explicitly admitted; ${globalDirectory.routes.length} comparison routes preserved.`);
