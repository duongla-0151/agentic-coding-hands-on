# Phase 4: Auth Flow — Audit Log Integration

**Status:** planned | **Priority:** high | **Effort:** small

## Overview

Hook audit log writes into existing auth events: OAuth callback (login) and a new logout endpoint.

## Implementation Steps

### 1. Update app/auth/callback/route.ts

Log `oauth_callback` on every callback attempt, `login` on success.

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/admin/audit";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    await writeAuditLog({
      userId: data?.user?.id ?? null,
      eventType: error ? 'oauth_callback' : 'login',
      metadata: error ? { error: error.message } : { provider: 'google' },
    });

    if (!error) {
      return NextResponse.redirect(`${origin}/`);
    }
  }

  await writeAuditLog({ userId: null, eventType: 'oauth_callback', metadata: { error: 'no_code' } });
  return NextResponse.redirect(`${origin}/`);
}
```

### 2. Create app/api/auth/logout/route.ts

POST endpoint that signs out and logs the event before redirecting.

```typescript
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/admin/audit";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    await writeAuditLog({ userId: user.id, eventType: 'logout' });
  }

  await supabase.auth.signOut();

  const locale = request.headers.get('x-next-intl-locale') ?? 'vi';
  return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
}
```

## Files

- **Modify:** `app/auth/callback/route.ts`
- **Create:** `app/api/auth/logout/route.ts`

## Success Criteria

- [ ] `audit_logs` gets a `login` row after successful Google OAuth
- [ ] `audit_logs` gets a `logout` row after signing out
- [ ] Auth flow still works end-to-end after changes
- [ ] Audit write failure does not break login/logout
