# Core Progress Audit — 2026-09-28

Status: AUDIT COMPLETE / RECONCILIATION REQUIRED

This is a bounded audit of project control state, current `main`, verified production, Search Console evidence, and open PR #258. It does not authorize a production rollback by itself.

## Executive finding

The project has made substantial engineering and research progress, but the Phone Radar public-release control plane has diverged from the canonical project plan.

Canonical docs on `main` still define the public Phone product as an evidence-gated UK pilot whose public surface should remain stable while backstage evidence is accumulated. Verified production now exposes a global Phone surface with 135 routes across 83 markets plus route, market, keep-alive, guide, and directory URL families.

The current problem is therefore not lack of output. It is loss of alignment between:

- product-value/evidence gates;
- canonical project facts and execution queue;
- what was actually merged to `main`;
- what production exposes to search engines;
- what current measurement can support.

Until this is reconciled, do not continue broad public Phone expansion.

## Verified control-plane conflict

Current canonical rules still say:

- Phone Radar is not a carrier encyclopedia or mass-generated SEO directory;
- improve the existing comparison surface first;
- publish separate route pages only when they have substantial route-specific execution value and independent operational evidence;
- no country/provider doorway families;
- public expansion remains measurement-gated;
- the settled Phone sample was too small to justify public change;
- the queued task was backstage-only admission of Tello / ClubSIM / Hotlink Pantas.

Verified `main` and production no longer match that contract.

Recent commits after the 2026-09-26 checkpoint expanded the public Phone surface to 135 routes / 83 markets. Production currently exposes an indexable global directory, market pages, route pages, keep-alive pages, and guide pages. PR #258 reports a fresh public build of 328 URLs.

Previously frozen/rework Phone research PRs were also merged during the expansion period even though the canonical queue still describes those inputs as unaccepted/frozen or not mergeable in their prior form.

## Product-value review

The underlying Phone Radar thesis remains strong: users benefit from reconciling fragmented acquisition, retention, KYC, roaming, OTP/SMS, incident, recovery, and current community evidence.

The global public implementation does not consistently meet that thesis yet.

### Representative production sample: A1 B.free Austria

The public route page is `index,follow` but states:

- start cost: not established;
- keep/year: not established;
- keep interval: not established;
- SMS: unverified;
- OpenAI/Telegram/WhatsApp observations: none;
- refund/recovery: not reconciled;
- one provider source only.

This is an observation candidate, not an evidence-rich execution page. Publishing this class of route as an independent search URL conflicts with the route-page gate.

### Representative production sample: ClubSIM

The live page presents `HKD 6 / year` and labels the route `Candidate — evidence captured` / `Trend: stable`.

The reviewed backstage packet correctly preserves a known availability conflict: the HKD 6 web listing existed while July 2026 users reported that option missing in-app with HKD 15 alternatives. That conflict must not be flattened into an unconditional guaranteed annual price.

The live page therefore overstates certainty relative to the reviewed evidence.

### Representative production sample: Globe Prepaid

The live Globe route is indexable and presented as `Candidate — evidence captured` / stable, with PHP 10/year retention and a usable acquisition/registration workflow.

Earlier canonical admission work kept Globe on HOLD because foreign-national eligibility and the end-to-end qualified-foreigner acquisition/OTP path were not sufficiently reproduced for general Phone Radar admission. The live page therefore needs reclassification/reconciliation before it should be treated as an approved route.

The live Globe source block also labels two entries as different source roles while both point to the same provider URL. This fails the intended separation between provider-controlled facts and independent operational evidence.

## SEO / growth evidence

Current Search Console evidence does not justify the global URL expansion yet.

Fresh Phone-path data for 2026-09-20 through 2026-09-27 shows only the canonical Phone URL receiving impressions:

- 2026-09-21: 1 impression, 0 clicks, position 9;
- 2026-09-23: 2 impressions, 0 clicks, average position 13.5;
- 2026-09-25: 1 impression, 0 clicks, position 5.

No newly expanded route/market/directory URL appeared in the current Phone-path GSC rows at audit time.

The global expansion therefore has no demonstrated search payoff yet, while it has already increased the indexable footprint by hundreds of URLs and invalidated the clean UK-pilot measurement baseline.

Do not interpret this as proof the global concept can never work. It means the current evidence is insufficient to justify continuing the expansion before quality and measurement are reconciled.

## Measurement state

