const { getPool } = require('./db');
const { calculateRisk } = require('./relay-risk-score');

const METHODOLOGY_VERSION = '2026-09-14-v1';
const FORECAST_WINDOW_DAYS = 30;
let schemaReady = false;

function normalizeSite(raw) {
  if (typeof raw !== 'string') throw new Error('site is required');
  const value = raw.trim();
  if (!value || value.length > 255) throw new Error('invalid site');
  let url;
  try { url = new URL(value.includes('://') ? value : `https://${value}`); }
  catch { throw new Error('invalid site'); }
  const host = url.hostname.toLowerCase().replace(/^www\./, '').replace(/\.$/, '');
  const labels = host.split('.');
  if (!host || host.length > 253 || !host.includes('.') || !/^[a-z0-9.-]+$/.test(host) ||
      labels.some(label => !label || label.length > 63 || label.startsWith('-') || label.endsWith('-'))) {
    throw new Error('invalid site');
  }
  return host;
}

function validateVoterId(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{16,80}$/.test(value)) throw new Error('invalid voterId');
  return value;
}

function mapChoice(value, type) {
  const maps = {
    survival: { yes: 100, unsure: 50, no: 0 },
    trust: { trust: 100, unsure: 50, suspect: 0 },
  };
  if (value == null && type === 'trust') return null;
  if (!Object.prototype.hasOwnProperty.call(maps[type], value)) throw new Error(`invalid ${type} choice`);
  return maps[type][value];
}

async function ensureTables(db = getPool()) {
  if (!db || schemaReady) return;
  await db.query(`
    CREATE TABLE IF NOT EXISTS relay_risk_votes_v2 (
      relay_key TEXT NOT NULL,
      voter_id VARCHAR(80) NOT NULL,
      survival_outlook SMALLINT NOT NULL CHECK (survival_outlook IN (0, 50, 100)),
      model_trust SMALLINT CHECK (model_trust IN (0, 50, 100)),
      forecast_target_date DATE NOT NULL DEFAULT (CURRENT_DATE + 90),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (relay_key, voter_id)
    );
    ALTER TABLE relay_risk_votes_v2 ADD COLUMN IF NOT EXISTS forecast_target_date DATE;
    UPDATE relay_risk_votes_v2 SET forecast_target_date = (updated_at::date + 90) WHERE forecast_target_date IS NULL;
    ALTER TABLE relay_risk_votes_v2 ALTER COLUMN forecast_target_date SET NOT NULL;
    CREATE INDEX IF NOT EXISTS relay_risk_votes_v2_relay_key_idx ON relay_risk_votes_v2(relay_key);
  `);
    await db.query(`
    CREATE TABLE IF NOT EXISTS relay_risk_forecast_events (
      id BIGSERIAL PRIMARY KEY,
      relay_key TEXT NOT NULL,
      voter_id VARCHAR(80) NOT NULL,
      survival_outlook SMALLINT NOT NULL CHECK (survival_outlook IN (0, 50, 100)),
      model_trust SMALLINT CHECK (model_trust IN (0, 50, 100)),
      forecast_target_date DATE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS relay_risk_forecast_events_target_idx
      ON relay_risk_forecast_events(forecast_target_date, relay_key);

    CREATE TABLE IF NOT EXISTS relay_source_daily (
      source TEXT NOT NULL,
      relay_key TEXT NOT NULL,
      snapshot_date DATE NOT NULL,
      fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      source_updated_at TIMESTAMPTZ,
      source_url TEXT,
      provider_name TEXT,
      uptime DOUBLE PRECISION,
      sample_count INTEGER,
      latency_p50 INTEGER,
      first_seen DATE,
      price_profile TEXT,
      price_profile_label TEXT,
      median_price_ratio DOUBLE PRECISION,
      model_count INTEGER,
      comparable_count INTEGER,
      dead BOOLEAN,
      registration_state TEXT,
      probe JSONB,
      raw_summary JSONB,
      PRIMARY KEY (source, relay_key, snapshot_date)
    );
    CREATE INDEX IF NOT EXISTS relay_source_daily_relay_idx
      ON relay_source_daily(relay_key, snapshot_date DESC);

    CREATE TABLE IF NOT EXISTS relay_source_meta (
      source TEXT PRIMARY KEY,
      fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      source_updated_at TIMESTAMPTZ,
      item_count INTEGER,
      etag TEXT,
      source_url TEXT,
      last_error TEXT
    );
  `);
  schemaReady = true;
}

