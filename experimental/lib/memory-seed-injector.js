// experimental/lib/memory-seed-injector.js — READ-ONLY MODE
// Seed storage moved to experimental-only store. Does not mutate runtime resolve-cache.

const fs = require('fs');
const path = require('path');
const readOnlyCache = require('./read-only-cache');
const converter = require('./reality-to-eval');

const EXPERIMENTAL_SEEDS_PATH = path.join(__dirname, '..', 'data', 'experimental-seeds.json');

function loadExperimentalSeeds() {
  try { if (fs.existsSync(EXPERIMENTAL_SEEDS_PATH)) return JSON.parse(fs.readFileSync(EXPERIMENTAL_SEEDS_PATH, 'utf8')); } catch {}
  return {};
}

function saveExperimentalSeeds(seeds) {
  const dir = path.dirname(EXPERIMENTAL_SEEDS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(EXPERIMENTAL_SEEDS_PATH, JSON.stringify(seeds, null, 2));
}

function injectAllSeeds() {
  const seeds = converter.loadMemorySeeds();
  if (!seeds || seeds.length === 0) return { injected: 0, skipped: 0, total: 0 };

  const experimental = loadExperimentalSeeds();
  let injected = 0;
  let skipped = 0;

  for (const seed of seeds) {
    const seedId = seed.id || ('seed_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6));
    if (experimental[seedId]) { skipped++; continue; }

    experimental[seedId] = {
      summary: seed.hint || seed.problem_snippet || '',
      solution: seed.hint || '',
      score: 0.9,
      status: 'active',
      verification_tier: seed.verification_tier || 'community_sourced',
      tags: seed.tags || [],
      category: seed.category || 'unknown',
      environment: seed.environment || '',
      breakage_patterns: seed.breakage_patterns || [],
      source: seed.source || 'unknown',
      source_url: seed.source_url || '',
      agent_id: 'reality-pipeline',
      created_at: seed.created_at || new Date().toISOString(),
      experimental: true,
      note: 'Stored in experimental store. Not injected into runtime resolve-cache.',
    };
    injected++;
  }

  saveExperimentalSeeds(experimental);
  return { injected, skipped, total: seeds.length, agent_id: 'reality-pipeline', store: 'experimental-only', warning: 'Seeds stored in experimental store only. Not injected into runtime.' };
}

function injectSeed(seed) {
  const seedId = seed.id || ('seed_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6));
  const experimental = loadExperimentalSeeds();
  if (experimental[seedId]) return { injected: false, reason: 'already_exists' };

  experimental[seedId] = {
    summary: seed.hint || seed.problem_snippet || '',
    solution: seed.hint || '',
    score: 0.9, status: 'active',
    verification_tier: seed.verification_tier || 'community_sourced',
    tags: seed.tags || [],
    category: seed.category || 'unknown',
    environment: seed.environment || '',
    breakage_patterns: seed.breakage_patterns || [],
    source: seed.source || 'unknown',
    source_url: seed.source_url || '',
    agent_id: 'reality-pipeline',
    created_at: new Date().toISOString(),
    experimental: true,
  };
  saveExperimentalSeeds(experimental);
  return { injected: true, seed_id: seedId, store: 'experimental-only' };
}

function getInjectorStats() {
  const experimental = loadExperimentalSeeds();
  const total = Object.keys(experimental).length;
  return {
    total_injected: total,
    active: total,
    source: 'reality-pipeline',
    store: 'experimental-only',
    note: 'Experimental seeds stored separately from runtime resolve-cache.',
  };
}

module.exports = { injectAllSeeds, injectSeed, getInjectorStats };
