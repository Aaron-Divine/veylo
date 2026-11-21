"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { VeyloSymbol } from "@/components/brand/VeyloLogo";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Check,
  Zap,
  Lock,
  Smartphone,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";

export default function MarketingHomePage() {
  // Interactive mini checkout simulator state
  const [simAccountNumber, setSimAccountNumber] = useState("482 193 7604");
  const [simPin, setSimPin] = useState("1234");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#3D5BFF] selection:text-white">
      <MarketingNavbar />

      <main className="flex-1">
        {/* ========================================================
            HERO SECTION: IN-APP PAYMENTS WITH JUST A NUMBER & PIN
           ======================================================== */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-24 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Core Value Proposition */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Pill Tag */}
                <div className="inline-flex items-center gap-2 rounded-[14px] bg-[#111B32] px-3.5 py-1.5 text-[11px] font-mono font-bold text-[#D8F15B]">
                  <span className="w-2 h-2 rounded-full bg-[#D8F15B] animate-pulse" />
                  SINGLE PORTABLE PAYMENT IDENTITY
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-normal tracking-tight text-[#111B32] font-serif leading-[1.1]">
                  Seamless in-app purchases. <br />
                  <span className="italic text-[#3D5BFF]">With just a number and a PIN.</span>
                </h1>

                {/* Core Pitch Paragraph */}
                <p className="text-base sm:text-lg text-[#334155] max-w-xl leading-relaxed font-normal">
                  Veylo is a payment platform that gives individuals and businesses a single, portable payment identity.
                  This doesn&apos;t just allow them to send money easily, but makes in-app purchases seamless. Built on Interledger and Open Payments, it connects online merchants to their buyers with just a number and a PIN.
                </p>

                {/* Action CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center font-bold rounded-[12px] px-[22px] py-[14px] text-[15px] bg-[#D8F15B] hover:bg-[#C5DE48] text-[#111B32] shadow-sm transition-all active:scale-[0.98]"
                  >
                    <span>Get Your Veylo Account</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>

                  <Link
                    href="/auth/login"
                    className="inline-flex items-center justify-center font-semibold rounded-[12px] px-[20px] py-[14px] text-[14px] bg-white border border-[#CBD5E1] text-[#111B32] hover:bg-slate-50 transition-all active:scale-[0.98]"
                  >
                    <span>Sign In to Wallet</span>
                  </Link>
                </div>

                {/* Fast Trust Indicators */}
                <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-5 text-[12px] font-semibold text-[#475569]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    No 16-Digit Card Numbers
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    4-Digit Secret PIN Protection
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    Sub-Second Interledger Settlement
                  </span>
                </div>
              </div>

              {/* Right Column: Live In-App Checkout Simulator */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-[24px] bg-[#111B32] p-6 sm:p-7 text-white shadow-2xl border border-slate-800 space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-1 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#D8F15B] flex items-center justify-center text-[#111B32] font-black text-xs font-sans">
                        V
                      </div>
                      <span className="text-xs font-mono font-bold tracking-wider text-[#D8F15B]">
                        IN-APP CHECKOUT PREVIEW
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded-[6px]">
                      Merchant: Online Checkout
                    </span>
                  </div>

                  {/* Order Summary */}
                  <div className="rounded-[14px] bg-[#0A0F1E] p-3.5 space-y-1.5 text-left border border-white/5">
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>Purchasing</span>
                      <span className="font-mono text-emerald-400">Open Payments</span>
                    </div>
                    <div className="flex justify-between items-center text-white">
                      <span className="font-bold text-sm">Fintech &amp; Web3 Engineering</span>
                      <span className="font-black text-base font-mono text-[#D8F15B]">₦15,000</span>
                    </div>
                  </div>

                  {isPaid ? (
                    /* Instant Paid Confirmation */
                    <div className="py-8 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in zoom-in-95 duration-200">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-white">Payment Verified!</h4>
                        <p className="text-xs text-slate-400">
                          Account debited ₦15,000. In-app course unlocked in <strong>320ms</strong>.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPaid(false)}
                        className="text-[11px] text-[#D8F15B] font-mono hover:underline font-bold pt-1"
                      >
                        Reset Demo Checkout ↺
                      </button>
                    </div>
                  ) : (
                    /* Interactive Form */
                    <form onSubmit={handleSimulatePayment} className="space-y-3.5 text-left">
                      <div>
                        <label className="block text-[11px] font-mono font-bold text-slate-400 mb-1">
                          10-Digit Veylo Account Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={simAccountNumber}
                            onChange={(e) => setSimAccountNumber(e.target.value)}
                            className="w-full bg-[#0A0F1E] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-[#D8F15B]"
                            placeholder="e.g. 482 193 7604"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono font-bold text-slate-400 mb-1">
                          4-Digit Secret PIN
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            value={simPin}
                            onChange={(e) => setSimPin(e.target.value.slice(0, 4))}
                            maxLength={4}
                            className="w-full bg-[#0A0F1E] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm tracking-widest focus:outline-none focus:border-[#D8F15B]"
                            placeholder="••••"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full h-[48px] rounded-[12px] bg-[#D8F15B] hover:bg-[#C5DE48] text-[#111B32] font-bold text-sm flex items-center justify-center transition-all active:scale-[0.98] shadow-sm"
                      >
                        {isProcessing ? (
                          <span className="animate-spin w-5 h-5 border-2 border-[#111B32] border-t-transparent rounded-full" />
                        ) : (
                          "Authorize ₦15,000 Payment"
                        )}
                      </button>
                    </form>
                  )}

                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#10B981]" />
                      Bcrypt Hashed Security
                    </span>
                    <span>Zero Card Scheme Fees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            HOW IN-APP CHECKOUT WORKS: 3 SIMPLE STEPS
           ======================================================== */}
        <section id="how-it-works" className="py-16 md:py-20 bg-white border-b border-[#E2E8F0]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-10">
            <div className="space-y-2 max-w-2xl mx-auto">
              <p className="text-[11px] font-mono font-bold text-[#3D5BFF] uppercase tracking-wider">
                HOW IN-APP PAYMENTS WORK
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#111B32]">
                Three steps. No 16-digit card headaches.
              </h2>
              <p className="text-sm text-slate-500">
                A single payment identity that works anywhere you make online purchases.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Step 1 */}
              <div className="rounded-[20px] bg-[#F8FAFC] border border-[#E2E8F0] p-7 space-y-3.5 hover:border-[#3D5BFF]/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-[#D8F15B] text-[#111B32] font-bold text-[13px] flex items-center justify-center font-mono">
                    01
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">IDENTIFIER</span>
                </div>
                <h3 className="text-lg font-bold text-[#111B32]">Claim Your 10-Digit Identity</h3>
                <div className="inline-block bg-[#111B32] px-2.5 py-1 rounded-[6px] text-xs font-mono font-extrabold text-[#D8F15B]">
                  482 193 7604
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Register in seconds and receive your unique 10-digit Veylo Account Number. Set your secret 4-digit PIN that protects your funds.
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-[20px] bg-[#EEF2FF] border border-[#3D5BFF] p-7 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-[#3D5BFF] text-white font-bold text-[13px] flex items-center justify-center font-mono">
                    02
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#3D5BFF] uppercase">SEAMLESS CHECKOUT</span>
                </div>
                <h3 className="text-lg font-bold text-[#111B32]">Choose Veylo on Any App</h3>
                <div className="inline-block bg-[#111B32] px-2.5 py-1 rounded-[6px] text-xs font-mono font-extrabold text-[#D8F15B]">
                  Number + PIN Checkout
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Whenever you buy a course, subscription, or software license online, select &ldquo;Pay with Veylo Wallet&rdquo;. No plastic card details to type.
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-[20px] bg-[#F8FAFC] border border-[#E2E8F0] p-7 space-y-3.5 hover:border-[#3D5BFF]/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-[#D8F15B] text-[#111B32] font-bold text-[13px] flex items-center justify-center font-mono">
                    03
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">INSTANT SETTLEMENT</span>
                </div>
                <h3 className="text-lg font-bold text-[#111B32]">Atomic Interledger Settlement</h3>
                <div className="inline-block bg-[#111B32] px-2.5 py-1 rounded-[6px] text-xs font-mono font-extrabold text-[#D8F15B]">
                  Sub-Second Clearance
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your PIN authorizes the payment instantly. The merchant receives settled funds with zero card interchange tax, and your order unlocks immediately.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            BUYERS & MERCHANTS: WHY BOTH SIDES LOVE IT
           ======================================================== */}
        <section className="py-16 md:py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <p className="text-[11px] font-mono font-bold text-[#3D5BFF] uppercase tracking-wider">
                BUILT FOR THE MODERN WEB
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#111B32]">
                Better for buyers. Better for merchants.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* For Individuals */}
              <div className="rounded-[24px] bg-white border border-[#E2E8F0] p-8 space-y-4 shadow-sm text-left">
                <div className="w-10 h-10 rounded-xl bg-electric-cobalt/10 text-electric-cobalt flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#3D5BFF]" />
                </div>
                <h3 className="text-2xl font-bold text-[#111B32]">For Individuals</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Never risk your debit card details on unknown websites again. With Veylo, you have one portable payment identity protected by your secret PIN.
                </p>
                <ul className="space-y-2.5 pt-2 text-xs font-semibold text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>No card number, CVV, or expiry dates exposed online</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Every purchase requires your 4-digit PIN confirmation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Instant wallet balance deduction with real-time audit ledger</span>
                  </li>
                </ul>
              </div>

              {/* For Merchants */}
              <div className="rounded-[24px] bg-[#111B32] text-white p-8 space-y-4 shadow-xl border border-slate-800 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#D8F15B]/20 text-[#D8F15B] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#D8F15B]" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Online Merchants</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Integrate one straightforward API (<code className="text-[#D8F15B] font-mono">POST /api/charge</code>). Accept payments without paying 2.9% card scheme interchange fees.
                </p>
                <ul className="space-y-2.5 pt-2 text-xs font-semibold text-[#D8F15B]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D8F15B] shrink-0" />
                    <span>Zero chargeback fraud liability and zero card network fees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D8F15B] shrink-0" />
                    <span>Atomic sub-second settlement directly to your wallet account</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D8F15B] shrink-0" />
                    <span>Open Payments interoperability with simple webhook notifications</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>



        {/* ========================================================
            FINAL CALL TO ACTION
           ======================================================== */}
        <section className="py-20 bg-[#111B32] text-white text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white">
              Ready for seamless online in-app payments?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto">
              Claim your portable 10-digit Veylo Account Number today and make in-app purchases with just a number and a PIN.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto inline-flex items-center justify-center font-bold rounded-xl px-6 py-3.5 text-sm bg-[#D8F15B] hover:bg-[#C5DE48] text-[#111B32] shadow-sm transition-all"
              >
                Create Free Account
              </Link>
              <Link
                href="/auth/login"
                className="w-full sm:w-auto inline-flex items-center justify-center font-bold rounded-xl px-6 py-3.5 text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all"
              >
                Sign In to Wallet
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
