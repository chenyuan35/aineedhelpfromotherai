const fs = require('fs');
const path = require('path');

const root = process.cwd();
const p = (...xs) => path.join(root, ...xs);
const read = (file) => JSON.parse(fs.readFileSync(p(file), 'utf8'));
const write = (file, value) => fs.writeFileSync(p(file), JSON.stringify(value, null, 2) + '\n');
const appendUnique = (rows, additions) => {
  const ids = new Set(rows.map(x => x.id));
  for (const row of additions) if (!ids.has(row.id)) rows.push(row);
};

const routeId = 'clubsim-sms-pack-6hkd-2026';
const sourceRows = [
  { id: 'shuzijumin-clubsim-telegram-success-20240321', url: 'https://shuzijumin.com/thread-235-7-1.html', type: 'community-report', reportedAt: '2024-03-21' },
  { id: 'v2ex-clubsim-telegram-failure-20240412', url: 'https://www.v2ex.com/t/1031998', type: 'community-report', reportedAt: '2024-04-12' },
  { id: 'linuxdo-clubsim-telegram-failure-20250219', url: 'https://linux.do/t/topic/439461', type: 'community-report', reportedAt: '2025-02-19' },
  { id: 'v2ex-clubsim-telegram-mnp-failure-20251101', url: 'https://www.v2ex.com/t/1168757', type: 'community-report', reportedAt: '2025-11-01' },
  { id: 'naixi-clubsim-telegram-conflict-20260729', url: 'https://forum.naixi.net/thread-13360-1-1.html', type: 'community-report', reportedAt: '2026-07-29' },
  { id: 'naixi-clubsim-telegram-success-20260918', url: 'https://forum.naixi.net/thread-15515-1-1.html', type: 'community-report', reportedAt: '2026-09-18' },
  { id: 'v2ex-clubsim-telegram-conditional-20260918', url: 'https://www.v2ex.com/t/1243080', type: 'community-report', reportedAt: '2026-09-18' }
];
const observationsToAdd = [
  { id: 'obs-clubsim-telegram-shuzijumin-20240321', routeId, service: 'Telegram', operation: 'registration-verification', outcome: 'success', reportedAt: '2024-03-21', geography: 'unspecified', sourceId: 'shuzijumin-clubsim-telegram-success-20240321', dedupeKey: 'clubsim-shuzijumin-235-p7-richardwhite-telegram' },
  { id: 'obs-clubsim-telegram-v2ex-20240412', routeId, service: 'Telegram', operation: 'registration-verification', outcome: 'failure', reportedAt: '2024-04-12', geography: 'mainland-China', sourceId: 'v2ex-clubsim-telegram-failure-20240412', dedupeKey: 'clubsim-v2ex-1031998-blackboar-telegram' },
  { id: 'obs-clubsim-telegram-linuxdo-20250219', routeId, service: 'Telegram', operation: 'registration-verification', outcome: 'failure', reportedAt: '2025-02-19', geography: 'mainland-China', sourceId: 'linuxdo-clubsim-telegram-failure-20250219', dedupeKey: 'clubsim-linuxdo-439461-scckk-telegram' },
  { id: 'obs-clubsim-telegram-v2ex-20251101', routeId, service: 'Telegram', operation: 'registration-verification', outcome: 'failure', reportedAt: '2025-11-01', geography: 'unspecified', sourceId: 'v2ex-clubsim-telegram-mnp-failure-20251101', dedupeKey: 'clubsim-v2ex-1168757-mschultz-telegram' },
  { id: 'obs-clubsim-telegram-naixi-mixed-20260729', routeId, service: 'Telegram', operation: 'registration-verification', outcome: 'mixed', reportedAt: '2026-07-29', geography: 'unspecified', sourceId: 'naixi-clubsim-telegram-conflict-20260729', dedupeKey: 'clubsim-naixi-13360-thread-telegram-mixed' },
  { id: 'obs-clubsim-telegram-naixi-success-20260918', routeId, service: 'Telegram', operation: 'registration-verification', outcome: 'success', reportedAt: '2026-09-18', geography: 'unspecified', sourceId: 'naixi-clubsim-telegram-success-20260918', dedupeKey: 'clubsim-naixi-15515-sing-telegram' },
  { id: 'obs-clubsim-telegram-v2ex-conditional-20260918', routeId, service: 'Telegram', operation: 'registration-verification', outcome: 'failure-then-success', reportedAt: '2026-09-18', geography: 'mainland-China', sourceId: 'v2ex-clubsim-telegram-conditional-20260918', dedupeKey: 'clubsim-v2ex-1243080-gaoshang-telegram' }
];

