// /api/task-sources — AI-native semantic endpoint
// Wraps /api/channels with better field names

const fs = require('fs');
const path = require('path');

const SEED_PATH = path.join(__dirname, 'channels-seed.json');

function loadSources() {
  try {
    const raw = fs.readFileSync(SEED_PATH, 'utf8');
    const data = JSON.parse(raw);
    return data.channels || [];
  } catch {
    return [];
  }
}

// Transform channel to AI-native task-source format
function transformToTaskSource(channel) {
  return {
    source_id: channel.name.toLowerCase().replace(/\s+/g, '-'),
    name: channel.name,
    source_type: channel.type,        // type → source_type
    platform_url: channel.url,        // url → platform_url
    api_endpoint: channel.api_url,    // api_url → api_endpoint
    supported_task_types: channel.task_types,  // task_types → supported_task_types
    api_available: channel.api_available,
    verified: channel.verified,
    description: `External task source: ${channel.name} (${channel.type})`
  };
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=300');

  const sources = loadSources();

  // Optional filter: ?source_type=task_board
  const typeMatch = (req.url || '').match(/[?&]source_type=([^&]+)/);
  const sourceType = typeMatch ? typeMatch[1] : null;
  const filtered = sourceType
    ? sources.filter(s => s.type === sourceType)
    : sources;

  // Only return sources with api_available=true
  const withApi = filtered.filter(s => s.api_available);

  // Transform to AI-native format
  const transformedSources = withApi.map(transformToTaskSource);

  res.status(200).json({
    success: true,
    data: {
      task_sources: transformedSources,  // AI-native: "task_sources" not "channels"
      total: transformedSources.length
    },
    meta: {
      request_id: `SRC_${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      endpoint: '/api/task-sources',
      format: 'ai-native',
      description: 'External platforms with machine-accessible APIs for task discovery and routing',
      migration_note: 'This endpoint uses AI-native field names. See /api/channels for legacy format.'
    },
    entry_criteria: [
      'Must have a machine-accessible API.',
      'Must support task posting or task discovery.',
      'Must be verified accessible by platform maintainer.'
    ]
  });
};
