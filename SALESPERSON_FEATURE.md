# Salesperson Feature

## Overview

Added salesperson tracking to orders, allowing admins to assign and track which salesperson handled each order.

## Database Changes

### SQL Migration

Run the SQL in `ADD_SALESPERSON_MIGRATION.sql` in your Supabase SQL Editor:

```sql
-- Add salesperson field to orders table
ALTER TABLE orders
ADD COLUMN salesperson TEXT;

-- Add check constraint for valid salesperson values
ALTER TABLE orders
ADD CONSTRAINT valid_salesperson CHECK (
  salesperson IN (
    'Caleb',
    'Deanna',
    'Jia Ni',
    'Jia Yao',
    'Karen',
    'Jovin',
    'Zi Qi',
    'Lukas'
  ) OR salesperson IS NULL
);

-- Add index for better query performance
CREATE INDEX idx_orders_salesperson ON orders(salesperson);

-- Add comment to document the field
COMMENT ON COLUMN orders.salesperson IS 'Name of the salesperson who handled this order';
```

## Features

### 1. Salesperson Dropdown in Order Edit

**Location**: `/admin/orders/[id]` - Order edit page

**How It Works**:
- Dropdown in "Order Information" card (next to Status)
- 8 salesperson options:
  - Caleb
  - Deanna
  - Jia Ni
  - Jia Yao
  - Karen
  - Jovin
  - Zi Qi
  - Lukas
- Can be left unassigned (shows "Not assigned" in orders list)
- Saved when order is updated

### 2. Salesperson Column in Orders List

**Location**: `/admin/orders` - Orders list page

**What It Shows**:
- New "Salesperson" column between "Customer" and "Total"
- Displays assigned salesperson name
- Shows "Not assigned" in italics if no salesperson selected
- Sortable and filterable (future enhancement)

## Files Modified

### Frontend Components

1. **[components/admin/order-edit-form.tsx](components/admin/order-edit-form.tsx)**
   - Added `SALESPEOPLE` constant array
   - Added `salesperson` state
   - Added salesperson dropdown in UI
   - Updated `handleSubmit` to include salesperson
   - Changed card title from "Order Status" to "Order Information"
   - Two-column grid layout for Status and Salesperson

2. **[app/admin/orders/page.tsx](app/admin/orders/page.tsx)**
   - Added "Salesperson" column header
   - Display salesperson value or "Not assigned"
   - Updated colspan from 6 to 7 for empty state

### Backend

3. **[lib/actions/orders.ts](lib/actions/orders.ts)**
   - Updated `UpdateOrderData` interface to include `salesperson: string | null`
   - Added `salesperson` to database update query

### Types

4. **[types/index.ts](types/index.ts)**
   - Added `salesperson?: string | null` to `Order` interface

## Usage

### Assigning a Salesperson to an Order

1. Navigate to `/admin/orders`
2. Click the edit icon (✏️) next to any order
3. In the "Order Information" card, select a salesperson from the dropdown
4. Click "Save Changes"

### Viewing Salesperson Assignment

1. Navigate to `/admin/orders`
2. View the "Salesperson" column in the orders table
3. Orders without a salesperson show "Not assigned"

## Database Constraints

- **Valid Values**: Only the 8 predefined names are accepted
- **NULL Allowed**: Salesperson can be left unassigned
- **Index**: Added for efficient filtering/sorting queries
- **Type**: TEXT field, stored as-is

## Future Enhancements

Potential additions:
- Filter orders by salesperson
- Salesperson performance dashboard
- Automatic assignment based on availability
- Salesperson commission tracking
- Sales reports per salesperson

---

**Last Updated**: January 3, 2026
**Version**: 1.0.0
