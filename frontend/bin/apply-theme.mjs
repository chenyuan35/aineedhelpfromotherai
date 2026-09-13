import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const cssPath = join(root, 'site.css');

const themeInit = `<script id="theme-init">(()=>{try{const saved=localStorage.getItem('site-theme')||'system';const dark=window.matchMedia('(prefers-color-scheme: dark)').matches;const resolved=saved==='system'?(dark?'dark':'light'):saved;document.documentElement.dataset.theme=resolved;document.documentElement.dataset.themePreference=saved;}catch{}})();</script>`;
const themeButton = `<button class="theme-toggle" type="button" data-theme-toggle aria-label="Theme: Auto" title="Theme: Auto"><span class="theme-icon" aria-hidden="true">◐</span><span class="theme-label">Auto</span></button>`;
const themeRuntime = `<script id="theme-runtime">(()=>{const button=document.querySelector('[data-theme-toggle]');if(!button)return;const media=window.matchMedia('(prefers-color-scheme: dark)');const modes=['system','light','dark'];const labels={system:'Auto',light:'Light',dark:'Dark'};const icons={system:'◐',light:'☀',dark:'☾'};const current=()=>localStorage.getItem('site-theme')||'system';function apply(pref,persist=true){const resolved=pref==='system'?(media.matches?'dark':'light'):pref;document.documentElement.dataset.theme=resolved;document.documentElement.dataset.themePreference=pref;if(persist)localStorage.setItem('site-theme',pref);const label=labels[pref];button.querySelector('.theme-label').textContent=label;button.querySelector('.theme-icon').textContent=icons[pref];button.setAttribute('aria-label','Theme: '+label);button.setAttribute('title','Theme: '+label)}apply(current(),false);button.addEventListener('click',()=>{const pref=current();apply(modes[(modes.indexOf(pref)+1)%modes.length])});media.addEventListener?.('change',()=>{if(current()==='system')apply('system',false)})})();</script>`;

function patchHtml(path){
  let html = readFileSync(path, 'utf8');
  if (!html.includes('id="theme-init"')) {
    if (!html.includes('</head>')) throw new Error(`Missing </head>: ${path}`);
    html = html.replace('</head>', `${themeInit}</head>`);
  }
  if (!html.includes('data-theme-toggle')) {
    const navEnd = '</nav></div></header>';
    if (!html.includes(navEnd)) throw new Error(`Header nav pattern not found: ${path}`);
    html = html.replace(navEnd, `</nav>${themeButton}</div></header>`);
  }
  if (!html.includes('id="theme-runtime"')) {
    if (!html.includes('</body>')) throw new Error(`Missing </body>: ${path}`);
    html = html.replace('</body>', `${themeRuntime}</body>`);
  }
  writeFileSync(path, html);
}

function walk(dir){
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) { walk(path); continue; }
    if (name.endsWith('.html')) patchHtml(path);
  }
}

for (const entry of ['index.html','tools','about','contact','privacy','terms']) {
  const path = join(root, entry);
  if (entry.endsWith('.html')) patchHtml(path); else walk(path);
}

let css = readFileSync(cssPath, 'utf8');
css += `
/* Theme control: defaults to system, remembers light/dark choice locally. */
.nav nav{margin-left:auto}
.theme-toggle{margin:0;min-height:38px;padding:7px 11px;border:1px solid var(--line);border-radius:999px;background:var(--panel);color:var(--ink);box-shadow:none;display:inline-flex;align-items:center;gap:7px;flex:0 0 auto;font-size:.86rem;font-weight:750;line-height:1;transition:background .16s ease,border-color .16s ease,color .16s ease}
.theme-toggle:hover{opacity:1;border-color:#b9c3d0;background:var(--soft)}
.theme-icon{font-size:1rem;line-height:1}.theme-label{min-width:34px;text-align:left}
html[data-theme="dark"]{color-scheme:dark;--bg:#0f1319;--panel:#171c24;--ink:#edf2f7;--muted:#9ea9b8;--line:#2a3340;--accent:#8ab4f8;--accent2:#79d1b8;--soft:#202833;--shadow:0 12px 36px rgba(0,0,0,.26)}
html[data-theme="dark"] body{background:linear-gradient(180deg,#11171f 0,#0f1319 340px);color:var(--ink)}
html[data-theme="dark"] .site-header{background:rgba(17,23,31,.92);border-bottom-color:var(--line)}
html[data-theme="dark"] .site-footer{background:#11171f;border-top-color:var(--line)}
html[data-theme="dark"] .hero-panel,html[data-theme="dark"] .tool-card,html[data-theme="dark"] .related-card,html[data-theme="dark"] .mini-card,html[data-theme="dark"] .calculator-card,html[data-theme="dark"] .faq details,html[data-theme="dark"] .quick-start-card{background:var(--panel);border-color:var(--line)}
html[data-theme="dark"] input,html[data-theme="dark"] select,html[data-theme="dark"] .home-search input{background:#111820;color:var(--ink);border-color:#3a4656}
html[data-theme="dark"] input::placeholder{color:#7f8b9b}
html[data-theme="dark"] .tool-search-results{background:var(--panel);border-color:var(--line);box-shadow:0 18px 48px rgba(0,0,0,.34)}
html[data-theme="dark"] .tool-search-results a:hover{background:#202833}
html[data-theme="dark"] .home-intents a{background:rgba(23,28,36,.88);border-color:#323d4c;color:#dce4ef}
html[data-theme="dark"] .home-intents a:hover{background:#202833;border-color:#465469}
html[data-theme="dark"] .quick-links a,html[data-theme="dark"] .formula-grid code{background:#202833;color:#dce4ef;border-color:#313b49}
html[data-theme="dark"] .quick-links a:hover{background:#273241}
html[data-theme="dark"] .home-hero-comfort .home-lead,html[data-theme="dark"] .home-trust,html[data-theme="dark"] .content-section p,html[data-theme="dark"] .content-section li,html[data-theme="dark"] .legal p,html[data-theme="dark"] .legal li{color:var(--muted)!important}
html[data-theme="dark"] .notice{background:#2a2417;border-color:#514527;color:#e7d7a4}
html[data-theme="dark"] button:not(.theme-toggle){background:#e7edf7;color:#111722}
html[data-theme="dark"] .theme-toggle{background:#171c24;color:#e7edf7;border-color:#334052}
html[data-theme="dark"] .theme-toggle:hover{background:#202833;border-color:#4a5a70}
@media(max-width:760px){.nav{gap:12px}.nav nav{gap:12px}.theme-toggle{padding:7px 9px}.theme-label{display:none}}
`;
writeFileSync(cssPath, css);
console.log('Global light/dark/system theme applied.');
