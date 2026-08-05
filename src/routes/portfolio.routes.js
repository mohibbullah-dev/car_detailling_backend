import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";
import {
  deletePortfolioImage,
  getPortfolioItems,
  savePortfolioItems,
  uploadPortfolioImage,
} from "../lib/store.js";

const router = express.Router();

function newId() {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function parseTags(tags) {
  if (Array.isArray(tags)) return tags.filter(Boolean);
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

router.get("/", async (_req, res) => {
  try {
    const items = await getPortfolioItems();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load portfolio" });
  }
});

router.post(
  "/",
  requireAdmin,
  upload.fields([
    { name: "before", maxCount: 1 },
    { name: "after", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, location, notes } = req.body || {};
      const tags = parseTags(req.body?.tags);

      if (!title || !location || !notes) {
        return res
          .status(400)
          .json({ message: "title, location, notes are required" });
      }

      const beforeFile = req.files?.before?.[0];
      const afterFile = req.files?.after?.[0];
      if (!beforeFile || !afterFile) {
        return res
          .status(400)
          .json({ message: "before and after images are required" });
      }

      const beforeUp = await uploadPortfolioImage(beforeFile, "before");
      const afterUp = await uploadPortfolioImage(afterFile, "after");

      const now = new Date().toISOString();
      const item = {
        _id: newId(),
        title,
        location,
        notes,
        tags,
        beforeUrl: beforeUp.url,
        afterUrl: afterUp.url,
        beforePublicId: beforeUp.path,
        afterPublicId: afterUp.path,
        createdAt: now,
        updatedAt: now,
      };

      const items = await getPortfolioItems();
      items.unshift(item);
      await savePortfolioItems(items);

      res.status(201).json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  },
);

router.put(
  "/:id",
  requireAdmin,
  upload.fields([
    { name: "before", maxCount: 1 },
    { name: "after", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const items = await getPortfolioItems();
      const index = items.findIndex(
        (i) => i._id === req.params.id || i.id === req.params.id,
      );
      if (index < 0) return res.status(404).json({ message: "Not found" });

      const item = { ...items[index] };
      const { title, location, notes } = req.body || {};
      const tags = req.body?.tags !== undefined ? parseTags(req.body.tags) : item.tags;

      item.title = title ?? item.title;
      item.location = location ?? item.location;
      item.notes = notes ?? item.notes;
      item.tags = tags;

      const beforeFile = req.files?.before?.[0];
      const afterFile = req.files?.after?.[0];

      if (beforeFile) {
        await deletePortfolioImage(item.beforePublicId || item.beforeUrl);
        const beforeUp = await uploadPortfolioImage(beforeFile, "before");
        item.beforeUrl = beforeUp.url;
        item.beforePublicId = beforeUp.path;
      }

      if (afterFile) {
        await deletePortfolioImage(item.afterPublicId || item.afterUrl);
        const afterUp = await uploadPortfolioImage(afterFile, "after");
        item.afterUrl = afterUp.url;
        item.afterPublicId = afterUp.path;
      }

      item.updatedAt = new Date().toISOString();
      items[index] = item;
      await savePortfolioItems(items);
      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Update failed", error: err.message });
    }
  },
);

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const items = await getPortfolioItems();
    const index = items.findIndex(
      (i) => i._id === req.params.id || i.id === req.params.id,
    );
    if (index < 0) return res.status(404).json({ message: "Not found" });

    const [removed] = items.splice(index, 1);
    await deletePortfolioImage(removed.beforePublicId || removed.beforeUrl);
    await deletePortfolioImage(removed.afterPublicId || removed.afterUrl);
    await savePortfolioItems(items);

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
