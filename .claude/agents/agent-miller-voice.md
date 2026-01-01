---
name: agent-elevenlabs-millervoice
description: Implements Miller Voice (Eleven Labs voice cloning and TTS) with Convex backend and Expo frontend.
model: inherit
color: purple
---


# Agent: Miller Voice Implementation with Eleven Labs

## Agent Overview
**Purpose**: To guide developers in integrating "Miller Voice" – an AI voice coach feature utilizing Eleven Labs for voice cloning and Text-to-Speech (TTS) – into an Expo React Native application with Convex as the backend and Clerk for authentication. This involves understanding Eleven Labs API capabilities, Convex backend patterns, and Expo frontend integration.
**Tech Stack**: Expo (React Native), Convex (Backend, Database, File Storage), Clerk (Authentication), Eleven Labs (Voice AI).
**Source**:
- Eleven Labs Documentation (API, Voice Cloning, React Native SDK)
- Convex Developer Hub (Actions, Mutations, Queries, File Storage, Best Practices, Runtimes)

## Critical Implementation Knowledge
### 1. Eleven Labs Latest Updates 🚨
Eleven Labs offers two primary methods for voice cloning:
*   **Instant Voice Cloning (IVC)**: Creates a voice clone rapidly from shorter audio samples (recommended 1-3 minutes of clear audio). It relies on pre-trained models and is suitable for many voices. Available on Starter plans and higher.
*   **Professional Voice Cloning (PVC)**: For hyper-realistic and unique voices, requiring a larger dataset and dedicated model training. This provides higher fidelity and is typically available on Creator+ plans, taking longer for training (e.g., ~3 hours for English). For a lead personality like Dr. Richard Louis Miller, PVC might be preferred for optimal quality.

The Eleven Labs API is credit-based, with costs varying by character count, model type, and plan. Commercial use requires a paid plan. Different models (e.g., Flash/Turbo) have varying credit consumption rates.

### 2. Common Pitfalls & Solutions 🚨
*   **Expo Go Limitations**: The Eleven Labs React Native SDK, particularly for the Agents Platform (conversational AI via WebRTC), relies on native code and LiveKit dependencies. This means it **cannot be used with Expo Go** and requires **development builds** (using `npx expo run:ios` or `npx expo run:android`).
*   **Microphone Permissions**: For any voice input functionality (like an AI voice coach), explicit microphone permissions must be configured in `app.json` for both iOS (`NSMicrophoneUsageDescription`) and Android (`android.permission.RECORD_AUDIO`).
*   **API Key Exposure**: Never hardcode or expose your Eleven Labs API key directly in client-side code. It must be securely stored as an environment variable/Convex secret and used only on the backend (Convex Actions).
*   **Convex `fetch` Restriction**: Remember that `fetch` (for external API calls) is strictly disallowed in Convex Queries and Mutations. All external API interactions **must occur within Convex Actions**.
*   **Convex Action Overuse**: While actions enable external calls, minimize the amount of logic within them. Actions are not part of the reactive sync engine. Only the non-deterministic parts (like the `fetch` call to Eleven Labs) should be in an action. Keep them small and focused for better scalability and throughput.

### 3. Best Practices 🚨
*   **Secure API Key Management**: Store your Eleven Labs API Key as a Convex secret (e.g., `CONVEX_ELEVENLABS_API_KEY`). Access it securely within your Convex actions using `process.env.CONVEX_ELEVENLABS_API_KEY`.
*   **Convex `internalAction`**: For backend-to-backend communication (e.g., triggering voice generation from a mutation), define your Eleven Labs integration functions as `internalAction`s. This prevents them from being publicly exposed to the client and adds a layer of security.
*   **Convex Scheduler for Asynchronous Workflows**: Use `ctx.scheduler.runAfter()` from a Convex mutation to trigger a Convex action that interacts with Eleven Labs. This ensures transactional integrity: if the mutation fails, the action will not be scheduled. It also keeps your UI responsive by offloading long-running API calls.
*   **Convex Node.js Runtime**: For the Eleven Labs Node.js SDK, configure your Convex action file to run in the Node.js runtime by adding `"use node"` at the top. This provides compatibility for Node.js-specific features if the SDK requires them.
*   **Argument & Return Validation**: Always use Convex's `v.object` for argument validation and `returns` for return type validation in your Convex functions (queries, mutations, actions). This improves code robustness and type safety.
*   **Convex File Storage for Audio**: Store generated audio files directly in Convex File Storage from your Convex action using `ctx.storage.store()`. Save the returned `storage ID` to your Convex database via a mutation for easy retrieval and management.

## Implementation Steps

