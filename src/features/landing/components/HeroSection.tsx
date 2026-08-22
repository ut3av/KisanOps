import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  Sparkles,
  LogIn,
  ArrowUpRight,
  ArrowDownRight,
  Fuel,
  CreditCard,
  Gauge,
  CheckCircle2,
} from 'lucide-react';

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

  const currentSlide = HERO_SLIDES[activeSlideIndex];

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
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#9dc84d]/20 backdrop-blur-md border border-[#9dc84d]/30 shadow-sm max-w-full overflow-x-auto no-scrollbar">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlideIndex(index)}
                className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Heading, Subtitle & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#7aa32c]/30 text-xs font-bold text-[#2e4013] shadow-subtle">
              <Sparkles className="w-3.5 h-3.5 text-[#7aa32c]" />
              <span className="font-typewriter">{currentSlide.highlightTag}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1c1d1f] tracking-tight leading-[1.15] animate-in fade-in duration-300">
              {currentSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {currentSlide.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#7aa32c] hover:bg-[#6b9125] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#7aa32c]/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Platform</span>
              </button>

              <button
                onClick={scrollToSolutions}
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#dbe8ca] hover:bg-[#cfdfba] text-[#2e4013] text-xs sm:text-sm font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2"
              >
                <span>Explore Core Solutions</span>
                <ArrowRight className="w-4 h-4 text-[#7aa32c]" />
              </button>
            </div>

            {/* Verified Certifications Strip */}
            <div className="pt-4 border-t border-stone-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-stone-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7aa32c]" />
                <span>SMAM Scheme Aligned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7aa32c]" />
                <span>e-NAM APMC Integrated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7aa32c]" />
                <span>CAN-Bus J1939 Telematics</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Premium Showcase with Authentic Agricultural Photography */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Ambient Radial Halo */}
            <div className="absolute inset-0 bg-radial from-[#9dc84d]/25 via-transparent to-transparent blur-2xl -z-0 pointer-events-none" />

            {/* Premium Showcase Card */}
            <div className="relative w-full max-w-[540px] bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-3.5 sm:p-4 space-y-3 card-interactive-spotlight">
              {/* Main Visual: Tractor in Field */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-stone-200 shadow-md group">
                <img
                  src="/images/real-tractor-field.jpg"
                  alt="Authentic Indian agricultural tractor working in field"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Live Telematics Overlay */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white text-[11px] font-bold font-mono border border-white/20 shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>CAN-BUS J1939 LIVE</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/80 backdrop-blur-md text-white border border-white/15 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold font-typewriter text-emerald-300">
                      Mahindra 575 DI • Heavy Harvester Fleet
                    </div>
                    <div className="text-[10px] text-stone-300 font-mono">
                      Speed: 18 km/h • Fuel: 6.8 L/h • GPS Active
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-lg border border-emerald-500/30">
                    Live Telemetry
                  </span>
                </div>
              </div>

              {/* Bottom Split Row: Farmer Profile & Floating Metric Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Farmer Image Card */}
                <div className="sm:col-span-6 relative rounded-2xl overflow-hidden aspect-[16/11] border border-stone-200 shadow-sm group">
                  <img
                    src="/images/real-farmer-field.jpg"
                    alt="Indian smallholder farmer in wheat field"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-white">
                    <div className="text-[10px] font-mono text-emerald-300 font-bold">
                      Verified Field Rental
                    </div>
                    <div className="text-xs font-bold leading-tight font-typewriter">
                      8-Acre Wheat • 94% Machine Fit
                    </div>
                  </div>
                </div>

                {/* Right KPI Stat Chips */}
                <div className="sm:col-span-6 flex flex-col gap-2.5 justify-center">
                  <div className="p-3 rounded-2xl bg-[#F5FAED] border border-stone-200/80 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#7aa32c] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-[#1c1d1f] font-typewriter">
                        +34% Demand Surge
                      </div>
                      <div className="text-[10px] font-semibold text-stone-500">
                        14-Day Advance Shortage Alert
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-stone-200/80 flex items-center gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-[#c2a587] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <ArrowDownRight className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-[#1c1d1f] font-typewriter">
                        -38% Machine Downtime
                      </div>
                      <div className="text-[10px] font-semibold text-stone-500">
                        Predictive Maintenance Diagnostic
                      </div>
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
