# Holafly Always On — Backstage Data eSIM Packet Review — 2026-09-26

Status: **PROMOTE / BACKSTAGE DATA-ESIM PACKET / NO PUBLIC PRODUCTION CHANGE / ONE UNRESOLVED FIELD FLAGGED**

## Question

Can Holafly Always On serve as a legitimate low-maintenance emergency backup data eSIM between trips, with a verified cheapest acquisition path, supported-market state, lifecycle/device constraints and current independent reliability evidence? This packet is a Data-eSIM job, not a phone-number/SMS/OTP route.

## Decision

**PROMOTE to the backstage packet set as a Data-eSIM (backup data, not a number).** Always On is a first-party-supported, low-friction backup-data benefit (1 GB/month, 30-day refresh, no roll-over) bundled with all Holafly eSIMs, covering 150+ destinations including China, Hong Kong, Singapore, Taiwan, Japan and Macao. It is admitted as a backstage data-eSIM packet. It must **not** be represented as a long-term SMS/OTP-number route — it carries no phone number. One unresolved field (the explicit Always-On service duration ceiling) is flagged below; it does not block the current classification because the packet is data-only and the bounded-period ambiguity does not change the user job it serves.

## First-party findings

Source: `https://esim.holafly.com/always-on/` + `https://esim.holafly.com/terms-and-conditions/` + product page `https://esim.holafly.com/esim-china/` (all fetched 2026-09-26).

### What Always On is

- A **1 GB monthly backup-data benefit included with all Holafly eSIMs** — whether a Monthly Plan or a short-trip Unlimited Data eSIM. The China product page confirms **"Always On Included"**.
- After the primary purchased data (short trip or monthly plan) is consumed, **Always On activates automatically**; no separate opt-in is required.
- Every 30 days from the eSIM install date, the eSIM automatically receives 1 GB. **Unused data does not roll over and expires at the end of each 30-day cycle.**
- Marketing copy states **"12GB every year, for free"**; this is a year-total framing, not a stated 12-month ceiling on the benefit itself (see Unresolved).

### Cheapest legitimate direct purchase that activates Always On

- **Always On is bundled with every Holafly eSIM**, so the cheapest legitimate acquisition is simply the cheapest Holafly eSIM that includes it.
- The China eSIM product page (`/esim-china/`) lists a **starting price of approximately €3.79 / USD 3.90 / GBP 4** (currency-switcher, JSON-LD price `3.79 EUR`); this is the entry price for a China plan and therefore the lowest verified Always-On-activating purchase.
- No separate "Always On" SKU is sold; the benefit is a free inclusion, so there is no upsell path and no legitimate cheaper side-channel that triggers it.

### Supported market state (country coverage)

- First-party Always-On destination list enumerates **150 destinations** across Europe (48), Asia (31), Caribbean (21), Africa (32), South America (11), North America (3), Oceania (4).
- **China ✅ / Hong Kong ✅ / Singapore ✅ / Taiwan ✅ / Japan ✅ / Macao ✅** — all present.
- ⚠️ First-party inconsistency: the page `<meta name="description">` states **"70+ countries"** while the page body and FAQ state **"150+ destinations/covered"**. The 150+ figure is the one backed by the enumerated list; the 70+ figure appears to be a stale metadata value. Recorded as an unresolved first-party inconsistency.

### Lifecycle / device constraints

- **Keep the eSIM installed; do not delete it** — deletion ends the Always On benefit (first-party FAQ: "To keep enjoying Always On every month, simply keep your eSIM installed and don't delete it").
- **No hotspot / no data sharing** — the 1 GB is personal-use only on the installing device.
- **90-day continuous-roaming ceiling** per destination (T&C clause 6; standard fair-use roaming rule), tied to the customer's purchase-country residence.
- **Device transfer** — first-party material does not state an explicit device-transfer policy for Always On beyond "keep installed / don't delete"; eSIM-level transferability is governed by the device/OS eSIM profile rules. Flagged as an unresolved field.
- **12-month / monthly-refresh mechanics** — refresh cadence is "every 30 days from installation date", automatic, no roll-over. The marketing "12GB/year" framing and the T&C liability cap ("12 months preceding the event") are **not** an explicit service-duration ceiling; first-party material does not state when, or whether, Always On terminates for an installed, undeleted eSIM. Flagged as the primary unresolved field.

## Independent evidence (2026)

- Independent end-to-end 2026 reproduction of monthly refresh arrival, sustained speed/availability, and failure/refund behavior was **not obtained within this session** — third-party review surfaces (Trustpilot) returned 403 to automated fetch, and the project search quota was exhausted. This is an admitted evidence gap, not a negative finding.
- The first-party eSIM-embedded review JSON-LD on the China product page contains positive Holafly reviews (e.g., "Best 5G data I've had in Spain", "Great experience on China") but these are curated first-party testimonials, not independent 2026 monthly-refresh reproductions.

## Unresolved fields

1. **Always On service duration ceiling.** First-party material (FAQ + T&C) does not explicitly state whether the 1 GB/month benefit continues indefinitely for an installed, undeleted eSIM, or terminates after a bounded period. The "12GB every year" marketing line and the T&C liability "12 months" cap are not a stated benefit-duration ceiling. **Re-open trigger: any first-party update stating an explicit duration, or any 2026+ independent reproduction showing the benefit stopping after N months.**
2. **Device-transfer policy for Always On** — not explicitly stated beyond "keep installed / don't delete".
3. **Meta-description vs body coverage count (70+ vs 150+)** — first-party metadata inconsistency; 150+ is backed by the enumerated list.

## Publication / production guard

- This packet is **backstage only**. Do not add a Holafly public route page, seller route, observer-topology change, or country/provider doorway page.
- Do not represent Always On as an SMS/OTP-number route — it is data-only and carries no phone number.
- Do not scrape or publish the NodeSeek/secondary-market seller route for Holafly eSIMs.

## Re-open trigger

Re-open this packet when (a) first-party material states an explicit Always-On duration ceiling, or (b) a 2026+ independent reproduction confirms sustained monthly-refresh arrival, speed behavior or a failure/refund pattern, or (c) a qualifying non-tourist mainland-China long-term data-eSIM job is added to the route pool that benefits from this evidence.
