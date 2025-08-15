
-- Add pricing columns to the user_measurements table
ALTER TABLE public.user_measurements
ADD COLUMN IF NOT EXISTS calculated_price numeric(10, 2),
ADD COLUMN IF NOT EXISTS price_per_unit numeric(10, 2);

-- Add comments for the new columns
COMMENT ON COLUMN public.user_measurements.calculated_price IS 'The total calculated price for the given measurements and quantity.';
COMMENT ON COLUMN public.user_measurements.price_per_unit IS 'The calculated price per single unit.';
