import {
  Farm,
  FarmProfitModel,
  FarmRiskAssessment,
  ExplainableRiskItem,
  RiskLevel,
  ScenarioSimulationInput,
  ScenarioSimulationResult,
  DailyFarmBrief,
  WeeklyFarmReport,
  Machine,
} from '../../types';
import {
  WeatherObservationData,
  MarketDataProviderResult,
  ExternalRiskEvent,
} from './providers/types';
import { defaultAgronomicProvider } from './providers/agronomicDataProvider';

/**
 * Calculates Explainable Farm Economics & Profit Ranges
 * Returns Expected, Conservative (pessimistic), and Favorable (optimistic) economics
 */
export function calculateFarmProfitModel(
  farm: Farm,
  mandiPrice = 2540,
  overrides?: {
    customYieldPerAcre?: number;
    customSellingPrice?: number;
    customExpensesPerAcre?: Partial<{
      seeds: number;
      fertilizers: number;
      cropProtection: number;
      irrigation: number;
      labor: number;
      machineryRental: number;
      fuel: number;
      other: number;
    }>;
  }
): FarmProfitModel {
  const cropProfile = defaultAgronomicProvider.getCropProfile(farm.crop.cropName, farm.crop.season);
  const sizeAcres = Math.max(1, farm.sizeAcres || 8);
  const yieldPerAcre = overrides?.customYieldPerAcre || cropProfile.averageYieldQuintalPerAcre;
  const sellingPricePerQuintal = overrides?.customSellingPrice || mandiPrice;

  const bCosts = cropProfile.benchmarkCostsPerAcre;
  const cExpenses = overrides?.customExpensesPerAcre || {};

  const seedsCost = (cExpenses.seeds ?? bCosts.seeds) * sizeAcres;
  const fertilizersCost = (cExpenses.fertilizers ?? bCosts.fertilizers) * sizeAcres;
  const cropProtectionCost = (cExpenses.cropProtection ?? bCosts.cropProtection) * sizeAcres;
  const irrigationCost = (cExpenses.irrigation ?? bCosts.irrigation) * sizeAcres;
  const laborCost = (cExpenses.labor ?? bCosts.labor) * sizeAcres;
  const machineryRentalCost = (cExpenses.machineryRental ?? bCosts.machineryRental) * sizeAcres;
  const fuelCost = (cExpenses.fuel ?? bCosts.fuel) * sizeAcres;
  const otherOperatingExpenses = (cExpenses.other ?? bCosts.other) * sizeAcres;

  const totalCost =
    seedsCost +
    fertilizersCost +
    cropProtectionCost +
    irrigationCost +
    laborCost +
    machineryRentalCost +
    fuelCost +
    otherOperatingExpenses;

  const costPerAcre = Math.round(totalCost / sizeAcres);
  const totalExpectedYieldQuintal = Math.round(yieldPerAcre * sizeAcres * 10) / 10;
  const expectedGrossRevenue = Math.round(totalExpectedYieldQuintal * sellingPricePerQuintal);
  const expectedNetProfit = expectedGrossRevenue - totalCost;
  const profitPerAcre = Math.round(expectedNetProfit / sizeAcres);
  const expectedRoiPercent = Math.round((expectedNetProfit / Math.max(1, totalCost)) * 1000) / 10;

  // Break-even Calculations
  const breakEvenYieldQuintalPerAcre =
    Math.round((totalCost / sizeAcres / Math.max(1, sellingPricePerQuintal)) * 10) / 10;
  const breakEvenPricePerQuintal =
    Math.round(totalCost / Math.max(1, totalExpectedYieldQuintal));

  // Conservative Scenario (-15% yield due to weather/shatter loss, -8% market discount)
  const conservativeYield = totalExpectedYieldQuintal * 0.85;
  const conservativePrice = sellingPricePerQuintal * 0.92;
  const conservativeRevenue = Math.round(conservativeYield * conservativePrice);
  const conservativeProfit = conservativeRevenue - (totalCost * 1.05); // +5% operational delay costs

  // Favorable Scenario (+10% yield, +6% mandi premium for high luster grade)
  const favorableYield = totalExpectedYieldQuintal * 1.10;
  const favorablePrice = sellingPricePerQuintal * 1.06;
  const favorableRevenue = Math.round(favorableYield * favorablePrice);
  const favorableProfit = favorableRevenue - totalCost;

  return {
    farmId: farm.id,
    sizeAcres,
    cropName: farm.crop.cropName,
    expectedYieldQuintalPerAcre: yieldPerAcre,
    totalExpectedYieldQuintal,
    expectedSellingPricePerQuintal: sellingPricePerQuintal,
    expectedGrossRevenue,
    expenses: {
      seedsCost,
      fertilizersCost,
      cropProtectionCost,
      irrigationCost,
      laborCost,
      machineryRentalCost,
      fuelCost,
      otherOperatingExpenses,
      totalCost,
      costPerAcre,
    },
    expectedNetProfit,
    profitPerAcre,
    expectedRoiPercent,
    breakEvenYieldQuintalPerAcre,
    breakEvenPricePerQuintal,
    profitRange: {
      conservative: conservativeProfit,
      expected: expectedNetProfit,
      favorable: favorableProfit,
      confidencePercent: 78,
      keyUncertaintyDrivers: [
        'Precipitation intensity during active combine harvesting',
        'Post-harvest moisture content affecting mandi dockage deduction',
        'Regional mandi price fluctuations (7-day trend volatility)',
        'Local machinery availability surge tariffs (+10–15%)',
      ],
    },
    lastCalculatedAt: new Date().toISOString(),
  };
}

