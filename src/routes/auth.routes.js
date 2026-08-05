import express from "express";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

function issueToken(email) {
  return jwt.sign(
    { admin: true, email },
    process.env.JWT_SECRET || "demo-secret",
    { expiresIn: "7d" },
  );
}

function getAuthClient() {
  const url = process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

router.post("/bootstrap", async (_req, res) => {
  const email = process.env.ADMIN_EMAIL;
  const pass = process.env.ADMIN_PASSWORD;
  if (!email || !pass) {
    return res
      .status(500)
      .json({ message: "ADMIN_EMAIL/PASSWORD missing in env" });
  }
  return res.json({
    message:
      "Demo ready. Login with env admin OR any Supabase Auth user (email confirmation off for demo).",
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

    // 1) Env demo credentials (always works if set)
    if (
      email.toLowerCase() === adminEmail &&
      String(password) === String(adminPass)
    ) {
      return res.json({ token: issueToken(adminEmail), email: adminEmail });
    }

    // 2) Supabase Auth user (the one you created in Dashboard)
    const auth = getAuthClient();
    if (auth) {
      const { data, error } = await auth.auth.signInWithPassword({
        email: email.trim(),
        password: String(password),
      });

      if (!error && data?.user?.email) {
        return res.json({
          token: issueToken(data.user.email.toLowerCase()),
          email: data.user.email.toLowerCase(),
        });
      }

      console.warn("Supabase Auth login failed:", error?.message);
    }

    return res.status(401).json({
      message:
        "Invalid credentials. Use env demo admin, or confirm Supabase user email / disable email confirmation.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;
