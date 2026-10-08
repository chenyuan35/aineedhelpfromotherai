# Free Mobile France Forfait 2€ maintenance — 2026-10-08

Route: `free-mobile-fr-2026`, real-mobile / long-term / **HOLD / backstage-only**. No new URL, ranking promotion or app-specific success percentage.

## Commercial, eligibility and retention facts

The [Free Forfait 2€ page](https://mobile.free.fr/fiche-forfait-2-euros) and [tariffs effective 2026-07-21](https://mobile.free.fr/docs/bt/tarifs.pdf) establish **€2/month recurring subscription** plus a **€10 initial physical SIM/eSIM purchase fee**. This is not prepaid 180-day activity retention; 12 monthly plan charges cost **€24** before the distinct SIM charge. An eligible Freebox-attached household can obtain one €0/month discounted Free 2€ line; this conditional offer is not the default price. The acquisition metric €10 is SIM/eSIM-only, **not an all-in first invoice**.

Metropolitan-France residence or documented stable link is required. [Subscription help](https://assistance.free.fr/articles/887) covers accurate subscriber data and delivery; [store signup](https://assistance.free.fr/articles/1739) requires a RIB and 3D Secure-compatible card. [Free terminals](https://assistance.free.fr/articles/888) supply physical SIMs in France and [eSIM installation documentation](https://assistance.free.fr/articles/968) describes QR/app activation. These do not establish entirely offshore China-first new eSIM activation, use of foreign IBAN/card, or unrelated nonresident eligibility.

## Outside-Europe roaming, SMS and China boundary

[Option Voyage](https://assistance.free.fr/articles/905) must be activated before using the €2 plan outside Europe/DOM, with a **one-time €10 prepaid usage advance**. This is separate from the €24/year recurring subscription and €10 signup SIM fee and cannot be treated as a recurring annual cost or proven refundable deposit. The [international page](https://mobile.free.fr/communications-a-l-etranger) and [roaming assistance](https://assistance.free.fr/articles/1730) provide provisioning/recovery instructions.

Free explicitly says [incoming SMS internationally are free](https://assistance.free.fr/articles/953) where coverage and account service permit. July-2026 China tariff lists **outgoing SMS €0.27 and data €9.70/MB**; neither is China partner coverage nor a bank/app OTP success guarantee. [VoWiFi documentation](https://assistance.free.fr/articles/1236) specifies overseas outgoing SMS still traverse cellular.

## Independent outcomes

- [2023-03-15 r/france](https://www.reddit.com/r/france/comments/11ru9ar): self-described €2 subscriber in an unspecified Asian country reported receiving 2FA SMS; country, service and operator unknown.
- [2025-11-18 r/AskFrance](https://www.reddit.com/r/AskFrance/comments/1p082sk/free_mobile_comment_contacter_lassistance/): paying €2 subscriber in an unspecified African country reported SMS receipt stopped after previously working; root cause unknown.

Neither establishes China-specific application OTP reliability. **Zero exact-app observations and no percentage**. Retain HOLD, `guideEligible=false`.

## Evidence and engineering

12 new sources + 8 events; route source depth 2 → 14, events 1 → 9. Canonical **160 routes / 87 markets / 157 brands / 117 networks / 814 sources**, publication **135 comparison / 3 explicit indexable / 31 sitemap URLs** unchanged. Stale acquisition CNY approximation cleared, amount remains €10 card-only. Whole Phone database/index/summaries/lazy detail regenerated and Free FR regression added; ASDA source-count regression made monotonic so later maintenance does not break historical evidence.

## Release verification

PR #430 squash-merged as `d3d488b9f4456934e2ec2b244f56d0973604f5b9`; CI #324 / run `37732262068` **PASS**, Eval Gate #1259 / run `37732261900` **PASS**, Vercel Preview `dpl_FgFLKbHchqBJZg9yZcvJbZGY4QHe` **READY**, production `dpl_3DBBPXggDvouQ3LqR8MTBLEbgHGj` **READY** on exact merged main SHA and `aineedhelpfromotherai.com` alias assigned. Independent direct live HTTP reading of JSON/sitemap was blocked by external reader; it is not claimed as verified.

The Free Mobile line remains backstage-only and HOLD; production readiness is not evidence that China bank/app OTP or foreign-IBAN/new eSIM signup works.
