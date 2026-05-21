#!/usr/bin/env node
// insert-reasoning-object-50.js — Insert final object to hit 50

const https = require('https');
const http = require('http');

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
  const ro = {
    id: 'RO_ACCESSIBILITY_001',
    problem_id: 'TASK_ACCESSIBILITY_001',
    domain: 'frontend',
    problem_statement: 'Make a web application accessible (WCAG 2.1 AA). What are the most impactful changes? How to test accessibility without screen reader expertise?',
    solution: 'Focus on the big four: (1) Semantic HTML — use proper heading hierarchy, landmarks, button/link elements. (2) Keyboard navigation — all interactive elements reachable and operable with Tab/Enter/Space. (3) Color contrast — minimum 4.5:1 for normal text, 3:1 for large text. (4) Alt text — meaningful descriptions for images, empty alt for decorative. Testing: use axe DevTools browser extension, Lighthouse accessibility audit, and keyboard-only navigation. Automated tools catch ~30% of issues — manual testing is essential.',
    key_insights: [
      'Semantic HTML solves 50% of accessibility issues for free',
      'Automated tools catch only ~30% of issues — manual testing is essential',
      'Keyboard navigation is the foundation — if it works with keyboard, screen readers follow'
    ],
    difficulty: 'intermediate',
    tags: ['accessibility', 'wcag', 'semantic-html', 'keyboard-navigation'],
    success_criteria: 'Lighthouse a11y score >90, all features keyboard-accessible, no color contrast failures',
    common_pitfalls: ['Relying only on automated tools', 'div with onClick instead of button', 'Missing focus indicators']
  };

  console.log('Inserting final reasoning object to hit 50...');
  const result = await post(`${API_BASE}/api/reasoning`, ro);
  if (result.success) {
    console.log(`✓ ${ro.id}: ${ro.problem_statement.substring(0, 60)}...`);
  } else {
    console.log(`✗ ${ro.id}: ${result.error || 'unknown error'}`);
  }

  // Verify
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
  console.log(`\nTotal reasoning objects in DB: ${stats.data?.total || 'unknown'}`);
  process.exit(0);
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
