# The Pause App

Expo React Native app for Dr. Miller's micro-intervention method.

**Core Loop**: Open → 60-90s guided pause (voice + haptics) → set intention → done → dots track progress

---

## Project Structure

```
pause-app/
├── app/                    # Expo Router screens
│   ├── (auth)/             # Sign-in/sign-up
│   ├── (onboarding)/       # Welcome flow
│   └── (tabs)/             # PAUSE, Coach, Library, Habits, Settings
├── components/             # React components (pause/, common/)
├── convex/                 # Backend (Convex + Clerk auth)
├── hooks/                  # Custom hooks
├── services/               # ElevenLabs, Gemini integrations
├── scripts/                # Dev scripts (coach-web-server.ts)
├── constants/              # App constants
├── ios/                    # Xcode project
├── assets/                 # Images, fonts
├── design/                 # Design system, Stitch outputs
├── plans/                  # Implementation plans
└── docs/                   # App documentation
```

**Related folders (parent directory):**
- `../content/` — Dr. Miller's 210 content files + knowledge base
- `../book/` — Book project (chapters, outlines, briefs)

---

## Voice Coach System

**Working components**:
- ElevenLabs voice clone: `gn39AkrRBGmOUvxXfY8S`
- Gemini 3 Flash Preview for LLM responses
- Web preview: `npx tsx scripts/coach-web-server.ts` → http://localhost:3333

**Voice style guide**: `../content/voice-style-guide.md` (515 lines)

**Current gap**: No RAG. The 210 content files aren't embedded/searchable yet.

---

## MVP Scope

**5 tabs**:
1. **PAUSE** — Central orb with radial exercise selector
2. **Coach** — Voice AI with Dr. Miller clone
3. **Library** — Exercise browser
4. **Habits** — Dot grids per exercise type
5. **Settings** — Minimal

**4 launch exercises**:
1. Abdominal breathing
2. Golden Light visualization
3. Counting practice
4. Relaxation/Self-talk (TBD)

---

## Commands

```bash
# From this folder (pause-app/)
npm run dev              # Expo dev server
npx convex dev           # Convex backend
npm run build:web        # Build for web

# Voice coach preview
npx tsx scripts/coach-web-server.ts
```

---

## Key Files

| Purpose | Location |
|---------|----------|
| App screens | `app/(tabs)/` |
| Pause components | `components/pause/` |
| Voice services | `services/elevenlabs.ts`, `services/gemini.ts` |
| Backend schema | `convex/schema.ts` |
| Implementation plan | `plans/COMPREHENSIVE_IMPLEMENTATION_PLAN.md` |
| Design system | `design/DESIGN_SYSTEM.md` |

---

## Content Integration

The app needs content from `../content/`:
- `../content/database/` — 210 files for RAG embedding
- `../content/knowledge-base.md` — For system prompts
- `../content/voice-style-guide.md` — For voice synthesis

---

*Last updated: January 2026*
