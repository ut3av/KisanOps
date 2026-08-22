import { useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  CHC,
  Farm,
  Machine,
  MachineStatus,
  DemandForecast,
  MachineAllocationRecommendation,
  AgriCreditProfile,
  Booking,
  PredictiveMaintenanceAlert,
  InAppNotification,
  Invoice,
  TelemetryPoint,
} from '../types';
import {
  SEEDED_PROFILES,
  SEEDED_CHCS,
  SEEDED_FARM,
  SEEDED_MACHINES,
  SEEDED_DEMAND_FORECASTS,
  SEEDED_ALLOCATION_RECOMMENDATIONS,
  SEEDED_AGRICREDIT_PROFILE,
  SEEDED_BOOKINGS,
  SEEDED_MAINTENANCE_ALERTS,
  SEEDED_NOTIFICATIONS,
} from '../data/seedData';
import { advanceSimulationStep, getInitialSimulationState, SimulationState } from '../lib/telematicsEngine';
import { calculateFinalInvoice } from '../lib/billingEngine';
import {
  fetchInitialPlatformData,
  saveBookingToDatabase,
  updateBookingInDatabase,
  insertLiveTelemetryToDatabase,
  subscribeToSupabaseRealtime,
} from '../lib/dbService';
import {
  ingestHardwareTelemetry,
  ingestOperatorGpsTelemetry,
  ingestManualGpsLocation,
  HardwareTelemetryPayload,
  OperatorGpsPayload,
  ManualLocationPayload,
} from '../lib/iotIngestionEngine';
import { TelemetryModeType } from '../types';

export interface AppState {
  currentUser: UserProfile;
  selectedRole: UserRole;
  chcs: CHC[];
  farm: Farm;
  machines: Machine[];
  demandForecasts: DemandForecast[];
  allocations: MachineAllocationRecommendation[];
  agriCredit: AgriCreditProfile;
  bookings: Booking[];
  maintenanceAlerts: PredictiveMaintenanceAlert[];
  notifications: InAppNotification[];
  invoices: Invoice[];
  currentTelemetry: Record<string, TelemetryPoint>; // machineId -> point
  simulationState: SimulationState;
  isSimulating: boolean;
  activeDemoScene: number;
  isCloudSynced: boolean;
  isInitialLoading: boolean;
  isDemoLoaded: boolean;
}

const STORAGE_KEY = 'kisanops_app_state_v2';

function createCleanUnconfiguredFarm(user: UserProfile): Farm {
  return {
    id: `farm-${user.id}`,
    farmerId: user.id,
    farmName: '',
    district: '',
    village: '',
    state: '',
    sizeAcres: 0,
    latitude: 23.1872,
    longitude: 77.1008,
    soilType: '',
    irrigationType: 'Canal',
    crop: {
      id: `crop-${user.id}`,
      cropName: '',
      season: 'Rabi',
      cropStage: 'Sowing',
    },
  };
}

function createFreshAgriCreditForUser(user: UserProfile): AgriCreditProfile {
  return {
    farmerId: user.id,
    creditScore: 720,
    ratingCategory: 'Good',
    creditLimit: 10000,
    availableCredit: 10000,
    utilizedCredit: 0,
    factors: [
      {
        name: 'Historical Rental Settlements',
        weight: 0.35,
        score: 75,
        status: 'Good',
        description: 'Account verified for deferred settlements',
      },
      {
        name: 'Zero-Dispute Reliability',
        weight: 0.25,
        score: 85,
        status: 'Excellent',
        description: 'Clean digital phone authentication',
      },
      {
        name: 'Farm Acreage Verification',
        weight: 0.20,
        score: 70,
        status: 'Good',
        description: 'Land record documented with geo-fencing',
      },
      {
        name: 'Profile Stability & KYC',
        weight: 0.20,
        score: 90,
        status: 'Excellent',
        description: 'Identity authenticated for operations',
      },
    ],
  };
}