Production contains GA4 measurement ID `G-FYKKNKRE58` and behavior events including `home_job_select`, `tool_open`, and `tool_action`.

Windsor.ai is authorized to GA4 property `553896884` (`aineedhelpfromotherai`), but GA4 reads returned zero rows over 7-day, 30-day, and 1-year windows during the previous measurement audit. Search Console remains readable.

Therefore current product-engagement measurement is incomplete. Broad public expansion should not be justified using interaction data until the GA4 property/data-stream/read-path mismatch is resolved.

## Engineering review

Engineering progress is substantial:

- normalized Phone data foundation exists;
- reviewed-packet importer exists;
- source/provenance structures exist;
- Astro static generation exists;
- route/search/directory artifacts are generated;
- production deployment is healthy;
- PR #258 correctly identifies that Eval Gate must use Node 24 for the current Astro build;
- PR #258's Tello / ClubSIM / Hotlink reviewed packets preserve important audited corrections and are appropriate backstage inputs.

The main engineering weakness is release governance rather than raw implementation capability. Public expansion commits were merged faster than product/evidence gates, tests, canonical docs, and measurement could keep up.

## PR #258 review

Disposition at audit time: **HOLD AS DRAFT / SPLIT BEFORE MERGE**.

Good parts that should be preserved:

1. reviewed-packet backstage ingestion for Tello / ClubSIM / Hotlink;
2. Tello stale `$0.06/year` refutation;
3. ClubSIM price/availability conflict preservation;
4. Hotlink RM30/365-day retention correction;
5. Eval Gate Node 20 → 24 alignment;
6. semantic hold-page assertion is preferable to a brittle exact-copy assertion.

Problematic coupling:

- the PR treats the 135-route / 83-market public universe as the accepted baseline while that baseline itself is under audit;
- it backfills 95 `unknown` retention placeholders primarily to make the current global catalog satisfy completeness tests;
- its queue patch would mark the backstage task complete without first recording the higher-priority public-surface governance conflict.

PR #258 was converted back to Draft during this audit. Do not merge it unchanged. The clean next move is to split reusable CI/backstage improvements from any change that entrenches the unreviewed global-public baseline.

## Progress assessment

### Strong / worth preserving

- Phone Radar product thesis and user job;
- normalized data/research pipeline;
- evidence acquisition and reviewed-packet direction;
- static-site engineering and maintainability work;
- Search Console connection;
- GA4 instrumentation already present;
- ability to research many markets quickly backstage.

### Weak / unproven

- organic growth: still very small;
- global route-page demand: not yet demonstrated in GSC;
- repeat use / interaction: cannot yet be read reliably from GA4;
- many public global pages: not evidence-rich enough to justify independent URLs.

### Failed control

- canonical docs and production no longer describe the same product;
- measurement gate was bypassed by broad public expansion;
- previously frozen/rework research was merged into the public catalog path;
- tests/CI lagged behind the production architecture;
- at least sampled public pages flatten known conflicts or misrepresent source independence.

## Required next bounded task

**Phone public-surface reconciliation.**

Do not mass-delete impulsively. First classify the current public URL families and routes using the existing Product Value Gate and Phone publication gate.

Required outputs:

1. inventory current indexable Phone URL families and counts;
2. classify each family as KEEP / HOLD-NOINDEX / REMOVE-FROM-SITEMAP / CONSOLIDATE / RESEARCH-FIRST;
3. audit a representative sample of candidate and observation routes for source-role correctness, conflict visibility, execution value, and independent evidence;
4. explicitly reconcile Globe and ClubSIM against their reviewed evidence;
5. decide which global data may remain public inside the directory/index without earning a separate route URL;
6. restore a CI contract that tests the accepted publication boundary instead of merely matching the current catalog size;
7. update `PROJECT_CONTEXT.md`, `docs/MASTER_PLAN.md`, and `docs/CURRENT_EXECUTION_QUEUE.md` to the accepted baseline;
8. only then resume normal backstage ingestion and evidence-gated publication.

After that reconciliation, resolve the GA4 property/data-stream read path and resume cohort-based Search Console decisions.

## Stop conditions

Until the reconciliation task is complete:

- no additional global route/market URL families;
- no bulk publication of observation/unknown routes;
- no merge of PR #258 in its current coupled form;
- no mass rollback/deletion without URL-by-URL/family SEO and redirect review;
- backstage evidence acquisition may continue;
- production stability fixes and clearly isolated CI fixes may proceed when independently reviewable.
