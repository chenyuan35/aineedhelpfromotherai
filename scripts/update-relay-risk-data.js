#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

const { getPool, closePool } = require('../lib/db');
const { normalizeSite, ensureTables } = require('../lib/relay-risk-v2');

const SOURCE = 'sinan-compute';
const SOURCE_URL = 'https://compute.sinanlab.com/data_v2.json';
const SOURCE_HOME = 'https://compute.sinanlab.com/en/sites';
const USER_AGENT = 'aineedhelpfromotherai-relay-risk/1.0 (+https://aineedhelpfromotherai.com/tools/relay-exit-risk-checker/)';
const dryRun = process.argv.includes('--dry-run');

const PRICE_LABELS = {
  ultra: 'Ultra-low relative to public reference',
  cheap: 'Below common bulk-discount range',
  held: 'Pricing basis needs verification',
  near: 'Near public reference range',
  high: 'Above public reference range',
};

function asNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeRecord(site, generatedAt) {
  let relayKey;
  try { relayKey = normalizeSite(site.domain || ''); } catch { return null; }
  const avail = site.avail || {};
  const cluster = site.cluster || {};
  const register = site.register || {};
  return {
    source: SOURCE,
    relayKey,
    snapshotDate: String(generatedAt || new Date().toISOString()).slice(0, 10),
    fetchedAt: new Date().toISOString(),
    sourceUpdatedAt: generatedAt || null,
    sourceUrl: `https://compute.sinanlab.com/en/s/${encodeURIComponent(relayKey)}`,
    providerName: site.name || relayKey,
    uptime: asNumber(avail.uptime),
    sampleCount: Number.isFinite(Number(avail.n)) ? Number(avail.n) : 0,
    latencyP50: Number.isFinite(Number(avail.ttfb_p50)) ? Math.round(Number(avail.ttfb_p50)) : null,
    firstSeen: site.first_seen || null,
    priceProfile: cluster.code || null,
    priceProfileLabel: PRICE_LABELS[cluster.code] || null,
    medianPriceRatio: asNumber(site.median),
    modelCount: Number.isFinite(Number(site.n_models)) ? Number(site.n_models) : 0,
    comparableCount: Number.isFinite(Number(site.n_ratio)) ? Number(site.n_ratio) : 0,
    dead: site.dead === true,
    registrationState: register.state || null,
    probe: site.probe || null,
    rawSummary: {
      panel: site.panel || null,
      version: site.version || null,
      channel: site.channel || null,
      okCount: Number(site.ok_count || 0),
      lowPriceCount: Number(site.un_count || 0),
    },
  };
}

async function fetchSource(etag = null) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch(SOURCE_URL, {
      headers: {
        Accept: 'application/json',
        'User-Agent': USER_AGENT,
        ...(etag ? { 'If-None-Match': etag } : {}),
      },
      signal: controller.signal,
    });
    if (response.status === 304) return { notModified: true, etag };
    if (!response.ok) throw new Error(`Sinan open-data HTTP ${response.status}`);
    const data = await response.json();
    if (!data || !Array.isArray(data.sites) || !data.generated_at) throw new Error('Unexpected Sinan open-data shape');
    return { data, etag: response.headers.get('etag') || null, notModified: false };
  } finally {
    clearTimeout(timer);
  }
}

async function upsertBatch(client, rows) {
  const columns = [
    'source','relay_key','snapshot_date','fetched_at','source_updated_at','source_url','provider_name',
    'uptime','sample_count','latency_p50','first_seen','price_profile','price_profile_label',
    'median_price_ratio','model_count','comparable_count','dead','registration_state','probe','raw_summary',
  ];
  for (let offset = 0; offset < rows.length; offset += 100) {
    const chunk = rows.slice(offset, offset + 100);
    const params = [];
    const values = chunk.map((row, rowIndex) => {
      const base = rowIndex * columns.length;
      params.push(
        row.source, row.relayKey, row.snapshotDate, row.fetchedAt, row.sourceUpdatedAt, row.sourceUrl, row.providerName,
        row.uptime, row.sampleCount, row.latencyP50, row.firstSeen, row.priceProfile, row.priceProfileLabel,
        row.medianPriceRatio, row.modelCount, row.comparableCount, row.dead, row.registrationState,
        row.probe == null ? null : JSON.stringify(row.probe), JSON.stringify(row.rawSummary),
      );
      return `(${columns.map((_, i) => `$${base + i + 1}`).join(',')})`;
    }).join(',');
    await client.query(`
      INSERT INTO relay_source_daily (${columns.join(',')}) VALUES ${values}
      ON CONFLICT (source, relay_key, snapshot_date) DO UPDATE SET
        fetched_at = EXCLUDED.fetched_at,
        source_updated_at = EXCLUDED.source_updated_at,
        source_url = EXCLUDED.source_url,
        provider_name = EXCLUDED.provider_name,
        uptime = EXCLUDED.uptime,
        sample_count = EXCLUDED.sample_count,
        latency_p50 = EXCLUDED.latency_p50,
        first_seen = EXCLUDED.first_seen,
        price_profile = EXCLUDED.price_profile,
        price_profile_label = EXCLUDED.price_profile_label,
        median_price_ratio = EXCLUDED.median_price_ratio,
        model_count = EXCLUDED.model_count,
        comparable_count = EXCLUDED.comparable_count,
        dead = EXCLUDED.dead,
        registration_state = EXCLUDED.registration_state,
        probe = EXCLUDED.probe,
        raw_summary = EXCLUDED.raw_summary
    `, params);
  }
}

