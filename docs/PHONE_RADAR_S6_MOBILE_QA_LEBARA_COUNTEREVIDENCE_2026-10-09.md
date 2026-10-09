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

## Automated tests, release and independent production QA — VERIFIED

- [PR #457](https://github.com/chenyuan35/aineedhelpfromotherai/pull/457) head `9291ca1c177e11b2af0ea141907da4538162e315`, squash merge main `1a3611520cc0fa49e19cdf6f0ee402dc7168e04e`.
- Initial Eval Gate #1327 failed on **the previous S5 assertion's singular literal phrase** after the S6 copy correctly switched to plural contradictory case wording. The test was amended to accept both grammatical forms while still requiring the explicit no-guarantee claim; exact-new-head Eval Gate **#1328 / 37905500406 SUCCESS**, including built Phone public-release JSDOM checks, all 10 S3-derived fail-closed cases and the global regression/eval suite.
- Exact-head Vercel Preview `dpl_Hod4bznVTVbUQzDs2L1or2s5VvTQ` **READY**. Exact-main production `dpl_9KvLXkBkv9eGeQKiXjHyJAEJQzjF` **READY**, apex `aineedhelpfromotherai.com` and www alias verified.
- Independent uncached hosted-browser production read: Phone page loaded the deployed `phone-first-identity.css` and the new direct negative-case source link. At **375 CSS px** document scroll width 360, hero top 81/height 395, task finder top 585 and first task-select top 785. At **390 CSS px** document scroll width 375, hero top 81/height 395, finder top 585 and first select top 785. **375 and 390 screenshots were both captured and visually inspected**: compact headline, 2x2 Buy/Keep/Verify/Recover explanations, horizontal route-family selector and first task prompt all visible; no visible document-level sideways scroll or clipped task label was seen. The family selector is intentionally horizontal; carousel child rectangles may exceed the viewport without causing body scroll.
- Browser controls set task=Verify, place=mainland-China, number origin=United Kingdom and app=Telegram: **0 verified winners, 2 distinct research-only candidates, explicit No verified matches**, both widths. Browser lazy detail click for Lebara at 375px loaded its evidence sheet (6 source links in the S5 baseline). This is measured technical/browser behavior, not a real phone activation or customer task completion.
- Independent browser HTTP reads: `phone-route-summaries.json` **200 / 160 routes**, sitemap **200 / 31 loc entries**. Database source corpus remains **896**, no source/event ingestion, price, route admission, publication/SEO or backend count changes.

**Current limitations:** Five recruited real-user tasks, real mainland physical/eSIM installation, user payment/KYC, fully authorized first network attachment, actual Telegram/WhatsApp fresh OTP receipts, 30-second task completion and any success or refund rate remain **NOT TESTED**. Two people reporting failure under the same forum source do not become two independent source URLs. Keep No verified matches until independent reproducible mainland-first end-to-end evidence exists.

**Decision:** S6 code/research/production/mobile technical QA is COMPLETE. Product-level China-first acquisition viability remains NOT VERIFIED. The negative Lebara case is reviewed and linked in the frontstage warning ledger, but has **not** been normalized as a new source/event row; that would need a separate append-only and generated-artifact verification, not an unreviewed count inflation.
