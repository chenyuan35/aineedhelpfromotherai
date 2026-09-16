# Phone Number Lifecycle MVP

Status: production MVP. The canonical public URL is `/tools/phone-number-survival-guide/`; keep the route set deliberately small, evidence-backed and maintainable, and keep unknowns explicit.

## Product job

Two audiences only for this MVP:

1. people who need a phone number to register or retain access to software/services;
2. people travelling, studying, working or living abroad who need connectivity and/or a usable local or home-country number.

The job is not "compare phone plans". It is:

> Help a user get the right number with the lowest practical risk, cost and effort, then keep that number usable long enough for the task they care about.

Lifecycle:

`task -> feasible route -> where to buy -> real cost -> purchase-channel evidence -> fair-price check -> KYC -> activate -> register/arrive -> use -> retain -> recover/refund/move`

## MVP success condition

After a small number of questions, the user should get a short executable route that answers:

- what number class fits the task;
- where to buy or compare it;
- scenario-specific 30/90/365-day base cost when it can be supported, otherwise an explicit unknown;
- official/reference price basis and a fair-price/overpay check without inventing a market benchmark;
- purchase-channel type, refund/stock/support/number-control evidence, and last-verified date;
- provider/evidence quality;
- device requirements;
- KYC/identity requirements, or an explicit unknown;
- where first activation can happen;
- whether the target service is available from the user's physical location;
- whether the selected number country is a mapped supported route for a geographically restricted target service;
- whether the number can receive SMS/OTP abroad;
- whether Wi-Fi Calling/Text can help abroad;
- target-service compatibility without pretending a number-class match proves provider-specific OTP delivery;
- retention cost/rule and reminder;
- recovery/refund/migration plan.

## Cost and purchase-safety layer

Cost and purchase-channel evidence are first-class decision inputs, not decorative metadata. The result card shows them before activation details.

The structured purchase model records, where evidence supports it:

- purchase relationship: official direct, provider-designated channel, official-linked marketplace, third-party marketplace, or unverified;
- route-level recurring service cost and, when needed, separate acquisition-option prices so a “$3/month” plan is not mistaken for a $3 purchase;
- acquisition options can carry product/activation class, observed item price, shipping, all-in-before-tax, current availability, seller evidence, returns, source and last-checked date;
- scenario base cost for 30/90/365 days;
- setup/activation fee, recurring charge, taxes/fees, delivery and temporary promotion status;
- official/reference price basis and a fair-price/overpay explanation;
- refund clarity, stock/availability evidence, support channel and number-control/ownership class;
- independent review context as a dated observation, never as a universal trust score;
- source URLs and last-verified date.

Unknown evidence lowers confidence and stays unknown. A free SIM is not treated as a zero-cost route when activation/top-up spend is unresolved. A temporary promotion is shown separately from durable totals. Temporary-number marketplace list prices are not converted into an "expected successful cost" without independent success/refund evidence.

Numeric cost tiebreaks are deliberately narrow: routes are compared only when they have numeric values for the relevant horizon, the same currency, and the same comparison group. This prevents JPY/USD/GBP or voice-number/data-only products from being ranked by meaningless raw-number comparisons. Within a multi-channel acquisition record, price-gap language is only used for like-for-like product/activation classes; a sealed physical SIM is not compared as identical to a seller-managed pre-activated eSIM.

A fair-price label is explanatory rather than accusatory. An official price can be used as a benchmark for a like-for-like third-party quote, but the tool does not call a seller overpriced or unsafe without comparable evidence.

## Entry A — Register an app/service

Initial services: Claude, OpenAI API, WhatsApp, Telegram, Google Account.

Inputs:

- target service;
- physical location now;
- one-time, short-term or long-term use;
- preferred number country;
- cheapest, easiest or safest priority.

The first explicitly mapped number countries are United States, United Kingdom, Japan and Mainland China. `Another country` is not treated as a real country value; the MVP stops and asks for a mapped country rather than fabricating a route.

