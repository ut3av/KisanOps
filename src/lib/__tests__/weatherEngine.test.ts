import { describe, it, expect } from 'vitest';
import {
  computeHarvestRiskAssessment,
  getFallbackAgroWeather,
  getWMODescription,
  WeatherForecastDay,
  HourlyWeatherPoint
} from '../weatherEngine';

describe('WeatherEngine & Harvest Risk Radar', () => {
  it('correctly maps WMO weather codes', () => {
    expect(getWMODescription(0).isRainy).toBe(false);
    expect(getWMODescription(0).text).toContain('Clear');
    expect(getWMODescription(65).isRainy).toBe(true);
    expect(getWMODescription(95).text).toContain('Thunderstorm');
  });

  it('evaluates optimal harvest conditions when no rain is forecasted', () => {
    const clearDaily: WeatherForecastDay[] = [
      {
        date: '2026-08-22',
        dayName: 'Sat',
        maxTemp: 32,
        minTemp: 21,
        precipitationMm: 0,
        precipitationProbability: 0,
        weatherCode: 0,
        weatherDescription: 'Clear',
        isRainy: false,
        harvestViability: 'OPTIMAL',
      },
      {
        date: '2026-08-23',
        dayName: 'Sun',
        maxTemp: 33,
        minTemp: 22,
        precipitationMm: 0,
        precipitationProbability: 5,
        weatherCode: 1,
        weatherDescription: 'Sunny',
        isRainy: false,
        harvestViability: 'OPTIMAL',
      },
    ];

    const hourly: HourlyWeatherPoint[] = [
      {
        time: '12:00',
        temperature: 32,
        precipitationProbability: 0,
        precipitationMm: 0,
        relativeHumidity: 45,
        soilMoisturePercent: 30,
        windSpeedKmh: 10,
      },
    ];

    const assessment = computeHarvestRiskAssessment(clearDaily, hourly);
    expect(assessment.overallRiskLevel).toBe('LOW');
    expect(assessment.viabilityScore).toBeGreaterThanOrEqual(90);
    expect(assessment.soilTraction.status).toBe('OPTIMAL_TRACTION');
    expect(assessment.weatherDemandSurgeFactor).toBe(1.0);
  });

  it('triggers CRITICAL_EMERGENCY risk when heavy rain (>18mm) is expected within 48h', () => {
    const rainDaily: WeatherForecastDay[] = [
      {
        date: '2026-08-22',
        dayName: 'Sat',
        maxTemp: 31,
        minTemp: 21,
        precipitationMm: 24.5,
        precipitationProbability: 90,
        weatherCode: 65,
        weatherDescription: 'Heavy Rain',
        isRainy: true,
        harvestViability: 'CRITICAL_RISK',
      },
    ];

    const hourly: HourlyWeatherPoint[] = [
      {
        time: '12:00',
        temperature: 24,
        precipitationProbability: 90,
        precipitationMm: 12.0,
        relativeHumidity: 88,
        soilMoisturePercent: 78,
        windSpeedKmh: 28,
      },
    ];

    const assessment = computeHarvestRiskAssessment(rainDaily, hourly);
    expect(assessment.overallRiskLevel).toBe('CRITICAL_EMERGENCY');
    expect(assessment.weatherDemandSurgeFactor).toBeGreaterThan(1.15);
    expect(assessment.soilTraction.status).toBe('IMPASSABLE_SINKAGE');
    expect(assessment.alertTitle).toContain('Rain Alert');
  });

  it('returns valid high-fidelity fallback weather payload', () => {
    const fallback = getFallbackAgroWeather();
    expect(fallback.daily.length).toBe(7);
    expect(fallback.hourly.length).toBeGreaterThan(0);
    expect(fallback.assessment.dryWindowHoursRemaining).toBeGreaterThan(0);
  });
});
