/**
 * Centralized haptics hook that respects user preferences
 *
 * Provides all haptic feedback patterns used in the app with
 * automatic checking of user's hapticEnabled preference.
 */

import * as Haptics from 'expo-haptics';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useCallback, useMemo } from 'react';

export function useHaptics() {
  const user = useQuery(api.users.getCurrent);
  const enabled = user?.hapticEnabled ?? true;

  // Core haptic functions with preference check
  const impact = useCallback(
    (style: Haptics.ImpactFeedbackStyle) => {
      if (enabled) {
        Haptics.impactAsync(style);
      }
    },
    [enabled]
  );

  const notification = useCallback(
    (type: Haptics.NotificationFeedbackType) => {
      if (enabled) {
        Haptics.notificationAsync(type);
      }
    },
    [enabled]
  );

  const selection = useCallback(() => {
    if (enabled) {
      Haptics.selectionAsync();
    }
  }, [enabled]);

  // Convenience methods matching Stitch haptic specification
  const haptics = useMemo(
    () => ({
      enabled,

      // Raw access to haptic types
      impact,
      notification,
      selection,

      // Named patterns from Stitch spec
      start: () => impact(Haptics.ImpactFeedbackStyle.Heavy),
      pulse: () => impact(Haptics.ImpactFeedbackStyle.Light),
      complete: () => notification(Haptics.NotificationFeedbackType.Success),
      select: () => selection(),
      dotPop: () => impact(Haptics.ImpactFeedbackStyle.Soft),
      error: () => notification(Haptics.NotificationFeedbackType.Error),

      // Breathing rhythm haptics
      inhale: () => impact(Haptics.ImpactFeedbackStyle.Light),
      exhale: () => impact(Haptics.ImpactFeedbackStyle.Soft),

      // Button feedback
      buttonPress: () => impact(Haptics.ImpactFeedbackStyle.Light),
      buttonHeavy: () => impact(Haptics.ImpactFeedbackStyle.Medium),
    }),
    [enabled, impact, notification, selection]
  );

  return haptics;
}

/**
 * Standalone haptic functions for use outside React components
 * Note: These bypass preference checks - use useHaptics in components
 */
export const hapticPatterns = {
  start: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  pulse: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  complete: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  select: () => Haptics.selectionAsync(),
  dotPop: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};
