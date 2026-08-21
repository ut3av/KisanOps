import React from 'react';
import {
  Wrench,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Fuel,
  Thermometer,
  Zap,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { calculateMachineHealth } from '../../lib/maintenanceEngine';
import clsx from 'clsx';

export const PredictiveMaintenance: React.FC = () => {
  const { state, resolveAlert, toggleFuelAnomaly } = useKisanOpsStore();
  const { maintenanceAlerts, machines, currentTelemetry, simulationState } = state;

  const unresolvedAlerts = maintenanceAlerts.filter(a => !a.isResolved);
  const resolvedAlerts = maintenanceAlerts.filter(a => a.isResolved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Predictive Machinery Maintenance
            </h1>
            <span
              className={clsx(
                'text-xs font-bold px-2 py-0.5 rounded-md border',
                unresolvedAlerts.length > 0
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              )}
            >
              {unresolvedAlerts.length} Active Anomaly Alerts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time CAN-Bus sensor anomaly detection, component wear prediction, and preventative service schedules.
          </p>
        </div>

        <button
          onClick={() => toggleFuelAnomaly()}
          className={clsx(
            'px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border',
            simulationState.isFuelAnomalyActive
              ? 'bg-rose-600 text-white border-rose-700 shadow-md animate-pulse'
              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
          )}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>
            {simulationState.isFuelAnomalyActive ? 'Fuel Anomaly Triggered (+17%)' : 'Simulate Fuel Anomaly'}
          </span>
        </button>
      </div>

      {/* Active Predictive Maintenance Alerts */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          High-Priority Telematics Anomaly Alerts
        </h3>

        {unresolvedAlerts.length > 0 ? (
          <div className="space-y-3">
            {unresolvedAlerts.map(alert => (
              <div
                key={alert.id}
                className={clsx(
                  'rounded-3xl p-6 border shadow-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all',
                  alert.severity === 'HIGH' || alert.severity === 'CRITICAL'
                    ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20'
                    : 'bg-amber-50/70 border-amber-300'
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={clsx(
                      'w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0',
                      alert.severity === 'HIGH' || alert.severity === 'CRITICAL'
                        ? 'bg-rose-500 text-white'
                        : 'bg-amber-500 text-white'
                    )}
                  >
                    <AlertTriangle className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-base">
                        {alert.machineModel} ({alert.machineIdentifier})
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                        {alert.alertType} • {alert.severity}
                      </span>
                    </div>

                    <p className="text-xs text-rose-950 font-medium leading-relaxed">
                      {alert.description}
                    </p>

                    <div className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-rose-200/80 mt-2">
                      <strong>Prescribed Action:</strong> {alert.recommendedAction} (Resolve within {alert.urgencyHours}h)
                    </div>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto text-right">
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="w-full md:w-auto btn-primary text-xs py-2.5 px-5 bg-rose-800 hover:bg-rose-900 text-white shadow-md flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Inspection & Clear</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-900">All Fleet Sensor Parameters Nominal</h4>
            <p className="text-xs text-emerald-700">Zero active critical ECU fault codes across 24 machinery units.</p>
          </div>
        )}
      </div>

      {/* Fleet Component Health Score Matrix */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Multi-Dimensional Component Health Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {machines.slice(0, 6).map(machine => {
            const telemetry = currentTelemetry[machine.id];
            const healthBreakdown = calculateMachineHealth(machine, telemetry);
            const hoursToService = Math.max(0, Math.round(machine.serviceIntervalHours - machine.hoursSinceLastService));

            return (
              <div key={machine.id} className="bg-surface-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{machine.brand} {machine.model}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">{machine.identifier} • {machine.category}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black text-emerald-700 font-mono">
                      {healthBreakdown.overallHealthScore}%
                    </div>
                    <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                      {healthBreakdown.statusCategory}
                    </span>
                  </div>
                </div>

                {/* Progress breakdown */}
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Engine & Emissions</span>
                    <span className="font-bold text-slate-800">{healthBreakdown.engineParametersScore}/20 pts</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Fuel Burn Efficiency</span>
                    <span className="font-bold text-slate-800">{healthBreakdown.fuelEfficiencyScore}/20 pts</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Service Compliance</span>
                    <span className="font-bold text-slate-800">{healthBreakdown.serviceComplianceScore}/10 pts</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Service Due in:</span>
                  <span className={clsx('font-bold font-mono', hoursToService <= 30 ? 'text-rose-600' : 'text-slate-800')}>
                    {hoursToService} Operating Hours
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
