"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayoutClient } from "@/components/layout/AppLayoutClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAccount } from "@/context/AccountContext";
import { VeyloSymbol } from "@/components/brand/VeyloLogo";
import {
  Copy,
  Check,
  UserCheck,
  Repeat,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  PlusCircle,
  Sparkles,
  X,
  RefreshCw,
  Wallet,
} from "lucide-react";

export default function AppDashboardPage() {
  const { currentUser, userTransactions, userSubscriptions, testnetStatus, syncLiveAccount } = useAccount();
  const [copied, setCopied] = useState(false);

  // Deposit Simulation Modal State
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [depositCurrency, setDepositCurrency] = useState<string>("USD");
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);
  const [depositError, setDepositError] = useState<string | null>(null);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(currentUser.veyloAccountNumber.replace(/\s+/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDepositing(true);
    setDepositError(null);
    setDepositSuccessMsg(null);

    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_number: currentUser.veyloAccountNumber.replace(/\s+/g, ""),
          amount: Number(depositAmount),
          currency: depositCurrency,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.status !== "success") {
        setDepositError(data.message || "Failed to complete simulated deposit.");
        setIsDepositing(false);
        return;
      }

      setDepositSuccessMsg(data.message);
      if (syncLiveAccount) {
        await syncLiveAccount(currentUser.veyloAccountNumber.replace(/\s+/g, ""));
      }

      setTimeout(() => {
        setIsDepositing(false);
        setDepositModalOpen(false);
        setDepositSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      setDepositError("Network error completing deposit.");
      setIsDepositing(false);
    }
  };

  const activeSubsCount = userSubscriptions.filter((s) => s.status === "active").length;

  return (
    <AppLayoutClient
      title="Financial Overview"
      subtitle="Interoperable Account Hub & Open Payments Settlement"
    >
      <div className="space-y-8">
        {/* ========================================================
            HERO VEYLO ACCOUNT PASS CARD (Frame 28:2)
           ======================================================== */}
        <div className="rounded-3xl bg-midnight-950 p-6 md:p-8 text-white relative overflow-hidden shadow-2xl border border-midnight-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-electric-cobalt/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Top row: Brand & Status Pill */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-midnight-900">
              <div className="flex items-center gap-3">
                <VeyloSymbol size={32} variant="dark" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold font-sans tracking-widest text-sm text-white">
                      VEYLO ACCOUNT PASS
                    </span>
                    <Badge variant="lime" size="sm" dot>
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Open Payments Endpoint:{" "}
                    <span className="text-[#D8F15B]">{currentUser.openPaymentsAddress}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="midnight" size="sm" className="bg-midnight-900 text-acid-lime border-midnight-700">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Tier 3 KYC Verified
                </Badge>
              </div>
            </div>

            {/* Center Account Number Callout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                    Your 10-Digit Interoperable Account Number
                  </span>
                  <span className="text-xs font-bold text-acid-lime font-mono">
                    {currentUser.handle}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-3xl sm:text-5xl font-black font-mono tracking-widest text-white">
                    {currentUser.veyloAccountNumber}
                  </span>
                  <button
                    onClick={handleCopyAccount}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-midnight-800 hover:bg-midnight-700 text-xs font-mono text-slate-300 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-acid-lime" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Share this number to receive instant transfers from any Veylo user, commercial bank, or Open Payments wallet.
                </p>
              </div>

              {/* Connected Bank Status Pill Box */}
              <div className="md:col-span-4 bg-midnight-900/90 rounded-2xl border border-midnight-800 p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>FUNDING / PAYOUT LINK</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Linked
                  </span>
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {currentUser.connectedBank.bankName}
                </div>
                <div className="text-xs font-mono text-slate-300 flex items-center justify-between">
                  <span>Acct: {currentUser.connectedBank.accountNumber}</span>
                  <span className="text-acid-lime font-bold">Auto-Sweep ON</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-4 border-t border-midnight-900 flex flex-wrap gap-3">
              <Button
                variant="lime"
                size="md"
                onClick={() => setDepositModalOpen(true)}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Deposit / Fund Wallet
              </Button>
              <Button
                href="/app/subscriptions"
                variant="outline-dark"
                size="md"
                leftIcon={<Repeat className="w-4 h-4 text-acid-lime" />}
              >
                Subscriptions &amp; Mandates ({activeSubsCount})
              </Button>
              <Button
                href="/app/account"
                variant="primary"
                size="md"
                leftIcon={<UserCheck className="w-4 h-4" />}
              >
                Account &amp; Security PIN
              </Button>
              <Button
                href="/app/activity"
                variant="outline-dark"
                size="md"
                leftIcon={<Clock className="w-4 h-4 text-acid-lime" />}
              >
                Activity Ledger
              </Button>
            </div>
          </div>
        </div>

        {/* ========================================================
            BALANCE & SPENDING METRIC TILES
           ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="white" className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase">
              <span>Total Liquid Funds</span>
              <Building2 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-midnight-950">
              {currentUser.currency === "NGN" ? (
                `₦${(currentUser.totalBalanceNgn).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
              ) : currentUser.currency === "GBP" ? (
                `£${currentUser.foreignBalance?.amount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`
              ) : (
                `€${currentUser.foreignBalance?.amount.toLocaleString("de-DE", { minimumFractionDigits: 2 })}`
              )}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Available in {currentUser.connectedBank.bankName}</span>
            </div>
          </Card>

          <Card variant="white" className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase">
              <span>Interledger Testnet Status</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-electric-cobalt">
              {testnetStatus.latencyMs}ms RTT
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>wallet.interledger-test.dev</span>
              <span className="text-emerald-600 font-bold font-mono">14 Connectors</span>
            </div>
          </Card>

          <Card variant="white" className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase">
              <span>Active Subscriptions</span>
              <Repeat className="w-4 h-4 text-electric-cobalt" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-midnight-950">
              {activeSubsCount} Mandates
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Open Payments Protocol</span>
              <Link href="/app/subscriptions" className="text-electric-cobalt font-semibold hover:underline">
                Manage (Revoke)
              </Link>
            </div>
          </Card>
        </div>

        {/* ========================================================
            RECENT ACTIVITY PREVIEW (Dynamic per Persona)
           ======================================================== */}
        <Card variant="white" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-midnight-950 font-sans">
                Payment Activity for {currentUser.name}
              </h2>
              <p className="text-xs text-slate-500">
                Direct transactions across Nigerian banks, Interledger connectors, and Open Payments mandates
              </p>
            </div>
            <Button
              href="/app/activity"
              variant="outline"
              size="sm"
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              View Full History
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {userTransactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No transactions recorded yet for this persona. Send a transfer to test!
              </div>
            ) : (
              userTransactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        tx.category === "deposit"
                          ? "bg-emerald-50 text-emerald-700"
                          : tx.destinationType === "international_bank"
                          ? "bg-electric-cobalt/10 text-electric-cobalt"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {tx.category === "deposit" ? (
                        <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-midnight-950">{tx.title}</p>
                      <p className="text-xs text-slate-500 font-mono">
                        {tx.destinationBankOrProvider} • {tx.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center pl-13 sm:pl-0">
                    <span
                      className={`font-mono font-bold text-sm ${
                        tx.category === "deposit" ? "text-emerald-600" : "text-midnight-950"
                      }`}
                    >
                      {tx.category === "deposit" ? "+" : "-"}₦
                      {tx.amountNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {tx.destinationCurrency && tx.destinationCurrency !== "NGN" && (
                        <span className="text-[10px] font-mono text-slate-500">
                          ({tx.destinationAmount} {tx.destinationCurrency})
                        </span>
                      )}
                      <Badge variant="success" size="sm">
                        Settled
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* ========================================================
            SIMULATED DEPOSIT MODAL (ANY CURRENCY VIA RAFIKI FX)
           ======================================================== */}
        {depositModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
              <button
                onClick={() => setDepositModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-midnight-950 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-acid-lime/20 text-midnight-950 flex items-center justify-center mx-auto border border-acid-lime/30">
                  <Wallet className="w-6 h-6 text-midnight-950" />
                </div>
                <h3 className="text-xl font-black text-midnight-950 font-sans">
                  Simulate Wallet Deposit
                </h3>
                <p className="text-xs text-slate-500">
                  Fund your Veylo wallet pass in any world currency. Interledger Rafiki FX automatically converts to your local ledger balance.
                </p>
              </div>

              {depositSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 animate-in fade-in">
                  ✓ {depositSuccessMsg}
                </div>
              )}

              {depositError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 animate-in fade-in">
                  ✕ {depositError}
                </div>
              )}

              <form onSubmit={handleSimulateDeposit} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Amount
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-bold bg-slate-50 border border-slate-200 text-midnight-950 focus:outline-none focus:ring-2 focus:ring-electric-cobalt"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Currency
                    </label>
                    <select
                      value={depositCurrency}
                      onChange={(e) => setDepositCurrency(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm font-bold bg-slate-50 border border-slate-200 text-midnight-950 focus:outline-none focus:ring-2 focus:ring-electric-cobalt"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="NGN">NGN (₦)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="KES">KES (KSh)</option>
                      <option value="GHS">GHS (GH₵)</option>
                      <option value="ZAR">ZAR (R)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                    <span>Account to Credit:</span>
                    <span className="font-bold text-midnight-950">{currentUser.veyloAccountNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                    <span>Conversion Engine:</span>
                    <span className="text-electric-cobalt font-semibold">Rafiki FX Service</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="lime"
                  size="lg"
                  isLoading={isDepositing}
                  className="w-full justify-center"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Deposit {depositAmount} {depositCurrency}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayoutClient>
  );
}
