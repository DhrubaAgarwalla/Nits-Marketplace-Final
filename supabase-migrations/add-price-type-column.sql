-- Add price_type column to items table
ALTER TABLE items ADD COLUMN IF NOT EXISTS price_type TEXT NOT NULL DEFAULT 'fixed';

-- Update existing items to have a default price_type
UPDATE items SET price_type = 'fixed' WHERE price_type IS NULL;

-- Add comment to the column
COMMENT ON COLUMN items.price_type IS 'Price type (fixed or negotiable)';
