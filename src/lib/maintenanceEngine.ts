import { Machine, PredictiveMaintenanceAlert, TelemetryPoint } from '../types';

export interface MaintenanceHealthBreakdown {
  overallHealthScore: number; // 0 - 100
  maintenanceHistoryScore: number; // 25%
  engineParametersScore: number;   // 20%
  fuelEfficiencyScore: number;     // 20%
  usageAgeScore: number;           // 15%
  faultEventsScore: number;        // 10%
  serviceComplianceScore: number;  // 10%
  statusCategory: 'Excellent' | 'Good' | 'Fair' | 'Critical';
}

/**
 * Calculates multi-dimensional component health score (0-100)
 */
export function calculateMachineHealth(machine: Machine, telemetry?: TelemetryPoint): MaintenanceHealthBreakdown {
  const hoursUntilService = machine.serviceIntervalHours - machine.hoursSinceLastService;
  
  // 1. Service Compliance (10%)
  let serviceComplianceScore = 10;
  if (hoursUntilService <= 0) serviceComplianceScore = 2;
  else if (hoursUntilService < 30) serviceComplianceScore = 6;

  // 2. Engine Parameters (20%)
  let engineParametersScore = 20;
  if (telemetry && telemetry.engineTemperatureC > 95) engineParametersScore = 8;
  else if (telemetry && telemetry.engineTemperatureC > 90) engineParametersScore = 14;

  // 3. Fuel Efficiency (20%)
  let fuelEfficiencyScore = 20;
  if (telemetry && telemetry.fuelConsumptionRateLph > 8.0) fuelEfficiencyScore = 10;

  // 4. Maintenance History (25%)
  const maintenanceHistoryScore = machine.healthScore >= 90 ? 24 : 18;

  // 5. Usage Age (15%)
  const usageAgeScore = machine.yearOfManufacture >= 2022 ? 15 : machine.yearOfManufacture >= 2019 ? 12 : 9;

  // 6. Fault Events (10%)
  const faultEventsScore = (telemetry && telemetry.fuelConsumptionRateLph > 8.0) ? 6 : 10;

  const total = Math.min(
    100,
    maintenanceHistoryScore +
    engineParametersScore +
    fuelEfficiencyScore +
    usageAgeScore +
    faultEventsScore +
    serviceComplianceScore
  );

  let statusCategory: MaintenanceHealthBreakdown['statusCategory'] = 'Good';
  if (total >= 90) statusCategory = 'Excellent';
  else if (total >= 75) statusCategory = 'Good';
  else if (total >= 60) statusCategory = 'Fair';
  else statusCategory = 'Critical';

  return {
    overallHealthScore: total,
    maintenanceHistoryScore,
    engineParametersScore,
    fuelEfficiencyScore,
    usageAgeScore,
    faultEventsScore,
    serviceComplianceScore,
    statusCategory,
  };
}

/**
 * Evaluates real-time telemetry stream against predictive degradation thresholds
 */
export function evaluatePredictiveAlerts(
  machine: Machine,
  telemetry: TelemetryPoint,
  isAnomalyInjected: boolean
): PredictiveMaintenanceAlert | null {
  const baselineLph = 7.2;
  const currentLph = telemetry.fuelConsumptionRateLph;

  if (isAnomalyInjected || currentLph >= baselineLph * 1.15) {
    const deltaPercent = Math.round(((currentLph - baselineLph) / baselineLph) * 100);
    return {
      id: `alert-fuel-${machine.id}`,
      machineId: machine.id,
      machineIdentifier: machine.identifier,
      machineModel: `${machine.brand} ${machine.model}`,
      alertType: 'FUEL_ANOMALY',
      severity: 'HIGH',
      description: `Fuel consumption is +${deltaPercent}% above baseline (${currentLph} L/h vs ${baselineLph} L/h expected).`,
      recommendedAction: 'Inspect fuel injection pressure and clean particulate filter before next dispatch.',
      fuelAnomalyDeltaPercent: deltaPercent,
      urgencyHours: 24,
      isResolved: false,
      createdAt: new Date().toISOString(),
    };
  }

  const hoursRemaining = machine.serviceIntervalHours - machine.hoursSinceLastService;
  if (hoursRemaining <= 25) {
    return {
      id: `alert-service-${machine.id}`,
      machineId: machine.id,
      machineIdentifier: machine.identifier,
      machineModel: `${machine.brand} ${machine.model}`,
      alertType: 'SERVICE_OVERDUE',
      severity: hoursRemaining <= 0 ? 'CRITICAL' : 'MEDIUM',
      description: `Scheduled engine oil and hydraulic filter replacement due in ${Math.max(0, Math.round(hoursRemaining))} operating hours.`,
      recommendedAction: 'Schedule 250-hour preventative maintenance service package with authorized CHC technician.',
      remainingHoursToService: Math.max(0, Math.round(hoursRemaining)),
      urgencyHours: hoursRemaining <= 0 ? 12 : 48,
      isResolved: false,
      createdAt: new Date().toISOString(),
    };
  }

  return null;
}
