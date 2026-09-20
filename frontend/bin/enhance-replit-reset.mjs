import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const page = join(__dirname, '..', 'tools', 'replit-usage-reset', 'index.html');
let html = readFileSync(page, 'utf8');

function mustReplace(from, to, label) {
  if (!html.includes(from)) throw new Error(`Replit enhancement anchor missing: ${label}`);
  html = html.replace(from, to);
}

const replitStyle = `<style>
@media(max-width:360px){.replit-reset-panel>.replit-planner-inputs{order:-1}}
</style>`;
mustReplace('<link rel="stylesheet" href="/site.css">', '<link rel="stylesheet" href="/site.css">'+replitStyle, 'layout style');
mustReplace('<section class="calculator-card calculator-wide reset-panel">', '<section class="calculator-card calculator-wide reset-panel replit-reset-panel">', 'calculator class');
mustReplace('<div class="input-row"><label>Next reset date and time', '<div class="input-row replit-planner-inputs"><label>Next reset date and time', 'planner inputs class');

writeFileSync(page, html);
console.log('Enhanced Replit reset page with narrow-mobile planner order.');
