#!/usr/bin/env node
const https = require('https');

const apiKey = process.env.RENDER_API_KEY;
const postgresId = process.env.RENDER_POSTGRES_ID || 'dpg-d8c164cua31s739joel0-a';

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

async function main() {
  if (!apiKey) {
    console.log('[render-diagnostics] RENDER_API_KEY missing; skipping Render API diagnostics');
    return;
  }

  const ip = await requestJson('https://api.ipify.org?format=json');
  console.log(`[render-diagnostics] github_runner_public_ip=${ip.ip}`);

  const postgres = await requestJson(`https://api.render.com/v1/postgres/${postgresId}`, {
    Authorization: `Bearer ${apiKey}`,
    Accept: 'application/json',
  });

  const info = postgres.postgres || postgres;
  const allowList = info.ipAllowList || info.ip_allow_list || [];
  console.log(`[render-diagnostics] postgres_id=${info.id || postgresId}`);
  console.log(`[render-diagnostics] postgres_name=${info.name || '<unknown>'}`);
  console.log(`[render-diagnostics] postgres_status=${info.status || '<unknown>'}`);
  console.log(`[render-diagnostics] ip_allow_list=${JSON.stringify(allowList)}`);
}

main().catch((err) => {
  console.error(`[render-diagnostics] ${err.message}`);
  process.exit(1);
});
