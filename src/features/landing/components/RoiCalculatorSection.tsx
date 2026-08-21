import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  Fuel,
  Clock,
  IndianRupee,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface RoiCalculatorSectionProps {
  onOpenBookDemo: () => void;
}

export const RoiCalculatorSection: React.FC<RoiCalculatorSectionProps> = ({
  onOpenBookDemo
}) => {
  const [acres, setAcres] = useState<number>(650);
  const [fleetSize, setFleetSize] = useState<number>(8);
  const [isContractFarming, setIsContractFarming] = useState<boolean>(true);

  // Dynamic ROI Formulas
  const baseRevenueBoost = acres * 850 + fleetSize * 42000;
  const multiplier = isContractFarming ? 1.25 : 1.0;
  const netFinancialGain = Math.round(baseRevenueBoost * multiplier);
  const fuelSavedLitres = Math.round(fleetSize * 320 * (acres / 500));
  const fuelCostSaved = Math.round(fuelSavedLitres * 92); // ~92 INR/Litre diesel
  const extraBillableHours = Math.round(fleetSize * 45 * multiplier);
  const downtimeReductionPercent = 38;

  return (
    <section id="roi-calculator" className="py-20 bg-white border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5FAED] border border-[#7aa32c]/30 text-xs font-bold text-[#2e4013] mb-3">
            <Calculator className="w-3.5 h-3.5 text-[#7aa32c]" />
            <span>Interactive Financial Model</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1d1f] tracking-tight">
            Calculate Your AgTech ROI & Fleet Efficiency
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
            See how predictive demand allocation, fuel anomaly detection, and deferred AgriCredit convert into tangible bottom-line savings and higher machine utilization.
          </p>
        </div>

        {/* Calculator Card Grid */}
        <div className="bg-[#F5FAED] rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Sliders & Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-stone-900">
                    Managed Farm Area / Cluster
                  </label>
                  <span className="text-base font-black text-[#2e4013] bg-white px-3 py-1 rounded-xl border border-stone-200 shadow-subtle">
                    {acres.toLocaleString()} Acres
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={acres}
                  onChange={(e) => setAcres(Number(e.target.value))}
                  className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#7aa32c]"
                />
                <div className="flex justify-between text-[11px] text-stone-500 font-semibold mt-1">
                  <span>50 Acres</span>
                  <span>2,500 Acres</span>
                  <span>5,000+ Acres</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-stone-900">
                    Machinery & Implement Fleet Size
                  </label>
                  <span className="text-base font-black text-[#2e4013] bg-white px-3 py-1 rounded-xl border border-stone-200 shadow-subtle">
                    {fleetSize} Units
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={fleetSize}
                  onChange={(e) => setFleetSize(Number(e.target.value))}
                  className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#7aa32c]"
                />
                <div className="flex justify-between text-[11px] text-stone-500 font-semibold mt-1">
                  <span>1 Unit (Small CHC)</span>
                  <span>20 Units</span>
                  <span>40+ Units (Regional Hub)</span>
                </div>
              </div>

              {/* Operating Model Toggle */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Operating Model
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsContractFarming(false)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      !isContractFarming
                        ? 'bg-[#7aa32c] text-white shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
                    }`}
                  >
                    Custom Hiring Centre (CHC)
                  </button>
                  <button
                    onClick={() => setIsContractFarming(true)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isContractFarming
                        ? 'bg-[#7aa32c] text-white shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
                    }`}
                  >
                    Contract Farming & Enterprise
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Calculated Outputs */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200/80 shadow-lg p-6 sm:p-8 space-y-6">
              <div className="text-center pb-4 border-b border-stone-100">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                  Estimated Annual Net Financial Gain
                </div>
                <div className="text-4xl sm:text-5xl font-black text-[#2e4013] tracking-tight flex items-center justify-center gap-1">
                  <span>₹{netFinancialGain.toLocaleString()}</span>
                  <span className="text-xs font-bold text-stone-500 font-sans">/ yr</span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Based on +21% fleet reallocation & deferred billing capture
                </p>
              </div>

              {/* Metric Breakdown Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-center space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                    <Fuel className="w-4 h-4" />
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-stone-900">
                    ₹{fuelCostSaved.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-stone-500 font-medium">
                    Fuel Saved ({fuelSavedLitres} L)
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-center space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mx-auto">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-stone-900">
                    +{extraBillableHours} hrs
                  </div>
                  <div className="text-[10px] text-stone-500 font-medium">
                    Billable Productive Time
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-center space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-stone-900">
                    -{downtimeReductionPercent}%
                  </div>
                  <div className="text-[10px] text-stone-500 font-medium">
                    Unplanned Downtime
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onOpenBookDemo}
                className="w-full py-3.5 px-6 rounded-xl bg-[#7aa32c] hover:bg-[#6b9125] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#7aa32c]/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-100 cursor-pointer"
              >
                <span>Get Full Enterprise ROI Feasibility Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
