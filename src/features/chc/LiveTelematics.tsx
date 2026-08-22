import React, { useState } from 'react';
import {
  Radio,
  Sparkles,
  AlertTriangle,
  Tractor,
  Activity,
  MapPin,
  Cpu,
  Copy,
  Check,
  X,
  Smartphone,
  Navigation,
  Send,
  Sliders,
  CheckCircle2,
  Fuel,
  BatteryCharging,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { LeafletFleetMap } from '../../components/common/LeafletFleetMap';
import { TelematicsGaugeCluster } from '../../components/common/TelematicsGauge';
import {
  getSampleHardwareConfig,
  HardwareTelemetryPayload,
} from '../../lib/iotIngestionEngine';
import { getLocationFreshness } from '../../lib/availabilityService';
import { usePageTitle } from '../../hooks/usePageTitle';
import { TelemetryModeType } from '../../types';
import clsx from 'clsx';

export const LiveTelematics: React.FC = () => {
  usePageTitle(
    'Fleet Telematics & Real-Time Operations Control Center',
    'Tri-mode GPS tracking (Manual, Driver Mobile, Hardware IoT), live CAN-Bus gauges, and anomaly sentinels.'
  );

  const {
    state,
    toggleFuelAnomaly,
    toggleSimulation,
    loadDemoData,
    ingestTelemetryPayload,
    ingestOperatorGps,
    ingestManualLocation,
  } = useKisanOpsStore();

  const { machines, chcs, farm, currentTelemetry, simulationState, isSimulating } = state;

  const [selectedMachineId, setSelectedMachineId] = useState<string>(
    machines[0]?.id || 'mach-jd-harv-07'
  );
  const [activeIngestionMode, setActiveIngestionMode] = useState<TelemetryModeType>('HARDWARE_IOT');
  const [showIotModal, setShowIotModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [injectionNotice, setInjectionNotice] = useState<string | null>(null);

  // Mode 1: Manual Location State
  const targetMachine = machines.find(m => m.id === selectedMachineId) || machines[0];
  const telemetry = targetMachine ? currentTelemetry[targetMachine.id] : undefined;

  const [manualLat, setManualLat] = useState<number>(targetMachine?.latitude || 23.2030);
  const [manualLon, setManualLon] = useState<number>(targetMachine?.longitude || 77.0844);
  const [parkingPreset, setParkingPreset] = useState<string>('SEHORE_HUB');

  // Mode 2: Operator Mobile GPS State
  const [simulatedOperatorSpeed, setSimulatedOperatorSpeed] = useState<number>(14.5);
  const [operatorLinkCopied, setOperatorLinkCopied] = useState<boolean>(false);

  // Mode 3: Hardware Payload State
  const hardwareConfig = getSampleHardwareConfig(targetMachine?.id || 'mach-jd-harv-07');

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(hardwareConfig.curlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyOperatorLink = () => {
    const link = `${window.location.origin}/operator?machineId=${targetMachine?.id}`;
    navigator.clipboard.writeText(link);
    setOperatorLinkCopied(true);
    setTimeout(() => setOperatorLinkCopied(false), 2500);
  };

  const handleApplyManualLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMachine) return;

    ingestManualLocation({
      machineId: targetMachine.id,
      latitude: Number(manualLat),
      longitude: Number(manualLon),
      parkingLocationName: parkingPreset,
    });

    setInjectionNotice(`Manual coordinates updated to (${manualLat.toFixed(4)}, ${manualLon.toFixed(4)})`);
    setTimeout(() => setInjectionNotice(null), 3500);
  };

  const handleApplyPresetLocation = (preset: string) => {
    setParkingPreset(preset);
    if (preset === 'SEHORE_HUB') {
      setManualLat(23.2030);
      setManualLon(77.0844);
    } else if (preset === 'BHOPAL_DEPOT') {
      setManualLat(23.2599);
      setManualLon(77.4126);
    } else if (preset === 'BILKISGANJ_FARM') {
      setManualLat(23.1642);
      setManualLon(77.1215);
    } else if (preset === 'HIGHWAY_SH18') {
      setManualLat(23.1950);
      setManualLon(77.0910);
    }
  };

  const handleSimulateOperatorGpsPing = () => {
    if (!targetMachine) return;

    // Small jitter to simulate mobile movement
    const jitterLat = (Math.random() - 0.5) * 0.003;
    const jitterLon = (Math.random() - 0.5) * 0.003;
    const newLat = (targetMachine.latitude || 23.1872) + jitterLat;
    const newLon = (targetMachine.longitude || 77.1008) + jitterLon;

    ingestOperatorGps({
      machineId: targetMachine.id,
      latitude: newLat,
      longitude: newLon,
      speedKmh: simulatedOperatorSpeed,
      accuracyMetres: 4.2,
      headingDeg: Math.floor(Math.random() * 360),
    });

    setInjectionNotice(`Received Driver Mobile GPS ping: ${newLat.toFixed(4)}° N, ${newLon.toFixed(4)}° E (${simulatedOperatorSpeed} km/h)`);
    setTimeout(() => setInjectionNotice(null), 3500);
  };

  const handleInjectHardwarePreset = (presetType: 'NORMAL' | 'TRANSIT' | 'OVERHEAT' | 'FUEL_LEAK' | 'REDLINE' | 'LOW_BATTERY') => {
    if (!targetMachine) return;

    let payload: HardwareTelemetryPayload;
    const baseLat = targetMachine.latitude || 23.1872;
    const baseLon = targetMachine.longitude || 77.1008;

    switch (presetType) {
      case 'NORMAL':
        payload = {
          machineId: targetMachine.id,
          deviceId: targetMachine.identifier,
          latitude: baseLat + 0.0005,
          longitude: baseLon + 0.0005,
          speedKmh: 6.5,
          headingDeg: 135,
          fuelLevelPercent: 74.0,
          fuelConsumptionRateLph: 7.2,
          engineHours: targetMachine.totalEngineHours + 0.2,
          engineTemperatureC: 84,
          rpm: 1950,
          batteryVoltage: 13.8,
          hydraulicPressureBar: 160,
          status: 'ACTIVE',
        };
        break;

      case 'TRANSIT':
        payload = {
          machineId: targetMachine.id,
          deviceId: targetMachine.identifier,
          latitude: 23.1950,
          longitude: 77.0910,
          speedKmh: 26.5,
          headingDeg: 210,
          fuelLevelPercent: 71.5,
          fuelConsumptionRateLph: 5.4,
          engineHours: targetMachine.totalEngineHours + 0.5,
          engineTemperatureC: 86,
          rpm: 1750,
          batteryVoltage: 13.9,
          hydraulicPressureBar: 40,
          status: 'DISPATCHED',
        };
        break;

      case 'OVERHEAT':
        payload = {
          machineId: targetMachine.id,
          deviceId: targetMachine.identifier,
          latitude: baseLat,
          longitude: baseLon,
          speedKmh: 4.2,
          headingDeg: 90,
          fuelLevelPercent: 65.0,
          fuelConsumptionRateLph: 8.8,
          engineHours: targetMachine.totalEngineHours + 1.1,
          engineTemperatureC: 109, // Critical Overheating
          rpm: 2150,
          batteryVoltage: 13.4,
          hydraulicPressureBar: 170,
          status: 'MAINTENANCE',
        };
        break;

      case 'FUEL_LEAK':
        payload = {
          machineId: targetMachine.id,
          deviceId: targetMachine.identifier,
          latitude: baseLat,
          longitude: baseLon,
          speedKmh: 5.0,
          headingDeg: 180,
          fuelLevelPercent: 42.0,
          fuelConsumptionRateLph: 12.4, // +72% surge
          engineHours: targetMachine.totalEngineHours + 0.3,
          engineTemperatureC: 92,
          rpm: 2000,
          batteryVoltage: 13.6,
          hydraulicPressureBar: 155,
          status: 'ACTIVE',
        };
        break;

      case 'REDLINE':
        payload = {
          machineId: targetMachine.id,
          deviceId: targetMachine.identifier,
          latitude: baseLat,
          longitude: baseLon,
          speedKmh: 8.5,
          headingDeg: 45,
          fuelLevelPercent: 55.0,
          fuelConsumptionRateLph: 9.6,
          engineHours: targetMachine.totalEngineHours + 0.4,
          engineTemperatureC: 96,
          rpm: 2650, // Critical Redline
          batteryVoltage: 14.1,
          hydraulicPressureBar: 190,
          status: 'ACTIVE',
        };
        break;

      case 'LOW_BATTERY':
        payload = {
          machineId: targetMachine.id,
          deviceId: targetMachine.identifier,
          latitude: baseLat,
          longitude: baseLon,
          speedKmh: 0.0,
          headingDeg: 0,
          fuelLevelPercent: 80.0,
          fuelConsumptionRateLph: 0.0,
          engineHours: targetMachine.totalEngineHours,
          engineTemperatureC: 50,
          rpm: 600,
          batteryVoltage: 11.1, // Critical Low
          hydraulicPressureBar: 0,
          status: 'AVAILABLE',
        };
        break;
    }

    const res = ingestTelemetryPayload(payload);
    if (res.anomalyDetected) {
      setInjectionNotice(`🚨 Anomaly Detected & Flagged: ${res.alerts.map(a => a.alertType).join(', ')}`);
    } else {
      setInjectionNotice(`✅ Successfully Ingested IoT Telemetry for ${targetMachine.brand} ${targetMachine.model}`);
    }
    setTimeout(() => setInjectionNotice(null), 4000);
  };

  if (!targetMachine) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-subtle space-y-4 max-w-lg mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
          <Radio className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">No Machinery Fleet Registered</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          No machines found in your hub yet. Register your fleet assets or load the demo dataset to unlock the Live Telematics Control Center.
        </p>
        <button
          onClick={() => loadDemoData()}
          className="btn-primary text-xs py-2.5 px-5 bg-amber-500 hover:bg-amber-600 text-white inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Load Demonstration Fleet</span>
        </button>
      </div>
    );
  }

  const freshness = getLocationFreshness(
    targetMachine.locationUpdatedAt || telemetry?.timestamp,
    targetMachine.locationSource
  );

  return (
    <div className="space-y-6">
      {/* Header with Live Status & Mode Indicators */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Fleet Telematics & Operations Control Center
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full">
              PostGIS ↔ Telematics Synced
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Centralized CAN-Bus telemetry, multi-modal GPS ingestion, and real-time farmer availability dispatch.
          </p>
        </div>

        {/* Global Simulation & IoT Webhook Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowIotModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>API / Webhook Setup</span>
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
              {simulationState.isFuelAnomalyActive ? 'Diesel Leak Alert Active (+17%)' : 'Inject Telematics Anomaly'}
            </span>
          </button>

          <button
            onClick={() => toggleSimulation()}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 shrink-0" />
            <span>{isSimulating ? 'Pause Telemetry' : 'Resume Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Notice Banner when telemetry payload is injected */}
      {injectionNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{injectionNotice}</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-emerald-200/80 px-2 py-0.5 rounded text-emerald-900">
            Synced with Farmer Search
          </span>
        </div>
      )}

      {/* Fleet Asset Selector Strip */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-subtle space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
            Select Machinery Asset ({machines.length} Units in Registry):
          </span>
          <span className="text-xs text-slate-500 font-mono">
            Active Hub: {targetMachine.chcName}
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {machines.map(m => {
            const mTelemetry = currentTelemetry[m.id];
            const mFreshness = getLocationFreshness(
              m.locationUpdatedAt || mTelemetry?.timestamp,
              m.locationSource
            );
            const isSelected = m.id === selectedMachineId;

            return (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMachineId(m.id);
                  setManualLat(m.latitude || 23.2030);
                  setManualLon(m.longitude || 77.0844);
                }}
                className={clsx(
                  'px-3.5 py-2.5 rounded-2xl border transition-all text-left shrink-0 cursor-pointer flex items-center gap-3',
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md ring-2 ring-emerald-400/40'
                    : 'bg-surface-50 border-slate-200/80 text-slate-800 hover:bg-surface-100'
                )}
              >
                <div
                  className={clsx(
                    'w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0',
                    isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white text-slate-700 shadow-2xs'
                  )}
                >
                  <Tractor className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs leading-tight">{m.brand} {m.model}</span>
                    <span
                      className={clsx(
                        'w-2 h-2 rounded-full',
                        mFreshness.status === 'LIVE'
                          ? 'bg-emerald-500 animate-pulse'
                          : mFreshness.status === 'RECENT'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      )}
                    />
                  </div>
                  <div className={clsx('text-[10px] font-mono mt-0.5', isSelected ? 'text-slate-300' : 'text-slate-500')}>
                    {m.identifier} • {m.status}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tri-Mode Telematics Ingestion & Control Hub */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <h3 className="text-base font-extrabold text-slate-900">
                Telemetry Control Mode: {targetMachine.brand} {targetMachine.model} ({targetMachine.identifier})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose how real-time location and telemetry are ingested for this machinery asset.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setActiveIngestionMode('MANUAL')}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                activeIngestionMode === 'MANUAL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Mode 1: Manual GPS</span>
            </button>

            <button
              onClick={() => setActiveIngestionMode('OPERATOR_GPS')}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                activeIngestionMode === 'OPERATOR_GPS'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mode 2: Driver Mobile GPS</span>
            </button>

            <button
              onClick={() => setActiveIngestionMode('HARDWARE_IOT')}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                activeIngestionMode === 'HARDWARE_IOT'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Cpu className="w-3.5 h-3.5 text-purple-600" />
              <span>Mode 3: Hardware / Fleet API</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Manual Location Setter */}
        {activeIngestionMode === 'MANUAL' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start bg-blue-50/40 p-4 sm:p-5 rounded-2xl border border-blue-200/70">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-extrabold text-[10px] uppercase rounded-md">
                  Mode 1: Manual Location Setting
                </span>
                <span className="text-xs text-slate-600">
                  Ideal when machine has no GPS tracker, is parked at depot, or tracker is offline.
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs font-bold text-slate-700 self-center">Quick Presets:</span>
                {[
                  { label: 'Sehore CHC Depot', key: 'SEHORE_HUB' },
                  { label: 'GreenFields Bhopal', key: 'BHOPAL_DEPOT' },
                  { label: 'Bilkisganj Farm Area', key: 'BILKISGANJ_FARM' },
                  { label: 'Highway SH-18 Bypass', key: 'HIGHWAY_SH18' },
                ].map(p => (
                  <button
                    key={p.key}
                    onClick={() => handleApplyPresetLocation(p.key)}
                    className={clsx(
                      'px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer',
                      parkingPreset === p.key
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleApplyManualLocation} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Latitude (°N)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={manualLat}
                    onChange={e => setManualLat(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Longitude (°E)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={manualLon}
                    onChange={e => setManualLon(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full btn-primary text-xs py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Manual GPS</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-4 bg-white p-3.5 rounded-2xl border border-slate-200/90 text-xs space-y-2">
              <div className="font-extrabold text-slate-900">Current Manual Position</div>
              <div className="text-slate-600 space-y-1 font-mono text-[11px]">
                <div>Latitude: {targetMachine.latitude ? targetMachine.latitude.toFixed(4) : '23.2030'}° N</div>
                <div>Longitude: {targetMachine.longitude ? targetMachine.longitude.toFixed(4) : '77.0844'}° E</div>
                <div>Source: <span className="font-bold text-blue-700">{targetMachine.locationSource || 'chc_manual'}</span></div>
                <div>Updated: {freshness.text}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Operator Mobile GPS Receiver */}
        {activeIngestionMode === 'OPERATOR_GPS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start bg-emerald-50/40 p-4 sm:p-5 rounded-2xl border border-emerald-200/70">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] uppercase rounded-md">
                  Mode 2: Driver Mobile GPS Tracking
                </span>
                <span className="text-xs text-slate-600">
                  Streams high-accuracy GPS directly from the machine operator’s smartphone.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Assigned Machine Operator</div>
                  <div className="font-extrabold text-slate-900 text-sm">{targetMachine.operatorName || 'Raju Verma'}</div>
                  <div className="text-xs text-slate-600 font-mono">{targetMachine.operatorPhone || '+91 98260 00000'}</div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Driver Pairing Link</div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      onClick={handleCopyOperatorLink}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer w-full justify-center"
                    >
                      {operatorLinkCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{operatorLinkCopied ? 'Link Copied!' : 'Copy Driver GPS Link'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700">Simulate Speed:</span>
                  <input
                    type="range"
                    min="0"
                    max="35"
                    value={simulatedOperatorSpeed}
                    onChange={e => setSimulatedOperatorSpeed(Number(e.target.value))}
                    className="w-28 accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-slate-900">{simulatedOperatorSpeed} km/h</span>
                </div>

                <button
                  onClick={handleSimulateOperatorGpsPing}
                  className="btn-primary text-xs py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Send Driver GPS Beacon</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-3.5 rounded-2xl border border-slate-200/90 text-xs space-y-2">
              <div className="font-extrabold text-slate-900">Driver Stream Telemetry</div>
              <div className="text-slate-600 space-y-1 font-mono text-[11px]">
                <div>Speed: <span className="font-bold text-emerald-700">{telemetry?.speedKmh || simulatedOperatorSpeed} km/h</span></div>
                <div>Accuracy: ±{targetMachine.locationAccuracy || 4.5} metres</div>
                <div>Heading: {telemetry?.headingDeg || 135}°</div>
                <div>Source: <span className="font-bold text-emerald-700">operator_app (Mobile GPS)</span></div>
                <div>Last Ping: {freshness.text}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Hardware IoT / Fleet API Webhook Sandbox */}
        {activeIngestionMode === 'HARDWARE_IOT' && (
          <div className="space-y-4 bg-purple-50/40 p-4 sm:p-5 rounded-2xl border border-purple-200/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-extrabold text-[10px] uppercase rounded-md">
                  Mode 3: Hardware IoT / CAN-Bus J1939 Webhook Simulator
                </span>
                <p className="text-xs text-slate-600 mt-1">
                  Inject live hardware payloads to test telemetry gauges, thermal alarms, fuel theft sentinels, and rpm redlines.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowIotModal(true)}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer bg-white"
                >
                  <Cpu className="w-3.5 h-3.5 text-purple-600" />
                  <span>View Endpoint & cURL</span>
                </button>
              </div>
            </div>

            {/* Quick Test Preset Buttons */}
            <div>
              <div className="text-xs font-bold text-slate-700 mb-2">
                Click a Preset Telemetry Payload to Test System Response:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                <button
                  onClick={() => handleInjectHardwarePreset('NORMAL')}
                  className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left transition-all cursor-pointer space-y-1 shadow-2xs group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Normal Run</span>
                  </div>
                  <div className="text-[10px] text-slate-500">6.5 km/h • 84°C • 1950 RPM</div>
                </button>

                <button
                  onClick={() => handleInjectHardwarePreset('TRANSIT')}
                  className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left transition-all cursor-pointer space-y-1 shadow-2xs group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700">
                    <Navigation className="w-3.5 h-3.5 shrink-0" />
                    <span>Road Transit</span>
                  </div>
                  <div className="text-[10px] text-slate-500">26.5 km/h • Highway SH-18</div>
                </button>

                <button
                  onClick={() => handleInjectHardwarePreset('OVERHEAT')}
                  className="p-2.5 bg-rose-50 hover:bg-rose-100/80 border border-rose-300 rounded-xl text-left transition-all cursor-pointer space-y-1 shadow-2xs group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                    <Flame className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                    <span>Overheat 109°C</span>
                  </div>
                  <div className="text-[10px] text-rose-800">Triggers TEMP_SURGE Alarm</div>
                </button>

                <button
                  onClick={() => handleInjectHardwarePreset('FUEL_LEAK')}
                  className="p-2.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-300 rounded-xl text-left transition-all cursor-pointer space-y-1 shadow-2xs group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <Fuel className="w-3.5 h-3.5 shrink-0" />
                    <span>Fuel Spike +72%</span>
                  </div>
                  <div className="text-[10px] text-amber-800">Triggers FUEL_ANOMALY</div>
                </button>

                <button
                  onClick={() => handleInjectHardwarePreset('REDLINE')}
                  className="p-2.5 bg-purple-50 hover:bg-purple-100/80 border border-purple-300 rounded-xl text-left transition-all cursor-pointer space-y-1 shadow-2xs group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800">
                    <Activity className="w-3.5 h-3.5 shrink-0" />
                    <span>Redline 2650 RPM</span>
                  </div>
                  <div className="text-[10px] text-purple-800">Triggers VIBRATION_SPIKE</div>
                </button>

                <button
                  onClick={() => handleInjectHardwarePreset('LOW_BATTERY')}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded-xl text-left transition-all cursor-pointer space-y-1 shadow-2xs group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <BatteryCharging className="w-3.5 h-3.5 shrink-0" />
                    <span>Low Battery 11.1V</span>
                  </div>
                  <div className="text-[10px] text-slate-600">Alternator Fault</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main CAN-Bus Telematics Gauge Cluster */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tractor className="w-4 h-4 text-agri-800 shrink-0" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Telemetry Gauge Cluster: {targetMachine.brand} {targetMachine.model} ({targetMachine.identifier})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={clsx(
              'text-[10px] font-bold px-2 py-0.5 rounded-full',
              freshness.status === 'LIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            )}>
              {freshness.text}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Engine Hours: {telemetry ? telemetry.engineHours : targetMachine.totalEngineHours} hrs
            </span>
          </div>
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
              Live Fleet Movement & Geofence Map
            </h3>
            <p className="text-xs text-slate-500">
              Real-time positions, operational radius rings, and GPS breadcrumbs across Madhya Pradesh hubs.
            </p>
          </div>
          <div className="text-xs font-mono bg-surface-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
            Current Fix: {telemetry?.latitude || targetMachine.latitude || 23.1870}° N, {telemetry?.longitude || targetMachine.longitude || 77.1005}° E
          </div>
        </div>

        <LeafletFleetMap
          chcs={chcs}
          farm={farm}
          machines={machines}
          activeTelemetry={currentTelemetry}
          selectedMachineId={targetMachine.id}
          serviceRadiusKm={35}
          height="520px"
        />
      </div>

      {/* IoT Hardware Webhook API Modal */}
      {showIotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Hardware Ingestion API & Webhook Gateway
                  </h3>
                  <p className="text-xs text-slate-500">
                    Connect Teltonika, Queclink, AIS-140, or OBD-II CAN-Bus Telematics Trackers
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIotModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  1. Live Ingestion Webhook Endpoint (HTTP POST)
                </label>
                <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] break-all select-all flex items-center justify-between gap-2">
                  <span>{hardwareConfig.endpointUrl}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    2. cURL Hardware Test Payload (J1939 ECU Telemetry)
                  </label>
                  <button
                    onClick={handleCopyCurl}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy cURL Snippet'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-slate-900 text-slate-200 rounded-2xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                  {hardwareConfig.curlSnippet}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Real-Time Anomaly Sentinels Active</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Incoming payloads are automatically validated against threshold rules for Thermal Surges (&gt;100°C), Fuel Anomaly Surges (+15%), RPM Redlines (&gt;2400 RPM), and Low Battery (&lt;11.8V).
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowIotModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
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
