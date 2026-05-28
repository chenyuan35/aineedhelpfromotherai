// lib/architect-agent.js — Recursive Agent Profile Designer
// Analyzes tournament data + world model to design new resolver profiles.
// Generates experiment configs and auto-registers them for deployment.

const fs = require('fs');
const path = require('path');
const elo = require('./elo-rating');

const ARCHIVES_PATH = path.join(__dirname, '..', 'data', 'architect-designs.json');
const EXPERIMENTS_PATH = path.join(__dirname, '..', 'data', 'active-experiments.json');

function loadArchives() {
  try { if (fs.existsSync(ARCHIVES_PATH)) return JSON.parse(fs.readFileSync(ARCHIVES_PATH, 'utf8')); } catch {}
  return { designs: [], generations: 0, updated_at: null };
}

function saveArchives(data) {
  try { const dir = path.dirname(ARCHIVES_PATH); if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(ARCHIVES_PATH, JSON.stringify(data, null, 2)); } catch {}
}

function loadExperiments() {
  try { if (fs.existsSync(EXPERIMENTS_PATH)) return JSON.parse(fs.readFileSync(EXPERIMENTS_PATH, 'utf8')); } catch {}
  return { experiments: [] };
}

function saveExperiments(data) {
  try { fs.writeFileSync(EXPERIMENTS_PATH, JSON.stringify(data, null, 2)); } catch {}
}

const TRAIT_TEMPLATES = {
  fast: { max_hints: [0, 1, 2], verification: [false], temperature: [0.7, 0.8, 0.9], retry_limit: [1], ignore_low_score: [false] },
  careful: { max_hints: [3, 4, 5], verification: [true], temperature: [0.1, 0.2, 0.3], retry_limit: [2, 3], ignore_low_score: [false] },
  skeptic: { max_hints: [2, 3], verification: [true], temperature: [0.2, 0.3, 0.4], retry_limit: [2], ignore_low_score: [true] },
  minimal: { max_hints: [0], verification: [false], temperature: [0.5], retry_limit: [1], ignore_low_score: [false] },
};

/** Analyze which traits correlate with success */
function analyzeWinningTraits() {
  const dominance = elo.getTaskDominance();
  const traits = {};

  for (const [category, data] of Object.entries(dominance)) {
    if (!data.best_agent) continue;
    const agent = data.best_agent;
    // Extract profile from agent name
    const profile = agent.includes('fast') ? 'fast' : agent.includes('careful') ? 'careful' : agent.includes('skeptic') ? 'skeptic' : agent.includes('minimal') ? 'minimal' : 'experimental';
    if (!traits[category]) traits[category] = {};
    if (!traits[category][profile]) traits[category][profile] = 0;
    traits[category][profile] += data.best_rating;
  }

  // Pick best profile per category
  const bestFor = {};
  for (const [cat, profs] of Object.entries(traits)) {
    const sorted = Object.entries(profs).sort((a, b) => b[1] - a[1]);
    bestFor[cat] = { best_profile: sorted[0]?.[0], best_rating: sorted[0]?.[1], runners_up: sorted.slice(1, 3).map(s => s[0]) };
  }

  return { best_for_category: bestFor, trait_templates: TRAIT_TEMPLATES };
}

/** Design a new agent profile by combining traits from multiple categories */
function designAgent(targetCategory, baseProfile, fuseCategory, generation) {
  const analysis = analyzeWinningTraits();
  const baseTraits = TRAIT_TEMPLATES[baseProfile] || TRAIT_TEMPLATES.fast;
  let fuseTraits = TRAIT_TEMPLATES[analysis.best_for_category[fuseCategory]?.best_profile] || TRAIT_TEMPLATES.careful;

  // Crossover trait values
  const design = {
    name: `architect-${baseProfile}-${fuseCategory}-v${generation}`,
    base_profile: baseProfile,
    fuse_category: fuseCategory,
    generation: generation || 1,
    config: {
      max_hints: fuseTraits.max_hints[0] || baseTraits.max_hints[0],
      verification: baseTraits.verification[0] && fuseTraits.verification[0],
      temperature: Math.round(((baseTraits.temperature[0] + fuseTraits.temperature[0]) / 2) * 10) / 10,
      retry_limit: Math.max(baseTraits.retry_limit[0] || 1, fuseTraits.retry_limit[0] || 1),
      ignore_low_score: fuseTraits.ignore_low_score[0] || false,
    },
    target_category: targetCategory,
    designed_at: new Date().toISOString(),
    status: 'pending', // pending → active → evaluated → pruned
  };

  // Register as experiment
  const exps = loadExperiments();
  exps.experiments.push({ ...design, deployed: false });
  saveExperiments(exps);

  return design;
}

/** Batch-design new agents based on world model gaps */
function batchDesign(generation) {
  const analysis = analyzeWinningTraits();
  const designs = [];
  const gen = generation || (loadArchives().generations + 1);

  // For each weak category, design a hybrid agent
  for (const [category, best] of Object.entries(analysis.best_for_category)) {
    const baseProfile = best.best_profile || 'fast';
    // Cross with the next best profile for the same category
    const runnerUp = best.runners_up?.[0];
    if (runnerUp && runnerUp !== baseProfile) {
      designs.push(designAgent(category, baseProfile, category, gen));
    }
    // Also design against opposite categories (e.g., fast for infra_debugging)
    const weakCategories = Object.entries(analysis.best_for_category)
      .filter(([c, d]) => d.best_profile !== baseProfile)
      .slice(0, 1);
    for (const [weakCat] of weakCategories) {
      designs.push(designAgent(weakCat, baseProfile, weakCat, gen));
    }
  }

  // Archive the batch
  const archives = loadArchives();
  archives.generations = gen;
  archives.designs.push({
    batch: gen,
    ts: new Date().toISOString(),
    count: designs.length,
    designs: designs.map(d => ({ name: d.name, target: d.target_category, config: d.config })),
  });
  saveArchives(archives);

  return designs;
}

/** Get pending experiments ready for deployment */
function getPendingExperiments() {
  const exps = loadExperiments();
  return exps.experiments.filter(e => !e.deployed && e.status === 'pending');
}

/** Mark an experiment as deployed */
function markDeployed(name) {
  const exps = loadExperiments();
  const exp = exps.experiments.find(e => e.name === name);
  if (!exp) return false;
  exp.deployed = true;
  exp.deployed_at = new Date().toISOString();
  exp.status = 'active';
  saveExperiments(exps);
  return true;
}

module.exports = { analyzeWinningTraits, designAgent, batchDesign, getPendingExperiments, markDeployed };