const verification = require('./verification');

const TIER_RANK = {
  production_confirmed: 4,
  sandbox_passed: 3,
  replay_confirmed: 2,
  unverified: 1,
};

function resolve(memoryHints) {
  if (!memoryHints || memoryHints.length === 0) {
    return { primary_fix: null, alternative_fixes: [], do_not_use: [], ranked: [] };
  }

  const ranked = memoryHints
    .map(h => {
      const tierRank = TIER_RANK[h.verification_tier || 'unverified'] || 1;
      const confidence = h.confidence || 0;
      const freshness = Math.max(0, 1 - (h.age_days || 999) / 90);
      const replayScore = (h.metadata?.replay_count || 0) * 5;
      const composite = (tierRank * 25) + (confidence * 0.3) + (freshness * 15) + replayScore;
      return { ...h, _composite: composite, _tier_rank: tierRank };
    })
    .sort((a, b) => b._composite - a._composite);

  const primary = ranked.length > 0 ? ranked[0] : null;

  const alternatives = ranked.slice(1, 4).filter(h =>
    h._tier_rank >= TIER_RANK.replay_confirmed && !h.decay_label?.includes('quarantine')
  );

  const doNotUse = ranked.filter(h =>
    h.decay_label === 'quarantine_candidate' ||
    h.decay_label === 'heavy_decay' ||
    (h.verification_tier === 'unverified' && (h.confidence || 0) < 20)
  );

  return {
    primary_fix: primary ? {
      id: primary.id,
      summary: primary.summary?.slice(0, 300),
      verification_tier: primary.verification_tier,
      confidence: primary.confidence,
      age_days: primary.age_days,
      tier_rank: primary._tier_rank,
      composite_score: Math.round(primary._composite),
    } : null,
    alternative_fixes: alternatives.map(a => ({
      id: a.id,
      summary: a.summary?.slice(0, 200),
      verification_tier: a.verification_tier,
      confidence: a.confidence,
      composite_score: Math.round(a._composite),
    })),
    do_not_use: doNotUse.map(d => ({
      id: d.id,
      summary: d.summary?.slice(0, 100),
      reason: d.decay_label === 'quarantine_candidate' ? 'Quarantine candidate' :
        d.decay_label === 'heavy_decay' ? 'Heavily decayed' : 'Low confidence unverified',
    })),
    ranked: ranked.slice(0, 10).map(r => ({
      id: r.id,
      summary: r.summary?.slice(0, 100),
      tier: r.verification_tier,
      score: Math.round(r._composite),
      rank_position: ranked.indexOf(r) + 1,
    })),
  };
}

module.exports = { resolve, TIER_RANK };
