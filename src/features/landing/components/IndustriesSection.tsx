import React, { useState } from 'react';
import {
  Tractor,
  Building2,
  TreePine,
  Boxes,
  Utensils,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface IndustryCard {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  metric: string;
  metricLabel: string;
  image: string;
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
    metric: '+21% Utilization',
    metricLabel: 'Average Fleet ROI Gain',
    image: '/images/hero-tractor.jpg',
    icon: <Building2 className="w-5 h-5 text-[#7aa32c]" />,
    benefits: [
      'Regional equipment shortage alerts',
      'Deterministic inter-hub relocation',
      'Automated telemetry-based billing'
    ]
  },
  {
    id: 'enterprise-farms',
    title: 'Enterprise & Corporate Farms',
    category: 'Commercial Agriculture',
    shortDesc:
      'Transform large-scale farming with end-to-end digital operations covering soil GIS, crop growth models, fleet scheduling, and centralized P&L reporting.',
    metric: '24% Lower Cost',
    metricLabel: 'Input & Fuel Savings',
    image: '/images/hero-agronomist.jpg',
    icon: <Tractor className="w-5 h-5 text-[#7aa32c]" />,
    benefits: [
      'Multi-thousand-acre plot digitization',
      'Input inventory & chemical safety audits',
      'Automated machinery dispatch'
    ]
  },
  {
    id: 'plantations',
    title: 'Plantations & Vineyards',
    category: 'Specialty Crops',
    shortDesc:
      'Elevate plantation and vineyard productivity with specialized multi-tier canopy monitoring, precision irrigation schedules, and harvest labor tracking.',
    metric: '94% Quality Match',
    metricLabel: 'Yield Grade Consistency',
    image: '/images/remote-sensing.jpg',
    icon: <TreePine className="w-5 h-5 text-[#7aa32c]" />,
    benefits: [
      'Micro-climate frost & pest alerts',
      'Batch-level brix & maturity scoring',
      'Specialized implement pooling'
    ]
  },
  {
    id: 'food-beverage',
    title: 'Food & Beverage Processors',
    category: 'Agri-Food Supply Chain',
    shortDesc:
      'Secure contract farming supply chains with raw material traceability, verified farmer practices, pesticide residue compliance, and harvest delivery predictability.',
    metric: '100% Traceability',
    metricLabel: 'Farm-to-Fork Audit Ready',
    image: '/images/remote-sensing.jpg',
    icon: <Utensils className="w-5 h-5 text-[#7aa32c]" />,
    benefits: [
      'Contract farming execution visibility',
      'GlobalGAP & organic certification logs',
      'Automated quality grading ledger'
    ]
  },
  {
    id: 'agri-input',
    title: 'Agri-Input Manufacturers',
    category: 'Inputs & Seeds',
    shortDesc:
      'Digitally transform demand generation, run field demonstration trial validation with satellite NDVI, and empower distributor networks.',
    metric: '3.4x Faster',
    metricLabel: 'Trial Efficacy Proof',
    image: '/images/hero-agronomist.jpg',
    icon: <Boxes className="w-5 h-5 text-[#7aa32c]" />,
    benefits: [
      'Geo-targeted product recommendations',
      'Field trial vegetative response analytics',
      'Dealer stocking optimization'
    ]
  },
  {
    id: 'foundations-ngos',
    title: 'Foundations & Agri Cooperatives',
    category: 'Impact & Climate',
    shortDesc:
      'Empower smallholder initiatives focused on climate resilience, regenerative farming, affordable machinery access, and transparent impact verification.',
    metric: '8,400+ Farmers',
    metricLabel: 'Smallholders Onboarded',
    image: '/images/hero-tractor.jpg',
    icon: <HeartHandshake className="w-5 h-5 text-[#7aa32c]" />,
    benefits: [
      'Deferred AgriCredit micro-limits',
      'Soil carbon sequestration accounting',
      'Public-private partnership reporting'
    ]
  }
];

export const IndustriesSection: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('chc');
  const activeItem = INDUSTRIES.find((i) => i.id === selectedIndustry) || INDUSTRIES[0];

  return (
    <section id="industries" className="py-20 bg-[#F5FAED] border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-[#2e4013] mb-3 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-[#7aa32c]" />
            <span>Vertical AgTech Customization</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1d1f] tracking-tight">
            Industries We Serve
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
            Our modular platform adapts to diverse agricultural operating environments, delivering purpose-built solutions for complex fleet, crop, and supply chain challenges.
          </p>
        </div>

        {/* Industry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUSTRIES.map((industry) => {
            const isSelected = industry.id === selectedIndustry;
            return (
              <div
                key={industry.id}
                onClick={() => setSelectedIndustry(industry.id)}
                className={`rounded-3xl border transition-all duration-300 cursor-pointer p-6 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#7aa32c] shadow-xl scale-[1.02]'
                    : 'bg-white/80 border-stone-200/80 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-2xl bg-[#F5FAED] text-[#7aa32c]">
                        {industry.icon}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                        {industry.category}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#7aa32c]/15 text-[#2e4013]">
                      {industry.metric}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 mb-2">{industry.title}</h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {industry.shortDesc}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="pt-2 border-t border-stone-100 space-y-1.5">
                    {industry.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-stone-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c] shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#7aa32c]">
                  <span>{industry.metricLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
