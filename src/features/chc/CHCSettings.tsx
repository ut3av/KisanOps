import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Sliders,
  ShieldCheck,
  Save,
  CheckCircle2,
  Zap,
  MapPin,
  Clock
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';

export const CHCSettings: React.FC = () => {
  const { state } = useKisanOpsStore();
  const [minSurge, setMinSurge] = useState('0.80');
  const [maxSurge, setMaxSurge] = useState('1.30');
  const [radiusKm, setRadiusKm] = useState('35');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Hub Operational Settings & Safety Bounds
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure dynamic pricing multipliers, operating radius, and telematic alert thresholds.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hub Profile Details */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-agri-800" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Custom Hiring Centre Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Hub Business Name</label>
              <input
                type="text"
                defaultValue="Sehore Agri Centre (CHC #01)"
                className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Unique Hub Code</label>
              <input
                type="text"
                defaultValue="CHC-MP-SEH-01"
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Operating Radius (km)</label>
              <input
                type="number"
                value={radiusKm}
                onChange={e => setRadiusKm(e.target.value)}
                className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Direct Dispatch Hotline</label>
              <input
                type="text"
                defaultValue="+91 94250 88912"
                className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Pricing Safety Rules */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-agri-800" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Dynamic Pricing Multipliers & Guardrails
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Floor Multiplier (Minimum Rate)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.05"
                  value={minSurge}
                  onChange={e => setMinSurge(e.target.value)}
                  className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                />
                <span className="text-slate-500 font-mono">0.80x (-20%)</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Ceiling Multiplier (Maximum Surge Cap)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.05"
                  value={maxSurge}
                  onChange={e => setMaxSurge(e.target.value)}
                  className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                />
                <span className="text-slate-500 font-mono">1.30x (+30%)</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Safety multiplier caps prevent unreasonable price gouging during peak harvest shortages while compensating CHC operators for high utilization wear.
          </p>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Operational rules updated successfully</span>
            </span>
          ) : <div />}

          <button
            type="submit"
            className="btn-primary text-xs py-2.5 px-6 shadow-md flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
