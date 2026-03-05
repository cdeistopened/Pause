# Pause App — Design Reference

*Consolidated from HTML mockups — January 21, 2026*

---

## Design Tokens

### Colors

```
PRIMARY
  primary:        #d4a954  (warm gold - main brand)
  primary-light:  #f3dfa2  (lighter gold for gradients)
  primary-dark:   #d49619  (darker gold for CTAs)

BACKGROUNDS
  background:     #0A0E1A  (deep navy base)
  surface-dark:   #162235  (card backgrounds)
  surface-light:  #1e2c42  (card hover)
  input-bg:       #1F2937  (form inputs)

TEXT
  text-primary:   #F0F4F8  (white text)
  text-secondary: #8A9BB5  (muted descriptions)
  text-muted:     #B0C4DE  (subtle labels)

ACCENTS
  dot-empty:      #2E3A4D  (progress dot outline)
  glow:           rgba(212, 169, 84, 0.6)
```

### Typography

```
FONTS
  Primary:   Manrope (weights: 200-800)
  Serif:     Playfair Display (for "Take a Pause" headline)

SIZES
  hero-number:    7rem (112px) - big progress number
  timer:          4.5rem (72px) - active session timer
  headline:       2.5rem (40px) - screen titles
  subheadline:    1.5rem (24px) - section headers
  body:           1rem (16px) - descriptions
  caption:        0.875rem (14px) - labels, badges

LINE HEIGHTS
  tight:          1.15 (headlines)
  normal:         1.5 (body)
  relaxed:        1.6 (quotes)
```

### Spacing & Radii

```
RADII
  pill:           9999px (buttons, segmented controls)
  card:           1.5rem (24px)
  large:          2rem (32px)
  orb:            9999px (full circle)

SPACING
  screen-padding: 1.5rem (24px)
  card-padding:   1.5rem (24px)
  section-gap:    2rem (32px)
  element-gap:    0.75rem (12px)
```

### Effects

```
GLOWS
  orb:            0 0 100px -20px rgba(212, 169, 84, 0.5)
  button-cta:     0 10px 40px rgba(212, 169, 84, 0.3)
  text-glow:      0 0 25px rgba(212, 169, 84, 0.6)

BACKGROUNDS
  radial-glow:    radial-gradient(circle, rgba(212, 169, 84, 0.15) 0%, transparent 70%)
  card-gradient:  linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 100%)

ANIMATIONS
  float:          6s ease-in-out infinite (orb bob)
  pulse-slow:     4s cubic-bezier(0.4, 0, 0.6, 1) infinite
  wave:           1.5s ease-in-out infinite (audio bars)
```

---

## Screen Wireframes

### 1. HOME / PAUSE Screen

