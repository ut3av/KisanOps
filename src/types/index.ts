export type UserRole = 'FARMER' | 'OPERATOR' | 'CHC_MANAGER' | 'FLEET_MANAGER' | 'ADMIN';

export type MachineStatus = 
  | 'AVAILABLE' 
  | 'RESERVED' 
  | 'DISPATCHED' 
  | 'ACTIVE' 
  | 'RETURNING' 
  | 'MAINTENANCE' 
  | 'OFFLINE';

export type BookingStatus = 
  | 'REQUESTED' 
  | 'CONFIRMED' 
  | 'DISPATCHED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'DISPUTED';

export type PaymentStatus = 
  | 'INITIATED' 
  | 'PENDING' 
  | 'AUTHORIZED' 
  | 'CAPTURED' 
  | 'FAILED' 
  | 'REFUNDED' 
  | 'PARTIALLY_REFUNDED';

export type PaymentMethod = 
  | 'UPI' 
  | 'CARD' 
  | 'NET_BANKING' 
  | 'AGRICREDIT_DEFERRED' 
  | 'CASH';

export type ActivityType = 
  | 'SOIL_PREPARATION' 
  | 'SOWING' 
  | 'CULTIVATION' 
  | 'SPRAYING' 
  | 'IRRIGATION' 
  | 'HARVESTING' 
  | 'THRESHING' 
  | 'TRANSPORT';

export type MachineCategory = 
  | 'TRACTOR' 
  | 'HARVESTER' 
  | 'ROTAVATOR' 
  | 'SEEDER' 
  | 'SPRAYER' 
  | 'THRESHER' 
  | 'TRAILER';

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  role: UserRole;
  avatarUrl?: string;
  district?: string;
  village?: string;
}

export interface CHC {
  id: string;
  name: string;
  code: string;
  managerId?: string;
  village: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  contactPhone: string;
  contactEmail?: string;
  operatingRadiusKm: number;
  totalMachines: number;
  activeMachines: number;
  minSurgeMultiplier?: number;
  maxSurgeMultiplier?: number;
}

export type LocationSourceType = 
  | 'gps_tracker' 
  | 'operator_app' 
  | 'chc_manual' 
  | 'last_known' 
  | 'map_pin' 
  | 'manual' 
  | 'admin_verified';

export type LocationFreshnessStatus = 'LIVE' | 'RECENT' | 'STALE';

export interface FarmCrop {
  id: string;
  cropName: string;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  cropStage: 'Pre-sowing' | 'Sowing' | 'Vegetative' | 'Flowering' | 'Maturity' | 'Pre-harvest' | 'Harvest-ready';
  sowingDate?: string;
  expectedHarvestDate?: string;
}

export interface Farm {
  id: string;
  farmerId: string;
  farmName: string;
  village: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  sizeAcres: number;
  irrigationType: 'Drip' | 'Canal' | 'Borewell' | 'Rainfed';
  soilType?: string;
  crop: FarmCrop;
  boundaryPolygon?: [number, number][];
  locationAccuracy?: number;
  locationSource?: LocationSourceType;
  locationUpdatedAt?: string;
}

export type TelemetryModeType = 'MANUAL' | 'OPERATOR_GPS' | 'HARDWARE_IOT';

export interface Machine {
  id: string;
  chcId: string;
  chcName: string;
  identifier: string;
  category: MachineCategory;
  brand: string;
  model: string;
  yearOfManufacture: number;
  powerHp: number;
  status: MachineStatus;
  baseRatePerHour: number;
  baseRatePerAcre?: number;
  healthScore: number;
  totalEngineHours: number;
  hoursSinceLastService: number;
  serviceIntervalHours: number;
  imageUrl: string;
  rating: number;
  totalRentals: number;
  supportedActivities: ActivityType[];
  latitude: number;
  longitude: number;
  distanceKm?: number;
  locationSource?: LocationSourceType;
  locationAccuracy?: number;
  locationUpdatedAt?: string;
  locationStatus?: LocationFreshnessStatus;
  telemetryMode?: TelemetryModeType;
  headingDeg?: number;
  operatorName?: string;
  operatorPhone?: string;
  operatorRating?: number;
  specs: {
    engine: string;
    fuelTankLitres: number;
    cuttingWidthMetres?: number;
    hydraulicCapacityKg?: number;
    transmission?: string;
  };
}

export interface NearbyAvailabilityParams {
  latitude: number;
  longitude: number;
  radiusKm?: number; // 5, 10, 15, 25, 50 (default 25)
  startTime?: string;
  endTime?: string;
  machineCategory?: MachineCategory | 'ALL';
}

export interface AvailableMachineItem extends Machine {
  distanceKm: number;
  locationStatus: LocationFreshnessStatus;
  locationFreshnessText: string;
  isBookable: boolean;
  unavailabilityReason?: string;
}

export interface AvailabilitySnapshot {
  center: {
    latitude: number;
    longitude: number;
  };
  radiusKm: number;
  totalAvailable: number;
  totalInRadius: number;
  chcsInRadius: number;
  machines: AvailableMachineItem[];
  byType: Record<string, number>;
  lastUpdatedAt: string;
  isStale?: boolean;
}

export interface LocationFreshnessInfo {
  status: LocationFreshnessStatus;
  text: string;
  minutesAgo: number;
}

