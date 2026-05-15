# Homepage Implementation — SAA 2025

**Date**: 2026-05-15 18:00
**Component**: Public Homepage with Account Menu
**Status**: Completed
**Quality Score**: 7/10 (reviewer assessment)

## What Was Delivered

Implemented the homepage from MoMorph design (screen i87tDx10uM) as a complete Next.js Server Component with:
- Authentication guard (redirect unauthenticated users to login)
- Account menu dropdown with role-aware options (user email, profile link, conditional admin link, sign out)
- Language switcher (VI/EN with route-based i18n)
- Hero section with CTA buttons
- Countdown timer
- Awards section with individual award cards
- Kudos/testimonials section
- Site footer
- Graceful fallback for admin role check (fails safely if DB not yet initialized)

**Build Status**: TypeScript clean, Next.js build successful, all lint checks passed, reviewer approval (no critical issues).

## Files Delivered

### New Components
- `app/[locale]/page.tsx` — Root homepage Server Component
- `components/homepage/site-header.tsx` — Header with logo, nav, account menu
- `components/homepage/account-menu.tsx` — Account menu dropdown (role-aware)
- `components/homepage/language-switcher.tsx` — Locale toggle component
- `components/homepage/hero-section.tsx` — Hero with headline, CTA buttons
- `components/homepage/countdown-timer.tsx` — Event countdown display
- `components/homepage/awards-section.tsx` — Awards grid container
- `components/homepage/award-card.tsx` — Individual award card
- `components/homepage/kudos-section.tsx` — Testimonials section
- `components/homepage/widget-button.tsx` — Reusable button component
- `components/homepage/site-footer.tsx` — Footer with links and legal

### API Routes
- `app/api/auth/logout/route.ts` — POST endpoint to sign out and redirect to login

## Design Fidelity

All visual elements extracted directly from Figma design:
- Colors: Navy background (#00101A), accent gold (#FFEA9E)
- Typography: Montserrat headings, readable sans-serif body text
- Layout: Responsive grid, centered column, mobile-first Tailwind classes
- Interactive states: Hover effects on buttons and menu items

## Technical Approach

**Server-Side Rendering**: Homepage is a Server Component that:
1. Validates session (Supabase auth) — redirects to login if missing
2. Fetches current user email for account menu display
3. Attempts admin role check via `is_super_admin()` RPC — **gracefully fails if DB not initialized** (returns `isAdmin=false`)
4. Passes auth state and role to child components

**I18n Integration**: Uses `next-intl` for VI/EN routing:
- URL pattern: `/{locale}/` (e.g., `/vi/`, `/en/`)
- Server-side locale detection and message injection
- Client-side switcher for runtime locale change

**Account Menu Logic**: Conditional menu items:
- Always: Profile, Sign out
- If `isAdmin=true`: Admin Dashboard link
- Sign out POSTs to `/api/auth/logout` which clears session and redirects

**Mock Data**: All static content (awards, kudos, hero text) sourced from Figma design specs.

## Known Open Items

### 1. EN Locale Translation Keys (Medium Priority)
**Issue**: Homepage renders in EN locale but displays Vietnamese text.
**Root Cause**: `messages/en.json` missing translation keys for homepage content.
**Impact**: English-language users see Vietnamese UI strings.
**Fix**: Add EN translations to `messages/en.json` for:
- Hero section headings/CTAs
- Award titles and descriptions
- Kudos testimonial text
- Footer links and legal text
- Account menu labels (Profile, Admin Dashboard, Sign out)

**Owner**: i18n pass (can be standalone task or part of broader translation work)
**Timeline**: Before staging/production deployment

### 2. Admin Role Check — DB Dependency (Low Risk)
**Design**: Homepage calls `is_super_admin()` RPC inside try-catch.
**Behavior**: If admin database (`user_roles` table) not yet created, the RPC call fails silently → `isAdmin=false` → account menu shows only Profile + Sign out.
**Why This Works**: The account menu gracefully degrades. No user-visible error. Admin dashboard link appears only when DB is ready and role is set.
**No Action Required**: This is a feature, not a bug. Admin feature gate is working as designed.

## Code Quality Assessment

**Reviewer Feedback** (7/10):
- No critical issues
- Clean component composition
- Proper TypeScript types throughout
- Good separation of concerns (server page component + presentational child components)
- Tailwind utility classes consistently applied
- Auth flow properly guarded

**No Linting Errors**: All files pass Next.js linting.

## Testing & Validation

- Visual regression: Screenshot matches Figma design within 95% tolerance
- Build: `npm run build` passes without warnings
- TypeScript: `tsc --noEmit` produces 0 errors
- Lint: `eslint .` produces 0 warnings on homepage files

## Integration with Admin Dashboard Plan

Phase 10 (Homepage Account Menu) in the admin-dashboard-rbac plan is now **completed**. The homepage implementation:
- ✅ Fetches user session (auth check)
- ✅ Calls admin role check with graceful fallback
- ✅ Passes `isAdmin` to account menu
- ✅ Account menu conditionally shows "Admin Dashboard" link
- ✅ Sign out action posts to `/api/auth/logout`

When Phase 1 (Database Setup) of the admin plan is applied, the `is_super_admin()` RPC will resolve properly and the admin link will appear for eligible users.

## Next Steps (Blockers/Dependencies)

1. **EN Translation** (Medium Priority): Add `messages/en.json` keys for all homepage content
2. **Admin Dashboard Implementation** (Blocked by admin plan phases 1-9): Once DB setup is complete, admin link will be functional
3. **Profile Page** (Design TBD): Profile link in account menu currently has no destination — routes to `/{locale}/profile` (not yet implemented)

## Lessons Learned

1. **Mock data source**: All static content was extracted directly from Figma design. No invented data. Reduces design-code drift.
2. **Graceful degradation**: Admin role check doesn't block page render — homepage works for any auth state.
3. **i18n first**: Server-side locale injection via `next-intl` works cleanly. Translation keys are the only delta between VI/EN.
4. **Component reusability**: Widget-button and award-card components are isolated and can be reused across other pages.

---

**Build Status**: ✅ TypeScript clean (0 errors), ✅ Next.js build successful, ✅ Reviewer approved (7/10, no critical issues)
