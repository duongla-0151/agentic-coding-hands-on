-- kudos: peer recognition records
create table if not exists public.kudos (
  id             uuid primary key default gen_random_uuid(),
  recipient_id   uuid not null references auth.users(id) on delete cascade,
  sender_id      uuid references auth.users(id) on delete set null,
  anonymous_name text,
  badge          text not null,
  content        text not null,
  hashtags       text[] not null default '{}',
  images         text[] not null default '{}',
  created_at     timestamptz not null default now()
);

alter table public.kudos enable row level security;

drop policy if exists "kudos_select_public" on public.kudos;
create policy "kudos_select_public" on public.kudos
  for select using (true);

drop policy if exists "kudos_insert_auth" on public.kudos;
create policy "kudos_insert_auth" on public.kudos
  for insert with check (
    auth.uid() is not null
    and (sender_id = auth.uid() or sender_id is null)
  );

-- Storage bucket for kudo image attachments
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('kudo-images', 'kudo-images', true, 5242880, array['image/jpeg', 'image/png'])
on conflict (id) do nothing;

drop policy if exists "kudo_images_insert" on storage.objects;
create policy "kudo_images_insert" on storage.objects
  for insert with check (bucket_id = 'kudo-images' and auth.uid() is not null);

drop policy if exists "kudo_images_select" on storage.objects;
create policy "kudo_images_select" on storage.objects
  for select using (bucket_id = 'kudo-images');

drop policy if exists "kudo_images_delete" on storage.objects;
create policy "kudo_images_delete" on storage.objects
  for delete using (
    bucket_id = 'kudo-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
