import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import { getSettings, saveSettings } from "../lib/store.js";

const router = express.Router();

router.get("/status", async (_req, res) => {
  try {
    const settings = await getSettings();
    res.json({
      isClosed: !!settings.isClosed,
      reason: settings.reason || "We are currently fully booked.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching status" });
  }
});

router.post("/toggle", requireAdmin, async (req, res) => {
  try {
    const { isClosed, reason } = req.body || {};
    const settings = await saveSettings({
      isClosed: !!isClosed,
      reason: reason || "We are currently fully booked.",
    });
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating status" });
  }
});

export default router;
