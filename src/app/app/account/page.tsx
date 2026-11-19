"use client";

import React, { useState } from "react";
import { AppLayoutClient } from "@/components/layout/AppLayoutClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { MOCK_USER } from "@/data/mockData";
import { VeyloSymbol } from "@/components/brand/VeyloLogo";
import {
  ShieldCheck,
  Building2,
  Copy,
  Check,
  Lock,
  Smartphone,
  Key,
  CreditCard,
  QrCode,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function AccountIdentityPage() {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPointer, setCopiedPointer] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  const paymentPointer = `https://veylo.me/${MOCK_USER.handle.replace("@", "")}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(MOCK_USER.veyloAccountNumber.replace(/\s+/g, ""));
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyPointer = () => {
    navigator.clipboard.writeText(paymentPointer);
    setCopiedPointer(true);
    setTimeout(() => setCopiedPointer(false), 2000);
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
                  {MOCK_USER.veyloAccountNumber}
                </p>
              </div>

              <div className="flex items-end justify-between pt-4 border-t border-midnight-900 relative z-10 text-xs">
                <div>
                  <p className="font-bold text-white text-sm">{MOCK_USER.name}</p>
                  <p className="text-acid-lime font-mono">{MOCK_USER.handle}</p>
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
                      {MOCK_USER.veyloAccountNumber}
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
                      {paymentPointer}
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
                    Connected Funding & Clearing Bank
                  </h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-emerald-800 font-bold">{MOCK_USER.connectedBank.bankName}</span>
                  <span className="text-emerald-700">Account: {MOCK_USER.connectedBank.accountNumber}</span>
                </div>
                <div className="flex justify-between text-emerald-900">
                  <span>Account Holder:</span>
                  <span className="font-bold">{MOCK_USER.connectedBank.accountHolder}</span>
                </div>
                <div className="pt-2 border-t border-emerald-200/60 flex justify-between text-[11px] text-emerald-700">
                  <span>Clearing Integration:</span>
                  <span>Instant Auto-Credit via NIP Rail</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayoutClient>
  );
}
