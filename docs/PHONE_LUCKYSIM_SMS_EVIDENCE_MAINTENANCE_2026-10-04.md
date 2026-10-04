# LuckySIM Hong Kong — service-specific SMS evidence maintenance — 2026-10-04

Status: **HOLD PRESERVED / BANKING-CODE EVIDENCE ADDED / NO PUBLICATION CHANGE**

## Decision

Keep `luckysim-hk-prepaid-2026` as `backstage-only` / `hold`.

The evidence set now contains one independent user report of continued Hong Kong SMS reception for banking codes while in Australia. This is stronger than generic ordinary-SMS evidence, but the bank is not identified and it remains a single-user outcome.

A separate April 2026 LuckySIM user reports an intermittent failure mode: weeks without receiving Hong Kong SMS until LuckySIM customer service restarted the connection. The same thread contains another LuckySIM user who did not reproduce missed SMS but sometimes could not attach to a network in mainland China even after manual network selection.

Together these reports strengthen the product value of keeping service/outcome history, but they do not justify a universal OTP claim, success percentage, recommendation-state promotion, standalone route URL, or sitemap entry.

## Evidence added

- `https://www.reddit.com/r/HongKong/comments/1o938ay/new_in_hong_kong_for_a_1year_postdoc_sim_card_and/` — 2025-10-18 first-hand report: used LuckySIM in Hong Kong and continued receiving Hong Kong SMS for banking codes while in Australia. Bank/provider unspecified.
- `https://www.reddit.com/r/HongKong/comments/1t01lz1/esim_for_overseas_hker/` — 2026-04-30 first-hand LuckySIM report: multi-week incoming-HK-SMS failure resolved by customer-service connection restart; same thread also records separate mainland-China network-attachment instability.

## Canonical effect

- 2 append-only independent-community sources added.
- 2 route observations added: one banking-code success in Australia and one intermittent incoming-SMS failure overseas.
- 1 reconciliation event and a refreshed current-profile snapshot added.
- route remains `real-mobile` / `long-term` / `backstage-only` / `hold`.
- canonical route/market/brand/network counts remain 159 / 87 / 156 / 117; source corpus becomes 618.
- public boundary remains 135 comparison / 3 indexable / 31 sitemap URLs.

## Release verification

- PR #386 squash-merged as `b0e90c7e28bf8acd7f070db73e52f895491ffdad`.
- Eval Gate #1152: PASS; Vercel Preview: SUCCESS.
- Production deployment `dpl_84ijfJGy15suPktfKxJqYspvEVBt` reached `READY` for the merge SHA.
- Live custom-domain `phone-route-data/luckysim-hk-prepaid-2026.json` returned HTTP 200 and contains both new observations plus the refreshed HOLD snapshot.
- No route, ranking, publication-policy, standalone URL or sitemap boundary changed.
