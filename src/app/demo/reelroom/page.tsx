"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VeyloLogo, VeyloSymbol } from "@/components/brand/VeyloLogo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { MOCK_USER } from "@/data/mockData";
import {
  Film,
  Play,
  ShieldCheck,
  Check,
  Smartphone,
  ArrowRight,
  Sparkles,
  Lock,
  ExternalLink,
} from "lucide-react";

export default function ReelroomDemoPage() {
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [veyloAccountInput, setVeyloAccountInput] = useState("482 193 7604");
  const [step, setStep] = useState<"input" | "push_sent" | "success">("input");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("push_sent");
    }, 600);
  };

  const handleApprovePush = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("success");
    }, 800);
  };

  const handleReset = () => {
    setCheckoutModalOpen(false);
    setStep("input");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-electric-cobalt selection:text-white">
      {/* Reelroom Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-bold text-white shadow-lg">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white font-sans">
                REELROOM
              </span>
              <span className="text-[10px] font-mono text-rose-400 block tracking-widest uppercase">
                Independent Cinema Stream
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex text-xs font-mono text-slate-400">
              Veylo Checkout Integration Live Demo
            </span>
            <Button
              href="/app"
              variant="outline"
              size="sm"
              className="border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800"
            >
              Back to Veylo Portal
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:py-20 space-y-12">
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 border border-rose-900/40 p-8 sm:p-12 space-y-4">
          <Badge variant="lime" size="sm">
            Live Stream Premiere
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-sans tracking-tight">
            Nollywood & African Independent Cinema Festival 2026
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Unlimited access to 400+ restored classic and contemporary African feature films, creator masterclasses, and filmmaker roundtables.
          </p>
        </div>

        {/* Subscription Plan Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-2xl font-bold text-white font-sans">
              Director&apos;s Pass Membership
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Experience the power of Veylo Open Payments. No credit card required. No 16-digit card numbers, expiration dates, or 3D Secure failures. Pay with your memorable 10-digit Veylo Account Number.
            </p>
            <ul className="space-y-2 text-xs font-mono text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-acid-lime" />
                <span>4K Ultra-HD streaming on all screens</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-acid-lime" />
                <span>Zero card numbers held on Reelroom servers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-acid-lime" />
                <span>Customer-controlled mandate: Revoke anytime from Veylo portal</span>
              </li>
            </ul>
          </div>

          {/* Pricing & Checkout Box */}
          <div className="md:col-span-5">
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 space-y-6 shadow-2xl">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Monthly Membership
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-mono font-black text-white">€14.99</span>
                  <span className="text-xs font-mono text-slate-400">/ month</span>
                </div>
                <p className="text-xs font-mono text-acid-lime mt-1">
                  ~₦30,579.60 NGN via Interledger FX
                </p>
              </div>

              {/* Pay with Veylo Custom Branded CTA */}
              <button
                onClick={() => setCheckoutModalOpen(true)}
                className="w-full py-4 px-6 rounded-2xl bg-midnight-950 border border-electric-cobalt hover:border-acid-lime text-white font-bold flex items-center justify-between group transition-all shadow-lg hover:shadow-electric-cobalt/20 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <VeyloSymbol size={28} variant="dark" />
                  <div className="text-left">
                    <span className="text-xs font-mono tracking-wider text-slate-400 block uppercase">
                      Instant Checkout
                    </span>
                    <span className="text-sm font-bold text-white group-hover:text-acid-lime transition-colors">
                      Pay with Veylo Account
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-acid-lime group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-electric-cobalt" />
                <span>Powered by Open Payments & Interledger</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================
          CHECKOUT MODAL SIMULATION (Frame 35:94)
         ======================================================== */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={handleReset}
        title={step === "success" ? "Subscribed to Reelroom!" : "Checkout with Veylo"}
        subtitle="Open Payments Zero-Card Checkout Protocol"
      >
        {step === "input" && (
          <div className="space-y-6 text-left">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Merchant:</span>
                <span className="font-bold text-slate-900">Reelroom Indie Cinema</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Plan:</span>
                <span>Director&apos;s Pass Monthly</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Price:</span>
                <span className="font-bold text-midnight-950">€14.99 EUR (~₦30,579.60)</span>
              </div>
            </div>

            <Input
              label="Enter Your 10-Digit Veylo Account Number"
              value={veyloAccountInput}
              onChange={(e) => setVeyloAccountInput(e.target.value)}
              placeholder="e.g. 482 193 7604"
              helperText="Pre-filled with your verified test account"
            />

            <Button
              variant="primary"
              size="lg"
              onClick={handlePay}
              isLoading={isProcessing}
              className="w-full justify-center"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Request Payment via Veylo
            </Button>
          </div>
        )}

        {step === "push_sent" && (
          <div className="space-y-6 text-center py-2">
            <div className="w-16 h-16 rounded-full bg-electric-cobalt/10 text-electric-cobalt flex items-center justify-center mx-auto">
              <Smartphone className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-midnight-950">
                Authorisation Push Dispatched
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                A secure biometric confirmation prompt has been delivered to your Veylo app.
              </p>
            </div>

            {/* Interactive Phone Push Notification Simulation Box */}
            <div className="rounded-2xl bg-midnight-950 text-white p-4 border border-midnight-800 text-left space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-[11px] font-mono text-acid-lime">
                <span className="flex items-center gap-1">
                  <VeyloSymbol size={16} variant="dark" />
                  VEYLO SECURITY ALERT
                </span>
                <span>JUST NOW</span>
              </div>
              <p className="text-xs font-medium text-slate-200">
                Reelroom Indie Cinema requests recurring authorization for <strong>€14.99/mo</strong> from connected GTBank ••6789.
              </p>
              <Button
                variant="lime"
                size="sm"
                onClick={handleApprovePush}
                isLoading={isProcessing}
                className="w-full justify-center font-bold text-midnight-950"
              >
                Approve with Biometrics
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-5 text-center py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h4 className="text-xl font-black text-midnight-950 font-sans">
                Payment Authorized!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Open Payments Mandate <strong className="font-mono text-slate-700">#OP-MND-8821</strong> registered.
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              You now have full streaming access. You can manage or revoke this recurring mandate at any time from your Veylo Subscriptions portal.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={handleReset}
                className="flex-1"
              >
                Start Watching
              </Button>
              <Button
                variant="primary"
                size="md"
                href="/app/subscriptions"
                className="flex-1"
              >
                View Mandate in Portal
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
