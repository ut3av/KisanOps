import React, { useState } from 'react';
import {
  Laptop,
  Smartphone,
  Tablet,
  CloudRain,
  Eye,
  Satellite,
  BrainCircuit,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Server
} from 'lucide-react';

export const PlatformEcosystemSection: React.FC = () => {
  const [activePlatformTab, setActivePlatformTab] = useState<'web' | 'executive' | 'farmer'>('web');

  return (
    <section id="platform-ecosystem" className="py-20 bg-white border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5FAED] border border-[#7aa32c]/30 text-xs font-bold text-[#2e4013] mb-3">
            <Server className="w-3.5 h-3.5 text-[#7aa32c]" />
            <span>Multi-Device AgTech Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1d1f] tracking-tight">
            One Platform. Dedicated Interfaces for Every Role.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
            Our cloud-based solution ensures data privacy with secure, dedicated instances for each enterprise client, enabling seamless team collaboration across field managers, machinery operators, and smallholder farmers.
          </p>
        </div>

        {/* 3 Platform Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Web Platform */}
          <div
            onClick={() => setActivePlatformTab('web')}
            className={`p-6 rounded-3xl border transition-all cursor-pointer ${
              activePlatformTab === 'web'
                ? 'bg-[#F5FAED] border-[#7aa32c] shadow-lg scale-[1.02]'
                : 'bg-stone-50/70 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#7aa32c] flex items-center justify-center shadow-subtle">
                <Laptop className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white text-stone-700 border border-stone-200">
                Desktop Ops
              </span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-1">Web Operations Platform</h3>
            <p className="text-xs text-stone-500 font-medium mb-3">
              Backend Operations, Machine Allocation & Executive Analytics
            </p>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c]" />
                <span>Demand forecast heatmap & shortage buffers</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c]" />
                <span>Inter-hub transit and relocation engine</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Executive Mobile App */}
          <div
            onClick={() => setActivePlatformTab('executive')}
            className={`p-6 rounded-3xl border transition-all cursor-pointer ${
              activePlatformTab === 'executive'
                ? 'bg-[#F5FAED] border-[#7aa32c] shadow-lg scale-[1.02]'
                : 'bg-stone-50/70 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-subtle">
                <Tablet className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white text-stone-700 border border-stone-200">
                Tablet & Mobile
              </span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-1">Executive Mobile App</h3>
            <p className="text-xs text-stone-500 font-medium mb-3">
              Activity Monitoring, Operator Dispatch & Anomaly Alerts
            </p>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c]" />
                <span>Live CAN-Bus telematics & fuel burn alerts</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c]" />
                <span>Instant dispatch assignment & inspection logs</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Farmer Mobile App */}
          <div
            onClick={() => setActivePlatformTab('farmer')}
            className={`p-6 rounded-3xl border transition-all cursor-pointer ${
              activePlatformTab === 'farmer'
                ? 'bg-[#F5FAED] border-[#7aa32c] shadow-lg scale-[1.02]'
                : 'bg-stone-50/70 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-subtle">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white text-stone-700 border border-stone-200">
                PWA / Native App
              </span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-1">Farmer Mobile App</h3>
            <p className="text-xs text-stone-500 font-medium mb-3">
              Task Execution, Rental Booking & Deferred Credit
            </p>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c]" />
                <span>One-tap machine booking by farm activity</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c]" />
                <span>AgriCredit post-harvest payment limit & invoices</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4 Core Technology Pillars (From KhetiBuddy Platform) */}
        <div className="pt-8 border-t border-stone-100">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
              Core Underlying AgTech Infrastructure
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-2 hover:bg-white hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <CloudRain className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-stone-900">Weather Stations & Radar</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hyperlocal precipitation forecasts, soil moisture indices, and pest spray suitability windows.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-2 hover:bg-white hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Eye className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-stone-900">Computer Vision & Edge AI</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Automated leaf diagnostic scanning for prompt disease detection before yield quality degrades.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-2 hover:bg-white hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Satellite className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-stone-900">GIS Satellite Imagery</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Multispectral Sentinel-2 NDVI canopy vigor and irrigation stress mapping at 10m ground resolution.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-2 hover:bg-white hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-stone-900">AI & Predictive Demand ML</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Deep neural networks modeling regional harvest surge, transit routes, and dynamic pricing safety bounds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
