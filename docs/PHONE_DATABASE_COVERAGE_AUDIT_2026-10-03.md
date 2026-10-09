# Phone Radar database coverage audit — 2026-10-03 (updated 2026-10-04)

Status: **HISTORICAL CLOSED-INVENTORY RECONCILIATION ONLY — EXTERNAL 90%/100% COVERAGE NOT ESTABLISHED (reassessed 2026-10-09)**

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

On 2026-10-04 the separately reviewed Saily residual blocker cleared and `saily-us-phone-number-2026` was admitted backstage as `voip-second-line` / `hold`, taking the corpus to 599 sources. A later same-day Smart Prepaid roaming/SMS evidence refresh added seven append-only sources without adding a route. The bounded LuckySIM Hong Kong residual admission then cleared its renewal blocker and added one HOLD route plus five reviewed sources. The final known residual, China Telecom Macau Easy PASS / Greater Bay Area prepaid, subsequently cleared its lifecycle blocker with first-party 180-day validity and recharge-reset evidence and adds one HOLD route, one market, one network, one brand and five reviewed sources. Current normalized state is **159 routes / 87 markets / 156 brands / 117 networks / 616 sources**. Historical comparison remains 135, explicit indexability remains 3 and sitemap remains 31.

On 2026-10-05, evidence maintenance on the existing Red Pocket annual row found that the official eBay Store $30/360-day Starter Plan had been incorrectly folded into the materially different website Essentials annual product. The reviewed eBay product has distinct price, allowance, channel, renewal method and roaming entitlement, so it qualifies as one genuinely distinct atomic route rather than a keyword/SKU variant. It was admitted backstage as `redpocket-ebay-30-2026`; current normalized state is therefore **160 routes / 87 markets / 157 brands / 117 networks / 651 sources**. Historical comparison remains 135, explicit indexability remains 3 and sitemap remains 31.

## Staging reconciliation

`data/phone/staging/global-inventory-2026-09-26.jsonl` contains 59 historical candidate records. Reconciliation against the current canonical model gives:

- **37** records now represented by the same canonical route ID;
- **8** additional records that are aliases, same-product variants or retention mechanisms already represented by an existing canonical route;
- **9** records that are outside the Phone real-number route universe because they are data-only, temporary-verification or generic archetype records;
- **4** records that are non-atomic market/provider clusters and therefore cannot be counted as four missing routes;
- **1** still-distinct atomic staging candidate at the original audit checkpoint: LuckySIM Hong Kong; this candidate was subsequently admitted backstage on 2026-10-04 after its lifecycle blocker cleared.

The old 59-record staging inventory therefore is not evidence of 59 missing routes. Most of it has already been normalized, deduplicated or deliberately excluded by scope.

## Current residual candidate register

No currently known evidence-qualified distinct atomic residual candidate remains outside canonical. The 2026-10-05 Red Pocket eBay review temporarily re-opened this statement by exposing one conflated atomic product; that route is now admitted, so the residual register returns to zero.

**Resolved residuals:** Saily U.S. phone number cleared its classification blocker on 2026-10-04 and is canonical backstage HOLD as a distinct non-cellular VoIP/second-line route. LuckySIM Hong Kong cleared its durable renewal blocker and is canonical backstage HOLD as a real-mobile route. China Telecom Macau Easy PASS / Greater Bay Area prepaid then cleared the final lifecycle blocker: current provider material establishes 180-day validity, another 180 days from each recharge, >90-day suspended-number cancellation, real-name registration, ordinary incoming-SMS capability and current eSIM support. It is canonical backstage HOLD because service-specific bank/app OTP reliability remains insufficiently sampled. None of these admissions creates a recommendation or public/indexable route.

## Coverage calculation — corrected 2026-10-09

