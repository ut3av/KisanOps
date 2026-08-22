import { describe, it, expect } from 'vitest';
import { IntentService } from '../intent/intent.service';
import { MachineryMatcherService } from '../machinery/machinery-matcher.service';
import { ResponseService } from '../response/response.service';
import { ConversationService } from '../conversation/conversation.service';
import { parseAgriculturalDate } from '../../utils/date-parser';
import { SEEDED_MACHINES } from '../../data/seedData';
import { FarmerContext, FarmerRequirementIntent } from '../../types/voice';

describe('Multilingual Voice AI Assistant & Intent Engine', () => {
  const intentService = new IntentService();
  const matcherService = new MachineryMatcherService();
  const responseService = new ResponseService();
  const conversationService = new ConversationService();

  const rameshContext: FarmerContext = {
    farmer_id: 'user-farmer-ramesh',
    farmer_name: 'Ramesh Kumar',
    farmer_phone: '+91 98260 41234',
    farm_acres: 8.0,
    district: 'Sehore',
    village: 'Bilkisganj',
    current_crop: 'Wheat',
    available_credit: 50000,
  };

  it('1. Extracts structured intent from natural Hindi harvesting query', () => {
    const query = 'मुझे कल गेहूं की कटाई के लिए हार्वेस्टर चाहिए';
    const intent = intentService.extractIntent(query, rameshContext);

    expect(intent.task_category).toBe('harvesting');
    expect(intent.crop_name).toBe('Wheat');
    expect(intent.machine_type_required).toBe('Harvester');
    expect(intent.target_date).toBeTruthy();
  });

  it('2. Extracts structured intent from Hinglish query with acreage', () => {
    const query = 'Kal 8 acre wheat ki harvesting ke liye machine chahiye';
    const intent = intentService.extractIntent(query, rameshContext);

    expect(intent.task_category).toBe('harvesting');
    expect(intent.crop_name).toBe('Wheat');
    expect(intent.farm_acres).toBe(8);
  });

  it('3. Understands regional agricultural vocabulary (जुताई, बुवाई, छिड़काव, मड़ाई)', () => {
    expect(intentService.extractIntent('खेत की जुताई करनी है').task_category).toBe('ploughing');
    expect(intentService.extractIntent('सोयाबीन की बुवाई करनी है').task_category).toBe('sowing');
    expect(intentService.extractIntent('कीटनाशक का छिड़काव करना है').task_category).toBe('spraying');
    expect(intentService.extractIntent('फसल की मड़ाई करनी है').task_category).toBe('threshing');
  });

  it('4. Identifies missing fields and asks single polite Hindi question', () => {
    const incompleteIntent: FarmerRequirementIntent = {
      task_category: 'harvesting',
      crop_name: 'Wheat',
      farm_acres: null,
      target_date: null,
      target_location: null,
      machine_type_required: 'Harvester',
      urgency: 'normal',
      additional_requirements: null,
    };

    const missing = intentService.identifyMissingFields(incompleteIntent);
    expect(missing).toContain('target_date');
    expect(missing).toContain('target_location');
    expect(missing).toContain('farm_acres');

    const response = responseService.generateHindiResponse({
      intent: incompleteIntent,
      missingFields: missing,
      matchedMachines: [],
      state: 'COLLECTING_INFO',
    });

    expect(response).toContain('तारीख');
  });

  it('5. Accurate relative date parsing in Asia/Kolkata timezone (आज, कल, परसों)', () => {
    const now = new Date();
    const kolkataDateStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const [y, m, d] = kolkataDateStr.split('-').map(Number);
    const base = new Date(Date.UTC(y, m - 1, d));

    const tomorrow = new Date(base);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    expect(parseAgriculturalDate('कल')).toBe(tomorrowStr);
    expect(parseAgriculturalDate('kal')).toBe(tomorrowStr);
    expect(parseAgriculturalDate('tomorrow')).toBe(tomorrowStr);
  });

  it('6. Matches and ranks real KisanOps machines with explainable suitability', () => {
    const intent: FarmerRequirementIntent = {
      task_category: 'harvesting',
      crop_name: 'Wheat',
      farm_acres: 8,
      target_date: '2026-08-23',
      target_location: 'Sehore',
      machine_type_required: 'Harvester',
      urgency: 'normal',
      additional_requirements: null,
    };

    const matches = matcherService.matchMachines(intent, SEEDED_MACHINES, rameshContext);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].match_score).toBeGreaterThanOrEqual(80);
    expect(matches[0].price_quote.quotedRatePerHour).toBeGreaterThan(0);
    expect(matches[0].reasons.length).toBeGreaterThan(0);
  });

  it('7. Handles AgriCredit voice inquiry with clear eligibility explanation', () => {
    const response = responseService.generateHindiResponse({
      intent: {
        task_category: 'harvesting',
        crop_name: 'Wheat',
        farm_acres: 8,
        target_date: '2026-08-23',
        target_location: 'Sehore',
        machine_type_required: 'Harvester',
        urgency: 'normal',
        additional_requirements: null,
      },
      missingFields: [],
      matchedMachines: [],
      state: 'MACHINES_FOUND',
      userQuery: 'क्या उधार हो जाएगा?',
    });

    expect(response).toContain('AgriCredit');
    expect(response).toContain('भुगतान');
  });

  it('8. Two-step voice booking verification protection (does not book without explicit confirmation)', () => {
    const result1 = conversationService.processUserTurn({
      sessionId: 'test-session-1',
      userInputText: 'भैया कल मेरे 8 एकड़ गेहूं की कटाई करनी है, सीहोर में कोई हार्वेस्टर मिल जाएगा?',
      machines: SEEDED_MACHINES,
      context: rameshContext,
    });

    expect(result1.conversation_state).toBe('MACHINES_FOUND');
    expect(result1.created_booking).toBeFalsy();

    // Turn 2: Farmer says "हाँ बुक कर दो" -> moves to CONFIRMING_BOOKING with draft, not finalized yet
    const result2 = conversationService.processUserTurn({
      sessionId: 'test-session-1',
      userInputText: 'हाँ बुक कर दो',
      machines: SEEDED_MACHINES,
      context: rameshContext,
    });

    expect(result2.conversation_state).toBe('CONFIRMING_BOOKING');
    expect(result2.booking_draft).toBeTruthy();
    expect(result2.created_booking).toBeFalsy();

    // Turn 3: Farmer explicitly confirms -> executes booking
    let bookingExecuted = false;
    const result3 = conversationService.processUserTurn({
      sessionId: 'test-session-1',
      userInputText: 'हाँ, पक्की कर दो',
      machines: SEEDED_MACHINES,
      context: rameshContext,
      onExecuteBooking: (draft) => {
        bookingExecuted = true;
        return {
          id: 'bk-voice-test',
          bookingNumber: 'BK-2026-9999',
          farmerId: rameshContext.farmer_id!,
          farmerName: rameshContext.farmer_name!,
          farmerPhone: rameshContext.farmer_phone!,
          chcId: draft.chc_id,
          chcName: draft.chc_name,
          machineId: draft.machine_id,
          machineIdentifier: 'MH-01',
          machineModel: draft.machine_model,
          machineCategory: 'HARVESTER',
          farmId: 'farm-1',
          farmName: 'Ramesh Farm',
          farmLocation: 'Sehore',
          activity: draft.activity,
          status: 'CONFIRMED',
          bookingMode: 'HOURLY',
          bookedHours: draft.booked_hours,
          startTime: `${draft.target_date}T08:00:00.000Z`,
          endTime: `${draft.target_date}T14:00:00.000Z`,
          hourlyRate: draft.hourly_rate,
          estimatedTotal: draft.estimated_total,
          paymentMethod: draft.payment_method,
          paymentStatus: 'AUTHORIZED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      },
    });

    expect(result3.conversation_state).toBe('BOOKING_CREATED');
    expect(bookingExecuted).toBe(true);
    expect(result3.assistant_response_text).toContain('पक्की हो गई');
  });

  it('9. Gracefully handles negative cancellation in voice conversation', () => {
    const result = conversationService.processUserTurn({
      sessionId: 'test-session-cancel',
      userInputText: 'नहीं, अभी रद्द कर दो',
      machines: SEEDED_MACHINES,
      context: rameshContext,
    });

    expect(result.booking_draft).toBeNull();
  });
});
