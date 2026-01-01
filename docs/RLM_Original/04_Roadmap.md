# The Pause - Product Roadmap

## Philosophy
Ship the smallest thing that delivers the core value. Learn. Iterate. Resist feature creep.

---

## Phase 1: MVP (v1.0)
**Goal**: Validate core loop (Pause → Intention → Streak)
**Timeline**: 8-12 weeks development

### Features
- [ ] The Pause (Golden Light + Breathing, 90 seconds)
- [ ] Dr. Miller recorded audio (core script)
- [ ] Haptic thumb-hold interaction
- [ ] Body silhouette light-fill visualization
- [ ] The Intention (post-pause text capture)
- [ ] The Streak (vessel visualization, day count)
- [ ] Minimal settings (notifications, haptics toggle)

### Content Required
- [ ] Record Dr. Miller: Golden Light + Breathing script (~90 seconds)
- [ ] Record Dr. Miller: 3-5 milestone messages ("You've done 10 pauses...")
- [ ] Record Dr. Miller: Welcome/first-use message (~15 seconds)

### Technical
- [ ] iOS app (Swift/SwiftUI) - primary platform
- [ ] Local data storage (no account required for v1)
- [ ] Basic analytics (pause completions, streak data)

### Launch
- Soft launch to Dr. Miller's existing followers
- TestFlight beta → App Store
- No paid marketing initially

---

## Phase 2: Voice & Personalization (v1.5)
**Goal**: Add AI voice for personalized elements
**Timeline**: 4-6 weeks post-launch

### Features
- [ ] AI voice cloning (ElevenLabs or similar) for Dr. Miller
- [ ] Personalized invocation: "You said you're anxious about [X]. Let's pause."
- [ ] Pre-pause optional prompt: "What's on your mind?" (feeds into personalization)
- [ ] Milestone messages with personal stats ("You've paused 47 times this month...")

### Technical
- [ ] Voice synthesis integration
- [ ] Simple state capture (what user typed before pause)
- [ ] Cloud sync option (account creation)

---

## Phase 3: Practice Expansion (v2.0)
**Goal**: Add 1-2 additional practice types based on user feedback
**Timeline**: 6-8 weeks

### Candidate Practices (pick 1-2 based on data)
- **Counting**: Pure mental focus, no visualization. For when golden light feels too "woo."
- **Body Scan**: Grounding practice for physical anxiety (chest tightness, etc.)
- **Attitude Set**: Intentionally choosing emotional state. More cognitive.

### UX Decision
- NOT a menu on home screen
- Instead: App learns which practice works for user, or user sets default in settings
- Or: Swipe left/right on main screen to switch practice type (gesture-based, no visible menu)

---

## Phase 4: Monetization (v2.5)
**Goal**: Introduce premium tier
**Timeline**: 8-10 weeks

### Free Tier (forever free)
- The Pause (1 practice type)
- Intention capture
- Basic streak tracking

### Premium Tier ($4.99/month or $39.99/year)
- All practice types
- AI-personalized sessions
- Extended streak analytics (trends, insights)
- Exclusive Dr. Miller audio content (deep dives on techniques)
- Priority access to new features

### Premium+ / Concierge (pricing TBD)
- Monthly group Q&A with Dr. Miller (live or recorded)
- Path to 1:1 consultation booking
- For serious practitioners and those seeking clinical guidance

---

## Phase 5: Platform Expansion (v3.0)
**Goal**: Android + ecosystem features
**Timeline**: 10-12 weeks

### Features
- [ ] Android app (Kotlin/Jetpack Compose)
- [ ] Apple Watch companion (quick-launch pause)
- [ ] iOS Widget (streak display, one-tap launch)
- [ ] Siri Shortcut ("Hey Siri, I need to pause")

---

## Future Considerations (Backlog)

### Maybe (needs validation)
- **Mood logging**: Pre/post pause mood capture. Risk: adds friction.
- **Journal**: Free-form reflection. Risk: scope creep, different product.
- **Community**: Shared milestones, accountability. Risk: privacy concerns for mental health tool.
- **Push notifications**: "Time to pause?" Risk: annoying, goes against "pull it out when you need it" model.

### Probably Not
- Social sharing (this is private)
- Gamification/badges (cheapens the clinical credibility)
- AI chat companion (different product, dilutes Dr. Miller's authority)
- Sleep/meditation courses (we're not Calm)

---

## Key Milestones

| Milestone | Target | Success Metric |
|---|---|---|
| Beta launch | Week 10 | 100 TestFlight users |
| App Store launch | Week 14 | 1,000 downloads |
| Retention validation | Week 18 | 30% weekly retention |
| Premium launch | Week 26 | 5% conversion to paid |
| Android launch | Week 38 | Platform parity |

---

## Open Questions for Future Phases

1. **Offline mode**: How much functionality works without internet? (V1: everything. V2+: need voice synthesis.)
2. **Data privacy**: Where does intention/mood data live? User owns it? Can delete?
3. **Clinical claims**: What can we say about efficacy? Need disclaimers? IRB study?
4. **International**: Localization? Other languages? Or English-only given Dr. Miller's voice is the product?
