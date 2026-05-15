# Phase 3: Server Helpers & Audit Writer

**Status:** planned | **Priority:** high | **Effort:** small

## Overview

Shared server-side utilities: service role Supabase client, admin check, and audit log writer. These are used by Server Components, Server Actions, and Route Handlers in later phases.

## Files

### lib/supabase/admin-client.ts

Service role client — bypasses RLS for admin DB operations. Server-only (never import in client components).

```typescript
import { createClient } from '@supabase/supabase-js';

// Uses service role key — full DB access, no RLS
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
```

### lib/admin/check-admin.ts

Server-side admin check for Server Components and Route Handlers.

```typescript
import { createClient } from '@/lib/supabase/server';

export async function requireAdmin(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('UNAUTHENTICATED');

  const { data } = await supabase.rpc('is_super_admin');
  if (!data) throw new Error('FORBIDDEN');

  return user.id;
}
```

Usage in Server Components:
```typescript
import { requireAdmin } from '@/lib/admin/check-admin';
import { redirect } from 'next/navigation';

// At top of async Server Component:
try {
  await requireAdmin();
} catch {
  redirect('/403');
}
```

### lib/admin/audit.ts

Writes audit log entries using the service role client (bypasses RLS — insert-only table).

```typescript
import { createAdminClient } from '@/lib/supabase/admin-client';
import { headers } from 'next/headers';

type AuditEvent = 'login' | 'logout' | 'oauth_callback';

interface AuditEntry {
  userId: string | null;
  eventType: AuditEvent;
  metadata?: Record<string, unknown>;
}

export async function writeAuditLog({ userId, eventType, metadata }: AuditEntry) {
  const supabase = createAdminClient();
  const headerStore = await headers();

  await supabase.from('audit_logs').insert({
    user_id: userId,
    event_type: eventType,
    metadata: metadata ?? null,
    ip_address: headerStore.get('x-forwarded-for') ?? headerStore.get('x-real-ip'),
    user_agent: headerStore.get('user-agent'),
  });
  // Errors are intentionally swallowed — audit log failure must not break auth flow
}
```

## Files

- **Create:** `lib/supabase/admin-client.ts`
- **Create:** `lib/admin/check-admin.ts`
- **Create:** `lib/admin/audit.ts`

## Success Criteria

- [ ] `createAdminClient()` connects with service role key
- [ ] `requireAdmin()` throws correctly for non-admin users
- [ ] `writeAuditLog()` inserts rows without crashing on failure
- [ ] None of these files are importable from client components (no `'use client'`)
