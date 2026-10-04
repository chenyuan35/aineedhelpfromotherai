from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def replace_once(path, old, new):
    p = ROOT / path
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"marker not found in {path}: {old[:120]!r}")
    p.write_text(text.replace(old, new, 1))


# 1) Make service success percentages evidence-gated and expose compact decision facts.
replace_once(
    "scripts/build-phone-database.mjs",
    """  const confidence = n >= 5 ? 'high' : n >= 3 ? 'medium' : n >= 2 ? 'low' : 'very-low';
  const dates = uniqueRows.map(x => x.reportedAt).filter(Boolean).sort();
  return { grade, label, confidence, sampleSize: n, successCount: success, failureCount: failure, mixedCount: mixed, firstObservedAt: dates[0] || null, lastObservedAt: dates.at(-1) || null };
""",
    """  const independentSourceCount = new Set(uniqueRows.map(x => x.sourceId).filter(Boolean)).size;
  const percentageEligible = n >= 5 && independentSourceCount >= 5;
  const successRatePct = percentageEligible ? Math.round((success / n) * 1000) / 10 : null;
  const confidence = n >= 5 ? 'high' : n >= 3 ? 'medium' : n >= 2 ? 'low' : 'very-low';
  const dates = uniqueRows.map(x => x.reportedAt).filter(Boolean).sort();
  return { grade, label, confidence, sampleSize: n, independentSourceCount, successCount: success, failureCount: failure, mixedCount: mixed, percentageEligible, successRatePct, firstObservedAt: dates[0] || null, lastObservedAt: dates.at(-1) || null };
""",
)

replace_once(
    "scripts/build-phone-database.mjs",
    """const serviceAggByRoute = new Map();
for (const x of serviceAggregates) { if (!serviceAggByRoute.has(x.routeId)) serviceAggByRoute.set(x.routeId, []); serviceAggByRoute.get(x.routeId).push(x); }

const searchIndex = routes.map(r => {
""",
    """const serviceAggByRoute = new Map();
for (const x of serviceAggregates) { if (!serviceAggByRoute.has(x.routeId)) serviceAggByRoute.set(x.routeId, []); serviceAggByRoute.get(x.routeId).push(x); }
const serviceNameById = new Map(services.map(x => [x.id, x.name]));
const compactText = (value, max = 180) => {
  const text = String(value || '').replace(/\\s+/g, ' ').trim();
  if (!text) return null;
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
};
const classifyKyc = value => {
  const text = normalize(value);
  if (!text) return 'unknown';
  if (/not required|no kyc|without kyc|no identity/.test(text)) return 'not-required';
  if (/required|real name|passport|identity|kyc/.test(text)) return 'required';
  return 'unclear';
};
const continuityRiskPattern = /(number[- ]?loss|closure|termination|terminated|suspension|cancel(?:lation|led)?|deactivat|recycl|service[- ]activation[- ]friction|operational[- ]failure|incident)/i;

const searchIndex = routes.map(r => {
""",
)

replace_once(
    "scripts/build-phone-database.mjs",
    """  const ss = snapByRoute.get(r.id) || []; const os = obsByRoute.get(r.id) || []; const es = eventByRoute.get(r.id) || [];
  const services = [...new Set(os.map(o => o.service).filter(Boolean))].sort();
""",
    """  const ss = snapByRoute.get(r.id) || []; const os = obsByRoute.get(r.id) || []; const es = eventByRoute.get(r.id) || [];
  const profile = currentProfileByRoute.get(r.id)?.data || {};
  const riskSignals = es.filter(e => continuityRiskPattern.test(`${e.type || ''} ${e.outcome || ''}`));
  const services = [...new Set(os.map(o => o.service).filter(Boolean))].sort();
""",
)

