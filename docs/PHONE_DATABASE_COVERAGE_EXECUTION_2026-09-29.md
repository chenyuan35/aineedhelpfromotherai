# Phone Radar backend database coverage execution — 2026-09-29

Status: **ACTIVE BACKEND COVERAGE TRACK / NO PUBLICATION CHANGE**

Phone Radar's normalized database is an internal product knowledge base. It is intentionally broader than the public/indexable URL set. Canonical admission and SEO publication are separate gates.

## Coverage objective

Approximately **90%+ coverage of the relevant low-cost phone-route universe**, provided evidence provenance and maintenance remain tractable. This is a database objective, not a page-count objective.

## Current verified state after DB-C5

- comparison artifact: **135 routes**;
- canonical normalized database: **104 routes / 60 markets / 101 brands / 80 networks / 346 sources**;
- comparison↔canonical route-ID overlap: **93**;
- comparison routes still legacy-only: **42**;
- explicit route indexability: **3**.

## Processing model

Work in reviewed database batches (`DB-C1`, `DB-C2`, ...). For every route preserve current product identity, acquisition, retention lifecycle, KYC/location/payment constraints, SIM form, sourced roaming/SMS facts, incident/recovery/recycling evidence, source URL/date/type, explicit conflicts/unknowns, and duplicate checks. Missing stays missing; isolated incidents never become product-wide rates.

## DB-C1 — COMPLETE

Research task: `task-1e549d80fe6d`; independent review overrode delegated output where fresher first-party evidence conflicted.

Final dispositions:

- HOLD: `a1-bfree-at-2026`
- HOLD: `proximus-paygo-be-2026`
- ADMIT-BACKSTAGE: `o2-cz-prepaid-2026`
- HOLD: `vodafone-tuti-hu-2026`
- HOLD: `telkomsel-simpati-365d-2026`
- HOLD: `vodacom-prepaid-83d-2026`
- HOLD: `beeline-kz-simka-v-seyfe-2026`
- ADMIT-BACKSTAGE: `magticom-number-maintenance-2026`
- HOLD: `mobitel-lk-retention-2026`
- ADMIT-BACKSTAGE: `yettel-rs-2026`
- HOLD: `cellcard-kh-2026`
- HOLD: `grameenphone-validity-pack-2026`

All 12 are normalized in the backend with provenance/conflicts; HOLD means not ready for recommendation/public treatment, not exclusion from the internal evidence database.

Important corrections made during DB-C1:

- Telkomsel legacy Rp5,000/year minimum withdrawn;
- Vodacom legacy 83-day rule replaced by current official >110-day no-use threshold, with recycle timing unresolved;
- Grameenphone stale five-year price withdrawn in favor of clean BDT300/365-day current rule plus conflict preservation;
- A1 13-month/EUR20 extension resolved from current official FAQ;
- Proximus separate 6-month no-use deactivation preserved alongside 12-month top-up validity;
- Vodafone Hungary legacy identity mapped to current One Tuti without changing the stable route ID;
- Cellcard 30-vs-180-day official expired-balance recovery conflict preserved rather than guessed away.

## DB-C2 — COMPLETE batch members

The 12 legacy-only candidates processed in DB-C2 were:

1. `tesco-mobile-payg-uk-2026`
2. `vinaphone-giu-so-vn-2026`
3. `cellfie-ge-90-45d-2026`
4. `kyivstar-prepaid-274-91-2026`
5. `dialog-lk-365d-2026`
6. `safaricom-daima-2026`
7. `truemove-validity-pack-th-2026`
8. `cht-ruyi-180d-2026`
9. `telia-ee-180d-2026`
10. `mts-sokhranyayu-nomer-2026`
11. `etisalat-wasel-ae-2026`
12. `claro-pre-br-90d-2026`

Legacy costs are discovery hints only. Reverify product existence, current price, lifecycle and constraints before admission. Dedicated retention products (for example Safaricom Daima or MTS number preservation) should be modeled as services attached to the underlying prepaid line, not invented as separate products if the canonical schema can represent that relation without duplication.

## Quality gate

- first-party current provider facts for provider-controlled claims;
- independent evidence where useful for operational conflicts;
- sample audit ≥3 candidates per batch;
- `REJECT` / `HOLD` / `ADMIT-BACKSTAGE` disposition;
- importer-based canonical write only after review;
- full Phone data/integrity/publication-boundary tests;
- public/indexability/sitemap unchanged unless a separate publication trigger opens.

## What this track does not do

