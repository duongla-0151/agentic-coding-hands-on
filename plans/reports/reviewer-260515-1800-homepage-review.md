---
name: reviewer-260515-1800-homepage-review
description: Production-readiness review of Homepage SAA implementation (12 files)
metadata:
  type: report
  date: 2026-05-15
---

## Code Review Summary

### Scope
- Files: 12 (page.tsx, site-header, account-menu, language-switcher, hero-section, countdown-timer, awards-section, award-card, kudos-section, widget-button, site-footer, logout route)
- Context: lib/supabase/server.ts, client.ts, proxy.ts, auth/callback/route.ts
- LOC: ~620

### Overall Assessment
Solid structural foundation. Server/client component split is correct, auth guard in `page.tsx` is sound, and the Supabase SSR pattern is used correctly. Two bugs (silent logout failure, invalid-date NaN render) were fixed. The largest unresolved gap is missing i18n for all homepage content — the `locale` prop is threaded through every component but never used for translation.

---

### Critical Issues

**C1 — CountdownTimer: invalid `eventDatetime` renders "NaN" [FIXED]**
- `new Date("garbage")` produces `NaN` date; `diff <= 0` check is `false` for `NaN`, so `calcTimeLeft` returns `{ days: NaN, hours: NaN, minutes: NaN }`. `pad(NaN)` renders the string `"NaN"` in the UI.
- Default fallback `"2025-12-31T18:30:00+07:00"` prevents this in production, but a misconfigured env var breaks the page visually with no error boundary.
- **Fix applied**: added `isNaN(targetDate.getTime())` guard in `countdown-timer.tsx`; invalid date falls back to all-zeros and skips interval registration.

---

### High Priority

**H1 — Logout: silent failure creates redirect loop [FIXED]**
- Original `route.ts` caught all signOut errors and returned `{ok:true}` regardless. Original `account-menu.tsx` ignored network errors and always called `router.push(login)`.
- If `supabase.auth.signOut()` fails, the session cookie is NOT cleared. The client navigates to `/login`, the middleware sees a valid session and redirects back to home → redirect loop with no user feedback.
- **Fix applied**: `route.ts` now returns HTTP 500 on signOut error; `account-menu.tsx` checks `res.ok` and aborts navigation on failure, logging to console. A user-visible toast is still missing (see Medium section).

**H2 — i18n: all homepage content is hardcoded Vietnamese**
- `locale` prop is passed to every component but used only for URL construction (hrefs), never for translation.
- `hero-section.tsx`: "Thời gian", "Địa điểm", "Tường thuật trực tiếp" — hardcoded Vietnamese
- `countdown-timer.tsx`: "Coming soon" — hardcoded English (inconsistent even with its own locale)
- `awards-section.tsx`, `kudos-section.tsx`, `award-card.tsx`: all section text is hardcoded Vietnamese
- `messages/en.json` only has `Login` keys — no Homepage keys exist yet
- **Not fixed** (requires content design decisions + messages key additions). Flag for the next sprint.

---

### Medium Priority

**M1 — LanguageSwitcher: `<li>` items are not keyboard-navigable**
- `<li role="option">` elements have `onClick` but no `tabIndex="0"` and no `onKeyDown` handler.
- Keyboard-only users can open the dropdown (button is focusable) but cannot select a language without a mouse.
- Fix: convert each `<li>` to `<li role="option" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleLocaleChange(lang.code)}>` or replace with `<button>` elements inside `<li>`.

**M2 — WidgetButton: popover has no click-outside dismiss**
- `account-menu` and `language-switcher` both implement `mousedown` outside-click handlers. `WidgetButton` does not.
- Popover stays open when user clicks elsewhere on the page.
- Fix: add the same `useRef` + `document.addEventListener("mousedown", ...)` pattern used in the other dropdowns.

**M3 — Logout failure: no user-visible feedback**
- After H1 fix, `handleSignOut` aborts navigation silently on failure (console.error only).
- Users see no indication the logout failed — the dropdown closes and nothing happens.
- Fix: add a state variable for an error message rendered near the sign-out button, or a toast notification.

**M4 — Sequential auth awaits in `page.tsx` — note retained**
- `getIsAdmin` must run after `user` is confirmed non-null, so the sequential pattern is correct. The comment added in the fix clarifies intent. No action needed.

**M5 — DRY: NAV_LINKS and FOOTER_LINKS are identical**
- Both constants define the same three entries with the same hrefs.
- Minor: extract to a shared constant in `lib/constants/nav.ts` or a co-located `homepage-constants.ts`.

---

### Low Priority

**L1 — CountdownTimer: `targetDate` recreated on every render**
- `const targetDate = new Date(eventDatetime)` runs on every render, allocating a new `Date` object even when `eventDatetime` hasn't changed.
- Fix: `const targetDate = useMemo(() => new Date(eventDatetime), [eventDatetime])`.

