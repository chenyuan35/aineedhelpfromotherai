from pathlib import Path

# PROJECT_CONTEXT
p = Path('PROJECT_CONTEXT.md')
s = p.read_text()
s = s.replace('Last updated: 2026-09-30', 'Last updated: 2026-10-01', 1)
s = s.replace(
    '| Phone Radar | **ACTIVE PRIMARY GROWTH PRODUCT / GLOBAL FINDER RELEASED.** PR #291 (`3b0ec6e03c078bd0121b378b4d535aa2adda81ff`) shipped the 135-route global progressive finder. DB-C7 has now expanded only the backstage normalized database to 110 routes; the public comparison surface remains 135 routes and route indexability remains 3. | Keep the released frontend stable while backend evidence/database coverage continues independently; publication still requires a separate gate. |',
    '| Phone Radar | **ACTIVE PRIMARY GROWTH PRODUCT / GLOBAL FINDER RELEASED.** PR #291 (`3b0ec6e03c078bd0121b378b4d535aa2adda81ff`) shipped the 135-route global progressive finder. DB-C8 has now expanded only the backstage normalized database to 113 routes; the public comparison surface remains 135 routes and route indexability remains 3. | Keep the released frontend stable while backend evidence/database coverage continues independently; publication still requires a separate gate. |'
)
s = s.replace(
    '| Phone data / publication foundation | **135-ROUTE COMPARISON / 110-ROUTE CANONICAL / 3 INDEXABLE.** DB-C7 released in PR #320 (`1efb329a35ecf4f8a47e3c95d0e7041013fd0923`): IF Mobile, Rakuten Mobile and LINEMO are all HOLD after current Japan identity/roaming reconciliation. Canonical `data/phone/v1` is 110 routes / 63 markets / 107 brands / 84 networks / 372 sources; 99 route IDs overlap the 135-route comparison set and 36 remain legacy-only. Eval Gate #979, CI #193 and Vercel Preview passed; production preserved hub/VOXI HTTP 200 and IF Mobile non-indexable HTTP 404. | Start bounded DB-C8 with `ahamo-jp-2026`, `iijmio-jp-2026`, and `kt-prepaid-kr-2026`; keep `sakura-mobile-voice-2026` excluded as the known same-product legacy-ID blocker, preserve the 3-route indexability allowlist, and use reviewed provenance/QC before canonical admission. |',
    '| Phone data / publication foundation | **135-ROUTE COMPARISON / 113-ROUTE CANONICAL / 3 INDEXABLE.** DB-C8 released in PR #322 (`bc3a090dee5ff892666d633c159a91651099ab5b`): ahamo, IIJmio and KT Prepaid are all HOLD after current pricing/KYC/roaming reconciliation. Canonical `data/phone/v1` is 113 routes / 63 markets / 110 brands / 86 networks / 386 sources; 102 route IDs overlap the 135-route comparison set and 33 remain legacy-only. Eval Gate #983, CI #195 and Vercel Preview passed; production preserved hub/VOXI HTTP 200 and ahamo non-indexable HTTP 404. | Start bounded DB-C9 with `lguplus-prepaid-kr-2026`, `mts-by-2026`, and `bakcell-cin-az-2026`; keep `sakura-mobile-voice-2026` excluded as the known same-product legacy-ID blocker, preserve the 3-route indexability allowlist, and use reviewed provenance/QC before canonical admission. |'
)
s = s.replace(
    '**Next independent session: backend database coverage DB-C4.** Continue from the remaining 48 legacy-only comparison routes in `docs/CURRENT_EXECUTION_QUEUE.md`; keep this as backstage normalization/evidence work. Any indexability change still requires the full SEO publication gate and a separate reviewed decision.',
    '**Next independent session: backend database coverage DB-C9.** Process `lguplus-prepaid-kr-2026`, `mts-by-2026`, and `bakcell-cin-az-2026` from the remaining 33 legacy-only comparison routes; keep Sakura excluded as the known same-product alias blocker and keep this as backstage normalization/evidence work. Any indexability change still requires the full SEO publication gate and a separate reviewed decision.'
)
p.write_text(s)

