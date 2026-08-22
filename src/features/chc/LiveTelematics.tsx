import React, { useState } from 'react';
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
  Clock,
  Cpu,
  Copy,
  Check,
  X,
  Code2
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { LeafletFleetMap } from '../../components/common/LeafletFleetMap';
import { TelematicsGaugeCluster } from '../../components/common/TelematicsGauge';
import { getSampleHardwareConfig } from '../../lib/iotIngestionEngine';
import { usePageTitle } from '../../hooks/usePageTitle';
import clsx from 'clsx';

export const LiveTelematics: React.FC = () => {
  usePageTitle(
    'Live CAN-Bus J1939 Telematics Stream',
    'Real-time GPS coordinates, engine RPM, coolant temperature, and fuel burn rates.'
  );
  const { state, toggleFuelAnomaly, toggleSimulation } = useKisanOpsStore();
  const { machines, chcs, farm, currentTelemetry, simulationState, isSimulating } = state;
  const [showIotModal, setShowIotModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const targetMachine = machines.find(m => m.id === 'mach-jd-harv-07') || machines[0];
  const telemetry = targetMachine ? currentTelemetry[targetMachine.id] : undefined;
  const hardwareConfig = getSampleHardwareConfig(targetMachine?.id || 'mach-jd-harv-07');

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(hardwareConfig.curlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!targetMachine) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-subtle space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto text-slate-400">
          <Tractor className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">No Machinery Fleet Registered</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Add tractors or harvesters in your CHC Hub Fleet to view real-time ECU J1939 CAN-Bus telematics and GPS tracking.
        </p>
      </div>
    );
  }

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
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowIotModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1b4d3e] text-white hover:bg-[#153e32] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-[#9dc84d] shrink-0" />
            <span>IoT Device Webhook API</span>
          </button>

          <button
            onClick={() => toggleFuelAnomaly()}
            className={clsx(
              'px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer',
              simulationState.isFuelAnomalyActive
                ? 'bg-rose-600 text-white border-rose-700 shadow-md animate-pulse'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            )}
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              {simulationState.isFuelAnomalyActive ? 'Fuel Anomaly Active (+17%)' : 'Inject Anomaly'}
            </span>
          </button>

          <button
            onClick={() => toggleSimulation()}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 shrink-0" />
            <span>{isSimulating ? 'Pause Stream' : 'Resume Stream'}</span>
          </button>
        </div>
      </div>

      {/* Main Telematics Gauge Cluster */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tractor className="w-4 h-4 text-agri-800 shrink-0" />
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
              Dispatched from Sehore Agri Centre &rarr; SH-18 &rarr; Bilkisganj Wheat Farm.
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

      {/* IoT Hardware Webhook API Modal */}
      {showIotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F5FAED] text-[#7aa32c] flex items-center justify-center border border-[#7aa32c]/30">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900 font-typewriter">
                    IoT Hardware & CAN-Bus Ingestion Gateway
                  </h3>
                  <p className="text-xs text-stone-500">
                    Connect Teltonika, Concox, or OBD-II GPS Trackers via HTTP Webhook or Edge Function
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIotModal(false)}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  1. Live Ingestion Webhook Endpoint (POST)
                </label>
                <div className="p-3 bg-stone-900 text-emerald-400 rounded-xl font-mono text-[11px] break-all select-all flex items-center justify-between gap-2">
                  <span>{hardwareConfig.endpointUrl}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-stone-700">
                    2. cURL Hardware Test Payload (J1939 ECU Telemetry)
                  </label>
                  <button
                    onClick={handleCopyCurl}
                    className="text-[11px] font-bold text-[#7aa32c] hover:text-[#5d7c22] flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy cURL'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-stone-900 text-slate-200 rounded-2xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-stone-800">
                  {hardwareConfig.curlSnippet}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Automated Anomaly Sentinel</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Incoming hardware streams are automatically evaluated for fuel burn rate deviations (+15% surge triggers an alert) and coolant overheating (&gt;100°C) with instant alerts sent to CHC hub dispatchers.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setShowIotModal(false)}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer"
              >
                Close Gateway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
