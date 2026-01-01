// Habit types and configuration for The Pause app
// Based on App Architecture doc - 5 in-app exercises + 4 external habits

// Icon identifiers map to Lucide icons in the UI:
// wind, sun, droplets, hash, message-circle, smile, activity, heart, sunrise
export type HabitIconId = 'wind' | 'sun' | 'droplets' | 'hash' | 'message-circle' | 'smile' | 'activity' | 'heart' | 'sunrise';

export interface HabitConfig {
  id: string;
  name: string;
  iconId: HabitIconId;  // Lucide icon identifier (no emojis)
  description: string;
  defaultGoal: number;
  isInApp: boolean;  // true = tracked automatically via exercises, false = manual check-off
  isPremium?: boolean;
}

// In-app habits (auto-tracked via exercises)
export const IN_APP_HABITS: Record<string, HabitConfig> = {
  breathing: {
    id: 'breathing',
    name: 'Breathing Practice',
    iconId: 'wind',
    description: 'Quick calm for anxious moments',
    defaultGoal: 10,
    isInApp: true,
    isPremium: false,
  },
  golden_light: {
    id: 'golden_light',
    name: 'Golden Light',
    iconId: 'sun',
    description: 'Visualization for energy and healing',
    defaultGoal: 1,
    isInApp: true,
    isPremium: false,
  },
  counting: {
    id: 'counting',
    name: 'Counting',
    iconId: 'hash',
    description: 'Mental focus and thought control',
    defaultGoal: 1,
    isInApp: true,
    isPremium: false,
  },
  self_talk: {
    id: 'self_talk',
    name: 'Positive Self-Talk',
    iconId: 'message-circle',
    description: 'Replace criticism with affirmation',
    defaultGoal: 1,
    isInApp: true,
    isPremium: true,
  },
  relaxation: {
    id: 'relaxation',
    name: 'Progressive Relaxation',
    iconId: 'smile',
    description: "Jacobson's technique for body tension",
    defaultGoal: 1,
    isInApp: true,
    isPremium: true,
  },
} as const;

// External habits (manual check-off)
export const EXTERNAL_HABITS: Record<string, HabitConfig> = {
  hydration: {
    id: 'hydration',
    name: 'Hydration',
    iconId: 'droplets',
    description: 'Track water intake',
    defaultGoal: 8,
    isInApp: false,
  },
  exercise: {
    id: 'exercise',
    name: 'Physical Exercise',
    iconId: 'activity',
    description: 'Movement is medicine',
    defaultGoal: 1,
    isInApp: false,
  },
  gratitude: {
    id: 'gratitude',
    name: 'Gratitude',
    iconId: 'heart',
    description: 'Acknowledge something good',
    defaultGoal: 3,
    isInApp: false,
  },
  morning_mood: {
    id: 'morning_mood',
    name: 'Set Your Mood',
    iconId: 'sunrise',
    description: 'Start the day with intention',
    defaultGoal: 1,
    isInApp: false,
  },
} as const;

// Combined habits object for easy access
export const HABIT_TYPES = {
  ...IN_APP_HABITS,
  ...EXTERNAL_HABITS,
} as const;

// Exercise types that appear on the Pause screen
export const EXERCISE_TYPES = Object.values(IN_APP_HABITS);

// Free tier exercises (first 3)
export const FREE_EXERCISES = ['breathing', 'golden_light', 'counting'];

// Premium exercises
export const PREMIUM_EXERCISES = ['self_talk', 'relaxation'];

// Helper to get habit config by ID
export function getHabitConfig(habitId: string): HabitConfig | undefined {
  return HABIT_TYPES[habitId as keyof typeof HABIT_TYPES];
}

// Type for habit IDs
export type HabitId = keyof typeof HABIT_TYPES;
export type ExerciseId = keyof typeof IN_APP_HABITS;
