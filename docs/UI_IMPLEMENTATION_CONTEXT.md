# UI Implementation Context Document

> **Purpose**: Foundation document for the UI/UX implementation workstream. Use this to spin off a separate conversation for building screens.
> **Last Updated**: December 2024

---

## Project Overview

**The Pause** is a mindfulness micro-intervention app featuring Dr. Richard Louis Miller (85-year-old clinical psychologist). The app helps users "take control of their minds" through quick 60-90 second exercises.

### Core Value Proposition
- Micro-interventions (30-90 seconds)
- Dr. Miller's voice and methodology
- Habit stacking for consistency
- Premium voice coach feature

---

## Tech Stack

- **Framework**: Expo + React Native (SDK 53)
- **Navigation**: Expo Router (file-based)
- **Backend**: Convex (real-time database)
- **Auth**: Clerk
- **Subscriptions**: RevenueCat ($4.99/mo or $39.99/yr)
- **Styling**: React Native StyleSheet (no Tailwind/NativeWind)

---

## Current Project Structure

```
/app
  /(auth)
    sign-in.tsx
    sign-up.tsx
  /(tabs)
    _layout.tsx      # 5-tab navigation
    index.tsx        # PAUSE screen (home)
    library.tsx      # Content library
    coach.tsx        # Voice coach (premium)
    habits.tsx       # Habit tracking
    settings.tsx     # Settings
  _layout.tsx        # Root layout with providers

/components
  /common
    index.ts         # Empty - components to be built

/constants
  colors.ts          # Design system colors
  habits.ts          # Habit definitions

/convex
  schema.ts          # Database schema
  users.ts           # User operations

/docs
  DESIGN_PROMPTS.md  # Wireframe prompts for design tools
  APP_ARCHITECTURE.md
  IMPLEMENTATION_TASKS.md
```

---

## Design System

### Colors (from `/constants/colors.ts`)

```typescript
export const COLORS = {
  // Backgrounds
  background: '#0A0E1A',        // Deep Navy - all screens
  backgroundLight: '#1A1F2E',   // Cards, inputs

  // Primary (Golden)
  primary: '#D4A853',           // Golden Amber - touch targets, accents
  primaryLight: '#F5DEB3',      // Soft Gold - highlights
  primaryGlow: 'rgba(212, 168, 83, 0.3)', // Glow effects

  // Text
  textPrimary: '#F0F0F0',       // Off-White - main text
  textSecondary: '#8A8A8A',     // Muted Gray - secondary
  textMuted: '#5A5A5A',         // Hints, placeholders

  // Semantic
  premium: '#9333EA',           // Purple - premium badges
  success: '#10B981',           // Green - completions
  error: '#EF4444',             // Red - errors

  // Tab bar
  tabBarBackground: '#0D1117',
  tabBarActive: '#D4A853',
  tabBarInactive: '#5A5A5A',
} as const;
```

### Typography

| Role | Font | Size | Weight |
|------|------|------|--------|
| Headlines | SF Pro Display | 24-28pt | Light |
| Body | SF Pro Text | 16pt | Regular |
| Labels | SF Pro Text | 12-14pt | Medium |
| Orbital labels | SF Pro Text | 12pt caps | Medium |

- Letter-spacing: Slightly expanded (+2%) for calm feel
- No bold weights except buttons

### Shapes & Spacing

- Border radius: 12px (cards), 25px (buttons/pills)
- Horizontal margins: 20px
- Generous vertical spacing
- Golden glow: `box-shadow: 0 0 30px rgba(212, 168, 83, 0.3)`

---

## Screen Specifications

### 1. PAUSE Screen (Home) - `app/(tabs)/index.tsx`

**Current State**: Basic placeholder with exercise cards
**Target State**: Orbital ring selector around golden orb

#### Layout
```
┌─────────────────────────────────────┐
│                              🔥 47  │  ← Streak (top-right)
│                                     │
│              BREATH                 │  ← Orbital label (top)
│                                     │
│     RELAX 🔒    ◉      LIGHT       │  ← Orb center, labels orbit
│                                     │
│               COUNT                 │  ← Orbital label (bottom)
│                                     │
│          Hold to begin              │
│        Ready when you are.          │
│                                     │
├─────────────────────────────────────┤
│ 📚    🎙️    ◉    ✓    ⚙️           │  ← Tab bar
└─────────────────────────────────────┘
```

#### Components Needed
- `GoldenOrb` - Animated pulsing orb with glow
- `OrbitalSelector` - Text labels arranged in circle
- `StreakBadge` - Top-right streak counter

#### Interaction
1. User swipes/taps orbital labels to select exercise
2. Long-press on orb starts exercise
3. Selected label glows golden, others muted

#### Animation Notes
- Orb pulses gently (scale 1.0 → 1.05, 2s loop)
- Glow intensity varies with pulse
- Selection change has subtle fade transition

### 2. Active Session Screen

**Trigger**: Long-press on orb from PAUSE screen
**Type**: Full-screen modal overlay

