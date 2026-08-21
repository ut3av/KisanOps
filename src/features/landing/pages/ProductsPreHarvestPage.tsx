import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tractor,
  Satellite,
  Cpu,
  Layers,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Activity,
  MapPin,
  Calendar
} from 'lucide-react';
import { LandingNavbar } from '../components/LandingNavbar';
import { LandingFooter } from '../components/LandingFooter';
import { CtaBanner } from '../components/CtaBanner';

export const ProductsPreHarvestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5FAED] text-[#1c1d1f] flex flex-col font-sans selection:bg-[#7aa32c]/20 selection:text-[#2e4013]">
      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#7aa32c]/30 text-xs font-bold text-[#2e4013] mb-4 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-[#7aa32c]" />
            <span>Pre-Harvest Solution Suite</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1c1d1f] tracking-tight max-w-4xl mx-auto leading-tight">
            Digitize Sowing, Satellite Crop GIS & On-Ground Farm Operations
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            From plot-level soil profiling to multispectral Sentinel NDVI satellite surveillance and automated task dispatches, Yukti delivers total pre-harvest execution visibility.
          </p>
          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-3.5 rounded-full bg-[#7aa32c] hover:bg-[#6b9125] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Get Started with Yukti</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="px-7 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-sm transition-all cursor-pointer"
            >
              Calculate Farm ROI
            </button>
          </div>
        </div>

        {/* 3 Core Modules Deep-Dive */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Module 1: Farm Management Software */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F5FAED] text-[#7aa32c] flex items-center justify-center">
                <Tractor className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Farm Management & Activity Central
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Structured crop calendar templates, input dosage calculation, plot boundary geo-fencing, and task delegation for field agronomists and operators.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Interactive seasonal timeline (Sowing ➔ Tillage ➔ Spraying ➔ Harvest)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Real-time operator attendance & geo-tagged photo verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Multi-crop inventory & agro-chemical consumption ledgers</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-stone-200 shadow-md aspect-[4/3]">
              <img
                src="/images/hero-agronomist.jpg"
                alt="Farm Management Software"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Module 2: Remote Sensing & GIS NDVI */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 rounded-2xl overflow-hidden border border-stone-200 shadow-md aspect-[4/3]">
              <img
                src="/images/remote-sensing.jpg"
                alt="Satellite GIS NDVI"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F5FAED] text-[#7aa32c] flex items-center justify-center">
                <Satellite className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Remote Sensing & Multispectral GIS
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Sentinel-2 10-meter satellite vegetative index mapping, soil moisture radar telemetry, and nitrogen distribution heatmaps delivered every 5 days.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>NDVI (Normalized Difference Vegetation Index) color-coded heatmaps</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Early crop stress, water deficit & weed encroachment detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Historical yield comparison & maturity stage velocity</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Module 3: Crop Advisory & IoT Sensors */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F5FAED] text-[#7aa32c] flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Crop Advisory & Micro-Climate IoT
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Real-time weather radar sync, growing degree days (GDD) computation, localized pest threat forecasting, and AI fertilizer prescription.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Doppler radar precipitation window forecast (48-hour accuracy)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Pest & fungal infection probability algorithms</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Multi-lingual voice & SMS alerts for rural smallholders</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-stone-200 shadow-md aspect-[4/3]">
              <img
                src="/images/hero-tractor.jpg"
                alt="IoT Weather & Advisory"
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

export default ProductsPreHarvestPage;
