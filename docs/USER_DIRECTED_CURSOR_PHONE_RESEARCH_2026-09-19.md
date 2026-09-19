# User-directed Cursor + Phone research — 2026-09-19

Status: research queue only. No production change is authorized by this document.

## Task A — Phone Radar source expansion from SIM Panda

Goal: treat SIM Panda as a lead/source inventory, not as an authority. For every current product, build a verified route record covering what the user needs to choose and operate the route.

Required fields per product:
- exact product/SKU and current stock/price;
- route family: long-term SMS/OTP, data SIM/eSIM, or non-route service;
- number country/operator and physical SIM/eSIM;
- prerequisites/KYC/real-name requirements;
- activation steps;
- roaming setup and supported regions;
- incoming SMS/call/data behavior;
- current keep-alive/renewal rule and minimum realistic annual cost;
- recovery/reissue/expiry behavior;
- current purchase/top-up path;
- realistic use cases and explicit non-use cases;
- recent independent community evidence for operational claims;
- official/operator source for commercial/rule claims where available;
- confidence/freshness status.

Current SIM Panda inventory discovered on 2026-09-19:

| Item | Seller state observed | Initial classification | Research disposition |
|---|---|---|---|
| Giffgaff SIM | CNY 16, in stock | Long-term SMS/OTP | Existing Phone route; reconcile seller tutorial with official/current community evidence rather than create a duplicate route. |
| Haha SIM | CNY 65, low stock | Long-term SMS/OTP + regional data | Candidate. Verify operator identity, annual HKD 10 retention claim, roaming/SMS behavior and real-name rules. |
| Ultra Mobile $3 Purple SIM | CNY 233, in stock | Long-term SMS/OTP | Existing Phone route family; verify current $3 plan, activation availability, Wi-Fi Calling and roaming costs before changing existing route data. |
| Rakuten Mobile Japan | CNY 298, eSIM/physical variants | Long-term SMS/OTP + data | Candidate. Seller says 070 number, receive-SMS only, no voice/outgoing SMS, annual renewal; all require independent verification. |
| One NZ physical SIM | CNY 99, in stock | Long-term SMS/OTP | Candidate. Verify NZD 10/12-month retention, roaming SMS, current top-up rules and recovery window. |
| Skinny New Zealand physical SIM | CNY 99, sold out | Long-term SMS/OTP | Candidate/watch. Verify NZD 5/12-month retention, recovery window, roaming SMS and current stock separately. |
| Giffgaff GBP 10 top-up voucher | CNY 103.80, in stock | Service/accessory | Not a separate route. May become a purchase/top-up option inside the existing Giffgaff guide if independently useful. |
| Luky2 SIM | CNY 150, in stock | Data SIM/eSIM | Candidate for Data family. Verify discrepancy in seller copy (30GB vs 40GB), 365-day validity, supported countries, FUP and Taiwan/HK real-name requirements. |
| Hong Kong address receipt service | CNY 50, in stock | Non-route logistics service | Out of Phone Radar route scope unless later evidence shows it materially solves SIM acquisition logistics without creating a separate product surface. |

Seller tutorial inventory discovered:
- `/blog/giffgaff` — detailed activation, PAYG, retention, eSIM and troubleshooting guide.
- `/blog/gapa` — Giffgaff low-data retention helper; treat its exact traffic/cost claims as unverified until reproduced and checked against current giffgaff rules.
- `/blog/haha` — Haha SIM activation/APN/data-package/real-name notes.
- `/blog/EK` — seller/about page; provenance only, not route evidence.

Important exclusions:
- Do not copy instructions whose purpose is to bypass platform risk controls, device/location checks, KYC, identity verification or account restrictions.
- Do not publish "works for X app/bank" as a guarantee based only on seller copy.
- Do not convert seller claims into OTP success percentages.
- Do not add all products to production. Research first, then admit only distinct routes that improve the current three-family decision set.

### Sendwave/Maya lead supplied by user

Keep as a separate lead, not a Phone Radar route. It is a remittance/payment workflow, not a phone-number product.

Safe facts to verify if later needed for a relevant acquisition/payment guide:
- Germany is a supported Sendwave sending country and the Philippines is a supported destination.
- Maya can receive remittances through supported partners.
- Sendwave referral rewards are governed by current in-app eligibility and official terms.

Do not operationalize or publish repeated-account/KYC reuse, account recreation for repeated referral rewards, identity-rule evasion, or similar abuse. Sendwave currently states one account per person and requires identity verification.

## Task B — Cursor Usage Pool / Quota Explainer

Goal: deepen the existing `/tools/cursor-usage-reset/` URL rather than create a new product surface.

User job: explain why Cursor usage can reach 100% despite apparently lower token use, identify which included pool is being consumed, estimate remaining usable capacity, and project depletion before the billing-cycle reset.

MVP inputs:
- plan;
- model or Auto/Router;
- current pool percentage(s);
- account reset timestamp;
- optional observed spend/cost;
- optional input/cache/output token breakdown when the user has it.

MVP outputs:
- active/likely pool;
- estimated remaining included value;
- model-cost-aware burn estimate;
- projected depletion date at current pace;
- days/hours until reset;
- explicit uncertainty when Auto/Router or incomplete account data prevents exact attribution.

Rules:
- never infer remaining quota directly from raw token count alone;
- use Cursor's current official usage-limit/model-pricing documentation as the rule source;
- user/account dashboard values remain the source of truth for account-specific percentages and reset time;
- avoid a new URL unless GSC later proves a distinct search intent that the existing Cursor canonical cannot serve cleanly.

Execution gate: the existing Cursor CTR pilot is still measuring. Do not change production until the current measurement window is evaluated or a concrete factual defect requires correction.

## Execution order

1. Build verified research records for the SIM Panda inventory backstage; start with distinct candidates that fill current Phone gaps, not routes already well covered.
2. After Phone visual closure and the applicable measurement/release gates, decide which verified routes, if any, deserve admission to the existing Phone canonical.
3. Evaluate the Cursor CTR pilot; if the existing URL remains the correct canonical, implement the Usage Pool/Quota Explainer as a bounded deepening of that page.

Definition of done for this research document: both user-directed tasks are durably captured, the SIM Panda inventory is enumerated, unsafe/out-of-scope claims are separated from publishable research, and neither task silently changes production priorities or current release gates.