function communityConfidence(votes) {
  if (votes < 3) return 'insufficient';
  if (votes < 10) return 'low';
  if (votes < 30) return 'medium';
  return 'higher';
}

async function getCommunity(db, relayKey) {
  const cutoff = new Date(Date.now() - FORECAST_WINDOW_DAYS * 86400000);
  const { rows } = await db.query(`
    SELECT COUNT(*)::int AS votes,
      AVG(survival_outlook) AS survival_pct,
      AVG(model_trust) AS model_trust_pct,
      COUNT(*) FILTER (WHERE survival_outlook = 100)::int AS yes_votes,
      COUNT(*) FILTER (WHERE survival_outlook = 50)::int AS unsure_votes,
      COUNT(*) FILTER (WHERE survival_outlook = 0)::int AS no_votes,
      COUNT(model_trust)::int AS trust_votes,
      MAX(updated_at) AS last_vote_at
    FROM relay_risk_votes_v2
    WHERE relay_key = $1 AND updated_at >= $2
  `, [relayKey, cutoff]);
  const row = rows[0] || {};
  const votes = Number(row.votes || 0);
  const yes = Number(row.yes_votes || 0);
  const unsure = Number(row.unsure_votes || 0);
  const no = Number(row.no_votes || 0);
  const pct = n => votes ? Math.round((n / votes) * 1000) / 10 : 0;
  return {
    votes,
    survivalPct: votes ? Math.round(Number(row.survival_pct) * 10) / 10 : null,
    modelTrustPct: Number(row.trust_votes || 0) ? Math.round(Number(row.model_trust_pct) * 10) / 10 : null,
    modelTrustVotes: Number(row.trust_votes || 0),
    confidence: communityConfidence(votes),
    distribution: { yes, unsure, no },
    distributionPct: { yes: pct(yes), unsure: pct(unsure), no: pct(no) },
    lastVoteAt: row.last_vote_at || null,
    windowDays: FORECAST_WINDOW_DAYS,
  };
}

function sourceRowToObject(row) {
  if (!row) return null;
  const observedAt = row.source_updated_at || row.fetched_at;
  const ageMs = observedAt ? Date.now() - new Date(observedAt).getTime() : Infinity;
  return {
    source: row.source,
    sourceName: row.source === 'sinan-compute' ? 'Sinan Compute open data' : row.source,
    sourceUrl: row.source_url,
    fetchedAt: row.fetched_at,
    sourceUpdatedAt: row.source_updated_at,
    providerName: row.provider_name,
    uptime: row.uptime == null ? null : Number(row.uptime),
    sampleCount: Number(row.sample_count || 0),
    latencyP50: row.latency_p50 == null ? null : Number(row.latency_p50),
    firstSeen: row.first_seen,
    priceProfile: row.price_profile,
    priceProfileLabel: row.price_profile_label,
    medianPriceRatio: row.median_price_ratio == null ? null : Number(row.median_price_ratio),
    modelCount: Number(row.model_count || 0),
    comparableCount: Number(row.comparable_count || 0),
    dead: row.dead === true,
    registrationState: row.registration_state,
    probe: row.probe || null,
    stale: !Number.isFinite(ageMs) || ageMs > 36 * 60 * 60 * 1000,
    ageHours: Number.isFinite(ageMs) ? Math.max(0, Math.round(ageMs / 360000) / 10) : null,
  };
}

