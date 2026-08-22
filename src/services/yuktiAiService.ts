import { AppState } from '../store/kisanOpsStore';
import {
  Booking,
  Machine,
  DemandForecast,
  MachineAllocationRecommendation,
  PredictiveMaintenanceAlert,
  AgriCreditProfile,
  UserRole,
  ActivityType,
} from '../types';
import { scoreMachineForFarmer } from '../lib/recommendationEngine';
import { calculateDynamicPrice } from '../lib/pricingEngine';
import { calculateMachineHealth } from '../lib/maintenanceEngine';

export type YuktiLanguage = 'hi' | 'en' | 'hinglish';

export interface YuktiActionCardData {
  type: 
    | 'BOOK_MACHINE'
    | 'DEMAND_REALLOCATION'
    | 'MAINTENANCE_TRIAGE'
    | 'AGRICREDIT_BOOSTER'
    | 'AGRONOMY_ADVISORY'
    | 'TRACK_JOB'
    | 'NAVIGATE';
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'emerald' | 'amber' | 'sky' | 'rose' | 'purple';
  payload: any;
}

export interface YuktiMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  language?: YuktiLanguage;
  actionCard?: YuktiActionCardData;
  suggestedReplies?: string[];
  audioBase64?: string;
  isProcessing?: boolean;
}

/**
 * Intelligent Multi-Domain AI Processor for KisanOps (Yukti AI)
 */
export async function processYuktiQuery(
  userQuery: string,
  state: AppState,
  preferredLang: YuktiLanguage = 'hi',
  activeRoute: string = '/'
): Promise<YuktiMessage> {
  const queryLower = userQuery.toLowerCase().trim();
  const role = state.selectedRole;

  // Try fetching from backend API if available
  try {
    const backendResponse = await fetchBackendYukti(userQuery, role);
    if (backendResponse && backendResponse.assistant_response_text) {
      return {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: backendResponse.assistant_response_text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: (backendResponse.language_detected as YuktiLanguage) || preferredLang,
        audioBase64: backendResponse.audio_base64,
        actionCard: backendResponse.action_card,
        suggestedReplies: backendResponse.suggested_replies || getDefaultSuggestions(role),
      };
    }
  } catch (err) {
    // Graceful fallback to client-side neural/rule engine
  }

  // Client-Side Intelligence Engine
  return generateClientIntelligenceResponse(userQuery, queryLower, state, preferredLang);
}

/**
 * Helper to query backend FastAPI endpoint if alive
 */
async function fetchBackendYukti(text: string, role: UserRole): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout for seamless UI

  try {
    const response = await fetch('http://localhost:8000/api/voice/parse-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    clearTimeout(timeoutId);
  }
  return null;
}

/**
 * Client-Side Semantic Parser & Response Generator
 */
