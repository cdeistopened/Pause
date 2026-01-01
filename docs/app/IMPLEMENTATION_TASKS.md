# The Pause - Implementation Tasks

> **Sprint Goal**: MVP ready for TestFlight in 2 weeks
> **Reference**: [APP_ARCHITECTURE.md](./APP_ARCHITECTURE.md)

---

## Task Categories

| Category | Description | Estimated Effort |
|----------|-------------|------------------|
| 🏗️ Foundation | Project setup, schema, core infrastructure | 1-2 days |
| 🎨 Onboarding | First-launch experience | 1-2 days |
| ◉ Pause | Core meditation experience | 2-3 days |
| 📚 Library | Content browsing and playback | 1-2 days |
| ✓ Habits | Tracking and reminders | 1-2 days |
| 🎙️ Coach | Voice AI integration | 2-3 days |
| 💳 Subscriptions | RevenueCat integration | 1 day |
| 🔔 Notifications | Reminders system | 1 day |
| ✨ Polish | Animations, haptics, testing | 2-3 days |

---

## Phase 1: Foundation (Days 1-2)

### 1.1 Project Cleanup & Structure
- [ ] Remove existing todo app code (components, convex functions)
- [ ] Create new folder structure per architecture doc
- [ ] Update `app.json` with new app name, icons placeholders
- [ ] Add new dependencies to `package.json`:
  ```
  expo-notifications
  expo-haptics
  expo-av (or expo-audio)
  react-native-purchases
  react-native-reanimated (likely already present)
  @react-native-voice/voice (for speech-to-text)
  ```
- [ ] Run `npx expo install` to ensure compatibility

### 1.2 Convex Schema
- [ ] Replace `convex/schema.ts` with new schema from architecture doc
- [ ] Create index file structure:
  - `convex/users.ts` - User CRUD, subscription status
  - `convex/habits.ts` - Habit config and logging
  - `convex/sessions.ts` - Pause session logging
  - `convex/intentions.ts` - Intention storage
  - `convex/content.ts` - Content library queries
  - `convex/coach.ts` - Conversation history
- [ ] Run `npx convex dev` to deploy schema

### 1.3 Constants & Types
- [ ] Create `constants/colors.ts` with color palette
- [ ] Create `constants/habits.ts` with habit definitions
- [ ] Create `types/index.ts` for shared TypeScript types

### 1.4 Core User Functions
- [ ] `convex/users.ts`:
  - `getOrCreateUser` - Called on auth, creates user record if needed
  - `updateUser` - Update preferences
  - `getUserWithHabits` - Get user + their habit configs
  - `updateStreak` - Called after session completion

### 1.5 Tab Navigation Setup
- [ ] Update `app/(tabs)/_layout.tsx` with 5-tab structure
- [ ] Create placeholder screens for each tab
- [ ] Configure tab bar styling (dark theme, golden accent)
- [ ] Add icons for each tab

---

## Phase 2: Onboarding (Days 2-3)

### 2.1 Onboarding Flow Structure
- [ ] Create `app/(onboarding)/_layout.tsx` - Stack navigator
- [ ] Create routing logic: if `!user.onboardingCompleted` → show onboarding
- [ ] Create `contexts/OnboardingContext.tsx` to hold selections during flow

### 2.2 Welcome Screen
- [ ] `app/(onboarding)/welcome.tsx`
- [ ] Dr. Miller photo/placeholder
- [ ] Welcome text
- [ ] "Get Started" button → next screen

### 2.3 Habit Selection Screen
- [ ] `app/(onboarding)/select-habits.tsx`
- [ ] Display all habit options as selectable cards
- [ ] Max 3 selection enforcement
- [ ] Store selections in context
- [ ] "Continue" button → loops through configure screens

### 2.4 Habit Configuration Screen
- [ ] `app/(onboarding)/configure-habit.tsx`
- [ ] Dynamic based on which habit (passed as param)
- [ ] Goal selector (1, 5, 10, 15, 20 or appropriate for habit type)
- [ ] Description of Dr. Miller's recommendation
- [ ] "Next" → next habit or reminder times

### 2.5 Reminder Times Screen
- [ ] `app/(onboarding)/reminder-times.tsx`
- [ ] Morning time picker
- [ ] Evening time picker
- [ ] Brief explanation of how reminders work

