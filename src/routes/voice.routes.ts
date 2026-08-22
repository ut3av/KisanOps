import { ConversationService } from '../services/conversation/conversation.service';
import { GroqWhisperProvider } from '../services/stt/groq-whisper.service';
import { BrowserTTSService } from '../services/tts/tts.service';
import { FarmerContext, VoiceProcessResponse } from '../types/voice';
import { Machine, Booking } from '../types';

export class VoiceController {
  private conversationService: ConversationService;
  private sttProvider: GroqWhisperProvider;
  private ttsService: BrowserTTSService;

  constructor() {
    this.conversationService = new ConversationService();
    this.sttProvider = new GroqWhisperProvider();
    this.ttsService = new BrowserTTSService();
  }

  /**
   * Process incoming recorded audio from browser MediaRecorder
   */
  public async processAudio(params: {
    audioBlob: Blob;
    sessionId?: string;
    machines: Machine[];
    context?: FarmerContext;
    onExecuteBooking?: (draft: any) => Booking;
  }): Promise<VoiceProcessResponse> {
    const { audioBlob, sessionId, machines, context, onExecuteBooking } = params;

    // 1. STT: Transcribe spoken audio
    const transcription = await this.sttProvider.transcribe(audioBlob);
    const textToProcess = transcription.text.trim() || 'नमस्ते, मुझे मशीन चाहिए';

    // 2. Process turn via conversation & intent engine
    const response = this.conversationService.processUserTurn({
      sessionId,
      userInputText: textToProcess,
      machines,
      context,
      onExecuteBooking,
    });

    return response;
  }

  /**
   * Process typed Hindi/Hinglish text query
   */
  public processText(params: {
    text: string;
    sessionId?: string;
    machines: Machine[];
    context?: FarmerContext;
    onExecuteBooking?: (draft: any) => Booking;
  }): VoiceProcessResponse {
    const { text, sessionId, machines, context, onExecuteBooking } = params;

    return this.conversationService.processUserTurn({
      sessionId,
      userInputText: text,
      machines,
      context,
      onExecuteBooking,
    });
  }

  public getSession(sessionId: string) {
    return this.conversationService.getSession(sessionId);
  }
}

export const globalVoiceController = new VoiceController();
