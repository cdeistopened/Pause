import { View, Text, TextInput, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, ArrowRight } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';

interface IntentionScreenProps {
  onComplete: (intention: string) => void;
  onSkip: () => void;
}

export function IntentionScreen({ onComplete, onSkip }: IntentionScreenProps) {
  const [intention, setIntention] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    // Pulsing glow animation
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
  }, []);

  return (
    <View className="flex-1 bg-background-dark">
      {/* Background */}
      <LinearGradient
        colors={['#1a2a3a', '#0A0E1A', '#0A0E1A']}
        locations={[0, 0.4, 1]}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-between px-6 pt-16 pb-8">
          {/* Success Icon */}
          <View className="flex-1 items-center justify-center">
            <View className="relative items-center justify-center mb-10">
              {/* Glow */}
              <Animated.View
                style={{
                  transform: [{ scale: pulseAnim }],
                  opacity: glowAnim,
                }}
                className="absolute w-32 h-32 rounded-full bg-primary blur-2xl"
              />

              {/* Check circle */}
              <View
                className="w-24 h-24 rounded-full border-[3px] border-primary/40 bg-background-dark/50 items-center justify-center"
                style={{
                  shadowColor: '#d4a954',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.25,
                  shadowRadius: 25,
                  elevation: 10,
                }}
              >
                <Check size={48} color="#d4a954" strokeWidth={3} />
              </View>
            </View>

            <Text className="text-text-primary text-4xl font-bold tracking-tight text-center mb-3">
              Pause complete
            </Text>
          </View>

          {/* Intention Input */}
          <View className="w-full mb-auto">
            <Text className="text-gray-300 text-xl font-medium text-center mb-6 leading-relaxed">
              What will you carry forward?
            </Text>

            <TextInput
              className="w-full bg-surface-dark text-text-primary rounded-3xl border border-white/10 text-xl px-6 py-5"
              placeholder="Type your intention..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={intention}
              onChangeText={setIntention}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              autoFocus
              style={{
                minHeight: 100,
                shadowColor: '#d4a954',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: intention ? 0.15 : 0,
                shadowRadius: 25,
              }}
            />
          </View>

          {/* Actions */}
          <View className="w-full items-center gap-6 mt-8">
            <Pressable
              className="w-full rounded-full overflow-hidden active:scale-[0.98]"
              onPress={() => onComplete(intention)}
              style={{
                shadowColor: '#d4a954',
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
                className="h-[60px] items-center justify-center"
              >
                <Text className="text-background-dark text-lg font-extrabold tracking-wide uppercase">
                  Done
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              className="flex-row items-center gap-2 py-2"
              onPress={onSkip}
            >
              <Text className="text-primary/90 text-base font-semibold">
                Skip
              </Text>
              <ArrowRight size={18} color="#d4a954" strokeWidth={2} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
