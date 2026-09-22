# Reset Primary-Surface Removal — 2026-09-23

Status: **COMPLETE / PRODUCTION VERIFIED**

## Session task

Remove the existing AI Reset family from the site's primary product/discovery surfaces without deleting or redirecting the existing Reset URLs in this round.

## Why now

The Sep 23 product review concluded that deterministic/provider-visible reset pages do not justify primary product positioning, and generic Codex reset tracking is already competitively saturated. Continuing to feature Reset on the homepage and Tools index conflicted with the accepted product direction.

## Scope completed

- homepage Reset navigation, hero/job-map exposure, search suggestion/results, and featured Reset section removed;
- `/tools/` Reset and AI-quota promotional sections removed;
- public `ai.txt` / `llms.txt` preferred-entry guidance no longer promotes Reset URLs;
- Reset tracker URLs removed from sitemap promotion;
- direct Reset pages intentionally preserved.

No Reset URL was deleted, redirected, noindexed, rewritten or repurposed. No Phone or Relay product behavior was changed in this round.

## Verification

- PR #195: `Remove Reset from primary product surfaces`.
- Eval Gate #672: **PASS**.
- Latest Vercel Preview: **Ready**.
- Preview content verification confirmed homepage and `/tools/` contain no visible Reset primary section/cards and retain Phone/Relay/utilities.
- Interactive Preview QA confirmed no visible broken/empty layout after the Reset sections were removed.
- PR #195 squash-merged as `375b9c6044e93fe318378ada9b56ea3bc3e0a545`.
- Vercel production status for the merge commit: **success**.
- Apex production verification passed for `/`, `/tools/`, `/tools/phone-number-survival-guide/`, `/tools/relay-exit-risk-checker/`, and direct `/tools/cursor-usage-reset/`.
- Production homepage and Tools index no longer expose Reset as a primary product; the Cursor direct URL still resolves normally.

## Deliberately deferred

The production Phone presentation still contains legacy source-role language such as `Official rules first` / `documented carrier rules`, and the Phone page still has historical related-tool linkage into Reset. Those are separate Phone-contract issues and were not changed in this Reset-removal session.

## Next session

Run the bounded Phone canonical intent/value audit under the already accepted Phone contract:

- three fixed families: Long-term SMS/OTP, Data SIM/eSIM, Temporary SMS;
- visual decision dashboard first, Full guide on demand;
- community/forum/current user outcomes drive operational reality;
- provider/operator pages supply commercial metadata only;
- identify and queue any production copy/field/link that contradicts that contract;
- no route expansion or unrelated redesign during the audit.
