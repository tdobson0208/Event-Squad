
# EventSquad – Next.js + Supabase Starter

Collaborative event planning with announcements/RSVP, staffing/tasks, food + recipes & allergen notes, equipment/game requests, polls, time slots, a shared photo dropbox, **and per‑event theme customization**.

## Quick Start

1. **Create Supabase project** (free tier is fine).
2. **Copy** `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE`
3. **Run migrations** (Schema + Policies):
   ```bash
   psql $YOUR_SUPABASE_DB_URL -f sql/schema.sql
   psql $YOUR_SUPABASE_DB_URL -f sql/policies.sql
   ```
   Or paste both files into the Supabase SQL editor and run.
4. **Create a Storage bucket** named `event-photos` (public read). Set policy to allow **signed uploads**.
5. **Install & run**:
   ```bash
   npm i
   npm run dev
   ```

## Branding & Themes

- Default app vibe: **Calm but fun** using:
  - Primary `#4F46E5` (Indigo 600)
  - Accent `#F97316` (Orange 500)
  - Success `#10B981` (Emerald 500)
- Per-event theme fields: `theme_color`, `accent_color`, `header_image`.
- UI reads event colors into CSS vars so headers, buttons, and chips tint accordingly.

## Features
- Event page at `/e/[shareCode]`
- Announcement/About + RSVP details
- Food & recipes (link or notes; allergen tags)
- Equipment & game requests (claim to bring)
- Time slots
- Polls (single-choice demo)
- Photo Dropbox with signed upload URLs + QR
- **Per-event theme color & header image**

> Security note: RLS is open for prototyping. Lock it down before production.
