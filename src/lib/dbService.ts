import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  Booking,
  Machine,
  CHC,
  Farm,
  AgriCreditProfile,
  PredictiveMaintenanceAlert,
  Invoice,
  TelemetryPoint,
  DemandForecast,
  MachineAllocationRecommendation,
  UserProfile,
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
} from '../data/seedData';

/**
 * Fetches all initial platform state from Supabase if configured,
 * otherwise falls back gracefully to local mock dataset.
 */
export async function fetchInitialPlatformData(): Promise<{
  currentUser: UserProfile;
  chcs: CHC[];
  farm: Farm;
  machines: Machine[];
  demandForecasts: DemandForecast[];
  allocations: MachineAllocationRecommendation[];
  agriCredit: AgriCreditProfile;
  bookings: Booking[];
  maintenanceAlerts: PredictiveMaintenanceAlert[];
  invoices: Invoice[];
  isCloudSynced: boolean;
}> {
  if (!isSupabaseConfigured) {
    return {
      currentUser: SEEDED_PROFILES[0],
      chcs: SEEDED_CHCS,
      farm: SEEDED_FARM,
      machines: SEEDED_MACHINES,
      demandForecasts: SEEDED_DEMAND_FORECASTS,
      allocations: SEEDED_ALLOCATION_RECOMMENDATIONS,
      agriCredit: SEEDED_AGRICREDIT_PROFILE,
      bookings: SEEDED_BOOKINGS,
      maintenanceAlerts: SEEDED_MAINTENANCE_ALERTS,
      invoices: [],
      isCloudSynced: false,
    };
  }

  try {
    // Timeout promise to guarantee fast fallback if network/Supabase is unreachable
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Supabase request timed out')), 1500)
    );

    const fetchPromise = Promise.all([
      supabase.from('chcs').select('*').order('created_at', { ascending: false }),
      supabase.from('machines').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('invoices').select('*').order('issued_at', { ascending: false }),
      supabase.from('maintenance_predictions').select('*').order('created_at', { ascending: false }),
    ]);

    const [
      { data: chcRows },
      { data: machineRows },
      { data: bookingRows },
      { data: invoiceRows },
      { data: alertRows },
    ] = await Promise.race([fetchPromise, timeoutPromise]);

    // Map Supabase rows to typed domain objects or fallback to seed data if table is empty
    const chcs: CHC[] = chcRows && chcRows.length > 0
      ? chcRows.map((r: any) => ({
          id: r.id,
          name: r.name,
          code: r.code,
          village: r.village,
          district: r.district,
          state: r.state,
          latitude: r.latitude,
          longitude: r.longitude,
          contactPhone: r.contact_phone,
          operatingRadiusKm: r.operating_radius_km || 35,
          totalMachines: r.total_machines || 14,
          activeMachines: r.active_machines || 11,
        }))
      : SEEDED_CHCS;

    const machines: Machine[] = machineRows && machineRows.length > 0
      ? machineRows.map((r: any) => ({
          id: r.id,
          chcId: r.chc_id,
          chcName: chcs.find(c => c.id === r.chc_id)?.name || 'Sehore Agri Centre',
          identifier: r.identifier,
          category: r.category,
          brand: r.brand,
          model: r.model,
          yearOfManufacture: r.year_of_manufacture || 2023,
          powerHp: r.power_hp,
          status: r.status,
          baseRatePerHour: parseFloat(r.base_rate_per_hour),
          baseRatePerAcre: r.base_rate_per_acre ? parseFloat(r.base_rate_per_acre) : undefined,
          healthScore: r.health_score || 94,
          totalEngineHours: parseFloat(r.total_engine_hours || 0),
          serviceIntervalHours: parseFloat(r.service_interval_hours || 250),
          hoursSinceLastService: parseFloat(r.hours_since_last_service || 0),
          imageUrl: r.image_url || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
          rating: parseFloat(r.rating || 4.8),
          totalRentals: r.total_rentals || 0,
          supportedActivities: r.supported_activities || ['HARVESTING', 'THRESHING'],
          latitude: r.latitude,
          longitude: r.longitude,
          distanceKm: 3.2,
          operatorName: r.operator_name || 'Raju Verma',
          operatorPhone: '+91 97550 12399',
          operatorRating: parseFloat(r.operator_rating || 4.9),
          specs: r.specs || { engine: '65 HP Turbo Diesel', fuelTankLitres: 110 },
        }))
      : SEEDED_MACHINES;

    const bookings: Booking[] = bookingRows && bookingRows.length > 0
      ? bookingRows.map((r: any) => ({
          id: r.id,
          bookingNumber: r.booking_number,
          farmerId: r.farmer_id,
          farmerName: r.farmer_name || 'Ramesh Kumar',
          farmerPhone: r.farmer_phone || '+91 98260 41234',
          chcId: r.chc_id,
          chcName: chcs.find(c => c.id === r.chc_id)?.name || 'Sehore Agri Centre',
          machineId: r.machine_id,
          machineIdentifier: machines.find(m => m.id === r.machine_id)?.identifier || 'JD-HARV-07',
          machineModel: machines.find(m => m.id === r.machine_id)?.model || 'John Deere Harvester',
          machineCategory: machines.find(m => m.id === r.machine_id)?.category || 'HARVESTER',
          farmId: r.farm_id,
          farmName: 'Ramesh Farm #01',
          farmLocation: 'Bilkisganj, Sehore (8.0 Acres)',
          activity: r.activity || 'HARVESTING',
          status: r.status,
          bookingMode: r.booking_mode || 'HOURLY',
          bookedHours: parseFloat(r.booked_hours || 6),
          actualHours: r.actual_hours ? parseFloat(r.actual_hours) : undefined,
          startTime: r.start_time,
          endTime: r.end_time,
          actualStartTime: r.actual_start_time,
          actualEndTime: r.actual_end_time,
          hourlyRate: parseFloat(r.hourly_rate || 980),
          estimatedTotal: parseFloat(r.estimated_total || 6174),
          actualTotal: r.actual_total ? parseFloat(r.actual_total) : undefined,
          paymentMethod: r.payment_method || 'AGRICREDIT_DEFERRED',
          paymentStatus: r.payment_status || 'AUTHORIZED',
          operatorName: r.operator_name || 'Raju Verma',
          operatorPhone: r.operator_phone || '+91 97550 12399',
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        }))
      : SEEDED_BOOKINGS;

    const maintenanceAlerts: PredictiveMaintenanceAlert[] = alertRows && alertRows.length > 0
      ? alertRows.map((r: any) => ({
          id: r.id,
          machineId: r.machine_id,
          machineIdentifier: machines.find(m => m.id === r.machine_id)?.identifier || 'JD-HARV-07',
          machineModel: machines.find(m => m.id === r.machine_id)?.model || 'John Deere Harvester',
          alertType: r.alert_type === 'OVERHEAT' ? 'TEMP_SURGE' : r.alert_type,
          severity: r.severity,
          description: r.description,
          recommendedAction: r.recommended_action,
          fuelAnomalyDeltaPercent: r.fuel_anomaly_delta_percent || 0,
          urgencyHours: r.urgency_hours || 24,
          isResolved: r.is_resolved || false,
          resolvedAt: r.resolved_at,
          createdAt: r.created_at,
        }))
      : SEEDED_MAINTENANCE_ALERTS;

    const invoices: Invoice[] = invoiceRows && invoiceRows.length > 0
      ? invoiceRows.map((r: any) => ({
          id: r.id,
          invoiceNumber: r.invoice_number,
          bookingId: r.booking_id,
          bookingNumber: r.booking_number || 'BK-2026-8812',
          farmerName: 'Ramesh Kumar',
          farmerPhone: '+91 98260 41234',
          chcName: 'Sehore Agri Centre #01',
          machineName: 'John Deere W70 Harvester',
          machineIdentifier: 'JD-HARV-07',
          rentalPeriod: '22 Aug 2026, 08:00 - 14:24',
          bookedHours: parseFloat(r.booked_hours || 6),
          actualHours: parseFloat(r.actual_hours || 6.4),
          baseRatePerHour: parseFloat(r.base_rate_per_hour || 980),
          baseRentalAmount: parseFloat(r.base_rental_amount || 6272),
          transportCharge: parseFloat(r.transport_charge || 300),
          fuelSurcharge: parseFloat(r.fuel_surcharge || 240),
          platformFee: parseFloat(r.platform_fee || 100),
          discountAmount: parseFloat(r.discount_amount || 100),
          taxGstAmount: parseFloat(r.tax_gst_amount || 341),
          finalTotalAmount: parseFloat(r.final_total_amount || 7153),
          paymentMethod: r.payment_method || 'AGRICREDIT_DEFERRED',
          paymentStatus: r.payment_status || 'CAPTURED',
          issuedAt: r.issued_at || new Date().toISOString(),
          items: [
            { description: 'Equipment Operating Time', quantity: parseFloat(r.actual_hours || 6.4), unitPrice: parseFloat(r.base_rate_per_hour || 980), totalPrice: parseFloat(r.base_rental_amount || 6272) },
            { description: 'Hub Mobilization & Transit', quantity: 1, unitPrice: parseFloat(r.transport_charge || 300), totalPrice: parseFloat(r.transport_charge || 300) },
            { description: 'Platform Telematics & GPS', quantity: 1, unitPrice: parseFloat(r.platform_fee || 100), totalPrice: parseFloat(r.platform_fee || 100) },
          ],
        }))
      : [];

    return {
      currentUser: SEEDED_PROFILES[0],
      chcs,
      farm: SEEDED_FARM,
      machines,
      demandForecasts: SEEDED_DEMAND_FORECASTS,
      allocations: SEEDED_ALLOCATION_RECOMMENDATIONS,
      agriCredit: SEEDED_AGRICREDIT_PROFILE,
      bookings,
      maintenanceAlerts,
      invoices,
      isCloudSynced: true,
    };
  } catch (err) {
    console.warn('Supabase fetch failed, falling back to local dataset:', err);
    return {
      currentUser: SEEDED_PROFILES[0],
      chcs: SEEDED_CHCS,
      farm: SEEDED_FARM,
      machines: SEEDED_MACHINES,
      demandForecasts: SEEDED_DEMAND_FORECASTS,
      allocations: SEEDED_ALLOCATION_RECOMMENDATIONS,
      agriCredit: SEEDED_AGRICREDIT_PROFILE,
      bookings: SEEDED_BOOKINGS,
      maintenanceAlerts: SEEDED_MAINTENANCE_ALERTS,
      invoices: [],
      isCloudSynced: false,
    };
  }
}

