import { TelemetryPoint, MachineStatus, PredictiveMaintenanceAlert } from '../types';

export interface HardwareTelemetryPayload {
  deviceId: string; // e.g. "JD-HARV-07" or IMEI "864201992817263"
  machineId: string;
  timestamp?: string;
  latitude: number;
  longitude: number;
  speedKmh?: number;
  fuelLevelPercent: number;
  fuelConsumptionRateLph?: number;
  fuelBurnRateLph?: number; // legacy alias
  engineHours: number;
  engineTemperatureC: number;
  rpm?: number;
  batteryVoltage?: number;
  status?: MachineStatus;
  apiKey?: string;
}

export interface IngestionResult {
  success: boolean;
  telemetryPoint?: TelemetryPoint;
  anomalyDetected: boolean;
  alerts: PredictiveMaintenanceAlert[];
  error?: string;
}

/**
 * Validates and normalizes raw hardware IoT / CAN-Bus J1939 payloads into domain TelemetryPoints.
 */
export function ingestHardwareTelemetry(
  payload: HardwareTelemetryPayload,
  nominalFuelBaselineLph = 7.2
): IngestionResult {
  if (!payload.machineId) {
    return { success: false, anomalyDetected: false, alerts: [], error: 'Missing machineId in telemetry payload' };
  }
  if (typeof payload.latitude !== 'number' || typeof payload.longitude !== 'number') {
    return { success: false, anomalyDetected: false, alerts: [], error: 'Invalid GPS coordinates' };
  }

  const timestamp = payload.timestamp || new Date().toISOString();
  const speedKmh = Math.max(0, payload.speedKmh ?? 0);
  const fuelLevelPercent = Math.min(100, Math.max(0, payload.fuelLevelPercent));
  const rawFuel = payload.fuelConsumptionRateLph ?? payload.fuelBurnRateLph ?? nominalFuelBaselineLph;
  const fuelConsumptionRateLph = Math.max(0, Math.round(rawFuel * 10) / 10);
  const engineHours = Math.max(0, Math.round(payload.engineHours * 10) / 10);
  const engineTemperatureC = Math.round(payload.engineTemperatureC);
  const rpm = payload.rpm || 1900;
  const batteryVoltage = payload.batteryVoltage || 13.6;
  const status: MachineStatus = payload.status || 'ACTIVE';

  const telemetryPoint: TelemetryPoint = {
    machineId: payload.machineId,
    timestamp,
    latitude: payload.latitude,
    longitude: payload.longitude,
    speedKmh,
    fuelLevelPercent,
    fuelConsumptionRateLph,
    engineHours,
    engineTemperatureC,
    rpm,
    batteryVoltage,
    status,
  };

  const alerts: PredictiveMaintenanceAlert[] = [];

  // Anomaly Check 1: Fuel Burn Rate Spike (+15% or more over baseline)
  const fuelDeltaPercent = Math.round(((fuelConsumptionRateLph - nominalFuelBaselineLph) / nominalFuelBaselineLph) * 100);
  if (fuelDeltaPercent >= 15) {
    alerts.push({
      id: `alert-fuel-${Date.now()}`,
      machineId: payload.machineId,
      machineIdentifier: payload.deviceId || 'JD-HARV-07',
      machineModel: 'John Deere W70 Harvester',
      alertType: 'FUEL_ANOMALY',
      severity: fuelDeltaPercent >= 25 ? 'CRITICAL' : 'HIGH',
      description: `CAN-Bus sensor detected fuel burn rate at ${fuelConsumptionRateLph} L/h (+${fuelDeltaPercent}% above ${nominalFuelBaselineLph} L/h baseline).`,
      recommendedAction: 'Inspect fuel injection pressure nozzle and air particulate filter within 24 hours.',
      fuelAnomalyDeltaPercent: fuelDeltaPercent,
      urgencyHours: 24,
      isResolved: false,
      createdAt: timestamp,
    });
  }

  // Anomaly Check 2: Engine Coolant Overheating (>105°C)
  if (engineTemperatureC >= 105) {
    alerts.push({
      id: `alert-temp-${Date.now()}`,
      machineId: payload.machineId,
      machineIdentifier: payload.deviceId || 'JD-HARV-07',
      machineModel: 'John Deere W70 Harvester',
      alertType: 'TEMP_SURGE',
      severity: 'CRITICAL',
      description: `Engine coolant temperature spiked to ${engineTemperatureC}°C (exceeds 100°C thermal limit).`,
      recommendedAction: 'Halt machine immediately to inspect radiator coolant level and fan belt tension.',
      urgencyHours: 2,
      isResolved: false,
      createdAt: timestamp,
    });
  }

  return {
    success: true,
    telemetryPoint,
    anomalyDetected: alerts.length > 0,
    alerts,
  };
}

/**
 * Returns sample cURL and JSON payload code snippets for hardware tracker configuration.
 */
export function getSampleHardwareConfig(machineId: string, chcCode = 'CHC-MP-SEH-01') {
  const endpointUrl = `${import.meta.env.VITE_SUPABASE_URL || 'https://vrmycvndfylrzuuxjrat.supabase.co'}/functions/v1/telemetry-webhook`;

  const sampleJson = {
    deviceId: 'JD-HARV-07',
    machineId: machineId || 'mach-jd-harv-07',
    chcCode,
    latitude: 23.1872,
    longitude: 77.1008,
    speedKmh: 4.8,
    fuelLevelPercent: 78.5,
    fuelConsumptionRateLph: 8.4,
    engineHours: 342.8,
    engineTemperatureC: 88,
    rpm: 1950,
    batteryVoltage: 13.8,
    status: 'ACTIVE',
  };

  const curlSnippet = `curl -X POST "${endpointUrl}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'}" \\
  -d '${JSON.stringify(sampleJson, null, 2)}'`;

  return {
    endpointUrl,
    sampleJson,
    curlSnippet,
  };
}