export function getCleanProductionState(): AppState {
  const defaultUser: UserProfile = {
    id: 'usr-fresh-01',
    fullName: 'Agricultural Producer',
    phoneNumber: '+91 98765 43210',
    role: 'FARMER',
    district: '',
    village: '',
  };

  return {
    currentUser: defaultUser,
    selectedRole: 'FARMER',
    chcs: [],
    farm: createCleanUnconfiguredFarm(defaultUser),
    machines: [],
    demandForecasts: [],
    allocations: [],
    agriCredit: createFreshAgriCreditForUser(defaultUser),
    bookings: [],
    maintenanceAlerts: [],
    notifications: [],
    invoices: [],
    currentTelemetry: {},
    simulationState: getInitialSimulationState(),
    isSimulating: false,
    activeDemoScene: 1,
    isCloudSynced: false,
    isInitialLoading: false,
    isDemoLoaded: false,
  };
}

export function getPopulatedDemoState(): AppState {
  return {
    currentUser: SEEDED_PROFILES[0],
    selectedRole: 'FARMER',
    chcs: SEEDED_CHCS,
    farm: SEEDED_FARM,
    machines: SEEDED_MACHINES,
    demandForecasts: SEEDED_DEMAND_FORECASTS,
    allocations: SEEDED_ALLOCATION_RECOMMENDATIONS,
    agriCredit: SEEDED_AGRICREDIT_PROFILE,
    bookings: SEEDED_BOOKINGS,
    maintenanceAlerts: SEEDED_MAINTENANCE_ALERTS,
    notifications: SEEDED_NOTIFICATIONS,
    invoices: [],
    currentTelemetry: {},
    simulationState: getInitialSimulationState(),
    isSimulating: true,
    activeDemoScene: 1,
    isCloudSynced: false,
    isInitialLoading: false,
    isDemoLoaded: true,
  };
}

function getInitialState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.currentUser) {
        return {
          ...parsed,
          isInitialLoading: false,
          isDemoLoaded: parsed.isDemoLoaded ?? (parsed.machines?.length > 0),
        };
      }
    }
  } catch (e) {
    console.warn('Failed to parse saved state, starting clean', e);
  }

  // Clean Production Slate by default (0 demo machines, 0 bookings, 0 alerts)
  return getCleanProductionState();
}

let globalState: AppState = getInitialState();
const listeners = new Set<() => void>();
let isInitialized = false;
let simulationTimer: ReturnType<typeof setInterval> | null = null;

function notify() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
  } catch (e) {
    // Ignore storage quota limits
  }
  listeners.forEach(listener => listener());
}

