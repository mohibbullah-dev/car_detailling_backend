# Royal Shine API — Supabase Storage (no Mongo / Cloudinary)

## Local demo
1. `cd car_detailling_backend` → copy `.env.example` to `.env` (already filled locally)
2. `npm run dev` → http://localhost:8080
3. Frontend `.env`: `VITE_API_BASE=http://localhost:8080`
4. Login: `admin@gmail.com` / `123456`

## Storage buckets (auto-created)
- `app-data` — portfolio.json, settings.json, site-content.json
- `portfolio-images` — before/after images (public URLs)

## Vercel frontend for clients
Frontend alone is not enough — deploy this backend (Vercel/Render) with the same `.env` keys, then set frontend:
`VITE_API_BASE=https://YOUR-BACKEND-URL`
and redeploy frontend.
