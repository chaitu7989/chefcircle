-- ChefCircle Database Schema
-- Run this in the Supabase SQL editor (supabase.com > your project > SQL editor)

-- ──────────────────────────────────────────────────────────────
-- OTP Verifications
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS otp_verifications (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone      TEXT NOT NULL,
  otp        TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '5 minutes'),
  verified   BOOLEAN DEFAULT FALSE,
  attempts   INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_verifications (phone, verified);

-- ──────────────────────────────────────────────────────────────
-- User Profiles
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone               TEXT UNIQUE NOT NULL,
  full_name           TEXT,
  email               TEXT,
  avatar_url          TEXT,
  role                TEXT CHECK (role IN ('customer', 'chef')),
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- Chef Profiles
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chef_profiles (
  id                  UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  kitchen_name        TEXT,
  about               TEXT,
  cuisine_types       TEXT[]  DEFAULT '{}',
  years_experience    INTEGER,
  cooking_address     TEXT,
  service_radius      INTEGER DEFAULT 5,
  available_timings   JSONB   DEFAULT '{}',
  verification_status TEXT    DEFAULT 'pending',
  kitchen_photos      TEXT[]  DEFAULT '{}',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- Customer Profiles
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customer_profiles (
  id                   UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  dietary_preferences  TEXT[] DEFAULT '{}',
  location             JSONB,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- Auto-update profiles.updated_at
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER chef_profiles_updated_at
  BEFORE UPDATE ON chef_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ──────────────────────────────────────────────────────────────
-- Row Level Security
-- ──────────────────────────────────────────────────────────────
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE chef_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS (API routes use service role key)
-- All client reads/writes go through API routes, so RLS is a safety net only

-- Allow service role full access (handled automatically by Supabase)
-- For anon reads on public chef data (future):
-- CREATE POLICY "public chefs" ON chef_profiles FOR SELECT USING (true);
