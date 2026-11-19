"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayoutClient } from "@/components/layout/AppLayoutClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { UK_BANKS, EU_BANKS, MOCK_USER } from "@/data/mockData";
import {
  Globe2,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  RefreshCw,
  Clock,
  Layers,
  Check,
  AlertTriangle,
  Info,
} from "lucide-react";

export default function InternationalTransferPage() {
  const [destinationCountry, setDestinationCountry] = useState<"GB" | "EU" | "UNSUPPORTED">("GB");
  const [sortCode, setSortCode] = useState("40-22-18");
  const [accountNumber, setAccountNumber] = useState("88291044");
  const [resolvedRecipient, setResolvedRecipient] = useState<string | null>("Arthur Pendelton");
  const [gbpAmount, setGbpAmount] = useState("150.00");

  // Routing Mode: Direct Interledger Bank Endpoint vs Local Payout Partner
  const [routeMode, setRouteMode] = useState<"direct_ilp" | "payout_partner">("direct_ilp");

  // Live Quote & Timer
  const [quoteSecondsLeft, setQuoteSecondsLeft] = useState(58);
  const fxRate = 2040.0; // 1 GBP = 2040 NGN
  const parsedGbp = parseFloat(gbpAmount) || 0;
  const ngnEquivalent = parsedGbp * fxRate;
  const veyloFeeNgn = ngnEquivalent * 0.02; // 2.0%
  const totalDebitNgn = ngnEquivalent + veyloFeeNgn;

  // Authorization Modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [transferSettled, setTransferSettled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteSecondsLeft((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCountryChange = (country: "GB" | "EU" | "UNSUPPORTED") => {
    setDestinationCountry(country);
    if (country === "GB") {
      setResolvedRecipient("Arthur Pendelton");
    } else if (country === "EU") {
      setResolvedRecipient("Helena Schmidt (DE89 3704 0044 0532 0130 00)");
    } else {
      setResolvedRecipient(null);
    }
  };

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      setTransferSettled(true);
    }, 1100);
  };

  const handleReset = () => {
    setAuthModalOpen(false);
    setTransferSettled(false);
  };

  return (
    <AppLayoutClient
      title="International Transfer"
      subtitle="Interledger Cross-Border Routing • Direct Bank Endpoints & Payout Partners"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Architecture Notice Banner */}
        <div className="rounded-2xl bg-midnight-950 p-4 sm:p-5 text-white border border-midnight-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-electric-cobalt/20 text-electric-cobalt shrink-0 mt-0.5">
              <Layers className="w-5 h-5 text-acid-lime" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-acid-lime font-bold">
                Interledger Direct Value Routing
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Zero correspondent banks. Currency conversion occurs on-the-fly inside Interledger connectors, settling directly into the foreign recipient&apos;s commercial bank.
              </p>
            </div>
          </div>
          <Badge variant="lime" size="sm" className="shrink-0 self-start sm:self-center">
            Zero Intermediary Deductions
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Card variant="white" className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-midnight-950 font-sans">
                  Destination Country & Bank
                </h2>
                <p className="text-xs text-slate-500">
                  Select destination corridor to adapt required clearing fields
                </p>
              </div>

              {/* Corridor Country Selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleCountryChange("GB")}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    destinationCountry === "GB"
                      ? "border-electric-cobalt bg-electric-cobalt/5 text-midnight-950 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="text-lg">🇬🇧</span>
                  <span>United Kingdom (GBP)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCountryChange("EU")}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    destinationCountry === "EU"
                      ? "border-electric-cobalt bg-electric-cobalt/5 text-midnight-950 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="text-lg">🇪🇺</span>
                  <span>Eurozone (EUR)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCountryChange("UNSUPPORTED")}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    destinationCountry === "UNSUPPORTED"
                      ? "border-amber-500 bg-amber-50 text-amber-900"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="text-lg">🌐</span>
                  <span>Other / Offline</span>
                </button>
              </div>

              {/* Unsupported corridor fallback state */}
              {destinationCountry === "UNSUPPORTED" ? (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-3">
                  <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
                  <h4 className="text-sm font-bold text-amber-950">
                    No Interledger Route Currently Available
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed max-w-sm mx-auto">
                    There are no participating connectors with sufficient liquidity for this corridor right now. Please select United Kingdom (GBP) or Eurozone (EUR) to continue.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCountryChange("GB")}
                    className="border-amber-300 bg-white text-amber-950 hover:bg-amber-100"
                  >
                    Switch to United Kingdom
                  </Button>
                </div>
              ) : (
                <>
                  {/* UK Adaptive Fields */}
                  {destinationCountry === "GB" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Sort Code (6 Digits)"
                          value={sortCode}
                          onChange={(e) => setSortCode(e.target.value)}
                          placeholder="e.g. 40-22-18"
                          helperText="UK clearing sort code"
                        />
                        <Input
                          label="Account Number (8 Digits)"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="e.g. 88291044"
                          helperText="UK beneficiary account"
                        />
                      </div>

                      {/* Recipient Resolution Pill */}
                      {resolvedRecipient && (
                        <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono text-emerald-800">
                            <span className="flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              CONFIRMATION OF PAYEE MATCH
                            </span>
                            <span>Barclays Bank UK</span>
                          </div>
                          <p className="text-base font-black text-emerald-950 font-sans">
                            {resolvedRecipient}
                          </p>
                          <p className="text-xs text-emerald-700 font-mono">
                            Sort Code {sortCode} • Account {accountNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* EU Adaptive Fields */}
                  {destinationCountry === "EU" && (
                    <div className="space-y-4">
                      <Input
                        label="Beneficiary IBAN"
                        defaultValue="DE89370400440532013000"
                        placeholder="DE..."
                        helperText="European International Bank Account Number"
                      />
                      <Input
                        label="BIC / SWIFT Code (Optional for SEPA)"
                        defaultValue="DEUTDEDDFXX"
                        placeholder="e.g. DEUT..."
                      />
                    </div>
                  )}

                  {/* Transfer Amount Input */}
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <Input
                      label={
                        destinationCountry === "GB"
                          ? "Beneficiary Receives (GBP)"
                          : "Beneficiary Receives (EUR)"
                      }
                      value={gbpAmount}
                      onChange={(e) => setGbpAmount(e.target.value)}
                      placeholder="0.00"
                      leftAddon={
                        <span className="font-bold text-slate-500">
                          {destinationCountry === "GB" ? "£" : "€"}
                        </span>
                      }
                    />
                  </div>

                  {/* Route Topology Selector (Mode 1 vs Mode 2) */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                        Interledger Settlement Path
                      </label>
                      <span className="text-[11px] font-mono text-electric-cobalt">
                        Zero correspondent banks
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRouteMode("direct_ilp")}
                        className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                          routeMode === "direct_ilp"
                            ? "border-electric-cobalt bg-electric-cobalt/5 shadow-sm"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-midnight-950">Mode 1: Direct ILP</span>
                          {routeMode === "direct_ilp" && <Check className="w-3.5 h-3.5 text-electric-cobalt" />}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Receiving bank (Barclays) participates directly on Interledger.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRouteMode("payout_partner")}
                        className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                          routeMode === "payout_partner"
                            ? "border-electric-cobalt bg-electric-cobalt/5 shadow-sm"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-midnight-950">Mode 2: Payout Partner</span>
                          {routeMode === "payout_partner" && <Check className="w-3.5 h-3.5 text-electric-cobalt" />}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Integrated financial provider clears to UK Faster Payments.
                        </p>
                      </button>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setAuthModalOpen(true)}
                    disabled={!resolvedRecipient || parsedGbp <= 0}
                    className="w-full justify-center"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Proceed with Quote
                  </Button>
                </>
              )}
            </Card>
          </div>

          {/* Right Live Quote & Breakdown Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card variant="midnight" className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-midnight-800">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-acid-lime animate-spin-slow" />
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    Live Connector FX Quote
                  </span>
                </div>
                <span className="text-[11px] font-mono text-acid-lime bg-midnight-900 px-2 py-0.5 rounded-full border border-midnight-800">
                  {quoteSecondsLeft}s remaining
                </span>
              </div>

              {/* Rate & Equivalent Box */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-400">
                  <span>MARKET EXCHANGE RATE</span>
                  <p className="text-xl font-bold font-mono text-white mt-1">
                    1 GBP = ₦2,040.00 NGN
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Interledger peer connector quote • Zero spread markup
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-midnight-950 border border-midnight-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Source Funding:</span>
                    <span className="text-white font-bold">GTBank ••6789</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Target FX Value:</span>
                    <span className="text-white">
                      ₦{ngnEquivalent.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Veylo Fee (2.0%):</span>
                    <span className="text-acid-lime">
                      ₦{veyloFeeNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Intermediary Bank Fee:</span>
                    <span className="text-emerald-400 font-bold">₦0.00 (Direct ILP)</span>
                  </div>
                  <div className="pt-2 border-t border-midnight-800 flex justify-between text-sm font-bold text-white">
                    <span>Total Debited:</span>
                    <span className="text-acid-lime text-base">
                      ₦{totalDebitNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="pt-1 flex justify-between text-xs text-slate-300">
                    <span>Recipient Receives:</span>
                    <span className="font-bold text-white">
                      £{parsedGbp.toFixed(2)} GBP
                    </span>
                  </div>
                </div>
              </div>

              {/* Routing Visualizer */}
              <div className="p-4 rounded-2xl bg-midnight-950 border border-midnight-800 space-y-3 text-xs">
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                  Active Value Route Topology
                </span>
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Tier 1: Tomi Adebayo (GTBank ••6789)</span>
                  </div>
                  <div className="flex items-center gap-2 text-acid-lime">
                    <span className="w-2 h-2 rounded-full bg-acid-lime" />
                    <span>Tier 2: ILP Connector (FX NGN → GBP)</span>
                  </div>
                  <div className="flex items-center gap-2 text-electric-cobalt">
                    <span className="w-2 h-2 rounded-full bg-electric-cobalt" />
                    <span>
                      {routeMode === "direct_ilp"
                        ? "Tier 3: Barclays Direct ILP Endpoint"
                        : "Tier 3: UK Payout Partner (ClearBank)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span>
                      Tier 4: Arthur Pendelton (Acct 88291044)
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* ========================================================
            AUTHORIZATION MODAL FOR INTERNATIONAL TRANSFER
           ======================================================== */}
        <Modal
          isOpen={authModalOpen}
          onClose={handleReset}
          title={transferSettled ? "International Payment Cleared" : "Confirm International Transfer"}
          subtitle={
            transferSettled
              ? "Settled in recipient's UK bank account"
              : "Review live Interledger conversion details"
          }
        >
          {!transferSettled ? (
            <div className="space-y-6">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Recipient:</span>
                  <span className="font-bold text-slate-900">{resolvedRecipient}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>UK Account:</span>
                  <span className="font-mono text-slate-900">
                    Barclays • Sort {sortCode} • {accountNumber}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Exchange Rate:</span>
                  <span className="font-mono text-slate-900">1 GBP = ₦2,040.00</span>
                </div>
                <div className="flex justify-between text-slate-600 font-bold text-sm pt-2 border-t border-slate-200">
                  <span>Amount Debited:</span>
                  <span className="font-mono text-electric-cobalt">
                    ₦{totalDebitNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Beneficiary Receives:</span>
                  <span className="font-mono">£{parsedGbp.toFixed(2)} GBP</span>
                </div>
              </div>

              <Button
                variant="lime"
                size="lg"
                onClick={handleAuthorize}
                isLoading={isAuthorizing}
                className="w-full justify-center font-bold"
                leftIcon={<ShieldCheck className="w-5 h-5 text-midnight-950" />}
              >
                Authorise Transfer with Passkey
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-5 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h4 className="text-xl font-black text-midnight-950 font-sans">
                  £{parsedGbp.toFixed(2)} GBP Delivered
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  ILP Packet ID: <span className="font-mono text-slate-700">ilp:pk_44910283fa71</span>
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs text-left space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <span>Barclays Bank UK • Arthur Pendelton</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Execution Speed:</span>
                  <span className="text-emerald-600 font-bold">3.8 seconds (Instant)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Correspondent Deduction:</span>
                  <span className="text-emerald-600 font-bold">£0.00</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleReset}
                  className="flex-1"
                >
                  Send Another
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
