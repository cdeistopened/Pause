/**
 * Speech Recognition Service
 *
 * Uses Web Speech API for browser-based speech-to-text.
 * Falls back gracefully on unsupported platforms.
 */

import { Platform } from 'react-native';

// Type definitions for Web Speech API
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

// Get the SpeechRecognition constructor (browser-specific)
const getSpeechRecognition = (): typeof SpeechRecognition | null => {
  if (Platform.OS !== 'web') return null;

  const win = window as Window & {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  };

  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
};

let recognition: SpeechRecognition | null = null;
let isListening = false;

export interface SpeechRecognitionCallbacks {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  onStart?: () => void;
}

/**
 * Check if speech recognition is supported
 */
export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognition() !== null;
}

/**
 * Start listening for speech
 */
export function startListening(callbacks: SpeechRecognitionCallbacks): boolean {
  const SpeechRecognitionClass = getSpeechRecognition();

  if (!SpeechRecognitionClass) {
    console.warn('Speech recognition not supported on this platform');
    callbacks.onError?.('Speech recognition not supported');
    return false;
  }

  // Stop any existing recognition
  stopListening();

  try {
    recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListening = true;
      callbacks.onStart?.();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.resultIndex];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;

      callbacks.onResult(transcript, isFinal);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);

      // Don't report "no-speech" as an error - it's normal
      if (event.error !== 'no-speech') {
        callbacks.onError?.(event.error);
      }
    };

    recognition.onend = () => {
      isListening = false;
      callbacks.onEnd?.();
    };

    recognition.start();
    return true;
  } catch (error) {
    console.error('Failed to start speech recognition:', error);
    callbacks.onError?.('Failed to start speech recognition');
    return false;
  }
}

/**
 * Stop listening for speech
 */
export function stopListening(): void {
  if (recognition) {
    try {
      recognition.stop();
    } catch (e) {
      // Ignore errors when stopping
    }
    recognition = null;
  }
  isListening = false;
}

/**
 * Check if currently listening
 */
export function getIsListening(): boolean {
  return isListening;
}
