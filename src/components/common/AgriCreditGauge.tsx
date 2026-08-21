import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import clsx from 'clsx';

interface AgriCreditGaugeProps {
  score: number; // 300 to 900
  limit: number;
  available: number;
  ratingCategory: string;
  showDetails?: boolean;
}

export const AgriCreditGauge: React.FC<AgriCreditGaugeProps> = ({
  score,
  limit,
  available,
  ratingCategory,
  showDetails = true,
}) => {
  // Score percentage from 300 to 900
  const normalizedPercentage = Math.min(100, Math.max(0, ((score - 300) / 600) * 100));

  let strokeColor = '#10B981'; // Green
  if (score < 550) strokeColor = '#EF4444'; // Red
  else if (score < 650) strokeColor = '#F59E0B'; // Amber
  else if (score < 750) strokeColor = '#3B82F6'; // Blue

  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (normalizedPercentage / 100) * (circumference * 0.75);

  return (
    <div className="bg-gradient-to-br from-agri-900 to-agri-950 text-white rounded-2xl p-6 shadow-elevated relative overflow-hidden">
      {/* Background watermark */}
      <div className="absolute -right-8 -bottom-8 opacity-10 text-white pointer-events-none">
        <ShieldCheck className="w-48 h-48" />
      </div>

      <div className="flex items-center justify-between relative z-10 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">AgriCredit Score</h4>
            <p className="text-[11px] text-emerald-300/80">Preliminary Deferred Rental Eligibility</p>
          </div>
        </div>
        <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-medium">
          {ratingCategory}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
        {/* Semi-circular Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-135" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="9"
                strokeDasharray={circumference * 0.75}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="transparent"
                stroke={strokeColor}
                strokeWidth="9"
                strokeDasharray={circumference * 0.75}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
              <span className="text-3xl font-extrabold tracking-tight text-white">{score}</span>
              <span className="text-[10px] text-slate-400 font-mono">/ 900 PTS</span>
            </div>
          </div>
          <p className="text-xs text-emerald-200 mt-1 font-medium text-center">High Repayment Trust</p>
        </div>

        {/* Limit Info */}
        <div className="md:col-span-7 space-y-3">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
              <span>Deferred Limit:</span>
              <span className="text-white font-semibold">₹{limit.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-300 mb-1.5">
              <span>Available Deferred Balance:</span>
              <span className="text-emerald-400 font-bold text-sm">₹{available.toLocaleString('en-IN')}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(available / limit) * 100}%` }}
              />
            </div>
          </div>

          {showDetails && (
            <div className="flex items-start gap-1.5 text-[11px] text-slate-300/90 leading-tight">
              <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Eligible for <strong>zero upfront payment</strong>. Pay post-harvest within 45 days of rental completion.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
