# The Pause - Comprehensive Implementation Plan

> Deep research synthesis for frontend design improvements and backend integration
> Last updated: 2026-01-01

---

## Executive Summary

This plan addresses making "everything work" in The Pause app - connecting UI to backend, fixing design gaps, implementing proper audio/haptics, and ensuring the voice coach is fully functional.

**Current State Analysis:**
- Backend schema is comprehensive (users, sessions, habits, content, coach)
- Backend functions exist but aren't fully connected to frontend
- UI closely matches Stitch wireframes but has gaps
- Voice coach works but actions aren't executed
- Haptics exist but aren't connected to user preferences
- Progress screen uses placeholder data

---

## Phase 1: Critical Wiring (Priority: CRITICAL)

### 1.1 Connect Progress Screen to Backend

**File:** `app/(tabs)/habits.tsx`

**Current Issue:** Uses hardcoded `PROGRESS_DATA` (lines 6-11)

**Changes Required:**
```typescript
// Add Convex imports
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

// Replace PROGRESS_DATA with:
const user = useQuery(api.users.getCurrent);
const sessions = useQuery(api.sessions.getStats);

const progressData = {
  totalPauses: user?.totalPauses ?? 0,
  currentStreak: user?.currentStreak ?? 0,
  longestStreak: user?.longestStreak ?? 0,
  yearGoal: 365,
};
```

**New Backend Function Needed:** `convex/sessions.ts` - add `getStats`:
```typescript
export const getStats = query({
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return null;

    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .collect();

    // Calculate by exercise type
    const byType: Record<string, number> = {};
    sessions.forEach(s => {
      byType[s.exerciseType] = (byType[s.exerciseType] || 0) + 1;
    });

    return { byType, total: sessions.length };
  },
});
```

### 1.2 Wire Coach Actions to App

**File:** `app/(tabs)/coach.tsx`

**Current Issue:** Coach returns actions (line 36) but they're never executed (lines 36-37 just store the message)

**Changes Required:**
```typescript
// After getting response, execute action
if (response.action) {
  switch (response.action.type) {
    case 'START_EXERCISE':
      // Navigate to PAUSE tab with exercise pre-selected
      router.push({
        pathname: '/',
        params: { exercise: response.action.id }
      });
      break;
    case 'SHOW_PROGRESS':
      router.push('/habits');
      break;
    case 'CAPTURE_INTENTION':
      // Save intention to backend
      await addIntention({ text: response.action.text });
      break;
  }
}
```

**Also needed:**
- Import `router` from `expo-router`
- Import `useMutation` and `api.intentions.add`
- Add mutation for saving intentions

### 1.3 Connect Haptics Toggle to Backend

**File:** `app/(tabs)/settings.tsx`

**Current Issue:** `hapticEnabled` is local state (line 13), not synced to backend

**Changes Required:**
```typescript
// Replace local state with Convex
const user = useQuery(api.users.getCurrent);
const updatePreferences = useMutation(api.users.updatePreferences);

const hapticEnabled = user?.hapticEnabled ?? true;

const toggleHaptic = async () => {
  await updatePreferences({ hapticEnabled: !hapticEnabled });
};
```

**New Backend Function:** `convex/users.ts` - add `updatePreferences`:
```typescript
export const updatePreferences = mutation({
  args: {
    hapticEnabled: v.optional(v.boolean()),
    morningReminderTime: v.optional(v.string()),
    eveningReminderTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    if (!user) throw new Error("Not authenticated");

    await ctx.db.patch(user._id, {
      ...args,
    });
  },
});
```

### 1.4 Create Haptics Context for App-Wide Use

**File:** `hooks/useHaptics.ts` (NEW)

**Purpose:** Single source of truth for haptic feedback, respects user preferences

```typescript
import * as Haptics from 'expo-haptics';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useCallback } from 'react';

export function useHaptics() {
  const user = useQuery(api.users.getCurrent);
  const enabled = user?.hapticEnabled ?? true;

  const impact = useCallback((style: Haptics.ImpactFeedbackStyle) => {
    if (enabled) Haptics.impactAsync(style);
  }, [enabled]);

  const notification = useCallback((type: Haptics.NotificationFeedbackType) => {
    if (enabled) Haptics.notificationAsync(type);
  }, [enabled]);

  const selection = useCallback(() => {
    if (enabled) Haptics.selectionAsync();
  }, [enabled]);

  return {
    enabled,
    impact,
    notification,
    selection,
    // Convenience methods matching Stitch spec
    start: () => impact(Haptics.ImpactFeedbackStyle.Heavy),
    pulse: () => impact(Haptics.ImpactFeedbackStyle.Light),
    complete: () => notification(Haptics.NotificationFeedbackType.Success),
    select: () => selection(),
    dotPop: () => impact(Haptics.ImpactFeedbackStyle.Soft),
  };
}
```

