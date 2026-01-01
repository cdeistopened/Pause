/**
 * ElevenLabs TTS Service
 * 
 * Converts text to speech using Dr. Miller's cloned voice
 */

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
const VOICE_ID = process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID;

// ElevenLabs API endpoint
const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

export interface TTSOptions {
  stability?: number;      // 0-1, lower = more expressive
  similarityBoost?: number; // 0-1, higher = closer to original voice
  style?: number;          // 0-1, style exaggeration
}

const DEFAULT_OPTIONS: TTSOptions = {
  stability: 0.5,
  similarityBoost: 0.75,
  style: 0.3,
};

let currentSound: Audio.Sound | null = null;

/**
 * Convert text to speech and play it
 */
export async function speakText(
  text: string,
  options: TTSOptions = {}
): Promise<void> {
  if (!API_KEY || !VOICE_ID) {
    console.error('ElevenLabs credentials not configured');
    throw new Error('ElevenLabs credentials not configured');
  }

  // Stop any currently playing audio
  await stopSpeaking();

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: mergedOptions.stability,
          similarity_boost: mergedOptions.similarityBoost,
          style: mergedOptions.style,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    // Get audio data as blob
    const audioBlob = await response.blob();
    
    // Convert blob to base64
    const reader = new FileReader();
    const base64Audio = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remove data:audio/mpeg;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

    // Save to temp file
    const fileUri = FileSystem.cacheDirectory + `tts_${Date.now()}.mp3`;
    await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Play the audio
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    const { sound } = await Audio.Sound.createAsync(
      { uri: fileUri },
      { shouldPlay: true }
    );

    currentSound = sound;

    // Clean up when done
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        FileSystem.deleteAsync(fileUri, { idempotent: true });
        currentSound = null;
      }
    });

  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    throw error;
  }
}

/**
 * Stop any currently playing audio
 */
export async function stopSpeaking(): Promise<void> {
  if (currentSound) {
    try {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    } catch (e) {
      // Ignore errors when stopping
    }
    currentSound = null;
  }
}

/**
 * Check if audio is currently playing
 */
export function isSpeaking(): boolean {
  return currentSound !== null;
}

/**
 * Get audio stream URL for streaming playback (alternative approach)
 */
export function getStreamUrl(text: string): string {
  const params = new URLSearchParams({
    text,
    model_id: 'eleven_monolingual_v1',
    voice_settings: JSON.stringify({
      stability: DEFAULT_OPTIONS.stability,
      similarity_boost: DEFAULT_OPTIONS.similarityBoost,
    }),
  });
  
  return `${API_URL}/stream?${params.toString()}`;
}
