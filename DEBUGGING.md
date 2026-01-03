# Debugging Guide

## Issue: Confirmation Page Not Showing After Order Creation

### Steps to Debug

1. **Check Browser Console**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for these messages:
     ```
     Creating order with data: {...}
     Fetching services: [...]
     Services fetched: X
     Creating order with totals: {...}
     Order created successfully: uuid reference-number
     Order items created successfully
     Returning order data: {...}
     Order creation result: {success: true, data: {...}}
     Order created successfully: BOWS-YYYYMMDD-XXX
     ```

2. **Check Server Console**
   - Look at the terminal where `npm run dev` is running
   - Should see the same log messages

3. **Common Issues**

   **Issue A: "Failed to fetch services"**
   - Services don't exist or aren't active
   - Check in Supabase: `SELECT * FROM services WHERE is_active = true;`

   **Issue B: "Failed to create order"**
   - RLS policy blocking insert
   - Run migration 002 to fix
   - Check: `SELECT * FROM pg_policies WHERE tablename = 'orders';`

   **Issue C: "Failed to create order items"**
   - RLS policy blocking insert
   - Run migration 002 to fix

   **Issue D: Order created but redirect fails**
   - Check console for: `Order created successfully: BOWS-...`
   - If you see this but page doesn't redirect, it's a navigation issue
   - Try manually going to: `/booking/confirmation/BOWS-YYYYMMDD-XXX`

4. **Manual Test**

   To test if confirmation page works independently:

   a. Create a test order in Supabase SQL Editor:
   ```sql
   -- First, create a test lead
   INSERT INTO leads (full_name, email, phone)
   VALUES ('Test User', 'test@example.com', '555-1234')
   RETURNING id;

   -- Copy the id from above, then create an order
   INSERT INTO orders (
     lead_id,
     reference_number,
     total_original_price,
     total_bows_price,
     total_savings,
     status
   ) VALUES (
     'paste-lead-id-here',
     'BOWS-TEST-001',
     500.00,
     400.00,
     100.00,
     'pending_payment'
   );
   ```

   b. Go to: `http://localhost:3000/booking/confirmation/BOWS-TEST-001`

   c. If this works, the issue is in order creation or redirect

5. **Check Network Tab**

   - Open DevTools → Network tab
   - Click "Head to Cashier"
   - Look for:
     - POST request (should be 200)
     - Response body should contain the order data
     - Any failed requests?

6. **Check for Errors**

   Common error patterns:

   ```
   ❌ "new row violates row-level security"
   → Run migration 002

   ❌ "reference_number already exists"
   → Rare collision, just retry

   ❌ "leadId is null"
   → Session storage cleared, restart booking flow

   ❌ "cart is empty"
   → Add items to cart first
   ```

### Quick Fixes

**Fix 1: Clear everything and restart**
```javascript
// In browser console
sessionStorage.clear();
localStorage.clear();
location.href = '/booking/contact';
```

**Fix 2: Check if order was actually created**
```sql
-- In Supabase SQL Editor
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;
```

If you see your order, get the reference_number and go directly to:
`/booking/confirmation/[reference_number]`

**Fix 3: Verify RLS policies are fixed**
```sql
-- Should return policies with "Anyone can insert"
SELECT * FROM pg_policies WHERE tablename IN ('leads', 'orders', 'order_items');
```

### Still Not Working?

1. **Check the full error**
   - Browser console (full stack trace)
   - Server console (full error message)
   - Network tab (response body)

2. **Provide this info**:
   - What you see in console
   - What step it fails at
   - Any error messages
   - Did migration 002 run successfully?

3. **Test each part separately**:
   - Can you create a lead? (Test contact form)
   - Can you view services? (Test services page)
   - Can you add to cart? (Test cart functionality)
   - Can you view existing order? (Test confirmation with known reference)

### Expected Flow

```
1. User fills contact form
   → Lead created in DB
   → leadId saved to sessionStorage
   → Redirect to /booking/services

2. User adds items to cart
   → Cart state in Zustand
   → Persisted to localStorage
   → Shows in cart widget

3. User clicks "Continue to Cart"
   → Redirect to /booking/cart
   → Shows cart items

4. User clicks "Complete Order"
   → isCheckingOut flag set to true (prevents redirect during checkout)
   → Order data saved to sessionStorage as "pendingOrder"
   → Cart cleared immediately
   → window.location.href = "/booking/confirmation/pending"

5. Pending page loads
   → Shows loading spinner
   → Retrieves pendingOrder from sessionStorage
   → Calls createOrder() server action
   → Order + order_items inserted to DB
   → sessionStorage.pendingOrder and leadId removed
   → window.location.href = `/booking/confirmation/${reference_number}`

6. Confirmation page loads
   → Fetches order by reference_number
   → Shows order details with QR code and payment instructions
```

Any step failing will show in console!

### Common Issue: "Redirects to /booking/contact after clicking Complete Order"

**Problem**: The cart page has a `useEffect` that redirects if cart is empty. When `clearCart()` is called, it triggers this redirect.

**Solution**: Added `isCheckingOut` flag that prevents the `useEffect` from running during checkout process.

**How it works**:
- User clicks "Complete Order"
- `isCheckingOut` set to `true`
- `useEffect` sees the flag and doesn't redirect
- Cart is cleared safely
- Redirect to pending page happens
