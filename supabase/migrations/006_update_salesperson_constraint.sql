-- Update salesperson constraint to include new team members
-- This migration adds Darrvin and Nicole to the valid salesperson list

-- Step 1: Drop the existing constraint
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS valid_salesperson;

-- Step 2: Add the updated constraint with all salespeople
ALTER TABLE orders
ADD CONSTRAINT valid_salesperson CHECK (
  salesperson IN (
    'Caleb',
    'Darrvin',
    'Deanna',
    'Jia Ni',
    'Jia Yao',
    'Jovin',
    'Karen',
    'Lukas',
    'Nicole',
    'Zi Qi'
  ) OR salesperson IS NULL
);

-- Add comment
COMMENT ON CONSTRAINT valid_salesperson ON orders IS 'Ensures salesperson field contains valid team member names or NULL';