replace_once(
    "scripts/build-phone-database.mjs",
    """    serviceEvidence: (serviceAggByRoute.get(r.id) || []).map(x => ({ serviceId: x.serviceId, operation: x.operation, grade: x.grade, label: x.label, confidence: x.confidence, sampleSize: x.sampleSize, lastObservedAt: x.lastObservedAt })),
    metrics: metricByRoute.get(r.id),
""",
    """    serviceEvidence: (serviceAggByRoute.get(r.id) || []).map(x => ({ serviceId: x.serviceId, serviceName: serviceNameById.get(x.serviceId) || x.serviceId, operation: x.operation, grade: x.grade, label: x.label, confidence: x.confidence, sampleSize: x.sampleSize, independentSourceCount: x.independentSourceCount, successCount: x.successCount, failureCount: x.failureCount, mixedCount: x.mixedCount, percentageEligible: x.percentageEligible, successRatePct: x.successRatePct, lastObservedAt: x.lastObservedAt })),
    decisionFacts: {
      sourceCount: (r.sourceIds || []).length,
      kycState: classifyKyc(profile.kyc),
      keepAction: compactText(profile.keep?.action),
      roamingSms: compactText(profile.roamingSms),
      holdReason: compactText(profile.holdReason),
      continuityRiskSignalCount: riskSignals.length,
      lastContinuityRiskSignalAt: riskSignals.map(x => x.reportedAt).filter(Boolean).sort().at(-1) || null,
    },
    metrics: metricByRoute.get(r.id),
""",
)

# 2) Document the generated decision-data contract.
replace_once(
    "data/phone/README.md",
    """- `phone-route-summaries.json` — lightweight route summaries for first render/filtering.
- `phone-search-index.json` — normalized text/facet index for browser-side search, including numeric route metrics and service-evidence aggregates.
""",
    """- `phone-route-summaries.json` — lightweight route summaries for first render/filtering. It also carries compact decision facts (source count, KYC state, retention action excerpt and continuity-warning count) plus service evidence counts. Observed success percentages are emitted only when the exact route + service + operation aggregate has at least five deduplicated observations from at least five distinct source records; otherwise the percentage stays `null`.
- `phone-search-index.json` — normalized text/facet index for browser-side search, including numeric route metrics and the same evidence-gated service aggregates.
""",
)

# 3) Add a transparent Top decision layer to the Phone Radar landing view.
replace_once(
    "frontend/tools/phone-number-lifecycle-mvp/index.html",
    "    .pr-tools{",
    """    .pr-leaders{margin:0 0 12px;padding:12px;border:1px solid var(--line);border-radius:16px;background:var(--panel);box-shadow:0 5px 18px rgba(23,32,51,.035)}.pr-leaders-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:10px}.pr-leaders-head h2{font-size:1rem;margin:0 0 3px}.pr-leaders-head p{margin:0;max-width:760px;color:var(--muted);font-size:.75rem;line-height:1.4}.pr-leader-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:8px}.pr-leader-card{min-width:0;padding:9px;border:1px solid var(--line);border-radius:12px;background:var(--bg)}.pr-leader-card h3{margin:0 0 6px;font-size:.74rem;text-transform:uppercase;letter-spacing:.055em;color:var(--muted)}.pr-leader-list{list-style:none;margin:0;padding:0;display:grid;gap:5px}.pr-leader-list li{min-width:0}.pr-leader-route{width:100%;margin:0;padding:6px 7px;border:1px solid var(--line);border-radius:9px;background:var(--panel);color:var(--ink);font:inherit;text-align:left;cursor:pointer;display:grid;gap:2px}.pr-leader-route:hover{opacity:1;border-color:#b9c3d0}.pr-leader-route span{font-size:.73rem;font-weight:850;line-height:1.2;overflow-wrap:anywhere}.pr-leader-route strong{font-size:.7rem;line-height:1.2;color:var(--accent2);overflow-wrap:anywhere}.pr-leader-route small{font-size:.62rem;line-height:1.25;color:var(--muted);overflow-wrap:anywhere}.pr-leader-empty{margin:0;color:var(--muted);font-size:.7rem;line-height:1.35}
    .pr-tools{""",
)

