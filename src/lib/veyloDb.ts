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