---

## Phase 2: Design Gap Fixes (Priority: HIGH)

### 2.1 Fix Coach Message Bubble Colors

**File:** `app/(tabs)/coach.tsx` (lines 114-127)

**Issue per Stitch Wireframes:** "User = right-aligned, gray. Coach = left-aligned, subtle golden tint"

**Current:** User messages are gold (`bg-primary`), coach messages are gray (`bg-surface-dark`)

**Fix:**
```typescript
// Change line 115-118
className={`max-w-[80%] px-4 py-3 rounded-2xl mb-3 ${
  msg.role === 'user'
    ? 'bg-surface-dark self-end rounded-br-sm'  // User = gray
    : 'bg-primary/15 self-start rounded-bl-sm border border-primary/20'  // Coach = golden tint
}`}
```

### 2.2 Fix Library Tab Selector Style

**File:** `app/(tabs)/library.tsx` (lines 135-169)

**Issue per Stitch:** Should be iOS-native segment control with underline, not pill buttons

**Current:** Uses pill-shaped buttons with background color toggle

**Fix:** Use proper segment control or underline tabs:
```typescript
<View className="flex-row px-5 mb-5 border-b border-white/10">
  <Pressable
    className={`px-4 py-3 ${
      activeTab === 'exercises' ? 'border-b-2 border-primary' : ''
    }`}
    onPress={() => setActiveTab('exercises')}
  >
    <Text className={`text-sm font-semibold ${
      activeTab === 'exercises' ? 'text-primary' : 'text-text-secondary'
    }`}>
      Exercises
    </Text>
  </Pressable>
  {/* Same for Learn tab */}
</View>
```

### 2.3 Fix Animation Durations

**File:** `components/pause/ActiveSession.tsx`

**Issue per Stitch:** "Orb pulse animation (scale 1.0 → 1.02 → 1.0 over 3s)"

**Current:** Float animation is 3s (correct), but orb expansion is missing

**Add orb expansion on session start:**
```typescript
const scaleAnim = useRef(new Animated.Value(1)).current;

// On mount, expand orb
useEffect(() => {
  Animated.timing(scaleAnim, {
    toValue: 1.15, // Fill more of screen
    duration: 300,
    useNativeDriver: true,
  }).start();
}, []);
```

### 2.4 Add Breathing Pulse to Orb

**File:** `components/pause/GoldenOrb.tsx`

**Issue:** Orb pulse animation should be subtle (1.0 → 1.02 → 1.0)

**Current implementation needs verification/fix:**
```typescript
// Breathing pulse effect
useEffect(() => {
  const pulseAnimation = Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.02,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1.0,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );
  pulseAnimation.start();
  return () => pulseAnimation.stop();
}, []);
```

### 2.5 Add Dot Pop Animation to Progress

**File:** `app/(tabs)/habits.tsx`

**Issue per Stitch:** "When user completes pause, new dot lights up with satisfying pulse"
- Scale 0 → 1.2 → 1.0 with bounce
- Flash white → settle to gold

**Add animation when dot count increases:**
```typescript
const dotScaleAnim = useRef(new Animated.Value(1)).current;

// Watch for changes to totalPauses
useEffect(() => {
  if (prevPauses.current < progressData.totalPauses) {
    // New pause completed, animate the newest dot
    Animated.sequence([
      Animated.timing(dotScaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(dotScaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    haptics.dotPop();
  }
  prevPauses.current = progressData.totalPauses;
}, [progressData.totalPauses]);
```

---

## Phase 3: Audio & Voice (Priority: HIGH)

### 3.1 Implement ElevenLabs Streaming TTS

**File:** `services/elevenlabs.ts`

**Current Issue:** Batch download (lines 47-117) causes latency - user waits for entire audio before playback starts

**Research Finding:** ElevenLabs supports streaming with chunked transfer encoding

**New streaming implementation:**
```typescript
export async function speakTextStreaming(
  text: string,
  options: TTSOptions = {}
): Promise<void> {
  if (!API_KEY || !VOICE_ID) {
    throw new Error('ElevenLabs credentials not configured');
  }

  await stopSpeaking();
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  try {
    const response = await fetch(`${API_URL}/stream`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2', // Faster model for streaming
        voice_settings: {
          stability: mergedOptions.stability,
          similarity_boost: mergedOptions.similarityBoost,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs streaming error: ${response.status}`);
    }

    // Stream audio chunks
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);

      // Start playback after first chunk (low-latency start)
      if (chunks.length === 1) {
        // Initialize audio playback
        await startPlaybackFromBuffer(chunks);
      }
    }
  } catch (error) {
    console.error('Streaming TTS error:', error);
    // Fallback to batch mode
    await speakText(text, options);
  }
}
```

### 3.2 Add Speech-to-Text for Voice Input

**File:** `services/speechToText.ts` (NEW)

**Purpose:** Enable "Hold to speak" functionality in Coach screen

```typescript
import { Audio } from 'expo-av';

