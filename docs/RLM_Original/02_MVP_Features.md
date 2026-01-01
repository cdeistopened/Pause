# The Pause - MVP Features (v1.0)

## Design Principle
> "Limit the number of features and make every feature perfect."

The MVP has exactly THREE features. No more.

---

## Feature 1: The Pause (Core Experience)

### What It Is
A 60-90 second guided micro-practice combining Golden Light visualization with conscious breathing. Dr. Miller's voice guides throughout.

### User Flow
1. Open app → lands directly on Pause screen (no navigation required)
2. See simple prompt: "Ready to pause?"
3. Place thumb on glowing circle (haptic feedback confirms contact)
4. Audio begins: Dr. Miller's voice
5. Visual: Golden light spreads through body silhouette as practice progresses
6. Maintain thumb contact throughout (grounding mechanism)
7. Practice completes → gentle haptic pulse

### The Script Structure (recorded)
1. **Personalized invocation** (AI voice): "You're here. That's the first step. Let's pause." 
   - Future: Can reference user's stated concern
2. **Breathing initiation**: "Breathe from your belly. Small breaths. In... out..."
3. **Golden Light visualization**: "Picture golden light at the top of your head. Feel it spread down through your face, your neck, your shoulders..."
4. **Grounding**: "Feel your thumb on the screen. You're here. You're present."
5. **Transition to action**: "Now. What will you do?"

### UI Specifications
- **Background**: Deep navy or black (calming, reduces stimulation)
- **Central element**: Soft glowing circle (gold/amber) - the touch target
- **Body silhouette**: Abstract, minimal, gender-neutral - lights up progressively
- **Typography**: None during practice (audio only)
- **No skip button**: The practice is 60-90 seconds. Commit or close the app.

### Audio Specifications
- Dr. Miller's recorded voice for core script
- AI-generated Dr. Miller voice for personalized elements
- Subtle ambient tone underneath (not music - just grounding frequency)
- No nature sounds, no new age bells

---

## Feature 2: The Intention (Bridge to Action)

### What It Is
Immediately post-pause, a single prompt captures what the user will do next. This bridges calm → action.

### User Flow
1. Pause completes
2. Screen transitions to simple text: "What will you do now?"
3. Single text input field (no options, no suggestions)
4. User types intention (e.g., "Finish the email," "Call mom," "Take a walk")
5. User taps "Go" 
6. App minimizes or shows brief confirmation
7. Intention is logged (for streak/history)

### UI Specifications
- **Background**: Same deep navy/black
- **Prompt**: Large, centered text
- **Input**: Single line, minimal styling
- **Button**: "Go" - not "Submit" or "Save" (action-oriented language)
- **No character limit displayed** (but cap at ~100 chars internally)

### Design Decisions
- NO menu of suggested actions (kills momentum, creates decision fatigue)
- NO journaling option (that's a different app)
- NO "skip" option (if you did the pause, you set an intention - that's the contract)

---

## Feature 3: The Streak (Skill Building)

### What It Is
Visual representation of accumulated practice. Reinforces "a little over time is a lot."

### Visualization Concept
NOT a calendar grid with checkmarks (boring, punitive when you miss).

Instead: **The Vessel**
- A simple vessel/container that fills with golden light
- Each completed pause adds a visible increment
- Shows: current streak (consecutive days) + total pauses (all time)
- Vessel "glows" more intensely as it fills

Alternative concept: **The Growing Light**
- Abstract orb that grows larger/brighter with each pause
- Pulses gently when you open the app
- Number overlay: "47 pauses" 

### Access
- Accessed via subtle tap on corner indicator from main screen
- NOT a bottom nav tab (the app doesn't need navigation - it's one screen with one modal)

### Streak Mechanics
- Streak = consecutive days with at least 1 pause
- Streak doesn't break until 48 hours pass (grace period for real life)
- No push notification nagging about streaks
- Optional: AI Dr. Miller voice milestone messages ("You've paused 50 times. A little over time is a lot. You're building the skill.")

---

## What's NOT in MVP

| Feature | Why It's Cut |
|---|---|
| Multiple practice types (Counting, Body Scan, etc.) | One perfect practice > menu of options. Add later. |
| Plan Your Day | Calendar apps exist. Not our job. |
| Journal | Scope creep. Intention capture is enough. |
| Affirmations screen | Passive. Doesn't fit "pause and act" model. |
| Sleep Wind-Down | We're not Calm. |
| Toolbox/Learning Library | Content graveyards. Nobody reads these. |
| AI Chat | V2. Voice is enough for V1. |
| Community features | V2. |
| Mood logging | V2. Adds friction for unclear value. |
