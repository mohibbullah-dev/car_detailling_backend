import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

function issueToken(email) {
  return jwt.sign(
    { admin: true, email },
    process.env.JWT_SECRET || "demo-secret",
    { expiresIn: "7d" },
  );
}

/** Demo: admin comes from env — no DB user table needed */
router.post("/bootstrap", async (_req, res) => {
  const email = process.env.ADMIN_EMAIL;
  const pass = process.env.ADMIN_PASSWORD;
  if (!email || !pass) {
    return res
      .status(500)
      .json({ message: "ADMIN_EMAIL/PASSWORD missing in env" });
  }
  return res.json({
    message: "Demo admin ready (env-based). Use /api/auth/login",
    email,
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
    const adminPass = process.env.ADMIN_PASSWORD || "";

    if (
      email.toLowerCase() !== adminEmail ||
      String(password) !== String(adminPass)
    ) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = issueToken(adminEmail);
    res.json({ token, email: adminEmail });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;
