import { TelemetryPoint, MachineStatus } from '../types';

export interface RouteWaypoint {
  latitude: number;
  longitude: number;
  label: string;
}

// Waypoints between Sehore Agri Centre (23.2030, 77.0844) and Ramesh Kumar's Farm in Bilkisganj, Sehore (23.1642, 77.1215)
export const SEHORE_DEMO_ROUTE: RouteWaypoint[] = [
  { latitude: 23.2030, longitude: 77.0844, label: 'Sehore Agri Centre (CHC Hub)' },
  { latitude: 23.1950, longitude: 77.0910, label: 'State Highway 18 Transit' },
  { latitude: 23.1870, longitude: 77.1005, label: 'Bhopal-Indore Bypass' },
  { latitude: 23.1780, longitude: 77.1090, label: 'Bilkisganj Rural Junction' },
  { latitude: 23.1700, longitude: 77.1150, label: 'North Village Canal Bridge' },
  { latitude: 23.1642, longitude: 77.1215, label: "Ramesh Kumar's 8-Acre Wheat Farm" },
];

export interface SimulationState {
  currentWaypointIndex: number;
  subStepFraction: number; // 0.0 to 1.0 between waypoints
  fuelLevelPercent: number;
  engineHours: number;
  engineTemperatureC: number;
  isFuelAnomalyActive: boolean;
  isOperatingInField: boolean;
}

export function getInitialSimulationState(): SimulationState {
  return {
    currentWaypointIndex: 0,
    subStepFraction: 0.0,
    fuelLevelPercent: 68.4,
    engineHours: 1243.7,
    engineTemperatureC: 84.5,
    isFuelAnomalyActive: false,
    isOperatingInField: false,
  };
}

/**
 * Advances the telemetry simulation by 1 time-step (typically 2 seconds)
 */
export function advanceSimulationStep(
  state: SimulationState,
  machineId: string,
  status: MachineStatus = 'ACTIVE'
): { nextState: SimulationState; telemetryPoint: TelemetryPoint } {
  const isOperating = status === 'ACTIVE';
  const isDispatched = status === 'DISPATCHED';

  let nextWaypointIndex = state.currentWaypointIndex;
  let nextSubStep = state.subStepFraction + (isDispatched || isOperating ? 0.08 : 0.01);

  if (nextSubStep >= 1.0) {
    nextSubStep = 0.0;
    nextWaypointIndex = (nextWaypointIndex + 1) % (SEHORE_DEMO_ROUTE.length);
  }

  const p1 = SEHORE_DEMO_ROUTE[nextWaypointIndex];
  const p2 = SEHORE_DEMO_ROUTE[(nextWaypointIndex + 1) % SEHORE_DEMO_ROUTE.length];

  const currentLat = p1.latitude + (p2.latitude - p1.latitude) * nextSubStep;
  const currentLon = p1.longitude + (p2.longitude - p1.longitude) * nextSubStep;

  // Baseline vs Anomaly fuel consumption
  const baselineConsumption = isOperating ? 7.2 : isDispatched ? 5.8 : 1.4;
  const fuelConsumptionRateLph = state.isFuelAnomalyActive 
    ? Math.round((baselineConsumption * 1.17) * 10) / 10 // +17% fuel anomaly
    : baselineConsumption;

  // Fuel depletion rate
  const fuelBurn = (fuelConsumptionRateLph / 3600) * 2; // per 2-second tick
  const nextFuelPercent = Math.max(12, Math.round((state.fuelLevelPercent - fuelBurn) * 100) / 100);

  // Engine hours advancement
  const nextEngineHours = Math.round((state.engineHours + (2 / 3600)) * 100) / 100;

  // Temperature variation
  let targetTemp = state.isFuelAnomalyActive ? 92.5 : isOperating ? 87.0 : 82.0;
  const tempFluctuation = (Math.random() - 0.5) * 0.4;
  const nextTemp = Math.round((state.engineTemperatureC * 0.95 + targetTemp * 0.05 + tempFluctuation) * 10) / 10;

  // Speed and RPM
  const speedKmh = isDispatched ? 18.4 : isOperating ? 6.8 : 0.0;
  const rpm = isOperating ? 1950 + Math.round((Math.random() - 0.5) * 60) : isDispatched ? 1650 : 800;

  const nextState: SimulationState = {
    ...state,
    currentWaypointIndex: nextWaypointIndex,
    subStepFraction: nextSubStep,
    fuelLevelPercent: nextFuelPercent,
    engineHours: nextEngineHours,
    engineTemperatureC: nextTemp,
  };

  const telemetryPoint: TelemetryPoint = {
    machineId,
    timestamp: new Date().toISOString(),
    latitude: Math.round(currentLat * 100000) / 100000,
    longitude: Math.round(currentLon * 100000) / 100000,
    speedKmh: Math.round(speedKmh * 10) / 10,
    fuelLevelPercent: nextFuelPercent,
    fuelConsumptionRateLph,
    engineHours: nextEngineHours,
    engineTemperatureC: nextTemp,
    rpm,
    batteryVoltage: 13.4,
    status
  };

  return { nextState, telemetryPoint };
}
