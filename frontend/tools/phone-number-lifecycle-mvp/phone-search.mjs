const norm = value => String(value || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9+]+/g, ' ').trim();
const termsFor = query => [...new Set(norm(query).split(/\s+/).filter(Boolean))];

const finite = value => Number.isFinite(value) ? value : null;
const gradeRank = grade => ({A:4,B:3,C:2,insufficient:1}[grade] || 0);

export function searchPhoneRoutes(rows, query = '', filters = {}) {
  const terms = termsFor(query);
  const allow = row => {
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
    for (const term of terms) {
      let hit = 0;
      if (name === term || brand === term || id === term) hit = Math.max(hit, 60);
      if (name.startsWith(term) || brand.startsWith(term)) hit = Math.max(hit, 35);
      if (name.includes(term) || brand.includes(term)) hit = Math.max(hit, 24);
      if (market.includes(term) || network.includes(term)) hit = Math.max(hit, 18);
      if ((row.services || []).some(value => norm(value).includes(term))) hit = Math.max(hit, 18);
      if ((row.operations || []).some(value => norm(value).includes(term))) hit = Math.max(hit, 12);
      if ((row.tokens || []).includes(term)) hit = Math.max(hit, 10);
      if (!hit && (row.tokens || []).some(token => token.startsWith(term))) hit = 7;
      if (!hit && (row.tokens || []).some(token => token.includes(term))) hit = 4;
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
