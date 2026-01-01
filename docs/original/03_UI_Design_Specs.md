# The Pause - UI Design Specifications

## Design Philosophy
- **Invisible interface**: The app should disappear during use. No chrome, no distractions.
- **One screen, one action**: No navigation hierarchy. Open → Pause → Intention → Done.
- **Haptic-first**: The thumb-on-screen mechanic is the signature interaction.
- **Dark and calm**: Reduce visual stimulation. This is a pressure-release tool.

---

## Color Palette

| Role | Color | Hex | Usage |
|---|---|---|---|
| Background | Deep Navy | #0A0E1A | All screens |
| Primary Accent | Golden Amber | #D4A853 | Touch target, light visualization |
| Secondary Accent | Soft Gold | #F5DEB3 | Text highlights, progress indicators |
| Text Primary | Off-White | #F0F0F0 | Prompts, labels |
| Text Secondary | Muted Gray | #8A8A8A | Timestamps, secondary info |

## Typography

| Role | Font | Size | Weight |
|---|---|---|---|
| Primary Prompt | SF Pro Display (iOS) / Roboto (Android) | 28pt | Light |
| Body Text | SF Pro Text / Roboto | 16pt | Regular |
| Labels | SF Pro Text / Roboto | 12pt | Medium |

- Tracking: Slightly expanded (+2%) for calm, breathable feel
- No bold weights except buttons

---

## Screen 1: The Pause (Home/Default)

```
┌─────────────────────────────────────┐
│                              [○]    │  ← Streak indicator (subtle, top-right)
│                                     │
│                                     │
│                                     │
│         Ready to pause?             │  ← Primary prompt (fades during practice)
│                                     │
│              ◉                      │  ← Golden circle (touch target)
│           ╱     ╲                   │     Glows/pulses gently
│          │       │                  │
│          │   ☆   │                  │  ← Body silhouette (abstract)
│          │       │                  │     Fills with light during practice
│           ╲     ╱                   │
│              │                      │
│             ╱ ╲                     │
│                                     │
│                                     │
│       Place thumb to begin          │  ← Instruction (disappears on touch)
│                                     │
└─────────────────────────────────────┘
```

### States
1. **Idle**: Circle pulses gently, prompt visible
2. **Active** (thumb down): Circle expands slightly, body fills with light, audio plays
3. **Complete**: Gentle pulse, transitions to Intention screen

### Haptic Patterns
- **On touch**: Single firm tap (confirmation)
- **During practice**: Very subtle pulse every 15 seconds (grounding reminder)
- **On complete**: Double tap (success)

---

## Screen 2: The Intention

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│                                     │
│                                     │
│       What will you do now?         │  ← Prompt
│                                     │
│    ┌───────────────────────────┐    │
│    │ Finish the report         │    │  ← Text input (single line)
│    └───────────────────────────────┘    │
│                                     │
│              [ Go ]                 │  ← Primary action button
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### Behavior
- Keyboard appears automatically
- "Go" button activates when text is entered
- Tapping "Go" logs intention, shows brief confirmation ("Got it."), then minimizes app or returns to idle

---

## Screen 3: The Streak (Modal Overlay)

```
┌─────────────────────────────────────┐
│                              [✕]    │  ← Close (returns to main)
│                                     │
│                                     │
│              ◐                      │  ← Vessel visualization
│             /   \                   │     Partially filled with golden light
│            |     |                  │     Level represents progress
│            |█████|                  │
│            |█████|                  │
│             \___/                   │
│                                     │
│          47 pauses                  │  ← Total count
│       12 day streak                 │  ← Current streak
│                                     │
│    "A little over time is a lot."  │  ← Dr. Miller quote (rotates)
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### Access
- Tap streak indicator (○) in top-right of main screen
- Slides up as modal overlay
- Tap ✕ or swipe down to dismiss

---

## Animation Principles

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Golden circle pulse | Scale 1.0 → 1.05 → 1.0 | 2s loop | ease-in-out |
| Body fill (light spreading) | Bottom-to-top gradient reveal | 60-90s (matches audio) | linear |
| Screen transitions | Crossfade | 400ms | ease-out |
| Modal (streak) | Slide up from bottom | 300ms | spring |

---

## Accessibility

- **VoiceOver/TalkBack**: Full support for all interactive elements
- **Dynamic Type**: Support iOS/Android text scaling
- **Reduced Motion**: Disable pulse animations, use static states
- **Color contrast**: All text meets WCAG AA (4.5:1 minimum)
- **Haptics**: Can be disabled in settings (minimal settings screen)

---

## Platform Considerations

### iOS
- Safe area compliance (notch, home indicator)
- SF Pro system font
- Native haptic engine (UIFeedbackGenerator)
- Widget potential (future): Quick-launch pause from home screen

### Android
- Edge-to-edge display support
- Roboto system font
- Vibration API for haptics (less nuanced than iOS)
- App shortcut for quick launch

---

## What We're NOT Doing

- Bottom navigation bar (unnecessary for 1-screen app)
- Hamburger menu (nothing to hide in there)
- Onboarding carousel (show, don't tell - first use IS the onboarding)
- Settings bloat (one screen: notifications on/off, haptics on/off, that's it)
- Social sharing buttons (this is private, personal)
- Gamification beyond streak (no badges, no levels, no achievements)
