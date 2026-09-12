import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const slugs = [
  'manus-credits-reset',
  'replit-usage-reset',
  'cursor-usage-reset',
  'ai-credit-burn-rate-calculator'
];

const fixedDownloadIcs = `function downloadIcs(title,start,description){
  const end=new Date(start.getTime()+15*60*1000);
  const stamp=d=>d.toISOString().replaceAll('-','').replaceAll(':','').split('.')[0]+'Z';
  const clean=s=>String(s).split(String.fromCharCode(10)).join(' ').split(';').join(' ').split(',').join(' ');
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Everyday Tools//Reset Tracker//EN','BEGIN:VEVENT','UID:'+Date.now()+'@aineedhelpfromotherai.com','DTSTAMP:'+stamp(new Date()),'DTSTART:'+stamp(start),'DTEND:'+stamp(end),'SUMMARY:'+clean(title),'DESCRIPTION:'+clean(description||''),'END:VEVENT','END:VCALENDAR'].join(String.fromCharCode(13,10));
  const url=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));
  const a=document.createElement('a');a.href=url;a.download=title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'.ics';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}`;

for (const slug of slugs) {
  const file = join(root, 'tools', slug, 'index.html');
  let html = readFileSync(file, 'utf8');
  const start = html.indexOf('function downloadIcs(title,start,description){');
  const marker = '\n}\n\n\nconst ';
  const endMarker = html.indexOf(marker, start);
  if (start < 0 || endMarker < 0) throw new Error(`Could not locate downloadIcs in ${slug}`);
  html = html.slice(0, start) + fixedDownloadIcs + html.slice(endMarker + 2);

  const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
    .filter(m => !m[0].includes(' src=') && !m[0].includes('application/ld+json'))
    .map(m => m[1]);
  for (const code of inlineScripts) new Function(code);
  writeFileSync(file, html);
}

console.log('Fixed and syntax-checked AI reset tool client scripts.');
