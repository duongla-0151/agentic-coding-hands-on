-- Fix sender_id spoofing: enforce sender must be the current user or null (anonymous)
drop policy if exists "kudos_insert_auth" on public.kudos;
create policy "kudos_insert_auth" on public.kudos
  for insert with check (
    auth.uid() is not null
    and (sender_id = auth.uid() or sender_id is null)
  );

-- Allow uploader to delete their own kudo images
drop policy if exists "kudo_images_delete" on storage.objects;
create policy "kudo_images_delete" on storage.objects
  for delete using (
    bucket_id = 'kudo-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
