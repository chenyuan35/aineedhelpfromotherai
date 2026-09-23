# Phone Canonical Contract Audit — 2026-09-23

Status: COMPLETE — audit only; no production change in this session.

## Scope

Audited the existing Phone canonical at `/tools/phone-number-survival-guide/` plus the Phone-facing homepage framing against the accepted Phone Radar contract.

The accepted product remains one canonical with three fixed families:

1. Long-term SMS / OTP;
2. Data SIM / eSIM;
3. Temporary SMS.

The product value is current real-world operating information and decision-cost reduction. Community/current-user outcomes drive operational reality. Provider/operator pages are commercial-metadata inputs for price, package, promotion, stock, purchase link and advertised fees; they do not certify OTP success, overseas activation, recovery or long-term trust.

No new URL, route family, country/provider doorway page or production change is justified by this audit.

## Evidence inspected

- `docs/PRODUCT_VALUE_GATE.md`;
- `docs/PHONE_RADAR_PRODUCT_DEFINITION.md`;
- `docs/PHONE_RADAR_INTERACTION_SPEC_2026-09-18.md`;
- `docs/PHONE_DEMAND_WATCH.md` for current user-language examples around OTP/SMS abroad, remote activation, KYC, roaming, retention and route conversion;
- current `frontend/tools/phone-number-lifecycle-mvp/index.html` and `radar-view.json`;
- verified live homepage and Phone canonical on 2026-09-23.

## Overall decision

**CHANGE — bounded same-URL correction.**

The current Phone canonical already has the right macro interaction model: one URL, three fixed families, visual shortlist first, Full guide on demand, no questionnaire gate and family-specific metrics. It should be improved rather than redesigned.

The main gap is that the frontstage still under-exposes several fields that make Phone Radar defensible: current outcome recency, KYC, activation-country practicality, roaming/SMS reality, exact keep-alive action/interval and current commercial price/value. The homepage also still frames the product using the superseded official-first model.

## Surface decisions

| Surface / field | Decision | Audit result |
|---|---|---|
| Canonical URL | KEEP | Keep `/tools/phone-number-survival-guide/`. No migration or additional Phone URL. |
| Three-family model | KEEP | Long-term SMS/OTP, Data SIM/eSIM and Temporary SMS are immediately distinct and match the accepted contract. |
| Default family | KEEP | Long-term SMS/OTP remains the default because durable numbers/OTP/recovery are the strongest current continuity job. |
| Visual dashboard first | KEEP | Real options are intended to render immediately; filters refine rather than gate results; Full guide stays secondary. |
| H1 | KEEP | `Find the right phone route fast.` is short, user-task oriented and consistent with decision-cost reduction. |
| Title | CHANGE | Current title names the three categories but not the strongest practical problem. Next implementation should make real-number/SMS/OTP usefulness clearer without turning the title into a keyword list. |
| Meta description | CHANGE | Keep the three-family breadth but explicitly promise currently workable routes / real-world outcomes rather than generic `current real-world status`. |
| First-screen supporting sentence | CHANGE | `Pick the job first...` explains the UI more than the user value. Replace with a concise promise around finding a workable real number/data route/temporary SMS option using current operating outcomes. |
| First useful route visibility | KEEP | Do not add a questionnaire, research preamble or source wall before results. |
| Real carrier number vs data-only/temporary | KEEP | Family separation plus current number-type/status treatment prevents data-only eSIMs from being presented as durable verification numbers. |
| SMS/OTP outcome | CHANGE | Qualitative signals are correct, but the user cannot see how recent they are or which app/service caveat matters when one exists. Add a compact recent-outcome/freshness cue; keep percentages prohibited until defensible. |
| Remote activation / activation-country constraint | KEEP + NORMALIZE | The field exists frontstage, but route values such as `Best with a UK start` are less explicit than `UK activation first` / `local presence required` / `remote`. Normalize wording in the implementation. |
| KYC | CHANGE | KYC is decision-critical but mostly hidden in Full guide/backstage. Surface a compact KYC state when it materially changes route feasibility. |
| Roaming / overseas SMS | CHANGE | Current reality is mostly in guide text/caveats. For long-term routes, surface a concise roaming/SMS-abroad state when it changes the decision. |
| Keep-alive cost | KEEP | Annual keep cost is one of the strongest frontstage fields. |
| Keep-alive action / expiry interval | CHANGE | The current starred footnote is too generic. Show the actual reproduced keep-alive action/interval in the guide and, when decision-critical, compactly on the card. Do not imply a generic rule applies across routes. |
| Acquisition/current price | CHANGE | Long-term cards emphasize retention cost but can hide acquisition cost; some Data/Temporary rows use placeholders such as `Live destination price` / `Live quote`. Show current commercial price/value when known, otherwise explicitly mark it as live-check required. |
| Purchase path | KEEP | `Get / Buy` / `Open platform` is the right direct action. |
| Freshness | CHANGE | `radar-view.json` has a global update date but the page does not expose route-level freshness. Add a small last-verified/recent-outcome date or age derived from real evidence. |
| Confidence | CHANGE | Do not invent a numeric confidence score. Add a restrained qualitative evidence state only when supported by independent outcome count/recency/conflict logic. Missing evidence must visibly reduce confidence. |
| Research methodology on frontstage | KEEP BACKSTAGE | Do not expose raw source walls, duplicate/circular-report logic or research methodology on the decision screen. |
| Related tools | CHANGE | Remove the historical Claude Reset related-tool link. Reset is no longer a primary/discovery surface. Do not replace it with a new Phone URL merely to fill space. |
| Homepage Phone framing | CHANGE | Current `documented carrier rules` / `Official rules first` language contradicts the accepted source-role contract and must be removed. Homepage should describe current user/community outcomes as operational reality and provider pages as price/purchase metadata. |
| Homepage Phone breadth | CHANGE | Current section over-frames Phone as long-term account recovery only. Keep continuity as an important use case, but explicitly acknowledge real-number SMS/OTP, data eSIM and temporary SMS choices so homepage framing matches the canonical. |