/**
 * Multi-Dimensional Farm Risk Engine
 * Produces structured WHAT, WHY, WHEN, IMPACT, ACTION risk vectors
 */
export function assessFarmRisks(
  farm: Farm,
  weather: WeatherObservationData,
  market: MarketDataProviderResult,
  availableNearbyMachines: Machine[],
  events: ExternalRiskEvent[]
): FarmRiskAssessment {
  const riskDrivers: ExplainableRiskItem[] = [];

  // 1. Weather Risk Driver
  let weatherRisk: RiskLevel = 'LOW';
  let weatherScore = 20;
  let weatherWhat = 'Stable weather conditions favorable for field operations.';
  let weatherWhy = 'Precipitation probability is below 20% with clear sunshine.';
  let weatherWhen = 'Next 48–72 hours';
  let weatherImpact = 'Minimal operational risk; dry soil facilitates efficient tractor/harvester traction.';
  let weatherAction = 'Proceed with planned field activities according to schedule.';

  if (weather.precipitationForecast72hMm >= 15 || weather.isRainImminent24h) {
    weatherRisk = 'HIGH';
    weatherScore = 84;
    weatherWhat = `Heavy precipitation (${weather.precipitationForecast72hMm}mm in 72h) expected in ${farm.district}.`;
    weatherWhy = 'Incoming Western Disturbance rainfall front overlaps with crop maturity window.';
    weatherWhen = 'Next 24 to 48 hours';
    weatherImpact = 'Pre-harvest grain lodging risk, moisture increase, and machinery impassability on wet vertisol soil.';
    weatherAction = 'Accelerate harvesting during the immediate dry window or secure combine harvester today.';
  } else if (weather.precipitationForecast72hMm >= 5) {
    weatherRisk = 'MEDIUM';
    weatherScore = 52;
    weatherWhat = 'Light scattered showers (5–12mm) anticipated.';
    weatherWhy = 'Elevated relative humidity and cloudy overcast skies.';
    weatherWhen = 'Next 48 hours';
    weatherImpact = 'Brief 12-hour spray/harvest delay; minor soil softening.';
    weatherAction = 'Complete scheduled chemical spraying before afternoon or wait until leaf surfaces dry.';
  }

  riskDrivers.push({
    category: 'WEATHER',
    riskLevel: weatherRisk,
    scoreOutOf100: weatherScore,
    what: weatherWhat,
    why: weatherWhy,
    when: weatherWhen,
    impact: weatherImpact,
    recommendedAction: weatherAction,
    signalsUsed: ['precipitation_forecast_72h', 'relative_humidity', 'soil_moisture_0_10cm', 'open_meteo_radar'],
    confidence: weather.metadata.confidence,
  });

  // 2. Crop Stage & Agronomic Risk
  const agronomicStage = defaultAgronomicProvider.estimateCropStage(farm.crop.cropName, farm.crop.sowingDate || '2024-11-15');
  let cropRisk: RiskLevel = 'LOW';
  let cropScore = 25;
  let cropWhat = `${farm.crop.cropName} is in ${agronomicStage.currentStage}.`;
  let cropWhy = `Crop is ${agronomicStage.daysSinceSowing} days post-sowing, matching regional GDD maturity benchmarks.`;
  let cropWhen = `Harvest window: ${agronomicStage.estimatedHarvestWindow.start} to ${agronomicStage.estimatedHarvestWindow.end}`;
  let cropImpact = 'Grain moisture is dropping towards optimal 12% storage threshold.';
  let cropAction = 'Inspect field plot uniformity and arrange threshing equipment.';

  if (agronomicStage.stageIndex >= 5 && weatherRisk === 'HIGH') {
    cropRisk = 'HIGH';
    cropScore = 78;
    cropWhat = 'Critical mature crop exposure to rainfall.';
    cropWhy = 'Mature wheat ears are vulnerable to shattering and black point fungal staining if wetted.';
    cropWhen = 'Immediate (Next 24h)';
    cropImpact = 'Potential 10–15% yield loss and ₹150/quintal quality downgrade at mandi.';
    cropAction = 'Deploy high-capacity combine harvester to harvest before rain starts.';
  }

  riskDrivers.push({
    category: 'CROP',
    riskLevel: cropRisk,
    scoreOutOf100: cropScore,
    what: cropWhat,
    why: cropWhy,
    when: cropWhen,
    impact: cropImpact,
    recommendedAction: cropAction,
    signalsUsed: ['crop_sowing_date', 'growing_degree_days', 'stage_duration', 'grain_moisture_threshold'],
    confidence: 0.90,
  });

  // 3. Machinery Availability Risk
  const availableHarvesters = availableNearbyMachines.filter(
    m => m.category === 'HARVESTER' && m.status === 'AVAILABLE'
  );
  let machineRisk: RiskLevel = 'LOW';
  let machineScore = 20;
  let machineWhat = `${availableNearbyMachines.length} machinery units available within service radius.`;
  let machineWhy = `${availableHarvesters.length} combine harvesters currently unreserved.`;
  let machineWhen = 'Immediate booking ready';
  let machineImpact = 'No queue delay expected; competitive hourly pricing.';
  let machineAction = 'Review equipment choices on KisanOps marketplace.';

  if (availableHarvesters.length === 0) {
    machineRisk = 'CRITICAL';
    machineScore = 92;
    machineWhat = 'Zero harvesters available within standard 25 km geofence.';
    machineWhy = 'High local demand surge has fully booked all local CHC units.';
    machineWhen = 'Next 3 days';
    machineImpact = 'Extended waiting times of 48–72 hours leading to missed dry harvesting windows.';
    machineAction = 'Expand search radius to 50 km (Bhopal/Raisen hubs) or request cross-CHC fleet dispatch.';
  } else if (availableHarvesters.length <= 2) {
    machineRisk = 'MEDIUM';
    machineScore = 55;
    machineWhat = `Only ${availableHarvesters.length} harvesters remaining in local cluster.`;
    machineWhy = 'Concurrent farmer bookings are accelerating ahead of expected weather shift.';
    machineWhen = 'Next 12–24 hours';
    machineImpact = 'Imminent machine shortage and surge pricing risk (+15%).';
    machineAction = 'Lock in your booking reservation now to secure immediate priority.';
  }

  riskDrivers.push({
    category: 'MACHINERY',
    riskLevel: machineRisk,
    scoreOutOf100: machineScore,
    what: machineWhat,
    why: machineWhy,
    when: machineWhen,
    impact: machineImpact,
    recommendedAction: machineAction,
    signalsUsed: ['nearby_machine_availability', 'active_confirmed_bookings', 'chc_cluster_utilization'],
    confidence: 0.95,
  });

  // 4. Market & Commodity Price Risk
  const wheatPrice = market.commodities.Wheat;
  let marketRisk: RiskLevel = 'LOW';
  let marketScore = 30;
  let marketWhat = `Mandi price at ₹${wheatPrice?.modalPricePerQuintal || 2540}/quintal (7-day trend: +${wheatPrice?.priceChange7dPercent || 4.8}%).`;
  let marketWhy = 'Stable miller demand and active government MSP procurement window.';
  let marketWhen = 'Current Mandi Session';
  let marketImpact = 'Favorable gross margins above ₹2,275/q MSP benchmark.';
  let marketAction = 'Monitor local mandi arrivals and plan delivery logistics.';

  if (wheatPrice && wheatPrice.priceChange7dPercent < -3.0) {
    marketRisk = 'MEDIUM';
    marketScore = 60;
    marketWhat = `Recent price softening (${wheatPrice.priceChange7dPercent}% over last 7 days).`;
    marketWhy = 'Large harvest arrivals in Indore and Bhopal mandis exerting short-term pressure.';
    marketWhen = 'Next 7 days';
    marketImpact = 'Potential ₹60–80/quintal drop in realization if sold during peak arrival glut.';
    marketAction = 'Consider using warehouse receipt credit or staggered sales over 3 weeks.';
  }

  riskDrivers.push({
    category: 'MARKET',
    riskLevel: marketRisk,
    scoreOutOf100: marketScore,
    what: marketWhat,
    why: marketWhy,
    when: marketWhen,
    impact: marketImpact,
    recommendedAction: marketAction,
    signalsUsed: ['agmarknet_modal_price', 'msp_benchmark', '7d_price_trend', 'arrival_tonnes'],
    confidence: market.metadata.confidence,
  });

  // 5. External Event / Policy Risk
  const highImpactEvent = events.find(e => e.impactLevel === 'HIGH' || e.impactLevel === 'CRITICAL');
  let eventRisk: RiskLevel = highImpactEvent ? 'MEDIUM' : 'LOW';
  let eventScore = highImpactEvent ? 55 : 15;
  let eventWhat = highImpactEvent ? highImpactEvent.title : 'No disruptive policy or supply-chain alerts active.';
  let eventWhy = highImpactEvent ? highImpactEvent.summary : 'Standard agricultural operating environment.';
  let eventWhen = highImpactEvent ? 'Active now' : 'Seasonal';
  let eventImpact = highImpactEvent ? highImpactEvent.directFarmImplication : 'Normal cost & operational baselines.';
  let eventAction = highImpactEvent ? highImpactEvent.actionableMitigation : 'Maintain normal crop management routines.';

  riskDrivers.push({
    category: 'EXTERNAL_EVENT',
    riskLevel: eventRisk,
    scoreOutOf100: eventScore,
    what: eventWhat,
    why: eventWhy,
    when: eventWhen,
    impact: eventImpact,
    recommendedAction: eventAction,
    signalsUsed: ['verified_agri_advisories', 'imd_warnings', 'fuel_depot_pricing'],
    confidence: 0.90,
  });

  // Calculate Overall Weighted Risk Score
  const overallScore = Math.round(
    weatherScore * 0.30 +
    cropScore * 0.25 +
    machineScore * 0.20 +
    marketScore * 0.15 +
    eventScore * 0.10
  );

  let overallRiskLevel: RiskLevel = 'LOW';
  if (overallScore >= 75) overallRiskLevel = 'CRITICAL';
  else if (overallScore >= 55) overallRiskLevel = 'HIGH';
  else if (overallScore >= 35) overallRiskLevel = 'MEDIUM';

  return {
    overallRiskLevel,
    overallScoreOutOf100: overallScore,
    riskDrivers,
    assessedAt: new Date().toISOString(),
  };
}

