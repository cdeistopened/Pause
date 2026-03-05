# Pause App — UI Redesign Brief

*Created: January 21, 2026*

---

## Inspiration Sources

| App | What to Steal |
|-----|---------------|
| **Calm Sleep** | Breathing circle animation, gradient backgrounds, minimal controls |
| **Headspace** | Radial glow from center orb, warm yellows/oranges, playful but calm |
| **Ten Percent Happier** | Bold color cards, duration badges, warm cream palette |
| **Alma** | AI coach card layout, question display, mic in input field |
| **Spotify AI** | "Try asking" suggestion chips, bold question prompts |
| **Remote AI** | Avatar presence for AI, clean chat bubbles |

---

## Design Direction

### Color Palette

**Primary**: Warm gold/amber (keep existing `#d4a954`)

**Backgrounds**:
- Deep navy/charcoal base: `#0A0E1A` → gradient to `#1a1f2e`
- Or warm cream direction: `#FDF8F3` (like Alma/Ten Percent Happier)

**Accent gradients**:
- Gold radial glow for orb: `#d4a954` → `#8B6914` → transparent
- Soft amber for cards: `#FFF8E7`

### Typography
- Headlines: Bold, generous size (32-40px)
- Body: Light/regular weight, good line height
- Duration badges: Small caps or pill style

---

## Screen-by-Screen Redesign

### 1. PAUSE Screen (Home/Orb)

**Current**: Dark flat background, basic orb
**Target**: Headspace/Calm style

```
┌─────────────────────────────────────┐
│                                     │
│         [soft radial glow]          │
│                                     │
│            ╭─────────╮              │
│           │  ✧ orb ✧  │  ← animated │
│            ╰─────────╯     pulsing  │
│                                     │
│          "Take a Pause"             │
│           60 seconds                │
│                                     │
│    [breathing] [light] [count]      │  ← exercise selector
│                                     │
│         ▶ Start                     │
│                                     │
└─────────────────────────────────────┘
```

**Key changes**:
- Radial gradient emanating from orb (gold → dark)
- Orb pulses/breathes subtly
- Exercise type selector as horizontal pills or swipe
- Single prominent "Start" button
- Duration shown clearly

---

### 2. Coach Screen (Voice AI)

**Current**: Basic chat bubbles, mic button
**Target**: Alma + Spotify AI hybrid

```
┌─────────────────────────────────────┐
│  Coach                    [voice]   │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 💬 You Asked               │    │  ← card style
│  │                            │    │     question
│  │ "I'm feeling anxious"      │    │
│  │                            │    │
│  │ just now                   │    │
│  └─────────────────────────────┘    │
│                                     │
│  Let's settle you down. Try 60     │
│  seconds of diaphragmatic          │
│  breathing—feet on floor, hand     │
│  on belly. Ready?                  │
│                                     │
│  [▶ Start Breathing]               │  ← action button
│                                     │
├─────────────────────────────────────┤
│  Try asking                        │
│  ┌──────────┐ ┌──────────────┐     │
│  │I'm anxious│ │Help me focus │     │  ← chips
│  └──────────┘ └──────────────────┘     │
├─────────────────────────────────────┤
│  ┌─────────────────────────┐ 🎤    │
│  │ Ask Dr. Miller...       │       │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Key changes**:
- User question displayed as prominent card (Alma style)
- Response as flowing text below
- Action buttons inline when coach suggests exercise
- "Try asking" chips visible when empty
- Mic button integrated in input field
- Optional: Dr. Miller avatar/icon for personality

---

### 3. Library Screen

**Current**: Unknown/basic list
**Target**: Ten Percent Happier cards

```
┌─────────────────────────────────────┐
│  Library                   🔍       │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🫁 BREATHING              │    │
│  │                            │    │  ← bold color
│  │  Diaphragmatic Breathing   │    │     card
│  │  60 sec · Beginner         │    │
│  │                            │    │
│  │       [▶ Play]             │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  ✨ GOLDEN LIGHT           │    │
│  │                            │    │
│  │  Fill Yourself with Light  │    │
│  │  90 sec · Guided           │    │
│  │                            │    │
│  │       [▶ Play]             │    │
│  └─────────────────────────────┘    │
│                                     │
│  [Counting] [Relaxation] [Talk]    │  ← category filter
│                                     │
└─────────────────────────────────────┘
```

**Key changes**:
- Large, bold colored cards per exercise type
- Clear duration + difficulty badges
- Prominent play buttons
- Category filter pills

---

### 4. Habits/Progress Screen

**Current**: Unknown
**Target**: Simple, warm, encouraging

```
┌─────────────────────────────────────┐
│  Your Progress                      │
├─────────────────────────────────────┤
│                                     │
│  This Week                          │
│  ●●●●●○○  5 of 7 days              │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Breathing      ●●●●●●●●●● 12      │
│  Golden Light   ●●●●●○○○○○  5      │
│  Counting       ●●●○○○○○○○  3      │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  "A little over time is a lot."    │
│                      — Dr. Miller   │
│                                     │
└─────────────────────────────────────┘
```

**Key changes**:
- Cumulative dots (not calendar streaks)
- Per-exercise-type tracking
- Encouraging quote
- Simple, not data-heavy

---

### 5. Tab Bar

**Current**: 5 tabs (PAUSE, Coach, Library, Habits, Settings)
**Target**: Cleaner, maybe 4 tabs

```
┌─────┬─────┬─────┬─────┐
│  ◉  │ 💬  │ 📚  │ ⚙️  │
│Pause│Coach│Library│More│
└─────┴─────┴─────┴─────┘
```

**Options**:
- Merge Habits into Settings
- Or keep 5 but with better icons
- Center the Pause/orb as the hero tab

---

## Component Inventory

| Component | Priority | Notes |
|-----------|----------|-------|
| Animated Orb | P0 | Needs pulsing/breathing animation |
| Gradient Background | P0 | Radial from center |
| Exercise Cards | P1 | Bold colors, duration badges |
| Chat Bubbles | P1 | Card style for user, flowing for AI |
| Suggestion Chips | P1 | "Try asking" prompts |
| Progress Dots | P2 | Cumulative, not calendar |
| Voice Input Button | P2 | Integrated in input field |

---

## Implementation Notes

### Quick Wins (Polish Existing)
1. Add gradient background to PAUSE screen
2. Animate the orb with `react-native-reanimated`
3. Restyle chat bubbles in Coach
4. Add duration badges to Library cards

### Bigger Lifts (Rebuild)
1. Full color system implementation
2. Custom animated orb component
3. Redesigned card components
4. New tab bar design

---

## Questions for User

1. **Light or dark mode?** Alma/Ten Percent = light cream. Calm/Headspace = can do both.
2. **Keep 5 tabs or consolidate to 4?**
3. **Dr. Miller avatar/photo in Coach, or abstract icon?**
4. **Prioritize: Coach screen or PAUSE screen first?**

---

*Next step: Pick one screen to prototype first*
