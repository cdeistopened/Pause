# Stitch Design Reference

> Saved before context compaction - December 31, 2024

## Design Files in this folder:
- `during-pause.html` - Active session screen
- `intention.html` - Post-pause intention capture
- `onboarding.html` - Welcome screen
- `onboarding-focus.html` - Focus selection
- `progress.html` - Dot grid progress tracking

## Key Design Patterns from Stitch HTML

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| Primary Gold | `#d4a954` or `#FCD34D` | Buttons, accents, orb |
| Background Dark | `#1A2B3C` or `#0A0E1A` | Main background |
| Surface Dark | `#23364A` | Cards, inputs |
| Text Gold | `#FFEBB8` or `#e8c87e` | Coach messages |

### PAUSE (Home) Screen
- **TRUE RADIAL layout** - 5 exercise options positioned around orb:
  - Top: Breath (selected, golden dot)
  - Top-right: Light
  - Bottom-right: Count
  - Bottom-left: Talk
  - Top-left: Relax
- Dashed circle ring around orb
- Streak counter (fire icon) top-left
- Settings button top-right
- "Hold to begin" with golden glow
- Breathing animation on orb (scale 1.0 → 1.08)

### During Pause (Active Session)
- Close button top-left (X in circle)
- "Live" indicator with red dot top-right
- Large orb with:
  - Audio waveform visualization (vertical bars)
  - Timer centered: `0:47 / 1:30`
- Exercise name below orb
- Progress bar (golden fill)
- Caption text: `"Breathe in the golden light..."`

### Library Screen
- Large title "Library"
- Tab underline style (not pill buttons)
- Cards with:
  - 64px icon in rounded square
  - Title + duration + category
  - Golden play button (or lock for premium)
- Floating pill-shaped bottom navigation

### Coach Screen
- Dr. Miller avatar with green online dot
- Gold-tinted coach message bubbles
- User messages in gray
- Suggested action cards (embedded exercise start)
- Large golden mic button at bottom
- Horizontal scrolling quick prompts
- Keyboard toggle button

### Onboarding
- Hero image with golden glow behind
- Large title with golden "The Pause" text
- Gradient CTA button (gold → darker gold)
- Progress dots for multi-step flow

### Intention Screen
- Check icon with pulsing glow
- "Pause complete" title
- "What will you carry forward?" prompt
- Rounded textarea input
- Golden "Done" button
- "Skip" link with arrow