# MASTER_PLAN
p = Path('docs/MASTER_PLAN.md')
s = p.read_text()
s = s.replace('Last updated: 2026-09-30', 'Last updated: 2026-10-01', 1)
s = s.replace(
    'The UK matrix was the first public baseline, and backstage evidence acquisition continues independently of Search Console. After the global data expansion, PR #261 separates broad database coverage from public/indexable page coverage so the database can grow without recreating programmatic SEO families. PR #263 separately makes legacy comparison-database admission explicit: wildcard batch discovery is gone, existing admitted legacy batches are named in a reviewed manifest, and unlisted delegated research stays outside comparison inputs. The Sep 28 compatibility audit found canonical v1 at 15 routes with only four route-ID overlaps; staged reviewed migrations plus backend coverage through DB-C7 have since raised canonical v1 to 110 routes / 63 markets / 107 brands / 84 networks / 372 sources with 99 route-ID overlaps. Thirty-six comparison routes remain legacy-only; the 135-route comparison surface and 3-route explicit publication boundary remain unchanged.',
    'The UK matrix was the first public baseline, and backstage evidence acquisition continues independently of Search Console. After the global data expansion, PR #261 separates broad database coverage from public/indexable page coverage so the database can grow without recreating programmatic SEO families. PR #263 separately makes legacy comparison-database admission explicit: wildcard batch discovery is gone, existing admitted legacy batches are named in a reviewed manifest, and unlisted delegated research stays outside comparison inputs. The Sep 28 compatibility audit found canonical v1 at 15 routes with only four route-ID overlaps; staged reviewed migrations plus backend coverage through DB-C8 have since raised canonical v1 to 113 routes / 63 markets / 110 brands / 86 networks / 386 sources with 102 route-ID overlaps. Thirty-three comparison routes remain legacy-only; the 135-route comparison surface and 3-route explicit publication boundary remain unchanged.'
)
needle = '42. **DONE — backend database coverage through DB-C7.** DB-C4 through DB-C6 remain released as documented. DB-C7 reviewed IF Mobile (HOLD: JPY1,408/month current pricing but post-2026-03-31 nonresident remote KYC unresolved), Rakuten Mobile SAIKYO (HOLD: JPY1,078/month current floor but Japanese-resident identity/address path plus Japan-side Rakuten Link setup), and LINEMO Best Plan (HOLD: JPY990/month + JPY3,850 contract fee, residence-card KYC and fifth-billing-month wait for new-number World Support enrollment). PR #320 squash-merged as `1efb329a35ecf4f8a47e3c95d0e7041013fd0923` after Eval Gate #979, CI #193 and Vercel Preview passed; production preserved hub/VOXI 200 and IF Mobile non-indexable 404. Canonical coverage is now 110 routes / 63 markets / 107 brands / 84 networks / 372 sources, with 99 comparison↔canonical route-ID overlaps and 36 comparison routes still legacy-only. Next bounded DB-C8 batch is `ahamo-jp-2026`, `iijmio-jp-2026`, `kt-prepaid-kr-2026`; preserve provenance, uncertainty and the independent publication gate, and keep the Sakura same-product alias blocker excluded.'
assert needle in s
addition = needle + '\n43. **DONE — backend database coverage DB-C8.** `ahamo-jp-2026`, `iijmio-jp-2026`, and `kt-prepaid-kr-2026` were normalized as backstage HOLD routes after current first-party reconciliation: ahamo remains resident-document/address gated and has a scheduled 2026-12-01 tariff change; IIJmio remains Japan-address/identity/payment gated despite low JPY850/month voice pricing and overseas voice/SMS support; KT Prepaid has a verified KRW50,000/365-day recharge tier but passport/visitor duration constraints and no roaming. PR #322 squash-merged as `bc3a090dee5ff892666d633c159a91651099ab5b` after Eval Gate #983, CI #195 and Vercel Preview passed; production preserved hub/VOXI 200 and ahamo non-indexable 404. Canonical coverage is now 113 routes / 63 markets / 110 brands / 86 networks / 386 sources, with 102 comparison↔canonical route-ID overlaps and 33 comparison routes still legacy-only. Next bounded DB-C9 batch is `lguplus-prepaid-kr-2026`, `mts-by-2026`, `bakcell-cin-az-2026`; keep the Sakura same-product alias blocker excluded and preserve the 3-route publication boundary.'
s = s.replace(needle, addition)
p.write_text(s)