function generateClientIntelligenceResponse(
  rawQuery: string,
  query: string,
  state: AppState,
  preferredLang: YuktiLanguage
): YuktiMessage {
  const isHindi = preferredLang === 'hi' || containsHindiOrHinglish(query);
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. INTENT: BOOKING / EQUIPMENT SEARCH
  if (
    query.includes('book') ||
    query.includes('rent') ||
    query.includes('chahiye') ||
    query.includes('kiraya') ||
    query.includes('harvester') ||
    query.includes('katai') ||
    query.includes('tractor') ||
    query.includes('rotavator') ||
    query.includes('seeder') ||
    query.includes('sprayer') ||
    query.includes('jotai') ||
    query.includes('buwai') ||
    query.includes('मशीन') ||
    query.includes('हार्वेस्टर') ||
    query.includes('ट्रैक्टर') ||
    query.includes('रोटावेटर')
  ) {
    return handleBookingIntent(query, state, isHindi, nowStr);
  }

  // 2. INTENT: DEMAND FORECAST & REALLOCATION (CHC / Admin)
  if (
    query.includes('demand') ||
    query.includes('shortage') ||
    query.includes('surge') ||
    query.includes('reallocate') ||
    query.includes('transfer') ||
    query.includes('maang') ||
    query.includes('kami') ||
    query.includes('sehore') ||
    query.includes('bhopal') ||
    query.includes('raisen') ||
    query.includes('forecast') ||
    query.includes('मांग') ||
    query.includes('कमी')
  ) {
    return handleDemandIntent(state, isHindi, nowStr);
  }

  // 3. INTENT: FLEET TELEMATICS & FUEL ANOMALY (CHC / Operator)
  if (
    query.includes('telematics') ||
    query.includes('fuel') ||
    query.includes('diesel') ||
    query.includes('anomaly') ||
    query.includes('health') ||
    query.includes('maintenance') ||
    query.includes('alert') ||
    query.includes('service') ||
    query.includes('kharab') ||
    query.includes('sensor') ||
    query.includes('डीजल') ||
    query.includes('माइलेज') ||
    query.includes('अलर्ट') ||
    query.includes('मेंटेनेंस')
  ) {
    return handleTelematicsIntent(state, isHindi, nowStr);
  }

  // 4. INTENT: AGRICREDIT & FINANCING
  if (
    query.includes('credit') ||
    query.includes('loan') ||
    query.includes('score') ||
    query.includes('limit') ||
    query.includes('deferred') ||
    query.includes('paisa') ||
    query.includes('subsidy') ||
    query.includes('smam') ||
    query.includes('kusum') ||
    query.includes('क्रेडिट') ||
    query.includes('सब्सिडी') ||
    query.includes('लोन')
  ) {
    return handleCreditIntent(state, isHindi, nowStr);
  }

  // 5. INTENT: AGRONOMY & CROP ADVISORY
  if (
    query.includes('crop') ||
    query.includes('wheat') ||
    query.includes('soybean') ||
    query.includes('gehu') ||
    query.includes('soil') ||
    query.includes('fertilizer') ||
    query.includes('khad') ||
    query.includes('pest') ||
    query.includes('weather') ||
    query.includes('mausam') ||
    query.includes('गेहूं') ||
    query.includes('खाद') ||
    query.includes('फसल')
  ) {
    return handleAgronomyIntent(state, isHindi, nowStr);
  }

  // 6. INTENT: TRACK ACTIVE MACHINE / JOB
  if (
    query.includes('track') ||
    query.includes('location') ||
    query.includes('kahan hai') ||
    query.includes('where is') ||
    query.includes('status') ||
    query.includes('raju') ||
    query.includes('चालक') ||
    query.includes('कहाँ') ||
    query.includes('ट्रैक')
  ) {
    return handleTrackingIntent(state, isHindi, nowStr);
  }

  // 7. DEFAULT CONVERSATIONAL RESPONSE
  return handleDefaultGreeting(state, isHindi, nowStr);
}

// -------------------------------------------------------------
// Intent Handlers
// -------------------------------------------------------------

