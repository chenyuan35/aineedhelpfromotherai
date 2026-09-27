# Measurement Layer Audit — 2026-09-27

## Scope

Bounded audit of the site's current measurement stack after the project-instruction cleanup. No public product/content change is authorized by this document.

## Verified production state

Production HTML at `https://aineedhelpfromotherai.com/` was fetched through the connected Vercel project and returned HTTP 200.

The live page contains Google Analytics 4 measurement ID:

- `G-FYKKNKRE58`

The production build also injects behavior instrumentation that emits these GA4 events when applicable:

- `home_job_select`
- `tool_open`
- `tool_action`

Therefore the site is **already instrumented for GA4 page/session measurement and basic behavior events**. Do not add a second analytics product merely because the current ChatGPT session cannot yet read the GA4 property.

## Current read paths

### Google Search Console

Windsor.ai currently has a readable Search Console connection for:

- `sc-domain:aineedhelpfromotherai.com`

This path successfully returned current Search Analytics data in the same session. Search Console remains the Google-organic measurement source for impressions, clicks, CTR, position, queries and pages.

### Google Analytics 4

The production tag exists, but the currently connected in-chat readers do not yet provide a usable GA4 read path:

- Windsor.ai `googleanalytics4` is available but not yet connected;
- the older GSC Wizard account returned `payment_required`;
- the newly connected GSC Wizard small account currently has no registered Search Console properties and has not granted Google Analytics scope.

This is an **access/connector gap**, not an instrumentation gap and not evidence of zero site visitors.

## Correct interpretation rule

Do not say `0 GSC clicks = 0 website visitors`.

Use:

- Search Console for Google organic discovery/click performance;
- GA4 for actual sessions/users, channel mix, landing pages, engagement and events;
- social/referral/AI traffic as separate channels when measurable.

## Next trigger

Connect the existing GA4 property to one currently usable analytics reader. Preferred immediate path is Windsor.ai `googleanalytics4` because Windsor is already the active Search Console bridge and can keep measurement in one low-maintenance connector stack.

After authorization, verify:

1. the connected GA4 account/property includes measurement stream `G-FYKKNKRE58` or the corresponding site property;
2. recent sessions/users/page views can be read;
3. channel/source-medium and landing-page breakdowns are readable;
4. existing custom events (`home_job_select`, `tool_open`, `tool_action`) appear in event reporting after data is available;
5. Google organic, direct, referral/social and identifiable AI-referral traffic are reported separately.

## Stop conditions

- Do not add PostHog, Mixpanel, Amplitude, Plausible or another analytics stack unless GA4 proves insufficient for a concrete requirement.
- Do not change GA4 property/account settings, billing, consent configuration, or data retention without explicit authorization.
- Do not change public Phone content as part of measurement setup.
- Do not treat connector quota/auth failures as traffic conclusions.