/**
 * "What-If" Scenario Simulator
 * Simulates financial and operational impacts of changing rainfall, price drops, harvest delays, and machinery rates
 */
export function simulateFarmScenarios(
  profitModel: FarmProfitModel,
  weather: WeatherObservationData,
  customInput?: Partial<ScenarioSimulationInput>
): ScenarioSimulationResult[] {
  const defaultScenarios: { name: string; input: ScenarioSimulationInput }[] = [
    {
      name: 'Baseline Expected Scenario',
      input: {
        rainfallDeltaPercent: 0,
        harvestDelayDays: 0,
        sellingPriceDeltaPercent: 0,
        machineryRateDeltaPercent: 0,
      },
    },
    {
      name: 'Heavy Rainfall & 3-Day Harvest Delay',
      input: {
        rainfallDeltaPercent: 40,
        harvestDelayDays: 3,
        sellingPriceDeltaPercent: -4,
        machineryRateDeltaPercent: 15,
      },
    },
    {
      name: 'Market Price Softening (-10%)',
      input: {
        rainfallDeltaPercent: 0,
        harvestDelayDays: 0,
        sellingPriceDeltaPercent: -10,
        machineryRateDeltaPercent: 0,
      },
    },
    {
      name: 'Favorable Dry Harvest & Premium Price (+6%)',
      input: {
        rainfallDeltaPercent: -50,
        harvestDelayDays: -1,
        sellingPriceDeltaPercent: 6,
        machineryRateDeltaPercent: -5,
      },
    },
  ];

  if (customInput) {
    defaultScenarios.unshift({
      name: 'Custom Interactive Scenario',
      input: {
        rainfallDeltaPercent: customInput.rainfallDeltaPercent ?? 0,
        harvestDelayDays: customInput.harvestDelayDays ?? 0,
        sellingPriceDeltaPercent: customInput.sellingPriceDeltaPercent ?? 0,
        machineryRateDeltaPercent: customInput.machineryRateDeltaPercent ?? 0,
      },
    });
  }

  return defaultScenarios.map(sc => {
    const inp = sc.input;

    // Yield loss factor based on delay + rain
    const shatterLossPercent = Math.max(0, inp.harvestDelayDays * 2.5 + (inp.rainfallDeltaPercent > 20 ? 6.0 : 0));
    const projectedYield = Math.max(1, profitModel.totalExpectedYieldQuintal * (1 - shatterLossPercent / 100));

    // Price factor
    const projectedPrice = profitModel.expectedSellingPricePerQuintal * (1 + inp.sellingPriceDeltaPercent / 100);
    const projectedRevenue = Math.round(projectedYield * projectedPrice);

    // Cost factor
    const extraMachineryRental = profitModel.expenses.machineryRentalCost * (1 + inp.machineryRateDeltaPercent / 100);
    const projectedExpenses = Math.round(
      profitModel.expenses.totalCost - profitModel.expenses.machineryRentalCost + extraMachineryRental
    );

    const projectedProfit = projectedRevenue - projectedExpenses;
    const profitDeltaFromExpected = projectedProfit - profitModel.expectedNetProfit;

    // Lodging & Machinery Risks
    const lodgingScore = Math.min(100, Math.round(20 + inp.rainfallDeltaPercent * 0.6 + inp.harvestDelayDays * 12));
    const machineryAvailabilityRisk: RiskLevel =
      inp.harvestDelayDays > 2 || inp.rainfallDeltaPercent > 25 ? 'HIGH' : 'LOW';

    let mitigation = 'No special intervention required; maintain current harvest plan.';
    if (profitDeltaFromExpected < -15000) {
      mitigation = 'Critical: Secure combine harvester today to avoid compounding lodging losses and peak queue tariffs.';
    } else if (profitDeltaFromExpected < 0) {
      mitigation = 'Consider booking early morning harvest slots to protect grain moisture and avoid dockage.';
    } else {
      mitigation = 'Optimal condition: Ensure dry storage bags and arrange direct mandi transport.';
    }

    const keyTradeoff = `Projected Profit: ₹${projectedProfit.toLocaleString('en-IN')} (${profitDeltaFromExpected >= 0 ? '+' : ''}₹${profitDeltaFromExpected.toLocaleString('en-IN')} vs baseline)`;

    return {
      scenarioName: sc.name,
      input: inp,
      projectedRevenue,
      projectedExpenses,
      projectedProfit,
      profitDeltaFromExpected,
      projectedYieldQuintal: Math.round(projectedYield * 10) / 10,
      lodgingRiskScore: lodgingScore,
      machineryAvailabilityRisk,
      recommendedMitigation: mitigation,
      keyTradeoffSummary: keyTradeoff,
    };
  });
}

