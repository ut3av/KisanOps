import { TranscriptionResult } from '../../types/voice';

export interface STTProvider {
  name: string;
  transcribe(audio: Blob | ArrayBuffer, filename?: string): Promise<TranscriptionResult>;
}

/**
 * Normalizes transcribed text from STT services (removes extra whitespace, punctuation quirks)
 */
export function normalizeTranscript(rawText: string): string {
  return rawText
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^[।,\.\?\!]+/, '')
    .trim();
}

/**
 * Detects whether the spoken/transcribed text is primarily Hindi, Hinglish, or English
 */
export function detectLanguage(text: string): 'hi' | 'hi-Latn' | 'en' {
  const hindiDevanagariPattern = /[\u0900-\u097F]/;
  if (hindiDevanagariPattern.test(text)) {
    return 'hi';
  }

  const hinglishMarkers = [
    'chahiye', 'karna', 'karni', 'bhaiya', 'khet', 'fasal', 'katai', 'jotai', 'buwai',
    'madai', 'gehu', 'dhan', 'chawal', 'acre', 'ekad', 'rupaye', 'batao', 'khojo',
    'ha', 'haan', 'nahi', 'kardo', 'book', 'kar do', 'aaj', 'kal', 'parso'
  ];

  const lower = text.toLowerCase();
  const hasHinglish = hinglishMarkers.some(marker => lower.includes(marker));
  if (hasHinglish) {
    return 'hi-Latn'; // Hinglish
  }

  return 'en';
}
