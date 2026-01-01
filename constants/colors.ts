// Color palette for The Pause app
// Canonical design system - December 2024
// Gold: #d4a954 (Stitch canonical)

export const COLORS = {
  // Backgrounds - Deep navy tones
  background: '#0A0E1A',        // Deep navy - primary background
  backgroundLight: '#162235',   // Surface dark - cards, modals
  backgroundDark: '#050810',    // Darker for overlays
  backgroundMid: '#0E1525',     // Mid-tone for gradients

  // Gradient stops
  gradientTop: '#0A0E1A',       // Deep navy top
  gradientMid: '#162235',       // Surface dark
  gradientBottom: '#1E2C42',    // Lighter surface

  // Primary - Stitch gold (canonical)
  primary: '#d4a954',           // Primary Gold - main accent
  primaryLight: '#e8c87e',      // Hover states, highlights
  primaryDark: '#b8923f',       // Pressed states

  // Text gold
  textGold: '#FFEBB8',          // Coach messages, warm text

  // Accent - Muted purple for CTAs
  accent: '#8B5CF6',            // Muted purple
  accentLight: '#A78BFA',       // Lighter purple
  accentDark: '#7C3AED',        // Darker purple

  // Text
  textPrimary: '#F0F0F0',       // Off-White - main text
  textSecondary: '#A0A0A0',     // Muted Gray - secondary text
  textMuted: '#6A7A7A',         // Teal-tinted muted for hints

  // Semantic colors
  success: '#10B981',           // Green - completions, streaks
  warning: '#F59E0B',           // Amber - warnings
  error: '#EF4444',             // Red - errors

  // Premium
  premium: '#9333EA',           // Purple - premium badge
  premiumLight: '#A855F7',      // Lighter purple

  // UI Elements
  border: '#2A3A40',            // Subtle teal-tinted borders
  divider: '#1F2A30',           // Divider lines
  tabInactive: '#6B7280',       // Inactive tab icons

  // Orb colors
  orbGlow: 'rgba(212, 169, 84, 0.3)',   // Golden glow around orb
  orbCenter: '#e8c87e',                  // Center of the orb
  orbShadow: 'rgba(212, 169, 84, 0.5)', // Stronger glow for active state

  // Dot grid (Progress screen)
  dotFilled: '#d4a954',               // Filled dots
  dotEmpty: '#2E3A4D',                // Empty dots
  dotCurrent: '#d4a954',              // Current dot with glow

  // Contextual banner
  bannerBackground: 'rgba(255, 255, 255, 0.08)',  // Frosted glass effect
  bannerBorder: 'rgba(255, 255, 255, 0.12)',

  // Radial selector
  selectorInactive: 'rgba(255, 255, 255, 0.06)',
  selectorActive: 'rgba(212, 169, 84, 0.15)',
  selectorBorder: 'rgba(212, 169, 84, 0.3)',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

export type ColorName = keyof typeof COLORS;
