const { getPool } = require('./db');

let schemaReady = false;

function normalizeSite(raw) {
  if (typeof raw !== 'string') throw new Error('site is required');
  const value = raw.trim();
  if (!value || value.length > 255) throw new Error('invalid site');
  let url;
  try {
    url = new URL(value.includes('://') ? value : `https://${value}`);
  } catch {
    throw new Error('invalid site');
  }
  const host = url.hostname.toLowerCase().replace(/^www\./, '').replace(/\.$/, '');
  const labels = host.split('.');
  if (!host || host.length > 253 || !host.includes('.') || !/^[a-z0-9.-]+$/.test(host) ||
      labels.some(label => !label || label.length > 63 || label.startsWith('-') || label.endsWith('-'))) {
    throw new Error('invalid site');
  }
  return host;
}

function clampScore(value, name) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 100) throw new Error(`${name} must be between 0 and 100`);
  return Math.round(n);
}

function validateVoterId(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{16,80}$/.test(value)) {
    throw new Error('invalid voterId');
  }
  return value;
}

async function ensureTable(db) {
  if (schemaReady) return;
  await db.query(`
    CREATE TABLE IF NOT EXISTS relay_risk_votes (
      relay_key TEXT NOT NULL,
      voter_id VARCHAR(80) NOT NULL,
      exit_risk SMALLINT NOT NULL CHECK (exit_risk BETWEEN 0 AND 100),
      watering_risk SMALLINT NOT NULL CHECK (watering_risk BETWEEN 0 AND 100),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (relay_key, voter_id)
    );
    CREATE INDEX IF NOT EXISTS relay_risk_votes_relay_key_idx ON relay_risk_votes(relay_key);
  `);
  schemaReady = true;
}

function confidence(votes) {
  if (votes < 3) return 'insufficient';
  if (votes < 10) return 'low';
  if (votes < 30) return 'medium';
  return 'higher';
}

async function getSummary(rawSite) {
  const relayKey = normalizeSite(rawSite);
  const db = getPool();
  if (!db) return { relayKey, available: false, votes: 0, confidence: 'unavailable' };
  await ensureTable(db);
  const { rows } = await db.query(`
    SELECT
      COUNT(*)::int AS votes,
      COALESCE(ROUND(AVG(exit_risk)::numeric, 1), 0)::float8 AS exit_risk,
      COALESCE(ROUND(AVG(watering_risk)::numeric, 1), 0)::float8 AS watering_risk,
      COUNT(*) FILTER (WHERE exit_risk < 30)::int AS quiet_votes,
      COUNT(*) FILTER (WHERE exit_risk >= 30 AND exit_risk < 50)::int AS upgrade_votes,
      COUNT(*) FILTER (WHERE exit_risk >= 50 AND exit_risk < 70)::int AS harvest_votes,
      COUNT(*) FILTER (WHERE exit_risk >= 70 AND exit_risk < 90)::int AS packing_votes,
      COUNT(*) FILTER (WHERE exit_risk >= 90)::int AS gone_votes,
      MAX(updated_at) AS last_vote_at
    FROM relay_risk_votes
    WHERE relay_key = $1
  `, [relayKey]);
  const row = rows[0] || {};
  const votes = Number(row.votes || 0);
  return {
    relayKey,
    available: true,
    votes,
    exitRisk: votes ? Number(row.exit_risk) : null,
    wateringRisk: votes ? Number(row.watering_risk) : null,
    confidence: confidence(votes),
    distribution: {
      quiet: Number(row.quiet_votes || 0),
      upgrade: Number(row.upgrade_votes || 0),
      harvest: Number(row.harvest_votes || 0),
      packing: Number(row.packing_votes || 0),
      gone: Number(row.gone_votes || 0),
    },
    lastVoteAt: row.last_vote_at || null,
  };
}

async function castVote({ site, voterId, exitRisk, wateringRisk }) {
  const relayKey = normalizeSite(site);
  const voter = validateVoterId(voterId);
  const exit = clampScore(exitRisk, 'exitRisk');
  const watering = clampScore(wateringRisk, 'wateringRisk');
  const db = getPool();
  if (!db) throw Object.assign(new Error('community vote storage unavailable'), { statusCode: 503 });
  await ensureTable(db);
  await db.query(`
    INSERT INTO relay_risk_votes (relay_key, voter_id, exit_risk, watering_risk)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (relay_key, voter_id)
    DO UPDATE SET exit_risk = EXCLUDED.exit_risk, watering_risk = EXCLUDED.watering_risk, updated_at = NOW()
  `, [relayKey, voter, exit, watering]);
  return getSummary(relayKey);
}

module.exports = { normalizeSite, getSummary, castVote };