insert_functions = r'''function topEligibleRows(){return canonicalRows().filter(r=>r.family==='long-term'&&r.numberClass==='real-mobile'&&r.evidenceState==='admitted'&&r.surfaceState!=='backstage-only')}
function leaderKyc(r){const state=r.decisionFacts?.kycState||'unknown';return state==='not-required'?'KYC not required':state==='required'?'KYC required':state==='unclear'?'KYC unclear':'KYC unknown'}
function bestServiceEvidence(r){const rank={A:0,B:1,C:2,insufficient:3};return [...(r.serviceEvidence||[])].filter(x=>x.sampleSize>0).sort((a,b)=>Number(b.percentageEligible)-Number(a.percentageEligible)||(rank[a.grade]??9)-(rank[b.grade]??9)||(b.sampleSize||0)-(a.sampleSize||0)||String(b.lastObservedAt||'').localeCompare(String(a.lastObservedAt||'')))[0]||null}
function leaderRowsHtml(items,valueFn){if(!items.length)return '<p class="pr-leader-empty">Not enough normalized evidence yet.</p>';return `<ol class="pr-leader-list">${items.slice(0,3).map((item,i)=>{const r=item.r||item;return `<li><button type="button" class="pr-leader-route" data-index-route="${esc(r.id)}"><span>${i+1}. ${esc(r.displayName||r.brandName||r.id)}</span><strong>${esc(valueFn(item))}</strong><small>${esc(r.marketName||'')} · ${esc(r.form||r.numberClass||'')} · ${esc(leaderKyc(r))}</small></button></li>`}).join('')}</ol>`}
function renderDecisionLeaders(){const eligible=topEligibleRows();const start=eligible.filter(r=>Number.isFinite(indexMetric(r,'acquisitionCostCny'))).sort((a,b)=>indexMetric(a,'acquisitionCostCny')-indexMetric(b,'acquisitionCostCny')||String(a.displayName||a.id).localeCompare(String(b.displayName||b.id)));const keep=eligible.filter(r=>Number.isFinite(indexMetric(r,'keepYearCostCny'))).sort((a,b)=>indexMetric(a,'keepYearCostCny')-indexMetric(b,'keepYearCostCny')||String(a.displayName||a.id).localeCompare(String(b.displayName||b.id)));const windowed=eligible.filter(r=>Number.isFinite(indexMetric(r,'keepIntervalDays'))).sort((a,b)=>indexMetric(b,'keepIntervalDays')-indexMetric(a,'keepIntervalDays')||dirSortVal(indexMetric(a,'keepYearCostCny'))-dirSortVal(indexMetric(b,'keepYearCostCny')));const svc=eligible.map(r=>({r,e:bestServiceEvidence(r)})).filter(x=>x.e).sort((a,b)=>Number(b.e.percentageEligible)-Number(a.e.percentageEligible)||(b.e.successRatePct??-1)-(a.e.successRatePct??-1)||(b.e.sampleSize||0)-(a.e.sampleSize||0)||String(b.e.lastObservedAt||'').localeCompare(String(a.e.lastObservedAt||'')));const documented=eligible.filter(r=>Number.isFinite(indexMetric(r,'keepIntervalDays'))&&(r.decisionFacts?.sourceCount||0)>0).sort((a,b)=>(b.decisionFacts?.sourceCount||0)-(a.decisionFacts?.sourceCount||0)||indexMetric(b,'keepIntervalDays')-indexMetric(a,'keepIntervalDays')||String(b.lastVerifiedAt||'').localeCompare(String(a.lastVerifiedAt||'')));return `<section class="pr-leaders" aria-label="Top phone route decision shortcuts"><div class="pr-leaders-head"><div><h2>Top decision shortcuts</h2><p>Only admitted, user-visible real-mobile long-term routes can appear here. HOLD/backstage rows never win. App success percentages appear only with at least 5 deduplicated observations from 5 distinct source records. Continuity ranks documentation depth, not a ban or recycle probability.</p></div></div><div class="pr-leader-grid"><article class="pr-leader-card"><h3>Lowest setup cost</h3>${leaderRowsHtml(start,x=>`${cny(indexMetric(x,'acquisitionCostCny'))} start`)}</article><article class="pr-leader-card"><h3>Lowest yearly keep</h3>${leaderRowsHtml(keep,x=>`${cny(indexMetric(x,'keepYearCostCny'))} / yr`)}</article><article class="pr-leader-card"><h3>Longest verified keep window</h3>${leaderRowsHtml(windowed,x=>`${indexMetric(x,'keepIntervalDays')} days`)}</article><article class="pr-leader-card"><h3>Best app-verification evidence</h3>${leaderRowsHtml(svc,x=>x.e.percentageEligible?`${x.e.successRatePct}% ${x.e.serviceName||x.e.serviceId} · n=${x.e.sampleSize}`:`${x.e.serviceName||x.e.serviceId}: ${x.e.label||x.e.grade} · n=${x.e.sampleSize}`)}</article><article class="pr-leader-card"><h3>Best-documented continuity</h3>${leaderRowsHtml(documented,x=>`${x.decisionFacts?.sourceCount||0} sources · ${indexMetric(x,'keepIntervalDays')}d keep`)}</article></div></section>`}
'''
replace_once(
    "frontend/tools/phone-number-lifecycle-mvp/index.html",
    "function renderMarketOverview(){",
    insert_functions + "function renderMarketOverview(){",
)

