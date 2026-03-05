// Exercise categories for the radial selector on the home screen
// 4 core exercises positioned radially around the golden orb

export type ExerciseIconId = 'wind' | 'sun' | 'hash' | 'smile';

export interface ExerciseCategory {
  id: string;
  name: string;
  shortName: string;
  iconId: ExerciseIconId;
  description: string;
  defaultDuration: number; // seconds
  angle: number; // Radial position in degrees (0 = top, clockwise)
}

// 4 core exercise categories positioned radially (90° spacing)
// Positions: Breath (top), Light (right), Count (bottom), Relax (left)
export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  {
    id: 'breath',
    name: 'Diaphragmatic Breathing',
    shortName: 'Breath',
    iconId: 'wind',
    description: 'Slow, deep breathing for calm',
    defaultDuration: 90,
    angle: 0, // Top
  },
  {
    id: 'light',
    name: 'Golden Light',
    shortName: 'Light',
    iconId: 'sun',
    description: 'Visualization for inner warmth',
    defaultDuration: 90,
    angle: 90, // Right
  },
  {
    id: 'count',
    name: 'Counting Practice',
    shortName: 'Count',
    iconId: 'hash',
    description: 'Mental focus and clarity',
    defaultDuration: 60,
    angle: 180, // Bottom
  },
  {
    id: 'relax',
    name: 'Progressive Relaxation',
    shortName: 'Relax',
    iconId: 'smile',
    description: 'Release tension head to toe',
    defaultDuration: 90,
    angle: 270, // Left
  },
];

export type ExerciseCategoryId = 'breath' | 'light' | 'count' | 'relax';

// Get category by ID
export function getExerciseCategory(id: string): ExerciseCategory | undefined {
  return EXERCISE_CATEGORIES.find(cat => cat.id === id);
}

// Contextual suggestions based on time of day
export function getContextualSuggestion(): {
  greeting: string;
  suggestion: string;
  recommendedExercise: ExerciseCategoryId;
} {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return {
      greeting: 'Good morning.',
      suggestion: "Start your day with a moment of clarity. Try a 90-second breathing exercise.",
      recommendedExercise: 'breath',
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: 'Good afternoon.',
      suggestion: "Let's take a moment to reset with a 90-second breathing exercise.",
      recommendedExercise: 'breath',
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: 'Good evening.',
      suggestion: 'Wind down with a golden light visualization.',
      recommendedExercise: 'light',
    };
  } else {
    return {
      greeting: 'Time to rest.',
      suggestion: 'Clear your mind with a counting exercise before sleep.',
      recommendedExercise: 'count',
    };
  }
}
