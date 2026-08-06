-- Run once in Supabase → SQL Editor (demo open policies)
-- Fixes admin Open/Close, settings, packages, reviews, FAQs, portfolio uploads

update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where email = 'admin@gmail.com';

insert into storage.buckets (id, name, public)
values ('app-data', 'app-data', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do update set public = true;

drop policy if exists demo_select_images on storage.objects;
drop policy if exists demo_insert_images on storage.objects;
drop policy if exists demo_update_images on storage.objects;
drop policy if exists demo_delete_images on storage.objects;
drop policy if exists demo_select_data on storage.objects;
drop policy if exists demo_insert_data on storage.objects;
drop policy if exists demo_update_data on storage.objects;
drop policy if exists demo_delete_data on storage.objects;

create policy demo_select_images on storage.objects for select using (bucket_id = 'portfolio-images');
create policy demo_insert_images on storage.objects for insert with check (bucket_id = 'portfolio-images');
create policy demo_update_images on storage.objects for update using (bucket_id = 'portfolio-images');
create policy demo_delete_images on storage.objects for delete using (bucket_id = 'portfolio-images');

create policy demo_select_data on storage.objects for select using (bucket_id = 'app-data');
create policy demo_insert_data on storage.objects for insert with check (bucket_id = 'app-data');
create policy demo_update_data on storage.objects for update using (bucket_id = 'app-data');
create policy demo_delete_data on storage.objects for delete using (bucket_id = 'app-data');
