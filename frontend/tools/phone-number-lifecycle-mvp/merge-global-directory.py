#!/usr/bin/env python3
"""Merge uk-directory-pilot.json + all backstage batches into global-directory.json (same schema + marketName per route)."""
import json, glob, os

BASE = os.path.dirname(os.path.abspath(__file__))

COUNTRY_MAP = {
    'us': 'United States', 'uk': 'United Kingdom', 'gb': 'United Kingdom', 'jp': 'Japan',
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
    'mno': 'United Kingdom',  # uk-mno batch
}

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
    'speakout-711-365voucher-2026': 'Canada', 'telcel-amigo-lifecycle-2026': 'Mexico',
    'jio-prepaid-90d-trai-2026': 'India', 'orange-mobicarte-2026': 'France',
    'sunrise-prepaid-2026': 'Switzerland',
    'aldi-talk-activity-window-2026': 'Germany', 'vodafone-callya-90d-2026': 'Germany',
    'hotlink-pantas-365-pass-2026': 'Malaysia',
    'tim-prepaid-12mo-2026': 'Italy', 'movistar-prepago-6mo-2026': 'Spain',
    'singtel-hi-prepaid-passport-30d-2026': 'Singapore',
    'globe-prepaid-1yr-2026': 'Philippines', 'turkcell-tourist-90d-blocker-2026': 'Turkey',
    'du-prepaid-ae-2026': 'UAE', 'viettel-vtvang-keepnumber-2026': 'Vietnam',
    'three-ie-prepay-lifecycle-2026': 'Ireland', 'orange-pl-nakarte-2026': 'Poland',
    'vodafone-yorn-pt-2026': 'Portugal', 'a1-hr-prepaid-2026': 'Croatia',
    'skinny-prepay-12mo-2026': 'New Zealand', '2degrees-prepay-2026': 'New Zealand',
    'ais-sim2fly-365d-2026': 'Thailand',
    'kpn-prepaid-6mo-2026': 'Netherlands', 'telstra-prepaid-longexpiry-2026': 'Australia',
}

def resolve_country(batch_name, route, brands):
    rid = route.get('id', '')
    if rid in ROUTE_COUNTRY:
        return ROUTE_COUNTRY[rid]
    bid = route.get('brandId', '')
    for code, name in COUNTRY_MAP.items():
        if code == 'mno':
            continue
        if f'-{code}-' in rid or rid.endswith('-' + code) or f'-{code}-' in bid or bid.endswith('-' + code):
            return name
    # batch file name hints: us-batch-a, jp-directory-batch-b, uk-mno-...
    b = batch_name.lower()
    if b.startswith('us-'): return 'United States'
    if b.startswith('jp-'): return 'Japan'
    if b.startswith('hk-'): return 'Hong Kong'
    if b.startswith('nz-th'): return 'New Zealand / Thailand'
    if b.startswith('uk-mno'): return 'United Kingdom'
    if b.startswith('de-my'): return 'Germany / Malaysia'
    if b.startswith('nl-au'): return 'Netherlands / Australia'
    if b.startswith('it-es-sg'): return 'Italy / Spain / Singapore'
    if b.startswith('ca-fr-ch-mx-in'): return 'Canada / France / Switzerland / Mexico / India'
    if b.startswith('ph-tr-ae-vn'): return 'Philippines / Turkey / UAE / Vietnam'
    if b.startswith('ie-pl-pt-hr'): return 'Ireland / Poland / Portugal / Croatia'
    return 'Global'

def main():
    pilot = json.load(open(os.path.join(BASE, 'uk-directory-pilot.json')))
    out = {
        'schemaVersion': pilot.get('schemaVersion', '1.0'),
        'market': 'global',
        'checkedAt': '2026-09-26',
        'status': 'global-directory',
        'notes': 'Merged from UK pilot + 17 backstage batches (2026-09-26).',
        'networks': [], 'brands': [], 'routes': [],
        'serviceObservations': pilot.get('serviceObservations', []),
        'continuityEvents': pilot.get('continuityEvents', []),
        'sources': pilot.get('sources', []),
        'fxSnapshot': pilot.get('fxSnapshot', {}),
    }
    seen_net, seen_brand, seen_route, seen_src = set(), set(), set(), set()
    for n in pilot.get('networks', []):
        if n['id'] not in seen_net:
            seen_net.add(n['id']); out['networks'].append(n)
    for b in pilot.get('brands', []):
        if b['id'] not in seen_brand:
            seen_brand.add(b['id']); out['brands'].append(b)
    for r in pilot.get('routes', []):
        if r['id'] not in seen_route:
            seen_route.add(r['id'])
            r2 = dict(r); r2.setdefault('marketName', 'United Kingdom')
            out['routes'].append(r2)
    for s in out['sources']:
        if isinstance(s, dict) and s.get('id'): seen_src.add(s['id'])

    files = sorted(glob.glob(os.path.join(BASE, '*batch*.json')))
    files = [f for f in files if 'uk-directory-pilot' not in f]
    for f in files:
        batch = json.load(open(f))
        bname = os.path.basename(f)
        brands = batch.get('brands', [])
        for n in batch.get('networks', []):
            if n['id'] not in seen_net:
                seen_net.add(n['id']); out['networks'].append(n)
        for b in brands:
            if b['id'] not in seen_brand:
                seen_brand.add(b['id']); out['brands'].append(b)
        for r in batch.get('routes', []):
            if r['id'] in seen_route:
                continue
            seen_route.add(r['id'])
            r2 = dict(r)
            r2['marketName'] = resolve_country(bname, r, brands)
            out['routes'].append(r2)
        # synth sources from sourceIds
        for r in batch.get('routes', []):
            for sid in r.get('sourceIds', []):
                if sid not in seen_src:
                    seen_src.add(sid)
                    out['sources'].append({
                        'id': sid,
                        'url': r.get('acquireUrl', ''),
                        'type': 'provider-official' if 'official' in sid else 'community-report',
                        'reportedAt': batch.get('checkedAt', '2026-09-26'),
                    })
    json.dump(out, open(os.path.join(BASE, 'global-directory.json'), 'w'), ensure_ascii=False, indent=1)
    from collections import Counter
    c = Counter(r['marketName'] for r in out['routes'])
    print(f"global-directory.json: {len(out['routes'])} routes, {len(out['brands'])} brands, {len(out['sources'])} sources")
    print(f"markets: {len(c)}")

if __name__ == '__main__':
    main()