#### Layout
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│                                     │
│              ◉◉◉                    │  ← Expanded orb (280px)
│            ◉     ◉                  │     with body silhouette
│           ◉   ☆   ◉                 │     filling with light
│            ◉     ◉                  │
│              ◉◉◉                    │
│                                     │
│            ───○───                  │  ← Progress ring
│              0:47                   │  ← Timer
│                                     │
└─────────────────────────────────────┘
```

#### Components Needed
- `ExpandedOrb` - Larger orb with body silhouette
- `ProgressRing` - Circular progress indicator
- `SessionTimer` - Elapsed time display

#### Animation
- Body silhouette fills with golden light (bottom to top)
- Progress ring advances over 60-90 seconds
- Audio waveform visualization in orb (optional)

### 3. Intention Screen (Post-Session)

**Trigger**: After session completes
**Type**: Screen transition or modal

#### Layout
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│                                     │
│    What will you carry forward?     │
│                                     │
│    ┌───────────────────────────┐    │
│    │ Your intention...         │    │
│    └───────────────────────────┘    │
│                                     │
│           [ Done ]                  │
│                                     │
│           or skip →                 │
│                                     │
└─────────────────────────────────────┘
```

#### Components Needed
- `IntentionInput` - Styled text input
- `GoldenButton` - Primary action button

### 4. Habits Screen - `app/(tabs)/habits.tsx`

**Current State**: Placeholder
**Target State**: Vessel visualization + habit cards

#### Layout
```
┌─────────────────────────────────────┐
│  Today's Practice          Dec 17  │
│                                     │
│              ╱   ╲                  │  ← Vessel/chalice
│             │█████│                 │     65% filled
│             │█████│                 │     with golden light
│              \___/                  │
│                                     │
│         Today's light: 65%          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🌬️ Breathing    3/10    ○─ │   │  ← Habit cards
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ✨ Golden Light  ✓     ●  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 💧 Hydration    2/8    ○  │   │
│  └─────────────────────────────┘   │
│                                     │
│   🔥 12 day streak  │  📊 147 total │
│                                     │
├─────────────────────────────────────┤
│ 📚    🎙️    ◉    ✓    ⚙️           │
└─────────────────────────────────────┘
```

#### Components Needed
- `VesselVisualization` - Animated chalice filling with light
- `HabitCard` - Individual habit with progress
- `StatsBar` - Streak and total counts

### 5. Coach Screen - `app/(tabs)/coach.tsx`

**Current State**: Placeholder
**Target State**: Chat interface with Dr. Miller avatar
**Note**: Premium feature - show upgrade prompt for free users

#### Layout (Premium User)
```
┌─────────────────────────────────────┐
│  Coach                    PREMIUM   │
│                                     │
│              ┌───┐                  │
│              │ 👤 │                  │  ← Dr. Miller avatar
│              └───┘                  │
│    "What's on your mind today?"     │
│                                     │
│                                     │  ← Chat area
│                                     │
│  ┌─────┬─────┬─────────────────┐   │
│  │I'm  │Help │What should      │   │  ← Quick prompts
│  │anxio│me   │I do?            │   │
│  └─────┴─────┴─────────────────┘   │
│                                     │
│  ┌────────────────────────────┐    │
│  │ 🎤 │ Type or speak...      │    │  ← Input bar
│  └────────────────────────────┘    │
├─────────────────────────────────────┤
│ 📚    🎙️    ◉    ✓    ⚙️           │
└─────────────────────────────────────┘
```

#### Components Needed
- `CoachAvatar` - Dr. Miller image/placeholder
- `ChatBubble` - Message bubbles (left: coach, right: user)
- `QuickPrompts` - Tappable suggestion chips
- `VoiceInputBar` - Mic button + text input

### 6. Library Screen - `app/(tabs)/library.tsx`

**Current State**: Placeholder
**Target State**: Content categories with lecture/exercise listings

#### Layout
```
┌─────────────────────────────────────┐
│  Library                            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔍 Search...                │   │
│  └─────────────────────────────┘   │
│                                     │
│  Guided Exercises                   │
│  ┌─────────┬─────────┬─────────┐   │
│  │Breathing│Golden   │Counting │   │
│  │         │Light    │         │   │
│  └─────────┴─────────┴─────────┘   │
│                                     │
│  Mini Lectures                      │
│  ┌─────────────────────────────┐   │
│  │ Mind Control Basics    5:32 │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ The Past is a Trap     4:18 │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ 📚    🎙️    ◉    ✓    ⚙️           │
└─────────────────────────────────────┘
```

### 7. Settings Screen - `app/(tabs)/settings.tsx`

Minimal settings:
- Notifications on/off
- Haptics on/off
- Account info
- Book a call link
- Sign out

### 8. Upgrade/Paywall Screen

**Trigger**: Free user taps Coach tab or locked exercise
**Type**: Modal overlay

---

## 5-Tab Navigation

Current implementation in `app/(tabs)/_layout.tsx`:

```typescript
// Tab configuration
const tabs = [
  { name: 'library', icon: BookOpen, label: 'Library' },
  { name: 'coach', icon: Mic, label: 'Coach' },
  { name: 'index', icon: null, label: '' },  // Center orb
  { name: 'habits', icon: CheckCircle, label: 'Habits' },
  { name: 'settings', icon: Settings, label: 'Settings' },
];
```

