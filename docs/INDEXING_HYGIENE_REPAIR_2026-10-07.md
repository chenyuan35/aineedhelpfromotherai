# Indexing hygiene repair — 2026-10-07

Trigger: two new Google Search Console notification emails for `aineedhelpfromotherai.com` reported (1) sitemap-discovered `404 Not Found` URLs and (2) `Indexed, though blocked by robots.txt`.

Verified production facts before repair:

- Live `/sitemap.xml` contains **31 URLs** and every current sitemap URL returns **HTTP 200**.
- Live `robots.txt` allowed public pages but blocked all `/api/` paths and `/mcp`.
- The current TikTok publisher exposed `/api/tiktok/auth` as a normal anchor from an indexable sitemap page. The TikTok API responses already carry `X-Robots-Tag: noindex`, but the blanket robots block prevented crawlers from seeing that directive.
- Legacy main-domain `/api/mcp/` and `/mcp/` currently return **404** and have external historical references. Blocking those paths prevents crawlers from observing the terminal 404 state.
- Current old Reset direct URLs that were previously in the sitemap still return **200**.
- Exact affected-URL examples could not be fetched from the GSC report because the connected GSC Wizard trial is no longer active; no paid upgrade was made.

Repair:

- keep generic `/api/` crawling blocked;
- selectively allow `/api/tiktok/` so its existing `X-Robots-Tag: noindex` can be observed;
- selectively allow legacy `/api/mcp` and stop blocking `/mcp` so Google can observe their 404 state and remove stale index entries;
- preserve `/api/docs` as a specific crawlable exception rather than letting the blanket API rule hide its state;
- change the TikTok Connect control from a crawlable `<a href="/api/tiktok/auth">` to a same-tab button that navigates only on user click;
- add `scripts/test-indexing-contract.mjs` and run it inside Eval Gate after the production frontend build. It verifies every sitemap URL has a built HTML target, API/MCP routes never enter the sitemap, robots exceptions remain coherent, and the OAuth endpoint is not exposed as a crawlable anchor.

This repair does not add public URLs, change Phone publication, or broaden the sitemap. The publication boundary remains **31 sitemap URLs**.
