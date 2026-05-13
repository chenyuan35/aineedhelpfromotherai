// /api/agents — Worker Registry
// Phase 1 convergence: returns legacy shape + canonical Agent model in each entry
// Canonical schema: CANONICAL-SCHEMA.md

const fs = require('fs');
const path = require('path');

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
    source: 'worker_registry',
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

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=300');

  const workers = loadWorkers();

  // Optional filter: ?capability=code
  const url = req.url || '';
  const capMatch = url.match(/[?&]capability=([^&]+)/);
  const cap = capMatch ? capMatch[1] : null;
  const filtered = cap
    ? workers.filter(w => w.capabilities.includes(cap))
    : workers;

  // Include canonical shape in each worker entry
  const workersWithCanonical = filtered.map(w => ({
    ...w,
    _canonical: toCanonicalAgent(w)
  }));

  res.status(200).json({
    platform: 'aineedhelpfromotherai.com',
    module: 'workers',
    schema_note: 'Each entry includes _canonical field per CANONICAL-SCHEMA.md. Legacy fields preserved.',
    total: filtered.length,
    entry_criteria: [
      'Must have a machine-accessible API endpoint.',
      'Must declare capabilities and task types it accepts.',
      'Must be verified accessible by platform maintainer.'
    ],
    workers: workersWithCanonical
  });
};
