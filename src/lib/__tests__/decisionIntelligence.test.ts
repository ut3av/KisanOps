import { describe, it, expect } from 'vitest';
import {
  calculateFarmProfitModel,
  assessFarmRisks,
  simulateFarmScenarios,
  generateDailyFarmBrief,
  generateWeeklyFarmReport,
} from '../intelligence/farmIntelligenceEngine';
import {
  forecastFleetDemand,
  calculateMachineProfitability,
  generateDailyFleetBrief,
  generateWeeklyFleetReport,
} from '../intelligence/fleetIntelligenceEngine';
import {
  getLoggedOutcomes,
  logRecommendationOutcome,
  evaluateIntelligenceAccuracy,
} from '../intelligence/outcomeTracker';
import {
  WeatherObservationData,
  MarketDataProviderResult,
  ExternalRiskEvent,
} from '../intelligence/providers/types';
import { Farm, Machine, CHC, Booking } from '../../types';

describe('Real-Time Agricultural Decision Intelligence Layer', () => {
  const sampleFarm: Farm = {
    id: 'farm-bilkisganj-01',
    farmerId: 'usr-ramesh-01',
    farmName: 'Ramesh Patel Farm',
    district: 'Sehore',
    village: 'Bilkisganj',
    state: 'Madhya Pradesh',
    sizeAcres: 8,
    latitude: 23.1642,
    longitude: 77.1215,
    soilType: 'Deep Black Vertisol',
    irrigationType: 'Borewell',
    crop: {
      id: 'crop-wheat-01',
      cropName: 'Wheat',
      season: 'Rabi',
      cropStage: 'Pre-harvest',
      sowingDate: '2024-11-15',
    },
  };

  const sampleWeather: WeatherObservationData = {
    metadata: {
      source: 'Open-Meteo High-Resolution Agro API',
      retrievedAt: new Date().toISOString(),
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
      confidence: 0.94,
      coverage: 'Sehore District (23.18° N, 77.09° E)',
      qualityStatus: 'HIGH',
      refreshIntervalMinutes: 15,
    },
    temperatureC: 28.5,
    minTempC: 19.5,
    maxTempC: 32.0,
    relativeHumidityPercent: 58,
    precipitationProbabilityPercent: 68,
    precipitationMm: 14.5,
    precipitationForecast72hMm: 16.5,
    soilMoisture0to10cmPercent: 31,
    windSpeedKmh: 14.2,
    dewPointC: 19.2,
    weatherCode: 61,
    weatherDescription: 'Scattered Rain Approaching / Narrow Dry Window',
    isRainImminent24h: true,
    consecutiveDryHours: 24,
    consecutiveWetHours: 0,
  };

  const sampleMarket: MarketDataProviderResult = {
    metadata: {
      source: 'Agmarknet & MP Mandi Board',
      retrievedAt: new Date().toISOString(),
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 1000 * 60 * 120).toISOString(),
      confidence: 0.96,
      coverage: 'Sehore Mandi Cluster',
      qualityStatus: 'HIGH',
      refreshIntervalMinutes: 120,
    },
    commodities: {
      Wheat: {
        commodity: 'Wheat (Sharbati)',
        mandiName: 'Sehore Krishi Upaj Mandi',
        district: 'Sehore',
        modalPricePerQuintal: 2540,
        minPricePerQuintal: 2420,
        maxPricePerQuintal: 2780,
        mspBenchmarkPerQuintal: 2275,
        priceChange7dPercent: 4.8,
        priceChange30dPercent: 7.2,
        volatilityIndex: 'LOW',
        arrivalQuantityTonnes: 450,
        marketSentiment: 'BULLISH',
        date: new Date().toISOString().split('T')[0],
      },
    },
    regionalMandis: [],
  };

  const sampleMachines: Machine[] = [
    {
      id: 'mach-jd-harv-01',
      chcId: 'chc-sehore-01',
      chcName: 'Sehore Agri Centre',
      identifier: 'MP-04-HV-1001',
      category: 'HARVESTER',
      brand: 'John Deere',
      model: 'W70 Grain Harvester',
      yearOfManufacture: 2024,
      powerHp: 100,
      status: 'AVAILABLE',
      baseRatePerHour: 2200,
      healthScore: 94,
      totalEngineHours: 320.0,
      hoursSinceLastService: 45.0,
      serviceIntervalHours: 250.0,
      imageUrl: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0',
      rating: 4.9,
      totalRentals: 42,
      supportedActivities: ['HARVESTING', 'THRESHING'],
      latitude: 23.2030,
      longitude: 77.0844,
      telemetryMode: 'HARDWARE_IOT',
      specs: {
        engine: 'Diesel Turbocharged',
        fuelTankLitres: 120,
      },
    },
    {
      id: 'mach-mah-tr-02',
      chcId: 'chc-sehore-01',
      chcName: 'Sehore Agri Centre',
      identifier: 'MP-04-TR-2002',
      category: 'TRACTOR',
      brand: 'Mahindra',
      model: '575 DI SP Plus',
      yearOfManufacture: 2024,
      powerHp: 50,
      status: 'AVAILABLE',
      baseRatePerHour: 850,
      healthScore: 92,
      totalEngineHours: 180.0,
      hoursSinceLastService: 60.0,
      serviceIntervalHours: 250.0,
      imageUrl: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0',
      rating: 4.8,
      totalRentals: 28,
      supportedActivities: ['SOWING', 'SOIL_PREPARATION', 'TRANSPORT'],
      latitude: 23.1950,
      longitude: 77.0910,
      telemetryMode: 'OPERATOR_GPS',
      specs: {
        engine: 'Diesel DI',
        fuelTankLitres: 60,
      },
    },
  ];

  const sampleChcs: CHC[] = [
    {
      id: 'chc-sehore-01',
      name: 'Sehore Agri Centre',
      code: 'CHC-SEH-01',
      village: 'Sehore Rural',
      district: 'Sehore',
      state: 'Madhya Pradesh',
      contactPhone: '+91 98260 12345',
      latitude: 23.2030,
      longitude: 77.0844,
      operatingRadiusKm: 35,
      totalMachines: 12,
      activeMachines: 6,
    },
    {
      id: 'chc-bhopal-02',
      name: 'GreenFields Bhopal CHC',
      code: 'CHC-BHP-02',
      village: 'Phanda Kalan',
      district: 'Bhopal',
      state: 'Madhya Pradesh',
      contactPhone: '+91 98260 54321',
      latitude: 23.2394,
      longitude: 77.2655,
      operatingRadiusKm: 40,
      totalMachines: 18,
      activeMachines: 10,
    },
  ];

  describe('1. Farmer Decision Intelligence: Farm Profit Model', () => {
    it('calculates expected, conservative, and favorable profit ranges for an 8-acre wheat farm', () => {
      const profitModel = calculateFarmProfitModel(sampleFarm, 2540);

      expect(profitModel.sizeAcres).toBe(8);
      expect(profitModel.cropName).toBe('Wheat');
      expect(profitModel.totalExpectedYieldQuintal).toBe(148); // 18.5 * 8
      expect(profitModel.expectedGrossRevenue).toBe(375920); // 148 * 2540

      // Itemized expenses check
      expect(profitModel.expenses.totalCost).toBeGreaterThan(100000);
      expect(profitModel.expectedNetProfit).toBeGreaterThan(150000);
      expect(profitModel.profitPerAcre).toBeGreaterThan(15000);
      expect(profitModel.expectedRoiPercent).toBeGreaterThan(80);

      // Profit range boundaries
      expect(profitModel.profitRange.conservative).toBeLessThan(profitModel.expectedNetProfit);
      expect(profitModel.profitRange.favorable).toBeGreaterThan(profitModel.expectedNetProfit);
      expect(profitModel.profitRange.keyUncertaintyDrivers.length).toBeGreaterThanOrEqual(3);
    });

    it('calculates break-even yield and break-even price correctly', () => {
      const profitModel = calculateFarmProfitModel(sampleFarm, 2540);

      expect(profitModel.breakEvenYieldQuintalPerAcre).toBeGreaterThan(5);
      expect(profitModel.breakEvenYieldQuintalPerAcre).toBeLessThan(profitModel.expectedYieldQuintalPerAcre);
      expect(profitModel.breakEvenPricePerQuintal).toBeLessThan(profitModel.expectedSellingPricePerQuintal);
    });
  });

  describe('2. Multi-Dimensional Farm Risk Sentinels', () => {
    it('detects high weather risk and provides structured WHAT, WHY, WHEN, IMPACT, ACTION', () => {
      const risks = assessFarmRisks(sampleFarm, sampleWeather, sampleMarket, sampleMachines, []);

      expect(risks.overallRiskLevel).toBe('HIGH');
      expect(risks.overallScoreOutOf100).toBeGreaterThanOrEqual(55);

      const weatherDriver = risks.riskDrivers.find(r => r.category === 'WEATHER');
      expect(weatherDriver).toBeDefined();
      expect(weatherDriver?.riskLevel).toBe('HIGH');
      expect(weatherDriver?.what).toContain('Heavy precipitation');
      expect(weatherDriver?.why).toContain('rainfall');
      expect(weatherDriver?.when).toContain('Next 24 to 48 hours');
      expect(weatherDriver?.impact).toContain('lodging');
      expect(weatherDriver?.recommendedAction).toContain('harvesting');
    });

    it('escalates machinery risk when available harvesters are scarce', () => {
      // Zero harvesters available
      const emptyFleet: Machine[] = [];
      const risks = assessFarmRisks(sampleFarm, sampleWeather, sampleMarket, emptyFleet, []);

      const machineDriver = risks.riskDrivers.find(r => r.category === 'MACHINERY');
      expect(machineDriver?.riskLevel).toBe('CRITICAL');
      expect(machineDriver?.what).toContain('Zero harvesters available');
    });
  });

  describe('3. "What-If" Scenario Simulator', () => {
    it('accurately projects financial delta when heavy rain causes 3-day harvest delay', () => {
      const profitModel = calculateFarmProfitModel(sampleFarm, 2540);
      const scenarios = simulateFarmScenarios(profitModel, sampleWeather, {
        rainfallDeltaPercent: 40,
        harvestDelayDays: 3,
        sellingPriceDeltaPercent: -4,
        machineryRateDeltaPercent: 15,
      });

      expect(scenarios.length).toBeGreaterThanOrEqual(4);

      const customScenario = scenarios[0];
      expect(customScenario.scenarioName).toBe('Custom Interactive Scenario');
      expect(customScenario.profitDeltaFromExpected).toBeLessThan(0); // Lower profit
      expect(customScenario.lodgingRiskScore).toBeGreaterThan(50);
      expect(customScenario.recommendedMitigation).toContain('Critical: Secure combine harvester');
    });
  });

  describe('4. Daily Farm Brief & Weekly Report Generation', () => {
    it('generates bilingual daily brief with voice scripts and actionable advice', () => {
      const profitModel = calculateFarmProfitModel(sampleFarm, 2540);
      const risks = assessFarmRisks(sampleFarm, sampleWeather, sampleMarket, sampleMachines, []);
      const brief = generateDailyFarmBrief(sampleFarm, profitModel, risks, sampleWeather, 2);

      expect(brief.id).toContain(sampleFarm.id);
      expect(brief.headline).toContain('Harvest Window Alert');
      expect(brief.headlineHindi).toContain('कटाई खिड़की चेतावनी');
      expect(brief.audioVoiceScript).toContain('Good morning');
      expect(brief.audioVoiceScriptHindi).toContain('नमस्ते');
      expect(brief.confidencePercent).toBeGreaterThan(70);
    });

    it('generates structured 13-section weekly farm report with data freshness panel', () => {
      const profitModel = calculateFarmProfitModel(sampleFarm, 2540);
      const risks = assessFarmRisks(sampleFarm, sampleWeather, sampleMarket, sampleMachines, []);
      const report = generateWeeklyFarmReport(
        sampleFarm,
        profitModel,
        risks,
        sampleWeather,
        sampleMarket,
        [],
        sampleMachines
      );

      expect(report.farmId).toBe(sampleFarm.id);
      expect(report.executiveSummary).toContain('Ramesh Patel Farm');
      expect(report.actionPlan.length).toBe(3);
      expect(report.dataFreshnessPanel.length).toBeGreaterThanOrEqual(4);
      expect(report.disclaimer).toContain('decision-support tool');
    });
  });

  describe('5. CHC Fleet Intelligence: Demand Forecasting & Profitability', () => {
    it('correlates incoming rain with a +35% surge in harvester demand', () => {
      const forecasts = forecastFleetDemand(sampleChcs, sampleMachines, sampleWeather, []);

      expect(forecasts.length).toBeGreaterThan(0);
      const harvesterForecast = forecasts.find(
        f => f.district === 'Sehore' && f.machineCategory === 'HARVESTER'
      );
      expect(harvesterForecast).toBeDefined();
      expect(harvesterForecast?.weatherSurgeCorrelationFactor).toBe(1.35);
      expect(harvesterForecast?.expectedDemandUnits).toBeGreaterThan(20);
    });

    it('computes machine net contribution profit and flags idle assets', () => {
      const profitability = calculateMachineProfitability(sampleMachines, []);

      expect(profitability.length).toBe(sampleMachines.length);
      const topMachine = profitability[0];
      expect(topMachine.netContributionProfit).toBeGreaterThan(0);
      expect(topMachine.profitabilityRank).toBe(1);
      expect(topMachine.fuelExpenses).toBeGreaterThan(0);
      expect(topMachine.maintenanceExpenses).toBeGreaterThan(0);
    });

    it('generates daily fleet brief and weekly fleet report', () => {
      const forecasts = forecastFleetDemand(sampleChcs, sampleMachines, sampleWeather, []);
      const profitability = calculateMachineProfitability(sampleMachines, []);
      const fleetBrief = generateDailyFleetBrief(sampleChcs[0], sampleMachines, forecasts, []);
      const fleetReport = generateWeeklyFleetReport(sampleChcs[0], sampleMachines, forecasts, profitability, []);

      expect(fleetBrief.chcId).toBe(sampleChcs[0].id);
      expect(fleetReport.revenueProjections.expected).toBeGreaterThan(0);
      expect(fleetReport.revenueProjections.conservative).toBeLessThan(fleetReport.revenueProjections.expected);
      expect(fleetReport.revenueProjections.optimistic).toBeGreaterThan(fleetReport.revenueProjections.expected);
    });
  });

  describe('6. Closed-Loop Outcome Tracking & Accuracy Evaluator', () => {
    it('logs recommendation outcomes and evaluates prediction accuracy metrics', () => {
      const testOutcome = {
        id: `test-out-${Date.now()}`,
        recommendationId: 'rec-test-01',
        entityType: 'FARMER' as const,
        entityId: sampleFarm.id,
        recommendationType: 'HARVEST_ACCELERATION',
        recommendedAction: 'Harvest within 24h dry window',
        recommendedAt: new Date().toISOString(),
        adoptedByFarmer: true,
        actualRainfallMm: 14.8,
        actualHarvestYieldQuintal: 148,
        actualSellingPricePerQuintal: 2540,
        predictionAccuracyPercent: 96.0,
      };

      logRecommendationOutcome(testOutcome);
      const outcomes = getLoggedOutcomes();
      expect(outcomes.some(o => o.id === testOutcome.id)).toBe(true);

      const metrics = evaluateIntelligenceAccuracy();
      expect(metrics.totalLoggedRecommendations).toBeGreaterThan(0);
      expect(metrics.averagePredictionAccuracyPercent).toBeGreaterThan(80);
      expect(metrics.adoptionRatePercent).toBeGreaterThan(50);
      expect(metrics.totalFarmerLossesPreventedEstimateRupees).toBeGreaterThan(10000);
    });
  });
});
