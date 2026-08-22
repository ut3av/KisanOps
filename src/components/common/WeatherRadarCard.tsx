import React, { useState, useEffect } from 'react';
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Layers,
  ChevronRight,
  Radio,
  CloudSun,
  CloudLightning,
  CloudDrizzle
} from 'lucide-react';
import {
  fetchAgroWeatherForecast,
  resolveCoordinatesForDistrict,
  WeatherForecastDay,
  HourlyWeatherPoint,
  HarvestRiskAssessment,
  LocationCoordinates,
} from '../../lib/weatherEngine';
import { DopplerRadarPlayer } from './DopplerRadarPlayer';
import clsx from 'clsx';

interface WeatherRadarCardProps {
  district?: string;
  latitude?: number;
  longitude?: number;
  onEmergencyPreBook?: () => void;
  compact?: boolean;
}

export const WeatherRadarCard: React.FC<WeatherRadarCardProps> = ({
  district = 'Indore',
  latitude,
  longitude,
  onEmergencyPreBook,
  compact = false,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [daily, setDaily] = useState<WeatherForecastDay[]>([]);
  const [hourly, setHourly] = useState<HourlyWeatherPoint[]>([]);
  const [currentTemp, setCurrentTemp] = useState<number>(26);
  const [currentHumidity, setCurrentHumidity] = useState<number>(75);
  const [currentWind, setCurrentWind] = useState<number>(12);
  const [resolvedLocation, setResolvedLocation] = useState<string>('');
  const [assessment, setAssessment] = useState<HarvestRiskAssessment | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [showDopplerModal, setShowDopplerModal] = useState<boolean>(false);

  const loadWeather = async () => {
    setLoading(true);
    const coords: LocationCoordinates = await resolveCoordinatesForDistrict(
      district,
      latitude && longitude ? { latitude, longitude } : undefined
    );
    setResolvedLocation(coords.locationName);

    const res = await fetchAgroWeatherForecast(coords, coords.locationName);
    setDaily(res.daily);
    setHourly(res.hourly);
    setCurrentTemp(res.currentTemp);
    setCurrentHumidity(res.currentHumidity);
    setCurrentWind(res.currentWind);
    setAssessment(res.assessment);
    setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    setLoading(false);
  };

  useEffect(() => {
    loadWeather();
  }, [district, latitude, longitude]);

  if (loading && !assessment) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm animate-pulse flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-stone-200 rounded-2xl" />
          <div className="space-y-2">
            <div className="w-40 h-4 bg-stone-200 rounded-md" />
            <div className="w-28 h-3 bg-stone-100 rounded-md" />
          </div>
        </div>
        <div className="w-24 h-8 bg-stone-200 rounded-full" />
      </div>
    );
  }

  if (!assessment) return null;

  const isEmergency = assessment.overallRiskLevel === 'CRITICAL_EMERGENCY' || assessment.overallRiskLevel === 'HIGH';

  const getWeatherIcon = (code: number, isRainy: boolean) => {
    if (code >= 95) return <CloudLightning className="w-4 h-4 text-amber-600" />;
    if (isRainy || code >= 51) return <CloudRain className="w-4 h-4 text-sky-600" />;
    if (code >= 2) return <CloudSun className="w-4 h-4 text-amber-500" />;
    return <Sun className="w-4 h-4 text-amber-500" />;
  };

  if (compact) {
    return (
      <div
        className={clsx(
          'p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
          isEmergency
            ? 'bg-amber-500/10 border-amber-500/30'
            : 'bg-emerald-500/10 border-emerald-500/20'
        )}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={clsx(
              'w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm',
              isEmergency ? 'bg-amber-600' : 'bg-emerald-700'
            )}
          >
            {isEmergency ? <AlertTriangle className="w-6 h-6 shrink-0" /> : <Sun className="w-6 h-6 shrink-0" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-stone-900">{assessment.alertTitle}</span>
              <span
                className={clsx(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shrink-0',
                  isEmergency
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                )}
              >
                {assessment.overallRiskLevel.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">{assessment.alertSummary}</p>
          </div>
        </div>

        {onEmergencyPreBook && isEmergency && (
          <button
            onClick={onEmergencyPreBook}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Priority Harvest Slot</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div
        className={clsx(
          'bg-white rounded-3xl overflow-hidden border transition-all duration-300 shadow-lg',
          isEmergency ? 'border-amber-400/80 shadow-amber-500/5' : 'border-stone-200/90'
        )}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 bg-[#F5FAED]/60">
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                'w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0',
                isEmergency ? 'bg-amber-600' : 'bg-[#1b4d3e]'
              )}
            >
              {isEmergency ? <CloudRain className="w-5 h-5 shrink-0" /> : <Sun className="w-5 h-5 shrink-0" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                  Weather Risk Radar & Harvest Window
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-extrabold tracking-wider shrink-0 font-mono">
                  LIVE OPEN-METEO
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                {resolvedLocation || `${district} Cluster`} • Real-time Satellite Telemetry ({lastUpdated})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDopplerModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-[#7aa32c] text-[#2e4013] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-[#7aa32c] animate-pulse" />
              <span>Live Doppler Radar</span>
            </button>

            <button
              onClick={loadWeather}
              title="Refresh Live Weather"
              className="p-2 text-stone-500 hover:text-stone-800 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <RefreshCw className={clsx('w-4 h-4 shrink-0', loading && 'animate-spin')} />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Top 3 KPI Badges (Responsive 1-col on phone, 3-col on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Gauge 1: Dry Window Remaining */}
            <div className="p-4 rounded-2xl bg-[#F5FAED] border border-[#7aa32c]/20 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white text-[#2e4013] flex items-center justify-center font-bold shadow-xs shrink-0">
                <Clock className="w-5 h-5 text-[#7aa32c]" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider font-typewriter">
                  Dry Harvest Window
                </div>
                <div className="text-lg font-black text-stone-900 leading-tight">
                  {assessment.dryWindowHoursRemaining < 168
                    ? `${assessment.dryWindowHoursRemaining} Hours`
                    : '7+ Days (Clear)'}
                </div>
                <div className="text-[11px] text-[#2e4013] font-semibold mt-0.5">
                  {Math.max(1, Math.round(assessment.dryWindowHoursRemaining / 24))} operating days available
                </div>
              </div>
            </div>

            {/* Gauge 2: Current Soil Moisture & Traction */}
            <div className="p-4 rounded-2xl bg-[#F5FAED] border border-[#7aa32c]/20 flex items-center gap-3.5">
              <div
                className={clsx(
                  'w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-xs',
                  assessment.soilTraction.status === 'OPTIMAL_TRACTION'
                    ? 'bg-emerald-100 text-emerald-800'
                    : assessment.soilTraction.status === 'MODERATE_SLIPPAGE'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                )}
              >
                <Droplets className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider font-typewriter">
                  Soil Tractability
                </div>
                <div className="text-lg font-black text-stone-900 leading-tight truncate">
                  {assessment.soilTraction.moisturePercent}% Moisture
                </div>
                <div className="text-[11px] font-semibold text-stone-600 truncate mt-0.5">
                  Max {assessment.soilTraction.maxAllowedMachineWeightTons}T Load Capacity
                </div>
              </div>
            </div>

            {/* Gauge 3: Harvest Viability Score */}
            <div className="p-4 rounded-2xl bg-[#F5FAED] border border-[#7aa32c]/20 flex items-center gap-3.5">
              <div
                className={clsx(
                  'w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white shrink-0 shadow-xs text-sm',
                  assessment.viabilityScore >= 80
                    ? 'bg-emerald-600'
                    : assessment.viabilityScore >= 50
                    ? 'bg-amber-600'
                    : 'bg-rose-600'
                )}
              >
                {assessment.viabilityScore}%
              </div>
              <div>
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider font-typewriter">
                  Harvest Viability
                </div>
                <div className="text-base sm:text-lg font-black text-stone-900 leading-tight">
                  {assessment.viabilityScore >= 80
                    ? 'Optimal Window'
                    : assessment.viabilityScore >= 50
                    ? 'Variable Window'
                    : 'Rain Threat Active'}
                </div>
                <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                  {currentTemp}°C • {currentHumidity}% Humidity • {currentWind} km/h
                </div>
              </div>
            </div>
          </div>

          {/* Rain Risk Alert Banner */}
          <div
            className={clsx(
              'p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
              isEmergency
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-950'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950'
            )}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={clsx(
                  'p-2.5 rounded-2xl text-white shrink-0 shadow-xs',
                  isEmergency ? 'bg-amber-600' : 'bg-emerald-700'
                )}
              >
                <AlertTriangle className="w-5 h-5 shrink-0" />
              </div>
              <div className="space-y-1">
                <div className="font-extrabold text-sm sm:text-base">{assessment.alertTitle}</div>
                <p className="text-xs text-stone-700 leading-relaxed">{assessment.alertSummary}</p>
                <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900 pt-0.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#7aa32c] shrink-0" />
                  <span>Recommendation: {assessment.actionRecommendation}</span>
                </div>
              </div>
            </div>

            {onEmergencyPreBook && (
              <button
                onClick={onEmergencyPreBook}
                className={clsx(
                  'w-full sm:w-auto px-5 py-3 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer',
                  isEmergency
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-[#1b4d3e] hover:bg-[#153e32] text-white'
                )}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Priority Pre-Book Harvester</span>
              </button>
            )}
          </div>

          {/* 7-Day Rainfall Forecast Barometer (Fully Responsive Grid) */}
          <div>
            <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5 font-typewriter">
                <CloudRain className="w-4 h-4 text-sky-600 shrink-0" />
                <span>7-Day Agro Precipitation & Rain Probability Forecast</span>
              </h4>
              <span className="text-[11px] font-mono text-stone-400">Live Satellite Grid (Open-Meteo)</span>
            </div>

            {/* Responsive Grid: 2 cols on mobile, 4 on tablet, 7 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5">
              {daily.map((day, idx) => {
                const hasHighRain = day.precipitationMm >= 10 || day.precipitationProbability >= 70;
                const hasLightRain = day.precipitationMm >= 2 || day.precipitationProbability >= 40;

                return (
                  <div
                    key={idx}
                    className={clsx(
                      'p-3 rounded-2xl border text-center transition-all flex flex-col justify-between space-y-2',
                      hasHighRain
                        ? 'bg-rose-50/80 border-rose-200 ring-1 ring-rose-300/60 shadow-2xs'
                        : hasLightRain
                        ? 'bg-amber-50/80 border-amber-200'
                        : 'bg-[#F5FAED]/60 border-stone-200/80 hover:bg-[#F5FAED]'
                    )}
                  >
                    <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                      <div className="text-xs font-black text-stone-800">{day.dayName}</div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        {day.date.split('-')[2]}/{day.date.split('-')[1]}
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 py-1">
                      {getWeatherIcon(day.weatherCode, day.isRainy)}
                      <span className="text-[11px] font-bold text-stone-700">
                        {day.maxTemp}° / {day.minTemp}°
                      </span>
                    </div>

                    {/* Rain Precipitation & Probability */}
                    <div className="py-1 bg-white/80 rounded-xl border border-stone-200/60">
                      <div className="text-xs font-black text-stone-900 font-typewriter">
                        {day.precipitationMm > 0 ? `${day.precipitationMm} mm` : '0 mm'}
                      </div>
                      <div
                        className={clsx(
                          'text-[10px] font-bold',
                          hasHighRain
                            ? 'text-rose-700'
                            : hasLightRain
                            ? 'text-amber-700'
                            : 'text-stone-500'
                        )}
                      >
                        {day.precipitationProbability}% Rain
                      </div>
                    </div>

                    <div
                      className={clsx(
                        'text-[10px] font-bold uppercase rounded-lg py-1 px-1.5 truncate tracking-wider font-typewriter',
                        day.harvestViability === 'OPTIMAL'
                          ? 'bg-emerald-100 text-emerald-800'
                          : day.harvestViability === 'MODERATE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      )}
                    >
                      {day.harvestViability === 'OPTIMAL'
                        ? 'Optimal'
                        : day.harvestViability === 'MODERATE'
                        ? 'Moderate'
                        : 'Rain Risk'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Doppler Radar Player Modal */}
      {showDopplerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-xl w-full p-6 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-stone-900">
                    Live Doppler Radar & Satellite Reflectivity
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    {resolvedLocation || district} • 2-Hour Precipitation Telemetry Loop
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDopplerModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Radar Simulation & Reflectivity */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 border border-slate-800 flex flex-col justify-between p-4 text-white">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono text-emerald-300 font-bold border border-white/15">
                  LIVE RAINVIEWER DOPPLER
                </span>
                <span className="text-xs font-mono text-stone-300">
                  {lastUpdated}
                </span>
              </div>

              <div className="text-center space-y-1">
                <CloudRain className="w-12 h-12 text-sky-400 mx-auto animate-bounce" />
                <div className="text-sm font-bold font-typewriter text-sky-200">
                  {assessment.alertTitle}
                </div>
                <p className="text-xs text-stone-300 max-w-md mx-auto">
                  {assessment.alertSummary}
                </p>
              </div>

              {/* dBZ Intensity Legend Bar */}
              <div className="p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between text-[10px] font-mono">
                <span className="text-stone-400">Reflectivity (dBZ):</span>
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Light (15)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Moderate (35)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Heavy (50+)</span>
                </div>
              </div>
            </div>

            {/* Advisory note */}
            <div className="p-3.5 rounded-2xl bg-[#F5FAED] border border-[#7aa32c]/20 text-xs text-[#2e4013] space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#7aa32c]" />
                <span>Agricultural Harvest & Dispatch Advisory</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                {assessment.actionRecommendation} Soil tractability is currently at {assessment.soilTraction.moisturePercent}% moisture with safe weight threshold of {assessment.soilTraction.maxAllowedMachineWeightTons} Tons.
              </p>
            </div>

            <button
              onClick={() => setShowDopplerModal(false)}
              className="w-full py-3 rounded-xl bg-[#1b4d3e] hover:bg-[#153e32] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Close Radar View
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WeatherRadarCard;
