# The Pause - Current State

> Last updated: December 31, 2024
> See `handoffs/` for session history

---

## Quick Start

```bash
npm run dev              # Start Expo (port 8081)
npx convex dev           # Start Convex backend (separate terminal)
```

**App is runnable.** Voice coach works with Gemini + ElevenLabs.

---

## What's Working

| Feature | Status | Notes |
|---------|--------|-------|
| PAUSE home screen | ✅ | TRUE radial layout, 5 exercises around orb |
| Golden orb | ✅ | Breathing animation, size prop |
| Floating tab bar | ✅ | Pill-shaped, icon-only |
| Voice coach | ✅ | Gemini 2.0 Flash + ElevenLabs TTS |
| Progress/Habits | ✅ | Dot grid (best looking screen) |
| Settings | ✅ | Basic settings, needs polish |
| Library | ⚠️ | Functional, needs Stitch design polish |
| Onboarding | ⚠️ | 5 screens exist, need refinement |
| During Pause | ⚠️ | Timer works, needs waveform viz |

---

## What's Next (Prioritized)

### High Priority
1. **During Pause Screen** - Audio waveform visualization, match Stitch design
2. **Library Screen** - Tab underlines (not pills), 64px icons, Stitch polish
3. **Coach Screen** - Dr. Miller avatar with green dot, gold message bubbles

### Medium Priority
4. Fix iOS Simulator (requires `sudo xcode-select -s /Applications/Xcode.app`)
5. Onboarding flow polish

---

## Design System

### Colors (Canonical)

| Token | Value | Usage |
|-------|-------|-------|
| Primary Gold | `#d4a954` | Everything gold |
| Gold Light | `#e8c87e` | Highlights, orb center |
| Gold Dark | `#b8923f` | Pressed states |
| Text Gold | `#FFEBB8` | Coach messages |
| Background | `#0A0E1A` | Main background |
| Surface | `#162235` | Cards, inputs |

### Key Design Files
- `design/stitch-outputs/STITCH_DESIGNS_REFERENCE.md` - Full Stitch spec
- `constants/colors.ts` - Canonical palette
- `tailwind.config.js` - NativeWind theme

---

## Architecture

```
app/
├── (tabs)/
│   ├── index.tsx        # PAUSE home (radial layout)
│   ├── coach.tsx        # Voice coach
│   ├── library.tsx      # Content library
│   ├── habits.tsx       # Progress dots
│   └── settings.tsx     # Settings
├── (onboarding)/        # 5 onboarding screens
components/pause/
├── GoldenOrb.tsx        # Animated orb
├── RadialSelector.tsx   # TRUE radial layout
├── ActiveSession.tsx    # During-pause timer
└── IntentionScreen.tsx  # Post-pause capture
services/
├── gemini.ts            # LLM coach (Gemini 2.0 Flash)
└── elevenlabs.ts        # TTS (Dr. Miller voice)
```

---

## Environment Variables

File: `.env.local`

```
EXPO_PUBLIC_GEMINI_API_KEY=...
EXPO_PUBLIC_ELEVENLABS_API_KEY=...
EXPO_PUBLIC_ELEVENLABS_VOICE_ID=gn39AkrRBGmOUvxXfY8S
```

**Note:** Must use `EXPO_PUBLIC_` prefix for client-side access.

---

## Known Issues

1. **iOS Simulator** - xcrun simctl error, needs Xcode CLI tools reconfigured
2. **TypeScript errors** - Pre-existing in auth screens (non-blocking)
3. **Package versions** - Minor react-native version mismatch warnings

---

## Recent Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Radial layout | CSS transforms | User preference, cleaner than absolute positioning |
| Gold color | `#d4a954` | Stitch canonical |
| Exercises | All 5 free | MVP scope |
| Tab bar | Floating pill | Matches Stitch design |

---

## Handoff System

- **This file** (`HANDOFF.md`) = Current state, always up to date
- **`handoffs/YYYY-MM-DD.md`** = Archived session history
- **`handoffs/README.md`** = System documentation

Run `/handoff` at session end to archive and update.