- no new SEO URL because a database row exists;
- no automatic public ranking/recommendation;
- no forced completion of unknown fields;
- no SQL/API redesign merely to call the data layer a backend;
- no mass raw import of legacy rows without evidence review.

## DB-C2 — completed 2026-09-29

DB-C2 normalized 12 more existing comparison routes through reviewed packets after two delegated research lanes plus an independent sample audit. Final DB-C2 disposition: **10 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**.

Post-DB-C2 state: **77 canonical routes / 47 markets / 264 sources / 66 comparison-overlap route IDs / 69 comparison routes still legacy-only / 3 explicit indexable routes**.

The two HOLD routes (`truemove-validity-pack-th-2026`, `claro-pre-br-90d-2026`) remain in the normalized backend with uncertainty preserved. Community or legacy mechanisms are not discarded merely because a current public provider page is inaccessible.

## DB-C3 — completed 2026-09-29

DB-C3 independently reviewed and normalized 12 additional legacy-only routes through approved backstage packets. Final disposition: **7 ADMIT-BACKSTAGE / 5 HOLD / 0 REJECT**.

Post-DB-C3 state: **89 canonical routes / 51 markets / 86 brands / 67 networks / 293 sources / 78 comparison-overlap route IDs / 57 comparison routes still legacy-only / 3 explicit indexable routes**.

The five HOLD routes are `asda-mobile-uk-2026`, `lycamobile-uk-keep-number-2026`, `lmt-karte-60-60d-2026`, `free-mobile-fr-2026`, and `good2go-payg-ca-2026`. Their current unresolved provider-text, exact-cost or eligibility constraints remain explicit rather than inferred.

Material corrections include ASDA activity-vs-credit-expiry separation; Lyca UK's current EE host network; withdrawal of LMT's unsupported EUR18/year estimate; Telekom Easy's 180-day post-top-up validity; CALENDAR's current JPY7,860 entry and JPY5,400 same-number extension; Orange Romania active/grace separation; 1pMobile's cohort-specific 2026 rules; and RedPocket's current USD110 annual renewal plus U.S.-only activation.

Release: PR #305 squash-merged as `82299c03500f029db1fb6241fbaaf4d5bcbcb3f0`; Eval Gate #949, Vercel Preview/production and live publication-boundary verification passed.

## DB-C4A — completed 2026-09-29

The first three DB-C4 candidates were independently reviewed as the required sample audit and normalized through approved backstage packets. Final DB-C4A disposition: **1 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**.

- `cosmote-frog-13mo-2026` — ADMIT-BACKSTAGE. Current provider evidence keeps the 13-month number-renewal window, while the current FROG electronic top-up minimum is EUR13; the old EUR10 estimate is withdrawn.
- `optus-flex-plus-au-2026` — HOLD. Current long-expiry prices are A$180/186 days and A$350/365 days, and Optus has a provider-announced 2026-09-30 price change; the old A$59/A$180 ladder is stale.
- `lebara-fr-2026` — HOLD. Lebara France now uses SFR. Current provider material separates 90-day recharge validity from a 90-consecutive-day no-service-use termination rule, so the legacy top-up-only retention cost is not treated as proven.

Post-DB-C4A state: **92 canonical routes / 52 markets / 89 brands / 70 networks / 305 sources / 81 comparison-overlap route IDs / 54 comparison routes still legacy-only / 3 explicit indexable routes**. Full Phone checks and the frontend build preserve **135 comparison routes / 3 route detail pages / 0 market detail pages**.

DB-C4 remains active with the remaining six candidates listed in `docs/CURRENT_EXECUTION_QUEUE.md`.

## DB-C4B — completed 2026-09-29

The next three DB-C4 candidates were independently reviewed and normalized through approved backstage packets. Final DB-C4B disposition: **1 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**.

- `smart-prepaid-ph-2026` — HOLD. Current provider material keeps ordinary loaded value valid for 365 days and gives a 180-day reload grace after balance reaches zero, but tourist-registered foreign SIMs are valid only 30 days unless an approved visa extension is supplied; other visa categories are not subject to that temporary cap.
- `mtn-ng-keepmynumber-2026` — ADMIT-BACKSTAGE. Current MTN Keep My Number prices are NGN3,500/1 year, NGN5,000/2 years and NGN7,500/3 years. Current prepaid terms also correct the old blanket NIN assumption: visitors staying under 24 months may register with a valid visa and passport/travel document instead of NIN.
- `id-mobile-uk-2026` — HOLD. Current PAYG legal terms use a four-month/120-day inactivity clock and 365-day unused-credit expiry, while current iD marketing and a provider employee community answer say 180 days; the stricter legal clock is retained operationally and the conflict stays explicit.

