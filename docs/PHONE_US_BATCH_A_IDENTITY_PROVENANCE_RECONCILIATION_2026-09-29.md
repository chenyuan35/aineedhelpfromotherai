# Phone Radar — US batch-A identity/provenance reconciliation

Date: 2026-09-29  
Scope: Ultra Mobile PayGo / Tello PAYG / H2O PayGo  
Publication change: **none**

## Identity decision

Canonical `tello-us` and legacy `tello-paygo-credit-2026` are **distinct product routes**, not aliases.

- `tello-us` represents the current low-end **30-day monthly-plan** retention model already in canonical data.
- `tello-paygo-credit-2026` represents the separate **Pay As You Go credit** product.
- Both legitimately share the `tello-us` brand, but their retention clocks and economics differ, so collapsing them would destroy product semantics.
- The PAYG route keeps `networkId: null` in canonical v1 rather than inheriting a normalized network claim that was not re-established by the bounded provider/source review.

## Current reconciliation

### Ultra Mobile PayGo — ADMIT-BACKSTAGE

- Official service remains $3 per 30-day cycle for 100 minutes, 100 texts and 100MB.
- Current official purchase channels are eBay or select T-Mobile stores; the provider page does not establish a stable SIM-kit acquisition price.
- PayGo-specific terms require activation with the enclosed SIM, so this review records the route as physical SIM rather than carrying the broader Ultra eSIM capability into PayGo.
- Current China PayGo roaming rates remain supported; PayGo has no data roaming.
### Tello PAYG — ADMIT-BACKSTAGE

- Web PAYG orders currently start at USD20; US usage is 1¢/min, 1¢/SMS and 2¢/MB.
- Tello's current Terms define PAYG credit as valid for 90 days from the **last PAYG order**. Ordinary SMS/data/call use does not reset that order-based clock.
- Therefore the stale “send one SMS every ~80 days” shorthand is removed. The conservative standalone PAYG model is USD20 per 90 days, approximately USD80/year.
- First activation/port-in must occur physically in the United States on Tello network towers. Roaming abroad requires prior US use; Wi-Fi Calling & Text is available after setup.
- Current independent Tello provenance from the 2026 admission review is retained with exact NodeLoc and NodeSeek URLs; the older HowardForums/Nth Circle placeholder IDs are not carried forward as if they were fresh evidence.

### H2O PayGo — HOLD

- Current PayGo pricing remains $10/90 days, $30/90 days, and $100/365 days, with 5¢ talk/text and 10¢/MB.
- Current H2O terms and roaming surface limit International Roaming to eligible Unlimited/12-month plans; PAYG is not an eligible roaming route.
- PAYG-specific Wi-Fi Calling and China continuity are not currently verified. The route remains observation/HOLD rather than a China OTP recommendation.

## Migration boundary

All three reviewed rows can be represented losslessly as backstage canonical routes with current-profile snapshots. The canonical comparison adapter deep-equals the reviewed comparison rows. Comparison coverage remains 135 routes and explicit indexability remains 3. No standalone route URL, sitemap entry, ranking claim or publication-state expansion is authorized by this migration.