replace_once(
    "frontend/tools/phone-number-lifecycle-mvp/index.html",
    "  routeList.innerHTML=`<div class=\"pr-directory-note\"><div><strong>Global long-term number finder.</strong>",
    "  routeList.innerHTML=renderDecisionLeaders()+`<div class=\"pr-directory-note\"><div><strong>Global long-term number finder.</strong>",
)

# 4) Extend public-release regression coverage.
replace_once(
    "scripts/test-phone-number-public-release.mjs",
    "assert.match(page, /Global long-term number finder\\./);\n",
    """assert.match(page, /Global long-term number finder\\./);
assert.match(page, /Top decision shortcuts/);
assert.match(page, /Lowest setup cost/);
assert.match(page, /Lowest yearly keep/);
assert.match(page, /Longest verified keep window/);
assert.match(page, /Best app-verification evidence/);
assert.match(page, /Best-documented continuity/);
assert.match(page, /HOLD\\/backstage rows never win/);
""",
)

replace_once(
    "scripts/test-phone-number-public-release.mjs",
    """for (const route of canonicalIndex.routes) assert(fs.existsSync(path.join(publicDir, 'phone-route-data', `${route.id}.json`)), `${route.id} must have a lazy detail bundle`);

const waitFor = async (fn, message, timeout = 3000) => {
""",
    """for (const route of canonicalIndex.routes) {
  assert(fs.existsSync(path.join(publicDir, 'phone-route-data', `${route.id}.json`)), `${route.id} must have a lazy detail bundle`);
  assert.equal(typeof route.decisionFacts?.sourceCount, 'number', `${route.id} must expose source count for decision ranking`);
  for (const evidence of route.serviceEvidence || []) {
    if (evidence.successRatePct !== null) {
      assert.equal(evidence.percentageEligible, true, `${route.id} percentage must be explicitly eligible`);
      assert(evidence.sampleSize >= 5, `${route.id} percentage needs at least five observations`);
      assert(evidence.independentSourceCount >= 5, `${route.id} percentage needs at least five distinct source records`);
    }
  }
}

const waitFor = async (fn, message, timeout = 3000) => {
""",
)

