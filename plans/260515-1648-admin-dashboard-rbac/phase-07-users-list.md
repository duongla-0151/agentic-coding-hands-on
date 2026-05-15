# Phase 7: Users List Page

**Status:** planned | **Priority:** high | **Effort:** medium

## Overview

Paginated table of all users. Shows name, email, role badge, join date. Supports search by email. Links to User Detail page.

## Data Shape

From `supabase.auth.admin.listUsers()` + join with `user_roles`:

```typescript
interface UserRow {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
}
```

## Implementation Steps

### 1. components/admin/role-badge.tsx

```tsx
export function RoleBadge({ isAdmin }: { isAdmin: boolean }) {
  return isAdmin ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FFEA9E]/10 text-[#FFEA9E] border border-[#FFEA9E]/20">
      super_admin
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-white/40 border border-white/10">
      user
    </span>
  );
}
```

### 2. app/[locale]/admin/users/page.tsx

Search and page are URL search params — Server Component reads them from `searchParams`.

```tsx
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin-client';
import { RoleBadge } from '@/components/admin/role-badge';

const PAGE_SIZE = 20;

async function getUsers(page: number, search: string) {
  const supabase = createAdminClient();

  // Fetch paginated users from auth.admin API
  const { data: { users }, error } = await supabase.auth.admin.listUsers({
    page,
    perPage: PAGE_SIZE,
  });
  if (error) throw error;

  // Fetch admin role IDs for cross-reference
  const { data: adminRoles } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role', 'super_admin');

  const adminSet = new Set((adminRoles ?? []).map((r) => r.user_id));

  let rows = users.map((u) => ({
    id: u.id,
    email: u.email ?? '',
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
    is_admin: adminSet.has(u.id),
  }));

  // Client-side search filter (auth.admin API doesn't support email search)
  if (search) {
    rows = rows.filter((u) => u.email.toLowerCase().includes(search.toLowerCase()));
  }

  return rows;
}

export default async function UsersListPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { page: pageStr, q = '' } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));
  const users = await getUsers(page, q);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <form>
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by email…"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
          />
        </form>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              {['Email', 'Role', 'Joined', 'Last Sign In', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-white/50 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-white">{u.email}</td>
                <td className="px-4 py-3"><RoleBadge isAdmin={u.is_admin} /></td>
                <td className="px-4 py-3 text-white/40">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-white/40">
                  {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/${locale}/admin/users/${u.id}`} className="text-[#FFEA9E] text-xs hover:underline">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-white/30">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex gap-2 mt-4 justify-end">
        {page > 1 && (
          <a href={`?page=${page - 1}&q=${q}`} className="text-xs text-white/50 hover:text-white px-3 py-1 rounded border border-white/10">← Prev</a>
        )}
        {users.length === PAGE_SIZE && (
          <a href={`?page=${page + 1}&q=${q}`} className="text-xs text-white/50 hover:text-white px-3 py-1 rounded border border-white/10">Next →</a>
        )}
      </div>
    </div>
  );
}
```

## Files

- **Create:** `components/admin/role-badge.tsx`
- **Create:** `app/[locale]/admin/users/page.tsx`

## Success Criteria

- [ ] All users listed with correct role badges
- [ ] Email search filters results
- [ ] Pagination works (next/prev)
- [ ] View link navigates to User Detail page
