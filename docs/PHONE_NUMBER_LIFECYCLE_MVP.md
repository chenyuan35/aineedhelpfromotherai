# Phone Number Lifecycle MVP

Status: prototype only, not approved for production release.

## User problem

Two primary audiences:

1. People who need a phone number to register or retain access to software/services.
2. People travelling, studying, working or living abroad who need connectivity and/or a usable local or home-country number.

The product job is not "compare phone plans". It is:

> Help a user get the right number with the lowest practical risk, cost and effort, then keep that number usable long enough for the task they care about.

The end-to-end lifecycle is:

`task -> route -> buy -> activate -> register -> use -> retain -> recover`

## MVP success condition

A user should be able to answer a few simple questions and receive a short, actionable route that explains:

- what type of number fits the task;
- where to obtain it or where to compare current supply;
- current or clearly-labelled dynamic cost information;
- whether the seller/provider evidence is strong enough to rely on;
- device, ID/KYC and activation prerequisites;
- whether the number is appropriate for the target service;
- the shortest registration path;
- how to avoid unnecessary recurring cost;
- how to keep the number alive;
- what to do if the number is lost, recycled or needs to be migrated.

## MVP scope

### Entry A: Register an app/service

Initial services:

- Claude
- OpenAI API
- WhatsApp
- Telegram
- Google Account

Inputs:

- target service;
- one-time vs short-term vs long-term use;
- preferred number country where relevant;
- priority: cheapest, easiest, or safest long-term route.

Output:

- service phone-number rule from an official source;
- recommended number class;
- matching provider/market routes;
- difficulty;
- cost model;
- lifecycle checklist;
- explicit warnings when temporary/VoIP routes are inappropriate.

### Entry B: Travel / Move Abroad

Inputs:

- short trip vs long stay;
- data only vs local calls/SMS;
- whether OTP/SMS is required;
- whether the home number must remain reachable.

Output:

- data-only eSIM route when a phone number is unnecessary;
- local carrier/prepaid route when a real local number is required;
- dual-line route when the user should keep the home SIM for OTP and add travel data separately;
- activation and retention checklist.

## Explicit non-goals

The MVP does not:

- sell numbers;
- receive or store verification codes;
- automate account creation;
- support bulk-account creation;
- provide methods for bypassing KYC, platform anti-abuse systems, geographic restrictions or bans;
- claim a provider is trustworthy without evidence;
- fabricate success rates, inventory, prices or app compatibility;
- launch to the production sitemap, homepage or tools index.

## Product design

The first screen asks the user what they are trying to do, not what telecom technology they want.

The result screen is answer-first:

1. Best route for the selected goal.
2. Why it fits.
3. Cost and difficulty.
4. Buy/compare destination.
5. Before-you-buy checklist.
6. Activation steps.
7. Registration steps.
8. Retention rule and reminder.
9. Recovery/migration plan.

No chat interface is required. This is a deterministic decision tool backed by structured evidence.

## Data model

The prototype uses static JSON, designed to map cleanly to a future database.

Core entities:

- `service_rules`: official requirements by target software/service.
- `routes`: number/provider/market routes.
- `sources`: source URL, source type, last verified date.
- `retention`: inactivity rule, recurring cost model and recovery notes.
- `compatibility`: service x route compatibility status with evidence strength.

Future entities only after the prototype proves useful:

- `price_snapshots`;
- `stock_snapshots`;
- `verification_outcomes`;
- `provider_reputation_evidence`;
- `retention_reminders`.

## Data quality rules

- Official service/provider documentation outranks blogs and forum posts for rules.
- Marketplace price/stock/success data must be timestamped and treated as dynamic.
- Community reports may be stored as observations, never converted into universal compatibility claims.
- Unknown data stays unknown; do not fill missing facts with a neutral score.
- Seller reputation and number compatibility are separate dimensions.
- Temporary-number success and long-term account safety are separate dimensions.

## Technical approach

MVP is browser-only:

- one static HTML page;
- one static JSON catalog;
- client-side filtering and ranking;
- local-only retention reminder date;
- `.ics` reminder export generated in the browser;
- no backend, database, login, cookies or new scheduled jobs.

This keeps operating cost effectively zero and avoids adding production dependency to any VPS.

## File/module boundary

- `frontend/tools/phone-number-lifecycle-mvp/index.html` — UI and deterministic decision logic.
- `frontend/tools/phone-number-lifecycle-mvp/catalog.json` — small curated evidence catalog.
- `docs/PHONE_NUMBER_LIFECYCLE_MVP.md` — product/technical contract.

The prototype is intentionally not registered in the production tools index or sitemap.

## API and persistence

None for MVP.

All input remains in the browser. The only saved value is an optional local reminder date if the user chooses to create one; the current prototype exports a calendar file instead of storing server state.

## Privacy and security

Do not collect:

- phone numbers;
- SMS codes;
- identity documents;
- payment information;
- account credentials.

External provider links open directly to the provider/market site. Provider ordering must not depend on affiliate commission.

## Deployment

Prototype remains on `feature/phone-number-lifecycle-mvp` and a draft PR/Vercel Preview only. Do not merge until the user explicitly approves production release and the data set is production-ready.

## Observability

No new infrastructure is required. If released later, existing GA4 `tool_open` / `tool_action` behavior events are sufficient for the first measurement round.

Potential later events:

- entry path selected;
- result generated;
- route expanded;
- reminder exported;
- provider outbound click.

Do not add those before release approval.

## Test strategy

Before merge eligibility:

- frontend build passes;
- prototype page exists in build output;
- no JS syntax/runtime errors;
- registration and travel paths both return a result;
- Claude rejects temporary/VoIP recommendations;
- OpenAI ChatGPT is not incorrectly presented as requiring a number;
- WhatsApp/Telegram long-term paths warn against losing number control;
- data-only travel eSIM is not presented as an SMS-capable phone number;
- reminder export produces a valid `.ics` file;
- mobile viewport has no horizontal overflow;
- no prototype route is added to sitemap or production tool navigation.

## Rollback

Because the MVP is isolated and unregistered, rollback is deleting the prototype directory and this document before merge. No database or infrastructure cleanup is required.

## Operating cost

MVP: effectively zero beyond existing Vercel preview/build usage.

Future costs should only be accepted after validation. Automated price/stock collection must prefer documented APIs or feeds and must not run on the one-month 128 MiB observer VPS.

## Initial evidence used by the prototype

The seed catalog is intentionally small and marks dynamic/unknown values instead of guessing. Initial official evidence includes:

- Claude Help Center: mobile-number verification and rejection of VoIP, Google Voice, app-generated and landline numbers.
- OpenAI Help Center: ChatGPT no longer requires phone verification; first API key currently does.
- WhatsApp Help Center: first registration uses SMS or phone call and requires continued control of the associated number.
- Telegram FAQ: account is tied to a mobile number and users should retain access before changing numbers.
- Google Account Help: phone verification may be requested and recovery phone should be a user-controlled SMS-capable mobile number.
- giffgaff Help: inactivity deactivation after six months without qualifying use and limited post-deactivation port-out window.
- Tello official pricing: plans currently start at USD 5/month; eSIM is offered.
- Airalo Help Center: most eSIM packages are data-only and cannot send/receive normal SMS or calls.
- ActivateX: live temporary-SMS route comparison by service/country/supplier/price/availability.

All changing facts require re-verification before production release.