// /api/reasoning — Reasoning Object API handler
// POST /api/reasoning/search — Search reasoning objects
// POST /api/reasoning/resolve — Reasoning cache: find best matching solution (cache hit/miss)
// POST /api/reasoning/failure-check — Pre-execution failure early warning
// GET /api/reasoning/:id — Get full reasoning object
// GET /api/reasoning?problem_id=xxx — Get by problem
// GET /api/reasoning/failures?type=xxx — Browse failures
// POST /api/reasoning — Create/update reasoning object
// GET /api/reasoning/stats — Stats
// POST /api/reasoning/:id/verify — Verify a reasoning object
// GET /api/reasoning/:id/verifications — Get verifications
// POST /api/reasoning/:id/cite — Add a citation
// GET /api/reasoning/:id/citations — Get citations
// GET /api/reasoning/recommend — Recommend reasoning objects for a task
// GET /api/reasoning/recent — Get recently active reasoning objects
// GET /api/reasoning/tags — Get popular tags
// GET /api/reasoning/trending — Get trending reasoning objects (quality + activity)

const reasoning = require('../lib/reasoning-storage');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const method = req.method;
  const url = req.url || '';

  // Parse path segments
  const pathParts = url.split('?')[0].split('/').filter(Boolean);
  // Expected: /api/reasoning or /api/reasoning/search or /api/reasoning/failures or /api/reasoning/stats or /api/reasoning/:id

  const getParam = (name) => {
    const m = url.match(new RegExp(`[?&]${name}=([^&]+)`));
    return m ? decodeURIComponent(m[1]) : null;
  };

  try {
    // GET /api/reasoning/stats
    if (pathParts[pathParts.length - 1] === 'stats') {
      if (method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      const stats = await reasoning.getReasoningStats();
      return res.status(200).json({
        success: true,
        data: stats,
        meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
      });
    }

    // GET /api/reasoning/failures?type=xxx
    if (pathParts[pathParts.length - 1] === 'failures') {
      if (method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      const failureType = getParam('type');
      if (!failureType) return res.status(400).json({ error: 'Missing ?type= parameter' });
      const failures = await reasoning.getFailures(failureType, parseInt(getParam('limit')) || 50);
      return res.status(200).json({
        success: true,
        data: { failure_type: failureType, results: failures, total: failures.length },
        meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
      });
    }

    // GET /api/reasoning/recommend?domain=xxx&difficulty=xxx&limit=5
    if (pathParts[pathParts.length - 1] === 'recommend') {
      if (method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      const recommendations = await reasoning.recommendForTask({
        domain: getParam('domain'),
        difficulty: getParam('difficulty'),
        limit: parseInt(getParam('limit')) || 5
      });
      return res.status(200).json({
        success: true,
        data: { recommendations, total: recommendations.length },
        meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
      });
    }

    // GET /api/reasoning/recent?limit=10
    if (pathParts[pathParts.length - 1] === 'recent') {
      if (method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      const recent = await reasoning.getRecentlyActive(parseInt(getParam('limit')) || 10);
      return res.status(200).json({
        success: true,
        data: { recent, total: recent.length },
        meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
      });
    }

    // GET /api/reasoning/tags?limit=20
    if (pathParts[pathParts.length - 1] === 'tags') {
      if (method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      const tags = await reasoning.getPopularTags(parseInt(getParam('limit')) || 20);
      return res.status(200).json({
        success: true,
        data: { tags, total: tags.length },
        meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
      });
    }

    // GET /api/reasoning/trending?limit=10
    if (pathParts[pathParts.length - 1] === 'trending') {
      if (method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      const trending = await reasoning.getTrending(parseInt(getParam('limit')) || 10);
      return res.status(200).json({
        success: true,
        data: { trending, total: trending.length },
        meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
      });
    }

    // POST /api/reasoning/search
    if (pathParts[pathParts.length - 1] === 'search') {
      if (method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      let body = {};
      if (req.body) {
        body = req.body;
      } else {
        let data = '';
        for await (const chunk of req) data += chunk;
        if (data) body = JSON.parse(data);
      }
      const results = await reasoning.searchReasoning(body);
      return res.status(200).json({
        success: true,
        data: { results, total: results.length },
        meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
      });
    }

    // POST /api/reasoning/resolve — Reasoning cache layer
    if (pathParts[pathParts.length - 1] === 'resolve') {
      if (method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      let body = {};
      if (req.body) {
        body = req.body;
      } else {
        let data = '';
        for await (const chunk of req) data += chunk;
        if (data) body = JSON.parse(data);
      }
      if (!body.problem_statement) {
        return res.status(400).json({ error: 'Missing required field: problem_statement' });
      }
      const result = await reasoning.resolveReasoning(body);
      return res.status(200).json({
        success: true,
        data: result,
        meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
      });
    }

    // POST /api/reasoning/failure-check — Pre-execution failure early warning
    if (pathParts[pathParts.length - 1] === 'failure-check') {
      if (method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      let body = {};
      if (req.body) {
        body = req.body;
      } else {
        let data = '';
        for await (const chunk of req) data += chunk;
        if (data) body = JSON.parse(data);
      }
      if (!body.approach_description) {
        return res.status(400).json({ error: 'Missing required field: approach_description' });
      }
      const result = await reasoning.failureCheck(body);
      return res.status(200).json({
        success: true,
        data: result,
        meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
      });
    }

    // POST /api/reasoning — Create/update
    if (method === 'POST' && pathParts[pathParts.length - 1] === 'reasoning') {
      let body = {};
      if (req.body) {
        body = req.body;
      } else {
        let data = '';
        for await (const chunk of req) data += chunk;
        if (data) body = JSON.parse(data);
      }

      if (!body.id || !body.problem_id || !body.problem_statement) {
        return res.status(400).json({ error: 'Missing required fields: id, problem_id, problem_statement' });
      }

      await reasoning.saveReasoning(body);
      return res.status(201).json({
        success: true,
        data: { id: body.id, problem_id: body.problem_id },
        meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
      });
    }

    // GET /api/reasoning/:id
    if (pathParts.length >= 3 && pathParts[pathParts.length - 1] !== 'reasoning' && pathParts[pathParts.length - 1] !== 'verify' && pathParts[pathParts.length - 1] !== 'verifications' && pathParts[pathParts.length - 1] !== 'cite' && pathParts[pathParts.length - 1] !== 'citations') {
      if (method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      const id = pathParts[pathParts.length - 1];
      const ro = await reasoning.getReasoning(id);
      if (!ro) return res.status(404).json({ error: 'Reasoning object not found' });
      return res.status(200).json({
        success: true,
        data: ro,
        meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
      });
    }

    // POST /api/reasoning/:id/verify
    if (pathParts[pathParts.length - 1] === 'verify') {
      if (method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const id = pathParts[pathParts.length - 2];
      let body = {};
      if (req.body) {
        body = req.body;
      } else {
        let data = '';
        for await (const chunk of req) data += chunk;
        if (data) body = JSON.parse(data);
      }
      if (!body.verdict) return res.status(400).json({ error: 'Missing required field: verdict (verified/rejected/uncertain)' });
      const result = await reasoning.verifyReasoning(id, body);
      if (!result) return res.status(404).json({ error: 'Reasoning object not found' });
      return res.status(200).json({
        success: true,
        data: result,
        meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
      });
    }

    // GET /api/reasoning/:id/verifications
    if (pathParts[pathParts.length - 1] === 'verifications') {
      if (method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      const id = pathParts[pathParts.length - 2];
      const verifications = await reasoning.getVerifications(id);
      if (!verifications) return res.status(404).json({ error: 'Reasoning object not found' });
      return res.status(200).json({
        success: true,
        data: verifications,
        meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
      });
    }

    // POST /api/reasoning/:id/cite
    if (pathParts[pathParts.length - 1] === 'cite') {
      if (method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const id = pathParts[pathParts.length - 2];
      let body = {};
      if (req.body) {
        body = req.body;
      } else {
        let data = '';
        for await (const chunk of req) data += chunk;
        if (data) body = JSON.parse(data);
      }
      const result = await reasoning.addCitation(id, body);
      if (!result) return res.status(404).json({ error: 'Reasoning object not found' });
      return res.status(200).json({
        success: true,
        data: result,
        meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
      });
    }

    // GET /api/reasoning/:id/citations
    if (pathParts[pathParts.length - 1] === 'citations') {
      if (method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      const id = pathParts[pathParts.length - 2];
      const citations = await reasoning.getCitations(id);
      if (!citations) return res.status(404).json({ error: 'Reasoning object not found' });
      return res.status(200).json({
        success: true,
        data: citations,
        meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
      });
    }

    // GET /api/reasoning?problem_id=xxx or GET /api/reasoning (list)
    if (method === 'GET') {
      const problemId = getParam('problem_id');
      if (problemId) {
        const results = await reasoning.getByProblemId(problemId);
        return res.status(200).json({
          success: true,
          data: { problem_id: problemId, results, total: results.length },
          meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
        });
      }

      // List all (limited)
      const results = await reasoning.searchReasoning({ limit: parseInt(getParam('limit')) || 20 });
      return res.status(200).json({
        success: true,
        data: { results, total: results.length },
        meta: { request_id: `RSN_${Date.now().toString(36).toUpperCase()}`, timestamp: new Date().toISOString() }
      });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (err) {
    console.error('[reasoning] error:', err.message);
    return res.status(500).json({ error: err.message, success: false });
  }
};
