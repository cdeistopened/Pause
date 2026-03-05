import { View, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const GOLD = '#d4a954';
const GOLD_LIGHT = '#f3d08c';

interface GoldenOrbProps {
  size?: number;
  onPress?: () => void;
  onLongPress?: () => void;
  isActive?: boolean;
}

export function GoldenOrb({ size = 192, onPress, onLongPress, isActive = false }: GoldenOrbProps) {
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.4);

  // Derived sizes
  const outerGlowSize = size * 1.67; // 320px for 192px orb
  const innerGlowSize = size * 1.25;

  useEffect(() => {
    // Breathing animation: scale 1.0 → 1.05
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Glow opacity animation
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [pulseScale, glowOpacity]);

  const animatedOrbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={[styles.container, { width: outerGlowSize, height: outerGlowSize }]}>
      {/* Large outer glow - blurred radial gradient effect */}
      <Animated.View
        style={[
          styles.outerGlow,
          animatedGlowStyle,
          { width: outerGlowSize, height: outerGlowSize, borderRadius: outerGlowSize / 2 },
        ]}
      />

      {/* Inner glow ring */}
      <View
        style={[
          styles.innerGlow,
          { width: innerGlowSize, height: innerGlowSize, borderRadius: innerGlowSize / 2 },
        ]}
      />

      {/* Main orb with gradient */}
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={300}
        style={({ pressed }) => [
          styles.orb,
          { width: size, height: size, borderRadius: size / 2 },
          pressed && styles.orbPressed,
        ]}
      >
        <Animated.View style={[styles.orbInner, animatedOrbStyle, { borderRadius: size / 2 }]}>
          <LinearGradient
            colors={[GOLD_LIGHT, GOLD, '#c49a4a']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={[styles.gradient, { borderRadius: size / 2 }]}
          />

          {/* Glossy overlay */}
          <View style={[styles.glossOverlay, { borderRadius: size / 2 }]} />

          {/* Top highlight */}
          <View
            style={[
              styles.highlight,
              {
                top: size * 0.12,
                left: size * 0.2,
                width: size * 0.35,
                height: size * 0.15,
                borderRadius: size * 0.075,
              },
            ]}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerGlow: {
    position: 'absolute',
    backgroundColor: GOLD,
    opacity: 0.4,
    // Using shadow for blur effect on iOS
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
  },
  innerGlow: {
    position: 'absolute',
    backgroundColor: `${GOLD}40`,
  },
  orb: {
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow glow
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  orbPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  orbInner: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  glossOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  highlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    transform: [{ rotate: '-15deg' }],
  },
});
