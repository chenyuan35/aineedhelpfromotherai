import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const page = join(__dirname, '..', 'tools', 'bolt-tokens-reset', 'index.html');
let html = readFileSync(page, 'utf8');

function mustReplace(from, to, label) {
  if (!html.includes(from)) throw new Error(`Bolt enhancement anchor missing: ${label}`);
  html = html.replace(from, to);
}

const boltStyle = `<style>
@media(max-width:640px){.bolt-tool-hero{padding:22px 0 12px}.bolt-tool-hero h1{font-size:1.9rem;margin:.12em 0 .28em}.bolt-tool-hero p{font-size:.95rem;line-height:1.4;margin:.35rem 0}.bolt-reset-panel{gap:.55rem;padding:16px}.bolt-reset-panel>.bolt-account-row{order:1;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem}.bolt-reset-panel>.bolt-pace-row{order:2;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem}.bolt-reset-panel>.bolt-pace-row label:last-child{grid-column:1/-1}.bolt-reset-panel .input-row label{min-width:0}.bolt-reset-panel .input-row input,.bolt-reset-panel .input-row select{min-width:0;padding:10px 9px}.bolt-reset-panel>.bolt-calc{order:3;margin-top:0}.bolt-reset-panel>.bolt-plan-result{order:4;margin-top:.25rem;font-size:1.35rem}.bolt-reset-panel>.bolt-plan-details{order:5}.bolt-reset-panel>.bolt-countdown{order:6;padding:.65rem}.bolt-reset-panel>.bolt-metrics{order:7}}@media(max-width:360px){.bolt-tool-hero{padding:14px 0 8px}.bolt-tool-hero h1{font-size:1.75rem}.bolt-tool-hero p{font-size:.9rem;line-height:1.3}.bolt-reset-panel{padding:14px;gap:.45rem}.bolt-reset-panel .input-row input,.bolt-reset-panel .input-row select{padding:8px}.bolt-reset-panel>.bolt-calc{padding:10px 12px}.bolt-reset-panel>.bolt-plan-result{font-size:1.25rem}}
</style>`;
mustReplace('<link rel="stylesheet" href="/site.css">', '<link rel="stylesheet" href="/site.css">'+boltStyle, 'layout style');
mustReplace('<section class="tool-hero"><p class="eyebrow">AI usage tracker</p><h1>Bolt Tokens Reset Calculator</h1>', '<section class="tool-hero bolt-tool-hero"><p class="eyebrow">AI usage tracker</p><h1>Bolt Tokens Reset Calculator</h1>', 'hero class');
mustReplace('<section class="calculator-card calculator-wide quota-panel">', '<section class="calculator-card calculator-wide quota-panel bolt-reset-panel">', 'calculator class');
mustReplace('<div class="countdown-box"><div class="muted">Tracked next Bolt token reset</div>', '<div class="countdown-box bolt-countdown"><div class="muted">Tracked next Bolt token reset</div>', 'countdown class');
mustReplace('<div class="input-row"><label>Plan type', '<div class="input-row bolt-account-row"><label>Plan type', 'account row class');
mustReplace('<div class="input-row"><label>Tokens remaining', '<div class="input-row bolt-pace-row"><label>Tokens remaining', 'pace row class');
mustReplace('<button type="button" id="boltCalc">', '<button class="bolt-calc" type="button" id="boltCalc">', 'calculate class');
mustReplace('<div class="metric-grid"><div class="metric"><span>Safe daily budget</span>', '<div class="metric-grid bolt-metrics"><div class="metric"><span>Safe daily budget</span>', 'metrics class');
mustReplace('<div class="result" id="boltOut"', '<div class="result bolt-plan-result" id="boltOut"', 'result class');
mustReplace('<div class="result-details" id="boltDetails"></div>', '<div class="result-details bolt-plan-details" id="boltDetails"></div>', 'details class');

const restoreFrom = "try{const s=JSON.parse(localStorage.getItem(BOLTKEY)||'{}');if(s.plan)$('boltPlan').value=s.plan;if(s.reset)$('boltReset').value=s.reset;if(s.remaining!=null)$('boltRemaining').value=s.remaining;if(s.allocation)$('boltAllocation').value=s.allocation;if(s.daily!=null)$('boltDaily').value=s.daily}catch{}setDefaults();";
const restoreTo = "let restoredBolt=false;try{const s=JSON.parse(localStorage.getItem(BOLTKEY)||'{}');if(s.plan)$('boltPlan').value=s.plan;if(s.reset)$('boltReset').value=s.reset;if(s.remaining!=null){$('boltRemaining').value=s.remaining;restoredBolt=true}if(s.allocation)$('boltAllocation').value=s.allocation;if(s.daily!=null)$('boltDaily').value=s.daily}catch{}setDefaults();";
mustReplace(restoreFrom, restoreTo, 'saved-state restore');
mustReplace("$('boltCalc').addEventListener('click',calcBolt);renderBolt();setInterval(renderBolt,1000);", "$('boltCalc').addEventListener('click',calcBolt);renderBolt();if(restoredBolt)calcBolt();setInterval(renderBolt,1000);", 'saved-state recompute');

writeFileSync(page, html);
console.log('Enhanced Bolt reset page with mobile-first planner/result order and saved-state recompute.');
