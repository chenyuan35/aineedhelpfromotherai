// /api/lifecycle — Task lifecycle query endpoint
// GET ?status=OPEN&status=STALE&fresh=true&limit=20

const { queryTaskLifecycle } = require('../lib/execution-history');
const { computeFreshnessScore, evaluateLifecycle, detectExpired } = require('../lib/lifecycle');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Agent-ID, X-Agent-Token, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const statuses = url.searchParams.getAll('status');
    const freshOnly = url.searchParams.get('fresh') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    // Query PG
    let records = [];
    for (const status of (statuses.length > 0 ? statuses : [null])) {
      const rows = await queryTaskLifecycle({ status, limit: 200, offset: 0 });
      records.push(...rows);
    }

    // If no PG records yet, return empty with hint
    if (records.length === 0) {
      return res.status(200).json({
        success: true,
        data: { tasks: [], total: 0 },
        meta: {
          endpoint: '/api/lifecycle',
          description: 'Task lifecycle tracker — freshness, stale, expired, archived',
          statuses: ['OPEN', 'EXECUTING', 'COMPLETED', 'FAILED', 'STALE', 'EXPIRED', 'ARCHIVED'],
          hint: 'Execute a task first via POST /api/execute to populate lifecycle data'
        }
      });
    }

    // Apply fresh filter (freshness_score > 0.5)
    if (freshOnly) {
      records = records.filter(r => {
        const score = r.metrics?.freshness_score;
        return score != null && score > 0.5;
      });
    }

    // Apply limit/offset
    const total = records.length;
    records = records.slice(offset, offset + limit);

    res.status(200).json({
      success: true,
      data: {
        tasks: records,
        total
      },
      meta: {
        endpoint: '/api/lifecycle',
        timestamp: new Date().toISOString(),
        filters: { statuses, fresh: freshOnly, limit, offset },
        statuses: ['OPEN', 'EXECUTING', 'COMPLETED', 'FAILED', 'STALE', 'EXPIRED', 'ARCHIVED']
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