Hard activation constraints can remove a route from ranking. Target-service geography can also stop the entire recommendation. A foreign phone number must never be presented as a workaround for a service that does not support the user's physical location.

`No preference` is deliberately conservative: the MVP compares mapped carrier routes in the user's current mapped country rather than silently selecting an arbitrary foreign country. One-time SMS activation routes are eligible only when the user explicitly selects `One verification only` and the target service's own rules do not reject that number class.

`Other` physical location is deliberately unverified. For Mainland China, services whose access/registration conditions have not yet been mapped are also left unverified instead of assuming that obtaining a phone number solves service access.

Examples:

- Tello is not an immediate activation route for a user physically outside the US.
- A Mainland China official-carrier SIM is not an immediate route for someone outside Mainland China because current guidance requires in-person application.
- Claude/OpenAI API do not receive a phone-number recommendation for a user mapped to Mainland China in this MVP; the tool points to the official supported-location rule instead of suggesting a foreign number workaround.
- WhatsApp/Telegram/Google from Mainland China remain `unverified` in this MVP until service-access conditions are explicitly researched; the tool does not infer success from phone-number availability alone.

## Entry B — Travel / move abroad

Inputs:

- physical location now;
- destination country;
- short trip vs long stay;
- data only vs local calls/SMS;
- whether OTP/SMS matters;
- whether the home number must remain reachable;
- eSIM support.

The travel answer separates three jobs that are often incorrectly combined:

1. travel data;
2. destination-local phone number;
3. home-number/account-recovery continuity.

If a real local number is required, data-only products are excluded from candidates. If only data is needed, the MVP uses an eSIM data route when supported. For Japan, current destination-specific data purchase evidence is mapped for Airalo eSIM and a Mobal physical tourist data SIM; the physical Mobal route is used for a Japan traveler without eSIM support. Other unmapped destinations can still fall back to an explicitly research-required physical data-SIM route. None is described as an SMS number.

`Must my home number keep working?` is advisory until a specific home carrier is selected. The MVP must not claim that an unspecified home line will receive overseas OTP.

Long-stay input must affect ranking; durable number control, first-party evidence and cancellation/number-loss rules receive additional weight.

## Explicit non-goals

The MVP does not sell numbers, receive/store verification codes, automate account creation, support bulk-account creation, bypass KYC/geographic/platform restrictions, fabricate success rates, or rank providers based on affiliate commission.

The public release uses one canonical URL, `/tools/phone-number-survival-guide/`, linked from the homepage and Tools index and listed once in the sitemap. Do not split it into provider, country or keyword-variant pages.

## Evidence model

Popular tutorials/videos/community threads discover repeated user questions and failure modes. They do not define hard product truth.

Official service/provider documentation outranks blogs and forum posts for restrictions, identity rules, activation geography, refund conditions and lifecycle claims. Marketplace price/stock/success data is dynamic. Community reports remain dated observations and cannot override a current official restriction. Unknown data stays unknown.

A `carrier-mobile` match means only that the route satisfies the published number class. Until provider-specific service/OTP evidence exists, the UI must say that exact-provider delivery is not independently proven.

Dimensions are deliberately separate:

- provider/evidence quality;
- service compatibility;
- target-service physical-location support;
- number country/class;
- current physical activation location;
- destination country;
- first-use geography policy;
- KYC/identity requirement;
- roaming SMS/OTP capability;
- Wi-Fi Calling/Text abroad;
- long-term overseas-use policy;
- number assignment timing;
- number loss/termination rule;
- temporary-number privacy class;
- temporary-number refund trigger;
- retention/recycling rule;
- dynamic price/stock.

This separation prevents a cheap route from being recommended when it cannot be used supportedly, cannot be activated, cannot roam, or cannot be recovered later.

## Current structured examples

