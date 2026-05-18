#!/usr/bin/env node
// scripts/sync-seeds.js — Sync seed task files to PostgreSQL
// Reads posts-seed.json and aggregated-seed.json, upserts into posts table
// Reports discrepancies between file state and DB state
//
// Usage: node scripts/sync-seeds.js [--dry-run] [--force]
//
// --dry-run: show what would change without writing
// --force: overwrite DB records even if they exist (default: skip existing)

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { getPool, closePool } = require('../lib/db');

const SEED_PATH = path.join(__dirname, '..', 'api', 'posts-seed.json');
const AGGREGATED_PATH = path.join(__dirname, '..', 'api', 'aggregated-seed.json');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');

function loadJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Failed to load ${filePath}: ${err.message}`);
    return null;
  }
}

function normalizeTask(task, source) {
  return {
    id: task.id,
    type: task.type || 'REQUEST',
    status: task.status || 'OPEN',
    title: task.problem || task.title || '',
    body: task.expected_output || task.body || task.description || '',
    difficulty: task.difficulty || 'intermediate',
    task_type: task.task_type || 'other',
    tags: JSON.stringify(task.tags || []),
    urgency: task.urgency || 'NORMAL',
    source_url: task.source_url || null,
    source_platform: task.source_platform || source,
    agent_id: task.agent_id || null,
    ai_instructions: task.ai_instructions || null,
    expires_at: task.expires_at || null,
    estimated_tokens: task.estimated_tokens || null,
    created_at: task.created_at || new Date().toISOString()
  };
}

async function syncTasks() {
  const db = getPool();
  if (!db) {
    console.error('Database unavailable');
    process.exit(1);
  }

  // Load seed files
  const seedData = loadJson(SEED_PATH);
  const aggregatedData = loadJson(AGGREGATED_PATH);

  if (!seedData && !aggregatedData) {
    console.error('No seed files found or both failed to load');
    process.exit(1);
  }

  const allTasks = [];
  const sources = [];

  if (seedData?.posts) {
    seedData.posts.forEach(t => allTasks.push(normalizeTask(t, 'posts-seed')));
    sources.push(`posts-seed.json: ${seedData.posts.length} tasks`);
  }

  if (aggregatedData?.posts) {
    aggregatedData.posts.forEach(t => allTasks.push(normalizeTask(t, 'aggregated-seed')));
    sources.push(`aggregated-seed.json: ${aggregatedData.posts.length} tasks`);
  }

  console.log(`Loading: ${sources.join(', ')}`);
  console.log(`Total tasks to sync: ${allTasks.length}`);
  if (dryRun) console.log('[DRY RUN] No changes will be made');

  // Get existing task IDs from DB
  const existingResult = await db.query('SELECT id, status FROM posts');
  const existingTasks = new Map(existingResult.rows.map(r => [r.id, r.status]));

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  const discrepancies = [];

  for (const task of allTasks) {
    const exists = existingTasks.has(task.id);

    if (exists && !force) {
      // Check for status discrepancy
      const dbStatus = existingTasks.get(task.id);
      if (dbStatus !== task.status) {
        discrepancies.push({
          id: task.id,
          file_status: task.status,
          db_status: dbStatus,
          source: task.source_platform
        });
      }
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`[DRY RUN] Would ${exists ? 'update' : 'insert'}: ${task.id} (${task.status})`);
      if (exists) updated++;
      else inserted++;
      continue;
    }

    try {
      if (exists) {
        await db.query(
          `UPDATE posts SET status = $1, title = $2, body = $3, difficulty = $4, task_type = $5,
           tags = $6, urgency = $7, source_url = $8, expires_at = $9, updated_at = NOW()
           WHERE id = $10`,
          [task.status, task.title, task.body, task.difficulty, task.task_type,
           task.tags, task.urgency, task.source_url, task.expires_at, task.id]
        );
        updated++;
      } else {
        await db.query(
          `INSERT INTO posts (id, type, status, title, body, difficulty, task_type, tags, urgency,
           source_url, source_platform, agent_id, ai_instructions, expires_at, estimated_tokens, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
          [task.id, task.type, task.status, task.title, task.body, task.difficulty, task.task_type,
           task.tags, task.urgency, task.source_url, task.source_platform, task.agent_id,
           task.ai_instructions, task.expires_at, task.estimated_tokens, task.created_at]
        );
        inserted++;
      }
    } catch (err) {
      console.error(`Error syncing ${task.id}: ${err.message}`);
      errors++;
    }
  }

  console.log('\n=== Sync Results ===');
  console.log(`Inserted: ${inserted}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped (existing): ${skipped}`);
  console.log(`Errors: ${errors}`);

  if (discrepancies.length > 0) {
    console.log(`\n=== Status Discrepancies (${discrepancies.length}) ===`);
    console.log('File says one thing, DB says another:');
    for (const d of discrepancies.slice(0, 20)) {
      console.log(`  ${d.id}: file=${d.file_status}, db=${d.db_status} (${d.source})`);
    }
    if (discrepancies.length > 20) {
      console.log(`  ... and ${discrepancies.length - 20} more`);
    }
  }

  // Check for orphaned DB records (in DB but not in any seed file)
  const seedIds = new Set(allTasks.map(t => t.id));
  const orphaned = existingResult.rows.filter(r => !seedIds.has(r.id));
  if (orphaned.length > 0) {
    console.log(`\n=== Orphaned DB Records (${orphaned.length}) ===`);
    console.log('In DB but not in any seed file:');
    for (const o of orphaned.slice(0, 10)) {
      console.log(`  ${o.id} (status: ${o.status})`);
    }
    if (orphaned.length > 10) {
      console.log(`  ... and ${orphaned.length - 10} more`);
    }
  }

  console.log('\nDone.');
}

syncTasks()
  .then(() => {
    closePool();
    process.exit(0);
  })
  .catch(err => {
    console.error('Sync failed:', err);
    closePool();
    process.exit(1);
  });
