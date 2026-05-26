#!/usr/bin/env node
// scripts/generate-agent-signature.js — Generate and verify X-Agent-Signature examples
// Usage: node scripts/generate-agent-signature.js <agent_id> [nonce]

const { generateSignature, verifySignature, SHARED_SECRET } = require('../lib/weak-auth');

const agentId = process.argv[2] || 'test-agent';
const nonce = process.argv[3] || '';
const timestamp = Date.now().toString();

console.log('SHARED_SECRET:', SHARED_SECRET ? '[present]' : '[missing]');
console.log('Agent ID:', agentId);
console.log('Timestamp:', timestamp);
console.log('Nonce:', nonce);

const signature = generateSignature(agentId, timestamp, nonce);
console.log('\nGenerated Signature:', signature);

// Simulate request headers
const fakeReq = {
  headers: {
    'x-agent-signature': signature,
    'x-agent-id': agentId,
    'x-agent-timestamp': timestamp,
    'x-agent-nonce': nonce
  }
};

const result = verifySignature(fakeReq);
console.log('\nVerification result:', result);

// Tamper test
const tamperedReq = { headers: { ...fakeReq.headers, 'x-agent-signature': signature.replace(/0/g, '1') } };
console.log('\nTampered verification:', verifySignature(tamperedReq));
