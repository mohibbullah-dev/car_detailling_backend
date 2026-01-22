// import { Settings } from "../models/Settings.js";
// import router from "./portfolio.routes.js";

// router.get("/status", async (req, res) => {
//   const settings = (await Settings.findOne()) || (await Settings.create({}));
//   res.json(settings);
// });

// router.post("/toggle", protect, async (req, res) => {
//   const { isClosed, reason } = req.body;
//   const settings = await Settings.findOneAndUpdate(
//     {},
//     { isClosed, reason },
//     { upsert: true, new: true },
//   );
//   res.json(settings);
// });

import express from "express";
import { Settings } from "../models/Settings.js";
import { requireAdmin } from "../middleware/auth.js"; // Corrected path

const router = express.Router();

router.get("/status", async (req, res) => {
  try {
    const settings = (await Settings.findOne()) || (await Settings.create({}));
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching status" });
  }
});

router.post("/toggle", requireAdmin, async (req, res) => {
  try {
    const { isClosed, reason } = req.body;
    const settings = await Settings.findOneAndUpdate(
      {},
      { isClosed, reason },
      { upsert: true, new: true },
    );
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
});

export default router;
