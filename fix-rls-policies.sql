-- Complete RLS Policy Fix
-- Run this in Supabase SQL Editor to fix the "row violates security policy" error

-- Option 1: Simple Fix - Temporarily disable RLS for testing
-- Uncomment these lines if you want to quickly test without RLS:
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.plants DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.treatments DISABLE ROW LEVEL SECURITY;

-- Option 2: Fix the policies properly (recommended)

-- First, ensure the trigger function works correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Make sure all existing auth users have profiles
INSERT INTO public.users (id, email, name)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', '') as name
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Update plants policies to be more permissive for authenticated users
DROP POLICY IF EXISTS "Users can insert own plants" ON public.plants;
CREATE POLICY "Users can insert own plants"
  ON public.plants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own plants" ON public.plants;
CREATE POLICY "Users can view own plants"
  ON public.plants FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Storage policies
DROP POLICY IF EXISTS "Authenticated uploads to plant-images" ON storage.objects;
CREATE POLICY "Authenticated uploads to plant-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'plant-images');

DROP POLICY IF EXISTS "Public read plant-images" ON storage.objects;
CREATE POLICY "Public read plant-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'plant-images');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'RLS policies updated successfully! Try uploading again.';
END $$;
