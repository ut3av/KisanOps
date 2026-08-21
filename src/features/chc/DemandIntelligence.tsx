import React from 'react';
import {
  TrendingUp,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Tractor,
  Layers,
  IndianRupee,
  Activity,
  Truck
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import clsx from 'clsx';

export const DemandIntelligence: React.FC = () => {
  const { state, approveAllocation } = useKisanOpsStore();
  const { demandForecasts, allocations } = state;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Predictive Demand & Fleet Allocation Engine
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Explainable AI Intelligence
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Predicts future machinery requirements by synthesizing crop stage timelines, historical booking velocities, and regional acreage.
          </p>
        </div>
      </div>

      {/* Fleet Allocation Rebalancing Recommendation Hero */}
      <div className="bg-gradient-to-br from-agri-900 via-agri-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-elevated relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Deterministic Fleet Rebalancing Optimizer</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Recommended Fleet Relocation: Bhopal ➔ Sehore
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Target hub has a shortage of 2 combine harvesters. Source hub has surplus idle capacity.
            </p>
          </div>
        </div>

        {allocations.map(alloc => (
          <div
            key={alloc.id}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
          >
            <div className="md:col-span-4 space-y-1">
              <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider">Asset to Mobilize</div>
              <div className="text-base font-extrabold text-white">{alloc.machineModel}</div>
              <div className="text-xs text-slate-300 font-mono">{alloc.machineIdentifier} • {alloc.category}</div>
            </div>

            <div className="md:col-span-5 grid grid-cols-3 gap-2 text-xs">
              <div className="bg-black/30 p-2.5 rounded-xl">
                <div className="text-[10px] text-slate-400">Transit Route</div>
                <div className="font-bold text-white mt-0.5">{alloc.distanceKm} km</div>
                <div className="text-[10px] text-slate-400 mt-0.5">₹{alloc.relocationCost} cost</div>
              </div>

              <div className="bg-black/30 p-2.5 rounded-xl">
                <div className="text-[10px] text-slate-400">Utilization Gain</div>
                <div className="font-bold text-emerald-400 mt-0.5">+{alloc.expectedUtilizationGainPercent}%</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Idle to 92% active</div>
              </div>

              <div className="bg-black/30 p-2.5 rounded-xl">
                <div className="text-[10px] text-slate-400">Est. Revenue Gain</div>
                <div className="font-bold text-white mt-0.5">₹{alloc.estimatedRevenueGain.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-emerald-300 mt-0.5">Net ROI 26.7x</div>
              </div>
            </div>

            <div className="md:col-span-3 text-right">
              {alloc.status === 'APPROVED' ? (
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-4 py-2 rounded-xl text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Approved & Dispatched</span>
                </div>
              ) : (
                <button
                  onClick={() => approveAllocation(alloc.id)}
                  className="w-full btn-primary text-xs py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-agri-950 font-bold shadow-lg"
                >
                  Approve Relocation
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 7-Day Regional Demand Forecast Matrix */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              7-Day Regional Machinery Demand Forecast
            </h3>
            <p className="text-xs text-slate-500">
              Demand index evaluated by crop maturity calendar and historical rental velocity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {demandForecasts.map(df => (
            <div
              key={df.id}
              className={clsx(
                'rounded-2xl p-4 border transition-all space-y-3',
                df.shortageUnits > 0
                  ? 'bg-rose-50/60 border-rose-200 ring-2 ring-rose-500/20'
                  : 'bg-surface-50 border-slate-200/70'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{df.district}</span>
                <span
                  className={clsx(
                    'text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase',
                    df.demandLevel === 'VERY_HIGH'
                      ? 'bg-rose-500 text-white'
                      : df.demandLevel === 'HIGH'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-600 text-white'
                  )}
                >
                  {df.demandLevel.replace('_', ' ')}
                </span>
              </div>

              <div>
                <div className="text-base font-extrabold text-slate-900">{df.machineCategory}</div>
                <div className="text-xs text-slate-500">{df.cropName} ({df.cropStage})</div>
              </div>

              {/* Progress bar for Demand Index */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Demand Index:</span>
                  <span className="font-bold text-slate-800">{df.demandIndex} / 100</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      'h-full rounded-full',
                      df.demandIndex >= 80 ? 'bg-rose-500' : df.demandIndex >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    )}
                    style={{ width: `${df.demandIndex}%` }}
                  />
                </div>
              </div>

              {/* Unit balance metrics */}
              <div className="pt-2 border-t border-slate-200/80 grid grid-cols-3 gap-1 text-center text-xs">
                <div className="bg-white p-1.5 rounded-lg border border-slate-200/70">
                  <div className="text-[9px] text-slate-500">Expected</div>
                  <div className="font-bold text-slate-900">{df.expectedDemandUnits}</div>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-slate-200/70">
                  <div className="text-[9px] text-slate-500">Available</div>
                  <div className="font-bold text-slate-900">{df.availableUnits}</div>
                </div>
                <div className={clsx('p-1.5 rounded-lg border', df.shortageUnits > 0 ? 'bg-rose-100 border-rose-300 text-rose-900' : 'bg-white border-slate-200/70')}>
                  <div className="text-[9px] font-semibold">{df.shortageUnits > 0 ? 'Shortage' : 'Balance'}</div>
                  <div className="font-extrabold">{df.shortageUnits > 0 ? `-${df.shortageUnits}` : '✓ OK'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explainable Factor Weights Model Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Explainable Demand Model Factor Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="bg-surface-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
            <div className="font-bold text-slate-800">Harvest Season Window</div>
            <div className="text-emerald-700 font-extrabold text-base">+30 Pts</div>
            <p className="text-[11px] text-slate-500">Rabi wheat harvest peak season signal active across Sehore.</p>
          </div>

          <div className="bg-surface-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
            <div className="font-bold text-slate-800">Crop Stage Maturity</div>
            <div className="text-emerald-700 font-extrabold text-base">+25 Pts</div>
            <p className="text-[11px] text-slate-500">Farms reporting maturity/pre-harvest stage in 48-hour window.</p>
          </div>

          <div className="bg-surface-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
            <div className="font-bold text-slate-800">Historical Rental Velocity</div>
            <div className="text-emerald-700 font-extrabold text-base">+20 Pts</div>
            <p className="text-[11px] text-slate-500">Past 3-year combine rental frequency curve in district.</p>
          </div>

          <div className="bg-surface-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
            <div className="font-bold text-slate-800">Current Active Bookings</div>
            <div className="text-emerald-700 font-extrabold text-base">+15 Pts</div>
            <p className="text-[11px] text-slate-500">Current pre-booked machinery utilization and slots.</p>
          </div>

          <div className="bg-surface-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
            <div className="font-bold text-slate-800">Weather & Humidity Signal</div>
            <div className="text-emerald-700 font-extrabold text-base">+10 Pts</div>
            <p className="text-[11px] text-slate-500">Dry sunny conditions forecasted, ideal for rapid mechanical harvest.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
