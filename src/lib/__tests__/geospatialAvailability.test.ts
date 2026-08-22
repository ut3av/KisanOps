import { describe, it, expect } from 'vitest';
import {
  calculateGeospatialDistance,
  getLocationFreshness,
  isMachineBookable,
  getNearbyMachineAvailability,
  validateMachineAvailabilityBeforeBooking,
  smartGeofenceSearch,
} from '../availabilityService';
import { Machine, CHC, Booking, PredictiveMaintenanceAlert } from '../../types';

describe('Geospatial Availability Service', () => {
  // Reference coords for test
  const FARM_LAT = 23.1642;
  const FARM_LON = 77.1215;

  const mockChcs: CHC[] = [
    {
      id: 'chc-sehore-01',
      name: 'Sehore Agri Centre',
      code: 'MP-SEH-01',
      village: 'Mandi Road',
      district: 'Sehore',
      state: 'Madhya Pradesh',
      latitude: 23.2030,
      longitude: 77.0844,
      contactPhone: '+91 98260 11223',
      operatingRadiusKm: 35,
      totalMachines: 14,
      activeMachines: 11,
    },
    {
      id: 'chc-bhopal-01',
      name: 'GreenFields CHC Hub',
      code: 'MP-BPL-02',
      village: 'Berasia Road',
      district: 'Bhopal',
      state: 'Madhya Pradesh',
      latitude: 23.2599,
      longitude: 77.4126,
      contactPhone: '+91 98260 44556',
      operatingRadiusKm: 50,
      totalMachines: 18,
      activeMachines: 14,
    },
  ];

  const now = new Date();
  const threeMinsAgo = new Date(now.getTime() - 3 * 60 * 1000).toISOString();
  const fifteenMinsAgo = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
  const twoHoursAgo = new Date(now.getTime() - 120 * 60 * 1000).toISOString();

  const mockMachines: Machine[] = [
    {
      id: 'm-harvester-live',
      chcId: 'chc-sehore-01',
      chcName: 'Sehore Agri Centre',
      identifier: 'MP-04-HA-1001',
      category: 'HARVESTER',
      brand: 'John Deere',
      model: 'W70 Combine',
      yearOfManufacture: 2024,
      powerHp: 100,
      status: 'AVAILABLE',
      baseRatePerHour: 2200,
      healthScore: 96,
      totalEngineHours: 320,
      serviceIntervalHours: 250,
      hoursSinceLastService: 45,
      imageUrl: '',
      rating: 4.9,
      totalRentals: 42,
      supportedActivities: ['HARVESTING'],
      latitude: 23.1872,
      longitude: 77.1008, // ~3.3 km from farm
      locationSource: 'gps_tracker',
      locationUpdatedAt: threeMinsAgo,
      operatorName: 'Suresh Verma',
      operatorPhone: '+91 98260 00001',
      operatorRating: 4.9,
      specs: { engine: '100 HP PowerTech Turbo', fuelTankLitres: 240 },
    },
    {
      id: 'm-tractor-recent',
      chcId: 'chc-sehore-01',
      chcName: 'Sehore Agri Centre',
      identifier: 'MP-04-TR-2001',
      category: 'TRACTOR',
      brand: 'Mahindra',
      model: '575 DI',
      yearOfManufacture: 2023,
      powerHp: 50,
      status: 'AVAILABLE',
      baseRatePerHour: 850,
      healthScore: 92,
      totalEngineHours: 640,
      serviceIntervalHours: 250,
      hoursSinceLastService: 80,
      imageUrl: '',
      rating: 4.8,
      totalRentals: 65,
      supportedActivities: ['SOIL_PREPARATION', 'TRANSPORT'],
      latitude: 23.1950,
      longitude: 77.0920, // ~4.6 km from farm
      locationSource: 'operator_app',
      locationUpdatedAt: fifteenMinsAgo,
      operatorName: 'Ramesh Patel',
      operatorPhone: '+91 98260 00002',
      operatorRating: 4.8,
      specs: { engine: '50 HP m-BULL Engine', fuelTankLitres: 60 },
    },
    {
      id: 'm-rotavator-stale',
      chcId: 'chc-sehore-01',
      chcName: 'Sehore Agri Centre',
      identifier: 'MP-04-RO-3001',
      category: 'ROTAVATOR',
      brand: 'Shaktiman',
      model: 'Regular Light 7ft',
      yearOfManufacture: 2024,
      powerHp: 45,
      status: 'AVAILABLE',
      baseRatePerHour: 450,
      healthScore: 95,
      totalEngineHours: 120,
      serviceIntervalHours: 300,
      hoursSinceLastService: 20,
      imageUrl: '',
      rating: 4.9,
      totalRentals: 30,
      supportedActivities: ['SOIL_PREPARATION'],
      latitude: 23.2030,
      longitude: 77.0844, // ~5.6 km from farm
      locationSource: 'chc_manual',
      locationUpdatedAt: twoHoursAgo,
      operatorName: 'CHC Hub Driver',
      operatorPhone: '+91 98260 00003',
      operatorRating: 4.7,
      specs: { engine: '48 L-type Boron Blades', fuelTankLitres: 0 },
    },
    {
      id: 'm-maintenance-offline',
      chcId: 'chc-sehore-01',
      chcName: 'Sehore Agri Centre',
      identifier: 'MP-04-TR-9999',
      category: 'TRACTOR',
      brand: 'Sonalika',
      model: 'DI 750 III',
      yearOfManufacture: 2022,
      powerHp: 55,
      status: 'MAINTENANCE',
      baseRatePerHour: 880,
      healthScore: 62,
      totalEngineHours: 1200,
      serviceIntervalHours: 250,
      hoursSinceLastService: 260,
      imageUrl: '',
      rating: 4.3,
      totalRentals: 90,
      supportedActivities: ['SOIL_PREPARATION'],
      latitude: 23.1900,
      longitude: 77.1000,
      locationSource: 'chc_manual',
      locationUpdatedAt: twoHoursAgo,
      operatorName: 'Shop Mechanic',
      operatorPhone: '+91 98260 00004',
      operatorRating: 4.2,
      specs: { engine: '55 HP Engine', fuelTankLitres: 65 },
    },
    {
      id: 'm-distant-bhopal-harvester',
      chcId: 'chc-bhopal-01',
      chcName: 'GreenFields CHC Hub',
      identifier: 'MP-04-HA-8888',
      category: 'HARVESTER',
      brand: 'Preet',
      model: '987 Combine',
      yearOfManufacture: 2023,
      powerHp: 101,
      status: 'AVAILABLE',
      baseRatePerHour: 2100,
      healthScore: 90,
      totalEngineHours: 410,
      serviceIntervalHours: 250,
      hoursSinceLastService: 30,
      imageUrl: '',
      rating: 4.7,
      totalRentals: 28,
      supportedActivities: ['HARVESTING'],
      latitude: 23.2599,
      longitude: 77.4126, // ~28.5 km from farm
      locationSource: 'gps_tracker',
      locationUpdatedAt: threeMinsAgo,
      operatorName: 'Bhopal Driver',
      operatorPhone: '+91 98260 00005',
      operatorRating: 4.8,
      specs: { engine: '101 HP Turbo', fuelTankLitres: 250 },
    },
  ];

  it('calculates accurate Haversine geospatial distances', () => {
    // Farm to Sehore CHC Hub (23.2030, 77.0844) ~ 5.6 km
    const distSehore = calculateGeospatialDistance(FARM_LAT, FARM_LON, 23.2030, 77.0844);
    expect(distSehore).toBeGreaterThan(5.0);
    expect(distSehore).toBeLessThan(6.2);

    // Farm to Bhopal CHC Hub (23.2599, 77.4126) ~ 31.6 km
    const distBhopal = calculateGeospatialDistance(FARM_LAT, FARM_LON, 23.2599, 77.4126);
    expect(distBhopal).toBeGreaterThan(28.0);
    expect(distBhopal).toBeLessThan(33.0);
  });

  it('correctly classifies location freshness based on timestamps', () => {
    const liveFreshness = getLocationFreshness(threeMinsAgo, 'gps_tracker');
    expect(liveFreshness.status).toBe('LIVE');
    expect(liveFreshness.text).toContain('Live GPS');

    const recentFreshness = getLocationFreshness(fifteenMinsAgo, 'operator_app');
    expect(recentFreshness.status).toBe('RECENT');
    expect(recentFreshness.text).toContain('Recent');

    const staleFreshness = getLocationFreshness(twoHoursAgo, 'chc_manual');
    expect(staleFreshness.status).toBe('STALE');
    expect(staleFreshness.text).toContain('Location updated');
  });

  it('returns available machines within 10 km geofence radius', async () => {
    const snapshot = await getNearbyMachineAvailability(
      {
        latitude: FARM_LAT,
        longitude: FARM_LON,
        radiusKm: 10,
      },
      {
        machines: mockMachines,
        chcs: mockChcs,
        bookings: [],
        maintenanceAlerts: [],
      }
    );

    expect(snapshot.radiusKm).toBe(10);
    expect(snapshot.totalInRadius).toBe(4); // 4 machines in Sehore region
    expect(snapshot.totalAvailable).toBe(3); // 3 available, 1 maintenance
    expect(snapshot.byType['HARVESTER']).toBe(1);
    expect(snapshot.byType['TRACTOR']).toBe(1);
    expect(snapshot.byType['ROTAVATOR']).toBe(1);
    expect(snapshot.chcsInRadius).toBe(1); // Only Sehore CHC Hub is <= 10 km
  });

  it('includes distant machines when radius is expanded to 50 km', async () => {
    const snapshot = await getNearbyMachineAvailability(
      {
        latitude: FARM_LAT,
        longitude: FARM_LON,
        radiusKm: 50,
      },
      {
        machines: mockMachines,
        chcs: mockChcs,
        bookings: [],
        maintenanceAlerts: [],
      }
    );

    expect(snapshot.radiusKm).toBe(50);
    expect(snapshot.totalInRadius).toBe(5);
    expect(snapshot.totalAvailable).toBe(4);
    expect(snapshot.byType['HARVESTER']).toBe(2); // Sehore + Bhopal Harvesters
    expect(snapshot.chcsInRadius).toBe(2);
  });

  it('filters out machines with active bookings overlapping requested window', () => {
    const activeBooking: Booking = {
      id: 'b-active-1',
      bookingNumber: 'BK-2026-001',
      farmerId: 'farmer-other',
      farmerName: 'Other Farmer',
      farmerPhone: '+91 99999 00000',
      chcId: 'chc-sehore-01',
      chcName: 'Sehore Agri Centre',
      machineId: 'm-harvester-live',
      machineIdentifier: 'MP-04-HA-1001',
      machineModel: 'John Deere W70',
      machineCategory: 'HARVESTER',
      farmId: 'farm-other',
      farmName: 'Other Farm',
      farmLocation: 'Sehore',
      activity: 'HARVESTING',
      status: 'CONFIRMED',
      bookingMode: 'HOURLY',
      bookedHours: 6,
      startTime: new Date(now.getTime() + 1 * 3600 * 1000).toISOString(),
      endTime: new Date(now.getTime() + 7 * 3600 * 1000).toISOString(),
      hourlyRate: 2200,
      estimatedTotal: 13200,
      paymentMethod: 'UPI',
      paymentStatus: 'AUTHORIZED',
      operatorName: 'Suresh Verma',
      operatorPhone: '+91 98260 00001',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    // Checking during the booked window
    const bookableCheck = isMachineBookable(
      mockMachines[0],
      [activeBooking],
      [],
      new Date(now.getTime() + 2 * 3600 * 1000).toISOString(),
      new Date(now.getTime() + 6 * 3600 * 1000).toISOString()
    );

    expect(bookableCheck.isBookable).toBe(false);
    expect(bookableCheck.unavailabilityReason).toContain('active booking window');
  });

  it('performs atomic pre-booking validation to prevent race conditions', () => {
    const activeAlert: PredictiveMaintenanceAlert = {
      id: 'alert-crit-1',
      machineId: 'm-harvester-live',
      machineIdentifier: 'MP-04-HA-1001',
      machineModel: 'John Deere W70',
      alertType: 'TEMP_SURGE',
      severity: 'CRITICAL',
      description: 'Coolant overheating detected',
      recommendedAction: 'Inspect radiator coolant level',
      urgencyHours: 2,
      isResolved: false,
      createdAt: now.toISOString(),
    };

    const validation = validateMachineAvailabilityBeforeBooking(
      'm-harvester-live',
      new Date().toISOString(),
      new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
      {
        machines: mockMachines,
        bookings: [],
        maintenanceAlerts: [activeAlert],
      }
    );

    expect(validation.valid).toBe(false);
    expect(validation.errorCode).toBe('UNAVAILABLE');
    expect(validation.message).toBeDefined();
  });

  it('smart geofence search suggests radius expansion when local radius is empty', async () => {
    // Search for Harvesters within a narrow 2 km radius (none within 2km)
    const result = await smartGeofenceSearch(
      {
        latitude: FARM_LAT,
        longitude: FARM_LON,
        radiusKm: 2,
        machineCategory: 'HARVESTER',
      },
      {
        machines: mockMachines,
        chcs: mockChcs,
        bookings: [],
        maintenanceAlerts: [],
      }
    );

    expect(result.isExpanded).toBe(true);
    expect(result.originalRadiusKm).toBe(2);
    expect(result.expandedRadiusKm).toBe(25);
    expect(result.snapshot.totalAvailable).toBe(1); // Sehore harvester found in 25km
    expect(result.explanationMessage).toContain('2 किलोमीटर');
    expect(result.explanationMessage).toContain('25 किलोमीटर');
  });
});
