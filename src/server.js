// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";

// import { connectDB } from "./config/db.js";
// import { initCloudinary } from "./config/cloudinary.js";

// import portfolioRoutes from "./routes/portfolio.routes.js";
// import authRoutes from "./routes/auth.routes.js";

// dotenv.config();

// const app = express();

// /**
//  * ✅ CORS for Vercel frontend + local
//  * IMPORTANT: must allow PUT/DELETE + Authorization header
//  */
// const allowedOrigins = [
//   "https://car-detailing-three.vercel.app",
//   "http://localhost:5173",
//   "http://localhost:3000",
// ];

// app.use(
//   cors({
//     origin: (origin, cb) => {
//       if (!origin) return cb(null, true);
//       if (allowedOrigins.includes(origin)) return cb(null, true);
//       return cb(new Error("CORS blocked"), false);
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );

// app.use(express.json({ limit: "2mb" }));

// app.get("/", (req, res) => res.send("API running ✅"));
// app.get("/health", (req, res) => res.json({ ok: true }));

// app.use("/api/auth", authRoutes);
// app.use("/api/portfolio", portfolioRoutes);

// const port = process.env.PORT || 8080;

// async function start() {
//   await connectDB();
//   initCloudinary();

//   console.log(
//     "MONGO_URI loaded:",
//     process.env.MONGO_URI?.replace(/:\/\/.*?:.*?@/, "://****:****@"),
//   );

//   app.listen(port, () => console.log(`✅ Server running on port ${port}`));
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
import settingsRoutes from "./routes/settings.js"; //

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://car-detailing-three.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "2mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/settings", settingsRoutes); // REGISTERED HERE

const port = process.env.PORT || 8080;
async function start() {
  await connectDB();
  initCloudinary();
  app.listen(port, () => console.log(`✅ Server running on port ${port}`));
}
start().catch((e) => console.error("❌ Failed to start server:", e));