async function getLatestSource(db, relayKey) {
  const { rows } = await db.query(`
    SELECT daily.*
    FROM relay_source_daily daily
    JOIN relay_source_meta meta
      ON meta.source = daily.source
     AND meta.source_updated_at = daily.source_updated_at
    WHERE daily.relay_key = $1
    ORDER BY daily.snapshot_date DESC, daily.fetched_at DESC
    LIMIT 1
  `, [relayKey]);
  return sourceRowToObject(rows[0]);
}

async function getSourceHistory(db, relayKey) {
  const { rows } = await db.query(`
    SELECT snapshot_date, uptime, sample_count, latency_p50, price_profile, dead
    FROM (
      SELECT daily.snapshot_date, daily.uptime, daily.sample_count, daily.latency_p50,
             daily.price_profile, daily.dead
      FROM relay_source_daily daily
      JOIN (
        SELECT source, snapshot_date, MAX(source_updated_at) AS source_updated_at
        FROM relay_source_daily
        GROUP BY source, snapshot_date
      ) final
        ON final.source = daily.source
       AND final.snapshot_date = daily.snapshot_date
       AND final.source_updated_at = daily.source_updated_at
      WHERE daily.relay_key = $1
      ORDER BY daily.snapshot_date DESC
      LIMIT 30
    ) recent
    ORDER BY snapshot_date ASC
  `, [relayKey]);
  return rows.map(row => ({
    date: row.snapshot_date,
    uptime: row.uptime == null ? null : Number(row.uptime),
    sampleCount: Number(row.sample_count || 0),
    latencyP50: row.latency_p50 == null ? null : Number(row.latency_p50),
    priceProfile: row.price_profile,
    dead: row.dead === true,
  }));
}

async function getSummary(rawSite) {
  const relayKey = normalizeSite(rawSite);
  const db = getPool();
  if (!db) {
    return {
      relayKey,
      available: false,
      riskIndex: null,
      confidence: 'unavailable',
      methodologyVersion: METHODOLOGY_VERSION,
      community: { votes: 0, windowDays: FORECAST_WINDOW_DAYS },
    };
  }
  await ensureTables(db);
  const [community, source, history] = await Promise.all([
    getCommunity(db, relayKey),
    getLatestSource(db, relayKey),
    getSourceHistory(db, relayKey),
  ]);
  const risk = calculateRisk({ source, community });
  return {
    relayKey,
    available: true,
    riskIndex: risk.riskIndex,
    stage: risk.stage,
    confidence: risk.confidence,
    components: risk.components,
    disclaimer: risk.disclaimer,
    methodologyVersion: METHODOLOGY_VERSION,
    source,
    history,
    community,
  };
}

async function castVote({ site, voterId, survivalOutlook, modelTrust }) {
  const relayKey = normalizeSite(site);
  const voter = validateVoterId(voterId);
  const survival = mapChoice(survivalOutlook, 'survival');
  const trust = mapChoice(modelTrust, 'trust');
  const db = getPool();
  if (!db) throw Object.assign(new Error('community vote storage unavailable'), { statusCode: 503 });
  await ensureTables(db);
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const target = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
    await client.query(`
      INSERT INTO relay_risk_forecast_events
        (relay_key, voter_id, survival_outlook, model_trust, forecast_target_date)
      VALUES ($1, $2, $3, $4, $5)
    `, [relayKey, voter, survival, trust, target]);
    await client.query(`
      INSERT INTO relay_risk_votes_v2
        (relay_key, voter_id, survival_outlook, model_trust, forecast_target_date)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (relay_key, voter_id)
      DO UPDATE SET survival_outlook = EXCLUDED.survival_outlook,
                    model_trust = EXCLUDED.model_trust,
                    forecast_target_date = EXCLUDED.forecast_target_date,
                    updated_at = NOW()
    `, [relayKey, voter, survival, trust, target]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  return getSummary(relayKey);
}

module.exports = {
  METHODOLOGY_VERSION,
  FORECAST_WINDOW_DAYS,
  normalizeSite,
  ensureTables,
  getSummary,
  castVote,
  getLatestSource,
  getSourceHistory,
};
