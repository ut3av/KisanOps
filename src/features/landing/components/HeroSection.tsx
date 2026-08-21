import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  Play,
  Sprout,
  Building2,
  ChevronRight,
  Sparkles,
  LogIn,
  ArrowUpRight,
  ArrowDownRight,
  Fuel,
  CreditCard,
  Gauge
} from 'lucide-react';
import { useKisanOpsStore } from '../../../store/kisanOpsStore';
import { UserRole } from '../../../types';

interface HeroSectionProps {
  onOpenBookDemo?: () => void;
}

interface HeroSlide {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  highlightTag: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'demand-allocation',
    tabLabel: '1. Demand & Fleet Allocation',
    title: 'Predict machinery demand & optimize inter-hub equipment allocation.',
    subtitle: 'Yukti correlates upcoming crop maturity, historical rentals, and weather windows to alert CHCs 14 days before harvester shortages occur.',
    highlightTag: 'Autonomous Predictive Allocation'
  },
  {
    id: 'smart-matching',
    tabLabel: '2. Smart Match & Dynamic Price',
    title: 'Explainable 7-factor machine recommendations & transparent pricing.',
    subtitle: 'From an 8-acre wheat farm in Sehore to the optimal John Deere Harvester with explainable pricing bounded by strict 80%-130% price safeguards.',
    highlightTag: '94% Explainable Machine Fit'
  },
  {
    id: 'live-telematics',
    tabLabel: '3. Live CAN-Bus Telematics',
    title: 'Real-time J1939 telemetry stream with instant fuel anomaly alerts.',
    subtitle: 'Track GPS speed, engine hours, thermal thresholds, and catch abnormal fuel consumption (+17% leakage alarms) directly from the tractor ECU.',
    highlightTag: 'Live J1939 Telematics Stream'
  },
  {
    id: 'agricredit-billing',
    tabLabel: '4. AgriCredit & GST Invoicing',
    title: 'Deferred harvest payments & automated verified usage tax invoices.',
    subtitle: 'Empower rural smallholders with non-collateral deferred rental limits (0-900 scoring) settled after selling harvest produce at the APMC mandi.',
    highlightTag: 'Deferred AgriCredit & Verified Billing'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBookDemo }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const navigate = useNavigate();
  const { switchRole } = useKisanOpsStore();

  const currentSlide = HERO_SLIDES[activeSlideIndex];

  const handleSelectRole = (role: UserRole) => {
    switchRole(role);
    if (role === 'FARMER') navigate('/farmer');
    else if (role === 'ADMIN') navigate('/admin');
    else navigate('/chc');
  };

  const scrollToSolutions = () => {
    const el = document.getElementById('modular-products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-[#F5FAED] overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-radial from-[#9dc84d]/30 via-[#7aa32c]/10 to-transparent blur-3xl pointer-events-none -z-0" />
      <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-radial from-[#7aa32c]/20 to-transparent blur-2xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Interactive Tabs Header */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-[#9dc84d]/25 backdrop-blur-md border border-[#9dc84d]/40 shadow-sm max-w-full">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlideIndex(index)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeSlideIndex === index
                    ? 'bg-white text-[#2e4013] shadow-sm font-bold'
                    : 'text-[#4d5740] hover:text-[#2e4013] hover:bg-white/40'
                }`}
              >
                {slide.tabLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Left Copy & Right Organic Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Subtitle & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#7aa32c]/30 text-xs font-bold text-[#2e4013] shadow-subtle">
              <Sparkles className="w-3.5 h-3.5 text-[#7aa32c]" />
              <span className="font-typewriter">{currentSlide.highlightTag}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-[#1c1d1f] tracking-tight leading-[1.15] animate-in fade-in duration-300">
              {currentSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {currentSlide.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="px-7 py-3.5 rounded-full bg-[#7aa32c] hover:bg-[#6b9125] text-white text-sm sm:text-base font-bold shadow-lg shadow-[#7aa32c]/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Platform</span>
              </button>

              <button
                onClick={scrollToSolutions}
                className="px-7 py-3.5 rounded-full bg-[#dbe8ca] hover:bg-[#cfdfba] text-[#2e4013] text-sm sm:text-base font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2"
              >
                <span>Explore Core Solutions</span>
                <ArrowRight className="w-4 h-4 text-[#7aa32c]" />
              </button>
            </div>

            {/* Instant Role Launchers Strip */}
            <div className="pt-4 border-t border-stone-200/80">
              <div className="text-xs font-bold text-stone-500 mb-2.5 flex items-center justify-center lg:justify-start gap-1.5">
                <Play className="w-3.5 h-3.5 text-[#7aa32c] fill-[#7aa32c]" />
                <span>Launch Live Production Workspaces:</span>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <button
                  onClick={() => handleSelectRole('FARMER')}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-subtle flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Farmer Portal</span>
                </button>

                <button
                  onClick={() => handleSelectRole('CHC_MANAGER')}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F5FAED] text-[#2e4013] border border-[#7aa32c]/40 text-xs font-bold shadow-subtle flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#7aa32c]" />
                  <span>CHC Operations Hub</span>
                </button>

                <button
                  onClick={() => handleSelectRole('ADMIN')}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold shadow-subtle flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span>Admin Hub</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Organic Curved Dual-Bubble Frame with Real Agricultural Photography */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Ambient Radial Halo */}
            <div className="absolute inset-0 bg-radial from-[#9dc84d]/40 via-transparent to-transparent blur-xl -z-0" />

            {/* Container for Organic Shapes & Badges */}
            <div className="relative w-full max-w-[580px] aspect-[4/3] sm:aspect-[16/11]">
              {/* Connected Organic Background Shapes */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg
                  className="w-full h-full text-[#dbe8ca]/90 drop-shadow-md"
                  viewBox="0 0 600 450"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 120 70 C 220 30, 320 80, 360 170 C 400 260, 480 340, 520 280 C 560 220, 570 120, 490 80 C 410 40, 330 90, 270 110 C 180 140, 70 160, 120 70 Z"
                    stroke="#cfe0ba"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="opacity-70"
                  />
                </svg>
              </div>

              {/* Left Bubble: Real Tractor Working Field (Authentic Indian photo) */}
              <div className="absolute left-2 sm:left-4 top-10 sm:top-12 w-[48%] h-[68%] rounded-[45px] sm:rounded-[60px] overflow-hidden border-4 border-white shadow-xl rotate-[-4deg] hover:rotate-0 transition-transform duration-500 z-10 group">
                <img
                  src="/images/real-tractor-field.jpg"
                  alt="Authentic Indian agricultural tractor in field"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                  <div className="text-[10px] font-mono font-bold text-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>CAN-BUS J1939 LIVE</span>
                  </div>
                  <div className="text-xs font-bold leading-tight font-typewriter">
                    Mahindra 575 DI • 18 km/h • 6.8 L/h
                  </div>
                </div>
              </div>

              {/* Right Bubble: Real Indian Farmer in Golden Wheat Field */}
              <div className="absolute right-2 sm:right-4 bottom-6 sm:bottom-8 w-[56%] h-[78%] rounded-[55px] sm:rounded-[75px] overflow-hidden border-4 border-white shadow-2xl rotate-[3deg] hover:rotate-0 transition-transform duration-500 z-20 group">
                <img
                  src="/images/real-farmer-field.jpg"
                  alt="Real Indian farmer checking harvest schedule in wheat field"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b4d3e]/85 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="text-[11px] font-mono text-emerald-200 font-bold">
                    Ramesh Kumar • Sehore MP
                  </div>
                  <div className="text-xs font-bold leading-tight font-typewriter">
                    8-Acre Wheat • 94% Harvester Fit
                  </div>
                </div>
              </div>

              {/* Floating Pill Badge 1: Top-Left (+34% Demand Surge Detected) */}
              <div className="absolute -top-2 left-0 sm:left-4 z-30 animate-bounce duration-1000">
                <div className="glass-pill px-4 py-2.5 rounded-full flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#7aa32c] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm sm:text-base font-black text-[#1c1d1f] leading-none font-typewriter">
                      +34%
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-semibold text-stone-500 leading-tight">
                      Demand Surge Caught
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Pill Badge 2: Bottom-Center (-38% Machine Downtime) */}
              <div className="absolute -bottom-4 left-1/4 sm:left-1/3 z-30">
                <div className="glass-pill px-4 py-2.5 rounded-full flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#c2a587] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm sm:text-base font-black text-[#1c1d1f] leading-none font-typewriter">
                      -38%
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-semibold text-stone-500 leading-tight">
                      Unplanned Downtime
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Pill Badge 3: Right-Middle (+21% Fleet Utilization) */}
              <div className="absolute top-1/3 -right-2 sm:-right-4 z-30">
                <div className="glass-pill px-4 py-2.5 rounded-full flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#7aa32c] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm sm:text-base font-black text-[#1c1d1f] leading-none font-typewriter">
                      +21%
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-semibold text-stone-500 leading-tight">
                      Fleet Utilization Gain
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
