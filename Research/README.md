# The Pause (working repo)

This repository currently contains **product + UX documentation** for **The Pause**, a mobile micro-intervention app built around the loop:

**Open → 60–90s guided “Pause” (Golden Light + Breathing, thumb-hold + haptics) → set a single Intention → done → Streak/Vessel tracks consistency**

## What’s in this repo (today)

- **Docs**: `docs/`
  - `docs/00_Index.md`: fastest overview + what’s cut from MVP
  - `docs/01_Product_Vision.md`: positioning and success metrics
  - `docs/02_MVP_Features.md`: the 3 MVP features (Pause, Intention, Streak)
  - `docs/03_UI_Design_Specs.md`: colors/typography/layout/haptics/animation guidance
  - `docs/04_Roadmap.md`: phased roadmap (v1.0 → v3.0)
  - `docs/05_Content_Inventory.md`: content themes + script requirements
  - `docs/06_Build_Execution.md`: build plan + proposed dependencies + launch checklist
  - `docs/07_Google_Stitch_Prompts.md`: prompts (design/content generation support)
- **Legacy concept doc**: `App_Concept_and_Architecture.md`
  - Superseded by `docs/00_Index.md` (kept for historical context).
- **Raw content inventory**: `IG content.md` (large)

## What’s *not* in this repo (yet)

- No mobile source code (no React Native/Expo project, no Xcode project, no Android project).
- No build tooling (`package.json`, `app.json`, `ios/`, `android/`, etc.).

## Key product decisions (MVP)

From `docs/00_Index.md` + `docs/02_MVP_Features.md`:

- **One practice in MVP**: Golden Light + Breathing (60–90s)
- **No navigation**: one primary screen + streak modal
- **No action menu / journaling / toolbox**: only a single intention prompt after the pause
- **Streak visualization**: “Vessel fills with light” (not a calendar)
- **Data**: local-only storage in MVP (no accounts, no backend)

## Open/ambiguous technical decision to resolve

The docs currently conflict on the v1 implementation approach:

- `docs/00_Index.md` + `docs/06_Build_Execution.md`: **React Native + Expo** (iOS-first but keeps Android path open)
- `docs/04_Roadmap.md`: **iOS app (Swift/SwiftUI)** as primary platform

Before scaffolding code, we should confirm which direction we’re taking for v1:

- **Expo** (fastest iteration, easier cross-platform later)
- **Swift/SwiftUI** (best iOS-native feel/haptics, but Android becomes a separate build later)



