import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const old=read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const now=read('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json');
const canonical=new Map(now.routes.map(r=>[r.id,r]));
const inspected=[],drift=[];
for(const legacy of old.routes){
 const current=canonical.get(legacy.id);
 if(!current)continue;
 const was=legacy.keep?.yearCostOriginal;
 const is=current.metrics?.keepYearCostOriginal;
 if(!Number.isFinite(was)||!Number.isFinite(is))continue;
 const ccyA=legacy.keep?.currency,ccyB=current.metrics?.keepCurrency;
 if(ccyA&&ccyB&&ccyA!==ccyB)continue; // cannot compare different currencies
 inspected.push(legacy.id);
 if(Math.abs(was-is)>0.00001)drift.push({id:legacy.id,ccy:ccyB||ccyA||'?',old:was,current:is,verified:current.lastVerifiedAt||'unknown'});
}
drift.sort((a,b)=>a.id.localeCompare(b.id));
const md=[
'# Phone Radar legacy price-parity audit — 2026-10-10',
'',
'**Stage:** internal / NOT production-verified. Reproduce with `node scripts/audit-phone-legacy-price-parity.mjs --check` or regenerate using `--write`.',
'',
'The original published `global-directory.json` and newer canonical `phone-route-summaries.json` are **parallel data streams**. Where route ID, native currency and finite yearly keep costs are comparable, they can disagree. A mismatch is a **review candidate**, not permission to overwrite every legacy field: different plan cohorts, annualized activity costs, checkout methods or source dates may explain it. Preserve source traceability and confidence. Never silently declare the smaller number universally available.',
'',
'- Route rows with both comparable native annual costs: **'+inspected.length+'**',
'- Rows with conflicting recorded values: **'+drift.length+'**',
'- Example already corrected in the US guide: Tello PAYG legacy USD80 web top-ups versus newer conditional USD40 via account-enabled SMS recharge; the guide now documents both, not a false overall winner.',
'',
'| Route ID | Native currency | Legacy annual | Newer normalized annual | Canonical last verified |',
'| --- | --- | ---: | ---: | --- |',
...drift.map(x=>`| \`${x.id}\` | ${x.ccy} | ${x.old} | ${x.current} | ${x.verified} |`),
'',
'## Next price-audit gates',
'',
'1. Check SKU/plan route identity before concluding that the lower cost supersedes the higher one.',
'2. Identify whether the number represents a minimum repeatable annual charge, purchase/credit commitment, usage spend, SMS-path-only top-up, or promotion. Do not compare unlike accounting grains.',
'3. Verify the author/date or primary terms and relevant identity/payment/activation requirements for the same route.',
'4. For public guide or directory cells that could mislead a buyer, show explicit conditional methods or uncertainty instead of one outdated headline amount.',
'5. Re-run regression/data/public build tests; no new SEO URLs or buy-ready claim until evidence gates clear.',
''
].join('\n');
const output=path.join(root,'docs/PHONE_RADAR_LEGACY_COST_DRIFT_2026-10-10.md');
if(process.argv.includes('--write')){fs.writeFileSync(output,md);console.log('WROTE',output)}
else if(process.argv.includes('--check')){if(!fs.existsSync(output)||fs.readFileSync(output,'utf8')!==md)throw Error('Legacy price drift report is stale: run --write');console.log('Phone legacy vs canonical keep-cost parity report reproducible: '+inspected.length+' comparable / '+drift.length+' discrepancies — PASS')}
else console.log(md);
