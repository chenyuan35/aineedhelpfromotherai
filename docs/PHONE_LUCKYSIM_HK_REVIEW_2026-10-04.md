# LuckySIM Hong Kong residual-candidate review — 2026-10-04

Status: **LIFECYCLE BLOCKER CLEARED / BACKSTAGE HOLD ADMISSION APPROVED**

Scope: reconcile the remaining LuckySIM Hong Kong lifecycle/renewal blocker and decide whether the route belongs in Phone canonical. This does not authorize a standalone public URL, sitemap entry, recommendation ranking, or OTP guarantee.

## Current evidence

- LuckySIM's official 3-year Hong Kong plan currently costs HK$138, is valid for 1,095 days, assigns/keeps a Hong Kong mobile number, supports physical SIM and eSIM, Hong Kong voice, SMS and VoLTE, and requires real-name registration before use.
- LuckySIM's official top-up catalog explicitly defines number-expiry extensions: HK$50 extends 180 days, HK$100 extends 365 days, and HK$200 extends 540 days. The provider terms state expiry is counted from the date of purchase or top-up.
- The cheapest simple current post-term retention rule is therefore HK$100 for 365 days. HK$50/180 days is slightly more expensive on an annualized cadence, and HK$200/540 days is also more expensive per year.
- OFCA currently lists LuckySIM under Amoeba Limited with the provider's real-name-registration channel.
- A dated 2026-08-14 independent FlyAsia field report reproduces the low-cost long-term number-retention use case, CSL 4G in Hong Kong, online renewal, successful overseas activation and free incoming SMS in the UK. The same article records that phone-service validity resets from the top-up/renewal date rather than stacking.
- A 2026-09-04 Reddit discussion includes a user reporting ordinary non-bank SMS as reliable in Hong Kong/mainland China, while bank-SMS reliability was not established. This is useful operational evidence but is not enough for a bank/OTP guarantee.

## Classification

- route family: `long-term`
- number class: `real-mobile`
- market: Hong Kong
- host network: `csl-hk` based on current independent operational evidence and existing staging classification
- form: physical + eSIM
- surface state: `backstage-only`
- evidence state: `hold`

The route is distinct from the earlier seller-specific Luky2/LuckySIM roaming-data SKU. Canonical admission is based on LuckySIM's current native Hong Kong-number prepaid product, not on the stale SIM Panda SKU mapping.

## HOLD reason

The lifecycle blocker is cleared, but recommendation status is not. Keep HOLD because mainland-China and bank/third-party OTP reliability remains too thin for a confident claim, overseas network attachment can require manual selection, and current provider evidence does not guarantee service-specific verification outcomes.

## Admission economics

- observed current acquisition: HK$138 for the 1,095-day Hong Kong 30GB + 2,000 local-minutes plan;
- initial annualized acquisition equivalent: HK$46/year across the included 3-year validity;
- verified ongoing keep action: HK$100 top-up for 365 days;
- ongoing annual keep cost: HK$100/year under the current official top-up ladder.

## Publication boundary

Admit only to canonical backend/finder as HOLD. Do not create a LuckySIM route page, publication-policy entry, sitemap URL, shortcut ranking, or OTP success percentage.
