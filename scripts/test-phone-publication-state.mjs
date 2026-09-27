import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const toolDir = path.join(root, 'frontend', 'tools', 'phone-number-lifecycle-mvp');
const data = JSON.parse(fs.readFileSync(path.join(toolDir, 'global-directory.json'), 'utf8'));
const policy = JSON.parse(fs.readFileSync(path.join(toolDir, 'publication-policy.json'), 'utf8'));
const allowed = new Set(['research-only','database-only','comparison-visible','detail-eligible','indexable']);
const ids = new Set(data.routes.map((r) => r.id));
const markets = new Set(data.routes.map((r) => r.marketName || 'Global'));

assert(allowed.has(policy.defaultRouteState), 'invalid defaultRouteState');
assert(allowed.has(policy.defaultMarketState), 'invalid defaultMarketState');
assert.equal(policy.defaultRouteState, 'comparison-visible', 'admitted normalized routes should default to comparison-visible, not indexable');
assert.equal(policy.defaultMarketState, 'database-only', 'markets must not auto-publish from database coverage');

for (const [id, state] of Object.entries(policy.routeStates || {})) {
  assert(ids.has(id), `publication policy references missing route ${id}`);
  assert(allowed.has(state), `invalid publication state ${state} for ${id}`);
  if (state === 'indexable') {
    const route = data.routes.find((r) => r.id === id);
    assert.equal(route.guideEligible, true, `indexable route ${id} must be guideEligible`);
  }
}
for (const [market, state] of Object.entries(policy.marketStates || {})) {
  assert(markets.has(market), `publication policy references missing market ${market}`);
  assert(allowed.has(state), `invalid market publication state ${state} for ${market}`);
}
assert(Object.values(policy.routeStates || {}).includes('indexable'), 'publication policy should keep at least one explicitly admitted indexable route');
assert(data.routes.length > Object.values(policy.routeStates || {}).filter((s) => s === 'indexable').length, 'database coverage must remain broader than indexable publication');
console.log(`phone publication-state audit: ${data.routes.length} database routes; ${Object.values(policy.routeStates || {}).filter((s) => s === 'indexable').length} explicit indexable routes`);