Center tab should be:
- Elevated/raised
- Small golden orb icon
- No label text

---

## Habit Definitions (from `/constants/habits.ts`)

### In-App Habits (tied to exercises)
```typescript
export const IN_APP_HABITS = [
  { id: 'breathing', name: 'Breathing', icon: '🌬️', defaultFrequency: 10 },
  { id: 'golden_light', name: 'Golden Light', icon: '✨', defaultFrequency: 3 },
  { id: 'counting', name: 'Counting', icon: '🔢', defaultFrequency: 5 },
  { id: 'self_talk', name: 'Self Talk', icon: '💬', defaultFrequency: 3 },
  { id: 'relaxation', name: 'Relaxation', icon: '🧘', premium: true, defaultFrequency: 2 },
];
```

### External Habits (manual logging)
```typescript
export const EXTERNAL_HABITS = [
  { id: 'hydration', name: 'Hydration', icon: '💧', defaultFrequency: 8 },
  { id: 'exercise', name: 'Exercise', icon: '🏃', defaultFrequency: 1 },
  { id: 'gratitude', name: 'Gratitude', icon: '🙏', defaultFrequency: 3 },
];
```

---

## Convex Schema (relevant tables)

```typescript
// User habits configuration
userHabits: defineTable({
  userId: v.string(),
  habitId: v.string(),
  frequency: v.number(),        // times per day
  isActive: v.boolean(),
  createdAt: v.number(),
})

// Habit completion logs
habitLogs: defineTable({
  userId: v.string(),
  habitId: v.string(),
  completedAt: v.number(),
  duration: v.optional(v.number()),
})

// Session records (pauses)
sessions: defineTable({
  userId: v.string(),
  exerciseType: v.string(),     // breathing, golden_light, etc.
  duration: v.number(),
  completedAt: v.number(),
  intention: v.optional(v.string()),
})

// User stats
users: defineTable({
  clerkId: v.string(),
  totalPauses: v.number(),
  currentStreak: v.number(),
  longestStreak: v.number(),
  lastPauseAt: v.optional(v.number()),
})
```

---

## Implementation Tasks (UI Focus)

### Phase 1: Core Pause Experience
- [ ] Build `GoldenOrb` component with pulse animation
- [ ] Build `OrbitalSelector` with 4 exercise labels
- [ ] Implement swipe/tap selection on orbital ring
- [ ] Build `StreakBadge` component
- [ ] Wire up PAUSE screen layout

### Phase 2: Active Session
- [ ] Build `ExpandedOrb` with body silhouette
- [ ] Build `ProgressRing` component
- [ ] Implement session timer logic
- [ ] Add haptic feedback patterns
- [ ] Build session completion transition

### Phase 3: Intention Capture
- [ ] Build `IntentionInput` component
- [ ] Build `GoldenButton` component
- [ ] Wire up intention storage to Convex

### Phase 4: Habits Screen
- [ ] Build `VesselVisualization` component
- [ ] Build `HabitCard` component
- [ ] Build `StatsBar` component
- [ ] Wire up habit data from Convex

### Phase 5: Library Screen
- [ ] Build content list components
- [ ] Build search functionality
- [ ] Wire up content from Convex

### Phase 6: Coach Screen
- [ ] Build chat UI components
- [ ] Build voice input bar
- [ ] Implement premium gate
- [ ] Wire up to voice coach backend (separate workstream)

---

## Animation Principles

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Golden orb pulse | Scale 1.0 → 1.05 → 1.0 | 2s loop | ease-in-out |
| Body fill | Bottom-to-top gradient | 60-90s | linear |
| Screen transitions | Crossfade | 400ms | ease-out |
| Modal (streak) | Slide up | 300ms | spring |
| Selection change | Opacity fade | 200ms | ease-out |

---

## Accessibility Requirements

- VoiceOver/TalkBack support for all interactive elements
- Dynamic Type support (iOS/Android text scaling)
- Reduced Motion: disable pulse animations, use static states
- Color contrast: WCAG AA (4.5:1 minimum)
- Haptics can be disabled in settings

---

## Platform Considerations

### iOS
- Safe area insets (notch, home indicator)
- SF Pro system fonts
- UIFeedbackGenerator for haptics
- Potential widget (future)

### Android
- Edge-to-edge display
- Roboto system fonts
- Vibration API for haptics
- App shortcuts

---

## Related Documents

- [DESIGN_PROMPTS.md](DESIGN_PROMPTS.md) - Ready-to-use prompts for wireframing tools
- [APP_ARCHITECTURE.md](APP_ARCHITECTURE.md) - Full app architecture
- [IMPLEMENTATION_TASKS.md](IMPLEMENTATION_TASKS.md) - Complete task breakdown
- [VOICE_CLONE_CONTEXT.md](VOICE_CLONE_CONTEXT.md) - Voice coach implementation

---

*Document for: UI Implementation Workstream*
*Start with: Phase 1 - Core Pause Experience*
