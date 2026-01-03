# Admin Order Management

## Overview

Admins can now fully edit and manage orders through a comprehensive order amendment UI.

## Features

### 1. QR Code Scanner

**Location**: `/admin/orders` page - "Scan QR Code" button in top-right

**How It Works**:
- Click "Scan QR Code" button
- Camera view opens in modal
- Point camera at order confirmation QR code
- Order automatically opens in edit mode
- Fast access for cashier payments

**Use Cases**:
- Customer arrives at cashier with QR code
- Admin scans code to view/edit order
- Process payment and update status
- Quick order lookup without typing

### 2. Order Editing Interface

**Access**:
- `/admin/orders` → Click "Edit" on any order
- **OR** Scan order QR code with scanner

**What You Can Edit**:
- ✅ Order status (pending_payment, paid, bundle_requested, confirmed, cancelled)
- ✅ Add new services to the order
- ✅ Remove services from the order
- ✅ Update quantities for existing services
- ✅ **Override final BOWS price** (custom discounts/adjustments)
- ✅ View real-time pricing updates

### 3. Custom Price Override

**Feature**: Manually adjust the final BOWS price

**How to Use**:
1. Edit an order
2. Scroll to "Order Summary" card
3. See "Final BOWS Price (Optional Override)" field
4. Enter custom amount (e.g., apply extra discount)
5. System shows adjustment amount
6. Click "Reset" to return to calculated price

**Use Cases**:
- Apply promotional discounts
- Price matching
- Special customer accommodations
- Bundle deals
- Loyalty discounts

**Example**:
- Calculated price: $500.00
- Custom override: $450.00
- System shows: "$50.00 adjustment"

### 4. Order Status Management

Available statuses:
- **Pending Payment** (Yellow) - Default for new orders, awaiting payment
- **Paid** (Green) - Payment received and confirmed
- **Cancelled** (Red) - Order cancelled by customer or admin

### 5. Service Management

**Add Services**:
1. Select service from dropdown
2. Service automatically added with quantity 1
3. If service already exists, quantity increments
4. Pricing updates automatically

**Remove Services**:
- Click trash icon next to service
- Minimum 1 service required per order

**Update Quantities**:
- Use +/- buttons
- Or type directly in quantity field
- Pricing recalculates in real-time

### 4. Automatic Calculations

The system automatically calculates:
- Original total price
- BOWS discounted price
- Total savings
- Updates as you modify items

### 5. Customer Information Panel

View customer details:
- Full name
- Email
- Phone number
- Event date
- Event type
- Additional notes

### 6. Order History

Track order changes:
- Created date/time
- Last updated date/time

## User Flow

### Quick Access via QR Scanner

1. **Customer Arrives at Cashier**
   - Customer shows QR code on phone/printout

2. **Scan QR Code**
   ```
   Admin Dashboard → Orders → "Scan QR Code"
   ```

3. **Camera Opens**
   - Point camera at QR code
   - System auto-detects and opens order

4. **Edit & Process**
   - Adjust price if needed
   - Update status to "paid"
   - Save changes

### Editing an Order Manually

1. **Navigate to Orders**
   ```
   Admin Dashboard → Orders
   ```

2. **Select Order to Edit**
   - Click "Edit" button next to any order
   - Or use QR scanner for quick access

3. **Make Changes**
   - Update status dropdown
   - Add/remove services
   - Adjust quantities
   - Override final price (optional)
   - Review totals

4. **Save Changes**
   - Click "Save Changes" button
   - Wait for success message
   - Auto-redirect to orders list

5. **Cancel Editing**
   - Click "Cancel" button
   - Returns to orders list without saving

## Technical Details

### Files Created

**QR Scanner Component**:
- [`components/admin/qr-scanner.tsx`](components/admin/qr-scanner.tsx)
  - Client component with camera access
  - Uses html5-qrcode library
  - Auto-detects QR codes
  - Extracts reference number
  - Redirects to order edit page

**API Route**:
- [`app/api/orders/by-reference/[reference]/route.ts`](app/api/orders/by-reference/[reference]/route.ts)
  - GET endpoint
  - Fetches order ID by reference number
  - Returns order data for scanner

**Page Component**:
- [`app/admin/orders/[id]/page.tsx`](app/admin/orders/[id]/page.tsx)
  - Server component
  - Fetches order with items and customer data
  - Fetches all active services

**Form Component**:
- [`components/admin/order-edit-form.tsx`](components/admin/order-edit-form.tsx)
  - Client component
  - Manages order state
  - Handles add/remove/update operations
  - **Custom price override functionality**
  - Calculates totals in real-time
  - Submits changes to server action

### Files Modified

