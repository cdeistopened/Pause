# Voice Coach Architecture

> **Goal**: Sub-500ms latency conversational AI with Dr. Miller's cloned voice
> **Stack**: Gemini 2.5 Flash + Resemble.ai (Chatterbox) + WebSocket streaming

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        VOICE COACH FLOW                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐       │
│  │  User    │    │  Speech  │    │  Gemini  │    │ Resemble │       │
│  │  Speaks  │───▶│  to Text │───▶│  3 Flash │───▶│ TTS      │       │
│  │          │    │  (STT)   │    │  (LLM)   │    │ (voice)  │       │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘       │
│                                        │               │             │
│                                        │               ▼             │
│                                        │         ┌──────────┐       │
│                                        │         │  Audio   │       │
│                                        │         │  Plays   │       │
│                                        │         └──────────┘       │
│                                        │               │             │
│                                        ▼               │             │
│                                  ┌───────────┐        │             │
│                                  │  Action   │◀───────┘             │
│                                  │  Handler  │                      │
│                                  └───────────┘                      │
│                                        │                            │
│                                        ▼                            │
│                              Navigate / Start Exercise               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Clear Separation of Concerns

| Component | Responsibility | Replaceable? |
|-----------|----------------|--------------|
| **STT** | Transcribes user speech to text | Yes - device native, Whisper, Deepgram |
| **LLM** | Thinks, decides, generates response + action | Yes - Gemini, Claude, GPT, local |
| **TTS** | Converts text to Dr. Miller's voice | Yes - Resemble, ElevenLabs, etc. |
| **Action Handler** | Executes app navigation from LLM output | No - tightly coupled to app |

Resemble is **just a voice synthesizer**. It has no intelligence. All coaching logic, action decisions, and conversation flow live in the LLM layer.

---

## Latency Budget

Target: **< 500ms** from user stops speaking to first audio chunk plays

| Component | Target | Notes |
|-----------|--------|-------|
| Speech-to-Text | ~50ms | Device-native (iOS/Android) for speed |
| Network to Convex | ~30ms | Convex action receives text |
| Gemini 2.5 Flash | ~200-300ms | Streaming response, first tokens fast |
| Resemble WebSocket | ~150-200ms | First audio chunk via WebSocket |
| **Total** | **~430-580ms** | Acceptable for conversational feel |

### Key Optimizations

1. **Stream everything** - Don't wait for full LLM response before starting TTS
2. **Use device STT** - Native iOS/Android speech recognition is faster than cloud
3. **WebSocket for TTS** - Persistent connection eliminates handshake overhead
4. **Chunk-based playback** - Start playing audio while still receiving chunks
5. **Pre-warm connections** - Open WebSocket when user enters Coach tab

---

## Component Details

### 1. Speech-to-Text (STT)

**Option A: Device Native (Recommended for MVP)**
- iOS: `SFSpeechRecognizer` via `@react-native-voice/voice`
- Android: Google Speech Recognition
- Pros: Fast, free, works offline
- Cons: Less accurate than cloud options

**Option B: Cloud STT (Future upgrade)**
- Deepgram, AssemblyAI, or Whisper API
- Better accuracy, costs money
- Add ~100-200ms latency

```typescript
// hooks/useSpeechToText.ts
import Voice from '@react-native-voice/voice';

export function useSpeechToText() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      setTranscript(e.value?.[0] ?? '');
    };
    return () => Voice.destroy();
  }, []);

  const startListening = async () => {
    setIsListening(true);
    await Voice.start('en-US');
  };

  const stopListening = async () => {
    setIsListening(false);
    await Voice.stop();
  };

  return { transcript, isListening, startListening, stopListening };
}
```

---

### 2. LLM Processing (Gemini 2.5 Flash)

**Why Gemini Flash?**
- Extremely fast time-to-first-token (~100ms)
- Good instruction following
- Streaming support
- Cost-effective

**Convex Action Structure:**

```typescript
// convex/coach.ts
import { action } from "./_generated/server";
import { v } from "convex/values";

export const chat = action({
  args: {
    userMessage: v.string(),
  },
  handler: async (ctx, { userMessage }) => {
    // Get user context from database
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    const habits = await ctx.runQuery(internal.habits.getUserHabits, { userId: user._id });
    const todayProgress = await ctx.runQuery(internal.habits.getTodayProgress, { userId: user._id });

    // Build context
    const systemPrompt = buildDrMillerPrompt(user, habits, todayProgress);

    // Call Gemini with streaming
    const response = await callGeminiStreaming(systemPrompt, userMessage);

    // Parse response for message + action
    const { message, action } = parseResponse(response);

    // Save to conversation history
    await ctx.runMutation(internal.coach.saveMessage, {
      userId: user._id,
      role: "user",
      content: userMessage,
    });
    await ctx.runMutation(internal.coach.saveMessage, {
      userId: user._id,
      role: "assistant",
      content: message,
      action,
    });

    return { message, action };
  },
});
```

**System Prompt Design Philosophy:**

The system prompt is intentionally lean (~400 tokens). No RAG needed - the knowledge base is small and static. Everything fits in context.