**L2 — Awards grid not responsive**
- `gridTemplateColumns: "repeat(3, 1fr)"` is hardcoded in an inline style — Tailwind responsive prefixes cannot override inline styles.
- On mobile, 3-column layout overflows viewport.
- Fix: use Tailwind grid classes — `className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"` and remove the inline style.

**L3 — Hardcoded pixel padding (144px) on all sections**
- `hero-section`, `awards-section`, `kudos-section`, `site-header`, `site-footer` all use `padding: "X 144px"` inline.
- On viewports < ~1200px, content bleeds or clips. No responsive breakpoints exist.
- Fix: use Tailwind `px-6 md:px-16 lg:px-36` or CSS custom properties.

**L4 — `account-menu` `aria-haspopup="true"` should be `"menu"`**
- `aria-haspopup="true"` is valid (equivalent to "menu") but explicit `"menu"` is preferred for clarity since the popup has `role="menu"`.

**L5 — Notification bell button is non-functional stub with no aria state**
- `site-header.tsx` renders a bell button with `aria-label="Notifications"` but no `aria-haspopup`, `aria-expanded`, or handler.
- Low risk since it's stub UI, but misleads screen readers into announcing it as an interactive control.

---

### Edge Cases Found (scouting)

**EC1 — `proxy.ts` middleware only guards `/` and `/login`**
- All other routes (`/awards`, `/kudos`, `/admin`) receive no auth check in middleware.
- Currently only `/` and `/[locale]/login` exist as page routes, so this is not exploitable today.
- If new pages are added without server-side `getUser` guards, they will be accessible unauthenticated.
- Recommendation: add a default deny-if-unauthenticated rule for all non-public paths in `proxy.ts`.

**EC2 — `auth/callback/route.ts` redirects to `${origin}/` on both success and failure**
- On success after `exchangeCodeForSession`, redirects to `/` (root, which redirects to `/${defaultLocale}`).
- On failure (no `code` param, or exchange error), also redirects to `/`, which middleware will redirect to `/vi/login`.
- The failure path is silently swallowed — no user indication of auth failure (e.g., invalid token, expired code).

**EC3 — `getIsAdmin` `userId` param is unused (void-cast)**
- `void userId` silences the lint warning but the parameter is vestigial. Either remove it from the signature or document why it exists as a future extension point with a TODO comment.

**EC4 — Language switcher: `pathname` from `usePathname()` doesn't include locale prefix after next-intl strip**
- Actually, `usePathname()` from `next/navigation` in a next-intl app returns the FULL path including locale prefix (e.g., `/vi/awards`). The regex `/^\/(vi|en)/` correctly handles this.
- The switcher uses `next/navigation` router, not `next-intl`'s typed router — this is fine since it's doing raw path manipulation, not link generation.

---

### Positive Observations

- Server/client split is well-considered: `page.tsx`, `site-header`, `hero-section`, `awards-section`, `kudos-section`, `site-footer`, `award-card` are all server components. Interactive islands (`account-menu`, `language-switcher`, `widget-button`, `countdown-timer`) are correctly marked `"use client"`.
- `getIsAdmin` gracefully catches RPC errors and returns `false` — admin check can't crash the page.
- `page.tsx` auth guard is correct: `supabase.auth.getUser()` is called server-side (not just a cookie check), validating the JWT against the Supabase server.
- Logout route is POST-only — no GET endpoint to trigger via `<img>` CSRF vector.
- `proxy.ts` LOCALE_PATTERN regex is anchored (`^\/(vi|en)`) — not susceptible to mid-path locale code false matches.
- `aria-label`, `aria-haspopup`, `aria-expanded` on all dropdown triggers.
- `aria-hidden="true"` on all decorative SVGs and separators.

---

### Recommended Actions (prioritized)

1. **Add homepage i18n keys** to `messages/en.json` and `messages/vi.json`; replace hardcoded text with `useTranslations()` — unblocks EN locale correctness (H2)
2. **Add keyboard handler to LanguageSwitcher `<li>` items** or replace with `<button>` elements (M1)
3. **Add click-outside handler to WidgetButton** (M2)
4. **Add user-visible error feedback on logout failure** (M3)
5. **Make awards grid responsive** — swap inline style for Tailwind classes (L2)
6. **Add a default middleware auth guard** for all non-public routes (EC1)

---

### Metrics

- TypeScript: 0 errors (tsc --noEmit clean)
- ESLint: 0 issues reported
- Fixes applied: 2 files (countdown-timer.tsx, logout/route.ts, account-menu.tsx)

### Unresolved Questions

1. Is the homepage content intentionally Vietnamese-only for the initial release, with EN translation deferred? The `locale` prop threading suggests EN was planned.
2. Are `/awards`, `/kudos`, `/admin` routes planned to be added? If so, the middleware guard gap (EC1) should be addressed before those routes go live.
3. Is the notification bell a planned feature? If it's a stub, consider removing it or replacing with a disabled state to avoid misleading screen readers.