Post-DB-C4B state: **95 canonical routes / 53 markets / 92 brands / 72 networks / 313 sources / 84 comparison-overlap route IDs / 51 comparison routes still legacy-only / 3 explicit indexable routes**. Full Phone checks preserve **135 comparison routes / 3 explicit indexable routes**.

Release: PR #309 (`518e7ab737e4ec53a8dba2740e1e752e83adc96a`) merged after Eval Gate #957, CI #183 and Vercel Preview passed; production succeeded. Live checks confirmed the hub and existing VOXI detail at HTTP 200 and the non-indexable MTN Nigeria route at HTTP 404.

DB-C4 remains active with the remaining six candidates listed in `docs/CURRENT_EXECUTION_QUEUE.md`.

## DB-C4C — completed 2026-09-29

The next three DB-C4 candidates were independently reviewed and normalized through approved backstage packets. Final DB-C4C disposition: **1 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**.

- `us-mobile-light-2026` — HOLD. Current Light pricing remains USD10/month or USD96/year. Native roaming requires prior domestic U.S. usage, and Warp/Dark Star Wi-Fi Calling setup requires U.S. coverage; a general China-first route is not established.
- `lycamobile-us-2026` — HOLD. Current official terms retain the 60-day non-use expiry. The old USD120/year minimum is withdrawn because current long-term pricing includes USD108/12 months, while exact minimum PAYG keep-alive economics remain unresolved. Current evidence places service on AT&T and preserves 2026 migration incidents without converting them into a failure-rate claim.
- `orange-sn-sama-numero-2026` — ADMIT-BACKSTAGE. Current Sama Numéro pricing is XOF3,000/6 months, XOF5,000/12 months and XOF10,000/24 months, payable from airtime or Orange Money; validity begins at subscription. Teeru tourist SIM/eSIM also explicitly supports extension through Sama Numéro.

Post-DB-C4C state: **98 canonical routes / 54 markets / 95 brands / 74 networks / 323 sources / 87 comparison-overlap route IDs / 48 comparison routes still legacy-only / 3 explicit indexable routes**. Full Phone checks preserve **135 comparison routes / 3 explicit indexable routes**.

Release: PR #311 (`a9bcc8a4628ab77a69f956cddbebc33800bcd84c`) merged after Eval Gate #961, CI #185 and Vercel Preview passed; production succeeded. Live checks confirmed the Phone hub and existing VOXI route at HTTP 200 and the non-indexable Orange Senegal route at HTTP 404.

DB-C4D completed the remaining bounded DB-C4 candidates.

## DB-C4D — completed 2026-09-29

The final three DB-C4 legacy-only candidates were independently reviewed and normalized through approved backstage packets. Final DB-C4D disposition: **2 ADMIT-BACKSTAGE / 1 HOLD / 0 REJECT**.

- `elisa-prepaid-fi-2026` — ADMIT-BACKSTAGE. Current Elisa material resolves the validity gap: 3 months from first activation, 12 months after every recharge, then a one-month expired receive/recharge window. Balance top-ups are EUR10-100. Elisa states Prepaid cannot be registered to the subscriber name/personal identity number and must be activated in Finland before use abroad.
- `cyta-soeasy-cy-2026` — ADMIT-BACKSTAGE. Current Cyta material establishes EUR5 as the lowest listed credit top-up granting 365 days, followed by 7 days incoming-only plus 15 days before cancellation. Current prepaid terms require identification; non-EU customers may use a passport, and remote top-up is available while abroad.
- `hotmobile-il-2026` — HOLD. Current Israeli recharge retailers consistently list a HOTALK 66 ILS pay-per-use balance load valid for 180 days, but a current HOT Mobile first-party number-deactivation/recycling rule was not located. The legacy blanket no-KYC claim is withdrawn as unverified.

Post-DB-C4D state: **101 canonical routes / 57 markets / 98 brands / 77 networks / 334 sources / 90 comparison-overlap route IDs / 45 comparison routes still legacy-only / 3 explicit indexable routes**. Full Phone data checks and the frontend build preserve **135 comparison routes / 3 explicit indexable routes**.

Release: PR #313 (`7c435d1ef0c897dbaf249f8caa2e098cbeb920ff`) merged after Eval Gate #965, CI #187 and Vercel Preview passed. Production verification confirmed the Phone hub and existing VOXI route at HTTP 200 and the non-indexable Elisa route at HTTP 404.