- giffgaff UK: six-month inactivity rule is separate from first-use/long-term overseas-use policy risk; UK physical-SIM delivery constraint; roaming support; no reliance on Wi-Fi Calling abroad; post-inactivity port-out rescue window is shown separately.
- Lebara UK: UK-only first activation requirement, PAYG inactivity/expiry rules and international roaming support after UK activation.
- Tello US: first activation/port-in must occur in the US; overseas Wi-Fi Calling/Text and roaming are post-activation capabilities; community reports of exceptions are labelled anecdotal and linked separately.
- Ultra Mobile PayGo US: USD 3 per 30-day service baseline is separated from acquisition cost. The provider directs buyers to eBay or select T-Mobile stores; the provider-linked eBay reference was observed unavailable, while current third-party sealed-SIM and pre-activated-eSIM marketplace options are modeled separately with price, shipping, stock, returns, seller-history context and ownership/activation cautions. Only the sealed physical-SIM option is compared like-for-like with the provider-linked reference. International voice/SMS/MMS roaming is documented; data roaming is not included. Overseas initial-activation/KYC details remain unknown where first-party evidence is insufficient.
- H2O Pay As You Go US: refill/number-expiry rules are documented, but PayGo is not treated as having proven international roaming SMS where current terms only establish roaming for another plan class.
- Mobal Japan Voice+Data: real 070/080/090 Japanese number, current 1GB Voice+Data entry price, ID rules, number assignment after activation and explicit number loss after termination; temporary setup discounts are not substituted for the durable price baseline.
- Sakura Mobile Japan Voice+Data passport route: non-resident passport route with face-to-face identity verification/pickup; post-departure OTP/roaming remains unknown until verified.
- Mainland China official-carrier route: foreign nationals can use accepted foreign ID; current regulator guidance requires in-person application at a self-operated carrier business hall; the application processing fee is documented as zero while the mobile plan price remains operator/package-specific; generic post-departure OTP remains carrier/plan-specific.
- Airalo example: data-only travel eSIM; never a local SMS-number candidate. Japan currently has a destination-specific 30-day package baseline in the purchase layer.
- Mobal Japan tourist physical data SIM: current Japan-specific no-eSIM fallback with a documented 31-day data package; explicitly no phone number/SMS inbox.
- Destination local physical data SIM: generic research-required fallback for unmapped no-eSIM destinations; never a local SMS-number candidate.
- ActivateX/SMSPool/5SIM: one-time verification routes with ownership duration, privacy and refund semantics kept separate; they are not offered for multi-week or long-term access in the current MVP.

## Files

The checked-in source remains under `frontend/tools/phone-number-lifecycle-mvp/` so the already-audited canary logic and evidence blobs do not move during public release. `frontend/bin/publish-phone-survival-guide.mjs` verifies that source version, then renames and patches only the build output under `frontend/dist/tools/phone-number-survival-guide/`.

- `frontend/tools/phone-number-lifecycle-mvp/index.html` — deterministic UI/ranking/lifecycle output.
- `frontend/tools/phone-number-lifecycle-mvp/catalog.json` — base service rules and provider/market routes.
- `frontend/tools/phone-number-lifecycle-mvp/location-constraints.json` — structured first-activation geography constraints.
- `frontend/tools/phone-number-lifecycle-mvp/route-capabilities.json` — structured KYC, roaming SMS and Wi-Fi Calling evidence.
- `frontend/tools/phone-number-lifecycle-mvp/tutorial-insights.json` — tutorial-derived decision variables that are consumed by the tool at runtime, not a passive research appendix.
- `frontend/tools/phone-number-lifecycle-mvp/audit-rules.json` — post-implementation guardrails for target-service geography, route eligibility and audited fixes.
- `frontend/tools/phone-number-lifecycle-mvp/purchase-intelligence.json` — structured scenario cost, purchase-channel, fair-price, refund/stock/support/number-control and freshness evidence consumed by ranking and result cards.
- `docs/PHONE_NUMBER_TUTORIAL_RESEARCH.md` — research matrix used to discover repeated questions/conflicts.
- `scripts/test-phone-number-lifecycle-mvp.mjs` — deterministic business-path audit that executes the actual inline page logic in a VM with fixture data.
- `.github/workflows/evals.yml` — runs the dedicated phone lifecycle audit before the generic project eval suite.

