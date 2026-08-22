import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface StatsImpactSectionProps {
  onOpenBookDemo?: () => void;
}

export const StatsImpactSection: React.FC<StatsImpactSectionProps> = ({
  onOpenBookDemo
}) => {
  const navigate = useNavigate();
  const handleAction = onOpenBookDemo || (() => navigate('/about'));
  return (
    <section className="py-20 bg-[#efe7db]/30 border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden card-interactive-spotlight">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
            {/* Left Image & Badge */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-stone-200 shadow-md aspect-[4/3] group">
              <img
                src="/images/real-chc-yard.jpg"
                alt="Sehore Custom Hiring Centre machinery fleet"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <div className="text-xs font-mono font-bold text-[#9dc84d]">
                  DOMAIN EXCELLENCE
                </div>
                <div className="text-base font-bold font-typewriter">Sehore CHC Fleet Hub • 14 Units Active</div>
              </div>
            </div>

            {/* Right Text & Counter Grid (Matching KhetiBuddy format) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#7aa32c] mb-1">
                  Why Yukti?
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1c1d1f] tracking-tight">
                  Unified AgTech Platform Built for Ground Reality
                </h2>
              </div>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                With over 25 years of combined domain agronomical and deep-tech expertise, we’ve developed Yukti with an agriculture-first philosophy. We collaborate closely with smallholders, hub managers, and corporate agri-businesses to swiftly digitize intricate on-ground operational processes without friction.
              </p>

              {/* 3 Metric Counters */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-y border-stone-100 py-4">
                <div className="text-left space-y-1">
                  <div className="text-3xl sm:text-4xl font-black text-[#7aa32c] tracking-tight">
                    200k+
                  </div>
                  <div className="text-xs font-bold text-stone-700">Acres Digitized</div>
                  <div className="text-[10px] text-stone-400">Across 8 crop clusters</div>
                </div>

                <div className="text-left space-y-1 border-x border-stone-200 px-3 sm:px-6">
                  <div className="text-3xl sm:text-4xl font-black text-[#7aa32c] tracking-tight">
                    24%
                  </div>
                  <div className="text-xs font-bold text-stone-700">Cost Reduction</div>
                  <div className="text-[10px] text-stone-400">Fuel & machinery idle time</div>
                </div>

                <div className="text-left space-y-1">
                  <div className="text-3xl sm:text-4xl font-black text-[#7aa32c] tracking-tight">
                    30%
                  </div>
                  <div className="text-xs font-bold text-stone-700">Productivity Boost</div>
                  <div className="text-[10px] text-stone-400">Peak harvesting speed</div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={handleAction}
                  className="px-6 py-3 rounded-full bg-[#7aa32c] hover:bg-[#6b9125] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#7aa32c]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>More About Us</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
