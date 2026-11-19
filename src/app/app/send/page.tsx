"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayoutClient } from "@/components/layout/AppLayoutClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { NIGERIAN_BANKS, MOCK_USER } from "@/data/mockData";
import {
  Building2,
  UserCheck,
  Globe2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Lock,
  Check,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function SendMoneyPage() {
  const [activeTab, setActiveTab] = useState<"nigerian_bank" | "veylo" | "international">(
    "nigerian_bank"
  );

  // Nigerian Bank Form State
  const [selectedBank, setSelectedBank] = useState("gtb");
  const [accountNumber, setAccountNumber] = useState("0123456789");
  const [resolvedName, setResolvedName] = useState<string | null>("Oluwatobi Adebayo");
  const [isResolving, setIsResolving] = useState(false);
  const [amountNgn, setAmountNgn] = useState("250000");

  // Veylo Account Form State
  const [veyloRecipientInput, setVeyloRecipientInput] = useState("482 193 8812");
  const [resolvedVeyloUser, setResolvedVeyloUser] = useState<string | null>("Chioma Okonkwo (@chioma)");

  // Authorization Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Handle bank account resolution
  const handleAccountChange = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(clean);
    if (clean.length === 10) {
      setIsResolving(true);
      setTimeout(() => {
        setIsResolving(false);
        setResolvedName("Oluwatobi Adebayo");
      }, 400);
    } else {
      setResolvedName(null);
    }
  };

  const handleVeyloRecipientChange = (val: string) => {
    setVeyloRecipientInput(val);
    if (val.length >= 8) {
      setResolvedVeyloUser("Chioma Okonkwo (@chioma)");
    } else {
      setResolvedVeyloUser(null);
    }
  };

  const parsedAmount = parseFloat(amountNgn) || 0;
  const veyloFee = parsedAmount * 0.02; // 2.0% Veylo transaction fee rule
  const totalDebit = parsedAmount + veyloFee;

  const handleAuthorize = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setTransferSuccess(true);
    }, 900);
  };

  const handleReset = () => {
    setAuthModalOpen(false);
    setTransferSuccess(false);
    setPin(["", "", "", "", "", ""]);
  };

  return (
    <AppLayoutClient
      title="Send Money"
      subtitle="Transfer to Nigerian banks, Veylo accounts, or international destinations"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Destination Category Switcher Tabs */}
        <div className="flex p-1.5 bg-slate-200/80 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab("nigerian_bank")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "nigerian_bank"
                ? "bg-white text-midnight-950 shadow-sm"
                : "text-slate-600 hover:text-midnight-950"
            }`}
          >
            <Building2 className="w-4 h-4 text-electric-cobalt" />
            <span>Nigerian Bank</span>
          </button>

          <button
            onClick={() => setActiveTab("veylo")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "veylo"
                ? "bg-white text-midnight-950 shadow-sm"
                : "text-slate-600 hover:text-midnight-950"
            }`}
          >
            <UserCheck className="w-4 h-4 text-acid-lime" />
            <span>Veylo Account / ID</span>
          </button>

          <Link
            href="/app/send/international"
            className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 text-slate-600 hover:text-midnight-950 hover:bg-white/60 transition-all"
          >
            <Globe2 className="w-4 h-4 text-electric-cobalt" />
            <span>International</span>
          </Link>
        </div>

        {/* ========================================================
            TAB 1: NIGERIAN BANK ACCOUNT FLOW (Frame 28:119)
           ======================================================== */}
        {activeTab === "nigerian_bank" && (
          <Card variant="white" className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-midnight-950">
                Send to Nigerian Bank Account
              </h2>
              <p className="text-xs text-slate-500">
                Direct settlement via local commercial clearing rails (NIP). Funds clear instantly into the beneficiary account.
              </p>
            </div>

            <div className="space-y-4">
              {/* Destination Bank Select */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                  Select Destination Bank
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-electric-cobalt"
                >
                  {NIGERIAN_BANKS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Beneficiary Account Number */}
              <Input
                label="10-Digit Account Number"
                value={accountNumber}
                onChange={(e) => handleAccountChange(e.target.value)}
                placeholder="e.g. 0123456789"
                verified={!!resolvedName}
                leftAddon={<Building2 className="w-4 h-4" />}
                helperText="Enter the recipient's standard 10-digit NUBAN."
              />

              {/* Real-time Beneficiary Resolution Card */}
              {isResolving && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-4 h-4 border-2 border-electric-cobalt border-t-transparent rounded-full animate-spin" />
                  <span>Resolving beneficiary details from Nigerian clearing rail...</span>
                </div>
              )}

              {resolvedName && !isResolving && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-800">
                    <span className="flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      BENEFICIARY CONFIRMED
                    </span>
                    <span>NIBSS / NIP Match</span>
                  </div>
                  <p className="text-base font-black text-emerald-950 font-sans">
                    {resolvedName}
                  </p>
                  <p className="text-xs text-emerald-700 font-mono">
                    Guaranty Trust Bank (GTBank) • {accountNumber}
                  </p>
                </div>
              )}

              {/* Transfer Amount Input */}
              <Input
                label="Transfer Amount (NGN)"
                value={amountNgn}
                onChange={(e) => setAmountNgn(e.target.value)}
                placeholder="0.00"
                leftAddon={<span className="font-bold text-slate-500">₦</span>}
                helperText={`Available balance: ₦${MOCK_USER.availableBalanceNgn.toLocaleString()}`}
              />

              {/* Transparent Fee & Routing Breakdown */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Source Funding Account:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {MOCK_USER.connectedBank.bankName} (••6789)
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Transfer Amount:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₦{parsedAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Veylo Transaction Fee (2.0%):</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₦{veyloFee.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-midnight-950">
                  <span>Total Amount Debited:</span>
                  <span className="font-mono text-base text-electric-cobalt">
                    ₦{totalDebit.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-emerald-700 font-medium">
                  <span>Recipient Receives:</span>
                  <span className="font-mono font-bold">
                    ₦{parsedAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={() => setAuthModalOpen(true)}
                disabled={!resolvedName || parsedAmount <= 0}
                className="w-full justify-center"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Review and Authorise Transfer
              </Button>
            </div>
          </Card>
        )}

        {/* ========================================================
            TAB 2: VEYLO ACCOUNT / ID FLOW
           ======================================================== */}
        {activeTab === "veylo" && (
          <Card variant="white" className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-midnight-950">
                Send to Veylo Account or Handle
              </h2>
              <p className="text-xs text-slate-500">
                Instant peer-to-peer transfer via Open Payments protocol. Zero card fees.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Recipient Veylo Number or Handle"
                value={veyloRecipientInput}
                onChange={(e) => handleVeyloRecipientChange(e.target.value)}
                placeholder="e.g. 482 193 8812 or @chioma"
                verified={!!resolvedVeyloUser}
                leftAddon={<UserCheck className="w-4 h-4" />}
                helperText="Enter 10-digit Veylo Account Number or @handle."
              />

              {resolvedVeyloUser && (
                <div className="p-4 rounded-xl bg-electric-cobalt/5 border border-electric-cobalt/20 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono text-electric-cobalt">
                    <span className="flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      RESOLVED OPEN PAYMENTS IDENTITY
                    </span>
                    <span>Direct ILP Peer</span>
                  </div>
                  <p className="text-base font-black text-midnight-950 font-sans">
                    {resolvedVeyloUser}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Endpoint: https://veylo.me/chioma
                  </p>
                </div>
              )}

              <Input
                label="Amount (NGN)"
                value={amountNgn}
                onChange={(e) => setAmountNgn(e.target.value)}
                placeholder="0.00"
                leftAddon={<span className="font-bold text-slate-500">₦</span>}
              />

              <Button
                variant="primary"
                size="lg"
                onClick={() => setAuthModalOpen(true)}
                disabled={!resolvedVeyloUser || parsedAmount <= 0}
                className="w-full justify-center"
              >
                Continue to Review
              </Button>
            </div>
          </Card>
        )}

        {/* ========================================================
            AUTHORIZATION & PIN / BIOMETRIC MODAL
           ======================================================== */}
        <Modal
          isOpen={authModalOpen}
          onClose={handleReset}
          title={transferSuccess ? "Transfer Settled" : "Authorise Payment"}
          subtitle={
            transferSuccess
              ? "Funds cleared instantly to recipient"
              : "Confirm the transaction details below"
          }
        >
          {!transferSuccess ? (
            <div className="space-y-6">
              {/* Summary Box */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Beneficiary:</span>
                  <span className="font-bold text-slate-900">{resolvedName || resolvedVeyloUser}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Destination:</span>
                  <span className="font-mono font-medium text-slate-900">
                    Guaranty Trust Bank (0123456789)
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Amount Debited:</span>
                  <span className="font-mono font-bold text-electric-cobalt text-sm">
                    ₦{totalDebit.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>Includes Veylo Fee (2.0%):</span>
                  <span className="font-mono">₦{veyloFee.toLocaleString()}</span>
                </div>
              </div>

              {/* Biometrics and PIN Action */}
              <div className="space-y-3">
                <Button
                  variant="lime"
                  size="lg"
                  onClick={handleAuthorize}
                  isLoading={isAuthenticating}
                  className="w-full justify-center font-bold"
                  leftIcon={<ShieldCheck className="w-5 h-5 text-midnight-950" />}
                >
                  Authorise with Face ID / Passkey
                </Button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-2 text-[11px] font-mono text-slate-400 uppercase">
                    or enter 6-digit PIN
                  </span>
                </div>

                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      type="password"
                      maxLength={1}
                      defaultValue="•"
                      className="w-10 h-12 rounded-xl border border-slate-300 text-center font-bold text-lg focus:ring-2 focus:ring-electric-cobalt focus:outline-none"
                    />
                  ))}
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAuthorize}
                  isLoading={isAuthenticating}
                  className="w-full justify-center"
                >
                  Confirm with PIN
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-5 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h4 className="text-xl font-black text-midnight-950 font-sans">
                  ₦{parsedAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })} Sent
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Reference: <span className="font-mono text-slate-700">VYL-NG-984210</span>
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs text-left space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient:</span>
                  <span className="font-bold text-slate-900">{resolvedName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <span>GTBank • {accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Funding:</span>
                  <span>Connected GTBank ••6789</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Settlement Status:</span>
                  <span>Direct NIP Instant (2.4s)</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleReset}
                  className="flex-1"
                >
                  Make Another Transfer
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  href="/app/activity"
                  className="flex-1"
                >
                  View Activity
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AppLayoutClient>
  );
}
