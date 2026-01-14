import mongoose from "mongoose";

const PortfolioItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    notes: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],

    beforeUrl: { type: String, required: true },
    afterUrl: { type: String, required: true },

    beforePublicId: { type: String, required: true },
    afterPublicId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("PortfolioItem", PortfolioItemSchema);
