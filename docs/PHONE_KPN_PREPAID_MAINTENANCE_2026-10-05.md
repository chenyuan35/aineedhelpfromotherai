# KPN Prepaid maintenance — 2026-10-05

Route: `kpn-prepaid-6mo-2026`.

## Decision

Keep the route `admitted` + `backstage-only`. Correct stale economics and SIM-form assumptions; do not create app/service success percentages because there is no threshold-qualified exact-service sample.

## Reconciled current facts

- Current KPN prepaid physical SIM price: **€4.99**. The product page advertises **€7.50 bonus credit** for first registration in the KPN Prepaid app; bonus credit is not treated as a cash discount.
- KPN Basis 2021: **€0.20/min, €0.15/SMS, €0.10/MB** in the Netherlands. A standard NL/EU SMS every six months gives a lowest documented keep-action path of about **€0.30/year**; outside-EU outgoing tariffs vary.
- Credit itself is unlimited-validity only while the line performs one qualifying action every six months: call, send SMS, use mobile data, or top up. Incoming calls/SMS do **not** reset the clock.
- After six months inactivity, credit is frozen for **90 days**. A top-up during that rescue window can restore service; otherwise credit and number are lost.
- **KPN Prepaid does not support eSIM.** The route is physical-SIM only.
- A new prepaid SIM must be activated **in the Netherlands on the KPN network**. Abroad-first activation is not supported.
- KPN states receiving SMS abroad is free. A 2026 provider-community incident reports a previously used prepaid line losing network abroad, so overseas reachability remains an unquantified continuity risk rather than a guarantee.

## Publication boundary

No public route page, indexability rule, sitemap entry, or recommendation change is authorized by this maintenance pass.
