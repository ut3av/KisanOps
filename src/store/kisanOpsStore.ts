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
  ActivityType,
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
  activeDemoScene: number; // 1 to 12
}

const STORAGE_KEY = 'kisanops_app_state_v1';

function getInitialState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate structure has currentUser
      if (parsed && parsed.currentUser) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse saved state, reverting to seed', e);
  }

  return {
    currentUser: SEEDED_PROFILES[0], // Farmer Ramesh Kumar
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
  };
}

let globalState: AppState = getInitialState();
const listeners = new Set<() => void>();

function notify() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
  } catch (e) {
    // Ignore storage quota limits
  }
  listeners.forEach(listener => listener());
}

export function useKisanOpsStore() {
  const [state, setState] = useState<AppState>(globalState);

  useEffect(() => {
    const listener = () => setState({ ...globalState });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Telematics Simulation Interval
  useEffect(() => {
    if (!state.isSimulating) return;

    const interval = setInterval(() => {
      const activeBooking = globalState.bookings.find(
        b => b.status === 'DISPATCHED' || b.status === 'IN_PROGRESS'
      );
      const targetMachineId = activeBooking ? activeBooking.machineId : 'mach-jd-harv-07';
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
      };

      // Check if fuel anomaly should inject high-priority alert
      if (nextState.isFuelAnomalyActive) {
        const existingAlert = globalState.maintenanceAlerts.find(
          a => a.machineId === targetMachineId && a.alertType === 'FUEL_ANOMALY' && !a.isResolved
        );
        if (!existingAlert) {
          const newAlert: PredictiveMaintenanceAlert = {
            id: `alert-fuel-auto-${Date.now()}`,
            machineId: targetMachineId,
            machineIdentifier: 'JD-HARV-07',
            machineModel: 'John Deere W70 Harvester',
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
              message: 'JD-HARV-07 fuel burn rate +17% above baseline. Inspection advised.',
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

    return () => clearInterval(interval);
  }, [state.isSimulating]);

  return {
    state,
    switchRole: (role: UserRole) => {
      const profile = SEEDED_PROFILES.find(p => p.role === role) || SEEDED_PROFILES[0];
      globalState = {
        ...globalState,
        selectedRole: role,
        currentUser: profile,
      };
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

      globalState.bookings = [newBooking, ...globalState.bookings];
      globalState.notifications = [
        {
          id: `notif-bk-${Date.now()}`,
          title: `New Booking: ${bookingNumber}`,
          message: `${newBooking.farmerName} booked ${newBooking.machineModel} for ${newBooking.activity}.`,
          type: 'BOOKING',
          linkUrl: '/chc/bookings',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...globalState.notifications,
      ];

      notify();
      return newBooking;
    },

    updateBookingStatus: (bookingId: string, newStatus: Booking['status'], actualHours?: number) => {
      let createdInvoice: Invoice | null = null;

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

    resolveAlert: (alertId: string) => {
      globalState.maintenanceAlerts = globalState.maintenanceAlerts.map(a =>
        a.id === alertId ? { ...a, isResolved: true, resolvedAt: new Date().toISOString() } : a
      );
      // Reset fuel anomaly flag if resolving fuel alert
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

    setActiveDemoScene: (sceneNumber: number) => {
      globalState.activeDemoScene = sceneNumber;
      
      // Auto-configure state based on demo scene progression
      if (sceneNumber === 1 || sceneNumber === 2) {
        // CHC Manager view
        globalState.selectedRole = 'CHC_MANAGER';
        globalState.currentUser = SEEDED_PROFILES[1];
      } else if (sceneNumber >= 3 && sceneNumber <= 7) {
        // Farmer view
        globalState.selectedRole = 'FARMER';
        globalState.currentUser = SEEDED_PROFILES[0];
      } else if (sceneNumber >= 8) {
        // CHC / Operations view
        globalState.selectedRole = 'CHC_MANAGER';
        globalState.currentUser = SEEDED_PROFILES[1];
      }

      if (sceneNumber === 10) {
        // Trigger Fuel Anomaly
        globalState.simulationState.isFuelAnomalyActive = true;
      }

      if (sceneNumber === 11) {
        // Mark rental completed
        const booking = globalState.bookings[0];
        if (booking && booking.status !== 'COMPLETED') {
          const inv = calculateFinalInvoice({
            booking: { ...booking, status: 'COMPLETED', actualHours: 6.4 },
            actualHours: 6.4,
          });
          globalState.invoices = [inv, ...globalState.invoices.filter(i => i.bookingId !== booking.id)];
          globalState.bookings = globalState.bookings.map(b =>
            b.id === booking.id ? { ...b, status: 'COMPLETED', actualHours: 6.4, paymentStatus: 'CAPTURED' } : b
          );
        }
      }

      notify();
    },

    markNotificationRead: (notifId: string) => {
      globalState.notifications = globalState.notifications.map(n =>
        n.id === notifId ? { ...n, isRead: true } : n
      );
      notify();
    },

    resetToDefaults: () => {
      localStorage.removeItem(STORAGE_KEY);
      globalState = {
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
      };
      notify();
    },
  };
}
