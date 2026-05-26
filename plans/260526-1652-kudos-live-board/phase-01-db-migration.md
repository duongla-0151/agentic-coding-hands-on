# Phase 1: DB Migration — kudos_likes

## Overview
Add `kudos_likes` table to support heart/like functionality per spec C.4.1.

## File to Create
- `supabase/migrations/20260526000003_kudos_likes.sql`

## Schema
```sql
create table public.kudos_likes (
  id         uuid primary key default gen_random_uuid(),
  kudos_id   uuid not null references public.kudos(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (kudos_id, user_id)
);
alter table public.kudos_likes enable row level security;
-- select: public
-- insert: authenticated, user_id = auth.uid()
-- delete: own likes only
```

## Rules from Specs
- One like per user per kudos (UNIQUE constraint)
- Sender cannot like own kudos (enforced in UI + API)
- Special day double-heart: defer (no admin config yet)

## Success Criteria
- Migration runs cleanly via `supabase db reset`
- RLS blocks unauthenticated inserts
- Unique constraint prevents double-likes