export interface TelemetryPoint {
  machineId: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  speedKmh: number;
  fuelLevelPercent: number;
  fuelConsumptionRateLph: number;
  engineHours: number;
  engineTemperatureC: number;
  rpm: number;
  batteryVoltage: number;
  status: MachineStatus;
  headingDeg?: number;
  hydraulicPressureBar?: number;
  ignitionState?: 'ON' | 'OFF' | 'IDLE';
  odometerKm?: number;
  locationSource?: LocationSourceType;
  locationAccuracy?: number;
}

export type MaintenanceAlertType =
  | 'FUEL_ANOMALY'
  | 'SERVICE_OVERDUE'
  | 'TEMP_SURGE'
  | 'VIBRATION_SPIKE'
  | 'BATTERY_LOW'
  | 'GEOFENCE_BREACH'
  | 'HYDRAULIC_DROP';

export interface PredictiveMaintenanceAlert {
  id: string;
  machineId: string;
  machineIdentifier: string;
  machineModel: string;
  alertType: MaintenanceAlertType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendedAction: string;
  fuelAnomalyDeltaPercent?: number;
  remainingHoursToService?: number;
  urgencyHours: number;
  isResolved: boolean;
  resolvedAt?: string;
  createdAt: string;
}

export interface DemandFactorBreakdown {
  harvestSeasonScore: number;
  upcomingStageScore: number;
  historicalDemandScore: number;
  currentBookingsScore: number;
  weatherSignalScore: number;
}

export interface DemandForecast {
  id: string;
  district: string;
  cropName: string;
  cropStage: string;
  machineCategory: MachineCategory;
  forecastDate: string;
  demandLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  demandIndex: number; // 0 - 100
  expectedDemandUnits: number;
  availableUnits: number;
  shortageUnits: number;
  confidenceScore: number;
  factors: DemandFactorBreakdown;
}

export interface MachineAllocationRecommendation {
  id: string;
  sourceChcId: string;
  sourceChcName: string;
  sourceDistrict: string;
  targetChcId: string;
  targetChcName: string;
  targetDistrict: string;
  machineId: string;
  machineIdentifier: string;
  machineModel: string;
  category: MachineCategory;
  distanceKm: number;
  relocationCost: number;
  expectedUtilizationGainPercent: number;
  estimatedRevenueGain: number;
  status: 'RECOMMENDED' | 'APPROVED' | 'IN_TRANSIT' | 'COMPLETED';
}

export interface PriceQuote {
  machineId: string;
  baseRatePerHour: number;
  demandAdjustment: number;
  supplyAdjustment: number;
  distanceAdjustment: number;
  healthDiscount: number;
  urgencyAdjustment: number;
  quotedRatePerHour: number;
  surgeMultiplier: number;
  explanation: {
    title: string;
    description: string;
    amount: number;
    type: 'positive' | 'negative' | 'neutral';
  }[];
  validUntil: string;
}

export interface MachineRecommendationScore {
  machineId: string;
  matchScore: number; // 0 - 100
  breakdown: {
    taskSuitabilityScore: number; // 25%
    availabilityScore: number;    // 20%
    distanceScore: number;        // 15%
    healthScore: number;          // 15%
    priceScore: number;           // 10%
    reliabilityScore: number;     // 10%
    operatorRatingScore: number;  // 5%
  };
  reasons: string[];
}

export interface AgriCreditProfile {
  farmerId: string;
  creditScore: number; // 300 - 900
  ratingCategory: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  creditLimit: number;
  utilizedCredit: number;
  availableCredit: number;
  factors: {
    name: string;
    weight: number;
    score: number;
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    description: string;
  }[];
}

export interface Booking {
  id: string;
  bookingNumber: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  chcId: string;
  chcName: string;
  machineId: string;
  machineIdentifier: string;
  machineModel: string;
  machineCategory: MachineCategory;
  farmId: string;
  farmName: string;
  farmLocation: string;
  activity: ActivityType;
  status: BookingStatus;
  bookingMode: 'HOURLY' | 'ACREAGE';
  bookedHours: number;
  bookedAcres?: number;
  startTime: string;
  endTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  actualHours?: number;
  hourlyRate: number;
  estimatedTotal: number;
  actualTotal?: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  operatorName?: string;
  operatorPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  bookingNumber: string;
  farmerName: string;
  farmerPhone: string;
  chcName: string;
  machineName: string;
  machineIdentifier: string;
  rentalPeriod: string;
  bookedHours: number;
  actualHours: number;
  baseRatePerHour: number;
  baseRentalAmount: number;
  transportCharge: number;
  fuelSurcharge: number;
  platformFee: number;
  discountAmount: number;
  taxGstAmount: number;
  finalTotalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  issuedAt: string;
  items: InvoiceItem[];
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'DISPATCH' | 'TELEMATICS' | 'MAINTENANCE' | 'INVOICE' | 'DEMAND';
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PricingRuleConfig {
  minSurgeMultiplier: number; // 0.80
  maxSurgeMultiplier: number; // 1.30
  demandSurgeWeight: number;  // 0.15
  distanceCostPerKm: number;  // 15.0
  platformFee: number;        // 100.0
  gstRate: number;            // 0.05 (5%)
}
