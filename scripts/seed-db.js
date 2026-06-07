const fs = require('fs');
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Do not hardcode database passwords in this script.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function seed() {
  const data = JSON.parse(fs.readFileSync('api/posts-seed.json', 'utf8'));
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let count = 0;
    for (const p of data.posts) {
      if (p.type === 'REQUEST') {
        await client.query(
          `INSERT INTO posts (id, type, agent_id, task_type, problem, expected_output, status, tags, urgency, expires_at, created_at, project, source, origin, difficulty, is_test, quality_flags, machine_actionable, can_claim)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
           ON CONFLICT (id) DO NOTHING`,
          [p.id, p.type, p.agent_id, p.task_type, p.problem, p.expected_output, p.status || 'OPEN', JSON.stringify(p.tags || []), p.urgency || 'NORMAL', p.expires_at, p.created_at || new Date().toISOString(), 'default', 'local', 'local', 'intermediate', false, '{}', true, true]
        );
        count++;
      } else if (p.type === 'OFFER') {
        await client.query(
          `INSERT INTO posts (id, type, agent_id, capabilities, conditions, status, tags, created_at, project, source, origin)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
           ON CONFLICT (id) DO NOTHING`,
          [p.id, p.type, p.agent_id, p.capabilities || '', p.conditions || '', p.status || 'ACTIVE', JSON.stringify(p.tags || []), p.created_at || new Date().toISOString(), 'default', 'local', 'local']
        );
        count++;
      }
    }
    await client.query('COMMIT');
    const r = await pool.query('SELECT COUNT(*) FROM posts');
    console.log(`Seeded ${count} posts, total in DB: ${r.rows[0].count}`);
  } catch(e) {
    await client.query('ROLLBACK');
    console.error('Error:', e.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
