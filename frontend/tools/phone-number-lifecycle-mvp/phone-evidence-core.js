(() => {
'use strict';

// Source visibility is a presentation choice, NOT an evidence quality grade.
// A provider-heavy insertion order must not hide all firsthand/contradictory
// reports behind a fixed "first eight" slice.
function selectHighlightSources(records, limit = 8) {
  if (!Array.isArray(records) || !Number.isInteger(limit) || limit <= 0) return [];
  const category = s => /first.hand|community/i.test(String(s?.type || '')) ? 'community'
    : /provider.official|official/i.test(String(s?.type || '')) ? 'official' : 'other';
  const newestFirst = (a,b) => String(b.reportedAt || '').localeCompare(String(a.reportedAt || ''))
    || String(a.id || a.url || '').localeCompare(String(b.id || b.url || ''));
  const all = records.filter(s => s && typeof s.url === 'string' && /^https?:\/\//i.test(s.url));
  const seen = new Set();
  const result = [];
  const add = s => { const key = s.url; if (!seen.has(key) && result.length < limit) { seen.add(key); result.push(s); } };
  const community = all.filter(s => category(s) === 'community').sort(newestFirst);
  const official = all.filter(s => category(s) === 'official').sort(newestFirst);
  // When both classes exist, reserve space for at least one primary provider
  // rule as well as community field reports; remaining entries favour direct
  // operational experiences. Not a success metric.
  community.slice(0, Math.max(0, limit - (official.length ? 1 : 0))).forEach(add);
  if (official.length) add(official[0]);
  [...community,...official,...all.filter(s=>category(s)==='other').sort(newestFirst)].forEach(add);
  return result;
}
// On a route evidence detail, every cited incident/observation must be
// traceable by a clickable original URL, even if it predates eight newer
// generic sources. Keep a recent official rule visible when present.
function selectCitedSources(records, evidence = [], limit = 8) {
  if (!Array.isArray(records) || !Array.isArray(evidence) || !Number.isInteger(limit) || limit <= 0) return [];
  const all = records.filter(s => s && typeof s.url === 'string' && (s.url.startsWith('https://') || s.url.startsWith('http://')));
  const citedIds = new Set(evidence.map(e => e?.sourceId).filter(Boolean));
  const newestFirst = (a,b) => String(b.reportedAt || '').localeCompare(String(a.reportedAt || ''))
    || String(a.id || '').localeCompare(String(b.id || ''));
  const cited = all.filter(s => citedIds.has(s.id)).sort(newestFirst);
  const official = all.filter(s => /provider.official|official/i.test(String(s.type || ''))).sort(newestFirst)[0];
  const capacity = Math.max(limit, cited.length + (official && !cited.some(s => s.url === official.url) ? 1 : 0));
  const seen = new Set(), picked = [];
  for (const s of [...cited, ...(official ? [official] : []), ...selectHighlightSources(all, capacity)]) {
    if (picked.length >= capacity) break;
    if (seen.has(s.url)) continue;
    seen.add(s.url); picked.push(s);
  }
  return picked;
}
globalThis.PhoneEvidence = Object.freeze({ selectHighlightSources, selectCitedSources });
})();
