import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Tractor,
  Wine,
  Wheat,
  Factory,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { LandingNavbar } from '../components/LandingNavbar';
import { LandingFooter } from '../components/LandingFooter';
import { CtaBanner } from '../components/CtaBanner';
import { usePageTitle } from '../../../hooks/usePageTitle';

const VERTICALS = [
  {
    id: 'chc',
    icon: Building2,
    title: 'Custom Hiring Centres (CHCs) & Machinery Hubs',
    subtitle: 'Maximize asset yield and eliminate idle time',
    description:
      'Predict regional harvester/tractor deficits with 14-day lead time. Seamlessly relocate equipment between district hubs during harvest surges and capture deferred rental revenue with guaranteed settlements.',
    metrics: ['+28% Fleet Utilization', '-38% Unplanned Downtime', '18% Fuel Costs Saved']
  },
  {
    id: 'enterprise',
    icon: Tractor,
    title: 'Enterprise & Contract Farming Agribusinesses',
    subtitle: 'End-to-end operational visibility across contract acreage',
    description:
      'Monitor thousands of decentralized grower plots in real time. Track input compliance, verify spray dosages via NDVI, and ensure mechanized harvesting arrives at peak crop maturity.',
    metrics: ['200K+ Acres Digitized', 'Zero Harvest Spoilage', '100% Traceability']
  },
  {
    id: 'plantations',
    icon: Wine,
    title: 'High-Value Plantations & Orchards',
    subtitle: 'Specialized canopy monitoring and automated spraying',
    description:
      'Precision canopy moisture and multispectral vegetative indexing for vineyards, tea estates, citrus groves, and orchards with drone sprayer dispatch.',
    metrics: ['+30% Spray Efficiency', 'GDD Micro-climate Sync', 'Export Batch Audit']
  },
  {
    id: 'cooperatives',
    icon: Users,
    title: 'Farmer Producer Organizations (FPOs) & Cooperatives',
    subtitle: 'Democratize modern mechanization for smallholders',
    description:
      'Enable member farmers to book shared high-capacity implements without upfront capital strain using deferred harvest billing and group buying power.',
    metrics: ['10,000+ Smallholders', '₹8,000–₹15,000 Credit Limit', 'Fair APMC Settlements']
  }
];

export const SolutionsPage: React.FC = () => {
  usePageTitle(
    'Tailored AgTech Solutions for CHCs & Enterprises',
    'Purpose-built digital machinery solutions for Custom Hiring Centres, corporate farms, and cooperatives.'
  );
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5FAED] text-[#1c1d1f] flex flex-col font-sans selection:bg-[#7aa32c]/20 selection:text-[#2e4013]">
      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#7aa32c]/30 text-xs font-bold text-[#2e4013] mb-4 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-[#7aa32c]" />
            <span>Tailored AgTech Solutions</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1c1d1f] tracking-tight max-w-4xl mx-auto leading-tight">
            Purpose-Built Solutions for Every Sector of the Agri-Value Chain
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Whether managing a multi-district Custom Hiring Centre hub or executing corporate contract farming across thousands of acres, Yukti is engineered for your workflows.
          </p>
        </div>

        {/* Verticals Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {VERTICALS.map((v, i) => (
            <div
              key={v.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-md p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:border-[#7aa32c] hover:shadow-xl transition-all"
            >
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F5FAED] text-[#7aa32c] flex items-center justify-center font-bold">
                    <v.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                      {v.title}
                    </h2>
                    <p className="text-xs font-bold text-[#7aa32c]">{v.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {v.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {v.metrics.map((m, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-bold px-3 py-1 rounded-full bg-[#F5FAED] text-[#2e4013] border border-[#7aa32c]/20"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-center space-y-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#7aa32c] hover:bg-[#6b9125] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Launch {v.title.split(' ')[0]} Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="pt-16">
          <CtaBanner onOpenBookDemo={() => navigate('/login')} />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default SolutionsPage;
