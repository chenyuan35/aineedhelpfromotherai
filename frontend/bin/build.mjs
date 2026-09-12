import { cpSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
rmSync(dist,{recursive:true,force:true});
mkdirSync(dist,{recursive:true});

for (const script of ['generate-site-pages.mjs','generate-tools.mjs','generate-sitemap.mjs','generate-ai-reset-tools.mjs']) {
  execSync(`node bin/${script}`,{cwd:root,stdio:'inherit'});
}
for (const f of ['index.html','site.css','robots.txt','sitemap.xml','ads.txt','favicon.svg']) {
  const src=join(root,f); if(existsSync(src)) cpSync(src,join(dist,f));
}
for (const dir of ['tools','about','contact','privacy','terms']) {
  const src=join(root,dir); if(existsSync(src)) cpSync(src,join(dist,dir),{recursive:true});
}
console.log('Build complete: focused static tool site ready.');
