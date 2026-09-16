const assert = require('assert');
const { replaceDailySnapshot } = require('./update-relay-risk-data');
const { getLatestSource } = require('../lib/relay-risk-v2');

function row(key, version, date = '2026-09-15') {
  return {
    source: 'sinan-compute',
    relayKey: key,
    snapshotDate: date,
    fetchedAt: new Date().toISOString(),
    sourceUpdatedAt: version,
    sourceUrl: `https://example.invalid/${key}`,
    providerName: key,
    uptime: 99.9,
    sampleCount: 24,
    latencyP50: 100,
    firstSeen: '2026-01-01',
    priceProfile: 'near',
    priceProfileLabel: 'Near public reference range',
    medianPriceRatio: 1,
    modelCount: 2,
    comparableCount: 20,
    dead: false,
    registrationState: 'open',
    probe: null,
    rawSummary: {},
  };
}

class SnapshotClient {
  constructor() { this.rows = new Map(); }
  async query(sql, params = []) {
    const normalized = sql.replace(/\s+/g, ' ').trim();
    if (normalized.startsWith('DELETE FROM relay_source_daily')) {
      const [source, snapshotDate] = params;
      for (const [key, value] of this.rows) {
        if (value.source === source && value.snapshotDate === snapshotDate) this.rows.delete(key);
      }
      return { rows: [] };
    }
    if (normalized.startsWith('INSERT INTO relay_source_daily')) {
      const width = 20;
      for (let i = 0; i < params.length; i += width) {
        const value = {
          source: params[i], relayKey: params[i + 1], snapshotDate: params[i + 2],
          fetchedAt: params[i + 3], sourceUpdatedAt: params[i + 4],
        };
        this.rows.set(`${value.source}|${value.relayKey}|${value.snapshotDate}`, value);
      }
      return { rows: [] };
    }
    throw new Error(`Unexpected SQL in snapshot fake: ${normalized.slice(0, 80)}`);
  }
}

(async () => {
  const v1 = '2026-09-15T04:06:31.000Z';
  const v2 = '2026-09-15T09:13:40.000Z';
  const client = new SnapshotClient();

  await replaceDailySnapshot(client, [row('a.example', v1), row('b.example', v1)]);
  assert.deepStrictEqual([...client.rows.values()].map(x => x.relayKey).sort(), ['a.example', 'b.example']);

  await replaceDailySnapshot(client, [row('b.example', v2), row('c.example', v2)]);
  assert.deepStrictEqual([...client.rows.values()].map(x => x.relayKey).sort(), ['b.example', 'c.example']);
  assert.strictEqual([...client.rows.values()].every(x => x.sourceUpdatedAt === v2), true);

  await assert.rejects(() => replaceDailySnapshot(client, []), /zero normalized rows/);
  await assert.rejects(
    () => replaceDailySnapshot(client, [row('a.example', v2, '2026-09-15'), row('b.example', v2, '2026-09-16')]),
    /share one source and snapshot date/,
  );

  const currentVersion = new Date().toISOString();
  const queryDb = {
    async query(sql, params) {
      const normalized = sql.replace(/\s+/g, ' ');
      assert(normalized.includes('JOIN relay_source_meta meta'));
      assert(normalized.includes('meta.source_updated_at = daily.source_updated_at'));
      assert.deepStrictEqual(params, ['gone.example']);
      return { rows: [] };
    },
  };
  assert.strictEqual(await getLatestSource(queryDb, 'gone.example'), null);

  const currentDb = {
    async query(sql, params) {
      assert(sql.includes('JOIN relay_source_meta meta'));
      assert.deepStrictEqual(params, ['current.example']);
      return { rows: [{
        source: 'sinan-compute', relay_key: 'current.example', fetched_at: currentVersion,
        source_updated_at: currentVersion, source_url: 'https://example.invalid/current.example',
        provider_name: 'current.example', uptime: 99.9, sample_count: 24, latency_p50: 100,
        first_seen: '2026-01-01', price_profile: 'near', price_profile_label: 'Near public reference range',
        median_price_ratio: 1, model_count: 2, comparable_count: 20, dead: false,
        registration_state: 'open', probe: null,
      }] };
    },
  };
  const current = await getLatestSource(currentDb, 'current.example');
  assert.strictEqual(current.providerName, 'current.example');
  assert.strictEqual(current.stale, false);

  console.log('relay-risk ingestion/current-source tests passed');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
