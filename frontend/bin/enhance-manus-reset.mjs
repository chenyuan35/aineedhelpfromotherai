import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const page = join(__dirname, '..', 'tools', 'manus-credits-reset', 'index.html');
let html = readFileSync(page, 'utf8');

function mustReplace(from, to, label) {
  if (!html.includes(from)) throw new Error(`Manus enhancement anchor missing: ${label}`);
  html = html.replace(from, to);
}

const manusStyle = `<style>
.manus-reset-panel>.manus-countdown{order:1}.manus-reset-panel>.manus-policy-metrics{order:2}.manus-reset-panel>.manus-planner-inputs{order:3}.manus-reset-panel>.manus-planner-actions{order:4}.manus-reset-panel>.manus-plan-result{order:5}.manus-reset-panel>.manus-plan-details{order:6}
@media(max-width:640px){.manus-reset-panel{gap:.65rem}.manus-reset-panel>.manus-countdown{padding:.75rem}.manus-reset-panel>.manus-planner-inputs{order:2}.manus-reset-panel>.manus-policy-metrics{order:3}}
</style>`;
mustReplace('<link rel="stylesheet" href="/site.css">', '<link rel="stylesheet" href="/site.css">'+manusStyle, 'layout style');
mustReplace('<section class="calculator-card calculator-wide reset-panel">', '<section class="calculator-card calculator-wide reset-panel manus-reset-panel">', 'calculator class');
mustReplace('<div class="countdown-box"><div class="countdown-label">Next Manus daily refresh</div>', '<div class="countdown-box manus-countdown"><div class="countdown-label">Next Manus daily refresh</div>', 'countdown class');
mustReplace('<div class="metric-grid"><div class="metric"><span>Reset rule</span>', '<div class="metric-grid manus-policy-metrics"><div class="metric"><span>Reset rule</span>', 'policy metrics class');
mustReplace('<div class="input-row"><label>Daily credits left', '<div class="input-row manus-planner-inputs"><label>Daily credits left', 'planner inputs class');
mustReplace('<div class="quick-row"><button type="button" id="manusCalc">', '<div class="quick-row manus-planner-actions"><button type="button" id="manusCalc">', 'planner actions class');
mustReplace('<div class="result" id="manusOut"', '<div class="result manus-plan-result" id="manusOut"', 'result class');
mustReplace('<div class="result-details" id="manusDetails"></div>', '<div class="result-details manus-plan-details" id="manusDetails"></div>', 'details class');

const oldPolicy = 'Official policy checked Sep 13, 2026: 300 daily refresh credits, reset at 00:00 UTC, unused daily credits do not roll over. Free users also have a 1,500-credit monthly cap on daily refresh credits.';
const newPolicy = 'Official policy checked Sep 20, 2026: 300 daily refresh credits, reset at 00:00 UTC, and unused daily credits do not roll over. Manus documents the Free 1,500-credit monthly cap separately below.';
mustReplace(oldPolicy, newPolicy, 'policy wording');
const oldCap = '<p>Manus also documents a monthly cap of 1,500 credits from the daily refresh pool for Free users. Hitting that monthly cap can stop daily refresh credits from appearing even though the daily timer itself has reached the next 00:00 UTC reset.</p>';
const newCap = '<p>Manus also documents a monthly cap of 1,500 credits from the daily refresh pool for Free users. Hitting that monthly cap can stop daily refresh credits from appearing even though the daily timer itself has reached the next 00:00 UTC reset. <a href="https://help.manus.im/en/articles/11711097-what-are-the-rules-for-credits-consumption-and-how-can-i-obtain-them" target="_blank" rel="noopener noreferrer">Source: Manus credit rules ↗</a></p>';
mustReplace(oldCap, newCap, 'monthly cap source');

writeFileSync(page, html);
console.log('Enhanced Manus reset page with mobile-first planner order and direct cap source.');