DB-C4 is complete. Continue DB-C5 through the bounded candidates in `docs/CURRENT_EXECUTION_QUEUE.md`.

## DB-C5 — completed 2026-09-30

The next three legacy-only routes were reviewed and normalized through approved backstage packets. Current DB-C5 disposition is **1 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**.

- `one-me-2026` — HOLD. Current One Montenegro material resolves a 90-day active window and EUR2 online top-up floor, but Tourist Package roaming is explicitly unavailable outside Montenegro. Preserve the cheap retention mechanic without presenting the tourist route as an overseas SMS/OTP option.
- `bhtelecom-ba-2026` — ADMIT-BACKSTAGE. Current BH Telecom Ultra material establishes the recharge-validity ladder, BAM20/180-day operating tier and a further 150-day retention/recovery window. Current webshop material supports foreign-issued cards and visitor eSIM products; China-specific OTP remains unverified.
- `yettel-prepaid-bg-2026` — HOLD. Current Yettel Bulgaria material resolves 365/395-day SIM-validity tiers and EUR4.09 online top-up, with incoming roaming SMS free. The documented digital prepaid-registration flow uses selfie plus ID-card capture; a current remote foreign-passport path was not established.

Delegated-agent lane was actually exercised through the running QwenPaw console rather than treating the Qwen host as the worker. QwenPaw task `task-4915eea85664` (QA Agent / DeepSeek) independently audited BH Telecom and returned ADMIT-BACKSTAGE, corroborating the lifecycle and adding that foreign-user prepaid eSIM purchase is explicitly supported while ordinary registration is not a hard purchase gate. Task `task-a71d7e8af5fd` (Default / Kimi K3) was dispatched for One Montenegro but ended `failed / Task cancelled`; no result was accepted. One Montenegro therefore remains based on the coordinator's independent provider-source review, and the delegated-worker failure is recorded explicitly rather than silently reverting to claimed multi-agent confirmation.

Post-DB-C5 state: **104 canonical routes / 60 markets / 101 brands / 80 networks / 346 sources / 93 comparison-overlap route IDs / 42 comparison routes still legacy-only / 3 explicit indexable routes**. `npm run phone:data:check` passed including DB-C5 migration coverage. The full frontend build passed and generated only the existing **3 route detail pages**; the comparison surface remains **135 routes** and publication/indexability remains unchanged.

Release: PR #315 squash-merged as `03370ed11c2922ea93454c9732868a97eeb211cb` after Eval Gate #969, CI #189 and Vercel Preview passed. Production verification confirmed the Phone hub and existing VOXI route at HTTP 200 and the non-indexable BH Telecom route at HTTP 404.

DB-C6 next bounded batch: `stc-sawa-sa-2026`, `claro-pre-ar-2026`, `skt-prepaid-kr-2026`. Keep the 3-route publication boundary unchanged and require reviewed provenance before canonical admission.

## DB-C6 — completed 2026-09-30

The bounded DB-C6 batch was reviewed, schema-validated and normalized through approved backstage packets. Final disposition: **1 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**.

- `stc-sawa-sa-2026` — HOLD. Current STC first-party pages conflict on 180 vs 360-day prepaid validity, and non-citizen ID expiry/final departure can trigger suspension/cancellation.
- `claro-pre-ar-2026` — ADMIT-BACKSTAGE. Current Claro evidence supports 180-day recharge validity plus a 60-day active grace period, passport tourist-SIM/foreigner eSIM paths and prepaid roaming. ARS2000 is recorded only as the lowest currently visible recharge tier, not a contractual minimum. Import validation caught and corrected the draft-only invalid enum `official-confirmed` to canonical `admitted`.
- `skt-prepaid-kr-2026` — HOLD. Current SKT material establishes KRW5000 = 30 days outgoing / 40 days incoming / 120 days number retention, passport onboarding with stay-expiry recharge constraints, and PPS as roaming-unavailable.

Post-DB-C6 state: **107 canonical routes / 63 markets / 104 brands / 83 networks / 360 sources / 96 comparison-overlap route IDs / 39 comparison routes still legacy-only / 3 explicit indexable routes**. `npm run phone:data:check` passed including dedicated DB-C6 migration coverage. The full frontend build passed and verified **135 comparison routes / 3 route detail pages / 0 market detail pages / 31 sitemap URLs**.

