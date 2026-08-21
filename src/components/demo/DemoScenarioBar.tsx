import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  AlertTriangle,
  UserCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export const DEMO_SCENES = [
  {
    step: 1,
    title: '1. Demand Intelligence',
    subtitle: 'Sehore harvester shortage predicted (+34%)',
    role: 'CHC_MANAGER',
    route: '/chc/demand',
  },
  {
    step: 2,
    title: '2. Smart Allocation',
    subtitle: 'Relocate Harvester Bhopal → Sehore (+21% utilization)',
    role: 'CHC_MANAGER',
    route: '/chc/demand',
  },
  {
    step: 3,
    title: '3. Farmer Activity CTA',
    subtitle: 'Ramesh specifies 8-acre Wheat Harvesting',
    role: 'FARMER',
    route: '/farmer',
  },
  {
    step: 4,
    title: '4. Smart Machine Match',
    subtitle: 'John Deere Harvester 94% explainable fit',
    role: 'FARMER',
    route: '/farmer/marketplace',
  },
  {
    step: 5,
    title: '5. Dynamic Pricing',
    subtitle: 'Transparent ₹980/hr breakdown & safety caps',
    role: 'FARMER',
    route: '/farmer/marketplace',
  },
  {
    step: 6,
    title: '6. AgriCredit Eligibility',
    subtitle: 'Score 742 / ₹8,000 deferred rental credit',
    role: 'FARMER',
    route: '/farmer/credit',
  },
  {
    step: 7,
    title: '7. Instant Booking',
    subtitle: 'Booking confirmed with deferred payment',
    role: 'FARMER',
    route: '/farmer/rentals',
  },
  {
    step: 8,
    title: '8. CHC Dispatch',
    subtitle: 'Operator dispatches harvester to Bilkisganj',
    role: 'CHC_MANAGER',
    route: '/chc/bookings',
  },
  {
    step: 9,
    title: '9. Live Telematics',
    subtitle: 'Real-time GPS route, fuel %, temp, RPM streaming',
    role: 'CHC_MANAGER',
    route: '/chc/telematics',
  },
  {
    step: 10,
    title: '10. Fuel Anomaly Alert',
    subtitle: '+17% burn rate triggers predictive maintenance',
    role: 'CHC_MANAGER',
    route: '/chc/maintenance',
  },
  {
    step: 11,
    title: '11. Automated Billing',
    subtitle: 'Telemetry-verified 6.4h tax invoice generated',
    role: 'FARMER',
    route: '/farmer/rentals',
  },
  {
    step: 12,
    title: '12. CHC Revenue & Flywheel',
    subtitle: 'Fleet utilization & unit economics updated',
    role: 'CHC_MANAGER',
    route: '/chc/analytics',
  },
];

export const DemoScenarioBar: React.FC = () => {
  const { state, setActiveDemoScene, resetToDefaults, toggleFuelAnomaly, switchRole } = useKisanOpsStore();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const currentScene = DEMO_SCENES.find(s => s.step === state.activeDemoScene) || DEMO_SCENES[0];

  const handleGoToScene = (step: number) => {
    const targetScene = DEMO_SCENES.find(s => s.step === step);
    if (!targetScene) return;

    setActiveDemoScene(step);
    switchRole(targetScene.role as any);
    navigate(targetScene.route);
  };

  return (
    <aside aria-label="Demo Controller" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Demo Scenario Tag & Stepper */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-agri-800/80 border border-agri-600/40 text-emerald-300 px-2.5 py-1 rounded-lg text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>5-Min Interactive Demo</span>
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => handleGoToScene(Math.max(1, state.activeDemoScene - 1))}
              disabled={state.activeDemoScene === 1}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded"
              title="Previous Scene"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              Scene {state.activeDemoScene} / 12
            </span>

            <button
              onClick={() => handleGoToScene(Math.min(12, state.activeDemoScene + 1))}
              disabled={state.activeDemoScene === 12}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded"
              title="Next Scene"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden lg:block">
            <div className="text-xs font-semibold text-white">{currentScene.title}</div>
            <div className="text-[11px] text-slate-400">{currentScene.subtitle}</div>
          </div>
        </div>

        {/* Center: Quick Scene Stepper Button / Modal toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <span>{isExpanded ? 'Close Scene Menu' : 'Jump to Scene'}</span>
            <ChevronRight className={clsx('w-3.5 h-3.5 transition-transform', isExpanded && 'rotate-90')} />
          </button>

          {/* Anomaly Injector Toggle */}
          <button
            onClick={() => toggleFuelAnomaly()}
            className={clsx(
              'text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border',
              state.simulationState.isFuelAnomalyActive
                ? 'bg-rose-900/80 text-rose-200 border-rose-600 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            )}
            title="Inject or Clear Telemetry Fuel Anomaly"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              {state.simulationState.isFuelAnomalyActive ? 'Fuel Anomaly Active' : 'Inject Anomaly'}
            </span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={() => {
              resetToDefaults();
              handleGoToScene(1);
            }}
            className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
            title="Reset All Data to Default Demo State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Expanded Scenes Drawer */}
      {isExpanded && (
        <div className="border-t border-slate-800 bg-slate-950 p-4 max-w-7xl mx-auto">
          <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            12-Scene End-to-End Walkthrough Script
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {DEMO_SCENES.map(scene => (
              <button
                key={scene.step}
                onClick={() => {
                  handleGoToScene(scene.step);
                  setIsExpanded(false);
                }}
                className={clsx(
                  'text-left p-2.5 rounded-xl border text-xs transition-all flex flex-col justify-between',
                  state.activeDemoScene === scene.step
                    ? 'bg-agri-900 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-200">{scene.title}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">
                    {scene.role.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">{scene.subtitle}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
