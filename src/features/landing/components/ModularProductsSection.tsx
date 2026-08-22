import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Truck,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Activity,
  Gauge,
  CreditCard,
  Building2,
  FileText,
  Wrench,
  Fuel,
  ArrowRight,
  MapPin,
  Clock,
  IndianRupee,
  Cpu,
  Tractor,
  AlertTriangle,
  Play
} from 'lucide-react';

interface EngineModule {
  id: string;
  category: 'prediction' | 'matching' | 'telematics';
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  logicRef: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  metricLabel: string;
  metricValue: string;
  icon: React.ReactNode;
}

const ENGINES: EngineModule[] = [
  // Category 1: Demand & Allocation Intelligence
  {
    id: 'demand-prediction',
    category: 'prediction',
    title: 'Predictive Machinery Demand Engine',
    badge: 'Demand Intelligence',
    subtitle: '14-Day Regional Harvester & Tractor Deficit Alerts',
    description:
      'Eliminate regional machinery shortages before they happen. Yukti correlates upcoming crop maturity stages (+25), historical rental velocity (+20), active bookings (+15), and Doppler weather windows (+10) to forecast machinery demand spikes across districts.',
    logicRef: 'Demand Score: Harvest season (+30) + Crop stage (+25) = Sehore Harvester Shortage (+34%)',
    bullets: [
      '14-day & 30-day regional deficit horizon forecasting',
      'Explainable weighted scoring factors for hub managers',
      'Continuous calibration against local APMC sowing dates'
    ],
    image: '/images/real-tractor-field.jpg',
    imageAlt: 'Real Indian tractor plowing field in Madhya Pradesh',
    metricLabel: 'Demand Forecast Accuracy',
    metricValue: '+34% Surge Detected',
    icon: <TrendingUp className="w-5 h-5 text-[#7aa32c]" />
  },
  {
    id: 'fleet-allocation',
    category: 'prediction',
    title: 'Deterministic Machine Allocation Engine',
    badge: 'Fleet Rebalancing',
    subtitle: 'Inter-Hub Relocation & Fleet Rebalancing Optimizer',
    description:
      'When Sehore faces a deficit of 2 harvesters, the allocation engine optimizes Hungarian assignment & min-cost routing to relocate surplus equipment from Bhopal CHC, maximizing fleet utilization while minimizing transport overhead.',
    logicRef: 'Optimization Objective: Maximize fleet utilization (+21%) while minimizing relocation cost',
    bullets: [
      'Automated inter-hub equipment dispatch recommendations',
      'Distance, transport transit time, and ETA calculations',
      'Idle asset elimination across multi-district CHC networks'
    ],
    image: '/images/real-chc-yard.jpg',
    imageAlt: 'Authentic Indian Custom Hiring Centre machinery yard',
    metricLabel: 'Asset Utilization Gain',
    metricValue: '+21% Fleet Reallocation',
    icon: <Building2 className="w-5 h-5 text-[#7aa32c]" />
  },

  // Category 2: Smart Matching, Pricing & AgriCredit
  {
    id: 'smart-matching',
    category: 'matching',
    title: 'Smart 7-Factor Machine Recommendation',
    badge: 'Smart Matching',
    subtitle: 'Explainable Machine Matching for Farm Profiles',
    description:
      'Instead of forcing farmers to guess equipment specs, Yukti matches requirements (e.g. Ramesh: 8-acre wheat harvest) against nearby inventory using an explainable 7-factor scoring algorithm.',
    logicRef: 'Match Score: 25% Task/Crop + 20% Availability + 15% Distance + 15% Health + 10% Price + 10% Reliability + 5% Rating',
    bullets: [
      'John Deere Harvester 94% explainable fit for wheat harvest',
      'Hyperlocal proximity ranking (3.2 km from farm plot)',
      'Zero technical jargon: Task-first natural language search'
    ],
    image: '/images/real-farmer-field.jpg',
    imageAlt: 'Real Indian farmer checking equipment availability on phone in wheat field',
    metricLabel: 'Match Precision',
    metricValue: '94% Explainable Fit',
    icon: <Tractor className="w-5 h-5 text-[#7aa32c]" />
  },
  {
    id: 'dynamic-pricing',
    category: 'matching',
    title: 'Explainable Dynamic Pricing with Safeguards',
    badge: 'Dynamic Tariffs',
    subtitle: 'Transparent Hourly Breakdown with Price Ceilings',
    description:
      'Every price quote provides a transparent breakdown of base rate, local demand, availability, distance, and machine health adjustments, bounded by strict 80%–130% anti-gouging safeguards.',
    logicRef: 'Formula: Base (₹850) + High Demand (+₹128) + Low Supply (+₹68) + Distance (+₹35) - Condition (-₹20) = ₹1,061/hr',
    bullets: [
      'Guaranteed transparent price breakdown visible to farmer',
      'Strict production safeguards (80% floor, 130% ceiling)',
      'Automated seasonal tariff rules for Custom Hiring Centres'
    ],
    image: '/images/real-harvester-field.jpg',
    imageAlt: 'Real combine harvester operating in golden wheat field in India',
    metricLabel: 'Pricing Transparency',
    metricValue: '₹980 - ₹1,061 / hr',
    icon: <IndianRupee className="w-5 h-5 text-[#7aa32c]" />
  },
  {
    id: 'agricredit',
    category: 'matching',
    title: 'AgriCredit Deferred-Payment Orchestration',
    badge: 'AgriCredit Layer',
    subtitle: '0–900 Credit Scoring & 45-Day Post-Harvest Repayment',
    description:
      'Smallholders access pre-approved deferred rental credit (₹8,000–₹15,000) based on historical acreage, repayment consistency, and verified profile data, settling after selling produce at the APMC mandi.',
    logicRef: 'AgriCredit Score: 742 / 900 (Excellent) • Eligible Deferred Credit: ₹8,000',
    bullets: [
      'Zero upfront cash bottlenecks during peak harvest window',
      'Non-collateral credit decisioning for rural smallholders',
      'Automated settlement escrow holds & audit trail'
    ],
    image: '/images/real-farmer-field.jpg',
    imageAlt: 'Indian smallholder in wheat field with mobile credit confirmation',
    metricLabel: 'Credit Decisioning',
    metricValue: 'Score 742 / ₹8,000 Limit',
    icon: <CreditCard className="w-5 h-5 text-[#7aa32c]" />
  },

  // Category 3: Live Telematics, Maintenance & Billing
  {
    id: 'live-telematics',
    category: 'telematics',
    title: 'Live CAN-Bus IoT Telematics & Anomaly Detection',
    badge: 'CAN-Bus Stream',
    subtitle: 'Real-Time ECU Stream & +17% Fuel Pilferage Alerts',
    description:
      'Simulate and stream real-time J1939 ECU sensor data including GPS location, speed (18 km/h), engine temperature (86°C), fuel consumption (6.8 L/hr), and automated fuel theft anomaly alarms.',
    logicRef: 'Telemetry: MH-575 • Speed: 18 km/h • Fuel: 67% • Fuel Anomaly (+17% above baseline) Triggered',
    bullets: [
      'Continuous real-time GPS & engine operating status telemetry',
      'Automatic +17% abnormal fuel consumption leakage alert',
      'Geofence boundary enforcement & ignition monitoring'
    ],
    image: '/images/real-tractor-field.jpg',
    imageAlt: 'Tractor telematics in action in agricultural field',
    metricLabel: 'Fuel Anomaly Alert',
    metricValue: '+17% Leakage Caught',
    icon: <Gauge className="w-5 h-5 text-[#7aa32c]" />
  },
  {
    id: 'predictive-maintenance',
    category: 'telematics',
    title: 'Predictive Maintenance & Machine Health Score',
    badge: 'Health Diagnostic',
    subtitle: '0–100 Health Index & Thermal / Service Warnings',
    description:
      'Calculate a comprehensive 0–100 Machine Health Index based on 25% maintenance history, 20% engine parameters, 20% fuel efficiency, and 15% usage age to schedule repairs before field breakdowns.',
    logicRef: 'Machine Health: 82% • Oil service due soon • Inspection recommended within 24 operating hours',
    bullets: [
      'Engine hours vs service interval threshold alerts',
      'Engine temperature thermal warning prevention',
      'Scheduled parts replacement ledgers for CHC mechanics'
    ],
    image: '/images/real-chc-yard.jpg',
    imageAlt: 'CHC maintenance inspection in machinery yard',
    metricLabel: 'Fleet Reliability',
    metricValue: '82% Health Score',
    icon: <Wrench className="w-5 h-5 text-[#7aa32c]" />
  },
  {
    id: 'automated-billing',
    category: 'telematics',
    title: 'Automated Usage Calculation & GST Invoicing',
    badge: 'Tax Invoicing',
    subtitle: 'Verified Runtime Invoicing with Instant PDF Generation',
    description:
      'Automatically calculate actual runtime hours, base rental, transport charges, fuel surcharges, platform fee, discounts, and 5% GST with instant verified PDF tax invoice generation.',
    logicRef: 'Invoice #INV-2026-081 • Total: ₹6,472 • Telematics Verified Runtime: 6.5 hrs',
    bullets: [
      'Telematics-backed dispute-free hourly billing',
      'Configurable GST calculation and digital receipts',
      'Client-side jsPDF instant tax invoice generation'
    ],
    image: '/images/real-harvester-field.jpg',
    imageAlt: 'Harvesting completion and billing calculation in field',
    metricLabel: 'Billing Accuracy',
    metricValue: '100% Verified Runtime',
    icon: <FileText className="w-5 h-5 text-[#7aa32c]" />
  }
];

