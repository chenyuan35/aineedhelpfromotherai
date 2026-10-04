from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def replace_once(path, old, new):
    p = ROOT / path
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"marker not found in {path}: {old[:120]!r}")
    p.write_text(text.replace(old, new, 1))

# PROJECT_CONTEXT: persist the material production release without disturbing the compact checkpoint table.
replace_once(
    "PROJECT_CONTEXT.md",
    "## Immediate priority\n",
    """## Latest release checkpoint — Phone evidence-gated Top decision layer

PR #388 (`f171726bde05245bc41c284d718ab32a64298f40`) released the first evidence-gated Top decision layer on the existing Phone Radar canonical. The default long-term-number view now derives **Lowest setup cost**, **Lowest yearly keep**, **Longest verified keep window**, **Best app-verification evidence**, and **Best-documented continuity** from normalized canonical data. Top winners are restricted to admitted, user-visible real-mobile long-term routes; HOLD and backstage-only rows cannot win. Service success percentages remain `null` unless the exact route + service + operation aggregate has at least **5 deduplicated observations from 5 distinct source records**. The layer also exposes compact decision facts including source count, KYC state, keep action, roaming-SMS evidence and continuity-warning signals. It does **not** invent a ban/recycle probability or arbitrary 0–100 safety score.

Eval Gate #1156 passed; Vercel Preview passed; production deployment `dpl_3HFruLPEyUj7hafRpQAAiBEQxSdL` reached READY. The apex Phone Radar and live `phone-route-summaries.json` returned HTTP 200 with the new decision fields. Canonical/publication counts remain **159 routes / 87 markets / 156 brands / 117 networks / 618 sources**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## Immediate priority
""",
)

# MASTER_PLAN: record the shipped user-facing decision layer and move evidence density into the active lane.
replace_once(
    "docs/MASTER_PLAN.md",
    """4. **PARALLEL — evidence maintenance.** Continue append-only Phone/community and separate Data-eSIM evidence intake. Re-open a DB batch only for a genuinely new evidence-qualified atomic route.
5. **WAIT — Phone Search Console publication decision.** Do not launch another public page wave until settled Phone impressions reach 20 or finalized data reaches 2026-10-05, whichever comes first.
6. **ONGOING — Relay data accrual.** No search-led expansion without evidence.
7. **WAIT — TikTok advanced Direct Post review.** Do not resubmit unless TikTok rejects or requests new evidence. Authority batch 2 remains waiting.
""",
    """4. **DONE — evidence-gated Top decision layer.** PR #388 / `f171726bde05245bc41c284d718ab32a64298f40` derives low-cost/retention/app-evidence decision shortcuts from normalized Phone data on the existing canonical URL. HOLD/backstage rows cannot win; success percentages require >=5 deduplicated observations from >=5 distinct source records; no arbitrary safety score or new SEO URL was introduced.
5. **PARALLEL — evidence-density maintenance.** Continue append-only Phone/community and separate Data-eSIM evidence intake, with priority on independent service-specific outcomes for the highest-value low-cost routes so thin qualitative app evidence can mature into defensible aggregates. Re-open a DB batch only for a genuinely new evidence-qualified atomic route.
6. **WAIT — Phone Search Console publication decision.** Do not launch another public page wave until settled Phone impressions reach 20 or finalized data reaches 2026-10-05, whichever comes first.
7. **ONGOING — Relay data accrual.** No search-led expansion without evidence.
8. **WAIT — TikTok advanced Direct Post review.** Do not resubmit unless TikTok rejects or requests new evidence. Authority batch 2 remains waiting.
""",
)

# CURRENT_EXECUTION_QUEUE: close the release and make the next data task explicit.
replace_once(
    "docs/CURRENT_EXECUTION_QUEUE.md",
    "## NEXT — Measurement + maintenance, no invented expansion\n",
    """## JUST COMPLETED — Evidence-gated Phone Top decision layer

PR #388 squash-merged as `f171726bde05245bc41c284d718ab32a64298f40`.

- Existing Phone Radar canonical now renders five derived decision shortcuts: lowest setup cost, lowest yearly keep, longest verified keep window, best app-verification evidence, and best-documented continuity.
- Top eligibility is conservative: long-term + real-mobile + admitted + user-visible. HOLD and backstage-only rows cannot win.
- Route summaries now expose source count, KYC state, keep action, roaming-SMS evidence, HOLD reason, and continuity-warning counts for transparent downstream decisions.
- Service aggregates expose success/failure/mixed counts and distinct-source counts. `successRatePct` remains `null` unless an exact route + service + operation group has at least 5 deduplicated observations from 5 distinct source records.
- No arbitrary 0–100 safety score or unsupported "least likely to be banned/recycled" probability was added; continuity is expressed through verified keep windows, warning events and evidence depth.
- Eval Gate #1156: **PASS**. Vercel Preview: **READY**. Production deployment `dpl_3HFruLPEyUj7hafRpQAAiBEQxSdL`: **READY**. Apex Phone Radar and live `phone-route-summaries.json`: HTTP 200 with the new fields.
- Counts and publication boundary are unchanged: **159 routes / 87 markets / 156 brands / 117 networks / 618 sources**, **135 comparison / 3 indexable / 31 sitemap URLs**.

## NEXT — Measurement + evidence-density maintenance, no invented expansion
""",
)
replace_once(
    "docs/CURRENT_EXECUTION_QUEUE.md",
    "2. **Evidence maintenance:** continue append-only community/provider evidence acquisition for existing Phone routes and separate Data-eSIM.\n",
    "2. **Evidence-density maintenance:** prioritize independent, dated service-specific outcomes for the highest-value low-cost existing Phone routes, especially exact route + app/service + operation observations. The immediate goal is to mature thin qualitative compatibility evidence toward the >=5 deduplicated / >=5 distinct-source threshold where a real success percentage becomes defensible. Preserve failures/mixed outcomes equally; do not manufacture percentages. Continue separate Data-eSIM intake independently.\n",
)

# Feature contract: append verified release closeout.
p = ROOT / "docs/PHONE_TOP_DECISION_LAYER_2026-10-04.md"
text = p.read_text()
if "## Release closeout" not in text:
    text += """

## Release closeout

- PR: #388
- Merge: `f171726bde05245bc41c284d718ab32a64298f40`
- Eval Gate #1156: PASS
- Vercel Preview: READY
- Production deployment: `dpl_3HFruLPEyUj7hafRpQAAiBEQxSdL` READY
- Production apex Phone Radar: HTTP 200
- Production `phone-route-summaries.json`: HTTP 200 with `decisionFacts`, distinct-source service counts and evidence-gated success-rate fields
- Canonical remains 159 routes / 87 markets / 156 brands / 117 networks / 618 sources
- Public SEO boundary remains 135 comparison / 3 indexable / 31 sitemap URLs
- No new route URL, sitemap entry, arbitrary safety score or unsupported success percentage was introduced
"""
    p.write_text(text)

print("Applied Phone Top decision layer closeout")
