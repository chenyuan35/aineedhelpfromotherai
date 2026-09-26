// Shared data layer for the Phone Radar surface.
// Single source of truth: tools/phone-number-lifecycle-mvp/global-directory.json
// (merged evidence packet). Every page derives from this at build time.
import { readFileSync } from 'fs';
import { join } from 'path';

// NOTE: import.meta.url points at the prerender bundle after Vite bundles this
// module, so resolve the packet from the Astro project cwd instead (site/).
const dataPath = join(process.cwd(), '..', 'tools', 'phone-number-lifecycle-mvp', 'global-directory.json');
export const data = JSON.parse(readFileSync(dataPath, 'utf8'));

export const SITE = 'https://aineedhelpfromotherai.com';
export const GUIDE_BASE = '/tools/phone-number-survival-guide/';
export const PHONE_BASE = `${SITE}${GUIDE_BASE}`;

export const brandOf = (r) => data.brands.find((b) => b.id === r.brandId);
export const networkOf = (r) => data.networks.find((n) => n.id === brandOf(r)?.networkId);
export const routeOf = (id) => data.routes.find((r) => r.id === id);

export const money = (value, currency = '') =>
  Number.isFinite(value) ? `${currency} ${Number(value).toLocaleString('en-GB', { maximumFractionDigits: 2 })}` : 'Not established';

export const moneyShort = (value, currency = 'GBP') =>
  Number.isFinite(value)
    ? `${currency === 'GBP' ? '£' : currency + ' '}${Number(value).toLocaleString('en-GB', { maximumFractionDigits: 2 })}`
    : 'n/a';

export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const jsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

export function statusLabel(r) {
  if (r.avoidRoute) return 'Avoid — not viable';
  if (r.publishState === 'observation-hold') return 'Observation / hold';
  if (r.publishState === 'candidate') return 'Candidate — evidence captured';
  if (r.publishState === 'observation') return 'Observation — terms pending';
  return 'Pilot route';
}

export function serviceSummary(routeId, service) {
  const rows = (data.serviceObservations || []).filter((x) => x.routeId === routeId && x.service === service);
  if (!rows.length) return 'No normalized community observation yet.';
  const success = rows.filter((x) => x.outcome === 'success').length;
  const failure = rows.filter((x) => x.outcome !== 'success').length;
  const latest = [...rows].sort((a, b) => String(b.reportedAt).localeCompare(String(a.reportedAt)))[0];
  return `${rows.length} report${rows.length === 1 ? '' : 's'} · ${success} success · ${failure} non-success · latest ${latest.reportedAt}`;
}

export const sourcesOf = (r) => (r.sourceIds || []).map((id) => data.sources.find((x) => x.id === id)).filter(Boolean);
export const eventsOf = (r) => (data.continuityEvents || []).filter((x) => x.routeId === r.id);

export function marketGroups() {
  const byMarket = new Map();
  for (const r of data.routes) {
    const m = r.marketName || 'Global';
    if (!byMarket.has(m)) byMarket.set(m, []);
    byMarket.get(m).push(r);
  }
  return byMarket;
}

// ── keep-alive models (ported from bin/publish-phone-keep-alive.mjs) ──────────
const DAY = 86400000;

const stateLabels = {
  'community-reproduced-multi-source': 'Community-reproduced · multi-source',
  'community-reproduced': 'Community-reproduced',
  'account-specific-confirmed-with-conflicting-long-idle-report': 'Account-specific confirmed · conflicting long-idle report',
  'insufficient-evidence': 'Insufficient evidence',
  'official-confirmed': 'Official terms confirmed',
  'official-confirmed-nuanced': 'Official terms confirmed · nuanced',
  'official-policy-verified-2026-09-26': 'Official policy verified 2026-09-26',
  'official-faq-via-specialist-media': 'Official FAQ via specialist media',
  'official-window-plus-community-practice': 'Official window + community practice',
  'official-partial-plus-community': 'Official partial + community evidence',
  'official-confirmed-cumulative-validity': 'Official confirmed · cumulative validity',
  'official-staff-community-confirmed': 'Official staff + community confirmed',
  'official-fee-abolished-validity-ladder': 'Official · fee abolished, validity ladder',
  'official-policy-plus-community-practice': 'Official policy + community practice',
  'operator-rules-via-simcontrol-south-africa': 'Operator rules via specialist source',
  'retailer-listing-plus-community': 'Retailer listing + community evidence',
  'regulatory-norm-media-confirmed': 'Regulatory norm, media-confirmed',
  'community-wiki-needs-official-confirmation': 'Community wiki · needs official confirmation'
};