replace_once(
    "scripts/test-phone-number-public-release.mjs",
    """await waitFor(() => dom.window.document.querySelector('#route-count')?.textContent.includes('152 reviewed routes'), 'canonical long-term market overview');
const search = dom.window.document.querySelector('#route-search');
""",
    """await waitFor(() => dom.window.document.querySelector('#route-count')?.textContent.includes('152 reviewed routes'), 'canonical long-term market overview');
await waitFor(() => dom.window.document.querySelector('#route-list')?.textContent.includes('Top decision shortcuts'), 'top decision shortcuts render');
const leaderButtons = [...dom.window.document.querySelectorAll('.pr-leader-route[data-index-route]')];
assert(leaderButtons.length > 0, 'at least one evidence-qualified Top route must render');
for (const button of leaderButtons) {
  const route = canonicalIndex.routes.find(r => r.id === button.dataset.indexRoute);
  assert(route, 'Top route must exist in canonical index');
  assert.equal(route.family, 'long-term', 'Top route must be long-term');
  assert.equal(route.numberClass, 'real-mobile', 'Top route must be a real mobile number');
  assert.equal(route.evidenceState, 'admitted', 'Top route must be admitted');
  assert.notEqual(route.surfaceState, 'backstage-only', 'Top route must not promote backstage-only evidence');
}
const search = dom.window.document.querySelector('#route-search');
""",
)

# 5) Durable design/decision contract for this bounded feature.
(ROOT / "docs/PHONE_TOP_DECISION_LAYER_2026-10-04.md").write_text("""# Phone Radar Top Decision Layer — 2026-10-04

Status: implementation contract for the bounded Phone Radar decision-shortcut release.

## User task

A user opening Phone Radar should be able to answer, without reconstructing forum threads manually: which reviewed real-mobile routes are cheapest to start, cheapest to keep, have the longest verified keep window, and have the strongest current app-verification evidence.

## MVP

- derive Top 3 lists from the existing normalized canonical data rather than hand-maintaining rankings;
- show lowest setup cost, lowest yearly keep cost, longest verified keep window, strongest app-verification evidence, and best-documented continuity;
- keep HOLD and backstage-only routes out of Top winners;
- expose KYC state, number/SIM form and market in the Top rows;
- emit app success percentages only when the exact route + service + operation aggregate has at least five deduplicated observations from at least five distinct source records;
- keep route details lazy-loaded from the existing evidence bundle.

## Explicit non-goals

- no arbitrary 0–100 safety/risk score;
- no claim that a route is "least likely to be banned" without direct evidence;
- no percentage from one forum thread, one source, or thin samples;
- no new SEO route, market or keyword pages;
- no Data-eSIM mixing into real-number rankings;
- no SQL/API/backend dependency.

## Technical approach

The repo-native compiler remains the source of derived browser data. `scripts/build-phone-database.mjs` adds compact decision facts to `phone-route-summaries.json` and evidence-gated percentage fields to service aggregates. The Phone Radar canonical page computes Top lists client-side from that lightweight summary payload.

Top eligibility is conservative: `family=long-term`, `numberClass=real-mobile`, `evidenceState=admitted`, and `surfaceState != backstage-only`.

## Data and persistence

No new persistence layer. Existing canonical tables remain authoritative. Rankings are deterministic derived output and rebuild with `npm run phone:data:build`.

## API / page flow

No API change. The page continues loading the lightweight canonical summary first and route detail JSON only after the user opens evidence.

## Privacy and security

No user input leaves the browser. No new cookies, account state, secrets or third-party calls are introduced.

## Deployment / monitoring

Normal branch → PR → Eval/CI + Vercel Preview → merge → production verification. Existing Phone interaction events remain; Top rows reuse the existing canonical detail-open event path.

## Tests

- generated data drift check;
- full Phone canonical data regression;
- frontend production build;
- public release audit;
- Top winner eligibility assertions;
- percentage eligibility assertions;
- sitemap/publication boundary remains unchanged.

## Rollback

Revert the bounded PR. No migration or durable external state is created.

## Operating cost

Static build-time derivation and browser-side rendering only; expected incremental runtime cost is negligible.
""")

print("Applied Phone Top decision-data layer")
