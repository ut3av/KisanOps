import React from 'react';
import { Gauge, Fuel, Thermometer, Clock, Activity, Zap, AlertTriangle } from 'lucide-react';
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
  const currentTelemetry: TelemetryPoint = telemetry || {
    machineId: 'mach-jd-harv-07',
    timestamp: new Date().toISOString(),
    latitude: 23.1870,
    longitude: 77.1005,
    speedKmh: 14.8,
    fuelLevelPercent: 67.8,
    fuelConsumptionRateLph: isAnomalyActive ? 8.4 : 7.2,
    engineHours: 1243.8,
    engineTemperatureC: isAnomalyActive ? 92.4 : 86.5,
    rpm: 1980,
    batteryVoltage: 13.4,
    status: 'ACTIVE',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-card">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 radar-pulse" />
          <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Live CAN-Bus Telemetry</span>
        </div>
        <div className="flex items-center gap-2">
          {isAnomalyActive && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded-full animate-pulse">
              <AlertTriangle className="w-3 h-3" /> Anomaly Detected
            </span>
          )}
          <span className="text-[11px] font-mono text-slate-400">
            {new Date(currentTelemetry.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Speed */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
            <span>Speed</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-white">{currentTelemetry.speedKmh}</span>
            <span className="text-[10px] text-slate-400">km/h</span>
          </div>
          <div className="w-full bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-sky-400 h-full rounded-full" style={{ width: `${(currentTelemetry.speedKmh / 35) * 100}%` }} />
          </div>
        </div>

        {/* Fuel Level */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Fuel className="w-3.5 h-3.5 text-amber-400" />
            <span>Fuel Level</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-white">{currentTelemetry.fuelLevelPercent}%</span>
          </div>
          <div className="w-full bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full',
                currentTelemetry.fuelLevelPercent < 25 ? 'bg-rose-500' : 'bg-amber-400'
              )}
              style={{ width: `${currentTelemetry.fuelLevelPercent}%` }}
            />
          </div>
        </div>

        {/* Fuel Rate (L/h) */}
        <div
          className={clsx(
            'border rounded-xl p-3 transition-colors',
            isAnomalyActive
              ? 'bg-rose-950/40 border-rose-500/50'
              : 'bg-slate-800/70 border-slate-700/60'
          )}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Burn Rate</span>
            </div>
            {isAnomalyActive && <span className="text-[9px] text-rose-400 font-bold">+17%</span>}
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={clsx(
                'text-xl font-bold font-mono',
                isAnomalyActive ? 'text-rose-400' : 'text-white'
              )}
            >
              {currentTelemetry.fuelConsumptionRateLph}
            </span>
            <span className="text-[10px] text-slate-400">L/hr</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Nominal: 7.2 L/h</div>
        </div>

        {/* Engine Temp */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Thermometer className="w-3.5 h-3.5 text-rose-400" />
            <span>Engine Temp</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-white">{currentTelemetry.engineTemperatureC}°</span>
            <span className="text-[10px] text-slate-400">C</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Normal &lt; 95°C</div>
        </div>

        {/* RPM */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>Engine RPM</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-white">{currentTelemetry.rpm}</span>
            <span className="text-[10px] text-slate-400">RPM</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Load: 72%</div>
        </div>

        {/* Engine Hours */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Hours</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-white">{currentTelemetry.engineHours}</span>
            <span className="text-[10px] text-slate-400">hrs</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Service in 48h</div>
        </div>
      </div>
    </div>
  );
};
