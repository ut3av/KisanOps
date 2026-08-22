import { Machine, Farm } from '../../types';
import { FarmerRequirementIntent, MatchedMachineResult, FarmerContext } from '../../types/voice';
import { scoreMachineForFarmer } from '../../lib/recommendationEngine';
import { calculateDynamicPrice } from '../../lib/pricingEngine';
import { calculateGeospatialDistance, smartGeofenceSearch } from '../../lib/availabilityService';

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

    const farmLat = context?.farm_latitude || 23.1642;
    const farmLon = context?.farm_longitude || 77.1215;
    const radiusKm = intent.search_radius_km || context?.default_radius_km || 25;

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
      latitude: farmLat,
      longitude: farmLon,
    };

    // Score each machine using the canonical KisanOps recommendation and pricing engines
    const matched: MatchedMachineResult[] = available.map(machine => {
      const distanceKm = calculateGeospatialDistance(
        farmLat,
        farmLon,
        machine.latitude || 23.2030,
        machine.longitude || 77.0844
      );

      const scoring = scoreMachineForFarmer(machine, {
        farm: farmObj,
        activity,
      });

      const dynamicPrice = calculateDynamicPrice(machine, {
        demandIndex: 94,
        shortageUnits: 2,
        distanceKm,
      });

      const totalEstimated = dynamicPrice.quotedRatePerHour * 6; // ~6 hours benchmark
      const isCreditEligible = (context?.available_credit ?? 50000) >= totalEstimated;

      return {
        machine: {
          ...machine,
          distanceKm,
        },
        match_score: scoring.matchScore,
        reasons: scoring.reasons,
        price_quote: dynamicPrice,
        available_now: machine.status === 'AVAILABLE',
        distance_km: distanceKm,
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

    // Filter by geofence radius
    const withinGeofence = filtered.filter(m => m.distance_km <= radiusKm);
    if (withinGeofence.length > 0) {
      return withinGeofence.sort((a, b) => b.match_score - a.match_score);
    }

    // If none found within requested radius, smart expansion search
    return filtered.sort((a, b) => a.distance_km - b.distance_km);
  }
}
