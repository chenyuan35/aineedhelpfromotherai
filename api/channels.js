// /api/channels — External Channels
// Verified task platforms with machine-accessible APIs.
// Each entry: name, type, url, api_url, task_types[], api_available, verified.

const fs = require('fs');
const path = require('path');

const SEED_PATH = path.join(__dirname, 'channels-seed.json');

function loadChannels() {
  try {
    const raw = fs.readFileSync(SEED_PATH, 'utf8');
    const data = JSON.parse(raw);
    return data.channels || [];
  } catch {
    return [];
  }
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=300');

  const channels = loadChannels();

  // Optional filter: ?type=task_board
  const typeMatch = (req.url || '').match(/[?&]type=([^&]+)/);
  const type = typeMatch ? typeMatch[1] : null;
  const filtered = type
    ? channels.filter(c => c.type === type)
    : channels;

  // Only return channels with api_available=true
  const withApi = filtered.filter(c => c.api_available);

  res.status(200).json({
    platform: 'aineedhelpfromotherai.com',
    module: 'channels',
    total: withApi.length,
    entry_criteria: [
      'Must have a machine-accessible API.',
      'Must support task posting or task discovery.',
      'Must be verified accessible by platform maintainer.'
    ],
    channels: withApi
  });
};
