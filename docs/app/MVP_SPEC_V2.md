# The Pause MVP Spec V2

Last updated: 2025-02-14
Owner: Charlie Deist
Status: Draft

## Goals
- Ship a calm, frictionless Pause loop: open -> 60-90s practice -> completion -> done.
- Make progress feel cumulative (no streak pressure).
- Track only the four core exercises plus intentions set.
- Keep the UI quiet and reassuring; minimal motion.

## Non-goals (MVP)
- Custom habit creation or manual logging.
- Streaks or competitive progress framing.
- RAG search UI or content browsing beyond the core exercises.
- Advanced library filters or personalization.

## Core Exercises (MVP)
1) Diaphragmatic Breathing
2) Golden Light Visualization
3) Counting Practice
4) Progressive Relaxation

Note: Self-talk is moved to Library lecture content (not a core exercise).

## Information Architecture
Tabs: Library, Coach, Pause, Progress, Settings
- Every screen should allow a 1-tap return to the Pause tab.

## Product Principles
- Calm and simple: no noisy animations, no guilt language.
- Cumulative progress: total pauses and total time practiced lead.
- One primary action per screen.

## Core Loop
1) Open app to Pause tab.
2) Select exercise via radial selector (default: time-of-day suggestion).
3) Hold orb to begin the session.
4) Session completes automatically.
5) Completion card appears with Done + Add intention.
6) Done returns to Pause. Add intention saves and returns.

## Data & Tracking
- session_completed: exercise_type, duration_seconds, completed_at
- intention_added: session_id, length, created_at
- notification_opt_in: preset, times

## Notifications (MVP)
- Onboarding asks permission.
- Presets only:
  - Morning + Evening (user selects two times)
  - Every 3 hours (user selects start time)
- Defaults are suggested but user-editable.
- Allow skip at any step.

## Screen Specs

### 1) Pause (Home)
Purpose: quick entry into a practice session.

Layout
- Header row: lifetime total (left), settings icon (right).
- Center: golden orb + radial selector (4 exercises).
- Exercise preview card below orb.
- CTA text: "Hold to begin".
- Optional contextual banner at top.

Exercise Preview Card
- Title, 1-line description, duration.
- Updates when selector changes.

Interactions
- Long press on orb starts session.
- Radial selector updates selected exercise.

States
- Default: recommended exercise based on time-of-day.
- No network dependency.

Copy
- Quiet, grounded, short phrases.


### 2) During Pause (Active Session)
Purpose: guided focus with minimal distractions.

Layout
- Floating orb, timer, waveform.
- Footer: exercise name, progress bar, short prompt line.

Interactions
- Close button to exit early.
- Completion triggers the Completion Card.

Haptics
- Breathing cadence haptics for breathing and relaxation.
- Respect haptics toggle.


### 3) Completion Card (Modal)
Purpose: close loop with an optional intention.

Layout
- Title: "Pause complete"
- Buttons: Done (primary), Add intention (secondary)

Behavior
- Done dismisses modal and returns to Pause tab.
- Add intention opens the intention input sheet.


### 4) Intention Input (Secondary Sheet)
Purpose: optional intention capture with minimal friction.

Layout
- Single text field, 280-500 chars max.
- Save button.

Behavior
- Save logs intention with session_id.
- Return to Pause after save.


### 5) Progress (Habit Tracker)
Purpose: cumulative tracking with zero manual logging.

Layout
- Top: Total Pauses (big number).
- Dot grid: lifetime dots (color-coded by exercise type).
- Exercise tiles (4): name, total count, total time practiced.
- Intention tile: total intentions set + "View list" link.

Intention List
- Hidden behind "View list".
- Simple chronological list with date/time and text preview.

Interactions
- Tapping an exercise tile starts that exercise.
- No manual logging in MVP.

Empty State
- Calm message + CTA to start a pause.


### 6) Library
Purpose: access core exercises and lecture content.

Layout
- Section 1: Core Practices (the four exercises).
- Section 2: Learn (self-talk lecture + a few curated items).

Behavior
- Core items start a session.
- Lecture items open a simple player or display details.


### 7) Coach
Purpose: voice-first guidance with a single recommended action.

Layout
- Voice room with hold-to-speak control.
- Transcript panel (user + coach).
- One action chip after each response.

Behavior
- If voice fails, fallback to text input.
- If response references RAG content, show "From Dr. Miller" badge.


### 8) Settings
Purpose: keep configuration minimal.

Sections
- Notifications
- Haptics toggle
- Account
- Legal


### 9) Onboarding
Purpose: minimal onboarding to get the user into the Pause loop.

Flow (MVP)
- Welcome -> Name -> Notifications -> Ready

Notes
- Focus selection can be removed to reduce friction.


## Visual System
- Background: deep navy, soft gradients.
- Primary accent: gold only for active and primary states.
- Motion: 1-2 animations per screen, slow and subtle.

## Accessibility
- Large touch targets (44x44 minimum).
- High contrast text on dark backgrounds.
- Respect reduced motion where possible.

## Media Requirements
- Four core exercise audio files (length 60-120s each).
- Optional short ambient loop for active session if desired.

## Acceptance Criteria (MVP)
- A user can complete a full pause in under 2 minutes with no configuration.
- Progress shows lifetime totals and exercise breakdown.
- Intention capture is optional and tracked.
- Notifications are opt-in with simple presets and user-selected times.

