// /api/graph — AI Ecosystem Graph (dynamically generated from seed data)
// Not stored — computed on demand. Nodes = entities, edges = relationships.

const fs = require('fs');
const path = require('path');

const SEED_V2_PATH = path.join(__dirname, 'channels-seed.v2.json');

function loadSeed() {
  try {
    return JSON.parse(fs.readFileSync(SEED_V2_PATH, 'utf8'));
  } catch {
    return { entities: [], edges: [] };
  }
}

function buildGraph(data, query) {
  const entities = data.entities || [];
  const edges = data.edges || [];

  // Build nodes from entities
  const nodes = entities.map(e => ({
    id: e.id,
    name: e.name,
    type: e.type,
    sub_type: e.sub_type,
    url: e.url,
    api_available: e.api_available,
    overall_score: e.scoring?.overall || 0,
    trust_level: e.trust_level
  }));

  // Build edge list
  let graphEdges = edges.map(e => ({
    from: e.from,
    to: e.to,
    relationship: e.relationship,
    description: e.description
  }));

  // Apply query filters
  if (query) {
    // ?node=xxx — return subgraph centered on that node
    if (query.node) {
      const nodeId = query.node;
      graphEdges = graphEdges.filter(e => e.from === nodeId || e.to === nodeId);
      const connectedIds = new Set();
      graphEdges.forEach(e => { connectedIds.add(e.from); connectedIds.add(e.to); });
      graphEdges = graphEdges.filter(e => connectedIds.has(e.from) && connectedIds.has(e.to));

      return {
        query: `subgraph for "${nodeId}"`,
        nodes: nodes.filter(n => connectedIds.has(n.id)),
        edges: graphEdges
      };
    }

    // ?relationship=xxx — filter by relationship type
    if (query.relationship) {
      graphEdges = graphEdges.filter(e => e.relationship === query.relationship);
    }

    // ?type=xxx — filter node type (return subgraph of matching nodes)
    if (query.type) {
      const typeNodeIds = new Set(entities.filter(e => e.type === query.type).map(e => e.id));
      graphEdges = graphEdges.filter(e => typeNodeIds.has(e.from) && typeNodeIds.has(e.to));
    }
  }

  // After all edge filters, only return nodes that appear in remaining edges
  const activeIds = new Set();
  graphEdges.forEach(e => { activeIds.add(e.from); activeIds.add(e.to); });
  const activeNodes = nodes.filter(n => activeIds.has(n.id));

  return {
    nodes: activeNodes,
    edges: graphEdges
  };
}

// Query: which entities support a given capability?
function buildCapabilityQuery(data, capability) {
  const entities = (data.entities || []).filter(e =>
    e.capabilities && e.capabilities.includes(capability)
  );

  return entities.map(e => ({
    id: e.id,
    name: e.name,
    type: e.type,
    overall_score: e.scoring?.overall || 0,
    capabilities: e.capabilities
  }));
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=300');

  const url = req.url || '';
  const getParam = (name) => {
    const m = url.match(new RegExp(`[?&]${name}=([^&]+)`));
    return m ? decodeURIComponent(m[1]) : null;
  };

  const seed = loadSeed();

  // ?capability=xxx — discover which entities support a capability
  const capability = getParam('capability');
  if (capability) {
    const results = buildCapabilityQuery(seed, capability);
    return res.status(200).json({
      success: true,
      query: `capability:${capability}`,
      results,
      total: results.length,
      meta: {
        request_id: `GRPH_${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString()
      }
    });
  }

  // ?node=xxx — subgraph centered on a node
  // ?relationship=xxx — filter edges by relationship type
  // ?type=xxx — filter by node type
  const graph = buildGraph(seed, {
    node: getParam('node'),
    relationship: getParam('relationship'),
    type: getParam('type')
  });

  res.status(200).json({
    success: true,
    graph,
    meta: {
      request_id: `GRPH_${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      endpoint: '/api/graph',
      description: 'Dynamically generated AI ecosystem graph. Nodes = entities, edges = relationships. Not stored — computed on demand.',
      query_examples: [
        '/api/graph — full graph',
        '/api/graph?node=aineedhelpfromotherai — subgraph centered on this node',
        '/api/graph?relationship=supports — all capability edges',
        '/api/graph?type=platform — only platform-type nodes',
        '/api/graph?capability=delegation — entities supporting delegation'
      ]
    }
  });
};