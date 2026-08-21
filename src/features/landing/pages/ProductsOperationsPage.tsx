import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Building,
  Leaf,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Receipt,
  FileCheck2
} from 'lucide-react';
import { LandingNavbar } from '../components/LandingNavbar';
import { LandingFooter } from '../components/LandingFooter';
import { CtaBanner } from '../components/CtaBanner';

export const ProductsOperationsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5FAED] text-[#1c1d1f] flex flex-col font-sans selection:bg-[#7aa32c]/20 selection:text-[#2e4013]">
      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#7aa32c]/30 text-xs font-bold text-[#2e4013] mb-4 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-[#7aa32c]" />
            <span>Operations & Finance Suite</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1c1d1f] tracking-tight max-w-4xl mx-auto leading-tight">
            Deferred AgriCredit, Enterprise Farm ERP & Sustainability ESG
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Empower smallholders with post-harvest credit lines while giving CHCs and corporate farms centralized ERP invoicing, fuel audits, and carbon tracking.
          </p>
          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-3.5 rounded-full bg-[#7aa32c] hover:bg-[#6b9125] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Explore Financial Solutions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/farmer/credit')}
              className="px-7 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-sm transition-all cursor-pointer"
            >
              Check AgriCredit Limit
            </button>
          </div>
        </div>

        {/* 3 Core Modules */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Module 1: Financials & Deferred AgriCredit */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F5FAED] text-[#7aa32c] flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Financials & Deferred AgriCredit (0–900 Score)
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Empower smallholders with pre-approved deferred rental credit (₹8,000–₹15,000) calculated from verified satellite NDVI crop track records and land size.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>45-day deferred post-harvest payment settlement after APMC Mandi sale</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Automated escrow holds, milestone dispatches & zero cash leakages</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Non-regulated agricultural credit scoring based on verified crop yield</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-stone-200 shadow-md aspect-[4/3]">
              <img
                src="/images/hero-agronomist.jpg"
                alt="Deferred AgriCredit Scoring"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Module 2: Farm & CHC ERP */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 rounded-2xl overflow-hidden border border-stone-200 shadow-md aspect-[4/3]">
              <img
                src="/images/remote-sensing.jpg"
                alt="Farm & CHC ERP Suite"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F5FAED] text-[#7aa32c] flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Enterprise Farm & CHC Operations ERP
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Comprehensive machinery lifecycle management, operator payroll, automated GST tax invoices, and predictive maintenance schedules.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Instant PDF Tax Invoicing with telematics verified runtime logs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Predictive oil filter, hydraulic, and clutch replacement triggers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>District-level revenue breakdown, seasonal demand curves & gross margins</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Module 3: Sustainability & ESG */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F5FAED] text-[#7aa32c] flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Sustainability & Carbon Footprint ESG
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Track diesel emissions reductions through optimized inter-hub routing, residue management tracking, and sustainable crop rotation records.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Verified 18% fuel burn reduction through CAN-Bus anomaly alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Paddy straw stubble management (Happy Seeder & Super SMS tracking)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Auditable carbon offset data generation for corporate sustainability ESG</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-stone-200 shadow-md aspect-[4/3]">
              <img
                src="/images/hero-tractor.jpg"
                alt="Sustainability ESG"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
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

export default ProductsOperationsPage;
