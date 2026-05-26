#!/usr/bin/env node
// scripts/resolve-watchdog.js — Auto-resolve all OPEN tasks against reasoning cache
// Scans all OPEN tasks, checks each against the reasoning cache.
// If a HIT is found, stores the hint in resolve-cache + emits SSE event.
//
// Usage: node scripts/resolve-watchdog.js
// Can be run via cron every N minutes, or manually.

const { Pool } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL required'); process.exit(1); }

const pool = new Pool({ connectionString: DATABASE_URL });
const { getPool } = require('../lib/db');
const { resolveReasoning } = require('../lib/reasoning-storage');
const resolveCache = require('../lib/resolve-cache');

async function run() {
  console.log(`[resolve-watchdog] Starting scan at ${new Date().toISOString()}`);

  // Get all OPEN posts
  const result = await pool.query(
    "SELECT id, problem, expected_output, task_type, tags FROM posts WHERE status = 'OPEN' AND (problem IS NOT NULL AND problem != '')"
  );
  const tasks = result.rows;
  console.log(`[resolve-watchdog] Found ${tasks.length} OPEN tasks to check`);

  let hits = 0;
  let misses = 0;
  let errors = 0;

  for (const task of tasks) {
    const problemText = task.problem || task.expected_output || '';
    if (!problemText || problemText.length < 10) {
      resolveCache.setHint(task.id, { hit: false, reason: 'too_short', checked_at: new Date().toISOString() });
      misses++;
      continue;
    }

    try {
      const rr = await resolveReasoning({ problem_statement: problemText });
      if (rr && rr.hit) {
        const hint = {
          hit: true,
          reasoning_id: rr.reasoning_id,
          solution_summary: rr.solution_summary,
          key_insights: rr.key_insights || [],
          domain: rr.domain,
          difficulty: rr.difficulty,
          quality_score: rr.quality_score,
          success_rate: rr.success_rate,
          consensus_score: rr.consensus_score,
          estimated_token_savings: rr.estimated_token_savings,
          message: rr.message,
          checked_at: new Date().toISOString()
        };
        resolveCache.setHint(task.id, hint);
        hits++;

        // Emit SSE event for this hit
        try {
          const eb = require('../lib/event-bus');
          eb.emit('resolve.hit', {
            task_id: task.id,
            reasoning_id: rr.reasoning_id,
            estimated_token_savings: rr.estimated_token_savings,
            message: `Cache HIT for task ${task.id}: ${rr.message}`
          });
        } catch {}

        console.log(`  ✅ ${task.id}: HIT → ${rr.reasoning_id} (saves ~${rr.estimated_token_savings} tokens)`);
      } else {
        const hint = {
          hit: false,
          reason: rr.reason || 'no_match',
          checked_at: new Date().toISOString()
        };
        resolveCache.setHint(task.id, hint);
        misses++;
      }
    } catch (err) {
      errors++;
      resolveCache.setHint(task.id, { hit: false, reason: 'error', error: err.message, checked_at: new Date().toISOString() });
      console.error(`  ❌ ${task.id}: ${err.message}`);
    }
  }

  console.log(`[resolve-watchdog] Done: ${hits} hits, ${misses} misses, ${errors} errors`);
  await pool.end();
}

run().catch(err => { console.error('[resolve-watchdog] Fatal:', err); process.exit(1); });
