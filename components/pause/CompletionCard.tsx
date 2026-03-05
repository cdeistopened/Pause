import { View, Text, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';
import { useEffect, useRef, useCallback } from 'react';
import * as Haptics from 'expo-haptics';

interface CompletionCardProps {
  onDone: () => void;
  onAddIntention: () => void;
}

const GOLD = '#d4a954';

export function CompletionCard({ onDone, onAddIntention }: CompletionCardProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
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

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.2,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
    glowAnimation.start();

    return () => {
      pulseAnimation.stop();
      glowAnimation.stop();
    };
  }, [pulseAnim, glowAnim]);

  const handleDone = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDone();
  }, [onDone]);

  const handleAddIntention = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddIntention();
  }, [onAddIntention]);

  return (
    <View className="flex-1" style={{ backgroundColor: '#050302' }}>
      <LinearGradient
        colors={['#1a1408', '#0a0805', '#050302']}
        locations={[0, 0.4, 1]}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center px-8">
          <View className="relative items-center justify-center mb-12">
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
                opacity: glowAnim,
              }}
              className="absolute w-32 h-32 rounded-full"
              pointerEvents="none"
            >
              <View className="w-full h-full rounded-full" style={{ backgroundColor: GOLD }} />
            </Animated.View>

            <View
              className="w-24 h-24 rounded-full items-center justify-center"
              style={{
                backgroundColor: 'rgba(212, 169, 84, 0.15)',
                borderWidth: 2,
                borderColor: 'rgba(212, 169, 84, 0.4)',
              }}
            >
              <Check size={48} color={GOLD} strokeWidth={3} />
            </View>
          </View>

          <Text className="text-white text-3xl font-bold tracking-tight text-center mb-16">
            Pause complete
          </Text>

          <View className="w-full gap-4">
            <Pressable
              className="w-full rounded-full overflow-hidden active:scale-[0.98]"
              onPress={handleDone}
              style={{
                shadowColor: GOLD,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
                elevation: 8,
              }}
            >
              <LinearGradient
                colors={['#d4a954', '#b8923f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-14 items-center justify-center"
              >
                <Text className="text-lg font-bold tracking-wide" style={{ color: '#0a0805' }}>
                  Done
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              className="w-full h-14 rounded-full items-center justify-center active:opacity-70"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
              onPress={handleAddIntention}
            >
              <Text className="text-base font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Add intention
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
