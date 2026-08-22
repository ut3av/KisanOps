import { MatchedMachineResult, FarmerRequirementIntent, BookingDraft } from '../../types/voice';

export class ResponseService {
  /**
   * Generates a natural, conversational Hindi voice response for the farmer.
   */
  public generateHindiResponse(params: {
    intent: FarmerRequirementIntent;
    missingFields: string[];
    matchedMachines: MatchedMachineResult[];
    state: string;
    bookingDraft?: BookingDraft | null;
    userQuery?: string;
  }): string {
    const { intent, missingFields, matchedMachines, state, bookingDraft, userQuery } = params;
    const queryLower = (userQuery || '').toLowerCase();

    // Check if farmer asked about credit / deferred payment
    if (
      queryLower.includes('उधार') ||
      queryLower.includes('udhaar') ||
      queryLower.includes('credit') ||
      queryLower.includes('बाद में पैसे') ||
      queryLower.includes('baad me paise')
    ) {
      return 'हाँ भैया, आपका AgriCredit रिकॉर्ड बहुत अच्छा है। आप इस मशीन के लिए फसल कटाई के बाद भी भुगतान कर सकते हैं। क्या मैं इसे बुक कर दूँ?';
    }

    // Check if in booking confirmed state
    if (state === 'BOOKING_CREATED') {
      return `बधाई हो! आपकी ${bookingDraft?.machine_model || 'मशीन'} की बुकिंग पक्की हो गई है। ऑपरेटर को सूचना भेज दी गई है और आपका टैक्स बिल तैयार है।`;
    }

    // Check if in booking confirmation draft state
    if (state === 'CONFIRMING_BOOKING' && bookingDraft) {
      return `ठीक है, ${bookingDraft.machine_model} के लिए ${bookingDraft.booked_hours} घंटे का अनुमानित किराया ₹${bookingDraft.estimated_total.toLocaleString('en-IN')} होगा। क्या मैं बुकिंग पक्की कर दूँ?`;
    }

    // If missing critical information, ask ONE short question at a time
    if (missingFields.length > 0) {
      const firstMissing = missingFields[0];
      if (firstMissing === 'task_category') {
        return 'नमस्ते! बताइए, आपको अपने खेत पर किस काम के लिए मशीन चाहिए? जैसे कटाई, जुताई या बुवाई?';
      }
      if (firstMissing === 'target_date') {
        const machineWord = intent.machine_type_required || 'मशीन';
        return `ज़रूर। आपको ${machineWord} किस तारीख या दिन के लिए चाहिए? जैसे कल या परसों?`;
      }
      if (firstMissing === 'target_location') {
        return 'ठीक है। आपका खेत किस गांव या जिले में स्थित है?';
      }
      if (firstMissing === 'farm_acres') {
        return 'और लगभग कितने एकड़ का खेत है?';
      }
    }

    // If machines are found
    if (matchedMachines.length > 0) {
      const top = matchedMachines[0];
      const count = matchedMachines.length;
      const countWord = count === 1 ? 'एक अच्छी मशीन' : `${count} अच्छी मशीनें`;
      const distance = top.distance_km ? `${top.distance_km} किलोमीटर` : 'नजदीक';
      const rate = top.price_quote.quotedRatePerHour;

      if (count === 1) {
        return `हाँ, आपके लिए ${top.machine.brand} ${top.machine.model} मिल रही है। यह लगभग ${distance} दूर है और किराया ${rate} रुपये प्रति घंटा है। क्या मैं इसे बुक कर दूँ?`;
      }

      const second = matchedMachines[1];
      return `हाँ, आपके लिए ${countWord} उपलब्ध हैं। सबसे अच्छा विकल्प ${top.machine.brand} ${top.machine.model} है, जो ${distance} दूर है और किराया ${rate} रुपये प्रति घंटा है। दूसरा विकल्प ${second.machine.brand} है। क्या मैं ${top.machine.brand} बुक कर दूँ?`;
    }

    // No machines found
    return 'अभी आपके इस क्षेत्र में कोई उपयुक्त मशीन उपलब्ध नहीं दिख रही है। क्या मैं नजदीकी दूसरे CHC केंद्र से मशीन खोजूं?';
  }
}
