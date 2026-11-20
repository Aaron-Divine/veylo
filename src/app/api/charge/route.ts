import { NextRequest, NextResponse } from 'next/server';
import {
  getAccountByNumber,
  verifyPin,
  debitAccount,
  createTransaction,
} from '@/lib/veyloDb';

// CORS headers — Learnify runs on a different Vercel domain
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

function failResponse(code: string, message: string) {
  return corsJson({ status: 'failed', code, message });
}

export async function POST(req: NextRequest) {
  try {
    // ── 1. Auth ──────────────────────────────────────────────────────────────
    const authHeader = req.headers.get('authorization') ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token || token !== process.env.VEYLO_API_KEY) {
      return corsJson({ status: 'failed', code: 'UNAUTHORIZED', message: 'Invalid or missing API key.' }, 401);
    }

    // ── 2. Parse body ─────────────────────────────────────────────────────────
    let body: {
      veylo_account_number?: string;
      pin?: string;
      amount?: number;
      currency?: string;
      reference?: string;
      description?: string;
      receiver_account?: string;
    };

    try {
      body = await req.json();
    } catch {
      return failResponse('INVALID_BODY', 'Request body must be valid JSON.');
    }

    const {
      veylo_account_number,
      pin,
      amount,
      currency = 'NGN',
      reference,
      description,
      receiver_account,
    } = body;

    // ── 3. Validate required fields ───────────────────────────────────────────
    if (!veylo_account_number || typeof veylo_account_number !== 'string') {
      return failResponse('MISSING_FIELD', 'veylo_account_number is required.');
    }
    if (!pin || typeof pin !== 'string') {
      return failResponse('MISSING_FIELD', 'pin is required.');
    }
    if (amount === undefined || amount === null || typeof amount !== 'number' || amount <= 0) {
      return failResponse('MISSING_FIELD', 'amount must be a positive number.');
    }
    if (!reference || typeof reference !== 'string') {
      return failResponse('MISSING_FIELD', 'reference is required.');
    }
    if (!description || typeof description !== 'string') {
      return failResponse('MISSING_FIELD', 'description is required.');
    }

    // ── 4. Look up account ───────────────────────────────────────────────────
    const account = await getAccountByNumber(veylo_account_number);
    if (!account) {
      return failResponse('ACCOUNT_NOT_FOUND', 'No active Veylo account found for the provided account number.');
    }

    // ── 5. Verify PIN (never log the PIN value) ───────────────────────────────
    const pinValid = await verifyPin(account.pin_hash, pin);
    if (!pinValid) {
      return failResponse('INCORRECT_PIN', 'Incorrect PIN. Please try again.');
    }

    // ── 6. Check balance ──────────────────────────────────────────────────────
    if (account.balance_ngn < amount) {
      return failResponse('INSUFFICIENT_FUNDS', 'Insufficient wallet balance.');
    }

    // ── 7. Debit account (atomic) ─────────────────────────────────────────────
    const debited = await debitAccount(account.id, amount);
    if (!debited) {
      return failResponse('INSUFFICIENT_FUNDS', 'Insufficient wallet balance or account could not be debited.');
    }

    // ── 8. Resolve receiver account id (optional) ─────────────────────────────
    let toAccountId: string | null = null;
    if (receiver_account) {
      const { getAccountByNumber: lookupReceiver } = await import('@/lib/veyloDb');
      const receiver = await lookupReceiver(receiver_account);
      toAccountId = receiver?.id ?? null;
    }

    // ── 9. Create transaction record ──────────────────────────────────────────
    const txn = await createTransaction({
      reference,
      from_account_id: account.id,
      to_account_id: toAccountId,
      amount_ngn: amount,
      currency,
      description,
      status: 'settled',
      external_reference: reference,
    });

    const transactionId = txn ? `VYL-TXN-${txn.id.slice(0, 8).toUpperCase()}` : `VYL-TXN-${Date.now()}`;

    // ── 10. Success ──────────────────────────────────────────────────────────
    return corsJson({
      status: 'success',
      transaction_id: transactionId,
      amount,
      currency,
      reference,
    });
  } catch (err) {
    console.error('[/api/charge] Unhandled error:', err instanceof Error ? err.message : String(err));
    return corsJson({ status: 'failed', code: 'SERVER_ERROR', message: 'An internal server error occurred.' }, 500);
  }
}

// CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
