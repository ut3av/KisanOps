import { AgriCreditProfile } from '../types';

export interface CreditInputFactors {
  farmerId: string;
  paymentHistoryScore: number;       // 0 - 100 (35% weight)
  rentalHistoryScore: number;        // 0 - 100 (25% weight)
  repaymentReliabilityScore: number; // 0 - 100 (20% weight)
  farmActivityScore: number;         // 0 - 100 (10% weight)
  profileStabilityScore: number;     // 0 - 100 (10% weight)
  utilizedCredit?: number;
}

/**
 * AgriCredit Preliminary Deferred-Payment Scoring Engine
 * Outputs a 300 - 900 score and tiered deferred rental credit limit.
 */
export function evaluateAgriCredit(input: CreditInputFactors): AgriCreditProfile {
  const {
    farmerId,
    paymentHistoryScore,
    rentalHistoryScore,
    repaymentReliabilityScore,
    farmActivityScore,
    profileStabilityScore,
    utilizedCredit = 0
  } = input;

  // Calculate weighted 0-100 composite index
  const compositeIndex = (
    (paymentHistoryScore * 0.35) +
    (rentalHistoryScore * 0.25) +
    (repaymentReliabilityScore * 0.20) +
    (farmActivityScore * 0.10) +
    (profileStabilityScore * 0.10)
  );

  // Map 0-100 to 300-900 score
  const creditScore = Math.round(300 + (compositeIndex / 100) * 600);

  let ratingCategory: AgriCreditProfile['ratingCategory'] = 'Fair';
  let creditLimit = 3000;

  if (creditScore >= 750) {
    ratingCategory = 'Excellent';
    creditLimit = 10000;
  } else if (creditScore >= 650) {
    ratingCategory = 'Good';
    creditLimit = 8000;
  } else if (creditScore >= 550) {
    ratingCategory = 'Fair';
    creditLimit = 3000;
  } else {
    ratingCategory = 'Poor';
    creditLimit = 0;
  }

  const factors: AgriCreditProfile['factors'] = [
    {
      name: 'Payment History',
      weight: 35,
      score: paymentHistoryScore,
      status: paymentHistoryScore >= 85 ? 'Excellent' : paymentHistoryScore >= 70 ? 'Good' : 'Fair',
      description: '100% on-time settlement of previous machinery rentals'
    },
    {
      name: 'Rental History & Tenure',
      weight: 25,
      score: rentalHistoryScore,
      status: rentalHistoryScore >= 85 ? 'Excellent' : rentalHistoryScore >= 70 ? 'Good' : 'Fair',
      description: 'Consistent seasonal machinery utilization over 4+ seasons'
    },
    {
      name: 'Repayment Reliability',
      weight: 20,
      score: repaymentReliabilityScore,
      status: repaymentReliabilityScore >= 85 ? 'Excellent' : repaymentReliabilityScore >= 70 ? 'Good' : 'Fair',
      description: 'Zero reported machine disputes or delayed handovers'
    },
    {
      name: 'Farm Activity & Crop Stage',
      weight: 10,
      score: farmActivityScore,
      status: farmActivityScore >= 85 ? 'Excellent' : farmActivityScore >= 70 ? 'Good' : 'Fair',
      description: 'Verified 8-acre wheat cultivation in Sehore'
    },
    {
      name: 'Profile Stability & KYC',
      weight: 10,
      score: profileStabilityScore,
      status: profileStabilityScore >= 85 ? 'Excellent' : profileStabilityScore >= 70 ? 'Good' : 'Fair',
      description: 'Aadhaar & Land ownership credentials verified'
    }
  ];

  return {
    farmerId,
    creditScore,
    ratingCategory,
    creditLimit,
    utilizedCredit,
    availableCredit: Math.max(0, creditLimit - utilizedCredit),
    factors
  };
}