function handleBookingIntent(query: string, state: AppState, isHindi: boolean, nowStr: string): YuktiMessage {
  // Determine activity required
  let activity: ActivityType = 'HARVESTING';
  let machineCategory = 'HARVESTER';
  if (query.includes('rotavator') || query.includes('jotai') || query.includes('plough') || query.includes('tilling') || query.includes('जुताई') || query.includes('रोटावेटर')) {
    activity = 'SOIL_PREPARATION';
    machineCategory = 'ROTAVATOR';
  } else if (query.includes('sow') || query.includes('drill') || query.includes('buwai') || query.includes('बुवाई') || query.includes('सीड ड्रिल')) {
    activity = 'SOWING';
    machineCategory = 'SEEDER';
  } else if (query.includes('spray') || query.includes('chhidkaw') || query.includes('छिड़काव')) {
    activity = 'SPRAYING';
    machineCategory = 'SPRAYER';
  }

  // Find best machine in state
  const availableMachines = state.machines.filter((m: Machine) => m.status === 'AVAILABLE' || m.status === 'RESERVED');
  const matched = availableMachines.find((m: Machine) => m.category === machineCategory) || availableMachines[0] || state.machines[0];

  const matchScoreResult = scoreMachineForFarmer(matched, {
    farm: state.farm,
    activity,
  });

  const priceQuote = calculateDynamicPrice(matched, {
    demandIndex: 94,
    shortageUnits: 2,
    distanceKm: matched.distanceKm || 3.2,
  });

  const acres = state.farm.sizeAcres || 8;
  const acresPerHour = matched.powerHp > 60 ? 1.5 : 1.2;
  const estHours = Math.round((acres / acresPerHour) * 10) / 10;
  const estimatedTotal = priceQuote.quotedRatePerHour * estHours;

  const hindiText = `मैंने आपके ${acres} एकड़ ${state.farm.crop.cropName} के लिए सर्वोत्तम मशीन ढूंढ ली है: **${matched.brand} ${matched.model}**।\n\n• **मैच स्कोर**: ${matchScoreResult.matchScore}/100\n• **किराया दर**: ₹${matched.baseRatePerHour}/घंटा (डायनामिक रेट ₹${priceQuote.quotedRatePerHour}/घंटा)\n• **अनुमानित कुल लागत**: ₹${estimatedTotal.toLocaleString('en-IN')}\n• **AgriCredit पात्रता**: आप बाद में भुगतान कर सकते हैं (Post-harvest)!`;

  const engText = `I found the best matching equipment for your ${acres}-acre ${state.farm.crop.cropName} farm: **${matched.brand} ${matched.model}**.\n\n• **Match Score**: ${matchScoreResult.matchScore}/100\n• **Hourly Rate**: ₹${matched.baseRatePerHour}/hr (Dynamic rate ₹${priceQuote.quotedRatePerHour}/hr)\n• **Estimated Total**: ₹${estimatedTotal.toLocaleString('en-IN')}\n• **AgriCredit Eligible**: Deferred payment allowed (Pay after harvest)!`;

  return {
    id: `msg-bk-${Date.now()}`,
    sender: 'assistant',
    text: isHindi ? hindiText : engText,
    timestamp: nowStr,
    language: isHindi ? 'hi' : 'en',
    actionCard: {
      type: 'BOOK_MACHINE',
      title: `${matched.brand} ${matched.model}`,
      subtitle: `${matched.powerHp} HP • ${matched.chcName} (${matched.distanceKm || 3.2} km away)`,
      badge: `${matchScoreResult.matchScore}% Match`,
      badgeColor: 'emerald',
      payload: {
        machine: matched,
        activity,
        acres,
        estimatedHours: estHours,
        estimatedTotal,
        priceQuote,
        matchScoreResult,
      },
    },
    suggestedReplies: [
      isHindi ? 'हाँ, तुरंत बुक करें (Confirm)' : 'Yes, Confirm Booking',
      isHindi ? 'AgriCredit सीमा चेक करें' : 'Check AgriCredit Limit',
      isHindi ? 'दूसरी मशीन दिखाएं' : 'Show alternative machines',
    ],
  };
}

function handleDemandIntent(state: AppState, isHindi: boolean, nowStr: string): YuktiMessage {
  const sehoreForecast = state.demandForecasts.find((df: DemandForecast) => df.district === 'Sehore' && df.shortageUnits > 0);
  const recommendedAlloc = state.allocations.find((a: MachineAllocationRecommendation) => a.status === 'RECOMMENDED') || state.allocations[0];

  const shortage = sehoreForecast?.shortageUnits || 2;
  const demandIndex = sehoreForecast?.demandIndex || 94;

  const hindiText = `📊 **मांग विश्लेषण अलर्ट (Sehore Wheat Belt)**:\n\nसीहोर क्षेत्र में गेहूं कटाई के चरम मौसम के कारण कंबाइन हार्वेस्टर की मांग में **+34% की भारी वृद्धि** दर्ज की गई है।\n\n• **अनुमानित मांग**: 5 यूनिट\n• **वर्तमान उपलब्धता**: 3 यूनिट\n• **कमी (Shortage)**: **${shortage} यूनिट**\n• **एआई सुझाव**: ग्रीनफील्ड्स भोपाल हब से 2 अतिरिक्त कंबाइन हार्वेस्टर तुरंत सीहोर हब में री-एलोकेट करें।`;

  const engText = `📊 **Demand Intelligence Alert (Sehore Wheat Belt)**:\n\nA harvest demand surge of **+34%** has been detected for Combine Harvesters in Sehore district.\n\n• **Expected Demand**: 5 Units\n• **Currently Available**: 3 Units\n• **Shortage**: **${shortage} Units**\n• **AI Recommendation**: Reallocate 2 idle Combine Harvesters from GreenFields Bhopal Hub to Sehore Agri Centre.`;

  return {
    id: `msg-demand-${Date.now()}`,
    sender: 'assistant',
    text: isHindi ? hindiText : engText,
    timestamp: nowStr,
    language: isHindi ? 'hi' : 'en',
    actionCard: {
      type: 'DEMAND_REALLOCATION',
      title: 'Harvester Reallocation: Bhopal ➔ Sehore',
      subtitle: `Surge Index: ${demandIndex}/100 • Transit Time: ~45 mins`,
      badge: `Shortage: ${shortage} Units`,
      badgeColor: 'amber',
      payload: {
        forecast: sehoreForecast,
        allocation: recommendedAlloc,
        sourceHub: 'GreenFields Bhopal CHC',
        targetHub: 'Sehore Agri Centre',
      },
    },
    suggestedReplies: [
      isHindi ? 'री-एलोकेशन स्वीकृत करें (Approve)' : 'Approve Reallocation',
      isHindi ? 'पूरा मांग मैट्रिक्स देखें' : 'View Full Demand Matrix',
      isHindi ? 'फ्लीट की लाइव स्थिति देखें' : 'Check Fleet Live Telematics',
    ],
  };
}

