import { View, Text, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useEffect, useRef, useState, useCallback } from 'react';
import * as Haptics from 'expo-haptics';

interface ActiveSessionProps {
  exerciseName: string;
  totalDuration: number; // in seconds
  onClose: () => void;
  onComplete: () => void;
  prompt?: string;
}

export function ActiveSession({
  exerciseName,
  totalDuration,
  onClose,
  onComplete,
  prompt = "Breathe in the golden light...",
}: ActiveSessionProps) {
  const [elapsed, setElapsed] = useState(0);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const waveAnims = useRef([...Array(10)].map(() => new Animated.Value(0.5))).current;
  const breathPhase = useRef<'inhale' | 'exhale'>('inhale');

  // Float animation for orb
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [floatAnim]);

  // Wave animation for audio visualization
  useEffect(() => {
    const animations = waveAnims.map((anim, i) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 0.3 + Math.random() * 0.7,
            duration: 300 + Math.random() * 400,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0.5 + Math.random() * 0.3,
            duration: 300 + Math.random() * 400,
            useNativeDriver: false,
          }),
        ])
      );
    });

    animations.forEach((anim) => anim.start());
    return () => animations.forEach((anim) => anim.stop());
  }, [waveAnims]);

  // Breathing rhythm haptics (every 4 seconds - inhale/exhale cycle)
  useEffect(() => {
    const hapticInterval = setInterval(() => {
      if (breathPhase.current === 'inhale') {
        // Light tap for inhale
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        breathPhase.current = 'exhale';
      } else {
        // Softer tap for exhale
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        breathPhase.current = 'inhale';
      }
    }, 4000);

    // Initial haptic
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    return () => clearInterval(hapticInterval);
  }, []);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= totalDuration) {
          clearInterval(interval);
          onComplete();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [totalDuration, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (elapsed / totalDuration) * 100;

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  const baseHeights = [20, 32, 48, 64, 40, 40, 64, 48, 32, 20];

  return (
    <View className="flex-1 bg-background-dark relative overflow-hidden">
      {/* Background glow effects */}
      <View className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[120vw] rounded-full bg-primary/10 opacity-60" />
      <View className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-3xl" />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-2">
          <Pressable
            className="w-14 h-14 rounded-full bg-white/10 items-center justify-center border border-white/10 active:opacity-70"
            onPress={handleClose}
          >
            <X size={32} color="#F0F4F8" />
          </Pressable>

          <View className="flex-row items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
            <Animated.View
              className="w-2 h-2 rounded-full bg-red-500"
              style={{
                opacity: floatAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0.5, 1],
                }),
              }}
            />
            <Text className="text-xs font-bold tracking-widest text-white/80 uppercase">
              Live
            </Text>
          </View>
        </View>

        {/* Main Orb */}
        <View className="flex-1 items-center justify-center pb-16">
          <Animated.View
            style={{ transform: [{ translateY: floatTranslate }] }}
            className="w-80 h-80 items-center justify-center"
          >
            {/* Outer glow */}
            <View className="absolute w-80 h-80 rounded-full bg-primary/15" />

            {/* Main orb */}
            <View className="w-72 h-72 rounded-full bg-primary/15 border border-primary/30 items-center justify-center">
              {/* Inner rings */}
              <View className="absolute w-64 h-64 rounded-full border border-primary/20" />
              <View className="absolute w-48 h-48 rounded-full border border-primary/10" />

              {/* Waveform + Timer */}
              <View className="flex-row items-center gap-1.5">
                {/* Left wave bars */}
                {waveAnims.slice(0, 5).map((anim, i) => (
                  <Animated.View
                    key={`left-${i}`}
                    className="w-1.5 rounded-full bg-primary/80"
                    style={{
                      height: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [baseHeights[i] * 0.3, baseHeights[i]],
                      }),
                    }}
                  />
                ))}

                {/* Timer */}
                <View className="items-center mx-4">
                  <Text className="text-7xl font-light text-text-primary tracking-tighter">
                    {formatTime(elapsed)}
                  </Text>
                  <Text className="text-2xl font-medium text-primary mt-1 tracking-wide">
                    / {formatTime(totalDuration)}
                  </Text>
                </View>

                {/* Right wave bars */}
                {waveAnims.slice(5, 10).map((anim, i) => (
                  <Animated.View
                    key={`right-${i}`}
                    className="w-1.5 rounded-full bg-primary/80"
                    style={{
                      height: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [baseHeights[i + 5] * 0.3, baseHeights[i + 5]],
                      }),
                    }}
                  />
                ))}
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Footer */}
        <View className="px-8 pb-12 items-center gap-5">
          <Text className="text-3xl font-semibold text-text-primary tracking-wide text-center">
            {exerciseName}
          </Text>

          {/* Progress bar */}
          <View className="w-full h-2 rounded-full bg-white/10 overflow-hidden border border-white/5">
            <Animated.View
              className="h-full rounded-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </View>

          {/* Prompt */}
          <Text className="text-xl font-light text-primary-light italic text-center opacity-90">
            "{prompt}"
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
