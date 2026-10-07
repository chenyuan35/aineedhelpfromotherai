# Homepage Phone hero balance repair — 2026-10-07

Trigger: production screenshot at an effective ~1252px CSS viewport showed the Phone-first hero with a five-line H1 and a vertically sunken decision panel.

Root cause:

- the desktop grid reserved nearly half the 1080px shell for the right panel: `1.04fr / .96fr` plus a 64px gap;
- the H1 could grow to `5.55rem`, forcing the left message into five lines;
- centering the two columns then pulled the shorter decision panel downward relative to the headline.

Bounded repair:

- desktop columns: flexible left + fixed 480px decision panel;
- gap: 64px → 52px;
- H1 max width: 670px → 720px;
- H1 scale: `clamp(3.35rem,5.6vw,5.55rem)` → `clamp(3.25rem,5vw,4.85rem)`;
- hero minimum height/padding reduced modestly;
- existing ≤980px single-column breakpoint preserved.

Measured local result after the production build at a 1252px viewport:

- H1: **3 lines**, ~62.6px computed size;
- left copy width: **548px**;
- decision panel: **480px** wide;
- panel top: ~155px, aligned with the title block instead of sitting low in the hero.

`scripts/test-home-hero-balance.mjs` is wired into Eval Gate to prevent the old desktop proportions from silently returning.

No copy, route data, publication state, sitemap URL or Phone data boundary changes.
