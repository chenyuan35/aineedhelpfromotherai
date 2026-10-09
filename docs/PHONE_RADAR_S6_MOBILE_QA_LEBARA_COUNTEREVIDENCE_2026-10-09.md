# Phone Radar S6 — mobile first-fold browser audit and Lebara counterevidence

Review/release date: 2026-10-09. Scope: existing Phone URL and research-only confidence disclosures; no new route, URL, database schema, signup, analytics or paid backend.

## Evidence addition

- [Lebara official eSIM terms](https://www.lebara.co.uk/en/help/esim.html) remain explicit: order may be placed outside the UK, but first service activation must be performed in the UK. An email-verified account is required; provider support does not prove a mainland payment/KYC or fully authorized activation.
- [2026-08-12 first-hand mainland recipient report](https://linux.do/t/topic/2745784): one original author reports receipt of Telegram and WhatsApp codes after installing eSIM in China without ever registering on a UK network, but outgoing SMS/voice was broken. This is **receive-only on one account**, not full activation or successful new-buyer eligibility.
- **New contradictory primary source:** [2026-08-26 mainland no-signal/refund thread](https://linux.do/t/topic/2815946) — one purchaser reports a £5 direct eSIM acquisition to a Xesim device with no signal, provider customer support said UK activation required, cancellation was accepted and refund received later; another participant independently reports the same no-signal outcome and refund. The statements are **two participant claims on one original thread**, not an activation failure rate or two independent source URLs; other users discuss separate device/network circumstances. Payment instruments in individual reports (one used Bitget, one PayPal) do not establish that those methods or foreign-issued cards will consistently be accepted, nor any future refund entitlement.
- [2026-08-16 different original thread](https://linux.do/t/topic/2763577) also contains a first-hand failed-signal/refund account and mixed workaround claims, but the precise geographical onboarding and full activation conditions remain incomplete. No app OTP success rate inferred.

**Decision:** retain remote-location **No verified matches** for China/abroad first activation; do not turn one receive-only report into guaranteed first activation or use two same-thread participants as independent sources. Update existing Lebara card to show both the positive case and the negative primary thread with direct links. No normalized source/event totals, route status, price, sort order or search publication change.

## Real rendered mobile baseline (live release of PR #456 before S6)

Using an independent hosted Chromium page session against `https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/` at 375 and 390 CSS-pixel viewport widths (height 812px), not just CSS source inspection:

| Check | 375px | 390px |
|---|---|---|
| Document scroll width | 360px | 375px |
| Task finder top, from page top | 850px | 850px |
| China + UK + Telegram UI result | No verified matches; 0 verified candidate cards; 2 separate research-only cards | same |
| Research sources | Giffgaff + Lebara, only as research leads | same |
| Sideways overflow | none at document level; intentional horizontally clipped family cards have child element rectangles extending right | same |

The large hero and four-row answer legend push the **first task choice entirely below the mobile first viewport**. This is an observed usability defect, not merely a speculation about the CSS breakpoint.

## Bounded S6 improvement

Append a narrow max-width 700px `phone-first-identity.css` style override: reduce unnecessary mobile hero spacing and title size, hide only the redundant **decorative proof-chip list** on mobile, preserve the *actual four Buy/Keep/Verify/Recover answer descriptions* as a readable 2x2 legend, compact family tabs, and bring the interactive task chooser higher without changing DOM order or accessibility labels. Existing desktop CSS stays unchanged.

**Live prototype in independent hosted Chromium at 375px (CSS only, not production):** hero from page top 81px, measured height 395px; family controls at top 510px; real task finder at top 585px; document scroll width 360px; no document-level horizontal overflow. Improvement is roughly 265px earlier task access. These are *prototype observations* until built production is separately measured.

## Automated and production release gates

Public-release JSDOM should check the CSS source is shipped, all four answer types are still visible in rendered HTML, the Lebara negative firsthand hyperlink is displayed, and the original fail-closed ten scenario checks still pass. Independent post-merge 375/390 live browser checks must be repeated against the actual deployment, not assumed from this prototype.

375/390 rendered screenshots and interactive viewport checks count as **real-browser technical QA**, not recruited customer participation or measured 30-second task completion. Five independent volunteers, actual checkout, SIM network attach, on-device OTA registration, and named-app real OTP tests remain **NOT TESTED**.

No new normalized source/event count has been claimed and no unsupported probability or refund promise added. The current product gate remains blocked on independent repeatable mainland first acquisition/payment and authorized service activation.
