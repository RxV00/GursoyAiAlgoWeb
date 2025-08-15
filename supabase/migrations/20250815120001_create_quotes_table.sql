
-- Create the quotes table
CREATE TABLE IF NOT EXISTS public.quotes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    configuration jsonb NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own quotes" ON public.quotes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quotes" ON public.quotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own quotes" ON public.quotes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own quotes" ON public.quotes FOR DELETE USING (auth.uid() = user_id);

-- Add comments
COMMENT ON TABLE public.quotes IS 'Stores user-created quotes, including product configuration and pricing.';
COMMENT ON COLUMN public.quotes.configuration IS 'JSON object containing all details of the quote, such as product, measurements, price, etc.';
