# Phone prefix search database

Date: 2026-09-28
Status: PRODUCT ARCHITECTURE / DATABASE FEATURE

## Product decision

Phone Radar must treat number-prefix compatibility as a searchable database feature, not as an article family.

The user job is simple: a user has or is considering a number and wants to know what that prefix is known to work with, what has failed, how recent the evidence is, and how strong the evidence is.

This capability sits beside the existing route / acquisition / retention database. It does not replace route comparison and it must not create thin prefix pages.

## Search interaction

The intended public interaction is:

1. User enters a full phone number, a broad prefix, or a finer known prefix.
2. The client normalizes the input and performs longest-known-prefix matching.
3. Matching prefix records are loaded on demand.
4. Results show the provider/product context and service compatibility observations.
5. User can filter the result by service such as ChatGPT/OpenAI, Codex, Telegram, WhatsApp, Google/Gemini, Apple ID, PayPal, TikTok, Microsoft, Claude or Grok.
6. The user can expand a result to inspect dated evidence and provenance.

The default Phone UI should not render or transmit the complete prefix evidence corpus when the user has not asked for it. Load the relevant search dataset progressively / on demand.

## Data hierarchy

Use a normalized hierarchy rather than encoding each prefix as a route:

`provider/product -> broad prefix -> finer prefix -> service -> operation -> dated observations`

At minimum each observation needs:

- `product_id`
- `broad_prefix`
- `fine_prefix` when known
- `service_id`
- `operation`
- `result`: `success`, `failure`, `delayed`, `risk-blocked`, or `unknown`
- `observed_at`
- `source_id` / public source reference
- `evidence_type`: first-person, aggregate poll, provider artifact, etc.
- `sample_count`
- optional bounded note such as delay or risk-control behavior

Do not store complete phone numbers, SMS codes, private account data or unnecessary user identity data.

## MVP implementation shape

Prefer the lowest-maintenance implementation:

- normalized static data in the Phone data layer;
- build-generated compact prefix search index;
- browser-side longest-prefix matching and service filtering;
- lazy / progressive loading so untouched data stays backstage;
- no new backend or persistence service unless later scale makes browser-side lookup inadequate.

The initial search result can show sparse evidence. Sparse evidence must be labelled as sparse evidence rather than hidden or converted into a fabricated percentage.

Recommended result fields:

- matched prefix;
- provider/product;
- service;
- observed successes / failures / delayed / blocked counts;
- total attributable samples;
- latest observation date;
- evidence strength / sample-state label;
- expandable source trail.

A success-rate percentage is allowed only when the numerator and denominator are genuinely defined by comparable observations. Poll option existence or total poll voter counts must never be converted into per-prefix percentages.

## UI boundaries

This is a database lookup inside Phone Radar, not a programmatic SEO page generator.

Do not create one indexable URL per prefix or per prefix/service keyword combination. A single searchable Phone surface can expose the database interactively. Indexability remains separately gated by the existing publication model.

The interface should be graphical first and detailed second: a compact result/status view for fast decisions, with evidence details expandable on demand.

## First admitted research source

`docs/PHONE_ESIMGG_PREFIX_VERIFICATION_RESEARCH_2026-09-28.md` is the first research packet for this database dimension.

Current directly attributable examples include eSIM.gg finer prefixes `8103` and `5405` with dated Telegram/WhatsApp success observations, plus a broad `53` report for Codex and an unresolved `ws` abbreviation. The thread's poll choices are research leads, not per-prefix success evidence unless option-level counts are captured.

## Build gate

Do not interrupt the current bounded UK MNO canonical migration solely to build this interface.

When implementation is scheduled, the minimum releasable version is:

- one normalized prefix evidence dataset;
- one compact generated search index;
- one search input integrated into the existing Phone UI;
- longest-prefix lookup;
- service filter;
- dated sample counts and provenance display;
- no new standalone prefix URLs;
- mobile verification;
- tests for exact/fallback prefix matching, unknown prefixes, sparse evidence and malformed input.

The feature is successful when a user can search a number/prefix and receive a materially useful evidence-backed answer without browsing forum threads manually.