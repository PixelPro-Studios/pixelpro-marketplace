-- Add deposit percentage, deposit amount, amount paid, and remarks to orders table

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS deposit_percentage DECIMAL(5,2) DEFAULT 30.00,
ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS balance_due DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS remarks TEXT;

-- Add comment to explain the columns
COMMENT ON COLUMN orders.deposit_percentage IS 'Percentage of total amount required as deposit (default 30%)';
COMMENT ON COLUMN orders.deposit_amount IS 'Calculated deposit amount based on percentage';
COMMENT ON COLUMN orders.amount_paid IS 'Total amount paid by customer so far';
COMMENT ON COLUMN orders.balance_due IS 'Remaining balance to be paid';
COMMENT ON COLUMN orders.remarks IS 'Internal notes/remarks for the order';

-- Update existing orders to set default deposit values
UPDATE orders
SET
  deposit_percentage = 30.00,
  deposit_amount = (total_bows_price * 0.30),
  amount_paid = CASE
    WHEN status = 'paid' THEN total_bows_price
    ELSE 0.00
  END,
  balance_due = CASE
    WHEN status = 'paid' THEN 0.00
    ELSE total_bows_price
  END
WHERE deposit_percentage IS NULL;
