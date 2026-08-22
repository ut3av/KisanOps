import { FarmerRequirementIntent, FarmerContext, TaskCategory } from '../../types/voice';
import { FarmerRequirementIntentSchema } from './intent.schema';
import { parseAgriculturalDate } from '../../utils/date-parser';

export class IntentService {
  /**
   * Extracts structured intent from natural Hindi / Hinglish text, factoring in farmer profile context.
   */
  public extractIntent(
    text: string,
    context?: FarmerContext,
    existingIntent?: Partial<FarmerRequirementIntent>
  ): FarmerRequirementIntent {
    const raw = text.trim();
    const lower = raw.toLowerCase();

    // 1. Task category & machine type detection
    let taskCategory: TaskCategory | null = existingIntent?.task_category || null;
    let machineTypeRequired: string | null = existingIntent?.machine_type_required || null;

    if (
      lower.includes('कटाई') ||
      lower.includes('katai') ||
      lower.includes('harvest') ||
      lower.includes('काटना') ||
      lower.includes('katna') ||
      lower.includes('हार्वेस्टर') ||
      lower.includes('harvester')
    ) {
      taskCategory = 'harvesting';
      machineTypeRequired = machineTypeRequired || 'Harvester';
    } else if (
      lower.includes('जुताई') ||
      lower.includes('jotai') ||
      lower.includes('plough') ||
      lower.includes('plow') ||
      lower.includes('rotavator') ||
      lower.includes('रोटावेटर') ||
      lower.includes('ट्रैक्टर') ||
      lower.includes('tractor')
    ) {
      taskCategory = 'ploughing';
      machineTypeRequired = machineTypeRequired || (lower.includes('रोटावेटर') || lower.includes('rotavator') ? 'Rotavator' : 'Tractor');
    } else if (
      lower.includes('बुवाई') ||
      lower.includes('buwai') ||
      lower.includes('bovai') ||
      lower.includes('sowing') ||
      lower.includes('सीडर') ||
      lower.includes('seeder') ||
      lower.includes('ड्रिल') ||
      lower.includes('drill')
    ) {
      taskCategory = 'sowing';
      machineTypeRequired = machineTypeRequired || 'Seed Drill';
    } else if (
      lower.includes('छिड़काव') ||
      lower.includes('chhidkaav') ||
      lower.includes('spray') ||
      lower.includes('दवाई') ||
      lower.includes('dawai')
    ) {
      taskCategory = 'spraying';
      machineTypeRequired = machineTypeRequired || 'Boom Sprayer';
    } else if (
      lower.includes('मड़ाई') ||
      lower.includes('madai') ||
      lower.includes('thresh') ||
      lower.includes('थ्रेशर') ||
      lower.includes('thresher')
    ) {
      taskCategory = 'threshing';
      machineTypeRequired = machineTypeRequired || 'Thresher';
    } else if (
      lower.includes('ढुलाई') ||
      lower.includes('transport') ||
      lower.includes('ट्रॉली') ||
      lower.includes('trolley') ||
      lower.includes('trailer')
    ) {
      taskCategory = 'transport';
      machineTypeRequired = machineTypeRequired || 'Tipping Trailer';
    }

    // 2. Crop Detection
    let cropName: string | null = existingIntent?.crop_name || null;
    if (lower.includes('गेहूं') || lower.includes('gehu') || lower.includes('wheat')) {
      cropName = 'Wheat';
    } else if (lower.includes('सोयाबीन') || lower.includes('soybean')) {
      cropName = 'Soybean';
    } else if (lower.includes('धान') || lower.includes('dhan') || lower.includes('chawal') || lower.includes('paddy') || lower.includes('rice')) {
      cropName = 'Paddy';
    } else if (lower.includes('कपास') || lower.includes('kapaas') || lower.includes('cotton')) {
      cropName = 'Cotton';
    } else if (lower.includes('मक्का') || lower.includes('makka') || lower.includes('maize')) {
      cropName = 'Maize';
    } else if (lower.includes('चना') || lower.includes('chana') || lower.includes('gram')) {
      cropName = 'Gram';
    } else if (lower.includes('सरसों') || lower.includes('sarso') || lower.includes('mustard')) {
      cropName = 'Mustard';
    } else if (!cropName && context?.current_crop) {
      // Inherit from context if farm has a known registered crop
      cropName = context.current_crop;
    }

    // 3. Farm Acreage Detection
    let farmAcres: number | null = existingIntent?.farm_acres || null;
    const acreMatch = raw.match(/(\d+(\.\d+)?)\s*(एकड़|एकड|acre|acres|ekad|ekad)/i);
    const hindiNumberMatch = raw.match(/(एक|दो|तीन|चार|पांच|छह|सात|आठ|नौ|दस|ek|do|teen|char|panch|chhe|saat|aath|nau|das)\s*(एकड़|acre|ekad)/i);

    if (acreMatch) {
      farmAcres = parseFloat(acreMatch[1]);
    } else if (hindiNumberMatch) {
      const token = hindiNumberMatch[1].toLowerCase();
      const numMap: Record<string, number> = {
        'एक': 1, 'ek': 1,
        'दो': 2, 'do': 2,
        'तीन': 3, 'teen': 3,
        'चार': 4, 'char': 4,
        'पांच': 5, 'panch': 5,
        'छह': 6, 'chhe': 6,
        'सात': 7, 'saat': 7,
        'आठ': 8, 'aath': 8,
        'नौ': 9, 'nau': 9,
        'दस': 10, 'das': 10,
      };
      if (numMap[token]) farmAcres = numMap[token];
    } else if (!farmAcres && context?.farm_acres && context.farm_acres > 0) {
      farmAcres = context.farm_acres;
    }

    // 4. Date Detection (using Asia/Kolkata date parser)
    let targetDate: string | null = existingIntent?.target_date || parseAgriculturalDate(raw);

    // 5. Location Detection
    let targetLocation: string | null = existingIntent?.target_location || null;
    const knownLocations = [
      'Sehore', 'सीहोर', 'Indore', 'इंदौर', 'Bhopal', 'भोपाल', 'Ujjain', 'उज्जैन',
      'Bilkisganj', 'बिल्किसगंज', 'Sanwer', 'सांवेर', 'Hoshangabad', 'होशंगाबाद',
      'Dewas', 'देवास', 'Vidisha', 'विदिशा', 'Rajgarh', 'राजगढ़', 'Ludhiana', 'लुधियाना'
    ];

    for (const loc of knownLocations) {
      if (raw.toLowerCase().includes(loc.toLowerCase())) {
        targetLocation = loc;
        break;
      }
    }

    // Check if farmer referred to their registered farm ("मेरे खेत पर", "मेरे गांव में")
    if (
      !targetLocation &&
      (lower.includes('मेरे खेत') || lower.includes('mere khet') || lower.includes('गांव') || lower.includes('gaao') || lower.includes('here'))
    ) {
      targetLocation = context?.district || context?.village || context?.location || null;
    }

    if (!targetLocation && context?.district) {
      targetLocation = context.district;
    }

    // 6. Radius Detection
    let searchRadiusKm: number | null = existingIntent?.search_radius_km || null;
    const radiusMatch = raw.match(/(\d+)\s*(km|किमी|किलोमीटर|kilometer|kms)/i);
    if (radiusMatch) {
      searchRadiusKm = parseInt(radiusMatch[1], 10);
    } else if (context?.default_radius_km) {
      searchRadiusKm = context.default_radius_km;
    }

    // 7. Urgency detection
    let urgency: 'low' | 'normal' | 'urgent' | null = existingIntent?.urgency || null;
    if (
      lower.includes('जल्दी') ||
      lower.includes('jaldi') ||
      lower.includes('urgent') ||
      lower.includes('तुरंत') ||
      lower.includes('turant') ||
      lower.includes('emergency') ||
      lower.includes('barish') ||
      lower.includes('बारिश')
    ) {
      urgency = 'urgent';
    }

    const constructed: FarmerRequirementIntent = {
      task_category: taskCategory,
      crop_name: cropName,
      farm_acres: farmAcres,
      target_date: targetDate,
      target_location: targetLocation,
      machine_type_required: machineTypeRequired,
      urgency: urgency || 'normal',
      additional_requirements: null,
      search_radius_km: searchRadiusKm || 25,
    };

    // Safe Zod validation
    const parsed = FarmerRequirementIntentSchema.safeParse(constructed);
    if (parsed.success) {
      return parsed.data;
    }

    return constructed;
  }

