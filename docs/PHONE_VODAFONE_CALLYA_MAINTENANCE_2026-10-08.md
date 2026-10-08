# Vodafone CallYa Classic 2026 — provider rule and route-evidence maintenance

Checked: 2026-10-08. Scope: existing `vodafone-callya-90d-2026` only, HOLD / backstage-only / real-mobile. Historical September review packet and 135-route legacy comparison stay immutable; no new SEO URL, recommendation/rank promotion, invented app OTP success or universal cheapest yearly retention fee.

## Economics and number lifecycle

Vodafone [current CallYa Classic tariff](https://www.vodafone.de/freikarten/callya-classic/) lists **EUR0 basic fee**, free physical SIM and shipping, a new prepaid eSIM at no extra fee, and **EUR0.09 per domestic minute/SMS** plus EUR0.03 per domestic MB. These domestic usage rates are **not** proof of the cheapest China-roaming retention action.

Vodafone [CallYa help](https://www.vodafone.de/hilfe/prepaid.html) says the tariff is **indefinite in principle** but the provider **may** terminate after *more than 90 days without use*. The customer receives an SMS warning, then **four weeks to object** following that message, before block; remaining credit may be refunded. This is a discretionary inactivity/objection trigger, **not** a contract that mandates EUR5 top-ups every 90 days or EUR20 per year. The prior `keep.yearCostOriginal=20` and CNY estimate were unsupported and are now **null**, as is `observedActionCost` for a *proven* retention action. The `intervalDays=90` field records the provider's potential warning risk, not a guaranteed minimum service period or spend cadence. Free incoming SMS is not proved to reset usage status. The minimum online recharge amount is not verified as a compulsory action.

## Foreign identity, acquisition, eSIM and payment

[Official CallYa registration](https://www.vodafone.de/freikarten/callya-selbstregistrierung/) requests identity data, German prepaid KYC and accepted passport/ID verification by Video-Ident/Auto-ID, eID or Postident; official [CallYa travel eSIM instructions](https://www.vodafone.de/freikarten/travel-germany-esim/) support order and ID steps before arrival but describe balance activation when arriving in Germany. The [July 15, 2026 independent traveller report](https://www.reddit.com/r/NoContract/comments/1uxlzsa/review_of_vodafonede_callya_esim/) supports one successful US pre-arrival **CallYa M**, German hotel address and passport Video-Ident, and mentions EU-bank-only autopay. It is **not** a verified CallYa Classic/China-first outcome and cannot override identity-provider, SIM activation or foreign-card uncertainty.

The [March 18, 2026 independent CallYa Classic billing question](https://www.reddit.com/r/germany/comments/1rx6chv/vodafone_callya_prepaid_classic_charge_amounts/) reports one unexplained small-charge discrepancy; no resolved invoice or evidence of general faulty billing is available. It remains a bounded operational report, not a number-loss statistic.

## Roaming SMS and China

Vodafone [InfoDok 397 CallYa Roaming](https://www.vodafone.de/infofaxe/397.pdf), 2026 current copy, lists **China in zone 3** and **standard incoming SMS free while roaming across all zones**, where a roaming network actually attaches. Outgoing SMS, paid roaming use, regular line continuity and service-specific bank/app OTP are distinct jobs. **No named-bank/app China OTP success sample is established**, so no app compatibility rate and no proven China keep-number fee are generated.

## Database/release contract

Six new reviewed source records and seven route events, zero exact app/service observations. Route source depth **2 → 8**, current normalized source corpus **878 → 884** with **160 routes / 87 markets / 157 brands / 117 networks**. One new 2026-10-08 current-profile snapshot is appended, preserving the original September profile for immutable historical comparison parity. Current search index, summary, metrics, lazy detail and whole data bundle are regenerated in the branch.

Regression: `scripts/test-phone-vodafone-callya-maintenance.mjs` is wired into `npm run phone:data:check`. Require actual GitHub CI, Eval Gate, latest-head preview, merge and verified exact-SHA production before recording release as COMPLETE. Until then this ledger describes a reviewed proposed change, not a production release. Next independent task after successful release is Wave C legacy current-profile reconciliation based on the active execution queue; do not broaden the public URL set.
