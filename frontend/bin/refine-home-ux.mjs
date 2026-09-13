import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const homePath = join(root, 'index.html');
const cssPath = join(root, 'site.css');

const tools = [
  ['Percentage Calculator','/tools/percentage-calculator/','percentage percent calculate'],
  ['Percentage Increase Calculator','/tools/percentage-increase-calculator/','percentage increase decrease change'],
  ['Discount Calculator','/tools/discount-calculator/','discount sale savings price'],
  ['Age Calculator','/tools/age-calculator/','age birthday chronological date'],
  ['Date Difference Calculator','/tools/date-difference-calculator/','date days weeks difference'],
  ['Image Resizer','/tools/image-resizer/','image resize dimensions jpg png webp'],
  ['Image Compressor','/tools/image-compressor/','image compress reduce file size jpg png webp'],
  ['Manus Credits Reset Timer','/tools/manus-credits-reset/','manus credits reset'],
  ['Replit Usage Reset Timer','/tools/replit-usage-reset/','replit usage reset'],
  ['Cursor Usage Reset Calculator','/tools/cursor-usage-reset/','cursor usage limit reset'],
  ['AI Credit Burn Rate Calculator','/tools/ai-credit-burn-rate-calculator/','ai credits burn rate usage'],
  ['GitHub Copilot AI Credits Reset Timer','/tools/github-copilot-credits-reset/','github copilot credits reset'],
  ['Bolt Tokens Reset Calculator','/tools/bolt-tokens-reset/','bolt tokens reset usage'],
  ['AI Relay Exit Risk Checker','/tools/relay-exit-risk-checker/','ai api relay shutdown exit risk prepaid community model dilution']
];

let html = readFileSync(homePath, 'utf8');
const heroPattern = /<section class="home-hero">[\s\S]*?<\/section>/;
const newHero = `<section class="home-hero home-hero-comfort">
  <div class="home-intro">
    <p class="eyebrow">Free browser tools</p>
    <h1>What do you need to get done?</h1>
    <p class="home-lead">Search by task, or choose a starting point below. No account and no installation.</p>
    <div class="home-search" role="search">
      <label class="sr-only" for="tool-search">Search tools</label>
      <input id="tool-search" type="search" autocomplete="off" placeholder="Search tools — percentage, image resize, age, AI reset…" aria-controls="tool-search-results" aria-expanded="false">
      <div id="tool-search-results" class="tool-search-results" hidden></div>
    </div>
    <div class="home-intents" aria-label="Browse by task">
      <a href="#quick-calculators">Calculate</a>
      <a href="#quick-images">Work with images</a>
      <a href="#quick-ai">Track AI limits</a>
      <a href="/tools/">Browse all tools</a>
    </div>
    <p class="home-trust">Free to use <span>•</span> Browser-based <span>•</span> No sign-up</p>
  </div>
</section>
<section class="quick-starts" aria-labelledby="quick-starts-title">
  <div class="section-heading"><p class="eyebrow">Start here</p><h2 id="quick-starts-title">Choose the kind of task</h2></div>
  <div class="quick-starts-grid">
    <article class="quick-start-card" id="quick-calculators"><span class="quick-start-kicker">Calculators</span><h3>Get a number quickly</h3><p>Percentages, discounts, ages and date differences.</p><div class="quick-links"><a href="/tools/percentage-calculator/">Percentage</a><a href="/tools/discount-calculator/">Discount</a><a href="/tools/age-calculator/">Age</a></div></article>
    <article class="quick-start-card" id="quick-images"><span class="quick-start-kicker">Image tools</span><h3>Resize or shrink a file</h3><p>Simple local image processing without an account.</p><div class="quick-links"><a href="/tools/image-resizer/">Resize image</a><a href="/tools/image-compressor/">Compress image</a></div></article>
    <article class="quick-start-card" id="quick-ai"><span class="quick-start-kicker">AI usage</span><h3>Check limits and resets</h3><p>Reset timing and usage planning for popular AI tools.</p><div class="quick-links"><a href="/tools/cursor-usage-reset/">Cursor</a><a href="/tools/github-copilot-credits-reset/">Copilot</a><a href="/tools/manus-credits-reset/">Manus</a></div></article>
  </div>
</section>`;
if (!heroPattern.test(html)) throw new Error('Homepage hero block not found');
html = html.replace(heroPattern, newHero);

