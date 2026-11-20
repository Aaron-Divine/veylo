import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { getAccountByNumber } from '@/lib/veyloDb';

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

    const { name, email, pin, initial_balance_ngn = 100000 } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return corsJson({ status: 'failed', code: 'MISSING_FIELD', message: 'Full name or username is required.' }, 400);
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return corsJson({ status: 'failed', code: 'MISSING_FIELD', message: 'A valid email address is required.' }, 400);
    }
    if (!pin || typeof pin !== 'string' || pin.length < 4 || pin.length > 6 || !/^\d+$/.test(pin)) {
      return corsJson({ status: 'failed', code: 'INVALID_PIN', message: 'PIN must be 4 to 6 numeric digits.' }, 400);
    }

    const depositAmount = Math.max(0, Number(initial_balance_ngn) || 100000);

    // Hash user-chosen PIN
    const pinHash = await bcrypt.hash(pin.trim(), 10);

    // Generate unique random 10-digit account number
    let accountNumber = generateAccountNumber();
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await getAccountByNumber(accountNumber);
      if (!existing) break;
      accountNumber = generateAccountNumber();
    }

    // Insert into Supabase veylo_accounts
    const { data, error } = await supabase
      .from('veylo_accounts')
      .insert({
        account_number: accountNumber,
        pin_hash: pinHash,
        balance_ngn: depositAmount,
        owner_name: name.trim(),
        owner_email: email.trim().toLowerCase(),
      })
      .select('id, account_number, balance_ngn, owner_name, owner_email, currency, is_active, created_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        return corsJson({ status: 'failed', code: 'EMAIL_EXISTS', message: 'An account with that email already exists. Please log in.' }, 409);
      }
      console.error('[/api/auth/register] DB insert error:', error.message);
      return corsJson({ status: 'failed', code: 'SERVER_ERROR', message: 'Could not create account.' }, 500);
    }

    return corsJson({
      status: 'success',
      message: 'Account created successfully with funded balance.',
      account: data,
    }, 201);
  } catch (err) {
    console.error('[/api/auth/register] Server error:', err);
    return corsJson({ status: 'failed', code: 'SERVER_ERROR', message: 'Internal server error.' }, 500);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
