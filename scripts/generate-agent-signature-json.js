#!/usr/bin/env node
// Suppress dotenv decorative output before requiring dotenv
process.stdout._origWrite = process.stdout._origWrite || process.stdout.write;
process.stdout.write = function() { return true; };
require('dotenv').config();
process.stdout.write = process.stdout._origWrite;
const { generateSignature } = require('../lib/weak-auth');

const agent = process.argv[2] || 'demo-agent';
const nonce = process.argv[3] || '';
const timestamp = Date.now().toString();
const signature = generateSignature(agent, timestamp, nonce);

console.log(JSON.stringify({ agent, timestamp, nonce, signature }));
