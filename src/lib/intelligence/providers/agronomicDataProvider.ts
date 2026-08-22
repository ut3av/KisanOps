import { CropAgronomicProfile } from './types';

export interface AgronomicDataProvider {
  getCropProfile(cropName: string, season?: string): CropAgronomicProfile;
  estimateCropStage(cropName: string, sowingDate: string, accumulatedGdd?: number): {
    currentStage: string;
    stageIndex: number;
    totalStages: number;
    daysSinceSowing: number;
    estimatedHarvestWindow: { start: string; end: string };
    gddProgressPercent: number;
  };
}

export class ICARAgronomicDataProvider implements AgronomicDataProvider {
  private cropProfiles: Record<string, CropAgronomicProfile> = {
    Wheat: {
      cropName: 'Wheat',
      variety: 'Sharbati (C-306 / HI-1544)',
      season: 'Rabi',
      sowingWindowStart: '2024-11-01',
      sowingWindowEnd: '2024-11-30',
      totalDurationDays: 125,
      gddMaturityThreshold: 1850,
      baseTemperatureC: 5.0,
      optimalHarvestMoisturePercent: 12.0,
      averageYieldQuintalPerAcre: 18.5, // 18.5 quintals/acre for irrigated Sharbati
      benchmarkCostsPerAcre: {
        seeds: 1800,
        fertilizers: 3200,
        cropProtection: 1400,
        irrigation: 2200,
        labor: 3500,
        machineryRental: 4200, // Ploughing + Sowing + Harvesting + Threshing
        fuel: 1200,
        other: 800,
      },
    },
    Soybean: {
      cropName: 'Soybean',
      variety: 'JS 20-34 / JS 95-60',
      season: 'Kharif',
      sowingWindowStart: '2024-06-15',
      sowingWindowEnd: '2024-07-10',
      totalDurationDays: 95,
      gddMaturityThreshold: 1600,
      baseTemperatureC: 10.0,
      optimalHarvestMoisturePercent: 13.0,
      averageYieldQuintalPerAcre: 9.5,
      benchmarkCostsPerAcre: {
        seeds: 2800,
        fertilizers: 2400,
        cropProtection: 2100,
        irrigation: 800,
        labor: 3000,
        machineryRental: 3600,
        fuel: 1000,
        other: 700,
      },
    },
    Gram: {
      cropName: 'Gram / Chana',
      variety: 'JG 14 / RVG 202',
      season: 'Rabi',
      sowingWindowStart: '2024-10-15',
      sowingWindowEnd: '2024-11-15',
      totalDurationDays: 110,
      gddMaturityThreshold: 1550,
      baseTemperatureC: 8.0,
      optimalHarvestMoisturePercent: 11.5,
      averageYieldQuintalPerAcre: 8.0,
      benchmarkCostsPerAcre: {
        seeds: 2200,
        fertilizers: 1900,
        cropProtection: 1800,
        irrigation: 1400,
        labor: 2800,
        machineryRental: 3200,
        fuel: 900,
        other: 600,
      },
    },
  };

  getCropProfile(cropName: string, season = 'Rabi'): CropAgronomicProfile {
    const key = Object.keys(this.cropProfiles).find(k => k.toLowerCase() === cropName.toLowerCase()) || 'Wheat';
    return this.cropProfiles[key];
  }

  estimateCropStage(cropName: string, sowingDate: string, accumulatedGdd = 1720) {
    const profile = this.getCropProfile(cropName);
    const sowing = new Date(sowingDate || '2024-11-15').getTime();
    const now = Date.now();
    const daysSinceSowing = Math.max(1, Math.floor((now - sowing) / (1000 * 60 * 60 * 24)));

    const stages = [
      'Germination & Crown Root Initiation',
      'Tillering & Jointing',
      'Booting & Heading',
      'Flowering & Anthesis',
      'Milking & Dough Filling',
      'Maturity & Pre-Harvest Drying',
      'Harvest Ready Window',
    ];

    const fraction = Math.min(1.0, daysSinceSowing / profile.totalDurationDays);
    const stageIdx = Math.min(stages.length - 1, Math.floor(fraction * stages.length));

    const harvestStart = new Date(sowing + (profile.totalDurationDays - 5) * 86400000).toISOString().split('T')[0];
    const harvestEnd = new Date(sowing + (profile.totalDurationDays + 10) * 86400000).toISOString().split('T')[0];

    return {
      currentStage: stages[stageIdx],
      stageIndex: stageIdx,
      totalStages: stages.length,
      daysSinceSowing,
      estimatedHarvestWindow: { start: harvestStart, end: harvestEnd },
      gddProgressPercent: Math.min(100, Math.round((accumulatedGdd / profile.gddMaturityThreshold) * 100)),
    };
  }
}

export const defaultAgronomicProvider = new ICARAgronomicDataProvider();