From: `pause-screen-mockup.html` (user's design)

```
┌─────────────────────────────────────┐
│  [≡]       P A U S E       [⚙️]     │  ← minimal header
├─────────────────────────────────────┤
│                                     │
│         ╭───────────────╮           │
│       ╱                   ╲         │
│      │   ◉ GLOWING ORB ◉   │        │  ← radial gradient
│      │                     │        │     from center
│       ╲                   ╱         │     pulsing animation
│         ╰───────────────╯           │
│                                     │
│         Take a Pause                │  ← Playfair Display
│           60 seconds                │  ← primary/80 color
│                                     │
├─────────────────────────────────────┤
│                                     │
│   ╭────────────────────────────╮    │
│   │ Breathing │ Light │ Count │    │  ← segmented pills
│   ╰────────────────────────────╯    │     bg-white/5
│                                     │
│         ╭────────────────╮          │
│         │  Start Session │          │  ← primary CTA
│         ╰────────────────╯          │     full-width
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Radial gradient background from center
- Floating animated orb with blur glow
- Playfair Display for "Take a Pause"
- Segmented pill selector (not tabs)
- Single prominent CTA button

---

### 2. ACTIVE SESSION / During Pause

From: `during-pause.html`

```
┌─────────────────────────────────────┐
│  [✕]                    🔴 LIVE     │  ← close + live badge
├─────────────────────────────────────┤
│                                     │
│         ╭───────────────╮           │
│       ╱   ││ │││ ││││ │││   ╲       │
│      │   ││ │││ ││││ │││    │       │  ← audio waveform
│      │                      │       │     inside orb
│      │       0:47           │       │  ← large timer
│      │      / 1:30          │       │  ← total time
│      │                      │       │
│       ╲   │││ ││││ │││ ││   ╱       │
│         ╰───────────────╯           │
│                                     │
├─────────────────────────────────────┤
│                                     │
│         Golden Light                │  ← exercise name
│                                     │
│   ████████████░░░░░░░░░░░░░░░       │  ← progress bar
│                                     │
│   "Breathe in the golden light..."  │  ← instruction text
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Large floating orb with audio waveform bars
- Big timer display (tabular nums)
- Progress bar with glow
- Pulsing instruction text
- Close button (not back)
- Live indicator badge

---

### 3. POST-PAUSE / Intention

From: `intention.html`

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│              ╭─────╮                │
│              │  ✓  │                │  ← success checkmark
│              ╰─────╯                │     with glow ring
│                                     │
│         Pause complete              │  ← headline
│                                     │
├─────────────────────────────────────┤
│                                     │
│    What will you carry forward?     │  ← prompt
│                                     │
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   │  Type your intention...     │   │  ← textarea
│   │                             │   │     rounded-3xl
│   └─────────────────────────────┘   │
│                                     │
│         ╭────────────────╮          │
│         │      Done      │          │  ← primary CTA
│         ╰────────────────╯          │
│                                     │
│              Skip →                 │  ← text link
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Success checkmark with pulsing glow
- Simple "Pause complete" headline
- Generous textarea input
- Done button (primary)
- Skip option as text link

---

### 4. PROGRESS Screen

From: `progress.html`

```
┌─────────────────────────────────────┐
│              Progress        ⓘ      │  ← centered title
├─────────────────────────────────────┤
│                                     │
│               147                   │  ← HUGE number
│         Your Pauses (lifetime)      │     with glow
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●   │
│  ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●   │  ← dot grid
│  ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●   │     20 columns
│  ● ● ● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○   │     filled vs empty
│  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○   │
│                                     │
│         365 pauses this year        │  ← goal label
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐    │
│  │ 🔥          │ │ ✓           │    │
│  │             │ │             │    │
│  │   47 days   │ │   89 days   │    │  ← stat cards
│  │ Current     │ │ Longest     │    │     rounded-3xl
│  │ streak      │ │ streak      │    │
│  └─────────────┘ └─────────────┘    │
└─────────────────────────────────────┘
```

**Key Elements:**
- Giant number with text glow
- Dot grid (cumulative, not calendar)
- Stat cards with icons and subtle glow
- Hover lift animation on cards

---

### 5. ONBOARDING - Welcome

From: `onboarding.html`

```
┌─────────────────────────────────────┐
│                                     │
│         ╭───────────────╮           │
│         │               │           │
│         │  [Dr. Miller  │           │
│         │    Photo]     │           │  ← hero image
│         │               │           │     with blur behind
│         │               │           │
│         ╰───────────────╯           │
│                                     │
├─────────────────────────────────────┤
│                                     │
│          Welcome to                 │
│         The Pause                   │  ← primary color
│                                     │
│   "Pause, breathe, and reconnect    │
│    with your inner self."           │  ← italic quote
│                                     │
├─────────────────────────────────────┤
│                                     │
│         ╭────────────────╮          │
│         │  Get Started → │          │  ← primary CTA
│         ╰────────────────╯          │
│                                     │
│    Already have an account? Log in  │
│                                     │
└─────────────────────────────────────┘
```

---

### 6. ONBOARDING - Focus Selection

From: `onboarding-focus.html`

```
┌─────────────────────────────────────┐
│                              [✕]    │  ← close button
├─────────────────────────────────────┤
│                                     │
│   What brings you to The Pause?     │  ← headline
│      Select your primary focus.     │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │ [🏔️ IMAGE]                  │    │
│  │                   [Select]  │    │  ← focus cards
│  │  Reduce Anxiety             │    │     with images
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ [🌅 IMAGE]                  │    │
│  │                   [Select]  │    │
│  │  Improve Focus              │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ [☀️ IMAGE]                  │    │
│  │                   [Select]  │    │
│  │  Build Energy               │    │
│  └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│  [← Back]              [Continue]   │
└─────────────────────────────────────┘
```

---

### 7. COACH Screen (from UI_REDESIGN_BRIEF)

```
┌─────────────────────────────────────┐
│  Coach                    [🔊]      │  ← voice toggle
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 💬 You Asked                │    │  ← card-style
│  │                             │    │     user message
│  │ "I'm feeling anxious"       │    │
│  │                             │    │
│  │ just now                    │    │
│  └─────────────────────────────┘    │
│                                     │
│  Let's settle you down. Try 60      │  ← AI response
│  seconds of diaphragmatic           │     (flowing text)
│  breathing—feet on floor, hand      │
│  on belly. Ready?                   │
│                                     │
│  [▶ Start Breathing]                │  ← action button
│                                     │
├─────────────────────────────────────┤
│  Try asking                         │
│  ┌──────────┐ ┌──────────────┐      │
│  │I'm anxious│ │Help me focus │      │  ← suggestion chips
│  └──────────┘ └──────────────┘      │
├─────────────────────────────────────┤
│  ┌─────────────────────────┐ 🎤     │
│  │ Ask Dr. Miller...       │        │  ← input with mic
│  └─────────────────────────┘        │
└─────────────────────────────────────┘
```

---

### 8. LIBRARY Screen (from UI_REDESIGN_BRIEF)

```
┌─────────────────────────────────────┐
│  Library                     🔍     │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🫁 BREATHING               │    │
│  │                             │    │  ← bold color
│  │  Diaphragmatic Breathing    │    │     card
│  │  60 sec · Beginner          │    │
│  │                             │    │
│  │       [▶ Play]              │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  ✨ GOLDEN LIGHT            │    │
│  │                             │    │
│  │  Fill Yourself with Light   │    │
│  │  90 sec · Guided            │    │
│  │                             │    │
│  │       [▶ Play]              │    │
│  └─────────────────────────────┘    │
│                                     │
│  [Counting] [Relaxation] [Talk]     │  ← category filter
│                                     │
└─────────────────────────────────────┘
```

---

## Component Inventory

### Priority 0 (Core)

| Component | Source | Notes |
|-----------|--------|-------|
| GoldenOrb | pause-screen-mockup | Radial gradient, blur glow, float animation |
| RadialSelector | pause-screen-mockup | Segmented pill with checked state |
| PrimaryButton | All screens | Full-width, gold bg, dark text, shadow glow |

### Priority 1 (Session Flow)

| Component | Source | Notes |
|-----------|--------|-------|
| TimerDisplay | during-pause | Large tabular nums, total time below |
| AudioWaveform | during-pause | Animated bars, symmetric layout |
| ProgressBar | during-pause | Gradient fill with glow |
| SuccessCheckmark | intention | Ring border, pulsing glow |
| IntentionInput | intention | rounded-3xl textarea |

### Priority 2 (Progress & Stats)

| Component | Source | Notes |
|-----------|--------|-------|
| BigNumber | progress | 7rem, text-glow, blur behind |
| DotGrid | progress | 20 cols, filled vs empty dots |
| StatCard | progress | Icon, number, label, hover lift |

### Priority 3 (Onboarding)

| Component | Source | Notes |
|-----------|--------|-------|
| HeroImage | onboarding | Aspect 4:5, gradient overlay |
| FocusCard | onboarding-focus | Background image, select button |

### Priority 4 (Coach)

| Component | Source | Notes |
|-----------|--------|-------|
| UserMessageCard | brief | Card-style with icon |
| SuggestionChips | brief | Horizontal scroll, pill style |
| VoiceInput | brief | Input with mic button |

---

## Implementation Order

### Phase 1: Core Pause Flow
1. GoldenOrb component with animation
2. RadialSelector (segmented control)
3. Home screen layout (PAUSE tab)
4. TimerDisplay + AudioWaveform
5. During-pause screen
6. SuccessCheckmark + IntentionInput
7. Post-pause screen

### Phase 2: Progress
1. BigNumber component
2. DotGrid component
3. StatCard component
4. Progress screen layout

### Phase 3: Coach
1. Chat bubble components
2. SuggestionChips
3. VoiceInput with speech recognition
4. Coach screen layout

### Phase 4: Library + Onboarding
1. Exercise cards
2. Library screen
3. Onboarding flow screens

---

## File References

| Screen | HTML Source |
|--------|-------------|
| Home/PAUSE | `design/pause-screen-mockup.html` |
| Active Session | `design/stitch-outputs/during-pause.html` |
| Post-Pause | `design/stitch-outputs/intention.html` |
| Progress | `design/stitch-outputs/progress.html` |
| Onboarding Welcome | `design/stitch-outputs/onboarding.html` |
| Onboarding Focus | `design/stitch-outputs/onboarding-focus.html` |
| Coach | (ASCII only - from UI_REDESIGN_BRIEF.md) |
| Library | (ASCII only - from UI_REDESIGN_BRIEF.md) |

---

*Use this document as the source of truth for implementing React Native components.*
