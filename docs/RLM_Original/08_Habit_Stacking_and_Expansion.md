# Habit Stacking & Expansion (Steelman)

This doc proposes **habit-stacking features beyond the in-app pause/meditation**, while protecting the core product loop:

**Pause → Intention → Do the next right thing**

The goal is to reduce relapse into scrolling/rumination by making the “next behavior” easy, immediate, and repeatable.

## Principles

- **No decision fatigue**: default path should be 1 tap (or zero taps).
- **Tiny actions**: 15 seconds to 5 minutes; “always doable.”
- **Stacking > tracking**: build a reliable chain, not a dashboard.
- **Privacy-first**: avoid collecting sensitive text; store locally by default.

## Habit Stacking Features (beyond the pause itself)

### 1) “After I Pause, I will…” stacks (implementation priority: P0)

A lightweight routine builder that attaches to the completion of the pause.

- **Default stack** (ships with the app):
  - Drink water
  - Stand up + 5 breaths
  - Write 1 sentence (micro-journal)
  - Send the email (quick task)
  - 2-minute tidy
  - Step outside (60 seconds)
- **User stack**: user picks 1–3 actions to appear post-pause.
- **One-tap completion**: completion is a “mark done” event, not a timer-heavy flow.
- **Optional: “suggested next action”**: auto-select one based on time-of-day or last used.

### 2) Contextual triggers (P0/P1)

Let users define when to launch The Pause and/or a stack:

- **Time trigger**: morning / lunch / evening (soft reminders, opt-in)
- **Location trigger** (later): “arrive at work” / “get home”
- **App trigger** (later): “after 10 minutes of scrolling” (OS constraints apply)
- **Manual trigger**: home screen widget / shortcut (“I need to pause”)

### 3) “Implementation Intentions” (P1)

Convert intention into an if/then plan:

- Prompt variant (optional): “If I feel ___, then I will ___.”
- Store as a short rule that can be spoken by Richard occasionally.

### 4) Beads / Orb as *cumulative* practice (P0)

Replace streak pressure with accumulation:

- Every completed pause adds **+1 bead** (or +N based on duration).
- Orb grows/brightens gradually; milestones unlock short spoken reinforcements.
- Optional: “today’s beads” vs “all-time beads” (no streak logic).

### 5) Frictionless follow-through (P1)

Reduce the gap between calm and action:

- “Open the thing” quick links: open Notes, Calendar, Mail, etc. (platform permitting)
- “1-minute runway” timer: one minute to start, not to finish
- “Lock screen cue” (later): widget showing “After I pause, I will…”

### 6) Reflection without journaling (P1)

Keep it one line:

- “What did you do?” (optional, 1 sentence)
- Or a multiple-choice “What changed?” (calmer / clearer / focused / neutral)

## MVP recommendation (expanded)

If we expand v1 beyond the original doc set, the safest “steelman MVP+” is:

- The Pause (thumb-hold + audio)
- Intention (single line)
- **Stack (After I Pause, I will…)** (pick 1 default action)
- **Cumulative Beads/Orb** (no streaks)
- Minimal settings (haptics, reminders)