## Explicit removal list

Remove or replace the following old-model framing in the next implementation session:

- homepage `Official rules first`;
- homepage `the guide separates documented carrier rules from unknowns`;
- any implication that provider documentation is the operational verification gate for OTP success, overseas activation, recovery, roaming reliability or long-term trust;
- Phone canonical related link to `Claude Code limit reset`;
- generic keep-alive wording that implies one simple qualifying-action model applies across routes when the route-specific action/interval differs.

## Bounded implementation queue

Order by user impact.

### P0 — Correct source-role contradiction on homepage

Update only the Phone-facing homepage section so the product is framed as current practical route selection based on real-user operating outcomes. Remove `Official rules first` and `documented carrier rules` wording. Keep privacy/no-OTP-collection messaging.

### P1 — Make the Phone first screen state the actual job

On the existing canonical only:

- retain H1 and the three-family switch;
- tighten title/meta/supporting sentence around current workable routes, SMS/OTP reality and fast decisions;
- do not add a research explanation above the shortlist.

### P1 — Add decision-critical route state without bloating cards

For Long-term SMS/OTP, expose compactly when supported:

- number type;
- recent SMS/OTP signal + freshness;
- keep/year;
- remote/activation-country state;
- KYC state;
- roaming/SMS-abroad state when material;
- stability/evidence state;
- one-line caveat only when it changes the choice.

Do not force these exact fields onto Data SIM/eSIM or Temporary SMS; keep family-specific metrics.

### P1 — Make commercial value actionable

Use provider/operator pages for current price/package/promotion/purchase metadata. Replace vague frontstage placeholders with actual current values where available, or an explicit live-check label when they are genuinely variable.

### P2 — Fix route-detail retention clarity

In Full guide, show the reproduced keep-alive action, interval, expiry/grace behavior and recovery path route-by-route. Remove generic wording that obscures route differences.

### P2 — Remove stale Reset linkage

Remove the Claude Reset related link from Phone canonical. No new route/page should be created as a replacement.

## Non-goals for the implementation session

- no new Phone URL;
- no country/provider doorway page;
- no bulk route expansion;
- no temporary-SMS backend/marketplace;
- no new risk score or OTP percentage;
- no research-method wall;
- no Astro migration or unrelated redesign;
- no Reset/Codex work.

## Definition of done for next implementation session

One bounded PR on the existing homepage + Phone canonical that:

1. removes the old official-first/source-role contradiction;
2. keeps the accepted three-family/dashboard/full-guide interaction model;
3. surfaces the highest-value missing decision fields without turning cards into research reports;
4. removes the stale Claude Reset related link;
5. passes local/build checks, Eval Gate, Vercel Preview and desktop/mobile production verification after merge.
