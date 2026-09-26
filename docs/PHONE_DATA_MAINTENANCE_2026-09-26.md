# Phone Radar — data maintenance runbook

Date: 2026-09-26
Status: ACTIVE OPERATING RUNBOOK

## Maintenance objective

Phone Radar is expected to grow from tens to hundreds of low-cost phone routes across many markets. Adding, correcting or removing one route must not require a frontend rewrite, a database service migration, or a production outage.

The data system therefore uses four isolation layers:

1. **raw inbox** — untrusted researcher/agent exports; never loaded by production;
2. **reviewed staging** — structurally checked candidates with research priority; still not public;
3. **canonical `data/phone/v1`** — reviewed normalized truth used by the build;
4. **compiled browser artifacts** — disposable outputs regenerated from canonical truth.

## Primary expansion scope

Research capacity is spent first on:

- low-cost long-term SMS/OTP numbers;
- high-value data SIM/eSIM routes.

Ordinary high-cost monthly plans are reference/low-priority unless they solve a distinct market, eligibility, roaming, number, or service-capability gap that cheaper routes cannot.

The research-priority threshold is configuration, not a hard public truth. It lives in `data/phone/research-policy.json` and does not demote already-admitted routes.

## Add a new route

Preferred path:

1. validate raw pack with `npm run phone:candidates:validate -- <file.jsonl>`;
2. stage it with `npm run phone:candidates:stage -- <file.jsonl> <staging.jsonl>`;
3. resolve `blocked-correction-required`, duplicates and missing provenance;
4. prepare one reviewed route packet under `data/phone/review-packets/`;
5. run `node scripts/apply-phone-review-packet.mjs <packet> --check`;
6. only after review, run the same command with `--apply`;
7. run `npm run phone:data:build` and `npm run phone:data:check`;
8. run frontend build/Phone release tests and submit one reviewed PR.

A review packet may only add a `backstage-only` route. Public promotion is a separate explicit change.

## Failure isolation

- **Forum/API/source outage:** canonical data and the live site keep working. Source fetchers update evidence asynchronously; they are not runtime dependencies.
- **Bad Kimi/Qwen export:** validator/staging can reject or quarantine it; production build never reads inbox/staging.
- **Contradictory numeric claim:** candidate stays blocked until a reviewed override resolves the conflict. Do not silently prefer the newest-looking number.
- **Broken generated index:** run `npm run phone:data:build`; compiled files are disposable.
- **Bad canonical edit:** revert the exact Git commit/PR, rebuild artifacts, redeploy. Git history is the rollback log.
- **One bad route:** fix or remove that route packet/data row; do not rebuild the product architecture.
- **Interrupted compiler:** generated files use temp-file + rename atomic writes, reducing partial-file corruption risk.

## Stable IDs

Route IDs, market IDs, brand IDs and source IDs are durable references. Display names and prices may change; IDs should not. Use aliases when replacing a legacy route ID instead of duplicating the route.

## Number-range maintenance

Number-range allocation is its own dataset. Original allocation and current serving carrier are not the same thing after porting. Range-source failure must not block ordinary route/search operation.

## Service evidence maintenance

Raw observations are append-only evidence records. A/B/C/insufficient grades are derived artifacts and can be recomputed. Never hand-edit a grade to obtain a desired ranking.

## Scale boundary

Stay repo-native/static while reviewed changes are batch-oriented and user writes do not require shared state. Introduce a production database/API only when real multi-user writes, near-real-time inventory, or route volume makes static rebuilds measurably inadequate. Do not add infrastructure merely because hundreds of rows exist.
