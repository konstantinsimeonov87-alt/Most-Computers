-- ============================================================
-- B2B Portal — Supabase Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── b2b_profiles ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS b2b_profiles (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID        REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  company_name   TEXT        NOT NULL,
  eik            TEXT        NOT NULL UNIQUE,
  vat_number     TEXT,
  mol            TEXT        NOT NULL,
  phone          TEXT,
  credit_days    INTEGER     DEFAULT 30,
  status         TEXT        DEFAULT 'pending'
                             CHECK (status IN ('pending', 'approved', 'rejected')),
  account_manager TEXT,
  notes          TEXT,       -- internal admin notes
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── quote_requests ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quote_requests (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  b2b_profile_id  UUID        REFERENCES b2b_profiles(id) ON DELETE CASCADE NOT NULL,
  user_id         UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  items           JSONB       NOT NULL DEFAULT '[]',
  -- [{product_id, name, brand, qty, price_eur}]
  notes           TEXT,
  status          TEXT        DEFAULT 'pending'
                              CHECK (status IN ('pending', 'sent', 'accepted', 'rejected')),
  admin_reply     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE b2b_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- b2b_profiles: users see and edit only their own row
CREATE POLICY "b2b_profiles_select_own"
  ON b2b_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "b2b_profiles_insert_own"
  ON b2b_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "b2b_profiles_update_own"
  ON b2b_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- quote_requests: users see and insert only their own rows
CREATE POLICY "quote_requests_select_own"
  ON quote_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "quote_requests_insert_own"
  ON quote_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ── updated_at trigger ──────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER b2b_profiles_updated_at
  BEFORE UPDATE ON b2b_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER quote_requests_updated_at
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
