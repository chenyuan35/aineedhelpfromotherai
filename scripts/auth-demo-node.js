#!/usr/bin/env node
require('dotenv').config();
const { spawnSync } = require('child_process');

async function main() {
  const agent = process.argv[2] || 'demo-agent';
  const host = process.argv[3] || 'http://localhost:3000';

  // Use the JSON generator to ensure consistent signature logic
  const node = spawnSync('node', ['scripts/generate-agent-signature-json.js', agent], { encoding: 'utf8' });
  const out = node.stdout || '';
  if (!out) {
    console.error('Failed to generate signature JSON:', node.stderr);
    process.exit(1);
  }

  // The generator prints JSON; take the last JSON-looking line
  const lines = out.trim().split(/\r?\n/);
  const jsonLine = lines.reverse().find(l => l.trim().startsWith('{'));
  if (!jsonLine) {
    console.error('No JSON line found in output:', out);
    process.exit(1);
  }

  let data;
  try { data = JSON.parse(jsonLine); } catch (e) { console.error('JSON parse error', e); process.exit(1); }

  const { signature, timestamp } = data;
  console.log('Signature:', signature);
  console.log('Timestamp:', timestamp);
  console.log('\nExample curl:');
  console.log(`curl -i -X GET '${host}/mcp' -H 'X-Agent-Signature: ${signature}' -H 'X-Agent-Id: ${agent}' -H 'X-Agent-Timestamp: ${timestamp}'`);

  // Do the HTTP request using global fetch (Node 18+)
  try {
    const res = await fetch(`${host}/mcp`, { method: 'GET', headers: { 'X-Agent-Signature': signature, 'X-Agent-Id': agent, 'X-Agent-Timestamp': timestamp } });
    console.log(`HTTP/${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(text);
  } catch (err) {
    console.error('Request failed:', err.message || err);
    process.exit(1);
  }
}

main();
