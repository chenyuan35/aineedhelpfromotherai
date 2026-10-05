# Hotlink Pantas maintenance — 2026-10-06

Route: `hotlink-pantas-365-pass-2026`

## Decision

Keep the route canonical as `real-mobile`, `admitted`, `backstage-only`, but set the current profile `guideEligible=false`. Do not publish a new route page and do not create an app/OTP success percentage.

## Current first-party facts

- Hotlink Pantas still documents an RM30 365-day Active Period pass for eligible lines. The RM2/RM4/RM10 365-day offers are data passes, not account-validity passes.
- The 26 August 2026 Pantas terms frame Pantas as a change from another Hotlink prepaid plan and document an RM2 rate-plan-change fee. The current Hotlink Prepaid starter baseline is RM10, so the normalized conservative setup path is RM12.
- Normal Pantas expiry is followed by a 30-day Credit Grace Period during which incoming calls/SMS remain available; failure to top up before grace expiry terminates the plan.
- Tourist registrations are excluded from the normal lifecycle and 365-day rule. Their service validity is fixed at 90 days from original activation and cannot be extended/reset by rate-plan change, top-up or internet-pass purchase.
- New prepaid eSIM and passport-based self-registration are supported, but the reviewed Hotlink material does not define the classification boundary between non-Malaysian/passport users and tourist registrations.
- Hotlink Prepaid roaming is provisioned by default and depends on destination partner networks.

## Independent / community evidence

- September 2026 Reddit users still reproduce the RM30/365-day Pantas option after changing plan, including a reported RM2 switch fee.
- A September 2026 Lowyat Pantas user reports failure to receive SMS while roaming despite an active line and roaming; support allegedly cited a minimum balance requirement that was not published on Hotlink's site.
- January and June 2026 independent reports reproduce offshore Hotlink eSIM setup with passport registration, but also describe prepaid-balance sensitivity before roaming signal/SMS became usable.

## Data treatment

- Source depth: 1 → 12.
- Keep metric: RM30 / 365 days, conditional on non-tourist eligibility.
- Conservative acquisition metric: RM12.
- No `observations` rows are created because the available evidence is route-level and not an exact route + named service + operation sample.
- No `successRatePct` is created.
- Public boundary remains 135 comparison routes / 3 indexable routes / 31 sitemap URLs.

## Re-open triggers

Re-open this route when Hotlink publishes a clear tourist/non-tourist classification rule for passport/self-registration, or when enough exact app/service observations exist to meet the service-evidence threshold.
