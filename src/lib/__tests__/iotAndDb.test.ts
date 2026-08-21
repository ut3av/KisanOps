import { describe, it, expect } from 'vitest';
import { ingestHardwareTelemetry, getSampleHardwareConfig } from '../iotIngestionEngine';
import { fetchInitialPlatformData } from '../dbService';

describe('IoT Ingestion Engine & Anomaly Sentinels', () => {
  it('should successfully parse valid hardware telemetry payload', () => {
    const payload = {
      deviceId: 'JD-HARV-07',
      machineId: 'mach-jd-harv-07',
      latitude: 23.1872,
      longitude: 77.1008,
      speedKmh: 5.2,
      fuelLevelPercent: 82.0,
      fuelConsumptionRateLph: 7.2,
      engineHours: 340.5,
      engineTemperatureC: 85,
      rpm: 1950,
      batteryVoltage: 13.8,
    };

    const result = ingestHardwareTelemetry(payload);
    expect(result.success).toBe(true);
    expect(result.anomalyDetected).toBe(false);
    expect(result.alerts.length).toBe(0);
    expect(result.telemetryPoint?.latitude).toBe(23.1872);
    expect(result.telemetryPoint?.fuelConsumptionRateLph).toBe(7.2);
  });

  it('should detect fuel anomaly when burn rate exceeds +15% over baseline', () => {
    const payload = {
      deviceId: 'JD-HARV-07',
      machineId: 'mach-jd-harv-07',
      latitude: 23.1872,
      longitude: 77.1008,
      fuelLevelPercent: 70.0,
      fuelConsumptionRateLph: 8.5, // >15% over 7.2 baseline
      engineHours: 341.0,
      engineTemperatureC: 88,
    };

    const result = ingestHardwareTelemetry(payload, 7.2);
    expect(result.success).toBe(true);
    expect(result.anomalyDetected).toBe(true);
    expect(result.alerts.length).toBe(1);
    expect(result.alerts[0].alertType).toBe('FUEL_ANOMALY');
    expect(result.alerts[0].severity).toBe('HIGH');
  });

  it('should detect critical overheat anomaly when coolant exceeds 105C', () => {
    const payload = {
      deviceId: 'JD-HARV-07',
      machineId: 'mach-jd-harv-07',
      latitude: 23.1872,
      longitude: 77.1008,
      fuelLevelPercent: 70.0,
      fuelConsumptionRateLph: 7.2,
      engineHours: 341.0,
      engineTemperatureC: 108,
    };

    const result = ingestHardwareTelemetry(payload);
    expect(result.success).toBe(true);
    expect(result.anomalyDetected).toBe(true);
    expect(result.alerts.some(a => a.alertType === 'TEMP_SURGE')).toBe(true);
  });

  it('should generate valid hardware cURL config snippets', () => {
    const config = getSampleHardwareConfig('mach-jd-harv-07', 'CHC-MP-SEH-01');
    expect(config.endpointUrl).toContain('/functions/v1/telemetry-webhook');
    expect(config.curlSnippet).toContain('mach-jd-harv-07');
    expect(config.sampleJson.fuelConsumptionRateLph).toBe(8.4);
  });
});

describe('Database Service Offline Fallback & Typing', () => {
  it('should fall back gracefully to typed seed data when Supabase is offline', async () => {
    const initialData = await fetchInitialPlatformData();
    expect(initialData.machines.length).toBeGreaterThan(0);
    expect(initialData.chcs.length).toBeGreaterThan(0);
    expect(initialData.currentUser.fullName).toBeDefined();
  });
});
