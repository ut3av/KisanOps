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
  ChevronRight
} from 'lucide-react';
import {
  fetchAgroWeatherForecast,
  WeatherForecastDay,
  HourlyWeatherPoint,
  HarvestRiskAssessment,
  MP_WEATHER_LOCATIONS
} from '../../lib/weatherEngine';
import clsx from 'clsx';

interface WeatherRadarCardProps {
  district?: string;
  onEmergencyPreBook?: () => void;
  compact?: boolean;
}

export const WeatherRadarCard: React.FC<WeatherRadarCardProps> = ({
  district = 'Sehore',
  onEmergencyPreBook,
  compact = false,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [daily, setDaily] = useState<WeatherForecastDay[]>([]);
  const [hourly, setHourly] = useState<HourlyWeatherPoint[]>([]);
  const [currentTemp, setCurrentTemp] = useState<number>(31);
  const [currentHumidity, setCurrentHumidity] = useState<number>(55);
  const [currentWind, setCurrentWind] = useState<number>(14);
  const [assessment, setAssessment] = useState<HarvestRiskAssessment | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const loadWeather = async () => {
    setLoading(true);
    const coords = MP_WEATHER_LOCATIONS[district.toLowerCase()] || MP_WEATHER_LOCATIONS.sehore;
    const res = await fetchAgroWeatherForecast(coords);
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
  }, [district]);

  if (loading && !assessment) {
    return (
      <div className="card-premium p-5 animate-pulse flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-2xl" />
          <div className="space-y-2">
            <div className="w-32 h-3.5 bg-slate-200 rounded" />
            <div className="w-24 h-3 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="w-20 h-6 bg-slate-200 rounded-full" />
      </div>
    );
  }

  if (!assessment) return null;

  const isEmergency = assessment.overallRiskLevel === 'CRITICAL_EMERGENCY' || assessment.overallRiskLevel === 'HIGH';

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
            {isEmergency ? <AlertTriangle className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900">{assessment.alertTitle}</span>
              <span
                className={clsx(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase',
                  isEmergency
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                )}
              >
                {assessment.overallRiskLevel.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">{assessment.alertSummary}</p>
          </div>
        </div>

        {onEmergencyPreBook && isEmergency && (
          <button
            onClick={onEmergencyPreBook}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Priority Harvest Slot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'card-premium overflow-hidden border transition-all',
        isEmergency ? 'border-amber-400/80 shadow-md' : 'border-slate-200'
      )}
    >
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-surface-50/50">
        <div className="flex items-center gap-2.5">
          <div
            className={clsx(
              'w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm',
              isEmergency ? 'bg-amber-600' : 'bg-agri-800'
            )}
          >
            {isEmergency ? <CloudRain className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Weather Risk Radar & Harvest Window
              </h3>
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-extrabold tracking-wider">
                LIVE OPEN-METEO
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {district} District • Real-time Agro Forecast (Updated {lastUpdated})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadWeather}
            title="Refresh Live Weather"
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className={clsx('w-4 h-4', loading && 'animate-spin')} />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Top 3 KPI Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Gauge 1: Dry Window Remaining */}
          <div className="p-3.5 rounded-2xl bg-surface-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Dry Harvest Window
              </div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900">
                {assessment.dryWindowHoursRemaining < 168
                  ? `${assessment.dryWindowHoursRemaining} Hours`
                  : '7+ Days (Clear)'}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold">
                {Math.round(assessment.dryWindowHoursRemaining / 24)} full operating days
              </div>
            </div>
          </div>

          {/* Gauge 2: Current Soil Moisture & Traction */}
          <div className="p-3.5 rounded-2xl bg-surface-50 border border-slate-200/80 flex items-center gap-3">
            <div
              className={clsx(
                'w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0',
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
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Soil Tractability
              </div>
              <div className="text-sm font-extrabold text-slate-900 truncate">
                {assessment.soilTraction.moisturePercent}% Moisture
              </div>
              <div className="text-[10px] font-bold text-slate-600 truncate">
                Max {assessment.soilTraction.maxAllowedMachineWeightTons}T Load Capacity
              </div>
            </div>
          </div>

          {/* Gauge 3: Harvest Viability Score */}
          <div className="p-3.5 rounded-2xl bg-surface-50 border border-slate-200/80 flex items-center gap-3">
            <div
              className={clsx(
                'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0',
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
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Harvest Viability
              </div>
              <div className="text-sm font-extrabold text-slate-900">
                {assessment.viabilityScore >= 80
                  ? 'Prime Weather'
                  : assessment.viabilityScore >= 50
                  ? 'Approaching Surge'
                  : 'Rain Threat Active'}
              </div>
              <div className="text-[10px] text-slate-500">
                {currentTemp}°C • {currentHumidity}% Humidity • {currentWind} km/h Wind
              </div>
            </div>
          </div>
        </div>

        {/* Rain Risk Alert Banner */}
        <div
          className={clsx(
            'p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
            isEmergency
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-950'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950'
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={clsx(
                'p-2 rounded-xl text-white shrink-0 mt-0.5',
                isEmergency ? 'bg-amber-600' : 'bg-emerald-700'
              )}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-xs sm:text-sm">{assessment.alertTitle}</div>
              <p className="text-xs text-slate-700 mt-0.5">{assessment.alertSummary}</p>
              <p className="text-xs font-bold text-slate-900 mt-1">
                👉 Recommendation: {assessment.actionRecommendation}
              </p>
            </div>
          </div>

          {onEmergencyPreBook && (
            <button
              onClick={onEmergencyPreBook}
              className={clsx(
                'w-full sm:w-auto px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0',
                isEmergency
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'btn-primary'
              )}
            >
              <Sparkles className="w-4 h-4" />
              <span>Priority Pre-Book Harvester</span>
            </button>
          )}
        </div>

        {/* 7-Day Rainfall Forecast Barometer */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-sky-600" />
              <span>7-Day Agro Precipitation & Rain Probability Forecast</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-400">Rainfall (mm) / Probability (%)</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {daily.map((day, idx) => {
              const hasHighRain = day.precipitationMm >= 10 || day.precipitationProbability >= 70;
              const hasLightRain = day.precipitationMm >= 2 || day.precipitationProbability >= 40;

              return (
                <div
                  key={idx}
                  className={clsx(
                    'p-2 rounded-xl border text-center transition-all flex flex-col justify-between h-32',
                    hasHighRain
                      ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-200'
                      : hasLightRain
                      ? 'bg-amber-50/80 border-amber-200'
                      : 'bg-surface-50 border-slate-200'
                  )}
                >
                  <div>
                    <div className="text-[11px] font-extrabold text-slate-800">{day.dayName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {day.date.split('-')[2]}/{day.date.split('-')[1]}
                    </div>
                  </div>

                  {/* Visual Rain Probability Meter */}
                  <div className="my-1">
                    <div className="text-xs font-extrabold text-slate-900">
                      {day.precipitationMm > 0 ? `${day.precipitationMm}mm` : '0 mm'}
                    </div>
                    <div
                      className={clsx(
                        'text-[10px] font-bold',
                        hasHighRain
                          ? 'text-rose-700'
                          : hasLightRain
                          ? 'text-amber-700'
                          : 'text-slate-500'
                      )}
                    >
                      {day.precipitationProbability}% Rain
                    </div>
                  </div>

                  <div
                    className={clsx(
                      'text-[9px] font-bold uppercase rounded py-0.5 px-1 truncate',
                      day.harvestViability === 'OPTIMAL'
                        ? 'bg-emerald-100 text-emerald-800'
                        : day.harvestViability === 'MODERATE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    )}
                  >
                    {day.harvestViability === 'OPTIMAL'
                      ? 'Safe'
                      : day.harvestViability === 'MODERATE'
                      ? 'Caution'
                      : 'Rain Alert'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
