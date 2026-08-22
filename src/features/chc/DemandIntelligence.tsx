import React, { useState } from 'react';
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
  Truck,
  Brain,
  FileText,
  Clock,
  BarChart3,
  Calendar,
  CloudRain,
  Flame,
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { WeatherRadarCard } from '../../components/common/WeatherRadarCard';
import { IntelligenceReportModal } from '../../components/common/IntelligenceReportModal';
import { usePageTitle } from '../../hooks/usePageTitle';
import clsx from 'clsx';

export const DemandIntelligence: React.FC = () => {
  usePageTitle(
    'CHC Fleet & Demand Intelligence Control',
    'Forecast multi-window machinery demand, detect supply-demand gaps, analyze machine profitability, and optimize cross-hub fleet relocation.'
  );

  const { state, approveAllocation, loadDemoData } = useKisanOpsStore();
  const { demandForecasts, allocations, dailyFleetBrief, weeklyFleetReport, machines, chcs, bookings } = state;

  const [forecastTab, setForecastTab] = useState<'7_DAYS' | '3_DAYS' | '24_HOURS'>('7_DAYS');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Banner: KisanOps CHC Daily Fleet Intelligence Brief */}
      {dailyFleetBrief && (
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    KisanOps Fleet Intelligence
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {dailyFleetBrief.date} • {dailyFleetBrief.chcName}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-white mt-1">
                  {dailyFleetBrief.headline}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="btn-primary text-xs py-2 px-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Weekly Fleet Report (PDF)</span>
              </button>
            </div>
          </div>

          <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10 text-xs">
            <div className="md:col-span-8 space-y-2">
              <p className="text-slate-300 leading-relaxed font-medium">
                <strong>Strategic Recommendation:</strong> {dailyFleetBrief.topRecommendation}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{dailyFleetBrief.fleetCapacitySummary}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>{dailyFleetBrief.demandOutlook}</span>
                </span>
              </div>
            </div>

            <div className="md:col-span-4 p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Revenue Optimization Gain</div>
              <div className="text-sm font-extrabold text-emerald-400">
                {dailyFleetBrief.revenueOpportunity}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fleet Allocation Rebalancing Recommendation Hero */}
      <div className="bg-gradient-to-br from-agri-900 via-agri-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-elevated relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Deterministic Fleet Rebalancing Optimizer</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              {allocations.length > 0 ? (
                <>
                  <span>Recommended Fleet Relocation: {allocations[0]?.sourceDistrict || 'Surplus Hub'}</span>
                  <ArrowRight className="w-5 h-5 text-emerald-400" />
                  <span>{allocations[0]?.targetDistrict || 'Deficit Hub'}</span>
                </>
              ) : (
                <span>Fleet Distribution & Demand Intelligence Radar</span>
              )}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {allocations.length > 0
                ? 'Target hub has a shortage of combine harvesters. Source hub has surplus idle capacity.'
                : 'All regional custom hiring centres are currently balanced or operating in clean baseline.'}
            </p>
          </div>
        </div>

        {allocations.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 text-center space-y-3">
            <p className="text-xs text-slate-300">
              No active relocation recommendations pending approval in clean production mode.
            </p>
            <button
              onClick={() => loadDemoData()}
              className="btn-primary text-xs py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Demo Forecast & Allocations</span>
            </button>
          </div>
        ) : (
          allocations.map(alloc => (
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
                    className="w-full btn-primary text-xs py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-agri-950 font-bold shadow-lg cursor-pointer"
                  >
                    Approve Relocation
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Meteorological Weather Risk & Rainfall Radar */}
      <WeatherRadarCard district={state.chcs[0]?.district || state.farm.district || 'Central District'} />

      {/* Multi-Window Regional Demand Forecast Matrix */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Geospatial Supply-Demand Capacity Gap Forecast
              </h3>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-amber-700" />
                Weather-Correlated (+35% Harvest Surge)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Correlates crop stage calendar, active booking pipeline, and pre-rain harvest acceleration signals.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setForecastTab('24_HOURS')}
              className={clsx(
                'text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer',
                forecastTab === '24_HOURS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              24 Hours
            </button>
            <button
              onClick={() => setForecastTab('3_DAYS')}
              className={clsx(
                'text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer',
                forecastTab === '3_DAYS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              3 Days
            </button>
            <button
              onClick={() => setForecastTab('7_DAYS')}
              className={clsx(
                'text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer',
                forecastTab === '7_DAYS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              7 Days
            </button>
          </div>
        </div>

        {demandForecasts.length === 0 ? (
          <div className="p-8 text-center bg-surface-50 rounded-2xl border border-slate-200/80 space-y-2">
            <p className="text-xs text-slate-500 font-medium">
              No regional demand forecasts registered in clean production baseline.
            </p>
          </div>
        ) : (
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
                    <div className="font-extrabold">{df.shortageUnits > 0 ? `-${df.shortageUnits}` : 'Balanced'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Machine Profitability & Idle Asset Sentinel */}
      {weeklyFleetReport && weeklyFleetReport.machineProfitabilityRankings.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Asset-Level Profitability & Idle Sentinel Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Net contribution calculated after diesel fuel, maintenance, transport, and idle opportunity costs.
                </p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Machine Asset</th>
                  <th className="p-3">Gross Revenue</th>
                  <th className="p-3">Fuel & Maint. Cost</th>
                  <th className="p-3">Net Contribution</th>
                  <th className="p-3">Idle Hours (7d)</th>
                  <th className="p-3">Intelligence Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {weeklyFleetReport.machineProfitabilityRankings.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-400">#{m.profitabilityRank}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{m.machineModel}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{m.machineIdentifier} • {m.chcName}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-900">₹{m.totalGrossRevenue.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-rose-700">₹{(m.fuelExpenses + m.maintenanceExpenses).toLocaleString('en-IN')}</td>
                    <td className="p-3 font-bold text-emerald-800">₹{m.netContributionProfit.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={clsx('px-2 py-0.5 rounded font-mono text-[11px]', m.idleHoursLast7d >= 30 ? 'bg-amber-100 text-amber-800 font-bold' : 'text-slate-600')}>
                        {m.idleHoursLast7d} hrs
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {m.recommendation}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5 max-w-xs">{m.recommendationReason}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Intelligence Weekly Report Modal */}
      <IntelligenceReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        fleetReport={weeklyFleetReport}
      />
    </div>
  );
};
