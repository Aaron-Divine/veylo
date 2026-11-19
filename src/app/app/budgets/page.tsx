"use client";

import React, { useState } from "react";
import { AppLayoutClient } from "@/components/layout/AppLayoutClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_BUDGET } from "@/data/mockData";
import {
  PieChart,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Sliders,
  CheckCircle2,
  Calendar,
  Send,
  Laptop,
  Repeat,
  Utensils,
  Zap,
} from "lucide-react";

export default function BudgetsPage() {
  const [ceiling, setCeiling] = useState(MOCK_BUDGET.monthlyCeilingNgn);
  const spent = MOCK_BUDGET.totalSpentNgn;
  const remaining = Math.max(0, ceiling - spent);
  const percentUsed = Math.min(100, Math.round((spent / ceiling) * 100));

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Send":
        return <Send className="w-4 h-4 text-electric-cobalt" />;
      case "Laptop":
        return <Laptop className="w-4 h-4 text-midnight-950" />;
      case "Repeat":
        return <Repeat className="w-4 h-4 text-acid-lime" />;
      case "Utensils":
        return <Utensils className="w-4 h-4 text-amber-500" />;
      case "Zap":
        return <Zap className="w-4 h-4 text-emerald-500" />;
      default:
        return <PieChart className="w-4 h-4" />;
    }
  };

  return (
    <AppLayoutClient
      title="Budgets & Spending Limits"
      subtitle="Hard Protocol-Level Caps • Category Pacing & Burn-Rate Velocity"
    >
      <div className="space-y-8">
        {/* Top Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="white" className="space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase">Monthly Ceiling</span>
            <p className="text-3xl font-black font-mono text-midnight-950">
              ₦{ceiling.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Resets in 11 days (1st of Month)</span>
            </div>
          </Card>

          <Card variant="white" className="space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase">Total Spent to Date</span>
            <p className="text-3xl font-black font-mono text-electric-cobalt">
              ₦{spent.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="font-bold text-slate-900">{percentUsed}%</span> of monthly ceiling allocated
            </div>
          </Card>

          <Card variant="white" className="space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase">Remaining Buffer</span>
            <p className="text-3xl font-black font-mono text-emerald-600">
              ₦{remaining.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pacing ₦19,122/day (On Track)</span>
            </div>
          </Card>
        </div>

        {/* Dynamic Ceiling Adjuster */}
        <Card variant="white" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-midnight-950 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-electric-cobalt" />
                <span>Adjust Monthly Protection Ceiling</span>
              </h3>
              <p className="text-xs text-slate-500">
                Transactions that exceed this aggregate ceiling will require mandatory 2FA step-up confirmation.
              </p>
            </div>
            <span className="font-mono font-bold text-lg text-electric-cobalt">
              ₦{ceiling.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="200000"
              max="2000000"
              step="50000"
              value={ceiling}
              onChange={(e) => setCeiling(Number(e.target.value))}
              className="w-full accent-electric-cobalt h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Min: ₦200,000</span>
              <span>Default: ₦650,000</span>
              <span>Max: ₦2,000,000</span>
            </div>
          </div>
        </Card>

        {/* Category Pacing Meters */}
        <Card variant="white" className="space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-midnight-950">
                Category Spending Meters
              </h3>
              <p className="text-xs text-slate-500">
                Live pacing per expense classification across connected accounts and Open Payments mandates
              </p>
            </div>
            <Badge variant="lime" size="sm">
              5 Categories Monitored
            </Badge>
          </div>

          <div className="space-y-6">
            {MOCK_BUDGET.categories.map((cat) => {
              const catPercent = Math.min(100, Math.round((cat.spentNgn / cat.allocatedNgn) * 100));
              const isHigh = catPercent > 75;

              return (
                <div key={cat.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-100">
                        {getCategoryIcon(cat.iconName)}
                      </div>
                      <span className="font-bold text-midnight-950 font-sans">{cat.name}</span>
                    </div>

                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-500">
                        ₦{cat.spentNgn.toLocaleString()} / ₦{cat.allocatedNgn.toLocaleString()}
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          isHigh ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {catPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${catPercent}%`,
                        backgroundColor: isHigh ? "#3D5BFF" : cat.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Burn-rate Velocity Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="midnight" className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-acid-lime font-bold">
                Burn-Rate Velocity Projection
              </span>
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold font-mono text-white">
                Projected: ₦592,797.50
              </p>
              <p className="text-xs text-slate-300">
                At your current rate of ₦19,122.50/day, you will finish the month <strong>₦57,202.50 under budget</strong>.
              </p>
            </div>
            <div className="pt-2 border-t border-midnight-800 text-[11px] font-mono text-slate-400">
              Confidence interval: 94.2% based on previous 3 billing cycles.
            </div>
          </Card>

          <Card variant="white" className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                Protocol Hard Stops
              </span>
              <AlertCircle className="w-4 h-4 text-electric-cobalt" />
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <p>
                When a budget category reaches 100%, Veylo automatically enforces an interactive step-up verification before executing the payment.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1">
                <div className="text-slate-700 font-bold">Enforced Rule:</div>
                <div className="text-slate-500">Require Biometric Step-Up when Cart &gt; ₦50,000</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayoutClient>
  );
}