export const ModularProductsSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<
    'prediction' | 'matching' | 'telematics'
  >('prediction');
  const [activeEngineId, setActiveEngineId] = useState<string>('demand-prediction');

  const filteredEngines = ENGINES.filter((e) => e.category === activeCategory);
  const activeEngine =
    ENGINES.find((e) => e.id === activeEngineId) || filteredEngines[0];

  const handleTabChange = (category: 'prediction' | 'matching' | 'telematics') => {
    setActiveCategory(category);
    const firstOfCategory = ENGINES.find((e) => e.category === category);
    if (firstOfCategory) {
      setActiveEngineId(firstOfCategory.id);
    }
  };

  return (
    <section id="modular-products" className="py-24 bg-[#F5FAED] border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#7aa32c]/30 text-xs font-bold text-[#2e4013] mb-3 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-[#7aa32c]" />
            <span>Machinery Operating Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1c1d1f] tracking-tight">
            AI-Powered Agricultural Machinery & CHC Operating System
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed font-sans">
            We don’t just help farmers find machinery. Yukti manages the complete machinery lifecycle from demand forecasting and inter-hub fleet allocation to live CAN-Bus telematics and automated GST billing.
          </p>
        </div>

        {/* 3 Main Lifecycle Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-full bg-[#e8efde] border border-stone-300/70 shadow-inner max-w-full overflow-x-auto">
            <button
              onClick={() => handleTabChange('prediction')}
              className={`px-5 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'prediction'
                  ? 'bg-[#1b4d3e] text-white shadow-md'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              1. Demand & Fleet Allocation
            </button>

            <button
              onClick={() => handleTabChange('matching')}
              className={`px-5 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'matching'
                  ? 'bg-[#1b4d3e] text-white shadow-md'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              2. Smart Matching & Pricing
            </button>

            <button
              onClick={() => handleTabChange('telematics')}
              className={`px-5 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'telematics'
                  ? 'bg-[#1b4d3e] text-white shadow-md'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              3. Live Telematics & Billing
            </button>
          </div>
        </div>

        {/* Two-Column Layout: Left Engine Accordion & Right Live Preview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Engine Selector Cards */}
          <div className="lg:col-span-6 space-y-4">
            {filteredEngines.map((engine) => {
              const isOpen = engine.id === activeEngine.id;
              return (
                <div
                  key={engine.id}
                  onClick={() => setActiveEngineId(engine.id)}
                  className={`rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden card-interactive-spotlight ${
                    isOpen
                      ? 'bg-white border-[#1b4d3e] shadow-lg border-l-4 border-l-[#7aa32c]'
                      : 'bg-white/80 border-stone-200/80 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2.5 rounded-xl transition-colors ${
                            isOpen
                              ? 'bg-[#F5FAED] text-[#2e4013]'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {engine.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                              {engine.title}
                            </h3>
                          </div>
                          <div className="text-xs text-stone-500 font-medium">
                            {engine.subtitle}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full font-typewriter ${
                          isOpen
                            ? 'bg-[#7aa32c]/20 text-[#2e4013]'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {engine.badge}
                      </span>
                    </div>

                    {isOpen && (
                      <div className="mt-4 pt-4 border-t border-stone-100 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                          {engine.description}
                        </p>

                        <div className="p-3 bg-[#F5FAED] rounded-xl border border-[#7aa32c]/20 text-xs font-mono text-[#2e4013]">
                          <span className="font-bold text-stone-800">Operating Logic: </span>
                          {engine.logicRef}
                        </div>

                        <ul className="space-y-1.5 pt-1">
                          {engine.bullets.map((b, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-stone-700 font-medium flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c] shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#7aa32c] uppercase tracking-wider">
                            {engine.metricLabel}: {engine.metricValue}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (engine.category === 'prediction') navigate('/chc/demand');
                              else if (engine.category === 'matching') navigate('/farmer/marketplace');
                              else navigate('/chc/telematics');
                            }}
                            className="text-xs font-bold text-[#1b4d3e] hover:text-[#7aa32c] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Launch Live in Portal</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Real-Tone Agricultural Photography & Live Telemetry HUD */}
          <div className="lg:col-span-6 sticky top-28 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-4 sm:p-6 space-y-4 overflow-hidden relative group card-interactive-spotlight">
              {/* Browser/Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 text-xs text-stone-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="truncate px-3 py-1 bg-stone-50 rounded-lg text-stone-600 text-[11px]">
                  yukti.ag/engine/{activeEngine.id}
                </div>
                <div className="flex items-center gap-1 text-[#7aa32c] font-bold text-[11px]">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>ACTIVE ENGINE STREAM</span>
                </div>
              </div>

              {/* Realistic Authentic Agricultural Photo */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-stone-200 shadow-md">
                <img
                  src={activeEngine.image}
                  alt={activeEngine.imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating HUD Telemetry Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white text-xs font-bold font-typewriter border border-white/20 shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{activeEngine.metricLabel}: {activeEngine.metricValue}</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/80 backdrop-blur-md text-white border border-white/15 space-y-1">
                  <div className="text-xs font-bold text-[#9dc84d] font-typewriter">
                    {activeEngine.badge} • {activeEngine.title}
                  </div>
                  <p className="text-[11px] text-stone-300 leading-snug line-clamp-2">
                    {activeEngine.description}
                  </p>
                </div>
              </div>

              {/* Engine Spec Bar */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="text-[10px] text-stone-400 font-bold uppercase">Architecture</div>
                  <div className="font-bold text-stone-900">Python / PostGIS</div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="text-[10px] text-stone-400 font-bold uppercase">Deployment</div>
                  <div className="font-bold text-stone-900">Dedicated Tenant</div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="text-[10px] text-stone-400 font-bold uppercase">SLA Target</div>
                  <div className="font-bold text-emerald-700">99.9% Uptime</div>
                </div>
              </div>

              {/* Portal Launch Button */}
              <button
                onClick={() => {
                  if (activeEngine.category === 'prediction') navigate('/chc/demand');
                  else if (activeEngine.category === 'matching') navigate('/farmer/marketplace');
                  else navigate('/chc/telematics');
                }}
                className="w-full py-3 rounded-xl bg-[#1b4d3e] hover:bg-[#153e32] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-[#9dc84d] text-[#9dc84d]" />
                <span>Test Drive {activeEngine.title}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModularProductsSection;
