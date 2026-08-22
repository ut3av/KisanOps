import {
  TelemetryPoint,
  MachineStatus,
  PredictiveMaintenanceAlert,
  LocationSourceType,
  MaintenanceAlertType,
  TelemetryModeType,
} from '../types';

export interface HardwareTelemetryPayload {
  deviceId?: string; // e.g. "JD-HARV-07" or IMEI "864201992817263"
  machineId: string;
  timestamp?: string;
  latitude: number;
  longitude: number;
  speedKmh?: number;
  headingDeg?: number;
  fuelLevelPercent: number;
  fuelConsumptionRateLph?: number;
  fuelBurnRateLph?: number; // legacy alias
  engineHours: number;
  engineTemperatureC: number;
  rpm?: number;
  batteryVoltage?: number;
  hydraulicPressureBar?: number;
  ignitionState?: 'ON' | 'OFF' | 'IDLE';
  odometerKm?: number;
  status?: MachineStatus;
  locationSource?: LocationSourceType;
  locationAccuracy?: number;
  apiKey?: string;
}

export interface OperatorGpsPayload {
  machineId: string;
  operatorId?: string;
  latitude: number;
  longitude: number;
  speedKmh?: number;
  headingDeg?: number;
  accuracyMetres?: number;
  timestamp?: string;
}

export interface ManualLocationPayload {
  machineId: string;
  latitude: number;
  longitude: number;
  parkingLocationName?: string;
  notes?: string;
}

export interface IngestionResult {
  success: boolean;
  telemetryPoint?: TelemetryPoint;
  anomalyDetected: boolean;
  alerts: PredictiveMaintenanceAlert[];
  error?: string;
  mode: TelemetryModeType;
}

/**
 * Primary Telematics Ingestion & Anomaly Sentinel Engine
 * Validates, normalizes, and analyzes incoming telematics across all 3 modes
 */
