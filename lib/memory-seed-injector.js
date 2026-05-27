// lib/memory-seed-injector.js — Memory Seed → Resolve Cache injection
// Reads data/memory-seeds.json (from reality-to-eval) and loads into resolve-cache
// so agents benefit from harvested knowledge at runtime.

const resolveCache = require('./resolve-cache');
const converter = require('./reality-to-eval');

function injectAllSeeds() {
  const seeds = converter.loadMemorySeeds();
  if (!seeds || seeds.length === 0) return { injected: 0, skipped: 0, total: 0 };

  let injected = 0;
  let skipped = 0;

  for (const seed of seeds) {
    const seedId = seed.id || ('seed_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6));
    const existing = resolveCache.getHint(seedId);

    if (existing) {
      skipped++;
      continue;
    }

    resolveCache.setHint(seedId, {
      summary: seed.hint || seed.problem_snippet || '',
      solution: seed.hint || '',
      score: 0.9,
      status: 'active',
      verification_tier: seed.verification_tier || 'community_sourced',
      success_count: 0,
      failure_count: 0,
      citation_count: 0,
      tags: seed.tags || [],
      category: seed.category || 'unknown',
      environment: seed.environment || '',
      breakage_patterns: seed.breakage_patterns || [],
      source: seed.source || 'unknown',
      source_url: seed.source_url || '',
      agent_id: 'reality-pipeline',
      created_at: seed.created_at || new Date().toISOString(),
    });

    injected++;
  }

  return { injected, skipped, total: seeds.length, agent_id: 'reality-pipeline' };
}

function injectSeed(seed) {
  const seedId = seed.id || ('seed_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6));
  if (resolveCache.getHint(seedId)) return { injected: false, reason: 'already_exists' };
  resolveCache.setHint(seedId, {
    summary: seed.hint || seed.problem_snippet || '',
    solution: seed.hint || '',
    score: 0.9, status: 'active',
    verification_tier: seed.verification_tier || 'community_sourced',
    success_count: 0, failure_count: 0, citation_count: 0,
    tags: seed.tags || [], category: seed.category || 'unknown',
    environment: seed.environment || '',
    breakage_patterns: seed.breakage_patterns || [],
    source: seed.source || 'unknown', source_url: seed.source_url || '',
    agent_id: 'reality-pipeline',
    created_at: new Date().toISOString(),
  });
  return { injected: true, seed_id: seedId };
}

function getInjectorStats() {
  const health = resolveCache.getMemoryHealth();
  return {
    total_injected: health.active + health.decaying + health.quarantined + health.blacklisted,
    active: health.active,
    decaying: health.decaying,
    quarantined: health.quarantined,
    blacklisted: health.blacklisted,
    source: 'reality-pipeline',
  };
}

module.exports = { injectAllSeeds, injectSeed, getInjectorStats };
