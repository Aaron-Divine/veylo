"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayoutClient } from "@/components/layout/AppLayoutClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { VeyloLogo, VeyloSymbol } from "@/components/brand/VeyloLogo";
import {
  QrCode,
  Building2,
  Check,
  Smartphone,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function StandSimulatorPage() {
  const [amount, setAmount] = useState("12500");
  const [paid, setPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const parsedAmount = parseFloat(amount) || 0;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaid(true);
    }, 800);
  };

  const handleReset = () => {
    setPaid(false);
  };

  return (
    <AppLayoutClient
      title="Countertop POS Stand Simulator"
      subtitle="In-Store Acrylic Stand • Zero Card Terminal Rental Fees • Direct Commercial Bank Settlement"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Stand Controls (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <Card variant="white" className="space-y-4 text-left">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-midnight-950 font-sans">
                  POS Invoice Generator
                </h3>
                <p className="text-xs text-slate-500">
                  Enter an in-store bill amount to update the customer countertop stand in real time
                </p>
              </div>

              <Input
                label="Invoice Amount (NGN)"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setPaid(false);
                }}
                leftAddon={<span className="font-bold text-slate-500">₦</span>}
                placeholder="0.00"
              />

              <div className="space-y-2 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSimulatePayment}
                  isLoading={isProcessing}
                  className="w-full justify-center"
                >
                  Simulate Customer Scan & Pay
                </Button>
                {paid && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="w-full justify-center"
                  >
                    Reset Stand
                  </Button>
                )}
              </div>
            </Card>

            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-2">
              <p className="font-bold text-midnight-950">How the Countertop Stand Works:</p>
              <ul className="space-y-1 list-disc list-inside text-slate-500">
                <li>Customers scan the QR code with any camera or banking app</li>
                <li>Settlement clears directly into the merchant&apos;s connected bank</li>
                <li>Zero monthly POS terminal hardware rental charges</li>
                <li>Zero 2.9% card processing interchange deduction</li>
              </ul>
            </div>
          </div>

          {/* Right Acrylic Stand Visual Rendering (7 cols) */}
          <div className="md:col-span-7 flex justify-center">
            {/* The Physical Acrylic Stand Frame */}
            <div className="relative w-80 sm:w-96 rounded-3xl bg-white border-4 border-slate-300/80 shadow-2xl p-6 sm:p-8 space-y-6 text-center transform transition-transform hover:scale-[1.01]">
              {/* Stand Header with Veylo Symbol */}
              <div className="flex flex-col items-center gap-2">
                <VeyloSymbol size={44} variant="light" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                  Instant Account Payment
                </span>
                <h4 className="text-lg font-black text-midnight-950 font-sans">
                  Reelroom Indie Cinema
                </h4>
              </div>

              {/* Dynamic QR Box */}
              <div className="relative p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                {paid ? (
                  <div className="py-8 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                    <p className="text-base font-bold text-emerald-800">
                      Payment Received!
                    </p>
                    <p className="text-xs font-mono text-emerald-700">
                      ₦{parsedAmount.toLocaleString()} Settled in Access Bank
                    </p>
                  </div>
                ) : (
                  <>
                    <svg width="180" height="180" viewBox="0 0 200 200" fill="none" className="mx-auto">
                      <rect width="200" height="200" fill="#F8FAFC" />
                      {/* Finder Patterns */}
                      <rect x="10" y="10" width="50" height="50" rx="6" fill="#111B32" />
                      <rect x="18" y="18" width="34" height="34" rx="4" fill="#F8FAFC" />
                      <rect x="25" y="25" width="20" height="20" rx="2" fill="#3D5BFF" />

                      <rect x="140" y="10" width="50" height="50" rx="6" fill="#111B32" />
                      <rect x="148" y="18" width="34" height="34" rx="4" fill="#F8FAFC" />
                      <rect x="155" y="25" width="20" height="20" rx="2" fill="#3D5BFF" />

                      <rect x="10" y="140" width="50" height="50" rx="6" fill="#111B32" />
                      <rect x="18" y="148" width="34" height="34" rx="4" fill="#F8FAFC" />
                      <rect x="25" y="155" width="20" height="20" rx="2" fill="#3D5BFF" />

                      {/* Random grid elements */}
                      <g fill="#111B32">
                        <rect x="70" y="20" width="10" height="10" rx="1" />
                        <rect x="90" y="20" width="10" height="10" rx="1" />
                        <rect x="110" y="20" width="10" height="10" rx="1" />
                        <rect x="70" y="40" width="20" height="10" rx="1" />
                        <rect x="100" y="40" width="10" height="10" rx="1" />
                        <rect x="20" y="70" width="10" height="20" rx="1" />
                        <rect x="40" y="70" width="20" height="10" rx="1" />
                        <rect x="140" y="70" width="20" height="10" rx="1" />
                        <rect x="170" y="70" width="10" height="10" rx="1" />
                        <rect x="70" y="140" width="10" height="20" rx="1" />
                        <rect x="90" y="140" width="20" height="10" rx="1" />
                        <rect x="140" y="140" width="20" height="10" rx="1" />
                        <rect x="170" y="140" width="10" height="20" rx="1" />
                      </g>

                      {/* Center Logo */}
                      <rect x="75" y="75" width="50" height="50" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="2" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <VeyloSymbol size={28} variant="light" />
                    </div>
                  </>
                )}
              </div>

              {/* Amount Display */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-500 uppercase">
                  Invoice Amount
                </span>
                <p className="text-2xl font-black font-mono text-midnight-950">
                  ₦{parsedAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Stand Footer Instructions */}
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                Scan with Veylo or any Nigerian Banking App
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayoutClient>
  );
}
