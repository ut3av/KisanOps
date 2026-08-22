export interface TTSProvider {
  name: string;
  speak(text: string, language?: string): Promise<void>;
  stop(): void;
  isSpeaking(): boolean;
}

export class BrowserTTSService implements TTSProvider {
  name = 'BrowserWebSpeechTTS';
  private synthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  public async speak(text: string, language = 'hi-IN'): Promise<void> {
    if (!this.synthesis) {
      console.warn('SpeechSynthesis is not supported in this environment.');
      return;
    }

    this.stop();

    return new Promise((resolve) => {
      // Clean speech text (remove markdown symbols like *, #, etc.)
      const cleaned = text.replace(/[*_#`]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleaned);
      this.currentUtterance = utterance;

      utterance.lang = language;
      utterance.rate = 0.95; // Slightly measured rate for low-literacy clarity
      utterance.pitch = 1.0;

      // Find best Hindi voice if available
      const voices = this.synthesis?.getVoices() || [];
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi') || v.name.includes('India'));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis playback event:', e);
        this.currentUtterance = null;
        resolve();
      };

      this.synthesis?.speak(utterance);
    });
  }

  public stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return !!this.synthesis?.speaking;
  }
}
