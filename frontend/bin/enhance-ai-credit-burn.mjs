import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const page = join(__dirname, '..', 'tools', 'ai-credit-burn-rate-calculator', 'index.html');
let html = readFileSync(page, 'utf8');

function mustReplace(from, to, label) {
  if (!html.includes(from)) throw new Error(`AI credit burn enhancement anchor missing: ${label}`);
  html = html.replace(from, to);
}

const burnStyle = `<style>
@media(max-width:640px){.burn-reset-panel{gap:.55rem;padding:16px}.burn-reset-panel>.burn-balance-row,.burn-reset-panel>.burn-pace-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem}.burn-reset-panel .input-row label{min-width:0}.burn-reset-panel .input-row input{min-width:0;padding:10px 9px}.burn-reset-panel>.burn-expiry{margin-top:0;font-size:.88rem}.burn-reset-panel>.burn-calc{margin-top:0}.burn-reset-panel>.burn-result{order:5;margin-top:.2rem;font-size:1.35rem}.burn-reset-panel>.burn-details{order:6}.burn-reset-panel>.burn-metrics{order:7;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem}.burn-reset-panel>.burn-metrics .metric{padding:.65rem}}@media(max-width:360px){.burn-tool-hero{padding:14px 0 8px}.burn-tool-hero h1{font-size:1.75rem;margin:.12em 0 .28em}.burn-tool-hero p{font-size:.9rem;line-height:1.3;margin:.35rem 0}.burn-reset-panel{padding:14px;gap:.45rem}.burn-reset-panel .input-row input{padding:8px}.burn-reset-panel>.burn-calc{padding:10px 12px}.burn-reset-panel>.burn-result{font-size:1.25rem}.burn-reset-panel>.burn-metrics .metric{padding:.55rem}}
</style>`;
mustReplace('<link rel="stylesheet" href="/site.css">', '<link rel="stylesheet" href="/site.css">'+burnStyle, 'layout style');
mustReplace('<section class="tool-hero"><p class="eyebrow">AI cost calculator</p><h1>AI Credit Burn Rate Calculator</h1>', '<section class="tool-hero burn-tool-hero"><p class="eyebrow">AI cost calculator</p><h1>AI Credit Burn Rate Calculator</h1>', 'hero class');
mustReplace('<section class="calculator-card calculator-wide reset-panel">\n  <div class="input-row"><label>Credits remaining', '<section class="calculator-card calculator-wide reset-panel burn-reset-panel">\n  <div class="input-row burn-balance-row"><label>Credits remaining', 'calculator and balance row classes');
mustReplace('<div class="input-row"><label>Your current average credits/day', '<div class="input-row burn-pace-row"><label>Your current average credits/day', 'pace row class');
mustReplace('<label class="check"><input id="burnExpires"', '<label class="check burn-expiry"><input id="burnExpires"', 'expiry class');
mustReplace('<button type="button" id="burnCalc">', '<button class="burn-calc" type="button" id="burnCalc">', 'calculate class');
mustReplace('<div class="metric-grid"><div class="metric"><span>Safe daily budget</span>', '<div class="metric-grid burn-metrics"><div class="metric"><span>Safe daily budget</span>', 'metrics class');
mustReplace('<div class="result" id="burnOut"', '<div class="result burn-result" id="burnOut"', 'result class');
mustReplace('<div class="result-details" id="burnDetails"></div>', '<div class="result-details burn-details" id="burnDetails"></div>', 'details class');

writeFileSync(page, html);
console.log('Enhanced AI credit burn calculator mobile action/result hierarchy.');
