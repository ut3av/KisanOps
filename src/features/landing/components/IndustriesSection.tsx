import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tractor,
  Building2,
  TreePine,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users
} from 'lucide-react';

interface IndustryCard {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  metric: string;
  metricLabel: string;
  targetPath: string;
  actionText: string;
  icon: React.ReactNode;
  benefits: string[];
}

const INDUSTRIES: IndustryCard[] = [
  {
    id: 'chc',
    title: 'Custom Hiring Centres (CHCs)',
    category: 'Machinery Hubs',
    shortDesc:
      'Empower machinery hubs with predictive regional demand forecasting, GPS CAN-Bus telematics, dynamic pricing, and deferred harvest billing.',
    metric: '+21% Fleet Gain',
    metricLabel: 'Average Fleet ROI Uplift',
    targetPath: '/chc',
    actionText: 'Sign In for CHC Operations',
    icon: <Building2 className="w-5 h-5" />,
    benefits: [
      '14-Day regional equipment shortage alerts',
      'Deterministic inter-hub fleet relocation',
      'Automated telemetry runtime billing'
    ]
  },
  {
    id: 'farmers',
    title: 'Smallholders & Progressive Farmers',
    category: 'Field Operations',
    shortDesc:
      'Match farm acreage with certified equipment in under 60 seconds, check real Doppler weather windows, and book deferred rentals settled at APMC harvest.',
    metric: '94% Match Fit',
    metricLabel: 'Explainable Machine Fit',
    targetPath: '/farmer',
    actionText: 'Sign In for Farmer Portal',
    icon: <Tractor className="w-5 h-5" />,
    benefits: [
      '7-Factor explainable machine recommendations',
      'AgriCredit non-collateral deferred limits',
      'Automated GST verified digital invoices'
    ]
  },
  {
    id: 'enterprise-farms',
    title: 'Enterprise & Commercial Farms',
    category: 'Commercial Ag',
    shortDesc:
      'Transform large-scale farming with end-to-end digital operations covering soil GIS, crop growth models, fleet scheduling, and centralized P&L reporting.',
    metric: '24% Cost Cut',
    metricLabel: 'Input & Idle Fuel Savings',
    targetPath: '/admin',
    actionText: 'Sign In for Enterprise OS',
    icon: <TreePine className="w-5 h-5" />,
    benefits: [
      'Multi-thousand-acre plot digitization',
      'Fleet fuel anomaly (+17%) alerts',
      'Centralized operator dispatch ledger'
    ]
  },
  {
    id: 'cooperatives',
    title: 'FPOs & Agri Cooperatives',
    category: 'Farmer Collectives',
    shortDesc:
      'Empower farmer producer organizations with transparent implement pooling, seasonal tariff stabilization, and auditable harvest delivery logistics.',
    metric: '8,400+ Farmers',
    metricLabel: 'Collective Network Impact',
    targetPath: '/farmer/marketplace',
    actionText: 'Sign In for Cooperative Hub',
    icon: <Users className="w-5 h-5" />,
    benefits: [
      'Community machinery sharing pooling',
      'Deferred harvest credit scoring (0-900)',
      'Multi-village demand aggregation'
    ]
  }
];

export const IndustriesSection: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(`/login?redirect=${encodeURIComponent(path)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="industries" className="py-20 bg-[#F5FAED] border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-[#2e4013] mb-3 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-[#7aa32c]" />
            <span>Vertical AgTech Alignment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1d1f] tracking-tight">
            Industries We Serve
          </h2>
          <p className="mt-4 text-sm sm:text-base lg:text-lg text-stone-600 leading-relaxed">
            Our modular platform adapts to diverse agricultural operating environments, delivering purpose-built solutions for complex fleet, crop, and supply chain challenges.
          </p>
        </div>

        {/* Industry Grid: 4 High-Impact Focused Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDUSTRIES.map((industry) => {
            return (
              <div
                key={industry.id}
                onClick={() => handleCardClick(industry.targetPath)}
                className="rounded-3xl border border-stone-200/80 bg-white hover:border-[#7aa32c] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer p-6 flex flex-col justify-between group card-interactive-spotlight"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-2xl bg-[#F5FAED] text-[#2e4013] border border-[#7aa32c]/20 group-hover:bg-[#1b4d3e] group-hover:text-white group-hover:border-[#1b4d3e] transition-all duration-300 shadow-xs">
                        {industry.icon}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 font-typewriter">
                        {industry.category}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-[#7aa32c]/15 text-[#2e4013] font-typewriter">
                      {industry.metric}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5 group-hover:text-[#1b4d3e] transition-colors">
                      {industry.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {industry.shortDesc}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="pt-2 border-t border-stone-100 space-y-1.5">
                    {industry.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-stone-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c] shrink-0" />
                        <span className="leading-snug">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Action Button */}
                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 font-semibold">{industry.metricLabel}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(industry.targetPath);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#7aa32c] group-hover:text-[#1b4d3e] group-hover:translate-x-0.5 transition-all cursor-pointer"
                  >
                    <span>{industry.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
