#!/usr/bin/env python3
"""Merge backstage batch-*.json files (uk-directory-pilot schema) into catalog.json (frontend MVP schema)."""
import json, glob, os, sys

BASE = os.path.dirname(os.path.abspath(__file__))
CATALOG = os.path.join(BASE, 'catalog.json')

COUNTRY_MAP = {
    'us': 'United States', 'gb': 'United Kingdom', 'uk': 'United Kingdom', 'jp': 'Japan',
    'hk': 'Hong Kong', 'nz': 'New Zealand', 'th': 'Thailand', 'de': 'Germany', 'my': 'Malaysia',
    'nl': 'Netherlands', 'au': 'Australia', 'it': 'Italy', 'es': 'Spain', 'sg': 'Singapore',
    'ca': 'Canada', 'fr': 'France', 'ch': 'Switzerland', 'mx': 'Mexico', 'in': 'India',
    'ph': 'Philippines', 'tr': 'Turkey', 'ae': 'UAE', 'vn': 'Vietnam', 'ie': 'Ireland',
    'pl': 'Poland', 'pt': 'Portugal', 'hr': 'Croatia', 'id': 'Indonesia', 'za': 'South Africa',
    'br': 'Brazil', 'sa': 'Saudi Arabia', 'ar': 'Argentina', 'kr': 'South Korea',
    'at': 'Austria', 'be': 'Belgium', 'cz': 'Czech Republic', 'gr': 'Greece', 'hu': 'Hungary',
    'ro': 'Romania', 'ng': 'Nigeria', 'ke': 'Kenya', 'bd': 'Bangladesh', 'tw': 'Taiwan',
    'pk': 'Pakistan', 'eg': 'Egypt', 'ua': 'Ukraine', 'ru': 'Russia', 'il': 'Israel',
    'qa': 'Qatar', 'cl': 'Chile', 'co': 'Colombia', 'pe': 'Peru', 'se': 'Sweden', 'dk': 'Denmark',
    'fi': 'Finland', 'bg': 'Bulgaria', 'sk': 'Slovakia', 'si': 'Slovenia', 'lt': 'Lithuania',
    'no': 'Norway', 'lv': 'Latvia', 'ee': 'Estonia', 'mt': 'Malta', 'ma': 'Morocco',
    'gh': 'Ghana', 'lk': 'Sri Lanka', 'np': 'Nepal', 'cr': 'Costa Rica', 'cy': 'Cyprus',
    'kz': 'Kazakhstan', 'by': 'Belarus', 'ge': 'Georgia', 'rs': 'Serbia', 'me': 'Montenegro',
    'ba': 'Bosnia', 'az': 'Azerbaijan', 'kh': 'Cambodia', 'uz': 'Uzbekistan', 'kw': 'Kuwait',
    'om': 'Oman', 'bs': 'Bahamas', 'jm': 'Jamaica', 'tz': 'Tanzania', 'sn': 'Senegal',
}

def country_from_batch(batch, route, brands):
    brand = next((b for b in brands if b['id'] == route.get('brandId')), {})
    # infer from brandId suffix: e.g. telkomsel-simpati -> market file name
    market = batch.get('market', '')
    # batch market like 'id-za-br-sa-ar-kr' — ambiguous; use brand id heuristics
    bid = route.get('brandId', '')
    for code, name in COUNTRY_MAP.items():
        if bid.endswith('-' + code) or bid == f'{code}-prepaid':
            return name
    # fallback: look at route id suffix tokens
    rid = route.get('id', '')
    for code, name in COUNTRY_MAP.items():
        if f'-{code}-' in rid or rid.endswith('-' + code):
            return name
    # explicit per-route overrides for ambiguous ones
    return None

ROUTE_COUNTRY = {
    'telkomsel-simpati-365d-2026': 'Indonesia', 'vodacom-prepaid-83d-2026': 'South Africa',
    'claro-pre-br-90d-2026': 'Brazil', 'stc-sawa-sa-2026': 'Saudi Arabia',
    'claro-pre-ar-2026': 'Argentina', 'skt-prepaid-kr-2026': 'South Korea',
    'a1-bfree-at-2026': 'Austria', 'proximus-paygo-be-2026': 'Belgium', 'o2-cz-prepaid-2026': 'Czech Republic',
    'cosmote-frog-13mo-2026': 'Greece', 'vodafone-tuti-hu-2026': 'Hungary', 'orange-prepay-ro-ladder-2026': 'Romania',
    'mtn-ng-keepmynumber-2026': 'Nigeria', 'safaricom-daima-2026': 'Kenya',
    'grameenphone-validity-pack-2026': 'Bangladesh', 'cht-ruyi-180d-2026': 'Taiwan',
    'jazz-pk-2026': 'Pakistan', 'vodafone-eg-2026': 'Egypt',
    'kyivstar-prepaid-274-91-2026': 'Ukraine', 'mts-sokhranyayu-nomer-2026': 'Russia',
    'hotmobile-il-2026': 'Israel', 'ooredoo-hala-qa-2026': 'Qatar', 'claro-pre-cl-2026': 'Chile',
    'claro-pre-co-2026': 'Colombia', 'movistar-pre-pe-2026': 'Peru',
    'telenor-kontantkort-se-2026': 'Sweden', 'telia-dk-prepaid-2026': 'Denmark', 'elisa-prepaid-fi-2026': 'Finland',
    'yettel-prepaid-bg-2026': 'Bulgaria', 'telekom-easy-sk-90d-2026': 'Slovakia',
    'telemach-prepaid-si-2026': 'Slovenia', 'labas-90-120d-2026': 'Lithuania',
    'telenor-kontant-no-2026': 'Norway', 'lmt-karte-60-60d-2026': 'Latvia', 'telia-ee-180d-2026': 'Estonia',
    'go-payasyougo-mt-2026': 'Malta', 'maroc-telecom-prepaid-2026': 'Morocco', 'mtn-gh-prepaid-2026': 'Ghana',
    'dialog-lk-365d-2026': 'Sri Lanka', 'ncell-np-2026': 'Nepal', 'kolbi-cr-2026': 'Costa Rica',
    'cyta-soeasy-cy-2026': 'Cyprus',
    'beeline-kz-simka-v-seyfe-2026': 'Kazakhstan', 'mts-by-2026': 'Belarus',
    'magticom-number-maintenance-2026': 'Georgia', 'mobitel-lk-retention-2026': 'Sri Lanka',
    'yettel-rs-2026': 'Serbia', 'one-me-2026': 'Montenegro', 'bhtelecom-ba-2026': 'Bosnia',
    'bakcell-cin-az-2026': 'Azerbaijan', 'cellcard-kh-2026': 'Cambodia',
    'beeline-uz-2026': 'Uzbekistan', 'cellfie-ge-90-45d-2026': 'Georgia', 'zain-kw-eezee-2026': 'Kuwait',
    'omantel-om-2026': 'Oman', 'btc-bs-2026': 'Bahamas', 'digicel-jm-2026': 'Jamaica',
    'tigo-tz-2026': 'Tanzania', 'orange-sn-sama-numero-2026': 'Senegal',
}

