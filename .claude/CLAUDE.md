# The Pause

A mobile micro-intervention app built around Dr. Richard Louis Miller's 64 years of psychological practice.

**Core Loop**: Open → 60-90s guided pause (voice + haptics) → set intention → done → dots track progress

---

## Project Structure

```
Pause/
├── app/                    # Expo React Native app
│   ├── (auth)/             # Sign-in/sign-up
│   └── (tabs)/             # Main app tabs
│       ├── index.tsx       # PAUSE home (golden orb)
│       ├── coach.tsx       # Voice coach (Dr. Miller AI)
│       ├── library.tsx     # Content library
│       ├── habits.tsx      # Progress + habits
│       └── settings.tsx    # Settings
├── components/
│   ├── pause/              # GoldenOrb, RadialSelector, ContextualBanner
│   └── common/
├── services/
│   ├── elevenlabs.ts       # TTS with Dr. Miller voice clone
│   └── gemini.ts           # LLM coach responses
├── convex/                 # Backend (Convex + Clerk auth)
├── docs/
│   ├── app/                # App architecture & implementation
│   └── original/           # Historical RLM app docs
├── book/                   # "The Pause" book project
│   ├── chapters/           # FOREWORD, CHAPTER_1-3
│   ├── outlines/           # KNOWLEDGE_MAP, PROJECT_PLAN
│   └── strategies/
├── content-library/        # 205 source files (Dr. Miller's content)
│   ├── 0-Livestreams/
│   ├── 1-Core-Exercises/   # Breathing, Golden Light, Counting
│   ├── 2-Library-Philosophy/
│   ├── 3-Library-Life/
│   ├── 4-Coach-Resilience/
│   └── 5-Daily-Rhythm-Habits/
├── research/               # Raw source material
└── scripts/
    └── coach-web-server.ts # Voice coach web preview
```

---

## Voice Coach System

**Working components**:
- ElevenLabs voice clone: `gn39AkrRBGmOUvxXfY8S`
- Gemini 3 Flash Preview for LLM responses
- Web preview: `npx tsx scripts/coach-web-server.ts` → http://localhost:3333

**Voice style guide**: `docs/original/dr_miller_voice_style_guide.md` (515 lines)

**Current gap**: No RAG. The 205 content files aren't embedded/searchable yet. Coach mimics Dr. Miller's style but doesn't cite his actual stories/advice.

---

## MVP Scope (Agreed)

**5 tabs**:
1. **Library** - Exercise browser (4 recordings + future content)
2. **Coach** - Voice AI with Dr. Miller clone
3. **PAUSE** - Central orb with radial exercise selector
4. **Progress** - Dot grids per exercise type + user habits
5. **Settings** - Minimal

**4 launch exercises**:
1. Golden Light visualization
2. Abdominal breathing
3. Counting practice
4. (TBD - Relaxation or Self-talk)

**Key features**:
- Radial swipe around orb to change exercise
- Happy haptics throughout
- Dot grid progress (cumulative, not calendar)
- Push notifications for check-ins
- User-added habit tracking

---

## Design Resources

- Wireframes: `docs/app/STITCH_WIREFRAMES.md`
- Architecture: `docs/app/APP_ARCHITECTURE.md`
- Voice coach: `docs/app/VOICE_COACH_*.md`

---

## Book Project

The app is the delivery mechanism for the book, not vice versa.

**Chapters drafted**: Foreword, Ch 1-3
**Content mapped**: `book/outlines/KNOWLEDGE_MAP.md`
**205 source files** ready for both app content library and book citations

---

## Commands

```bash
# App development
npm run dev              # Expo dev server
npx convex dev           # Convex backend

# Voice coach preview
npx tsx scripts/coach-web-server.ts

# Build
npm run build:web
```

---

## Key Principles

From Dr. Miller:
- "You are the boss. The mind is a tool."
- "Practice, practice, practice."
- "A little over time is a lot." (ALOT)
- "Good health is worth fighting for."

From the project:
- Simple > comprehensive
- Voice is the differentiator
- Dots over streaks (cumulative progress)
- Happy haptics everywhere

---

*Last updated: December 2024*