function handleTelematicsIntent(state: AppState, isHindi: boolean, nowStr: string): YuktiMessage {
  const fuelAlert = state.maintenanceAlerts.find((a: PredictiveMaintenanceAlert) => a.alertType === 'FUEL_ANOMALY' && !a.isResolved) || state.maintenanceAlerts[0];
  const targetMachine = state.machines.find((m: Machine) => m.id === fuelAlert?.machineId) || state.machines[0];
  const healthBreakdown = calculateMachineHealth(targetMachine);

  const hindiText = `⚠️ **फ्लीट टेलीमैटिक्स व प्रेडिक्टिव मेंटेनेंस अलर्ट**:\n\nमशीन **${fuelAlert?.machineIdentifier || 'JD-HARV-07'}** (${fuelAlert?.machineModel || 'John Deere W70'}) के लाइव सेंसर टेलीमैटिक्स में डीजल खपत असामान्यता पाई गई है:\n\n• **डीजल बर्न रेट**: +17% (8.4 L/h बनाम 7.2 L/h बेसलाइन)\n• **इंजन तापमान**: 92°C (सामान्य)\n• **स्वास्थ्य स्कोर**: ${healthBreakdown.overallHealthScore}%\n• **सुझाव**: फ्यूल इंजेक्शन नोजल व एयर फिल्टर की 24 घंटे में जांच करें।`;

  const engText = `⚠️ **Fleet Telematics & Predictive Alert**:\n\nLive CAN-Bus telemetry on machine **${fuelAlert?.machineIdentifier || 'JD-HARV-07'}** (${fuelAlert?.machineModel || 'John Deere W70'}) indicates a fuel burn anomaly:\n\n• **Fuel Burn Rate**: +17% above baseline (8.4 L/h vs 7.2 L/h)\n• **Engine Temp**: 92°C (Nominal)\n• **Health Score**: ${healthBreakdown.overallHealthScore}%\n• **Action Required**: Inspect fuel injection nozzle and air filter within 24 hours.`;

  return {
    id: `msg-telematics-${Date.now()}`,
    sender: 'assistant',
    text: isHindi ? hindiText : engText,
    timestamp: nowStr,
    language: isHindi ? 'hi' : 'en',
    actionCard: {
      type: 'MAINTENANCE_TRIAGE',
      title: `${fuelAlert?.machineIdentifier || 'JD-HARV-07'} Fuel Anomaly`,
      subtitle: `Burn Rate: 8.4 L/h (+17%) • Urgency: 24 Hours`,
      badge: 'High Severity',
      badgeColor: 'rose',
      payload: {
        alert: fuelAlert,
        machine: targetMachine,
        health: healthBreakdown,
      },
    },
    suggestedReplies: [
      isHindi ? 'मैकेनिक इंस्पेक्शन शेड्यूल करें' : 'Schedule Mechanic Inspection',
      isHindi ? 'अलर्ट रीसॉल्व करें (Mark Resolved)' : 'Mark Alert Resolved',
      isHindi ? 'लाइव टेलीमैटिक्स गॉज देखें' : 'View Live Telematics Gauges',
    ],
  };
}

