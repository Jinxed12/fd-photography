-- ============================================
-- FD PHOTOGRAPHY PORTFOLIO DATABASE SCHEMA
-- ============================================
-- Copy and paste this into Neon SQL Editor

-- Create ENUM types
CREATE TYPE image_type_enum AS ENUM ('full-body', 'detail', 'candid', 'movement');
CREATE TYPE credit_role_enum AS ENUM ('photographer', 'designer', 'mua', 'model', 'stylist');

-- ============================================
-- TABLE: LOOKS (Fashion collections)
-- ============================================
CREATE TABLE looks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  theme TEXT,
  description TEXT,
  cover_image_url TEXT,
  sequence INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_looks_sequence ON looks(sequence);

-- ============================================
-- TABLE: IMAGES (Photos)
-- ============================================
CREATE TABLE images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  look_id UUID NOT NULL REFERENCES looks(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  image_type image_type_enum DEFAULT 'full-body',
  caption TEXT,
  sequence INT DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_images_look_id ON images(look_id);
CREATE INDEX idx_images_sequence ON images(sequence);

-- ============================================
-- TABLE: CREDITS (Team members)
-- ============================================
CREATE TABLE credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role credit_role_enum NOT NULL,
  name TEXT NOT NULL,
  instagram_handle TEXT,
  contact_email TEXT,
  portfolio_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- TABLE: EXHIBITION_METADATA
-- ============================================
CREATE TABLE exhibition_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exhibition_name TEXT NOT NULL,
  qr_slug TEXT UNIQUE,
  view_count INT DEFAULT 0,
  launch_date TIMESTAMP WITH TIME ZONE,
  exhibition_venue TEXT,
  exhibition_city TEXT,
  theme_color TEXT DEFAULT '#FF69B4',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- AUTO-UPDATE TIMESTAMP FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for looks table
CREATE TRIGGER update_looks_timestamp
BEFORE UPDATE ON looks FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Create trigger for exhibition_metadata table
CREATE TRIGGER update_exhibition_timestamp
BEFORE UPDATE ON exhibition_metadata FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert sample looks
INSERT INTO looks (title, theme, description, sequence) VALUES
  ('Urban Minimalist', 'Modern', 'Clean lines and neutral colors representing contemporary minimalist design philosophy', 1),
  ('Heritage Fusion', 'Cultural', 'Traditional textiles and techniques combined with modern silhouettes', 2),
  ('Avant-Garde', 'Experimental', 'Bold and unconventional designs pushing the boundaries of fashion', 3);

-- Insert sample credits
INSERT INTO credits (role, name, instagram_handle, contact_email) VALUES
  ('photographer', 'Arjun Kapoor', '@arjun_clicks', 'arjun.kapoor@example.com'),
  ('designer', 'Priya Sharma', '@priya_designs', 'priya.sharma@example.com'),
  ('mua', 'Meera Nair', '@meera_makeup', 'meera.nair@example.com'),
  ('stylist', 'Rahul Singh', '@rahul_styling', 'rahul.singh@example.com'),
  ('model', 'Aisha Khan', '@aisha_model', 'aisha.khan@example.com');

-- Insert sample exhibition metadata
INSERT INTO exhibition_metadata (exhibition_name, qr_slug, launch_date, exhibition_venue, exhibition_city, theme_color) VALUES
  ('FD Portfolio 2025', 'fd-lookbook-2025', now(), 'Design Studio', 'Ludhiana', '#FF69B4');

-- ============================================
-- VERIFICATION QUERIES (Run these to verify)
-- ============================================
-- Check tables created
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check sample data
-- SELECT COUNT(*) as look_count FROM looks;
-- SELECT COUNT(*) as credit_count FROM credits;
-- SELECT COUNT(*) as exhibition_count FROM exhibition_metadata;
