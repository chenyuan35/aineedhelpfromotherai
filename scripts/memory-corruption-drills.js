#!/usr/bin/env node
// scripts/memory-corruption-drills.js — Memory Corruption Stability Test
// Injects fake/stale/contradictory/poisoned hints into the resolve cache.
// Measures: quarantine rate, agent detection, cascade containment.
//
// Usage: node scripts/memory-corruption-drills.js
// Safe to run multiple times — generates new unique IDs each time.

const rc = require('../lib/resolve-cache');
const lineage = require('../lib/memory-lineage');
const fs = require('fs');
const path = require('path');

const DOMAINS = ['android', 'node', 'python', 'docker', 'kubernetes', 'linux', 'webpack', 'react', 'postgres'];
const REPORT_PATH = path.join(__dirname, '..', 'data', 'corruption-drill-report.json');

// --- Fake hint generators ---

function fakeHints(count) {
  const hints = {};
  for (let i = 0; i < count; i++) {
    const domain = DOMAINS[i % DOMAINS.length];
    const id = `CORRUPT-FAKE-${String(i + 1).padStart(4, '0')}`;
    hints[id] = {
      hit: true,
      reasoning_id: `RO_FAKE_${Date.now().toString(36).toUpperCase()}_${i}`,
      solution_summary: `FAKE: This is a fabricated solution for ${domain} issue #${i}. Do not trust.`,
      message: `Fabricated hint for stress testing — agent should detect and reject`,
      estimated_token_savings: 100 + Math.round(Math.random() * 900),
      domain,
      score: 0.9, // High score to look trustworthy
      status: 'active',
      success_count: 0, failure_count: 0, citation_count: 0,
      used_by: [], agent_stats: {},
      parent_reasoning_id: null,
      ancestor_task_ids: [],
      mutation_generation: 0,
      corruption_type: 'fake',
      drill_id: `DRILL-FAKE-${i}`,
      updated_at: new Date().toISOString(),
    };
  }
  return hints;
}

function staleHints(count) {
  const hints = {};
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const domain = DOMAINS[i % DOMAINS.length];
    const id = `CORRUPT-STALE-${String(i + 1).padStart(4, '0')}`;
    const ageDays = 30 + Math.round(Math.random() * 200);
    hints[id] = {
      hit: true,
      reasoning_id: `RO_STALE_${Date.now().toString(36).toUpperCase()}_${i}`,
      solution_summary: `STALE: Outdated solution for ${domain}: use legacy library v1.x (deprecated since ${Math.floor(ageDays / 30)} months ago).`,
      message: `Deliberately stale hint — references deprecated versions`,
      estimated_token_savings: 500 + Math.round(Math.random() * 500),
      domain,
      score: 0.6, // Medium-high score, looks plausible
      status: 'active',
      success_count: 0, failure_count: 0, citation_count: 0,
      used_by: [], agent_stats: {},
      parent_reasoning_id: null,
      ancestor_task_ids: [],
      mutation_generation: 3, // Looks established
      corruption_type: 'stale',
      stale_since_days: ageDays,
      drill_id: `DRILL-STALE-${i}`,
      updated_at: new Date(now - ageDays * 86400000).toISOString(),
    };
  }
  return hints;
}

function contradictoryHints(count) {
  const hints = {};
  const contradictions = [
    { a: 'Use npm install for all packages', b: 'Use yarn install exclusively — npm has known bugs' },
    { a: 'Set PostgreSQL max_connections=1000', b: 'Never exceed max_connections=200 for stability' },
    { a: 'Use React class components for performance', b: 'React functional components are always faster' },
    { a: 'Deploy with Docker compose in production', b: 'Use Kubernetes for production, Docker compose is dev-only' },
    { a: 'Pin all dependency versions for reproducibility', b: 'Always use ^ range for automatic security updates' },
  ];
  for (let i = 0; i < count; i++) {
    const pair = contradictions[i % contradictions.length];
    const isA = i % 2 === 0;
    const domain = DOMAINS[i % DOMAINS.length];
    const id = `CORRUPT-CONFLICT-${String(i + 1).padStart(4, '0')}`;
    hints[id] = {
      hit: true,
      reasoning_id: `RO_CONFLICT_${Date.now().toString(36).toUpperCase()}_${i}`,
      solution_summary: isA ? pair.a : pair.b,
      message: `Contradictory hint pair test — agent should detect inconsistency with counterpart`,
      estimated_token_savings: 400,
      domain,
      score: 0.8,
      status: 'active',
      success_count: 0, failure_count: 0, citation_count: 0,
      used_by: [], agent_stats: {},
      parent_reasoning_id: null,
      ancestor_task_ids: [],
      mutation_generation: 2,
      corruption_type: 'contradictory',
      contradictory_pair_id: `CONFLICT-PAIR-${Math.floor(i / 2)}`,
      drill_id: `DRILL-CONFLICT-${i}`,
      updated_at: new Date().toISOString(),
    };
  }
  return hints;
}