/**
 * Saves a new booking to Supabase PostgreSQL database
 */
export async function saveBookingToDatabase(booking: Booking): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  try {
    const { error } = await supabase.from('bookings').insert({
      id: booking.id,
      booking_number: booking.bookingNumber,
      farmer_id: booking.farmerId,
      chc_id: booking.chcId,
      machine_id: booking.machineId,
      farm_id: booking.farmId,
      activity: booking.activity,
      status: booking.status,
      booking_mode: booking.bookingMode,
      booked_hours: booking.bookedHours,
      start_time: booking.startTime,
      end_time: booking.endTime,
      hourly_rate: booking.hourlyRate,
      estimated_total: booking.estimatedTotal,
      payment_method: booking.paymentMethod,
      payment_status: booking.paymentStatus,
      operator_name: booking.operatorName,
      operator_phone: booking.operatorPhone,
      created_at: booking.createdAt,
      updated_at: booking.updatedAt,
    });

    if (error) {
      console.warn('Supabase booking insert notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Database error' };
  }
}

/**
 * Updates booking lifecycle status in Supabase database
 */
export async function updateBookingInDatabase(
  bookingId: string,
  updates: Partial<Booking>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  try {
    const dbPayload: any = {
      updated_at: new Date().toISOString(),
    };
    if (updates.status) dbPayload.status = updates.status;
    if (updates.actualHours !== undefined) dbPayload.actual_hours = updates.actualHours;
    if (updates.actualStartTime) dbPayload.actual_start_time = updates.actualStartTime;
    if (updates.actualEndTime) dbPayload.actual_end_time = updates.actualEndTime;
    if (updates.paymentStatus) dbPayload.payment_status = updates.paymentStatus;
    if (updates.actualTotal !== undefined) dbPayload.actual_total = updates.actualTotal;

    const { error } = await supabase
      .from('bookings')
      .update(dbPayload)
      .eq('id', bookingId);

    if (error) {
      console.warn('Supabase booking update notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Database update error' };
  }
}

/**
 * Inserts live time-series telemetry into Supabase machine_telemetry table
 */
export async function insertLiveTelemetryToDatabase(point: TelemetryPoint): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    await supabase.from('machine_telemetry').insert({
      machine_id: point.machineId,
      timestamp: point.timestamp,
      latitude: point.latitude,
      longitude: point.longitude,
      speed_kmh: point.speedKmh,
      fuel_level_percent: point.fuelLevelPercent,
      fuel_consumption_rate_lph: point.fuelConsumptionRateLph,
      engine_hours: point.engineHours,
      engine_temperature_c: point.engineTemperatureC,
      rpm: point.rpm,
      battery_voltage: point.batteryVoltage,
      status: point.status,
    });
  } catch (e) {
    // Non-blocking telemetry ingestion log
  }
}

/**
 * Subscribes to real-time changes across bookings and machinery tables
 */
export function subscribeToSupabaseRealtime(onRealtimeEvent: (payload: any) => void) {
  if (!isSupabaseConfigured) return { unsubscribe: () => {} };

  const channel = supabase
    .channel('kisanops-live-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, payload => {
      onRealtimeEvent({ tableName: 'bookings', ...payload });
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'machines' }, payload => {
      onRealtimeEvent({ tableName: 'machines', ...payload });
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'maintenance_predictions' }, payload => {
      onRealtimeEvent({ tableName: 'maintenance_predictions', ...payload });
    })
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}
