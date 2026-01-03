# Quick Start Guide

Get your PixelPro Studios BOWS Event Booking System running in under 10 minutes!

## Prerequisites
- Node.js 18+ installed
- A Supabase account (free)

## 5-Minute Setup

### 1. Install Dependencies (1 min)
```bash
npm install
```

### 2. Set Up Supabase (3 mins)

**Create Project:**
1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it, create password, choose region → Create

**Run Migrations:**
1. Supabase Dashboard → SQL Editor → New query
2. Copy/paste contents of `supabase/migrations/001_initial_schema.sql`
3. Click Run ✅
4. New query → Copy/paste contents of `supabase/migrations/002_fix_rls_policies.sql`
5. Click Run ✅

**Get API Keys:**
1. Settings → API
2. Copy **Project URL** and **anon public** key

### 3. Configure Environment (1 min)
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Create Admin User (2 mins)

**In Supabase Dashboard:**
1. Authentication → Users → Add user
2. Email: `admin@pixelpro.com`, Password: `YourPassword123`
3. Check "Auto Confirm User" → Create
4. Copy the user's UUID

**In SQL Editor:**
```sql
INSERT INTO admin_users (id, email, role)
VALUES ('paste-uuid-here', 'admin@pixelpro.com', 'admin');
```

### 5. Run the App!
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Quick Test

### Customer Flow:
1. Click "Start Booking"
2. Fill contact form → Continue
3. Add services to cart → Continue
4. Review → Proceed to Cashier
5. See confirmation with QR code ✅

### Admin Dashboard:
1. Go to `/admin/login`
2. Login with admin@pixelpro.com
3. View dashboard, orders, leads ✅

## What Next?

### Upload Real Service Images
1. Supabase → Storage → Create bucket: `service-images` (public)
2. Upload your images
3. Update `services` table with image URLs

### Deploy to Production
```bash
git init
git add .
git commit -m "Initial commit"
git push

# Then deploy on Vercel:
vercel --prod
```

Add environment variables in Vercel dashboard.

### Customize Services
Go to Supabase → Table Editor → `services` table and:
- Update names and descriptions
- Change prices
- Add/remove services
- Update image URLs

## Common Quick Fixes

**"Cannot connect to Supabase"**
→ Check `.env.local` has correct values, restart dev server

**"Unauthorized" in admin**
→ Verify admin_users table has your UUID

**Images not loading**
→ Use placeholder: `https://via.placeholder.com/400x300`

**Build errors**
→ `rm -rf node_modules && npm install`

## That's It! 🎉

You now have a fully functional event booking system!

For detailed documentation, see:
- `SETUP.md` - Complete setup guide
- `README.md` - Full documentation
- `IMPLEMENTATION_SUMMARY.md` - What was built

Need help? Check the docs or Supabase/Next.js documentation.
