# Implementation Map - MVP Spec V2

Purpose: point to current code and required updates to match the MVP spec.

## Primary UI Screens
- Pause home: app/(tabs)/index.tsx
- Coach: app/(tabs)/coach.tsx
- Library: app/(tabs)/library.tsx
- Progress: app/(tabs)/habits.tsx
- Settings: app/(tabs)/settings.tsx

## Onboarding
- Welcome: app/(onboarding)/welcome.tsx
- Name: app/(onboarding)/name.tsx
- Notifications: app/(onboarding)/notifications.tsx
- Ready: app/(onboarding)/ready.tsx

## Shared Components
- Orb: components/pause/GoldenOrb.tsx
- Radial selector: components/pause/RadialSelector.tsx
- Active session UI: components/pause/ActiveSession.tsx
- Intention UI (replace/repurpose): components/pause/IntentionScreen.tsx
- Context banner (optional): components/pause/ContextualBanner.tsx

## Exercise Configuration
- Exercise list + metadata: constants/exercises.ts
  - Remove self-talk from core list.
  - Update angles for 4-item radial layout.

## Data + Backend
- Sessions: convex/sessions.ts
  - Use returned sessionId to attach intentions.
- Intentions: convex/intentions.ts
  - Add intention with sessionId.
  - Add list/count helpers if needed for Progress.
- Content: convex/content.ts
  - Ensure the four core exercises are seeded and prioritized.

## Services
- LLM: services/gemini.ts
- TTS: services/elevenlabs.ts

## Styling + Tokens
- Color tokens: constants/colors.ts
- NativeWind theme: tailwind.config.js

## Key Changes (MVP)
1) Pause Home
   - Add exercise preview card below orb.
   - Default selected exercise = contextual suggestion.
   - Optional contextual banner at top.

2) Remove Self-Talk from Core
   - Update constants/exercises.ts.
   - Update radial selector to 4 items.

3) Completion Flow
   - Replace full IntentionScreen modal with Completion Card.
   - Completion Card: Done + Add intention.
   - Add intention sheet attaches sessionId.

4) Progress Screen
   - Dot grid stays cumulative.
   - Add 4 exercise tiles with totals + total time.
   - Add Intention tile with "View list" link.
   - Add intention list view (hidden until tap).

5) Notifications
   - Replace existing simple choices with two presets:
     - Morning + Evening (user-selected times)
     - Every 3 hours (user-selected start time)
   - Use onboarding to capture times.

## Suggested New Components (if helpful)
- components/pause/CompletionCard.tsx
- components/pause/IntentionSheet.tsx
- components/progress/ExerciseTile.tsx
- components/progress/IntentionList.tsx

## Notes
- Keep the UI calm and minimal.
- Avoid introducing manual logging or streaks in MVP.

