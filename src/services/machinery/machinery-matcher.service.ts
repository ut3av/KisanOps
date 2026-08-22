import { Machine, Farm } from '../../types';
import { FarmerRequirementIntent, MatchedMachineResult, FarmerContext } from '../../types/voice';
import { scoreMachineForFarmer } from '../../lib/recommendationEngine';
import { calculateDynamicPrice } from '../../lib/pricingEngine';

export class MachineryMatcherService {
  /**
   * Matches and ranks available machines from the real KisanOps database
   */
  public matchMachines(
    intent: FarmerRequirementIntent,
    machines: Machine[],
    context?: FarmerContext
  ): MatchedMachineResult[] {
    // 1. Filter available machines
    const available = machines.filter(m => m.status === 'AVAILABLE' || m.status === 'RESERVED');

    // Convert task_category to KisanOps ActivityType
    let activity: any = 'HARVESTING';
    if (intent.task_category === 'ploughing') activity = 'SOIL_PREPARATION';
    else if (intent.task_category === 'sowing') activity = 'SOWING';
    else if (intent.task_category === 'spraying') activity = 'SPRAYING';
    else if (intent.task_category === 'threshing') activity = 'HARVESTING';
    else if (intent.task_category === 'transport') activity = 'TRANSPORT';

    // Construct lightweight farm context for recommendation engine
    const farmObj: Farm = {
      id: context?.farmer_id ? `farm-${context.farmer_id}` : 'farm-voice',
      farmerId: context?.farmer_id || 'farmer-voice',
      farmName: `${context?.farmer_name || 'Farmer'}'s Land`,
      district: intent.target_location || context?.district || 'Sehore',
      village: context?.village || '',
      state: 'Madhya Pradesh',
      sizeAcres: intent.farm_acres || context?.farm_acres || 8.0,
      crop: {
        id: 'crop-voice',
        cropName: intent.crop_name || context?.current_crop || 'Wheat',
        season: 'Rabi',
        cropStage: 'Harvest-ready',
      },
      soilType: context?.soil_type || 'Medium Black Clayey Loam',
      irrigationType: 'Canal',
      latitude: 23.2,
      longitude: 77.08,
    };

    // Score each machine using the canonical KisanOps recommendation and pricing engines
    const matched: MatchedMachineResult[] = available.map(machine => {
      const scoring = scoreMachineForFarmer(machine, {
        farm: farmObj,
        activity,
      });

      const dynamicPrice = calculateDynamicPrice(machine, {
        demandIndex: 94,
        shortageUnits: 2,
        distanceKm: machine.distanceKm || 3.2,
      });

      const totalEstimated = dynamicPrice.quotedRatePerHour * 6; // ~6 hours benchmark
      const isCreditEligible = (context?.available_credit ?? 50000) >= totalEstimated;

      return {
        machine,
        match_score: scoring.matchScore,
        reasons: scoring.reasons,
        price_quote: dynamicPrice,
        available_now: machine.status === 'AVAILABLE',
        distance_km: machine.distanceKm || 3.2,
        agri_credit_eligible: isCreditEligible,
      };
    });

    // Filter by machine type if specified (e.g. Harvester, Tractor)
    let filtered = matched;
    if (intent.machine_type_required) {
      const requiredType = intent.machine_type_required.toLowerCase();
      const typeMatches = matched.filter(m =>
        m.machine.category.toLowerCase().includes(requiredType) ||
        m.machine.brand.toLowerCase().includes(requiredType) ||
        m.machine.model.toLowerCase().includes(requiredType)
      );
      if (typeMatches.length > 0) {
        filtered = typeMatches;
      }
    }

    // Sort by highest match score first
    return filtered.sort((a, b) => b.match_score - a.match_score);
  }
}
