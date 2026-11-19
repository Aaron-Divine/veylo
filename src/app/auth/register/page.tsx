"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VeyloLogo } from "@/components/brand/VeyloLogo";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowRight, UserCheck, Phone, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("Tomi Adebayo");
  const [phone, setPhone] = useState("+234 803 123 4567");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/app/onboarding");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8 font-sans">
      <header className="max-w-md mx-auto w-full flex items-center justify-between pb-6">
        <VeyloLogo variant="light" size="sm" href="/" />
      </header>

      <main className="max-w-md mx-auto w-full my-auto">
        <Card variant="white" className="p-8 sm:p-10 shadow-xl space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-black font-sans text-midnight-950">
              Open your Veylo Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Get an instant 10-digit interoperable payment number for all your banks and digital wallets.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Legal Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Tomi Adebayo"
              leftAddon={<UserCheck className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234..."
              leftAddon={<Phone className="w-4 h-4 text-slate-400" />}
              helperText="Used to generate your 10-digit Veylo Account Number"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full justify-center"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Reserve Account Number
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-electric-cobalt font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </main>

      <footer className="max-w-md mx-auto w-full text-center text-xs text-slate-400">
        © 2026 Veylo Inc. Connected to Open Payments.
      </footer>
    </div>
  );
}
