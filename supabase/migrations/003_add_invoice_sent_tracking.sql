-- Add invoice sent tracking to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS invoice_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS invoice_sent_count INTEGER DEFAULT 0;

COMMENT ON COLUMN orders.invoice_sent_at IS 'Timestamp when invoice was last sent via email';
COMMENT ON COLUMN orders.invoice_sent_count IS 'Number of times invoice has been sent';
