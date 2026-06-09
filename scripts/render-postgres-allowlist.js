#!/usr/bin/env node
const fs = require('fs');
const https = require('https');

const apiKey = process.env.RENDER_API_KEY;
const postgresId = process.env.RENDER_POSTGRES_ID || 'dpg-d8c164cua31s739joel0-a';
const stateFile = process.env.RENDER_ALLOWLIST_STATE || 'render-postgres-allowlist-state.json';
const mode = process.argv[2] || 'open';
const requestedIp = process.argv[3] || '';

function fail(message) {
  console.error(`[render-allowlist] ${message}`);
  process.exit(1);
}

function requestJson(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let text = '';
      res.on('data', (chunk) => {
        text += chunk;
      });
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`${options.method || 'GET'} ${url} returned ${res.statusCode}: ${text.slice(0, 300)}`));
          return;
        }
        try {
          resolve(text ? JSON.parse(text) : {});
        } catch (err) {
          reject(new Error(`Could not parse JSON from ${url}: ${err.message}`));
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getPublicIp() {
  const data = await requestJson('https://api.ipify.org?format=json');
  return data.ip;
}

async function getPostgres() {
  return requestJson(`https://api.render.com/v1/postgres/${postgresId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
  });
}

async function patchAllowList(ipAllowList) {
  return requestJson(
    `https://api.render.com/v1/postgres/${postgresId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    JSON.stringify({ ipAllowList })
  );
}

function normalize(list) {
  return (list || []).map((entry) => ({
    cidrBlock: entry.cidrBlock || entry.source,
    description: entry.description || '',
  })).filter((entry) => entry.cidrBlock);
}

async function openForRunner() {
  const ip = requestedIp || (await getPublicIp());
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) fail(`Invalid IPv4 address: ${ip}`);
  const current = await getPostgres();
  const before = normalize(current.ipAllowList || current.ip_allow_list);

  const cidrBlock = `${ip}/32`;
  const existedBefore = before.some((entry) => entry.cidrBlock === cidrBlock);
  fs.writeFileSync(stateFile, JSON.stringify({ cidrBlock, existedBefore }, null, 2));

  if (!existedBefore) {
    await patchAllowList([
      ...before,
      { cidrBlock, description: 'temporary GitHub Actions database backup' },
    ]);
  }

  console.log(`[render-allowlist] opened ${cidrBlock}; existed_before=${existedBefore}; previous_rules=${before.length}`);
}

async function closeForRunner() {
  if (!fs.existsSync(stateFile)) {
    console.log(`[render-allowlist] ${stateFile} missing; nothing to close`);
    return;
  }
  const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  if (!state.cidrBlock) fail(`${stateFile} does not contain cidrBlock`);

  if (state.existedBefore) {
    console.log(`[render-allowlist] leaving pre-existing ${state.cidrBlock}`);
    return;
  }

  const current = await getPostgres();
  const before = normalize(current.ipAllowList || current.ip_allow_list);
  const next = before.filter((entry) => entry.cidrBlock !== state.cidrBlock);
  if (next.length !== before.length) {
    await patchAllowList(next);
  }
  console.log(`[render-allowlist] closed ${state.cidrBlock}; previous_rules=${before.length}; next_rules=${next.length}`);
}

async function main() {
  if (!apiKey) fail('RENDER_API_KEY is not set');
  if (mode === 'open') {
    await openForRunner();
  } else if (mode === 'close' || mode === 'restore') {
    await closeForRunner();
  } else {
    fail('usage: render-postgres-allowlist.js open|close');
  }
}

main().catch((err) => fail(err.message));
