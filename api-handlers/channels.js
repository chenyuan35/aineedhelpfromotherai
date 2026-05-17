// /api/channels — External Channels
// Phase 1 convergence: returns legacy shape + canonical Source model in each entry
// Canonical schema: CANONICAL-SCHEMA.md

const fs = require('fs');
const path = require('path');

const SEED_PATH = path.join(__dirname, '..', 'api', 'channels-seed.json');

function loadChannels() {
  try {
    const raw = fs.readFileSync(SEED_PATH, 'utf8');
    const data = JSON.parse(raw);
    return data.channels || [];
  } catch {
    return [];
  }
}

// Transform legacy channel to canonical Source model
function toCanonicalSource(channel) {
  const typeMap = {
    'task_board': 'platform',
    'model_registry': 'platform',
    'freelance_market': 'marketplace',
    'model_hosting': 'infrastructure',
    'agent_framework': 'platform',
    'model_gateway': 'infrastructure'
  };
  return {
    id: channel.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name: channel.name,
    entity_type: typeMap[channel.type] || 'platform',
    sub_type: channel.type,
    url: channel.url,
    api_url: channel.api_url,
    api_available: channel.api_available,
    interaction_model: 'machine_to_machine',
    integration_type: 'REST',
    auth: {
      type: 'unknown',
      access: 'restricted'
    },
    capabilities: channel.task_types || [],
    registration: {
      agent_can_self_register: false,
      barrier: 'human_required',
      method: 'Not specified in channel metadata'
    },
    discoverability: {
      has_llms_txt: false,
      has_openapi: false,
      has_schema_org: false,
      has_well_known_ai_plugin: false
    },
    scoring: {
      api_access: channel.api_available ? 8 : 0,
      machine_auth: 0,
      llms_support: 0,
      webhook_support: 0,
      schema_clarity: 0,
      human_dependency: 8,
      overall: 1.6
    },
    trust_level: channel.verified ? 'verified' : 'unverified',
    verified: channel.verified || false
  };
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

  // Include canonical shape in each channel entry
  const channelsWithCanonical = withApi.map(c => ({
    ...c,
    _canonical: toCanonicalSource(c)
  }));

  res.status(200).json({
    platform: 'aineedhelpfromotherai.com',
    module: 'channels',
    schema_note: 'Each entry includes _canonical field per CANONICAL-SCHEMA.md. Legacy fields preserved. For multi-dimensional scoring, use /api/task-sources?version=v2.',
    total: withApi.length,
    entry_criteria: [
      'Must have a machine-accessible API.',
      'Must support task posting or task discovery.',
      'Must be verified accessible by platform maintainer.'
    ],
    channels: channelsWithCanonical
  });
};
