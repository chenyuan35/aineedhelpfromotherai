# Phone Radar Top Decision Layer — 2026-10-04

Status: implementation contract for the bounded Phone Radar decision-shortcut release.

## User task

A user opening Phone Radar should be able to answer, without reconstructing forum threads manually: which reviewed real-mobile routes are cheapest to start, cheapest to keep, have the longest verified keep window, and have the strongest current app-verification evidence.

## MVP

- derive Top 3 lists from the existing normalized canonical data rather than hand-maintaining rankings;
- show lowest setup cost, lowest yearly keep cost, longest verified keep window, strongest app-verification evidence, and best-documented continuity;
- keep HOLD and backstage-only routes out of Top winners;
- expose KYC state, number/SIM form and market in the Top rows;
- emit app success percentages only when the exact route + service + operation aggregate has at least five deduplicated observations from at least five distinct source records;
- keep route details lazy-loaded from the existing evidence bundle.

## Explicit non-goals

- no arbitrary 0–100 safety/risk score;
- no claim that a route is "least likely to be banned" without direct evidence;
- no percentage from one forum thread, one source, or thin samples;
- no new SEO route, market or keyword pages;
- no Data-eSIM mixing into real-number rankings;
- no SQL/API/backend dependency.

## Technical approach

The repo-native compiler remains the source of derived browser data. `scripts/build-phone-database.mjs` adds compact decision facts to `phone-route-summaries.json` and evidence-gated percentage fields to service aggregates. The Phone Radar canonical page computes Top lists client-side from that lightweight summary payload.

Top eligibility is conservative: `family=long-term`, `numberClass=real-mobile`, `evidenceState=admitted`, and `surfaceState != backstage-only`.

## Data and persistence

No new persistence layer. Existing canonical tables remain authoritative. Rankings are deterministic derived output and rebuild with `npm run phone:data:build`.

## API / page flow

No API change. The page continues loading the lightweight canonical summary first and route detail JSON only after the user opens evidence.

## Privacy and security

No user input leaves the browser. No new cookies, account state, secrets or third-party calls are introduced.

## Deployment / monitoring

Normal branch → PR → Eval/CI + Vercel Preview → merge → production verification. Existing Phone interaction events remain; Top rows reuse the existing canonical detail-open event path.

## Tests

- generated data drift check;
- full Phone canonical data regression;
- frontend production build;
- public release audit;
- Top winner eligibility assertions;
- percentage eligibility assertions;
- sitemap/publication boundary remains unchanged.

## Rollback

Revert the bounded PR. No migration or durable external state is created.

## Operating cost

Static build-time derivation and browser-side rendering only; expected incremental runtime cost is negligible.


## Release closeout

- PR: #388
- Merge: `f171726bde05245bc41c284d718ab32a64298f40`
- Eval Gate #1156: PASS
- Vercel Preview: READY
- Production deployment: `dpl_3HFruLPEyUj7hafRpQAAiBEQxSdL` READY
- Production apex Phone Radar: HTTP 200
- Production `phone-route-summaries.json`: HTTP 200 with `decisionFacts`, distinct-source service counts and evidence-gated success-rate fields
- Canonical remains 159 routes / 87 markets / 156 brands / 117 networks / 618 sources
- Public SEO boundary remains 135 comparison / 3 indexable / 31 sitemap URLs
- No new route URL, sitemap entry, arbitrary safety score or unsupported success percentage was introduced
