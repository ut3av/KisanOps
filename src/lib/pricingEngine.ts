import { Machine, PriceQuote, PricingRuleConfig } from '../types';

export const DEFAULT_PRICING_CONFIG: PricingRuleConfig = {
  minSurgeMultiplier: 0.80,
  maxSurgeMultiplier: 1.30,
  demandSurgeWeight: 0.15,
  distanceCostPerKm: 15.0,
  platformFee: 100.0,
  gstRate: 0.05,
};

export interface PricingFactors {
  demandIndex: number; // 0 - 100
  shortageUnits: number;
  distanceKm: number;
  isUrgent?: boolean;
  config?: Partial<PricingRuleConfig>;
}

/**
 * Calculates dynamic hourly rental rate with safety multipliers and explainable audit breakdown
 */
export function calculateDynamicPrice(machine: Machine, factors: PricingFactors): PriceQuote {
  const config = { ...DEFAULT_PRICING_CONFIG, ...factors.config };
  const baseRate = machine.baseRatePerHour;
  const explanation: PriceQuote['explanation'] = [
    {
      title: 'Base Rental Rate',
      description: `Standard rate for ${machine.brand} ${machine.model}`,
      amount: baseRate,
      type: 'neutral'
    }
  ];

  // 1. Demand Surcharge (Surge when regional demand > 60)
  let demandAdjustment = 0;
  if (factors.demandIndex >= 70) {
    demandAdjustment = Math.round(baseRate * 0.12);
    explanation.push({
      title: 'High Peak Season Demand',
      description: `Regional demand index is ${factors.demandIndex}% (Peak harvest window)`,
      amount: demandAdjustment,
      type: 'positive'
    });
  } else if (factors.demandIndex <= 30) {
    demandAdjustment = -Math.round(baseRate * 0.08);
    explanation.push({
      title: 'Off-Peak Demand Discount',
      description: 'Regional demand is currently low',
      amount: demandAdjustment,
      type: 'negative'
    });
  }

  // 2. Supply / Shortage Adjustment
  let supplyAdjustment = 0;
  if (factors.shortageUnits > 0) {
    supplyAdjustment = Math.round(baseRate * 0.07);
    explanation.push({
      title: 'Tight Local Fleet Availability',
      description: `Regional shortage of ${factors.shortageUnits} machines detected`,
      amount: supplyAdjustment,
      type: 'positive'
    });
  }

  // 3. Distance Adjustment (Transportation transit cost component)
  let distanceAdjustment = 0;
  if (factors.distanceKm > 5) {
    distanceAdjustment = Math.round(Math.min(60, factors.distanceKm * 4.5));
    explanation.push({
      title: 'Transit & Mobilization Offset',
      description: `Machine distance is ${factors.distanceKm} km from farm`,
      amount: distanceAdjustment,
      type: 'positive'
    });
  }

  // 4. Machine Health Incentive / Discount
  let healthDiscount = 0;
  if (machine.healthScore >= 92) {
    healthDiscount = -20;
    explanation.push({
      title: 'Certified Prime Fleet Discount',
      description: `Machine health verified at ${machine.healthScore}% with low emissions`,
      amount: healthDiscount,
      type: 'negative'
    });
  }

  // 5. Urgency Surcharge
  let urgencyAdjustment = 0;
  if (factors.isUrgent) {
    urgencyAdjustment = Math.round(baseRate * 0.05);
    explanation.push({
      title: 'Same-Day Priority Dispatch',
      description: 'Express mobilization within 2 hours',
      amount: urgencyAdjustment,
      type: 'positive'
    });
  }

  const rawTotal = baseRate + demandAdjustment + supplyAdjustment + distanceAdjustment + healthDiscount + urgencyAdjustment;
  
  // Apply Safety Bounds
  const minAllowed = Math.round(baseRate * config.minSurgeMultiplier);
  const maxAllowed = Math.round(baseRate * config.maxSurgeMultiplier);

  let finalRate = Math.max(minAllowed, Math.min(maxAllowed, rawTotal));
  const surgeMultiplier = Math.round((finalRate / baseRate) * 100) / 100;

  const validUntil = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

  return {
    machineId: machine.id,
    baseRatePerHour: baseRate,
    demandAdjustment,
    supplyAdjustment,
    distanceAdjustment,
    healthDiscount,
    urgencyAdjustment,
    quotedRatePerHour: finalRate,
    surgeMultiplier,
    explanation,
    validUntil
  };
}
