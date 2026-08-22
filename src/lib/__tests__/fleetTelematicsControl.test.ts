import { describe, it, expect } from 'vitest';
import {
  ingestHardwareTelemetry,
  ingestOperatorGpsTelemetry,
  ingestManualGpsLocation,
  HardwareTelemetryPayload,
  OperatorGpsPayload,
  ManualLocationPayload,
} from '../iotIngestionEngine';
import {
  calculateGeospatialDistance,
  getNearbyMachineAvailability,
  isMachineBookable,
} from '../availabilityService';
import { Machine, TelemetryPoint, PredictiveMaintenanceAlert } from '../../types';

describe('Fleet Operations & Real-Time Telematics Control Center', () => {
  const sampleMachine: Machine = {
    id: 'mach-tractor-test',
    chcId: 'chc-sehore-01',
    chcName: 'Sehore Agri Centre',
    identifier: 'MP-04-TR-9901',
    category: 'TRACTOR',
    brand: 'Mahindra',
    model: '575 DI SP Plus',
    yearOfManufacture: 2024,
    powerHp: 50,
    status: 'AVAILABLE',
    baseRatePerHour: 850,
    healthScore: 95,
    totalEngineHours: 120.0,
    hoursSinceLastService: 120.0,
    serviceIntervalHours: 250.0,
    imageUrl: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0',
    rating: 4.8,
    totalRentals: 15,
    supportedActivities: ['SOWING', 'SOIL_PREPARATION'],
    latitude: 23.2030,
    longitude: 77.0844,
    telemetryMode: 'HARDWARE_IOT',
    specs: {
      engine: '4-Cylinder DI Diesel Engine',
      fuelTankLitres: 60,
    },
  };

  const farmCenter = {
    latitude: 23.1642, // Bilkisganj
    longitude: 77.1215,
  };

  describe('Mode 1: Manual Location Ingestion', () => {
    it('correctly ingests manual GPS coordinates and sets source to chc_manual', () => {
      const payload: ManualLocationPayload = {
        machineId: sampleMachine.id,
        latitude: 23.1700,
        longitude: 77.1150,
        parkingLocationName: 'North Village Canal Bridge',
      };

      const result = ingestManualGpsLocation(payload);
      expect(result.success).toBe(true);
      expect(result.mode).toBe('MANUAL');
      expect(result.telemetryPoint?.latitude).toBe(23.17);
      expect(result.telemetryPoint?.longitude).toBe(77.115);
      expect(result.telemetryPoint?.locationSource).toBe('chc_manual');
      expect(result.telemetryPoint?.locationAccuracy).toBe(10.0);
      expect(result.telemetryPoint?.status).toBe('AVAILABLE');
    });
  });

  describe('Mode 2: Driver Mobile GPS Ingestion', () => {
    it('ingests high-accuracy mobile GPS streams with speed and heading', () => {
      const payload: OperatorGpsPayload = {
        machineId: sampleMachine.id,
        operatorId: 'op-raju-01',
        latitude: 23.1950,
        longitude: 77.0910,
        speedKmh: 18.5,
        headingDeg: 215,
        accuracyMetres: 3.8,
      };

      const result = ingestOperatorGpsTelemetry(payload);
      expect(result.success).toBe(true);
      expect(result.mode).toBe('OPERATOR_GPS');
      expect(result.telemetryPoint?.latitude).toBe(23.195);
      expect(result.telemetryPoint?.longitude).toBe(77.091);
      expect(result.telemetryPoint?.speedKmh).toBe(18.5);
      expect(result.telemetryPoint?.headingDeg).toBe(215);
      expect(result.telemetryPoint?.locationSource).toBe('operator_app');
      expect(result.telemetryPoint?.locationAccuracy).toBe(3.8);
      expect(result.telemetryPoint?.status).toBe('DISPATCHED');
    });
  });

  describe('Mode 3: Hardware IoT & Anomaly Sentinels', () => {
    it('ingests nominal CAN-Bus payload without raising alarms', () => {
      const payload: HardwareTelemetryPayload = {
        machineId: sampleMachine.id,
        deviceId: 'JD-HARV-07',
        latitude: 23.1872,
        longitude: 77.1008,
        speedKmh: 6.5,
        headingDeg: 140,
        fuelLevelPercent: 78.5,
        fuelConsumptionRateLph: 7.2,
        engineHours: 342.8,
        engineTemperatureC: 85,
        rpm: 1950,
        batteryVoltage: 13.8,
        hydraulicPressureBar: 160,
        status: 'ACTIVE',
      };

      const result = ingestHardwareTelemetry(payload, 7.2);
      expect(result.success).toBe(true);
      expect(result.anomalyDetected).toBe(false);
      expect(result.alerts.length).toBe(0);
      expect(result.telemetryPoint?.engineHours).toBe(342.8);
    });

    it('triggers critical TEMP_SURGE alert when engine temperature exceeds 100°C', () => {
      const payload: HardwareTelemetryPayload = {
        machineId: sampleMachine.id,
        deviceId: 'JD-HARV-07',
        latitude: 23.1872,
        longitude: 77.1008,
        speedKmh: 4.2,
        fuelLevelPercent: 60.0,
        fuelConsumptionRateLph: 7.5,
        engineHours: 345.0,
        engineTemperatureC: 109, // Overheating
        rpm: 2100,
      };

      const result = ingestHardwareTelemetry(payload);
      expect(result.success).toBe(true);
      expect(result.anomalyDetected).toBe(true);
      expect(result.alerts.some(a => a.alertType === 'TEMP_SURGE')).toBe(true);
      const tempAlert = result.alerts.find(a => a.alertType === 'TEMP_SURGE');
      expect(tempAlert?.severity).toBe('CRITICAL');
    });

    it('triggers FUEL_ANOMALY alert when fuel consumption spikes by +15% or more', () => {
      const nominalBaseline = 7.2;
      const payload: HardwareTelemetryPayload = {
        machineId: sampleMachine.id,
        latitude: 23.1872,
        longitude: 77.1008,
        fuelLevelPercent: 45.0,
        fuelConsumptionRateLph: 12.0, // +67% surge
        engineHours: 350.0,
        engineTemperatureC: 88,
      };

      const result = ingestHardwareTelemetry(payload, nominalBaseline);
      expect(result.anomalyDetected).toBe(true);
      expect(result.alerts.some(a => a.alertType === 'FUEL_ANOMALY')).toBe(true);
      const fuelAlert = result.alerts.find(a => a.alertType === 'FUEL_ANOMALY');
      expect(fuelAlert?.severity).toBe('CRITICAL');
    });

    it('triggers VIBRATION_SPIKE alert when RPM redlines above 2400 RPM', () => {
      const payload: HardwareTelemetryPayload = {
        machineId: sampleMachine.id,
        latitude: 23.1872,
        longitude: 77.1008,
        fuelLevelPercent: 70.0,
        engineHours: 352.0,
        engineTemperatureC: 92,
        rpm: 2600, // Redline
      };

      const result = ingestHardwareTelemetry(payload);
      expect(result.anomalyDetected).toBe(true);
      expect(result.alerts.some(a => a.alertType === 'VIBRATION_SPIKE')).toBe(true);
    });

    it('triggers BATTERY_LOW alert when voltage drops below 11.8V under active ignition', () => {
      const payload: HardwareTelemetryPayload = {
        machineId: sampleMachine.id,
        latitude: 23.1872,
        longitude: 77.1008,
        fuelLevelPercent: 70.0,
        engineHours: 352.0,
        engineTemperatureC: 80,
        rpm: 1200,
        batteryVoltage: 11.2, // Alternator fault
        ignitionState: 'ON',
      };

      const result = ingestHardwareTelemetry(payload);
      expect(result.anomalyDetected).toBe(true);
      expect(result.alerts.some(a => a.alertType === 'BATTERY_LOW')).toBe(true);
    });
  });

  describe('Real-Time Synchronization with Farmer Geofenced Availability', () => {
    it('immediately updates farmer availability and distance when machine location changes', async () => {
      // Machine at Sehore (~5.6 km from Bilkisganj)
      const machineSehore: Machine = {
        ...sampleMachine,
        latitude: 23.2030,
        longitude: 77.0844,
      };

      const dist1 = calculateGeospatialDistance(
        farmCenter.latitude,
        farmCenter.longitude,
        machineSehore.latitude,
        machineSehore.longitude
      );
      expect(dist1).toBeGreaterThan(5.0);
      expect(dist1).toBeLessThan(6.0);

      // Now CHC operator moves machine to Bilkisganj canal (~0.9 km from farm)
      const manualPayload: ManualLocationPayload = {
        machineId: sampleMachine.id,
        latitude: 23.1700,
        longitude: 77.1150,
      };
      const ingestion = ingestManualGpsLocation(manualPayload);
      expect(ingestion.success).toBe(true);

      const dist2 = calculateGeospatialDistance(
        farmCenter.latitude,
        farmCenter.longitude,
        ingestion.telemetryPoint!.latitude,
        ingestion.telemetryPoint!.longitude
      );
      expect(dist2).toBeLessThan(1.5);
    });

    it('excludes machine from bookable availability when flagged with a critical maintenance alert', () => {
      const criticalAlert: PredictiveMaintenanceAlert = {
        id: 'alert-crit-test',
        machineId: sampleMachine.id,
        machineIdentifier: sampleMachine.identifier,
        machineModel: `${sampleMachine.brand} ${sampleMachine.model}`,
        alertType: 'TEMP_SURGE',
        severity: 'CRITICAL',
        description: 'Engine coolant overheating',
        recommendedAction: 'Halt machine immediately',
        urgencyHours: 2,
        isResolved: false,
        createdAt: new Date().toISOString(),
      };

      const check = isMachineBookable(
        sampleMachine,
        [],
        [criticalAlert]
      );

      expect(check.isBookable).toBe(false);
      expect(check.unavailabilityReason).toContain('preventive maintenance');
    });
  });
});
