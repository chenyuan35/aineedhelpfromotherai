# Frontend Foundation Plan — 2026-09-18

Status: implementation branch only; not production-authoritative until merged and verified.

## User problem

The production frontend solves useful tasks but the page-building system is fragmented: tool cards, navigation, search entries, metadata and visual patterns are repeated across hand-authored HTML and generator scripts. This increases decision cost for users and maintenance cost for every future improvement.

## MVP scope

Establish one reusable Astro foundation without redesigning the measuring homepage or the shipped Phone Radar shell.

MVP deliverables:

- one typed Tool Registry containing the current public tool inventory;
- one Astro `/tools/` directory page generated from that registry;
- reusable site shell, navigation, footer, tool-card and tool-search components;
- one shared design-token/style layer for the new foundation;
- preserve all existing public tool URLs and `/tools/` canonical URL;
- client-side search only; no backend or account state.

## Explicit non-goals

- no homepage redesign;
- no Phone Radar redesign;
- no Relay Exit Risk redesign;
- no new product surface;
- no new canonical URLs;
- no framework migration of all production pages in one release;
- no database, search service, authentication or paid dependency;
- no visual-theme marketplace/template dependency.

## Technical approach

Use the repository's existing Astro 7 + Tailwind 4 workspace as the long-term rendering foundation. Keep the first implementation isolated from the legacy Astro "Failure Memory" pages so production behavior cannot change accidentally.

The Tool Registry is the source for `/tools/` rendering and client-side search. Later migrations may reuse the same registry for homepage search, related tools and sitemap generation after separate verification.

## File/module boundaries

- `frontend/astro/src/data/tools.ts` — typed public tool inventory and categories.
- `frontend/astro/src/layouts/SiteLayout.astro` — current utility-site document shell.
- `frontend/astro/src/components/site/SiteNav.astro` — current site navigation.
- `frontend/astro/src/components/site/SiteFooter.astro` — current site footer.
- `frontend/astro/src/components/tools/ToolCard.astro` — reusable directory card.
- `frontend/astro/src/components/tools/ToolSearch.astro` — local search UI.
- `frontend/astro/src/pages/tools/index.astro` — sample migrated `/tools/` page.
- `frontend/astro/src/styles/foundation.css` — design tokens and shared foundation components.

Legacy production generators remain untouched in this first branch.

## Persistence and API

None. Search and filtering run in the browser. No user input is transmitted or stored.

## Page flow

`/tools/` opens with:

1. clear purpose and search;
2. primary Phone Radar route;
3. Reset Radar tools;
4. Relay Exit Risk;
5. secondary browser utilities.

Search narrows the visible registry cards without changing URLs or creating thin filtered pages.

## Privacy and security

No account, phone number, OTP, credential or identity-document collection. No new third-party runtime dependency is required for the page itself.

## Deployment

Normal flow only: branch → build/test → PR → CI/Vercel Preview → merge → production verification. The first PR is foundation work; production cutover of `/tools/` should occur only after preview parity checks.

## Logging and analytics

Do not add a new analytics stack. Existing site behavior events remain the standard. When the Astro page is promoted to production, `tool_open` and search interaction behavior must be preserved or explicitly mapped before cutover.

## Test strategy

Before any production cutover:

- Astro production build succeeds;
- `/tools/` renders as static output;
- all registry URLs are unique and trailing-slash canonical paths;
- every current public tool route appears exactly once in the registry;
- search works with title/category/keywords;
- mobile layout has no horizontal overflow;
- one H1, correct title/description/canonical and CollectionPage schema;
- no changes to homepage or Phone canonical output in the same release.

## Rollback

Until explicit cutover, rollback is deleting/closing the branch. After a future cutover, the previous checked-in `frontend/tools/index.html` and production build path remain the rollback target until the legacy generator is deliberately retired.

## Operating cost

No additional recurring infrastructure cost. Static rendering and browser-side search only.

## Success / stop criteria

Success for this foundation is architectural: one registry can render the tool directory without duplicated inventory data, preview parity is acceptable, build remains static and no product behavior changes.

Stop or revise if the foundation requires a backend, materially worsens page speed, changes canonical URLs, or forces homepage/Phone redesign before data justifies it.
