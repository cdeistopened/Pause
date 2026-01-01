# The Pause - Google Stitch Prompts

## Overview
These prompts are optimized for Google Stitch to generate UI prototypes for The Pause app. Use them sequentially to build out the core screens.

---

## Prompt 1: The Pause (Main Screen - Idle State)

```
Create a mobile app screen for a meditation/mindfulness app called "The Pause".

Design specifications:
- Background: Deep navy (#0A0E1A), solid color, no gradients
- Center: A soft glowing circle (golden amber #D4A853), approximately 120px diameter, with a subtle pulse animation glow
- Below the circle: A minimal, abstract human body silhouette in muted gray (#8A8A8A), gender-neutral, simple outline only
- Above the circle: Text "Ready to pause?" in off-white (#F0F0F0), SF Pro Display Light, 28pt
- Below the silhouette: Small instruction text "Place thumb to begin" in muted gray (#8A8A8A), 14pt
- Top right corner: Small circle indicator for streak count, subtle, 24px

Style: Minimal, calming, dark mode, no navigation bars, no buttons except the central touch target. The interface should feel invisible and distraction-free. Premium wellness app aesthetic similar to Calm or Headspace but darker and more minimal.
```

---

## Prompt 2: The Pause (Active State - During Practice)

```
Create a mobile app screen showing an active meditation session in progress.

Design specifications:
- Background: Deep navy (#0A0E1A)
- Center: The same golden circle (#D4A853) but slightly larger (scaled up 5%), indicating touch is active
- Body silhouette: Now filling with golden light from bottom to top, showing approximately 40% filled. The fill should be a warm gradient from #D4A853 to #F5DEB3
- No text visible on screen (the UI disappears during the practice)
- Subtle ambient glow around the filled portion of the body
- Top right: Same streak indicator, slightly dimmed

Style: The screen should feel immersive and focused. No chrome, no controls, no time display. The user's attention should be entirely on the visualization of light filling the body. Dark, premium, meditative.
```

---

## Prompt 3: The Pause (Complete State)

```
Create a mobile app screen showing a completed meditation session.

Design specifications:
- Background: Deep navy (#0A0E1A)
- Body silhouette: Fully filled with golden light (#D4A853), gently glowing
- The golden circle has a subtle "complete" pulse or ring animation
- Very brief transitional state before moving to next screen

Style: Moment of completion, peaceful, accomplished feeling. Warm glow. Still minimal and distraction-free.
```

---

## Prompt 4: The Intention Screen

```
Create a mobile app screen for setting an intention after meditation.

Design specifications:
- Background: Deep navy (#0A0E1A)
- Center-top area: Text prompt "What will you do now?" in off-white (#F0F0F0), SF Pro Display Light, 28pt, centered
- Middle: Single-line text input field, minimal styling, subtle bottom border in muted gray (#8A8A8A), placeholder text in gray
- Below input: Button labeled "Go" - rounded rectangle, golden amber (#D4A853) background, dark text, approximately 120px wide
- No other UI elements - no back button, no navigation

Style: Clean, focused, action-oriented. The screen exists only to capture one thing: what the user will do next. No distractions, no options, no menus. The "Go" button should feel like a commitment, not a submission.
```

---

## Prompt 5: The Streak Screen (Modal)

```
Create a mobile app modal/overlay screen showing streak progress.

Design specifications:
- Background: Semi-transparent dark overlay over the main screen
- Modal card: Slightly lighter navy (#121829), rounded corners (16px), centered, approximately 80% screen width
- Top right of modal: Close button (X icon) in muted gray
- Center of modal: A vessel/container shape (like a rounded vase or cup), outline in gold (#D4A853)
- The vessel is approximately 60% filled with golden light, showing accumulated progress
- Below vessel: Large text "47 pauses" in off-white, 32pt
- Below that: "12 day streak" in muted gray, 18pt
- Bottom of modal: Italicized quote "A little over time is a lot." in soft gold (#F5DEB3), 14pt

Style: Celebratory but not gamified. The vessel visualization should feel like something meaningful being filled over time, not a game progress bar. Warm, encouraging, premium.
```

---

## Prompt 6: Settings Screen (Minimal)

```
Create a minimal settings screen for a meditation app.

Design specifications:
- Background: Deep navy (#0A0E1A)
- Top: "Settings" title in off-white, 24pt, left-aligned with padding
- Two toggle rows only:
  1. "Notifications" with toggle switch (gold when on, gray when off)
  2. "Haptic feedback" with toggle switch
- Each row: Label on left in off-white, toggle on right, subtle separator line below in dark gray
- Bottom of screen: Small text "The Pause v1.0" in muted gray, centered
- Back arrow or close button in top left

Style: Extremely minimal. Only two options. No account settings, no about page links, no social buttons. This screen should feel almost empty - settings are not where users spend time in this app.
```

---

## Prompt 7: Welcome/First Launch Screen

```
Create a first-launch welcome screen for a meditation app called "The Pause".

Design specifications:
- Background: Deep navy (#0A0E1A)
- Center: App logo or wordmark "The Pause" in soft gold (#F5DEB3), elegant, minimal typography
- Below logo: Tagline "60 seconds to change your day" in off-white, 18pt
- Below tagline: Simple golden circle (the main touch target preview), smaller scale, subtle glow
- Bottom third: Single button "Begin" in golden amber (#D4A853), rounded, centered

Style: Welcoming but not busy. No carousel, no multiple onboarding screens, no feature tour. The app teaches by doing - this screen just gets them started. Premium, confident, minimal.
```

---

## Component Prompts (For Design System)

### Golden Circle Component
```
Design a touch target component for a meditation app.

- Circular shape, 120px diameter
- Fill: Golden amber (#D4A853)
- Subtle outer glow (same color, 20% opacity, 8px blur)
- Idle state: Gentle pulse animation (scale 1.0 to 1.05, 2 second loop)
- Active state (pressed): Scale to 1.08, glow intensifies
- Premium, warm, inviting feel
```

### Body Silhouette Component
```
Design an abstract human body silhouette for a meditation visualization.

- Simple outline, gender-neutral, no facial features
- Standing pose, arms slightly away from body
- Outline color: Muted gray (#8A8A8A)
- Designed to be "filled" with color from bottom to top
- Approximately 200px tall
- Minimal detail, almost iconographic
- Should feel universal, not specific to any body type
```

### Vessel/Streak Component
```
Design a vessel or container shape for visualizing accumulated progress.

- Shape: Rounded vase or cup form, symmetric
- Outline: Golden amber (#D4A853), 2px stroke
- Interior: Can be filled with golden gradient from bottom
- Approximately 150px tall, 100px wide
- Should feel like something being filled over time
- Elegant, not gamified - more like an hourglass or meaningful container than a progress bar
```

---

## Style Guide Summary for Stitch

When generating any screen, maintain these constants:

| Element | Value |
|---------|-------|
| Background | #0A0E1A (deep navy) |
| Primary accent | #D4A853 (golden amber) |
| Secondary accent | #F5DEB3 (soft gold) |
| Text primary | #F0F0F0 (off-white) |
| Text secondary | #8A8A8A (muted gray) |
| Font | SF Pro (iOS) / System default |
| Corner radius | 12-16px on cards/buttons |
| Spacing | Generous, breathing room |
| Aesthetic | Dark mode, minimal, premium wellness |

**Avoid**: Bright colors, busy backgrounds, gradients (except in visualizations), navigation bars, tab bars, hamburger menus, social icons, gamification elements (badges, points, levels).
