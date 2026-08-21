import React from 'react';
import {
  Radio,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Zap,
  Gauge,
  Tractor,
  Activity,
  Layers,
  MapPin,
  Clock
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { LeafletFleetMap } from '../../components/common/LeafletFleetMap';
import { TelematicsGaugeCluster } from '../../components/common/TelematicsGauge';
import clsx from 'clsx';

export const LiveTelematics: React.FC = () => {
  const { state, toggleFuelAnomaly, toggleSimulation } = useKisanOpsStore();
  const { machines, chcs, farm, currentTelemetry, simulationState, isSimulating } = state;

  const targetMachine = machines.find(m => m.id === 'mach-jd-harv-07') || machines[0];
  const telemetry = currentTelemetry[targetMachine.id];

  return (
    <div className="space-y-6">
      {/* Header with Live Telematics Status & Anomaly Controls */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 radar-pulse" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Live Fleet Telematics & CAN-Bus Stream
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
              Stream Active (2000ms tick)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Streaming real-time telemetry from tractor and harvester electronic control units (ECU / J1939).
          </p>
        </div>

        {/* Live Controller Actions */}
        <div className="flex items-center gap-2">
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
              {simulationState.isFuelAnomalyActive ? 'Fuel Anomaly Triggered (+17%)' : 'Inject Fuel Anomaly (+17%)'}
            </span>
          </button>

          <button
            onClick={() => toggleSimulation()}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Pause Stream' : 'Resume Stream'}</span>
          </button>
        </div>
      </div>

      {/* Main Telematics Gauge Cluster */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tractor className="w-4 h-4 text-agri-800" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Selected Asset: {targetMachine.brand} {targetMachine.model} ({targetMachine.identifier})
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Assigned to: Ramesh Kumar (Bilkisganj 8-Acre Wheat)
          </span>
        </div>

        <TelematicsGaugeCluster
          telemetry={telemetry}
          isAnomalyActive={simulationState.isFuelAnomalyActive}
        />
      </div>

      {/* Live Map & Breadcrumb Route */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Live Transit & Field Route Map
            </h3>
            <p className="text-xs text-slate-500">
              Dispatched from Sehore Agri Centre ➔ SH-18 ➔ Bilkisganj Wheat Farm.
            </p>
          </div>
          <div className="text-xs font-mono bg-surface-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
            GPS: {telemetry?.latitude || 23.1870}° N, {telemetry?.longitude || 77.1005}° E
          </div>
        </div>

        <LeafletFleetMap
          chcs={chcs}
          farm={farm}
          machines={machines}
          activeTelemetry={currentTelemetry}
          selectedMachineId={targetMachine.id}
          height="480px"
        />
      </div>
    </div>
  );
};
