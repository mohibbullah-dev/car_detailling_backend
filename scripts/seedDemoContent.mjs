/**
 * Seed demo portfolio + many reviews into Supabase (same storage as admin).
 * Usage: node scripts/seedDemoContent.mjs
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL / service role key");
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
    tags: ["Paint Correction", "Ceramic Coating"],
    notes:
      "Two-stage paint correction and ceramic coating. Deep gloss restored across all panels.",
    beforeUrl:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=80",
    afterUrl:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1400&q=80",
  },
  {
    title: "Porsche 911 Carrera — Ceramic Coat",
    location: "Solihull",
    tags: ["Ceramic Coating", "Exterior"],
    notes:
      "Full decontamination, polish, and ceramic protection with a mirror finish.",
    beforeUrl:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80",
    afterUrl:
      "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=1400&q=80",
  },
  {
    title: "Mercedes-AMG G63 — Showroom Finish",
    location: "Edgbaston",
    tags: ["Exterior Detail", "Wheels"],
    notes:
      "Complete exterior refresh with wheel arches, glass, and trim dressing.",
    beforeUrl:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1400&q=80",
    afterUrl:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1400&q=80",
  },
  {
    title: "Audi RS7 Sportback — Paint Correction",
    location: "Harborne",
    tags: ["Paint Correction", "Polish"],
    notes:
      "Multi-stage correction on soft Audi paint with a high-clarity sealant.",
    beforeUrl:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1400&q=80",
    afterUrl:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1400&q=80",
  },
  {
    title: "Range Rover Sport — Interior + Exterior",
    location: "Moseley",
    tags: ["Interior", "Exterior", "Leather"],
    notes:
      "Full cabin deep clean, leather conditioning, and exterior enhancement wash.",
    beforeUrl:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1400&q=80",
    afterUrl:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1400&q=80",
  },
  {
    title: "Tesla Model S — Modern Detail",
    location: "Sutton Coldfield",
    tags: ["EV Safe Wash", "Glass", "Interior"],
    notes:
      "Safe wash for EV paintwork, streak-free glass, and thorough interior wipe-down.",
    beforeUrl:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1400&q=80",
    afterUrl:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1400&q=80",
  },
];

const REVIEWS = [
  {
    id: "rev-sarah-j",
    name: "Sarah Johnson",
    location: "Birmingham",
    platform: "google",
    text: "Absolutely amazing service! My car looks brand new. The attention to detail is incredible — best detailing I've ever booked.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "rev-michael-c",
    name: "Michael Chen",
    location: "Solihull",
    platform: "facebook",
    text: "Professional, punctual, and the results speak for themselves. My BMW has never looked this good. Highly recommend Royal Shine!",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "rev-emma-w",
    name: "Emma Williams",
    location: "Edgbaston",
    platform: "yelp",
    text: "The ceramic coating is worth every penny. Water beads off beautifully and the shine is stunning. Excellent customer service too!",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "rev-david-t",
    name: "David Thompson",
    location: "Harborne",
    platform: "google",
    text: "I've tried many detailers but Royal Shine is in a league of their own. The interior cleaning was phenomenal. Will definitely be back!",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "rev-lisa-a",
    name: "Lisa Anderson",
    location: "Moseley",
    platform: "facebook",
    text: "Outstanding work on my Range Rover. They transformed it completely. Fair pricing and exceptional quality. 5 stars!",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "rev-james-r",
    name: "James Roberts",
    location: "Sutton Coldfield",
    platform: "google",
    text: "Paint correction removed years of swirl marks. The team was friendly, thorough, and clearly passionate about what they do.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "rev-amina-k",
    name: "Amina Khan",
    location: "Dorridge",
    platform: "yelp",
    text: "Mobile detailing at its finest. They arrived on time, worked efficiently, and left my Tesla looking showroom-ready.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "rev-oliver-p",
    name: "Oliver Patel",
    location: "Kings Heath",
    platform: "google",
    text: "Booked the full detail package for my Audi. Every panel looks wet-glass glossy. Communication was clear from start to finish.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "rev-natasha-b",
    name: "Natasha Brown",
    location: "Selly Oak",
    platform: "facebook",
    text: "They came to my driveway and completely revived my dirty white Golf. Seats, carpets, paint — everything feels new again.",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "rev-harry-m",
    name: "Harry Mitchell",
    location: "Erdington",
    platform: "google",
    text: "Used them before a wedding weekend. Car looked magazine-ready. Worth every pound — already booked a maintenance wash.",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "rev-priya-s",
    name: "Priya Sharma",
    location: "Hall Green",
    platform: "yelp",
    text: "Very careful with my child's car seats and the cabin still smells fresh days later. Friendly team and tidy work area.",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "rev-tom-w",
    name: "Tom Wright",
    location: "Perry Barr",
    platform: "google",
    text: "Black paint is unforgiving — they nailed the correction. No holograms, just a deep mirror finish. Top professionals.",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
  },
];

async function downloadImage(imageUrl) {
  const res = await fetch(imageUrl, {
    headers: { "User-Agent": "RoyalShineSeed/1.0", Accept: "image/*" },
  });
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${imageUrl}`);
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

async function uploadJson(path, value) {
  const body = JSON.stringify(value, null, 2);
  const blob = new Blob([body], { type: "application/json" });
  const { error } = await supabase.storage.from(DATA_BUCKET).upload(path, blob, {
    upsert: true,
    contentType: "application/json",
  });
  if (error) throw error;
}

async function downloadJson(path, fallback) {
  const { data, error } = await supabase.storage.from(DATA_BUCKET).download(path);
  if (error) return fallback;
  const text = await data.text();
  if (!text) return fallback;
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

async function main() {
  console.log("Seeding portfolio + reviews (service role)...");

  const items = [];
  for (const project of PROJECTS) {
    process.stdout.write(`  portfolio: ${project.title} ... `);
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
    await new Promise((r) => setTimeout(r, 30));
    console.log("ok");
  }
  items.reverse();
  await uploadJson("portfolio.json", items);
  console.log(`Saved ${items.length} portfolio projects`);

  const existingSite = (await downloadJson("site-content.json", {})) || {};
  const site = {
    ...existingSite,
    reviews: {
      ...(existingSite.reviews || {}),
      aggregate: {
        overall: "5.0",
        total: `${REVIEWS.length * 20}+`,
        platforms: [
          { id: "google", rating: "5.0", count: "120+" },
          { id: "facebook", rating: "4.9", count: "85+" },
          { id: "yelp", rating: "5.0", count: "45+" },
        ],
      },
      items: REVIEWS,
      trustStats: [
        { value: "1,000+", label: "Happy Customers", icon: "shieldCheck" },
        { value: "500+", label: "Vehicles Detailed", icon: "car" },
        { value: "5+", label: "Years of Experience", icon: "trophy" },
        { value: "100%", label: "Satisfaction Guarantee", icon: "award" },
      ],
      platforms: {
        google: "Google",
        facebook: "Facebook",
        yelp: "Yelp",
      },
    },
    updatedAt: new Date().toISOString(),
  };
  await uploadJson("site-content.json", site);
  console.log(`Saved ${REVIEWS.length} reviews into site-content.json`);

  await uploadJson("settings.json", {
    isClosed: false,
    reason: "We are currently fully booked.",
  });
  console.log("Settings reset to Open");

  console.log("\nDone. Refresh admin Portfolio + Reviews. Re-login if Open/Close fails.");
}

main().catch((err) => {
  console.error("Seed failed:", err.message || err);
  process.exit(1);
});
