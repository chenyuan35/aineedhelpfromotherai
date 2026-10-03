# Phone Radar post-legacy coverage-gap audit — 2026-10-03

Status: **COMPLETE — DB-C20 CANDIDATES SELECTED / NO PUBLICATION CHANGE**

## Purpose

The legacy comparison-to-canonical migration backlog is functionally closed after DB-C19. This audit looks only for genuinely distinct low-cost long-term phone-number routes that are missing from the current 145-route canonical database. It is not a carrier-directory enumeration exercise and does not authorize canonical admission, comparison visibility, route pages, sitemap changes or indexability.

Baseline at audit start:

- canonical: **145 routes / 86 markets / 142 brands / 112 networks / 547 sources**;
- comparison: **135 routes**;
- comparison↔canonical same-ID overlap: **134**;
- known remaining same-ID gap: `sakura-mobile-voice-2026`, intentionally excluded because it is the same product as canonical `sakura-japan-voice-data`;
- explicit indexable route pages: **3**.

Research order followed the project contract: current independent/community operational evidence first; first-party sources were then used for provider-controlled lifecycle, purchase, roaming and registration facts.

## Dedupe / pre-shortlist filtering

The current canonical route set was checked before shortlisting.

- Vodafone Germany is already represented by `vodafone-callya-90d-2026`; it is not a gap.
- Skinny New Zealand is already represented by `skinny-prepay-12mo-2026`; it is not a gap.
- ClubSIM already exists on the CSL network. A separate CSL × 7-Eleven lead was not promoted because current CSL material uses a 180-day base validity/recharge model and the community HKD6/year claim was not strong enough to establish a distinct durable route.
- `sakura-mobile-voice-2026` remains excluded as the known same-product alias, not a missing route.
- Exact canonical searches found no DITO Philippines, Vodafone Netherlands, CTExcel UK, One NZ long-term route, or CMLink UK long-term phone-number route. Existing CMLink data-only evidence is a different product family and does not dedupe the UK-number route.

## Bounded shortlist — five genuinely distinct gaps

### 1. Vodafone Netherlands Prepaid — **SELECT FOR DB-C20**

Current identity: Vodafone Netherlands prepaid real-mobile route, physical/eSIM depending acquisition path.

Why it adds user value:

- current 2026 community users are actively acquiring and maintaining the route from abroad;
- current first-party lifecycle is unusually clear: prepaid credit remains valid when there is at least one qualifying paid use or top-up every six months;
- after six months of no use, Vodafone applies a three-month frozen-credit recovery window; a top-up during that window preserves the number and credit;
- the route therefore provides a low-frequency retention mechanic that is directly comparable with existing Phone Radar routes.

Current independent evidence:

- Naixi, 2026-04-01, current acquisition/retention reports and successful OTP examples: https://forum.naixi.net/thread-11013-1-1.html
- Linux DO, 2026-04-01, current purchase/top-up friction and 180-day retention discussion: https://linux.do/t/topic/1872386
- Vodafone community, 2026-09, current abroad eSIM replacement/support failure case: https://community.vodafoneziggo.nl/t5/Toestellen/Vodafone-Netherlands-The-Verification-Code-Loop-That-Left-Me-Cut/td-p/1874212

Provider-controlled confirmation:

- Vodafone prepaid lifecycle: https://www.vodafone.nl/support/prepaid/zo-werkt-prepaid

Material unknowns for DB-C20:

- reproducibility of initial purchase/payment from China varies by payment/IP context;
- China-specific incoming SMS/OTP should remain evidence-scoped rather than inferred from generic roaming availability;
- eSIM replacement abroad has a current recovery/support failure report and should be preserved as incident evidence.

Audit result: **PASS**. Distinct product, strong current lifecycle evidence, current operational evidence, no canonical duplicate.

### 2. CTExcel UK — **SELECT FOR DB-C20**

Current identity: CTExcel UK prepaid/UK-China route on EE, including its current Back to China SIM Retention service family.

Why it adds user value:

- current Chinese-language communities repeatedly discuss it specifically as a China-based long-term UK-number route;
- recent evidence includes activation, 90-day balance-activity retention reports, plan-dependent retention behavior, signal-loss recovery through official support, eSIM/physical-SIM friction and long-roaming concerns;
- the provider currently exposes a dedicated `Back to China SIM Retention Plan` entry, so this is not merely a historical forum workaround.

