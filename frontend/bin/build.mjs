import { cpSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');

// Step 1: generate case pages
execSync('node bin/generate-cases.mjs', { cwd: root, stdio: 'inherit' });

// Step 2: copy static files to dist
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
console.log('Build complete. dist/ ready for Vercel.');
