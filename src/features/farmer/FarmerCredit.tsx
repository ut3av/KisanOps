import React from 'react';
import {
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { AgriCreditGauge } from '../../components/common/AgriCreditGauge';
import { usePageTitle } from '../../hooks/usePageTitle';
import clsx from 'clsx';

export const FarmerCredit: React.FC = () => {
  usePageTitle(
    'Pay After Harvest Credit (AgriCredit)',
    'Book machinery now and pay within 45 days after selling your harvest at the Mandi.'
  );
  const { state } = useKisanOpsStore();
  const { agriCredit } = state;

  const tiers = [
    { range: '750+', limit: '₹10,000', label: 'Tier 1 - Platinum', desc: 'Highest credit limit, zero advance, 45-day pay after harvest cycle' },
    { range: '650 – 749', limit: '₹8,000', label: 'Tier 2 - Gold (Current)', desc: 'Standard credit limit, 45-day post-harvest payment', active: true },
    { range: '550 – 649', limit: '₹3,000', label: 'Tier 3 - Silver', desc: 'Basic credit limit, partial advance' },
    { range: 'Below 550', limit: 'Pay Upfront', label: 'Tier 4 - Standard', desc: 'Pay online before rental' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Pay After Harvest Credit (AgriCredit)
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
              Score: {agriCredit.creditScore} / 900
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Book machinery now and pay within 45 days after selling your harvest at the Mandi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gauge & Limit */}
        <div className="lg:col-span-12">
          <AgriCreditGauge
            score={agriCredit.creditScore}
            limit={agriCredit.creditLimit}
            available={agriCredit.availableCredit}
            ratingCategory={agriCredit.ratingCategory}
          />
        </div>

        {/* 5 Scoring Factors Deep Dive */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              AgriCredit 5-Factor Scoring Model
            </h3>

            <div className="divide-y divide-slate-100">
              {agriCredit.factors.map((factor, idx) => (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">{factor.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-700">{factor.score}/100</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                        {factor.status}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Credit Limit Tiers Table */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Credit Limit Tiers
            </h3>

            <div className="space-y-2.5">
              {tiers.map((tier, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    'p-3.5 rounded-2xl border text-xs transition-all',
                    tier.active
                      ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-surface-50 border-slate-200/70 text-slate-600'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900">{tier.label}</span>
                    <span className="font-mono font-extrabold text-agri-900 text-sm">{tier.limit}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-mono">Score Range: {tier.range}</div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">{tier.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
              <strong>Notice:</strong> AgriCredit is a preliminary operational deferred-rental limit provided by Custom Hiring Centres for registered farmers, not a regulated bank underwriting product.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
