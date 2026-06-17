const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'https://aineedhelpfromotherai.com';
const API_URL = process.env.API_URL || 'https://api.aineedhelpfromotherai.com';

const DISCOVERY = Object.freeze({
  site: SITE_URL,
  api: API_URL,
  health: `${API_URL}/api/health`,
  status: `${API_URL}/api/status`,
  schema: `${API_URL}/api/schema`,
  openapi: `${SITE_URL}/openapi.json`,
  llms_txt: `${SITE_URL}/llms.txt`,
  ai_txt: `${SITE_URL}/ai.txt`,
  failure_index: `${SITE_URL}/failure-index.json`,
  cases: `${SITE_URL}/cases/`,
  learn: `${SITE_URL}/learn/`,
  api_docs: `${SITE_URL}/api/docs/`,
  sitemap: `${SITE_URL}/sitemap.xml`,
  feed: `${SITE_URL}/feed.xml`,
  mcp_server_card: `${SITE_URL}/.well-known/mcp`,
  mcp_verify: `${API_URL}/mcp/verify`,
  agent_card: `${SITE_URL}/.well-known/agent-card.json`,
  api_manifest: `${API_URL}/api/manifest`,
});

function getOpenApiPathCount(specPath = path.join(__dirname, '..', 'openapi.json')) {
  try {
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    return Object.keys(spec.paths || {}).length;
  } catch {
    return null;
  }
}

function getDiscoveryUrlCount() {
  return new Set(Object.values(DISCOVERY).filter(value => /^https?:\/\//.test(value))).size;
}

module.exports = {
  SITE_URL,
  API_URL,
  DISCOVERY,
  getOpenApiPathCount,
  getDiscoveryUrlCount,
};