# CURRENT_EXECUTION_QUEUE
p = Path('docs/CURRENT_EXECUTION_QUEUE.md')
s = p.read_text()
s = s.replace('Last updated: 2026-09-30', 'Last updated: 2026-10-01', 1)
s = s.replace(
    '3. DB-C7 is released with **135 comparison routes / 110 canonical normalized routes / 99 comparison↔canonical route-ID overlaps / 36 comparison routes still legacy-only / 3 indexable routes**; production publication boundaries are verified.',
    '3. DB-C8 is released with **135 comparison routes / 113 canonical normalized routes / 102 comparison↔canonical route-ID overlaps / 33 comparison routes still legacy-only / 3 indexable routes**; production publication boundaries are verified.'
)
start = s.index('## NEXT — Backend database coverage DB-C8')
end = s.index('## PARALLEL — Community-discovered data eSIM signal intake')
block = '''## JUST COMPLETED — Backend database coverage DB-C8

DB-C8 is merged and production-verified. Final disposition: **0 ADMIT-BACKSTAGE / 3 HOLD / 0 REJECT**.

- `ahamo-jp-2026` — **HOLD**: current ahamo is JPY2,970/month for 30GB through 2026-11-30, with no application fee. Foreign-national onboarding remains residence-card/address gated; existing lines support overseas voice/SMS in more than 200 countries/regions, but mainland-China OTP is unverified. Official materials schedule a new JPY3,135/40GB entry tier from 2026-12-01.
- `iijmio-jp-2026` — **HOLD**: current 2GB voice service is JPY850/month. New voice/SMS signup requires a Japanese current address, compatible identity document and subscriber-name credit card; overseas-issued cards may fail. Voice SIM/eSIM supports overseas voice and SMS but not overseas data.
- `kt-prepaid-kr-2026` — **HOLD**: KT now exposes an exact prepaid recharge ladder up to KRW50,000/365 days, but passport-only/visitor service is short-term/90-day constrained unless identity is reverified/extended in-store. Welcome Prepaid explicitly provides no roaming, so it is not an overseas SMS/OTP route.

Released state: **113 routes / 63 markets / 110 brands / 86 networks / 386 sources / 102 comparison overlaps / 33 legacy-only / 3 indexable**. `npm run phone:data:check`, `npm run verify` and the full frontend build passed; the build still emits only the existing 3 route detail pages and 31 sitemap URLs. PR #322 squash-merged as `bc3a090dee5ff892666d633c159a91651099ab5b`; Eval Gate #983, CI #195 and Vercel Preview passed. Production verification: Phone hub 200, existing VOXI route 200, non-indexable `ahamo-jp-2026` route 404.

Kimi worker task `task-d802cb1b57d4` completed and was coordinator-reconciled. QA task `task-ef149eb596bf` failed on provider quota and contributed no accepted evidence. The initial headless QwenPaw task path also failed because it did not expose the configured active models; the working inter-agent background path was used instead.

## NEXT — Backend database coverage DB-C9

Bounded batch: `lguplus-prepaid-kr-2026`, `mts-by-2026`, `bakcell-cin-az-2026`. Reverify current product identity, lifecycle/keep economics, foreign-user KYC/acquisition path, overseas SMS/OTP/roaming behavior and payment constraints before admission. `sakura-mobile-voice-2026` remains excluded as the known same-product alias blocker for existing canonical `sakura-japan-voice-data`. Use delegated workers where useful, but raw output remains `RESEARCH_CANDIDATE` until coordinator reconciliation. No public/indexability change.

'''
s = s[:start] + block + s[end:]
s = s.replace('do not bulk-admit the remaining 36 legacy-only routes without provenance + QC;', 'do not bulk-admit the remaining 33 legacy-only routes without provenance + QC;')
s = s.replace(
    'QwenPaw/Kimi are high-throughput backstage research/data workers. Raw output remains `RESEARCH_CANDIDATE` until reviewed. They do not control publication, roadmap, merge or deployment. DB-C5 used real console delegation: BH Telecom task `task-4915eea85664` completed and was reconciled; One Montenegro task `task-a71d7e8af5fd` ended `failed / Task cancelled`; no delegated result was accepted, and the failure is an explicit worker blocker rather than hidden single-agent fallback.',
    'QwenPaw/Kimi are high-throughput backstage research/data workers. Raw output remains `RESEARCH_CANDIDATE` until reviewed. They do not control publication, roadmap, merge or deployment. DB-C8 used the live inter-agent background path: Kimi task `task-d802cb1b57d4` completed and was reconciled; QA task `task-ef149eb596bf` failed on provider quota and contributed no accepted evidence. Earlier headless task attempts failed because that path did not expose the configured active models, so worker availability must be verified through the inter-agent path rather than assumed.'
)
p.write_text(s)

