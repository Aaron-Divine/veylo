"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VeyloLogo } from "@/components/brand/VeyloLogo";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ShieldCheck, ArrowRight, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("482 193 7604");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/app");
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
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Sign in with your 10-digit Veylo Account Number or verified handle
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Account Number or @handle"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="482 193 7604"
              leftAddon={<UserCheck className="w-4 h-4 text-slate-400" />}
              helperText="Demo pre-filled with Tomi Adebayo"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full justify-center"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In with Passkey / Face ID
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don&apos;t have a Veylo account yet?{" "}
            <Link href="/auth/register" className="text-electric-cobalt font-bold hover:underline">
              Claim Account Number
            </Link>
          </div>
        </Card>
      </main>

      <footer className="max-w-md mx-auto w-full text-center text-xs text-slate-400">
        © 2026 Veylo Inc. Connected to Open Payments Network.
      </footer>
    </div>
  );
}
