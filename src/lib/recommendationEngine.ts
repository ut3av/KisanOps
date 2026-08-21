import { Machine, Farm, ActivityType, MachineRecommendationScore } from '../types';
import { calculateHaversineDistance } from './demandEngine';

export interface RecommendationContext {
  farm: Farm;
  activity: ActivityType;
  requiredDate?: string;
  maxBudgetPerHour?: number;
}

/**
 * Smart Machine Recommendation Engine
 * Explainable 7-factor scoring:
 * 25% Task/Crop Suitability
 * 20% Availability
 * 15% Distance
 * 15% Machine Health
 * 10% Price
 * 10% Reliability
 * 5% Operator Rating
 */
export function scoreMachineForFarmer(machine: Machine, context: RecommendationContext): MachineRecommendationScore {
  const { farm, activity } = context;
  const reasons: string[] = [];

  // 1. Task / Crop Suitability (25 pts)
  let taskSuitabilityScore = 0;
  if (machine.supportedActivities.includes(activity)) {
    taskSuitabilityScore += 18;
    reasons.push(`✓ Optimally configured for ${activity.replace('_', ' ').toLowerCase()}`);
  } else {
    taskSuitabilityScore += 6;
  }

  // Check farm size & crop fit
  if (machine.category === 'HARVESTER' && farm.crop.cropName.toLowerCase().includes('wheat')) {
    taskSuitabilityScore += 7;
    reasons.push(`✓ Excellent match for ${farm.crop.cropName} crop`);
  } else if (machine.category === 'TRACTOR') {
    taskSuitabilityScore += 7;
    reasons.push(`✓ Sized for ${farm.sizeAcres} acres farm`);
  } else {
    taskSuitabilityScore += 5;
  }

  // 2. Availability (20 pts)
  let availabilityScore = 0;
  if (machine.status === 'AVAILABLE') {
    availabilityScore = 20;
    reasons.push(`✓ Immediately available for booking`);
  } else if (machine.status === 'RESERVED') {
    availabilityScore = 12;
    reasons.push(`✓ Available from tomorrow`);
  } else {
    availabilityScore = 5;
  }

  // 3. Distance (15 pts)
  const distanceKm = Math.round(
    calculateHaversineDistance(farm.latitude, farm.longitude, machine.latitude, machine.longitude) * 10
  ) / 10;
  
  let distanceScore = 0;
  if (distanceKm <= 5) {
    distanceScore = 15;
    reasons.push(`✓ Nearby (${distanceKm} km from your farm)`);
  } else if (distanceKm <= 15) {
    distanceScore = 12;
    reasons.push(`✓ Moderate distance (${distanceKm} km away)`);
  } else if (distanceKm <= 35) {
    distanceScore = 8;
  } else {
    distanceScore = 4;
  }

  // 4. Machine Health (15 pts)
  let healthScoreComponent = 0;
  if (machine.healthScore >= 90) {
    healthScoreComponent = 15;
    reasons.push(`✓ Excellent health rating (${machine.healthScore}%)`);
  } else if (machine.healthScore >= 80) {
    healthScoreComponent = 12;
    reasons.push(`✓ Good operational health (${machine.healthScore}%)`);
  } else {
    healthScoreComponent = 7;
  }

  // 5. Price Competitiveness (10 pts)
  let priceScore = 0;
  if (machine.baseRatePerHour <= 850) {
    priceScore = 10;
    reasons.push(`✓ Highly competitive rate (₹${machine.baseRatePerHour}/hr)`);
  } else if (machine.baseRatePerHour <= 1000) {
    priceScore = 8;
  } else {
    priceScore = 6;
  }

  // 6. Reliability & Total Rentals (10 pts)
  let reliabilityScore = 0;
  if (machine.totalRentals >= 20 && machine.rating >= 4.7) {
    reliabilityScore = 10;
    reasons.push(`✓ High historical reliability (${machine.rating}★ over ${machine.totalRentals} rentals)`);
  } else {
    reliabilityScore = 8;
  }

  // 7. Operator Rating (5 pts)
  const operatorRating = machine.operatorRating || 4.8;
  const operatorRatingScore = Math.round((operatorRating / 5) * 5);

  const totalScore = Math.min(
    100,
    taskSuitabilityScore +
    availabilityScore +
    distanceScore +
    healthScoreComponent +
    priceScore +
    reliabilityScore +
    operatorRatingScore
  );

  return {
    machineId: machine.id,
    matchScore: totalScore,
    breakdown: {
      taskSuitabilityScore,
      availabilityScore,
      distanceScore,
      healthScore: healthScoreComponent,
      priceScore,
      reliabilityScore,
      operatorRatingScore,
    },
    reasons
  };
}
