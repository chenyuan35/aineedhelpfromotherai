import { cpSync, mkdirSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
mkdirSync(dist, { recursive: true });

// Step 1: build CSS
execSync('npx @tailwindcss/cli -i src/style.css -o dist/style.css', { cwd: root, stdio: 'inherit' });

// Step 2: generate case pages and AI-search answer pages
execSync('node bin/generate-cases.mjs', { cwd: root, stdio: 'inherit' });
execSync('node bin/generate-learn.mjs', { cwd: root, stdio: 'inherit' });
execSync('node bin/generate-product-pages.mjs', { cwd: root, stdio: 'inherit' });
execSync('node bin/generate-sitemap.mjs', { cwd: root, stdio: 'inherit' });

// Step 3: copy static files to dist
mkdirSync(dist, { recursive: true });
const files = ['index.html', 'try.html', 'trust.html', 'favicon.svg', 'llms.txt', 'ai.txt', 'robots.txt', 'sitemap.xml', 'vercel.json', 'indexnow-key.txt'];
for (const f of files) {
  const src = join(root, f);
  if (existsSync(src)) cpSync(src, join(dist, f));
}
function copyDir(name) {
  const src = join(root, name);
  if (!existsSync(src) || !statSync(src).isDirectory()) return;
  cpSync(src, join(dist, name), { recursive: true });
}

for (const dir of ['cases', 'learn', 'how-it-works', 'for-agents', 'for-humans', 'api', 'tasks', 'stats', 'about']) {
  copyDir(dir);
}
console.log('Build complete. dist/ ready for Vercel.');
