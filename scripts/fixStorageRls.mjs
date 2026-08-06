/**
 * Apply open demo storage policies so admin (anon/authenticated) can read/write.
 * Usage: node scripts/fixStorageRls.mjs
 */
import "dotenv/config";
import pg from "pg";

const pass =
  process.env.SUPABASE_DB_PASSWORD ||
  process.env.DB_PASSWORD ||
  "fdsar3fduy7866";

const sql = `
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
drop policy if exists allow_all_select on storage.objects;
drop policy if exists allow_all_insert on storage.objects;
drop policy if exists allow_all_update on storage.objects;
drop policy if exists allow_all_delete on storage.objects;

create policy demo_select_images on storage.objects for select using (bucket_id = 'portfolio-images');
create policy demo_insert_images on storage.objects for insert with check (bucket_id = 'portfolio-images');
create policy demo_update_images on storage.objects for update using (bucket_id = 'portfolio-images');
create policy demo_delete_images on storage.objects for delete using (bucket_id = 'portfolio-images');

create policy demo_select_data on storage.objects for select using (bucket_id = 'app-data');
create policy demo_insert_data on storage.objects for insert with check (bucket_id = 'app-data');
create policy demo_update_data on storage.objects for update using (bucket_id = 'app-data');
create policy demo_delete_data on storage.objects for delete using (bucket_id = 'app-data');
`;

const urls = [
  `postgresql://postgres:${encodeURIComponent(pass)}@db.cudzhzwkbzyijyyxevuk.supabase.co:5432/postgres`,
  `postgresql://postgres.cudzhzwkbzyijyyxevuk:${encodeURIComponent(pass)}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.cudzhzwkbzyijyyxevuk:${encodeURIComponent(pass)}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.cudzhzwkbzyijyyxevuk:${encodeURIComponent(pass)}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.cudzhzwkbzyijyyxevuk:${encodeURIComponent(pass)}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`,
];

let ok = false;
for (const url of urls) {
  const host = url.split("@")[1];
  const client = new pg.Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 12000,
  });
  try {
    await client.connect();
    await client.query(sql);
    console.log("RLS_OK", host);
    ok = true;
    await client.end();
    break;
  } catch (e) {
    console.log("FAIL", host, String(e.message).slice(0, 180));
    try {
      await client.end();
    } catch {
      /* ignore */
    }
  }
}

if (!ok) {
  console.error(`
Could not apply SQL automatically.
Open Supabase → SQL Editor and run: car_detailling_backend/supabase-demo-setup.sql
`);
  process.exit(1);
}