const searchData = JSON.stringify(tools);
const searchScript = `<script>(()=>{const tools=${searchData};const input=document.getElementById('tool-search');const box=document.getElementById('tool-search-results');if(!input||!box)return;const esc=s=>s.replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));function render(){const q=input.value.trim().toLowerCase();if(!q){box.hidden=true;input.setAttribute('aria-expanded','false');box.innerHTML='';return}const rows=tools.filter(([title,,keywords])=>(title+' '+keywords).toLowerCase().includes(q)).slice(0,6);box.innerHTML=rows.length?rows.map(([title,url])=>'<a href="'+url+'"><span>'+esc(title)+'</span><span aria-hidden="true">→</span></a>').join(''):'<p>No exact match. <a href="/tools/">Browse all tools</a></p>';box.hidden=false;input.setAttribute('aria-expanded','true')}input.addEventListener('input',render);input.addEventListener('focus',render);document.addEventListener('click',e=>{if(!e.target.closest('.home-search')){box.hidden=true;input.setAttribute('aria-expanded','false')}})})();</script>`;
html = html.replace('</body>', `${searchScript}</body>`);
writeFileSync(homePath, html);

let css = readFileSync(cssPath, 'utf8');
css += `
/* Homepage comfort pass: calmer scale, clearer task entry, more breathing room. */
.sr-only{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.home-hero-comfort{display:block;max-width:820px;margin:0 auto;padding:72px 0 34px;text-align:center}
.home-hero-comfort h1{font-size:clamp(2.35rem,5vw,3.7rem);max-width:760px;margin:12px auto 14px;letter-spacing:-.04em}
.home-hero-comfort .home-lead{max-width:650px;margin:0 auto;color:#596579;font-size:1.08rem}
.home-search{position:relative;max-width:760px;margin:30px auto 18px;text-align:left}
.home-search input{min-height:60px;border-radius:17px;border:1px solid #d9dde5;background:#fff;padding:0 20px;font-size:1rem;box-shadow:0 10px 30px rgba(23,32,51,.055)}
.home-search input:focus{outline:4px solid rgba(49,90,155,.11);border-color:#8ea7ce}
.tool-search-results{position:absolute;z-index:30;left:0;right:0;top:68px;background:#fff;border:1px solid #dde1e8;border-radius:16px;padding:7px;box-shadow:0 18px 48px rgba(23,32,51,.13)}
.tool-search-results a{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px 13px;border-radius:11px;color:var(--ink);font-weight:700}
.tool-search-results a:hover{background:#f4f6f8;text-decoration:none}.tool-search-results p{margin:8px 10px;color:var(--muted)}
.home-intents{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;margin:0 auto}
.home-intents a{display:inline-flex;align-items:center;min-height:42px;padding:0 15px;border:1px solid #dde1e8;border-radius:999px;background:rgba(255,255,255,.72);color:#39465a;font-weight:700;font-size:.94rem}
.home-intents a:hover{background:#fff;border-color:#bfc8d6;text-decoration:none}
.home-trust{margin:18px auto 0!important;font-size:.9rem!important;color:#7a8494!important}.home-trust span{padding:0 6px;color:#b0b6c0}
.quick-starts{margin:10px 0 56px}.section-heading{max-width:720px;margin-bottom:18px}.section-heading h2{font-size:clamp(1.7rem,3vw,2.25rem);margin:6px 0 0;letter-spacing:-.03em}
.quick-starts-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.quick-start-card{background:rgba(255,255,255,.86);border:1px solid #e2e4e8;border-radius:22px;padding:25px 24px 23px;box-shadow:0 8px 26px rgba(23,32,51,.045)}
.quick-start-kicker{display:block;color:var(--accent2);font-size:.76rem;font-weight:850;letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px}
.quick-start-card h3{font-size:1.2rem;margin:0 0 8px;letter-spacing:-.02em}.quick-start-card p{color:var(--muted);margin:0 0 18px;font-size:.96rem}
.quick-links{display:flex;flex-wrap:wrap;gap:8px}.quick-links a{display:inline-flex;padding:7px 10px;border-radius:10px;background:#f3f5f8;color:#39465a;font-size:.9rem;font-weight:700}.quick-links a:hover{background:#e9edf3;text-decoration:none}
.home-hero-comfort + .quick-starts + section .tools-grid{margin-top:16px}
.home-hero-comfort ~ section .tool-card{box-shadow:0 7px 24px rgba(23,32,51,.045)}
@media(max-width:760px){.home-hero-comfort{padding:46px 0 26px;text-align:left}.home-hero-comfort h1{font-size:2.2rem;margin-left:0}.home-hero-comfort .home-lead{margin-left:0}.home-search{margin-top:24px}.home-intents{justify-content:flex-start}.home-trust{text-align:left}.quick-starts-grid{grid-template-columns:1fr}.quick-start-card{padding:22px}.section-heading h2{font-size:1.75rem}}
`;
writeFileSync(cssPath, css);
console.log('Homepage comfort UX applied.');
