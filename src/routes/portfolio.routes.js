import express from "express";
import PortfolioItem from "../models/PortfolioItem.js";
import { upload } from "../middleware/multer.js";
import { requireAdmin } from "../middleware/auth.js";
import { cloudinary } from "../config/cloudinary.js";

const router = express.Router();

async function uploadToCloudinary(fileBuffer, folder) {
  // convert buffer -> base64 data uri
  const base64 = fileBuffer.toString("base64");
  const dataUri = `data:image/jpeg;base64,${base64}`;

  const res = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });

  return { url: res.secure_url, publicId: res.public_id };
}

// Public: list all portfolio items
router.get("/", async (req, res) => {
  const items = await PortfolioItem.find().sort({ createdAt: -1 });
  res.json(items);
});

// Admin: create new portfolio item with before/after images
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
      let { tags } = req.body || {};

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

      // tags can be: "Leak Fix,Emergency" or array
      if (typeof tags === "string") {
        tags = tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
      if (!Array.isArray(tags)) tags = [];

      const folder = "portfolio_uploads";

      const beforeUp = await uploadToCloudinary(beforeFile.buffer, folder);
      const afterUp = await uploadToCloudinary(afterFile.buffer, folder);

      const created = await PortfolioItem.create({
        title,
        location,
        notes,
        tags,
        beforeUrl: beforeUp.url,
        afterUrl: afterUp.url,
        beforePublicId: beforeUp.publicId,
        afterPublicId: afterUp.publicId,
      });

      res.status(201).json(created);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

// Admin: delete portfolio item (optional)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    // remove from cloudinary
    await cloudinary.uploader.destroy(item.beforePublicId);
    await cloudinary.uploader.destroy(item.afterPublicId);

    await item.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