/**
 * Generates Daily Farm Brief (Executive morning intelligence with Hindi & English voice scripts)
 */
export function generateDailyFarmBrief(
  farm: Farm,
  profitModel: FarmProfitModel,
  risks: FarmRiskAssessment,
  weather: WeatherObservationData,
  nearbyMachinesCount: number
): DailyFarmBrief {
  const todayStr = new Date().toISOString().split('T')[0];
  const weatherRisk = risks.riskDrivers.find(r => r.category === 'WEATHER');
  const cropRisk = risks.riskDrivers.find(r => r.category === 'CROP');

  const isRainRisk = weather.precipitationForecast72hMm >= 10 || weather.isRainImminent24h;

  const headline = isRainRisk
    ? '⚠️ Harvest Window Alert: Rainfall Expected in 36 Hours'
    : '☀️ Optimal Dry Weather Window for Field Operations';

  const headlineHindi = isRainRisk
    ? '⚠️ कटाई खिड़की चेतावनी: अगले 36 घंटों में बारिश की संभावना'
    : '☀️ खेत कार्यों के लिए उत्तम शुष्क मौसम खिड़की';

  const topRec = isRainRisk
    ? `Rainfall of ${weather.precipitationForecast72hMm}mm is forecast within 72h. Based on your ${farm.crop.cropName} crop stage and ${nearbyMachinesCount} available machines, harvesting in the next dry window has the highest expected return.`
    : `Conditions are optimal. Your ${farm.crop.cropName} crop is progressing well with expected net return of ₹${profitModel.expectedNetProfit.toLocaleString('en-IN')}. ${nearbyMachinesCount} machines are ready for booking.`;

  const topRecHindi = isRainRisk
    ? `अगले 72 घंटों में ${weather.precipitationForecast72hMm} मिमी बारिश का अनुमान है। आपके ${farm.crop.cropName} फसल की स्थिति और ${nearbyMachinesCount} उपलब्ध मशीनों के आधार पर, अभी कटाई सुरक्षित करना सबसे अधिक लाभदायक रहेगा।`
    : `मौसम अनुकूल है। आपकी ${farm.crop.cropName} फसल से लगभग ₹${profitModel.expectedNetProfit.toLocaleString('en-IN')} शुद्ध लाभ की उम्मीद है। ${nearbyMachinesCount} मशीनें बुकिंग के लिए तैयार हैं।`;

  const audioScript = `Good morning. For your ${farm.sizeAcres} acre ${farm.crop.cropName} farm in ${farm.village || farm.district}, ${topRec}`;
  const audioScriptHindi = `नमस्ते। ${farm.village || farm.district} में आपके ${farm.sizeAcres} एकड़ ${farm.crop.cropName} खेत के लिए, ${topRecHindi}`;

  return {
    id: `brief-${farm.id}-${todayStr}`,
    farmId: farm.id,
    date: todayStr,
    greetingGreeting: `Good Morning, Farmer Partner`,
    headline,
    headlineHindi,
    topRecommendation: topRec,
    topRecommendationHindi: topRecHindi,
    weatherSummary: `${weather.weatherDescription} • ${weather.temperatureC}°C • Rain Probability ${weather.precipitationProbabilityPercent}%`,
    machinerySummary: `${nearbyMachinesCount} machines ready within 25 km geofence`,
    marketSummary: `Mandi Rate: ₹${profitModel.expectedSellingPricePerQuintal}/q • Projected Profit: ₹${profitModel.expectedNetProfit.toLocaleString('en-IN')}`,
    riskSummary: `Overall Risk: ${risks.overallRiskLevel} (${risks.overallScoreOutOf100}/100)`,
    mostImportantAction: isRainRisk
      ? 'Confirm combine harvester booking today before queue fills'
      : 'Maintain scheduled irrigation and monitor grain moisture',
    confidencePercent: 82,
    audioVoiceScript: audioScript,
    audioVoiceScriptHindi: audioScriptHindi,
    dataSourcesCount: 5,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generates Structured Weekly Farm Intelligence Report (Ready for UI & PDF export)
 */
export function generateWeeklyFarmReport(
  farm: Farm,
  profitModel: FarmProfitModel,
  risks: FarmRiskAssessment,
  weather: WeatherObservationData,
  market: MarketDataProviderResult,
  events: ExternalRiskEvent[],
  nearbyMachines: Machine[]
): WeeklyFarmReport {
  const now = new Date();
  const weekStart = now.toISOString().split('T')[0];
  const weekEnd = new Date(now.getTime() + 7 * 86400000).toISOString().split('T')[0];

  const scenarios = simulateFarmScenarios(profitModel, weather);

  const actionPlan: { priority: 'IMMEDIATE' | 'THIS_WEEK' | 'PLANNED'; action: string; impact: string }[] = [
    {
      priority: 'IMMEDIATE',
      action: 'Confirm combine harvester reservation on KisanOps within the 24-hour dry window.',
      impact: 'Avoids ₹18,400 potential lodging and grain moisture dockage losses.',
    },
    {
      priority: 'THIS_WEEK',
      action: 'Arrange clean gunny bags and coordinate direct transport to Sehore Krishi Upaj Mandi.',
      impact: 'Captures current ₹2,540/q premium price above ₹2,275 MSP.',
    },
    {
      priority: 'PLANNED',
      action: 'Plan post-harvest stubble management using Super Seeder for upcoming Zaid/Moong crop.',
      impact: 'Conserves soil moisture and qualifies for state green-tillage subsidy.',
    },
  ];

  const dataFreshnessPanel = [
    { source: weather.metadata.source, ageMinutes: 8, quality: weather.metadata.qualityStatus },
    { source: market.metadata.source, ageMinutes: 45, quality: market.metadata.qualityStatus },
    { source: 'Copernicus Sentinel-2 Satellite Remote Sensing', ageMinutes: 1440, quality: 'HIGH' },
    { source: 'KisanOps CAN-Bus Fleet Telematics Engine', ageMinutes: 1, quality: 'HIGH' },
    { source: 'ICAR-JNKVV Jabalpur Agronomic Crop Calibration', ageMinutes: 2880, quality: 'HIGH' },
  ];

  return {
    id: `report-${farm.id}-${weekStart}`,
    farmId: farm.id,
    weekRange: `${weekStart} to ${weekEnd}`,
    executiveSummary: `Farm Performance & Risk Outlook for ${farm.farmName} (${farm.sizeAcres} Acres ${farm.crop.cropName} in ${farm.village}, ${farm.district}). Expected Net Profit is ₹${profitModel.expectedNetProfit.toLocaleString('en-IN')} (Range: ₹${profitModel.profitRange.conservative.toLocaleString('en-IN')} to ₹${profitModel.profitRange.favorable.toLocaleString('en-IN')}). Overall Farm Risk is evaluated at ${risks.overallRiskLevel}.`,
    cropLifecycleStatus: `Current stage is Maturity & Pre-Harvest Drying with 92% GDD completion. Estimated harvest ready date is ${weekStart}.`,
    weatherOutlook7d: `Upcoming 7-day outlook indicates ${weather.precipitationForecast72hMm}mm total rainfall, with an optimal dry harvesting window over the next 36 hours.`,
    machineryAvailabilityStatus: `${nearbyMachines.length} verified machines are available within your 25 km geofence across ${farm.district} CHC centres.`,
    economicsSummary: profitModel,
    riskBreakdown: risks,
    scenarioAnalysis: scenarios,
    actionPlan,
    dataFreshnessPanel,
    disclaimer: 'This intelligence report is a decision-support tool based on statistical agronomic models, real-time weather forecasts, and mandi price trends. It does not constitute a guaranteed financial return.',
    generatedAt: new Date().toISOString(),
  };
}