function handleCreditIntent(state: AppState, isHindi: boolean, nowStr: string): YuktiMessage {
  const credit = state.agriCredit;
  const score = credit.creditScore || 780;
  const limit = credit.creditLimit || 8000;
  const available = credit.availableCredit || 4200;

  const hindiText = `💳 **AgriCredit एवं वित्तीय सहायता (Kisan Credit Profile)**:\n\nश्री रमेश कुमार, आपका किसान क्रेडिट प्रोफाइल उत्कृष्ट स्थिति में है:\n\n• **एग्रीक्रेडिट स्कोर**: **${score} / 900** (${credit.ratingCategory})\n• **अनुमोदित क्रेडिट लिमिट**: ₹${limit.toLocaleString('en-IN')}\n• **उपलब्ध सीमा**: ₹${available.toLocaleString('en-IN')}\n• **सरकारी सब्सिडी सहायता**: SMAM योजना के तहत कृषि यंत्रों पर 40% से 50% तक की सब्सिडी उपलब्ध है।\n• **सुझाव**: समय पर रेंटल भुगतान से आपकी लिमिट बढ़कर ₹10,000 हो जाएगी!`;

  const engText = `💳 **AgriCredit & Financial Intelligence**:\n\nFarmer Profile: Ramesh Kumar\n\n• **AgriCredit Score**: **${score} / 900** (${credit.ratingCategory})\n• **Approved Credit Limit**: ₹${limit.toLocaleString('en-IN')}\n• **Available Balance**: ₹${available.toLocaleString('en-IN')}\n• **Govt Subsidy Guidance**: Under the SMAM (Sub-Mission on Agricultural Mechanization) scheme, custom hiring machinery qualifies for 40% - 50% capital subsidy.\n• **Tip**: 1 more timely harvest rental payment will boost your limit to ₹10,000!`;

  return {
    id: `msg-credit-${Date.now()}`,
    sender: 'assistant',
    text: isHindi ? hindiText : engText,
    timestamp: nowStr,
    language: isHindi ? 'hi' : 'en',
    actionCard: {
      type: 'AGRICREDIT_BOOSTER',
      title: `AgriCredit Score: ${score} / 900`,
      subtitle: `Available Deferred Limit: ₹${available.toLocaleString('en-IN')}`,
      badge: credit.ratingCategory,
      badgeColor: 'emerald',
      payload: {
        credit,
        score,
        limit,
        available,
      },
    },
    suggestedReplies: [
      isHindi ? 'क्रेडिट स्कोर रिपोर्ट देखें' : 'View Full Credit Report',
      isHindi ? 'SMAM सब्सिडी गाइड डाउनलोड करें' : 'Download SMAM Subsidy Guide',
      isHindi ? 'कटाई के लिए हार्वेस्टर बुक करें' : 'Book Harvester with AgriCredit',
    ],
  };
}

function handleAgronomyIntent(state: AppState, isHindi: boolean, nowStr: string): YuktiMessage {
  const farm = state.farm;
  const crop = farm.crop;

  const hindiText = `🌾 **कृषि सलाह व फसल चक्र (Agronomy Advisory)**:\n\n• **खेत का विवरण**: ${farm.sizeAcres} एकड़ • गांव: ${farm.village}, जिला: ${farm.district}\n• **फसल**: ${crop.cropName} (रबी 2026)\n• **अवस्था (Stage)**: ${crop.cropStage} (कटाई योग्य)\n• **मौसम पूर्वानुमान**: अगले 4 दिन सीहोर में मौसम शुष्क व धूप वाला रहेगा (तापमान 28°C - 32°C)।\n• **एआई सलाह**: अनुकूल मौसम का लाभ उठाकर अगले 48 घंटों में कंबाइन हार्वेस्टर से कटाई पूर्ण करें जिससे दाने की नमी 12-14% बनी रहे।`;

  const engText = `🌾 **Crop & Agronomic Advisory**:\n\n• **Farm Parcel**: ${farm.sizeAcres} Acres • Village: ${farm.village}, District: ${farm.district}\n• **Crop**: ${crop.cropName} (Rabi 2026 Season)\n• **Current Stage**: ${crop.cropStage} (Optimal for Harvesting)\n• **Weather Forecast**: Next 4 days clear & dry in Sehore (28°C - 32°C).\n• **AI Recommendation**: Utilize this dry weather window to harvest with a Combine Harvester in the next 48 hours for optimal 12-14% grain moisture retention.`;

  return {
    id: `msg-agronomy-${Date.now()}`,
    sender: 'assistant',
    text: isHindi ? hindiText : engText,
    timestamp: nowStr,
    language: isHindi ? 'hi' : 'en',
    actionCard: {
      type: 'AGRONOMY_ADVISORY',
      title: `${crop.cropName} Harvest Advisory`,
      subtitle: `Stage: ${crop.cropStage} • Soil: Medium Black Loam`,
      badge: 'Weather Optimal',
      badgeColor: 'emerald',
      payload: {
        crop,
        farm,
      },
    },
    suggestedReplies: [
      isHindi ? 'तुरंत हार्वेस्टर बुक करें' : 'Book Combine Harvester Now',
      isHindi ? 'मिट्टी की उर्वरता रिपोर्ट देखें' : 'View Soil Health Card',
      isHindi ? 'मौसम पूर्वानुमान अपडेट करें' : 'Check 7-Day Weather',
    ],
  };
}

