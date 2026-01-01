# The Pause - Design System

> Extracted from Stitch outputs. December 31, 2024.

---

## Colors

### Primary (Canonical)
| Name | Hex | Usage |
|------|-----|-------|
| **Primary Gold** | `#EBB305` | Orb, buttons, accents |
| **Primary Light** | `#FCD34D` | Hover states, highlights |
| **Primary Glow** | `rgba(235, 179, 5, 0.3)` | Shadows, glows |

### Backgrounds
| Name | Hex | Usage |
|------|-----|-------|
| **Background Dark** | `#0A0E1A` | Main app background |
| **Surface Dark** | `#162235` | Cards, modals |
| **Input BG** | `#1F2937` | Form inputs |

### Text
| Name | Hex | Usage |
|------|-----|-------|
| **Text Primary** | `#F0F4F8` / `#FFFFFF` | Headings, main text |
| **Text Secondary** | `#8A9BB5` / `#B0C4DE` | Labels, captions |
| **Dot Empty** | `#2E3A4D` | Inactive dots |

---

## Typography

### Font Family
- **Display**: `Manrope` (weights 200-800)
- Fallback: `sans-serif`

### Scale
| Element | Size | Weight |
|---------|------|--------|
| Big number (Progress) | `7rem` | Bold |
| Timer (During Pause) | `4.5rem` / `5.5rem` | Light |
| Page heading | `4xl` (2.25rem) | Bold/Extrabold |
| Section heading | `2xl` (1.5rem) | Semibold |
| Body | `xl` (1.25rem) | Medium |
| Caption | `sm` (0.875rem) | Semibold, uppercase |

---

## Border Radius

| Size | Value | Usage |
|------|-------|-------|
| Default | `1rem` (16px) | Standard cards |
| Large | `2rem` (32px) | Prominent cards |
| XL | `3rem` (48px) | Inputs, large buttons |
| Full | `9999px` | Pills, dots, orb |

---

## Shadows & Glows

### Orb Glow
```css
box-shadow: 0 0 100px -20px rgba(212, 169, 84, 0.5),
            inset 0 0 60px rgba(212, 169, 84, 0.2);
```

### Card Shadow
```css
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
```

### Button Glow
```css
box-shadow: 0 0 15px rgba(235, 179, 5, 0.3);
```

### Text Glow
```css
text-shadow: 0 0 25px rgba(212, 169, 84, 0.6);
```

---

## Animations

### Float (Orb)
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
animation: float 6s ease-in-out infinite;
```

### Wave (Audio Bars)
```css
@keyframes wave {
  0%, 100% { opacity: 0.6; height: 30%; }
  50% { opacity: 1; height: 70%; }
}
animation: wave 1.5s ease-in-out infinite;
```

### Pulse Glow (Current Dot)
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px rgba(212, 168, 83, 0.5); }
  50% { box-shadow: 0 0 15px rgba(212, 168, 83, 0.9); }
}
animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

### Fade Up (Entrance)
```css
@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
animation: fadeUp 0.8s ease-out forwards;
```

---

## Components

### Dot Grid
- 20 columns, gap 8px horizontal, 10px vertical
- Filled: `bg-primary` with glow shadow
- Empty: `bg-dot-empty` (#2E3A4D)
- Current: Ring + pulse-glow animation

### Stats Card
- `bg-surface-dark` with `border border-white/5`
- Hover: `hover:border-primary/20 hover:-translate-y-1`
- Blur glow in corner: `bg-primary/10 blur-xl`

### Button (Primary)
- `bg-primary` → `hover:bg-primary-light`
- `rounded-full` or `rounded-xl`
- Height: `h-14` (56px)
- Font: Bold, uppercase, tracking-wide

### Input (Textarea)
- `bg-input-bg` (#1F2937)
- `rounded-3xl`
- Focus: `ring-2 ring-primary`
- Caret: `caret-primary`

### Header
- Sticky with `backdrop-blur-md`
- `bg-background-dark/80`
- Border bottom: `border-white/5`

---

## Icons

Using **Material Symbols Outlined** with variable weight:
- Default: weight 400
- Bold checkmark: weight 700
- Size: 20-48px depending on context

---

## Screens Completed

1. ✅ Progress (Dot Grid)
2. ✅ During Pause (Active Session)
3. ✅ Intention (Post-Pause)
4. ✅ Onboarding (Welcome)

## Screens Needed

- [ ] PAUSE Home (idle state with orb + radial selector)
- [ ] Library
- [ ] Coach
- [ ] Settings
- [ ] Onboarding screens 2 & 3
- [ ] Tab bar

---

## Implementation Notes

### For React Native
- Replace Tailwind with NativeWind or StyleSheet
- Manrope font needs to be loaded via expo-font
- Material Symbols → use @expo/vector-icons or custom SVGs
- Animations → react-native-reanimated

### Key Visual Effects
- Radial gradient backgrounds
- Blur overlays (`backdrop-blur-md`)
- Glow shadows on primary elements
- Floating animation on orb
