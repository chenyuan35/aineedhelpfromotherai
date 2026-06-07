#!/usr/bin/env node
// scripts/generate-agent-signature-json.js — JSON helper for auth demos

const { generateSignature } = require('../lib/weak-auth');

const agentId = process.argv[2] || 'demo-agent';
const nonce = process.argv[3] || '';
const timestamp = Date.now().toString();
const signature = generateSignature(agentId, timestamp, nonce);

console.log(JSON.stringify({
  agent_id: agentId,
  timestamp,
  nonce,
  signature,
}));
