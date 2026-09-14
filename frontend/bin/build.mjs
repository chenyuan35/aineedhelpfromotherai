import { cpSync, mkdirSync, existsSync, rmSync, readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const GA4_ID = 'G-FYKKNKRE58';
const GA4_TAG = `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_ID}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA4_ID}');</script>`;
rmSync(dist,{recursive:true,force:true});
mkdirSync(dist,{recursive:true});

for (const script of ['generate-site-pages.mjs','generate-tools.mjs','generate-sitemap.mjs','generate-ai-reset-tools.mjs','fix-ai-reset-output.mjs','generate-ai-reset-tools-round2.mjs','enhance-cursor-breakthrough.mjs','refine-home-ux.mjs','register-relay-risk-checker.mjs','apply-theme.mjs','normalize-freshness-metadata.mjs']) {
  execSync(`node bin/${script}`,{cwd:root,stdio:'inherit'});
}
for (const f of ['index.html','site.css','home.css','robots.txt','sitemap.xml','ads.txt','favicon.svg','llms.txt','ai.txt']) {
  const src=join(root,f); if(existsSync(src)) cpSync(src,join(dist,f));
}
for (const dir of ['tools','about','contact','privacy','terms','media']) {
  const src=join(root,dir); if(existsSync(src)) cpSync(src,join(dist,dir),{recursive:true});
}

function injectGa4(dir){
  for(const name of readdirSync(dir)){
    const path=join(dir,name);
    if(statSync(path).isDirectory()){injectGa4(path);continue}
    if(!name.endsWith('.html'))continue;
    const html=readFileSync(path,'utf8');
    if(html.includes(GA4_ID))continue;
    if(!html.includes('</head>'))throw new Error(`Missing </head> in ${path}`);
    writeFileSync(path,html.replace('</head>',`${GA4_TAG}</head>`));
  }
}
injectGa4(dist);

console.log('Build complete: focused static tool site ready with GA4 tracking.');
