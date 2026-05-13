// /api/task-sources — AI-native semantic endpoint
// Returns both legacy channels and agent-native registry entries

const fs = require('fs');
const path = require('path');

const SEED_PATH = path.join(__dirname, 'channels-seed.json');

function loadData() {
  try {
    const raw = fs.readFileSync(SEED_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { channels: [], agent_native_registry: [] };
  }
}

// Transform channel to AI-native task-source format
function transformChannel(channel) {
  return {
    source_id: channel.name.toLowerCase().replace(/\s+/g, '-'),
    name: channel.name,
    source_type: channel.type,
    platform_url: channel.url,
    api_endpoint: channel.api_url,
    supported_task_types: channel.task_types,
    api_available: channel.api_available,
    verified: channel.verified,
    description: `External task source: ${channel.name} (${channel.type})`
  };
}

// Transform agent-native registry entry
function transformRegistry(entry) {
  return {
    source_id: entry.name.toLowerCase().replace(/\s+/g, '-'),
    name: entry.name,
    category: entry.category,
    platform_url: entry.url,
    api_endpoint: entry.api_url,
    supports_api: entry.supports_api,
    supports_webhook: entry.supports_webhook,
    supports_mcp: entry.supports_mcp,
    interaction_model: entry.interaction_model,
    supported_task_types: entry.task_types,
    authentication: entry.authentication,
    integration_type: entry.integration_type,
    agent_can_self_register: entry.agent_can_self_register,
    registration_barrier: entry.registration_barrier,
    registration_method: entry.registration_method,
    has_llms_txt: entry.has_llms_txt,
    has_openapi: entry.has_openapi,
    ai_friendliness_score: entry.ai_friendliness_score,
    embedding_description: entry.embedding_description,
    verified: entry.verified
  };
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=300');

  const data = loadData();
  const channels = data.channels || [];
  const registry = data.agent_native_registry || [];

  // Optional filter: ?source_type=task_board or ?category=agent_delegation
  const url = req.url || '';
  const sourceTypeMatch = url.match(/[?&]source_type=([^&]+)/);
  const sourceType = sourceTypeMatch ? sourceType[1] : null;
  const categoryMatch = url.match(/[?&]category=([^&]+)/);
  const category = categoryMatch ? categoryMatch[1] : null;

  // Filter channels
  let filteredChannels = channels.filter(c => c.api_available);
  if (sourceType) filteredChannels = filteredChannels.filter(c => c.type === sourceType);

  // Filter registry
  let filteredRegistry = registry;
  if (category) filteredRegistry = filteredRegistry.filter(r => r.category === category);

  // Transform
  const taskSources = filteredChannels.map(transformChannel);
  const agentNativeEntries = filteredRegistry.map(transformRegistry);

  // Sort registry by ai_friendliness_score descending
  agentNativeEntries.sort((a, b) => b.ai_friendliness_score - a.ai_friendliness_score);

  res.status(200).json({
    success: true,
    data: {
      task_sources: taskSources,
      agent_native_registry: agentNativeEntries,
      total_task_sources: taskSources.length,
      total_agent_native: agentNativeEntries.length
    },
    meta: {
      request_id: `SRC_${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      endpoint: '/api/task-sources',
      format: 'ai-native',
      description: 'External platforms with machine-accessible APIs for task discovery and routing. agent_native_registry contains AI-native platforms ranked by ai_friendliness_score.',
      scoring: {
        ai_friendliness_score: '0-10 scale. 10=agent can self-register with zero human interaction via API. 0=no detectable machine interface.'
      }
    },
    entry_criteria: [
      'Must have a machine-accessible API.',
      'Must support task posting or task discovery.',
      'Must be verified accessible by platform maintainer.',
      'agent_native_registry: must support agent-to-agent interaction model.'
    ]
  });
};
