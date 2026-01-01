# The Pause - Documentation Index

## Quick Links

| Doc | Description |
|---|---|
| [01_Product_Vision](./01_Product_Vision.md) | Why this app exists, positioning, differentiators |
| [02_MVP_Features](./02_MVP_Features.md) | The three features: Pause, Intention, Streak |
| [03_UI_Design_Specs](./03_UI_Design_Specs.md) | Colors, typography, screen layouts, animations |
| [04_Roadmap](./04_Roadmap.md) | Phased release plan, v1 through v3 |
| [05_Content_Inventory](./05_Content_Inventory.md) | Dr. Miller's content organized by theme |
| [06_Build_Execution](./06_Build_Execution.md) | Tech stack, sprints, costs, launch checklist |

---

## App Summary

**Name**: The Pause

**One-liner**: The psychologist's toolkit for immediate mood change.

**Core loop**: Open → Thumb on screen → 90-second guided practice (Dr. Miller's voice) → Set intention → Go do it

**Three features (MVP)**:
1. **The Pause**: Golden Light + Breathing, haptic thumb-hold, 90 seconds
2. **The Intention**: "What will you do now?" → single text input → done
3. **The Streak**: Vessel fills with light, tracks "a little over time is a lot"

**What's cut**: Journals, planners, toolboxes, sleep features, AI chat, social, gamification

---

## Key Decisions Made

| Decision | Choice | Rationale |
|---|---|---|
| Number of practices in MVP | 1 (Golden Light + Breathing) | One perfect practice > menu of options |
| Post-pause flow | Single intention input, no menu | Decision fatigue kills momentum |
| Streak visualization | Filling vessel, not calendar grid | Emphasizes accumulation, not punishment for misses |
| AI in MVP | No (V2) | Dr. Miller's recorded voice IS the product |
| Navigation | None (one screen + modal) | Invisible interface philosophy |
| Platform | iOS first (React Native) | Go where Dr. Miller's audience is, but keep Android path open |

---

## Open Questions

1. **App name**: "The Pause" is working title. Alternatives: "Mind Remote", "The Remote", "Pause.", "Golden Light"
2. **Pricing**: Freemium tiers TBD. $4.99/mo? $39.99/year? Or start free, add premium later?
3. **Audio recording**: When can we schedule Dr. Miller? Need 60-90 min session.
4. **AI voice**: Which provider? ElevenLabs? Need voice sample consent from Dr. Miller.

---

## Archived

The original `App_Concept_and_Architecture.md` is preserved but superseded by this documentation. Key changes from original:
- Reduced 6 "Centering Channels" to 1 unified practice
- Removed "Action Menu" with 6 options (replaced with single intention input)
- Removed Toolbox/Learning Library
- Removed Plan Your Day, Journal, Affirmations, Sleep Wind-Down
- Added haptic interaction as core differentiator
- Simplified streak from calendar to vessel visualization
