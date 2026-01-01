# The Pause - Wireframes for Google Stitch

> **Purpose**: Generate production-ready mobile UI designs for "The Pause" mindfulness app
> **Platform**: iOS (React Native/Expo)
> **Style**: Dark, minimal, premium. Think Headspace meets Apple Health meets that satisfying dot-grid year tracker.

---

## Brand & Visual Identity

### Color Palette
```
Background:       #0A0E1A (Deep Navy/Almost Black)
Primary Gold:     #D4A853 (Warm Golden Amber)
Secondary Gold:   #F5DEB3 (Soft Gold/Wheat)
Text Primary:     #F0F0F0 (Off-White)
Text Muted:       #6B7280 (Gray-400)
Dot Inactive:     #1F2937 (Gray-800)
Dot Active:       #D4A853 (Golden - same as primary)
Success:          #10B981 (Emerald)
```

### Typography
- **Headlines**: SF Pro Display, Medium/Semibold
- **Body**: SF Pro Text, Regular
- **Numbers/Stats**: SF Pro Rounded or SF Mono

### Design Principles
1. **Dark-first**: Deep navy background, golden accents
2. **Generous whitespace**: Let elements breathe
3. **Haptic-aware**: Every interaction has a physical feel
4. **One action per screen**: No decision paralysis
5. **Progress is visible**: Dots accumulate, never subtract

---

## Screen 1: PAUSE (Home)