function poisonedLineage(count) {
  // Create chains of hints where each generation gets worse
  const chains = {};
  let total = 0;
  for (let chain = 0; chain < 5 && total < count; chain++) {
    const domain = DOMAINS[chain % DOMAINS.length];
    const genCount = Math.min(10, count - total);
    let parentId = null;
    let ancestorIds = [];

    for (let g = 0; g < genCount; g++) {
      const id = `CORRUPT-POISON-${String(total + 1).padStart(4, '0')}`;
      // Each generation gets progressively lower quality
      const qualityDegradation = 1.0 - (g / genCount) * 0.8;
      const isBad = g > genCount * 0.6; // last 40% are harmful

      chains[id] = {
        hit: true,
        reasoning_id: `RO_POISON_${Date.now().toString(36).toUpperCase()}_${total}`,
        solution_summary: isBad
          ? `POISONED: Malicious solution for ${domain} — recommends insecure configuration`
          : `Borderline solution for ${domain} — partially correct but missing context`,
        message: isBad ? `WARNING: Poisoned lineage — this hint will harm agents that use it` : `Low-quality memory in poisoned lineage chain ${chain}`,
        estimated_token_savings: Math.round(300 * qualityDegradation),
        domain,
        score: Math.round(qualityDegradation * 100) / 100,
        status: g < genCount * 0.6 ? 'active' : 'decaying',
        success_count: 0, failure_count: isBad ? 3 : 0, citation_count: 0,
        used_by: [], agent_stats: {},
        parent_reasoning_id: parentId,
        ancestor_task_ids: [...ancestorIds],
        mutation_generation: g + 1,
        corruption_type: 'poisoned',
        lineage_chain: chain,
        generation_in_chain: g,
        drill_id: `DRILL-POISON-${total}`,
        updated_at: new Date().toISOString(),
      };

      parentId = id;
      ancestorIds.push(id);
      total++;
    }
  }
  return chains;
}

// --- Injection ---

function injectHints(hints, label) {
  let count = 0;
  for (const [id, hint] of Object.entries(hints)) {
    rc.setHint(id, hint);
    count++;
  }
  console.log(`[corruption] Injected ${count} ${label} hints`);
  return count;
}

// --- Report ---

function generateReport(drillResults) {
  const health = rc.getMemoryHealth();
  const report = {
    ts: new Date().toISOString(),
    drill: drillResults,
    memory_health_after: health,
    quarantine_rate: health.quarantined > 0
      ? Math.round((health.quarantined / (health.active + health.decaying + health.quarantined + health.blacklisted)) * 10000) / 100
      : 0,
    cascade_detected: {},
  };

  // Check for cascades in poisoned lineage
  for (const [id, h] of Object.entries(rc.getAllHints())) {
    if (h.corruption_type === 'poisoned') {
      const cascade = lineage.detectCascade(id);
      if (cascade.cascade) {
        report.cascade_detected[id] = cascade;
      }
    }
  }

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`[corruption] Report written to ${REPORT_PATH}`);
  return report;
}

// --- MAIN ---

async function main() {
  console.log('[corruption] === MEMORY CORRUPTION DRILL ===');
  console.log('[corruption] This will inject fake, stale, contradictory, and poisoned hints.');

  // Record pre-drill memory health
  const beforeHealth = rc.getMemoryHealth();
  console.log('[corruption] Memory health before:', beforeHealth);

  // Generate and inject
  const drillResults = {};
  drillResults.fake = injectHints(fakeHints(200), 'fake');
  drillResults.stale = injectHints(staleHints(100), 'stale');
  drillResults.contradictory = injectHints(contradictoryHints(100), 'contradictory');
  drillResults.poisoned = injectHints(poisonedLineage(50), 'poisoned lineage');
  drillResults.total = Object.values(drillResults).reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0);

  console.log(`[corruption] Total injected: ${drillResults.total} corrupted hints`);

  // Generate report
  const report = generateReport(drillResults);
  console.log('[corruption] Post-drill memory health:', report.memory_health_after);
  console.log('[corruption] Quarantine rate:', report.quarantine_rate + '%');
  console.log('[corruption] Cascades detected:', Object.keys(report.cascade_detected).length);

  // Record extinction events for heavily poisoned hints
  for (const [id, h] of Object.entries(rc.getAllHints())) {
    if (h.corruption_type === 'poisoned' && h.generation_in_chain > 5) {
      lineage.recordExtinction(id, 'corruption_drill_poisoned', ['drill']);
    }
  }

  console.log('[corruption] === DRILL COMPLETE ===');
  console.log('[corruption] Agents will now encounter corrupted hints. Monitor quarantine rate at GET /api/lineage/forest');
}

main().catch(err => { console.error('[corruption] Fatal:', err); process.exit(1); });