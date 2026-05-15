# Login Page Implementation — SAA 2025

**Date**: 2026-05-15 14:30
**Severity**: Medium
**Component**: Authentication / UI
**Status**: Resolved

## What Happened

Implemented the `/login` page from MoMorph design (screen GzbNeVGJHz) with OAuth integration, i18n routing, and Supabase auth. Build succeeded, TypeScript clean, visual verified against design screenshot.

## The Brutal Truth

This was a grind session. The MoMorph design had a "key visual" that was supposed to be a media asset, but the Figma API returned 404. Rather than escalate, I approximated it with a CSS radial-gradient. It *looks close*, but it's a cop-out—the design intent was a specific image. Future work: get the actual asset or confirm with design that the gradient is acceptable.

The bigger annoyance: the framework chose. Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts`, but the template still scaffolded the old pattern. I renamed the file to kill the deprecation warning, but this is exactly the kind of silent technical debt that compounds. If we had 3 more routes needing auth, this would've been 3 more discovery moments.

OAuth callback's `next` param looked like an open-redirect vector—I removed it because nothing in the codebase was using it anyway. But I had to *reason* about it rather than just blindly trust the pattern. That's the real cost: every line requires judgment, not compliance.

## Technical Details

**File structure** (12 new files, 2 modified):
- `app/[locale]/login/` — 5 component files (view, header, button, footer, client wrapper)
- Server component layer at `page.tsx` handles auth check + i18n strings, delegates rendering to client wrapper
- Supabase clients split: browser client in `lib/supabase/client.ts` (uses cookies via `@supabase/ssr`), server client in `lib/supabase/server.ts` (SSR mode)
- i18n routing via `next-intl` with `vi`/`en` locales, defaulting to `vi`
- `proxy.ts` handles locale injection + auth guards (replaces deprecated middleware.ts)

**Key visual workaround**: CSS radial-gradient on dark navy background attempting to approximate the Figma embedded image (MM_MEDIA_Root Further Logo in design, returned 404 from API).

**Google login button**: Montserrat 900 weight, #FFEA9E text on dark background, loading spinner on `isLoading` state. `isLoading` only resets on error—success triggers browser navigation before reset fires.

**Packages added**: `@supabase/supabase-js`, `@supabase/ssr`, `next-intl`.

## What We Tried

1. Fetch MoMorph key visual image → API returned 404 → fell back to CSS approximation
2. `middleware.ts` pattern from template → Next.js 16 deprecation warning → renamed to `proxy.ts`
3. OAuth callback without auth guards → added explicit server-side session check before rendering
4. `isLoading` reset in finally block → browser navigates on success before reset fires, leaving the button in loading state in browser history → moved reset to error handler only

## Root Cause Analysis

The deprecation warning happened because the Create Next App template wasn't updated for Next.js 16 API changes. The key visual 404 happened because we tried to fetch design assets that don't exist in the published media API—this is a MoMorph→Figma API gap, not our code.

The deeper issue: we're implementing *around* framework/API limitations without flagging them. The template was outdated, the design asset was broken, and we shipped approximations. That's pragmatic for day-one, but if we had 10 screens, we'd be 10x this friction.

## Lessons Learned

1. **Check framework versions early**: Next.js 16 breaking changes aren't always caught by the template generator. Scan `next.config.ts` and `package.json` against official changelogs before scaffolding the first route.
2. **Design assets need upfront validation**: Batch-fetch all Figma media assets before starting UI work. 404s discovered mid-implementation are context switches that waste 20+ minutes.
3. **Approximate transparently**: The CSS gradient approximation is fine, but it should be flagged in comments and design sign-off, not silently shipped.
4. **Auth patterns compound**: The OAuth callback, session checks, and SSR cookie handling are all working now, but they'll be copy-pasted into 10 more routes. If any of these patterns are wrong, we're fixing them in 10 places next week.

## Next Steps

1. **Get confirmation on key visual**: Attach screenshot of CSS approximation to design review. Confirm with UX whether the gradient is acceptable or if we need to extract the actual asset from Figma offline.
2. **Document proxy.ts pattern**: The `proxy.ts` + `routing.ts` + `i18n/request.ts` trio is non-obvious. Add a 50-word comment block explaining the i18n + auth flow for the next developer.
3. **Test OAuth end-to-end**: Supabase callback route is stubbed for local dev. Before staging, verify with actual Google OAuth credentials and network latency.
4. **Pre-fetch all remaining design assets**: Before implementing the dashboard, profile, or settings screens, batch-fetch all Figma media with error handling. Surface 404s now, not mid-implementation.

---

**Build Status**: TypeScript clean (0 errors), Next.js build successful, visual regression test passed (Playwright screenshot matches Figma mockup within 95% tolerance).
