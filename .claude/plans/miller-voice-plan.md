# Roadmap: Miller Voice

## Context
- Stack: Expo, Convex, Clerk
- Feature: AI voice coach using Eleven Labs (referred to as "Custom" in the prompt context) for a voice clone of Dr. Richard Louis Miller ("Miller Voice"). The app uses this voice for short guided meditations and intention setting.

## Implementation Steps

### 1. Manual Setup (User Required)
- [ ] Create Eleven Labs account. [cite: S1.1, S2.2, S2.3]
- [ ] Sign up for a paid Eleven Labs plan (Starter or higher) to enable commercial use and Instant Voice Cloning. [cite: S3.1, S3.2]
- [ ] Generate an API key from the Eleven Labs account dashboard. [cite: S1.1, S2.2, S2.3]
- [ ] Clone Dr. Richard Louis Miller's voice using Eleven Labs' Voice Cloning feature (Professional Voice Cloning may require specific plan tiers). [cite: S1.4, S1.5, S4.3]
- [ ] Obtain the unique `voice_id` for the cloned "Miller Voice."
- [ ] Configure billing and review pricing structure (character-based for TTS, with overage charges). [cite: S3.1, S3.2, S3.5]

### 2. Dependencies & Environment
- [ ] Install Eleven Labs Node.js SDK: `@elevenlabs/elevenlabs-js` (on Convex backend). [cite: S1.3]
- [ ] Install Expo audio playback module: `expo-av` (on Expo frontend). [cite: S5.1, S5.3, S5.5]
- [ ] Env vars (Convex): `ELEVENLABS_API_KEY` (your Eleven Labs API key). [cite: S1.1, S2.1, S2.2]
- [ ] Env vars (Convex): `MILLER_VOICE_ID` (the `voice_id` obtained in step 1).

### 3. Database Schema
- [ ] `meditations`: Stores meditation scripts and intention-setting texts.
    - `text: string` (The script for the Miller Voice)
    - `audioUrl: string | null` (Optional: URL to pre-generated audio for caching/performance)
    - `voiceId: string` (Reference to the specific Eleven Labs voice used, e.g., MILLER_VOICE_ID)
- [ ] `userProgress`: Tracks user's completed meditations and intentions.
    - `meditationId: Id<'meditations'>`
    - `completedAt: number`
    - `intentionSet: string` (The user's selected intention)

### 4. Backend Functions (Convex)
- [ ] `generateMeditationAudio(text: string, voiceId: string)`:
    - Purpose: Takes text and a voice ID, calls Eleven Labs TTS API. [cite: S1.1, S1.2, S1.3]
    - Returns: A temporary URL to the generated audio file (e.g., from an Eleven Labs response or a Convex file storage service).
    - Authentication: Uses `ELEVENLABS_API_KEY`. [cite: S2.1, S5.4]
    - Error handling: Catches Eleven Labs API errors, rate limits (429s). [cite: S1.2, S2.4, S3.4, S5.4]
- [ ] `getOrCreateMeditationAudio(meditationId: Id<'meditations'>)`:
    - Purpose: Checks `meditations` table for `audioUrl`. If present, returns it. If null, calls `generateMeditationAudio`, updates `meditations.audioUrl`, and returns the URL (implements caching). [cite: S5.4]
- [ ] `recordUserProgress(meditationId: Id<'meditations'>, intentionSet: string)`:
    - Purpose: Stores user's completion and intention in `userProgress`.
    - Authentication: Integrates with Clerk for user identification.

### 5. Frontend (Expo)
- [ ] **Components:**
    - `PauseButton`: Triggers the meditation flow.
    - `MeditationPlayer`: Displays meditation text and plays audio.
    - `IntentionSetter`: Presents a menu for intention selection.
    - `HabitProgress`: Displays cumulative habit data from Convex.
- [ ] **State:**
    - `currentMeditationText: string`
    - `currentMeditationAudioUrl: string | null`
    - `isPlayingAudio: boolean`
    - `isGeneratingAudio: boolean`
    - `selectedIntention: string`
- [ ] **Logic:**
    - On Pause button press:
        - Fetches `meditationText` from Convex.
        - Calls Convex `getOrCreateMeditationAudio` to get `currentMeditationAudioUrl`.
        - Sets `isGeneratingAudio` to true/false based on audio generation status.
        - Uses `expo-av` (`Audio.Sound.loadAsync`, `playAsync`) to play `currentMeditationAudioUrl`. [cite: S5.1, S5.3, S5.5]
    - After meditation audio completes:
        - Displays `IntentionSetter` component.
        - On intention selection, calls Convex `recordUserProgress`.

### 6. Error Prevention
- [ ] **API errors:** Graceful handling of network issues, Eleven Labs API downtime, or invalid requests (e.g., display a "failed to load audio" message).
- [ ] **Validation:** Ensure input texts for TTS are within character limits.
- [ ] **Rate limiting:** Implement retry mechanisms with exponential backoff on the Convex backend for Eleven Labs API calls (e.g., for 429 Too Many Requests). [cite: S5.4]
- [ ] **Auth:** Securely manage Eleven Labs API key on the Convex backend, never exposing it client-side. Authenticate Convex calls using Clerk. [cite: S2.1, S2.2, S5.4]
- [ ] **Type safety:** Use TypeScript for all Convex and Expo codebases.
- [ ] **Boundaries:** Implement character limits for text sent to TTS API.

### 7. Testing
- [ ] **Convex backend:**
    - Unit tests for `generateMeditationAudio` (mocking Eleven Labs API).
    - Integration tests for `getOrCreateMeditationAudio` (verifying caching logic).
    - Security tests for API key handling.
- [ ] **Expo frontend:**
    - UI tests for `MeditationPlayer` and `IntentionSetter` components.
    - Functional tests for audio playback (playing, pausing, stopping).
    - User flow tests (Pause button -> meditation -> intention setting -> progress update).
- [ ] **End-to-end:**
    - Verify complete flow from user pressing "Pause" to audio playback and progress recording.
    - Test performance and latency of audio generation and playback.
    - Test under various network conditions.