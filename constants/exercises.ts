// Exercise categories for the radial selector on the home screen
// 5 exercises positioned radially around the golden orb

export type ExerciseIconId = 'wind' | 'sun' | 'hash' | 'message-circle' | 'smile';

export interface ExerciseCategory {
  id: string;
  name: string;
  shortName: string;
  iconId: ExerciseIconId;
  description: string;
  defaultDuration: number; // seconds
  angle: number; // Radial position in degrees (0 = top, clockwise)
}

// 5 exercise categories positioned radially (Stitch design)
// Positions: Breath (top), Light (top-right), Count (bottom-right), Talk (bottom-left), Relax (top-left)
export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  {
    id: 'breath',
    name: 'Breath',
    shortName: 'Breath',
    iconId: 'wind',
    description: 'Diaphragmatic breathing for calm',
    defaultDuration: 90,
    angle: 0, // Top
  },
  {
    id: 'light',
    name: 'Light',
    shortName: 'Light',
    iconId: 'sun',
    description: 'Golden light visualization',
    defaultDuration: 90,
    angle: 72, // Top-right
  },
  {
    id: 'count',
    name: 'Count',
    shortName: 'Count',
    iconId: 'hash',
    description: 'Mental focus and clarity',
    defaultDuration: 60,
    angle: 144, // Bottom-right
  },
  {
    id: 'talk',
    name: 'Talk',
    shortName: 'Talk',
    iconId: 'message-circle',
    description: 'Positive self-talk practice',
    defaultDuration: 60,
    angle: 216, // Bottom-left
  },
  {
    id: 'relax',
    name: 'Relax',
    shortName: 'Relax',
    iconId: 'smile',
    description: 'Progressive relaxation',
    defaultDuration: 90,
    angle: 288, // Top-left
  },
];

export type ExerciseCategoryId = 'breath' | 'light' | 'count' | 'talk' | 'relax';

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