  /**
   * Checks if farmer has given a positive voice confirmation (e.g. "हाँ", "कर दो", "बुक कर दो", "yes")
   */
  public isPositiveConfirmation(text: string): boolean {
    const clean = text.trim().toLowerCase();
    const positiveTokens = [
      'हाँ', 'haan', 'ha', 'haa', 'yes', 'confirm', 'कर दो', 'kardo', 'kar do',
      'बुक कर दो', 'book kardo', 'book kar do', 'theek hai', 'पक्की कर दो',
      'pakki kar do', 'sahi hai', 'le lo', 'book karo'
    ];

    return positiveTokens.some(token => clean.includes(token));
  }

  /**
   * Checks if farmer has given a negative voice cancellation (e.g. "नहीं", "रहने दो", "cancel")
   */
  public isNegativeCancellation(text: string): boolean {
    const clean = text.trim().toLowerCase();
    const negativeTokens = [
      'नहीं', 'nahi', 'na', 'no', 'cancel', 'रहने दो', 'rahne do', 'mat karo', 'रद्द'
    ];

    return negativeTokens.some(token => clean.includes(token));
  }

  /**
   * Identifies any critical fields still missing before a machine search can be finalized.
   */
  public identifyMissingFields(intent: FarmerRequirementIntent): string[] {
    const missing: string[] = [];

    if (!intent.task_category && !intent.machine_type_required) {
      missing.push('task_category');
    }
    if (!intent.target_date) {
      missing.push('target_date');
    }
    if (!intent.target_location) {
      missing.push('target_location');
    }
    if (!intent.farm_acres) {
      missing.push('farm_acres');
    }

    return missing;
  }
}