Release: PR #318 squash-merged as `04b116c6de2c09eb614a0fbf1990b355c73d7400` after Eval Gate #975, CI #191 and Vercel Preview passed. Production verification confirmed the Phone hub and existing VOXI route at HTTP 200 and non-indexable `claro-pre-ar-2026` at HTTP 404.

Delegated evidence remained bounded and coordinator-reviewed. Existing DB-C6 worker tasks `task-b8c31337863b` and `task-4f112e9f94f5` were reconciled before admission. One extra final Kimi recheck attempt failed because the current agent runtime had no active model configured; no result was accepted, and release proceeded only on direct schema/source review plus full automated checks.

DB-C7 next bounded batch: `ifmobile-jp-2026`, `rakuten-mobile-jp-2026`, `linemo-jp-2026`. Keep `sakura-mobile-voice-2026` excluded as the known same-product legacy-ID blocker for existing canonical `sakura-japan-voice-data`; do not inflate coverage by duplicating the product. Public/indexable route count remains 3 unless a separate publication decision passes the full gate.

## DB-C7 — completed 2026-09-30

The bounded DB-C7 Japan batch was independently reconciled, schema-validated and normalized through reviewed backstage packets. Final disposition: **0 ADMIT-BACKSTAGE / 3 HOLD / 0 REJECT**.

- `ifmobile-jp-2026` — HOLD. IF Mobile currently lists its 1GB voice SIM at JPY1,408/month, but the former uploaded-ID-image + face-image web KYC method ended on 2026-03-31. Current documented alternatives are JPKI, IC-chip reading + face verification, or in-store identity verification. Independent evidence shows overseas use of existing lines, but a current passport-only nonresident remote signup and mainland-China SMS path were not established strongly enough for admission.
- `rakuten-mobile-jp-2026` — HOLD. Rakuten SAIKYO currently starts at JPY1,078/month through 3GB and supports international services, but current foreign-national online identity verification requires Japanese residence identity/address documents. Rakuten instructs customers to complete Rakuten Link initial setup in Japan before travel, so this is not a clean overseas-first acquisition route.
- `linemo-jp-2026` — HOLD. LINEMO Best Plan currently starts at JPY990/month through 3GB and the current contract administration fee is JPY3,850. Foreign applicants use residence-card based KYC; World Support enables overseas SMS with free reception, but a newly issued number cannot enroll until the fifth billing month.

Post-DB-C7 state: **110 canonical routes / 63 markets / 107 brands / 84 networks / 372 sources / 99 comparison-overlap route IDs / 36 comparison routes still legacy-only / 3 explicit indexable routes**. `npm run phone:data:check`, `npm run verify` and the full frontend build passed. The frontend still produces **135 comparison routes / 3 route detail pages / 0 market detail pages / 31 sitemap URLs**.

Release: PR #320 squash-merged as `1efb329a35ecf4f8a47e3c95d0e7041013fd0923` after Eval Gate #979, CI #193 and Vercel Preview passed. Production verification confirmed the Phone hub and existing VOXI route at HTTP 200 and non-indexable `ifmobile-jp-2026` at HTTP 404.

Delegated evidence was exercised rather than claimed. Kimi task `task-e22548697159` independently returned HOLD for IF Mobile and highlighted conflicting post-April-2026 signup evidence. QA task `task-40c3bef1495c` remained running when release gates closed; no result was accepted, and Rakuten/LINEMO were admitted to canonical HOLD status only after direct current first-party reconciliation and full automated checks.

DB-C8 next bounded batch: `ahamo-jp-2026`, `iijmio-jp-2026`, `kt-prepaid-kr-2026`. Keep `sakura-mobile-voice-2026` excluded as the known same-product legacy-ID blocker for existing canonical `sakura-japan-voice-data`; do not duplicate it to raise overlap. Public/indexable route count remains 3 unless a separate publication decision passes the full gate.

## DB-C8 — completed 2026-10-01

The bounded DB-C8 Japan/Korea batch was independently reconciled, schema-validated and normalized through reviewed backstage packets. Final disposition: **0 ADMIT-BACKSTAGE / 3 HOLD / 0 REJECT**.

