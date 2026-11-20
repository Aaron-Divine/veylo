-- ============================================================
-- Veylo Supabase Schema
-- Run this in the Supabase SQL editor to create the tables.
-- ============================================================

-- veylo_accounts
CREATE TABLE IF NOT EXISTS veylo_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_number TEXT UNIQUE NOT NULL,
  pin_hash TEXT NOT NULL,
  balance_ngn NUMERIC(15, 2) NOT NULL DEFAULT 0,
  owner_name TEXT NOT NULL,
  owner_email TEXT UNIQUE NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- veylo_transactions
CREATE TABLE IF NOT EXISTS veylo_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  from_account_id UUID NOT NULL REFERENCES veylo_accounts(id),
  to_account_id UUID REFERENCES veylo_accounts(id),
  amount_ngn NUMERIC(15, 2) NOT NULL,
  fee_ngn NUMERIC(15, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'NGN',
  description TEXT,
  status TEXT NOT NULL DEFAULT 'settled',
  failure_code TEXT,
  external_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Atomic debit function (prevents race conditions)
-- Returns TRUE if debit succeeded, FALSE if insufficient funds.
-- ============================================================
CREATE OR REPLACE FUNCTION debit_account(p_account_id UUID, p_amount NUMERIC)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  rows_updated INTEGER;
BEGIN
  UPDATE veylo_accounts
  SET balance_ngn = balance_ngn - p_amount
  WHERE id = p_account_id
    AND is_active = true
    AND balance_ngn >= p_amount;

  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  RETURN rows_updated > 0;
END;
$$;

-- ============================================================
-- Seed demo accounts for immediate testing
-- Pre-configured PIN: 1234
-- ============================================================
INSERT INTO veylo_accounts (account_number, pin_hash, balance_ngn, owner_name, owner_email)
VALUES (
  '4821937604',
  '$2b$10$6u8b0ghJEr9ptaYOmt7Oz.ArZaL5mKy791UTwjNIPtZFDP98g9c92',
  4725000,
  'Tomi Adebayo',
  'tomi@adebayo.me'
)
ON CONFLICT (account_number) DO UPDATE
SET balance_ngn = 4725000, pin_hash = EXCLUDED.pin_hash;

INSERT INTO veylo_accounts (account_number, pin_hash, balance_ngn, owner_name, owner_email)
VALUES (
  '7189024410',
  '$2b$10$6u8b0ghJEr9ptaYOmt7Oz.ArZaL5mKy791UTwjNIPtZFDP98g9c92',
  1180000,
  'Chioma Okonkwo',
  'chioma@studio.ng'
)
ON CONFLICT (account_number) DO UPDATE
SET balance_ngn = 1180000, pin_hash = EXCLUDED.pin_hash;
