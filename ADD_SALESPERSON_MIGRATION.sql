-- Add salesperson field to orders table
-- Run this SQL in your Supabase SQL Editor

-- Step 1: Add the salesperson column to orders table
ALTER TABLE orders
ADD COLUMN salesperson TEXT;

-- Step 2: Add a check constraint for valid salesperson values
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

-- Step 3: Add an index for better query performance
CREATE INDEX idx_orders_salesperson ON orders(salesperson);

-- Step 4: Add a comment to document the field
COMMENT ON COLUMN orders.salesperson IS 'Name of the salesperson who handled this order';

-- Optional: Set a default salesperson for existing orders (update as needed)
-- UPDATE orders SET salesperson = 'Caleb' WHERE salesperson IS NULL;