**Orders List**:
- [`app/admin/orders/page.tsx`](app/admin/orders/page.tsx)
  - Added "Edit" link to actions column
  - **Added QR Scanner button**
  - **Replaced View button with Send Invoice button**

**Server Actions**:
- [`lib/actions/orders.ts`](lib/actions/orders.ts)
  - Added `updateOrder()` function
  - Handles order updates
  - Manages order items (insert/update/delete)
  - Updates totals and status

- [`lib/actions/invoices.ts`](lib/actions/invoices.ts)
  - Added `sendInvoice()` function
  - Generates PDF invoice using jsPDF
  - Sends invoice email to customer

**Components**:
- [`components/admin/send-invoice-button.tsx`](components/admin/send-invoice-button.tsx)
  - Client component for invoice sending
  - Loading states and feedback messages
  - Error handling

**Dependencies**:
- Added `html5-qrcode` package for QR scanning
- Added `jspdf` package for PDF generation

### Server Action: `updateOrder()`

**Parameters**:
```typescript
{
  orderId: string,
  data: {
    status: string,
    items: Array<{
      id?: string,           // Existing item ID or undefined for new
      service_id: string,
      quantity: number
    }>,
    total_original_price: number,
    total_bows_price: number,
    total_savings: number
  }
}
```

**Process**:
1. Updates order table with new status and totals
2. Fetches existing order items
3. Determines which items to:
   - **Update** - Existing items with changed quantities
   - **Insert** - New items (temp IDs)
   - **Delete** - Items removed from order
4. Executes database operations
5. Returns success/error response

### Database Operations

**Tables Updated**:
- `orders` - Status, totals, updated_at timestamp
- `order_items` - Quantities, pricing for modified/new items

**Validation**:
- Minimum 1 item per order
- Valid service IDs
- Positive quantities
- Accurate pricing from services table

## Security

**Authorization**:
- Route protected by middleware
- Admin authentication required
- RLS policies enforce admin-only access

**Data Validation**:
- Server-side validation of all inputs
- Service prices fetched from database (not client)
- Totals recalculated server-side

## UI/UX Features

### Responsive Design
- Mobile-friendly layout
- Sidebar customer info on desktop
- Stacked layout on mobile

### Real-time Feedback
- Instant total calculations
- Success/error messages
- Loading states during save

### Error Handling
- Clear error messages
- Prevents invalid operations
- Graceful failure recovery

### User Guidance
- Disabled buttons for invalid actions
- Placeholder text in dropdowns
- Clear status indicators

## Example Usage

### Change Order Status

```
1. Click "Edit" on order
2. Select new status from dropdown
3. Click "Save Changes"
```

### Add Service to Order

```
1. Click "Edit" on order
2. Select service from "Add Service" dropdown
3. Adjust quantity if needed
4. Click "Save Changes"
```

### Update Service Quantity

```
1. Click "Edit" on order
2. Use +/- buttons or type new quantity
3. Watch totals update automatically
4. Click "Save Changes"
```

### Remove Service from Order

```
1. Click "Edit" on order
2. Click trash icon next to service
3. Click "Save Changes"
```

## Troubleshooting

### "Order must have at least one item"
- You tried to remove the last service
- Every order requires at least 1 service

### "Failed to update order"
- Check database connection
- Verify admin permissions
- Check browser console for errors

### Changes not saving
- Ensure you clicked "Save Changes"
- Check for error messages
- Verify database RLS policies

### 7. Invoice Generation and Email

**Location**: `/admin/orders` page - "Send Invoice" button in Actions column

**How It Works**:
- Click "Send Invoice" button next to any order
- System generates professional PDF invoice with:
  - Company header (PixelPro Studios)
  - Invoice metadata (reference number, date, status)
  - Customer information (name, email, phone, event details)
  - Line items table with services, quantities, and pricing
  - Totals breakdown (original price, BOWS discount, final amount)
  - Additional notes if provided
- Invoice is sent to customer's email address
- Real-time feedback with loading and success/error states

**Invoice Contents**:
- **Header**: PixelPro Studios branding with invoice number
- **Customer Details**: Full contact info and event information
- **Service Items**: Itemized list with quantities and prices
- **Pricing Summary**: Original total, BOWS discount savings, final amount due
- **Footer**: Thank you message and business info

**Use Cases**:
- Send invoice immediately after order confirmation
- Resend invoice if customer loses original
- Generate invoice for record-keeping
- Email invoice for payment processing

## Future Enhancements

Potential additions:
- Order notes/comments system
- Bulk order operations
- Order duplication
- Payment tracking integration
- Invoice customization options
- Email notification settings

---

**Last Updated**: January 3, 2026
**Version**: 1.0.0
