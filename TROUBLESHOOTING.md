# Troubleshooting Guide

Common issues and their solutions for the PixelPro Studios BOWS Event Booking System.

## Database Issues

### ❌ "infinite recursion detected in policy for relation 'admin_users'"

**Problem**: RLS policy causing infinite recursion when checking admin status.

**Solution**: Run the second migration file:
```sql
-- In Supabase SQL Editor, run:
-- Copy contents from: supabase/migrations/002_fix_rls_policies.sql
```

This disables RLS on the `admin_users` table, which is safe since it's only accessed server-side.

**Quick Fix** (if migration doesn't work):
```sql
-- Run this in SQL Editor:
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
```

### ❌ "new row violates row-level security policy for table 'leads'"

**Problem**: RLS policies blocking public inserts. This is a common issue!

**Solution**: Run migration 002 which fixes all RLS policies:
```sql
-- In Supabase SQL Editor:
-- Copy and paste the ENTIRE contents of: supabase/migrations/002_fix_rls_policies.sql
-- Click Run
```

This migration:
- Fixes admin_users infinite recursion
- Allows public inserts to leads, orders, order_items
- Simplifies all RLS policies

**Verify it worked**:
```sql
-- Should show policies allowing INSERT with check (true)
SELECT * FROM pg_policies WHERE tablename = 'leads';
```

### ❌ "Cannot insert into table 'leads'" or "Cannot insert into table 'orders'"

**Problem**: Same as above - RLS policies blocking inserts.

**Solution**: Run migration 002 (see above). This fixes all public insert issues.

### ❌ "relation 'admin_users' does not exist"

**Problem**: Database migration hasn't been run.

**Solution**: Run migration 001 in Supabase SQL Editor.

## Authentication Issues

### ❌ "Unauthorized: Admin access only"

**Problem**: User exists but not linked to admin_users table.

**Solution**:
1. Get your user UUID from Authentication → Users
2. Run in SQL Editor:
```sql
INSERT INTO admin_users (id, email, role)
VALUES ('your-uuid-here', 'your-email@example.com', 'admin');
```

### ❌ Can't login to admin dashboard

**Checklist**:
- [ ] User exists in Authentication → Users?
- [ ] User is confirmed (auto-confirm checked)?
- [ ] User UUID is in admin_users table?
- [ ] Email matches exactly in both tables?
- [ ] Password is correct?

**Debug**:
```sql
-- Check if user is in admin_users
SELECT * FROM admin_users WHERE email = 'your-email@example.com';
```

### ❌ "No user found" after login

**Problem**: Session not persisting.

**Solution**:
1. Clear browser cookies/localStorage
2. Restart dev server
3. Try incognito/private browsing
4. Check `.env.local` has correct Supabase URL

## Environment Variable Issues

### ❌ "Cannot connect to Supabase"

**Problem**: Environment variables not configured or incorrect.

**Checklist**:
- [ ] `.env.local` file exists?
- [ ] No extra spaces in environment variables?
- [ ] Values wrapped in quotes? (They shouldn't be!)
- [ ] Dev server restarted after changing `.env.local`?

**Correct format**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

**Wrong format** (don't do this):
```env
NEXT_PUBLIC_SUPABASE_URL="https://abc.supabase.co"  ❌ No quotes!
NEXT_PUBLIC_SUPABASE_URL = https://abc.supabase.co  ❌ No spaces!
```

### ❌ Environment variables undefined in code

**Problem**: Using wrong prefix or not restarting server.

**Solution**:
1. Ensure prefix is `NEXT_PUBLIC_` for client-side variables
2. Restart dev server: `npm run dev`
3. Check in browser console: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`

## Build Issues

### ❌ "Module not found" errors during build

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### ❌ TypeScript errors during build

**Problem**: Type definitions out of sync.

**Solution**:
```bash
# Regenerate TypeScript config
rm tsconfig.json
npm run dev  # This will regenerate it
# Stop and rebuild
npm run build
```

### ❌ "Cannot find module '@/...'"

**Problem**: Path alias not configured.

**Solution**: Check `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Runtime Issues

### ❌ Images not loading (404)

**Problem**: Image paths don't exist.

**Quick Fix**: Use placeholders temporarily:
```sql
UPDATE services
SET image_url = 'https://via.placeholder.com/400x300/1A1A1A/FAFDFF?text=Service+Image'
WHERE image_url LIKE '/placeholder%';
```

**Proper Fix**: Upload images to Supabase Storage and update URLs.

### ❌ Cart not persisting between refreshes

**Problem**: localStorage not working or cleared.

**Debug**:
1. Check browser console for errors
2. Verify localStorage is enabled
3. Check: `localStorage.getItem('pixelpro-cart-storage')`

**Solution**: Clear and reset:
```javascript
// In browser console
localStorage.removeItem('pixelpro-cart-storage')
// Then refresh page
```

### ❌ "Lead created but order fails"

**Problem**: Session storage cleared or cart empty.

**Debug**:
```javascript
// Check in browser console
sessionStorage.getItem('leadId')  // Should have a UUID
```

**Solution**: The contact form saves leadId to session. If it's missing, restart the booking flow.

## Deployment Issues (Vercel)

### ❌ Build fails on Vercel

**Checklist**:
- [ ] Builds locally? (`npm run build`)
- [ ] Environment variables set in Vercel?
- [ ] Node.js version compatible? (18+)
- [ ] Dependencies installed? (check logs)

### ❌ "Internal Server Error" on deployed site

**Problem**: Environment variables missing or incorrect in Vercel.

**Solution**:
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

### ❌ Supabase connection works locally but not on Vercel

**Problem**: Supabase URL restrictions or environment variables.

**Solution**:
1. Check Supabase allowed domains
2. Verify environment variables in Vercel (all environments: Production, Preview, Development)
3. Check Vercel function logs for specific errors

## Data Issues

### ❌ No services showing in catalog

**Checklist**:
- [ ] Services exist in database?
```sql
SELECT * FROM services WHERE is_active = true;
```
- [ ] RLS policies allow public read?
- [ ] Network tab shows successful API call?

**Solution**: Re-run the sample data insert from migration 001.

### ❌ Order created but no confirmation page

**Problem**: Reference number not generated or redirect failed.

**Debug**: Check server console for errors from `createOrder` action.

**Common causes**:
- Database insert failed (check RLS policies)
- Service prices null/invalid
- Reference number collision (rare)

## Development Server Issues

### ❌ Port 3000 already in use

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm run dev
```

### ❌ Hot reload not working

**Solution**:
```bash
# Restart with turbopack
npm run dev
# Or clear Next.js cache
rm -rf .next
npm run dev
```

## Performance Issues

### ❌ Slow initial page load

**Possible causes**:
- Large images not optimized
- Too many database queries
- Supabase in different region

**Solutions**:
1. Use Next.js Image component (already implemented)
2. Enable Supabase caching
3. Consider CDN for images

### ❌ Admin dashboard slow

**Problem**: Too many records or inefficient queries.

**Solutions**:
1. Add pagination to tables
2. Use database indexes (already in migration)
3. Limit initial data fetch
4. Add loading states

## Still Having Issues?

### Check the logs

**Client-side**:
- Browser console (F12)
- Network tab for API calls

**Server-side**:
- Terminal where `npm run dev` is running
- Vercel function logs (if deployed)

**Database**:
- Supabase Dashboard → Logs
- SQL Editor for direct queries

### Get help

1. **Next.js Issues**: [Next.js Documentation](https://nextjs.org/docs)
2. **Supabase Issues**: [Supabase Documentation](https://supabase.com/docs)
3. **Deployment Issues**: [Vercel Documentation](https://vercel.com/docs)

### Common debugging commands

```bash
# Check environment variables are loaded
npm run dev
# Then in another terminal:
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"

# Clear all caches and rebuild
rm -rf node_modules .next package-lock.json
npm install
npm run build

# Check database connection
# In browser console after page loads:
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)

# Test Supabase connection
# In Supabase Dashboard → SQL Editor:
SELECT NOW();  # Should return current timestamp
```

### Create an issue

If none of these solutions work:
1. Check what you tried
2. Share relevant error messages
3. Note your environment (OS, Node version, browser)
4. Include steps to reproduce

## Prevention Tips

✅ **Always run both migrations** (001 and 002)
✅ **Restart dev server** after changing environment variables
✅ **Check Supabase logs** when database operations fail
✅ **Use browser DevTools** to inspect network requests
✅ **Test in incognito mode** to rule out cache issues
✅ **Build locally** before deploying to Vercel
✅ **Keep environment variables in sync** across all environments