const sources = read('data/phone/v1/sources.json');
appendUnique(sources, sourceRows);
write('data/phone/v1/sources.json', sources);

const observations = read('data/phone/v1/observations.json');
appendUnique(observations, observationsToAdd);
write('data/phone/v1/observations.json', observations);

const routes = read('data/phone/v1/routes.json');
const route = routes.find(x => x.id === routeId);
if (!route) throw new Error('ClubSIM canonical route missing');
route.sourceIds = [...new Set([...(route.sourceIds || []), ...sourceRows.map(x => x.id)])];
route.lastVerifiedAt = '2026-10-04';
write('data/phone/v1/routes.json', routes);

const events = read('data/phone/v1/events.json');
appendUnique(events, [{
  id: 'evt-clubsim-telegram-evidence-density-20261004',
  routeId,
  type: 'service-verification-evidence-density',
  reportedAt: '2026-10-04',
  scope: 'seven-independent-community-threads',
  outcome: 'Seven distinct dated community threads now support a Telegram registration-verification aggregate for ClubSIM. Outcomes remain mixed across prefix, client, proxy/IP and roaming conditions; this is evidence of variability, not a universal carrier success probability.',
  sourceId: 'v2ex-clubsim-telegram-conditional-20260918'
}]);
write('data/phone/v1/events.json', events);

const snapshots = read('data/phone/v1/snapshots.json');
if (!snapshots.some(x => x.id === 'snap-clubsim-sms-pack-6hkd-2026-telegram-evidence-20261004')) {
  const prev = [...snapshots].reverse().find(x => x.routeId === routeId && x.kind === 'current-profile');
  if (!prev) throw new Error('ClubSIM current-profile snapshot missing');
  const next = JSON.parse(JSON.stringify(prev));
  next.id = 'snap-clubsim-sms-pack-6hkd-2026-telegram-evidence-20261004';
  next.checkedAt = '2026-10-04';
  next.data.lastVerifiedAt = '2026-10-04';
  next.data.trend = 'low-cost-but-mixed-telegram-verification';
  next.data.roamingSms = 'Ordinary incoming SMS abroad remains usable, but Telegram registration evidence is mixed. Seven distinct dated community threads now yield 2 success, 3 failure and 2 mixed/conditional observations; the generated observed-success figure is 28.6% (n=7), not a universal probability. Prefix, client, proxy/IP and roaming path materially affect outcomes.';
  next.data.sourceIds = [...new Set([...(next.data.sourceIds || []), ...sourceRows.map(x => x.id)])];
  snapshots.push(next);
}
write('data/phone/v1/snapshots.json', snapshots);

