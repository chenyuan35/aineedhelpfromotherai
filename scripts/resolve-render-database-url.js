#!/usr/bin/env node
const fs = require('fs');
const { parse: parseQuery, stringify: stringifyQuery } = require('querystring');

function fail(message) {
  console.error(message);
  process.exit(1);
}

const envFile = process.argv[2] || 'render-env-vars.json';
const externalHost = process.env.RENDER_POSTGRES_EXTERNAL_HOST || '';
const githubEnv = process.env.GITHUB_ENV;

if (!githubEnv) fail('GITHUB_ENV is not set');
if (!fs.existsSync(envFile)) fail(`${envFile} does not exist`);

let payload;
try {
  payload = JSON.parse(fs.readFileSync(envFile, 'utf8'));
} catch (err) {
  fail(`Could not parse ${envFile}: ${err.message}`);
}

const items = Array.isArray(payload) ? payload : payload.envVars || payload.env_vars || [];
let databaseUrl = '';
for (const item of items) {
  const env = item.envVar || item.env_var || item;
  if (env.key === 'DATABASE_URL') {
    databaseUrl = env.value || '';
    break;
  }
}

if (!databaseUrl || databaseUrl.includes('*****')) {
  fail('Render DATABASE_URL was not available from the service env vars');
}

let parsed;
try {
  parsed = new URL(databaseUrl);
} catch (err) {
  fail(`Render DATABASE_URL is not a valid URL: ${err.message}`);
}

if (externalHost && parsed.hostname.startsWith('dpg-') && !parsed.hostname.includes('.render.com')) {
  parsed.hostname = externalHost;
  parsed.port = '5432';
}

const query = parseQuery(parsed.search ? parsed.search.slice(1) : '');
if (!query.sslmode) query.sslmode = 'require';
parsed.search = stringifyQuery(query);

const externalUrl = parsed.toString();
console.log(`::add-mask::${databaseUrl}`);
console.log(`::add-mask::${externalUrl}`);
fs.appendFileSync(githubEnv, `DATABASE_URL=${externalUrl}\n`);
