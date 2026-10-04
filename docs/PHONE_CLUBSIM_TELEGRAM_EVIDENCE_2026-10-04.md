# ClubSIM Telegram Evidence Density Maintenance — 2026-10-04

Status: reviewed data-maintenance packet for the existing canonical route `clubsim-sms-pack-6hkd-2026`.

## Why this route

ClubSIM is one of the lowest-cost long-term real-mobile routes in the canonical data: current normalized entry cost HK$50 and keep cost HK$6 per 365 days. Before this maintenance pass it had no normalized service observations, so its low price could not answer the user question "does this actually work for verification?"

## Telegram evidence normalized

Seven distinct dated community thread URLs were reviewed and normalized for the exact route + Telegram + registration-verification operation:

- 2024-03-21 Shuzijumin: success.
- 2024-04-12 V2EX: failure while roaming in mainland China.
- 2025-02-19 Linux.do: failure in mainland China; WhatsApp was reported working in the same post but is not counted in the Telegram aggregate.
- 2025-11-01 V2EX: failure; the reporter said Telegram verification worked after moving the number to another carrier.
- 2026-07-29 Naixi thread: mixed/conflicting ClubSIM Telegram outcomes, including a success report and a 9-prefix failure report; normalized conservatively as one mixed thread-level observation.
- 2026-09-18 Naixi: success report for Telegram registration.
- 2026-09-18 V2EX: failure under Wi-Fi/proxy conditions followed by success after switching to ClubSIM roaming data without proxy; normalized as mixed/conditional.

Generated aggregate after dedupe: **n=7 / 7 distinct source records / 2 success / 3 failure / 2 mixed / observed success 28.6% / grade C (Mixed / weak)**. This percentage is a bounded community-observation aggregate, not a universal probability for every ClubSIM number, prefix, client, location or IP environment.

## Product decision

Keep the route `admitted` but `backstage-only`. Do not promote it to a Top recommendation merely because it is cheap. The new evidence materially improves the database because users can now see that the HK$6/year route has weak/mixed Telegram verification behavior. No SEO URL or sitemap state changes.