const testPath = p('scripts/test-phone-clubsim-telegram-maintenance.mjs');
fs.writeFileSync(testPath, `import fs from 'node:fs';\nimport assert from 'node:assert/strict';\nconst read = p => JSON.parse(fs.readFileSync(p, 'utf8'));\nconst routes = read('data/phone/v1/routes.json');\nconst sources = read('data/phone/v1/sources.json');\nconst observations = read('data/phone/v1/observations.json');\nconst detail = read('frontend/tools/phone-number-lifecycle-mvp/phone-route-data/clubsim-sms-pack-6hkd-2026.json');\nconst summary = read('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json').routes.find(x => x.id === 'clubsim-sms-pack-6hkd-2026');\nconst route = routes.find(x => x.id === 'clubsim-sms-pack-6hkd-2026');\nassert(route);\nconst ids = ${JSON.stringify(sourceRows.map(x => x.id))};\nfor (const id of ids) { assert(route.sourceIds.includes(id)); assert(sources.some(x => x.id === id)); }\nconst obs = observations.filter(x => x.routeId === route.id && x.service === 'Telegram' && x.operation === 'registration-verification');\nassert.equal(obs.length, 7);\nassert.equal(new Set(obs.map(x => x.sourceId)).size, 7);\nconst agg = detail.serviceEvidence.find(x => x.serviceId === 'telegram' && x.operation === 'registration-verification');\nassert(agg);\nassert.equal(agg.sampleSize, 7);\nassert.equal(agg.independentSourceCount, 7);\nassert.equal(agg.successCount, 2);\nassert.equal(agg.failureCount, 3);\nassert.equal(agg.mixedCount, 2);\nassert.equal(agg.percentageEligible, true);\nassert.equal(agg.successRatePct, 28.6);\nassert.equal(agg.grade, 'C');\nassert(summary);\nconst sag = summary.serviceEvidence.find(x => x.serviceId === 'telegram' && x.operation === 'registration-verification');\nassert.equal(sag.successRatePct, 28.6);\nassert.equal(summary.decisionFacts.sourceCount, 11);\nassert.equal(route.surfaceState, 'backstage-only');\nassert.equal(route.evidenceState, 'admitted');\nconsole.log('ClubSIM Telegram evidence maintenance OK');\n`);

const pkg = JSON.parse(fs.readFileSync(p('package.json'), 'utf8'));
if (!pkg.scripts['phone:data:check'].includes('test-phone-clubsim-telegram-maintenance.mjs')) {
  pkg.scripts['phone:data:check'] += ' && node scripts/test-phone-clubsim-telegram-maintenance.mjs';
  fs.writeFileSync(p('package.json'), JSON.stringify(pkg, null, 2) + '\n');
}

const doc = `# ClubSIM Telegram Evidence Density Maintenance — 2026-10-04\n\nStatus: reviewed data-maintenance packet for the existing canonical route \`${routeId}\`.\n\n## Why this route\n\nClubSIM is one of the lowest-cost long-term real-mobile routes in the canonical data: current normalized entry cost HK$50 and keep cost HK$6 per 365 days. Before this maintenance pass it had no normalized service observations, so its low price could not answer the user question \"does this actually work for verification?\"\n\n## Telegram evidence normalized\n\nSeven distinct dated community thread URLs were reviewed and normalized for the exact route + Telegram + registration-verification operation:\n\n- 2024-03-21 Shuzijumin: success.\n- 2024-04-12 V2EX: failure while roaming in mainland China.\n- 2025-02-19 Linux.do: failure in mainland China; WhatsApp was reported working in the same post but is not counted in the Telegram aggregate.\n- 2025-11-01 V2EX: failure; the reporter said Telegram verification worked after moving the number to another carrier.\n- 2026-07-29 Naixi thread: mixed/conflicting ClubSIM Telegram outcomes, including a success report and a 9-prefix failure report; normalized conservatively as one mixed thread-level observation.\n- 2026-09-18 Naixi: success report for Telegram registration.\n- 2026-09-18 V2EX: failure under Wi-Fi/proxy conditions followed by success after switching to ClubSIM roaming data without proxy; normalized as mixed/conditional.\n\nGenerated aggregate after dedupe: **n=7 / 7 distinct source records / 2 success / 3 failure / 2 mixed / observed success 28.6% / grade C (Mixed / weak)**. This percentage is a bounded community-observation aggregate, not a universal probability for every ClubSIM number, prefix, client, location or IP environment.\n\n## Product decision\n\nKeep the route \`admitted\` but \`backstage-only\`. Do not promote it to a Top recommendation merely because it is cheap. The new evidence materially improves the database because users can now see that the HK$6/year route has weak/mixed Telegram verification behavior. No SEO URL or sitemap state changes.\n`;
fs.writeFileSync(p('docs/PHONE_CLUBSIM_TELEGRAM_EVIDENCE_2026-10-04.md'), doc);

console.log('Applied ClubSIM Telegram evidence maintenance');
