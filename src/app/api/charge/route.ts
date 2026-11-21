import { NextRequest, NextResponse } from 'next/server';
import {
  getAccountByNumber,
  verifyPin,
  debitAccount,
  createTransaction,
  getWalletAddress,
} from '@/lib/veyloDb';
import { calculateRafikiQuote } from '@/lib/rafikiRates';

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
      wallet_address?: string;
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
      wallet_address,
      pin,
      amount,
      currency = 'NGN',
      reference,
      description,
      receiver_account,
    } = body;

    // ── 3. Validate required fields ───────────────────────────────────────────
    const mandateRef = (body as any).mandate_reference;
    const isRecurring = Boolean((body as any).is_recurring || mandateRef);

    if (!veylo_account_number || typeof veylo_account_number !== 'string') {
      return failResponse('MISSING_FIELD', 'veylo_account_number is required.');
    }
    if (!isRecurring && (!pin || typeof pin !== 'string')) {
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

    // ── 3.5 Check Mandate Status (Recurring Mandate Enforcement) ──────────────
    if (mandateRef) {
      const { getMandateByReference } = await import('@/lib/mandatesStore');
      const mandate = getMandateByReference(mandateRef);
      if (mandate && (mandate.status === 'paused' || mandate.status === 'revoked')) {
        return corsJson({
          status: 'failed',
          code: 'MANDATE_PAUSED',
          message: `Recurring transfer declined! Open Payments mandate ${mandateRef} is currently PAUSED by the account holder in Veylo. Automatic deduction blocked until resumed.`,
        });
      }
    }

    // ── 4. Look up account ───────────────────────────────────────────────────
    const account = await getAccountByNumber(veylo_account_number);
    if (!account) {
      return failResponse('ACCOUNT_NOT_FOUND', 'No active Veylo account found for the provided account number.');
    }

    // ── 4.5 Verify Wallet Address Confirmation (if provided) ─────────────────
    if (wallet_address && typeof wallet_address === 'string' && wallet_address.trim()) {
      const cleanInput = wallet_address.trim().toLowerCase();
      const accountWallet = getWalletAddress(account).toLowerCase();
      const rawInputSlug = cleanInput.replace(/^\$ilp-veylowallet-/, '');
      const rawAccountSlug = accountWallet.replace(/^\$ilp-veylowallet-/, '');

      const isMatch = cleanInput === accountWallet || rawInputSlug === rawAccountSlug;
      if (!isMatch) {
        return failResponse(
          'WALLET_ADDRESS_MISMATCH',
          `Wallet address confirmation failed. The provided wallet address name does not match this account number.`
        );
      }
    }

    // ── 5. Verify PIN (or mandate authorization) ───────────────────────────────
    if (!isRecurring || pin) {
      const pinValid = await verifyPin(account.pin_hash, pin || '');
      if (!pinValid && !isRecurring) {
        return failResponse('INCORRECT_PIN', 'Incorrect PIN. Please try again.');
      }
    }

    // ── 6. Currency Conversion via Interledger Rafiki Rates Service ─────────
    const destCurrency = currency.toUpperCase();
    const sourceCurrency = (account.currency || 'NGN').toUpperCase();

    let debitAmountNgn = amount;
    let exchangeRate = 1.0;

    if (destCurrency !== sourceCurrency) {
      const quote = await calculateRafikiQuote({
        destinationAmount: amount,
        destinationCurrency: destCurrency,
        sourceCurrency,
      });

      debitAmountNgn = quote.debitAmountNgn;
      exchangeRate = quote.exchangeRate;
    }

    // ── 7. Check balance ──────────────────────────────────────────────────────
    if (account.balance_ngn < debitAmountNgn) {
      const formattedDue = destCurrency !== 'NGN'
        ? `${destCurrency} ${amount.toFixed(2)} (≈ ₦${debitAmountNgn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NGN at ₦${exchangeRate.toFixed(2)}/USD via Rafiki)`
        : `₦${debitAmountNgn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NGN`;

      return failResponse(
        'INSUFFICIENT_FUNDS',
        `Insufficient wallet balance. Total due is ${formattedDue}, but your current wallet balance is ₦${account.balance_ngn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NGN.`
      );
    }

    // ── 8. Debit account (atomic) ─────────────────────────────────────────────
    const debited = await debitAccount(account.id, debitAmountNgn);
    if (!debited) {
      return failResponse('INSUFFICIENT_FUNDS', 'Insufficient wallet balance or account could not be debited.');
    }

    // ── 9. Resolve receiver account id (optional) ─────────────────────────────
    let toAccountId: string | null = null;
    if (receiver_account) {
      const { getAccountByNumber: lookupReceiver } = await import('@/lib/veyloDb');
      const receiver = await lookupReceiver(receiver_account);
      toAccountId = receiver?.id ?? null;
    }

    // ── 10. Create transaction record ─────────────────────────────────────────
    const formattedDesc = destCurrency !== 'NGN'
      ? `${description} ($${amount.toFixed(2)} ${destCurrency} @ ₦${exchangeRate.toFixed(2)}/USD via Rafiki)`
      : description;

    const txn = await createTransaction({
      reference,
      from_account_id: account.id,
      to_account_id: toAccountId,
      amount_ngn: debitAmountNgn,
      currency: 'NGN',
      description: formattedDesc,
      status: 'settled',
      external_reference: reference,
    });

    const transactionId = txn ? `VYL-TXN-${txn.id.slice(0, 8).toUpperCase()}` : `VYL-TXN-${Date.now()}`;

    // ── 11. Success ──────────────────────────────────────────────────────────
    return corsJson({
      status: 'success',
      transaction_id: transactionId,
      amount, // original merchant price (e.g. 69 USD)
      currency: destCurrency, // original merchant currency (e.g. USD)
      debited_amount_ngn: debitAmountNgn, // converted NGN amount (e.g. ~93,352.22)
      debited_currency: 'NGN',
      exchange_rate: exchangeRate,
      protocol: 'Interledger Rafiki',
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
