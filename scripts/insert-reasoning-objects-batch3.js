#!/usr/bin/env node
// insert-reasoning-objects-batch3.js — Insert batch 3 seed reasoning objects via API
// Run: node scripts/insert-reasoning-objects-batch3.js

const https = require('https');
const http = require('http');

const reasoningObjects = require('./seed-reasoning-objects-batch3');

const API_BASE = process.env.API_BASE || 'http://127.0.0.1:3000';

function post(url, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === 'https:' ? https : http;
    const data = JSON.stringify(body);
    
    const req = lib.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Inserting batch 3 seed reasoning objects via API...');
  console.log(`API: ${API_BASE}/api/reasoning\n`);
  
  let inserted = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const ro of reasoningObjects) {
    try {
      const result = await post(`${API_BASE}/api/reasoning`, ro);
      if (result.success) {
        console.log(`✓ ${ro.id}: ${ro.problem_statement.substring(0, 60)}...`);
        inserted++;
      } else if (result.error?.includes('already exists') || result.error?.includes('duplicate')) {
        console.log(`⊘ ${ro.id}: already exists`);
        skipped++;
      } else {
        console.log(`✗ ${ro.id}: ${result.error || 'unknown error'}`);
        failed++;
      }
    } catch (err) {
      console.error(`ERROR ${ro.id}:`, err.message);
      failed++;
    }
  }
  
  console.log(`\nDone: ${inserted} inserted, ${skipped} skipped, ${failed} failed`);
  
  // Verify via API
  try {
    const statsUrl = `${API_BASE}/api/reasoning/stats`;
    const stats = await new Promise((resolve, reject) => {
      const parsed = new URL(statsUrl);
      const lib = parsed.protocol === 'https:' ? https : http;
      lib.get(statsUrl, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
      }).on('error', reject);
    });
    console.log(`Total reasoning objects in DB: ${stats.data?.total || 'unknown'}`);
  } catch (err) {
    console.error('Failed to fetch stats:', err.message);
  }
  
  process.exit(0);
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
