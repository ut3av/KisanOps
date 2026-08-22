import {
  VoiceSession,
  VoiceProcessResponse,
  FarmerContext,
  ConversationTurn,
  ConversationState,
  BookingDraft
} from '../../types/voice';
import { Machine, Booking } from '../../types';
import { IntentService } from '../intent/intent.service';
import { MachineryMatcherService } from '../machinery/machinery-matcher.service';
import { ResponseService } from '../response/response.service';

export class ConversationService {
  private sessions: Map<string, VoiceSession> = new Map();
  private intentService: IntentService;
  private matcherService: MachineryMatcherService;
  private responseService: ResponseService;

  constructor() {
    this.intentService = new IntentService();
    this.matcherService = new MachineryMatcherService();
    this.responseService = new ResponseService();
  }

  public getSession(sessionId: string): VoiceSession | undefined {
    return this.sessions.get(sessionId);
  }

  public processUserTurn(params: {
    sessionId?: string;
    userInputText: string;
    machines: Machine[];
    context?: FarmerContext;
    onExecuteBooking?: (draft: BookingDraft) => Booking;
  }): VoiceProcessResponse {
    const { sessionId = `session-${Date.now()}`, userInputText, machines, context, onExecuteBooking } = params;

    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        session_id: sessionId,
        farmer_id: context?.farmer_id,
        current_intent: {
          task_category: null,
          crop_name: null,
          farm_acres: null,
          target_date: null,
          target_location: null,
          machine_type_required: null,
          urgency: 'normal',
          additional_requirements: null,
        },
        missing_fields: [],
        selected_machine: null,
        booking_draft: null,
        conversation_state: 'GREETING',
        conversation_history: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.sessions.set(sessionId, session);
    }

    // 1. Record User turn in history
    const userTurn: ConversationTurn = {
      id: `turn-user-${Date.now()}`,
      speaker: 'user',
      text: userInputText,
      timestamp: new Date().toISOString(),
    };
    session.conversation_history.push(userTurn);

    // 2. Check for Voice Confirmations / Cancellations
    const isPositive = this.intentService.isPositiveConfirmation(userInputText);
    const isNegative = this.intentService.isNegativeCancellation(userInputText);

    let nextState: ConversationState = session.conversation_state;
    let createdBooking: Booking | null = null;

    if (session.conversation_state === 'MACHINES_FOUND' && isPositive && session.selected_machine) {
      // Move to confirmation stage with explicit booking draft
      const top = session.selected_machine;
      const hours = 6;
      const hourlyRate = top.price_quote.quotedRatePerHour;
      const subtotal = Math.round(hours * hourlyRate) + 300 + 100 - 100;
      const gst = Math.round(subtotal * 0.05);
      const estimatedTotal = subtotal + gst;

      session.booking_draft = {
        machine_id: top.machine.id,
        machine_model: `${top.machine.brand} ${top.machine.model}`,
        chc_id: top.machine.chcId,
        chc_name: top.machine.chcName,
        activity: (top.machine.category === 'HARVESTER' ? 'HARVESTING' : 'SOIL_PREPARATION') as any,
        booked_hours: hours,
        target_date: session.current_intent.target_date || new Date().toISOString().slice(0, 10),
        hourly_rate: hourlyRate,
        estimated_total: estimatedTotal,
        payment_method: 'AGRICREDIT_DEFERRED',
      };
      nextState = 'CONFIRMING_BOOKING';
    } else if (session.conversation_state === 'CONFIRMING_BOOKING' && isPositive && session.booking_draft) {
      // Farmer explicitly confirmed the final booking summary
      if (onExecuteBooking) {
        createdBooking = onExecuteBooking(session.booking_draft);
      }
      nextState = 'BOOKING_CREATED';
    } else if (isNegative) {
      session.booking_draft = null;
      session.selected_machine = null;
      nextState = 'COLLECTING_INFO';
    } else {
      // 3. Extract & accumulate structured intent
      const updatedIntent = this.intentService.extractIntent(
        userInputText,
        context,
        session.current_intent
      );
      session.current_intent = updatedIntent;

      const missing = this.intentService.identifyMissingFields(updatedIntent);
      session.missing_fields = missing;

      if (missing.length === 0 || updatedIntent.machine_type_required || updatedIntent.task_category) {
        nextState = 'MACHINES_FOUND';
      } else {
        nextState = 'COLLECTING_INFO';
      }
    }

    session.conversation_state = nextState;

    // 4. Perform Machine Search & Ranking
    let matchedMachines = this.matcherService.matchMachines(
      session.current_intent,
      machines,
      context
    );

    if (matchedMachines.length > 0) {
      session.selected_machine = matchedMachines[0];
    } else if (nextState === 'MACHINES_FOUND') {
      nextState = 'NO_MACHINES';
      session.conversation_state = 'NO_MACHINES';
    }

    // 5. Generate Natural Hindi Response
    const responseText = this.responseService.generateHindiResponse({
      intent: session.current_intent,
      missingFields: session.missing_fields,
      matchedMachines,
      state: nextState,
      bookingDraft: session.booking_draft,
      userQuery: userInputText,
    });

    // 6. Record Assistant turn in history
    const assistantTurn: ConversationTurn = {
      id: `turn-asst-${Date.now()}`,
      speaker: 'assistant',
      text: responseText,
      timestamp: new Date().toISOString(),
    };
    session.conversation_history.push(assistantTurn);
    session.updated_at = new Date().toISOString();

    return {
      success: true,
      session_id: session.session_id,
      transcribed_text: userInputText,
      language_detected: 'hi',
      intent_data: session.current_intent,
      missing_fields: session.missing_fields,
      matched_machines: matchedMachines,
      assistant_response_text: responseText,
      conversation_state: nextState,
      booking_draft: session.booking_draft,
      created_booking: createdBooking,
    };
  }
}
