# Ultra Mobile PayGo Telegram Evidence Packet — 2026-10-04

Status: reviewed evidence packet for the existing canonical route `ultra-mobile-paygo-3-2026`; evidence is sufficient for canonical service-evidence maintenance, but this document alone does not mutate canonical JSON.

## User task

Answer the bounded question: for the existing low-cost real-mobile Ultra Mobile PayGo route, what does current public first-hand/community evidence say about Telegram registration verification?

## Existing canonical route

- Route: `ultra-mobile-paygo-3-2026`.
- Family: long-term.
- Number class: real-mobile.
- Form: physical SIM.
- Evidence state: admitted.
- Surface state: backstage-only.
- Current normalized keep cost: USD 3 per 30 days / USD 36 per year.
- Existing service evidence before this packet: none.

No route admission, publication-state, SEO URL or sitemap change is proposed.

## Reviewed exact-route evidence

The following five distinct source records concern Ultra Mobile PayGo and the exact service task `Telegram + registration-verification`.

1. **Reddit / r/NoContract — 2025-01-17 — success.** The PayGo user said the number had been used to sign up for Telegram (along with PayPal, Facebook and Google) before the carrier line later stopped working. Normalize the Telegram registration task as success; the later carrier-service loss is a separate continuity signal, not a Telegram-registration failure.
   - https://www.reddit.com/r/NoContract/comments/1i3tzxb/ultra_mobile_is_a_scam/

2. **Didushan YouTube demonstration — 2025-02-21 — success.** The video is explicitly an Ultra Mobile PayGo physical-card demonstration and marks `6:49` as successful Telegram registration. Commercial links are present, so treat this as a demonstration/community report rather than independent editorial authority.
   - https://www.youtube.com/watch?v=RZqLsGXnghk

3. **Shuzijumin — 2025-03-07 — success.** The first-hand report says a NumberBarn number ported into Ultra Mobile PayGo received a Telegram verification code. The line was later cancelled by Ultra and restored after an FCC complaint; again, that later carrier event belongs to continuity-risk evidence, not the registration outcome itself.
   - https://shuzijumin.com/thread-6126-1-1.html

4. **LINUX DO — 2025-06-03 — mixed.** The reporter first received Ultra-assigned numbers already banned by Telegram, then ported in a NumberBarn number and reported successful Telegram registration. Because the same source demonstrates both route-level success and failure depending on number provenance, normalize one thread-level `mixed` observation rather than splitting it into multiple pseudo-independent samples.
   - https://linux.do/t/topic/695893

5. **V2EX — 2026-04-04 — mixed.** A long-running GV-ported Ultra PayGo number could register Telegram on the phone, but the Telegram account was immediately banned after desktop login. Normalize conservatively as one mixed registration-verification observation; do not count the initial registration as a clean success while discarding the immediate service-level failure.
   - https://www.v2ex.com/t/1203564

A NodeSeek post reproducing the V2EX account is not counted as an additional independent observation. General claims without a dated first-hand outcome are also excluded.

## Proposed normalized observations

```json
[
  {
    "id": "obs-ultramobile-telegram-reddit-20250117",
    "routeId": "ultra-mobile-paygo-3-2026",
    "service": "Telegram",
    "operation": "registration-verification",
    "outcome": "success",
    "reportedAt": "2025-01-17",
    "geography": "unspecified",
    "sourceId": "reddit-ultramobile-telegram-signup-20250117",
    "dedupeKey": "ultramobile-reddit-1i3tzxb-telegram"
  },
  {
    "id": "obs-ultramobile-telegram-youtube-20250221",
    "routeId": "ultra-mobile-paygo-3-2026",
    "service": "Telegram",
    "operation": "registration-verification",
    "outcome": "success",
    "reportedAt": "2025-02-21",
    "geography": "unspecified",
    "sourceId": "youtube-didushan-ultramobile-telegram-20250221",
    "dedupeKey": "ultramobile-youtube-rzqlsgxnghk-telegram"
  },
  {
    "id": "obs-ultramobile-telegram-shuzijumin-20250307",
    "routeId": "ultra-mobile-paygo-3-2026",
    "service": "Telegram",
    "operation": "registration-verification",
    "outcome": "success",
    "reportedAt": "2025-03-07",
    "geography": "unspecified",
    "sourceId": "shuzijumin-ultramobile-telegram-20250307",
    "dedupeKey": "ultramobile-shuzijumin-6126-nimrod-telegram"
  },
  {
    "id": "obs-ultramobile-telegram-linuxdo-mixed-20250603",
    "routeId": "ultra-mobile-paygo-3-2026",
    "service": "Telegram",
    "operation": "registration-verification",
    "outcome": "mixed",
    "reportedAt": "2025-06-03",
    "geography": "unspecified",
    "sourceId": "linuxdo-ultramobile-telegram-mixed-20250603",
    "dedupeKey": "ultramobile-linuxdo-695893-thread-telegram-mixed"
  },
  {
    "id": "obs-ultramobile-telegram-v2ex-mixed-20260404",
    "routeId": "ultra-mobile-paygo-3-2026",
    "service": "Telegram",
    "operation": "registration-verification",
    "outcome": "mixed",
    "reportedAt": "2026-04-04",
    "geography": "unspecified",
    "sourceId": "v2ex-ultramobile-telegram-mixed-20260404",
    "dedupeKey": "ultramobile-v2ex-1203564-chenanhe-telegram-mixed"
  }
]
```

## Expected generated aggregate

Under the existing compiler rules:

- sample size: 5;
- distinct source records: 5;
- success: 3;
- failure: 0;
- mixed: 2;
- percentage eligible: true;
- observed success: 60.0%;
- grade: C (`Mixed / weak`);
- first observed: 2025-01-17;
- last observed: 2026-04-04.

The 60.0% value is a bounded five-source community-observation aggregate. It is not a universal probability for every Ultra number, number provenance, Telegram client, IP environment or geography.

## Product decision

Keep `ultra-mobile-paygo-3-2026` admitted and backstage-only. Add the exact service-evidence aggregate when canonical maintenance can be executed and tested. Do not promote Ultra Mobile PayGo based on this packet: the evidence is materially useful precisely because it shows that a cheap real-mobile route can still have Telegram-number provenance and account-risk variability.

## Canonical maintenance contract

A canonical data change should:

- add the five source records to `data/phone/v1/sources.json`;
- add the five observations to `data/phone/v1/observations.json`;
- add the five source IDs to the existing route and update its evidence-verification date;
- record one route-level evidence-density event and a current-profile snapshot preserving the separate carrier-continuity risk signals;
- rebuild derived Phone artifacts with `npm run phone:data:build`;
- run `npm run phone:data:check`, Phone regression/public-release tests, frontend production build, and a dedicated Ultra Telegram maintenance assertion;
- preserve `backstage-only`, the existing SEO/sitemap boundary, and the current route economics unless separately reverified.

## Stop conditions

Do not apply the maintenance if any of the five URLs cannot be re-opened during implementation, if a source turns out to be a duplicate/cross-post of another underlying observation, or if route provenance cannot be tied specifically to Ultra Mobile PayGo.
