// lib/fs-safe.js — Safe file operations with write-authority enforcement
// All runtime file writes should use this module instead of raw fs methods.
// Bypassing this module is a write-authority violation.

const fs = require('fs');
const path = require('path');
const writeAuthority = require('./write-authority');
const writeQueue = require('./write-queue');
const commitLog = require('./commit-log');
const { isAllowedPath, FILE_ALLOWLIST } = require('./write-levels');

const RUNTIME_DATA_DIR = path.resolve(__dirname, '..', 'data');

// Per-file capability tokens — registered at boot.
// Each runtime data file gets its own WRITE + APPEND capability.
// This prevents capability leakage across files: if one cap is compromised,
// only its corresponding file is at risk.
const __FILES_CAP = {};
const __FILES_APPEND = {};

function registerCapabilities(registerFn) {
  for (const fileName of FILE_ALLOWLIST) {
    __FILES_CAP[fileName] = {};
    __FILES_APPEND[fileName] = {};
    registerFn(__FILES_CAP[fileName]);
    registerFn(__FILES_APPEND[fileName]);
  }
}

function getCap(filePath, capMap) {
  const basename = path.basename(path.resolve(filePath));
  return capMap[basename];
}

function assertInRuntimeData(filePath) {
  if (!isAllowedPath(filePath)) {
    const resolved = path.resolve(filePath);
    const err = new Error('Write to unknown runtime data file: ' + resolved);
    err.code = 'WRITE_NOT_IN_ALLOWLIST';
    throw err;
  }
}

function writeJSON(filePath, data) {
  assertInRuntimeData(filePath);
  const cap = getCap(filePath, __FILES_CAP);
  writeAuthority.authorizeWrite(cap);
  commitLog.commit(cap, { type: 'fs_safe/write_json', source: 'fs-safe', payload: { file: path.basename(filePath), keys: Array.isArray(data) ? data.length : Object.keys(data).length } }, filePath);
  return writeQueue.enqueue(filePath, () => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const tmpPath = filePath + '.fs-safe.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpPath, filePath);
    return data;
  });
}

function appendJSONL(filePath, entry) {
  assertInRuntimeData(filePath);
  const cap = getCap(filePath, __FILES_APPEND);
  writeAuthority.authorizeWrite(cap);
  commitLog.commit(cap, { type: 'fs_safe/append_jsonl', source: 'fs-safe', payload: { file: path.basename(filePath) } }, filePath);
  return writeQueue.enqueue(filePath, () => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(filePath, JSON.stringify(entry) + '\n', 'utf8');
    return entry;
  });
}

function readJSON(filePath) {
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {}
  return null;
}

function readJSONL(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean).map(l => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
}

function atomicWrite(filePath, content) {
  assertInRuntimeData(filePath);
  const cap = getCap(filePath, __FILES_CAP);
  writeAuthority.authorizeWrite(cap);
  commitLog.commit(cap, { type: 'fs_safe/atomic_write', source: 'fs-safe', payload: { file: path.basename(filePath) } }, filePath);
  return writeQueue.enqueue(filePath, () => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const tmpPath = filePath + '.fs-safe.tmp';
    fs.writeFileSync(tmpPath, content, 'utf8');
    fs.renameSync(tmpPath, filePath);
  });
}

function appendJSONL(filePath, entry) {
  writeAuthority.authorizeWrite(APPEND_CAP);
  assertInRuntimeData(filePath);
  // Rule A: same-queue ordering
  commitLog.commit(APPEND_CAP, { type: 'fs_safe/append_jsonl', source: 'fs-safe', payload: { file: path.basename(filePath) } }, filePath);
  return writeQueue.enqueue(filePath, () => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(filePath, JSON.stringify(entry) + '\n', 'utf8');
    return entry;
  });
}

function readJSON(filePath) {
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {}
  return null;
}

function readJSONL(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean).map(l => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
}

function atomicWrite(filePath, content) {
  writeAuthority.authorizeWrite(WRITE_CAP);
  assertInRuntimeData(filePath);
  commitLog.commit(WRITE_CAP, { type: 'fs_safe/atomic_write', source: 'fs-safe', payload: { file: path.basename(filePath) } }, filePath);
  return writeQueue.enqueue(filePath, () => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const tmpPath = filePath + '.fs-safe.tmp';
    fs.writeFileSync(tmpPath, content, 'utf8');
    fs.renameSync(tmpPath, filePath);
  });
}

module.exports = {
  writeJSON,
  appendJSONL,
  readJSON,
  readJSONL,
  atomicWrite,
  registerCapabilities,
  RUNTIME_DATA_DIR,
};