The main screen. User opens app → sees this → taps orb → starts practice.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔥 47 day streak                      ⚙️ Settings   │   │ ← Status bar area
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                                                             │
│                   ╭────────────────╮                        │
│                 ╱                    ╲                      │
│               ╱                        ╲                    │
│              │                          │                   │
│              │                          │                   │
│              │      ◉ GOLDEN ORB        │    ← Pulsing     │
│              │      (tap to begin)      │      gently      │
│              │                          │                   │
│              │                          │                   │
│               ╲                        ╱                    │
│                 ╲                    ╱                      │
│                   ╰────────────────╯                        │
│                                                             │
│                    Hold to begin                            │ ← Instruction text
│                                                             │
│                                                             │
│        ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐        │
│        │ 🌬️ │  │ ✨ │  │ 🔢 │  │ 💭 │  │ 😌 │         │ ← Exercise pills
│        │Breath│ │Light│  │Count│  │Talk │  │Relax│         │
│        └─────┘  └─────┘  └─────┘  └─────┘  └─────┘        │
│           ▲                                                 │
│        selected                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│   📚        🎙️           ◉           ✓          ⚙️        │ ← Tab bar
│ Library    Coach       PAUSE      Progress   Settings       │
└─────────────────────────────────────────────────────────────┘
```

### Design Notes for Stitch:
- **Golden Orb**: Large circle (200px diameter), gradient fill from #D4A853 center to #B8860B edge, subtle outer glow, gentle pulse animation (scale 1.0 → 1.02 → 1.0 over 3s)
- **Exercise Pills**: Horizontal scroll, selected one has golden border + slight scale up (1.05x)
- **Background**: Subtle radial gradient, lighter at orb position
- **Tab bar**: Standard iOS tab bar, center icon (PAUSE) is larger + golden

---

## Screen 2: DURING PAUSE (Active Session)

Full-screen immersive experience while audio plays.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                         ✕ close                             │ ← Tap to exit
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                   ╭────────────────╮                        │
│                 ╱                    ╲                      │
│               ╱    ════════════════    ╲    ← Waveform     │
│              │    ═══════════════════   │      inside      │
│              │   ════════════════════   │      orb         │
│              │      ◉ 0:47 / 1:30       │                   │
│              │   ════════════════════   │                   │
│              │    ═══════════════════   │                   │
│               ╲    ════════════════    ╱                    │
│                 ╲                    ╱                      │
│                   ╰────────────────╯                        │
│                                                             │
│                    Golden Light                             │ ← Exercise name
│                                                             │
│                                                             │
│              ════════════════════════════                   │ ← Progress bar
│                                                             │
│                                                             │
│               "Breathe in the golden light..."              │ ← Live caption
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Design Notes for Stitch:
- **Orb expands**: Now fills ~60% of screen height
- **Waveform**: Audio amplitude visualization inside the orb (golden lines)
- **Timer**: Centered in orb, countdown style "0:47 / 1:30"
- **Background**: Gradient intensifies, more golden toward center
- **Live caption**: Optional, fades in/out with audio transcript
- **Tap anywhere**: Pauses/resumes (haptic feedback)

---

## Screen 3: INTENTION (Post-Pause)

Appears immediately after completing a pause.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                          ✓                                  │ ← Checkmark animation
│                                                             │
│                    Pause complete                           │
│                                                             │
│                                                             │
│                                                             │
│           What will you carry forward?                      │ ← Prompt
│                                                             │
│        ┌───────────────────────────────────────┐            │
│        │                                       │            │
│        │  Type your intention...               │            │ ← Text input
│        │                                       │            │
│        └───────────────────────────────────────┘            │
│                                                             │
│                                                             │
│                     [ Done ]                                │ ← Primary button
│                                                             │
│                      Skip →                                 │ ← Skip link
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Design Notes for Stitch:
- **Checkmark**: Animated draw-in, golden color, satisfying
- **Text input**: Dark card (#1F2937), golden border on focus
- **Done button**: Golden fill, rounded, full width minus margins
- **Skip**: Understated text link, not a button
- **Keyboard**: Auto-shows, dark keyboard preferred

---

## Screen 4: PROGRESS (The Dot Grid)

**THIS IS THE KEY INNOVATION** - Replace complex streak visualizations with simple cumulative dots.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     Progress                               ⓘ How it works  │
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │                                                 │    │
│     │               Your Pauses                       │    │
│     │                  147                            │    │ ← Big number
│     │            lifetime practices                   │    │
│     │                                                 │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │                                                 │    │
│     │  ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●     │    │
│     │  ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●     │    │
│     │  ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●     │    │
│     │  ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●     │    │
│     │  ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●     │    │
│     │  ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●     │    │
│     │  ● ● ● ● ● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○     │    │ ← 147 filled
│     │  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○     │    │
│     │  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○     │    │
│     │  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○     │    │
│     │                                                 │    │
│     │              365 pauses this year               │    │ ← Goal label
│     │                                                 │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│     ┌──────────────────┐  ┌──────────────────┐             │
│     │  🔥 47 days      │  │  ⭐ Best: 89     │             │ ← Stat cards
│     │  current streak  │  │  longest streak  │             │
│     └──────────────────┘  └──────────────────┘             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│   📚        🎙️           ◉           ✓          ⚙️        │
│ Library    Coach       PAUSE      Progress   Settings       │
└─────────────────────────────────────────────────────────────┘
```

