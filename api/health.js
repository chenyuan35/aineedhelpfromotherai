// GET /api/health — served by a Vercel serverless function.
// The public /api/* surface used to proxy to the local Express runtime
// through a Cloudflare tunnel; the tunnel cannot run from the current host,
// so the read-only status endpoints are served here instead.
// Shape matches the Express handler in server.js.
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  return res.status(200).json({
    status: 'ok',
    runtime: 'vercel-serverless',
    timestamp: new Date().toISOString(),
  });
};