### Backend Implementation (Convex)
1.  **Convex Secret Setup**: Add `ELEVENLABS_API_KEY` to your Convex deployment secrets.
2.  **Voice Cloning (if needed)**:
    *   **Upload Audio**: Client uploads audio samples for cloning to Convex File Storage (via `storage.generateUploadUrl` mutation for large files, or `httpAction` for smaller ones).
    *   **Trigger Cloning Action**: A Convex mutation saves the storage IDs of the audio samples to the database and then schedules an `internalAction` to perform the voice cloning.
    *   **Eleven Labs `createVoice` Action**: The `internalAction` uses the Eleven Labs Node.js SDK to send the audio samples (retrieved from Convex Storage) to Eleven Labs for IVC or PVC. It receives a `voice_id` in return.
    *   **Store `voice_id`**: A Convex mutation is called from the action to save the generated `voice_id` and metadata in your Convex database.
3.  **Text-to-Speech (TTS) for "Miller Voice"**:
    *   **Trigger TTS Action**: A client-side call to a Convex mutation (e.g., `generateMillerVoiceResponse`) or another internal Convex function triggers the TTS process.
    *   **Eleven Labs `textToSpeech` Action**: This mutation schedules an `internalAction`. The `internalAction` retrieves the appropriate "Miller Voice" `voice_id` from the database, then uses the Eleven Labs Node.js SDK to convert the input text to speech.
    *   **Store Audio & Metadata**: The action receives the audio data (e.g., a `Buffer` or `BytesIO`). It then uses `ctx.storage.store()` to save this audio to Convex File Storage, getting a `storage ID`. Finally, it calls a Convex mutation to save the `storage ID` and any relevant TTS metadata (e.g., transcription, duration, associated `voice_id`) to the Convex database.
    *   **Retrieve Audio**: A Convex query allows the client to fetch the `storage ID` and then `ctx.storage.getUrl()` can provide a signed URL for playing the audio.
4.  **Authentication**: Integrate Clerk by wrapping your Convex functions with `authenticatedMutation`, `authenticatedQuery`, or `authenticatedAction` to ensure only logged-in users can interact with voice features, using `ctx.auth.getUserIdentity()`.

### Frontend Integration (Expo React Native)
1.  **Install Dependencies**: Install `@elevenlabs/react-native` and its LiveKit dependencies (`@livekit/react-native`, `@livekit/react-native-webrtc`, `livekit-client`).
2.  **Configure Permissions**: Update `app.json` for microphone permissions.
3.  **Client-Side Trigger**:
    *   For conversational AI (using Agents Platform): Wrap your app with `ElevenLabsProvider` and use the `useConversation` hook. This approach might involve direct client-side interaction with Eleven Labs if you're building a real-time agent.
    *   For on-demand TTS (from Convex): Call Convex mutations (e.g., `api.myFunctions.generateMillerVoiceResponse`) to trigger backend voice generation.
4.  **Audio Playback**: Use Expo's `expo-av` library to play back the audio received from Convex (via signed URLs from `ctx.storage.getUrl()`).

## Code Patterns

### Convex Backend Functions
*   **`convex/elevenlabs.ts` (Eleven Labs Integration Action - `"use node"` runtime)**:
    ```typescript
    // convex/elevenlabs.ts
    "use node"; // CRITICAL: Enables Node.js runtime for Eleven Labs SDK

    import { internalAction } from "./_generated/server";
    import { v } from "convex/values";
    import { ElevenLabsClient } from "elevenlabs"; // Using the Node.js SDK
    import { ConvexError } from "convex/values";
    import { Id } from "./_generated/dataModel";
    import { api } from "./_generated/api";
    import { Blob } from 'buffer'; // Node.js Blob for file storage

    const elevenlabs = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY!, // Loaded from Convex secrets
    });

    export const cloneVoice = internalAction({
      args: {
        voiceName: v.string(),
        audioFileIds: v.array(v.id("_storage")), // IDs of audio samples in Convex storage
      },
      handler: async (ctx, args) => {
        // Retrieve audio files from Convex storage
        const audioFiles = await Promise.all(
          args.audioFileIds.map(async (fileId) => {
            const file = await ctx.storage.get(fileId);
            if (!file) throw new ConvexError("Audio file not found.");
            // Convert ReadableStream to Buffer for Eleven Labs SDK
            const buffer = await file.arrayBuffer();
            return new Blob([buffer]); // Eleven Labs SDK might expect Blob or similar
          })
        );

        try {
          const voice = await elevenlabs.voices.add({
            name: args.voiceName,
            files: audioFiles,
            // description: "Description for Miller Voice clone",
          });
          // Call a mutation to store the voice ID in the database
          await ctx.runMutation(api.voices.createVoiceRecord, {
            voiceId: voice.voice_id,
            name: args.voiceName,
            // ... other metadata
          });
          return voice.voice_id;
        } catch (error) {
          console.error("Error cloning voice:", error);
          throw new ConvexError(`Eleven Labs voice cloning failed: ${error}`);
        }
      },
    });

    export const generateSpeech = internalAction({
      args: {
        text: v.string(),
        voiceId: v.string(), // Use the cloned voice ID
        stability: v.optional(v.number()),
        similarityBoost: v.optional(v.number()),
      },
      handler: async (ctx, args) => {
        try {
          const audioStream = await elevenlabs.generate({
            voice: args.voiceId,
            text: args.text,
            model_id: "eleven_multilingual_v2", // or appropriate model
            voice_settings: {
              stability: args.stability ?? 0.75,
              similarity_boost: args.similarityBoost ?? 0.75,
            },
          });

          // Convert stream to buffer
          const audioBuffer = await streamToBuffer(audioStream);

          // Store the audio in Convex storage
          const fileId = await ctx.storage.store(audioBuffer);

          // Call a mutation to save metadata and storage ID
          await ctx.runMutation(api.audio.saveGeneratedAudio, {
            text: args.text,
            voiceId: args.voiceId,
            audioFileId: fileId,
            // ... other metadata like duration, etc.
          });

          return fileId;

        } catch (error) {
          console.error("Error generating speech:", error);
          throw new ConvexError(`Eleven Labs speech generation failed: ${error}`);
        }
      },
    });

    // Helper to convert ReadableStream to Buffer
    async function streamToBuffer(stream: AsyncIterable<Uint8Array>): Promise<Buffer> {
      const chunks: Uint8Array[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    }
    ```