export async function startRecording(): Promise<Audio.Recording> {
  await Audio.requestPermissionsAsync();
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  await recording.startAsync();
  return recording;
}

export async function stopRecordingAndTranscribe(
  recording: Audio.Recording
): Promise<string> {
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();

  // Use Whisper API or Google Speech-to-Text
  // For MVP, can use expo-speech-recognition
  const transcript = await transcribeAudio(uri);
  return transcript;
}
```

### 3.3 Wire Voice Mode in Coach

**File:** `app/(tabs)/coach.tsx`

**Current Issue:** Voice button exists (lines 147-158) but doesn't record

**Fix:**
```typescript
const [recording, setRecording] = useState<Audio.Recording | null>(null);

const handleVoicePress = async () => {
  if (isRecording) {
    // Stop recording and send
    const transcript = await stopRecordingAndTranscribe(recording!);
    setIsRecording(false);
    setRecording(null);
    if (transcript) {
      await sendMessage(transcript);
    }
  } else {
    // Start recording
    setIsRecording(true);
    const rec = await startRecording();
    setRecording(rec);
  }
};
```

---

## Phase 4: Convex Advanced Patterns (Priority: MEDIUM)

### 4.1 Add Cursor-Based Pagination

**Files:** `convex/sessions.ts`, `convex/intentions.ts`

**Issue:** Current queries load all data. At scale (1000+ sessions), this will be slow.

**Fix for sessions.ts:**
```typescript
export const listPaginated = query({
  args: {
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) return { sessions: [], nextCursor: null };

    const limit = args.limit ?? 20;

    let query = ctx.db
      .query("sessions")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .order("desc");

    if (args.cursor) {
      query = query.filter(q =>
        q.lt(q.field("completedAt"), parseInt(args.cursor!))
      );
    }

    const sessions = await query.take(limit + 1);
    const hasMore = sessions.length > limit;
    const items = hasMore ? sessions.slice(0, limit) : sessions;
    const nextCursor = hasMore ? String(items[items.length - 1].completedAt) : null;

    return { sessions: items, nextCursor };
  },
});
```

### 4.2 Set Up File Storage for Audio Content

**File:** `convex/content.ts`

**Current Issue:** Schema has `audioUrl: v.string()` but no file storage setup

**Add file upload mutation:**
```typescript
import { v } from "convex/values";

// Generate upload URL
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Store uploaded file and create content
export const createWithAudio = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("exercise"), v.literal("lecture")),
    exerciseType: v.optional(v.string()),
    durationSeconds: v.number(),
    storageId: v.id("_storage"),
    isPremium: v.boolean(),
  },
  handler: async (ctx, args) => {
    const audioUrl = await ctx.storage.getUrl(args.storageId);
    if (!audioUrl) throw new Error("Failed to get audio URL");

    return await ctx.db.insert("content", {
      title: args.title,
      description: args.description,
      type: args.type,
      exerciseType: args.exerciseType,
      durationSeconds: args.durationSeconds,
      audioUrl,
      isPremium: args.isPremium,
      sortOrder: 0,
      createdAt: Date.now(),
    });
  },
});
```

### 4.3 Add Scheduled Reminders

**File:** `convex/crons.ts` (NEW)

**Purpose:** Send push notifications at user's preferred times

```typescript
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Check for morning reminders every minute
crons.interval(
  "morning-reminders",
  { minutes: 1 },
  internal.notifications.sendMorningReminders
);

// Check for evening reminders
crons.interval(
  "evening-reminders",
  { minutes: 1 },
  internal.notifications.sendEveningReminders
);

export default crons;
```

**File:** `convex/notifications.ts` (NEW)
```typescript
import { internalMutation } from "./_generated/server";

export const sendMorningReminders = internalMutation({
  handler: async (ctx) => {
    const currentTime = new Date().toTimeString().slice(0, 5); // "09:00"

    const usersToNotify = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("morningReminderTime"), currentTime))
      .collect();

    for (const user of usersToNotify) {
      // Send push notification via Expo Push
      await sendPushNotification(user, "Good morning! Time for your pause.");
    }
  },
});
```

---

## Phase 5: Exercise-Colored Dot Grid (Priority: MEDIUM)

### 5.1 Per-Exercise Type Dots

**File:** `app/(tabs)/habits.tsx`

**Per Stitch Wireframes Alternative:** Show exercise variety with colored dots

**Implementation:**
```typescript
const EXERCISE_COLORS: Record<string, string> = {
  breathing: '#4A90D9',      // Blue
  golden_light: '#D4A853',   // Gold
  counting: '#10B981',       // Green
  self_talk: '#9333EA',      // Purple
  relaxation: '#06B6D4',     // Teal
};

