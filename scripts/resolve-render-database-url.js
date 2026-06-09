#!/usr/bin/env node
const fs = require('fs');
const https = require('https');
const { parse: parseQuery, stringify: stringifyQuery } = require('querystring');

function fail(message) {
  console.error(message);
  process.exit(1);
}

const envFile = process.argv[2] || '';
const apiKey = process.env.RENDER_API_KEY || '';
const postgresId = process.env.RENDER_POSTGRES_ID || '';
const externalHost = process.env.RENDER_POSTGRES_EXTERNAL_HOST || '';
const githubEnv = process.env.GITHUB_ENV;

if (!githubEnv) fail('GITHUB_ENV is not set');

function requestJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers }, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`${url} returned ${res.statusCode}: ${body.slice(0, 200)}`));
            return;
          }
          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(new Error(`Could not parse JSON from ${url}: ${err.message}`));
          }
        });
      })
      .on('error', reject);
  });
}

async function getDatabaseUrl() {
  if (apiKey && postgresId) {
    const info = await requestJson(`https://api.render.com/v1/postgres/${postgresId}/connection-info`, {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    });
    if (info.internalConnectionString) console.log(`::add-mask::${info.internalConnectionString}`);
    if (info.externalConnectionString) console.log(`::add-mask::${info.externalConnectionString}`);
    if (info.psqlCommand) console.log(`::add-mask::${info.psqlCommand}`);
    if (info.password) console.log(`::add-mask::${info.password}`);
    return info.externalConnectionString || '';
  }

  if (!envFile || !fs.existsSync(envFile)) fail('Set RENDER_API_KEY and RENDER_POSTGRES_ID, or pass a Render env-vars JSON file');

  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(envFile, 'utf8'));
  } catch (err) {
    fail(`Could not parse ${envFile}: ${err.message}`);
  }

  const items = Array.isArray(payload) ? payload : payload.envVars || payload.env_vars || [];
  for (const item of items) {
    const env = item.envVar || item.env_var || item;
    if (env.key === 'DATABASE_URL') return env.value || '';
  }
  return '';
}

async function main() {
  const databaseUrl = await getDatabaseUrl();
  if (!databaseUrl || databaseUrl.includes('*****')) {
    fail('Render DATABASE_URL was not available');
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
  console.log(`[resolve-render-database-url] host=${parsed.hostname} database=${parsed.pathname.replace(/^\//, '') || '<none>'} user=${parsed.username || '<none>'}`);
  fs.appendFileSync(githubEnv, `DATABASE_URL=${externalUrl}\n`);
}

main().catch((err) => fail(err.message));
