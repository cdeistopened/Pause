import { View, Text, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Sparkles, Clock, BarChart3, ArrowRight } from 'lucide-react-native';
import { useEffect, useRef } from 'react';

const TIPS = [
  { icon: Sparkles, text: 'Start with just 60 seconds' },
  { icon: Clock, text: "We'll remind you at your chosen time" },
  { icon: BarChart3, text: 'Track your progress with dot grids' },
];

export default function ReadyScreen() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Subtle pulse animation for the check icon
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  const handleStart = () => {
    // TODO: Mark onboarding complete in storage
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-background-dark">
      {/* Background gradient */}
      <LinearGradient
        colors={['#2a4561', '#162235', '#0A0E1A']}
        locations={[0, 0.4, 1]}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 px-6 pt-20 items-center">
          {/* Success Icon */}
          <Animated.View
            style={{ transform: [{ scale: pulseAnim }] }}
            className="mb-10"
          >
            <View className="relative">
              {/* Glow */}
              <View className="absolute -inset-4 rounded-full bg-primary/30 blur-xl" />
              {/* Circle */}
              <View className="w-28 h-28 rounded-full bg-background-dark/80 border-2 border-primary/50 items-center justify-center">
                <Check size={56} color="#d4a954" strokeWidth={2.5} />
              </View>
            </View>
          </Animated.View>

          {/* Title */}
          <Text className="text-4xl font-bold text-text-primary text-center mb-4">
            You're all set!
          </Text>
          <Text className="text-lg text-text-secondary text-center leading-7 px-4 mb-12">
            Your journey to mindfulness begins now. Take a moment to pause whenever you need it.
          </Text>

          {/* Tips */}
          <View className="w-full gap-4">
            {TIPS.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <View
                  key={index}
                  className="flex-row items-center gap-4 bg-surface-dark/80 rounded-2xl p-5 border border-white/5"
                >
                  <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center">
                    <Icon size={24} color="#d4a954" strokeWidth={1.5} />
                  </View>
                  <Text className="flex-1 text-base text-text-primary font-medium">
                    {tip.text}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Progress indicator */}
          <View className="flex-row justify-center gap-2 mt-10">
            <View className="w-8 h-1.5 rounded-full bg-primary/50" />
            <View className="w-8 h-1.5 rounded-full bg-primary/50" />
            <View className="w-8 h-1.5 rounded-full bg-primary/50" />
            <View className="w-8 h-1.5 rounded-full bg-primary" />
          </View>
        </View>

        {/* Footer */}
        <View className="px-6 pb-8">
          <Pressable
            className="rounded-2xl overflow-hidden active:opacity-90 active:scale-[0.98]"
            onPress={handleStart}
          >
            <LinearGradient
              colors={['#d4a954', '#b8923f']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-16 flex-row items-center justify-center gap-3"
            >
              <Text className="text-xl font-bold text-background-dark tracking-wide">
                Begin Your Practice
              </Text>
              <ArrowRight size={24} color="#0A0E1A" strokeWidth={2.5} />
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