// Fetch sessions with exercise type
const sessions = useQuery(api.sessions.listRecent, { limit: 365 });

// Render colored dots
{sessions?.map((session, index) => (
  <View
    key={session._id}
    style={{ backgroundColor: EXERCISE_COLORS[session.exerciseType] }}
    className="w-3 h-3 rounded-full shadow-lg"
  />
))}
```

### 5.2 Add Exercise Breakdown Section

**Below the dot grid, show stats by exercise:**
```typescript
<View className="flex-row flex-wrap gap-3 mt-6">
  {Object.entries(stats?.byType || {}).map(([type, count]) => (
    <View
      key={type}
      className="flex-row items-center bg-surface-dark rounded-xl px-3 py-2"
    >
      <View
        style={{ backgroundColor: EXERCISE_COLORS[type] }}
        className="w-2 h-2 rounded-full mr-2"
      />
      <Text className="text-text-primary text-sm">{count}</Text>
      <Text className="text-text-secondary text-xs ml-1">{type}</Text>
    </View>
  ))}
</View>
```

---

## Phase 6: Settings Deep-Linking (Priority: LOW)

### 6.1 Connect Habit Editing

**File:** `app/(tabs)/settings.tsx` + `app/habit-edit.tsx` (NEW)

**Current:** Habits are hardcoded (lines 6-10)

**Fix:**
1. Create `app/habit-edit.tsx` modal screen
2. Connect to `api.habits.list` and `api.habits.update`
3. Enable Add Habit flow with `api.habits.add`

### 6.2 Notification Time Pickers

**Current:** Notification times show but don't open picker

**Add DateTimePicker modal for time selection:**
```typescript
import DateTimePicker from '@react-native-community/datetimepicker';

const [showMorningPicker, setShowMorningPicker] = useState(false);

<Pressable onPress={() => setShowMorningPicker(true)}>
  {/* existing content */}
</Pressable>

{showMorningPicker && (
  <DateTimePicker
    mode="time"
    value={parseTime(user?.morningReminderTime || '09:00')}
    onChange={(_, date) => {
      setShowMorningPicker(false);
      if (date) {
        updatePreferences({ morningReminderTime: formatTime(date) });
      }
    }}
  />
)}
```

---

## Implementation Order

### Week 1: Critical Wiring
1. Progress screen backend connection
2. Coach action execution
3. Haptics hook + toggle connection
4. Settings backend integration

### Week 2: Design Polish
1. Message bubble color fix
2. Library tab underline style
3. Animation duration fixes
4. Dot pop animation

### Week 3: Audio
1. ElevenLabs streaming implementation
2. Speech-to-text integration
3. Voice recording in Coach

### Week 4: Advanced Features
1. Cursor-based pagination
2. File storage for content
3. Push notification crons
4. Exercise-colored dots

---

## Files to Create

| File | Purpose |
|------|---------|
| `hooks/useHaptics.ts` | Centralized haptics with preference check |
| `services/speechToText.ts` | Voice recording and transcription |
| `convex/crons.ts` | Scheduled notification jobs |
| `convex/notifications.ts` | Push notification logic |
| `app/habit-edit.tsx` | Habit editing modal |

## Files to Modify

| File | Changes |
|------|---------|
| `app/(tabs)/habits.tsx` | Backend connection, colored dots |
| `app/(tabs)/coach.tsx` | Action execution, voice input |
| `app/(tabs)/settings.tsx` | Backend preferences, time pickers |
| `app/(tabs)/library.tsx` | Tab underline style |
| `components/pause/ActiveSession.tsx` | Orb expansion animation |
| `components/pause/GoldenOrb.tsx` | Pulse animation verification |
| `convex/users.ts` | Add updatePreferences mutation |
| `convex/sessions.ts` | Add getStats, listPaginated |
| `services/elevenlabs.ts` | Add streaming TTS |

---

## Success Criteria

- [ ] Progress screen shows real user data
- [ ] Coach actions trigger app navigation
- [ ] Haptics toggle persists across sessions
- [ ] Voice coach records and transcribes speech
- [ ] TTS playback starts within 500ms
- [ ] Dot grid shows exercise variety
- [ ] All animations match Stitch spec durations

---

*Plan generated from deep research synthesis - 2026-01-01*
