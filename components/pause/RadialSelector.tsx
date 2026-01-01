import { View, Text, Pressable, Dimensions } from 'react-native';
import { Wind, Sun, Hash, MessageCircle, Smile } from 'lucide-react-native';
import { EXERCISE_CATEGORIES, ExerciseCategoryId, ExerciseIconId } from '@/constants/exercises';
import Svg, { Circle } from 'react-native-svg';

interface RadialSelectorProps {
  selected: ExerciseCategoryId;
  onSelect: (id: ExerciseCategoryId) => void;
  orbSize?: number;
}

const ICONS: Record<ExerciseIconId, typeof Wind> = {
  wind: Wind,
  sun: Sun,
  hash: Hash,
  'message-circle': MessageCircle,
  smile: Smile,
};

const GOLD = '#d4a954';
const GOLD_LIGHT = '#e8c87e';

export function RadialSelector({ selected, onSelect, orbSize = 180 }: RadialSelectorProps) {
  // Calculate dimensions
  const radius = orbSize * 0.85; // Distance from center to exercise items
  const itemSize = 48; // Size of each exercise button
  const containerSize = orbSize + radius * 2 + itemSize;

  // Convert angle to x,y position
  // Angle 0 = top, goes clockwise
  const getPosition = (angleDeg: number) => {
    // Convert to radians, subtract 90 to start from top
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    const x = Math.cos(angleRad) * radius;
    const y = Math.sin(angleRad) * radius;
    return { x, y };
  };

  return (
    <View
      style={{
        width: containerSize,
        height: containerSize,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Dashed circle ring */}
      <Svg
        width={orbSize + radius * 2 - 20}
        height={orbSize + radius * 2 - 20}
        style={{ position: 'absolute' }}
      >
        <Circle
          cx={(orbSize + radius * 2 - 20) / 2}
          cy={(orbSize + radius * 2 - 20) / 2}
          r={radius - 10}
          stroke={GOLD}
          strokeWidth={1}
          strokeDasharray="8 8"
          fill="none"
          opacity={0.3}
        />
      </Svg>

      {/* Exercise items positioned radially */}
      {EXERCISE_CATEGORIES.map((category) => {
        const isSelected = selected === category.id;
        const IconComponent = ICONS[category.iconId];
        const { x, y } = getPosition(category.angle);

        return (
          <Pressable
            key={category.id}
            onPress={() => onSelect(category.id as ExerciseCategoryId)}
            style={{
              position: 'absolute',
              transform: [
                { translateX: x },
                { translateY: y },
              ],
              alignItems: 'center',
            }}
          >
            {/* Exercise button */}
            <View
              style={{
                width: itemSize,
                height: itemSize,
                borderRadius: itemSize / 2,
                backgroundColor: isSelected ? 'rgba(212, 169, 84, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                borderWidth: 1.5,
                borderColor: isSelected ? GOLD : 'rgba(255, 255, 255, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: isSelected ? GOLD : 'transparent',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: isSelected ? 0.5 : 0,
                shadowRadius: 12,
              }}
            >
              <IconComponent
                size={20}
                color={isSelected ? GOLD : '#8A9BB5'}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />
            </View>

            {/* Label */}
            <Text
              style={{
                marginTop: 6,
                fontSize: 11,
                fontWeight: isSelected ? '600' : '500',
                color: isSelected ? GOLD_LIGHT : 'rgba(138, 155, 181, 0.6)',
                textTransform: 'capitalize',
              }}
            >
              {category.shortName}
            </Text>

            {/* Golden dot indicator for selected */}
            {isSelected && (
              <View
                style={{
                  position: 'absolute',
                  top: -8,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: GOLD,
                  shadowColor: GOLD,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 6,
                }}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
