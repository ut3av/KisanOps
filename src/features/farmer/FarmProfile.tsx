import React from 'react';
import {
  Wheat,
  MapPin,
  Layers,
  Droplets,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Edit
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { LeafletFleetMap } from '../../components/common/LeafletFleetMap';
import { usePageTitle } from '../../hooks/usePageTitle';

export const FarmProfile: React.FC = () => {
  usePageTitle(
    'My Farm & Plot Polygon',
    'View geo-fenced farm boundary, crop stage, and soil composition.'
  );
  const { state } = useKisanOpsStore();
  const { farm, chcs } = state;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {farm.farmName}
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
              Verified Land Record (Khasra #142/8)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {farm.village}, {farm.district}, {farm.state} • {farm.sizeAcres} Total Cultivated Acres
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Farm Metadata Grid */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Active Crop & Soil Profile
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-surface-50 p-3 rounded-2xl border border-slate-200/70">
                <div className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                  <Wheat className="w-3.5 h-3.5 text-amber-600" />
                  <span>Primary Crop</span>
                </div>
                <div className="font-bold text-slate-900 text-sm mt-1">{farm.crop.cropName}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Rabi Season 2025-26</div>
              </div>

              <div className="bg-surface-50 p-3 rounded-2xl border border-slate-200/70">
                <div className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>Crop Stage</span>
                </div>
                <div className="font-bold text-emerald-700 text-sm mt-1">{farm.crop.cropStage}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Harvest window in 2 days</div>
              </div>

              <div className="bg-surface-50 p-3 rounded-2xl border border-slate-200/70">
                <div className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-earth-700" />
                  <span>Soil Composition</span>
                </div>
                <div className="font-bold text-slate-900 text-sm mt-1">{farm.soilType}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">High moisture retention</div>
              </div>

              <div className="bg-surface-50 p-3 rounded-2xl border border-slate-200/70">
                <div className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-600" />
                  <span>Irrigation Source</span>
                </div>
                <div className="font-bold text-slate-900 text-sm mt-1">{farm.irrigationType} Canal</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Kolar Canal Feed</div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Demand Engine Impact</span>
              </div>
              <p className="text-emerald-800 leading-relaxed text-[11px]">
                Your crop stage feeds directly into the regional Sehore demand prediction matrix, reserving priority combine harvesters and locking discounted base rental tariffs.
              </p>
            </div>
          </div>
        </div>

        {/* Boundary Map */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-subtle">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Geo-Fenced Farm Polygon Boundary
              </div>
              <span className="text-[11px] text-emerald-700 font-mono font-bold">8.0 ACRES VERIFIED</span>
            </div>
            <LeafletFleetMap
              chcs={chcs}
              farm={farm}
              height="360px"
              center={[farm.latitude, farm.longitude]}
              zoom={13}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