- `ahamo-jp-2026` — HOLD. Current 30GB pricing remains JPY2,970/month through 2026-11-30, while foreign-national online acquisition remains residence-card/address gated. Existing lines support overseas voice/SMS in more than 200 countries/regions, but China-specific OTP remains unverified. Official materials schedule a JPY3,135/40GB entry tier from 2026-12-01.
- `iijmio-jp-2026` — HOLD. Current 2GB voice pricing is JPY850/month; signup requires a Japanese address, supported identity document and subscriber-name credit card. Voice SIM/eSIM supports overseas voice/SMS but not overseas data, while overseas-card reliability and China-specific OTP remain unresolved.
- `kt-prepaid-kr-2026` — HOLD. Current KT evidence resolves the recharge ladder through KRW50,000/365 days, but passport-only/visitor service remains time-limited unless identity is reverified/extended in store. Welcome Prepaid explicitly excludes roaming, so it is not an overseas OTP-retention route.

Post-DB-C8 state: **113 canonical routes / 63 markets / 110 brands / 86 networks / 386 sources / 102 comparison-overlap route IDs / 33 comparison routes still legacy-only / 3 explicit indexable routes**. `npm run phone:data:check`, `npm run verify` and the full frontend build passed. The frontend still produces **135 comparison routes / 3 route detail pages / 0 market detail pages / 31 sitemap URLs**.

Release: PR #322 squash-merged as `bc3a090dee5ff892666d633c159a91651099ab5b` after Eval Gate #983, CI #195 and Vercel Preview passed. Production verification confirmed the Phone hub and existing VOXI route at HTTP 200 and non-indexable `ahamo-jp-2026` at HTTP 404.

Delegated evidence was exercised through QwenPaw's inter-agent path. Kimi task `task-d802cb1b57d4` completed and was reconciled; QA task `task-ef149eb596bf` failed on provider quota and contributed no accepted evidence. Initial headless task attempts failed because that execution path did not expose the configured active models, and no failed worker output was treated as evidence.

DB-C9 next bounded batch: `lguplus-prepaid-kr-2026`, `mts-by-2026`, `bakcell-cin-az-2026`. Keep `sakura-mobile-voice-2026` excluded as the known same-product legacy-ID blocker for existing canonical `sakura-japan-voice-data`; do not duplicate it to inflate overlap. Public/indexable route count remains 3 unless a separate publication decision passes the full gate.

## DB-C9 — completed 2026-10-01

The bounded DB-C9 Korea/Belarus/Azerbaijan batch was independently reconciled, schema-validated and normalized through reviewed backstage packets. Final disposition: **0 ADMIT-BACKSTAGE / 3 HOLD / 0 REJECT**.

- `lguplus-prepaid-kr-2026` — HOLD. The legacy label does not map cleanly to one current product: LG U+ directly documents a short-stay visitor SIM, while U+ UMobile separately documents LG U+ network MVNO prepaid service and lists roaming unavailable. The identity mismatch is preserved instead of combining products.
- `mts-by-2026` — HOLD. Current MTS Belarus evidence resolves number withdrawal after 60 days without top-up following forced blocking or 180 days with positive balance but no operations. The foreign-guest tariff explicitly disables Roaming and SMS Roaming, blocking the overseas OTP use case.
- `bakcell-cin-az-2026` — HOLD. Current Bakcell material documents CIN 1 existing-line economics and short extension mechanics, but CIN 1 is archived and a current new-acquisition path is not established. Historical closure timing is retained only as dated corroboration.

Post-DB-C9 state: **116 canonical routes / 65 markets / 113 brands / 89 networks / 400 sources / 105 comparison-overlap route IDs / 30 comparison routes still legacy-only / 3 explicit indexable routes**. Full Phone checks and frontend build preserve **135 comparison routes / 3 route detail pages / 0 market detail pages / 31 sitemap URLs**.

Release: PR #324 squash-merged as `ac742c7398053a057a9b0e06d2ffcab717d28146` after Eval Gate #987, CI #197 and Vercel Preview passed. Production verification confirmed the Phone hub and VOXI detail at HTTP 200, `lguplus-prepaid-kr-2026` at HTTP 404, and 31 sitemap URLs.

Delegated research was exercised but not trusted automatically. QwenPaw/Kimi task `task-24b1c44a3cc4` produced useful candidate evidence before a terminal model-execution failure; the coordinator independently reverified accepted facts. No enabled ACP runner was available for the requested qwen-code second pass, and Tavily returned 403.

DB-C10 next bounded batch: `starhub-prepaid-sg-2026`, `jazz-pk-2026`, `vodafone-eg-2026`. Keep `sakura-mobile-voice-2026` excluded as the known same-product alias blocker for existing canonical `sakura-japan-voice-data`; public/indexable route count remains 3 unless a separate publication decision passes the full gate.
