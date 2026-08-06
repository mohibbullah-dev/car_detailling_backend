import jwt from "jsonwebtoken";
import { getSupabase } from "../config/supabase.js";

/**
 * Accept either:
 * - Demo JWT issued by /api/auth/login (JWT_SECRET + admin:true)
 * - Supabase Auth access token (validated via Admin API getUser)
 */
export async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) return res.status(401).json({ message: "Missing token" });

    // 1) Local demo JWT
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "demo-secret");
      if (decoded?.admin) {
        req.user = decoded;
        return next();
      }
    } catch {
      /* try supabase */
    }

    // 2) Supabase session token
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user?.email) {
        req.user = { admin: true, email: data.user.email };
        return next();
      }
    } catch {
      /* fall through */
    }

    return res.status(401).json({ message: "Invalid token" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
