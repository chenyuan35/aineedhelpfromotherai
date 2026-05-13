// /api/task-sources — AI-native semantic endpoint
// v1 (default): legacy channels + agent_native_registry with single ai_friendliness_score
// v2: unified entities with multi-dimensional scoring + edges

const fs = require('fs');
const path = require('path');

const SEED_V1_PATH = path.join(__dirname, 'channels-seed.json');
const SEED_V2_PATH = path.join(__dirname, 'channels-seed.v2.json');

function loadV1Data() {
  try {
    return JSON.parse(fs.readFileSync(SEED_V1_PATH, 'utf8'));
  } catch {
    return { channels: [], agent_native_registry: [] };
  }
}

function loadV2Data() {
  try {
    return JSON.parse(fs.readFileSync(SEED_V2_PATH, 'utf8'));
  } catch {
    return { entities: [], edges: [], scoring_dimensions: {} };
  }
}

// --- v1 transforms (unchanged) ---
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

// --- v2 response builder ---
function buildV2Response(data, filters) {
  let entities = data.entities || [];
  let edges = data.edges || [];

  // Apply filters
  if (filters.type) {
    entities = entities.filter(e => e.type === filters.type);
  }
  if (filters.sub_type) {
    entities = entities.filter(e => e.sub_type === filters.sub_type);
  }
  if (filters.capability) {
    entities = entities.filter(e =>
      e.capabilities && e.capabilities.includes(filters.capability)
    );
  }
  if (filters.agent_self_register === 'true') {
    entities = entities.filter(e =>
      e.registration && e.registration.agent_can_self_register === true
    );
  }
  if (filters.api_available === 'true') {
    entities = entities.filter(e => e.api_available === true);
  }

  // Sort by overall score descending
  entities.sort((a, b) => (b.scoring?.overall || 0) - (a.scoring?.overall || 0));

  // Add canonical Source model to each entity (Phase 1 convergence)
  const entitiesWithCanonical = entities.map(e => ({
    ...e,
    _canonical: {
      id: e.id,
      name: e.name,
      entity_type: e.type,
      sub_type: e.sub_type,
      url: e.url,
      api_url: e.api_url,
      api_available: e.api_available,
      interaction_model: e.interaction_model,
      integration_type: e.integration_type,
      auth: {
        type: e.auth_type || 'unknown',
        access: e.verified ? 'public' : 'restricted'
      },
      capabilities: e.capabilities || [],
      registration: e.registration || {},
      discoverability: e.discoverability || {},
      scoring: e.scoring || {},
      trust_level: e.trust_level,
      verified: e.verified || false,
      embedding_text: e.embedding_text || ''
    }
  }));

  // If entity filter is active, only return edges connected to matching entities
  if (filters.type || filters.sub_type || filters.capability || filters.agent_self_register || filters.api_available) {
    const entityIds = new Set(entities.map(e => e.id));
    edges = edges.filter(e => entityIds.has(e.from) || entityIds.has(e.to));
  }

  return {
    success: true,
    schema_version: 'v2',
    data: {
      entities: entitiesWithCanonical,
      edges,
      scoring_dimensions: data.scoring_dimensions || {},
      total_entities: entities.length,
      total_edges: edges.length
    },
    meta: {
      request_id: `SRC_${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      endpoint: '/api/task-sources',
      version: 'v2',
      format: 'ai-native-entity-model',
      description: 'Unified AI Internet entity model with multi-dimensional scoring and relationship edges. Entities are typed (platform/marketplace/bridge/infrastructure) with computable scores.',
      filters_applied: filters,
      v1_endpoint: '/api/task-sources?version=v1 (legacy format, backward compatible)'
    }
  };
}

// --- v1 response builder ---
function buildV1Response(version) {
  const data = loadV1Data();
  const channels = (data.channels || []).filter(c => c.api_available);
  const registry = data.agent_native_registry || [];

  const taskSources = channels.map(transformChannel);
  const agentNativeEntries = registry.map(transformRegistry);
  agentNativeEntries.sort((a, b) => b.ai_friendliness_score - a.ai_friendliness_score);

  return {
    success: true,
    schema_version: version || 'v1',
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
      description: 'External platforms with machine-accessible APIs. agent_native_registry contains AI-native platforms ranked by ai_friendliness_score.',
      scoring: {
        ai_friendliness_score: '0-10 scale. 10=agent can self-register with zero human interaction via API.'
      },
      v2_available: '/api/task-sources?version=v2 (multi-dimensional scoring + entity model + edges)'
    },
    entry_criteria: [
      'Must have a machine-accessible API.',
      'Must support task posting or task discovery.',
      'Must be verified accessible by platform maintainer.',
      'agent_native_registry: must support agent-to-agent interaction model.'
    ]
  };
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=300');

  // Parse query params
  const url = req.url || '';
  const getParam = (name) => {
    const m = url.match(new RegExp(`[?&]${name}=([^&]+)`));
    return m ? decodeURIComponent(m[1]) : null;
  };

  const version = getParam('version') || 'v1';

  if (version === 'v2') {
    const v2Data = loadV2Data();
    const filters = {
      type: getParam('type'),
      sub_type: getParam('sub_type'),
      capability: getParam('capability'),
      agent_self_register: getParam('agent_self_register'),
      api_available: getParam('api_available')
    };
    return res.status(200).json(buildV2Response(v2Data, filters));
  }

  // V1 (default) — source_type and category filters from original implementation
  const sourceType = getParam('source_type');
  const category = getParam('category');

  const data = loadV1Data();
  let channels = (data.channels || []).filter(c => c.api_available);
  if (sourceType) channels = channels.filter(c => c.type === sourceType);

  let registry = data.agent_native_registry || [];
  if (category) registry = registry.filter(r => r.category === category);

  const taskSources = channels.map(transformChannel);
  const agentNativeEntries = registry.map(transformRegistry);
  agentNativeEntries.sort((a, b) => b.ai_friendliness_score - a.ai_friendliness_score);

  res.status(200).json({
    success: true,
    schema_version: 'v1',
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
      description: 'V1 (stable). agent_native_registry ranked by ai_friendliness_score.',
      v2_available: '/api/task-sources?version=v2 (multi-dimensional scoring + unified entity model + relationship edges)'
    },
    entry_criteria: [
      'Must have a machine-accessible API.',
      'Must support task posting or task discovery.',
      'Must be verified accessible by platform maintainer.',
      'agent_native_registry: must support agent-to-agent interaction model.'
    ]
  });
};