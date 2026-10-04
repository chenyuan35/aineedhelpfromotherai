const fs = require('fs');

function replaceOnce(file, from, to) {
  const before = fs.readFileSync(file, 'utf8');
  if (!before.includes(from)) throw new Error(`Missing anchor in ${file}: ${from.slice(0,120)}`);
  fs.writeFileSync(file, before.replace(from, to));
}

function insertBefore(file, anchor, text) {
  const before = fs.readFileSync(file, 'utf8');
  if (!before.includes(anchor)) throw new Error(`Missing insert anchor in ${file}: ${anchor}`);
  if (before.includes(text.trim())) return;
  fs.writeFileSync(file, before.replace(anchor, `${text}\n${anchor}`));
}

// PROJECT_CONTEXT: update only current-state claims; keep historical PR #388 baseline intact.
replaceOnce(
  'PROJECT_CONTEXT.md',
  'Canonical is now 159 routes / 87 markets / 156 brands / 117 networks / 618 sources, covering 159/159 currently known evidence-qualified relevant atomic routes',
  'Canonical is now 159 routes / 87 markets / 156 brands / 117 networks / 625 sources, covering 159/159 currently known evidence-qualified relevant atomic routes'
);
replaceOnce(
  'PROJECT_CONTEXT.md',
  '- Phone normalized canonical: **159 routes / 87 markets / 156 brands / 117 networks / 618 sources**.',
  '- Phone normalized canonical: **159 routes / 87 markets / 156 brands / 117 networks / 625 sources**.'
);
replaceOnce(
  'PROJECT_CONTEXT.md',
  'Current state is 159 routes / 87 markets / 156 brands / 117 networks / 618 sources; the final known Macau residual is normalized as backstage HOLD with first-party lifecycle evidence.',
  'Current state is 159 routes / 87 markets / 156 brands / 117 networks / 625 sources; the final known Macau residual is normalized as backstage HOLD with first-party lifecycle evidence, and ClubSIM now carries a threshold-qualified but weak/mixed Telegram registration sample.'
);
replaceOnce(
  'PROJECT_CONTEXT.md',
  '7. **PARALLEL — community/provider evidence maintenance.** Smart Prepaid roaming/SMS evidence was refreshed on 2026-10-04 without changing HOLD/publication; continue append-only Phone and separate Data-eSIM evidence intake; no new DB batch without a genuinely distinct evidence-qualified route trigger.',
  '7. **PARALLEL — community/provider evidence maintenance.** PR #390 added seven deduplicated ClubSIM Telegram registration observations from seven distinct dated community source records, producing a bounded 28.6% observed-success aggregate (2 success / 3 failure / 2 mixed, grade C) while keeping the route backstage-only. Continue the same evidence-density work on another high-value low-cost existing route; no new DB batch without a genuinely distinct evidence-qualified route trigger.'
);

const checkpoint = `## Latest release checkpoint — ClubSIM Telegram evidence density\n\nPR #390 (\`0a2c6a8e9b1529ec227b4a717d37c88cf51109fd\`) normalized seven deduplicated exact \`clubsim-sms-pack-6hkd-2026 + Telegram + registration-verification\` observations from seven distinct dated community source records. The generated aggregate is **n=7 / 7 distinct sources / 2 success / 3 failure / 2 mixed / observed success 28.6% / grade C (Mixed / weak)**. This is a bounded observed community sample, not a universal ClubSIM probability; prefix, client, proxy/IP and roaming conditions remain material. ClubSIM stays \`admitted\` but \`backstage-only\` and is not promoted merely because its keep cost is HK$6/year.\n\nEval Gate #1160 passed; Vercel Preview passed; production deployment \`dpl_8U971UeoANGmLdu86JfNoPdmD5C4\` reached READY. The live ClubSIM lazy-detail JSON and \`phone-route-summaries.json\` both returned HTTP 200 with the new aggregate. Canonical is now **159 routes / 87 markets / 156 brands / 117 networks / 625 sources**; publication remains **135 comparison / 3 indexable / 31 sitemap URLs**.\n\n`;
insertBefore('PROJECT_CONTEXT.md', '## Latest release checkpoint — Phone evidence-gated Top decision layer', checkpoint);

