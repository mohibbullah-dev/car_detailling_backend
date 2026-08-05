import {
  getSupabase,
  DATA_BUCKET,
  IMAGES_BUCKET,
} from "../config/supabase.js";

async function ensureBucket(name, isPublic) {
  const supabase = getSupabase();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  const exists = (buckets || []).some((b) => b.name === name || b.id === name);
  if (exists) return;

  const { error } = await supabase.storage.createBucket(name, {
    public: isPublic,
    fileSizeLimit: 8 * 1024 * 1024,
  });

  // ignore race / already exists
  if (error && !String(error.message || "").toLowerCase().includes("exist")) {
    throw error;
  }
}

export async function initSupabaseStorage() {
  await ensureBucket(DATA_BUCKET, false);
  await ensureBucket(IMAGES_BUCKET, true);
  console.log("✅ Supabase storage buckets ready");
}

async function downloadJson(path, fallback) {
  const supabase = getSupabase();
  const { data, error } = await supabase.storage.from(DATA_BUCKET).download(path);

  if (error) {
    const msg = String(error.message || error.error || "").toLowerCase();
    if (msg.includes("not found") || msg.includes("object not found")) {
      return fallback;
    }
    throw error;
  }

  const text = await data.text();
  if (!text) return fallback;
  return JSON.parse(text);
}

async function uploadJson(path, value) {
  const supabase = getSupabase();
  const body = JSON.stringify(value, null, 2);
  const blob = new Blob([body], { type: "application/json" });

  const { error } = await supabase.storage.from(DATA_BUCKET).upload(path, blob, {
    upsert: true,
    contentType: "application/json",
  });

  if (error) throw error;
  return value;
}

export async function getPortfolioItems() {
  const items = await downloadJson("portfolio.json", []);
  return Array.isArray(items)
    ? items.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      )
    : [];
}

export async function savePortfolioItems(items) {
  return uploadJson("portfolio.json", items);
}

export async function getSettings() {
  return downloadJson("settings.json", {
    isClosed: false,
    reason: "We are currently fully booked.",
  });
}

export async function saveSettings(settings) {
  return uploadJson("settings.json", settings);
}

export async function getSiteContent() {
  return downloadJson("site-content.json", null);
}

export async function saveSiteContent(content) {
  return uploadJson("site-content.json", content);
}

function extFromMime(mime = "") {
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  return "jpg";
}

export async function uploadPortfolioImage(file, folderHint = "item") {
  const supabase = getSupabase();
  const ext = extFromMime(file.mimetype);
  const id = `${folderHint}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const path = `${id}.${ext}`;

  const { error } = await supabase.storage
    .from(IMAGES_BUCKET)
    .upload(path, file.buffer, {
      contentType: file.mimetype || "image/jpeg",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deletePortfolioImage(path) {
  if (!path) return;
  const supabase = getSupabase();
  // path may be full public URL — extract storage path
  let storagePath = path;
  const marker = `/${IMAGES_BUCKET}/`;
  if (path.includes(marker)) {
    storagePath = path.split(marker)[1]?.split("?")[0] || path;
  }
  await supabase.storage.from(IMAGES_BUCKET).remove([storagePath]);
}
