(() => {
'use strict';
// Known product aliases and number-origin countries, not operational guarantees.
const aliases = new Map([
  ['乌龟卡', 'esimgg'],
  ['爱沙尼亚', 'estonia'],
  ['香港', 'hong kong'],
  ['英国', 'united kingdom'],
  ['美国', 'united states'],
  ['日本', 'japan'],
  ['德国', 'germany'],
  ['荷兰', 'netherlands'],
  ['新加坡', 'singapore'],
  ['马来西亚', 'malaysia'],
  ['澳大利亚', 'australia']
]);
// When a Chinese region name is an explicit number-origin query, only show routes
// originating from that market. A third-country incident mentioning Hong Kong
// must not appear as a Hong Kong SIM result.
const marketAliases = new Map([
  ['爱沙尼亚', 'ee'], ['香港', 'hk'], ['英国', 'gb'], ['美国', 'us'],
  ['日本', 'jp'], ['德国', 'de'], ['荷兰', 'nl'], ['新加坡', 'sg'],
  ['马来西亚', 'my'], ['澳大利亚', 'au']
]);
const norm = value => String(value ?? '').toLowerCase().normalize('NFKD').replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}+]+/gu, ' ').trim();
const termsFor = query => {
  let text = String(query ?? '').toLowerCase();
  for (const [alias, term] of aliases) text = text.replaceAll(alias, ' ' + term + ' ');
  return [...new Set(norm(text).split(/\s+/).filter(Boolean))];
};

const finite = value => Number.isFinite(value) ? value : null;
const gradeRank = grade => ({A:4,B:3,C:2,insufficient:1}[grade] || 0);

function searchPhoneRoutes(rows, query = '', filters = {}) {
  const terms = termsFor(query);
  const requestedMarkets = [...marketAliases].filter(([alias]) => String(query).includes(alias)).map(([, id]) => id);
  if (new Set(requestedMarkets).size > 1) return []; // Single-origin search, not a multi-market OR.
  const originMarket = requestedMarkets[0] || null;
  // Unsupported scripts/symbol-only queries must never return every route.
  if (String(query ?? '').trim() && !terms.length) return [];
  const allow = row => {
    if (originMarket && row.marketId !== originMarket) return false;
    if (filters.family && row.family !== filters.family) return false;
    if (filters.marketId && row.marketId !== filters.marketId) return false;
    if (filters.evidenceState && row.evidenceState !== filters.evidenceState) return false;
    if (filters.surfaceState && row.surfaceState !== filters.surfaceState) return false;
    if (filters.form && !norm(row.form).includes(norm(filters.form))) return false;
    return true;
  };
  const scored = [];
  for (const row of rows) {
    if (!allow(row)) continue;
    if (!terms.length) { scored.push({ row, score: 0 }); continue; }
    const name = norm(row.displayName); const brand = norm(row.brandName); const market = norm(row.marketName); const network = norm(row.networkName); const id = norm(row.id);
    let score = 0; let matched = 0;
    const fieldWords = new Set([name, brand, market, network, id].flatMap(x => x.split(/\s+/)));
    for (const term of terms) {
      let hit = 0;
      // UI receives the slim route summary, not the optional 500KB keyword index.
      // A short exact token (e.g. GG in eSIM.GG) still needs to match.
      if (fieldWords.has(term)) hit = Math.max(hit, 20);
      if (name === term || brand === term || id === term) hit = Math.max(hit, 60);
      if (term.length >= 3 && (name.startsWith(term) || brand.startsWith(term))) hit = Math.max(hit, 35);
      if (term.length >= 3 && (name.includes(term) || brand.includes(term))) hit = Math.max(hit, 24);
      if (term.length >= 3 && (market.includes(term) || network.includes(term))) hit = Math.max(hit, 18);
      if (term.length >= 3 && (row.services || []).some(value => norm(value).includes(term))) hit = Math.max(hit, 18);
      if (term.length >= 3 && (row.operations || []).some(value => norm(value).includes(term))) hit = Math.max(hit, 12);
      if ((row.tokens || []).includes(term)) hit = Math.max(hit, 10);
      if (term.length >= 3 && !hit && (row.tokens || []).some(token => token.startsWith(term))) hit = 7;
      if (term.length >= 4 && !hit && (row.tokens || []).some(token => token.includes(term))) hit = 4;
      if (hit) { matched++; score += hit; }
    }
    if (matched !== terms.length) continue;
    if (row.evidenceState === 'admitted') score += 4;
    if (row.surfaceState === 'public-pilot') score += 2;
    scored.push({ row, score });
  }
  const sortMode = filters.sort || (terms.length ? 'relevance' : 'freshness');
  const serviceId = filters.serviceId || null;
  const compare = (a, b) => {
    if (sortMode === 'keep-cost') {
      const av = finite(a.row.metrics?.keepYearCostCny), bv = finite(b.row.metrics?.keepYearCostCny);
      if (av == null && bv != null) return 1; if (av != null && bv == null) return -1; if (av != null && bv != null && av !== bv) return av - bv;
    }
    if (sortMode === 'keep-window') {
      const av = finite(a.row.metrics?.keepIntervalDays), bv = finite(b.row.metrics?.keepIntervalDays);
      if (av == null && bv != null) return 1; if (av != null && bv == null) return -1; if (av != null && bv != null && av !== bv) return bv - av;
    }
    if (sortMode === 'start-cost') {
      const av = finite(a.row.metrics?.acquisitionCostCny), bv = finite(b.row.metrics?.acquisitionCostCny);
      if (av == null && bv != null) return 1; if (av != null && bv == null) return -1; if (av != null && bv != null && av !== bv) return av - bv;
    }
    if (sortMode === 'service-evidence' && serviceId) {
      const ae = (a.row.serviceEvidence || []).filter(x => x.serviceId === serviceId).sort((x,y)=>gradeRank(y.grade)-gradeRank(x.grade) || y.sampleSize-x.sampleSize)[0];
      const be = (b.row.serviceEvidence || []).filter(x => x.serviceId === serviceId).sort((x,y)=>gradeRank(y.grade)-gradeRank(x.grade) || y.sampleSize-x.sampleSize)[0];
      const ar = gradeRank(ae?.grade), br = gradeRank(be?.grade); if (ar !== br) return br - ar;
      const an = ae?.sampleSize || 0, bn = be?.sampleSize || 0; if (an !== bn) return bn - an;
    }
    if (sortMode === 'relevance' && a.score !== b.score) return b.score - a.score;
    return String(b.row.lastVerifiedAt || '').localeCompare(String(a.row.lastVerifiedAt || '')) || a.row.displayName.localeCompare(b.row.displayName);
  };
  return scored.sort(compare).map(x => x.row);
}

// One shared engine for the browser and Node regression tests.
globalThis.PhoneSearch = Object.freeze({ searchPhoneRoutes });
})();
