# Phase 5: Admin Layout & Sidebar

**Status:** planned | **Priority:** high | **Effort:** medium

## Overview

Shared layout for all `/admin/*` pages: top bar + left sidebar. Server Component — no client state needed.

## Route Structure

```
app/[locale]/admin/
  layout.tsx          ← this phase
  page.tsx            ← phase 6
  users/
    page.tsx          ← phase 7
    [userId]/
      page.tsx        ← phase 8
  audit-logs/
    page.tsx          ← phase 9
```

## Implementation Steps

### 1. components/admin/admin-sidebar.tsx

```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem { label: string; href: string; icon: string; }

const NAV: NavItem[] = [
  { label: 'Overview',   href: '/admin',            icon: '⬜' },
  { label: 'Users',      href: '/admin/users',      icon: '👥' },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: '📋' },
];

export function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-[#0B0F12] border-r border-white/10 flex flex-col">
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-[#FFEA9E] font-bold text-sm uppercase tracking-widest">Admin</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ label, href, icon }) => {
          const fullHref = `/${locale}${href}`;
          const active = pathname === fullHref || (href !== '/admin' && pathname.startsWith(fullHref));
          return (
            <Link
              key={href}
              href={fullHref}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="w-full text-left text-sm text-white/40 hover:text-white/70 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
            ← Back to App
          </button>
        </form>
      </div>
    </aside>
  );
}
```

### 2. app/[locale]/admin/layout.tsx

```tsx
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex min-h-screen" style={{ background: '#00101A' }}>
      <AdminSidebar locale={locale} />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
```

## i18n Note

Admin UI uses English labels directly (no i18n needed for admin-only internal tools). If needed later, add to `messages/`.

## Files

- **Create:** `components/admin/admin-sidebar.tsx`
- **Create:** `app/[locale]/admin/layout.tsx`

## Success Criteria

- [ ] Sidebar renders on all `/admin/*` pages
- [ ] Active nav item highlights correctly
- [ ] Layout does not re-check admin role (middleware handles that)
- [ ] Mobile: sidebar still visible (no responsive collapse needed for v1)
