# Phone Radar — QwenPaw / Kimi K3 evidence batch review — 2026-09-29

Status: **BOUNDED BACKSTAGE REVIEW COMPLETE / NO PUBLICATION CHANGE**

Scope: independent sample-audit of three candidates from the completed QwenPaw/Kimi K3 Phone research batch. Raw delegated findings remain research candidates unless explicitly admitted below.

This review does not authorize a new canonical migration cohort, a new indexable URL, a sitemap change, ranking changes, or publication changes.

## Dispositions

### 1. ClubSIM HK — ADMIT-BACKSTAGE EVIDENCE CORRECTION

Existing route: `clubsim-sms-pack-6hkd-2026`.

The 365-day number-retention rule remains supported: ClubSIM says the number can be kept if a Service Pack is purchased within 365 days after the previous pack expires.

However, the current backstage snapshot claim that the official web surface still lists a standalone HK$6 SMS pack is stale as of 2026-09-29:

- the current ClubSIM `smspack/tnc` URL resolves but no longer exposes the HK$6 pack content;
- current ClubSIM public pack surfaces expose other products, including Asia roaming from HK$15 and local/data/voice packs at higher prices;
- a 2026-07-02 LINUX DO thread reports that the HK$6 SMS pack could no longer be ordered and that HK$15 was then the cheapest visible alternative;
- one reply in the same thread claims a 7-Eleven HK$6 variant may still exist, so the exact cheapest currently purchasable Service Pack is unresolved rather than proven to be HK$15 everywhere.

Decision: preserve the route and the 365-day lifecycle rule, but **do not treat HK$6/year as a current guaranteed keep cost**. Before any future public refresh or normalized price claim, re-check the actual account/app purchase list or obtain current first-hand checkout evidence.

Sources checked 2026-09-29:
- https://www.clubsim.com.hk/en/smspack/tnc
- https://www.clubsim.com.hk/clsweb
- https://clubsim.com.hk/FAQ_en.html
- https://www.clubsim.com.hk/TNC_en.html
- https://linux.do/t/topic/2511282

### 2. Optus AU — ADMIT-BACKSTAGE EVIDENCE CORRECTION

Legacy route: `optus-flex-plus-au-2026`.

The current legacy directory summary is materially wrong: it states `Flex Plus: $59/186d or $180/365d expiry tiers`. The current Optus page instead shows:

- AUD 180 for 186 days before the announced 2026-09-30 change;
- AUD 350 standard price for 365 days, with a temporary new-service sale price of AUD 199 ending 2026-09-29;
- from 2026-09-30, Optus states that these standard long-expiry prices increase to AUD 200 / 186 days and AUD 395 / 365 days.

Finder and Canstar independently report the same scheduled 2026-09-30 long-expiry standard prices. The AUD 59 figure belongs to a 28-day tier, not 186 days.

Decision: **ADMIT-BACKSTAGE correction evidence**. Do not carry the existing `$59/186d` or `$180/365d` summary into any future canonical migration or refreshed public copy. Because the new prices take effect on 2026-09-30, verify the live Optus page after the effective date before marking the post-change price as current rather than scheduled.

Sources checked 2026-09-29:
- https://www.optus.com.au/prepaid
- https://www.optus.com.au/prepaid/sim-plans/40
- https://www.finder.com.au/news/optus-raising-prepaid-mobile-plan-prices-2026
- https://www.canstar.com.au/news/optus-prepaid-price-rise-2026/

### 3. Ultra Mobile PayGo US — HOLD CHANNEL-RISK INFERENCE

Existing route: `ultra-mobile-paygo-3-2026`.

Fresh 2026 community evidence supports an acquisition/payment-channel risk signal, but not a route-wide product-failure conclusion:

- one March 2026 V2EX report describes a JD.com-acquired, seller-activated Ultra PayGo card losing service after roughly half a month;
- a separate March 2026 thread reports a newly purchased purple PayGo card being blocked, with another participant reporting the same experience;
- a July 2026 thread reports stricter risk controls and an account becoming unusable after payment with a virtual card;
- counter-evidence exists: a February 2026 seller reported holding an Ultra PayGo line for three years, and the current canonical route already directs acquisition through Ultra's official listed channels rather than JD.com/reseller activation.

Decision: **HOLD**. Record this only as a candidate warning about unsupported reseller activation/payment paths. Do not label Ultra PayGo itself unstable or assign a general ban probability without evidence that separates official-channel/self-managed accounts from reseller-activated or unusual-payment accounts.

Sources checked 2026-09-29:
- https://www.v2ex.com/t/1199613
- https://www.v2ex.com/t/1200052
- https://fast.v2ex.com/t/1225952
- https://www.v2ex.com/t/1193836
- https://www.ultramobile.com/paygo/

## Batch conclusion

The selected three-route sample is fully dispositioned:

- ClubSIM: `ADMIT-BACKSTAGE` correction — preserve 365-day lifecycle, withdraw unconditional HK$6/year inference.
- Optus: `ADMIT-BACKSTAGE` correction — legacy long-expiry prices are stale/mis-mapped; post-2026-09-30 prices require effective-date verification.
- Ultra Mobile PayGo: `HOLD` — channel-specific risk signal only; no route-wide instability inference.

No public/indexability state changed in this review.

## Delegated lane status

The QwenPaw/Kimi K3 research task completed successfully and produced 13 research candidates. This review sampled the three highest-impact conflict/correction candidates. Remaining raw findings are not admitted by this document and should only be revisited in later bounded evidence rounds if they remain higher value than the existing shortlist/fallback work.

## Next bounded action

After this review is merged, keep the public finder stable. The next evidence round should either:

1. verify the Optus post-change live prices on/after 2026-09-30 if the route is being touched; or
2. otherwise continue with the already identified legacy-only shortlist, with Telia Estonia as the current fallback candidate.

Do not manufacture batch-L and do not use this batch as authorization for canonical bulk migration.