function handleTrackingIntent(state: AppState, isHindi: boolean, nowStr: string): YuktiMessage {
  const activeBooking = state.bookings.find((b: Booking) => b.status === 'IN_PROGRESS' || b.status === 'DISPATCHED') || state.bookings[0];
  const machine = state.machines.find((m: Machine) => m.id === activeBooking?.machineId) || state.machines[0];
  const telemetry = state.currentTelemetry[machine.id];

  const hindiText = `📍 **लाइव मशीन ट्रैकिंग व ऑपरेटर स्टेटस**:\n\n• **मशीन**: ${machine.brand} ${machine.model} (${machine.identifier})\n• **स्थिति**: ${activeBooking?.status || 'IN_PROGRESS'}\n• **ऑपरेटर**: राजू वर्मा (4.9★, 1,420 घंटे अनुभव)\n• **वर्तमान स्थान**: बिलकिसगंज रोड (खेत से 1.8 किमी दूरी)\n• **अनुमानित आगमन (ETA)**: 12 मिनट\n• **स्पीड**: ${telemetry?.speedKmh || 14.2} km/h • **डीजल स्तर**: ${telemetry?.fuelLevelPercent || 78}%`;

  const engText = `📍 **Live Equipment Tracking & Operator Status**:\n\n• **Machine**: ${machine.brand} ${machine.model} (${machine.identifier})\n• **Job Status**: ${activeBooking?.status || 'IN_PROGRESS'}\n• **Assigned Operator**: Raju Verma (4.9★, 1,420 hrs experience)\n• **Live Location**: Bilkisganj Road (1.8 km from farm boundary)\n• **Estimated Arrival (ETA)**: ~12 minutes\n• **Speed**: ${telemetry?.speedKmh || 14.2} km/h • **Fuel Level**: ${telemetry?.fuelLevelPercent || 78}%`;

  return {
    id: `msg-track-${Date.now()}`,
    sender: 'assistant',
    text: isHindi ? hindiText : engText,
    timestamp: nowStr,
    language: isHindi ? 'hi' : 'en',
    actionCard: {
      type: 'TRACK_JOB',
      title: `${machine.brand} ${machine.model}`,
      subtitle: `Operator: Raju Verma • ETA: 12 Mins`,
      badge: 'Live GPS Active',
      badgeColor: 'sky',
      payload: {
        booking: activeBooking,
        machine,
        telemetry,
      },
    },
    suggestedReplies: [
      isHindi ? 'ऑपरेटर को कॉल करें' : 'Call Operator',
      isHindi ? 'लाइव मैप पर देखें' : 'View on Live Map',
      isHindi ? 'डिजिटल रेंटल रसीद देखें' : 'View Digital Receipt',
    ],
  };
}

