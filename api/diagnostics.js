// GET /api/diagnostics — served by a Vercel serverless function.
// Same shape as the Express handler in server.js, using the shared
// lib/diagnostics process probe, so the numbers describe this function
// runtime rather than the unreachable local Express process.
const { getProcessStats } = require('../lib/diagnostics');

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
  try {
    return res.status(200).json({ success: true, runtime: 'vercel-serverless', ...getProcessStats() });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
};
