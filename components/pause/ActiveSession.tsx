import { View, Text, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';

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

  return (
    <View className="flex-1 bg-background-dark relative overflow-hidden">
      {/* Background glow effects */}
      <View className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[120vw] rounded-full bg-primary/10 opacity-60" />
      <View className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-3xl" />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-2">
          <Pressable
            className="w-14 h-14 rounded-full bg-white/10 items-center justify-center border border-white/10"
            onPress={onClose}
          >
            <X size={32} color="#F0F4F8" />
          </Pressable>

          <View className="flex-row items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
            <View className="w-2 h-2 rounded-full bg-red-500" />
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
                {[20, 32, 48, 64, 40].map((h, i) => (
                  <View
                    key={`left-${i}`}
                    className="w-1.5 rounded-full bg-primary/80"
                    style={{ height: h * (0.5 + Math.sin(Date.now() / 500 + i) * 0.25) }}
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
                {[40, 64, 48, 32, 20].map((h, i) => (
                  <View
                    key={`right-${i}`}
                    className="w-1.5 rounded-full bg-primary/80"
                    style={{ height: h * (0.5 + Math.sin(Date.now() / 500 + i + 5) * 0.25) }}
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
            <View
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
