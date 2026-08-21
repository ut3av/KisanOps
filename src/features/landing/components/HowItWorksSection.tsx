import React, { useState } from 'react';
import {
  MapPin,
  TrendingUp,
  Truck,
  ShieldCheck,
  Radio,
  FileCheck,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2
} from 'lucide-react';

interface WorkflowStep {
  id: number;
  badge: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  metric: string;
  metricLabel: string;
  icon: React.ReactNode;
  highlights: string[];
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 1,
    badge: 'Stage 01: Context',
    title: 'Farm & Soil GIS Profiling',
    shortDesc: 'Satellite NDVI, soil moisture, and crop calendar digitization.',
    fullDesc: 'Digitizes plot polygons, sowing dates, crop stages, and local micro-climate signals to construct a unified digital farm twin.',
    metric: '99.4%',
    metricLabel: 'GIS Plot Accuracy',
    icon: <MapPin className="w-6 h-6 text-[#7aa32c]" />,
    highlights: ['Polygon boundary capture', 'Real-time soil moisture radar', 'Crop maturity tracking']
  },
  {
    id: 2,
    badge: 'Stage 02: Prediction',
    title: 'Predictive Machinery Demand',
    shortDesc: 'ML forecasting of peak rental demand and regional equipment shortages.',
    fullDesc: 'Synthesizes harvest maturity velocity and historical rental requests to forecast machinery deficits up to 14 days in advance.',
    metric: '+34%',
    metricLabel: 'Peak Surge Forecast',
    icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
    highlights: ['7-Day regional shortage alerts', 'Weather delay impact models', 'Seasonal tariff stabilization']
  },
  {
    id: 3,
    badge: 'Stage 03: Allocation',
    title: 'Deterministic Fleet Relocation',
    shortDesc: 'Optimizer routes surplus machines from low to high-demand hubs.',
    fullDesc: 'Solves transport economics and transit time to relocate idle tractors and harvesters, unlocking massive utilization and revenue upside.',
    metric: '+21%',
    metricLabel: 'Fleet Utilization Gain',
    icon: <Truck className="w-6 h-6 text-blue-600" />,
    highlights: ['Multi-hub transit routing', 'Cost-to-serve optimization', 'Zero idle machine downtime']
  },
  {
    id: 4,
    badge: 'Stage 04: Booking',
    title: 'Smart Match & Deferred AgriCredit',
    shortDesc: '7-Factor explainable matching paired with post-harvest credit limits.',
    fullDesc: 'Smallholders get matched to certified equipment based on task suitability, with pre-approved deferred credit allowing post-harvest repayment.',
    metric: '₹8,000',
    metricLabel: 'Deferred Credit Limit',
    icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    highlights: ['7-Factor explainable match (94%)', '0-900 AgriCredit risk score', '45-Day post-harvest payback']
  },
  {
    id: 5,
    badge: 'Stage 05: Telematics',
    title: 'CAN-Bus Telematics & Tax Invoicing',
    shortDesc: 'Live IoT tracking, fuel anomaly detection, and automated GST billing.',
    fullDesc: 'Streams live engine RPM, speed, and fuel burn. Predicts maintenance failures and automatically generates reconciled PDF invoices.',
    metric: '2.0s',
    metricLabel: 'Telemetry Sync Rate',
    icon: <Radio className="w-6 h-6 text-[#7aa32c]" />,
    highlights: ['Live GPS & boundary geofence', '+17% Fuel anomaly detection', 'Automated GST tax PDF invoice']
  }
];

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const currentStep = WORKFLOW_STEPS.find((s) => s.id === activeStep) || WORKFLOW_STEPS[0];

  return (
    <section id="how-it-works" className="py-20 bg-[#F5FAED] border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-[#2e4013] mb-3 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-[#7aa32c]" />
            <span>Closed-Loop Operations Lifecycle</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1d1f] tracking-tight">
            How KisanOps Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
            KisanOps unifies farm contexts, machine telematics, and financial workflows in one single system — enabling end-to-end efficiency, operational transparency, predictive planning, and fleet profitability.
          </p>
        </div>

        {/* Step Buttons Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-10">
          {WORKFLOW_STEPS.map((step) => {
            const isActive = step.id === activeStep;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-white border-[#7aa32c] shadow-md scale-[1.02]'
                    : 'bg-white/60 border-stone-200/70 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#7aa32c] text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    0{step.id}
                  </span>
                  <div className="p-1.5 rounded-lg bg-stone-50">{step.icon}</div>
                </div>
                <div className="text-xs font-bold text-stone-900 leading-tight">
                  {step.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Active Step Detail Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl overflow-hidden p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5FAED] text-[#2e4013] text-xs font-bold border border-[#7aa32c]/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c]" />
                <span>{currentStep.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {currentStep.title}
              </h3>

              <p className="text-stone-600 text-base leading-relaxed">
                {currentStep.fullDesc}
              </p>

              {/* Highlights list */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Key Operational Outcomes
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentStep.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs font-semibold text-stone-800"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#7aa32c] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right KPI & Mock Visual */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#F5FAED] to-white rounded-2xl p-6 border border-stone-200/80 shadow-inner flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200/60">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#7aa32c]" />
                  <span className="text-xs font-mono font-bold text-stone-700">
                    REAL-TIME METRIC
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-[#7aa32c]/15 text-[#2e4013] px-2.5 py-0.5 rounded-full">
                  LIVE BENCHMARK
                </span>
              </div>

              <div className="text-center py-4">
                <div className="text-5xl sm:text-6xl font-black text-[#2e4013] tracking-tight">
                  {currentStep.metric}
                </div>
                <div className="text-sm font-bold text-stone-600 mt-1">
                  {currentStep.metricLabel}
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
                <span className="font-semibold">Next Lifecycle Stage</span>
                <button
                  onClick={() =>
                    setActiveStep((prev) => (prev < 5 ? prev + 1 : 1))
                  }
                  className="font-bold text-[#7aa32c] flex items-center gap-1 hover:underline"
                >
                  <span>Advance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
