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

-- RLS policies (drop before recreate for idempotency)
drop policy if exists "roles_select_own" on public.user_roles;
drop policy if exists "roles_insert_admin" on public.user_roles;
drop policy if exists "roles_delete_admin" on public.user_roles;

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

drop policy if exists "audit_select_admin" on public.audit_logs;

create policy "audit_select_admin" on public.audit_logs
  for select using (public.is_super_admin());

-- Indexes (idempotent)
create index if not exists audit_logs_user_id_idx on public.audit_logs (user_id);
create index if not exists audit_logs_event_type_idx on public.audit_logs (event_type);
create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index if not exists user_roles_user_id_idx on public.user_roles (user_id);
