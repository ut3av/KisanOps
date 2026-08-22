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
  CheckCircle2
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { DemoScenarioBar } from '../../components/demo/DemoScenarioBar';
import { UserRole } from '../../types';

export const LandingRoleSelect: React.FC = () => {
  const { state, switchRole } = useKisanOpsStore();
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole) => {
    switchRole(role);
    if (role === 'FARMER') navigate('/farmer');
    else if (role === 'ADMIN') navigate('/admin');
    else navigate('/chc');
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <DemoScenarioBar />

      {/* Hero Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-agri-100/90 text-agri-900 border border-agri-300/60 px-4 py-1.5 rounded-full text-xs font-bold mb-4 shadow-subtle">
          <Sparkles className="w-4 h-4 text-agri-700" />
          <span>Agricultural Machinery Intelligence & CHC Operating Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-agri-950 tracking-tight leading-tight max-w-4xl mx-auto">
          Predict. Allocate. <span className="text-agri-700">Operate.</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          KisanOps solves agricultural equipment underutilization and access bottlenecks by predicting demand, dynamically pricing rentals, enabling deferred AgriCredit, and streaming live CAN-Bus telematics.
        </p>

        {/* Intelligence Flywheel Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-700">
          <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-subtle">Predict Demand</span>
          <span className="text-slate-400">➔</span>
          <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-subtle">Allocate Fleet</span>
          <span className="text-slate-400">➔</span>
          <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-subtle">Smart Match</span>
          <span className="text-slate-400">➔</span>
          <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-subtle">Deferred Credit</span>
          <span className="text-slate-400">➔</span>
          <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-subtle">Live Telematics</span>
          <span className="text-slate-400">➔</span>
          <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-subtle">Automated Billing</span>
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-agri-800 hover:bg-agri-900 text-white font-bold text-xs shadow-md transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Open Real Authentication (Phone OTP / Email / Supabase)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Role Selection Interactive Cards */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="text-center mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Select Your Role to Enter Platform
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Farmer Portal */}
          <div
            onClick={() => handleSelectRole('FARMER')}
            className="card-premium p-6 sm:p-8 cursor-pointer group flex flex-col justify-between border-2 border-transparent hover:border-emerald-500 relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🌾
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
                  Mobile-First Portal
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Continue as Farmer
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Demo Account: Ramesh Kumar (8-Acre Wheat Farm, Sehore)
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Activity-based machine matching (Harvesting, Sowing, Tilling)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>AgriCredit Deferred Payment (₹8,000 credit limit - Pay post-harvest)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Live GPS machine tracking & instant PDF tax invoice</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-emerald-700">
              <span>Enter Farmer Experience</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: CHC Operations Hub */}
          <div
            onClick={() => handleSelectRole('CHC_MANAGER')}
            className="card-premium p-6 sm:p-8 cursor-pointer group flex flex-col justify-between border-2 border-transparent hover:border-agri-600 relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-agri-100 text-agri-900 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🏢
                </div>
                <span className="text-xs bg-agri-50 text-agri-800 font-bold px-3 py-1 rounded-full border border-agri-200">
                  Desktop Operations
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-agri-800 transition-colors">
                  Continue as CHC Hub Manager
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Demo Account: Rajesh Singh (Sehore Agri Centre #01)
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-agri-700 shrink-0" />
                  <span>7-Day regional demand forecasting & shortage alerts (+34%)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-agri-700 shrink-0" />
                  <span>Deterministic machine relocation optimizer (Bhopal ➔ Sehore)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-agri-700 shrink-0" />
                  <span>CAN-Bus telematics stream & fuel anomaly predictive alerts</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-agri-800">
              <span>Enter CHC Operations Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Quick Admin Access Link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => handleSelectRole('ADMIN')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mx-auto"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Governance & System Administration</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 w-full">
        KisanOps • Production Agricultural Machinery Intelligence Platform • Designed for MP Custom Hiring Centres
      </footer>
    </div>
  );
};
