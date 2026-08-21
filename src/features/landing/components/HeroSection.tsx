import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sprout,
  CheckCircle2,
  Play
} from 'lucide-react';
import { useKisanOpsStore } from '../../../store/kisanOpsStore';
import { UserRole } from '../../../types';

interface HeroSectionProps {
  onOpenBookDemo: () => void;
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
    id: 'farm-management',
    tabLabel: 'Farm Management',
    title: 'Cloud based SaaS platform to manage and monitor farming operations.',
    subtitle: 'Supporting farms and contract farming ops with structured data, compliance, and execution visibility with Yukti.',
    highlightTag: 'End-to-End Digitization'
  },
  {
    id: 'supply-chain',
    tabLabel: 'Supply Chain & Telematics',
    title: 'An intelligence platform to power decisions across agri-food value chain.',
    subtitle: 'Turning field-level CAN-Bus telematics and GPS data into actionable insights for fleet positioning, sourcing, and dispatch.',
    highlightTag: 'Live CAN-Bus Telematics'
  },
  {
    id: 'agri-erp',
    tabLabel: 'Agri ERP & Machinery',
    title: 'A unified operations system to digitize end-to-end machinery workflows.',
    subtitle: 'Connecting regional farm demand, hub fleet allocation, AgriCredit scoring, dynamic pricing, and automated GST billing in one view.',
    highlightTag: 'Deterministic Allocation'
  },
  {
    id: 'sustainability',
    tabLabel: 'Sustainability & Credit',
    title: 'A digital platform to make agricultural productivity measurable and inclusive.',
    subtitle: 'Translating on-ground practice records into auditable data for deferred harvest payments, carbon tracking, and compliance.',
    highlightTag: 'Deferred AgriCredit'
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
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-stone-200 shadow-subtle text-xs font-bold text-[#2e4013]">
              <Sparkles className="w-3.5 h-3.5 text-[#7aa32c]" />
              <span>{currentSlide.highlightTag}</span>
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              <span className="text-stone-500 font-medium">Enterprise AgTech</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1c1d1f] tracking-tight leading-[1.15]">
              {currentSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {currentSlide.subtitle}
            </p>

            {/* Action Buttons (Matching user photo style) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenBookDemo}
                className="px-7 py-3.5 rounded-full bg-[#7aa32c] hover:bg-[#6b9125] text-white text-sm sm:text-base font-bold shadow-lg shadow-[#7aa32c]/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Demo</span>
              </button>

              <button
                onClick={scrollToSolutions}
                className="px-7 py-3.5 rounded-full bg-[#dbe8ca] hover:bg-[#cfdfba] text-[#2e4013] text-sm sm:text-base font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 text-[#7aa32c]" />
              </button>
            </div>

            {/* Instant Role Launchers Strip */}
            <div className="pt-4 border-t border-stone-200/80">
              <div className="text-xs font-bold text-stone-500 mb-2.5 flex items-center justify-center lg:justify-start gap-1.5">
                <Play className="w-3.5 h-3.5 text-[#7aa32c] fill-[#7aa32c]" />
                <span>Launch Interactive Demo Portals Instantly:</span>
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

          {/* Right Column: Organic Curved Dual-Bubble Frame & Floating Badges */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Ambient Radial Halo */}
            <div className="absolute inset-0 bg-radial from-[#9dc84d]/40 via-transparent to-transparent blur-xl -z-0" />

            {/* Container for Organic Shapes & Badges */}
            <div className="relative w-full max-w-[580px] aspect-[4/3] sm:aspect-[16/11]">
              {/* Connected Organic Background Shapes */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* SVG Outline for Connecting Curve */}
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

              {/* Left Bubble: Farm Telemetry & Hologram Visual */}
              <div className="absolute left-2 sm:left-4 top-10 sm:top-12 w-[48%] h-[68%] rounded-[45px] sm:rounded-[60px] overflow-hidden border-4 border-white shadow-xl rotate-[-4deg] hover:rotate-0 transition-transform duration-500 z-10 group">
                <img
                  src="/images/hero-tractor.jpg"
                  alt="Smart Agri Machinery Telematics"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-3 text-white">
                  <div className="text-[10px] font-mono font-bold text-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>CAN-BUS TELEMATICS</span>
                  </div>
                  <div className="text-xs font-bold leading-tight">Field 04 • Autonomous 4.5 mph</div>
                </div>
              </div>

              {/* Right Bubble: Modern Agronomist Specialist with Tablet (Exact photo match) */}
              <div className="absolute right-2 sm:right-4 bottom-6 sm:bottom-8 w-[56%] h-[78%] rounded-[55px] sm:rounded-[75px] overflow-hidden border-4 border-white shadow-2xl rotate-[3deg] hover:rotate-0 transition-transform duration-500 z-20 group">
                <img
                  src="/images/hero-agronomist.jpg"
                  alt="Modern Agronomist with Tablet in Greenhouse"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b4d3e]/70 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="text-[11px] font-mono text-emerald-200">Crop Health Index: 94%</div>
                  <div className="text-xs font-bold leading-tight">AI Diagnostic Suite Active</div>
                </div>
              </div>

              {/* Floating Pill Badge 1: Top-Left (200K+ Acres Digitized) */}
              <div className="absolute -top-2 left-0 sm:left-4 z-30 animate-bounce duration-1000">
                <div className="glass-pill px-4 py-2.5 rounded-full flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#7aa32c] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm sm:text-base font-black text-[#1c1d1f] leading-none">
                      200K+
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-semibold text-stone-500 leading-tight">
                      Acres Digitized
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Pill Badge 2: Bottom-Center (24% Reduction in Production Cost) */}
              <div className="absolute -bottom-4 left-1/4 sm:left-1/3 z-30">
                <div className="glass-pill px-4 py-2.5 rounded-full flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#c2a587] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm sm:text-base font-black text-[#1c1d1f] leading-none">
                      24%
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-semibold text-stone-500 leading-tight">
                      Reduction in Cost
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Pill Badge 3: Right-Middle (30% Boost In Productivity) */}
              <div className="absolute top-1/3 -right-2 sm:-right-4 z-30">
                <div className="glass-pill px-4 py-2.5 rounded-full flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#7aa32c] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm sm:text-base font-black text-[#1c1d1f] leading-none">
                      30%
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-semibold text-stone-500 leading-tight">
                      Boost In Productivity
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