### 2.6 Notification Permission Screen
- [ ] `app/(onboarding)/notifications.tsx`
- [ ] Explanation of why notifications help
- [ ] "Enable Notifications" → triggers system prompt
- [ ] "I'll do this later" → skip

### 2.7 First Pause Screen
- [ ] `app/(onboarding)/first-pause.tsx`
- [ ] Simplified golden orb (just the orb, no exercise selector)
- [ ] "Let's take your first pause" text
- [ ] On completion → save onboarding data to Convex → navigate to main app

### 2.8 Convex Mutations for Onboarding
- [ ] `convex/users.ts`:
  - `completeOnboarding` - Save habits, preferences, mark complete

---

## Phase 3: Pause Screen (Days 3-5)

### 3.1 Golden Orb Component
- [ ] `components/pause/GoldenOrb.tsx`
- [ ] Idle state: gentle pulse animation (scale 1.0 → 1.05)
- [ ] Active state: expands, pulses with audio
- [ ] Use `react-native-reanimated` for smooth animations
- [ ] Accept `isPlaying`, `audioAmplitude` props

### 3.2 Exercise Selector Component
- [ ] `components/pause/ExerciseSelector.tsx`
- [ ] Horizontal scroll of exercise cards
- [ ] Cards show: icon, short name
- [ ] Selected state styling (golden border)
- [ ] Tap to select (doesn't start, just selects)

### 3.3 Pause Screen Layout
- [ ] `app/(tabs)/index.tsx` (Pause/Home)
- [ ] Streak indicator (top right) - links to streak modal
- [ ] Exercise selector (top area)
- [ ] Golden orb (center)
- [ ] Instruction text (bottom)
- [ ] Dr. Miller quote (bottom, rotates)

### 3.4 Audio Player Hook
- [ ] `hooks/useAudioPlayer.ts`
- [ ] Load audio file (from Convex file storage or bundled)
- [ ] Play/pause controls
- [ ] Progress tracking
- [ ] Audio amplitude extraction (for orb visualization)
- [ ] Completion callback

### 3.5 Exercise Session Flow
- [ ] Tap orb → start selected exercise audio
- [ ] During: orb animates, haptic pulses every 15 sec
- [ ] On complete: transition to intention screen
- [ ] Log session to Convex

### 3.6 Intention Screen
- [ ] `components/pause/IntentionInput.tsx`
- [ ] Modal or separate screen after exercise
- [ ] Single text input, auto-focus keyboard
- [ ] "Done" button → save intention, return to pause
- [ ] "Skip" option

### 3.7 Streak Modal
- [ ] `components/pause/StreakModal.tsx`
- [ ] Vessel visualization (partially filled)
- [ ] Total pauses count
- [ ] Current streak days
- [ ] Rotating Dr. Miller quote
- [ ] Close button

### 3.8 Haptics Utility
- [ ] `utils/haptics.ts`
- [ ] `onStart()` - medium impact
- [ ] `onPulse()` - light impact (every 15 sec during exercise)
- [ ] `onComplete()` - success notification
- [ ] `onTap()` - selection feedback
- [ ] Respect user's haptic preference setting

### 3.9 Convex Functions for Sessions
- [ ] `convex/sessions.ts`:
  - `logSession` - Create session record
  - `getRecentSessions` - For streak calculation
- [ ] `convex/intentions.ts`:
  - `saveIntention` - Store intention text
  - `getRecentIntentions` - For habits/history view

---

## Phase 4: Library (Days 5-6)

### 4.1 Content Card Component
- [ ] `components/library/ContentCard.tsx`
- [ ] Thumbnail (or icon placeholder)
- [ ] Title
- [ ] Duration badge
- [ ] Type indicator (Exercise vs Lecture)
- [ ] Premium lock icon if applicable
- [ ] Play button

### 4.2 Content List Component
- [ ] `components/library/ContentList.tsx`
- [ ] Tab filter: Exercises | Learn
- [ ] Scrollable list of ContentCards
- [ ] Pull to refresh

### 4.3 Library Screen
- [ ] `app/(tabs)/library.tsx`
- [ ] Header with title
- [ ] Tab filter
- [ ] Content list
- [ ] Handle premium content tap → show upgrade prompt or play

### 4.4 Content Player Screen
- [ ] `app/player/[contentId].tsx`
- [ ] Full-screen dark background
- [ ] Large golden orb (waveform reactive)
- [ ] Title and duration
- [ ] Play/pause button
- [ ] Progress bar
- [ ] Close button (X)

### 4.5 Convex Functions for Content
- [ ] `convex/content.ts`:
  - `listContent` - Get all content, optionally filtered by type
  - `getContent` - Get single content by ID
- [ ] Seed initial content data (titles, durations, audio URLs)

### 4.6 Upload Audio Files
- [ ] Upload Dr. Miller's audio files to Convex file storage
- [ ] Create content records with file URLs
- [ ] Test playback

---

## Phase 5: Habits (Days 6-7)

### 5.1 Habit Card Component
- [ ] `components/habits/HabitCard.tsx`
- [ ] Icon and name
- [ ] Progress bar (X of Y completed)
- [ ] Next reminder time
- [ ] Tap action:
  - In-app habit → navigate to Pause with that exercise selected
  - External habit → toggle completion

### 5.2 Habit Progress Component
- [ ] `components/habits/HabitProgress.tsx`
- [ ] Circular or bar progress indicator
- [ ] Percentage or fraction display

### 5.3 Habits Screen
- [ ] `app/(tabs)/habits.tsx`
- [ ] Header with date
- [ ] List of user's active habits as HabitCards
- [ ] Stats section (streak, total pauses)
- [ ] "View History" button (future feature, can be placeholder)

### 5.4 Habit Edit Modal
- [ ] `components/habits/HabitEditModal.tsx`
- [ ] Goal selector
- [ ] Reminder mode (none, fixed times, interval)
- [ ] Time pickers for fixed times
- [ ] Interval selector
- [ ] Active hours range
- [ ] Save/Cancel buttons
- [ ] Remove habit option

### 5.5 Convex Functions for Habits
- [ ] `convex/habits.ts`:
  - `getUserHabits` - Get user's configured habits
  - `addHabit` - Add new habit with defaults
  - `updateHabit` - Update habit settings
  - `removeHabit` - Delete habit config
  - `logHabitCompletion` - Increment today's count
  - `getTodayProgress` - Get all habit progress for today
  - `getHabitHistory` - Get historical data (for future analytics)

---

## Phase 6: Settings (Day 7)

### 6.1 Settings Screen
- [ ] `app/(tabs)/settings.tsx`
- [ ] Sections:
  - Notifications (morning/evening time pickers)
  - My Habits (list with edit buttons → opens HabitEditModal)
  - Add Habit button
  - Preferences (haptics toggle)
  - Account (subscription status, upgrade button)
  - About (version, credits, links)

### 6.2 Time Picker Component
- [ ] `components/common/TimePicker.tsx`
- [ ] Reusable time selection (used in onboarding and settings)
- [ ] Native picker or custom wheel

### 6.3 Convex Functions for Settings
- [ ] `convex/users.ts`:
  - `updatePreferences` - Update reminder times, haptics, etc.

---

## Phase 7: Coach - Voice AI (Days 8-10)

### 7.1 Premium Gate Component
- [ ] `components/common/PremiumGate.tsx`
- [ ] Check subscription status
- [ ] If not premium → show upgrade prompt
- [ ] If premium → render children

### 7.2 Coach Interface Component
- [ ] `components/coach/CoachInterface.tsx`
- [ ] Dr. Miller avatar/photo
- [ ] Greeting message
- [ ] Quick prompt buttons
- [ ] Input area (text field + mic button)

### 7.3 Voice Input Component
- [ ] `components/coach/VoiceInput.tsx`
- [ ] Mic button with recording state
- [ ] Use `@react-native-voice/voice` for speech-to-text
- [ ] Or device native transcription
- [ ] Waveform visualization while recording

### 7.4 Message Bubble Component
- [ ] `components/coach/MessageBubble.tsx`
- [ ] User message styling
- [ ] Assistant message styling
- [ ] Loading state (typing indicator)

### 7.5 Coach Screen
- [ ] `app/(tabs)/coach.tsx`
- [ ] Wrapped in PremiumGate
- [ ] Coach interface
- [ ] Message history (scrollable)
- [ ] Input at bottom

### 7.6 ElevenLabs Service
- [ ] `services/elevenlabs.ts`
- [ ] `textToSpeech(text: string): Promise<AudioBuffer>`
- [ ] Use Dr. Miller's cloned voice ID
- [ ] Handle errors gracefully

### 7.7 Coach Service / Hook
- [ ] `hooks/useCoach.ts`
- [ ] Send message to LLM (via Convex action)
- [ ] Parse response for message + action
- [ ] Call ElevenLabs for TTS
- [ ] Play audio response
- [ ] Execute action if present (navigate, start exercise)

### 7.8 Convex Action for Coach
- [ ] `convex/coach.ts`:
  - `sendMessage` - Action that:
    1. Gets user context (habits, progress, time)
    2. Builds prompt with Dr. Miller persona
    3. Calls OpenAI API
    4. Parses structured response
    5. Saves to conversation history
    6. Returns message + action

### 7.9 Coach Actions Handler
- [ ] In coach screen or hook:
  - `START_EXERCISE` → navigate to Pause, select exercise, auto-start
  - `PLAY_CONTENT` → navigate to player with content ID
  - `SHOW_HABITS` → switch to habits tab
  - `SHOW_PROGRESS` → open streak modal

---

## Phase 8: Subscriptions (Day 10)

### 8.1 RevenueCat Setup
- [ ] Create RevenueCat account
- [ ] Create project
- [ ] Set up iOS App Store Connect integration
- [ ] Create product: Monthly ($4.99)
- [ ] Create product: Annual ($39.99)
- [ ] Create entitlement: "premium"
- [ ] Create offering with both products
- [ ] Get API keys

### 8.2 RevenueCat Integration
- [ ] `services/purchases.ts`:
  - `initializePurchases(userId)` - Configure on app start
  - `getOfferings()` - Fetch available products
  - `purchasePackage(pkg)` - Handle purchase
  - `checkSubscriptionStatus()` - Check entitlement
  - `restorePurchases()` - Restore for returning users

### 8.3 Subscription Hook
- [ ] `hooks/useSubscription.ts`
- [ ] Initialize on auth
- [ ] Provide `isPremium` boolean
- [ ] Provide `offerings` for paywall
- [ ] Sync status to Convex user record

### 8.4 Paywall Component
- [ ] `components/common/Paywall.tsx`
- [ ] Feature comparison (free vs premium)
- [ ] Product options (monthly, annual with savings %)
- [ ] Purchase button
- [ ] Restore purchases link
- [ ] Terms links

### 8.5 Environment Variables
- [ ] Add to `.env.local`:
  ```
  REVENUECAT_IOS_KEY=xxx
  REVENUECAT_ANDROID_KEY=xxx
  ```
- [ ] Update `.env.example`

---

## Phase 9: Notifications (Day 11)

### 9.1 Notification Service
- [ ] `services/notifications.ts`:
  - `requestPermission()` - Ask for notification permission
  - `getPermissionStatus()` - Check current status
  - `scheduleNotification(config)` - Schedule single notification
  - `cancelNotification(id)` - Cancel by ID
  - `cancelAllForHabit(habitType)` - Cancel all for a habit
  - `scheduleHabitReminders(habit)` - Schedule based on habit config
  - `scheduleMorningReminder(time)` - Daily morning
  - `scheduleEveningReminder(time)` - Daily evening
  - `rescheduleAllReminders(user)` - Rebuild all schedules

### 9.2 Notification Content
- [ ] Define notification messages for each type:
  - Morning: "Good morning. Ready to set your mood?"
  - Evening: "How did today go? Take a moment."
  - Breathing: "Time for a breath. 30 seconds."
  - Hydration: "Don't forget to hydrate. 💧"
  - Streak at risk: "Keep your X-day streak alive!"

### 9.3 Notification Handlers
- [ ] Handle notification tap → open app to relevant screen
- [ ] Handle notification received while app open (optional sound/badge)

### 9.4 Integration Points
- [ ] On onboarding complete → schedule initial reminders
- [ ] On habit settings change → reschedule that habit's reminders
- [ ] On user preference change → reschedule morning/evening

---

## Phase 10: Polish (Days 12-14)

### 10.1 Animations
- [ ] Orb pulse animation refinement
- [ ] Screen transition animations (crossfade 400ms)
- [ ] Modal slide-up animation (spring 300ms)
- [ ] Exercise completion celebration (subtle flash/pulse)
- [ ] Progress bar smooth fills

### 10.2 Loading States
- [ ] Skeleton loaders for content lists
- [ ] Spinner for coach responses
- [ ] Optimistic updates for habit completions

### 10.3 Error Handling
- [ ] Network error states
- [ ] Retry mechanisms
- [ ] Graceful degradation (offline habit tracking?)
- [ ] Error boundaries for crashes

### 10.4 Empty States
- [ ] No habits configured → prompt to add
- [ ] No content in library → loading or error
- [ ] Coach message list empty → show greeting

### 10.5 Accessibility
- [ ] VoiceOver/TalkBack labels on all interactive elements
- [ ] Dynamic type support
- [ ] Reduced motion support (disable pulse animations)
- [ ] Sufficient color contrast

### 10.6 Testing
- [ ] Test on iOS simulator
- [ ] Test on physical iOS device
- [ ] Test onboarding flow end-to-end
- [ ] Test pause flow end-to-end
- [ ] Test subscription purchase flow (sandbox)
- [ ] Test notification scheduling
- [ ] Test voice coach flow

### 10.7 App Store Prep
- [ ] Final app icon
- [ ] Splash screen
- [ ] Screenshots for App Store
- [ ] App description and keywords
- [ ] Privacy policy URL
- [ ] Terms of service URL

### 10.8 TestFlight Submission
- [ ] Build with EAS: `eas build --platform ios`
- [ ] Submit to TestFlight
- [ ] Internal testing
- [ ] Invite beta testers (Dr. Miller's audience sample)

---

## Parallel Workstreams

These can be worked on simultaneously by different agents:

| Workstream | Tasks | Dependencies |
|------------|-------|--------------|
| **A: Foundation + Schema** | 1.1 - 1.5 | None |
| **B: Onboarding UI** | 2.1 - 2.7 | A complete |
| **C: Pause Experience** | 3.1 - 3.9 | A complete |
| **D: Library** | 4.1 - 4.6 | A complete |
| **E: Habits** | 5.1 - 5.5 | A complete |
| **F: Settings** | 6.1 - 6.3 | A, E complete |
| **G: Coach** | 7.1 - 7.9 | A, C complete (needs audio infra) |
| **H: Subscriptions** | 8.1 - 8.5 | A complete |
| **I: Notifications** | 9.1 - 9.4 | A, E complete |
| **J: Polish** | 10.1 - 10.8 | All features complete |

### Suggested Agent Assignments

1. **Agent: Foundation** - Tasks 1.1-1.5, 2.8 (schema, structure, core functions)
2. **Agent: Onboarding** - Tasks 2.1-2.7 (UI screens)
3. **Agent: Core Experience** - Tasks 3.1-3.9, 4.1-4.6 (Pause + Library)
4. **Agent: Habits & Settings** - Tasks 5.1-5.5, 6.1-6.3
5. **Agent: Premium Features** - Tasks 7.1-7.9, 8.1-8.5 (Coach + Subscriptions)
6. **Agent: Notifications** - Tasks 9.1-9.4

---

## Content Deliverables (Non-Code)

These need to be provided/created outside of coding:

| Item | Description | Needed By |
|------|-------------|-----------|
| Audio: Breathing exercise | 90-sec guided breathing | Day 5 |
| Audio: Golden Light short | 90-sec visualization | Day 5 |
| Audio: Golden Light full | 5-min visualization | Day 7 |
| Audio: Counting exercise | 60-sec counting | Day 7 |
| Audio: Welcome message | 15-sec onboarding | Day 3 |
| Audio: First pause intro | 10-sec | Day 3 |
| Dr. Miller photo | For onboarding + coach | Day 3 |
| App icon | 1024x1024 | Day 12 |
| ElevenLabs voice clone | Dr. Miller's voice | Day 8 |
| RevenueCat account | Configured with products | Day 10 |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Audio recording delays | Use placeholder audio, swap later |
| RevenueCat complexity | Start integration early, use sandbox extensively |
| ElevenLabs voice quality | Test clone early, iterate on training data |
| Notification timing bugs | Test on real device, not just simulator |
| App Store rejection | Follow guidelines, have privacy policy ready |

---

*Task breakdown created: December 2024*
*Reference architecture: APP_ARCHITECTURE.md*
