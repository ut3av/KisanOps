import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tractor,
  TrendingUp,
  Activity,
  AlertTriangle,
  CalendarCheck,
  IndianRupee,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  MapPin,
  CheckCircle2,
  Database
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { StatCard } from '../../components/common/StatCard';
import { LeafletFleetMap } from '../../components/common/LeafletFleetMap';
import { TelematicsGaugeCluster } from '../../components/common/TelematicsGauge';
import { usePageTitle } from '../../hooks/usePageTitle';
import clsx from 'clsx';

export const CHCOverview: React.FC = () => {
  usePageTitle(
    'CHC Operations Hub | Fleet & Telematics',
    'Real-time Custom Hiring Centre operations, shortage alerts, and machine health.'
  );
  const { state, approveAllocation, loadDemoData } = useKisanOpsStore();
  const navigate = useNavigate();

  const { machines, demandForecasts, allocations, maintenanceAlerts, bookings, chcs, farm, currentTelemetry, simulationState } = state;

  const activeAlerts = maintenanceAlerts.filter(a => !a.isResolved);
  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'DISPATCHED' || b.status === 'IN_PROGRESS');
  const activeMachines = machines.filter(m => m.status === 'ACTIVE' || m.status === 'DISPATCHED');
  const regionalShortage = demandForecasts.find(df => df.shortageUnits > 0);
  const recommendedAlloc = allocations.find(a => a.status === 'RECOMMENDED');

  const firstMachine = machines[0];

  return (
    <div className="space-y-6">
      {/* Clean Production Slate Prompt when no data is loaded */}
      {machines.length === 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 rounded-3xl p-5 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Production Clean-Slate Active (0 Fleet Assets)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                No active machinery or telemetry records. Register your first equipment or load the demonstration dataset.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate('/chc/fleet')}
              className="btn-primary text-xs py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>+ Add Machinery</span>
            </button>
            <button
              onClick={() => loadDemoData()}
              className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Load Demo Data</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Demand Alert Hero if Shortage is Detected */}
      {regionalShortage && (
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-300 rounded-3xl p-5 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
              <TrendingUp className="w-6 h-6 shrink-0" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md shrink-0">
                  DEMAND SURGE ALERT ({regionalShortage.demandLevel} • {regionalShortage.demandIndex}/100)
                </span>
                <span className="text-xs font-mono font-bold text-amber-800">
                  {regionalShortage.district} Regional Zone
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                {regionalShortage.machineCategory} Shortage Detected: {regionalShortage.shortageUnits} Additional Units Needed
              </h3>
              <p className="text-xs text-slate-600">
                Predicted Demand: 5 Units • Locally Available: 3 Units. Reallocation from GreenFields Bhopal ready.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {recommendedAlloc && (
              <button
                onClick={() => approveAllocation(recommendedAlloc.id)}
                className="btn-primary text-xs py-2 px-4 shadow-sm bg-amber-800 hover:bg-amber-900 cursor-pointer"
              >
                Approve Reallocation
              </button>
            )}
            <button
              onClick={() => navigate('/chc/demand')}
              className="btn-secondary text-xs py-2 px-3 cursor-pointer"
            >
              View Forecast Matrix
            </button>
          </div>
        </div>
      )}

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Total Fleet"
          value={machines.length}
          subtitle={machines.length > 0 ? 'Across 3 hubs' : 'Clean baseline'}
          icon={Tractor}
          iconBg="bg-agri-50 text-agri-800"
          onClick={() => navigate('/chc/fleet')}
        />
        <StatCard
          title="Active in Field"
          value={activeMachines.length}
          subtitle={machines.length > 0 ? `${((activeMachines.length / Math.max(1, machines.length)) * 100).toFixed(0)}% deployed` : '0 deployed'}
          icon={Activity}
          iconBg="bg-sky-50 text-sky-800"
          onClick={() => navigate('/chc/telematics')}
        />
        <StatCard
          title="Utilization"
          value={machines.length > 0 ? '78.4%' : '0.0%'}
          subtitle={machines.length > 0 ? '+14% vs prev week' : 'No active rentals'}
          icon={TrendingUp}
          iconBg="bg-emerald-50 text-emerald-800"
          onClick={() => navigate('/chc/analytics')}
        />
        <StatCard
          title="Today Revenue"
          value={bookings.length > 0 ? '₹42,800' : '₹0'}
          subtitle={bookings.length > 0 ? `${bookings.length} bookings billed` : '0 bookings'}
          icon={IndianRupee}
          iconBg="bg-emerald-50 text-emerald-900"
          onClick={() => navigate('/chc/analytics')}
        />
        <StatCard
          title="Maintenance Alerts"
          value={activeAlerts.length}
          subtitle={activeAlerts.length > 0 ? 'Action required' : 'All systems nominal'}
          icon={AlertTriangle}
          iconBg={activeAlerts.length > 0 ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-700'}
          changeType={activeAlerts.length > 0 ? 'negative' : 'positive'}
          onClick={() => navigate('/chc/maintenance')}
        />
        <StatCard
          title="Pending Bookings"
          value={activeBookings.length}
          subtitle={activeBookings.length > 0 ? 'Awaiting dispatch' : 'Queue clear'}
          icon={CalendarCheck}
          iconBg="bg-amber-50 text-amber-800"
          onClick={() => navigate('/chc/bookings')}
        />
      </div>

      {/* Grid: Live Telematics Stream & Fleet Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  'w-2.5 h-2.5 rounded-full shrink-0',
                  firstMachine ? 'bg-emerald-500 radar-pulse' : 'bg-slate-400'
                )}
              />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide truncate">
                {firstMachine
                  ? `Live Operating Asset: ${firstMachine.brand} ${firstMachine.model} (${firstMachine.identifier})`
                  : 'CAN-Bus Telematics Gateway (Standby / Disconnected)'}
              </h3>
            </div>
            <button
              onClick={() => navigate('/chc/telematics')}
              className="text-xs font-bold text-agri-800 hover:text-agri-950 flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Fullscreen Telematics Hub</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>

          <TelematicsGaugeCluster
            telemetry={firstMachine ? currentTelemetry[firstMachine.id] : undefined}
            isAnomalyActive={simulationState.isFuelAnomalyActive}
          />
        </div>

        {/* Fleet Geographic Distribution Map */}
        <div className="lg:col-span-12 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Regional Fleet & Hub Geolocation
              </h3>
              <p className="text-xs text-slate-500">Live positions of CHCs, active machinery, and farm boundaries.</p>
            </div>
            <button
              onClick={() => navigate('/chc/telematics')}
              className="btn-secondary text-xs py-1.5 px-3 cursor-pointer"
            >
              Open Fleet Map
            </button>
          </div>

          <LeafletFleetMap
            chcs={chcs}
            farm={farm}
            machines={machines}
            activeTelemetry={currentTelemetry}
            height="380px"
          />
        </div>
      </div>
    </div>
  );
};
