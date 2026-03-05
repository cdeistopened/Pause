import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';

const GOLD = '#d4a954';
const PADDING = 4;

export interface SegmentOption {
  id: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  selected: string;
  onSelect: (id: string) => void;
}

export function SegmentedControl({ options, selected, onSelect }: SegmentedControlProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const selectedIndex = options.findIndex(o => o.id === selected);
  const indicatorX = useSharedValue(0);

  // Calculate segment width (accounting for padding on both sides)
  const segmentWidth = containerWidth > 0 ? (containerWidth - PADDING * 2) / options.length : 0;

  // Update indicator position when selection or layout changes
  useEffect(() => {
    if (segmentWidth > 0) {
      indicatorX.value = withTiming(selectedIndex * segmentWidth, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [selectedIndex, segmentWidth, indicatorX]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
    // Set initial position immediately without animation
    if (width > 0) {
      const sw = (width - PADDING * 2) / options.length;
      indicatorX.value = selectedIndex * sw;
    }
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: segmentWidth,
  }));

  const handleSelect = (id: string) => {
    Haptics.selectionAsync();
    onSelect(id);
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {/* Background indicator */}
      {containerWidth > 0 && (
        <Animated.View style={[styles.indicator, indicatorStyle]} />
      )}

      {/* Options */}
      {options.map((option) => {
        const isSelected = selected === option.id;
        return (
          <Pressable
            key={option.id}
            style={styles.option}
            onPress={() => handleSelect(option.id)}
          >
            <Text
              style={[
                styles.label,
                isSelected && styles.labelSelected,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: PADDING,
    position: 'relative',
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    top: PADDING,
    bottom: PADDING,
    left: PADDING,
    borderRadius: 20,
    backgroundColor: `${GOLD}33`, // 20% opacity gold
  },
  option: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  labelSelected: {
    color: GOLD,
    fontWeight: '600',
  },
});
