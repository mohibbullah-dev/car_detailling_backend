import { Settings } from "../models/Settings.js";

router.get("/status", async (req, res) => {
  const settings = (await Settings.findOne()) || (await Settings.create({}));
  res.json(settings);
});

router.post("/toggle", protect, async (req, res) => {
  const { isClosed, reason } = req.body;
  const settings = await Settings.findOneAndUpdate(
    {},
    { isClosed, reason },
    { upsert: true, new: true },
  );
  res.json(settings);
});
