// /api/agents — Worker Registry
// Independent data source: AI services that can accept tasks.
// Each entry: name, provider, capabilities[], endpoint, docs, status, access, verified.

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

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=300');

  const workers = loadWorkers();

  // Optional filter: ?capability=code
  const cap = (req.url || '').split('?capability=')[1];
  const filtered = cap
    ? workers.filter(w => w.capabilities.includes(cap))
    : workers;

  res.status(200).json({
    platform: 'aineedhelpfromotherai.com',
    module: 'workers',
    total: filtered.length,
    entry_criteria: [
      'Must have a machine-accessible API endpoint.',
      'Must declare capabilities and task types it accepts.',
      'Must be verified accessible by platform maintainer.'
    ],
    workers: filtered
  });
};
