import bcrypt from 'bcryptjs';
import { supabase } from './supabase';

export interface VeyloAccount {
  id: string;
  account_number: string;
  pin_hash: string;
  balance_ngn: number;
  owner_name: string;
  owner_email: string;
  currency: string;
  is_active: boolean;
  created_at: string;
  wallet_address?: string;
}

/**
 * Derives the canonical Open Payments Interledger wallet address
 * Format: $ilp-veylowallet-(wallet address name)
 */
export function getWalletAddress(account: { owner_name?: string; owner_email?: string }): string {
  if (account.owner_name && account.owner_name.includes(':::')) {
    const parts = account.owner_name.split(':::');
    if (parts[1]) return parts[1].trim();
  }
  const rawSlug = (account.owner_name || '').split(':::')[0] || (account.owner_email ? account.owner_email.split('@')[0] : 'user');
  const cleanSlug = rawSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'wallet';
  return `$ilp-veylowallet-${cleanSlug}`;
}

/**
 * Extracts clean user display name from stored composite name string
 */
export function getDisplayName(rawName?: string): string {
  if (!rawName) return 'Veylo User';
  if (rawName.includes(':::')) {
    return rawName.split(':::')[0].trim();
  }
  return rawName.trim();
}

/**
 * Derives user avatar SVG based on registered gender
 */
export function getAvatarUrl(account: { owner_name?: string }): string {
  if (account.owner_name && account.owner_name.includes(':::')) {
    const parts = account.owner_name.split(':::');
    if (parts[2] && parts[2].trim().toLowerCase() === 'female') {
      return '/avatars/female.svg';
    }
    if (parts[2] && parts[2].trim().toLowerCase() === 'male') {
      return '/avatars/male.svg';
    }
  }
  return '/avatars/male.svg';
}

export interface VeyloTransaction {
  id: string;
  reference: string;
  from_account_id: string;
  to_account_id: string | null;
  amount_ngn: number;
  fee_ngn: number;
  currency: string;
  description: string | null;
  status: string;
  failure_code: string | null;
  external_reference: string | null;
  created_at: string;
}

export interface CreateTransactionData {
  reference: string;
  from_account_id: string;
  to_account_id?: string | null;
  amount_ngn: number;
  fee_ngn?: number;
  currency?: string;
  description?: string;
  status?: string;
  failure_code?: string | null;
  external_reference?: string | null;
}

/**
 * Look up a Veylo account by account number, stripping spaces from the input.
 */
export async function getAccountByNumber(accountNumber: string): Promise<VeyloAccount | null> {
  const normalized = accountNumber.replace(/\s+/g, '');

  const { data, error } = await supabase
    .from('veylo_accounts')
    .select('*')
    .eq('account_number', normalized)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data as VeyloAccount;
}

/**
 * Verify a plain-text PIN against a bcrypt hash.
 * Never logs the PIN.
 */
export async function verifyPin(storedHash: string, pin: string): Promise<boolean> {
  return bcrypt.compare(pin, storedHash);
}

/**
 * Atomically debit an account. Returns false if balance is insufficient.
 * Uses a conditional UPDATE to avoid race conditions.
 */
export async function debitAccount(accountId: string, amountNgn: number): Promise<boolean> {
  // Use an RPC or raw SQL for atomic decrement with balance check.
  // Pattern: UPDATE ... SET balance_ngn = balance_ngn - amount WHERE id = ? AND balance_ngn >= amount
  const { data, error } = await supabase.rpc('debit_account', {
    p_account_id: accountId,
    p_amount: amountNgn,
  });

  if (error) {
    console.error('[veyloDb] debitAccount error:', error.message);
    return false;
  }

  // The RPC returns true if debit succeeded, false if insufficient funds
  return data === true;
}

/**
 * Create a transaction record in veylo_transactions.
 */
export async function createTransaction(data: CreateTransactionData): Promise<VeyloTransaction | null> {
  const { data: txn, error } = await supabase
    .from('veylo_transactions')
    .insert({
      reference: data.reference,
      from_account_id: data.from_account_id,
      to_account_id: data.to_account_id ?? null,
      amount_ngn: data.amount_ngn,
      fee_ngn: data.fee_ngn ?? 0,
      currency: data.currency ?? 'NGN',
      description: data.description ?? null,
      status: data.status ?? 'settled',
      failure_code: data.failure_code ?? null,
      external_reference: data.external_reference ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error('[veyloDb] createTransaction error:', error.message);
    return null;
  }

  return txn as VeyloTransaction;
}

/**
 * Credit an account balance in Supabase (e.g. for simulated deposits)
 */
export async function creditAccount(accountId: string, amountNgn: number): Promise<number | null> {
  const { data: currentAcc, error: fetchErr } = await supabase
    .from('veylo_accounts')
    .select('balance_ngn')
    .eq('id', accountId)
    .single();

  if (fetchErr || !currentAcc) {
    console.error('[veyloDb] creditAccount fetch error:', fetchErr?.message);
    return null;
  }

  const newBalance = Math.round((Number(currentAcc.balance_ngn) + Number(amountNgn)) * 100) / 100;

  const { error: updateErr } = await supabase
    .from('veylo_accounts')
    .update({ balance_ngn: newBalance })
    .eq('id', accountId);

  if (updateErr) {
    console.error('[veyloDb] creditAccount update error:', updateErr.message);
    return null;
  }

  return newBalance;
}

/**
 * Look up an account by 10-digit number, email, or wallet address
 */
export async function getAccountByIdentifier(identifier: string): Promise<VeyloAccount | null> {
  const clean = identifier.trim().replace(/\s+/g, '');

  // 1. Try 10-digit account number
  if (/^\d{10}$/.test(clean)) {
    const acc = await getAccountByNumber(clean);
    if (acc) return acc;
  }

  // 2. Try email
  if (clean.includes('@')) {
    const { data } = await supabase
      .from('veylo_accounts')
      .select('*')
      .eq('owner_email', clean.toLowerCase())
      .eq('is_active', true)
      .single();
    if (data) return data as VeyloAccount;
  }

  // 3. Try wallet address pattern (e.g. $ilp-veylowallet-name or name)
  const slug = clean.replace(/^\$ilp-veylowallet-/, '').toLowerCase();
  const { data: allAccounts } = await supabase
    .from('veylo_accounts')
    .select('*')
    .eq('is_active', true);

  if (allAccounts && allAccounts.length > 0) {
    const matched = allAccounts.find((acc) => {
      const addr = getWalletAddress(acc).toLowerCase();
      return (
        addr === clean.toLowerCase() ||
        addr.endsWith(`-${slug}`) ||
        acc.account_number === clean ||
        acc.owner_email.toLowerCase() === clean.toLowerCase()
      );
    });
    if (matched) return matched as VeyloAccount;
  }

  return null;
}
