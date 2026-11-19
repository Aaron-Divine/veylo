"use client";

import React, { useState } from "react";
import { AppLayoutClient } from "@/components/layout/AppLayoutClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useAccount } from "@/context/AccountContext";
import { VeyloSymbol } from "@/components/brand/VeyloLogo";
import { resolveOpenPaymentsAddress } from "@/lib/interledger";
import {
  ShieldCheck,
  Building2,
  Copy,
  Check,
  Lock,
  Globe2,
  Zap,
  ExternalLink,
  RefreshCw,
  Search,
  LogOut,
} from "lucide-react";

export default function AccountIdentityPage() {
  const { currentUser, testnetStatus } = useAccount();
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPointer, setCopiedPointer] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  // Live testnet address tester
  const [testAddressInput, setTestAddressInput] = useState("https://ilp.interledger-test.dev/tomiade");
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(currentUser.veyloAccountNumber.replace(/\s+/g, ""));
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyPointer = () => {
    navigator.clipboard.writeText(currentUser.openPaymentsAddress);
    setCopiedPointer(true);
    setTimeout(() => setCopiedPointer(false), 2000);
  };

  const handleTestResolution = async () => {
    setIsTesting(true);
    try {
      const res = await resolveOpenPaymentsAddress(testAddressInput);
      setTestResult(res);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <AppLayoutClient
      title="Account & Identity Hub"
      subtitle="Cryptographic Identity, Connected Commercial Bank & Open Payments Credentials"
    >
      <div className="space-y-8 max-w-5xl">
        {/* Digital Pass Card & Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Digital Veylo Pass (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl bg-midnight-950 p-6 text-white shadow-2xl border border-midnight-800 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-electric-cobalt/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <VeyloSymbol size={36} variant="dark" />
                <Badge variant="lime" size="sm" dot>
                  {isFrozen ? "FROZEN" : "ACTIVE"}
                </Badge>
              </div>

              <div className="space-y-1 relative z-10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Veylo Payment Account
                </span>
                <p className="text-2xl sm:text-3xl font-mono font-black tracking-widest text-white">
                  {currentUser.veyloAccountNumber}
                </p>
              </div>

              <div className="flex items-end justify-between pt-4 border-t border-midnight-900 relative z-10 text-xs">
                <div>
                  <p className="font-bold text-white text-sm">{currentUser.name}</p>
                  <p className="text-acid-lime font-mono">{currentUser.handle}</p>
                </div>
                <div className="text-right font-mono text-[10px] text-slate-400">
                  <span>ILP v4 COMPLIANT</span>
                  <p className="text-slate-300">OPEN PAYMENTS</p>
                </div>
              </div>
            </div>

            <Button
              variant={isFrozen ? "lime" : "outline"}
              size="md"
              onClick={() => setIsFrozen(!isFrozen)}
              className="w-full justify-center"
              leftIcon={<Lock className="w-4 h-4" />}
            >
              {isFrozen ? "Unfreeze Veylo Account" : "Freeze Veylo Account (Instant Kill-Switch)"}
            </Button>
          </div>

          {/* Account Details & Identifiers (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Card variant="white" className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-midnight-950">
                    Interoperable Identifiers
                  </h3>
                  <p className="text-xs text-slate-500">
                    Your public addresses for receiving funds across all connected networks
                  </p>
                </div>
                <Badge variant="success" size="sm">
                  Tier 3 KYC Verified
                </Badge>
              </div>

              <div className="space-y-4">
                {/* 10-digit number */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500">
                      Standard Veylo Account Number
                    </span>
                    <p className="text-lg font-black font-mono text-midnight-950">
                      {currentUser.veyloAccountNumber}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyId}
                    leftIcon={copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {copiedId ? "Copied" : "Copy"}
                  </Button>
                </div>

                {/* Open Payments Pointer */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500">
                      Open Payments Resource Pointer
                    </span>
                    <p className="text-sm font-mono font-bold text-electric-cobalt">
                      {currentUser.openPaymentsAddress}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPointer}
                    leftIcon={copiedPointer ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {copiedPointer ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Connected Commercial Bank */}
            <Card variant="white" className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-electric-cobalt" />
                  <h3 className="text-base font-bold text-midnight-950">
                    Connected Funding &amp; Clearing Bank
                  </h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-emerald-800 font-bold">{currentUser.connectedBank.bankName}</span>
                  <span className="text-emerald-700">Account: {currentUser.connectedBank.accountNumber}</span>
                </div>
                <div className="flex justify-between text-emerald-900">
                  <span>Account Holder:</span>
                  <span className="font-bold">{currentUser.connectedBank.accountHolder}</span>
                </div>
                <div className="pt-2 border-t border-emerald-200/60 flex justify-between text-[11px] text-emerald-700">
                  <span>Clearing Integration:</span>
                  <span>Direct Open Payments ILP Settlement</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* ========================================================
            INTERLEDGER TEST WALLET LIVE CONNECTOR
           ======================================================== */}
        <Card variant="midnight" className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-midnight-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-electric-cobalt/20 text-acid-lime flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-sans">
                  Interledger Test Wallet Network Link
                </h3>
                <p className="text-xs text-slate-400">
                  Connected to {testnetStatus.testnetEnv} (Rafiki Open Payments testnet)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="lime" size="sm" dot>
                {testnetStatus.latencyMs}ms RTT
              </Badge>
              <a
                href="https://wallet.interledger-test.dev"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-electric-cobalt hover:underline inline-flex items-center gap-1 font-mono"
              >
                <span>Open Wallet UI</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Testnet Address Resolution Tool */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  label="Test Open Payments Wallet Address / Pointer Resolution"
                  value={testAddressInput}
                  onChange={(e) => setTestAddressInput(e.target.value)}
                  placeholder="https://ilp.interledger-test.dev/username or $wallet..."
                  className="bg-midnight-950 border-midnight-800 text-white"
                />
              </div>
              <div className="sm:self-end">
                <Button
                  variant="lime"
                  size="md"
                  onClick={handleTestResolution}
                  isLoading={isTesting}
                  leftIcon={<Search className="w-4 h-4" />}
                >
                  Resolve Address
                </Button>
              </div>
            </div>

            {testResult && (
              <div className="p-4 rounded-2xl bg-midnight-950 border border-midnight-800 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-acid-lime">
                  <span className="font-bold">✓ RESOLUTION SUCCESS</span>
                  <span>Asset: {testResult.assetCode} (Scale: {testResult.assetScale})</span>
                </div>
                <div className="text-white">
                  <strong>Public Name:</strong> {testResult.publicName}
                </div>
                <div className="text-slate-300 truncate">
                  <strong>Resource URI:</strong> {testResult.id}
                </div>
                <div className="text-slate-400 truncate">
                  <strong>Auth Server:</strong> {testResult.authServer}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Session & Security */}
        <Card variant="white" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-midnight-950 font-sans">
                Active Session & Security
              </h2>
              <p className="text-xs text-slate-500">
                You are currently authenticated as <strong className="text-midnight-900">{currentUser.name}</strong> ({currentUser.veyloAccountNumber})
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                window.location.href = "/auth/login";
              }}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Sign Out of Veylo
            </Button>
          </div>
        </Card>
      </div>
    </AppLayoutClient>
  );
}
