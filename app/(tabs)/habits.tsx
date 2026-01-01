import { View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Award, Info, Wind, Sun, Hash, MessageCircle, Smile } from 'lucide-react-native';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';

// Exercise type colors for variety dots
const EXERCISE_COLORS: Record<string, string> = {
  breathing: '#4A90D9',      // Blue
  golden_light: '#D4A853',   // Gold
  counting: '#10B981',       // Green
  self_talk: '#9333EA',      // Purple
  relaxation: '#06B6D4',     // Teal
  default: '#D4A853',        // Fallback gold
};

const EXERCISE_ICONS: Record<string, React.ReactNode> = {
  breathing: <Wind size={12} color="#4A90D9" />,
  golden_light: <Sun size={12} color="#D4A853" />,
  counting: <Hash size={12} color="#10B981" />,
  self_talk: <MessageCircle size={12} color="#9333EA" />,
  relaxation: <Smile size={12} color="#06B6D4" />,
};

// Generate dots
const DOT_COLUMNS = 20;
const YEAR_GOAL = 365;
const TOTAL_DOTS = Math.ceil(YEAR_GOAL / DOT_COLUMNS) * DOT_COLUMNS;

export default function ProgressScreen() {
  // Backend queries for real data
  const user = useQuery(api.users.getCurrent);
  const sessionStats = useQuery(api.sessions.getStatsByExerciseType);
  const recentSessions = useQuery(api.sessions.list, { limit: 365 });

  // Progress data from backend with fallbacks
  const progressData = {
    totalPauses: user?.totalPauses ?? 0,
    currentStreak: user?.currentStreak ?? 0,
    longestStreak: user?.longestStreak ?? 0,
    yearGoal: YEAR_GOAL,
  };

  const filledDots = progressData.totalPauses;

  // Animate new dot when count increases
  const prevPausesRef = useRef(progressData.totalPauses);
  const dotScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (prevPausesRef.current > 0 && prevPausesRef.current < progressData.totalPauses) {
      // New pause completed - animate and haptic
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      Animated.sequence([
        Animated.timing(dotScaleAnim, {
          toValue: 1.4,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(dotScaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
    prevPausesRef.current = progressData.totalPauses;
  }, [progressData.totalPauses, dotScaleAnim]);

  return (
    <View className="flex-1 bg-background-dark">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-white/5 bg-background-dark/80">
          <View className="w-12" />
          <Text className="text-text-primary text-xl font-bold tracking-tight">
            Progress
          </Text>
          <Pressable className="w-12 items-end">
            <Info size={20} color="#d4a954" />
          </Pressable>
        </View>

        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingTop: 24, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Big Number */}
          <View className="items-center mb-10 relative">
            {/* Glow effect */}
            <View className="absolute w-52 h-52 rounded-full bg-primary/20 blur-3xl -top-10" />
            <Text className="text-[7rem] font-bold text-primary tracking-tighter leading-none mb-2">
              {progressData.totalPauses}
            </Text>
            <Text className="text-text-secondary text-base font-medium tracking-wide">
              Your Pauses (lifetime practices)
            </Text>
          </View>

          {/* Dot Grid - Exercise-Colored */}
          <View className="mb-8">
            <View className="flex-row flex-wrap gap-2 justify-center">
              {Array.from({ length: TOTAL_DOTS }).map((_, index) => {
                const isFilled = index < filledDots;
                const isCurrent = index === filledDots - 1;

                // Get exercise type color for this dot
                const session = recentSessions?.[filledDots - 1 - index];
                const exerciseType = session?.exerciseType || 'default';
                const dotColor = isFilled
                  ? EXERCISE_COLORS[exerciseType] || EXERCISE_COLORS.default
                  : undefined;

                // Animate the newest dot
                const dotStyle = isCurrent
                  ? { transform: [{ scale: dotScaleAnim }] }
                  : undefined;

                if (isCurrent && isFilled) {
                  return (
                    <Animated.View
                      key={index}
                      className="w-3 h-3 rounded-full shadow-xl"
                      style={[
                        { backgroundColor: dotColor },
                        { shadowColor: dotColor },
                        dotStyle,
                      ]}
                    />
                  );
                }

                return (
                  <View
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      isFilled ? 'shadow-lg' : 'bg-dot-empty'
                    }`}
                    style={isFilled ? {
                      backgroundColor: dotColor,
                      shadowColor: dotColor,
                    } : undefined}
                  />
                );
              })}
            </View>
            <Text className="text-text-secondary text-sm font-semibold tracking-wide uppercase text-center mt-8 opacity-70">
              {progressData.yearGoal} pauses this year
            </Text>
          </View>

          {/* Exercise Type Breakdown */}
          {sessionStats && Object.keys(sessionStats).length > 0 && (
            <View className="mb-6">
              <Text className="text-text-secondary/60 text-xs font-semibold tracking-wide uppercase mb-3">
                By Exercise
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {Object.entries(sessionStats).map(([type, stats]) => (
                  <View
                    key={type}
                    className="flex-row items-center bg-surface-dark rounded-xl px-3 py-2 border border-white/5"
                  >
                    <View
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: EXERCISE_COLORS[type] || EXERCISE_COLORS.default }}
                    />
                    <Text className="text-text-primary text-sm font-medium">
                      {stats.completedCount}
                    </Text>
                    <Text className="text-text-secondary text-xs ml-1.5 capitalize">
                      {type.replace('_', ' ')}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Stats Cards */}
          <View className="flex-row gap-4 mt-2">
            {/* Current Streak */}
            <View className="flex-1 bg-surface-dark rounded-3xl p-6 h-40 justify-between relative overflow-hidden border border-white/5">
              {/* Corner glow */}
              <View className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
              <View className="p-2 bg-background-dark rounded-full self-start">
                <Flame size={24} color="#d4a954" />
              </View>
              <View>
                <Text className="text-white text-3xl font-bold tracking-tight">
                  {progressData.currentStreak}{' '}
                  <Text className="text-sm font-medium text-text-secondary">
                    days
                  </Text>
                </Text>
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wider mt-2">
                  Current streak
                </Text>
              </View>
            </View>

            {/* Longest Streak */}
            <View className="flex-1 bg-surface-dark rounded-3xl p-6 h-40 justify-between relative overflow-hidden border border-white/5">
              {/* Corner glow */}
              <View className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
              <View className="p-2 bg-background-dark rounded-full self-start">
                <Award size={24} color="#d4a954" />
              </View>
              <View>
                <Text className="text-white text-3xl font-bold tracking-tight">
                  {progressData.longestStreak}{' '}
                  <Text className="text-sm font-medium text-text-secondary">
                    days
                  </Text>
                </Text>
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wider mt-2">
                  Longest streak
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
