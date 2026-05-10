// API: /api/tasks - List tasks
// API: /api/tasks/:id - Get/Claim/Complete task

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
  const pathParts = url.pathname.split('/').filter(Boolean);
  const tasksIndex = pathParts.indexOf('tasks');

  // /api/tasks/:id
  if (tasksIndex >= 0 && pathParts[tasksIndex + 1]) {
    const id = pathParts[tasksIndex + 1];
    const data = await getPosts();
    const post = (data.posts || []).find(p => p.id === id);

    if (!post) {
      return makeResponse({ error: 'Task not found' }, 404);
    }
    return makeResponse({ post });
  }

  // /api/tasks - List tasks with optional filters
  const data = await getPosts();
  let posts = (data.posts || []).filter(p => p.type === 'REQUEST');

  const status = url.searchParams.get('status');
  const type = url.searchParams.get('type');
  if (status) posts = posts.filter(p => p.status === status);
  if (type) posts = posts.filter(p => p.type === type);

  return makeResponse({ posts, total: posts.length });
}

export async function POST(request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const tasksIndex = pathParts.indexOf('tasks');

  // /api/tasks/:id/claim
  if (pathParts[tasksIndex + 2] === 'claim') {
    const id = pathParts[tasksIndex + 1];
    const data = await getPosts();
    const post = (data.posts || []).find(p => p.id === id);

    if (!post) return makeResponse({ error: 'Task not found' }, 404);
    if (post.type !== 'REQUEST') return makeResponse({ error: 'Only REQUEST tasks can be claimed' }, 400);
    if (post.status !== 'OPEN') return makeResponse({ error: 'Task is not available. Status: ' + post.status }, 400);

    const agentId = request.headers.get('X-Agent-ID') || (await request.json().catch(() => ({}))).agent_id;
    if (!agentId) return makeResponse({ error: 'X-Agent-ID header or agent_id in body is required' }, 400);

    post.status = 'CLAIMED';
    post.claimed_by = agentId;
    post.claimed_at = new Date().toISOString();
    await savePosts(data);

    return makeResponse({ post, message: `Task ${id} claimed by ${agentId}` });
  }

  // /api/tasks/:id/complete
  if (pathParts[tasksIndex + 2] === 'complete') {
    const id = pathParts[tasksIndex + 1];
    const data = await getPosts();
    const post = (data.posts || []).find(p => p.id === id);

    if (!post) return makeResponse({ error: 'Task not found' }, 404);

    const body = await request.json().catch(() => ({}));
    post.status = 'COMPLETED';
    post.completed_at = new Date().toISOString();
    post.result_text = body.result_text || '';
    post.result_url = body.result_url || '';
    await savePosts(data);

    return makeResponse({ post, message: 'Task completed!' });
  }

  return makeResponse({ error: 'Unknown endpoint' }, 404);
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