### Design Notes for Stitch:
- **Dot Grid**: 20 columns × ~18 rows = 360 dots (or adjust for 365)
- **Filled dots**: Golden (#D4A853)
- **Empty dots**: Dark gray (#1F2937) or very subtle (#2D3748)
- **Animation**: When user completes pause, new dot lights up with satisfying pulse
- **Tap dot**: Shows date + which exercise was done that day (tooltip)
- **Stat cards**: Rounded rectangles, subtle border, icon + number + label

### Alternative: Exercise-Colored Dots
```
● = Breathing (Blue)
● = Golden Light (Gold)
● = Counting (Green)
● = Self-Talk (Purple)
● = Relaxation (Teal)
```
This would make the grid more visually interesting and show exercise variety.

---

## Screen 5: LIBRARY

Browse all exercises and mini-lectures.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     Library                                                 │
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │  [Exercises]      [Learn]                       │    │ ← Segment control
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │                                                 │    │
│     │  🌬️  Diaphragmatic Breathing                   │    │
│     │      90 seconds • Calm anxiety quickly         │    │
│     │                                          [▶]   │    │
│     │                                                 │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │                                                 │    │
│     │  ✨  Golden Light Visualization                 │    │
│     │      90 sec – 5 min • Energy & healing         │    │
│     │                                          [▶]   │    │
│     │                                                 │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │                                                 │    │
│     │  🔢  Counting Practice                          │    │
│     │      60 seconds • Focus & mental control       │    │
│     │                                          [▶]   │    │
│     │                                                 │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │                                                 │    │
│     │  🎓  Setting Your Mood        🔒 PREMIUM       │    │
│     │      4 min lecture • Start day intentionally   │    │
│     │                                          [▶]   │    │
│     │                                                 │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│   📚        🎙️           ◉           ✓          ⚙️        │
│ Library    Coach       PAUSE      Progress   Settings       │
└─────────────────────────────────────────────────────────────┘
```

### Design Notes for Stitch:
- **Content cards**: Dark card background, subtle left border accent
- **Play button**: Golden circle with white play icon
- **Premium lock**: Small badge, purple accent color
- **Segment control**: iOS-native style, golden selection indicator

---

## Screen 6: COACH (Premium)

AI voice conversation with Dr. Miller's cloned voice.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     Coach                                  🔒 Premium       │
│                                                             │
│                                                             │
│              ┌───────────────────────┐                      │
│              │                       │                      │
│              │   [Dr. Miller Avatar] │                      │
│              │                       │                      │
│              │   "What's on your     │                      │
│              │    mind today?"       │                      │
│              │                       │                      │
│              └───────────────────────┘                      │
│                                                             │
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │                                                 │    │
│     │  I'm feeling anxious about a meeting           │    │ ← User message
│     │                                                 │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │                                                 │    │
│     │  I hear you. Let's do a quick breathing        │    │ ← Coach response
│     │  exercise before that meeting. Ready?          │    │
│     │                                                 │    │
│     │              [ Start Breathing ]               │    │ ← Inline action
│     │                                                 │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │  [🎤]  Type or speak...                        │    │ ← Input
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│     ┌─────────┐ ┌─────────┐ ┌─────────┐                    │
│     │I'm      │ │Help me  │ │What's   │     ← Quick       │
│     │anxious  │ │focus    │ │best for │       prompts     │
│     └─────────┘ └─────────┘ └─────────┘                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│   📚        🎙️           ◉           ✓          ⚙️        │
│ Library    Coach       PAUSE      Progress   Settings       │
└─────────────────────────────────────────────────────────────┘
```

### Design Notes for Stitch:
- **Avatar**: Circular, warm photo of Dr. Miller or stylized illustration
- **Message bubbles**: User = right-aligned, gray. Coach = left-aligned, subtle golden tint
- **Mic button**: Large, golden, prominent
- **Quick prompts**: Horizontal scroll, pill-shaped buttons

---

## Screen 7: ONBOARDING (4 screens)

### 7a. Welcome
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                                                             │
│              ┌───────────────────────┐                      │
│              │                       │                      │
│              │   [Dr. Miller Photo]  │                      │
│              │                       │                      │
│              └───────────────────────┘                      │
│                                                             │
│                                                             │
│              Welcome to The Pause                           │
│                                                             │
│         "I'm Dr. Richard Miller. For 64 years,             │
│          I've helped people take control of                │
│          their minds. Let me show you how."                │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                   [ Get Started ]                           │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7b. Select Your Focus (Multi-select, max 3)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      ← Back                                 │
│                                                             │
│           What do you want to work on?                      │
│                   Pick up to 3                              │
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │  [✓]  🌬️  Breathing Practice                   │    │
│     │       Calm anxiety in 60 seconds               │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │  [ ]  ✨  Golden Light                          │    │
│     │       Visualization for energy & healing       │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │  [ ]  🔢  Counting                              │    │
│     │       Mental focus and thought control         │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │  [✓]  💧  Hydration                            │    │
│     │       Track your water intake                  │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│                   [ Continue ]                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7c. First Pause
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                    You're all set.                          │
│                                                             │
│              Let's take your first pause.                   │
│                                                             │
│                                                             │
│                   ╭────────────────╮                        │
│                 ╱                    ╲                      │
│               ╱                        ╲                    │
│              │                          │                   │
│              │          ◉               │                   │
│              │                          │                   │
│               ╲                        ╱                    │
│                 ╲                    ╱                      │
│                   ╰────────────────╯                        │
│                                                             │
│                    Tap to begin                             │
│                                                             │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Haptic Feedback Specification

**Every interaction should have a physical feel.**

| Action | Haptic Type | iOS API | Feel |
|--------|-------------|---------|------|
| Tap orb to start | `Medium Impact` | `UIImpactFeedbackGenerator(.medium)` | Solid "thunk" |
| Hold orb (long press) | `Heavy Impact` | `UIImpactFeedbackGenerator(.heavy)` | Deep satisfying press |
| Session starts | `Success Notification` | `UINotificationFeedbackGenerator(.success)` | "You're in" |
| Every 15 sec during pause | `Light Impact` | `UIImpactFeedbackGenerator(.light)` | Gentle pulse reminder |
| Session complete | `Success Notification` | `UINotificationFeedbackGenerator(.success)` | Celebration |
| Dot added to grid | `Soft Impact` | `UIImpactFeedbackGenerator(.soft)` | Satisfying "pop" |
| Select exercise pill | `Selection Changed` | `UISelectionFeedbackGenerator()` | Light click |
| Tab navigation | `Selection Changed` | `UISelectionFeedbackGenerator()` | Light click |
| Button press | `Light Impact` | `UIImpactFeedbackGenerator(.light)` | Responsive |
| Error/invalid | `Error Notification` | `UINotificationFeedbackGenerator(.error)` | "Nope" |

### Haptic Pattern: During Pause
```
0:00 - Heavy impact (START)
0:15 - Light pulse
0:30 - Light pulse
0:45 - Light pulse
1:00 - Light pulse
1:15 - Light pulse
1:30 - Success notification (COMPLETE)
```

### Expo Haptics Implementation
```typescript
import * as Haptics from 'expo-haptics';

const haptics = {
  start: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  pulse: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  complete: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  select: () => Haptics.selectionAsync(),
  dotPop: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
};
```

---

## Animation Specifications

### Golden Orb - Idle State
- **Scale**: Pulse between 1.0 → 1.02 → 1.0
- **Duration**: 3 seconds, ease-in-out, infinite loop
- **Glow**: Outer shadow pulses in sync

### Golden Orb - Pressed
- **Scale**: Shrink to 0.95 immediately
- **Duration**: 100ms

### Golden Orb - Active Session
- **Scale**: Expand to fill 60% screen height (300ms ease-out)
- **Waveform**: Audio amplitude controls inner line heights

### Dot Added to Grid
- **Initial**: Scale 0, opacity 0
- **Final**: Scale 1, opacity 1
- **Duration**: 300ms with bounce overshoot (scale to 1.2, back to 1.0)
- **Color**: Flash white, settle to gold

### Checkmark (Post-Pause)
- **Draw**: Path animation from 0% to 100%
- **Duration**: 400ms
- **Bounce**: Scale 1.0 → 1.1 → 1.0 at end

### Tab Transition
- **Type**: Cross-fade with slight slide (iOS default)
- **Duration**: 250ms

---

## Responsive Notes

- **Safe areas**: Respect notch and home indicator
- **Orb sizing**: Relative to screen width (60% on small phones, 50% on Plus/Max)
- **Dot grid**: Columns adjust based on screen width (16-20 columns)
- **Text scaling**: Support Dynamic Type accessibility settings

---

## Export Checklist for Figma

After Stitch generates designs:

1. [ ] Export all screens at 1x, 2x, 3x for iOS
2. [ ] Create component library: Buttons, Cards, Pills, Dots
3. [ ] Define all color styles
4. [ ] Define all text styles
5. [ ] Create prototype with tap interactions
6. [ ] Export icon set (SF Symbols alternatives)

---

*Generated for The Pause MVP - December 2024*
