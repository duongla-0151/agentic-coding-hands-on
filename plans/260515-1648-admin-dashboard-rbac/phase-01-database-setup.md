# Phase 1: Database Setup

**Status:** planned | **Priority:** critical | **Effort:** small

## Overview

Create Supabase migration for `user_roles` and `audit_logs` tables with RLS policies. This is the foundation for all other phases.

## Implementation Steps

### 1. Create migration file

`supabase/migrations/20260515000000_admin_rbac.sql`

```sql
-- ============================================================
-- user_roles: maps auth.users → role (super_admin only for now)
-- ============================================================
create table if not exists public.user_roles (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  role        text not null check (role in ('super_admin')),
  created_at  timestamptz default now() not null,
  created_by  uuid references auth.users(id),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Helper: check if current user is super_admin (avoids recursive RLS)
create or replace function public.is_super_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'super_admin'
  );
$$;

-- RLS: super_admin can read all roles; users can read their own
create policy "roles_select_own" on public.user_roles
  for select using (user_id = auth.uid() or public.is_super_admin());

create policy "roles_insert_admin" on public.user_roles
  for insert with check (public.is_super_admin());

create policy "roles_delete_admin" on public.user_roles
  for delete using (public.is_super_admin());

-- ============================================================
-- audit_logs: immutable event log (insert-only)
-- ============================================================
create table if not exists public.audit_logs (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete set null,
  event_type  text not null,  -- 'login' | 'logout' | 'oauth_callback'
  metadata    jsonb,
  ip_address  text,
  user_agent  text,
  created_at  timestamptz default now() not null
);

alter table public.audit_logs enable row level security;

-- RLS: only super_admin can read; service role inserts (bypasses RLS)
create policy "audit_select_admin" on public.audit_logs
  for select using (public.is_super_admin());

-- Index for common queries
create index audit_logs_user_id_idx on public.audit_logs (user_id);
create index audit_logs_event_type_idx on public.audit_logs (event_type);
create index audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index user_roles_user_id_idx on public.user_roles (user_id);
```

### 2. Apply migration locally

```bash
npx supabase db push
# or
npx supabase migration up
```

### 3. Seed first super_admin (manual SQL in Supabase studio)

```sql
-- Run after logging in once via Google OAuth to create the user record
insert into public.user_roles (user_id, role)
select id, 'super_admin'
from auth.users
where email = 'le.anh.duong@sun-asterisk.com'
on conflict do nothing;
```

### 4. Add service role key to .env.local

```
SUPABASE_SERVICE_ROLE_KEY=<from supabase status or dashboard>
```

Get it via: `npx supabase status`

## Files

- **Create:** `supabase/migrations/20260515000000_admin_rbac.sql`
- **Modify:** `.env.local` — add `SUPABASE_SERVICE_ROLE_KEY`

## Success Criteria

- [ ] Migration applies without errors (`supabase db push`)
- [ ] `user_roles` table exists with correct constraints
- [ ] `audit_logs` table exists with correct indexes
- [ ] `is_super_admin()` function returns true for seeded admin user
- [ ] RLS blocks non-admin from selecting `audit_logs`
