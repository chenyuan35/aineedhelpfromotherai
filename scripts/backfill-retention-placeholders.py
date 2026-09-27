#!/usr/bin/env python3
"""Backfill honest `unknown` retention placeholders for carrier-mobile routes
that entered catalog.json without a researched retention-intelligence record.

No rules, costs, windows or deadlines are invented: every placeholder is
status=unknown / confidence=unknown / null costs / reminder unavailable.
"""
import json
from pathlib import Path

tool = Path(__file__).resolve().parent.parent / 'frontend' / 'tools' / 'phone-number-lifecycle-mvp'
catalog = json.loads((tool / 'catalog.json').read_text())
tutorial = json.loads((tool / 'tutorial-insights.json').read_text())
ret_path = tool / 'retention-intelligence.json'
ret = json.loads(ret_path.read_text())

routes = list(catalog['routes']) + list(tutorial.get('additionalRoutes') or [])
carrier = sorted(r['id'] for r in routes if r.get('numberClass') == 'carrier-mobile')

PLACEHOLDER = {
    "status": "unknown",
    "confidence": "unknown",
    "last_verified_at": "2026-09-27",
    "inactivity_window": "Not yet researched in the retention-intelligence layer. Do not infer a validity window from the directory entry.",
    "clock_start_or_reset": "Not yet researched.",
    "qualifying_activity": [],
    "non_qualifying_or_unknown_activity": [
        "No retention rule has been verified for this route yet; treat every candidate keep-alive action as unconfirmed."
    ],
    "lowest_cost_documented_action": "Not yet researched.",
    "safest_documented_action": "Verify the current provider terms before relying on this route for long-term number retention.",
    "minimum_expected_cost": None,
    "recommended_buffer": None,
    "grace_or_rescue_window": "Not yet researched.",
    "termination_and_recycling": "Not yet researched.",
    "sources": [],
    "reminder": {
        "status": "unavailable",
        "reason": "No verified retention rule exists for this route yet; no deadline can be computed."
    }
}

added = []
for rid in carrier:
    if rid not in ret['routes']:
        ret['routes'][rid] = dict(PLACEHOLDER)
        added.append(rid)

ret['routes'] = dict(sorted(ret['routes'].items()))
ret_path.write_text(json.dumps(ret, ensure_ascii=False, indent=1) + '\n')
print(f'added {len(added)} unknown placeholders; total retention records: {len(ret["routes"])}')
