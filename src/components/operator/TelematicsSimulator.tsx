import React from 'react';
import { useTelematicsStream } from '../../hooks/useTelematicsStream';
import { Power, Gauge, Droplet, Thermometer, Activity } from 'lucide-react';

interface Props {
  machineId: string;
  bookingId?: string;
}

export const TelematicsSimulator: React.FC<Props> = ({ machineId, bookingId }) => {
  const { isEngineOn, setIsEngineOn, telematics } = useTelematicsStream(machineId, bookingId);

  return (
    <div className="bg-slate-900 rounded-xl p-4 text-white shadow-xl border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-400" />
            Live Telemetry
          </h3>
          <p className="text-xs text-slate-400">Pushing sync every 5s</p>
        </div>
        <button 
          onClick={() => setIsEngineOn(!isEngineOn)}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors ${
            isEngineOn ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-slate-700'
          }`}
        >
          <Power className="w-8 h-8" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Speed */}
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
          <div className="text-slate-400 text-xs flex items-center gap-1 mb-1">
            <Gauge className="w-3 h-3" /> Speed
          </div>
          <div className="text-2xl font-mono">{telematics.speed.toFixed(1)} <span className="text-sm">km/h</span></div>
        </div>

        {/* Fuel */}
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
          <div className="text-slate-400 text-xs flex items-center gap-1 mb-1">
            <Droplet className="w-3 h-3 text-amber-400" /> Fuel Level
          </div>
          <div className="text-2xl font-mono">{telematics.fuelLevel.toFixed(1)}%</div>
          <div className="w-full bg-slate-700 h-1.5 mt-2 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full transition-all" style={{ width: `${telematics.fuelLevel}%` }} />
          </div>
        </div>

        {/* Temp */}
        <div className={`bg-slate-800 p-3 rounded-lg border ${telematics.engineTemp > 105 ? 'border-red-500 bg-red-950/30' : 'border-slate-700'}`}>
          <div className="text-slate-400 text-xs flex items-center gap-1 mb-1">
            <Thermometer className="w-3 h-3 text-rose-400" /> Engine Temp
          </div>
          <div className="text-2xl font-mono">{telematics.engineTemp.toFixed(1)}°C</div>
        </div>

        {/* Hours */}
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
          <div className="text-slate-400 text-xs mb-1">Engine Hours</div>
          <div className="text-2xl font-mono">{telematics.engineHours.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};
