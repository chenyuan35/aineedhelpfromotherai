const STAGES = [
  { max: 29, key: 'quiet', name: 'Quiet Desk', summary: 'Low observed exit-risk signals. Keep normal prepaid-balance discipline.' },
  { max: 49, key: 'upgrade', name: 'Executive Upgrade', summary: 'Some caution signals are present. Prefer smaller, replaceable balances.' },
  { max: 69, key: 'harvest', name: 'Harvest Season', summary: 'Elevated signals. Verify the evidence and keep prepaid exposure modest.' },
  { max: 89, key: 'packing', name: 'Packing the Bucket', summary: 'High observed risk signals. Avoid parking a large balance here.' },
  { max: 100, key: 'gone', name: 'Lights Out', summary: 'Very high observed risk signals. Independently verify service status before prepaying.' },
];

function clamp(n, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Number(n)));
}

function stageFor(score) {
  if (!Number.isFinite(score)) return null;
  return STAGES.find(stage => score <= stage.max) || STAGES[STAGES.length - 1];
}

function availabilityRisk(uptime) {
  if (!Number.isFinite(Number(uptime))) return null;
  const u = clamp(uptime);
  if (u >= 99.5) return 5;
  if (u >= 98) return 12;
  if (u >= 95) return 25;
  if (u >= 90) return 45;
  if (u >= 75) return 70;
  return 90;
}

function availabilityWeight(sampleCount) {
  const n = Number(sampleCount || 0);
  if (n >= 24) return 50;
  if (n >= 12) return 38;
  if (n >= 5) return 25;
  if (n > 0) return 12;
  return 0;
}

function priceRisk(profile, medianRatio) {
  if (profile === 'held') return null;
  const byProfile = { ultra: 85, cheap: 60, near: 18, high: 18 };
  if (profile && Object.prototype.hasOwnProperty.call(byProfile, profile)) return byProfile[profile];
  const ratio = Number(medianRatio);
  if (!Number.isFinite(ratio) || ratio <= 0) return null;
  if (ratio < 0.15) return 85;
  if (ratio < 0.4) return 60;
  if (ratio <= 1.25) return 18;
  return 25;
}

function pricingWeight(comparableCount) {
  const n = Number(comparableCount || 0);
  if (n >= 20) return 20;
  if (n >= 5) return 12;
  if (n > 0) return 6;
  return 0;
}

function communityWeight(votes) {
  const n = Number(votes || 0);
  if (n < 3) return 0;
  if (n < 10) return 10;
  if (n < 30) return 20;
  return 30;
}

function confidenceFor({ source, community, effectiveWeight }) {
  const sourceSamples = Number(source?.sampleCount || 0);
  const votes = Number(community?.votes || 0);
  const decisiveDead = source?.dead === true && source?.stale !== true;
  if (!effectiveWeight && !decisiveDead) return 'insufficient';
  if (source?.stale && votes < 30) return 'low';
  if (sourceSamples >= 24 && votes >= 30 && effectiveWeight >= 90) return 'higher';
  if (sourceSamples >= 12 && effectiveWeight >= 50) return 'medium';
  return 'low';
}

function calculateRisk({ source = null, community = null } = {}) {
  const components = [];

  if (source) {
    const aRisk = availabilityRisk(source.uptime);
    const aWeight = Math.round(availabilityWeight(source.sampleCount) * (source.stale ? 0.5 : 1));
    if (aRisk != null && aWeight > 0) {
      components.push({
        key: 'availability',
        label: 'Measured availability',
        risk: aRisk,
        weight: aWeight,
        detail: `${Number(source.uptime).toFixed(1)}% reachable across ${Number(source.sampleCount || 0)} recent probes`,
        source: source.sourceName || 'Third-party measurements',
      });
    }

    const pRisk = priceRisk(source.priceProfile, source.medianPriceRatio);
    const pWeight = Math.round(pricingWeight(source.comparableCount) * (source.stale ? 0.5 : 1));
    if (pRisk != null && pWeight > 0) {
      components.push({
        key: 'pricing',
        label: 'Pricing sustainability signal',
        risk: pRisk,
        weight: pWeight,
        detail: source.priceProfileLabel || source.priceProfile || 'Comparable public pricing data',
        source: source.sourceName || 'Third-party measurements',
      });
    }
  }

  if (source?.dead === true && source?.stale !== true) {
    components.push({
      key: 'status',
      label: 'Source status',
      risk: 95,
      weight: 0,
      detail: 'The current third-party snapshot marks this relay as dead',
      source: source.sourceName || 'Third-party measurements',
    });
  }

  const cWeight = communityWeight(community?.votes);
  if (cWeight > 0 && Number.isFinite(Number(community?.survivalPct))) {
    const cRisk = clamp(100 - Number(community.survivalPct));
    components.push({
      key: 'community',
      label: '90-day community forecast',
      risk: cRisk,
      weight: cWeight,
      detail: `Community survival score ${Number(community.survivalPct).toFixed(0)}/100 · ${Number(community.votes)} votes`,
      source: 'Community forecast',
    });
  }

  const totalWeight = components.reduce((sum, item) => sum + item.weight, 0);
  let riskIndex = totalWeight
    ? Math.round(components.reduce((sum, item) => sum + item.risk * item.weight, 0) / totalWeight)
    : null;

  if (source?.dead === true && source?.stale !== true) riskIndex = Math.max(riskIndex ?? 0, 95);
  const stage = stageFor(riskIndex);

  return {
    riskIndex,
    stage,
    confidence: confidenceFor({ source, community, effectiveWeight: totalWeight }),
    effectiveWeight: totalWeight,
    components,
    disclaimer: 'This is a risk index built from observed signals, not a probability of fraud or disappearance.',
  };
}

module.exports = {
  STAGES,
  availabilityRisk,
  priceRisk,
  pricingWeight,
  communityWeight,
  stageFor,
  calculateRisk,
};