**Static System Prompt** (loaded once):

```typescript
const SYSTEM_PROMPT = `You are Dr. Richard Louis Miller, an 85-year-old clinical psychologist. You help people take control of their minds through practical exercises.

STYLE:
- Warm but direct. No fluff.
- Maximum 2 sentences per response.
- Always end with an action or one clarifying question.
- Use "Let's" and "Right now" to prompt immediate action.

ACTIONS (include in JSON response):
- START_EXERCISE: breathing | golden_light | counting | self_talk | relaxation
- PLAY_CONTENT: [content_id] - for educational lectures
- SHOW_HABITS: show user their daily progress
- NONE: just respond conversationally

EXERCISES:
- breathing: 60 sec diaphragmatic breathing. Best for anxiety, racing heart.
- golden_light: 90 sec visualization. Best for energy, healing, morning routine.
- counting: 60 sec mental focus. Best for intrusive thoughts, distraction.
- self_talk: 60 sec affirmations. Best for self-criticism, low confidence.
- relaxation: 3 min progressive relaxation. Best for physical tension, pre-sleep.

LECTURES (for deeper learning):
- setting_mood: How to choose your mood each morning
- saturation_learning: Why small reps beat long sessions
- self_criticism: Replacing negative self-talk
- movement_depression: Exercise as antidote to depression
- staying_present: The past is a trap

RESPONSE FORMAT:
{
  "message": "Your spoken response (1-2 sentences)",
  "action": { "type": "START_EXERCISE", "id": "breathing" } // or null
}

Remember: You're not here to discuss - you're here to guide them into action.`;
```

**Dynamic User Context** (injected per-request, ~100 tokens):

```typescript
function buildUserContext(user, habits, todayProgress) {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  return `
USER CONTEXT:
- Time: ${timeOfDay}
- Habits: ${habits.map(h => `${h.type} (${todayProgress[h.type] || 0}/${h.goal})`).join(', ')}
- Streak: ${user.currentStreak} days
- Last intention: "${user.lastIntention || 'none'}"
`;
}
```

**Conversation History** (in-session only, ~200-500 tokens):

```typescript
// Keep last 5-10 exchanges in memory during session
// Clear when user leaves Coach tab or after 30 min idle
// No cross-session memory for MVP
const conversationHistory: Message[] = [];
```

**Total context per request: ~700-1000 tokens** - well within any modern LLM's limits.

**Coaching Style Examples:**

Bad (too chatty):
> "That's really interesting that you're feeling anxious. Anxiety is something many people struggle with..."

Good (action-oriented):
> "Anxiety. Let's breathe. 60 seconds, right now."
> `action: { type: "START_EXERCISE", id: "breathing" }`

Good (one question, then act):
> "Racing thoughts or tension in your body?"
> User: "Racing thoughts"
> "Counting will help. Let's focus your mind."
> `action: { type: "START_EXERCISE", id: "counting" }`

---

### 3. Text-to-Speech (Resemble.ai)

**WebSocket Streaming for Lowest Latency**

Endpoint: `wss://websocket.cluster.resemble.ai/stream`

```typescript
// services/resembleTTS.ts

interface ResembleTTSConfig {
  apiKey: string;
  voiceUuid: string;
  projectUuid: string;
}

class ResembleTTSService {
  private ws: WebSocket | null = null;
  private config: ResembleTTSConfig;
  private audioQueue: ArrayBuffer[] = [];
  private isPlaying = false;

  constructor(config: ResembleTTSConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket('wss://websocket.cluster.resemble.ai/stream');

      this.ws.onopen = () => {
        // Authenticate
        this.ws?.send(JSON.stringify({
          api_key: this.config.apiKey,
        }));
        resolve();
      };

      this.ws.onmessage = (event) => {
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data);
          if (data.type === 'audio_end') {
            this.onStreamComplete();
          } else if (data.audio_content) {
            // Base64 audio chunk
            const audioBuffer = base64ToArrayBuffer(data.audio_content);
            this.queueAudio(audioBuffer);
          }
        } else {
          // Binary audio data
          this.queueAudio(event.data);
        }
      };

      this.ws.onerror = reject;
    });
  }

  async speak(text: string): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect();
    }

    this.ws?.send(JSON.stringify({
      voice_uuid: this.config.voiceUuid,
      project_uuid: this.config.projectUuid,
      data: text,
      output_format: 'mp3',
      sample_rate: 44100,
      binary_response: true,
    }));
  }

  private queueAudio(buffer: ArrayBuffer) {
    this.audioQueue.push(buffer);
    if (!this.isPlaying) {
      this.playNext();
    }
  }

  private async playNext() {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const buffer = this.audioQueue.shift()!;
    await playAudioBuffer(buffer); // Use expo-av or similar
    this.playNext();
  }

  private onStreamComplete() {
    // Audio streaming finished
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}
```

---

### 4. Action Handler

When the LLM returns an action, the app responds:

```typescript
// hooks/useCoachActions.ts
import { useRouter } from 'expo-router';

export function useCoachActions() {
  const router = useRouter();

  const executeAction = (action: CoachAction | null) => {
    if (!action || action.type === 'NONE') return;

    switch (action.type) {
      case 'START_EXERCISE':
        // Navigate to pause screen with exercise pre-selected
        router.push({
          pathname: '/(tabs)',
          params: {
            autoStart: 'true',
            exerciseType: action.params?.exerciseType
          },
        });
        break;

      case 'PLAY_CONTENT':
        // Navigate to content player
        router.push(`/player/${action.params?.contentId}`);
        break;

      case 'SHOW_HABITS':
        router.push('/(tabs)/habits');
        break;
    }
  };

  return { executeAction };
}
```

---

## Voice Cloning Setup

### Creating Dr. Miller's Voice Clone

**Requirements (per Resemble docs):**
- Resemble PRO plan or higher
- Audio recordings of Dr. Miller
- Recommended: 10-30 minutes of clean audio
- Format: WAV or MP3, clear speech, minimal background noise

**Process:**
1. Upload recordings via Resemble dashboard or API
2. Create a new voice from recordings
3. Obtain `voice_uuid` for API calls
4. Test with sample text

**Using Existing Content:**
You already have Instagram videos and podcast recordings. These can be:
1. Extracted as audio
2. Cleaned up (remove background music if any)
3. Split into clips
4. Uploaded to Resemble

---

## Full Conversation Flow

```typescript
// hooks/useCoach.ts

export function useCoach() {
  const { transcript, isListening, startListening, stopListening } = useSpeechToText();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const ttsService = useRef(new ResembleTTSService(config));
  const { executeAction } = useCoachActions();
  const sendMessage = useMutation(api.coach.chat);

  // Pre-warm TTS connection when component mounts
  useEffect(() => {
    ttsService.current.connect();
    return () => ttsService.current.disconnect();
  }, []);

  const handleUserMessage = async (text: string) => {
    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsProcessing(true);

    try {
      // Get LLM response
      const { message, action } = await sendMessage({ userMessage: text });

      // Add assistant message to UI
      setMessages(prev => [...prev, { role: 'assistant', content: message }]);

      // Speak the response
      await ttsService.current.speak(message);

      // Execute any action after speech completes (or during)
      if (action) {
        executeAction(action);
      }
    } catch (error) {
      console.error('Coach error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // When user stops speaking, process transcript
  useEffect(() => {
    if (!isListening && transcript) {
      handleUserMessage(transcript);
    }
  }, [isListening, transcript]);

  return {
    messages,
    isListening,
    isProcessing,
    startListening,
    stopListening,
  };
}
```

---

## Environment Variables

```bash
# .env.local

# Resemble.ai
RESEMBLE_API_KEY=your_resemble_api_key
RESEMBLE_PROJECT_UUID=your_project_uuid
RESEMBLE_VOICE_UUID=dr_miller_voice_uuid

# Google AI (Gemini)
GOOGLE_AI_API_KEY=your_gemini_api_key
```

---

## Fallback Strategy

If real-time voice is too complex for MVP:

**Level 1 (Simpler):**
- Text input only (no STT)
- LLM responds with text
- TTS plays pre-generated response (not streamed)

**Level 2 (Current plan):**
- Device STT → LLM → Streaming TTS
- Full voice conversation

**Level 3 (Future):**
- Interruption handling (user can interrupt Dr. Miller)
- Emotion detection
- Proactive check-ins

Start with Level 2. If latency is problematic, fall back to Level 1 for launch.

---

## Testing Checklist

- [ ] STT accurately captures user speech
- [ ] LLM response time < 300ms to first token
- [ ] TTS first audio chunk < 200ms after text received
- [ ] Audio plays smoothly without gaps
- [ ] Actions trigger correct navigation
- [ ] Conversation history persists
- [ ] Works on both iOS and Android
- [ ] Handles network errors gracefully
- [ ] WebSocket reconnects if disconnected

---

## Cost Estimates

| Service | Cost | Usage Estimate | Monthly |
|---------|------|----------------|---------|
| Gemini 2.5 Flash | ~$0.075/1M input tokens | 100K tokens | ~$7.50 |
| Resemble TTS | $0.018/minute | 500 minutes | ~$9 |
| **Total** | | | **~$17/mo** |

At 1000 premium users doing 5 minutes of coaching/week each, that's 20,000 minutes = $360/month.

---

*Architecture created: December 2024*
*Reference: APP_ARCHITECTURE.md, Resemble.ai docs*

## Sources

- [Resemble.ai Documentation](https://docs.resemble.ai/welcome)
- [Resemble WebSocket Streaming API](https://docs.resemble.ai/voice-generation/text-to-speech/streaming-websocket)
- [Chatterbox Open Source TTS](https://www.resemble.ai/chatterbox/)
- [Voice Agent Latency Best Practices - Twilio](https://www.twilio.com/en-us/blog/developers/best-practices/guide-core-latency-ai-voice-agents)
- [Real-Time vs Turn-Based Voice Architecture](https://softcery.com/lab/ai-voice-agents-real-time-vs-turn-based-tts-stt-architecture)
