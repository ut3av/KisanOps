import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { LandingNavbar } from '../components/LandingNavbar';
import { LandingFooter } from '../components/LandingFooter';
import { RoiCalculatorSection } from '../components/RoiCalculatorSection';
import { CtaBanner } from '../components/CtaBanner';
import { usePageTitle } from '../../../hooks/usePageTitle';

export const PricingRoiPage: React.FC = () => {
  usePageTitle(
    'ROI Modeling & Transparent Pricing',
    'Calculate your Custom Hiring Centre fleet ROI, fuel savings, and subscription plans.'
  );
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5FAED] text-[#1c1d1f] flex flex-col font-sans selection:bg-[#7aa32c]/20 selection:text-[#2e4013]">
      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#7aa32c]/30 text-xs font-bold text-[#2e4013] mb-4 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-[#7aa32c]" />
            <span>ROI Modeling & Transparent Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1c1d1f] tracking-tight max-w-4xl mx-auto leading-tight">
            Calculate Your AgTech ROI & Fleet Efficiency
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            See how predictive demand allocation, fuel anomaly detection, and deferred AgriCredit convert into tangible bottom-line savings and higher machine utilization.
          </p>
        </div>

        {/* The Interactive Calculator Section */}
        <RoiCalculatorSection onOpenBookDemo={() => navigate('/login')} />

        {/* Pricing Tiers Overview */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Simple, Transparent Tiered Pricing
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Pay as you grow with modular subscriptions for individual CHCs and enterprise contract farming operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tier 1: Smallholder & FPO */}
            <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-md flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#7aa32c]">
                  Starter Hub
                </div>
                <div className="text-3xl font-black text-stone-900">
                  ₹4,999 <span className="text-xs font-normal text-stone-500">/ mo</span>
                </div>
                <p className="text-xs text-stone-600">
                  Ideal for small CHC centres with up to 5 machines and 500 managed acres.
                </p>
                <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7aa32c]" />
                    <span>Up to 5 GPS / CAN-Bus Telematics units</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7aa32c]" />
                    <span>Farmer Mobile Rental App access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7aa32c]" />
                    <span>Basic Satellite NDVI updates</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Sign In to Start
              </button>
            </div>

            {/* Tier 2: CHC Regional Hub (Popular) */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-white to-[#F5FAED] border-2 border-[#7aa32c] shadow-xl flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#7aa32c] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#7aa32c]">
                  Regional CHC Hub
                </div>
                <div className="text-3xl font-black text-stone-900">
                  ₹12,499 <span className="text-xs font-normal text-stone-500">/ mo</span>
                </div>
                <p className="text-xs text-stone-600">
                  For mid-size Custom Hiring Centres with 6–25 machinery units.
                </p>
                <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7aa32c]" />
                    <span>Predictive Demand Surge Forecasting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7aa32c]" />
                    <span>Deterministic Inter-Hub Relocation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7aa32c]" />
                    <span>Deferred AgriCredit scoring integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7aa32c]" />
                    <span>Fuel Anomaly & GPS Geofence Alerts</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3.5 rounded-xl bg-[#7aa32c] hover:bg-[#6b9125] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Launch Regional Hub
              </button>
            </div>

            {/* Tier 3: Enterprise Agribusiness */}
            <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-md flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Enterprise Farm & ERP
                </div>
                <div className="text-3xl font-black text-stone-900">Custom</div>
                <p className="text-xs text-stone-600">
                  For corporate agribusinesses, contract farming ops, and multi-state networks.
                </p>
                <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7aa32c]" />
                    <span>Unlimited machinery telematics & plots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7aa32c]" />
                    <span>Dedicated RLS database tenant</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7aa32c]" />
                    <span>Full ERP GST tax invoicing & payroll</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7aa32c]" />
                    <span>Custom API & SAP / ERP integration</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Sign In for Enterprise Access
              </button>
            </div>
          </div>
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

export default PricingRoiPage;
