import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  QrCode,
  ShoppingCart,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Radio,
  Fuel,
  TrendingUp,
  Boxes
} from 'lucide-react';
import { LandingNavbar } from '../components/LandingNavbar';
import { LandingFooter } from '../components/LandingFooter';
import { CtaBanner } from '../components/CtaBanner';
import { usePageTitle } from '../../../hooks/usePageTitle';

export const ProductsPostHarvestPage: React.FC = () => {
  usePageTitle(
    'Post-Harvest & Telematics Suite',
    'Live CAN-Bus machinery telematics, batch traceability, and equipment rentals.'
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
            <span>Post-Harvest & Logistics Suite</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1c1d1f] tracking-tight max-w-4xl mx-auto leading-tight">
            Live Fleet Telematics, Batch Traceability & Equipment Marketplaces
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate idle machinery downtime with real-time CAN-Bus GPS tracking, verifiable farm-to-fork batch traceability, and dynamic custom hiring rentals.
          </p>
          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-3.5 rounded-full bg-[#7aa32c] hover:bg-[#6b9125] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Explore Fleet Telematics</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/chc')}
              className="px-7 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-sm transition-all cursor-pointer"
            >
              Open CHC Operations Hub
            </button>
          </div>
        </div>

        {/* 3 Core Modules */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Module 1: Supply Chain & Fleet Telematics */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F5FAED] text-[#7aa32c] flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Live CAN-Bus Machinery Telematics
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Connect J1939 ECU protocol telemetry to monitor engine RPM, oil pressure, battery health, fuel burn rate, and real-time GPS coordinates.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Deterministic inter-hub relocation algorithms (e.g. Bhopal ➔ Sehore)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Real-time fuel anomaly detection (+17% diesel pilferage alerts)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Geofence boundary breach detection and unauthorized ignition alerts</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-stone-200 shadow-md aspect-[4/3]">
              <img
                src="/images/hero-tractor.jpg"
                alt="Fleet Telematics & Anomaly Detection"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Module 2: Food Traceability */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 rounded-2xl overflow-hidden border border-stone-200 shadow-md aspect-[4/3]">
              <img
                src="/images/hero-agronomist.jpg"
                alt="Food Traceability"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F5FAED] text-[#7aa32c] flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Farm-to-Fork Batch Traceability
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Immutable audit logs from certified seed sowing, chemical spray records, harvest batch timestamps, and QR code provenance for retail processors.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Unique lot identification & Mandi APMC gate pass integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>GlobalGAP, Organic & FairTrade digital compliance certificates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Consumer QR scan verification displaying farmer provenance</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Module 3: Digital Equipment Marketplace */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F5FAED] text-[#7aa32c] flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Digital Equipment Marketplace & Implement Pool
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Connect smallholders with verified tractors, laser levellers, rotavators, drone sprayers, and combine harvesters with transparent hourly rates.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>7-Factor explainable equipment matching (Crop, Soil, Acreage, Distance)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Transparent tariff breakdown (Base rent, fuel, transport & GST)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                  <span>Real-time booking confirmations & operator dispatch tracking</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-stone-200 shadow-md aspect-[4/3]">
              <img
                src="/images/remote-sensing.jpg"
                alt="Equipment Marketplace"
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

export default ProductsPostHarvestPage;