*   **`convex/audio.ts` (Convex Mutation - Saves Audio Metadata)**:
    ```typescript
    // convex/audio.ts
    import { mutation } from "./_generated/server";
    import { v } from "convex/values";
    import { Id } from "./_generated/dataModel";
    import { api } from "./_generated/api";

    export const saveGeneratedAudio = mutation({
      args: {
        text: v.string(),
        voiceId: v.string(),
        audioFileId: v.id("_storage"),
      },
      handler: async (ctx, args) => {
        // Authenticate user if necessary
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          throw new ConvexError("Not authenticated");
        }
        // Save audio metadata to your custom table
        return await ctx.db.insert("generatedAudio", {
          text: args.text,
          voiceId: args.voiceId,
          audioFileId: args.audioFileId,
          userId: identity.subject, // Associate with Clerk user ID
          createdAt: Date.now(),
        });
      },
    });

    export const getAudioUrl = mutation({ // Mutation to generate signed URL
      args: {
        audioFileId: v.id("_storage"),
      },
      handler: async (ctx, args) => {
        // You might want to add auth checks here to ensure user has access to this audio
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          throw new ConvexError("Not authenticated");
        }
        return await ctx.storage.getUrl(args.audioFileId);
      },
    });

    export const getLatestMillerVoiceAudio = query({
      args: {},
      handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          return null; // Or throw error
        }
        // Fetch the latest generated audio for the current user, or a general "Miller Voice"
        const latestAudio = await ctx.db
          .query("generatedAudio")
          .filter((q) => q.eq(q.field("userId"), identity.subject)) // Example filter
          .order("desc")
          .first();

        if (latestAudio) {
          const url = await ctx.storage.getUrl(latestAudio.audioFileId);
          return { ...latestAudio, url };
        }
        return null;
      },
    });
    ```

*   **`convex/schema.ts` (Convex Schema - Example Tables)**:
    ```typescript
    // convex/schema.ts
    import { defineSchema, defineTable } from "convex/server";
    import { v } from "convex/values";

    export default defineSchema({
      voices: defineTable({
        name: v.string(),
        voiceId: v.string(), // Eleven Labs voice ID
        userId: v.optional(v.string()), // If cloned by a specific user
        clonedAt: v.number(),
        // ... other voice metadata
      }).index("by_voice_id", ["voiceId"]),

      generatedAudio: defineTable({
        text: v.string(),
        voiceId: v.string(),
        audioFileId: v.id("_storage"),
        userId: v.string(), // Clerk user ID
        createdAt: v.number(),
      }).index("by_user_id", ["userId"]),
    });
    ```

*   **`convex/mutations.ts` (Example Mutation for Triggering)**:
    ```typescript
    // convex/mutations.ts
    import { mutation } from "./_generated/server";
    import { v } from "convex/values";
    import { api } from "./_generated/api";
    import { ConvexError } from "convex/values";

    export const triggerMillerVoiceSpeech = mutation({
      args: {
        text: v.string(),
        targetVoiceId: v.string(), // The voice ID to use
      },
      handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          throw new ConvexError("Not authenticated");
        }
        // Schedule the action to generate speech
        await ctx.scheduler.runAfter(0, api.elevenlabs.generateSpeech, {
          text: args.text,
          voiceId: args.targetVoiceId,
        });
        return "Speech generation initiated.";
      },
    });
    ```

