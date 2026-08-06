/**
 * Seed realistic portfolio projects into Supabase (same path as admin upload).
 * Usage: node scripts/seedPortfolio.mjs
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or service role key in .env");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const DATA_BUCKET = "app-data";
const IMAGES_BUCKET = "portfolio-images";

const PROJECTS = [
  {
    title: "BMW M4 Competition — Full Detail",
    location: "Birmingham",
    tags: ["Paint Correction", "Ceramic Coating", "Interior"],
    notes:
      "Two-stage paint correction followed by a ceramic coating. Swirl marks removed and deep gloss restored across all panels.",
    beforeUrl:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=80",
    afterUrl:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1400&q=80",
  },
  {
    title: "Porsche 911 Carrera — Ceramic Coat",
    location: "Solihull",
    tags: ["Ceramic Coating", "Decontamination", "Exterior"],
    notes:
      "Full exterior decontamination, polish, and ceramic protection. Mirror finish on a classic Porsche profile.",
    beforeUrl:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80",
    afterUrl:
      "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=1400&q=80",
  },
  {
    title: "Mercedes-AMG G63 — Showroom Finish",
    location: "Edgbaston",
    tags: ["Exterior Detail", "Wheel Clean", "Engine Bay"],
    notes:
      "Complete exterior refresh with wheel arches, glass, and trim dressing. Deep black restored with sharp reflections.",
    beforeUrl:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1400&q=80",
    afterUrl:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1400&q=80",
  },
  {
    title: "Audi RS7 Sportback — Paint Correction",
    location: "Harborne",
    tags: ["Paint Correction", "Polish", "Protection"],
    notes:
      "Multi-stage correction on soft Audi paint. Holograms removed and a high-clarity finish locked in with sealant.",
    beforeUrl:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1400&q=80",
    afterUrl:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1400&q=80",
  },
  {
    title: "Lamborghini Huracán — Concours Prep",
    location: "Moseley",
    tags: ["Concours", "Ceramic Coating", "Interior Detail"],
    notes:
      "Concours-level prep for a private collection vehicle. Paint depth enhanced and cabin thoroughly detailed.",
    beforeUrl:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&q=80",
    afterUrl:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=80",
  },
  {
    title: "Tesla Model S — Modern Detail",
    location: "Sutton Coldfield",
    tags: ["Exterior Wash", "Interior", "Glass"],
    notes:
      "Safe wash process for EV paintwork, interior vacuum and wipe-down, with streak-free glass and tyre dressing.",
    beforeUrl:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1400&q=80",
    afterUrl:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1400&q=80",
  },
];

async function ensureBuckets() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const names = new Set((buckets || []).map((b) => b.name));

  for (const name of [DATA_BUCKET, IMAGES_BUCKET]) {
    if (names.has(name)) continue;
    const { error } = await supabase.storage.createBucket(name, {
      public: true,
      fileSizeLimit: 15 * 1024 * 1024,
    });
    if (error && !String(error.message).toLowerCase().includes("already")) {
      throw error;
    }
    console.log("Created bucket:", name);
  }
}

async function downloadImage(imageUrl) {
  const res = await fetch(imageUrl, {
    headers: {
      "User-Agent": "RoyalShineSeed/1.0",
      Accept: "image/*",
    },
  });
  if (!res.ok) {
    throw new Error(`Download failed ${res.status}: ${imageUrl}`);
  }
  const contentType = res.headers.get("content-type") || "image/jpeg";
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
      ? "webp"
      : "jpg";
  return { buf, contentType, ext };
}

async function uploadImage(buf, contentType, ext, folder) {
  const path = `seed/${folder}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(IMAGES_BUCKET).upload(path, buf, {
    contentType,
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

async function main() {
  console.log("Seeding portfolio into Supabase...");
  await ensureBuckets();

  const items = [];

  for (const project of PROJECTS) {
    process.stdout.write(`  → ${project.title} ... `);
    const before = await downloadImage(project.beforeUrl);
    const after = await downloadImage(project.afterUrl);
    const beforeUp = await uploadImage(
      before.buf,
      before.contentType,
      before.ext,
      "before",
    );
    const afterUp = await uploadImage(
      after.buf,
      after.contentType,
      after.ext,
      "after",
    );
    const now = new Date().toISOString();
    items.push({
      _id: `p_seed_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      title: project.title,
      location: project.location,
      notes: project.notes,
      tags: project.tags,
      beforeUrl: beforeUp.url,
      afterUrl: afterUp.url,
      beforePublicId: beforeUp.path,
      afterPublicId: afterUp.path,
      createdAt: now,
      updatedAt: now,
    });
    // slight delay so ids / timestamps differ
    await new Promise((r) => setTimeout(r, 40));
    console.log("ok");
  }

  // Newest first — match admin sort
  items.reverse();

  const body = JSON.stringify(items, null, 2);
  const blob = new Blob([body], { type: "application/json" });
  const { error } = await supabase.storage
    .from(DATA_BUCKET)
    .upload("portfolio.json", blob, {
      upsert: true,
      contentType: "application/json",
    });

  if (error) throw error;

  console.log(`\nDone. ${items.length} projects written to app-data/portfolio.json`);
  console.log("Open /admin/portfolio and the public /portfolio page to verify.");
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message || err);
  process.exit(1);
});
