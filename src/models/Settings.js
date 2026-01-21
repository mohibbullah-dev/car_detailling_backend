import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  isClosed: { type: Boolean, default: false },
  reason: { type: String, default: "We are currently fully booked." },
});

export const Settings = mongoose.model("Settings", settingsSchema);
