import pg from "pg";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(
  join(__dirname, "..", "supabase-demo-setup.sql"),
  "utf8",
);
const pass = process.env.SUPABASE_DB_PASSWORD || "fdsar3fduy7866";

const urls = [
  `postgresql://postgres:${pass}@db.cudzhzwkbzyijyyxevuk.supabase.co:5432/postgres`,
  `postgresql://postgres.cudzhzwkbzyijyyxevuk:${pass}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.cudzhzwkbzyijyyxevuk:${pass}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.cudzhzwkbzyijyyxevuk:${pass}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
];

let ok = false;
for (const url of urls) {
  const host = url.split("@")[1];
  const client = new pg.Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    await client.query(sql);
    console.log("SQL_OK", host);
    ok = true;
    await client.end();
    break;
  } catch (e) {
    console.log("FAIL", host, String(e.message).slice(0, 160));
    try {
      await client.end();
    } catch {
      /* ignore */
    }
  }
}

if (!ok) process.exit(1);
