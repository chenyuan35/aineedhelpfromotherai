# DB-C3 release note — 2026-09-29

Status: **PR REVIEW / BACKEND ONLY**

- 12 legacy-only comparison routes independently reviewed and normalized through approved backstage packets.
- Disposition: **7 ADMIT-BACKSTAGE / 5 HOLD / 0 REJECT**.
- ADMIT: LABAS, Telekom Easy, CALENDAR Rakuten Prepaid, Orange Romania PrePay, Digi/CelcomDigi, 1pMobile, RedPocket Annual.
- HOLD: ASDA Mobile, Lyca Mobile UK keep-number, LMT Karte, Free Mobile France, Good2Go Canada.
- Canonical database: **77 → 89 routes**.
- Markets: **47 → 51**; brands: **74 → 86**; networks: **59 → 67**; sources: **264 → 293**.
- Comparison↔canonical route-ID overlap: **66 → 78**; legacy-only comparison routes: **69 → 57**.
- Comparison artifact remains **135 routes**; explicit indexable routes remain **3**.

Material corrections: ASDA's activity and credit-expiry rules are separated instead of assuming GBP5/180d; Telekom Easy is 90 days only before first top-up and 180 days after later top-ups; LMT's old EUR18/year estimate is withdrawn; Lyca UK's legacy O2 network identity is corrected to EE while its GBP15 keep-number path remains HOLD pending direct current UK provider text; Free Mobile's EUR2 plan retains its mainland-France/stable-link eligibility gate; Good2Go's historical CAD20/180d rule remains unverified current.

CALENDAR's current 3GB annual entry is JPY7,860 with a JPY5,400 same-number extension; Orange Romania now preserves active-vs-grace semantics instead of a fabricated annual minimum; Digi retains the official MYR198/365-day extension; 1pMobile uses the July 2026 cohort-specific commitment periods; RedPocket replaces stale USD60/USD30 economics with current USD80 first-year / USD110 renewal and U.S.-only activation.

All 12 routes received independent source review, exceeding the >=3-route sample-audit gate. Missing or conflicted fields remain missing/HOLD rather than inferred.

`npm run phone:data:check` passes after import/build, including candidate-pipeline, canonical compatibility and publication-boundary checks. The 135-route comparison surface and 3-route indexability boundary are unchanged.

No route page, market page, sitemap, ranking or SEO publication expansion is authorized by DB-C3. Merge remains gated on Eval Gate and a real Vercel Preview.