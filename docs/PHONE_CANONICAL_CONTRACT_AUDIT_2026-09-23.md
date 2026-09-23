# Phone canonical contract audit — 2026-09-23

Status: **COMPLETE / CHANGE REQUIRED**

Scope: audit only the existing Phone canonical `/tools/phone-number-survival-guide/` and the homepage copy that frames Phone. No new URL, route expansion or production change is authorized by this audit.

## Contract checked

The accepted Phone contract remains:

- three fixed families: Long-term SMS / OTP, Data SIM / eSIM, Temporary SMS;
- visual decision dashboard first, Full guide on demand;
- current community/user outcomes drive operational reality;
- provider/operator pages are commercial-metadata inputs by default;
- users see a small actionable shortlist, not research methodology;
- missing evidence lowers confidence instead of creating fake certainty.

## Evidence reviewed

- `frontend/index.html`
- `frontend/tools/phone-number-lifecycle-mvp/index.html`
- `frontend/tools/phone-number-lifecycle-mvp/radar-view.json`
- `frontend/tools/phone-number-lifecycle-mvp/route-capabilities.json`
- `frontend/tools/phone-number-lifecycle-mvp/tutorial-insights.json`
- `frontend/tools/phone-number-lifecycle-mvp/audit-rules.json`
- `frontend/tools/phone-number-lifecycle-mvp/retention-intelligence.json`
- `docs/PHONE_RADAR_PRODUCT_DEFINITION.md`
- `docs/PHONE_RADAR_INTERACTION_SPEC_2026-09-18.md`
- current homepage crawl plus GitHub `main`.

A web-reader fetch of the Phone URL returned an older questionnaire-first version cached from five days earlier, while GitHub `main` contains the accepted route-first Phone Radar implementation. Because that fetch is stale, it is not used as proof of the current Phone rendering. The audit decisions below are based on current `main`, the accepted Phone contracts and the already-recorded production visual acceptance state. The homepage fetch matched the legacy Phone source-role wording reproduced in `main`.

## KEEP / CHANGE decisions

| Surface / field | Decision | Audit result |
|---|---|---|
| Canonical URL | KEEP | Keep `/tools/phone-number-survival-guide/`. |
| Three-family model | KEEP | The current source exposes Long-term SMS / OTP, Data SIM / eSIM and Temporary SMS as three fixed jobs. |
| Visual dashboard first | KEEP | Current `main` is route-first, shows family choices immediately and renders real shortlist cards without a questionnaire gate. |
| Full guide on demand | KEEP | Route cards expose `Full guide` inline and keep longer execution detail out of the default comparison layer. |
| Title | KEEP | `Phone Radar – Compare Numbers, Data eSIMs & Temporary SMS` accurately describes the three-family product. |
| Meta description | CHANGE | It says `current real-world status` but does not state the differentiator: recent independent/community outcomes. Rewrite only when the source-role/freshness defects below are repaired so the snippet matches the product. |
| H1 | KEEP | `Find the right phone route fast.` matches the accepted utility-first direction and does not overclaim. |
| First-screen support line | CHANGE | Current line mainly explains the UI (`Pick the job first...`) instead of the non-official value. Replace with one short line that says the shortlist combines current real-user outcomes with current price/purchase metadata. |
| First real route visibility | KEEP | The current shell is shortlist-first with only a compact country refinement before route cards. |
| Real carrier vs data-only vs temporary identity | KEEP | `shortType()` and family-specific metadata visibly separate carrier-mobile, data-only and temporary routes. |
| SMS / OTP signal | CHANGE | A qualitative signal exists, but the page does not show when the operational evidence was observed or whether it is community-derived, conflicting or sparse. |
| Remote activation practicality | KEEP / TIGHTEN | Current long-term cards expose `remote` as compact metadata. Keep the field, but source it from current reproduced outcomes where the claim is operational rather than from provider documentation. |
| KYC / local-presence friction | CHANGE | KYC exists backstage and is compressed into generic `Setup`. Material passport, local-pickup or in-person requirements can change the choice and should appear as one compact metadata/warning label when applicable, not as another equal-weight metric. |
| Roaming / SMS current reality | CHANGE | `currentSms()` currently reads `routeCapabilities.routes[id].roamingSms`. The base capability file is explicitly built around official evidence, so the Full guide can label provider documentation as `SMS / current reality`. That contradicts the accepted community/outcome-led source-role contract. |
| Keep-alive cost | KEEP / TIGHTEN | `Keep / year` is decision-useful. Preserve it, but distinguish provider deadline/fee facts from a currently reproduced keep-alive method; do not present an official cheapest documented action as proof that the route works reliably in practice. |
| Current price / value | CHANGE | Several frontstage values are placeholders such as `Live destination price` / `Live quote`. Where a current reproduced price is available, show it with a last-verified date; otherwise say the exact live price must be checked instead of implying a comparison value exists. |
| Purchase path | KEEP | `Get / Buy` / `Open platform` actions are direct and visible. |
| Freshness / confidence | CHANGE | `radar-view.json` has only a global `updatedAt` and it is not shown. The user cannot tell whether a route signal is fresh, stale, conflicting or based on too little recent evidence. Add compact per-route freshness/confidence text derived from actual evidence; no fake score or percentage. |
| Research methodology / source wall | KEEP backstage | The default dashboard is not a methodology page. Preserve that separation. |
| Phone related tools | CHANGE | Remove the historical `Claude Code limit reset` related link from the Phone canonical. Reset was removed from primary product surfaces and this link is now stale cross-product leakage. |
| Homepage Phone source-role copy | CHANGE | Remove `Official rules first` and `the guide separates documented carrier rules from unknowns`. They encode the retired official-first model and directly contradict the current Phone contract. |