Current independent evidence:

- Naixi, 2026-03 onward, active Q&A with 90-day balance-activity and activation/eSIM reports: https://forum.naixi.net/forum.php?mod=viewthread&tid=10558
- Naixi, 2026-08-04, conflicting interpretations of 90-day activity vs plan retention: https://forum.naixi.net/thread-14169-1-1.html
- Linux DO, 2026-09-02, first-hand loss-of-signal incident, support recovery in about five minutes, and support-reported post-plan retention behavior: https://linux.do/t/topic/2844702
- NodeLoc, 2026-08, current purchase/activation/port discussion: https://www.nodeloc.com/t/topic/101793

Provider-controlled confirmation:

- CTExcel UK current site exposes `Back to China SIM Retention Plan`: https://www.ctexcel.com/uk/trail/index/1?lang=en&recommendCode=IQ
- retention landing URL currently exists but is client-rendered in the public fetch path: https://www.ctexcel.com/uk/guaranteeNum

Material unknowns for DB-C20:

- exact current eligibility and price mechanics of the retention service need a clean first-party extraction or directly reproducible account flow;
- community evidence conflicts on whether ordinary balance activity alone is sufficient for every account/plan cohort;
- long-term roaming enforcement and the relationship between annual/UK-China plans and the retention service must not be flattened into one universal rule.

Audit result: **PASS WITH CONFLICTS PRESERVED**. The conflicts are precisely the type of decision-cost reduction Phone Radar should normalize; they do not justify a public recommendation yet.

### 3. One NZ Prepay / Pay & Go — **SELECT FOR DB-C20**

Current identity: One New Zealand Prepay, including Pay & Go; physical SIM and current prepaid eSIM are both provider-supported.

Why it adds user value:

- current first-party terms establish a simple long retention clock: top-up credit is valid for 360 days and the number is deactivated/recycled if no top-up occurs before expiry;
- minimum top-up is currently NZD10 through supported One NZ digital channels for applicable Pay & Go/MyFlex paths;
- One NZ currently lists China as a prepaid roaming destination and supports Wi-Fi Calling abroad;
- current Chinese community users are actively testing eSIM/top-up/long-term use, so the route is not directory-only coverage.

Current independent evidence:

- Naixi, 2026-03..07, One NZ eSIM/retention/top-up discussion: https://forum.naixi.net/thread-10577-1-1.html
- Geekzone, 2025 operational expiry/recovery incident with a One NZ representative restating the 360-day rule: https://www.geekzone.co.nz/forums.asp?forumid=40&page_no=3&topicid=318647

Provider-controlled confirmation:

- current credit/number expiry rule: https://one.nz/faq/when-does-prepay-credit-expire
- current top-up channels and minimums: https://one.nz/help/bill-payment/prepay-topup/
- current Pay & Go new-customer path: https://one.nz/prepay/pay-and-go/
- current prepaid eSIM support: https://one.nz/mobile/esim/
- current prepaid roaming including China: https://one.nz/prepay-roaming/

Material unknowns for DB-C20:

- China-first activation still needs to be separated from ordinary New Zealand activation; official activation requires One NZ mobile coverage at initial setup;
- current independent China incoming-SMS/OTP evidence is thinner than the lifecycle evidence;
- community reports about exact app top-up denomination vary by storefront/device and should not override provider terms.

Audit result: **PASS**. Distinct route with strong current provider lifecycle and enough current community evidence to justify a reviewed backend packet.

### 4. CMLink UK number-retention route — **DEFER AFTER SAMPLE AUDIT**

Current identity: CMLink UK real-mobile route with a currently marketed GBP15 / 365-day UK-number holding product.

Why it is relevant:

- provider currently advertises `Keep UK Number for Just £15 a Year — 365 days of number holding`;
- the current UK page explicitly targets retaining a UK number while in China;
- communities are actively comparing it against CTExcel and report both successful use and lifecycle/eligibility caveats.

Current evidence:

- CMLink current promotion: https://www.cmlink.com/uk/en/promotion/
- CMLink current UK page: https://www.cmlink.com/uk/payasyougo
- Linux DO, 2026-06-25, current retention-cost discussion: https://linux.do/t/topic/2475737
- Naixi, 2026-07-28, consolidated current lifecycle conflicts: https://forum.naixi.net/forum.php?action=printable&forcemobile=1&mod=viewthread&tid=13659
- NodeSeek, 2026-06, current CTExcel vs CMLink retention comparison and reported eligibility condition: https://www.nodeseek.com/post-798751-1

