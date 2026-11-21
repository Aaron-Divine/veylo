import React from "react";
import Link from "next/link";
import { VeyloLogo } from "@/components/brand/VeyloLogo";

export const MarketingFooter: React.FC = () => {
  return (
    <footer className="bg-[#111B32] text-[#CBD5E1] border-t border-midnight-900">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Manifesto Column (Figma 51:211) */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[6px] bg-[#D8F15B] flex items-center justify-center font-extrabold text-[18px] text-[#111B32] font-sans">
                V
              </div>
              <span className="font-extrabold text-[20px] tracking-wider text-white font-sans">
                VEYLO
              </span>
            </div>
            <p className="text-[13px] text-[#CBD5E1] max-w-sm leading-relaxed">
              Move money. Keep control. The interoperable payment identity network.
            </p>

            {/* App Store & Google Play Badges (Figma 51:217) */}
            <div className="flex items-center gap-3 pt-2">
              <div className="bg-[#0A0F1E] border border-[#334155] rounded-[8px] px-3 py-2 text-[11px] font-bold text-white font-sans cursor-pointer hover:border-slate-400 transition-colors">
                 App Store
              </div>
              <div className="bg-[#0A0F1E] border border-[#334155] rounded-[8px] px-3 py-2 text-[11px] font-bold text-white font-sans cursor-pointer hover:border-slate-400 transition-colors">
                ▶ Google Play
              </div>
            </div>
          </div>

          {/* Product Column (Figma 51:223) */}
          <div className="space-y-3 text-left">
            <h4 className="text-[11px] font-bold text-[#D8F15B] uppercase tracking-wider font-mono">
              PRODUCT
            </h4>
            <ul className="space-y-2.5 text-[12px] text-[#CBD5E1]">
              <li>
                <Link href="/app" className="hover:text-white transition-colors">
                  Veylo Wallet Pass
                </Link>
              </li>
              <li>
                <Link href="/app/account" className="hover:text-white transition-colors">
                  Account &amp; PIN
                </Link>
              </li>
              <li>
                <Link href="/app/subscriptions" className="hover:text-white transition-colors">
                  Subscriptions &amp; Mandates
                </Link>
              </li>
              <li>
                <Link href="/app/activity" className="hover:text-white transition-colors">
                  Activity Ledger
                </Link>
              </li>
            </ul>
          </div>

          {/* Infrastructure Column (Figma 51:230) */}
          <div className="space-y-3 text-left">
            <h4 className="text-[11px] font-bold text-[#D8F15B] uppercase tracking-wider font-mono">
              INFRASTRUCTURE
            </h4>
            <ul className="space-y-2.5 text-[12px] text-[#CBD5E1]">
              <li>
                <a href="https://interledger.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Interledger Protocol (ILP) ↗
                </a>
              </li>
              <li>
                <a href="https://openpayments.dev" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Open Payments Standard ↗
                </a>
              </li>
              <li>
                <a href="https://github.com/interledger/rafiki" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Rafiki FX Rates Engine ↗
                </a>
              </li>
              <li>
                <a href="https://wallet.interledger-test.dev" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Testnet Dev Wallet ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Developers Column (Figma 51:237) */}
          <div className="space-y-3 text-left">
            <h4 className="text-[11px] font-bold text-[#D8F15B] uppercase tracking-wider font-mono">
              DEVELOPERS &amp; API
            </h4>
            <ul className="space-y-2.5 text-[12px] text-[#CBD5E1]">
              <li>
                <span className="font-mono text-[11px] text-[#D8F15B]">
                  POST /api/charge
                </span>
              </li>
              <li>
                <span className="font-mono text-[11px] text-slate-300">
                  GET /api/quotes
                </span>
              </li>
              <li>
                <span className="font-mono text-[11px] text-slate-300">
                  POST /api/subscriptions
                </span>
              </li>
              <li>
                <a href="https://github.com/Aaron-Divine/veylo" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  GitHub Repository ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Institutional Disclaimer */}
        <div className="mt-12 pt-8 border-t border-midnight-900/80 text-[11px] leading-relaxed text-[#94A3B8] space-y-2 text-left">
          <p>
            <strong className="text-white">Institutional Disclaimer:</strong> Veylo is an independent financial technology company operating on Interledger Protocol (ILP) and Open Payments open specifications. Veylo is not a deposit-taking bank and does not hold customer fiat funds in proprietary custodial pools. Account funding and clearing are performed through participating licensed financial institutions, connected banking endpoints, and interoperable payout partners.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 text-[#94A3B8]">
            <p>© 2026 Veylo Inc. All rights reserved.</p>
            <p className="font-mono text-[10px]">Connected to Open Payments Network • Direct ILP v4 Engine</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
