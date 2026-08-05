import { createClient } from "@supabase/supabase-js";

let supabase;

export function getSupabase() {
  if (supabase) return supabase;

  const url = process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in .env");
  }

  supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return supabase;
}

export const DATA_BUCKET = "app-data";
export const IMAGES_BUCKET = "portfolio-images";
