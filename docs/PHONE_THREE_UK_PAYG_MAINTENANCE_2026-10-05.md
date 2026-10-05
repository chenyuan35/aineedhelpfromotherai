# Three UK PAYG maintenance — 2026-10-05

Route: `three-uk-payg-180d-2026`.

## Decision

Keep the route `admitted` + `backstage-only`. Reconcile current acquisition and roaming/provisioning rules; do not create app/service success percentages because there is no threshold-qualified exact-service sample.

## Reconciled current facts

- A new Three PAYG voice SIM can no longer be ordered free on its own. Three requires a Data Pack with a new SIM; the lowest currently displayed one-month Data Pack is **£10**.
- Standard PAYG rates remain **35p/min, 15p/text, 10p/MB**. A standard UK SMS every six months therefore preserves the lowest documented ongoing keep-action path of about **£0.30/year** after acquisition.
- The number must perform at least one qualifying chargeable activity every **180 days**. A Top-up, Data Pack or Add-on counts; calls/texts/data count only on Three's mobile network, not Wi-Fi. Once disconnected for inactivity, the number cannot be restored.
- PAYG supports both **physical SIM and eSIM**. Existing PAYG customers can request replacement eSIM through My3/Three app, and current new Data Pack offers expose eSIM selection.
- Before PAYG can be used abroad, the SIM/device must first connect to Three in the **UK** and, where no allowance is preloaded, a Top-up or Data Pack must be added in the UK.
- Three states incoming texts while roaming are **free** across its published PAYG destination bands. This is an entitlement/rate fact, not a guarantee of partner-network reachability in every destination.

## Publication boundary

No public route page, indexability rule, sitemap entry, or recommendation change is authorized by this maintenance pass.
