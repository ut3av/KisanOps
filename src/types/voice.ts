import { z } from 'zod';
import { Machine, PriceQuote, Booking, ActivityType } from '../types';

export type TaskCategory =
  | 'ploughing'
  | 'sowing'
  | 'spraying'
  | 'harvesting'
  | 'threshing'
  | 'transport';

export interface FarmerRequirementIntent {
  task_category: TaskCategory | null;
  crop_name: string | null;
  farm_acres: number | null;
  target_date: string | null;
  target_location: string | null;
  machine_type_required: string | null;
  urgency: 'low' | 'normal' | 'urgent' | null;
  additional_requirements: string | null;
  search_radius_km?: number | null;
}

export interface TranscriptionResult {
  text: string;
  language: string;
  confidence: number;
}

export interface FarmerContext {
  farmer_id?: string;
  farmer_name?: string;
  farmer_phone?: string;
  farm_acres?: number;
  location?: string;
  district?: string;
  village?: string;
  current_crop?: string;
  soil_type?: string;
  available_credit?: number;
  farm_latitude?: number;
  farm_longitude?: number;
  default_radius_km?: number;
}

export interface MatchedMachineResult {
  machine: Machine;
  match_score: number;
  reasons: string[];
  price_quote: PriceQuote;
  available_now: boolean;
  distance_km: number;
  agri_credit_eligible: boolean;
}

export type ConversationState =
  | 'GREETING'
  | 'COLLECTING_INFO'
  | 'MACHINES_FOUND'
  | 'NO_MACHINES'
  | 'CONFIRMING_BOOKING'
  | 'BOOKING_CREATED'
  | 'AWAITING_PAYMENT'
  | 'COMPLETED';

export interface ConversationTurn {
  id: string;
  speaker: 'user' | 'assistant';
  text: string;
  audio_url?: string;
  timestamp: string;
  language?: string;
}

export interface BookingDraft {
  machine_id: string;
  machine_model: string;
  chc_id: string;
  chc_name: string;
  activity: ActivityType;
  booked_hours: number;
  target_date: string;
  hourly_rate: number;
  estimated_total: number;
  payment_method: 'AGRICREDIT_DEFERRED' | 'UPI' | 'CARD';
}

export interface VoiceSession {
  session_id: string;
  farmer_id?: string;
  current_intent: FarmerRequirementIntent;
  missing_fields: string[];
  selected_machine: MatchedMachineResult | null;
  booking_draft: BookingDraft | null;
  conversation_state: ConversationState;
  conversation_history: ConversationTurn[];
  created_at: string;
  updated_at: string;
}

export interface VoiceProcessResponse {
  success: boolean;
  session_id: string;
  transcribed_text: string;
  language_detected: string;
  intent_data: FarmerRequirementIntent;
  missing_fields: string[];
  matched_machines: MatchedMachineResult[];
  assistant_response_text: string;
  audio_url?: string;
  audio_base64?: string;
  conversation_state: ConversationState;
  booking_draft?: BookingDraft | null;
  created_booking?: Booking | null;
}
