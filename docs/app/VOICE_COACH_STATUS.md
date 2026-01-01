# Voice Coach - Implementation Status

> **Last Updated**: December 2024

---

## Current State: Working Prototype

A functional web-based preview exists for testing the voice coach before app integration.

### To Run the Preview
```bash
cd /path/to/Pause
npx tsx scripts/coach-web-server.ts
# Open http://localhost:3333
```

---

## Technology Stack (Validated)

| Component | Technology | Status |
|-----------|------------|--------|
| **LLM** | Gemini 3 Flash Preview | Working |
| **TTS** | ElevenLabs Flash v2.5 | Working |
| **Voice Clone** | ElevenLabs voice ID `gn39AkrRBGmOUvxXfY8S` | Working |

### API Keys (in `.env.local`)
- `GEMINI_API_KEY` - Gemini 3 Flash Preview
- `ELEVENLABS_API_KEY` - ElevenLabs TTS
- `ELEVENLABS_VOICE_ID` - Dr. Miller voice clone ID

---

## Key Implementation Details

### Gemini 3 Configuration
```typescript
// Endpoint
https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent

// Config for minimum latency
generationConfig: {
  temperature: 1.0,
  maxOutputTokens: 512,
  thinkingConfig: {
    thinkingLevel: 'low',  // Critical for speed
  },
}
```

### ElevenLabs Configuration
```typescript
// Endpoint
https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format=mp3_44100_128

// Using Flash v2.5 for low latency (~75ms)
model_id: 'eleven_flash_v2_5'
```

### Response Format
The LLM returns JSON with message and optional action:
```json
{"message": "Your response", "action": null}
{"message": "Let's try breathing", "action": {"type": "START_EXERCISE", "id": "breathing"}}
```

---

## System Prompt Design

Key learnings from testing:

1. **Use Dr. Miller's actual phrases** - Reference `/docs/dr_miller_voice_style_guide.md` (in RLM app folder)
2. **Explicit negative examples** - Tell the model what NOT to say (generic therapist language)
3. **Conversational flow** - 2-3 exchanges before recommending exercises
4. **Simple language** - Short sentences, direct questions, no jargon

### Critical Style Rules
- Never say "diaphragmatic" → use "abdominal breathing"
- Never use phrases like "I'm not surprised" or "we often carry our burdens"
- Use: "Folks", "What's on your mind?", "Tell me more", "You are the boss"

---

## Observed Latencies

| Stage | Typical Latency |
|-------|-----------------|
| LLM (Gemini 3 Flash) | ~1000-2300ms |
| TTS (ElevenLabs Flash) | ~400-600ms |
| **Total** | ~1500-3000ms |

---

## Files

### Keep
- `scripts/coach-web-server.ts` - Web preview for testing
- `.env.local` - API keys

### Reference
- `/docs/dr_miller_voice_style_guide.md` (in RLM app folder) - Dr. Miller's authentic voice patterns

---

## Next Steps for App Integration

1. [ ] Create React Native service for Gemini calls
2. [ ] Create React Native service for ElevenLabs TTS
3. [ ] Build Coach screen UI with audio playback
4. [ ] Add speech-to-text input (iOS SFSpeechRecognizer)
5. [ ] Wire up actions (START_EXERCISE navigates to exercise screen)
6. [ ] Add conversation persistence in Convex (post-MVP)

---

## Known Issues Resolved

1. **JSON truncation** - Fixed by increasing `maxOutputTokens` to 512
2. **Generic therapist language** - Fixed with explicit negative examples in prompt
3. **Too quick to exercises** - Fixed by instructing 2-3 exchange flow
4. **Conversation continuity** - History is passed correctly in `contents` array