def brand_name(route, brands):
    b = next((x for x in brands if x['id'] == route.get('brandId')), {})
    return b.get('name', route.get('brandId', 'Unknown'))

def to_catalog_route(batch, route, brands):
    bname = brand_name(route, brands)
    country = ROUTE_COUNTRY.get(route['id']) or country_from_batch(batch, route, brands) or 'Global'
    landed = route.get('landedCost') or {}
    keep = route.get('keep') or {}
    state = route.get('publishState', 'observation')
    hold = route.get('holdReason')

    purchase_parts = []
    if landed.get('landedOriginal') and landed.get('currency'):
        purchase_parts.append(f"~{landed['currency']} {landed['landedOriginal']} landed"
            + (f" (≈¥{landed['landedCny']})" if landed.get('landedCny') else ''))
    if landed.get('state'): purchase_parts.append(f"[{landed['state']}]")
    purchase_parts.append(route.get('acquisitionSummary', '')[:300])

    recurring_parts = []
    if keep.get('action'): recurring_parts.append(keep['action'])
    if keep.get('yearCostOriginal') and keep.get('currency'):
        recurring_parts.append(f"≈{keep['currency']} {keep['yearCostOriginal']}/yr"
            + (f" (≈¥{keep['yearCostCny']})" if keep.get('yearCostCny') else ''))
    if keep.get('state'): recurring_parts.append(f"[{keep['state']}]")

    best_for = ['long-term-number']
    if state == 'candidate': best_for.append('verified-candidate')
    if route.get('roamingSms') and 'works' in str(route.get('roamingSms','')).lower(): best_for.append('sms-capable-number')
    if 'eSIM' in str(route.get('simType', '')): best_for.append('esim')

    return {
        'id': route['id'],
        'name': f"{bname} ({country})",
        'provider': bname,
        'country': country,
        'numberClass': 'carrier-mobile' if route.get('numberType') == 'real-mobile' else route.get('numberType', 'unknown'),
        'form': route.get('simType', 'physical SIM'),
        'bestFor': best_for,
        'purchaseUrl': route.get('acquireUrl', ''),
        'cost': {
            'purchase': ' | '.join(purchase_parts) or 'See acquisition notes.',
            'recurring': ' | '.join(recurring_parts) or 'Not established.',
            'dynamic': True,
        },
        'retention': {
            'intervalDays': keep.get('intervalDays'),
            'rule': (keep.get('action') or route.get('acquisitionSummary', ''))[:400],
            'recovery': hold or 'Not documented.',
        },
        'friction': {
            'identity': route.get('kyc', 'unverified'),
            'location': route.get('chinaActivation', 'unverified'),
            'device': 'Unlocked phone; eSIM where offered.',
            'ongoing': f"Status: {state}." + (f" Hold: {hold}" if hold else ''),
        },
        'evidence': [{'label': s, 'url': route.get('acquireUrl', ''), 'type': 'official' if 'official' in s else 'community'} for s in route.get('sourceIds', [])],
        'publishState': state,
        'lastVerifiedAt': route.get('lastVerifiedAt'),
    }

def main():
    catalog = json.load(open(CATALOG))
    existing_ids = {r['id'] for r in catalog['routes']}
    added = 0
    for bf in sorted(glob.glob(os.path.join(BASE, '*batch*.json')) + glob.glob(os.path.join(BASE, '*directory-batch*.json'))):
        batch = json.load(open(bf))
        brands = batch.get('brands', [])
        for route in batch.get('routes', []):
            if route['id'] in existing_ids:
                continue
            catalog['routes'].append(to_catalog_route(batch, route, brands))
            existing_ids.add(route['id'])
            added += 1
    catalog['meta']['verifiedOn'] = '2026-09-26'
    catalog['meta']['totalRoutes'] = len(catalog['routes'])
    json.dump(catalog, open(CATALOG, 'w'), ensure_ascii=False, indent=1)
    print(f'added {added} routes; catalog total = {len(catalog["routes"])}')

if __name__ == '__main__':
    main()
