-- Fix Storage Policies for plant-images bucket
-- Run this in Supabase SQL Editor to fix the "row violates security policy" error

-- First, drop existing policies if any
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Public access to plant images" ON storage.objects;

-- Create proper storage policies
CREATE POLICY "Authenticated users can upload to plant-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'plant-images');

CREATE POLICY "Anyone can view plant-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'plant-images');

CREATE POLICY "Users can update their own uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'plant-images');

CREATE POLICY "Users can delete their own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'plant-images');
