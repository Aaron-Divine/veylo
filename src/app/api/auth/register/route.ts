import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { getAccountByNumber, getWalletAddress, getDisplayName } from '@/lib/veyloDb';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

function generateAccountNumber(): string {
  // Generate a random 10-digit number
  return String(Math.floor(1000000000 + Math.random() * 9000000000));
}

export async function POST(req: NextRequest) {
  try {
    let body: {
      name?: string;
      wallet_name?: string;
      wallet_address?: string;
      email?: string;
      phone?: string;
      pin?: string;
      initial_balance_ngn?: number;
    };

    try {
      body = await req.json();
    } catch {
      return corsJson({ status: 'failed', code: 'INVALID_BODY', message: 'Request body must be valid JSON.' }, 400);
    }

    const { name, wallet_name, wallet_address, email, pin } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return corsJson({ status: 'failed', code: 'MISSING_FIELD', message: 'Full name or username is required.' }, 400);
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return corsJson({ status: 'failed', code: 'MISSING_FIELD', message: 'A valid email address is required.' }, 400);
    }

    // Strictly 4 digits PIN
    if (!pin || typeof pin !== 'string' || !/^\d{4}$/.test(pin.trim())) {
      return corsJson({ status: 'failed', code: 'INVALID_PIN', message: 'PIN must be exactly 4 numeric digits.' }, 400);
    }

    // Determine Canonical Open Payments Wallet Address: $ilp-veylowallet-(wallet address name)
    const rawWalletSlug = (wallet_name || wallet_address || name || '')
      .replace(/^\$ilp-veylowallet-/, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '') || 'wallet';

    const canonicalWalletAddress = `$ilp-veylowallet-${rawWalletSlug}`;

    // Hash user-chosen 4-digit PIN
    const pinHash = await bcrypt.hash(pin.trim(), 10);

    // Generate unique random 10-digit account number assigned to this wallet address
    let accountNumber = generateAccountNumber();
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await getAccountByNumber(accountNumber);
      if (!existing) break;
      accountNumber = generateAccountNumber();
    }

    // Composite name storing display name + canonical wallet address
    const compositeOwnerName = `${name.trim()}:::${canonicalWalletAddress}`;

    // Insert into Supabase veylo_accounts with 0 initial balance (deposit simulation is available on dashboard)
    const { data, error } = await supabase
      .from('veylo_accounts')
      .insert({
        account_number: accountNumber,
        pin_hash: pinHash,
        balance_ngn: 0,
        owner_name: compositeOwnerName,
        owner_email: email.trim().toLowerCase(),
      })
      .select('id, account_number, balance_ngn, owner_name, owner_email, currency, is_active, created_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        return corsJson({ status: 'failed', code: 'EMAIL_EXISTS', message: 'An account with that email already exists. Please log in.' }, 409);
      }
      console.error('[/api/auth/register] DB insert error:', error.message);
      return corsJson({ status: 'failed', code: 'SERVER_ERROR', message: 'Could not create account in Supabase.' }, 500);
    }

    return corsJson({
      status: 'success',
      message: 'Account created successfully with unique 10-digit number assigned to wallet address.',
      account: {
        ...data,
        owner_name: getDisplayName(data.owner_name),
        wallet_address: canonicalWalletAddress,
      },
    }, 201);
  } catch (err) {
    console.error('[/api/auth/register] Server error:', err);
    return corsJson({ status: 'failed', code: 'SERVER_ERROR', message: 'Internal server error.' }, 500);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
