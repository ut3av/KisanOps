import { describe, it, expect } from 'vitest';
import { calculateDynamicPrice } from '../pricingEngine';
import { evaluateAgriCredit } from '../creditEngine';
import { scoreMachineForFarmer } from '../recommendationEngine';
import { calculateDemandForecast, calculateHaversineDistance } from '../demandEngine';
import { calculateFinalInvoice } from '../billingEngine';
import { calculateMachineHealth } from '../maintenanceEngine';
import { SEEDED_MACHINES, SEEDED_FARM, SEEDED_BOOKINGS } from '../../data/seedData';

describe('KisanOps Intelligence Engines', () => {
  const harvester = SEEDED_MACHINES[0]; // John Deere W70 Harvester, baseRate: 980
  const tractor = SEEDED_MACHINES[1];   // Mahindra 575 DI, baseRate: 850
  const farm = SEEDED_FARM;             // 8.0 Acres Wheat in Bilkisganj, Sehore

  describe('1. Dynamic Pricing Engine', () => {
    it('calculates price quote with surge adjustments and safety multiplier caps', () => {
      const quote = calculateDynamicPrice(harvester, {
        demandIndex: 94, // Peak harvest demand
        shortageUnits: 2,
        distanceKm: 3.2,
      });

      expect(quote.baseRatePerHour).toBe(980);
      expect(quote.quotedRatePerHour).toBeGreaterThanOrEqual(980 * 0.80);
      expect(quote.quotedRatePerHour).toBeLessThanOrEqual(980 * 1.30);
      expect(quote.surgeMultiplier).toBeGreaterThanOrEqual(0.80);
      expect(quote.surgeMultiplier).toBeLessThanOrEqual(1.30);
      expect(quote.explanation.length).toBeGreaterThan(1);
    });

    it('applies prime health discount when machine health is >= 92%', () => {
      const quote = calculateDynamicPrice(harvester, {
        demandIndex: 50,
        shortageUnits: 0,
        distanceKm: 2.0,
      });

      const healthDiscountItem = quote.explanation.find(e => e.title.includes('Prime Fleet'));
      expect(healthDiscountItem).toBeDefined();
      expect(healthDiscountItem?.amount).toBe(-20);
    });
  });

  describe('2. AgriCredit Scoring Engine', () => {
    it('generates 300-900 score and assigns correct credit limit tier', () => {
      const profile = evaluateAgriCredit({
        farmerId: 'user-farmer-ramesh',
        paymentHistoryScore: 78,
        rentalHistoryScore: 72,
        repaymentReliabilityScore: 75,
        farmActivityScore: 70,
        profileStabilityScore: 72,
      });

      expect(profile.creditScore).toBeGreaterThanOrEqual(650);
      expect(profile.creditScore).toBeLessThan(750);
      expect(profile.creditScore).toBe(747);
      expect(profile.creditLimit).toBe(8000); // 650-749 tier
      expect(profile.ratingCategory).toBe('Good');
      expect(profile.factors.length).toBe(5);
    });

    it('assigns 10,000 credit limit for 750+ score', () => {
      const platinumProfile = evaluateAgriCredit({
        farmerId: 'user-farmer-top',
        paymentHistoryScore: 100,
        rentalHistoryScore: 98,
        repaymentReliabilityScore: 98,
        farmActivityScore: 95,
        profileStabilityScore: 95,
      });

      expect(platinumProfile.creditScore).toBeGreaterThanOrEqual(750);
      expect(platinumProfile.creditLimit).toBe(10000);
      expect(platinumProfile.ratingCategory).toBe('Excellent');
    });
  });

  describe('3. Smart Machine Recommendation Engine', () => {
    it('scores combine harvester higher than tractor for harvesting activity on wheat farm', () => {
      const harvesterScore = scoreMachineForFarmer(harvester, {
        farm,
        activity: 'HARVESTING',
      });

      const tractorScore = scoreMachineForFarmer(tractor, {
        farm,
        activity: 'HARVESTING',
      });

      expect(harvesterScore.matchScore).toBeGreaterThan(tractorScore.matchScore);
      expect(harvesterScore.matchScore).toBeGreaterThanOrEqual(90);
      expect(harvesterScore.reasons.length).toBeGreaterThan(0);
    });

    it('includes explainable reasons mentioning crop and proximity', () => {
      const result = scoreMachineForFarmer(harvester, {
        farm,
        activity: 'HARVESTING',
      });

      const hasCropReason = result.reasons.some(r => r.toLowerCase().includes('wheat'));
      const hasProximityReason = result.reasons.some(r => r.toLowerCase().includes('km'));

      expect(hasCropReason).toBe(true);
      expect(hasProximityReason).toBe(true);
    });
  });

  describe('4. Demand Forecasting & Haversine Distance', () => {
    it('identifies shortage when expected demand exceeds local available units', () => {
      const forecast = calculateDemandForecast({
        district: 'Sehore',
        cropName: 'Wheat',
        cropStage: 'Pre-harvest',
        machineCategory: 'HARVESTER',
        isHarvestSeason: true,
        upcomingStageIntensity: 1.0,
        historicalBookingCount: 45,
        currentActiveBookings: 8,
        favorableWeather: true,
        availableUnits: 3,
      });

      expect(forecast.demandIndex).toBeGreaterThanOrEqual(80);
      expect(forecast.demandLevel).toBe('VERY_HIGH');
      expect(forecast.shortageUnits).toBeGreaterThan(0);
    });

    it('computes accurate Haversine distance between Sehore and Bhopal CHC (~28-35km)', () => {
      const dist = calculateHaversineDistance(23.2030, 77.0844, 23.2599, 77.4126);
      expect(Math.round(dist)).toBeGreaterThanOrEqual(28);
      expect(Math.round(dist)).toBeLessThanOrEqual(38);
    });
  });

  describe('5. Automated Billing & Invoicing Engine', () => {
    it('calculates invoice total factoring telemetry operating hours variance', () => {
      const booking = SEEDED_BOOKINGS[0];
      const invoice = calculateFinalInvoice({
        booking,
        actualHours: 6.4, // Booked 6.0, actual 6.4
        fuelSurcharge: 240,
        transportCharge: 300,
        discountAmount: 100,
        platformFee: 100,
      });

      expect(invoice.actualHours).toBe(6.4);
      expect(invoice.baseRentalAmount).toBe(Math.round(6.4 * booking.hourlyRate));
      expect(invoice.taxGstAmount).toBeGreaterThan(0);
      expect(invoice.finalTotalAmount).toBeGreaterThan(invoice.baseRentalAmount);
      expect(invoice.items.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('6. Predictive Maintenance Engine', () => {
    it('computes multi-dimensional component health breakdown', () => {
      const health = calculateMachineHealth(harvester);
      expect(health.overallHealthScore).toBeGreaterThanOrEqual(0);
      expect(health.overallHealthScore).toBeLessThanOrEqual(100);
      expect(health.engineParametersScore).toBeGreaterThan(0);
      expect(health.fuelEfficiencyScore).toBeGreaterThan(0);
    });
  });
});
