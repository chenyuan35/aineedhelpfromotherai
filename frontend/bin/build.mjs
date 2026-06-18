import { cpSync, mkdirSync, existsSync, statSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const repoRoot = join(root, '..');
const dist = join(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// Step 1: build CSS (Tailwind) + copy canonical design system
execSync('npx @tailwindcss/cli -i src/style.css -o dist/style.css', { cwd: root, stdio: 'inherit' });
cpSync(join(root, 'src', 'design-system.css'), join(dist, 'design-system.css'));

// Step 2: generate case pages and AI-search answer pages
execSync('node bin/generate-cases.mjs', { cwd: root, stdio: 'inherit' });
execSync('node bin/generate-learn.mjs', { cwd: root, stdio: 'inherit' });
execSync('node bin/generate-product-pages.mjs', { cwd: root, stdio: 'inherit' });
execSync('node bin/generate-failure-index.mjs', { cwd: root, stdio: 'inherit' });
execSync('node bin/generate-feed.mjs', { cwd: root, stdio: 'inherit' });
execSync('node bin/generate-sitemap.mjs', { cwd: root, stdio: 'inherit' });

// Step 3: copy static files to dist
mkdirSync(dist, { recursive: true });
const files = ['index.html', 'favicon.svg', 'og-card.svg', 'llms.txt', 'ai.txt', 'robots.txt', 'sitemap.xml', 'feed.xml', 'failure-index.json', 'vercel.json', 'indexnow-key.txt'];
for (const f of files) {
  const src = join(root, f);
  if (existsSync(src)) cpSync(src, join(dist, f));
}
for (const f of ['openapi.json']) {
  const src = join(repoRoot, f);
  if (existsSync(src)) cpSync(src, join(dist, f));
}
function copyDir(name) {
  const src = join(root, name);
  if (!existsSync(src) || !statSync(src).isDirectory()) return;
  cpSync(src, join(dist, name), { recursive: true });
}

function copyRepoDir(name) {
  const src = join(repoRoot, name);
  if (!existsSync(src) || !statSync(src).isDirectory()) return;
  cpSync(src, join(dist, name), { recursive: true });
}

for (const dir of ['cases', 'learn', 'how-it-works', 'for-agents', 'for-humans', 'api', 'tasks', 'stats', 'about']) {
  copyDir(dir);
}
copyRepoDir('.well-known');
console.log('Build complete. dist/ ready for Vercel.');
