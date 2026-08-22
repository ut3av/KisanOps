import React from 'react';
import { Gauge, Fuel, Thermometer, Clock, Activity, Zap, AlertTriangle, Radio } from 'lucide-react';
import { TelemetryPoint } from '../../types';
import clsx from 'clsx';

interface TelematicsGaugeClusterProps {
  telemetry?: TelemetryPoint;
  isAnomalyActive?: boolean;
}

export const TelematicsGaugeCluster: React.FC<TelematicsGaugeClusterProps> = ({
  telemetry,
  isAnomalyActive = false,
}) => {
  const isOnline = !!telemetry && (telemetry.status === 'ACTIVE' || telemetry.status === 'DISPATCHED' || telemetry.speedKmh > 0 || telemetry.rpm > 0);

  const currentTelemetry: TelemetryPoint = telemetry || {
    machineId: 'offline',
    timestamp: new Date().toISOString(),
    latitude: 0,
    longitude: 0,
    speedKmh: 0.0,
    fuelLevelPercent: 0,
    fuelConsumptionRateLph: 0.0,
    engineHours: 0.0,
    engineTemperatureC: 0.0,
    rpm: 0,
    batteryVoltage: 0.0,
    status: 'OFFLINE',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={clsx(
              'w-2.5 h-2.5 rounded-full shrink-0 transition-colors',
              isOnline ? 'bg-emerald-400 radar-pulse' : 'bg-slate-500'
            )}
          />
          <span
            className={clsx(
              'text-xs font-bold tracking-wider uppercase flex items-center gap-1.5',
              isOnline ? 'text-emerald-400' : 'text-slate-400'
            )}
          >
            {isOnline ? 'Live CAN-Bus J1939 Telemetry Stream' : 'CAN-Bus Telematics Gateway (Standby / Disconnected)'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isOnline && isAnomalyActive && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2.5 py-0.5 rounded-full animate-pulse shrink-0">
              <AlertTriangle className="w-3 h-3 shrink-0" /> Anomaly Detected
            </span>
          )}
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
            {isOnline ? new Date(currentTelemetry.timestamp).toLocaleTimeString() : 'Offline (0 Feeds)'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Speed */}
        <div className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-2xl p-3.5 transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1.5">
            <Gauge className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-medium">Speed</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-white">
              {isOnline ? currentTelemetry.speedKmh : '0.0'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">km/h</span>
          </div>
          <div className="w-full bg-slate-700/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-sky-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${isOnline ? (currentTelemetry.speedKmh / 35) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Fuel Level */}
        <div className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-2xl p-3.5 transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1.5">
            <Fuel className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">Fuel Level</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-white">
              {isOnline ? `${currentTelemetry.fuelLevelPercent}%` : '0%'}
            </span>
          </div>
          <div className="w-full bg-slate-700/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full transition-all duration-500 ease-out',
                isOnline && currentTelemetry.fuelLevelPercent < 25 ? 'bg-rose-500' : 'bg-amber-400'
              )}
              style={{ width: `${isOnline ? currentTelemetry.fuelLevelPercent : 0}%` }}
            />
          </div>
        </div>

        {/* Fuel Rate (L/h) */}
        <div
          className={clsx(
            'border rounded-2xl p-3.5 transition-all duration-200 hover:-translate-y-0.5',
            isOnline && isAnomalyActive
              ? 'bg-rose-950/40 border-rose-500/50 ring-1 ring-rose-500/30'
              : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/60'
          )}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
              <span className="font-medium">Burn Rate</span>
            </div>
            {isOnline && isAnomalyActive && (
              <span className="text-[9px] text-rose-400 font-bold bg-rose-900/60 px-1 rounded">+17%</span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={clsx(
                'text-2xl font-bold font-mono',
                isOnline && isAnomalyActive ? 'text-rose-400' : 'text-white'
              )}
            >
              {isOnline ? currentTelemetry.fuelConsumptionRateLph : '0.0'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">L/hr</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-mono">
            {isOnline ? 'Nominal: 7.2 L/h' : 'Sensor Idle'}
          </div>
        </div>

        {/* Engine Temp */}
        <div className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-2xl p-3.5 transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1.5">
            <Thermometer className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-medium">Engine Temp</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-white">
              {isOnline ? `${currentTelemetry.engineTemperatureC}°` : '--'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{isOnline ? 'C' : ''}</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-2 font-mono">
            {isOnline ? 'Normal < 95°C' : 'Standby'}
          </div>
        </div>

        {/* RPM */}
        <div className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-2xl p-3.5 transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1.5">
            <Activity className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="font-medium">Engine RPM</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-white">
              {isOnline ? currentTelemetry.rpm : '0'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">RPM</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-mono">
            {isOnline ? 'Load: 72%' : '0% Load'}
          </div>
        </div>

        {/* Engine Hours */}
        <div className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-2xl p-3.5 transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1.5">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">Total Hours</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-white">
              {isOnline ? currentTelemetry.engineHours : '0.0'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">hrs</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-2 font-mono">
            {isOnline ? 'Service in 48h' : 'No Active Asset'}
          </div>
        </div>
      </div>
    </div>
  );
};