function handleDefaultGreeting(state: AppState, isHindi: boolean, nowStr: string): YuktiMessage {
  const role = state.selectedRole;
  const userName = state.currentUser.fullName;

  let hindiText = '';
  let engText = '';

  if (role === 'FARMER') {
    hindiText = `नमस्ते **${userName} जी**! 🙏 मैं **युक्ति AI (Yukti AI)**, आपका स्मार्ट कृषि साथी हूँ।\n\nमैं आपकी किस प्रकार सहायता कर सकता हूँ?\n• **मशीन बुकिंग**: बोलकर हार्वेस्टर, ट्रैक्टर, रोटावेटर बुक करें\n• **AgriCredit**: अपनी क्रेडिट सीमा व सब्सिडी पात्रता जांचें\n• **फसल व मौसम सलाह**: गेहूं कटाई का सटीक समय जानें\n• **लाइव ट्रैकिंग**: बुक की गई मशीन का जीपीएस स्थान ट्रैक करें`;
    engText = `Namaste **${userName}**! 🙏 I am **Yukti AI**, your intelligent agricultural co-pilot.\n\nHow can I help you today?\n• **Voice Booking**: Book harvesters, tractors, or seed drills in 1-click\n• **AgriCredit**: Check your credit limit and SMAM subsidy eligibility\n• **Crop & Weather**: Get stage-specific harvest and agronomy advice\n• **Live Tracking**: Track your assigned machinery in real-time`;
  } else if (role === 'CHC_MANAGER') {
    hindiText = `नमस्ते **${userName} जी**! 🏢 मैं **युक्ति AI**, आपका हब ऑपरेशन्स को-पायलट हूँ।\n\n• **मांग पूर्वानुमान**: सीहोर व भोपाल में सरप्लस/शॉर्टेज री-एलोकेशन\n• **फ्लीट टेलीमैटिक्स**: 24 मशीनों की लाइव सेंसर स्थिति व डीजल अलर्ट\n• **ऑपरेटर असाइनमेंट**: न्यूनतम दूरी पर त्वरित मशीन डिस्पैच`;
    engText = `Hello **${userName}**! 🏢 I am **Yukti AI**, your CHC Operations Hub Co-Pilot.\n\n• **Demand Forecasting**: Cross-hub reallocation & shortage alerts\n• **Fleet Telematics**: Live sensor monitoring & fuel anomaly triage\n• **Smart Dispatch**: Automated operator & route optimization`;
  } else {
    hindiText = `नमस्ते! मैं **युक्ति AI** हूँ। आप मुझसे कृषि यंत्र, मांग पूर्वानुमान, टेलीमैटिक्स, या किसान क्रेडिट के बारे में कोई भी प्रश्न पूछ सकते हैं।`;
    engText = `Hello! I am **Yukti AI**. Ask me anything about farm machinery booking, regional demand forecasting, live telematics, or AgriCredit.`;
  }

  return {
    id: `msg-greet-${Date.now()}`,
    sender: 'assistant',
    text: isHindi ? hindiText : engText,
    timestamp: nowStr,
    language: isHindi ? 'hi' : 'en',
    suggestedReplies: getDefaultSuggestions(role, isHindi),
  };
}

export function getDefaultSuggestions(role: UserRole, isHindi: boolean = true): string[] {
  if (role === 'FARMER') {
    return isHindi
      ? [
          '🌾 8 एकड़ गेहूं के लिए हार्वेस्टर बुक करें',
          '💳 मेरी AgriCredit लिमिट कितनी है?',
          '📍 मेरी बुक की गई मशीन कहाँ है?',
          '🌱 कटाई के लिए मौसम पूर्वानुमान क्या है?',
        ]
      : [
          '🌾 Book a harvester for 8 acres wheat',
          '💳 What is my AgriCredit limit?',
          '📍 Where is my booked machine right now?',
          '🌱 Weather forecast for harvest',
        ];
  }

  if (role === 'CHC_MANAGER') {
    return isHindi
      ? [
          '📊 सीहोर में हार्वेस्टर की कमी का विश्लेषण',
          '⚠️ फ्लीट में डीजल खपत या सेंसर अलर्ट',
          '🔄 भोपाल से 2 हार्वेस्टर सीहोर ट्रांसफर करें',
          '📈 आज का फ्लीट यूटिलाइजेशन व रेवेन्यू',
        ]
      : [
          '📊 Analyze harvester shortage in Sehore',
          '⚠️ Any fuel or engine anomalies in fleet?',
          '🔄 Reallocate 2 harvesters from Bhopal',
          '📈 Today fleet utilization & revenue',
        ];
  }

  return isHindi
    ? ['🚜 मशीन की स्थिति जांचें', '📊 मांग का पूर्वानुमान', '💳 क्रेडिट स्कोर नियम']
    : ['🚜 Check equipment status', '📊 Regional demand forecast', '💳 Credit scoring rules'];
}

function containsHindiOrHinglish(text: string): boolean {
  // Regex for Devanagari Unicode Range or key Hinglish words
  const devanagariRegex = /[\u0900-\u097F]/;
  if (devanagariRegex.test(text)) return true;

  const hinglishKeywords = [
    'chahiye', 'karna', 'karo', 'kya', 'hai', 'kaise', 'kitna', 'gehu', 'khet', 'katai',
    'jotai', 'buwai', 'namaste', 'bhai', 'paisa', 'bataye', 'batao', 'kharab', 'maang'
  ];
  return hinglishKeywords.some(kw => text.includes(kw));
}
