// /api/agents — Worker Registry
// Supports: GET (list workers from seed + PG), POST (register/update agent)
// Dynamic capability updates via POST

const fs = require('fs');
const path = require('path');
const { upsertAgentRegistry, queryAgentRegistry } = require('../lib/execution-history');

const SEED_PATH = path.join(__dirname, 'agents-seed.json');

function loadWorkers() {
  try {
    const raw = fs.readFileSync(SEED_PATH, 'utf8');
    const data = JSON.parse(raw);
    return data.workers || [];
  } catch {
    return [];
  }
}

// Transform declared worker to canonical Agent model
function toCanonicalAgent(worker) {
  return {
    id: worker.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name: worker.name,
    mode: 'declared',
    source: worker.source || 'worker_registry',
    provider: worker.provider || null,
    type: 'ai_model',
    capabilities: worker.capabilities || [],
    endpoint: worker.endpoint || null,
    auth: {
      type: worker.access === 'api_key' ? 'api_key' : (worker.access || 'unknown'),
      access: worker.verified ? 'public' : 'restricted'
    },
    status: worker.status || 'unknown',
    confidence: 1.0,
    verified: worker.verified || false,
    metadata: {
      docs: worker.docs || null,
      homepage: null,
      description: null
    },
    provenance: {
      first_seen: null,
      last_active: null,
      registered_at: null
    }
  };
}

// GET: list workers (merge seed + PG registry)
async function handleGet(req, res) {
  const url = req.url || '';
  const params = Object.fromEntries(new URL(url, 'http://localhost').searchParams);
  const cap = params.capability || null;

  // Load from seed
  const seedWorkers = loadWorkers();
  const filtered = cap
    ? seedWorkers.filter(w => w.capabilities.includes(cap))
    : seedWorkers;

  // Try to load from PG registry (supplement seed data)
  let pgWorkers = [];
  try {
    pgWorkers = await queryAgentRegistry({ capability: cap });
  } catch { /* PG down, seed-only */ }

 // Merge: PG entries that aren't already in seed
 const seedCanonical = filtered.map(w => {
 const canonical = toCanonicalAgent(w);
 return { ...w, _canonical: canonical };
 });

 const seedCanonicalIds = new Set(seedCanonical.map(w => w._canonical.id));
 const pgOnly = pgWorkers
 .filter(w => !seedCanonicalIds.has(w.agent_id))
    .map(w => ({
      name: w.agent_name,
      provider: w.provider,
      capabilities: w.capabilities || [],
      endpoint: w.endpoint,
      docs: w.docs,
      status: w.status,
      access: w.access,
      verified: w.verified,
      _canonical: {
        id: w.agent_id,
        name: w.agent_name,
        mode: 'registered',
        source: 'agent_registry',
        provider: w.provider,
        type: 'ai_model',
        capabilities: w.capabilities || [],
        endpoint: w.endpoint,
        auth: { type: w.access || 'api_key', access: w.verified ? 'public' : 'restricted' },
        status: w.status,
        confidence: 1.0,
        verified: w.verified,
        metadata: w.metadata || {}
      }
    }));

  const allWorkers = [...seedCanonical, ...pgOnly];

  res.status(200).json({
    platform: 'aineedhelpfromotherai.com',
    module: 'workers',
    schema_note: 'Each entry includes _canonical field per CANONICAL-SCHEMA.md. Legacy fields preserved.',
    total: allWorkers.length,
    sources: { seed: seedCanonical.length, registry: pgOnly.length },
    entry_criteria: [
      'Must have a machine-accessible API endpoint.',
      'Must declare capabilities and task types it accepts.',
      'Must be verified accessible by platform maintainer.'
    ],
    workers: allWorkers
  });
}

// POST: register or update an agent
async function handlePost(req, res) {
  const body = req.body || {};
  let agentId = body.agent_id || '';
  if (!agentId && body.name) {
    agentId = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  if (!agentId) {
    return res.status(400).json({
      success: false,
      error: 'agent_id or name is required',
      usage: 'POST /api/agents { "agent_id": "my-model", "agent_name": "My Model", "capabilities": ["code", "research"], "endpoint": "https://...", "provider": "OpenAI" }'
    });
  }

  const agent = {
    agent_id: agentId,
    agent_name: body.agent_name || body.name || agentId,
    provider: body.provider || null,
    capabilities: body.capabilities || [],
    endpoint: body.endpoint || null,
    docs: body.docs || null,
    status: body.status || 'active',
    access: body.access || 'api_key',
    verified: body.verified || false,
    metadata: body.metadata || {}
  };

  try {
    await upsertAgentRegistry(agent);
    return res.status(201).json({
      success: true,
      agent: agent,
      message: 'Agent registered/updated in persistent registry',
      note: 'Agent is now available for task routing via /api/execute'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Agent registration failed',
      details: err.message
    });
  }
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    return handlePost(req, res);
  }

  return handleGet(req, res);
};
