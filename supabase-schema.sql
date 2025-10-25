-- Plant Health Diagnostic App - Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plants table
CREATE TABLE IF NOT EXISTS public.plants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  plant_name TEXT,
  diagnosis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Treatments table
CREATE TABLE IF NOT EXISTS public.treatments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plant_id UUID REFERENCES public.plants(id) ON DELETE CASCADE NOT NULL,
  step INTEGER NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS plants_user_id_idx ON public.plants(user_id);
CREATE INDEX IF NOT EXISTS treatments_plant_id_idx ON public.treatments(plant_id);
CREATE INDEX IF NOT EXISTS plants_created_at_idx ON public.plants(created_at DESC);

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Plants policies
CREATE POLICY "Users can view own plants"
  ON public.plants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plants"
  ON public.plants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plants"
  ON public.plants FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plants"
  ON public.plants FOR DELETE
  USING (auth.uid() = user_id);

-- Treatments policies
CREATE POLICY "Users can view treatments for own plants"
  ON public.treatments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.plants
      WHERE plants.id = treatments.plant_id
      AND plants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert treatments for own plants"
  ON public.treatments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plants
      WHERE plants.id = treatments.plant_id
      AND plants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update treatments for own plants"
  ON public.treatments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.plants
      WHERE plants.id = treatments.plant_id
      AND plants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete treatments for own plants"
  ON public.treatments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.plants
      WHERE plants.id = treatments.plant_id
      AND plants.user_id = auth.uid()
    )
  );

-- Create a function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for plant images (run this separately in Storage settings)
-- Storage bucket name: 'plant-images'
-- Public access: true (for displaying images)
-- Allowed MIME types: image/jpeg, image/png, image/webp
-- Max file size: 5MB
