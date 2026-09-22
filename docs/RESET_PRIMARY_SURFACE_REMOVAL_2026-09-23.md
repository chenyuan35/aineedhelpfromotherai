# Reset Primary-Surface Removal — 2026-09-23

Status: **IN PROGRESS**

## Session task

Remove the existing AI Reset family from the site's primary product/discovery surfaces without deleting or redirecting the existing Reset URLs in this round.

## Why now

The Sep 23 product review concluded that deterministic/provider-visible reset pages do not justify primary product positioning, and generic Codex reset tracking is already competitively saturated. Continuing to feature Reset on the homepage and Tools index would conflict with the accepted product direction.

## Scope

This round may change only the primary exposure layer:

- homepage navigation, hero/job map, search suggestions and Reset feature section;
- `/tools/` primary listing/positioning;
- public `ai.txt` / `llms.txt` preferred-entry guidance;
- sitemap promotion of Reset URLs.

Existing Reset pages remain directly reachable. This round does not delete, redirect, noindex, rewrite, repurpose, or redesign any Reset page.

Phone and Relay product content is otherwise frozen in this round. In particular, the separate Phone copy/source-role issue discovered during review is not repaired here.

## Verification checklist

1. Production build succeeds.
2. Homepage has no Reset primary navigation, hero CTA, job-map item, featured Reset section, Reset search suggestion, or Reset search results.
3. `/tools/` has no Reset/AI-quota promotional sections.
4. Public `ai.txt` and `llms.txt` no longer promote Reset URLs as preferred entry points.
5. Sitemap no longer promotes the six Reset tracker URLs.
6. Direct Reset URLs still build and return 200.
7. Phone canonical and Relay Exit Risk still build and return 200.
8. No unrelated Phone/Relay content change is introduced.
9. Vercel Preview and Eval Gate pass before merge.
10. After merge, verify the apex homepage, `/tools/`, Phone, Relay, and at least one old Reset direct URL.

## Stop conditions

Stop rather than expanding scope if safe removal requires URL deletion/redirect/noindex decisions, changes to Phone/Relay product behavior, or another independent redesign.
