# The Pause - Build Execution Plan

## Tech Stack Decision

### Recommendation: React Native + Expo
**Why**:
- Single codebase for iOS and Android (even if Android is Phase 5)
- Expo's audio and haptics APIs are mature
- Faster iteration than native Swift/Kotlin
- Easier to find developers
- Good enough performance for this app (no complex animations)

**Alternative considered**: Native Swift (iOS) + Kotlin (Android)
- Better haptics fidelity on iOS
- Slightly smoother animations
- But: 2x development cost, slower iteration
- Verdict: Not worth it for MVP

### Core Dependencies
```
- expo: ~49.0.0
- expo-av: Audio playback
- expo-haptics: Haptic feedback
- expo-linear-gradient: Background gradients
- react-native-reanimated: Smooth animations
- @react-native-async-storage/async-storage: Local data persistence
- expo-notifications: (minimal, for optional reminders)
```

### Backend (MVP)
**None.** 

All data stored locally on device:
- Streak count
- Pause history (timestamps)
- Intentions (text + timestamps)
- Settings (notifications, haptics)

**V1.5+**: Add optional cloud sync
- Supabase or Firebase for simplicity
- User accounts (email/Apple Sign-In)
- Cross-device sync

---

## Development Phases

### Sprint 1: Foundation (Week 1-2)
- [ ] Project setup (Expo, dependencies)
- [ ] Basic app structure
- [ ] Color palette and typography implementation
- [ ] Main screen layout (static)
- [ ] Navigation structure (minimal - modal for streak)

**Deliverable**: App opens, shows main screen with placeholder circle

### Sprint 2: The Pause Core (Week 3-4)
- [ ] Touch target (golden circle) with haptic feedback
- [ ] Thumb-hold detection (touch down, hold, release)
- [ ] Timer logic (90 seconds)
- [ ] Placeholder audio integration (can use TTS initially)
- [ ] Basic body silhouette SVG
- [ ] Light-fill animation (bottom to top)

**Deliverable**: Can complete a full pause cycle with placeholder audio

### Sprint 3: Audio Integration (Week 5-6)
- [ ] Dr. Miller audio recording (external dependency)
- [ ] Audio file integration
- [ ] Sync animation to audio cues
- [ ] Haptic pulse timing (every 15s during practice)
- [ ] Completion haptic pattern

**Deliverable**: Full pause experience with real audio

### Sprint 4: Intention Flow (Week 7)
- [ ] Post-pause transition animation
- [ ] Intention input screen
- [ ] Keyboard handling
- [ ] "Go" button behavior
- [ ] Intention storage (local)
- [ ] Return to main screen / app minimize

**Deliverable**: Complete Pause → Intention flow

### Sprint 5: Streak System (Week 8-9)
- [ ] Streak calculation logic
- [ ] Vessel visualization design
- [ ] Vessel fill animation
- [ ] Streak modal UI
- [ ] Streak persistence
- [ ] Edge cases (timezone, grace period)

**Deliverable**: Streak tracking fully functional

### Sprint 6: Polish & Settings (Week 10)
- [ ] Settings screen (notifications, haptics toggles)
- [ ] First-use experience (welcome message)
- [ ] Error states
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] App icon and splash screen

**Deliverable**: Beta-ready build

