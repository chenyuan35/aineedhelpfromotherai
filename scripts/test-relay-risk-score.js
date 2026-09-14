const assert = require('assert');
const { calculateRisk, stageFor } = require('../lib/relay-risk-score');

const solid = calculateRisk({
  source: { uptime: 99.8, sampleCount: 48, priceProfile: 'near', comparableCount: 40, sourceName: 'Test source' },
  community: { votes: 0, survivalPct: null },
});
assert.strictEqual(solid.riskIndex, 9);
assert.strictEqual(solid.stage.key, 'quiet');

const risky = calculateRisk({
  source: { uptime: 91.4, sampleCount: 35, priceProfile: 'ultra', comparableCount: 40, sourceName: 'Test source' },
  community: { votes: 12, survivalPct: 40 },
});
assert(risky.riskIndex >= 50 && risky.riskIndex <= 75);
assert(['harvest', 'packing'].includes(risky.stage.key));
assert(risky.components.some(item => item.key === 'community'));

const tinyCrowd = calculateRisk({
  source: { uptime: 99.8, sampleCount: 48, priceProfile: 'near', comparableCount: 40, sourceName: 'Test source' },
  community: { votes: 2, survivalPct: 0 },
});
assert(!tinyCrowd.components.some(item => item.key === 'community'));

const dead = calculateRisk({
  source: { uptime: 100, sampleCount: 48, priceProfile: 'near', comparableCount: 40, dead: true, sourceName: 'Test source' },
  community: { votes: 0, survivalPct: null },
});
assert.strictEqual(dead.riskIndex, 95);
assert.strictEqual(stageFor(dead.riskIndex).key, 'gone');
assert(dead.components.some(item => item.key === 'status'));

const heldPricing = calculateRisk({
  source: { uptime: 99.8, sampleCount: 48, priceProfile: 'held', medianPriceRatio: 0.229, comparableCount: 100, sourceName: 'Test source' },
});
assert(!heldPricing.components.some(item => item.key === 'pricing'));

assert(risky.components.find(item => item.key === 'community').detail.includes('survival score'));
assert(!risky.components.find(item => item.key === 'community').detail.includes('expect normal'));


const stale = calculateRisk({
  source: { uptime: 91.4, sampleCount: 35, priceProfile: 'ultra', comparableCount: 40, stale: true, sourceName: 'Test source' },
  community: { votes: 0, survivalPct: null },
});
const fresh = calculateRisk({
  source: { uptime: 91.4, sampleCount: 35, priceProfile: 'ultra', comparableCount: 40, stale: false, sourceName: 'Test source' },
  community: { votes: 0, survivalPct: null },
});
assert(stale.effectiveWeight < fresh.effectiveWeight);
assert.strictEqual(stale.confidence, 'low');

const staleDead = calculateRisk({ source: { dead: true, stale: true, sourceName: 'Test source' } });
assert.strictEqual(staleDead.riskIndex, null);
assert.strictEqual(staleDead.confidence, 'insufficient');

const empty = calculateRisk({});
assert.strictEqual(empty.riskIndex, null);
assert.strictEqual(empty.confidence, 'insufficient');

console.log('relay-risk score tests passed');
