export type DataQualityStatus = 'HIGH' | 'MEDIUM' | 'LOW' | 'STALE';

export interface DataProviderMetadata {
  source: string; // e.g. "Open-Meteo Agro API", "Agmarknet Mandi Portal", "Sentinel-2 Remote Sensing"
  retrievedAt: string; // ISO string
  validFrom: string;
  validUntil: string;
  confidence: number; // 0.0 - 1.0 (e.g. 0.92 = 92%)
  coverage: string; // e.g. "Sehore District, Madhya Pradesh (23.18° N, 77.09° E)"
  qualityStatus: DataQualityStatus;
  refreshIntervalMinutes: number;
}

export interface WeatherObservationData {
  metadata: DataProviderMetadata;
  temperatureC: number;
  minTempC: number;
  maxTempC: number;
  relativeHumidityPercent: number;
  precipitationProbabilityPercent: number;
  precipitationMm: number;
  precipitationForecast72hMm: number;
  soilMoisture0to10cmPercent: number;
  windSpeedKmh: number;
  dewPointC: number;
  weatherCode: number;
  weatherDescription: string;
  isRainImminent24h: boolean;
  consecutiveDryHours: number;
  consecutiveWetHours: number;
  radarTileTimestamp?: number;
}

export interface CommodityPricePoint {
  commodity: string; // e.g. "Wheat (Sharbati)", "Soybean (Yellow)", "Gram / Chana"
  mandiName: string; // e.g. "Sehore Mandi", "Bhopal Karond Mandi", "Indore Mandi"
  district: string;
  modalPricePerQuintal: number;
  minPricePerQuintal: number;
  maxPricePerQuintal: number;
  mspBenchmarkPerQuintal: number; // Minimum Support Price
  priceChange7dPercent: number; // e.g. +4.2%
  priceChange30dPercent: number;
  volatilityIndex: 'LOW' | 'MEDIUM' | 'HIGH';
  arrivalQuantityTonnes: number;
  marketSentiment: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  date: string;
}

export interface MarketDataProviderResult {
  metadata: DataProviderMetadata;
  commodities: Record<string, CommodityPricePoint>;
  regionalMandis: CommodityPricePoint[];
}

export interface SatelliteVegetationData {
  metadata: DataProviderMetadata;
  farmId: string;
  ndviMean: number; // 0.0 - 1.0 (Normalized Difference Vegetation Index)
  ndviAnomalyScore: number; // -1.0 to +1.0 vs regional average
  ndwiWaterIndex: number; // Normalized Difference Water Index (-1 to +1)
  canopyUniformityPercent: number; // 0 - 100%
  vegetationVigorStatus: 'EXCELLENT' | 'HEALTHY' | 'MILD_STRESS' | 'SEVERE_STRESS';
  estimatedChlorophyllMgM2: number;
  cloudCoverPercent: number;
  imageryDate: string;
}

export type EventImpactLevel = 'NEGLIGIBLE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EventDirection = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

export interface ExternalRiskEvent {
  id: string;
  title: string;
  category: 'POLICY' | 'WEATHER_WARNING' | 'FUEL_ENERGY' | 'SUPPLY_CHAIN' | 'PEST_DISEASE' | 'TRADE_EXPORT';
  publishedAt: string;
  sourceName: string;
  summary: string;
  affectedGeographies: string[];
  affectedCommodities: string[];
  impactLevel: EventImpactLevel;
  impactDirection: EventDirection;
  directFarmImplication: string;
  actionableMitigation: string;
  relevanceScore: number; // 0.0 to 1.0
  confidence: number;
}

export interface ExternalEventsProviderResult {
  metadata: DataProviderMetadata;
  events: ExternalRiskEvent[];
}

export interface CropAgronomicProfile {
  cropName: string;
  variety?: string;
  season: 'Rabi' | 'Kharif' | 'Zaid';
  sowingWindowStart: string;
  sowingWindowEnd: string;
  totalDurationDays: number;
  gddMaturityThreshold: number; // Growing Degree Days
  baseTemperatureC: number;
  optimalHarvestMoisturePercent: number;
  averageYieldQuintalPerAcre: number;
  benchmarkCostsPerAcre: {
    seeds: number;
    fertilizers: number;
    cropProtection: number;
    irrigation: number;
    labor: number;
    machineryRental: number;
    fuel: number;
    other: number;
  };
}
