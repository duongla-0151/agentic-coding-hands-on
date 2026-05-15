# Phase 8: User Detail Page

**Status:** planned | **Priority:** high | **Effort:** medium

## Overview

Shows full profile for a single user: email, join date, last sign-in, current role. Allows super_admin to grant or revoke the `super_admin` role. Uses Server Actions for mutations.

## Implementation Steps

### 1. app/[locale]/admin/users/[userId]/page.tsx

```tsx
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin-client';
import { RoleBadge } from '@/components/admin/role-badge';
import { ToggleRoleButton } from '@/components/admin/toggle-role-button';

async function getUser(userId: string) {
  const supabase = createAdminClient();

  const [
    { data: { user }, error },
    { data: roles },
    { data: logs },
  ] = await Promise.all([
    supabase.auth.admin.getUserById(userId),
    supabase.from('user_roles').select('role').eq('user_id', userId),
    supabase.from('audit_logs')
      .select('id, event_type, created_at, metadata')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  if (error || !user) return null;

  return {
    id: user.id,
    email: user.email ?? '',
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at ?? null,
    is_admin: (roles ?? []).some((r) => r.role === 'super_admin'),
    recent_logs: logs ?? [],
  };
}
```

```tsx
export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ locale: string; userId: string }>;
}) {
  const { locale, userId } = await params;
  const user = await getUser(userId);

  if (!user) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <a href={`/${locale}/admin/users`} className="text-white/40 hover:text-white text-sm">← Users</a>
        <h1 className="text-2xl font-bold text-white">{user.email}</h1>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-6 space-y-4">
        <Row label="Email" value={user.email} />
        <Row label="Role" value={<RoleBadge isAdmin={user.is_admin} />} />
        <Row label="Joined" value={new Date(user.created_at).toLocaleString()} />
        <Row label="Last Sign In" value={user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : '—'} />
      </div>

      <div className="mb-6">
        <ToggleRoleButton userId={userId} isAdmin={user.is_admin} />
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {user.recent_logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <span className="text-white/70">{log.event_type}</span>
              <span className="text-white/30 text-xs">{new Date(log.created_at).toLocaleString()}</span>
            </div>
          ))}
          {user.recent_logs.length === 0 && <p className="text-white/30 text-sm">No activity.</p>}
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}
```

### 2. components/admin/toggle-role-button.tsx — Server Action for role mutation

```tsx
'use client';
import { useTransition } from 'react';
import { toggleSuperAdmin } from '@/app/actions/admin-role-actions';

export function ToggleRoleButton({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => toggleSuperAdmin(userId, !isAdmin))}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
        isAdmin
          ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
          : 'bg-[#FFEA9E]/10 text-[#FFEA9E] border border-[#FFEA9E]/20 hover:bg-[#FFEA9E]/20'
      }`}
    >
      {isPending ? 'Saving…' : isAdmin ? 'Revoke super_admin' : 'Grant super_admin'}
    </button>
  );
}
```

### 3. app/actions/admin-role-actions.ts — Server Action

```typescript
'use server';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin-client';
import { requireAdmin } from '@/lib/admin/check-admin';

export async function toggleSuperAdmin(targetUserId: string, grant: boolean) {
  await requireAdmin(); // throws if not super_admin

  const supabase = createAdminClient();

  if (grant) {
    await supabase.from('user_roles').upsert({ user_id: targetUserId, role: 'super_admin' });
  } else {
    await supabase.from('user_roles').delete()
      .eq('user_id', targetUserId).eq('role', 'super_admin');
  }

  revalidatePath('/admin/users');
  revalidatePath(`/admin/users/${targetUserId}`);
}
```

## Files

- **Create:** `app/[locale]/admin/users/[userId]/page.tsx`
- **Create:** `components/admin/toggle-role-button.tsx`
- **Create:** `app/actions/admin-role-actions.ts`

## Success Criteria

- [ ] User profile loads with correct role badge
- [ ] Grant super_admin inserts row in user_roles
- [ ] Revoke super_admin deletes row from user_roles
- [ ] Non-admin cannot call toggleSuperAdmin (requireAdmin guard)
- [ ] Page revalidates after role change