### Sprint 7: Testing & Launch Prep (Week 11-12)
- [ ] Internal testing
- [ ] TestFlight setup
- [ ] Beta user recruitment (from Dr. Miller's audience)
- [ ] Bug fixes from beta feedback
- [ ] App Store assets (screenshots, description)
- [ ] Privacy policy
- [ ] App Store submission

**Deliverable**: App Store launch

---

## External Dependencies (Blockers)

| Dependency | Owner | Status | Blocker For |
|---|---|---|---|
| Golden Light + Breathing script finalization | Content team | Not started | Sprint 3 |
| Dr. Miller audio recording session | Dr. Miller | Not scheduled | Sprint 3 |
| Welcome message recording | Dr. Miller | Not scheduled | Sprint 6 |
| App icon design | Design | Not started | Sprint 6 |
| Privacy policy draft | Legal | Not started | Sprint 7 |
| Apple Developer account | Ops | TBD | Sprint 7 |

---

## Audio Recording Session Plan

### Session 1: Core Content (60-90 min)
1. **Golden Light + Breathing practice** (90 seconds)
   - Record 3 takes minimum
   - Quiet room, professional mic
   - No background music during recording
   
2. **Welcome message** (15-20 seconds)
   - 2-3 variations

3. **Milestone messages** (10-15 seconds each)
   - 10 pauses
   - 25 pauses
   - 50 pauses
   - 100 pauses
   - 365 pauses (1 year)

### Technical Requirements
- 48kHz, 24-bit WAV files
- Minimal room reverb
- Consistent mic distance
- No post-processing (we'll handle in app)

### Script Review Process
1. Draft scripts (content team)
2. Review with Dr. Miller
3. Table read / practice
4. Record
5. Select best takes
6. Light editing (breaths, pacing)
7. Export for app integration

---

## Testing Strategy

### Unit Tests
- Streak calculation logic
- Timer accuracy
- Data persistence

### Integration Tests
- Full pause flow (touch → audio → complete → intention)
- Streak updates correctly after pause
- Settings persist across app restarts

### Manual Testing Checklist
- [ ] First launch experience
- [ ] Complete pause with audio
- [ ] Haptics fire correctly (iOS)
- [ ] Intention saves and displays
- [ ] Streak increments correctly
- [ ] Streak survives app restart
- [ ] Streak survives phone restart
- [ ] Grace period works (miss 1 day, streak intact)
- [ ] Grace period enforced (miss 2 days, streak resets)
- [ ] Settings toggles work
- [ ] Accessibility: VoiceOver navigation
- [ ] Accessibility: Dynamic Type scaling
- [ ] Background audio behavior (phone call interruption)
- [ ] Low battery mode behavior

### Beta Testing Plan
- 50-100 users from Dr. Miller's audience
- 2-week beta period
- Feedback form (Google Form or Typeform)
- Key questions:
  - Did you complete at least 5 pauses?
  - What confused you?
  - What would make you use this daily?
  - Would you pay for this? How much?

---

## Analytics (MVP - Minimal)

### Events to Track
```
app_opened
pause_started
pause_completed
pause_abandoned (with timestamp of abandonment)
intention_set
streak_viewed
settings_opened
```

### Tools
- Expo Analytics (built-in, basic)
- Or: PostHog (privacy-focused, good free tier)

### What We're NOT Tracking (Privacy)
- Intention text content
- Specific times of day (just counts)
- Location
- Device identifiers beyond anonymous session

---

## Cost Estimates

### Development (MVP)
| Item | Estimate |
|---|---|
| Developer (12 weeks, part-time contractor) | $15,000 - $25,000 |
| Design (UI polish, app icon) | $2,000 - $5,000 |
| Audio production (recording session) | $500 - $1,500 |
| Miscellaneous (fonts, assets) | $500 |
| **Total MVP** | **$18,000 - $32,000** |

### Ongoing
| Item | Monthly |
|---|---|
| Apple Developer Program | $8.25 ($99/year) |
| Analytics (PostHog free tier) | $0 |
| Backend (when added, Supabase) | $0-25 |
| AI Voice (when added, ElevenLabs) | $5-22 |

---

## Launch Checklist

### App Store Requirements
- [ ] App icon (1024x1024)
- [ ] Screenshots (6.5" and 5.5" iPhone)
- [ ] App description (short and long)
- [ ] Keywords
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] Age rating questionnaire
- [ ] App category: Health & Fitness

### Marketing (Soft Launch)
- [ ] Dr. Miller Instagram post announcing app
- [ ] Link in bio
- [ ] Story with demo
- [ ] Email to existing list (if applicable)
- [ ] No paid ads for MVP (organic validation first)
