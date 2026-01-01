import { View, Text, Pressable } from 'react-native';
import { X, Clock } from 'lucide-react-native';
import { getContextualSuggestion } from '@/constants/exercises';

interface ContextualBannerProps {
  onDismiss: () => void;
  onPress: () => void;
}

export function ContextualBanner({ onDismiss, onPress }: ContextualBannerProps) {
  const { greeting, suggestion } = getContextualSuggestion();

  return (
    <Pressable
      className="flex-row items-start bg-surface-dark/80 rounded-2xl border border-white/10 p-4 mx-5 mt-3"
      onPress={onPress}
    >
      {/* Icon */}
      <View className="w-10 h-10 rounded-full bg-primary/15 items-center justify-center mr-3">
        <Clock size={20} color="#d4a954" strokeWidth={1.5} />
      </View>

      {/* Text */}
      <View className="flex-1 mr-2">
        <Text className="text-primary text-sm font-semibold mb-0.5">
          {greeting}
        </Text>
        <Text className="text-text-secondary text-[13px] leading-[18px]">
          {suggestion}
        </Text>
      </View>

      {/* Dismiss */}
      <Pressable
        className="p-1 -mr-1 -mt-1"
        onPress={onDismiss}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X size={18} color="#5A6B7D" />
      </Pressable>
    </Pressable>
  );
}
