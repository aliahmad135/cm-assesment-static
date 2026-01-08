-- Create states table
CREATE TABLE IF NOT EXISTS states (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(2) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  education_level VARCHAR(50) NOT NULL,
  has_internet_access BOOLEAN NOT NULL DEFAULT false,
  has_certifications BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user_state FOREIGN KEY (state) REFERENCES states(code)
);

-- Create offers table
CREATE TABLE IF NOT EXISTS offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  state_restriction VARCHAR(2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_offer_state FOREIGN KEY (state_restriction) REFERENCES states(code)
);

-- Create user_offers junction table
CREATE TABLE IF NOT EXISTS user_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  offer_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user_offers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_offers_offer FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_offer UNIQUE (user_id, offer_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_state ON users(state);
CREATE INDEX IF NOT EXISTS idx_offers_state_restriction ON offers(state_restriction);
CREATE INDEX IF NOT EXISTS idx_user_offers_user_id ON user_offers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_offers_offer_id ON user_offers(offer_id);

-- Insert states data
INSERT INTO states (code, name) VALUES
  ('AL', 'Alabama'),
  ('KY', 'Kentucky'),
  ('MA', 'Massachusetts'),
  ('MN', 'Minnesota'),
  ('NJ', 'New Jersey'),
  ('NV', 'Nevada'),
  ('OR', 'Oregon'),
  ('SC', 'South Carolina'),
  ('TX', 'Texas'),
  ('WA', 'Washington')
ON CONFLICT (code) DO NOTHING;

-- Insert sample offers
INSERT INTO offers (name, description, image_url, state_restriction) VALUES
  ('Basic Internet Package', 'Affordable internet access for everyday use', NULL, NULL),
  ('Premium Internet Package', 'High-speed internet with unlimited data', NULL, NULL),
  ('Texas State Special', 'Exclusive offer for Texas residents', NULL, 'TX'),
  ('Washington Tech Bundle', 'Special technology bundle for Washington state', NULL, 'WA'),
  ('Education Grant Program', 'Financial assistance for educational expenses', NULL, NULL),
  ('Certification Training', 'Professional certification courses', NULL, NULL),
  ('Minnesota Local Deal', 'Regional offer for Minnesota residents', NULL, 'MN'),
  ('Nevada Business Package', 'Business-focused services for Nevada', NULL, 'NV')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE states ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public read access to offers
CREATE POLICY "Offers are viewable by everyone" ON offers
  FOR SELECT USING (true);

-- Allow public read access to states
CREATE POLICY "States are viewable by everyone" ON states
  FOR SELECT USING (true);

-- Allow public insert for users (registration)
CREATE POLICY "Users can be created by anyone" ON users
  FOR INSERT WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (true);

-- Allow public insert for user_offers
CREATE POLICY "User offers can be created by anyone" ON user_offers
  FOR INSERT WITH CHECK (true);

-- Allow users to read their own offer selections
CREATE POLICY "Users can view their own offer selections" ON user_offers
  FOR SELECT USING (true);

