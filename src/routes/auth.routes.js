import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";

const router = express.Router();

/**
 * One-time admin bootstrap (safe-ish for demo).
 * You can disable this route after first use.
 */
router.post("/bootstrap", async (req, res) => {
  const email = process.env.ADMIN_EMAIL;
  const pass = process.env.ADMIN_PASSWORD;

  if (!email || !pass) {
    return res
      .status(500)
      .json({ message: "ADMIN_EMAIL/PASSWORD missing in env" });
  }

  const exists = await AdminUser.findOne({ email });
  if (exists) return res.json({ message: "Admin already exists" });

  const passwordHash = await bcrypt.hash(pass, 10);
  await AdminUser.create({ email, passwordHash });

  return res.json({ message: "✅ Admin created" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const user = await AdminUser.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { admin: true, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

export default router;
