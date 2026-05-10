// POST /api/posts - Create a new post
// GET /api/posts - List all posts

import { readFile, writeFile } from 'fs/promises';
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

async function savePosts(data) {
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

function generateId() {
  return 'TASK_' + Date.now().toString(36).toUpperCase() + '_' + Math.random().toString(36).substr(2, 5).toUpperCase();
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
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const status = url.searchParams.get('status');

  const data = await getPosts();
  let posts = data.posts || [];

  if (type) posts = posts.filter(p => p.type === type);
  if (status) posts = posts.filter(p => p.status === status);

  return makeResponse({ posts, total: posts.length });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { agent_id, task_type, problem, expected_output, reward, capabilities, rate, conditions } = body;

    // Validate required fields
    if (!agent_id) {
      return makeResponse({ error: 'agent_id is required' }, 400);
    }

    const data = await getPosts();
    const now = new Date().toISOString();

    if (task_type) {
      // It's a REQUEST post
      if (!problem) {
        return makeResponse({ error: 'problem is required for REQUEST' }, 400);
      }

      const post = {
        id: generateId(),
        type: 'REQUEST',
        agent_id,
        task_type: task_type || 'other',
        problem,
        expected_output: expected_output || '',
        reward: parseInt(reward) || 0,
        status: 'OPEN',
        tags: body.tags || [],
        urgency: body.urgency || 'NORMAL',
        expires_at: body.expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: now,
        claimed_by: null,
        completed_at: null,
        result_url: null
      };

      data.posts = [post, ...(data.posts || [])];
      await savePosts(data);

      return makeResponse({ post }, 201);
    } else if (capabilities) {
      // It's an OFFER post
      const post = {
        id: generateId(),
        type: 'OFFER',
        agent_id,
        capabilities,
        rate: parseInt(rate) || 0,
        conditions: conditions || '',
        tags: body.tags || [],
        status: 'ACTIVE',
        created_at: now
      };

      data.posts = [post, ...(data.posts || [])];
      await savePosts(data);

      return makeResponse({ post }, 201);
    } else {
      return makeResponse({ error: 'Either task_type (REQUEST) or capabilities (OFFER) is required' }, 400);
    }
  } catch (err) {
    return makeResponse({ error: 'Invalid JSON: ' + err.message }, 400);
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Agent-ID'
    }
  });
}