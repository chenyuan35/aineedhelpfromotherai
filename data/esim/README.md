# Data-eSIM normalized data layer

This directory is the reviewed backstage data layer for travel/data eSIM evidence. It is intentionally separate from `data/phone/v1`: a pure data eSIM must not become a phone-number/retention canonical route merely because both products use eSIM technology.

## v1 contract

`v1/manifest.json` admits exact versioned source snapshots from `data/phone/inbox/` into the Data-eSIM normalization pipeline. The raw inbox files remain immutable evidence records; normalization reads them without rewriting or flattening away uncertainty. If a stable public source URL is identified later for an immutable user-supplied snapshot, reviewed `resolvedSource` metadata may be attached in the manifest rather than mutating the raw inbox file.

`scripts/lib/data-esim-normalizer.mjs` converts the admitted snapshots into three in-memory tables:

- `providers` — source-label identities only; no guessed corporate identity or Phone route linkage;
- `evidence` — versioned community observations with claim strength, provenance, acquisition/channel signals, IP/egress, FUP/throttle signals, and independent data/voice/SMS/number capability states;
- `offers` — versioned price/allowance/validity snapshots preserving the original offer object and source timestamp.

The source snapshot plus delta model is append-only. Later prices or mechanics are additional evidence versions; they do not overwrite earlier community snapshots.

## Evidence rules

Community evidence, referral mechanics, agent/reseller/third-party channels, promotions, hidden acquisition paths, selectable IP/egress, throttled/unlimited mechanics, and negative tests are first-class research evidence. Provider-public-page absence is not by itself a rejection condition.

Unknown capability fields remain `unknown`. A mention of voice, SMS or a number is preserved as a community signal only; it does not automatically turn the product into a Phone canonical route. Any future cross-family linkage requires a separate reviewed identity/capability decision.

## Publication boundary

This layer is backstage-only. It is not a production frontend input, does not create URLs, does not change sitemap/indexability, and does not authorize public recommendations or rankings. Publication remains a separate gate.