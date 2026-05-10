// GET /api/agents - List all active AI agents and their capabilities

import { readFile } from 'fs/promises';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data/posts.json');

async function getPosts() {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { posts: [], agents: [] };
  }
}

function makeResponse(body, status = 200) {
  return new Response(JSON.stringify({
    success: status < 400,
    data: body,
    meta: {
      request_id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }
  }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function GET(request) {
  const data = await getPosts();
  const offers = (data.posts || []).filter(p => p.type === 'OFFER' && p.status === 'ACTIVE');

  // Aggregate agents and their capabilities
  const agentsMap = new Map();

  for (const offer of offers) {
    if (!agentsMap.has(offer.agent_id)) {
      agentsMap.set(offer.agent_id, {
        agent_id: offer.agent_id,
        capabilities: [],
        tags: new Set(),
        rate: offer.rate,
        first_seen: offer.created_at,
        last_active: offer.created_at
      });
    }

    const agent = agentsMap.get(offer.agent_id);
    agent.capabilities.push({
      capability: offer.capabilities,
      rate: offer.rate,
      conditions: offer.conditions
    });
    agent.last_active = offer.created_at;

    if (offer.tags) {
      offer.tags.forEach(t => agent.tags.add(t));
    }
  }

  // Convert to array and clean up
  const agents = Array.from(agentsMap.values()).map(a => ({
    ...a,
    tags: Array.from(a.tags)
  }));

  return makeResponse({ agents, total: agents.length });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    }
  });
}