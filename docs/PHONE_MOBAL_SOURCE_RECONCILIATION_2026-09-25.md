# Mobal Japan source-change reconciliation — 2026-09-25

Status: **COMPLETE — no production Phone data change required**

## Scope

Reconcile the reviewed-source watcher `content-change` events for:

- `mobal_pricing` — `https://www.mobal.com/japan-sim-card/`
- `mobal_id` — `https://helpdesk.mobal.com/support/solutions/articles/205000051089-i-d-requirements-voice-products-`

Hash changes are review triggers only. This review compares current attributable public content with the accepted Mobal facts already stored in the Phone prototype/catalog.

## `mobal_pricing`

Classification: **REVERTED / PAGE CHURN for the existing accepted Voice+Data route**.

Current provider content verified on 2026-09-25 still supports the accepted durable Voice+Data baseline:

- Voice+Data SIM list price: **JPY 4,950**;
- current temporary sale price displayed: **JPY 4,455 (10% off)**;
- Voice+Data 1GB monthly plan: **JPY 1,650**;
- listed prices include tax;
- a real Japanese phone number and SMS remain part of the Voice+Data product.

The source watcher had already recorded that the pricing hash returned to a previously observed hash after changing on Sep 24. The current semantic facts used by the existing `mobal-japan-voice-data` route therefore remain current; the transient hash event is not evidence of a durable Voice+Data price change.

The page also currently advertises a separate **Voice-Only** product at JPY 1,430/month and labels it new. That is an adjacent product candidate, not a correction to the existing Voice+Data route. It is not admitted or published by this maintenance task.

Decision: **no catalog, retention, purchase-intelligence or public-route edit**.

## `mobal_id`

Classification: **NON-SEMANTIC with respect to accepted Phone facts**.

Current provider content verified on 2026-09-25 states:

- ID restrictions apply to Voice-capable SIM/eSIM products under Japanese law;
- delivery orders show country-specific accepted ID after the shipping address is entered;
- delivery requires an ID upload and shipment to the address shown on the accepted ID;
- collection does not require an upload; the customer shows a passport and order confirmation at collection;
- Data-Only products do not use this Voice-product ID-upload requirement;
- the current Mobal Japan product page separately confirms Voice SIM/eSIM customers must be 18 or older.

These semantics match the accepted project facts in `catalog.json` and `route-capabilities.json`. No stale identity/KYC fact was found.

Decision: **no production data edit**.

## Result

Both watcher events are reconciled. Neither requires changing the existing Mobal Voice+Data route.

The current 10% promotion is a temporary commercial state already covered by the project's dynamic-price/recheck rule. The separate Voice-Only product is not auto-promoted from an official-page observation; any future admission requires its own evidence/value review.

Next independent task: **bounded V2EX reply-fragment dedupe repair**. Normalize fragment-only reply URLs for dedupe while preserving genuinely new evidence; do not broadly suppress V2EX.