export function ingestHardwareTelemetry(
  payload: HardwareTelemetryPayload,
  nominalFuelBaselineLph = 7.2
): IngestionResult {
  if (!payload.machineId) {
    return {
      success: false,
      anomalyDetected: false,
      alerts: [],
      error: 'Missing machineId in telemetry payload',
      mode: 'HARDWARE_IOT',
    };
  }
  if (typeof payload.latitude !== 'number' || typeof payload.longitude !== 'number') {
    return {
      success: false,
      anomalyDetected: false,
      alerts: [],
      error: 'Invalid GPS coordinates (latitude and longitude must be numbers)',
      mode: 'HARDWARE_IOT',
    };
  }

  const timestamp = payload.timestamp || new Date().toISOString();
  const speedKmh = Math.max(0, payload.speedKmh ?? 0);
  const fuelLevelPercent = Math.min(100, Math.max(0, payload.fuelLevelPercent));
  const rawFuel = payload.fuelConsumptionRateLph ?? payload.fuelBurnRateLph ?? nominalFuelBaselineLph;
  const fuelConsumptionRateLph = Math.max(0, Math.round(rawFuel * 10) / 10);
  const engineHours = Math.max(0, Math.round(payload.engineHours * 10) / 10);
  const engineTemperatureC = Math.round(payload.engineTemperatureC);
  const rpm = payload.rpm || (speedKmh > 0 ? 1900 : 800);
  const batteryVoltage = payload.batteryVoltage || 13.6;
  const hydraulicPressureBar = payload.hydraulicPressureBar || (speedKmh > 0 ? 160 : 40);
  const ignitionState = payload.ignitionState || (rpm > 500 ? 'ON' : 'OFF');
  const status: MachineStatus = payload.status || (speedKmh > 10 ? 'DISPATCHED' : speedKmh > 0 ? 'ACTIVE' : 'AVAILABLE');
  const locationSource: LocationSourceType = payload.locationSource || 'gps_tracker';

  const telemetryPoint: TelemetryPoint = {
    machineId: payload.machineId,
    timestamp,
    latitude: Math.round(payload.latitude * 100000) / 100000,
    longitude: Math.round(payload.longitude * 100000) / 100000,
    speedKmh,
    headingDeg: payload.headingDeg ?? 180,
    fuelLevelPercent,
    fuelConsumptionRateLph,
    engineHours,
    engineTemperatureC,
    rpm,
    batteryVoltage,
    hydraulicPressureBar,
    ignitionState,
    odometerKm: payload.odometerKm,
    locationSource,
    locationAccuracy: payload.locationAccuracy ?? 3.5,
    status,
  };

  const alerts: PredictiveMaintenanceAlert[] = [];

  // Anomaly 1: Engine Coolant Overheating (>100°C)
  if (engineTemperatureC >= 100) {
    alerts.push({
      id: `alert-temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      machineId: payload.machineId,
      machineIdentifier: payload.deviceId || 'MACH-IOT',
      machineModel: 'Telemetry Monitored Machinery',
      alertType: 'TEMP_SURGE',
      severity: engineTemperatureC >= 108 ? 'CRITICAL' : 'HIGH',
      description: `Engine coolant temperature spiked to ${engineTemperatureC}°C (critical threshold: 100°C).`,
      recommendedAction: 'Halt machine immediately. Inspect radiator coolant level, fan belt tension, and debris clogging.',
      urgencyHours: 2,
      isResolved: false,
      createdAt: timestamp,
    });
  }

  // Anomaly 2: Fuel Burn Anomaly / Siphoning / High Leak (+15% or more over baseline)
  const fuelDeltaPercent = Math.round(((fuelConsumptionRateLph - nominalFuelBaselineLph) / nominalFuelBaselineLph) * 100);
  if (fuelDeltaPercent >= 15) {
    alerts.push({
      id: `alert-fuel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      machineId: payload.machineId,
      machineIdentifier: payload.deviceId || 'MACH-IOT',
      machineModel: 'Telemetry Monitored Machinery',
      alertType: 'FUEL_ANOMALY',
      severity: fuelDeltaPercent >= 25 ? 'CRITICAL' : 'HIGH',
      description: `CAN-Bus sensor detected fuel burn rate at ${fuelConsumptionRateLph} L/h (+${fuelDeltaPercent}% above ${nominalFuelBaselineLph} L/h baseline).`,
      recommendedAction: 'Inspect fuel injection pressure nozzle, fuel line joints, and air particulate filter within 24 hours.',
      fuelAnomalyDeltaPercent: fuelDeltaPercent,
      urgencyHours: 24,
      isResolved: false,
      createdAt: timestamp,
    });
  }

  // Anomaly 3: Engine RPM Redline / Excessive Vibration (>2400 RPM)
  if (rpm >= 2400) {
    alerts.push({
      id: `alert-vib-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      machineId: payload.machineId,
      machineIdentifier: payload.deviceId || 'MACH-IOT',
      machineModel: 'Telemetry Monitored Machinery',
      alertType: 'VIBRATION_SPIKE',
      severity: 'HIGH',
      description: `Engine RPM exceeded safe continuous operating limits (${rpm} RPM vs 2200 RPM rated max).`,
      recommendedAction: 'Throttle down immediately. Inspect governor linkage and transmission PTO shaft.',
      urgencyHours: 6,
      isResolved: false,
      createdAt: timestamp,
    });
  }

  // Anomaly 4: Battery Voltage Critical (< 11.8V)
  if (batteryVoltage < 11.8 && ignitionState === 'ON') {
    alerts.push({
      id: `alert-bat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      machineId: payload.machineId,
      machineIdentifier: payload.deviceId || 'MACH-IOT',
      machineModel: 'Telemetry Monitored Machinery',
      alertType: 'BATTERY_LOW',
      severity: 'MEDIUM',
      description: `Alternator charging failure detected. Battery voltage dropped to ${batteryVoltage}V under active load.`,
      recommendedAction: 'Check alternator drive belt and battery terminal corrosion.',
      urgencyHours: 12,
      isResolved: false,
      createdAt: timestamp,
    });
  }

  // Anomaly 5: Hydraulic Pressure Loss when operating (< 120 Bar when active)
  if (hydraulicPressureBar < 120 && speedKmh > 0 && status === 'ACTIVE') {
    alerts.push({
      id: `alert-hyd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      machineId: payload.machineId,
      machineIdentifier: payload.deviceId || 'MACH-IOT',
      machineModel: 'Telemetry Monitored Machinery',
      alertType: 'HYDRAULIC_DROP',
      severity: 'HIGH',
      description: `Hydraulic pump pressure dropped to ${hydraulicPressureBar} Bar during active field operation.`,
      recommendedAction: 'Inspect hydraulic fluid reservoir and check cylinder seal integrity.',
      urgencyHours: 8,
      isResolved: false,
      createdAt: timestamp,
    });
  }

  return {
    success: true,
    telemetryPoint,
    anomalyDetected: alerts.length > 0,
    alerts,
    mode: 'HARDWARE_IOT',
  };
}

/**
 * Mode 2: Ingests Driver Mobile GPS Telemetry Stream
 */
export function ingestOperatorGpsTelemetry(
  payload: OperatorGpsPayload,
  existingTelemetry?: TelemetryPoint
): IngestionResult {
  const timestamp = payload.timestamp || new Date().toISOString();
  const speedKmh = Math.max(0, payload.speedKmh ?? 0);

  const telemetryPoint: TelemetryPoint = {
    machineId: payload.machineId,
    timestamp,
    latitude: Math.round(payload.latitude * 100000) / 100000,
    longitude: Math.round(payload.longitude * 100000) / 100000,
    speedKmh,
    headingDeg: payload.headingDeg ?? 0,
    fuelLevelPercent: existingTelemetry?.fuelLevelPercent ?? 75.0,
    fuelConsumptionRateLph: existingTelemetry?.fuelConsumptionRateLph ?? (speedKmh > 0 ? 6.5 : 1.2),
    engineHours: existingTelemetry?.engineHours ?? 320.0,
    engineTemperatureC: existingTelemetry?.engineTemperatureC ?? 84.0,
    rpm: existingTelemetry?.rpm ?? (speedKmh > 0 ? 1850 : 800),
    batteryVoltage: existingTelemetry?.batteryVoltage ?? 13.5,
    hydraulicPressureBar: existingTelemetry?.hydraulicPressureBar ?? 150,
    ignitionState: speedKmh > 0 ? 'ON' : 'IDLE',
    locationSource: 'operator_app',
    locationAccuracy: payload.accuracyMetres ?? 5.0,
    status: speedKmh > 10 ? 'DISPATCHED' : speedKmh > 0 ? 'ACTIVE' : 'AVAILABLE',
  };

  return {
    success: true,
    telemetryPoint,
    anomalyDetected: false,
    alerts: [],
    mode: 'OPERATOR_GPS',
  };
}

/**
 * Mode 1: Ingests CHC Manual GPS Location Update
 */
export function ingestManualGpsLocation(
  payload: ManualLocationPayload,
  existingTelemetry?: TelemetryPoint
): IngestionResult {
  const timestamp = new Date().toISOString();

  const telemetryPoint: TelemetryPoint = {
    machineId: payload.machineId,
    timestamp,
    latitude: Math.round(payload.latitude * 100000) / 100000,
    longitude: Math.round(payload.longitude * 100000) / 100000,
    speedKmh: 0,
    headingDeg: 0,
    fuelLevelPercent: existingTelemetry?.fuelLevelPercent ?? 85.0,
    fuelConsumptionRateLph: 0.0,
    engineHours: existingTelemetry?.engineHours ?? 150.0,
    engineTemperatureC: 45.0, // Ambient/cool
    rpm: 0,
    batteryVoltage: 12.8,
    hydraulicPressureBar: 0,
    ignitionState: 'OFF',
    locationSource: 'chc_manual',
    locationAccuracy: 10.0,
    status: 'AVAILABLE',
  };

  return {
    success: true,
    telemetryPoint,
    anomalyDetected: false,
    alerts: [],
    mode: 'MANUAL',
  };
}

/**
 * Telemetry Protocol Templates & Code Snippets
 */
export function getSampleHardwareConfig(machineId: string, chcCode = 'CHC-MP-SEH-01') {
  const endpointUrl = `${import.meta.env.VITE_SUPABASE_URL || 'https://vrmycvndfylrzuuxjrat.supabase.co'}/functions/v1/telemetry-webhook`;

  // Standard CAN-Bus J1939 JSON Payload
  const sampleJson: HardwareTelemetryPayload = {
    deviceId: 'JD-HARV-07',
    machineId: machineId || 'mach-jd-harv-07',
    timestamp: new Date().toISOString(),
    latitude: 23.1872,
    longitude: 77.1008,
    speedKmh: 6.8,
    headingDeg: 142,
    fuelLevelPercent: 78.5,
    fuelConsumptionRateLph: 8.4,
    engineHours: 342.8,
    engineTemperatureC: 86,
    rpm: 1950,
    batteryVoltage: 13.8,
    hydraulicPressureBar: 165,
    ignitionState: 'ON',
    odometerKm: 1420.5,
    status: 'ACTIVE',
    locationSource: 'gps_tracker',
    locationAccuracy: 2.5,
  };

  // AIS-140 Certified Format
  const ais140Payload = {
    header: 'KIOPS-AIS140',
    imei: '864201992817263',
    machineId: machineId || 'mach-jd-harv-07',
    gps: {
      lat: 23.1872,
      lon: 77.1008,
      speed: 6.8,
      heading: 142,
      fix: 1,
      satellites: 12,
    },
    telemetry: {
      fuel_pct: 78.5,
      fuel_lph: 7.2,
      engine_hours: 342.8,
      temp_c: 86,
      rpm: 1950,
      voltage_v: 13.8,
      ignition: 1,
    },
  };

  const curlSnippet = `curl -X POST "${endpointUrl}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'}" \\
  -d '${JSON.stringify(sampleJson, null, 2)}'`;

  return {
    endpointUrl,
    sampleJson,
    ais140Payload,
    curlSnippet,
  };
}
