import { View, Pressable } from 'react-native';
import { Pause } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const GOLD = '#d4a954';
const GOLD_LIGHT = '#e8c87e';

interface GoldenOrbProps {
  size?: number;
  onPress?: () => void;
  onLongPress?: () => void;
  isActive?: boolean;
}

export function GoldenOrb({ size = 160, onPress, onLongPress, isActive = false }: GoldenOrbProps) {
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  // Derived sizes based on main orb size
  const glowSize = size * 1.4;
  const middleGlowSize = size * 1.2;
  const innerSize = size * 0.82;
  const highlightWidth = size * 0.36;
  const highlightHeight = size * 0.22;

  useEffect(() => {
    // Breathing animation: scale 1.0 → 1.08 (per Stitch design)
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: glowOpacity.value,
  }));

  return (
    <View
      style={{
        width: glowSize,
        height: glowSize,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Outer glow ring */}
      <Animated.View
        style={[
          animatedGlowStyle,
          {
            position: 'absolute',
            width: glowSize,
            height: glowSize,
            borderRadius: glowSize / 2,
            backgroundColor: 'rgba(212, 169, 84, 0.25)',
          },
        ]}
      />

      {/* Middle glow */}
      <View
        style={{
          position: 'absolute',
          width: middleGlowSize,
          height: middleGlowSize,
          borderRadius: middleGlowSize / 2,
          backgroundColor: 'rgba(212, 169, 84, 0.15)',
        }}
      />

      {/* Main orb */}
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={300}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: GOLD,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: GOLD,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.7,
          shadowRadius: 35,
          elevation: 20,
        }}
      >
        {/* Inner lighter area */}
        <View
          style={{
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: GOLD_LIGHT,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Highlight reflection */}
          <View
            style={{
              position: 'absolute',
              top: size * 0.09,
              left: size * 0.14,
              width: highlightWidth,
              height: highlightHeight,
              borderRadius: highlightHeight / 2,
              backgroundColor: 'rgba(255, 255, 255, 0.35)',
              transform: [{ rotate: '-30deg' }],
            }}
          />
          {/* Pause icon */}
          <Pause size={size * 0.2} color="rgba(10, 14, 26, 0.4)" strokeWidth={2.5} />
        </View>
      </Pressable>
    </View>
  );
}