// Singleton background telematics simulation loop
function startGlobalSimulationLoop() {
  if (simulationTimer) return;

  simulationTimer = setInterval(() => {
    if (!globalState.isSimulating || globalState.machines.length === 0) return;

    const activeBooking = globalState.bookings.find(
      b => b.status === 'DISPATCHED' || b.status === 'IN_PROGRESS'
    );
    const targetMachineId = activeBooking ? activeBooking.machineId : (globalState.machines[0]?.id || 'mach-jd-harv-07');
    const targetStatus: MachineStatus = activeBooking
      ? (activeBooking.status === 'IN_PROGRESS' ? 'ACTIVE' : activeBooking.status === 'DISPATCHED' ? 'DISPATCHED' : 'RESERVED')
      : 'ACTIVE';

    const { nextState, telemetryPoint } = advanceSimulationStep(
      globalState.simulationState,
      targetMachineId,
      targetStatus
    );

    globalState = {
      ...globalState,
      simulationState: nextState,
      currentTelemetry: {
        ...globalState.currentTelemetry,
        [targetMachineId]: telemetryPoint,
      },
      machines: globalState.machines.map(m =>
        m.id === targetMachineId
          ? {
              ...m,
              latitude: telemetryPoint.latitude,
              longitude: telemetryPoint.longitude,
              locationUpdatedAt: telemetryPoint.timestamp,
              locationSource: 'gps_tracker',
            }
          : m
      ),
    };

    // Background sync of telemetry point to Supabase
    insertLiveTelemetryToDatabase(telemetryPoint);

    // Check if fuel anomaly should inject high-priority alert
    if (nextState.isFuelAnomalyActive) {
      const existingAlert = globalState.maintenanceAlerts.find(
        a => a.machineId === targetMachineId && a.alertType === 'FUEL_ANOMALY' && !a.isResolved
      );
      if (!existingAlert) {
        const targetMachine = globalState.machines.find(m => m.id === targetMachineId);
        const newAlert: PredictiveMaintenanceAlert = {
          id: `alert-fuel-auto-${Date.now()}`,
          machineId: targetMachineId,
          machineIdentifier: targetMachine?.identifier || 'JD-HARV-07',
          machineModel: targetMachine ? `${targetMachine.brand} ${targetMachine.model}` : 'John Deere W70 Harvester',
          alertType: 'FUEL_ANOMALY',
          severity: 'HIGH',
          description: 'Live sensor telemetry indicates fuel burn rate is +17% above nominal baseline (8.4 L/h).',
          recommendedAction: 'Inspect fuel injection pressure nozzle and particulate filter within 24 hours.',
          fuelAnomalyDeltaPercent: 17,
          urgencyHours: 24,
          isResolved: false,
          createdAt: new Date().toISOString(),
        };

        globalState.maintenanceAlerts = [newAlert, ...globalState.maintenanceAlerts];
        globalState.notifications = [
          {
            id: `notif-alert-${Date.now()}`,
            title: 'Predictive Alert: Fuel Anomaly',
            message: `${newAlert.machineIdentifier} fuel burn rate +17% above baseline. Inspection advised.`,
            type: 'MAINTENANCE',
            linkUrl: '/chc/maintenance',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          ...globalState.notifications,
        ];
      }
    }

    notify();
  }, 2000);
}

// Start simulation loop once at module initialization
startGlobalSimulationLoop();

export function useKisanOpsStore() {
  const [state, setState] = useState<AppState>(globalState);

  useEffect(() => {
    const listener = () => setState({ ...globalState });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Initialize from Supabase if configured and setup Realtime channel once
  useEffect(() => {
    if (!isInitialized) {
      isInitialized = true;
      fetchInitialPlatformData().then(cloudData => {
        globalState = {
          ...globalState,
          chcs: cloudData.chcs,
          machines: cloudData.machines,
          bookings: cloudData.bookings.length > 0 ? cloudData.bookings : globalState.bookings,
          maintenanceAlerts: cloudData.maintenanceAlerts,
          invoices: cloudData.invoices.length > 0 ? cloudData.invoices : globalState.invoices,
          isCloudSynced: cloudData.isCloudSynced,
          isInitialLoading: false,
        };
        notify();
      });

      // Realtime listener for cross-tab or remote device updates
      const sub = subscribeToSupabaseRealtime((event) => {
        if (event.table === 'bookings' && event.new) {
          const incoming = event.new;
          globalState = {
            ...globalState,
            bookings: [
              incoming,
              ...globalState.bookings.filter(b => b.id !== incoming.id),
            ],
          };
          notify();
        }
      });

      return () => {
        sub.unsubscribe();
      };
    }
  }, []);

  return {
    state,

    /**
     * Authenticates and logs in a specific user profile without falling back to demo data.
     * If user is not one of the pre-seeded demo accounts, initializes fresh user-specific state.
     */
    loginUser: (profile: UserProfile) => {
      const isDemoUser = SEEDED_PROFILES.some(p => p.id === profile.id || p.email === profile.email);

      if (isDemoUser) {
        const seededMatch = SEEDED_PROFILES.find(p => p.id === profile.id || p.email === profile.email) || profile;
        globalState = {
          ...globalState,
          currentUser: seededMatch,
          selectedRole: seededMatch.role,
          farm: SEEDED_FARM,
          agriCredit: SEEDED_AGRICREDIT_PROFILE,
          bookings: SEEDED_BOOKINGS,
          maintenanceAlerts: SEEDED_MAINTENANCE_ALERTS,
          notifications: SEEDED_NOTIFICATIONS,
        };
      } else {
        // Newly created account / custom user: create fresh personalized profile
        const freshFarm = createCleanUnconfiguredFarm(profile);
        const freshCredit = createFreshAgriCreditForUser(profile);
        const welcomeNotification: InAppNotification = {
          id: `notif-welcome-${Date.now()}`,
          title: `Welcome to Yukti, ${profile.fullName}!`,
          message: `Your ${
            profile.role === 'FARMER'
              ? 'Farmer account'
              : profile.role === 'CHC_MANAGER'
              ? 'CHC Hub account'
              : profile.role === 'OPERATOR'
              ? 'Operator console'
              : 'Admin account'
          } is active. Explore your dashboard now.`,
          type: 'BOOKING',
          linkUrl:
            profile.role === 'FARMER'
              ? '/farmer/marketplace'
              : profile.role === 'CHC_MANAGER'
              ? '/chc/demand'
              : profile.role === 'OPERATOR'
              ? '/operator'
              : '/admin',
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        globalState = {
          ...globalState,
          currentUser: profile,
          selectedRole: profile.role,
          farm: freshFarm,
          agriCredit: freshCredit,
          bookings: [], // Brand new user starts with empty rentals
          invoices: [],
          notifications: [welcomeNotification, ...globalState.notifications],
        };
      }

      notify();
    },

    /**
     * Switch user role: maintains current user's identity if custom account,
     * or switches between demo personas if in demo mode.
     */
    switchRole: (role: UserRole) => {
      const isDemoUser = SEEDED_PROFILES.some(p => p.id === globalState.currentUser.id);

      if (isDemoUser) {
        const matchingSeeded = SEEDED_PROFILES.find(p => p.role === role) || SEEDED_PROFILES[0];
        globalState = {
          ...globalState,
          selectedRole: role,
          currentUser: matchingSeeded,
        };
      } else {
        // Custom user: preserve their name and details, just switch the active role view
        globalState = {
          ...globalState,
          selectedRole: role,
          currentUser: {
            ...globalState.currentUser,
            role,
          },
        };
      }
      notify();
    },

    createBooking: (newBookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>) => {
      const bookingNumber = `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking: Booking = {
        ...newBookingData,
        id: `bk-${Date.now()}`,
        bookingNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update machine status to RESERVED
      globalState.machines = globalState.machines.map(m =>
        m.id === newBooking.machineId ? { ...m, status: 'RESERVED' } : m
      );

      // Deduct AgriCredit if deferred payment chosen
      if (newBooking.paymentMethod === 'AGRICREDIT_DEFERRED') {
        globalState.agriCredit = {
          ...globalState.agriCredit,
          utilizedCredit: Math.min(
            globalState.agriCredit.creditLimit,
            globalState.agriCredit.utilizedCredit + newBooking.estimatedTotal
          ),
          availableCredit: Math.max(0, globalState.agriCredit.availableCredit - newBooking.estimatedTotal),
        };
      }

      // Automatically generate immediate branded tax invoice & receipt
      const initialInvoice = calculateFinalInvoice({
        booking: newBooking,
        actualHours: newBooking.bookedHours,
      });
      globalState.invoices = [initialInvoice, ...globalState.invoices.filter(inv => inv.bookingId !== newBooking.id)];

      globalState.bookings = [newBooking, ...globalState.bookings];
      globalState.notifications = [
        {
          id: `notif-bk-${Date.now()}`,
          title: `Booking Confirmed: ${bookingNumber}`,
          message: `${newBooking.farmerName} booked ${newBooking.machineModel} for ${newBooking.activity}. Tax receipt #${initialInvoice.invoiceNumber} is ready.`,
          type: 'BOOKING',
          linkUrl: '/farmer/rentals',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...globalState.notifications,
      ];

      // Optimistic persistence to Supabase database
      saveBookingToDatabase(newBooking);

      notify();
      return newBooking;
    },

    updateBookingStatus: (bookingId: string, newStatus: Booking['status'], actualHours?: number) => {
      let createdInvoice: Invoice | null = null;
      let updatedBookingRecord: Booking | null = null;

      globalState.bookings = globalState.bookings.map(b => {
        if (b.id !== bookingId) return b;

        const updated: Booking = {
          ...b,
          status: newStatus,
          actualHours: actualHours ?? b.actualHours ?? (newStatus === 'COMPLETED' ? 6.4 : undefined),
          actualStartTime: (newStatus === 'DISPATCHED' || newStatus === 'IN_PROGRESS') ? (b.actualStartTime || new Date().toISOString()) : b.actualStartTime,
          actualEndTime: newStatus === 'COMPLETED' ? new Date().toISOString() : b.actualEndTime,
          paymentStatus: newStatus === 'COMPLETED' ? 'CAPTURED' : b.paymentStatus,
          updatedAt: new Date().toISOString(),
        };
        updatedBookingRecord = updated;

        // If completed, automatically calculate and generate invoice
        if (newStatus === 'COMPLETED') {
          const finalInvoice = calculateFinalInvoice({
            booking: updated,
            actualHours: updated.actualHours || 6.4,
          });
          createdInvoice = finalInvoice;
          globalState.invoices = [finalInvoice, ...globalState.invoices.filter(inv => inv.bookingId !== bookingId)];

          // Update machine status back to AVAILABLE and add engine hours
          globalState.machines = globalState.machines.map(m =>
            m.id === b.machineId
              ? {
                  ...m,
                  status: 'AVAILABLE',
                  totalRentals: m.totalRentals + 1,
                  totalEngineHours: Math.round((m.totalEngineHours + (updated.actualHours || 6.4)) * 10) / 10,
                  hoursSinceLastService: Math.round((m.hoursSinceLastService + (updated.actualHours || 6.4)) * 10) / 10,
                }
              : m
          );

          globalState.notifications = [
            {
              id: `notif-inv-${Date.now()}`,
              title: `Rental Completed & Invoice Generated`,
              message: `Invoice #${finalInvoice.invoiceNumber} for ${updated.farmerName} is ready (Total: ₹${finalInvoice.finalTotalAmount}).`,
              type: 'INVOICE',
              linkUrl: `/farmer/rentals`,
              isRead: false,
              createdAt: new Date().toISOString(),
            },
            ...globalState.notifications,
          ];
        } else if (newStatus === 'DISPATCHED') {
          globalState.machines = globalState.machines.map(m =>
            m.id === b.machineId ? { ...m, status: 'DISPATCHED' } : m
          );
        } else if (newStatus === 'IN_PROGRESS') {
          globalState.machines = globalState.machines.map(m =>
            m.id === b.machineId ? { ...m, status: 'ACTIVE' } : m
          );
        }

        return updated;
      });

      if (updatedBookingRecord) {
        updateBookingInDatabase(bookingId, updatedBookingRecord);
      }

      notify();
      return createdInvoice;
    },

    approveAllocation: (allocId: string) => {
      globalState.allocations = globalState.allocations.map(a =>
        a.id === allocId ? { ...a, status: 'APPROVED' } : a
      );
      // Move machine CHC
      const alloc = globalState.allocations.find(a => a.id === allocId);
      if (alloc) {
        globalState.machines = globalState.machines.map(m =>
          m.id === alloc.machineId ? { ...m, chcId: alloc.targetChcId, chcName: alloc.targetChcName } : m
        );
        // Decrease shortage in target forecast
        globalState.demandForecasts = globalState.demandForecasts.map(df =>
          df.district === alloc.targetDistrict && df.machineCategory === alloc.category
            ? { ...df, availableUnits: df.availableUnits + 1, shortageUnits: Math.max(0, df.shortageUnits - 1) }
            : df
        );
      }
      notify();
    },

    resolveAlert: (alertId: string, returnToServiceStatus: MachineStatus = 'AVAILABLE') => {
      const targetAlert = globalState.maintenanceAlerts.find(a => a.id === alertId);
      globalState.maintenanceAlerts = globalState.maintenanceAlerts.map(a =>
        a.id === alertId ? { ...a, isResolved: true, resolvedAt: new Date().toISOString() } : a
      );
      if (targetAlert) {
        // If no more unresolved critical alerts for this machine, restore status
        const otherUnresolved = globalState.maintenanceAlerts.some(
          a => a.machineId === targetAlert.machineId && !a.isResolved && a.id !== alertId && (a.severity === 'CRITICAL' || a.severity === 'HIGH')
        );
        if (!otherUnresolved) {
          globalState.machines = globalState.machines.map(m =>
            m.id === targetAlert.machineId ? { ...m, status: returnToServiceStatus, locationUpdatedAt: new Date().toISOString() } : m
          );
        }
      }
      globalState.simulationState = {
        ...globalState.simulationState,
        isFuelAnomalyActive: false,
      };
      notify();
    },

    toggleFuelAnomaly: (forcedState?: boolean) => {
      const nextAnomalyState = forcedState !== undefined ? forcedState : !globalState.simulationState.isFuelAnomalyActive;
      globalState.simulationState = {
        ...globalState.simulationState,
        isFuelAnomalyActive: nextAnomalyState,
      };
      notify();
    },

    toggleSimulation: () => {
      globalState.isSimulating = !globalState.isSimulating;
      notify();
    },

    updateFarm: (farmData: Partial<Farm>) => {
      const updatedFarm: Farm = {
        ...globalState.farm,
        ...farmData,
        crop: {
          ...globalState.farm.crop,
          ...(farmData.crop || {}),
        },
      };
      globalState = {
        ...globalState,
        farm: updatedFarm,
      };
      // If user district/village were empty, sync from farm
      if (farmData.district && !globalState.currentUser.district) {
        globalState.currentUser = {
          ...globalState.currentUser,
          district: farmData.district,
          village: farmData.village || globalState.currentUser.village,
        };
      }
      notify();
    },

    registerCHC: (chcData: Partial<CHC>) => {
      const newChc: CHC = {
        id: chcData.id || `chc-${Date.now()}`,
        name: chcData.name || 'Agri Operations Hub',
        code: chcData.code || `CHC-${(chcData.district || 'HUB').slice(0, 3).toUpperCase()}-01`,
        managerId: globalState.currentUser.id,
        village: chcData.village || '',
        district: chcData.district || 'Local Hub',
        state: chcData.state || 'Madhya Pradesh',
        latitude: chcData.latitude || 23.1872,
        longitude: chcData.longitude || 77.1008,
        contactPhone: chcData.contactPhone || globalState.currentUser.phoneNumber,
        contactEmail: chcData.contactEmail || globalState.currentUser.email,
        operatingRadiusKm: chcData.operatingRadiusKm || 35,
        totalMachines: globalState.machines.length,
        activeMachines: globalState.machines.filter(m => m.status === 'ACTIVE').length,
        ...chcData,
      };
      globalState = {
        ...globalState,
        chcs: [newChc, ...globalState.chcs.filter(c => c.id !== newChc.id)],
      };
      notify();
    },

    addMachine: (machineData: Partial<Machine>) => {
      const targetChc = globalState.chcs[0] || {
        id: 'chc-default',
        name: machineData.chcName || 'Central Hub',
      };

      const newMachine: Machine = {
        id: machineData.id || `mach-${Date.now()}`,
        chcId: machineData.chcId || targetChc.id,
        chcName: machineData.chcName || targetChc.name,
        identifier: machineData.identifier || `AGRI-${Math.floor(1000 + Math.random() * 9000)}`,
        category: machineData.category || 'TRACTOR',
        brand: machineData.brand || 'Mahindra',
        model: machineData.model || '575 DI',
        yearOfManufacture: machineData.yearOfManufacture || 2024,
        powerHp: machineData.powerHp || 50,
        status: machineData.status || 'AVAILABLE',
        baseRatePerHour: machineData.baseRatePerHour || 850,
        baseRatePerAcre: machineData.baseRatePerAcre,
        healthScore: machineData.healthScore || 98,
        totalEngineHours: machineData.totalEngineHours || 12.0,
        hoursSinceLastService: machineData.hoursSinceLastService || 12.0,
        serviceIntervalHours: 250,
        imageUrl: '',
        rating: 4.9,
        totalRentals: 0,
        supportedActivities: machineData.supportedActivities || ['SOIL_PREPARATION', 'TRANSPORT'],
        latitude: machineData.latitude || 23.1872,
        longitude: machineData.longitude || 77.1008,
        operatorName: machineData.operatorName || 'Assigned Driver',
        operatorPhone: machineData.operatorPhone || '+91 98765 00000',
        specs: machineData.specs || {
          engine: `${machineData.powerHp || 50} HP Diesel 4-Cylinder`,
          fuelTankLitres: 60,
        },
        ...machineData,
      };

      globalState = {
        ...globalState,
        machines: [newMachine, ...globalState.machines],
      };
      notify();
    },

    updateMachineStatus: (machineId: string, status: MachineStatus) => {
      globalState = {
        ...globalState,
        machines: globalState.machines.map(m =>
          m.id === machineId
            ? {
                ...m,
                status,
                locationUpdatedAt: new Date().toISOString(),
              }
            : m
        ),
      };
      notify();
    },

    updateMachineLocation: (
      machineId: string,
      latitude: number,
      longitude: number,
      source: any = 'operator_app'
    ) => {
      globalState = {
        ...globalState,
        machines: globalState.machines.map(m =>
          m.id === machineId
            ? {
                ...m,
                latitude,
                longitude,
                locationSource: source,
                locationUpdatedAt: new Date().toISOString(),
              }
            : m
        ),
      };
      notify();
    },

    setMachineTelemetryMode: (machineId: string, mode: TelemetryModeType) => {
      globalState = {
        ...globalState,
        machines: globalState.machines.map(m =>
          m.id === machineId ? { ...m, telemetryMode: mode } : m
        ),
      };
      notify();
    },

    ingestTelemetryPayload: (payload: HardwareTelemetryPayload) => {
      const result = ingestHardwareTelemetry(payload);
      if (result.success && result.telemetryPoint) {
        const tp = result.telemetryPoint;
        const targetStatus: MachineStatus =
          result.anomalyDetected && result.alerts.some(a => a.severity === 'CRITICAL')
            ? 'MAINTENANCE'
            : tp.status || 'ACTIVE';

        globalState = {
          ...globalState,
          currentTelemetry: {
            ...globalState.currentTelemetry,
            [payload.machineId]: tp,
          },
          machines: globalState.machines.map(m =>
            m.id === payload.machineId
              ? {
                  ...m,
                  latitude: tp.latitude,
                  longitude: tp.longitude,
                  headingDeg: tp.headingDeg,
                  totalEngineHours: tp.engineHours,
                  status: targetStatus,
                  locationSource: tp.locationSource || 'gps_tracker',
                  locationAccuracy: tp.locationAccuracy || 3.5,
                  locationUpdatedAt: tp.timestamp,
                  telemetryMode: 'HARDWARE_IOT',
                }
              : m
          ),
          maintenanceAlerts: [
            ...result.alerts,
            ...globalState.maintenanceAlerts.filter(
              a => !result.alerts.some(ra => ra.alertType === a.alertType && ra.machineId === a.machineId)
            ),
          ],
        };

        // Sync to Supabase in background
        insertLiveTelemetryToDatabase(tp);
        notify();
      }
      return result;
    },

    ingestOperatorGps: (payload: OperatorGpsPayload) => {
      const existing = globalState.currentTelemetry[payload.machineId];
      const result = ingestOperatorGpsTelemetry(payload, existing);
      if (result.success && result.telemetryPoint) {
        const tp = result.telemetryPoint;
        globalState = {
          ...globalState,
          currentTelemetry: {
            ...globalState.currentTelemetry,
            [payload.machineId]: tp,
          },
          machines: globalState.machines.map(m =>
            m.id === payload.machineId
              ? {
                  ...m,
                  latitude: tp.latitude,
                  longitude: tp.longitude,
                  headingDeg: tp.headingDeg,
                  status: tp.status,
                  locationSource: 'operator_app',
                  locationAccuracy: tp.locationAccuracy || 5.0,
                  locationUpdatedAt: tp.timestamp,
                  telemetryMode: 'OPERATOR_GPS',
                }
              : m
          ),
        };
        insertLiveTelemetryToDatabase(tp);
        notify();
      }
      return result;
    },

    ingestManualLocation: (payload: ManualLocationPayload) => {
      const existing = globalState.currentTelemetry[payload.machineId];
      const result = ingestManualGpsLocation(payload, existing);
      if (result.success && result.telemetryPoint) {
        const tp = result.telemetryPoint;
        globalState = {
          ...globalState,
          currentTelemetry: {
            ...globalState.currentTelemetry,
            [payload.machineId]: tp,
          },
          machines: globalState.machines.map(m =>
            m.id === payload.machineId
              ? {
                  ...m,
                  latitude: tp.latitude,
                  longitude: tp.longitude,
                  status: tp.status,
                  locationSource: 'chc_manual',
                  locationAccuracy: 10.0,
                  locationUpdatedAt: tp.timestamp,
                  telemetryMode: 'MANUAL',
                }
              : m
          ),
        };
        insertLiveTelemetryToDatabase(tp);
        notify();
      }
      return result;
    },

    createMaintenanceAlert: (alertData: Partial<PredictiveMaintenanceAlert>) => {
      const targetMachine = globalState.machines.find(m => m.id === alertData.machineId);
      const newAlert: PredictiveMaintenanceAlert = {
        id: `alert-manual-${Date.now()}`,
        machineId: alertData.machineId || (globalState.machines[0]?.id || 'mach-jd-harv-07'),
        machineIdentifier: alertData.machineIdentifier || targetMachine?.identifier || 'MACH-01',
        machineModel: alertData.machineModel || `${targetMachine?.brand} ${targetMachine?.model}` || 'Agricultural Asset',
        alertType: alertData.alertType || 'SERVICE_OVERDUE',
        severity: alertData.severity || 'HIGH',
        description: alertData.description || 'Manual maintenance inspection ticket created.',
        recommendedAction: alertData.recommendedAction || 'Perform multi-point mechanical inspection.',
        urgencyHours: alertData.urgencyHours || 24,
        isResolved: false,
        createdAt: new Date().toISOString(),
      };

      globalState = {
        ...globalState,
        maintenanceAlerts: [newAlert, ...globalState.maintenanceAlerts],
        machines: alertData.severity === 'CRITICAL'
          ? globalState.machines.map(m => m.id === newAlert.machineId ? { ...m, status: 'MAINTENANCE' } : m)
          : globalState.machines,
      };
      notify();
    },

    updateFarmCoordinates: (
      latitude: number,
      longitude: number,
      source: any = 'map_pin'
    ) => {
      globalState = {
        ...globalState,
        farm: {
          ...globalState.farm,
          latitude,
          longitude,
          locationSource: source,
          locationUpdatedAt: new Date().toISOString(),
        },
      };
      notify();
    },

    updateUserProfile: (profileData: Partial<UserProfile>) => {
      globalState = {
        ...globalState,
        currentUser: {
          ...globalState.currentUser,
          ...profileData,
        },
      };
      notify();
    },

    markNotificationRead: (notifId: string) => {
      globalState.notifications = globalState.notifications.map(n =>
        n.id === notifId ? { ...n, isRead: true } : n
      );
      notify();
    },

    loadDemoData: () => {
      const activeRole = globalState.selectedRole;
      const activeUser = globalState.currentUser;
      const demoState = getPopulatedDemoState();
      globalState = {
        ...demoState,
        selectedRole: activeRole || 'FARMER',
        currentUser: activeUser || demoState.currentUser,
      };
      notify();
    },

    clearAllData: () => {
      localStorage.removeItem(STORAGE_KEY);
      globalState = getCleanProductionState();
      notify();
    },

    removeAllData: () => {
      localStorage.removeItem(STORAGE_KEY);
      globalState = getCleanProductionState();
      notify();
    },

    resetToDefaults: () => {
      localStorage.removeItem(STORAGE_KEY);
      globalState = getCleanProductionState();
      notify();
    },
  };
}