// Keep-alive action steps, derived from each route's sourced keep.action / guideSteps text.
// Do not add unsourced operational claims here.
const stepsByRoute = {
  'voxi-uk-esim-payg-retention': [
    'Make sure the line holds PAYG credit: VOXI plans carry no balance, so an initial £5 top-up is required first.',
    'Enable roaming or Wi-Fi Calling on the device.',
    'Send one SMS. Community-measured cost: about £0.08 roaming; a Wi-Fi Calling SMS (about £0.24) also qualifies.',
    'Verify the charge appears in your usage history, so the 180-day balance-activity window resets.',
    'Record the date below so this tool computes your next safe deadline.'
  ],
  'lebara-uk-direct-esim-china': [
    'Generate a real chargeable activity (a chargeable call, SMS or small data usage).',
    'Confirm the activity appears in your Lebara account usage history; one account/support interaction confirmed a 90-day reset.',
    'Act by day 70 of each 90-day window (community practical buffer: 70–75 days).',
    'Record the date below so this tool computes your next safe deadline.'
  ],
  'giffgaff-uk-direct-esim-payg': [
    'Create a balance-changing activity; an SMS or small data usage are community-reproduced examples.',
    'Keep enough credit on the line for the activity (official minimum top-up is £10).',
    'Verify the balance changed, so the 180-day window resets.',
    'Keep a recovery / port-out plan: a major overseas closure wave occurred in July 2026.',
    'Record the date below so this tool computes your next safe deadline.'
  ]
};

const shortActionByRoute = {
  'voxi-uk-esim-payg-retention': 'send one SMS',
  'lebara-uk-direct-esim-china': 'make a chargeable activity',
  'giffgaff-uk-direct-esim-payg': 'make a balance-changing activity'
};

export function keepAliveModels() {
  return (data.routes || [])
    .filter((r) => Number.isFinite(r.keep?.intervalDays) && r.keep?.action && r.publishState !== 'observation-hold')
    .map((r) => {
      const brand = brandOf(r) || {};
      const keep = r.keep || {};
      const interval = Number.isFinite(keep.intervalDays) ? keep.intervalDays : null;
      const hold = r.publishState === 'observation-hold' || !interval;
      let safe = null;
      let bufferNote = '';
      if (interval) {
        if (keep.practicalBufferDays) {
          const m = String(keep.practicalBufferDays).match(/\d+/);
          if (m) {
            safe = parseInt(m[0], 10);
            bufferNote = `Community practical buffer: act around day ${keep.practicalBufferDays} of the ${interval}-day window; this tool uses day ${safe}.`;
          }
        }
        if (!safe) {
          safe = interval - Math.ceil(interval * 0.15);
          bufferNote = `Default safety buffer: 15% of the ${interval}-day window, so repeat the action at least every ${safe} days.`;
        }
      }
      const verifiedDaysAgo = r.lastVerifiedAt && data.checkedAt
        ? Math.round((Date.parse(data.checkedAt) - Date.parse(r.lastVerifiedAt)) / DAY)
        : null;
      return {
        id: r.id,
        brandName: brand.name || r.id,
        hold,
        holdReason: r.holdReason || 'Current durable retention is not established.',
        action: keep.action || '',
        interval,
        safe,
        perYearActions: interval ? Math.floor(365 / interval) : null,
        bufferNote,
        perAction: Number.isFinite(keep.observedActionCost) ? keep.observedActionCost : null,
        yearOriginal: Number.isFinite(keep.yearCostOriginal) ? keep.yearCostOriginal : null,
        yearCny: Number.isFinite(keep.yearCostCny) ? keep.yearCostCny : null,
        currency: keep.currency || 'GBP',
        stateLabel: stateLabels[keep.state] || keep.state || 'Unknown',
        lastVerifiedAt: r.lastVerifiedAt || 'unknown',
        stale: verifiedDaysAgo !== null && verifiedDaysAgo > 90,
        steps: stepsByRoute[r.id] || (interval && keep.action ? [
          'Perform the keep-alive action described above, exactly as sourced.',
          'Verify the action registered with the operator (usage history, credit change or validity extension).',
          'Record the date below so this tool computes your next safe deadline.'
        ] : []),
        shortAction: shortActionByRoute[r.id] || 'perform the keep-alive activity',
        marketName: r.marketName || 'Global',
        continuityWarning: r.id === 'giffgaff-uk-direct-esim-payg'
          ? 'A major overseas closure wave occurred in July 2026 — keep a recovery / port-out plan alongside any keep-alive routine.'
          : ''
      };
    });
}

export const keepAliveFaq = [
  ['How often do I need to keep a prepaid number active?',
   'It depends on the operator. Windows range from 60 days to a full year depending on the route. Pick your operator above to see its exact window and a safe repeat rhythm with a 15% buffer.'],
  ['What does it cost per year to keep a number alive?',
   'The cheapest established routes cost under a few CNY per year — a single small SMS or top-up inside the window. Costs shown are community-measured action costs; any balance you top up remains yours.'],
  ['Why is a route missing from this tool?',
   'Only routes with an established, evidence-backed retention window get a calculator. Routes still under observation stay in the directory with their evidence status instead of an invented date rule.']
];