## Concrete source-role defect

The most important implementation defect is not cosmetic.

`frontend/tools/phone-number-lifecycle-mvp/index.html` currently implements:

`currentSms(id) -> routeCapabilities.routes[id].roamingSms`

and renders that value under `SMS / current reality` in the Full guide.

But the base `route-capabilities.json` describes itself as an official-evidence capability layer, and `tutorial-insights.json` still states the old rule that official sources decide hard rules while community exceptions never override them.

Provider facts can still be retained backstage for published terms, prices, restrictions and purchase metadata. They must not be surfaced as the primary proof of OTP/SMS reliability, overseas activation success, recovery outcome, long-term trust or other operational reality.

## Remove because it reflects the old official-first model

1. Homepage phrase `Official rules first`.
2. Homepage phrase `the guide separates documented carrier rules from unknowns`.
3. Any UI path where provider `roamingSms` capability is presented as `SMS / current reality` without current independent outcome evidence.
4. Any copy that says community evidence is only for discovering questions while provider documentation decides operational reality.
5. The stale Phone → Claude Reset related link.

Do not delete useful provider facts from backstage. Reclassify them to the correct role: price, package, advertised fee, published restriction/term and purchase path.

## Bounded change queue — next session

### P0 — Correct source-role truth

- Replace homepage Phone framing with community/outcome-led wording.
- Stop rendering official capability notes as `SMS / current reality`.
- Use current independent/user evidence for OTP/SMS, remote activation, roaming behavior and recovery outcomes; provider facts remain explicitly labeled constraints/terms when needed.

### P0 — Add route freshness/confidence without fake precision

- Add a per-route last-observed / last-verified date from real evidence.
- Add a small qualitative evidence state such as current / limited / conflicting when supported by actual data.
- Missing recent data must say so; no neutral filler and no success percentages.

### P1 — Surface material decision blockers compactly

- Promote material KYC/local-presence requirements into identity metadata or a one-line warning.
- Keep remote practicality visible.
- Preserve the 2–3 primary metrics; do not add another dense metric row.

### P1 — Make price/value claims concrete

- Replace generic `Live price` placeholders with a real last-verified value where available.
- Otherwise state that the exact live checkout price is dynamic and avoid implying a precise comparison.

### P1 — Remove stale Reset leakage

- Remove the Phone canonical's Claude Reset related link.
- Do not add another Reset link in its place merely to fill space.

### P2 — Align first-screen/snippet copy after the data-source fixes

- Keep the current H1 and title.
- Rewrite the support line and meta description to say the product compares current real-user outcomes plus current price/purchase information.
- Do not add methodology prose to the hero.

## Non-goals for the implementation session

- no new Phone route;
- no new country/provider page;
- no temporary-SMS backend/marketplace;
- no broad homepage redesign;
- no Reset revival;
- no fake OTP percentage, recommendation score or confidence number;
- no Astro migration;
- no DNS, AdSense, billing or account-setting change.

## Definition of done for the next implementation session

One bounded existing-URL repair is complete only when the source-role defects, freshness signal, material blocker visibility and stale Reset link are fixed in the existing Phone/home surfaces; tests pass; Vercel Preview is real and green; desktop/mobile light/dark behavior is verified; and apex production is independently checked after merge.
