import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#d4a954',
  primaryLight: '#f3dfa2',
  background: '#0A0E1A',
  textPrimary: '#F0F4F8',
  textSecondary: '#8A9BB5',
};

interface ActiveSessionProps {
  exerciseName: string;
  totalDuration: number; // in seconds
  onClose: () => void;
  onComplete: () => void;
  prompt?: string;
}

// Audio waveform bar component
function WaveBar({ delay, baseHeight }: { delay: number; baseHeight: number }) {
  const animValue = useSharedValue(0.5);

  useEffect(() => {
    animValue.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(Math.random() * 0.5 + 0.5, {
            duration: 400 + Math.random() * 300,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(Math.random() * 0.3 + 0.3, {
            duration: 400 + Math.random() * 300,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      )
    );
  }, [animValue, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: interpolate(animValue.value, [0, 1], [baseHeight * 0.3, baseHeight]),
    opacity: interpolate(animValue.value, [0, 1], [0.6, 1]),
  }));

  return (
    <Animated.View style={[styles.waveBar, animatedStyle]} />
  );
}

export function ActiveSession({
  exerciseName,
  totalDuration,
  onClose,
  onComplete,
  prompt = 'Breathe in the golden light...',
}: ActiveSessionProps) {
  const elapsed = useSharedValue(0);
  const floatAnim = useSharedValue(0);
  const liveOpacity = useSharedValue(1);
  const promptOpacity = useSharedValue(0.9);

  // Float animation for orb
  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Live indicator pulse
    liveOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );

    // Prompt pulse
    promptOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000 }),
        withTiming(0.9, { duration: 2000 })
      ),
      -1,
      false
    );
  }, [floatAnim, liveOpacity, promptOpacity]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const newElapsed = elapsed.value + 1;
      elapsed.value = newElapsed;

      if (newElapsed >= totalDuration) {
        clearInterval(interval);
        onComplete();
      }
    }, 1000);

    // Breathing rhythm haptics
    const hapticInterval = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 4000);

    // Initial haptic
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    return () => {
      clearInterval(interval);
      clearInterval(hapticInterval);
    };
  }, [totalDuration, onComplete, elapsed]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(floatAnim.value, [0, 1], [0, -10]) }],
  }));

  const liveStyle = useAnimatedStyle(() => ({
    opacity: liveOpacity.value,
  }));

  const promptStyle = useAnimatedStyle(() => ({
    opacity: promptOpacity.value,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${(elapsed.value / totalDuration) * 100}%`,
  }));

  const timerStyle = useAnimatedStyle(() => {
    const mins = Math.floor(elapsed.value / 60);
    const secs = Math.floor(elapsed.value % 60);
    return {};
  });

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Wave bar heights (symmetric)
  const waveHeights = [20, 32, 48, 64, 40, 40, 64, 48, 32, 20];

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#1a1408', '#0f0a04', '#050302']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Background glow effects */}
      <View style={styles.bgGlow1} />
      <View style={styles.bgGlow2} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <X size={32} color={COLORS.textPrimary} />
          </Pressable>

          <View style={styles.liveBadge}>
            <Animated.View style={[styles.liveDot, liveStyle]} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* Main Orb Section */}
        <View style={styles.orbSection}>
          <Animated.View style={[styles.orbContainer, floatStyle]}>
            {/* Outer glow */}
            <View style={styles.orbGlow} />

            {/* Main orb */}
            <View style={styles.orb}>
              {/* Inner rings */}
              <View style={styles.orbRing1} />
              <View style={styles.orbRing2} />

              {/* Waveform + Timer */}
              <View style={styles.waveformContainer}>
                {/* Left wave bars */}
                {waveHeights.slice(0, 5).map((height, i) => (
                  <WaveBar key={`left-${i}`} delay={i * 100} baseHeight={height} />
                ))}

                {/* Timer */}
                <TimerDisplay elapsed={elapsed} totalDuration={totalDuration} />

                {/* Right wave bars (reversed) */}
                {waveHeights.slice(5).map((height, i) => (
                  <WaveBar key={`right-${i}`} delay={(5 + i) * 100} baseHeight={height} />
                ))}
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.exerciseName}>{exerciseName}</Text>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>

          {/* Prompt text */}
          <Animated.Text style={[styles.promptText, promptStyle]}>
            "{prompt}"
          </Animated.Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

// Separate timer component to handle animated value display
function TimerDisplay({
  elapsed,
  totalDuration,
}: {
  elapsed: Animated.SharedValue<number>;
  totalDuration: number;
}) {
  const [displayTime, setDisplayTime] = useState('0:00');

  useEffect(() => {
    const interval = setInterval(() => {
      const mins = Math.floor(elapsed.value / 60);
      const secs = Math.floor(elapsed.value % 60);
      setDisplayTime(`${mins}:${secs.toString().padStart(2, '0')}`);
    }, 100);
    return () => clearInterval(interval);
  }, [elapsed]);

  const formatTotal = () => {
    const mins = Math.floor(totalDuration / 60);
    const secs = totalDuration % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{displayTime}</Text>
      <Text style={styles.timerTotal}>/ {formatTotal()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050302',
  },
  safeArea: {
    flex: 1,
  },
  bgGlow1: {
    position: 'absolute',
    top: '25%',
    left: '50%',
    transform: [{ translateX: -SCREEN_WIDTH * 0.6 }],
    width: SCREEN_WIDTH * 1.2,
    height: SCREEN_WIDTH * 1.2,
    borderRadius: SCREEN_WIDTH * 0.6,
    backgroundColor: '#3d2a0a',
    opacity: 0.4,
  },
  bgGlow2: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: [{ translateX: -SCREEN_WIDTH * 0.3 }],
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    borderRadius: SCREEN_WIDTH * 0.3,
    backgroundColor: '#5c4010',
    opacity: 0.3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  closeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  liveText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  orbSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 64,
  },
  orbContainer: {
    width: 320,
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: `${COLORS.primary}26`,
  },
  orb: {
    width: 288,
    height: 288,
    borderRadius: 144,
    backgroundColor: `${COLORS.primary}26`,
    borderWidth: 1,
    borderColor: `${COLORS.primary}4D`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbRing1: {
    position: 'absolute',
    width: 256,
    height: 256,
    borderRadius: 128,
    borderWidth: 1,
    borderColor: `${COLORS.primary}33`,
  },
  orbRing2: {
    position: 'absolute',
    width: 192,
    height: 192,
    borderRadius: 96,
    borderWidth: 1,
    borderColor: `${COLORS.primary}1A`,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  waveBar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: `${COLORS.primary}CC`,
  },
  timerContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  timerText: {
    fontSize: 72,
    fontWeight: '200',
    color: COLORS.textPrimary,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
    textShadowColor: `${COLORS.primary}99`,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
  },
  timerTotal: {
    fontSize: 24,
    fontWeight: '500',
    color: COLORS.primary,
    marginTop: 8,
    letterSpacing: 1,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    alignItems: 'center',
    gap: 20,
  },
  exerciseName: {
    fontSize: 32,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: 1,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  promptText: {
    fontSize: 20,
    fontWeight: '300',
    color: COLORS.primaryLight,
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: '90%',
    lineHeight: 28,
  },
});
