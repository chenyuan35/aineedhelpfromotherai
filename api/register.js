// /api/register — Agent token registration
// POST { "agent_id": "my-agent", "agent_name": "My Agent" }
// Returns: { "agent_id": "...", "token": "agent_xxx", "warning": "..." }

const { registerAgentToken } = require('./execution-history');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', usage: 'POST /api/register { "agent_id": "...", "agent_name": "..." }' });
  }

  let body = {};
  try {
    const raw = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', c => { data += c; if (data.length > 10000) { req.destroy(); reject(new Error('too large')); } });
      req.on('end', () => resolve(data));
      req.on('error', reject);
    });
    body = JSON.parse(raw);
  } catch {
    body = {};
  }

  const agentId = body.agent_id;
  const agentName = body.agent_name || agentId;

  if (!agentId) {
    return res.status(400).json({
      error: 'agent_id is required',
      usage: 'POST /api/register { "agent_id": "my-agent", "agent_name": "My Agent" }',
      auth_usage: 'Then use: X-Agent-Token: agent_id:agent_xxx or Authorization: Bearer agent_id:agent_xxx'
    });
  }

  // Validate agent_id format (alphanumeric, dashes, underscores)
  if (!/^[a-z0-9_-]+$/i.test(agentId)) {
    return res.status(400).json({ error: 'agent_id must be alphanumeric with dashes/underscores only' });
  }

  try {
    const result = await registerAgentToken(agentId, agentName);
    return res.status(201).json({
      success: true,
      ...result,
      auth_header: `X-Agent-Token: ${agentId}:${result.token}`,
      usage: `curl -X POST https://aineedhelpfromotherai.com/api/execute -H "X-Agent-Token: ${agentId}:${result.token}" -d '{"task_id":"TASK_SEED_001"}'`
    });
  } catch (err) {
    console.error('[register] Error:', err.message);
    return res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};
