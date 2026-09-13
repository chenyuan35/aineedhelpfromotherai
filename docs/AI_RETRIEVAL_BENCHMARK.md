# AI Retrieval Benchmark

Last updated: 2026-09-13

Purpose: measure whether AI-native web search/retrieval systems can discover, retrieve, and extract the current utility pages. This is a separate signal from Google indexing. Do not infer success from crawler eligibility alone.

Primary test page:
- https://aineedhelpfromotherai.com/tools/cursor-usage-reset/

## Why this matters

Agent search is usually a pipeline rather than a single ranking step:

1. discover/crawl a URL;
2. parse and index the document;
3. represent/query it semantically or lexically;
4. rank or rerank candidate pages;
5. extract a small set of query-relevant chunks/highlights to fit the model context budget;
6. let the downstream model choose which retrieved sources to use or cite.

A page can therefore be perfectly readable when its URL is known but still fail to appear in search because discovery/indexing/ranking is weak. Measure those stages separately.

## Provider notes

### Exa

Current public Exa documentation says it crawls the web, parses documents, represents documents with learned embeddings for semantic retrieval, updates its index frequently, and can return query-focused highlights to reduce context tokens. It also supports live crawling when a URL is already known.

Implication for us: semantic completeness, clean extractable text, stable canonical URLs, freshness, external discovery, and high-quality domain signals all matter. Repeating a keyword is not enough.

### Tavily

Current public Tavily documentation describes an AI-agent search pipeline that searches, scrapes, filters, scores and ranks relevant sources, then returns semantically relevant chunks or summaries for LLM consumption. Deeper modes trade more latency/compute for higher relevance.

Implication for us: the page must first enter the candidate set, then contain self-contained answer chunks that survive semantic reranking and token-budget extraction.

## Baseline — 2026-09-13

### Exa discovery tests

| Test | Result | Interpretation |
|---|---|---|
| Natural-language intent query describing a page that answers when Cursor usage resets, cites official sources and provides a countdown/calculator | `aineedhelpfromotherai.com` did not appear in the top 10 returned results | Discovery/index/ranking gap |
| Query for the exact concept/title `Cursor Usage Reset Calculator` on our domain | Direct utility page did not appear in the top 5 returned results | Page is not yet competitive/discoverable in Exa search |
| Known-URL fetch of the Cursor page | PASS — Exa extracted the page cleanly, including the quick answer, last-verified section, reset instructions, two-pool explanation and FAQs | Extraction/readability is good once the URL is known |
| Domain-oriented search for our utility site | A GitHub repository result appeared, but the direct utility site still did not appear in the top 10 and the GitHub snippet reflected stale legacy AI-debugging positioning | External discovery surface exists, but cached/legacy metadata can mislead retrieval |

Conclusion: the current bottleneck is not that AI search tools cannot read the Cursor page. They can. The bottleneck is candidate discovery/indexing/ranking and stale external representations.

### Tavily baseline

Tavily AI was connected on 2026-09-13 so it can be added to the same benchmark. Do not record a Tavily pass/fail until an actual search/extract run has been executed and captured here.

## Retrieval-ready page pattern

For pages we want AI agents/search tools to surface:

- direct answer in the first meaningful section;
- exact entity/product and user job stated in natural language;
- question-style headings that each make sense as an isolated chunk;
- one or two concise factual sentences before long explanation;
- primary-source links for changing rules;
- explicit last-verified date for time-sensitive facts;
- stable canonical URL and internal links;
- unique first-party utility such as a calculator, countdown, local-state helper, comparison or reproducible example;
- no important answer hidden only in client-side interaction;
- external corroboration from relevant websites/repos/communities.

## Machine-readable discovery files

The repository previously contained legacy `llms.txt` / `ai.txt` files describing the old AI-debugging product, and the current static build did not copy those files into `frontend/dist`. This was an AI-retrieval consistency defect.

PR #32 fixed it by:

- rewriting root and frontend `llms.txt` for the utility-site mission and all current tool URLs;
- rewriting root and frontend `ai.txt` with current retrieval/citation guidance;
- changing the production build to ship `/llms.txt` and `/ai.txt` at the site root.

Production verification on 2026-09-13:
- Vercel preview/status passed and PR #32 merged.
- A cache-busted fetch of `https://aineedhelpfromotherai.com/llms.txt?v=20260913-32` returned the new utility-site content.
- A cache-busted fetch of `https://aineedhelpfromotherai.com/ai.txt?v=20260913-32` returned the new retrieval/citation content.
- Exa's normal cached fetch of `/llms.txt` still returned the previous AI-debugging version immediately after deployment, while `/ai.txt` returned the new version. This is direct evidence that provider caches can lag production and that we must distinguish live origin state from provider-index/cache state.

These files are supplemental discovery hints, not a ranking shortcut. The main ranking/discovery work remains useful pages, crawlability, indexing, external references, freshness and relevance.

## Benchmark protocol for future executors

Run the same small test set instead of ad-hoc searching:

1. Intent query: describe the ideal answer page without naming our domain.
2. Exact-concept query: use the tool/entity name and user job.
3. Domain query: describe the domain and relevant utility family.
4. Known-URL extraction: fetch the canonical URL directly.
5. Record rank/top-N presence, extracted snippet quality, freshness and any stale competing representation.
6. When checking deployment freshness, compare canonical cached retrieval with a cache-busted/live retrieval where the provider permits it; never mistake a stale retrieval cache for a failed deployment.

Providers to test when available: Exa, Tavily, Google/Bing, ChatGPT Search, Perplexity or other agent-search surfaces actually used by the workflow.

Do not optimize to a single provider from one run. Look for repeatable failure patterns across providers.

## Next actions

1. Allow the corrected discovery files and external authority signals time to propagate through provider indexes/caches; do not repeatedly rewrite them.
2. Continue earning relevant external references to the Cursor page; this addresses the current discovery/ranking bottleneck more directly than adding more machine-readable files.
3. Re-run the Exa/Tavily benchmark after propagation and compare against this baseline.
4. Track AI-assistant referral sessions/citations separately from search-tool retrieval presence.
5. Fix the public GitHub repository description/topics when a repo-metadata write path is available; the repository currently still exposes legacy AI-debugging metadata even though the README was corrected.
