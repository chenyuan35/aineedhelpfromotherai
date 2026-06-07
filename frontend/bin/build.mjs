import { cpSync, mkdirSync, readdirSync, existsSync } from 'fs';
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
execSync('node bin/generate-sitemap.mjs', { cwd: root, stdio: 'inherit' });

// Step 3: copy static files to dist
mkdirSync(dist, { recursive: true });
const files = ['index.html', 'llms.txt', 'ai.txt', 'robots.txt', 'sitemap.xml', 'vercel.json'];
for (const f of files) {
  cpSync(join(root, f), join(dist, f));
}
if (existsSync(join(root, 'cases'))) {
  mkdirSync(join(dist, 'cases'), { recursive: true });
  for (const f of readdirSync(join(root, 'cases'))) {
    cpSync(join(root, 'cases', f), join(dist, 'cases', f));
  }
}
if (existsSync(join(root, 'learn'))) {
  mkdirSync(join(dist, 'learn'), { recursive: true });
  for (const f of readdirSync(join(root, 'learn'))) {
    cpSync(join(root, 'learn', f), join(dist, 'learn', f));
  }
}
console.log('Build complete. dist/ ready for Vercel.');
