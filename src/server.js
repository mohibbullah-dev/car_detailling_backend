// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";

// import { connectDB } from "./config/db.js";
// import { initCloudinary } from "./config/cloudinary.js";

// import portfolioRoutes from "./routes/portfolio.routes.js";
// import authRoutes from "./routes/auth.routes.js";

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json({ limit: "2mb" })); // images handled by multer (memory)
// app.get("/", (req, res) => res.send("API running ✅"));

// app.use("/api/auth", authRoutes);
// app.use("/api/portfolio", portfolioRoutes);

// const port = process.env.PORT || 8080;

// async function start() {
//   await connectDB();
//   initCloudinary();
//   console.log(
//     "MONGO_URI loaded:",
//     process.env.MONGO_URI?.replace(/:\/\/.*?:.*?@/, "://****:****@")
//   );

//   app.listen(port, () => {
//     console.log(`✅ Server running on http://localhost:${port}`);
//   });
// }

// start().catch((e) => {
//   console.error("❌ Failed to start server:", e);
//   process.exit(1);
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import { initCloudinary } from "./config/cloudinary.js";

import portfolioRoutes from "./routes/portfolio.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

/**
 * CORS (safe for local + Vercel)
 * If you want strict later, set FRONTEND_URL in env and use it as origin.
 */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));

// Health routes (Back4App health check can use /health or /)
app.get("/", (req, res) => res.send("API running ✅"));
app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);

const port = process.env.PORT || 8080;

async function start() {
  await connectDB();
  initCloudinary();

  // mask credentials in logs
  console.log(
    "MONGO_URI loaded:",
    process.env.MONGO_URI?.replace(/:\/\/.*?:.*?@/, "://****:****@")
  );

  app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });
}

start().catch((e) => {
  console.error("❌ Failed to start server:", e);
  process.exit(1);
});
