import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initSupabaseStorage } from "./lib/store.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import authRoutes from "./routes/auth.routes.js";
import settingsRoutes from "./routes/settings.js";
import siteRoutes from "./routes/site.routes.js";

dotenv.config();

const app = express();

// Demo: open CORS (no blocking)
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "8mb" }));

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "Royal Shine Detailing API",
    storage: "supabase",
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, storage: "supabase" });
});

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/site", siteRoutes);

const port = process.env.PORT || 8080;

async function bootstrap() {
  await initSupabaseStorage();

  if (!process.env.VERCEL) {
    app.listen(port, () => console.log(`✅ Server running on port ${port}`));
  }
}

await bootstrap().catch((e) => {
  console.error("❌ Failed to start server:", e);
  if (!process.env.VERCEL) process.exit(1);
});

export default app;
