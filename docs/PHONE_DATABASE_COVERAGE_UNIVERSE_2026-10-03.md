# Phone Radar database coverage universe — 2026-10-03

Status: **REVIEWED COVERAGE CHECKPOINT / BACKEND-ONLY / NO PUBLICATION EFFECT**

This document defines the denominator behind the project's `90%+` Phone database objective. It does **not** claim coverage of 90%+ of every mobile carrier, prepaid product, MVNO or phone-number product worldwide.

## Coverage metric

`coverage = canonical atomic Phone routes / (canonical atomic Phone routes + qualified unresolved atomic candidates)`

A route enters this denominator only when it is:

- a persistent real-number / mobile-number route relevant to acquisition, retention, verification or recovery;
- an atomic identifiable product/route rather than a market/provider cluster;
- supported by independent community operational or demand evidence;
- identifiable from current provider/regulator evidence even when lifecycle facts remain HOLD;
- deduplicated against existing canonical identities, renamed products and same-product aliases.

Pure data eSIM, temporary-SMS services, generic archetypes, unbounded provider enumeration and unresolved products whose real-mobile identity is not established do not enter this denominator.

## Post-DB-C22 checkpoint

After PR #366 and PR #367:

- canonical atomic Phone routes: **154**;
- markets: **86**;
- brands: **151**;
- networks: **115**;
- sources: **587**;
- qualified unresolved atomic candidates: **3**;
- reviewed evidence-backed atomic universe: **157**;
- coverage: **154 / 157 = 98.1%**.

Public publication remains separate at **135 comparison routes / 3 explicit indexable routes / 31 sitemap URLs**.

## Residual qualified candidates

1. **LuckySIM Hong Kong** — current provider material establishes a Hong Kong phone number, voice/SMS/eSIM and recharge validity extensions; independent operational evidence remains weaker than the admitted/HOLD routes, so it stays unresolved.
2. **HK Mobi / csl Hong Kong** — current provider material establishes 365-day card validity and promotional HKD20+ recharge extensions of 365 days through 2026-12-31; community evidence supports current keep-number use, but product/promotion reconciliation remains to be reviewed as one atomic packet.
3. **China Telecom Macau blue-card route** — current provider material establishes Macau prepaid eSIM/voice/SMS and real-name mechanisms; 2026 community evidence describes the blue-card route and six-month recharge retention, but the exact current first-party lifecycle for that named product still needs reconciliation.

These three are watchlist/review candidates, not publication commitments.

## Reconciliation of the old staging inventory

`data/phone/staging/global-inventory-2026-09-26.jsonl` contains 59 historical rows. At the DB-C22 checkpoint:

- **37** have the same route ID in canonical;
- the remaining 22 are not 22 database gaps;
- **8** are already represented by canonical routes under a normalized identity/alias or later route ID (including Sakura Mobile, AIS, haha SIM, Globe, One NZ, Skinny, Lyca UK and RedPocket);
- **4** are data-only / Data-eSIM records intentionally handled outside Phone canonical;
- **9** are non-atomic clusters, generic archetypes, temporary-SMS references or otherwise outside the primary persistent-number route scope;
- **1** is a genuine unresolved atomic staging route: LuckySIM Hong Kong.

Fresh community-led gap research added HK Mobi and China Telecom Macau blue card to the qualified unresolved set. eSIM.GG and Saily US number offerings are not counted until their persistent real-mobile / host-network identity is sufficiently established for this Phone contract.

## Stop and reopen rule

Because the reviewed evidence-backed atomic universe is above the **90%** objective, proactive database expansion by broad provider enumeration stops here.

Continue only:

- append-only evidence refreshes and lifecycle corrections for existing routes;
- bounded review of the three residual qualified candidates when evidence is sufficient;
- genuinely new community-led atomic routes that pass the same denominator rules;
- separate Data-eSIM evidence intake under `data/esim`;
- publication/indexability decisions only through their own Search Console/evidence gates.

A future route discovery can expand the denominator; the percentage is therefore a dated project coverage checkpoint, not a permanent global-completeness claim.
