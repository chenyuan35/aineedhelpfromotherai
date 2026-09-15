# Phone Number Lifecycle MVP

Status: prototype only. Draft PR only; not approved for production release.

## Product job

Two audiences only for this MVP:

1. people who need a phone number to register or retain access to software/services;
2. people travelling, studying, working or living abroad who need connectivity and/or a usable local or home-country number.

The job is not "compare phone plans". It is:

> Help a user get the right number with the lowest practical risk, cost and effort, then keep that number usable long enough for the task they care about.

Lifecycle:

`task -> route -> buy -> KYC -> activate -> register/arrive -> use -> retain -> recover`

## MVP success condition

After a small number of questions, the user should get a short executable route that answers:

- what number class fits the task;
- where to buy or compare it;
- current or explicitly dynamic cost;
- seller/provider evidence quality;
- device requirements;
- KYC/identity requirements, or an explicit unknown;
- where first activation can happen;
- whether the number can receive SMS/OTP abroad;
- whether Wi-Fi Calling/Text can help abroad;
- target-service compatibility;
- retention cost/rule and reminder;
- recovery/migration plan.

## Entry A — Register an app/service

Initial services: Claude, OpenAI API, WhatsApp, Telegram, Google Account.

Inputs:

- target service;
- physical location now;
- one-time, short-term or long-term use;
- preferred number country;
- cheapest, easiest or safest priority.

The first explicitly supported number countries are United States, United Kingdom, Japan and Mainland China. “Another country” remains a generic research route rather than pretending the MVP has global carrier coverage.

Hard activation constraints are allowed to remove a route from ranking. Examples: Tello is not an immediate activation route for a user physically outside the US; a Mainland China official-carrier SIM is not an immediate route for someone outside Mainland China because current guidance requires in-person application.

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

A data-only eSIM must never be presented as an SMS-capable phone number. If OTP still depends on the home number, the tool tells the user to keep that line alive until recovery is migrated or overseas SMS behavior is verified.

## Explicit non-goals

The MVP does not sell numbers, receive/store verification codes, automate account creation, support bulk-account creation, bypass KYC/geographic/platform restrictions, fabricate success rates, or rank providers based on affiliate commission.

It is intentionally absent from the production sitemap, homepage and tools index.

## Evidence model

Official service/provider documentation outranks blogs and forum posts for rules. Marketplace price/stock/success data is timestamped/dynamic. Community reports are observations, not universal compatibility claims. Unknown data stays unknown.

Dimensions are deliberately separate:

- seller trust/evidence;
- service compatibility;
- number country/class;
- current physical activation location;
- destination country;
- KYC/identity requirement;
- roaming SMS/OTP capability;
- Wi-Fi Calling/Text abroad;
- retention/recycling rule;
- dynamic price/stock.

This separation prevents a cheap route from being recommended when it cannot be activated, cannot roam, or cannot be recovered later.

## Current structured examples

- giffgaff UK: six-month inactivity rule, UK physical-SIM delivery constraint, eSIM availability, roaming support, no reliance on Wi-Fi Calling abroad; universal KYC requirement remains unverified.
- Lebara UK: free PAYG physical SIM route, UK-only first activation requirement, 90-day chargeable-activity inactivity boundary followed by a longer recoverable period, international roaming support after UK activation; universal passport requirement remains unverified.
- Tello US: current low-cost monthly route, first activation/port-in must occur in the US, US E911 address required for Wi-Fi Calling, Wi-Fi Calling/Text can receive OTPs abroad after setup, international roaming available after US use.
- Ultra Mobile PayGo US: USD 3/month base route in current official material, international voice/SMS/MMS roaming via PayGo wallet, no data roaming; overseas initial-activation/KYC details still require verification.
- H2O Pay As You Go US: refill/number-expiry rules are documented, but current terms tie International Roaming to active Unlimited Talk and Text plans, so the PayGo route must not be treated as having proven roaming-SMS capability.
- Mobal Japan Voice+Data 5G: real 070/080/090 Japanese mobile number, voice-product passport/ID verification, Japan collection or worldwide delivery, number assigned only after activation, optional international voice/SMS roaming on the current 5G route, and explicit loss of the number when service is terminated.
- Mainland China official-carrier route: foreign nationals can use a passport or Foreign Permanent Resident ID Card; current 2026 regulator guidance requires the applicant to appear in person at a self-operated China Mobile/China Unicom/China Telecom business hall; generic overseas roaming/OTP behavior remains unknown until a carrier/plan is selected.
- Airalo example: data-only travel route; no normal SMS number.
- ActivateX/SMSPool/5SIM: temporary remote verification routes; no durable ownership or travel roaming line is assumed.

## Files

- `frontend/tools/phone-number-lifecycle-mvp/index.html` — deterministic UI/ranking/lifecycle output.
- `frontend/tools/phone-number-lifecycle-mvp/catalog.json` — service rules and provider/market routes.
- `frontend/tools/phone-number-lifecycle-mvp/location-constraints.json` — structured first-activation geography constraints.
- `frontend/tools/phone-number-lifecycle-mvp/route-capabilities.json` — structured KYC, roaming SMS and Wi-Fi Calling evidence.
- `docs/PHONE_NUMBER_LIFECYCLE_MVP.md` — product/technical contract.

## Technical approach

Browser-only static MVP: HTML + JSON + client-side ranking + browser-generated `.ics` keep-alive reminder. No backend, DB, login, cookies, crawler, scheduler or new VPS dependency.

Operating cost is effectively zero beyond existing preview/build usage. Automated price/stock collection is future work only after validation and must prefer documented APIs/feeds. It must not run on the tiny observer VPS.

## Privacy

Do not collect phone numbers, SMS codes, identity documents, payment information or account credentials. Location inputs are explicit user selections and stay in the browser; there is no IP-based location detection.

## Test / release gate

Before any production merge:

- frontend build passes;
- registration and travel paths return results;
- hard activation restrictions actually remove or defer impossible routes;
- destination country influences travel routes;
- KYC unknowns remain explicit;
- data-only eSIM is never presented as SMS-capable;
- Tello outside-US first activation is not presented as immediately available;
- Tello overseas OTP capability is shown only with its setup conditions;
- Lebara outside-UK first activation is deferred until UK arrival;
- Mobal Japan shows passport/ID requirements and does not hide number-loss-on-termination risk;
- Mainland China local-SIM route requires in-person application and valid foreign ID evidence;
- H2O PayGo is not presented as proven international roaming SMS;
- Claude temporary/VoIP routes remain rejected;
- reminder export produces a valid `.ics` file;
- mobile layout has no horizontal overflow;
- prototype remains off production navigation/sitemap.

Rollback is deleting the isolated prototype directory and this document before merge. No database or infrastructure cleanup is required.
