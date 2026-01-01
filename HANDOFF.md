# The Pause - Current State

> Last updated: January 1, 2026
> See `handoffs/` for session history

---

## Quick Start

```bash
npm run dev              # Start Expo (port 8081)
npx convex dev           # Start Convex backend (separate terminal)
```

**App is production-ready.** Voice coach works with Gemini 3 Flash + ElevenLabs.

---

## What's Working

| Feature | Status | Notes |
|---------|--------|-------|
| PAUSE home screen | ✅ | TRUE radial layout, 5 exercises around orb |
| Golden orb | ✅ | Breathing animation, size prop |
| Floating tab bar | ✅ | Pill-shaped, icon-only |
| Voice coach | ✅ | Gemini 3 Flash + ElevenLabs TTS, action execution |
| Progress/Habits | ✅ | Exercise-colored dots, real backend data |
| Settings | ✅ | Haptics toggle persists to backend |
| Library | ✅ | Tab underline style, backend connected |
| Onboarding | ✅ | 5 screens, marks completion in backend |
| During Pause | ✅ | Timer, waveform viz, breathing haptics |
| Auth flow | ✅ | Clerk + Convex fully wired |
| Error handling | ✅ | ErrorBoundary with retry UI |
| Input validation | ✅ | All user inputs sanitized |
| Accessibility | ✅ | Labels on all interactive elements |

---

## What's Next (For Dr. Miller / Production Launch)

### Still Needed
1. **Dr. Miller content** - Real audio recordings for 4 exercises
2. **App Store assets** - Screenshots, app description, privacy policy
3. **Push notifications** - Server-side setup for reminders
4. **ElevenLabs streaming** - Low-latency TTS (currently batch mode)
5. **Voice recording** - Coach screen hold-to-speak needs STT integration

### Optional Enhancements
- RAG integration for 210 content files
- Subscription/paywall if going premium
- Analytics/crash reporting

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
├── gemini.ts            # LLM coach (Gemini 3 Flash)
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
2. **Voice recording** - Hold-to-speak button is visual only (needs STT integration)
3. **Package versions** - Minor react-native version mismatch warnings (non-blocking)

---

## Production Hardening (Jan 1, 2026)

### Security
- Removed DEV_MODE bypass that was skipping authentication
- All user inputs validated and sanitized (max lengths, trimming)
- Backend functions have proper error handling

### UX
- Loading states on all screens with backend queries
- ErrorBoundary with dark theme retry UI
- Haptic feedback on all major interactions
- Accessibility labels on all interactive elements

### Backend Integration
- Progress screen connected to real session/user data
- Settings haptics toggle persists to backend
- Coach actions (START_EXERCISE, SHOW_PROGRESS, etc.) execute navigation
- Onboarding completion marked in backend

---

## Recent Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Radial layout | CSS transforms | User preference, cleaner than absolute positioning |
| Gold color | `#d4a954` | Stitch canonical |
| Exercises | All 5 free | MVP scope |
| Tab bar | Floating pill | Matches Stitch design |
| Error handling | Class-based ErrorBoundary | React best practice for catching render errors |

---

## Handoff System

- **This file** (`HANDOFF.md`) = Current state, always up to date
- **`handoffs/YYYY-MM-DD.md`** = Archived session history
- **`handoffs/README.md`** = System documentation

Run `/handoff` at session end to archive and update.
