# Setup Guide - PixelPro Studios BOWS Event Booking System

This guide will walk you through setting up the complete application from scratch.

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- A Supabase account (free tier is fine)

## Step 1: Install Dependencies

All dependencies are already configured in `package.json`. Install them:

```bash
npm install
```

## Step 2: Set Up Supabase

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: pixelpro-bows (or any name you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait 1-2 minutes for it to set up

### Get Your API Keys

1. In your Supabase project, go to **Settings** > **API**
2. You'll need:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - keep this secret!)

### Run the Database Migrations

**Migration 1: Initial Schema**

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New query"
3. Open `supabase/migrations/001_initial_schema.sql` from this project
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** (bottom right)
7. You should see "Success. No rows returned"

This creates:
- All database tables (services, leads, orders, order_items, admin_users)
- Indexes for performance
- Row Level Security (RLS) policies
- 8 sample services

**Migration 2: Fix RLS Policies (IMPORTANT)**

1. Create another new query in SQL Editor
2. Open `supabase/migrations/002_fix_rls_policies.sql`
3. Copy and paste the contents
4. Click **Run**
5. You should see "Success. No rows returned"

This fixes an infinite recursion issue in the RLS policies.

### Verify the Migrations

1. Go to **Table Editor** in Supabase
2. You should see tables: `services`, `leads`, `orders`, `order_items`, `admin_users`
3. Click on `services` - you should see 8 sample services

## Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Create an Admin User

You need at least one admin user to access the admin dashboard.

### Option A: Create via Supabase Dashboard (Recommended)

1. In Supabase Dashboard, go to **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Enter:
   - **Email**: your-email@example.com
   - **Password**: YourStrongPassword123
   - Check "Auto Confirm User"
4. Click **Create user**
5. **Important**: Copy the user's UUID (you'll see it in the user list)

6. Go to **SQL Editor**, create a new query, and run:
```sql
INSERT INTO admin_users (id, email, role)
VALUES ('paste-user-uuid-here', 'your-email@example.com', 'admin');
```

### Option B: Create via SQL (Alternative)

If you want to do everything via SQL:

```sql
-- First, create the auth user (replace with your values)
-- Note: This might not work in all Supabase versions
-- If it fails, use Option A above

-- Then link to admin_users
INSERT INTO admin_users (id, email, role)
VALUES (
  'user-uuid-from-auth-users',
  'admin@pixelpro.com',
  'admin'
);
```

## Step 5: Upload Service Images (Optional but Recommended)

The sample services use placeholder image paths. To add real images:

1. Go to **Storage** in Supabase Dashboard
2. Click **Create bucket**
   - Name: `service-images`
   - Make it **public**
3. Upload your service images (JPEG/PNG)
4. Get the public URLs for each image
5. Update the `services` table:

```sql
UPDATE services
SET image_url = 'https://your-project.supabase.co/storage/v1/object/public/service-images/photobooth-1.jpg'
WHERE id = 'service-id-here';
```

Or update in the **Table Editor** manually.

## Step 6: Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Step 7: Test the Application

### Test Customer Booking Flow

1. Go to http://localhost:3000
2. Click "Start Booking"
3. Fill out contact form
4. Browse services and add to cart
5. Review cart and create order
6. View confirmation page with QR code

### Test Admin Dashboard

1. Go to http://localhost:3000/admin/login
2. Login with the admin email/password you created
3. You should see the dashboard with stats
4. Browse Orders, Leads sections

## Common Issues & Solutions

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Cannot connect to Supabase"
- Check your `.env.local` file has correct values
- Ensure there are no extra spaces in the environment variables
- Restart the dev server after changing `.env.local`

### "Unauthorized" error in admin
- Verify the admin_users table has your user UUID
- Check that the email matches exactly
- Try logging out and back in

### Build errors
```bash
npm run build
```
Should complete without errors. If not, check the error message.

### Images not loading
- Make sure the `noise.svg` file exists in `public/`
- For service images, use the Supabase Storage URLs
- Or temporarily use placeholder services like `https://via.placeholder.com/400x300`

## Production Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/pixelpro-marketplace.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Environment Variables**: Add all from `.env.local`
5. Click **Deploy**

### 3. Update Supabase URLs

After deployment:
1. Get your Vercel production URL (e.g., `https://your-app.vercel.app`)
2. In Supabase Dashboard:
   - Go to **Settings** > **API** > **URL Configuration**
   - Add your Vercel URL to allowed domains
3. Update `NEXT_PUBLIC_APP_URL` in Vercel's environment variables

## Next Steps

### Customize Sample Data

Update the sample services in the `services` table:
- Change names, descriptions, prices
- Upload real images
- Add/remove services as needed

### Configure Email (Optional)

For sending quote emails, you can:
1. Set up Supabase Edge Functions
2. Use Resend, SendGrid, or similar service
3. Implement in `/lib/actions` (code templates included in README)

### Add QR Code for Booth

Generate a QR code that points to:
```
https://your-app.vercel.app/booking/contact
```

Print this QR code and display at your BOWS event booth!

## Support

For issues specific to:
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)
- **Supabase**: [Supabase Documentation](https://supabase.com/docs)
- **Deployment**: [Vercel Documentation](https://vercel.com/docs)

## Security Checklist

Before going live:
- [ ] Changed all admin passwords from defaults
- [ ] Verified RLS policies are enabled
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NOT in client-side code
- [ ] Environment variables are set in Vercel (not committed to git)
- [ ] `.env.local` is in `.gitignore`
- [ ] Tested admin authentication works
- [ ] Tested customer flow works

## You're Done! 🎉

Your PixelPro Studios BOWS Event Booking System is now ready to use!
