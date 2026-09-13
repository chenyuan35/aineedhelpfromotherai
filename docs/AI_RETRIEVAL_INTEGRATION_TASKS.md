# AI Retrieval Integration Workstream

Last updated: 2026-09-13

Purpose: make `aineedhelpfromotherai.com` naturally discoverable, retrievable and citable by AI-native search/retrieval systems such as Exa, Tavily, ChatGPT Search, Perplexity and similar agent-search stacks.

This workstream is explicitly non-adversarial. The goal is not to bypass, manipulate, exploit or "crack" ranking/retrieval systems. The goal is to publish pages that fit the legitimate signals these systems are designed to reward: crawlability, relevance, semantic clarity, freshness, trustworthy sourcing, useful first-party functionality, stable canonical URLs and independent external corroboration.

## Execution rule

Work through this list in order. Do not skip forward merely because a later task is easier. A task can be marked `DONE` only when its observable exit condition is verified. If a task is waiting on propagation/data, mark it `WAITING` rather than repeatedly changing the site. If an external provider blocks execution because of quota/account/tool availability, record it as `BLOCKED` and do not pay, upgrade, or alter billing without explicit user approval.

## Ordered task list

| ID | Task | Status | Exit condition |
|---|---|---|---|
| AIR-0 | Establish the non-adversarial integration principle and durable workflow | DONE | This task file exists; project docs explicitly say optimize for provider-aligned retrieval rather than exploits |
| AIR-1 | Establish provider benchmark methodology and baseline | BLOCKED | Same intent/exact-concept/domain/known-URL test set exists; Exa baseline is recorded; Tavily baseline is recorded when provider quota permits a real run |
| AIR-2 | Fix machine-readable identity/discovery consistency | DONE | Production `/llms.txt` and `/ai.txt` describe the current utility site and are shipped by the build; fresh retrieval verified |
| AIR-3 | Align external public identity surfaces | BLOCKED | GitHub repository description/topics and other public metadata no longer present the legacy AI-debugging product; requires an available metadata write path or manual UI action |
| AIR-4 | Build legitimate external corroboration around the Cursor page | ACTIVE | At least one independently verified relevant mention/link/citation exists; outreach results are logged, not merely sent |
| AIR-5 | Allow provider caches/indexes to propagate, then rerun Exa + Tavily | WAITING | Repeated benchmark after propagation records discovery rank/presence, extraction quality and cache freshness for both providers where available |
| AIR-6 | Diagnose the failing retrieval stage from evidence | WAITING | We can state whether the remaining bottleneck is crawl/discovery, semantic candidate retrieval, reranking, chunk extraction, freshness/cache, or authority, based on repeated provider results |
| AIR-7 | Optimize the Cursor page only for the measured failing stage | WAITING | One evidence-backed page change ships only if benchmark data shows a page-level weakness; no speculative keyword stuffing or provider-specific cloaking |
| AIR-8 | Measure downstream AI-assistant visibility | WAITING | GA4/GSC Wizard assistant referrals and Bing/Google AI citation/visibility reports are reviewed once settled data exists |
| AIR-9 | Replicate the proven pattern to exactly one second indexed page | WAITING | A second page is selected from actual search/retrieval evidence and receives the same evidence-first treatment |
| AIR-10 | Decide whether to scale the workstream | WAITING | Search impressions, provider discoverability, referrals/citations and external authority show a repeatable gain; otherwise revise the model before expanding |

## Provider-aligned optimization model

Treat AI-native retrieval as a pipeline and diagnose stages separately:

1. **Discovery / crawl** — can the provider find and fetch the canonical URL?
2. **Parsing / indexing** — is the important answer visible in ordinary server-rendered text and represented correctly?
3. **Candidate retrieval** — does the page enter the semantic/lexical candidate set for a real user query?
4. **Ranking / reranking** — does it beat competing pages on relevance, quality, freshness and authority?
5. **Chunk extraction** — can a small context-budget chunk preserve the direct answer, evidence and useful distinction?
6. **Downstream citation/use** — does the assistant actually use or cite the retrieved page?

Do not infer one stage from another. A known-URL extraction pass does not mean search discovery works; a crawlable page does not mean it ranks; a provider search hit does not mean ChatGPT/another assistant will cite it.

## Rules for page changes

- Answer the user job directly near the top.
- Use natural entity + task language, not artificial repetition.
- Keep important factual claims in plain text, not only inside interactive UI.
- Use question-style headings only when they match real user intent.
- Link changing rules to primary official sources and show a last-verified date.
- Preserve stable canonicals and consistent internal links.
- Keep unique first-party utility that a generic summary cannot replace.
- Prefer independent relevant references over directory spam or paid links.
- Never create provider-specific hidden text, cloaking, fake citations, fabricated freshness, synthetic backlinks, or deceptive metadata.

## Measurement record

Primary benchmark: `docs/AI_RETRIEVAL_BENCHMARK.md`.
Authority/outreach ledger: `docs/AUTHORITY_AND_AI_DISCOVERY.md`.
Project priority/status: `docs/MASTER_PLAN.md` and `PROJECT_CONTEXT.md`.

For each provider rerun, record:
- query class;
- top-N presence/rank;
- which URL/representation appeared;
- extracted/highlighted answer quality;
- freshness/cache state;
- whether the provider returned a stale external representation;
- resulting next action.

## Current checkpoint

Completed:
- AIR-0: non-adversarial/provider-aligned principle formalized.
- AIR-2: current utility `llms.txt`/`ai.txt` deployed and fresh retrieval verified.
- Exa portion of AIR-1: known-URL extraction passes; natural-language and exact-concept discovery remain weak in the recorded baseline.

Current blockers / work:
- AIR-1: a real Tavily baseline was attempted on 2026-09-13 with the connected Tavily search tool. The provider returned HTTP 432 / plan usage limit before executing the search. This is a provider quota blocker, not a search result. Do not upgrade or change billing without explicit user approval.
- AIR-3: repository description/topics still need a metadata write path or manual UI action.
- AIR-4: legitimate external corroboration remains active through the small, relevant Cursor authority/outreach program. The first three emails remain inside their 5–7 day response window and must not be resent. A second candidate batch has been researched (Learn Cursor, explainx.ai, QuotaMeter and Cursor Usage Tracker), prior Gmail correspondence was checked, and no new message was sent; hold this batch until the first-round threads are inspected.
- AIR-5: intentionally waiting for provider propagation rather than triggering repeated speculative rewrites.
