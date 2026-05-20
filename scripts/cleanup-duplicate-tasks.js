#!/usr/bin/env node
// scripts/cleanup-duplicate-tasks.js — Remove duplicate OPEN tasks
// Keeps only the most recent task per unique problem statement.
// Run: node scripts/cleanup-duplicate-tasks.js --dry-run (to preview)
// Run: node scripts/cleanup-duplicate-tasks.js (to actually delete)

require('dotenv').config({ path: __dirname + '/../.env' });
const { getPool } = require('../lib/db');

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const pool = getPool();
  if (!pool) { console.error('DB not available'); process.exit(1); }

  // Find duplicate problems (same problem text, OPEN status, local origin)
  const dupes = await pool.query(`
    SELECT problem, COUNT(*) as cnt, array_agg(id) as ids, array_agg(created_at) as created
    FROM posts
    WHERE status = 'OPEN' AND origin = 'local'
    GROUP BY problem
    HAVING COUNT(*) > 1
    ORDER BY cnt DESC
  `);

  if (dupes.rows.length === 0) {
    console.log('No duplicate tasks found.');
    return;
  }

  console.log(`Found ${dupes.rows.length} duplicate groups (${dupes.rows.reduce((s, r) => s + parseInt(r.cnt), 0)} total tasks):\n`);

  let totalRemoved = 0;
  const toRemove = [];

  for (const row of dupes.rows) {
    const ids = row.ids;
    const created = row.created;
    // Keep the most recent (last in array since array_agg preserves order)
    const keepId = ids[ids.length - 1];
    const removeIds = ids.slice(0, -1);

    console.log(`Problem: "${row.problem.substring(0, 80)}..."`);
    console.log(`  Count: ${row.cnt}, Keep: ${keepId}, Remove: ${removeIds.join(', ')}`);

    if (!dryRun) {
      await pool.query('DELETE FROM posts WHERE id = ANY($1)', [removeIds]);
    }
    totalRemoved += removeIds.length;
  }

  console.log(`\n${dryRun ? '[DRY RUN] Would remove' : 'Removed'} ${totalRemoved} duplicate tasks.`);

  // Also mark EXPIRED tasks older than 24h as ARCHIVED
  const expiredResult = await pool.query(`
    SELECT COUNT(*) FROM posts
    WHERE status = 'EXPIRED' AND expires_at < NOW() - INTERVAL '24 hours'
  `);
  const expiredCount = parseInt(expiredResult.rows[0].count);
  if (expiredCount > 0) {
    if (!dryRun) {
      await pool.query(`
        UPDATE posts SET status = 'ARCHIVED'
        WHERE status = 'EXPIRED' AND expires_at < NOW() - INTERVAL '24 hours'
      `);
    }
    console.log(`${dryRun ? '[DRY RUN] Would archive' : 'Archived'} ${expiredCount} expired tasks.`);
  }

  // Report final counts
  const counts = await pool.query(`
    SELECT status, COUNT(*) FROM posts GROUP BY status ORDER BY COUNT(*) DESC
  `);
  console.log('\nFinal task counts:');
  for (const row of counts.rows) {
    console.log(`  ${row.status}: ${row.count}`);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