**Retract the general-coverage inference.** The earlier `160 / 160 = 100%` used a denominator created by *the same internally reviewed staging/canonical list*. This is a **closed-world inventory reconciliation ratio**, not an independently discovered set of all user-relevant low-cost number routes. It cannot establish >90% of external real-world user demand, provider/SKU routes, app-specific activation feasibility or operational evidence. The earlier `0 residual candidate` meant **no unresolved candidate left in that particular frozen queue**, not that other original community threads had been searched and reconciled.

External original-thread sampling on 2026-10-09 found distinct potential routes not yet represented as such in canonical: **Simyo Netherlands prepaid**, **Cuniq Hong Kong dual-number/low-rate mechanism**, and **China Mobile Beijing CNY8 4G number-retention plan**; these are review candidates only, with separate location, registration and product-availability gates. Other existing routes (eSIM.gg Estonia, US Mobile) lack recent significant firsthand source/operation outcomes even though those threads are public. See [market-gap ledger / GitHub #467](https://github.com/chenyuan35/aineedhelpfromotherai/issues/467). Do not automatically count every mention as a qualified missing route.

**Current data baseline (main as audited 2026-10-09):** 160 canonical routes, 897 source records, 322 operational/lifecycle events, 220 snapshots, **27 service-specific observations across only 7 routes**, and **61 admitted / 89 hold / 10 needs-reconciliation**. Of 160, **72 lack numeric acquisition cost**, **66 lack numeric annual retention cost**, and **153 have no app/SMS-operation-specific observation**. All 160 route detail JSON endpoints are reachable and count-consistent, but that measures technical delivery, **not a successful acquisition/activation/OTP or retention job**. The independent data quality breakdown is in [GitHub #465](https://github.com/chenyuan35/aineedhelpfromotherai/issues/465).

**External coverage numerator/denominator: UNMEASURED.** Do not use a 90% or 100% site/database completion badge, claim broad carrier coverage, extrapolate market language share from forum frequency, or simply raise the denominator artificially by adding keyword copies. If needed later, measure separately:
- **Discovery coverage:** sample a dated, independently discovered universe of *atomic products satisfying a defined user job*, with predeclared source channels and a reproducible missing/alias/rejected disposition; denominator must not be limited to the already catalogued 160.
- **Field completeness:** proportion of qualifying rows with sourced acquisition route, paid first checkout, KYC/payment/location and retention costs; unknown must remain unknown, not zero.
- **Operational proof coverage:** route × initial/port/keep task × physical location × device × service+operation with dated independent evidence, contradictory outcomes and source/author dedupe.
- **Publication coverage:** number of distinct search tasks with justified indexable URL, completely separate from all the above.

Future target evaluation requires a sufficiently broad independent sample (e.g., staged cross-forum/cross-market study), case-by-case adjudication, documented source freshness, denominator freeze date and separately exposed confidence. No numerical completion target is met merely by 160 rows.

## Decision

The **historical directory/staging enumeration phase** is closed, but *user-demand-driven original-source discovery and bounded evidence-qualified atomic admissions remain OPEN*. Do not create DB-C24 from arbitrary carrier directories, country checklists or page-count pressure. If multiple independent user cases expose a truly missing distinct acquisition/retention route and lifecycle/eligibility facts can be verified, review one bounded admission behind the normal test/release gates.

Move Phone database work to maintenance mode:

- append new community/provider evidence to existing routes;
- re-open a bounded DB batch only when a genuinely distinct evidence-qualified route appears;
- preserve conflicts and negative knowledge instead of forcing recommendation status;
- keep Data-eSIM evidence separate unless a reviewed phone-number identity link is established;
- keep backend admission separate from public/indexable publication.

Re-run this coverage audit if a new evidence intake produces enough distinct atomic candidates to materially challenge the 90% threshold. A practical re-open trigger is **10 new qualifying distinct route candidates** since this audit, or any evidence that the current denominator definition systematically misses a user-relevant route class.

## Frontend consequence

None automatically. The public Phone surface remains 135 comparison routes / 3 explicit indexable route pages. The next public expansion decision remains Search Console / real-user evidence gated. Backend completeness is not permission to manufacture SEO pages.
