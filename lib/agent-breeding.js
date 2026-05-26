// lib/agent-breeding.js — Crossover evolution for agent prompt traits
// Combines prompt characteristics from multiple parent agents to create hybrids.
// Auto-evaluates hybrids and prunes underperformers.

const fs = require('fs');
const path = require('path');
const promptEvo = require('./prompt-evolution');

const BREEDING_PATH = path.join(__dirname, '..', 'data', 'agent-breeds.json');

function load() {
  try { if (fs.existsSync(BREEDING_PATH)) return JSON.parse(fs.readFileSync(BREEDING_PATH, 'utf8')); } catch {}
  return { breeds: [], generations: 0, updated_at: null };
}

function save(data) {
  try { const dir = path.dirname(BREEDING_PATH); if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(BREEDING_PATH, JSON.stringify(data, null, 2)); } catch {}
}

/** Breed two agents: cross their prompt traits */
function crossBreed(parentA, parentB, breedName) {
  // Get best variants for each parent
  const variantA = promptEvo.getBestVariant(parentA);
  const variantB = promptEvo.getBestVariant(parentB);
  if (!variantA && !variantB) return null;

  const a = variantA || { temperature: 0.5, max_hints: 2, verification: false, instructions: 'Default' };
  const b = variantB || { temperature: 0.5, max_hints: 2, verification: false, instructions: 'Default' };
  const gen = Math.max(a.mutation_generation || 1, b.mutation_generation || 1) + 1;

  // Crossover: mix traits from both parents
  const child = {
    instructions: `Hybrid of ${parentA} × ${parentB}: ${a.instructions?.slice(0, 40)} | ${b.instructions?.slice(0, 40)}`,
    temperature: (a.temperature + b.temperature) / 2 + (Math.random() - 0.5) * 0.2,
    max_hints: Math.round((a.max_hints + b.max_hints) / 2) + (Math.random() > 0.5 ? 1 : -1),
    verification: Math.random() > 0.5 ? a.verification : b.verification,
    ignore_low_score: Math.random() > 0.5 ? (a.ignore_low_score || false) : (b.ignore_low_score || false),
    retry_limit: Math.round((a.retry_limit || 2) + (b.retry_limit || 2)) / 2,
  };

  // Clamp
  child.temperature = Math.max(0, Math.min(1, Math.round(child.temperature * 10) / 10));
  child.max_hints = Math.max(0, Math.min(6, child.max_hints));

  const targetAgent = breedName || `breed-${parentA.slice(0, 8)}-${parentB.slice(0, 8)}`;

  // Store in prompt evolution as a new variant
  const data = load();
  if (!data.breeds[targetAgent]) data.breeds[targetAgent] = [];
  data.breeds[targetAgent].push({
    generation: gen,
    parents: [parentA, parentB],
    child_config: child,
    parent_variants: { a: a.name || 'default', b: b.name || 'default' },
    created_at: new Date().toISOString(),
    active: true,
    wins: 0, losses: 0, uses: 0,
  });
  data.generations = Math.max(data.generations, gen);
  save(data);

  return { agent_id: targetAgent, config: child, generation: gen };
}

/** Get all breeds */
function getBreeds() {
  const data = load();
  return data.breeds || {};
}

/** Mark a breed as pruned (underperforming) */
function pruneBreed(agentId, breedIndex, reason) {
  const data = load();
  const breeds = data.breeds[agentId];
  if (!breeds || !breeds[breedIndex]) return false;
  breeds[breedIndex].active = false;
  breeds[breedIndex].pruned_at = new Date().toISOString();
  breeds[breedIndex].prune_reason = reason;
  save(data);
  return true;
}

/** Auto-evolution: find best performing agents and breed them */
function autoEvolve(forceBreeds = 2) {
  const elo = require('./elo-rating');
  const lb = elo.getLeaderboard();

  // Top 25% agents
  const topCount = Math.max(2, Math.ceil(lb.length * 0.25));
  const topAgents = lb.slice(0, topCount);

  // Random pairings among top agents
  const breeds = [];
  const shuffled = [...topAgents].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(forceBreeds, Math.floor(shuffled.length / 2)); i++) {
    const a = shuffled[i * 2];
    const b = shuffled[i * 2 + 1];
    if (!a || !b) break;
    const result = crossBreed(a.agent_id, b.agent_id);
    if (result) breeds.push(result);
  }

  return breeds;
}

module.exports = { crossBreed, getBreeds, pruneBreed, autoEvolve };