-- kudos_likes: per-user heart/like on a kudos post
create table if not exists public.kudos_likes (
  id         uuid primary key default gen_random_uuid(),
  kudos_id   uuid not null references public.kudos(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (kudos_id, user_id)
);

alter table public.kudos_likes enable row level security;

drop policy if exists "kudos_likes_select_public" on public.kudos_likes;
create policy "kudos_likes_select_public" on public.kudos_likes
  for select using (true);

drop policy if exists "kudos_likes_insert_auth" on public.kudos_likes;
create policy "kudos_likes_insert_auth" on public.kudos_likes
  for insert with check (auth.uid() is not null and user_id = auth.uid());

drop policy if exists "kudos_likes_delete_own" on public.kudos_likes;
create policy "kudos_likes_delete_own" on public.kudos_likes
  for delete using (user_id = auth.uid());

-- Indexes for common query patterns
create index if not exists kudos_likes_kudos_id_idx on public.kudos_likes (kudos_id);
create index if not exists kudos_likes_user_id_idx on public.kudos_likes (user_id);
create index if not exists kudos_created_at_idx on public.kudos (created_at desc);
create index if not exists kudos_recipient_id_idx on public.kudos (recipient_id);
create index if not exists kudos_sender_id_idx on public.kudos (sender_id);
