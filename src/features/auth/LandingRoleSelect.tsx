import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tractor,
  TrendingUp,
  ShieldCheck,
  Radio,
  User,
  Building2,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { DemoScenarioBar } from '../../components/demo/DemoScenarioBar';
import { UserRole } from '../../types';

export const LandingRoleSelect: React.FC = () => {
  const { switchRole } = useKisanOpsStore();
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole) => {
    switchRole(role);
    if (role === 'FARMER') navigate('/farmer');
    else if (role === 'ADMIN') navigate('/admin');
    else if (role === 'OPERATOR') navigate('/operator');
    else navigate('/chc');
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <DemoScenarioBar />

      {/* Hero Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-900 border border-indigo-200/80 px-4 py-1.5 rounded-full text-xs font-bold mb-4 shadow-subtle">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span>Yukti AI • Agricultural Machinery Intelligence & CHC Operating Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight max-w-4xl mx-auto">
          Predict. Allocate. <span className="text-emerald-600">Operate.</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          KisanOps is India's next-generation agricultural machinery intelligence grid powered by <strong>Yukti AI</strong>, connecting farmers, custom hiring centers, and operators with real-time telematics and automated dispatch.
        </p>

        {/* Action Button Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Open Authentication Portal (Farmer • CHC • Operator • Admin)</span>
            <ArrowRight className="w-4 h-4 text-indigo-300" />
          </button>
        </div>
      </header>

      {/* Role Selection Interactive Cards (4 Personas) */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="text-center mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Your Role Portal to Enter
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Farmer Portal */}
          <div
            onClick={() => handleSelectRole('FARMER')}
            className="card-premium p-6 sm:p-7 cursor-pointer group flex flex-col justify-between border-2 border-transparent hover:border-emerald-500 relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🌾
                </div>
                <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
                  Mobile-First
                </span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Farmer Portal (किसान)
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Demo User: Ramesh Kumar (8-Acre Wheat Farm, Sehore)
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>AI Voice Machine Booking via Yukti AI</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>AgriCredit Deferred Payment (Pay post-harvest)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Live GPS telematics tracking & tax invoice</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-emerald-700">
              <span>Enter Farmer Experience</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: CHC Operations Hub */}
          <div
            onClick={() => handleSelectRole('CHC_MANAGER')}
            className="card-premium p-6 sm:p-7 cursor-pointer group flex flex-col justify-between border-2 border-transparent hover:border-sky-600 relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-900 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🏢
                </div>
                <span className="text-[11px] bg-sky-50 text-sky-800 font-bold px-3 py-1 rounded-full border border-sky-200">
                  Operations Hub
                </span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-sky-800 transition-colors">
                  CHC Manager Hub (हब ऑपरेशन्स)
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Demo User: Rajesh Singh (Sehore Agri Centre #01)
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Regional demand forecasting & shortage alerts (+34%)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Fleet reallocation optimizer (Bhopal ➔ Sehore)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Predictive maintenance & fuel anomaly sensor triage</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-sky-800">
              <span>Enter CHC Operations Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Machinery Operator App */}
          <div
            onClick={() => handleSelectRole('OPERATOR')}
            className="card-premium p-6 sm:p-7 cursor-pointer group flex flex-col justify-between border-2 border-transparent hover:border-amber-600 relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🚜
                </div>
                <span className="text-[11px] bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-200">
                  Field App
                </span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors">
                  Machinery Operator (ऑपरेटर)
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Demo User: Raju Verma (Harvester Operator, 4.9★)
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Active job dispatch & field geofencing tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>CAN-Bus telematics telemetry simulator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>1-Click job completion & auto invoice trigger</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-amber-800">
              <span>Enter Operator Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Platform Administrator */}
          <div
            onClick={() => handleSelectRole('ADMIN')}
            className="card-premium p-6 sm:p-7 cursor-pointer group flex flex-col justify-between border-2 border-transparent hover:border-purple-600 relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🛡️
                </div>
                <span className="text-[11px] bg-purple-50 text-purple-800 font-bold px-3 py-1 rounded-full border border-purple-200">
                  Governance
                </span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-purple-800 transition-colors">
                  Platform Administrator (प्रशासक)
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Demo User: System Governance (Bhopal HQ)
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Statewide CHC compliance & uptime audit</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>SMAM & PM-KUSUM subsidy disbursement monitor</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Fleet telemetry logs & security governance</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-purple-800">
              <span>Enter Admin Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 w-full">
        KisanOps • Powered by Yukti AI • Production Agricultural Machinery Intelligence Grid
      </footer>
    </div>
  );
};