Why not DB-C20 now:

- current community evidence says the retention product may require a current or prior monthly/annual plan;
- community evidence also reports materially different post-package cancellation clocks depending on the package family;
- the provider marketing page confirms the 365-day product but does not, in the currently extracted text, resolve those eligibility/post-expiry conditions.

Audit result: **DEFER**. Re-open when first-party eligibility and post-retention expiry rules are cleanly extracted or a current user reproduces the full purchase → 365-day retention → renewal path.

### 5. DITO Philippines prepaid/eSIM — **DEFER AFTER SAMPLE AUDIT**

Current identity: DITO Philippines prepaid real-mobile SIM/eSIM.

Why it is relevant:

- 2026 community users report low-cost top-up/retention experiments, passport registration, China signal/OTP successes and failures;
- current reports include both successful registration/OTP and service-specific OTP/provisioning failures, which is useful operational evidence.

Current independent evidence:

- Linux DO, 2026-08, DITO eSIM activation/retention/China OTP thread: https://linux.do/t/topic/2765886
- Reddit, 2026 DITO eSIM registration/device reports: https://www.reddit.com/r/InternetPH/search/?q=DITO%20eSIM&restrict_sr=1

Provider-controlled confirmation:

- SIM registration requirements, including foreign nationals: https://dito.ph/sim-registration
- current traveler SIM rules: https://dito.ph/traveler-sim
- current prepaid product/activation paths: https://dito.ph/prepaid

Why not DB-C20 now:

- DITO currently requires tourists to provide passport, proof of Philippine address and a return ticket;
- the traveler SIM is explicitly 30-day limited unless its validity is separately extended; buying ordinary promos does not extend that traveler-SIM validity;
- current community claims of ultra-low annual keep cost therefore cannot yet be generalized into a durable foreign-user route without resolving which registration cohort/product those users actually hold;
- current OTP evidence is conflicting.

Audit result: **DEFER**. Re-open only when a legitimate foreign-user cohort and its actual long-term SIM-validity path are explicitly reproduced; do not use fake local-address/KYC workarounds.

## Sample-audit result

All five shortlisted routes were sample-audited rather than the minimum three.

| Candidate | Canonical duplicate | Current independent operational evidence | Current provider-controlled evidence | Unsupported-inference risk | Audit disposition |
|---|---|---|---|---|---|
| Vodafone NL Prepaid | No | Strong | Strong | Moderate acquisition/payment variability | **DB-C20** |
| CTExcel UK | No | Strong and current | Product existence confirmed; exact mechanics partly opaque | High if one universal 90-day rule is asserted | **DB-C20, preserve conflicts** |
| One NZ Prepay | No | Current + corroborating incident | Strong | Moderate China-first activation/OTP gap | **DB-C20** |
| CMLink UK retention | No durable UK-number canonical route | Current | GBP15/365-day product confirmed | High eligibility/post-expiry ambiguity | **DEFER** |
| DITO Philippines | No | Current but conflicting | Strong registration/traveler constraints | High foreigner-cohort generalization risk | **DEFER** |

## DB-C20 bounded batch

Select exactly these three for the next reviewed backend batch:

1. `vodafone-nl-prepaid-2026`
2. `ctexcel-uk-2026`
3. `one-nz-prepay-2026`

DB-C20 must independently reconcile each route’s current product identity, acquisition/activation, lifecycle/keep action and cost, roaming/China receive-SMS state, payment/KYC constraints, incident/recovery evidence and source provenance. The expected disposition remains `ADMIT-BACKSTAGE`, `HOLD`, or `REJECT` per route; selection for DB-C20 is not admission.

## Publication boundary

This audit changes no production or public surface:

- canonical remains **145 routes** until a separate DB-C20 importer/review release;
- comparison remains **135 routes**;
- explicit indexable route pages remain **3**;
- sitemap/public URL policy is unchanged;
- no ranking/recommendation claim is created by this audit.

## Next trigger

Run DB-C20 as one bounded three-route normalization batch for Vodafone NL, CTExcel UK and One NZ. Preserve CTExcel’s current conflicts and leave CMLink/DITO deferred until their explicit re-open conditions are satisfied.
