import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import { getSiteContent, saveSiteContent } from "../lib/store.js";
import {
  defaultBusiness,
  defaultHeroStats,
  defaultFooterLinks,
  defaultFooterServices,
} from "../data/defaultSite.js";

const router = express.Router();

function emptyPayload() {
  return {
    business: defaultBusiness,
    heroStats: defaultHeroStats,
    footerLinks: defaultFooterLinks,
    footerServices: defaultFooterServices,
    pricing: {},
    reviews: {},
    faq: {},
    process: {},
    whyChoose: {},
    contact: {},
  };
}

function toPublic(raw = {}) {
  const base = emptyPayload();
  return {
    business: { ...base.business, ...(raw.business || {}) },
    heroStats:
      Array.isArray(raw.heroStats) && raw.heroStats.length
        ? raw.heroStats
        : base.heroStats,
    footerLinks:
      Array.isArray(raw.footerLinks) && raw.footerLinks.length
        ? raw.footerLinks
        : base.footerLinks,
    footerServices:
      Array.isArray(raw.footerServices) && raw.footerServices.length
        ? raw.footerServices
        : base.footerServices,
    pricing: raw.pricing && Object.keys(raw.pricing).length ? raw.pricing : {},
    reviews: raw.reviews && Object.keys(raw.reviews).length ? raw.reviews : {},
    faq: raw.faq && Object.keys(raw.faq).length ? raw.faq : {},
    process: raw.process && Object.keys(raw.process).length ? raw.process : {},
    whyChoose:
      raw.whyChoose && Object.keys(raw.whyChoose).length ? raw.whyChoose : {},
    contact: raw.contact && Object.keys(raw.contact).length ? raw.contact : {},
    updatedAt: raw.updatedAt || null,
  };
}

router.get("/", async (_req, res) => {
  try {
    const stored = await getSiteContent();
    res.json(toPublic(stored || {}));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load site content" });
  }
});

router.put("/", requireAdmin, async (req, res) => {
  try {
    const allowed = [
      "business",
      "heroStats",
      "footerLinks",
      "footerServices",
      "pricing",
      "reviews",
      "faq",
      "process",
      "whyChoose",
      "contact",
    ];
    const current = (await getSiteContent()) || {};
    const next = { ...current };
    for (const key of allowed) {
      if (req.body[key] !== undefined) next[key] = req.body[key];
    }
    next.updatedAt = new Date().toISOString();
    await saveSiteContent(next);
    res.json(toPublic(next));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update site content" });
  }
});

export default router;
