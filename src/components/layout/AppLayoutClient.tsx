"use client";

import React, { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { MOCK_USER } from "@/data/mockData";
import { Copy, Check, QrCode, ShieldCheck } from "lucide-react";
import { VeyloSymbol } from "@/components/brand/VeyloLogo";

interface AppLayoutClientProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AppLayoutClient: React.FC<AppLayoutClientProps> = ({
  children,
  title = "Overview",
  subtitle = "Veylo Account & Interoperable Rails",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_USER.veyloAccountNumber.replace(/\s+/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <AppSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenQrModal={() => setQrModalOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Shared Account QR Modal */}
      <Modal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="Your Veylo Payment QR"
        subtitle="Any Open Payments or Veylo user can scan to resolve your identity instantly"
      >
        <div className="flex flex-col items-center text-center p-4 space-y-5">
          {/* QR Code Container with Centered Veylo Symbol */}
          <div className="relative p-6 bg-white rounded-3xl border-2 border-slate-900/10 shadow-lg">
            {/* SVG Simulated QR code with perfect grid and finder patterns */}
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="mx-auto">
              {/* Outer border & modules */}
              <rect width="200" height="200" fill="white" />
              {/* Top-Left Finder */}
              <rect x="10" y="10" width="50" height="50" rx="6" fill="#111B32" />
              <rect x="18" y="18" width="34" height="34" rx="4" fill="white" />
              <rect x="25" y="25" width="20" height="20" rx="2" fill="#3D5BFF" />
              {/* Top-Right Finder */}
              <rect x="140" y="10" width="50" height="50" rx="6" fill="#111B32" />
              <rect x="148" y="18" width="34" height="34" rx="4" fill="white" />
              <rect x="155" y="25" width="20" height="20" rx="2" fill="#3D5BFF" />
              {/* Bottom-Left Finder */}
              <rect x="10" y="140" width="50" height="50" rx="6" fill="#111B32" />
              <rect x="18" y="148" width="34" height="34" rx="4" fill="white" />
              <rect x="25" y="155" width="20" height="20" rx="2" fill="#3D5BFF" />

              {/* Data modules */}
              <g fill="#111B32">
                <rect x="70" y="15" width="8" height="8" rx="1" />
                <rect x="85" y="15" width="12" height="8" rx="1" />
                <rect x="110" y="15" width="15" height="8" rx="1" />
                <rect x="70" y="35" width="18" height="8" rx="1" />
                <rect x="98" y="35" width="8" height="8" rx="1" />
                <rect x="115" y="35" width="12" height="8" rx="1" />

                <rect x="15" y="70" width="8" height="15" rx="1" />
                <rect x="35" y="70" width="12" height="8" rx="1" />
                <rect x="55" y="70" width="8" height="12" rx="1" />

                <rect x="140" y="70" width="15" height="8" rx="1" />
                <rect x="165" y="70" width="8" height="12" rx="1" />
                <rect x="140" y="90" width="8" height="18" rx="1" />
                <rect x="160" y="90" width="18" height="8" rx="1" />

                <rect x="70" y="140" width="12" height="18" rx="1" />
                <rect x="90" y="140" width="8" height="12" rx="1" />
                <rect x="110" y="140" width="18" height="8" rx="1" />
                <rect x="80" y="165" width="18" height="12" rx="1" />
                <rect x="110" y="160" width="8" height="18" rx="1" />
                <rect x="130" y="140" width="12" height="8" rx="1" />
                <rect x="150" y="140" width="25" height="12" rx="1" />
                <rect x="140" y="165" width="18" height="8" rx="1" />
                <rect x="170" y="165" width="15" height="15" rx="1" />
              </g>

              {/* Center Logo Cutout */}
              <rect x="75" y="75" width="50" height="50" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="2" />
            </svg>

            {/* Centered Vector Veylo Brand Symbol */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <VeyloSymbol size={34} variant="light" />
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-mono">
              <span>VEYLO ACCOUNT NUMBER</span>
              <ShieldCheck className="w-3.5 h-3.5 text-electric-cobalt" />
            </div>
            <p className="text-2xl font-black font-mono tracking-wider text-midnight-950">
              {MOCK_USER.veyloAccountNumber}
            </p>
            <p className="text-sm font-semibold text-slate-700">
              {MOCK_USER.name} <span className="text-slate-400 font-normal">({MOCK_USER.handle})</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="outline"
              size="md"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              className="flex-1"
            >
              {copied ? "Copied to Clipboard" : "Copy Account Number"}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setQrModalOpen(false)}
              className="flex-1"
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
