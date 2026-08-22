import React, { useState, useEffect } from 'react';
import {
  Building2,
  Save,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { usePageTitle } from '../../hooks/usePageTitle';

export const CHCSettings: React.FC = () => {
  usePageTitle(
    'Hub Settings & Operational Profile',
    'Configure Custom Hiring Centre identity, location, dynamic pricing guardrails, and dispatch parameters.'
  );
  const { state, registerCHC } = useKisanOpsStore();
  const currentChc = state.chcs[0];

  const [hubName, setHubName] = useState(currentChc?.name || 'Agro Mechanization Centre');
  const [district, setDistrict] = useState(currentChc?.district || '');
  const [village, setVillage] = useState(currentChc?.village || '');
  const [stateName, setStateName] = useState(currentChc?.state || 'Madhya Pradesh');
  const [radiusKm, setRadiusKm] = useState(String(currentChc?.operatingRadiusKm || 35));
  const [contactPhone, setContactPhone] = useState(currentChc?.contactPhone || state.currentUser.phoneNumber || '+91 98261 00000');
  const [minSurge, setMinSurge] = useState(String(currentChc?.minSurgeMultiplier ?? 0.80));
  const [maxSurge, setMaxSurge] = useState(String(currentChc?.maxSurgeMultiplier ?? 1.30));
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (currentChc) {
      setHubName(currentChc.name);
      setDistrict(currentChc.district);
      setVillage(currentChc.village);
      setStateName(currentChc.state);
      setRadiusKm(String(currentChc.operatingRadiusKm));
      setContactPhone(currentChc.contactPhone);
      setMinSurge(String(currentChc.minSurgeMultiplier ?? 0.80));
      setMaxSurge(String(currentChc.maxSurgeMultiplier ?? 1.30));
    }
  }, [currentChc]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    registerCHC({
      id: currentChc?.id || `chc-${Date.now()}`,
      name: hubName,
      code: currentChc?.code || `CHC-${(district || 'HUB').slice(0, 3).toUpperCase()}-01`,
      district: district || 'Central District',
      village: village,
      state: stateName,
      operatingRadiusKm: Number(radiusKm) || 35,
      contactPhone: contactPhone,
      totalMachines: state.machines.length,
      activeMachines: state.machines.filter(m => m.status === 'ACTIVE').length,
      minSurgeMultiplier: Number(minSurge) || 0.80,
      maxSurgeMultiplier: Number(maxSurge) || 1.30,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Custom Hiring Centre (CHC) Settings
            </h1>
            {isSaved && (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3 h-3" />
                <span>Changes Saved</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure hub identity, operating radius, district geofence, and automated pricing bounds.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hub Profile Details */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-agri-800" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Custom Hiring Centre Identity & Location
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700">Hub Business Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Kisan Seva Kendra / Regional Agri Hub"
                value={hubName}
                onChange={e => setHubName(e.target.value)}
                className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Operating District</label>
              <input
                type="text"
                required
                placeholder="e.g. Indore, Bhopal, Ujjain, Hoshangabad"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Village / Base Depot</label>
              <input
                type="text"
                placeholder="e.g. Sanwer, Mandideep, Bilkisganj"
                value={village}
                onChange={e => setVillage(e.target.value)}
                className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">State</label>
              <input
                type="text"
                required
                placeholder="e.g. Madhya Pradesh"
                value={stateName}
                onChange={e => setStateName(e.target.value)}
                className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Operating Service Radius (km)</label>
              <input
                type="number"
                min="5"
                max="150"
                value={radiusKm}
                onChange={e => setRadiusKm(e.target.value)}
                className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700">Direct Dispatch Hotline / Phone</label>
              <input
                type="text"
                placeholder="+91 98261 00000"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
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
              <label className="font-bold text-slate-700">Floor Multiplier (Off-Peak Minimum)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.05"
                  min="0.5"
                  max="1.0"
                  value={minSurge}
                  onChange={e => setMinSurge(e.target.value)}
                  className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                />
                <span className="font-bold text-slate-500">{Number(minSurge) * 100}% of base</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Ceiling Multiplier (Harvest Surge Maximum)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.05"
                  min="1.0"
                  max="2.0"
                  value={maxSurge}
                  onChange={e => setMaxSurge(e.target.value)}
                  className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                />
                <span className="font-bold text-slate-500">{Number(maxSurge) * 100}% of base</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="btn-primary text-xs py-3 px-6 bg-agri-700 hover:bg-agri-800 text-white font-extrabold shadow-md flex items-center gap-2 cursor-pointer rounded-xl"
          >
            <Save className="w-4 h-4" />
            <span>Save Hub Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
