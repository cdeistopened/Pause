# The Pause - MVP Plan

> Updated: December 31, 2024
> **Target: Ship iOS in January 2025**

---

## MVP Scope (Locked In)

### Core Features
| Feature | Spec |
|---------|------|
| **Platform** | iOS only |
| **Auth** | Anonymous first, optional signup for sync |
| **Exercises** | 4 guided pauses (Dr. Miller's voice recordings) |
| **Coach** | Premium ($4.99/mo, ~2hr TTS cap) - voice AI with Dr. Miller clone |
| **Library** | 4 exercises + 11 curated content files (hand-picked) |
| **Progress** | Dot grids + time-based stats (minutes this year) + user-added habits |
| **Habits** | Simple checkbox, end-of-day review, user can add new |
| **Notifications** | User-scheduled check-ins |
| **Onboarding** | 5 screens: Welcome → Name → Focus area → Notification time → Ready |
| **Post-pause** | Set intention prompt |

### Design System
| Token | Value |
|-------|-------|
| **Primary Gold** | `#EBB305` (brighter) |
| **Background** | `#0A0E1A` |
| **Font** | Manrope |

### 4 Launch Exercises
1. **Abdominal Breathing** (60-90 sec)
2. **Golden Light Visualization** (90 sec)
3. **Counting Practice** (30-60 sec)
4. **Mood Setting / Self-Talk** (60 sec)

### Monetization
- **Free**: All exercises, progress tracking, habits, notifications
- **Premium**: Voice Coach (Dr. Miller AI)

---

## Active Workstreams

### 1. Design
- [x] Run wireframes through Google Stitch
- [x] Save outputs to `design/stitch-outputs/`
- [x] Extract design system to `design/DESIGN_SYSTEM.md`
- [ ] Refine outputs in Figma (optional)
- [ ] Convert Stitch HTML to React Native components

### 2. Audio Recordings
**Dr. Miller records all 4 exercises**:
- [ ] Script Abdominal Breathing (60-90 sec)
- [ ] Script Golden Light (90 sec)
- [ ] Script Counting Practice (30-60 sec)
- [ ] Script Mood Setting / Self-Talk (60 sec)
- [ ] Schedule recording session with Dr. Miller
- [ ] Add to app assets

### 3. Voice Coach (Done for testing)
- [x] Knowledge base created (12K chars)
- [x] Integrated into Gemini system prompt
- [x] ElevenLabs TTS configured
- [ ] Test and refine responses
- [ ] Premium gate implementation

### 4. App Implementation
**Priority order for January ship**:
1. [ ] 5-tab navigation (Library, Coach, PAUSE, Progress, Settings)
2. [ ] PAUSE screen with golden orb
3. [ ] Radial exercise selector
4. [ ] Audio playback for exercises
5. [ ] Progress screen (dot grids + stats)
6. [ ] User-added habits tracking
7. [ ] Post-pause intention capture
8. [ ] 3-screen onboarding
9. [ ] Library screen (4 exercises + 11 content files)
10. [ ] Notification scheduling
11. [ ] Coach screen (premium)
12. [ ] Anonymous → optional signup flow

### 5. Backend (Local-first)
- [ ] Local storage for progress/habits/intentions
- [ ] Optional Convex sync for signed-in users
- [ ] Premium subscription check (RevenueCat)

---

## Content Inventory

```
content-library/
├── 0-Livestreams/        (12 files) - Post-MVP
├── 1-Core-Exercises/     (11 files) - MVP Library
├── 2-Library-Philosophy/ (40 files) - Post-MVP
├── 3-Library-Life/       (68 files) - Post-MVP
├── 4-Coach-Resilience/   (50 files) - Used in Coach prompt
└── 5-Daily-Rhythm-Habits/(29 files) - Post-MVP
                         ─────────
                          210 total
```

---

## Decision Log

| Decision | Choice | Date |
|----------|--------|------|
| Platform | iOS only | Dec 31 |
| Exercise recordings | Dr. Miller records | Dec 31 |
| 4th exercise | Mood Setting / Self-Talk | Dec 31 |
| Monetization | Free exercises, premium Coach ($4.99/mo) | Dec 31 |
| Coach TTS cap | ~2 hours/month (ElevenLabs cost ~$5/mo Starter) | Dec 31 |
| Auth | Anonymous first, optional signup | Dec 31 |
| Notifications | User-scheduled check-ins | Dec 31 |
| Library MVP | 4 exercises + 11 curated files (hand-picked) | Dec 31 |
| Progress stats | Time-based (minutes this year, maybe count) | Dec 31 |
| Habits | Simple checkbox, end-of-day review, user can add | Dec 31 |
| Onboarding | 5 screens: Welcome → Name → Focus → Notif time → Ready | Dec 31 |
| Post-pause | Intention prompt | Dec 31 |
| RAG | No RAG - knowledge base in prompt | Dec 31 |
| Primary gold | #EBB305 (brighter) | Dec 31 |
| Timeline | Ship January 2025 | Dec 31 |

---

## Quick Reference

```bash
# Voice coach preview
npx tsx scripts/coach-web-server.ts

# App development
npm run dev
```

**Wireframes**: `docs/app/STITCH_WIREFRAMES.md`
**Knowledge base**: `DR_MILLER_KNOWLEDGE_BASE.md`
**Content**: `content-library/` (210 files)
