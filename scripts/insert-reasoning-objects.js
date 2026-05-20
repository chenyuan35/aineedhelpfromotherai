// insert-reasoning-objects.js — Insert seed reasoning objects into PostgreSQL
// Run after DB is fixed: node scripts/insert-reasoning-objects.js
require('dotenv').config({ path: __dirname + '/../.env' });

// Force reload db module after dotenv
delete require.cache[require.resolve('../lib/db')];
delete require.cache[require.resolve('../lib/reasoning-storage')];

const { execSync } = require('child_process');
const { saveReasoning } = require('../lib/reasoning-storage');

async function main() {
  const json = execSync('node ' + __dirname + '/seed-reasoning-objects.js 2>/dev/null', { encoding: 'utf8' });
  const objects = JSON.parse(json);

  console.log(`Inserting ${objects.length} reasoning objects...`);

  let success = 0;
  let failed = 0;

  for (const ro of objects) {
    try {
      await saveReasoning(ro);
      console.log(`  ✓ ${ro.id}: ${ro.problem_statement.slice(0, 60)}...`);
      success++;
    } catch (err) {
      console.error(`  ✗ ${ro.id}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} inserted, ${failed} failed`);

  const { getPool } = require('../lib/db');
  const pool = getPool();
  if (pool) {
    const result = await pool.query('SELECT COUNT(*) FROM reasoning_objects');
    console.log(`Total reasoning objects in DB: ${result.rows[0].count}`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