async function replaceDailySnapshot(client, rows) {
  if (!rows.length) throw new Error('Refusing to replace relay snapshot with zero normalized rows');
  const source = rows[0].source;
  const snapshotDate = rows[0].snapshotDate;
  if (!rows.every(row => row.source === source && row.snapshotDate === snapshotDate)) {
    throw new Error('Relay snapshot rows must share one source and snapshot date');
  }
  await client.query(
    'DELETE FROM relay_source_daily WHERE source = $1 AND snapshot_date = $2',
    [source, snapshotDate],
  );
  await upsertBatch(client, rows);
}

async function main() {
  const started = Date.now();
  let db = null;
  let priorEtag = null;

  if (!dryRun) {
    db = getPool();
    if (!db) throw new Error('DATABASE_URL is required for relay-risk ingestion');
    await ensureTables(db);
    const meta = await db.query('SELECT etag FROM relay_source_meta WHERE source = $1', [SOURCE]);
    priorEtag = meta.rows[0]?.etag || null;
  }

  const fetched = await fetchSource(priorEtag);
  if (fetched.notModified) {
    await db.query(`
      INSERT INTO relay_source_meta (source, fetched_at, source_url, etag, last_error)
      VALUES ($1, NOW(), $2, $3, NULL)
      ON CONFLICT (source) DO UPDATE SET
        fetched_at = NOW(), source_url = EXCLUDED.source_url,
        etag = COALESCE(EXCLUDED.etag, relay_source_meta.etag), last_error = NULL
    `, [SOURCE, SOURCE_HOME, priorEtag]);
    console.log(JSON.stringify({ source: SOURCE, notModified: true, elapsedMs: Date.now() - started }));
    return;
  }

  const data = fetched.data;
  const rows = data.sites.map(site => normalizeRecord(site, data.generated_at)).filter(Boolean);
  const stats = {
    source: SOURCE,
    sourceUpdatedAt: data.generated_at,
    sitesReceived: data.sites.length,
    sitesNormalized: rows.length,
    withAvailability: rows.filter(row => row.uptime != null).length,
    withPricingProfile: rows.filter(row => row.priceProfile).length,
    markedDead: rows.filter(row => row.dead).length,
  };

  if (dryRun) {
    console.log(JSON.stringify({ dryRun: true, ...stats, sample: rows.slice(0, 3) }, null, 2));
    return;
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await replaceDailySnapshot(client, rows);
    await client.query(`
      INSERT INTO relay_source_meta (source, fetched_at, source_updated_at, item_count, etag, source_url, last_error)
      VALUES ($1, NOW(), $2, $3, $4, $5, NULL)
      ON CONFLICT (source) DO UPDATE SET
        fetched_at = NOW(), source_updated_at = EXCLUDED.source_updated_at,
        item_count = EXCLUDED.item_count, etag = EXCLUDED.etag,
        source_url = EXCLUDED.source_url, last_error = NULL
    `, [SOURCE, data.generated_at, rows.length, fetched.etag, SOURCE_HOME]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  console.log(JSON.stringify({ ...stats, etag: fetched.etag, elapsedMs: Date.now() - started }));
}

if (require.main === module) main().catch(async error => {
  console.error(`[relay-risk-ingest] ${error.stack || error.message}`);
  try {
    const db = getPool();
    if (db) {
      await ensureTables(db);
      await db.query(`
        INSERT INTO relay_source_meta (source, fetched_at, source_url, last_error)
        VALUES ($1, NOW(), $2, $3)
        ON CONFLICT (source) DO UPDATE SET fetched_at = NOW(), source_url = EXCLUDED.source_url, last_error = EXCLUDED.last_error
      `, [SOURCE, SOURCE_HOME, String(error.message || error).slice(0, 1000)]);
    }
  } catch {}
  process.exitCode = 1;
}).finally(() => closePool());

module.exports = { normalizeRecord, upsertBatch, replaceDailySnapshot };