## Technical approach

Browser-only static MVP: HTML + JSON + client-side ranking + browser-generated `.ics` keep-alive reminder. No backend, DB, login, cookies, crawler, scheduler or new VPS dependency.

Operating cost is effectively zero beyond existing preview/build usage. Automated price/stock collection is future work only after validation and must prefer documented APIs/feeds. It must not run on the tiny observer VPS.

## Privacy

Do not collect phone numbers, SMS codes, identity documents, payment information or account credentials. Location inputs are explicit user selections and stay in the browser; there is no IP-based location detection.

## Test / release gate

The project-wide generic Eval Gate is not sufficient evidence for this feature. During the 2026-09-15 audit it reported `Tasks: 0`; therefore its green status must not be described as proof that the phone-number decision logic is correct.

The dedicated command is:

`node scripts/test-phone-number-lifecycle-mvp.mjs`

It is a blocking CI step. The hidden-canary source logic retains its deterministic business-path audit, and public-release CI separately builds `frontend/dist` and verifies the canonical URL, indexing metadata, analytics wiring, old-slug exclusion and byte-identical evidence JSON before merge.

Required invariants include:

- Claude/OpenAI API do not recommend a foreign number when the mapped physical location is unsupported.
- `Other` physical location remains unverified for every registration service instead of being guessed.
- unmapped Mainland-China service-access cases remain unverified rather than assuming a phone number solves access.
- `Another country` is not treated as an exact mapped number country.
- mapped unsupported number-country choices for geographically restricted services are blocked.
- `No preference` cannot silently choose an arbitrary foreign carrier.
- one-time SMS products are not candidates for multi-week or long-term number access.
- registration never accepts a data-only route.
- a carrier-mobile number-class match is not presented as proof of provider-specific OTP delivery.
- a real local-number travel requirement excludes Airalo and every other data-only route.
- data-only travel without eSIM receives a physical data-only fallback rather than a voice/SMS carrier route.
- data-only travel cannot pretend to solve OTP when the user also drops the home SMS line.
- long-stay input changes route ranking.
- giffgaff first-use and long-term-overseas cautions appear only in the relevant context.
- tutorial-derived high-impact claims expose provenance links.
- SMSPool/5SIM refund semantics remain distinct.
- Mobal number-assignment and termination facts reach the tool model.
- Claude/OpenAI temporary-number routes remain rejected.
- keep-alive export still emits a valid calendar shell.
- scenario cost, purchase-channel evidence, fair-price handling and unknown-data behavior reach the actual rendered result path.
- cheap/safe ranking cannot compare unlike currencies/product classes or turn missing evidence into a neutral score.
- the 16 acceptance scenarios cover the major lifecycle and purchase-layer failure modes; dedicated deterministic checks now also cover Ultra PayGo recurring-vs-acquisition separation, provider-linked availability, like-for-like price-gap math, pre-activated ownership separation and non-invented activation geography.
- local Chromium rendering has been checked on desktop and narrow/mobile layouts: the audited US WhatsApp long-term path surfaces the Ultra “Where to buy now” acquisition choices, USD 39 service-only 365-day baseline, USD 13 provider-linked reference, USD 53.85 observed third-party sealed-SIM all-in-before-tax snapshot, the distinct pre-activated-eSIM warning, lifecycle termination/activation evidence, and no measured horizontal overflow.
- Vercel Preview/CI for the current commit must still succeed after it is pushed; local browser verification is not a substitute for preview verification.
- public release registers exactly one canonical Phone Survival URL in homepage, Tools and sitemap; the internal canary slug must not ship in `dist`.

Any release-changing commit must pass the deterministic audits, public-release build audit, CI/Eval Gate, hosted Vercel Preview and desktop/mobile browser checks before merge. Local Chromium verification is useful evidence, but it never substitutes for checking the hosted Preview and the final apex-domain production deployment.

Rollback is reverting the public-release commit to the previously verified hidden-canary state. The feature is browser-only, so no database or infrastructure migration or cleanup is required.
