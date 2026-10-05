# Red Pocket eBay $30 / 360-day route review — 2026-10-05

Decision: **ADMIT-BACKSTAGE as a distinct atomic route**.

User task: keep a real U.S. mobile number at very low annual cost for calls/SMS and occasional verification use.

Why this is distinct from `redpocket-annual-2026`:
- the official RedPocket eBay store currently sells a separate **$30 / 360-day** Starter Plan with unlimited talk/text and 200MB every 30 days;
- the listing exposes physical SIM, eSIM, and renewal/existing-SIM choices and identifies the included starter SIM as GSMA/AT&T;
- the existing canonical `redpocket-annual-2026` is the website Essentials product at a current $80 first-year promotion and $110 renewal with 3GB/month;
- price, allowance, channel, renewal mechanism and roaming treatment are materially different, so keeping both in one canonical row would hide decision-relevant differences.

Evidence boundary:
- RedPocket official help says annual plans run 360 days and eBay purchases use an activation PIN.
- RedPocket official help says SIM/eSIM activation can only be completed in the U.S.
- RedPocket official help supports Wi-Fi Calling with SMS, but device/account provisioning still matters.
- RedPocket official roaming help explicitly says eBay plans, including GSMA eBay plans, do **not** include roaming. 2026 community reports show some $30-plan accounts temporarily displaying roaming buckets that changed over time; treat that as unstable/unpromised behavior, not a guaranteed feature.
- No exact route + named app + operation sample reaches the service-percentage gate. Do not publish an OTP success percentage.

MVP / non-goals:
- add one backstage canonical route plus a dedicated brand identity on existing `att-us` network;
- clean the existing Essentials route so it no longer mixes eBay $30 economics into the website annual product;
- no public route page, no sitemap entry, no ranking/recommendation promotion, no new backend/API.

Re-open/publication triggers:
- exact service-specific observations mature independently; or
- Search Console/user behavior supports publication and current product terms remain reproducible.
