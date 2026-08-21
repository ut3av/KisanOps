import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Laptop,
  Smartphone,
  Tablet,
  Radio,
  MapPin,
  CreditCard,
  Wrench,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Server
} from 'lucide-react';

export const PlatformEcosystemSection: React.FC = () => {
  const navigate = useNavigate();
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
            One Operating System. Dedicated Interfaces for Every Role.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
            Our cloud architecture ensures secure, role-based access for each Custom Hiring Centre, enabling seamless real-time coordination across fleet supervisors, field mechanics, and smallholder farmers.
          </p>
        </div>

        {/* 3 Platform Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Web Platform */}
          <div
            onClick={() => {
              setActivePlatformTab('web');
              navigate('/chc');
            }}
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
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white text-stone-700 border border-stone-200 font-typewriter">
                CHC Hub
              </span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-1">CHC Operations Hub</h3>
            <p className="text-xs text-stone-500 font-medium mb-3">
              Demand Forecast, Fleet Allocation & Telematics Stream
            </p>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c]" />
                <span>Regional demand surge forecasting (+34%)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c]" />
                <span>Inter-hub transit and fleet relocation engine</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Executive Tablet Ops */}
          <div
            onClick={() => {
              setActivePlatformTab('executive');
              navigate('/admin');
            }}
            className={`p-6 rounded-3xl border transition-all cursor-pointer ${
              activePlatformTab === 'executive'
                ? 'bg-[#F5FAED] border-[#7aa32c] shadow-lg scale-[1.02]'
                : 'bg-stone-50/70 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#7aa32c] flex items-center justify-center shadow-subtle">
                <Tablet className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white text-stone-700 border border-stone-200 font-typewriter">
                Governance
              </span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-1">Platform Admin Console</h3>
            <p className="text-xs text-stone-500 font-medium mb-3">
              Multi-District Oversight, Fleet Metrics & Audit Logs
            </p>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c]" />
                <span>Multi-district machinery utilization analytics</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c]" />
                <span>Dynamic pricing rule validation & audit trails</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Farmer Mobile App */}
          <div
            onClick={() => {
              setActivePlatformTab('farmer');
              navigate('/farmer');
            }}
            className={`p-6 rounded-3xl border transition-all cursor-pointer ${
              activePlatformTab === 'farmer'
                ? 'bg-[#F5FAED] border-[#7aa32c] shadow-lg scale-[1.02]'
                : 'bg-stone-50/70 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#7aa32c] flex items-center justify-center shadow-subtle">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white text-stone-700 border border-stone-200 font-typewriter">
                Mobile First
              </span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-1">Farmer Mobile Experience</h3>
            <p className="text-xs text-stone-500 font-medium mb-3">
              Instant Rental Search, 7-Factor Fit & Deferred AgriCredit
            </p>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c]" />
                <span>Explainable 94% machine match for farm plots</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c]" />
                <span>AgriCredit post-harvest payment limit & invoices</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4 Core Technology Pillars Defined in PRD */}
        <div className="pt-8 border-t border-stone-100">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400 font-typewriter">
              Core Underlying AgTech Infrastructure (PRD §23, §30, §43, §48)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-2 hover:bg-white hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-stone-900">J1939 CAN-Bus Telematics</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Live ECU data stream tracking speed, RPM, thermal thresholds, and automatic +17% fuel anomaly detection.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-2 hover:bg-white hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-stone-900">PostGIS Spatial Routing</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hyperlocal radius queries, farm plot boundary polygons, and nearest-equipment transit ETA calculation.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-2 hover:bg-white hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-stone-900">AgriCredit Scoring (0–900)</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Non-collateral deferred rental limits based on historical acreage, repayment integrity, and verified profile data.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-2 hover:bg-white hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Wrench className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-stone-900">Predictive Maintenance</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                0–100 Machine Health Scores and pre-failure alerts triggering inspection before costly in-field breakdown.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformEcosystemSection;
