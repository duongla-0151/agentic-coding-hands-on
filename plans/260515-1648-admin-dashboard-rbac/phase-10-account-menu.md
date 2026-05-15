# Phase 10: Homepage Account Menu

**Status:** completed | **Priority:** high | **Effort:** small
**blockedBy:** phase-01-database-setup (user_roles table must exist)

## Overview

Update the homepage header to show an account menu dropdown with role-aware options. This is the entry point into the admin section from the public-facing app.

**Note:** This phase depends on Phase 1 (DB migration) being applied. Until then, the homepage uses graceful fallback (`isAdmin=false`).

## Context

- Homepage spec A1.8: "Option: Profile/Sign out/Admin Dashboard (đối với role admin)"
- Test cases ID-5, ID-37: Admin users see "Admin Dashboard" in account menu
- The account menu component is built in Phase 5 (Admin Layout); this phase wires it into the homepage

**Implementation Note (2026-05-15):** The homepage and account menu were fully implemented as part of MoMorph screen i87tDx10uM via `/takumi` workflow. All components pass build, TypeScript, lint, and reviewer checks (7/10 quality score, no critical issues). Files delivered:
- `app/[locale]/page.tsx` — Server Component with graceful fallback for admin check
- `components/homepage/account-menu.tsx` — Account menu with conditional admin link
- `app/api/auth/logout/route.ts` — Sign out handler
- Supporting components: site-header, language-switcher, hero-section, countdown-timer, awards-section, footer, etc.

Open: EN locale renders Vietnamese content (i18n keys pending in `messages/en.json`).

## What This Phase Adds to Homepage

The homepage (`app/[locale]/page.tsx`) already has an auth check. After Phase 1 (DB up), it needs to also:
1. Call `is_super_admin()` RPC for the current user
2. Pass `isAdmin` to the header/account menu component

## Implementation Steps

### 1. Update app/[locale]/page.tsx to pass isAdmin

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/homepage/site-header";
// ... other imports

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/login`);

  // Admin check — graceful fallback if Phase 1 DB not yet applied
  let isAdmin = false;
  try {
    const { data } = await supabase.rpc('is_super_admin');
    isAdmin = data === true;
  } catch {
    // user_roles table doesn't exist yet
  }

  return (
    <main style={{ background: '#00101A' }}>
      <SiteHeader locale={locale} userEmail={user.email ?? ''} isAdmin={isAdmin} />
      {/* ... rest of homepage */}
    </main>
  );
}
```

### 2. Account menu options (implemented in components/homepage/account-menu.tsx)

```tsx
// Options based on isAdmin prop:
const menuItems = [
  { label: 'Profile', href: `/${locale}/profile` },
  ...(isAdmin ? [{ label: 'Admin Dashboard', href: `/${locale}/admin` }] : []),
  { label: 'Sign out', action: 'logout' },
];
```

Sign out action POSTs to `/api/auth/logout` (created in Phase 4).

## Files

- **Modify:** `app/[locale]/page.tsx` — add `isAdmin` fetch + pass to SiteHeader
- **Modify:** `components/homepage/account-menu.tsx` — add "Admin Dashboard" conditional item

## Success Criteria

- [ ] Regular user: account menu shows Profile + Sign out only
- [ ] Super admin: account menu shows Profile + Admin Dashboard + Sign out
- [ ] Admin Dashboard link navigates to `/admin`
- [ ] Sign out calls `/api/auth/logout` POST and redirects to login
- [ ] Admin check fails gracefully if DB table missing
