# The Pause - App Architecture v1.0

> **Last Updated**: December 2024
> **Status**: MVP Planning
> **Stack**: Expo (React Native) + Convex + Clerk + RevenueCat + ElevenLabs

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [Navigation Structure](#navigation-structure)
3. [Screen-by-Screen Breakdown](#screen-by-screen-breakdown)
4. [Onboarding Flow](#onboarding-flow)
5. [Voice Coach Architecture](#voice-coach-architecture)
6. [Data Model](#data-model)
7. [Notifications System](#notifications-system)
8. [Subscription & Monetization](#subscription--monetization)
9. [Audio & Visual Design](#audio--visual-design)
10. [Content Requirements](#content-requirements)
11. [Technical Implementation Notes](#technical-implementation-notes)

---

## Product Overview

**The Pause** is a mindfulness micro-intervention app featuring Dr. Richard Louis Miller's voice. Users practice short guided exercises (breathing, visualization, counting), set intentions, track habits, and build streaks.

### Core Value Proposition

- **Instant relief**: One tap → 90-second guided pause
- **Voice-first**: Dr. Miller's actual voice guides all exercises
- **Habit building**: "A little over time is a lot" - repeated micro-practices
- **AI coaching** (Premium): Conversational guidance in Dr. Miller's cloned voice

### Target User

- Dr. Miller's existing Instagram/podcast audience (primarily 40-70 age range)
- People seeking practical, non-"woo" mindfulness tools
- Users who want guidance, not gamification

---

## Navigation Structure

### Bottom Tab Navigation (5 tabs)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [ MAIN CONTENT ]                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│   📚        🎙️         ◉          ✓         ⚙️            │
│ Library    Coach     PAUSE     Habits    Settings          │
│                      (Home)                                 │
└─────────────────────────────────────────────────────────────┘
```

| Tab | Name         | Description                                  | Premium? |
| --- | ------------ | -------------------------------------------- | -------- |
| 📚  | Library      | Browse all exercises and mini-lectures       | Partial  |
| 🎙️  | Coach        | Voice conversation with Dr. Miller AI        | Yes      |
| ◉   | Pause (Home) | Main pause experience with exercise selector | No       |
| ✓   | Habits       | Daily checklist and progress tracking        | No       |
| ⚙️  | Settings     | Notifications, subscription, preferences     | No       |

### Default Tab

App opens to **Pause** (center tab) - the golden orb home screen.

---

## Screen-by-Screen Breakdown

### 1. PAUSE (Home Screen)

The central experience. Features:

```
┌─────────────────────────────────────────┐
│                               [47] 🔥   │  ← Streak indicator
│                                         │
│     ┌─────┐   ┌─────┐   ┌─────┐        │
│     │ 🌬️ │   │ ✨ │   │ 🔢 │         │  ← Exercise selector
│     │Breath│  │Light │  │Count│         │     (horizontal scroll)
│     └─────┘   └─────┘   └─────┘        │
│               ┌─────┐   ┌─────┐        │
│               │ 💭 │   │ 😌 │         │
│               │Self │   │Relax│         │
│               │Talk │   │     │         │
│               └─────┘   └─────┘        │
│                                         │
│                  ╭──────╮               │
│                ╱          ╲             │
│               │            │            │
│               │     ◉      │            │  ← Golden Orb
│               │            │            │     Pulses gently
│                ╲          ╱             │     Tap to start
│                  ╰──────╯               │
│                                         │
│         Hold to begin pause             │
│                                         │
│    "Ready when you are."                │  ← Dr. Miller quote
│                                         │
└─────────────────────────────────────────┘
```

#### Exercise Selector

- 5 core exercises displayed as small cards above the orb
- Cards show: icon, short name
- Tap a card to select it (visual highlight)
- Then tap orb to start that exercise
- Default selection: Golden Light (or user's primary habit)

#### Core Exercises (MVP)

1. **Breathing** (🌬️) - Diaphragmatic breathing, 60-90 sec
2. **Golden Light** (✨) - Visualization, 90 sec - 5 min
3. **Counting** (🔢) - Mental focus, 60 sec
4. **Self-Talk** (💭) - Positive affirmations, 60 sec
5. **Relaxation** (😌) - Jacobson's progressive relaxation, 3-5 min

#### During Exercise

- Orb expands and pulses with audio waveform
- Background fills with golden light gradient
- Haptic pulse every 15 seconds
- Progress indicator (subtle)
- Tap anywhere to pause/resume

#### After Exercise

- Transition to Intention screen

---

### 2. INTENTION (Post-Pause Screen)

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│       What will you carry forward?      │
│                                         │
│    ┌───────────────────────────────┐    │
│    │ _                             │    │
│    └───────────────────────────────┘    │
│                                         │
│              [ Done ]                   │
│                                         │
│           or skip →                     │
│                                         │
└─────────────────────────────────────────┘
```

- Single text input
- Keyboard auto-shows
- "Done" logs intention and returns to Pause screen
- "Skip" also returns (intention optional)
- Logged intentions visible in Habits tab history

---

### 3. LIBRARY

```
┌─────────────────────────────────────────┐
│  Library                                │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ [Exercises]  [Learn]            │    │  ← Tab filter
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 🌬️ Diaphragmatic Breathing     │    │
│  │ 90 seconds • Exercise           │    │
│  │                            [▶]  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ✨ Golden Light Visualization   │    │
│  │ 5 minutes • Exercise            │    │
│  │                            [▶]  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 🎓 Setting Your Mood            │    │
│  │ 4 minutes • Mini-Lecture   🔒   │    │  ← Lock = premium
│  │                            [▶]  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ... more content ...                   │
│                                         │
└─────────────────────────────────────────┘
```

#### Content Taxonomy (The 25 Buckets)

All content (Exercises and Learn) is organized into these 25 maximally orthogonal categories:

**Core Exercises (The Big 5)**

1. Conscious Breathing
2. Golden Light Visualization
3. The Witnessing Mind
4. Changing the Channel (Counting)
5. Jacobson’s Progressive Relaxation

**The Pause Philosophy** 6. Saturation vs. Dilution 7. The Mind is a Tool 8. The Rider and the Horse 9. The CLEAR Roadmap

**Daily Practice & Habits** 10. Dawn’s First Decision 11. Morning Gratitude 12. The 3 AM Horror Show 13. Transition Pauses 14. Intention Setting

**Resilience & Specific Challenges** 15. Resilience & Grieving 16. Negative Self-Talk (Inner Critic) 17. Future Horror Movies 18. The Past Trap 19. Breaking Habits (Addiction)

**Lifestyle & Vitality** 20. Movement as Medicine 21. Fueling the Machine 22. The Sacredness of Sleep 23. Nature’s Five Minutes

**Relationships & Connection** 24. Compassionate Communication 25. Social Bravery/Strangers

#### Playback Screen

When content is selected, opens a dedicated player:

- Golden orb visualization (waveform reactive)
- Play/pause button
- Progress bar
- Close button (X) returns to library

---

### 4. COACH (Premium)

```
┌─────────────────────────────────────────┐
│  Coach                         [🔒]     │  ← Premium badge
│                                         │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │    [Dr. Miller Photo/Avatar]   │    │
│  │                                 │    │
│  │    "What's on your mind        │    │
│  │     today?"                    │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ [🎤]  Type or speak...         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Quick prompts:                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │I'm      │ │Help me  │ │What     │   │
│  │anxious  │ │focus    │ │should I │   │
│  │         │ │         │ │do?      │   │
│  └─────────┘ └─────────┘ └─────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

#### For Free Users

Shows upgrade prompt:

```
┌─────────────────────────────────────────┐
│                                         │
│    🎙️ Voice Coaching                   │
│                                         │
│    Get personalized guidance from       │
│    Dr. Miller's AI assistant.           │
│                                         │
│    • Ask questions about your practice  │
│    • Get exercise recommendations       │
│    • Receive personalized check-ins     │
│                                         │
│    [ Upgrade to Premium ]               │
│                                         │
│    $4.99/month or $39.99/year          │
│                                         │
└─────────────────────────────────────────┘
```

#### Coach Conversation Flow (Premium)

1. User speaks or types
2. Audio transcribed (Whisper API or device)
3. LLM generates response with user context (habits, progress, time of day)
4. Response includes optional `action` (navigate to exercise, play content, etc.)
5. ElevenLabs TTS plays Dr. Miller's voice
6. If action specified, UI responds (e.g., highlights exercise, navigates)

---

### 5. HABITS

```
┌─────────────────────────────────────────┐
│  Today's Practice            Dec 16     │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 🌬️ Breathing                   │    │
│  │ 3 of 10 completed today         │    │
│  │ ████████░░░░░░░░░░░░░░░░  30%   │    │
│  │                                 │    │
│  │ Next reminder: 2:00 PM          │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ✨ Golden Light         [✓]    │    │
│  │ Completed today                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 💧 Hydration            [ ]    │    │
│  │ Tap to log                      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ──────────────────────────────────     │
│  🔥 Current Streak: 12 days            │
│  📊 Total Pauses: 147                   │
│  ──────────────────────────────────     │
│                                         │
│  [ View History ]                       │
│                                         │
└─────────────────────────────────────────┘
```

#### Habit Types

1. **In-app habits** (tracked automatically)
   - Conscious Breathing
   - Golden Light
   - Counting
   - The Witnessing Mind
   - Relaxation (Premium)

2. **External habits** (manual check-off)
   - Dawn's First Decision (Mood Set)
   - Morning Gratitude
   - Physical Exercise
   - Hydration
   - Real Food Eating
   - Deep Listening Practice

#### Habit Cards

- Show progress toward daily goal
- Next reminder time
- Tap to log (external) or quick-start (in-app)
- Configurable via Settings or onboarding

---

### 6. SETTINGS

```
┌─────────────────────────────────────────┐
│  Settings                               │
│                                         │
│  NOTIFICATIONS                          │
│  ────────────────────────────────       │
│  Morning check-in         [9:00 AM ▼]  │
│  Evening reflection       [8:00 PM ▼]  │
│                                         │
│  MY HABITS                              │
│  ────────────────────────────────       │
│  🌬️ Breathing                          │
│     Reminders: 10x daily    [Edit →]   │
│                                         │
│  ✨ Golden Light                        │
│     Reminders: Once daily   [Edit →]   │
│                                         │
│  💧 Hydration                           │
│     Reminders: 8x daily     [Edit →]   │
│                                         │
│  [ + Add Habit ]                        │
│                                         │
│  PREFERENCES                            │
│  ────────────────────────────────       │
│  Haptics                    [ ON ]     │
│  Dark mode                  [AUTO]     │
│                                         │
│  ACCOUNT                                │
│  ────────────────────────────────       │
│  Subscription        [ Free → Upgrade ] │
│  Manage subscription                    │
│  Restore purchases                      │
│                                         │
│  ABOUT                                  │
│  ────────────────────────────────       │
│  Version 1.0.0                          │
│  Created by Dr. Richard Louis Miller    │
│  Terms of Service | Privacy Policy      │
│                                         │
└─────────────────────────────────────────┘
```

#### Habit Edit Modal

```
┌─────────────────────────────────────────┐
│  Edit: Breathing              [Done]    │
│                                         │
│  Goal per day                           │
│  [ 1 ][ 5 ][•10•][ 15 ][ 20 ]          │
│                                         │
│  Remind me                              │
│  ○ Don't remind                         │
│  ○ Fixed times     [ Add time + ]       │
│  ● Every X hours   [ 1 ] hour(s)        │
│                                         │
│  Active hours                           │
│  [ 8:00 AM ] to [ 9:00 PM ]            │
│                                         │
│  [ Remove this habit ]                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## Onboarding Flow

First launch only. Goal: Get user practicing within 2 minutes.

### Screen 1: Welcome

```
┌─────────────────────────────────────────┐
│                                         │
│         [Dr. Miller Photo]              │
│                                         │
│    Welcome to The Pause                 │
│                                         │
│    "I'm Dr. Richard Miller.             │
│     For 64 years, I've helped           │
│     people take control of              │
│     their minds. Let's begin."          │
│                                         │
│           [ Get Started ]               │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 2: Pick Your Focus (Multi-select, max 3)

```
┌─────────────────────────────────────────┐
│                                         │
│    What do you want to work on?         │
│    Pick up to 3                         │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ [✓] 🌬️ Breathing Practice      │    │
│  │     Quick calm for anxious      │    │
│  │     moments                     │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ [ ] ✨ Golden Light             │    │
│  │     Visualization for energy    │    │
│  │     and healing                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ [✓] 💧 Hydration               │    │
│  │     Stay on top of water        │    │
│  │     intake                      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ... (Counting, Self-talk, Exercise,    │
│       Gratitude, Morning mood set)      │
│                                         │
│           [ Continue ]                  │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 3: Configure Each Habit (Loops for each selected)

```
┌─────────────────────────────────────────┐
│                                         │
│    🌬️ Breathing Practice               │
│                                         │
│    How many times per day?              │
│                                         │
│    [ 1 ][ 5 ][•10•][ 15 ][ 20 ]        │
│                                         │
│    Dr. Miller recommends 10 sessions    │
│    of 60 seconds throughout the day.    │
│                                         │
│           [ Next ]                      │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 4: Reminder Times

```
┌─────────────────────────────────────────┐
│                                         │
│    When should we check in?             │
│                                         │
│    Morning                              │
│    ┌───────────────────────────────┐    │
│    │      [ 9:00 AM ]              │    │
│    └───────────────────────────────┘    │
│                                         │
│    Evening                              │
│    ┌───────────────────────────────┐    │
│    │      [ 8:00 PM ]              │    │
│    └───────────────────────────────┘    │
│                                         │
│    Your breathing reminders will be     │
│    spread between these times.          │
│                                         │
│           [ Continue ]                  │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 5: Notification Permission

```
┌─────────────────────────────────────────┐
│                                         │
│    Stay on track                        │
│                                         │
│    [Notification illustration]          │
│                                         │
│    We'll send gentle reminders          │
│    to help you build your practice.     │
│                                         │
│    [ Enable Notifications ]             │
│                                         │
│    (I'll do this later)                 │
│                                         │
└─────────────────────────────────────────┘
```

Triggers iOS/Android permission prompt.

### Screen 6: First Pause

```
┌─────────────────────────────────────────┐
│                                         │
│    You're all set.                      │
│                                         │
│    Let's take your first pause.         │
│                                         │
│              ╭──────╮                   │
│            ╱          ╲                 │
│           │            │                │
│           │     ◉      │                │
│           │            │                │
│            ╲          ╱                 │
│              ╰──────╯                   │
│                                         │
│         Tap to begin                    │
│                                         │
└─────────────────────────────────────────┘
```

Completing first pause → lands on main Pause tab with full navigation.

---

## Voice Coach Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        VOICE COACH FLOW                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  User speaks                                                  │
│       ↓                                                       │
│  Device/Whisper transcription                                 │
│       ↓                                                       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    LLM CONTEXT                           │ │
│  │                                                          │ │
│  │  System Prompt:                                          │ │
│  │  - Dr. Miller's persona, speaking style                  │ │
│  │  - Available actions (navigate, play content)            │ │
│  │  - User's current state (habits, progress, time)         │ │
│  │                                                          │ │
│  │  User Context:                                           │ │
│  │  - Selected habits: ["breathing", "hydration"]           │ │
│  │  - Today's progress: {breathing: 3/10, hydration: 2/8}   │ │
│  │  - Current time: 2:30 PM                                 │ │
│  │  - Streak: 12 days                                       │ │
│  │  - Last intention: "finish the report"                   │ │
│  │                                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│       ↓                                                       │
│  LLM Response (structured):                                   │
│  {                                                            │
│    "message": "I hear you're feeling anxious. You've done    │
│               3 breathing sessions today. Let's do one now.", │
│    "action": {                                                │
│      "type": "START_EXERCISE",                                │
│      "exercise": "breathing"                                  │
│    }                                                          │
│  }                                                            │
│       ↓                                                       │
│  ElevenLabs TTS (Dr. Miller voice clone)                      │
│       ↓                                                       │
│  Play audio + Execute action                                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Available Actions

| Action Type      | Parameters          | Effect                                         |
| ---------------- | ------------------- | ---------------------------------------------- |
| `START_EXERCISE` | `exercise: string`  | Navigate to Pause, select exercise, auto-start |
| `PLAY_CONTENT`   | `contentId: string` | Open Library item and play                     |
| `SHOW_HABITS`    | none                | Navigate to Habits tab                         |
| `SHOW_PROGRESS`  | none                | Show streak/stats modal                        |
| `NONE`           | none                | Just conversational response                   |

### Prompt Engineering Notes

The coach should:

- Sound like Dr. Miller (warm, authoritative, practical)
- Reference user's actual data ("You've been doing great with breathing")
- Keep responses short (1-3 sentences for TTS efficiency)
- Default to action when appropriate ("Let's do X" not just "You could do X")
- Handle off-topic gracefully ("I'm here to help with your practice. What's on your mind about that?")
- Never provide medical advice or therapy

---

## Data Model

### Convex Schema

```typescript
// convex/schema.ts

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // User profile and settings
  users: defineTable({
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),

    // Subscription
    subscriptionTier: v.union(v.literal('free'), v.literal('premium')),
    subscriptionExpiresAt: v.optional(v.number()),
    revenueCatUserId: v.optional(v.string()),

    // Preferences
    hapticEnabled: v.boolean(),
    morningReminderTime: v.optional(v.string()), // "09:00"
    eveningReminderTime: v.optional(v.string()), // "20:00"

    // Onboarding
    onboardingCompleted: v.boolean(),

    // Stats
    totalPauses: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastActiveDate: v.optional(v.string()), // "2024-12-16"

    createdAt: v.number(),
  }).index('by_clerk_id', ['clerkId']),

  // User's selected habits with individual settings
  userHabits: defineTable({
    userId: v.id('users'),
    habitType: v.string(), // "breathing", "golden_light", "hydration", etc.

    // Goals
    dailyGoal: v.number(), // e.g., 10 for breathing

    // Reminders
    reminderEnabled: v.boolean(),
    reminderMode: v.union(
      v.literal('fixed_times'),
      v.literal('interval'),
      v.literal('none'),
    ),
    reminderTimes: v.optional(v.array(v.string())), // ["09:00", "12:00", "15:00"]
    reminderIntervalHours: v.optional(v.number()), // e.g., 1
    activeHoursStart: v.optional(v.string()), // "08:00"
    activeHoursEnd: v.optional(v.string()), // "21:00"

    // Ordering
    priority: v.number(), // 1, 2, 3 for top 3

    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_type', ['userId', 'habitType']),

  // Daily habit completion logs
  habitLogs: defineTable({
    userId: v.id('users'),
    habitType: v.string(),
    date: v.string(), // "2024-12-16"
    completedCount: v.number(), // incremented each time
    completedAt: v.array(v.number()), // timestamps of each completion
  })
    .index('by_user_and_date', ['userId', 'date'])
    .index('by_user_habit_date', ['userId', 'habitType', 'date']),

  // Individual pause/exercise sessions
  sessions: defineTable({
    userId: v.id('users'),
    exerciseType: v.string(), // "breathing", "golden_light", etc.
    contentId: v.optional(v.id('content')), // if played from library
    durationSeconds: v.number(),
    completed: v.boolean(),
    completedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_date', ['userId', 'completedAt']),

  // Intentions logged after pauses
  intentions: defineTable({
    userId: v.id('users'),
    sessionId: v.optional(v.id('sessions')),
    text: v.string(),
    createdAt: v.number(),
  }).index('by_user', ['userId']),

  // Content library (exercises and lectures)
  content: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal('exercise'), v.literal('lecture')),
    exerciseType: v.optional(v.string()), // "breathing", etc. for exercises
    durationSeconds: v.number(),
    audioUrl: v.string(), // Convex file storage URL
    thumbnailUrl: v.optional(v.string()),
    isPremium: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
  })
    .index('by_type', ['type'])
    .index('by_exercise_type', ['exerciseType']),

  // Coach conversation history (for context)
  coachMessages: defineTable({
    userId: v.id('users'),
    role: v.union(v.literal('user'), v.literal('assistant')),
    content: v.string(),
    action: v.optional(
      v.object({
        type: v.string(),
        params: v.optional(v.any()),
      }),
    ),
    createdAt: v.number(),
  }).index('by_user', ['userId']),
});
```

### Habit Types (Constants)

```typescript
// constants/habits.ts

export const HABIT_TYPES = {
  // In-app (auto-tracked)
  BREATHING: {
    id: 'breathing',
    name: 'Breathing Practice',
    icon: '🌬️',
    description: 'Quick calm for anxious moments',
    defaultGoal: 10,
    isInApp: true,
  },
  GOLDEN_LIGHT: {
    id: 'golden_light',
    name: 'Golden Light',
    icon: '✨',
    description: 'Visualization for energy and healing',
    defaultGoal: 1,
    isInApp: true,
  },
  COUNTING: {
    id: 'counting',
    name: 'Counting',
    icon: '🔢',
    description: 'Mental focus and thought control',
    defaultGoal: 1,
    isInApp: true,
  },
  SELF_TALK: {
    id: 'self_talk',
    name: 'Positive Self-Talk',
    icon: '💭',
    description: 'Replace criticism with affirmation',
    defaultGoal: 1,
    isInApp: true,
  },
  RELAXATION: {
    id: 'relaxation',
    name: 'Progressive Relaxation',
    icon: '😌',
    description: "Jacobson's technique for body tension",
    defaultGoal: 1,
    isInApp: true,
  },

  // External (manual check-off)
  HYDRATION: {
    id: 'hydration',
    name: 'Hydration',
    icon: '💧',
    description: 'Track water intake',
    defaultGoal: 8,
    isInApp: false,
  },
  EXERCISE: {
    id: 'exercise',
    name: 'Physical Exercise',
    icon: '🏃',
    description: 'Movement is medicine',
    defaultGoal: 1,
    isInApp: false,
  },
  GRATITUDE: {
    id: 'gratitude',
    name: 'Gratitude',
    icon: '🙏',
    description: 'Acknowledge something good',
    defaultGoal: 3,
    isInApp: false,
  },
  MORNING_MOOD: {
    id: 'morning_mood',
    name: 'Set Your Mood',
    icon: '🌅',
    description: 'Start the day with intention',
    defaultGoal: 1,
    isInApp: false,
  },
} as const;
```

---

## Notifications System

### Notification Types

| Type               | Trigger                   | Content Example                         |
| ------------------ | ------------------------- | --------------------------------------- |
| Morning Check-in   | Scheduled (user-set time) | "Good morning. Ready to set your mood?" |
| Evening Reflection | Scheduled (user-set time) | "How did today go? Take a moment."      |
| Breathing Reminder | Interval or fixed times   | "Time for a breath. 30 seconds."        |
| Hydration Reminder | Interval                  | "Don't forget to hydrate. 💧"           |
| Streak at Risk     | 8 PM if no activity       | "Keep your 12-day streak alive!"        |

### Implementation

Using `expo-notifications`:

```typescript
// services/notifications.ts

import * as Notifications from 'expo-notifications';

export async function scheduleHabitReminders(habit: UserHabit) {
  // Cancel existing reminders for this habit
  await cancelHabitReminders(habit.habitType);

  if (!habit.reminderEnabled) return;

  if (habit.reminderMode === 'fixed_times') {
    for (const time of habit.reminderTimes) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'The Pause',
          body: getNotificationBody(habit.habitType),
        },
        trigger: {
          hour: parseInt(time.split(':')[0]),
          minute: parseInt(time.split(':')[1]),
          repeats: true,
        },
      });
    }
  } else if (habit.reminderMode === 'interval') {
    // Schedule repeating notification every X hours within active window
    // ... implementation
  }
}
```

### Permission Flow

1. Request during onboarding (Screen 5)
2. If denied, show banner in Habits tab: "Enable notifications for reminders"
3. Settings shows current permission status with link to system settings

---

## Subscription & Monetization

### Tiers

| Feature                                            | Free | Premium ($4.99/mo or $39.99/yr) |
| -------------------------------------------------- | ---- | ------------------------------- |
| Core exercises (Breathing, Golden Light, Counting) | ✓    | ✓                               |
| Premium exercises (Self-Talk, Relaxation)          | -    | ✓                               |
| Mini-lectures                                      | -    | ✓                               |
| Habit tracking                                     | ✓    | ✓                               |
| Streak tracking                                    | ✓    | ✓                               |
| Voice Coach                                        | -    | ✓                               |
| Unlimited intentions                               | ✓    | ✓                               |

### RevenueCat Integration

```typescript
// services/purchases.ts

import Purchases, { PurchasesPackage } from 'react-native-purchases';

export async function initializePurchases(userId: string) {
  await Purchases.configure({
    apiKey:
      Platform.OS === 'ios'
        ? process.env.REVENUECAT_IOS_KEY
        : process.env.REVENUECAT_ANDROID_KEY,
    appUserID: userId,
  });
}

export async function purchaseSubscription(pkg: PurchasesPackage) {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo.entitlements.active['premium'] !== undefined;
  } catch (e) {
    // Handle error
  }
}

export async function checkSubscriptionStatus(): Promise<boolean> {
  const customerInfo = await Purchases.getCustomerInfo();
  return customerInfo.entitlements.active['premium'] !== undefined;
}
```

### Paywall Trigger Points

1. **Coach tab** (free user) → Upgrade prompt
2. **Premium content in Library** → Upgrade prompt
3. **Settings** → Manage subscription

---

## Audio & Visual Design

### Golden Orb Visualization

The orb responds to audio amplitude:

```typescript
// components/GoldenOrb.tsx

// Use react-native-audio-api or expo-av for audio analysis
// Extract amplitude/volume level
// Map to orb scale: 1.0 (silent) → 1.3 (loud)
// Smooth transitions with Reanimated

const animatedScale = useSharedValue(1);

useEffect(() => {
  // On audio amplitude change
  animatedScale.value = withSpring(1 + amplitude * 0.3, {
    damping: 15,
    stiffness: 100,
  });
}, [amplitude]);
```

### Color Palette (from spec)

```typescript
// constants/colors.ts

export const COLORS = {
  background: '#0A0E1A', // Deep Navy
  primary: '#D4A853', // Golden Amber
  secondary: '#F5DEB3', // Soft Gold
  textPrimary: '#F0F0F0', // Off-White
  textSecondary: '#8A8A8A', // Muted Gray
  success: '#10B981', // Green (for completions)
  premium: '#9333EA', // Purple (premium badge)
};
```

### Haptic Patterns

```typescript
// utils/haptics.ts

import * as Haptics from 'expo-haptics';

export const haptics = {
  onStart: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  onPulse: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  onComplete: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  onTap: () => Haptics.selectionAsync(),
};
```

---

## Content Requirements

### MVP Audio Content Needed

| Content                            | Type       | Duration                     | Priority |
| ---------------------------------- | ---------- | ---------------------------- | -------- |
| Breathing guided exercise          | Exercise   | 90 sec                       | P0       |
| Golden Light visualization         | Exercise   | 90 sec (short), 5 min (full) | P0       |
| Counting exercise                  | Exercise   | 60 sec                       | P0       |
| Self-Talk affirmations             | Exercise   | 60 sec                       | P1       |
| Progressive Relaxation             | Exercise   | 3-5 min                      | P1       |
| Welcome message                    | Onboarding | 15 sec                       | P0       |
| First pause intro                  | Onboarding | 10 sec                       | P0       |
| Streak milestone (10, 25, 50, 100) | Milestone  | 10 sec each                  | P1       |
| Mini-lectures (5-10)               | Lecture    | 3-5 min each                 | P2       |

### Audio File Format

- Format: MP3 or AAC
- Bitrate: 128kbps minimum (320kbps preferred)
- Sample rate: 44.1kHz
- Mono is fine for voice

---

## Technical Implementation Notes

### Project Structure

```
/app
  /(auth)
    sign-in.tsx
    sign-up.tsx
  /(tabs)
    _layout.tsx          # Tab navigator
    index.tsx            # Pause (home)
    library.tsx
    coach.tsx
    habits.tsx
    settings.tsx
  /(onboarding)
    welcome.tsx
    select-habits.tsx
    configure-habit.tsx
    reminder-times.tsx
    notifications.tsx
    first-pause.tsx
  /player
    [contentId].tsx      # Full-screen player
  _layout.tsx            # Root layout

/components
  /pause
    GoldenOrb.tsx
    ExerciseSelector.tsx
    IntentionInput.tsx
  /library
    ContentCard.tsx
    ContentList.tsx
  /coach
    CoachInterface.tsx
    VoiceInput.tsx
    MessageBubble.tsx
  /habits
    HabitCard.tsx
    HabitProgress.tsx
    HabitEditModal.tsx
  /common
    Button.tsx
    Card.tsx
    Modal.tsx

/convex
  schema.ts
  users.ts
  habits.ts
  sessions.ts
  content.ts
  coach.ts

/services
  notifications.ts
  purchases.ts
  elevenlabs.ts
  audio.ts

/hooks
  useAudioPlayer.ts
  useHaptics.ts
  useSubscription.ts
  useCoach.ts

/constants
  colors.ts
  habits.ts

/contexts
  OnboardingContext.tsx
  PlayerContext.tsx
```

### Key Dependencies to Add

```json
{
  "dependencies": {
    "expo-notifications": "...",
    "expo-haptics": "...",
    "expo-av": "...",
    "react-native-purchases": "...",
    "react-native-reanimated": "...",
    "@react-native-voice/voice": "...",
    "expo-file-system": "...",
    "expo-audio": "..."
  }
}
```

### Environment Variables Needed

```
# .env.local

# Clerk
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Convex
CONVEX_DEPLOYMENT=

# RevenueCat
REVENUECAT_IOS_KEY=
REVENUECAT_ANDROID_KEY=

# ElevenLabs
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=

# OpenAI (for coach)
OPENAI_API_KEY=
```

---

## Next Steps

1. **Set up RevenueCat** - Create account, configure products
2. **Clone Dr. Miller's voice** - ElevenLabs voice cloning
3. **Record MVP audio** - Priority 0 content
4. **Build onboarding flow** - First user experience
5. **Build Pause screen** - Core interaction
6. **Build Habits system** - Tracking and reminders
7. **Build Library** - Content browsing and playback
8. **Build Coach** - Voice AI integration
9. **Integrate subscriptions** - Paywall and entitlements
10. **Test and polish** - Haptics, animations, edge cases

---

_Document created: December 2024_
_For implementation, reference this alongside convexGuidelines.md_
