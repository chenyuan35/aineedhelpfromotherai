#!/usr/bin/env node
require('dotenv').config();
const { generateSignature } = require('../lib/weak-auth');

const agent = process.argv[2] || 'demo-agent';
const nonce = process.argv[3] || '';
const timestamp = Date.now().toString();
const signature = generateSignature(agent, timestamp, nonce);

console.log(JSON.stringify({ agent, timestamp, nonce, signature }));
