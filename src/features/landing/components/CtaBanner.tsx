import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, PhoneCall, Sparkles, CheckCircle2 } from 'lucide-react';

interface CtaBannerProps {
  onOpenBookDemo?: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-[#F5FAED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#1b4d3e] via-[#28564a] to-[#0f291e] overflow-hidden shadow-2xl p-8 sm:p-14 text-white">
          {/* Ambient Decorative Blurs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#9dc84d]/30 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-radial from-[#7aa32c]/20 to-transparent blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Agricultural Operations</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Ready to transform your agribusiness operations?
              </h2>

              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
                Reach out today to discover how Yukti cloud SaaS platform streamlines machinery dispatch, minimizes idle downtime, and empowers smallholder farmers with deferred credit.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 rounded-full bg-white hover:bg-stone-100 text-[#1b4d3e] text-sm sm:text-base font-extrabold shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-[#7aa32c]" />
                  <span>Sign In to Platform</span>
                </button>
              </div>
            </div>

            {/* Right Quick Checklist */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                What to Expect
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#9dc84d] shrink-0" />
                  <span>Instant access to Farmer & CHC portals</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#9dc84d] shrink-0" />
                  <span>Custom ROI & Machinery savings audit</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#9dc84d] shrink-0" />
                  <span>Live CAN-Bus telematics & GPS sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#9dc84d] shrink-0" />
                  <span>Dedicated tenant setup within 48 hours</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
