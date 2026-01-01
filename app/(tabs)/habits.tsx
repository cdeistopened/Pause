import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Award, Info } from 'lucide-react-native';

// Placeholder data - will be replaced with Convex data
const PROGRESS_DATA = {
  totalPauses: 147,
  currentStreak: 47,
  longestStreak: 89,
  yearGoal: 365,
};

// Generate dots
const DOT_COLUMNS = 20;
const TOTAL_DOTS = Math.ceil(PROGRESS_DATA.yearGoal / DOT_COLUMNS) * DOT_COLUMNS;

export default function ProgressScreen() {
  const filledDots = PROGRESS_DATA.totalPauses;

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
              {PROGRESS_DATA.totalPauses}
            </Text>
            <Text className="text-text-secondary text-base font-medium tracking-wide">
              Your Pauses (lifetime practices)
            </Text>
          </View>

          {/* Dot Grid */}
          <View className="mb-8">
            <View className="flex-row flex-wrap gap-2 justify-center">
              {Array.from({ length: TOTAL_DOTS }).map((_, index) => {
                const isFilled = index < filledDots;
                const isCurrent = index === filledDots - 1;

                return (
                  <View
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      isFilled
                        ? 'bg-primary shadow-lg shadow-primary/60'
                        : 'bg-dot-empty'
                    } ${isCurrent ? 'shadow-xl shadow-primary' : ''}`}
                  />
                );
              })}
            </View>
            <Text className="text-text-secondary text-sm font-semibold tracking-wide uppercase text-center mt-8 opacity-70">
              {PROGRESS_DATA.yearGoal} pauses this year
            </Text>
          </View>

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
                  {PROGRESS_DATA.currentStreak}{' '}
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
                  {PROGRESS_DATA.longestStreak}{' '}
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
