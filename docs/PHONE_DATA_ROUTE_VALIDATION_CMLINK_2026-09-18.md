# Phone Data Route Validation — Trip.com CMLink Mainland China eSIM

Date: 2026-09-18

Status: **VALIDATED / ADMISSION-READY AS `Watch` — production change is a separate bounded task**

This note records the bounded Q-013D3 validation of one Data-family route. It follows `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md` and does not broaden into a provider-wide CMLink audit.

## Exact route

Seller: Trip.com

Product: `[Mainland China] 5G | eSIM Internet Card | China Mobile CMLink | 3-15 days optional | Ready to use | Hotspot supported | QR Code`

Trip product ID: `71336361`

Current product page:
`https://sg.trip.com/things-to-do/detail/71336361-mainland-china-5g-esim-internet-card-mobile-cmlink-15-days/`

Route family: Data SIM/eSIM

Destination: Mainland China

This is a **Trip.com CMLink-backed travel eSIM route**, not a claim about a CMLink domestic/mobile-plan product and not a generic endorsement of every reseller using CMLink capacity.

## Current commercial state

Verified from the live Trip.com listing on 2026-09-18.

- listing is live and bookable;
- current title states Mainland China, China Mobile CMLink, 3–15 day options, 5G-labelled service, QR delivery and hotspot support;
- 15 package variants are exposed on the current listing;
- current listing includes daily-data variants such as 3 days / 0.5 GB per day;
- localized SG listing showed a starting price around **S$3.70** in the freshest search extraction on 2026-09-18; price is locale/package/time dependent and must not be treated as a fixed route-wide price;
- current listing showed 1K+ bookings and 45 verified-traveller ratings with a 4.0/5 aggregate;
- the listing was last updated by Trip.com on 2026-09-11 in the freshest result.

Commercial source:
`https://sg.trip.com/things-to-do/detail/71336361-mainland-china-5g-esim-internet-card-mobile-cmlink-15-days/`

A reseller mirror carrying the same product ID documents the practical delivery/setup path: QR code sent after purchase, one-device profile installation, Wi-Fi required when adding the eSIM profile, data line enabled for use, data roaming enabled for troubleshooting/use, and hotspot troubleshooting when needed.

Same-product-ID mirror:
`https://www.wingontravel.com/things-to-do/detail?bid=15&cid=6&cityID=30&did=83236_%E5%A4%A7%E9%B5%AC%E6%89%80%E5%9F%8E&productID=71336361`

## First-hand mainland-China operating evidence

### Detailed Trip CMLink test — 2026-03-15

A Naixi user bought a Trip mainland-China eSIM whose activated provider displayed CMLINK. The tested package at that time was a 1-day / 0.5 GB variant with HK + Singapore split egress.

Observed workflow/outcomes:

- native-eSIM devices could install from the Trip order; other devices used the emailed QR code;
- activation displayed CMLINK;
- hotspot became available after an initial delay;
- the user's mainland location attached on 4G despite the seller's 5G label;
- domestic-app traffic appeared to exit Hong Kong while overseas-app traffic appeared to exit Singapore;
- after the high-speed allowance was exhausted, the advertised 384 kbps fallback measured closer to ~250 kbps and later below 200 kbps, becoming impractical for image-heavy use.

Source:
`https://forum.naixi.net/thread-10581-1-1.html`

The exact 1-day variant in that March report is not the current 3–15 day package matrix, so the report is used for operational behavior of the Trip/CMLink route family, not as current pricing/package truth.

### Independent Trip/CMLink use — April–June 2026

Recent independent Trip users report reproducible mainland-China use of the ChinaMainland/CMLink route:

- a May 2026 user identified the selected Trip option as the first `ChinaMainland (CMlink)` result and reported no issue; another reported installing before departure and connecting immediately after landing in Shanghai;
- June 2026 users reported a CMLink Trip eSIM working in Guangzhou without a VPN and other Trip/CMLink plans working across multiple mainland cities;
- reports are not uniformly positive: some users saw evening slowdowns, device-dependent performance, or periods of low speed.

Sources:
`https://www.reddit.com/r/travelchina/comments/1t4hd1i/tripcom_esim/`
`https://www.reddit.com/r/chinatravel/comments/1u2xb0y/anyone_have_trouble_with_their_tripcom_esim/`

### Fresh degradation signal — 2026-09-15

A very recent user report says a newly bought Trip.com eSIM again identified as CMLink and remained usable on 4G, but was not fast enough for the user's work. The same user described a separate older/recharged CMLink eSIM as becoming nearly unusable. The report does not identify Trip product ID 71336361, so it is a route-family quality warning rather than exact-product failure evidence.

Source:
`https://www.reddit.com/r/chinatravel/comments/1we98n5/does_the_tripcom_china_esim_works_with_claude_and/`

## Decision fields

- **Current price/value:** very low entry price; localized current price varies by package and locale. Do not hard-code one route-wide price.
- **Allowance/validity:** current Trip listing offers multiple 3–15 day packages, including daily-data variants.
- **Coverage:** reproducible mainland-China use exists across Beijing/Shanghai/Guangzhou and other cities in recent first-hand reports, but exact radio/network attachment varies.
- **Setup friction:** low-to-medium. Purchase → install eSIM/QR → enable data line/roaming → connect; occasional device/hotspot troubleshooting exists.
- **Egress:** CMLink-backed roaming commonly exits outside mainland China; detailed March evidence observed HK + Singapore split behavior. Do not promise one fixed egress for every current package.
- **Speed/5G:** inconsistent. 4G-only operation and evening/degraded speeds are current enough to matter. The product should not be presented as reliably delivering 5G merely because the listing says 5G.
- **Hotspot:** advertised and reproduced, with some setup delay/troubleshooting.
- **Reuse/recharge:** treat the current 3–15 day Trip route as a travel-session product. Do not promise recharge/long-term reuse without package-specific evidence.
- **Phone number/SMS:** treat as data-only for the Phone Radar decision layer; do not imply a durable phone number or OTP capability.

## Admission decision

**VALIDATED / ADMISSION-READY AS `Watch`.**

This exact Trip.com route now has enough evidence for a reasonable user decision:

1. the current seller/product identity is explicit and live;
2. current package/validity/value metadata is available;
3. multiple independent first-hand users have reproduced Trip/CMLink use in mainland China during 2026;
4. a detailed Trip/CMLink test documents installation, egress, hotspot and throttling behavior;
5. negative and degraded-performance evidence is also present, so uncertainty can be represented honestly rather than hidden.

The correct public framing is a **cheap mainland-China travel-data option with mixed performance**, not a premium/reliable-5G claim.

Suggested stability state: `Watch`.

## Production boundary

This research task does **not** modify the public Phone Radar. A separate bounded production task may admit exactly this route, with current localized price handling and the `Watch` caveat, after normal branch/test/preview/release verification.

Do not generalize this decision to:

- official CMLink mobile plans;
- other Trip CMLink SKUs;
- other resellers using CMLink capacity;
- fixed HK/SG egress;
- guaranteed 5G;
- guaranteed VPN-free access for every application;
- phone-number/SMS/OTP capability.