### Frontend Integration
```typescript
// Example React Native component in Expo
import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Audio } from 'expo-av';

export default function MillerVoiceFeature() {
  const [inputText, setInputText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Assuming you have a way to select or retrieve the Miller Voice ID
  const millerVoiceId = "YOUR_MILLER_VOICE_CLONE_ID"; // Replace with actual ID from Convex query or selection

  const triggerSpeech = useMutation(api.mutations.triggerMillerVoiceSpeech);
  const latestAudio = useQuery(api.audio.getLatestMillerVoiceAudio); // Fetches latest audio for current user

  const handleGenerateSpeech = async () => {
    if (!inputText.trim()) {
      Alert.alert("Input required", "Please enter text to generate speech.");
      return;
    }
    try {
      await triggerSpeech({ text: inputText, targetVoiceId: millerVoiceId });
      Alert.alert("Success", "Speech generation initiated! It may take a moment to appear.");
    } catch (error) {
      console.error("Failed to trigger speech generation:", error);
      Alert.alert("Error", "Failed to generate speech. Please try again.");
    }
  };

  useEffect(() => {
    // Cleanup audio when component unmounts
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async (uri: string) => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    try {
      console.log('Loading Sound');
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: uri },
        { shouldPlay: true },
        (status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
            newSound.unloadAsync();
            setSound(null);
          }
        }
      );
      setSound(newSound);
      setIsPlaying(true);
      console.log('Playing Sound');
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing sound', error);
      setIsPlaying(false);
      Alert.alert("Playback Error", "Could not play audio.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Enter text for Miller Voice:</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginVertical: 10 }}
        onChangeText={setInputText}
        value={inputText}
        placeholder="Type your message here..."
        multiline
      />
      <Button title="Generate Speech" onPress={handleGenerateSpeech} />

      {latestAudio && latestAudio.url && (
        <View style={{ marginTop: 20 }}>
          <Text>Latest Generated Audio:</Text>
          <Button title={isPlaying ? "Stop Playback" : "Play Latest Audio"} onPress={() => {
            if (isPlaying) {
              sound?.stopAsync();
              setIsPlaying(false);
            } else {
              playSound(latestAudio.url!);
            }
          }} />
          {isPlaying && <ActivityIndicator size="small" color="#0000ff" />}
        </View>
      )}

      {!latestAudio && <Text style={{ marginTop: 20 }}>No audio generated yet or still processing.</Text>}
    </View>
  );
}
```

## Testing & Debugging
*   **Convex Dashboard**: Use the Convex dashboard (`npx convex dev`) to test `internalAction`s and `mutation`s directly. Monitor action logs for Eleven Labs API request/response details and errors.
*   **Convex Logs**: Check Convex deployment logs for any errors originating from your actions, especially those related to environment variables, network requests, or `use node` runtime issues.
*   **Expo Development Builds**: Since Expo Go is not supported for the Eleven Labs React Native SDK, you must use `npx expo run:ios` or `npx expo run:android` for local development and testing.
*   **Microphone Access**: On device, ensure the Expo app has been granted microphone permissions. Debug permission issues by checking OS settings and `app.json` configuration.
*   **Eleven Labs Dashboard**: Monitor your Eleven Labs account for credit usage and API request history.

## Environment Variables
*   **`.env.local`**:
    ```
    CONVEX_DEPLOY_KEY=your_convex_deploy_key
    ELEVENLABS_API_KEY=your_elevenlabs_api_key
    ```
*   **Convex Deployment Secrets**:
    Set `ELEVENLABS_API_KEY` as a Convex secret using `npx convex env set ELEVENLABS_API_KEY --value "your_elevenlabs_api_key"`. This is the secure way to manage sensitive keys on the Convex backend.

## Success Metrics
*   **Eleven Labs Voice Cloned**: Successfully added "Dr. Richard Louis Miller's" voice to Eleven Labs, obtaining a unique `voice_id` that is stored in Convex.
*   **Text-to-Speech Functional**: Text submitted via the Expo app successfully triggers a Convex action, which calls the Eleven Labs API using the cloned voice, and returns audio.
*   **Audio Stored & Playable**: Generated audio files are securely stored in Convex File Storage, and signed URLs are generated by Convex, allowing playback in the Expo app.
*   **Authentication Enforced**: Only authenticated Clerk users can trigger voice generation or manage their voice data through Convex functions.
*   **Scalable Backend**: Convex actions are optimized, using `internalAction` and the scheduler, minimizing workload and adhering to Convex best practices for external API integrations.
*   **No Expo Go Issues**: The Expo app builds and runs correctly on development builds (iOS/Android simulators or devices) without `Expo Go` related errors for Eleven Labs SDK.
---