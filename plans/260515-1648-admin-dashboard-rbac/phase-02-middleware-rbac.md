# Phase 2: Middleware & RBAC Guard

**Status:** planned | **Priority:** critical | **Effort:** small

## Overview

Extend `proxy.ts` to protect `/admin/*` routes. Non-admins get redirected to a 403 page. Uses service role client to bypass RLS for the role check (avoids chicken-and-egg problem with anon key).

## Context

- Middleware file: `proxy.ts` (root level, exported as default + `config`)
- Already handles: intl routing, auth guard for `/` and `/login`
- Must NOT import heavy Node.js modules — middleware runs in Edge runtime

## Implementation Steps

### 1. Add admin check helper inside proxy.ts

The middleware cannot use the service role client (Edge runtime, no Node APIs needed but secret key is fine). Use the anon client — RLS `is_super_admin()` function will correctly evaluate for the authenticated user.

```typescript
// In proxy.ts — add after existing getUser()
async function isAdmin(request: NextRequest, response: NextResponse): Promise<boolean> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data } = await supabase.rpc('is_super_admin');
  return data === true;
}
```

### 2. Add admin route guard in proxy() function

```typescript
// Add inside the proxy() function, after existing auth checks:

// Protect /admin/* routes
if (pathWithoutLocale.startsWith('/admin')) {
  if (!user) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }
  const admin = await isAdmin(request, response);
  if (!admin) {
    return NextResponse.redirect(new URL(`/${locale}/403`, request.url));
  }
}
```

### 3. Create 403 page

`app/[locale]/403/page.tsx` — simple "Access Denied" page with link back to home.

```tsx
export default function ForbiddenPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen" style={{ background: '#00101A' }}>
      <h1 className="text-4xl font-bold text-white mb-4">403</h1>
      <p className="text-white/70 mb-8">You don't have permission to access this page.</p>
      <a href="/" className="text-[#FFEA9E] underline">Go home</a>
    </main>
  );
}
```

## Files

- **Modify:** `proxy.ts` — add `isAdmin()` + admin route guard block
- **Create:** `app/[locale]/403/page.tsx`

## Success Criteria

- [ ] `/vi/admin` redirects unauthenticated users to `/vi/login`
- [ ] `/vi/admin` redirects authenticated non-admin to `/vi/403`
- [ ] `/vi/admin` allows super_admin through
- [ ] No performance regression on non-admin routes (early return before DB call)
