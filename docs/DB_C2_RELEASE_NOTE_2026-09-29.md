# DB-C2 release note — 2026-09-29

Status: **PR REVIEW / BACKEND ONLY**

- 12 legacy-only comparison routes normalized through reviewed packets.
- Disposition: **10 ADMIT-BACKSTAGE / 2 HOLD / 0 REJECT**.
- Canonical database: **65 → 77 routes**.
- Markets: **42 → 47**.
- Sources: **230 → 264**.
- Comparison↔canonical route-ID overlap: **54 → 66**.
- Legacy-only comparison routes: **81 → 69**.
- Comparison artifact remains **135 routes**.
- Explicit indexable routes remain **3**.
- `truemove-validity-pack-th-2026` and `claro-pre-br-90d-2026` are retained as HOLD rows with uncertainty/community provenance preserved.
- No route-page, market-page, sitemap, ranking or SEO publication expansion is authorized by DB-C2.
- Merge remains gated on the latest Eval Gate and Vercel Preview succeeding.

Local and one-shot importer verification passed `npm run phone:data:check`; full local Phone/public release verification also preserved 135 comparison routes and 3 route detail pages.
