-- Create users table extension (this is already enabled in Supabase, but including for completeness)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  department TEXT,
  whatsapp_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create items table
CREATE TABLE items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  listing_type TEXT NOT NULL,
  condition TEXT,
  images TEXT[] DEFAULT '{}',
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create storage bucket for item images
-- Note: You might need to create this through the Supabase UI instead
INSERT INTO storage.buckets (id, name, public) VALUES ('item-images', 'item-images', true);

-- Set up RLS policies

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read any profile
CREATE POLICY "Users can view all profiles" 
  ON users FOR SELECT 
  USING (true);

-- Allow users to update only their own profile
CREATE POLICY "Users can update their own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Items table policies
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Anyone can read items
CREATE POLICY "Anyone can view items" 
  ON items FOR SELECT 
  USING (true);

-- Users can create their own items
CREATE POLICY "Users can create their own items" 
  ON items FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own items
CREATE POLICY "Users can update their own items" 
  ON items FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own items
CREATE POLICY "Users can delete their own items" 
  ON items FOR DELETE 
  USING (auth.uid() = user_id);

-- Storage policies
CREATE POLICY "Anyone can view item images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'item-images');

CREATE POLICY "Authenticated users can upload item images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'item-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own item images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'item-images' AND
    auth.uid() = owner
  );

CREATE POLICY "Users can delete their own item images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'item-images' AND
    auth.uid() = owner
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, created_at, updated_at)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();