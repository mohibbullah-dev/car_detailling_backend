import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const email = process.env.ADMIN_EMAIL || "admin@gmail.com";
const password = process.env.ADMIN_PASSWORD || "123456";

const { data: list, error: listError } = await supabase.auth.admin.listUsers();
if (listError) {
  console.error("LIST_FAIL", listError.message);
  process.exit(1);
}

const existing = (list?.users || []).find(
  (u) => (u.email || "").toLowerCase() === email.toLowerCase(),
);

if (existing) {
  const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("UPDATE_FAIL", error.message);
    process.exit(1);
  }
  console.log("UPDATED_USER", data.user.email, data.user.id);
} else {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("CREATE_FAIL", error.message);
    process.exit(1);
  }
  console.log("CREATED_USER", data.user.email, data.user.id);
}

// Ensure buckets exist (service role)
for (const [name, isPublic] of [
  ["app-data", false],
  ["portfolio-images", true],
]) {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = (buckets || []).some((b) => b.name === name);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(name, {
      public: isPublic,
    });
    if (error) console.log("BUCKET_WARN", name, error.message);
    else console.log("BUCKET_CREATED", name);
  } else {
    console.log("BUCKET_OK", name);
  }
}

console.log("DONE");
