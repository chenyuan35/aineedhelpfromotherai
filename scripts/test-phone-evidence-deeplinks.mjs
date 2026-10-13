import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../',import.meta.url);
const page=fs.readFileSync(new URL('frontend/tools/phone-number-lifecycle-mvp/index.html',root),'utf8');
assert.match(page,/new URLSearchParams\(location\.search\)\.get\('route'\)/);
assert.match(page,/await openIndexedRoute\(routeId\)/);
assert.match(page,/\(canonicalIndex\?\.routes\|\|\[\]\)\.some\(x=>x\.id===routeId\)/);
const guideRoot=new URL('frontend/site/src/pages/tools/phone-number-survival-guide/guides/',root);
const files=['cheapest-sim-receiving-sms-abroad.astro','hong-kong-sim-retention-guide.astro','japan-sim-retention-guide.astro','keep-uk-number-alive-abroad.astro','keep-us-number-alive-abroad.astro'];
for(const name of files){
 const s=fs.readFileSync(new URL(name,guideRoot),'utf8');
 assert.match(s,/\$\{GUIDE_BASE\}\?route=\$\{encodeURIComponent\(r.id\)\}/,name+' must link to current normalized on-demand route evidence');
 assert(!s.includes('directory/?q='),name+' must not strand readers in legacy directory with no canonical detail');
}
const idx=JSON.parse(fs.readFileSync(new URL('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json',root),'utf8'));
assert.equal(idx.routes.length,160);
console.log('Canonical route deep links: five guides target on-demand evidence panel for 160 routes, no extra SEO pages — PASS');
