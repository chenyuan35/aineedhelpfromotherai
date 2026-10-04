# Phone Radar database coverage audit — 2026-10-03 (updated 2026-10-04)

Status: **90%+ BACKEND COVERAGE OBJECTIVE MET FOR THE KNOWN EVIDENCE-QUALIFIED ROUTE UNIVERSE**

This audit closes the expansion phase defined in `docs/PHONE_DATABASE_COVERAGE_EXECUTION_2026-09-29.md`. It does **not** claim coverage of 90% of every mobile carrier, prepaid SKU or phone number product in the world. The project objective is the relevant low-cost / long-term real-number route universe that has enough evidence to matter to Phone Radar users.

## Coverage definition

A route belongs in the denominator only when it is a genuinely distinct, atomic phone-number route and has enough demand/evidence to justify review. At least one of the following must be true:

- current or recent independent community evidence shows real operational use, retention, roaming, SMS/OTP, acquisition or failure behavior; or
- the route was already part of the reviewed comparison/staging universe and has source-backed product identity.

The route must also be relevant to a Phone Radar user task such as buying a low-cost real number, keeping it alive, receiving SMS abroad, preserving account access or understanding lifecycle/recovery risk.

The denominator excludes:

- pure data eSIM products with no real phone-number job;
- temporary SMS/verification services;
- aliases or renamed records for a product already represented canonically;
- generic carrier archetypes and non-atomic market/provider clusters;
- provider-directory enumeration with no independent demand/operational signal;
- products whose identity is too ambiguous to name as an atomic route.

A canonical row counts as database coverage whether its evidence state is `admitted` or `hold`. `HOLD` means the database represents the route and its unresolved risks; it does not mean the route is recommendation-ready.

## Released database after DB-C23 — historical baseline

PR #368 (`2d0d727af1f18844b6c344a9402d62de5366dd61`) added `esimgg-estonia-372-2026` and `hkmobi-365-hk-2026` as backstage-only routes.

DB-C23 normalized state before the later Saily residual admission:

- **156 canonical routes**
- **86 markets**
- **153 brands**
- **116 networks**
- **593 sources**
- **135 public comparison routes**
- **3 explicit indexable route pages**
- **31 sitemap URLs**

DB-C23 changed backend coverage only. It did not authorize a new public route page, ranking or sitemap entry.

On 2026-10-04 the separately reviewed Saily residual blocker cleared and `saily-us-phone-number-2026` was admitted backstage as `voip-second-line` / `hold`, taking the corpus to 599 sources. A later same-day Smart Prepaid roaming/SMS evidence refresh added seven append-only sources without adding a route, so current normalized state is **157 routes / 86 markets / 154 brands / 116 networks / 606 sources**. Historical comparison remains 135, explicit indexability remains 3 and sitemap remains 31.

## Staging reconciliation

`data/phone/staging/global-inventory-2026-09-26.jsonl` contains 59 historical candidate records. Reconciliation against the current canonical model gives:

- **37** records now represented by the same canonical route ID;
- **8** additional records that are aliases, same-product variants or retention mechanisms already represented by an existing canonical route;
- **9** records that are outside the Phone real-number route universe because they are data-only, temporary-verification or generic archetype records;
- **4** records that are non-atomic market/provider clusters and therefore cannot be counted as four missing routes;
- **1** still-distinct atomic staging candidate: LuckySIM Hong Kong.

The old 59-record staging inventory therefore is not evidence of 59 missing routes. Most of it has already been normalized, deduplicated or deliberately excluded by scope.

## Current residual candidate register

Two distinct candidates remain outside canonical pending bounded evidence reconciliation:

1. **LuckySIM Hong Kong** — current official surfaces show real-name registration, eSIM support and multi-year prepaid voice/data products. The durable post-term renewal/lifecycle rule and mainland-China SMS/OTP behavior still need reconciliation before canonical admission.
2. **China Telecom Macau / Macau blue-card route** — 2026 community evidence reports a low-cost 180-day keep mechanic and current eSIM conversion capability, while China Telecom Macau currently documents prepaid/eSIM service. The exact current blue-card lifecycle/renewal rule still needs first-party reconciliation before admission.

**Resolved residual:** Saily U.S. phone number cleared its classification blocker on 2026-10-04 and is now canonical backstage HOLD as a distinct non-cellular VoIP/second-line route. This does not make it a recommendation or a public/indexable route.

The two remaining entries are residual research candidates, not public recommendations.

## Coverage calculation

For the current known evidence-qualified universe:

- normalized canonical routes: **157**
- known distinct unresolved atomic candidates: **2**
- denominator: **159**

**Coverage = 157 / 159 = 98.7%.**

This clears the project target of approximately 90%+ with margin. As a sensitivity check, even if ten additional qualifying missing routes were discovered immediately, coverage would still be `157 / 169 = 92.9%`. Coverage would fall below 90% only if at least 16 additional qualifying missing atomic routes were discovered without corresponding canonical admission.

The sensitivity calculation is not evidence that unknown routes do not exist. It only shows that the current 90% decision is not dependent on one or two borderline candidates.

## Decision

The broad database expansion phase is complete. Do **not** create DB-C24 from carrier directories, country checklists or page-count pressure.

Move Phone database work to maintenance mode:

- append new community/provider evidence to existing routes;
- re-open a bounded DB batch only when a genuinely distinct evidence-qualified route appears or one of the two remaining residual candidates clears its blocker;
- preserve conflicts and negative knowledge instead of forcing recommendation status;
- keep Data-eSIM evidence separate unless a reviewed phone-number identity link is established;
- keep backend admission separate from public/indexable publication.

Re-run this coverage audit if a new evidence intake produces enough distinct atomic candidates to materially challenge the 90% threshold. A practical re-open trigger is **10 new qualifying distinct route candidates** since this audit, or any evidence that the current denominator definition systematically misses a user-relevant route class.

## Frontend consequence

None automatically. The public Phone surface remains 135 comparison routes / 3 explicit indexable route pages. The next public expansion decision remains Search Console / real-user evidence gated. Backend completeness is not permission to manufacture SEO pages.
