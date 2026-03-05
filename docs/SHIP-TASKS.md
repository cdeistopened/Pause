# Pause App — Ship Tasks

**Last updated:** March 5, 2026
**Status:** 90% built, not launched
**Estimate:** ~22 hours to ship

---

## What's Working

- Auth (Clerk sign-in/sign-up)
- 5-tab navigation: PAUSE / Coach / Library / Habits / Settings
- Golden Orb + radial exercise selector with animation and haptic feedback
- ActiveSession exercise runner (timer, waveform, breathing haptics, progress bar)
- Voice coach chat UI with speech recognition
- ElevenLabs voice clone integration (Richard's voice ID: `gn39AkrRBGmOUvxXfY8S`)
- Gemini Flash AI integration
- Library card-based exercise browser (5 fallback exercises)
- Habits dot-grid tracker with streaks
- Web build configured (Metro bundler)
- Backend: Convex (serverless) + Clerk auth

---

## Remaining Tasks (Priority Order)

### 1. Knowledge Base Swap (2 hrs) — HIGHEST PRIORITY
Replace the generic 1,200-token Gemini system prompt with the 12K-token knowledge base from `plugin/knowledge-base.md`. This single change transforms the coach from generic chatbot to Richard's actual clinical wisdom.

**Files:** `services/` or wherever the Gemini prompt lives
**Source:** `../plugin/knowledge-base.md` (12K tokens, condensed philosophy)

### 2. Plugin Integration (4-6 hrs)
Connect the 10 coaching skills from `../plugin/skills/` to the coach. The plugin includes:
- `pause-coach` — Walk through P.O.P. protocol
- `mood-audit` — Emotional check-in → prescribe exercise
- `affirmation-designer` — Build personalized affirmations
- `resilience-builder` — Match exercises to situations
- `morning-routine-builder` — Design daily practice
- `mindfulness-foundations` — Teach meditation/breathing
- `psychology-of-self` — "You are the boss" philosophy
- `aging-well-masterclass` — Vitality protocols
- `psychedelic-literacy` — Research + integration
- `ask-dr-miller` — Concierge router (picks right skill)

**Architecture options:**
- Stage 1: Stuff skill descriptions into Gemini system prompt (simple, now)
- Stage 2: RAG search via Qdrant (existing codebase at `wiki-projects/shared-backend/`)
- Stage 3: Claude Agent SDK with tool use (most capable, Q3)

### 3. Guided Audio Tracks (4 hrs)
Generate 5 guided audio tracks using ElevenLabs voice clone:
- 60-second breathing exercise
- Golden light visualization (3 min)
- Morning mind-setting routine (5 min)
- Sleep wind-down (5 min)
- Emergency calm (90 seconds)

### 4. Email Gate + Usage Counter (4 hrs)
- Collect email on first launch (feeds Substack/Stan.store list)
- 3 free coach sessions per month for free tier
- Track usage in Convex

### 5. RevenueCat Paywall (4-6 hrs)
- $9.99/mo subscription
- Unlock unlimited coach sessions + all guided audio
- RevenueCat SDK integration
- Revenue projection: 300K IG → 3K installs → 150 paid → $1,500/mo

### 6. Deploy Web Version (2 hrs)
- Deploy to Vercel
- Point subdomain (e.g., app.drrichardlouismiller.com)
- Test responsive layout

### 7. Testing + Polish (4 hrs)
- Exercise flow end-to-end
- Coach conversation quality
- Paywall flow
- Deep link from Instagram bio

---

## Revenue Model

| Tier | Price | Access |
|------|-------|--------|
| Free | $0 | 3 coach sessions/month, basic exercises |
| Premium | $9.99/mo | Unlimited coach, guided audio, all exercises |

**At 1% conversion of 300K Instagram:**
- 3,000 installs → 150 paid subscribers → $1,500/mo recurring

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Expo 54 (React Native) |
| Styling | NativeWind (Tailwind) |
| Backend | Convex (serverless) |
| Auth | Clerk |
| AI | Gemini Flash |
| Voice | ElevenLabs (clone ID: `gn39AkrRBGmOUvxXfY8S`) |
| Payments | RevenueCat (planned) |
| Web deploy | Vercel (planned) |

---

*Generated from RLM project session — March 5, 2026*