// MASTER_PLAN: current sprint only.
replaceOnce(
  'docs/MASTER_PLAN.md',
  'DB-C21 through DB-C23 plus the bounded Saily, LuckySIM and China Telecom Macau residual admissions leave canonical at **159 routes / 87 markets / 156 brands / 117 networks / 618 sources** and **159/159 of the current known evidence-qualified relevant atomic route universe**.',
  'DB-C21 through DB-C23 plus the bounded Saily, LuckySIM and China Telecom Macau residual admissions leave canonical at **159 routes / 87 markets / 156 brands / 117 networks / 625 sources** and **159/159 of the current known evidence-qualified relevant atomic route universe**.'
);
replaceOnce(
  'docs/MASTER_PLAN.md',
  '5. **PARALLEL — evidence-density maintenance.** Continue append-only Phone/community and separate Data-eSIM evidence intake, with priority on independent service-specific outcomes for the highest-value low-cost routes so thin qualitative app evidence can mature into defensible aggregates. Re-open a DB batch only for a genuinely new evidence-qualified atomic route.',
  '5. **PARALLEL — evidence-density maintenance.** PR #390 matured ClubSIM Telegram registration to a threshold-qualified but weak/mixed aggregate: 7 deduplicated observations / 7 distinct sources / 2 success / 3 failure / 2 mixed / 28.6% observed success / grade C. ClubSIM remains backstage-only; the next maintenance pass should apply the same exact route+service+operation discipline to another high-value low-cost existing route. Continue separate Data-eSIM intake; re-open a DB batch only for a genuinely new evidence-qualified atomic route.'
);

// CURRENT_EXECUTION_QUEUE: add the completed packet before NEXT and advance only the evidence-density lane.
const queueSection = `## JUST COMPLETED — ClubSIM Telegram evidence-density maintenance\n\nPR #390 squash-merged as \`0a2c6a8e9b1529ec227b4a717d37c88cf51109fd\`.\n\n- Existing route: \`clubsim-sms-pack-6hkd-2026\`, one of the lowest-cost real-mobile long-term routes in canonical at normalized HK$50 entry and HK$6 / 365-day keep cost.\n- Added **7 distinct dated community source records** and **7 deduplicated exact route + Telegram + registration-verification observations**.\n- Generated aggregate: **2 success / 3 failure / 2 mixed / n=7 / 7 distinct sources / observed success 28.6% / grade C (Mixed / weak)**. The percentage is a bounded community-observation aggregate, not a universal carrier probability.\n- ClubSIM remains \`admitted\` but \`backstage-only\`; cheap keep cost does not override weak/mixed Telegram reliability evidence. No new route URL, indexability rule or sitemap entry was created.\n- Source corpus becomes **625**. Canonical remains **159 routes / 87 markets / 156 brands / 117 networks**; public boundary remains **135 comparison / 3 indexable / 31 sitemap URLs**.\n- Branch regression workflow #37191691290: **PASS**. Eval Gate #1160: **PASS**. Vercel Preview: **PASS**. Production deployment \`dpl_8U971UeoANGmLdu86JfNoPdmD5C4\`: **READY**. Live ClubSIM detail JSON and live \`phone-route-summaries.json\`: **HTTP 200** with the 28.6% aggregate.\n\n`;
insertBefore('docs/CURRENT_EXECUTION_QUEUE.md', '## NEXT — Measurement + evidence-density maintenance, no invented expansion', queueSection);
replaceOnce(
  'docs/CURRENT_EXECUTION_QUEUE.md',
  '2. **Evidence-density maintenance:** prioritize independent, dated service-specific outcomes for the highest-value low-cost existing Phone routes, especially exact route + app/service + operation observations. The immediate goal is to mature thin qualitative compatibility evidence toward the >=5 deduplicated / >=5 distinct-source threshold where a real success percentage becomes defensible. Preserve failures/mixed outcomes equally; do not manufacture percentages. Continue separate Data-eSIM intake independently.',
  '2. **Evidence-density maintenance:** ClubSIM Telegram has now crossed the >=5 deduplicated / >=5 distinct-source display threshold but remains weak/mixed. Select another high-value low-cost existing route with thin service evidence and repeat the exact route + app/service + operation acquisition pattern. Preserve failures/mixed outcomes equally; do not manufacture percentages or promote a route solely on low price. Continue separate Data-eSIM intake independently.'
);

// Task-specific release closeout.
const evidenceDoc = 'docs/PHONE_CLUBSIM_TELEGRAM_EVIDENCE_2026-10-04.md';
const evidenceBefore = fs.readFileSync(evidenceDoc, 'utf8');
const release = `\n\n## Release closeout\n\n- PR #390 squash-merged as \`0a2c6a8e9b1529ec227b4a717d37c88cf51109fd\`.\n- Branch regression workflow #37191691290 passed.\n- Eval Gate #1160 passed and Vercel Preview passed.\n- Production deployment \`dpl_8U971UeoANGmLdu86JfNoPdmD5C4\` reached READY.\n- Live \`/tools/phone-number-survival-guide/phone-route-data/clubsim-sms-pack-6hkd-2026.json\` returned HTTP 200 with n=7 / 7 distinct sources / 2 success / 3 failure / 2 mixed / 28.6% / grade C.\n- Live \`phone-route-summaries.json\` returned HTTP 200 with the same aggregate and ClubSIM decision facts.\n- Canonical source corpus is now 625; publication remains 135 comparison / 3 indexable / 31 sitemap URLs. No standalone ClubSIM SEO page was created.\n`;
if (!evidenceBefore.includes('## Release closeout')) fs.writeFileSync(evidenceDoc, evidenceBefore.trimEnd() + release + '\n');

console.log('ClubSIM Telegram closeout applied');
