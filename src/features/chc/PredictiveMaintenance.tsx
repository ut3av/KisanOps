import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Wrench,
  Flame,
  Fuel,
  Activity,
  BatteryCharging,
  Clock,
  PlusCircle,
  X,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { calculateMachineHealth } from '../../lib/maintenanceEngine';
import { usePageTitle } from '../../hooks/usePageTitle';
import { MaintenanceAlertType, PredictiveMaintenanceAlert } from '../../types';
import clsx from 'clsx';

export const PredictiveMaintenance: React.FC = () => {
  usePageTitle(
    'Predictive Maintenance & Telematics Sentinels',
    'Early equipment failure warnings, fuel burn anomaly detection, and component health monitoring.'
  );

  const { state, resolveAlert, toggleFuelAnomaly, loadDemoData, createMaintenanceAlert } = useKisanOpsStore();
  const { maintenanceAlerts, machines, currentTelemetry, simulationState } = state;

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState(machines[0]?.id || 'mach-jd-harv-07');
  const [ticketAlertType, setTicketAlertType] = useState<MaintenanceAlertType>('SERVICE_OVERDUE');
  const [ticketSeverity, setTicketSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketAction, setTicketAction] = useState('');

  const unresolvedAlerts = maintenanceAlerts.filter(a => !a.isResolved);
  const resolvedAlerts = maintenanceAlerts.filter(a => a.isResolved);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMachine = machines.find(m => m.id === selectedMachineId);

    createMaintenanceAlert({
      machineId: selectedMachineId,
      machineIdentifier: targetMachine?.identifier || 'MACH-01',
      machineModel: `${targetMachine?.brand} ${targetMachine?.model}`,
      alertType: ticketAlertType,
      severity: ticketSeverity,
      description: ticketDesc || `Scheduled inspection for ${ticketAlertType.replace('_', ' ')}`,
      recommendedAction: ticketAction || 'Perform comprehensive 30-point diagnostics and replace fluids.',
      urgencyHours: ticketSeverity === 'CRITICAL' ? 4 : ticketSeverity === 'HIGH' ? 24 : 48,
    });

    setIsTicketModalOpen(false);
    setTicketDesc('');
    setTicketAction('');
  };

  const handleTriggerQuickAnomaly = (type: MaintenanceAlertType) => {
    const targetMachine = machines[0] || { id: 'mach-jd-harv-07', identifier: 'MP-04-HA-1001', brand: 'John Deere', model: 'W70' };

    let description = '';
    let action = '';
    let severity: 'HIGH' | 'CRITICAL' = 'HIGH';

    if (type === 'TEMP_SURGE') {
      description = 'Engine coolant temperature spiked to 109°C exceeding safe thermal operational limit (100°C).';
      action = 'Halt machine immediately. Inspect coolant level, radiator debris, and fan belt tension.';
      severity = 'CRITICAL';
    } else if (type === 'FUEL_ANOMALY') {
      description = 'CAN-Bus detected fuel burn rate at 12.4 L/h (+72% surge above 7.2 L/h baseline). Possible injector nozzle leak or fuel siphoning.';
      action = 'Inspect fuel line joints and pressure regulator within 24 hours.';
      severity = 'HIGH';
    } else if (type === 'VIBRATION_SPIKE') {
      description = 'Excessive vibration and engine redline at 2650 RPM exceeding rated continuous rpm threshold (2200 RPM).';
      action = 'Throttle down immediately. Inspect transmission PTO shaft and governor linkages.';
      severity = 'HIGH';
    } else if (type === 'BATTERY_LOW') {
      description = 'Alternator charging voltage collapsed to 11.1V under active operating load.';
      action = 'Test alternator drive belt and inspect battery terminal cables.';
      severity = 'HIGH';
    } else if (type === 'SERVICE_OVERDUE') {
      description = 'Machine engine hours (252.4 hrs) exceeded manufacturer 250h preventative maintenance interval.';
      action = 'Schedule 250-hour oil, air filter, and hydraulic filter change.';
      severity = 'HIGH';
    }

    createMaintenanceAlert({
      machineId: targetMachine.id,
      machineIdentifier: targetMachine.identifier,
      machineModel: `${targetMachine.brand} ${targetMachine.model}`,
      alertType: type,
      severity,
      description,
      recommendedAction: action,
      urgencyHours: severity === 'CRITICAL' ? 2 : 24,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Predictive Machinery Maintenance & Sentinels
            </h1>
            <span
              className={clsx(
                'text-xs font-extrabold px-2.5 py-0.5 rounded-full border shrink-0',
                unresolvedAlerts.length > 0
                  ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
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

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Create Service Ticket</span>
          </button>

          <button
            onClick={() => toggleFuelAnomaly()}
            className={clsx(
              'px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border shrink-0 cursor-pointer',
              simulationState.isFuelAnomalyActive
                ? 'bg-rose-600 text-white border-rose-700 shadow-md animate-pulse'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            )}
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              {simulationState.isFuelAnomalyActive ? 'Fuel Sensor Alert Active (+17%)' : 'Test Telematics Anomaly'}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Anomaly Sentinel Injection Bar */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-subtle space-y-2">
        <div className="text-[11px] font-bold uppercase text-slate-500 tracking-wider px-1">
          Test Automated Telematics Sentinels:
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTriggerQuickAnomaly('TEMP_SURGE')}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold text-rose-800 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>Trigger Thermal Overheat (&gt;100°C)</span>
          </button>

          <button
            onClick={() => handleTriggerQuickAnomaly('FUEL_ANOMALY')}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold text-amber-800 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Fuel className="w-3.5 h-3.5 text-amber-600" />
            <span>Trigger Fuel Anomaly (+72%)</span>
          </button>

          <button
            onClick={() => handleTriggerQuickAnomaly('VIBRATION_SPIKE')}
            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-bold text-purple-800 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-purple-600" />
            <span>Trigger Redline Vibration (2650 RPM)</span>
          </button>

          <button
            onClick={() => handleTriggerQuickAnomaly('BATTERY_LOW')}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold text-blue-800 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <BatteryCharging className="w-3.5 h-3.5 text-blue-600" />
            <span>Trigger Alternator Fault (11.1V)</span>
          </button>

          <button
            onClick={() => handleTriggerQuickAnomaly('SERVICE_OVERDUE')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span>Trigger Service Overdue (250h)</span>
          </button>
        </div>
      </div>

      {/* Active Predictive Maintenance Alerts */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Active Telematics Anomaly Alerts & Service Tickets
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
                    <AlertTriangle className="w-6 h-6 shrink-0" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-base">
                        {alert.machineModel} ({alert.machineIdentifier})
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-200 text-rose-900 shrink-0">
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

                <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => resolveAlert(alert.id, 'AVAILABLE')}
                    className="w-full md:w-auto btn-primary text-xs py-2.5 px-5 bg-rose-800 hover:bg-rose-900 text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Complete Inspection & Restore Available</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-900">All Fleet Sensor Parameters Nominal</h4>
            <p className="text-xs text-emerald-700">Zero active critical ECU fault codes across {machines.length} registered units.</p>
          </div>
        )}
      </div>

      {/* Fleet Component Health Score Matrix */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Multi-Dimensional Component Health Matrix
        </h3>

        {machines.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/90 shadow-subtle space-y-4 max-w-lg mx-auto my-4">
            <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto text-amber-500">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Fleet Telematics Feeds Active</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              No agricultural machinery assets are currently registered in this hub workspace. You can load sample demo telemetry or register equipment in Fleet Management.
            </p>
            <button
              onClick={() => loadDemoData()}
              className="btn-primary text-xs py-2.5 px-5 bg-amber-500 hover:bg-amber-600 text-white inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ Load Sample Demo Telematics</span>
            </button>
          </div>
        ) : (
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
        )}
      </div>

      {/* Create Manual Service Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Create Machinery Service Ticket
                  </h3>
                  <p className="text-xs text-slate-500">Dispatch inspection or preventative maintenance</p>
                </div>
              </div>
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Target Machinery Asset</label>
                <select
                  value={selectedMachineId}
                  onChange={e => setSelectedMachineId(e.target.value)}
                  className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 cursor-pointer"
                >
                  {machines.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.brand} {m.model} ({m.identifier}) • {m.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Anomaly / Ticket Type</label>
                  <select
                    value={ticketAlertType}
                    onChange={e => setTicketAlertType(e.target.value as any)}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 cursor-pointer"
                  >
                    <option value="SERVICE_OVERDUE">Scheduled 250h Service</option>
                    <option value="TEMP_SURGE">Coolant Overheating</option>
                    <option value="FUEL_ANOMALY">Fuel Anomaly / Leak</option>
                    <option value="VIBRATION_SPIKE">Vibration / PTO Redline</option>
                    <option value="BATTERY_LOW">Battery / Alternator Fault</option>
                    <option value="HYDRAULIC_DROP">Hydraulic Pressure Loss</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Severity Level</label>
                  <select
                    value={ticketSeverity}
                    onChange={e => setTicketSeverity(e.target.value as any)}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 cursor-pointer"
                  >
                    <option value="LOW">Low (Routine Check)</option>
                    <option value="MEDIUM">Medium (Within 48h)</option>
                    <option value="HIGH">High (Within 24h)</option>
                    <option value="CRITICAL">Critical (Immediate Halt)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Issue Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe observed sensor symptoms or mechanical defects..."
                  value={ticketDesc}
                  onChange={e => setTicketDesc(e.target.value)}
                  className="w-full bg-surface-50 border border-slate-200 rounded-xl p-3 font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Recommended Mechanic Action</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Replace hydraulic seals, flush radiator coolant..."
                  value={ticketAction}
                  onChange={e => setTicketAction(e.target.value)}
                  className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold cursor-pointer"
                >
                  Dispatch Service Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