# COVERAGE EXECUTION
p = Path('docs/PHONE_DATABASE_COVERAGE_EXECUTION_2026-09-29.md')
s = p.read_text().rstrip()
assert '## DB-C8 — completed 2026-10-01' not in s
s += '''

## DB-C8 — completed 2026-10-01

The bounded DB-C8 Japan/Korea batch was independently reconciled, schema-validated and normalized through reviewed backstage packets. Final disposition: **0 ADMIT-BACKSTAGE / 3 HOLD / 0 REJECT**.

- `ahamo-jp-2026` — HOLD. Current 30GB pricing remains JPY2,970/month through 2026-11-30, while foreign-national online acquisition remains residence-card/address gated. Existing lines support overseas voice/SMS in more than 200 countries/regions, but China-specific OTP remains unverified. Official materials schedule a JPY3,135/40GB entry tier from 2026-12-01.
- `iijmio-jp-2026` — HOLD. Current 2GB voice pricing is JPY850/month; signup requires a Japanese address, supported identity document and subscriber-name credit card. Voice SIM/eSIM supports overseas voice/SMS but not overseas data, while overseas-card reliability and China-specific OTP remain unresolved.
- `kt-prepaid-kr-2026` — HOLD. Current KT evidence resolves the recharge ladder through KRW50,000/365 days, but passport-only/visitor service remains time-limited unless identity is reverified/extended in store. Welcome Prepaid explicitly excludes roaming, so it is not an overseas OTP-retention route.

Post-DB-C8 state: **113 canonical routes / 63 markets / 110 brands / 86 networks / 386 sources / 102 comparison-overlap route IDs / 33 comparison routes still legacy-only / 3 explicit indexable routes**. `npm run phone:data:check`, `npm run verify` and the full frontend build passed. The frontend still produces **135 comparison routes / 3 route detail pages / 0 market detail pages / 31 sitemap URLs**.

Release: PR #322 squash-merged as `bc3a090dee5ff892666d633c159a91651099ab5b` after Eval Gate #983, CI #195 and Vercel Preview passed. Production verification confirmed the Phone hub and existing VOXI route at HTTP 200 and non-indexable `ahamo-jp-2026` at HTTP 404.

Delegated evidence was exercised through QwenPaw's inter-agent path. Kimi task `task-d802cb1b57d4` completed and was reconciled; QA task `task-ef149eb596bf` failed on provider quota and contributed no accepted evidence. Initial headless task attempts failed because that execution path did not expose the configured active models, and no failed worker output was treated as evidence.

DB-C9 next bounded batch: `lguplus-prepaid-kr-2026`, `mts-by-2026`, `bakcell-cin-az-2026`. Keep `sakura-mobile-voice-2026` excluded as the known same-product legacy-ID blocker for existing canonical `sakura-japan-voice-data`; do not duplicate it to inflate overlap. Public/indexable route count remains 3 unless a separate publication decision passes the full gate.
'''
p.write_text(s + '\n')
