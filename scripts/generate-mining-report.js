// scripts/generate-mining-report.js — Reality Mining Report Generator
// Outputs markdown report of what the pipeline harvested, converted, and injected.
// Usage: node scripts/generate-mining-report.js [--json]

const fs = require('fs');
const path = require('path');
const harvester = require('../lib/reality-harvester');
const converter = require('../lib/reality-to-eval');
const adversarial = require('../lib/adversarial-generator');
const seedInjector = require('../lib/memory-seed-injector');

const REPORTS_DIR = path.join(__dirname, '..', 'evals', 'reports', 'mining');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function generate() {
  const isJson = process.argv.includes('--json');

  const latestHarvest = harvester.loadLatestHarvest();
  const goldenTasks = require('../lib/eval-harness').loadGoldenSet();
  const seeds = converter.loadMemorySeeds();
  const advTasks = adversarial.loadGeneratedAdversarial();
  const injectStats = seedInjector.getInjectorStats();

  const now = new Date().toISOString();
  const dateStr = now.split('T')[0];

  if (isJson) {
    return JSON.stringify({
      generated_at: now,
      harvest: latestHarvest ? {
        harvested_at: latestHarvest.harvested_at,
        total_items: latestHarvest.items?.length || 0,
        by_category: latestHarvest.summary?.by_category || {},
        by_breakage: latestHarvest.summary?.by_breakage || {},
      } : null,
      golden: { total: goldenTasks.length },
      seeds: { total: seeds.length },
      adversarial: { total: advTasks.length, by_type: countBy(advTasks, 'adversarial_type') },
      injection: injectStats,
    }, null, 2);
  }

  const byCategory = {};
  const byBreakage = {};
  const harvestItems = latestHarvest?.items || [];
  for (const item of harvestItems) {
    byCategory[item.category] = (byCategory[item.category] || 0) + 1;
    for (const bp of (item.breakage_patterns || [])) {
      byBreakage[bp] = (byBreakage[bp] || 0) + 1;
    }
  }

  const advByType = countBy(advTasks, 'adversarial_type');

  const hasLog = fs.existsSync(path.join(__dirname, '..', 'data', 'pipeline-log.json'));
  let trends = '';
  if (hasLog) {
    try {
      const log = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'pipeline-log.json'), 'utf8'));
      const last5 = Array.isArray(log) ? log.slice(-5) : [];
      if (last5.length > 0) {
        trends = '\n## Pipeline History (last ' + last5.length + ' runs)\n\n| Run | Tasks | Solve Rate | New Tasks | Adversarial |\n|-----|-------|-----------|-----------|-------------|\n';
        for (const r of last5) {
          const date = (r.ran_at || '').split('T')[0];
          trends += `| ${date} | ${r.summary?.total_tasks_now || '?'} | ${r.summary?.solve_rate_now || '?'}% | ${r.steps?.convert?.golden_tasks_created || 0} | ${r.steps?.adversarial?.ingested_into_golden || 0} |\n`;
        }
      }
    } catch {}
  }

  const md = `# Reality Mining Report — ${dateStr}

## Harvest

| Source | Count |
|--------|-------|
| GitHub Issues | ${byCategory.github || harvestItems.filter(i => i.source === 'github').length} |
| Stack Overflow | ${harvestItems.filter(i => i.source === 'stackoverflow').length} |
| **Total Fresh** | ${harvestItems.length} |

### By Category

${Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`).join('\n')}

### By Breakage Pattern

${Object.entries(byBreakage).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`).join('\n')}

## Golden Task Set

| Metric | Value |
|--------|-------|
| Total Golden Tasks | ${goldenTasks.length} |
| From Harvest | ${goldenTasks.filter(t => t.source_harvest_id && t.source_harvest_id.startsWith('HARVEST_')).length} |
| Auto-Generated | ${goldenTasks.filter(t => t.tags?.includes('auto-generated')).length} |
| Adversarial Ingested | ${goldenTasks.filter(t => t.tags?.includes('adversarial')).length} |

## Memory Seeds

| Metric | Value |
|--------|-------|
| Total Seeds | ${seeds.length} |
| Injected into Cache | ${injectStats.active} active, ${injectStats.decaying} decaying |

## Adversarial Tasks

| Type | Count |
|------|-------|
${Object.entries(advByType).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`).join('\n')}
| **Total** | **${advTasks.length}** |

${trends}
---

*Generated at ${now} by Reality Pipeline*
`;

  ensureDir(REPORTS_DIR);
  const reportPath = path.join(REPORTS_DIR, `mining-report-${dateStr}.md`);
  fs.writeFileSync(reportPath, md);
  console.log('Report saved to:', reportPath);
  return md;
}

function countBy(arr, key) {
  const counts = {};
  for (const item of arr) {
    const val = item[key] || 'unknown';
    counts[val] = (counts[val] || 0) + 1;
  }
  return counts;
}

if (require.main === module) {
  generate();
}

module.exports = { generate };
